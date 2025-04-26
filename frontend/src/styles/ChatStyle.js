import styled from "styled-components";

// Container principal do chat
export const ChatContainer = styled.div`
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

// Cabeçalho
export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background: #000;
  border-bottom: 2px solid #ff5500;
  margin-bottom: 20px;
  color: #ff5500;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// Lista de mensagens
export const MessageList = styled.div`
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

export const Message = styled.div`
  padding: 12px 15px;
  background: ${(props) => (props.$isUser ? "#ff5500" : "#2a2a2a")};
  color: ${(props) => (props.$isUser ? "#000" : "#fff")};
  border-radius: ${(props) =>
    props.$isUser ? "15px 15px 0 15px" : "15px 15px 15px 0"};
  align-self: ${(props) => (props.$isUser ? "flex-end" : "flex-start")};
  max-width: 80%;
`;

export const UserBadge = styled.span`
  color: ${(props) => (props.$isUser ? "#ff5500" : "#888")};
  font-weight: bold;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 4px;
`;

export const Timestamp = styled.span`
  font-size: 0.8rem;
  color: #666;
  margin-left: 8px;
`;

export const MessageInputContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 15px;
  background: #2a2a2a;
  border-radius: 8px;
`;

export const MessageInput = styled.input`
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

export const FuriaLogo = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

export const SendButton = styled(ActionButton)`
  background: #ff5500;
  color: black;

  &:hover {
    background: #ff7700;
  }
`;

export const CheerButton = styled(ActionButton)`
  background: linear-gradient(to right, #ff5500, #ff9900);
  color: black;

  &:hover {
    background: linear-gradient(to right, #ff7700, #ffbb00);
  }
`;

export const LiveMatchPanel = styled.div`
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ff5500;
  color: white;
  text-align: center;
  font-family: "Arial Black", sans-serif;
`;
