export const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'One capital letter' },
  { test: (p: string) => /[0-9]/.test(p), label: 'One number' },
];

export const isPasswordValid = (password: string) => PASSWORD_RULES.every((r) => r.test(password));
