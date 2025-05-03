import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 85, 0, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 85, 0, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 85, 0, 0);
  }
`;

const gradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
  background: #121212;
  border-radius: 16px;
  border: 1px solid rgba(255, 85, 0, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 85, 0, 0.1);
  height: 90vh;
  max-height: 900px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(8px);
  background: rgba(30, 30, 30, 0.8);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ff5500, #ff9900, #ff5500);
    background-size: 200% 100%;
    animation: ${gradient} 3s linear infinite;
    z-index: 1;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #ff5500, #e04b00);
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 1.5rem;
  font-weight: 800;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 2;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent 25%,
      rgba(255, 255, 255, 0.1) 25%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 50%,
      transparent 75%,
      rgba(255, 255, 255, 0.1) 75%,
      rgba(255, 255, 255, 0.1)
    );
    background-size: 20px 20px;
    opacity: 0.3;
    pointer-events: none;
  }
`;

export const LiveMatchPanel = styled.div`
  background: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  margin: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 85, 0, 0.5);
  color: white;
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-out;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 85, 0, 0.1),
      transparent
    );
    transform: translateX(-100%);
    animation: shine 2s infinite;
  }

  @keyframes shine {
    100% {
      transform: translateX(100%);
    }
  }
`;

export const CheerBanner = styled.div`
  background: linear-gradient(to right, #ff5500, #ff9900);
  color: black;
  padding: 0.8rem;
  text-align: center;
  margin: 0 1rem 1rem;
  border-radius: 8px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
  box-shadow: 0 4px 10px rgba(255, 85, 0, 0.3);
  animation: ${pulse} 2s infinite;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0) 60%
    );
    transform: rotate(30deg);
    pointer-events: none;
  }
`;

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #1e1e1e;
  background-image: linear-gradient(rgba(255, 85, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 85, 0, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(#ff5500, #e04b00);
    border-radius: 4px;
  }
`;

export const InputContainer = styled.form`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #2a2a2a;
  flex-direction: column;
  border-top: 1px solid rgba(255, 85, 0, 0.2);
`;

export const MessageInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: 1px solid rgba(255, 85, 0, 0.3);
  border-radius: 8px;
  background: #1e1e1e;
  color: white;
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:focus {
    outline: none;
    border-color: #ff5500;
    box-shadow: 0 0 0 2px rgba(255, 85, 0, 0.2);
  }

  &::placeholder {
    color: #888;
    font-weight: 300;
  }
`;

const ActionButton = styled.button`
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0) 60%
    );
    transform: rotate(30deg);
    transition: all 0.3s ease;
    opacity: 0;
  }

  &:hover::after {
    opacity: 1;
    transform: rotate(30deg) translate(10%, 10%);
  }
`;

export const SendButton = styled(ActionButton)`
  background: linear-gradient(135deg, #ff5500, #e04b00);
  color: white;
  box-shadow: 0 4px 10px rgba(255, 85, 0, 0.3);

  &:hover {
    background: linear-gradient(135deg, #ff6600, #f05000);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(255, 85, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const CheerButton = styled(ActionButton)`
  background: linear-gradient(to right, #ff5500, #ff9900);
  color: black;
  box-shadow: 0 4px 10px rgba(255, 85, 0, 0.3);

  &:hover {
    background: linear-gradient(to right, #ff6600, #ffaa00);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(255, 85, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const MessageItem = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background: ${({ $isUser }) =>
    $isUser ? "rgba(255, 85, 0, 0.1)" : "rgba(30, 30, 30, 0.8)"};
  border-left: 3px solid ${({ $isUser }) => ($isUser ? "#ff5500" : "#333")};
  animation: ${fadeIn} 0.4s ease-out forwards;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  transform-origin: bottom left;

  &:hover {
    background: ${({ $isUser }) =>
      $isUser ? "rgba(255, 85, 0, 0.15)" : "rgba(40, 40, 40, 0.9)"};
    transform: translateX(4px);
  }
`;

export const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  color: ${({ $isReply }) => ($isReply ? "#ffaa00" : "#ff5500")};
`;

export const MessageUser = styled.span`
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $isReply }) => ($isReply ? "#ffaa00" : "#ff5500")};
    box-shadow: 0 0 8px ${({ $isReply }) => ($isReply ? "#ffaa00" : "#ff5500")};
  }
`;

export const MessageTime = styled.span`
  font-size: 0.75rem;
  color: #b0b0b0;
  font-weight: 300;
`;

export const MessageContent = styled.p`
  margin: 0;
  line-height: 1.6;
  font-weight: 300;
  color: ${({ $deleted }) => ($deleted ? "#666" : "#fff")};
  font-style: ${({ $deleted }) => ($deleted ? "italic" : "normal")};
`;

export const ReplyIndicator = styled.div`
  background: rgba(255, 85, 0, 0.1);
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ff5500;
  font-size: 0.9rem;
  border-left: 3px solid #ff5500;
  animation: ${slideIn} 0.3s ease-out;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #ff5500;
  cursor: pointer;
  padding: 0.2rem;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ff884d;
    transform: rotate(90deg);
  }
`;

export const MessageActions = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.3rem;
  opacity: 0;
  transition: opacity 0.2s;

  ${MessageItem}:hover & {
    opacity: 1;
  }
`;

export const ReactionButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

export const ReactionSelector = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  background: #333;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
  animation: ${fadeIn} 0.2s ease-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

export const ReactionEmoji = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.3);
  }
`;
