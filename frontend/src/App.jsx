import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./App.css";
import LiveMatchPanel from "./components/LiveMatchPanel";
import Message from "./components/Message";

const socket = io("http://localhost:5000");

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const messagesEndRef = useRef(null);

  // Comandos disponíveis
  const commands = {
    help: {
      description: "Mostra esta mensagem de ajuda",
      execute: () => {
        const helpMessage = {
          _id: Date.now().toString(),
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
          _id: Date.now().toString(),
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
      setMessages((prev) => [...prev, { ...newMessage, reactions: [] }]);
    });

    socket.on("cheer_update", (data) => {
      const cheerMessage = {
        _id: Date.now().toString(),
        username: "Sistema",
        message: `🎉 ${data.user} fez um grito de guerra! ${Array(data.count)
          .fill("🔥")
          .join(" ")}`,
        time: new Date().toLocaleTimeString(),
        isSystem: true,
      };
      setMessages((prev) => [...prev, cheerMessage]);
    });

    return () => {
      socket.off("new_message");
      socket.off("cheer_update");
    };
  }, []);

  const handleEditMessage = async (messageId, newContent) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/chat/${messageId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newContent }),
        }
      );

      const updatedMessage = await response.json();
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, ...updatedMessage, edited: true }
            : msg
        )
      );
    } catch (error) {
      console.error("Erro ao editar mensagem:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await fetch(`http://localhost:5000/api/chat/${messageId}`, {
        method: "DELETE",
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, deleted: true } : msg
        )
      );
    } catch (error) {
      console.error("Erro ao excluir mensagem:", error);
    }
  };

  const handleAddReaction = async (messageId, emoji) => {
    try {
      await fetch(`http://localhost:5000/api/chat/${messageId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: username || "anonymous",
          emoji,
        }),
      });

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg._id === messageId) {
            const existingIndex = msg.reactions?.findIndex(
              (r) => r.emoji === emoji
            );
            if (existingIndex >= 0) {
              const newReactions = [...msg.reactions];
              newReactions[existingIndex].count =
                (newReactions[existingIndex].count || 0) + 1;
              return { ...msg, reactions: newReactions };
            }
            return {
              ...msg,
              reactions: [...(msg.reactions || []), { emoji, count: 1 }],
            };
          }
          return msg;
        })
      );
    } catch (error) {
      console.error("Erro ao adicionar reação:", error);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    if (message.startsWith("!")) {
      const command = message.split(" ")[0].substring(1).toLowerCase();
      if (commands[command]) {
        commands[command].execute();
      } else {
        const errorMessage = {
          _id: Date.now().toString(),
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
        parentMessageId: replyingTo,
      });
    }
    setMessage("");
    setReplyingTo(null);
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

      <LiveMatchPanel matchId="12345" />

      <div className="messages-container">
        {messages.map((msg) => (
          <Message
            key={msg._id}
            message={{
              ...msg,
              parentMessagePreview: msg.parentMessageId
                ? (() => {
                    const parentMsg = messages.find(
                      (m) => m._id === msg.parentMessageId
                    );
                    return parentMsg
                      ? {
                          username: parentMsg.username,
                          message: parentMsg.message,
                        }
                      : null;
                  })()
                : null,
            }}
            currentUser={username}
            onEdit={handleEditMessage}
            onDelete={handleDeleteMessage}
            onReact={handleAddReaction}
            onReply={setReplyingTo}
          />
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
        {replyingTo && (
          <div className="reply-indicator">
            Respondendo a:{" "}
            {messages
              .find((m) => m._id === replyingTo)
              ?.message.substring(0, 30)}
            ...
            <button onClick={() => setReplyingTo(null)}>×</button>
          </div>
        )}
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
