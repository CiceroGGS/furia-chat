import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  ChatContainer,
  ChatHeader,
  MessageList,
  Message,
  MessageInputContainer,
  MessageInput,
  SendButton,
  FuriaLogo,
  UserBadge,
  Timestamp,
} from "./components/ChatStyles";
import furiaLogo from "./assets/furia-esports-logo.png";

const socket = io("http://localhost:5000");

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username] = useState(`FURIA Fan #${Math.floor(Math.random() * 1000)}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const messageData = {
        message,
        username,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      socket.emit("send_message", messageData);
      setMessage("");
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/chat")
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Erro ao carregar mensagens:", error));

    socket.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => socket.off("receive_message");
  }, []);

  return (
    <div className="app-background">
      <ChatContainer>
        <ChatHeader>
          <FuriaLogo src={furiaLogo} alt="FURIA Logo" />
          <h1>FURIA CHAT</h1>
        </ChatHeader>

        <MessageList>
          {messages.map((msg, index) => (
            <Message key={index} isUser={msg.username === username}>
              <UserBadge isUser={msg.username === username}>
                {msg.username} <Timestamp>{msg.time}</Timestamp>
              </UserBadge>
              <p>{msg.message}</p>
            </Message>
          ))}
          <div ref={messagesEndRef} />
        </MessageList>

        <MessageInputContainer>
          <MessageInput
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Envie um grito de guerra! 🔥"
          />
          <SendButton onClick={handleSendMessage}>
            <span>Enviar</span> 🚀
          </SendButton>
        </MessageInputContainer>
      </ChatContainer>
    </div>
  );
};

export default App;
