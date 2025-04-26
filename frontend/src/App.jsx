import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const messagesEndRef = useRef(null);

  // Comandos disponíveis
  const commands = {
    help: {
      description: "Mostra esta mensagem de ajuda",
      execute: () => {
        const helpMessage = {
          username: "Sistema",
          message:
            "🔥 Comandos FURIA 🔥\n" +
            "!help - Mostra esta ajuda\n" +
            "!cheer - Envia um grito de guerra\n" +
            "!stats - Mostra estatísticas do chat\n" +
            "!furia - Mostra informações do time",
          time: new Date().toLocaleTimeString(),
          isSystem: true,
        };
        setMessages((prev) => [...prev, helpMessage]);
      },
    },
    cheer: {
      description: "Envia um grito de guerra",
      execute: () => {
        socket.emit("send_cheer", { username });
      },
    },
    furia: {
      description: "Informações sobre a FURIA",
      execute: () => {
        const infoMessage = {
          username: "Sistema",
          message:
            "⚡ FURIA Esports ⚡\n" +
            "Fundação: 2017\n" +
            "Jogos: CS2, Valorant, LoL\n" +
            "Cores: Laranja e Preto\n" +
            "Mascote: Onça-pintada",
          time: new Date().toLocaleTimeString(),
          isSystem: true,
        };
        setMessages((prev) => [...prev, infoMessage]);
      },
    },
  };

  // Auto-scroll
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

    socket.on("cheer_update", (data) => {
      const cheerMessage = {
        username: "Sistema",
        message: `🎉 ${data.user} fez um grito de guerra! ${Array(data.count)
          .fill("🔥")
          .join(" ")}`,
        time: new Date().toLocaleTimeString(),
        isSystem: true,
      };
      setMessages((prev) => [...prev, cheerMessage]);
    });

    socket.on("stats_response", (data) => {
      const statsMessage = {
        username: "Sistema",
        message:
          `📊 Estatísticas:\n` +
          `Mensagens: ${data.totalMessages}\n` +
          `Usuários: ${data.activeUsers}`,
        time: new Date().toLocaleTimeString(),
        isSystem: true,
      };
      setMessages((prev) => [...prev, statsMessage]);
    });

    return () => {
      socket.off("new_message");
      socket.off("cheer_update");
      socket.off("stats_response");
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    if (message.startsWith("!")) {
      const command = message.split(" ")[0].substring(1).toLowerCase();
      if (commands[command]) {
        commands[command].execute();
      } else {
        const errorMessage = {
          username: "Sistema",
          message: `❌ Comando desconhecido: ${command}\nDigite !help para ajuda`,
          time: new Date().toLocaleTimeString(),
          isSystem: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } else {
      socket.emit("send_message", {
        message,
        username: username || `FURIA Fan #${Math.floor(Math.random() * 1000)}`,
      });
    }
    setMessage("");
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
        <div className="header-subtitle">Conecte-se à Nação FURIA</div>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.isSystem ? "system-message" : ""}`}
          >
            <div className="message-user">{msg.username}</div>
            <div className="message-content">
              <div className="message-text">
                {msg.message.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
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
            placeholder="Digite uma mensagem ou !help para comandos"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSendMessage}>
            <span>Enviar</span>
            <span className="send-icon">⚡</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
