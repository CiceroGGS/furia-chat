import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll para baixo quando novas mensagens chegarem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/chat");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    };

    loadMessages();

    socket.on("new_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("new_message");
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", {
        message,
        username: username || `FURIA Fan #${Math.floor(Math.random() * 1000)}`,
      });
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-header">
        <h1>FURIA Chat</h1>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <div className="message-user">{msg.username}</div>
            <div className="message-content">
              <div className="message-text">{msg.message}</div>
              <div className="message-time">{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <div className="user-info">
          <input
            type="text"
            placeholder="Seu nome (opcional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="message-input">
          <textarea
            placeholder="Digite uma mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSendMessage}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default App;
