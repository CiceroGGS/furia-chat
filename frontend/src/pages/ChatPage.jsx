import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  ChatContainer,
  Header,
  LiveMatchPanel,
  MessageList,
  Message,
  MessageHeader,
  Username,
  MessageTime,
  InputContainer,
  MessageInput,
  SendButton,
  CheerButton,
} from "../styles/ChatStyle";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [cheerCount, setCheerCount] = useState(0);
  const [lastCheerUser, setLastCheerUser] = useState("");
  const socket = useRef(null);
  const [username] = useState(`FURIA_Fan_${Math.floor(Math.random() * 1000)}`);

  useEffect(() => {
    socket.current = io("http://localhost:5000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Listeners
    socket.current.on("connect", () => {
      console.log("Conectado ao servidor Socket.io");
    });

    socket.current.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.current.on("cheer_update", (data) => {
      setCheerCount(data.count);
      setLastCheerUser(data.user);
    });

    socket.current.on("chat_error", (error) => {
      console.error("Erro no chat:", error.message);
      alert(`Erro: ${error.message}`);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.current.emit("send_message", {
      message: newMessage,
      username: username,
    });

    setNewMessage("");
  };

  const handleCheer = () => {
    socket.current.emit("send_cheer", {
      username: username,
    });
  };

  return (
    <ChatContainer>
      <Header>FURIA CHAT</Header>

      <LiveMatchPanel matchId="furia_vs_opponent" />

      {cheerCount > 0 && (
        <div
          style={{
            background: "#ff5500",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          🔥 {cheerCount}{" "}
          {cheerCount === 1 ? "pessoa gritou" : "pessoas gritaram"}!
          {lastCheerUser && ` (${lastCheerUser} foi o último)`}
        </div>
      )}

      <MessageList>
        {messages.map((msg, index) => (
          <Message key={index} $isUser={msg.username === username}>
            <MessageHeader>
              <Username>{msg.username}</Username>
              <MessageTime>{msg.time}</MessageTime>
            </MessageHeader>
            {msg.message}
          </Message>
        ))}
      </MessageList>

      <InputContainer onSubmit={handleSendMessage}>
        <MessageInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Envie uma mensagem..."
        />
        <CheerButton type="button" onClick={handleCheer}>
          🔥 VAMO!
        </CheerButton>
        <SendButton type="submit">ENVIAR</SendButton>
      </InputContainer>
    </ChatContainer>
  );
}

export default ChatPage;
