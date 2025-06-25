import React, { useState } from 'react';
import { MessageSquare, Send, Upload, Mic, Image as ImageIcon, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  image?: string;
}

interface FeedbackData {
  id: string;
  sessionId: string;
  wasSolved: boolean;
  suggestions?: string;
  timestamp: Date;
  conversationSummary: string;
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
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionId] = useState(Date.now().toString());
  const { toast } = useToast();

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

      // Show feedback prompt after a few exchanges
      if (messages.length >= 4) {
        setTimeout(() => setShowFeedback(true), 3000);
      }
    }, 1500);
  };

  const handleFeedback = (wasSolved: boolean) => {
    const conversationSummary = messages.slice(1).map(m => `${m.sender}: ${m.text}`).join('\n');
    
    const feedbackData: FeedbackData = {
      id: Date.now().toString(),
      sessionId,
      wasSolved,
      timestamp: new Date(),
      conversationSummary,
      suggestions: wasSolved ? undefined : generateImprovementSuggestions(conversationSummary)
    };

    // Store feedback in localStorage (would be backend in production)
    const existingFeedback = JSON.parse(localStorage.getItem('aiFeedback') || '[]');
    existingFeedback.push(feedbackData);
    localStorage.setItem('aiFeedback', JSON.stringify(existingFeedback));

    toast({
      title: wasSolved ? "Thank you!" : "Feedback recorded",
      description: wasSolved 
        ? "Great to hear your issue was resolved!" 
        : "We'll use this feedback to improve our AI assistant.",
    });

    setShowFeedback(false);
  };

  const generateImprovementSuggestions = (conversation: string): string => {
    // Simple AI improvement suggestions based on conversation patterns
    const suggestions = [];
    
    if (conversation.includes('error') || conversation.includes('broken')) {
      suggestions.push("Add more specific error code recognition");
    }
    if (conversation.includes('location') && !conversation.includes('which location')) {
      suggestions.push("Improve location identification prompts");
    }
    if (conversation.includes('image') || conversation.includes('picture')) {
      suggestions.push("Enhance image analysis capabilities");
    }
    if (conversation.length < 200) {
      suggestions.push("Provide more detailed troubleshooting steps");
    }
    
    return suggestions.length > 0 
      ? suggestions.join('; ') 
      : "Review conversation flow and add more targeted questions";
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

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Was your issue resolved?</h3>
            <p className="text-sm text-slate-600 mb-6">
              Your feedback helps us improve our AI assistant for everyone.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => handleFeedback(true)}
                className="flex-1 gap-2"
              >
                <ThumbsUp size={16} />
                Yes, resolved
              </Button>
              <Button 
                onClick={() => handleFeedback(false)}
                variant="outline"
                className="flex-1 gap-2"
              >
                <ThumbsDown size={16} />
                No, still need help
              </Button>
            </div>
            <Button 
              onClick={() => setShowFeedback(false)}
              variant="ghost"
              className="w-full mt-2 text-sm"
            >
              Skip feedback
            </Button>
          </Card>
        </div>
      )}

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
