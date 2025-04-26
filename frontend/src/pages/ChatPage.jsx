import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";

// Styled Components
const ChatContainer = styled.div`
  max-width: 600px;
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

const Header = styled.h1`
  color: #ff5500;
  text-align: center;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const LiveMatchPanel = styled.div`
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ff5500;
  color: white;
  text-align: center;
  font-family: "Arial Black", sans-serif;
`;

const MatchTitle = styled.h3`
  margin: 0 0 5px 0;
  color: #ff5500;
`;

const MatchScore = styled.p`
  margin: 5px 0;
  font-size: 1.2rem;
`;

const MatchStats = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  font-size: 0.9rem;
`;

const CheerBanner = styled.div`
  background: linear-gradient(to right, #ff5500, #ff9900);
  color: black;
  padding: 10px;
  text-align: center;
  margin: 0 15px 15px;
  border-radius: 5px;
  font-weight: bold;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.03);
    }
    100% {
      transform: scale(1);
    }
  }
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
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ff5500;
    border-radius: 3px;
  }
`;

const Message = styled.div`
  padding: 12px 15px;
  background: ${(props) =>
    props.$isBot ? "#ff550022" : props.$isUser ? "#ff5500" : "#2a2a2a"};
  color: ${(props) =>
    props.$isBot ? "#ff5500" : props.$isUser ? "#000" : "#fff"};
  border-radius: ${(props) =>
    props.$isUser ? "15px 15px 0 15px" : "15px 15px 15px 0"};
  align-self: ${(props) => (props.$isUser ? "flex-end" : "flex-start")};
  max-width: 80%;
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const Username = styled.span`
  font-weight: bold;
`;

const MessageTime = styled.span`
  font-size: 0.8rem;
  color: ${(props) => (props.$isUser ? "#333" : "#888")};
  margin-left: 10px;
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

const ActionButton = styled.button`
  padding: 0 20px;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const SendButton = styled(ActionButton)`
  background: #ff5500;
  color: black;
  &:hover {
    background: #ff7700;
  }
`;

const CheerButton = styled(ActionButton)`
  background: linear-gradient(to right, #ff5500, #ff9900);
  color: black;
  &:hover {
    background: linear-gradient(to right, #ff7700, #ffbb00);
  }
`;

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [liveEvents, setLiveEvents] = useState([]);
  const [matchData, setMatchData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [cheerCount, setCheerCount] = useState(0);
  const [lastCheerUser, setLastCheerUser] = useState("");
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () => {
      setIsConnected(true);
      socket.current.emit("join_match", "current_furia_match");
    });

    socket.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.current.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.current.on("live_event", (event) => {
      setLiveEvents((prev) => [...prev.slice(-5), event]);
    });

    socket.current.on("match_data", (data) => {
      setMatchData(data);
    });

    socket.current.on("match_update", (update) => {
      setMatchData((prev) => ({
        ...prev,
        score: update.score,
        map: update.map,
        round: update.round,
      }));
    });

    socket.current.on("cheer_update", (data) => {
      setCheerCount(data.count);
      setLastCheerUser(data.user);
    });

    socket.current.on("special_event", (data) => {
      setLiveEvents((prev) => [...prev, data.message]);
      setCheerCount(0);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveEvents, cheerCount]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      username: "Você",
      message: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.current.emit("send_message", messageData);
    setNewMessage("");
  };

  const handleCheer = () => {
    socket.current.emit("send_cheer", {
      username: "Você",
      type: "furia_cheer",
    });
  };

  return (
    <ChatContainer>
      <Header>FURIA CHAT</Header>

      <LiveMatchPanel>
        {matchData ? (
          <>
            <MatchTitle>⚡ {matchData.event || "FURIA Match"}</MatchTitle>
            <MatchScore>
              {matchData.team1 || "FURIA"} {matchData?.score || "0 x 0"}{" "}
              {matchData.team2 || "Opponent"}
            </MatchScore>
            <MatchStats>
              <span>Round: {matchData.round || "1"}</span>
              <span>Map: {matchData.map || "Mirage"}</span>
            </MatchStats>
          </>
        ) : (
          <p>Carregando dados da partida...</p>
        )}
      </LiveMatchPanel>

      {cheerCount > 0 && (
        <CheerBanner>
          🔥 {cheerCount}{" "}
          {cheerCount === 1 ? "pessoa gritou" : "pessoas gritaram"}!
          {lastCheerUser && ` (${lastCheerUser} foi o último)`}
        </CheerBanner>
      )}

      <MessageList>
        {liveEvents.map((event, index) => (
          <Message key={`event-${index}`} $isBot>
            <MessageHeader>
              <Username>FURIA Bot</Username>
              <MessageTime>
                {new Date().toLocaleTimeString([], { timeStyle: "short" })}
              </MessageTime>
            </MessageHeader>
            {event}
          </Message>
        ))}

        {messages.map((msg, index) => (
          <Message key={`msg-${index}`} $isUser={msg.username === "Você"}>
            <MessageHeader>
              <Username>{msg.username}</Username>
              <MessageTime $isUser={msg.username === "Você"}>
                {msg.time}
              </MessageTime>
            </MessageHeader>
            {msg.message}
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </MessageList>

      <InputContainer onSubmit={handleSendMessage}>
        <MessageInput
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Envie um grito de guerra! 🔥"
          disabled={!isConnected}
        />
        <CheerButton
          type="button"
          onClick={handleCheer}
          disabled={!isConnected}
        >
          🔥 VAMO!
        </CheerButton>
        <SendButton type="submit" disabled={!isConnected}>
          {isConnected ? "ENVIAR" : "..."}
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
}

export default ChatPage;
