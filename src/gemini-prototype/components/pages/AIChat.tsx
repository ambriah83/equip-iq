import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Sparkles, LoaderCircle } from '../../lib/icons';

interface Message {
  from: 'user' | 'ai';
  text: string | { type: string; text: string; ticketId?: string };
}

const AIChatPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { from: 'ai', text: `Hello ${user?.name}, I'm IQ. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getChatGPTResponse = async (prompt: string, chatHistory: Message[]) => {
    setIsLoading(true);
    try {
      const messages = chatHistory.map(msg => ({
        role: msg.from === 'user' ? 'user' as const : 'assistant' as const,
        content: typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text)
      }));
      
      messages.unshift({
        role: 'system' as const,
        content: "You are IQ, an expert AI equipment technician for tanning salons. Your knowledge is based on real work orders. Be concise and helpful. When a user has an issue, guide them through troubleshooting. If it's a known issue that requires a technician, suggest creating a ticket by ending your response with the specific string 'TICKET_SUGGESTION'."
      });

      messages.push({
        role: 'user' as const,
        content: prompt
      });

      const payload = {
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      };

      // Get API key from environment variable
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
      if (!apiKey) {
        return "Please add VITE_OPENAI_API_KEY to your .env file to enable AI responses.";
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.choices && result.choices[0]?.message?.content) {
        let responseText = result.choices[0].message.content;
        if (responseText.includes("TICKET_SUGGESTION")) {
          return {
            type: 'ticket_creation_suggestion',
            text: responseText.replace("TICKET_SUGGESTION", "").trim()
          };
        }
        return responseText;
      } else if (result.error) {
        console.error("OpenAI API Error:", result.error);
        return `API Error: ${result.error.message || 'Unknown error occurred'}`;
      } else {
        return "I'm having trouble connecting right now. Please try again later.";
      }
    } catch (error) {
      console.error("Error calling ChatGPT API:", error);
      return "An error occurred. Please check the console and ensure your API key is configured.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = { from: 'user', text: input };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');
    
    const aiResponseText = await getChatGPTResponse(input, currentMessages);
    setMessages(prev => [...prev, { from: 'ai', text: aiResponseText }]);
  };

  const handleSuggestionClick = () => {
    const aiResponse = {
      type: 'ticket_created',
      text: "I've created ticket #TKT-0125 for this issue.",
      ticketId: 'TKT-0125'
    };
    setMessages(prev => [...prev, { from: 'ai', text: aiResponse }]);
  };

  const renderMessage = (msg: Message, index: number) => {
    const isAI = msg.from === 'ai';
    
    if (isAI && typeof msg.text === 'object') {
      const content = msg.text;
      
      if (content.type === 'ticket_creation_suggestion') {
        return (
          <div key={index} className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-lg shadow-md space-y-3">
              <p className="text-gray-700 dark:text-gray-300">{content.text}</p>
              <button 
                onClick={handleSuggestionClick} 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 w-full flex items-center justify-center space-x-2"
              >
                <Sparkles className="h-5 w-5" />
                <span>Yes, create the ticket</span>
              </button>
            </div>
          </div>
        );
      }
      
      if (content.type === 'ticket_created') {
        return (
          <div key={index} className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-lg shadow-md">
              <p className="text-gray-700 dark:text-gray-300">
                {content.text}{' '}
                <button 
                  onClick={() => navigate(`/app/tickets/${content.ticketId}`)} 
                  className="text-blue-500 dark:text-blue-400 font-semibold hover:underline"
                >
                  View Ticket
                </button>
              </p>
            </div>
          </div>
        );
      }
    }
    
    return (
      <div key={index} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
        <div className={`px-4 py-2 rounded-lg max-w-lg shadow-md ${
          isAI 
            ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200' 
            : 'bg-blue-500 text-white'
        }`}>
          {msg.text as string}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-4 bg-slate-100 dark:bg-gray-900/50">
      <div className="flex-grow space-y-4 overflow-y-auto p-4">
        {messages.map(renderMessage)}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-lg max-w-lg shadow-md bg-white dark:bg-gray-800">
              <LoaderCircle className="animate-spin h-5 w-5 text-gray-500" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
            placeholder="Describe the issue or ask a question..." 
            className="w-full bg-transparent focus:outline-none text-gray-800 dark:text-gray-200" 
            disabled={isLoading} 
          />
          <button 
            onClick={handleSend} 
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300" 
            disabled={isLoading}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;