
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

const VendorChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: 'Hi! I can help you find vendors in your area with good reviews. What type of vendor are you looking for and what\'s your location?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: getBotResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputMessage('');
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('electrician')) {
      return 'Great! For electricians, I recommend looking for vendors with electrical licensing and experience with commercial equipment. Would you like me to help you create a checklist of questions to ask potential electricians?';
    } else if (input.includes('plumber')) {
      return 'For plumbing services, it\'s important to find someone with commercial experience and 24/7 availability. I can help you identify key qualifications to look for. What specific plumbing needs do you have?';
    } else if (input.includes('handyman')) {
      return 'Handymen are great for general maintenance! Look for someone with experience in commercial settings and good reviews for reliability. What type of maintenance work do you need help with?';
    } else if (input.includes('location') || input.includes('area')) {
      return 'To find vendors in your area, I recommend checking local business directories, Better Business Bureau ratings, and asking for references from other businesses. What\'s your general location?';
    } else if (input.includes('reviews') || input.includes('rating')) {
      return 'When checking reviews, look for: consistent quality ratings, response time, professionalism, and experience with similar businesses. I can help you create a vendor evaluation form!';
    } else {
      return 'I can help you find qualified vendors by type (electrician, plumber, handyman) and guide you through the evaluation process. What specific information would you like help with?';
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700"
          size="icon"
        >
          <MessageSquare size={24} />
        </Button>
        <Badge className="absolute -top-2 -left-2 bg-green-500">
          Ask about vendors
        </Badge>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot size={20} className="text-blue-600" />
              Vendor Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {msg.type === 'bot' && <Bot size={16} className="mt-1 flex-shrink-0" />}
                    {msg.type === 'user' && <User size={16} className="mt-1 flex-shrink-0" />}
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about vendors..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button size="sm" onClick={handleSendMessage}>
                <Send size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorChatbot;
