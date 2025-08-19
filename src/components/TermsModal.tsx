import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMode } from "@/contexts/ModeContext";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const { isInternshipMode } = useMode();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`max-w-4xl max-h-[80vh] ${
        isInternshipMode ? 'bg-gray-800 border-purple-500/30' : ''
      }`}>
        <DialogHeader>
          <DialogTitle className={`text-2xl font-bold ${
            isInternshipMode ? 'text-white' : 'text-gray-900'
          }`}>
            Terms and Conditions
          </DialogTitle>
          <DialogDescription className={
            isInternshipMode ? 'text-gray-300' : 'text-gray-600'
          }>
            Please read our terms and conditions carefully.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className={`space-y-6 ${isInternshipMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <section>
              <h3 className={`text-lg font-semibold mb-2 ${
                isInternshipMode ? 'text-purple-200' : 'text-gray-800'
              }`}>
                1. Introduction
              </h3>
              <p className="text-sm leading-relaxed">
                Welcome to Experiential ("we", "our", or "us"). Experiential is an online platform that connects students with organizations offering educational, professional, or extracurricular opportunities. By accessing or using our website and services, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree, do not use the Service.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${
                isInternshipMode ? 'text-purple-200' : 'text-gray-800'
              }`}>
                2. Eligibility
              </h3>
              <p className="text-sm leading-relaxed">
                Anyone may use Experiential regardless of age. However, some opportunities listed on the platform may have their own eligibility requirements, which are set and enforced by the organizations posting them.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${
                isInternshipMode ? 'text-purple-200' : 'text-gray-800'
              }`}>
                3. Account Registration
              </h3>
              <p className="text-sm leading-relaxed">
                You may sign in using third-party services such as Google. By doing so, you authorize us to access certain information, including your name, email address, and profile data. You are responsible for all activity under your account and must ensure your information is accurate and kept up to date.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${
                isInternshipMode ? 'text-purple-200' : 'text-gray-800'
              }`}>
                4. Services and Subscriptions
              </h3>
              <p className="text-sm leading-relaxed">
                Experiential offers a premium monthly subscription for access to curated opportunities, advanced tools, and enhanced features. Subscriptions are billed monthly and automatically renew unless canceled.
              </p>
              <p className="text-sm leading-relaxed mt-2">
                <strong>Billing & Payment:</strong> All transactions are securely processed via Stripe.
              </p>
              <p className="text-sm leading-relaxed mt-2">
                <strong>Refund Policy:</strong> Subscription fees are non-refundable. You can cancel anytime before the next billing cycle.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${
                isInternshipMode ? 'text-purple-200' : 'text-gray-800'
              }`}>
                5. Data Collection & Use
              </h3>
              <p className="text-sm leading-relaxed">
                We collect personal and activity data to improve the service and tailor your experience, including:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Name, contact details, and profile information</li>
                <li>Login details from Google</li>
                <li>Location data (with user permission)</li>
                <li>Usage statistics and browsing behavior</li>
              </ul>
              <p className="text-sm leading-relaxed mt-2">
                Please see our Privacy Policy for full details.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${
                isInternshipMode ? 'text-purple-200' : 'text-gray-800'
              }`}>
                6. Location Tracking
              </h3>
              <p className="text-sm leading-relaxed">
                Experiential may request access to your location to better match you with nearby or relevant opportunities. This is optional and can be managed through your device settings.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${
                isInternshipMode ? 'text-purple-200' : 'text-gray-800'
              }`}>
                7. Third-Party Services
              </h3>
              <p className="text-sm leading-relaxed">
                Experiential uses services like Google (for authentication) and Stripe (for payments). You acknowledge and agree to their respective terms and privacy policies.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${
                isInternshipMode ? 'text-purple-200' : 'text-gray-800'
              }`}>
                8. User Conduct
              </h3>
              <p className="text-sm leading-relaxed">
                By using Experiential, you agree not to:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Use the platform for illegal or misleading activities</li>
                <li>Post or promote offensive, harmful, or discriminatory content</li>
                <li>Interfere with the platform's systems or other users</li>
                <li>Impersonate others or submit false information</li>
              </ul>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${
                isInternshipMode ? 'text-purple-200' : 'text-gray-800'
              }`}>
                9. Intellectual Property
              </h3>
              <p className="text-sm leading-relaxed">
                All content on Experiential, including branding, design, and software, is owned by Experiential or licensed to us. You may not reproduce or distribute our content without written permission.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${
                isInternshipMode ? 'text-purple-200' : 'text-gray-800'
              }`}>
                10. Termination
              </h3>
              <p className="text-sm leading-relaxed">
                We may suspend or terminate your account if you violate these Terms or engage in behavior that harms other users or the platform. You may delete your account at any time.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${
                isInternshipMode ? 'text-purple-200' : 'text-gray-800'
              }`}>
                11. Disclaimers
              </h3>
              <p className="text-sm leading-relaxed">
                Experiential provides access to opportunities but does not guarantee selection, outcomes, or the accuracy of content provided by external organizations. Use of the platform is at your own risk.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${
                isInternshipMode ? 'text-purple-200' : 'text-gray-800'
              }`}>
                12. Limitation of Liability
              </h3>
              <p className="text-sm leading-relaxed">
                Experiential is not liable for indirect or consequential damages arising from your use of the platform, including but not limited to lost opportunities or third-party interactions.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${
                isInternshipMode ? 'text-purple-200' : 'text-gray-800'
              }`}>
                13. Governing Law
              </h3>
              <p className="text-sm leading-relaxed">
                These Terms are governed by the laws of Canada. Legal disputes will be resolved in the courts of that jurisdiction.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${
                isInternshipMode ? 'text-purple-200' : 'text-gray-800'
              }`}>
                14. Changes to Terms
              </h3>
              <p className="text-sm leading-relaxed">
                We may update these Terms periodically. Changes will be posted on this page and take effect immediately upon posting. Continued use of the service implies acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${
                isInternshipMode ? 'text-purple-200' : 'text-gray-800'
              }`}>
                15. Contact Information
              </h3>
              <p className="text-sm leading-relaxed">
                For any questions or support, contact us at:
              </p>
              <div className="mt-2 space-y-1 text-sm">
                <p>📧 feedback@experiential.care</p>
                <p>🌐 experiential.care</p>
              </div>
            </section>
          </div>
        </ScrollArea>

        <div className="flex justify-end mt-4">
          <Button 
            onClick={() => onOpenChange(false)}
            className={isInternshipMode 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'bg-blue-600 hover:bg-blue-700'
            }
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;
