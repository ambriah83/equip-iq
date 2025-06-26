
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Brain, Shield, Eye, Database, Lock, Mail, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="border-slate-600 text-slate-200 hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold text-white">EquipIQ</span>
          </div>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-400" />
              Privacy Policy
            </CardTitle>
            <p className="text-slate-400">Last updated: December 26, 2024</p>
          </CardHeader>
          <CardContent className="space-y-6 text-slate-200">
            <section>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-400" />
                1. Information We Collect
              </h3>
              <p className="mb-2">We collect information you provide directly to us, such as when you:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Create an account or sign up for our services</li>
                <li>Use our AI-powered equipment management features</li>
                <li>Contact us for support or feedback</li>
                <li>Upload equipment data, photos, or documentation</li>
              </ul>
              <p className="mt-2">
                This may include your name, email address, company information, equipment data, and usage analytics.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-400" />
                2. How We Use Your Information
              </h3>
              <p className="mb-2">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Provide AI-powered insights and recommendations</li>
                <li>Monitor and analyze trends and usage</li>
                <li>Detect, investigate, and prevent fraudulent transactions</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-400" />
                3. Information Sharing and Disclosure
              </h3>
              <p className="mb-2">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following cases:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights, property, or safety</li>
                <li>With trusted service providers who assist in operating our platform</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-400" />
                4. Data Security
              </h3>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. This includes encryption, secure data storage, and regular security assessments.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">5. Data Retention</h3>
              <p>
                We retain your personal information for as long as necessary to provide you with our services and as described in this Privacy Policy. 
                We may also retain and use this information to comply with our legal obligations, resolve disputes, and enforce our agreements.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">6. Your Rights</h3>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access, update, or delete your personal information</li>
                <li>Restrict or object to certain processing of your data</li>
                <li>Data portability in certain circumstances</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">7. Cookies and Tracking</h3>
              <p>
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. 
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">8. Children's Privacy</h3>
              <p>
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">9. Changes to This Privacy Policy</h3>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
                and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-400" />
                10. Contact Us
              </h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                <span className="text-blue-400">privacy@equipiq.com</span>
                <br />
                <span className="text-blue-400">support@equipiq.com</span>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
