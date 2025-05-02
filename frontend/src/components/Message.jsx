import React, { useState } from "react";
import styled from "styled-components";

const Message = ({ message, currentUser, onReply, onEdit, onReact }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.message);
  const isCurrentUser = message.username === currentUser;

  const handleSaveEdit = () => {
    onEdit(message._id, editedContent);
    setIsEditing(false);
  };

  return (
    <MessageContainer $isCurrentUser={isCurrentUser}>
      {message.parentMessageId && (
        <ReplyPreview>
          ↪ {message.parentMessagePreview?.message?.substring(0, 30)}...
        </ReplyPreview>
      )}
      <MessageInfo>
        <Username $isCurrentUser={isCurrentUser}>{message.username}:</Username>
        {isEditing ? (
          <EditInput
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        ) : (
          <Content $isCurrentUser={isCurrentUser}>{message.message}</Content>
        )}
        <Timestamp>{message.time}</Timestamp>
      </MessageInfo>
      <Actions>
        {!isEditing && (
          <>
            <ReplyButton onClick={() => onReply(message._id, message)}>
              {" "}
              {/* Garanta que está chamando corretamente */}
              Responder
            </ReplyButton>
            {isCurrentUser && (
              <EditButton
                onClick={() => {
                  setIsEditing(true);
                  setEditedContent(message.message);
                }}
              >
                Editar
              </EditButton>
            )}
          </>
        )}
        {isEditing && (
          <>
            <SaveButton onClick={handleSaveEdit}>Salvar</SaveButton>
            <CancelButton onClick={() => setIsEditing(false)}>
              Cancelar
            </CancelButton>
          </>
        )}
        <ReactionButton onClick={() => onReact(message._id, "👍")}>
          👍
        </ReactionButton>
        <ReactionButton onClick={() => onReact(message._id, "❤️")}>
          ❤️
        </ReactionButton>
      </Actions>
    </MessageContainer>
  );
};

const MessageContainer = styled.div`
  background-color: ${(props) =>
    props.$isCurrentUser ? "#dcf8c6" : "#f0f0f0"};
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 8px;
  word-break: break-word;
  align-self: ${(props) => (props.$isCurrentUser ? "flex-end" : "flex-start")};
  max-width: 80%;
`;

const MessageInfo = styled.div`
  display: flex;
  align-items: baseline;
`;

const Username = styled.span`
  font-weight: bold;
  margin-right: 5px;
  color: ${(props) => (props.$isCurrentUser ? "#4caf50" : "#2196f3")};
`;

const Content = styled.p`
  margin: 0;
  color: #333;
`;

const EditInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 5px;
  flex-grow: 1;
`;

const Timestamp = styled.span`
  font-size: 0.7rem;
  color: #777;
  margin-left: 10px;
`;

const Actions = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 5px;
`;

const ReplyPreview = styled.div`
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 3px;
`;

const ReplyButton = styled.button`
  background: none;
  border: none;
  color: #2196f3;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 3px 6px;
  border-radius: 5px;
  &:hover {
    background-color: #e0f7fa;
  }
`;

const EditButton = styled(ReplyButton)`
  color: #f44336;
  &:hover {
    background-color: #ffebee;
  }
`;

const SaveButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  &:hover {
    background-color: #d32f2f;
  }
`;

const ReactionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 3px;
`;

export default Message;
