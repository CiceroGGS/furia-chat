import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const MessageContainer = styled.div`
  position: relative;
  background: ${(p) => (p.$isUser ? "#2a2a2a" : "#1a1a1a")};
  padding: 1rem;
  border-radius: 8px;
  margin: 0.5rem 0;
  border-left: 3px solid ${(p) => (p.$isUser ? "#ff5500" : "#333")};
  opacity: ${(p) => (p.$deleted ? 0.5 : 1)};
  transition: all 0.2s ease;

  ${({ $isReply }) =>
    !$isReply &&
    `
      /* Estilos específicos para mensagens NÃO respondidas */
      border-left: 3px solid #555; /* Uma cor diferente para mensagens normais */
      /* background: #222; /* Um background ligeiramente diferente se desejar */
    `}

  ${({ $isReply }) =>
    $isReply &&
    `
      background: rgba(30, 30, 30, 0.9);
      border-left: 3px solid #ffaa00;
      margin-left: 2rem;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        left: -1.5rem;
        top: 50%;
        height: 2px;
        width: 1rem;
        background: #ff5500;
        opacity: 0.5;
      }
    `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
`;

const ReplyBadge = styled.div`
  position: absolute;
  top: -12px;
  left: ${(p) => (p.$isUser ? "auto" : "1rem")};
  right: ${(p) => (p.$isUser ? "1rem" : "auto")};
  background: #ff5500;
  color: white;
  padding: 0.2rem 0.8rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ReplyQuote = styled.div`
  background: rgba(35, 35, 35, 0.8);
  border-left: 3px solid #ffaa00;
  padding: 0.5rem;
  margin-bottom: 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #aaa;
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;

  ${({ $isReply }) =>
    $isReply &&
    `
      color: #ffaa00;
      font-size: 0.9rem;
    `}

  ${({ $isReply }) =>
    !$isReply &&
    `
      color: #ff5500;
      font-size: 1rem;
    `}
`;

const MessageContent = styled.div`
  word-break: break-word;
  line-height: 1.5;
  color: ${(p) => (p.$deleted ? "#666" : "#fff")};
  font-style: ${(p) => (p.$deleted ? "italic" : "normal")};

  ${({ $isReply }) =>
    $isReply &&
    `
      font-size: 0.9rem;
      color: #e0e0e0;
    `}
`;

const MessageActions = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.3rem;
  opacity: 0;
  transition: opacity 0.2s;

  ${MessageContainer}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: rgba(255, 85, 0, 0.1);
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 4px;
  display: flex;
  align-items: center;

  &:hover {
    background: rgba(255, 85, 0, 0.2);
    color: #ff5500;
  }
`;

const ReactionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.8rem;
  flex-wrap: wrap;
`;

const ReactionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 15px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 85, 0, 0.2);
    transform: scale(1.1);
  }
`;

const EditTextarea = styled.textarea`
  width: 100%;
  background: #333;
  border: 1px solid #ff5500;
  border-radius: 4px;
  color: white;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-family: inherit;
`;

const ReactionSelectorContainer = styled.div`
  position: absolute;
  bottom: 20px; /* Ajuste a posição conforme necessário */
  left: 50%;
  transform: translateX(-50%);
  background: rgba(30, 30, 30, 0.9);
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  gap: 0.5rem;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const ReactionSelectorButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  outline: none;

  &:hover {
    transform: scale(1.2);
  }
`;

const ReactionTriggerButton = styled(ActionButton)`
  /* Estilos específicos para o botão de reação */
  font-size: 1rem;
  padding: 0.3rem 0.5rem;
`;

const Message = ({
  message,
  currentUser,
  onEdit,
  onDelete,
  onReact,
  onReply,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.message);
  const isReply = Boolean(message.parentMessageId);
  const [showReactions, setShowReactions] = useState(false);
  const reactionSelectorRef = useRef(null);
  const reactionTriggerRef = useRef(null);

  const commonEmojis = ["🔥", "❤️", "🚀", "👏", "💯", "😂", "😮", "🎉"];

  const handleSaveEdit = () => {
    onEdit(message._id, editedContent);
    setIsEditing(false);
  };

  const handleReactionClick = (emoji) => {
    onReact(message._id, emoji);
    setShowReactions(false);
  };

  const toggleReactions = () => {
    setShowReactions(!showReactions);
  };

  // Fechar o seletor de reações ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showReactions &&
        reactionSelectorRef.current &&
        !reactionSelectorRef.current.contains(event.target) &&
        reactionTriggerRef.current &&
        !reactionTriggerRef.current.contains(event.target)
      ) {
        setShowReactions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReactions, reactionSelectorRef, reactionTriggerRef]);

  return (
    <MessageContainer
      $isUser={message.username === currentUser}
      $deleted={message.deleted}
      $isReply={isReply}
    >
      {isReply && (
        <ReplyBadge $isUser={message.username === currentUser}>
          Respondendo
        </ReplyBadge>
      )}

      {isReply && message.parentMessagePreview && (
        <ReplyQuote>
          <b>{message.parentMessagePreview.username}:</b>{" "}
          {message.parentMessagePreview.message.substring(0, 50)}
          {message.parentMessagePreview.message.length > 50 ? "..." : ""}
        </ReplyQuote>
      )}

      <MessageHeader $isReply={isReply}>
        <div>
          <span style={{ fontWeight: "bold" }}>{message.username}</span>
          <span
            style={{ marginLeft: "0.5rem", color: "#666", fontSize: "0.8rem" }}
          >
            {message.time}
            {message.edited && !message.deleted && " (editado)"}
          </span>
        </div>

        {!message.deleted && (
          <MessageActions>
            <ActionButton onClick={() => onReply(message._id)}>↪</ActionButton>
            {message.username === currentUser && (
              <>
                <ActionButton onClick={() => setIsEditing(!isEditing)}>
                  ✏️
                </ActionButton>
                <ActionButton onClick={() => onDelete(message._id)}>
                  🗑️
                </ActionButton>
              </>
            )}
            <ReactionTriggerButton
              onClick={toggleReactions}
              ref={reactionTriggerRef}
            >
              {showReactions ? "×" : "😊"}{" "}
              {/* Use um emoji de sorriso ou outro ícone */}
            </ReactionTriggerButton>
          </MessageActions>
        )}
      </MessageHeader>

      {message.deleted ? (
        <MessageContent $deleted $isReply={isReply}>
          Mensagem excluída
        </MessageContent>
      ) : isEditing ? (
        <>
          <EditTextarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSaveEdit();
              }
            }}
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <ActionButton onClick={handleSaveEdit}>Salvar</ActionButton>
            <ActionButton onClick={() => setIsEditing(false)}>
              Cancelar
            </ActionButton>
          </div>
        </>
      ) : (
        <MessageContent $isReply={isReply}>
          {message.message.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </MessageContent>
      )}

      {showReactions && (
        <ReactionSelectorContainer ref={reactionSelectorRef}>
          {commonEmojis.map((emoji) => (
            <ReactionSelectorButton
              key={emoji}
              onClick={() => handleReactionClick(emoji)}
            >
              {emoji}
            </ReactionSelectorButton>
          ))}
        </ReactionSelectorContainer>
      )}

      {message.reactions && message.reactions.length > 0 && !showReactions && (
        <ReactionsContainer>
          {message.reactions
            .reduce((acc, reaction) => {
              const existing = acc.find((r) => r.emoji === reaction.emoji);
              if (existing) {
                existing.count++;
              } else {
                acc.push({ emoji: reaction.emoji, count: 1 });
              }
              return acc;
            }, [])
            .map((reactedEmoji) => (
              <ReactionButton key={reactedEmoji.emoji}>
                {reactedEmoji.emoji} {reactedEmoji.count}
              </ReactionButton>
            ))}
        </ReactionsContainer>
      )}
    </MessageContainer>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    time: PropTypes.string,
    edited: PropTypes.bool,
    deleted: PropTypes.bool,
    parentMessageId: PropTypes.string,
    parentMessagePreview: PropTypes.shape({
      username: PropTypes.string,
      message: PropTypes.string,
    }),
    reactions: PropTypes.array,
  }).isRequired,
  currentUser: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onReact: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
};

export default Message;
