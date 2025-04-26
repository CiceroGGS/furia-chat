// src/pages/ChatPage.jsx
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  ChatContainer,
  Header,
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
  const [newMsg, setNewMsg] = useState("");
  const [cheerCount, setCheerCount] = useState(0);
  const [lastCheerUser, setLastCheerUser] = useState("");
  const socket = useRef();
  const username = `FURIA_Fan_${Math.floor(Math.random() * 1000)}`;

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("initial_messages", (msgs) => {
      setMessages(msgs);
    });
    socket.current.on("new_message", (m) => {
      setMessages((prev) => [...prev, m]);
    });
    socket.current.on("cheer_update", (d) => {
      setCheerCount(d.count);
      setLastCheerUser(d.user);
    });

    return () => socket.current.disconnect();
  }, []);

  const send = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    socket.current.emit("send_message", { message: newMsg, username });
    setNewMsg("");
  };

  return (
    <ChatContainer>
      <Header>FURIA CHAT</Header>
      {cheerCount > 0 && (
        <Banner>
          🔥 {cheerCount} gritos! ({lastCheerUser})
        </Banner>
      )}
      <MessageList>
        {messages.map((m, i) => (
          <Message key={i} $isUser={m.username === username}>
            <MessageHeader>
              <Username>{m.username}</Username>
              <MessageTime>{m.time}</MessageTime>
            </MessageHeader>
            {m.message}
          </Message>
        ))}
      </MessageList>
      <InputContainer onSubmit={send}>
        <MessageInput
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Envie uma mensagem..."
        />
        <CheerButton
          onClick={() => socket.current.emit("send_cheer", { username })}
        >
          🔥
        </CheerButton>
        <SendButton type="submit">ENVIAR</SendButton>
      </InputContainer>
    </ChatContainer>
  );
}

export default ChatPage;
