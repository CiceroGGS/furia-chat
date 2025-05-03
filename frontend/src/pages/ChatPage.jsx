import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";
import Message from "../components/Message";
import LiveMatchPanel from "../components/LiveMatchPanel";
import {
  ChatContainer,
  Header,
  MessageList,
  InputContainer,
  MessageInput,
  SendButton,
  ReplyIndicator,
  CloseButton,
} from "../styles/ChatStyle";

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
        `http://localhost:5000/api/chat/${messageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: newContent }),
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
        `http://localhost:5000/api/chat/${messageId}`,
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
        `http://localhost:5000/api/chat/${messageId}/react`,
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
    const messageToReply = messages.find((msg) => msg._id === messageId);
    setReplyingTo(messageToReply || null);
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
      <Header>CHAT FURIOSO - {user?.username}</Header>

      {/* Live Match Panel added here */}
      <LiveMatchPanel />

      {replyingTo && (
        <ReplyIndicator>
          <span>Respondendo a: {replyingTo.username}</span>
          <CloseButton onClick={() => setReplyingTo(null)}>×</CloseButton>
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
