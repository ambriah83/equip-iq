
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Brain, Shield, Users, FileText, AlertTriangle, Scale } from 'lucide-react';

const TermsOfService = () => {
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
              <Scale className="h-6 w-6 text-blue-400" />
              Terms of Service
            </CardTitle>
            <p className="text-slate-400">Last updated: December 26, 2024</p>
          </CardHeader>
          <CardContent className="space-y-6 text-slate-200">
            <section>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                1. Acceptance of Terms
              </h3>
              <p>
                By accessing and using EquipIQ ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                2. Use License
              </h3>
              <p className="mb-2">
                Permission is granted to temporarily download one copy of EquipIQ per account for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained in EquipIQ</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                3. Privacy and Data Protection
              </h3>
              <p>
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. 
                By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-400" />
                4. Disclaimer
              </h3>
              <p>
                The materials in EquipIQ are provided on an 'as is' basis. EquipIQ makes no warranties, expressed or implied, 
                and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, 
                fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">5. Limitations</h3>
              <p>
                In no event shall EquipIQ or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, 
                or due to business interruption) arising out of the use or inability to use EquipIQ, even if EquipIQ or an authorized representative 
                has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">6. Accuracy of Materials</h3>
              <p>
                The materials appearing in EquipIQ could include technical, typographical, or photographic errors. 
                EquipIQ does not warrant that any of the materials on its service are accurate, complete, or current.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">7. Modifications</h3>
              <p>
                EquipIQ may revise these terms of service at any time without notice. By using this service, 
                you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">8. Contact Information</h3>
              <p>
                If you have any questions about these Terms of Service, please contact us at: 
                <br />
                <span className="text-blue-400">legal@equipiq.com</span>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
