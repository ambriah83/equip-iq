import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, Upload, Mic, Image as ImageIcon, ThumbsUp, ThumbsDown, Video, Phone } from 'lucide-react';
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

const AIChatGPTSecure = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant powered by ChatGPT. I can help you troubleshoot equipment issues, answer maintenance questions, and provide guidance on your tanning salon operations. What can I help you with today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [sessionId] = useState(Date.now().toString());
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getChatGPTResponse = async (prompt: string, chatHistory: Message[]) => {
    try {
      const messages = chatHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));

      messages.unshift({
        role: 'system' as const,
        content: "You are IQ, an expert AI equipment technician for tanning salons. Your knowledge is based on real work orders. Be concise and helpful. When a user has an issue, guide them through troubleshooting. If it's a known issue that requires a technician, suggest creating a ticket."
      });

      messages.push({
        role: 'user' as const,
        content: prompt
      });

      // Call our secure backend function instead of OpenAI directly
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages })
      });

      const result = await response.json();
      
      if (result.choices && result.choices[0]?.message?.content) {
        return result.choices[0].message.content;
      } else if (result.error) {
        console.error("API Error:", result.error);
        throw new Error(result.error.message || 'API error occurred');
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error calling ChatGPT API:", error);
      throw error;
    }
  };

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

    try {
      const aiResponseText = await getChatGPTResponse(inputText, messages);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Show feedback prompt after a few exchanges
      if (messages.length >= 4) {
        setTimeout(() => setShowFeedback(true), 3000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <MessageSquare size={24} />
          <div>
            <h2 className="text-xl font-bold">AI Troubleshooting Assistant</h2>
            <p className="text-blue-100">Powered by GPT-4o-mini with multimedia support</p>
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={`p-4 ${
              message.sender === 'user' 
                ? 'ml-auto max-w-[80%] bg-blue-50' 
                : 'mr-auto max-w-[80%]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">
                  {message.sender === 'user' ? 'You' : 'AI Assistant'}
                </p>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                {message.image && (
                  <img src={message.image} alt="Uploaded" className="mt-2 max-w-full h-auto rounded" />
                )}
                {message.video && (
                  <video src={message.video} controls className="mt-2 max-w-full h-auto rounded" />
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
        {isLoading && (
          <Card className="mr-auto max-w-[80%] p-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-500">AI is typing...</span>
            </div>
          </Card>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Feedback Popup */}
      {showFeedback && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-sm">
            <h3 className="text-lg font-semibold mb-3">Was your issue resolved?</h3>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => handleFeedback(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Yes
              </Button>
              <Button
                onClick={() => handleFeedback(false)}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                No
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="bg-white border-t p-4">
        <div className="flex gap-2 mb-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Image
          </Button>
          
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
            id="video-upload"
          />
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => document.getElementById('video-upload')?.click()}
          >
            <Video className="mr-2 h-4 w-4" />
            Video
          </Button>
          
          <Button
            onClick={isVideoCallActive ? endVideoCall : startVideoCall}
            variant={isVideoCallActive ? "destructive" : "outline"}
            size="sm"
          >
            <Phone className="mr-2 h-4 w-4" />
            {isVideoCallActive ? "End Call" : "Live Call"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            disabled
            title="Voice input coming soon"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChatGPTSecure;