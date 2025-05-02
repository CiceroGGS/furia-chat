import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import "./App.css";
import LiveMatchPanel from "./components/LiveMatchPanel";
import Message from "./components/Message";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyingToMessage, setReplyingToMessage] = useState(null); // Novo estado
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const authToken = localStorage.getItem("authToken");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleReply = useCallback((messageId, messageData) => {
    setReplyingTo(messageId);
    setReplyingToMessage(messageData);
    console.log("Respondendo a:", messageData); // Para depuração
  }, []); // Adicionando useCallback

  const cancelReply = useCallback(() => {
    setReplyingTo(null);
    setReplyingToMessage(null);
  }, []); // Adicionando useCallback

  // Conexão com Socket.IO
  useEffect(() => {
    if (!authToken) {
      navigate("/login");
      return;
    }

    const newSocket = io("http://localhost:5000", {
      auth: { token: authToken },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
    });

    const onConnect = () => {
      console.log("Socket conectado!");
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onConnectError = (err) => {
      console.error("Erro de conexão:", err);
      if (err.message.includes("invalid")) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    };

    const onNewMessage = (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    const onUpdateMessage = (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    };

    const onCheerUpdate = (data) => {
      const cheerMessage = {
        _id: Date.now().toString(),
        username: "Sistema",
        message: `🎉 ${data.user} fez um grito de guerra!`,
        time: new Date().toLocaleTimeString(),
        isSystem: true,
      };
      setMessages((prev) => [...prev, cheerMessage]);
    };

    newSocket.on("connect", onConnect);
    newSocket.on("disconnect", onDisconnect);
    newSocket.on("connect_error", onConnectError);
    newSocket.on("new_message", onNewMessage);
    newSocket.on("update_message", onUpdateMessage);
    newSocket.on("cheer_update", onCheerUpdate);

    setSocket(newSocket);

    return () => {
      newSocket.off("connect", onConnect);
      newSocket.off("disconnect", onDisconnect);
      newSocket.off("connect_error", onConnectError);
      newSocket.off("new_message", onNewMessage);
      newSocket.off("update_message", onUpdateMessage);
      newSocket.off("cheer_update", onCheerUpdate);
      newSocket.disconnect();
    };
  }, [authToken, navigate]);

  // Comandos do chat
  const commands = {
    help: () => {
      const helpMessage = {
        _id: Date.now().toString(),
        username: "Sistema",
        message: "🔥 Comandos disponíveis: !help, !cheer, !furia",
        time: new Date().toLocaleTimeString(),
        isSystem: true,
      };
      setMessages((prev) => [...prev, helpMessage]);
    },
    cheer: () => {
      socket?.emit("send_cheer");
    },
    furia: () => {
      const infoMessage = {
        _id: Date.now().toString(),
        username: "Sistema",
        message: "⚡ FURIA Esports - Fundada em 2017",
        time: new Date().toLocaleTimeString(),
        isSystem: true,
      };
      setMessages((prev) => [...prev, infoMessage]);
    },
  };

  // Carregar mensagens iniciais
  useEffect(() => {
    if (!authToken) return;

    const loadMessages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/chat", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    };

    loadMessages();
  }, [authToken]);

  // Auto-scroll para novas mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!socket || !isConnected || !message.trim()) return;

    if (message.startsWith("!")) {
      const command = message.split(" ")[0].substring(1).toLowerCase();
      commands[command]?.();
    } else {
      try {
        const response = await fetch("http://localhost:5000/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ message, parentMessageId: replyingTo }),
        });

        if (!response.ok) {
          console.error("Erro ao enviar mensagem via HTTP");
          return;
        }

        setMessage("");
        setReplyingTo(null);
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
      }
    }
    setMessage("");
    setReplyingTo(null);
  };

  // Editar mensagem
  const handleEditMessage = (id, newContent) => {
    if (!socket || !isConnected) return;
    fetch(`http://localhost:5000/api/chat/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ content: newContent }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error(
            "Erro ao editar mensagem via HTTP:",
            response.statusText
          );
          return;
        }
        return response.json();
      })
      .then((updatedMessage) => {
        if (updatedMessage) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === updatedMessage._id ? updatedMessage : msg
            )
          );
        }
      })
      .catch((error) => {
        console.error("Erro ao editar mensagem:", error);
      });
  };

  // Adicionar reação
  const handleReactToMessage = (messageId, emoji) => {
    if (!socket || !isConnected) return;
    socket.emit("react_message", { id: messageId, emoji });
  };

  // Lidar com tecla Enter para enviar
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-app">
      {!isConnected && (
        <div className="connection-status">🔴 Conectando ao servidor...</div>
      )}

      <div className="chat-header">
        <h1>FURIA Chat</h1>
        <div className="header-subtitle">
          {isConnected ? "✅ Conectado" : "🔄 Conectando..."}
        </div>
      </div>

      <LiveMatchPanel />

      <div className="messages-container">
        {messages.map((msg) => (
          <Message
            key={msg._id}
            message={msg}
            currentUser={username}
            onReply={handleReply}
            onEdit={handleEditMessage}
            onReact={handleReactToMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        {console.log("replyingToMessage (render):", replyingToMessage)}
        {replyingToMessage && (
          <div className="relative mb-2 bg-blue-100 rounded-lg p-2 max-w-xs mx-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-blue-800">
                  Respondendo a {replyingToMessage.username}
                </p>
                <p className="text-sm text-blue-900 truncate">
                  {replyingToMessage.message}
                </p>
              </div>
              <button
                onClick={cancelReply}
                className="text-blue-400 hover:text-blue-600 text-lg"
              >
                ×
              </button>
            </div>
            {/* Seta indicadora */}
            <div
              className="absolute -bottom-2 left-4 w-0 h-0 
        border-l-4 border-r-4 border-b-4 border-l-transparent 
        border-r-transparent border-b-blue-100"
            ></div>
          </div>
        )}
        <div className="message-input">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite uma mensagem..."
            disabled={!isConnected}
            rows={3}
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected || !message.trim()}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
