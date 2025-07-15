import React from 'react';

const GeminiDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">ChatGPT EquipIQ Prototype</h1>
        <p className="text-gray-600 mb-6">
          The full prototype includes its own routing, authentication, and all features.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold">Access the Full Prototype:</h2>
          
          <div className="space-y-2">
            <p className="font-medium">Option 1: Open index.html directly</p>
            <code className="block bg-gray-100 p-2 rounded">
              file:///C:/Users/ambri/Projects/equip-iq/src/gemini-prototype/index.html
            </code>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">Option 2: Run standalone with Vite</p>
            <code className="block bg-gray-100 p-2 rounded">
              cd src/gemini-prototype && npx vite
            </code>
          </div>
          
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm">
              <strong>Note:</strong> The ChatGPT integration is already available in your main app 
              sidebar as "AI ChatGPT". The prototype shows the same features in a standalone demo.
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Prototype Features:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Landing page with sign in</li>
            <li>Dashboard with equipment stats</li>
            <li>Equipment management</li>
            <li>Location tracking</li>
            <li>Ticket system</li>
            <li>AI Chat with ChatGPT (GPT-4o-mini)</li>
            <li>Dark/Light theme toggle</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GeminiDemo;