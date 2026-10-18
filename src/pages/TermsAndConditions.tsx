import { PageShell } from '@/components/layout/PageShell';

const TermsAndConditions = () => (
  <PageShell width="reading">
    <header className="border-b border-border pb-6">
      <h1 className="text-4xl font-semibold">Terms and Conditions</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated August 5, 2025</p>
    </header>
    <div className="prose-doc mt-2">
      <section>
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing and using the Experiential platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2>2. Description of Service</h2>
                <p>
                  Experiential is a platform that connects volunteers with organizations seeking volunteer help. We also provide internship and career development opportunities for students and young professionals. The Service includes but is not limited to:
                </p>
                <ul>
                  <li>Volunteer opportunity listings and matching</li>
                  <li>Organization profiles and management tools</li>
                  <li>Internship and career development resources</li>
                  <li>User profiles and tracking systems</li>
                  <li>Communication and coordination tools</li>
                </ul>
              </section>

              <section>
                <h2>3. User Accounts and Registration</h2>
                <p>
                  To access certain features of the Service, you must register for an account. You agree to:
                </p>
                <ul>
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your information to keep it accurate and current</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section>
                <h2>4. User Conduct</h2>
                <p>
                  You agree not to use the Service to:
                </p>
                <ul>
                  <li>Post false, misleading, or fraudulent information</li>
                  <li>Engage in harassment, discrimination, or abusive behavior</li>
                  <li>Violate any local, state, national, or international law</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Attempt to gain unauthorized access to any part of the Service</li>
                  <li>Use the Service for commercial purposes without authorization</li>
                  <li>Spam other users or organizations</li>
                </ul>
              </section>

              <section>
                <h2>5. Volunteer and Organization Responsibilities</h2>
                <h3>For Volunteers:</h3>
                <ul>
                  <li>Commit to volunteer opportunities you sign up for</li>
                  <li>Communicate promptly with organizations about availability changes</li>
                  <li>Follow all safety guidelines and instructions provided by organizations</li>
                  <li>Maintain professional and respectful behavior</li>
                </ul>
                
                <h3>For Organizations:</h3>
                <ul>
                  <li>Provide accurate descriptions of volunteer opportunities</li>
                  <li>Ensure safe working conditions for volunteers</li>
                  <li>Provide necessary training and supervision</li>
                  <li>Treat volunteers with respect and appreciation</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              <section>
                <h2>6. Privacy and Data Protection</h2>
                <p>
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated by reference into these Terms. By using the Service, you consent to the collection and use of your information as outlined in our Privacy Policy.
                </p>
              </section>

              <section>
                <h2>7. Intellectual Property</h2>
                <p>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of Experiential and its licensors. The Service is protected by copyright, trademark, and other laws. You may not modify, distribute, or create derivative works of any part of the Service.
                </p>
              </section>

              <section>
                <h2>8. Disclaimer of Warranties</h2>
                <p>
                  The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or completely secure. Use of the Service is at your own risk.
                </p>
              </section>

              <section>
                <h2>9. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, Experiential shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of the Service.
                </p>
              </section>

              <section>
                <h2>10. Termination</h2>
                <p>
                  We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will cease immediately.
                </p>
              </section>

              <section>
                <h2>11. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the new Terms on the Service and updating the "Last updated" date. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2>12. Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.
                </p>
              </section>

              <section>
                <h2>13. Contact Information</h2>
                <p>
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <div className="rounded-lg bg-muted/60 p-4">
                  <p>
                    <strong>Email:</strong> support@experiential.care<br />
                    <strong>Website:</strong> www.experiential.care
                  </p>
                </div>
              </section>
    </div>
  </PageShell>
);

export default TermsAndConditions;
