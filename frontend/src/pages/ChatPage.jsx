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
`;

const MessageList = styled.div`
  height: 400px;
  overflow-y: auto;
  padding: 15px;
  margin-bottom: 15px;
  background: #1e1e1e;
  border-radius: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ff5500;
    border-radius: 3px;
  }
`;

const Message = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  background: ${(props) => (props.isBot ? "#ff550022" : "#2a2a2a")};
  color: ${(props) => (props.isBot ? "#ff5500" : "white")};
  border-radius: ${(props) =>
    props.isBot ? "5px 5px 5px 0" : "5px 5px 0 5px"};
  border-left: ${(props) => (props.isBot ? "3px solid #ff5500" : "none")};
  font-style: ${(props) => (props.isBot ? "italic" : "normal")};
`;

const LiveMatchPanel = styled.div`
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ff5500;
  color: white;
  text-align: center;
  font-family: "Arial Black", sans-serif;
`;

const MatchStats = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 8px;
  font-size: 0.9rem;
`;

const CheerBanner = styled.div`
  background: linear-gradient(to right, #ff5500, #ff9900);
  color: black;
  padding: 8px;
  text-align: center;
  margin-bottom: 10px;
  border-radius: 5px;
  font-weight: bold;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const InputForm = styled.form`
  display: flex;
  gap: 10px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 25px;
  background: #1e1e1e;
  color: white;
  outline: none;

  &::placeholder {
    color: #888;
  }
`;

const SendButton = styled.button`
  padding: 0 25px;
  background: #ff5500;
  color: black;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #ff7700;
  }
`;

const CheerButton = styled.button`
  padding: 0 20px;
  background: linear-gradient(to right, #ff5500, #ff9900);
  color: black;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background: linear-gradient(to right, #ff7700, #ffbb00);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
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

    // New cheer events
    socket.current.on("cheer_update", (data) => {
      setCheerCount(data.count);
      setLastCheerUser(data.user);
    });

    socket.current.on("special_event", (data) => {
      setLiveEvents((prev) => [...prev, data.message]);
      setCheerCount(0); // Reset after special event
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
      <h1 style={{ color: "#ff5500", textAlign: "center" }}>FURIA CHAT</h1>

      <LiveMatchPanel>
        {matchData ? (
          <>
            <h3>⚡ {matchData.event || "FURIA Match"}</h3>
            <p>
              {matchData.team1 || "FURIA"} {matchData?.score || "0 x 0"}{" "}
              {matchData.team2 || "Opponent"}
            </p>
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
          <Message key={`event-${index}`} isBot>
            🔴 {event}
          </Message>
        ))}

        {messages.map((msg, index) => (
          <Message key={`msg-${index}`}>
            <strong>{msg.username}:</strong> {msg.message}
            <span
              style={{ fontSize: "0.8rem", color: "#888", marginLeft: "10px" }}
            >
              {msg.time}
            </span>
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </MessageList>

      <InputForm onSubmit={handleSendMessage}>
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
        <SendButton
          type="submit"
          disabled={!isConnected}
          style={{
            background: !isConnected ? "#555" : "#ff5500",
            cursor: !isConnected ? "not-allowed" : "pointer",
          }}
        >
          {isConnected ? "ENVIAR" : "CONECTANDO..."}
        </SendButton>
      </InputForm>
    </ChatContainer>
  );
}

export default ChatPage;
