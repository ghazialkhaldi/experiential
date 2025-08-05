import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card>
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
                  By accessing and using the Experiential platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Description of Service</h2>
                <p className="text-gray-700 leading-relaxed">
                  Experiential is a platform that connects volunteers with organizations seeking volunteer help. We also provide internship and career development opportunities for students and young professionals. The Service includes but is not limited to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  <li>Volunteer opportunity listings and matching</li>
                  <li>Organization profiles and management tools</li>
                  <li>Internship and career development resources</li>
                  <li>User profiles and tracking systems</li>
                  <li>Communication and coordination tools</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. User Accounts and Registration</h2>
                <p className="text-gray-700 leading-relaxed">
                  To access certain features of the Service, you must register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your information to keep it accurate and current</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. User Conduct</h2>
                <p className="text-gray-700 leading-relaxed">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
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
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Volunteer and Organization Responsibilities</h2>
                <h3 className="text-lg font-medium text-gray-800 mb-2">For Volunteers:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Commit to volunteer opportunities you sign up for</li>
                  <li>Communicate promptly with organizations about availability changes</li>
                  <li>Follow all safety guidelines and instructions provided by organizations</li>
                  <li>Maintain professional and respectful behavior</li>
                </ul>
                
                <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4">For Organizations:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Provide accurate descriptions of volunteer opportunities</li>
                  <li>Ensure safe working conditions for volunteers</li>
                  <li>Provide necessary training and supervision</li>
                  <li>Treat volunteers with respect and appreciation</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Privacy and Data Protection</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated by reference into these Terms. By using the Service, you consent to the collection and use of your information as outlined in our Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed">
                  The Service and its original content, features, and functionality are and will remain the exclusive property of Experiential and its licensors. The Service is protected by copyright, trademark, and other laws. You may not modify, distribute, or create derivative works of any part of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Disclaimer of Warranties</h2>
                <p className="text-gray-700 leading-relaxed">
                  The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or completely secure. Use of the Service is at your own risk.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">9. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  To the maximum extent permitted by law, Experiential shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">10. Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will cease immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">11. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the new Terms on the Service and updating the "Last updated" date. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">12. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">13. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <p className="text-gray-700">
                    <strong>Email:</strong> support@experiential.care<br />
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

export default TermsAndConditions;
