import styled from "styled-components";

export const FuriaLogo = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

export const ChatContainer = styled.div`
  width: 100%;
  max-width: 500px;
  height: 80vh;
  background: #121212;
  border-radius: 16px;
  border: 2px solid #ff5500;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(255, 85, 0, 0.3);
`;

export const ChatHeader = styled.div`
  background: linear-gradient(to right, #000000, #ff5500);
  color: white;
  padding: 15px;
  text-align: center;
  font-family: "Arial Black", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  h1 {
    margin: 0;
    font-size: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`;

export const MessageList = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #1e1e1e;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ff5500;
    border-radius: 3px;
  }
`;

export const Message = styled.div`
  margin-bottom: 15px;
  padding: 10px 15px;
  background: ${(props) => (props.isUser ? "#ff5500" : "#2a2a2a")};
  color: ${(props) => (props.isUser ? "#000" : "#fff")};
  border-radius: ${(props) =>
    props.isUser ? "15px 15px 0 15px" : "15px 15px 15px 0"};
  align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  max-width: 80%;
  word-wrap: break-word;
`;

export const UserBadge = styled.div`
  font-weight: bold;
  font-size: 0.8rem;
  color: ${(props) => (props.isUser ? "#000" : "#ff5500")};
  margin-bottom: 5px;
`;

export const Timestamp = styled.span`
  font-weight: normal;
  color: ${(props) => (props.isUser ? "#333" : "#888")};
  font-size: 0.7rem;
  margin-left: 8px;
`;

export const MessageInputContainer = styled.div`
  display: flex;
  padding: 10px;
  background: #2a2a2a;
  border-top: 1px solid #ff5500;
`;

export const MessageInput = styled.input`
  flex: 1;
  padding: 12px;
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

export const SendButton = styled.button`
  margin-left: 10px;
  padding: 0 20px;
  background: #ff5500;
  color: black;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #ff7700;
    transform: scale(1.05);
  }
`;
