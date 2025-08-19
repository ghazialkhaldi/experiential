import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const LegalDocuments = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link to="/auth">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign Up
            </Button>
          </Link>
        </div>

        {/* Terms and Conditions Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800">
              Terms and Conditions
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Last updated: August 5, 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using Experiential ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Description of Service</h2>
                <p className="text-gray-700 leading-relaxed">
                  Experiential is a platform that connects volunteers with organizations seeking volunteer services. We facilitate connections between individuals looking to volunteer and organizations in need of volunteer support across various categories including education, environment, animal care, community service, and healthcare.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. User Conduct</h2>
                <p className="text-gray-700 leading-relaxed mb-2">You agree not to use the service to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable</li>
                  <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity</li>
                  <li>Upload, post, or transmit any content that you do not have a right to transmit under any law or under contractual or fiduciary relationships</li>
                  <li>Upload, post, or transmit any content that infringes any patent, trademark, trade secret, copyright, or other proprietary rights of any party</li>
                  <li>Upload, post, or transmit any unsolicited or unauthorized advertising, promotional materials, junk mail, spam, chain letters, pyramid schemes, or any other form of solicitation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. User Responsibilities</h2>
                <p className="text-gray-700 leading-relaxed">
                  Users are responsible for maintaining the confidentiality of their account information and password. You are responsible for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Intellectual Property Rights</h2>
                <p className="text-gray-700 leading-relaxed">
                  The content, organization, graphics, design, compilation, magnetic translation, digital conversion, and other matters related to the Platform are protected under applicable copyrights, trademarks, and other proprietary rights. Copying, redistribution, or publication of any such content is strictly prohibited without our express written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Disclaimers</h2>
                <p className="text-gray-700 leading-relaxed">
                  The information on this Platform is provided on an "as is" basis. To the fullest extent permitted by law, this Platform excludes all representations, warranties, conditions, and other terms which might otherwise be implied by statute, common law, or the law of equity.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  In no event shall Experiential be liable for any damages (including, without limitation, damages for loss of profits, business interruption, or loss of information) arising out of the use of or inability to use the materials on this Platform, even if we have been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">9. Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may terminate your access to the Platform at any time, without cause or notice, which may result in the destruction of all information associated with your account. All provisions of this agreement which by their nature should survive termination shall survive termination.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">10. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes through the Platform or via email. Your continued use of the Platform after such modifications constitutes acceptance of the updated terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">11. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Experiential operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">12. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <p className="text-gray-700">
                    <strong>Email:</strong> legal@experiential.care<br />
                    <strong>Support:</strong> support@experiential.care<br />
                    <strong>Website:</strong> www.experiential.care
                  </p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Policy Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800">
              Privacy Policy
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Last updated: August 5, 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed">
                  At Experiential ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Information We Collect</h2>
                
                <h3 className="text-lg font-medium text-gray-800 mb-2">Personal Information You Provide</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Name, email address, and contact information</li>
                  <li>Date of birth and age (for volunteers)</li>
                  <li>Profile information and preferences</li>
                  <li>Organization details (for organizations)</li>
                  <li>Volunteer hours and experience tracking</li>
                  <li>Resume and career information</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4">Information Collected Automatically</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, features used, time spent)</li>
                  <li>Location information (if you consent)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
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
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. How We Share Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                  We may share your information in the following circumstances:
                </p>
                
                <h3 className="text-lg font-medium text-gray-800 mb-2">With Organizations</h3>
                <p className="text-gray-700 leading-relaxed">
                  When you apply for volunteer opportunities, we share relevant profile information with the organization to facilitate the matching process.
                </p>

                <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4">With Service Providers</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may share information with third-party service providers who help us operate our platform, process payments, or provide analytics.
                </p>

                <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4">For Legal Reasons</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may disclose information if required by law, court order, or to protect our rights, property, or safety.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Data Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Your Rights and Choices</h2>
                <p className="text-gray-700 leading-relaxed mb-2">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Access and review your personal information</li>
                  <li>Update or correct inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of certain communications</li>
                  <li>Request a copy of your data</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie preferences through your browser settings, though this may affect some functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">9. International Data Transfers</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">10. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed">
                  We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When you delete your account, we will delete or anonymize your personal information within a reasonable timeframe.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">11. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">12. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <p className="text-gray-700">
                    <strong>Email:</strong> privacy@experiential.care<br />
                    <strong>Support:</strong> support@experiential.care<br />
                    <strong>Website:</strong> www.experiential.care
                  </p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalDocuments;
