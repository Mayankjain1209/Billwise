import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

const Chat = () => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: language === 'hi'
        ? 'नमस्ते! मैं आपके बिलों के बारे में सवालों के जवाब देने में मदद कर सकता हूं। आप क्या जानना चाहते हैं?'
        : 'Hello! I can help answer questions about your bills. What would you like to know?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    language === 'hi' ? 'मेरे बिल को समझाएं' : 'Explain my bill',
    language === 'hi' ? 'धोखाधड़ी की जांच करें' : 'Check for scams',
    language === 'hi' ? 'खर्चों की तुलना करें' : 'Compare expenses',
    language === 'hi' ? 'छुपे हुए शुल्क खोजें' : 'Find hidden charges'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post('/api/ai/chat', {
        message: userMessage,
        language
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.response
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: language === 'hi'
          ? 'क्षमा करें, एक त्रुटि हुई। कृपया पुन: प्रयास करें।'
          : 'Sorry, an error occurred. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-600 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{t('chat')}</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 flex-1 flex flex-col overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 border border-indigo-200">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center border border-indigo-200">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions & Input */}
          <div className="bg-white border-t border-slate-100 p-4">
            {messages.length === 1 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {language === 'hi' ? 'सुझाव' : 'Suggestions'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(prompt)}
                      className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-full text-sm hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSend} className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === 'hi' ? 'अपना प्रश्न पूछें...' : 'Ask a question about your bills...'}
                className="flex-1 pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-700 placeholder:text-slate-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;