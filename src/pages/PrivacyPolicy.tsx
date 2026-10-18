import { PageShell } from '@/components/layout/PageShell';

const PrivacyPolicy = () => (
  <PageShell width="reading">
    <header className="border-b border-border pb-6">
      <h1 className="text-4xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated August 5, 2025</p>
    </header>
    <div className="prose-doc mt-2">
      <section>
                <h2>1. Introduction</h2>
                <p>
                  At Experiential ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
                </p>
              </section>

              <section>
                <h2>2. Information We Collect</h2>
                
                <h3>Personal Information You Provide</h3>
                <ul>
                  <li>Name, email address, and contact information</li>
                  <li>Date of birth and age (for volunteers)</li>
                  <li>Profile information and preferences</li>
                  <li>Organization details (for organizations)</li>
                  <li>Volunteer hours and experience tracking</li>
                  <li>Resume and career information</li>
                </ul>

                <h3>Information Collected Automatically</h3>
                <ul>
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, features used, time spent)</li>
                  <li>Location information (if you consent)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2>3. How We Use Your Information</h2>
                <p>
                  We use the information we collect to:
                </p>
                <ul>
                  <li>Provide and maintain our services</li>
                  <li>Match volunteers with appropriate opportunities</li>
                  <li>Enable communication between users and organizations</li>
                  <li>Track and verify volunteer hours and experiences</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Send important notifications and updates</li>
                  <li>Provide customer support</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2>4. How We Share Your Information</h2>
                <p>
                  We may share your information in the following circumstances:
                </p>
                
                <h3>With Organizations</h3>
                <p>
                  When you apply for volunteer opportunities, we share relevant profile information with the organization to facilitate the matching process.
                </p>

                <h3>With Service Providers</h3>
                <p>
                  We may share information with third-party service providers who help us operate our platform, process payments, or provide analytics.
                </p>

                <h3>For Legal Reasons</h3>
                <p>
                  We may disclose information if required by law, court order, or to protect our rights, property, or safety.
                </p>
              </section>

              <section>
                <h2>5. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
                </p>
              </section>

              <section>
                <h2>6. Your Rights and Choices</h2>
                <p>
                  You have the following rights regarding your personal information:
                </p>
                <ul>
                  <li>Access and review your personal information</li>
                  <li>Update or correct inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of certain communications</li>
                  <li>Request a copy of your data</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
              </section>

              <section>
                <h2>7. Cookies and Tracking Technologies</h2>
                <p>
                  We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie preferences through your browser settings, though this may affect some functionality.
                </p>
              </section>

              <section>
                <h2>8. Children's Privacy</h2>
                <p>
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              <section>
                <h2>9. International Data Transfers</h2>
                <p>
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers.
                </p>
              </section>

              <section>
                <h2>10. Data Retention</h2>
                <p>
                  We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When you delete your account, we will delete or anonymize your personal information within a reasonable timeframe.
                </p>
              </section>

              <section>
                <h2>11. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated Privacy Policy.
                </p>
              </section>

              <section>
                <h2>12. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="rounded-lg bg-muted/60 p-4">
                  <p>
                    <strong>Email:</strong> privacy@experiential.care<br />
                    <strong>Support:</strong> support@experiential.care<br />
                    <strong>Website:</strong> www.experiential.care
                  </p>
                </div>
              </section>
    </div>
  </PageShell>
);

export default PrivacyPolicy;
