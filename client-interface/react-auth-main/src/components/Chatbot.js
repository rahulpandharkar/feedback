import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import './Chatbot.css';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // State for chat messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [botMessage, setBotMessage] = useState(''); // State for the bot's message

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return; // Prevent empty messages
    const userMessage = { text: input.trim(), sender: 'user' }; // User message
    setMessages((prev) => [...prev, userMessage]);
    setInput(''); // Clear input
    setLoading(true);
    setBotMessage(''); // Reset bot message state

    try {
      const res = await fetch('http://localhost:5000/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      if (res.ok) {
        // Format the response
        const formattedResponse = data.response.replace(/[^a-zA-Z0-9.,!?;: ]/g, '').trim(); // Remove special characters
        setBotMessage(formattedResponse); // Set bot message for typewriter effect
      } else {
        throw new Error(data.error || 'Error occurred');
      }
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [...prev, { text: err.message, sender: 'bot' }]); // Show error message
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle typewriter animation for the bot's message
  useEffect(() => {
    if (botMessage) {
      let index = 0;
      setMessages((prev) => [
        ...prev,
        { text: '', sender: 'bot' } // Add a placeholder for the bot message
      ]); // Add a new message placeholder

      const interval = setInterval(() => {
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1].text = botMessage.slice(0, index + 1); // Update the latest bot message
          return updatedMessages; // Return updated messages
        });

        index++;
        if (index >= botMessage.length) {
          clearInterval(interval); // Clear interval when done
        }
      }, 100); // Typewriter speed

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [botMessage]);

  return (
    <div className="chatbot-container">
      <h2>How can I help?</h2>
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="chat-message bot typing">...</div>}
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Control
            type="text"
            placeholder="Type your message here..."
            value={input}
            onChange={handleInputChange}
            className="chatbot-input"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="submit-button">
          {loading ? 'Thinking...' : 'Send'}
        </Button>
      </Form>
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default Chatbot;
