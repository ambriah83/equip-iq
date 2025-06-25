
import React, { useState } from 'react';
import { MessageSquare, Send, Upload, Mic, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  image?: string;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI troubleshooting assistant. I can help you diagnose equipment issues, guide you through repairs, and escalate complex problems to our support team. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand you're experiencing an issue. Can you please tell me which location and equipment this relates to? If possible, please upload an image of the equipment or describe the specific problem you're seeing.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageMessage: Message = {
          id: Date.now().toString(),
          text: "Image uploaded for analysis",
          sender: 'user',
          timestamp: new Date(),
          image: e.target?.result as string,
        };
        setMessages(prev => [...prev, imageMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <MessageSquare size={24} />
          <div>
            <h2 className="text-xl font-bold">AI Troubleshooting Assistant</h2>
            <p className="text-blue-100">Get instant help with equipment issues</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-md p-4 ${
              message.sender === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border-slate-200'
            }`}>
              {message.image && (
                <img 
                  src={message.image} 
                  alt="Uploaded" 
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-2 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-slate-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </Card>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-md p-4 bg-white border-slate-200">
              <div className="flex items-center gap-2">
                <div className="animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-slate-500">AI is thinking...</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 p-6">
        <div className="flex gap-3 mb-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button variant="outline" size="sm" className="gap-2">
              <ImageIcon size={16} />
              Upload Image
            </Button>
          </label>
          <Button variant="outline" size="sm" className="gap-2">
            <Mic size={16} />
            Voice
          </Button>
        </div>
        
        <div className="flex gap-3">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe your issue or ask a question..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputText.trim() || isLoading}>
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
