import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const MessageContainer = styled.div`
  position: relative;
  background: ${(p) => (p.$isUser ? "#2a2a2a" : "#1a1a1a")};
  padding: 1rem;
  border-radius: 8px;
  margin: 0.5rem 0;
  border-left: 3px solid ${(p) => (p.$isUser ? "#ff5500" : "#333")};
  opacity: ${(p) => (p.$deleted ? 0.5 : 1)};
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: ${(p) => (p.$isReply ? "#ffaa00" : "#ff5500")};
`;

const MessageContent = styled.div`
  word-break: break-word;
  color: ${(p) => (p.$deleted ? "#666" : "#fff")};
  font-style: ${(p) => (p.$deleted ? "italic" : "normal")};
`;

const MessageActions = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.3rem;
  opacity: 0;
  transition: opacity 0.2s;

  &:hover {
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

  &:hover {
    background: rgba(255, 85, 0, 0.2);
    color: #ff5500;
  }
`;

const ReactionButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;

  &:hover {
    opacity: 0.7;
  }
`;

const ReplyIndicator = styled.div`
  background-color: rgba(255, 165, 0, 0.1);
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #ffaa00;
  border-left: 3px solid #ffaa00;
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
  const [showReactions, setShowReactions] = useState(false);
  const reactionSelectorRef = useRef(null);

  const commonEmojis = ["🔥", "❤️", "🚀", "👏", "💯", "😂", "😮", "🎉"];

  const handleSaveEdit = () => {
    if (typeof onEdit === "function") {
      onEdit(message._id, editedContent);
      setIsEditing(false);
    }
  };

  const handleReactionClick = (emoji) => {
    if (typeof onReact === "function") {
      onReact(message._id, emoji);
      setShowReactions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reactionSelectorRef.current &&
        !reactionSelectorRef.current.contains(event.target)
      ) {
        setShowReactions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderReactions = () => {
    const reactionCounts = {};
    message.reactions.forEach((r) => {
      reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1;
    });

    return Object.entries(reactionCounts).map(([emoji, count]) => (
      <ReactionButton
        key={emoji}
        onClick={() => onReact(message._id, emoji)}
        aria-label={`Reagir com ${emoji}`}
      >
        {emoji}
        <span>{count}</span>
      </ReactionButton>
    ));
  };

  return (
    <MessageContainer
      $isUser={message.username === currentUser}
      $deleted={message.deleted}
    >
      <MessageHeader $isReply={Boolean(message.parentMessageId)}>
        <div>
          <span>{message.username}</span>
          <span
            style={{ marginLeft: "0.5rem", color: "#666", fontSize: "0.8rem" }}
          >
            {new Date(message.createdAt).toLocaleTimeString()}
            {message.edited && " (editado)"}
          </span>
        </div>

        {!message.deleted && (
          <MessageActions>
            <ActionButton
              onClick={() =>
                typeof onReply === "function" && onReply(message._id)
              }
            >
              ↩
            </ActionButton>
            {message.username === currentUser && (
              <>
                <ActionButton onClick={() => setIsEditing(!isEditing)}>
                  ✏️
                </ActionButton>
                <ActionButton
                  onClick={() =>
                    typeof onDelete === "function" && onDelete(message._id)
                  }
                >
                  🗑️
                </ActionButton>
              </>
            )}
            <ActionButton onClick={() => setShowReactions(!showReactions)}>
              😊
            </ActionButton>
          </MessageActions>
        )}
      </MessageHeader>
      {message.parentMessageId && (
        <ReplyIndicator>
          Respondendo a: <b>{message.parentMessageId.username}</b>
          <br />
          <div
            style={{
              marginLeft: "10px",
              fontStyle: "italic",
              color: "#888",
              fontSize: "0.9em",
            }}
          >
            "{message.parentMessageId.message}"
          </div>
        </ReplyIndicator>
      )}

      {message.deleted ? (
        <MessageContent $deleted>Mensagem excluída</MessageContent>
      ) : isEditing ? (
        <>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            style={{
              width: "100%",
              minHeight: "60px",
              background: "#333",
              color: "white",
            }}
          />
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <ActionButton onClick={handleSaveEdit}>Salvar</ActionButton>
            <ActionButton onClick={() => setIsEditing(false)}>
              Cancelar
            </ActionButton>
          </div>
        </>
      ) : (
        <MessageContent>
          {message.message.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </MessageContent>
      )}
      {renderReactions()}

      {showReactions && (
        <div
          ref={reactionSelectorRef}
          style={{
            position: "absolute",
            bottom: "100%",
            right: 0,
            background: "#333",
            padding: "0.5rem",
            borderRadius: "8px",
            display: "flex",
            gap: "0.5rem",
            zIndex: 10,
          }}
        >
          {commonEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReactionClick(emoji)}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </MessageContainer>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    edited: PropTypes.bool,
    deleted: PropTypes.bool,
    parentMessageId: PropTypes.shape({
      username: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      createdAt: PropTypes.string,
    }),
    reactions: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
        emoji: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  currentUser: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onReact: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
};

export default Message;
