import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";
import LiveMatchPanel from "../components/LiveMatchPanel";
import useSocket from "../hooks/useSocket";
import {
  ChatContainer,
  Header,
  CheerBanner,
  MessageList,
  InputContainer,
  MessageInput,
  SendButton,
  CheerButton,
} from "../styles/ChatStyle";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [cheerCount, setCheerCount] = useState(0);
  const [lastCheerUser, setLastCheerUser] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const endRef = useRef(null);
  const authToken = localStorage.getItem("authToken");
  const localUsername = localStorage.getItem("username");
  const navigate = useNavigate();
  const socket = useSocket(authToken);

  // Comandos disponíveis
  const commands = {
    help: () => addSystemMessage("Comandos disponíveis: !help, !cheer, !furia"),
    cheer: () => socket?.emit("send_cheer"),
    furia: () => addSystemMessage("⚡ FURIA Esports - Fundada em 2017"),
  };

  const addSystemMessage = (text) => {
    const systemMessage = {
      _id: Date.now().toString(),
      username: "Sistema",
      message: text,
      time: new Date().toLocaleTimeString(),
      isSystem: true,
    };
    setMessages((prev) => [...prev, systemMessage]);
  };

  // Carregar mensagens iniciais
  useEffect(() => {
    if (!authToken) {
      navigate("/login");
      return;
    }

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
  }, [authToken, navigate]);

  // Configurar listeners do socket
  useEffect(() => {
    if (!socket) return;

    socket.on("new_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("cheer_update", (data) => {
      setCheerCount(data.count);
      setLastCheerUser(data.user);
      addSystemMessage(`🎉 ${data.user} fez um grito de guerra!`);
    });

    return () => {
      socket.off("new_message");
      socket.off("cheer_update");
    };
  }, [socket]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMsg.trim()) return;

      if (newMsg.startsWith("!")) {
        const command = newMsg.split(" ")[0].substring(1).toLowerCase();
        commands[command]?.();
      } else {
        socket?.emit("send_message", {
          message: newMsg,
          parentMessageId: replyingTo,
        });
      }

      setNewMsg("");
      setReplyingTo(null);
    },
    [newMsg, replyingTo, socket, commands]
  );

  const handleReply = useCallback(
    (messageId) => {
      const messageToReply = messages.find((m) => m._id === messageId);
      setReplyingTo(messageId);
      setNewMsg(`@${messageToReply.username} `);
    },
    [messages]
  );

  return (
    <ChatContainer>
      <Header>FURIA CHAT</Header>

      <LiveMatchPanel />

      {cheerCount > 0 && (
        <CheerBanner>
          🔥 {cheerCount} gritos! ({lastCheerUser})
        </CheerBanner>
      )}

      <MessageList>
        {messages.map((m) => (
          <Message
            key={m._id}
            message={{
              ...m,
              parentMessagePreview: m.parentMessageId
                ? messages.find((msg) => msg._id === m.parentMessageId)
                : null,
            }}
            currentUser={localUsername}
            onReply={handleReply}
          />
        ))}
        <div ref={endRef} />
      </MessageList>

      <InputContainer onSubmit={handleSend}>
        {replyingTo && (
          <div className="reply-preview">
            Respondendo a: {messages.find((m) => m._id === replyingTo)?.message}
            <button onClick={() => setReplyingTo(null)}>×</button>
          </div>
        )}
        <MessageInput
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Envie uma mensagem..."
        />
        <CheerButton
          onClick={() => socket?.emit("send_cheer")}
          type="button"
          disabled={!socket?.connected}
        >
          🔥
        </CheerButton>
        <SendButton type="submit" disabled={!socket?.connected}>
          ENVIAR
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
}

export default ChatPage;
