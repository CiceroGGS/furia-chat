import styled from "styled-components";

const AchievementBadgeContainer = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  display: flex;
  gap: 8px;
`;

const Badge = styled.div`
  background: #ff5500;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  position: relative;
  cursor: pointer;

  &:hover span {
    visibility: visible;
  }
`;

const Tooltip = styled.span`
  visibility: hidden;
  background: #000;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 4px 8px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
`;

const AchievementBadge = ({ achievements }) => (
  <AchievementBadgeContainer>
    {achievements.map((ach, index) => (
      <Badge key={index}>
        {ach}
        <Tooltip>Conquista desbloqueada!</Tooltip>
      </Badge>
    ))}
  </AchievementBadgeContainer>
);

export default AchievementBadge;
