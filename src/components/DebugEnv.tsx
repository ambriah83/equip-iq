import React from 'react';

const DebugEnv = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const hasKey = !!apiKey;
  const keyPreview = apiKey ? `${apiKey.substring(0, 10)}...` : 'Not found';
  
  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">Environment Debug:</h3>
      <p>API Key Loaded: {hasKey ? '✅ Yes' : '❌ No'}</p>
      <p>Key Preview: {keyPreview}</p>
      <p>Mode: {import.meta.env.MODE}</p>
      <p>Is Production: {import.meta.env.PROD ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default DebugEnv;