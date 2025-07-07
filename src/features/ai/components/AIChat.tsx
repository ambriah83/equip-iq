import React, { useState, useRef } from 'react';
import { MessageSquare, Send, Upload, Mic, Image as ImageIcon, ThumbsUp, ThumbsDown, Video, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/shared/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  image?: string;
  video?: string;
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
      text: "Hello! I'm your AI troubleshooting assistant. I can help you diagnose equipment issues, guide you through repairs, and escalate complex problems to our support team. You can share images, videos, or start a live video call for real-time assistance. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [sessionId] = useState(Date.now().toString());
  const videoRef = useRef<HTMLVideoElement>(null);
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
        text: "I understand you're experiencing an issue. Can you please tell me which location and equipment this relates to? If possible, please upload an image or video of the equipment, or we can start a live video call for real-time troubleshooting.",
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
    if (conversation.includes('image') || conversation.includes('picture') || conversation.includes('video')) {
      suggestions.push("Enhance image and video analysis capabilities");
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

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const videoMessage: Message = {
          id: Date.now().toString(),
          text: "Video uploaded for analysis",
          sender: 'user',
          timestamp: new Date(),
          video: e.target?.result as string,
        };
        setMessages(prev => [...prev, videoMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsVideoCallActive(true);
      
      const callMessage: Message = {
        id: Date.now().toString(),
        text: "Live video call started. I can now see your equipment and provide real-time guidance.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, callMessage]);
      
      toast({
        title: "Video Call Started",
        description: "Share your screen or point your camera at the equipment for real-time assistance.",
      });
    } catch (error) {
      toast({
        title: "Camera Access Required",
        description: "Please allow camera access to start the video call.",
        variant: "destructive",
      });
    }
  };

  const endVideoCall = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsVideoCallActive(false);
    
    const endCallMessage: Message = {
      id: Date.now().toString(),
      text: "Video call ended. Thank you for using live troubleshooting assistance!",
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, endCallMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <MessageSquare size={24} />
          <div>
            <h2 className="text-xl font-bold">AI Troubleshooting Assistant</h2>
            <p className="text-blue-100">Get instant help with equipment issues - now with video support!</p>
          </div>
        </div>
      </div>

      {/* Live Video Call Interface */}
      {isVideoCallActive && (
        <div className="bg-slate-900 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Live Video Call Active</h3>
            <Button onClick={endVideoCall} variant="destructive" size="sm">
              End Call
            </Button>
          </div>
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full max-w-md h-48 bg-black rounded-lg"
          />
          <p className="text-slate-300 text-sm mt-2">
            Point your camera at the equipment for real-time analysis and guidance.
          </p>
        </div>
      )}

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
              {message.video && (
                <video 
                  src={message.video} 
                  controls 
                  className="w-full h-48 rounded-lg mb-3"
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
                <span className="text-sm text-slate-500">AI is analyzing...</span>
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
        <div className="flex gap-3 mb-4 flex-wrap">
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
          
          <label className="cursor-pointer">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            <Button variant="outline" size="sm" className="gap-2">
              <Video size={16} />
              Upload Video
            </Button>
          </label>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={isVideoCallActive ? endVideoCall : startVideoCall}
          >
            <Phone size={16} />
            {isVideoCallActive ? 'End Video Call' : 'Start Video Call'}
          </Button>
          
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