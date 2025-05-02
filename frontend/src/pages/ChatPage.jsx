import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";
import Message from "../components/Message";
import styled from "styled-components";

const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #121212;
  border-radius: 10px;
  border: 2px solid #ff5500;
  box-shadow: 0 0 20px rgba(255, 85, 0, 0.3);
  height: 90vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background: #000;
  border-bottom: 2px solid #ff5500;
  margin-bottom: 20px;
  color: #ff5500;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 1.5rem;
  font-weight: bold;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: #1e1e1e;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  &::-webkit-scrollbar-thumb {
    background: #ff5500;
    border-radius: 4px;
  }
`;

const InputContainer = styled.form`
  display: flex;
  gap: 10px;
  padding: 10px;
  background: #2a2a2a;
  border-radius: 8px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  background: #1e1e1e;
  color: white;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: #888;
  }
`;

const SendButton = styled.button`
  padding: 12px 24px;
  background: #ff5500;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: #ff7700;
  }

  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

const ReplyIndicator = styled.div`
  background: rgba(255, 85, 0, 0.1);
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ff5500;
  font-size: 0.9rem;
`;

const CancelReplyButton = styled.button`
  background: none;
  border: none;
  color: #ff5500;
  cursor: pointer;
  padding: 0 4px;
  font-size: 1.2rem;

  &:hover {
    color: #ff884d;
  }
`;

export default function ChatPage() {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const socket = useRef(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Auto-scroll para novas mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Carregar mensagens iniciais
  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/chat", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load messages");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
      alert("Failed to load messages. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Conexão WebSocket
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    loadMessages();

    const token = localStorage.getItem("authToken");
    socket.current = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socket.current.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.current.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.current.on("update_message", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });

    socket.current.on("delete_message", ({ _id }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== _id));
    });

    socket.current.on("connect_error", (err) => {
      console.error("Connection error:", err);
      if (err.message === "invalid token") {
        logout();
        navigate("/login");
      }
      setTimeout(() => socket.current.connect(), 1000);
    });

    return () => {
      if (socket.current) {
        socket.current.off("new_message");
        socket.current.off("update_message");
        socket.current.off("delete_message");
        socket.current.disconnect();
      }
    };
  }, [user, navigate, logout, loadMessages]);
  const handleEditMessage = async (messageId, newContent) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/api/chat/${messageId}`, // Use /api/chat
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: newContent }), // Use 'message' para corresponder ao backend
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to edit message");
      }
    } catch (error) {
      console.error("Edit error:", error);
      alert(error.message);
      throw error;
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/api/chat/${messageId}`, // Use /api/chat
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete message");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message);
      throw error;
    }
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/api/chat/${messageId}/react`, // Use /api/chat
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ emoji }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add reaction");
      }
    } catch (error) {
      console.error("Reaction error:", error);
      alert(error.message);
      throw error;
    }
  };

  const handleReplyToMessage = (messageId) => {
    setReplyingTo(messages.find((msg) => msg._id === messageId) || null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      message: newMessage.trim(),
      ...(replyingTo && { parentMessageId: replyingTo._id }),
    };

    try {
      socket.current.emit("send_message", messageData, (response) => {
        if (response.status === "success") {
          setNewMessage("");
          setReplyingTo(null);
        } else {
          console.error("Erro ao enviar mensagem:", response.message);
          alert(`Falha ao enviar mensagem: ${response.message}`);
        }
      });
    } catch (error) {
      console.error("Send message error:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <ChatContainer>
      <Header>Chat da FURIA - {user?.username}</Header>

      {replyingTo && (
        <ReplyIndicator>
          <span>Respondendo a: {replyingTo.username}</span>
          <CancelReplyButton onClick={() => setReplyingTo(null)}>
            ×
          </CancelReplyButton>
        </ReplyIndicator>
      )}

      <MessageList>
        {isLoading ? (
          <div style={{ textAlign: "center", color: "#aaa" }}>
            Carregando mensagens...
          </div>
        ) : (
          messages.map((message) => (
            <Message
              key={message._id}
              message={{
                ...message,
                time: new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }}
              currentUser={user?.username}
              onEdit={handleEditMessage}
              onDelete={handleDeleteMessage}
              onReact={handleReaction}
              onReply={handleReplyToMessage}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </MessageList>

      <InputContainer onSubmit={handleSubmit}>
        <MessageInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={
            replyingTo
              ? `Respondendo a ${replyingTo.username}...`
              : "Digite sua mensagem..."
          }
          disabled={isLoading}
        />
        <SendButton type="submit" disabled={isLoading || !newMessage.trim()}>
          Enviar
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
}
