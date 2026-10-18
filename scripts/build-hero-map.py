"""Build a stylised Port Credit map module from OpenStreetMap extracts.

Usage: python3 -I build_map.py <data_dir> <out_ts>
Data (c) OpenStreetMap contributors, ODbL.
"""
import heapq
import json
import math
import os
import sys

DATA, OUT = sys.argv[1], sys.argv[2]

# Map plane bounds (degrees). The camera pans inside this plane.
W_LON, E_LON = -79.6080, -79.5620
S_LAT, N_LAT = 43.5385, 43.5665
PLANE_W = 1600.0


def merc_y(lat):
    return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


X0, X1 = math.radians(W_LON), math.radians(E_LON)
Y0, Y1 = merc_y(N_LAT), merc_y(S_LAT)
SCALE = PLANE_W / (X1 - X0)
PLANE_H = (Y0 - Y1) * SCALE


def project(lat, lon):
    return ((math.radians(lon) - X0) * SCALE, (Y0 - merc_y(lat)) * SCALE)


def load(name):
    with open(os.path.join(DATA, name + '.json')) as f:
        return json.load(f)['elements']


def simplify(pts, tol):
    """Douglas-Peucker."""
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    norm = math.hypot(dx, dy) or 1e-9
    idx, dmax = 0, 0.0
    for i in range(1, len(pts) - 1):
        x, y = pts[i]
        d = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / norm
        if d > dmax:
            idx, dmax = i, d
    if dmax > tol:
        return simplify(pts[: idx + 1], tol)[:-1] + simplify(pts[idx:], tol)
    return [pts[0], pts[-1]]


def fmt(pts, closed=False):
    if not pts:
        return ''
    s = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts)
    return s + (' Z' if closed else '')


def geom(e):
    return [project(p['lat'], p['lon']) for p in e.get('geometry', []) if p]


def in_plane(pts, margin=200):
    return any(-margin <= x <= PLANE_W + margin and -margin <= y <= PLANE_H + margin for x, y in pts)


# ---------------------------------------------------------------- lake
lake_ways = [e for e in load('lake') if len(e['geometry']) > 1]
segments = {}
for e in lake_ways:
    g = [(p['lat'], p['lon']) for p in e['geometry']]
    if g[0] == g[-1]:
        continue  # islands handled below
    segments[e['id']] = g

# Chain segments end to start, starting from the westernmost end.
start_id = min(segments, key=lambda k: min(segments[k][0][1], segments[k][-1][1]))
chain = list(segments.pop(start_id))
if chain[-1][1] < chain[0][1]:
    chain.reverse()
while segments:
    tail = chain[-1]
    best, rev = None, False
    for k, g in segments.items():
        if g[0] == tail:
            best, rev = k, False
            break
        if g[-1] == tail:
            best, rev = k, True
            break
    if best is None:
        break
    g = segments.pop(best)
    chain.extend((g[::-1] if rev else g)[1:])

shore = [project(*p) for p in chain]
# Close through the open lake to the south-east.
far = 3000
lake_poly = shore + [(PLANE_W + far, shore[-1][1]), (PLANE_W + far, PLANE_H + far), (-far, PLANE_H + far), (shore[0][0], PLANE_H + far)]
lake_d = fmt(simplify(shore, 0.6) + lake_poly[len(shore):], closed=True)

islands = [fmt(simplify(geom(e), 0.6), True) for e in lake_ways if e['geometry'][0] == e['geometry'][-1]]

# ---------------------------------------------------------------- water
water = load('water')
river_lines, ponds, piers = [], [], []
for e in water:
    t = e['tags']
    pts = geom(e)
    if not pts or not in_plane(pts):
        continue
    if t.get('waterway') == 'river':
        river_lines.append(fmt(simplify(pts, 0.8)))
    elif t.get('natural') == 'water':
        ponds.append(fmt(simplify(pts, 0.6), True))
    elif t.get('man_made') in ('pier', 'breakwater', 'groyne'):
        closed = e['geometry'][0] == e['geometry'][-1]
        piers.append((fmt(simplify(pts, 0.5), closed), closed))

# ---------------------------------------------------------------- green
green = load('green')
parks, woods = [], []
park_labels = []
for e in green:
    t = e['tags']
    if e['type'] == 'relation':
        rings = [m for m in e.get('members', []) if m.get('role') == 'outer' and m.get('geometry')]
        polys = [[project(p['lat'], p['lon']) for p in m['geometry']] for m in rings]
    else:
        polys = [geom(e)]
    for pts in polys:
        if len(pts) < 3 or not in_plane(pts):
            continue
        d = fmt(simplify(pts, 0.8), True)
        if t.get('natural') in ('wood', 'scrub') or t.get('landuse') == 'forest':
            woods.append(d)
        elif t.get('natural') == 'beach':
            woods.append(d)
        else:
            parks.append(d)
        if t.get('leisure') == 'park' and t.get('name'):
            xs = [p[0] for p in pts]
            ys = [p[1] for p in pts]
            cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
            area = abs(sum(pts[i][0] * pts[i - 1][1] - pts[i - 1][0] * pts[i][1] for i in range(len(pts)))) / 2
            park_labels.append((area, t['name'], cx, cy))

# ---------------------------------------------------------------- roads
roads = load('roads')
road_classes = {
    'motorway': 'major', 'trunk': 'major', 'primary': 'primary', 'secondary': 'primary',
    'tertiary': 'secondary', 'residential': 'minor', 'unclassified': 'minor', 'living_street': 'minor',
}
road_d = {k: [] for k in ('major', 'primary', 'secondary', 'minor')}
rail_d = []
graph = {}
node_xy = {}
street_names = {}
for e in roads:
    t = e['tags']
    pts = geom(e)
    if not pts or not in_plane(pts, 100):
        continue
    if t.get('railway') == 'rail':
        if t.get('service'):
            continue
        rail_d.append(fmt(simplify(pts, 0.6)))
        continue
    cls = road_classes.get(t.get('highway'))
    if not cls:
        continue
    road_d[cls].append(fmt(simplify(pts, 0.6)))
    if t.get('name') and cls in ('primary', 'secondary'):
        street_names.setdefault(t['name'], []).append(pts)
    if cls == 'major':
        continue  # the walker stays off the highway
    ids = e['nodes']
    for i, nid in enumerate(ids):
        node_xy[nid] = pts[i]
    for a, b in zip(ids, ids[1:]):
        (ax, ay), (bx, by) = node_xy[a], node_xy[b]
        w = math.hypot(bx - ax, by - ay)
        graph.setdefault(a, []).append((b, w))
        graph.setdefault(b, []).append((a, w))


def nearest_node(lat, lon):
    x, y = project(lat, lon)
    return min(node_xy, key=lambda n: (node_xy[n][0] - x) ** 2 + (node_xy[n][1] - y) ** 2)


def shortest(a, b):
    dist, prev, pq = {a: 0.0}, {}, [(0.0, a)]
    while pq:
        d, u = heapq.heappop(pq)
        if u == b:
            break
        if d > dist.get(u, 1e18):
            continue
        for v, w in graph.get(u, []):
            nd = d + w
            if nd < dist.get(v, 1e18):
                dist[v], prev[v] = nd, u
                heapq.heappush(pq, (nd, v))
    path = [b]
    while path[-1] != a:
        path.append(prev[path[-1]])
    return path[::-1]


# Walking loop through Port Credit village (lat, lon).
WAYPOINTS = [
    (43.55680, -79.58390),  # Park St E & Hurontario, by the GO station
    (43.55526, -79.58175),  # Hurontario & Lakeshore Rd
    (43.55700, -79.57880),  # east along Lakeshore Rd E
    (43.55241, -79.58295),  # Elizabeth St & Port St, toward the harbour
    (43.55017, -79.58728),  # Front St & Lakeshore Rd, over the Credit River
    (43.54950, -79.58612),  # Front St & Port St, toward Saddington Park
    (43.54804, -79.58960),  # Mississauga Rd & Lakeshore Rd W
    (43.55300, -79.59200),  # up Mississauga Rd
    (43.55680, -79.58390),  # back to the station
]
nodes = [nearest_node(*p) for p in WAYPOINTS]
route = []
for a, b in zip(nodes, nodes[1:]):
    seg = shortest(a, b)
    route.extend(seg if not route else seg[1:])
raw_route = [node_xy[n] for n in route]
route_pts = simplify(raw_route[:-1], 0.4) + [raw_route[0]]  # loop: simplify open, then close
route_len = sum(math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(route_pts, route_pts[1:]))
print(f'route length {route_len:.0f} units (~{route_len * 2.4:.0f} m), raw nodes {len(raw_route)}')
route_d = fmt(route_pts)

# ---------------------------------------------------------------- labels


def label_for(name, lines):
    cx, cy = PLANE_W / 2, PLANE_H / 2
    inside = [l for l in lines if math.hypot(l[-1][0] - l[0][0], l[-1][1] - l[0][1]) > 60] or lines
    best = min(inside, key=lambda p: math.hypot(p[len(p) // 2][0] - cx, p[len(p) // 2][1] - cy))
    mid = best[len(best) // 2]
    (ax, ay), (bx, by) = best[0], best[-1]
    ang = math.degrees(math.atan2(by - ay, bx - ax))
    if ang > 90:
        ang -= 180
    if ang < -90:
        ang += 180
    return {'text': name, 'x': round(mid[0], 1), 'y': round(mid[1], 1), 'angle': round(ang, 1)}


street_labels = [label_for(n, street_names[n]) for n in ('Lakeshore Road East', 'Lakeshore Road West', 'Hurontario Street', 'Mississauga Road South') if n in street_names]
park_labels.sort(reverse=True)
parks_named = []
seen = set()
for _, n, x, y in park_labels:
    if n in seen or not (60 < x < PLANE_W - 60 and 60 < y < PLANE_H - 60):
        continue
    seen.add(n)
    parks_named.append({'text': n, 'x': round(x, 1), 'y': round(y, 1)})
parks_named = parks_named[:7]


def xy(lat, lon):
    x, y = project(lat, lon)
    return {'x': round(x, 1), 'y': round(y, 1)}


out = {
    'width': round(PLANE_W, 1),
    'height': round(PLANE_H, 1),
    'lake': lake_d,
    'islands': islands,
    'rivers': river_lines,
    'ponds': ponds,
    'parks': parks,
    'woods': woods,
    'piers': [d for d, closed in piers if closed],
    'pierLines': [d for d, closed in piers if not closed],
    'roads': {k: ' '.join(v) for k, v in road_d.items()},
    'rail': ' '.join(rail_d),
    'route': route_d,
    'streetLabels': street_labels,
    'parkLabels': parks_named,
    'places': {
        'lakeOntario': xy(43.5420, -79.5720),
        'creditRiver': xy(43.5560, -79.5960),
        'portCredit': xy(43.5605, -79.5868),
        'library': xy(43.5558, -79.5807),
        'foodBank': xy(43.5574, -79.5852),
        'stLawrence': xy(43.5555, -79.5772),
        'saddington': xy(43.5462, -79.5836),
        'memorialPark': xy(43.5518, -79.5890),
        'mississaugaRd': xy(43.5532, -79.5928),
        'harbour': xy(43.5497, -79.5822),
    },
}

with open(OUT, 'w') as f:
    f.write('// Generated from OpenStreetMap data (c) OpenStreetMap contributors, ODbL.\n')
    f.write('// Port Credit, Mississauga. Rebuild with scripts/build-hero-map.py; do not edit by hand.\n')
    f.write('export const PORT_CREDIT = ')
    json.dump(out, f, separators=(',', ':'))
    f.write(' as const;\n')

size = os.path.getsize(OUT)
print(f'plane {PLANE_W:.0f}x{PLANE_H:.0f}, route pts {len(route_pts)}, parks {len(parks)}, woods {len(woods)}, file {size/1024:.1f} KB')
print('streets', [s['text'] for s in street_labels], 'parks', [p['text'] for p in parks_named])
