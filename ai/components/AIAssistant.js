import React, { useState, useEffect, useRef } from 'react';
import { aiService } from '../services/AIService';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

/**
 * AI Assistant Component
 * Provides an intelligent assistant interface for users across the application
 */
const AIAssistant = ({ context, module }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const { data: session } = useSession();

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          type: 'assistant',
          content: `Hello! I'm your AI assistant for the ${module || 'Precast Concrete Management System'}. How can I help you today?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [module, messages.length]);

  // Context-aware suggestions based on current module and user activity
  useEffect(() => {
    if (context && module) {
      generateSuggestions();
    }
  }, [context, module]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateSuggestions = async () => {
    try {
      if (!session?.user?.id) return;
      
      const contextData = {
        module,
        ...context,
        userId: session.user.id,
        userRole: session.user.role
      };
      
      const recommendations = await aiService.getRecommendations(
        session.user.id,
        JSON.stringify(contextData),
        { limit: 3 }
      );
      
      setSuggestions(recommendations);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Process the user's message with AI
      const contextData = {
        module,
        ...context,
        userId: session?.user?.id,
        userRole: session?.user?.role,
        previousMessages: messages.map(m => ({
          role: m.type,
          content: m.content
        }))
      };
      
      const response = await aiService.generateText(
        input,
        { context: JSON.stringify(contextData) }
      );
      
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Generate new suggestions based on the conversation
      generateSuggestions();
    } catch (error) {
      console.error('Error processing message:', error);
      toast.error('Sorry, I encountered an error processing your request.');
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-assistant-container">
      <button 
        className={`ai-assistant-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant"
      >
        <span className="ai-icon">AI</span>
      </button>
      
      {isOpen && (
        <div className="ai-assistant-panel">
          <div className="ai-assistant-header">
            <h3>AI Assistant</h3>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI Assistant"
            >
              ×
            </button>
          </div>
          
          <div className="ai-assistant-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.type} ${message.isError ? 'error' : ''}`}
              >
                <div className="message-content">{message.content}</div>
                <div className="message-timestamp">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {suggestions.length > 0 && (
            <div className="ai-suggestions">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${index}`}
                  className="suggestion-button"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          <div className="ai-assistant-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              rows={1}
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .ai-assistant-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        
        .ai-assistant-toggle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #0070f3;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .ai-assistant-toggle:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        
        .ai-assistant-toggle.open {
          transform: scale(0.9);
        }
        
        .ai-icon {
          font-weight: bold;
          font-size: 18px;
        }
        
        .ai-assistant-panel {
          position: absolute;
          bottom: 60px;
          right: 0;
          width: 350px;
          height: 500px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .ai-assistant-header {
          padding: 15px;
          background-color: #0070f3;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .ai-assistant-header h3 {
          margin: 0;
          font-size: 16px;
        }
        
        .close-button {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
        }
        
        .ai-assistant-messages {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .message {
          max-width: 80%;
          padding: 10px 15px;
          border-radius: 18px;
          position: relative;
          margin-bottom: 5px;
        }
        
        .message.user {
          align-self: flex-end;
          background-color: #0070f3;
          color: white;
          border-bottom-right-radius: 5px;
        }
        
        .message.assistant {
          align-self: flex-start;
          background-color: #f0f0f0;
          color: #333;
          border-bottom-left-radius: 5px;
        }
        
        .message.error {
          background-color: #ffebee;
          color: #d32f2f;
        }
        
        .message-timestamp {
          font-size: 10px;
          opacity: 0.7;
          margin-top: 5px;
          text-align: right;
        }
        
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          background-color: #888;
          border-radius: 50%;
          display: inline-block;
          animation: typing 1.4s infinite ease-in-out both;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 100% {
            transform: scale(0.7);
            opacity: 0.5;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .ai-suggestions {
          padding: 10px 15px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          border-top: 1px solid #eaeaea;
        }
        
        .suggestion-button {
          background-color: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 15px;
          padding: 5px 10px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .suggestion-button:hover {
          background-color: #e0e0e0;
        }
        
        .ai-assistant-input {
          padding: 15px;
          border-top: 1px solid #eaeaea;
          display: flex;
          gap: 10px;
        }
        
        .ai-assistant-input textarea {
          flex: 1;
          border: 1px solid #ddd;
          border-radius: 20px;
          padding: 10px 15px;
          resize: none;
          font-family: inherit;
          outline: none;
        }
        
        .ai-assistant-input textarea:focus {
          border-color: #0070f3;
        }
        
        .ai-assistant-input button {
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 20px;
          padding: 0 15px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .ai-assistant-input button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        
        .ai-assistant-input button:hover:not(:disabled) {
          background-color: #0060df;
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;
