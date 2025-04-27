import { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const MessageContainer = styled.div`
  position: relative;
  background: ${(props) => (props.$isUser ? "#2a2a2a" : "#1a1a1a")};
  padding: 1rem;
  border-radius: 8px;
  margin: 0.5rem 0;
  border-left: 3px solid ${(props) => (props.$isUser ? "#ff5500" : "#333")};
  opacity: ${(props) => (props.$deleted ? 0.5 : 1)};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #ff5500;
  font-size: 0.9rem;
`;

const MessageContent = styled.div`
  word-break: break-word;
  line-height: 1.5;
  color: ${(props) => (props.$deleted ? "#666" : "#fff")};
  font-style: ${(props) => (props.$deleted ? "italic" : "normal")};
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

const ReplyIndicator = styled.div`
  background: rgba(255, 85, 0, 0.1);
  border-left: 2px solid #ff5500;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #888;
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

  const handleSaveEdit = () => {
    onEdit(message._id, editedContent);
    setIsEditing(false);
  };

  const commonEmojis = ["🔥", "❤️", "🚀", "👏", "💯", "😂", "😮", "🎉"];

  return (
    <MessageContainer
      $isUser={message.username === currentUser}
      $deleted={message.deleted}
    >
      <MessageHeader>
        <div>
          <span style={{ fontWeight: "bold" }}>{message.username}</span>
          <span style={{ marginLeft: "0.5rem", color: "#666" }}>
            {message.time}
            {message.edited && !message.deleted && " (editado)"}
          </span>
        </div>

        {!message.deleted && (
          <MessageActions>
            <ActionButton
              onClick={() => onReply(message._id)}
              title="Responder"
              aria-label="Responder"
            >
              ↪️
            </ActionButton>
            {message.username === currentUser && (
              <>
                <ActionButton
                  onClick={() => setIsEditing(!isEditing)}
                  title="Editar"
                  aria-label="Editar"
                >
                  ✏️
                </ActionButton>
                <ActionButton
                  onClick={() => onDelete(message._id)}
                  title="Excluir"
                  aria-label="Excluir"
                >
                  🗑️
                </ActionButton>
              </>
            )}
          </MessageActions>
        )}
      </MessageHeader>

      {message.deleted ? (
        <MessageContent $deleted>Mensagem excluída</MessageContent>
      ) : isEditing ? (
        <div>
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
        </div>
      ) : (
        <>
          {message.parentMessageId && (
            <ReplyIndicator>
              Respondendo a:{" "}
              {message.parentMessage?.message || "mensagem excluída"}
            </ReplyIndicator>
          )}

          <MessageContent>
            {message.message.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </MessageContent>
        </>
      )}

      {!message.deleted && (
        <ReactionsContainer>
          {commonEmojis.map((emoji) => (
            <ReactionButton
              key={emoji}
              onClick={() => onReact(message._id, emoji)}
              aria-label={`Reagir com ${emoji}`}
            >
              {emoji}{" "}
              {message.reactions?.filter((r) => r.emoji === emoji).length || 0}
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
    parentMessage: PropTypes.object,
    reactions: PropTypes.array,
  }).isRequired,
  currentUser: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onReact: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
};

export default Message;
