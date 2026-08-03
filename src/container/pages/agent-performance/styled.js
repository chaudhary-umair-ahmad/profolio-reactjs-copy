import styled from 'styled-components';
import { Button } from 'antd';

export const CardShell = styled.div`
  background: #fff;
  border-radius: ${(props) => (props.$isMobile ? '0' : '12px')};
  padding: ${(props) => (props.$isMobile ? '16px' : props.$padding || '16px')};
  box-shadow:
    0 14px 40px rgba(15, 23, 42, 0.03),
    0 2px 4px rgba(15, 23, 42, 0.02);
  width: 100%;
  height: ${(props) => (props.$isMobile ? 'auto' : '100%')};
  display: flex;
  flex-direction: column;
  min-height: 0;
  ${(props) =>
    props.$isMobile &&
    `
    border-left: none;
    border-right: none;
  `}
`;

export const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  ${(props) => props.$isMobile && 'margin-top: 12px;'}
`;

export const ActivityTitle = styled.h3`
  margin: 0;
  font-weight: 700;
  color: #222222;
`;

export const HowToEarnButton = styled.a`
  color: #006169;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #0e8073;
    text-decoration: underline;
  }
`;

export const ActivityListWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: ${(props) => (props.$isMobile ? 'unset' : '1')};
  min-height: 0;
`;

export const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  ${(props) => props.$isMobile && 'padding-top: 12px;'}

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const ActivityFadeOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 1) 100%
  );
  pointer-events: none;
  z-index: 2;
`;

export const ActivityIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(props) => props.$bgColor};
`;

export const ActivityContent = styled.div`
  flex: 1;
  background: #fff;
  border: 1px solid #f5f5f5;
  border-radius: 12px;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: ${(props) => (props.$isMobile ? '72px' : '63px')};
`;

export const ActivityDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

export const ActivityTitleText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #222222;
`;

export const ActivityDate = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #707070;
  font-weight: 500;
`;

export const PointsValue = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: #222222;
`;

export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 24px;
`;

export const EmptyStateIconWrapper = styled.div`
  width: 120px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffd700;
  font-size: 60px;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #222222;
  margin: 0;
`;

export const EmptyStateDescription = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #626262;
  margin: 0;
  max-width: 293px;
`;

export const EmptyStateButton = styled.button`
  background: #f2fafa;
  border: 1px solid #ccdfe1;
  color: #006169;
  font-size: 12px;
  font-weight: 700;
  padding: 11px 36px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e6f5f5;
    border-color: #b3d4d6;
  }
`;

export const BadgeCard = styled.div`
  position: relative;
  background: #fff;
  border-radius: ${(props) => (props.$isMobile ? '0' : '12px')};
  padding: ${(props) => (props.$isMobile ? '12px' : '20px 16px')};
  box-shadow:
    0 14px 40px rgba(15, 23, 42, 0.03),
    0 2px 4px rgba(15, 23, 42, 0.02);
  flex: ${(props) => (props.$isMobile ? 'unset' : '1 1 0%')};
  min-width: 0;
  height: ${(props) => (props.$isMobile && props.$isLast ? '180px' : props.$isMobile ?  '230px' : '215px')};
  display: flex;
  flex-direction: column;

  justify-content: space-between;
  ${(props) =>
    props.$isMobile &&
    `
    border-left: none;
    border-right: none;
    width: 100%;
  `}
`;

export const StatusTick = styled.div`
  border-radius: ${(props) => (props.$isMobile ? '4px' : '6px')};
  display: grid;
  place-items: center;
`;

export const TitlePill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => (props.$isMobile ? '8px' : '10px')};
  border-radius: 6px;
  padding: 8px 16px 8px 12px;
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.1);
`;

export const PillText = styled.span`
  font-weight: 700;
  font-size: 14px;
  color: rgba(34, 34, 34, 1);
`;

export const DescText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: ${(props) => (props.$isMobile ? '18px' : '20px')};
  color: rgba(112, 112, 112, 1);
  flex: 1 1 auto;
  display: inline;
`;

export const LearnMore = styled.a`
  color: #0093cb;
  font-weight: 700;
  font-size: 12px;
  text-decoration: underline;
  align-self: center;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }
`;

export const MetricsGrid = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.$isMobile ? 'column' : 'row')};
  gap: 16px;
  grid-template-columns: ${(props) => (props.$isMobile ? '1fr' : props.$columns || '1fr')};
`;

export const MetricHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: ${(props) => (props.$isMobile ? '9px' : '10px')};
`;

export const MetricLabel = styled.span`
  font-size: ${(props) => (props.$isMobile ? '14px' : '12px')};
  line-height: ${(props) => (props.$isMobile ? '14px' : '16px')};
  color: #222222;
  font-weight: 500;
  ${(props) => props.$isMobile && 'white-space: nowrap;'}
`;

export const MetricValue = styled.span`
  font-size: ${(props) => (props.$isMobile ? '18px' : '16px')};
  line-height: ${(props) => (props.$isMobile ? '16px' : '18px')};
  font-weight: 800;
  color: #222222;
`;

export const Track = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 999px;
`;

export const Fill = styled.div`
  height: 100%;
  border-radius: 999px;
  transition: width 220ms ease;
  width: ${(props) => props.$percent}%;
  background: ${(props) => props.$color};
`;

export const DrawerHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #ffffff;
  padding: ${(props) => (props.$isMobile ? '16px 20px' : '32px 20px')};
  border-bottom: 1px solid #f0f0f0;
`;

export const DrawerTitle = styled.h2`
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
`;

export const DrawerContentWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const DrawerContent = styled.div.attrs((props) => ({
  ...props,
}))`
  padding: ${(props) => (props.$isMobile ? '20px 16px' : '20px')};
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const DrawerFadeOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 1) 100%
  );
  pointer-events: none;
  z-index: 2;
`;

export const LeaderboardTableWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const LeaderboardTableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const LeaderboardFadeOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 1) 100%
  );
  pointer-events: none;
  z-index: 2;
`;

export const BadgeSection = styled.div`
  background: ${(props) => props.$background || '#f2fafa'};
  border-radius: 8px;
  padding: 12px;
`;

export const BadgeSectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1f1f1f;
`;

export const BadgeSectionDescription = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: #222222;
`;

export const RequirementsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RequirementItem = styled.li`
  font-size: 12px;
  line-height: 20px;
  color: #1f1f1f;
  padding-left: 20px;
  position: relative;

  [dir='rtl'] & {
    padding-left: 0;
    padding-right: 20px;
  }
`;

export const BadgeImageContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

export const TruPointsSection = styled.div`
  background: #f7fcfc;
  border-radius: 12px;
  padding: 20px;
`;

export const TruPointsTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #1f1f1f;
`;

export const TruPointsDescription = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: #4f4f4f;
`;

export const TruPointsSubtitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 700;
  color: #1f1f1f;
`;

export const TruPointsListItem = styled.li`
  font-size: 14px;
  line-height: 20px;
  color: #1f1f1f;
  padding-left: 20px;
  position: relative;

  &::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: #0e8073;
    font-weight: bold;
  }
`;

export const LeaderboardCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => (props.$isMobile ? '12px' : '5px')};
`;

export const LeaderboardTitle = styled.h3`
  margin: 0;
  font-size: ${(props) => (props.$isMobile ? '15px' : '16px')};
  font-weight: 700;
  color: #222222;
`;

export const ViewLeaderboardButton = styled.a`
  color: #006169;
  font-size: ${(props) => (props.$isMobile ? '13px' : '14px')};
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
  min-height: ${(props) => (props.$isMobile ? '36px' : '44px')};
  display: inline-flex;
  align-items: center;

  &:hover {
    color: #0a6158;
    text-decoration: underline;
  }
`;

export const CurrentUserCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f2fafa;
  border-radius: 8px;
  padding: ${(props) => (props.$isMobile ? '16px 12px 16px 12px' : '16px')};
`;

export const UserLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #e6f7ff;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #006169;
  margin-bottom: 2px;
`;

export const UserPosition = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #006169;
  margin-bottom: 6px;
`;

export const UserPoints = styled.div`
  font-size: 12px;
  color: #222222;
  font-weight: 500;

  span {
    font-weight: 500;
  }
`;

export const ProfileHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: ${(props) => props.theme?.token?.colorBgContainer || '#ffffff'};
  border-radius: 12px;
  box-shadow: ${(props) => props.theme?.boxShadowSecondary || 'none'};
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 991px) {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    padding: 12px;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  @media (max-width: 400px) {
    padding: 10px;
    gap: 10px;
  }
`;

export const UserCardSection = styled.div`
  min-width: 0;
  flex: 1;
  max-width: 100%;
  margin: 0;

  @media (max-width: 991px) {
    gap: 10px;
    width: 100%;
    flex: unset;
  }
`;

export const ProfileUserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background: ${(props) => props.theme?.token?.colorPrimaryBg || '#f0f0f0'};
  flex-shrink: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .ant-avatar {
    width: 100% !important;
    height: 100% !important;
    line-height: 64px !important;
    font-size: 24px !important;
  }

  @media (max-width: 991px) {
    .ant-avatar {
      width: 100% !important;
      height: 100% !important;
      line-height: 56px !important;
      font-size: 20px !important;
    }
  }

  @media (max-width: 400px) {
    .ant-avatar {
      width: 100% !important;
      height: 100% !important;
      line-height: 48px !important;
      font-size: 18px !important;
    }
  }
`;

export const ProfileUserInfo = styled.div`
  min-width: 0;
  flex: 1;
  max-width: 100%;
  overflow: hidden;
  margin: 0;

  @media (max-width: 991px) {
    width: 100%;
    gap: 6px;
  }
`;

export const ProfileUserName = styled.h3`
  margin: 0;
  font-size: 24px;
  line-height: 28px;
  font-weight: 600;
  color: ${(props) => props.theme?.token?.colorText || 'rgba(34, 34, 34, 1)'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 991px) {
    font-size: 16px;
    line-height: 24px;
  }

  @media (max-width: 400px) {
    font-size: 16px;
    line-height: 22px;
  }
`;

export const PublicProfileLink = styled.a`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #005158;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
    color: #005158;
  }
`;

export const StatsPanel = styled.div`
  flex: 0 0 auto;
  min-width: 0;
  justify-content: flex-start;

  @media (max-width: 991px) {
    flex: 1 !important;
    width: 100% !important;
    gap: 8px !important;
    flex-direction: row !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
  }

  @media (max-width: 400px) {
    gap: 6px !important;
  }
`;

export const StatTile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  min-height: 64px;
  min-width: 260px;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid rgba(240, 240, 240, 1);
  border-radius: 8px;

  @media (max-width: 991px) {
    flex: 1 1 0% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    padding: 10px 11.5px !important;
    min-height: auto !important;
    gap: 6px !important;
    margin: 0 !important;
    box-sizing: border-box !important;
    border-radius: 8px;
    flex-direction: column !important;
    align-items: flex-start !important;
  }
`;

export const TileLeft = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  margin: 0;
  background: transparent;
  border: 0;
  cursor: pointer;
  flex: 1;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;

  &:hover {
    transform: translateY(-1px);
  }

  @media (max-width: 991px) {
    gap: 6px !important;
    min-width: 0 !important;
    max-width: 100% !important;
    width: 100% !important;
  }
`;

export const IconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #fff8e2;
  color: #faad14;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  @media (max-width: 991px) {
    border-radius: 8px;
    margin-right: 12px;
    overflow: visible;
  }

  @media (max-width: 400px) {
    border-radius: 6px;
    margin-right: 10px;
  }
`;

export const StatLabel = styled.span`
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  color: ${(props) => props.theme?.token?.colorTextSecondary || 'rgba(79, 79, 79, 1)'};
  max-width: 80%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-align: left;

  @media (max-width: 991px) {
    font-size: 11px;
    line-height: 14px;
  }

  @media (max-width: 400px) {
    font-size: 10px;
    line-height: 12px;
  }
`;

export const StatValue = styled.div`
  font-size: 22px;
  line-height: 28px;
  font-weight: 800;
  letter-spacing: -0.2px;
  color: ${(props) => props.theme?.token?.colorText || 'rgba(34, 34, 34, 1)'};
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 991px) {
    font-size: 18px;
    line-height: 22px;
  }

  @media (max-width: 400px) {
    font-size: 16px;
    line-height: 20px;
  }
`;

export const TileLink = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  color: #006169;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 991px) {
    font-size: 12px !important;
    line-height: 16px !important;
    gap: 4px;
    align-self: flex-start;
    margin-top: 2px;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
`;

export const TruBrokerBannerContainer = styled.div`
  width: 100%;
  margin-left: 0;
  margin-right: 0;
  border-radius: ${(props) => (props.$isMobile ? '0' : '12px')};
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  padding: ${(props) => (props.$isMobile ? '16px 12px' : '25px 40px 25px 16px')};
  ${(props) =>
    props.$isMobile &&
    `
    border-left: none;
    border-right: none;
  `}

  background: ${(props) =>
    props.$isUnlocked
      ? 'linear-gradient(135deg, rgba(110, 192, 219, 0.22) 0%, rgba(218, 255, 253, 0.22) 49.4%, rgba(29, 151, 108, 0.22) 100%)'
      : '#fbfbfb'};

  [dir='rtl'] & {
    background: ${(props) =>
      props.$isUnlocked
        ? 'linear-gradient(225deg, rgba(110, 192, 219, 0.22) 0%, rgba(218, 255, 253, 0.22) 49.4%, rgba(29, 151, 108, 0.22) 100%)'
        : '#fbfbfb'};
  }
`;

export const BannerContent = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.$isMobile ? 'column' : 'row')};
  align-items: ${(props) => (props.$isMobile ? 'flex-start' : 'center')};
  justify-content: space-between;
  gap: ${(props) => (props.$isMobile ? '0px' : '24px')};
`;

export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.$isMobile ? '8px' : '12px')};
  min-width: 0;
  width: 100%;
`;

export const BannerTitle = styled.h2`
  font-weight: 500;
  font-style: normal;
  font-size: ${(props) => (props.$isMobile ? '20px' : '32px')};
  line-height: ${(props) => (props.$isMobile ? '1.3' : '140%')};
  letter-spacing: 0%;
  color: #1f1f1f;
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${(props) => (props.$isMobile ? '8px' : '12px')};
  flex-wrap: wrap;
`;

export const TitleWithLock = styled.h2`
  font-size: ${(props) => (props.$isMobile ? '20px' : '28px')};
  line-height: 1.2;
  color: #1f1f1f;
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${(props) => (props.$isMobile ? '10px' : '16px')};
  flex-wrap: wrap;
`;

export const LockIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.$isMobile ? '28px' : '32px')};
  height: ${(props) => (props.$isMobile ? '28px' : '32px')};
  background: #f5f5f5;
  border-radius: 6px;
  flex-shrink: 0;

  img {
    width: 18px;
    height: 18px;
    display: block;
    object-fit: contain;
  }
`;

export const Description = styled.p`
  font-weight: 400;
  font-size: ${(props) => (props.$isMobile ? '12px' : '14px')};
  line-height: ${(props) => (props.$isMobile ? '1.4' : '1.5')};
  color: #4f4f4f;
  margin: 0;
`;

export const GoalPointsSection = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  flex-wrap: ${(props) => (props.$isMobile ? 'wrap' : 'nowrap')};
`;

export const StreakBadge = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
  height: 36px;
  background: #ffffff;
  border: 1px solid ${(props) => (props.$isMobile ? '#A6C8CA' : '#F0F0F0')};
  border-radius: 8px;
  padding: ${(props) => (props.$isMobile ? '4px 8px' : '8px 12px')};
`;

export const StreakNumber = styled.span`
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
  color: #1f1f1f;
  display: flex;
  align-items: center;
`;

export const StreakText = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 1;
  color: #707070;
  display: flex;
  align-items: center;
`;

export const ModalHeaderWrapper = styled.div`
  background: linear-gradient(135deg, #f2fafa 0%, #e6f5f5 100%);
  padding: ${(props) => (props.$isMobile ? '16px 20px' : '20px 24px')};
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1f1f1f;
  margin: 0;
`;

export const ModalCloseButton = styled.button`
  appearance: none;
  border: 1px solid #d9d9d9;
  background: #fff;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #595959;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 12px;

  &:hover {
    background: #fafafa;
    color: #262626;
  }
`;

export const ModalInfoBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border-radius: 8px;
  margin: ${(props) => (props.$isMobile ? '20px 16px 0px 16px' : '12px 24px')};
`;

export const TasksGrid = styled.div`
  display: grid;
  grid-template-columns: ${(props) => (props.$isMobile ? '1fr' : 'repeat(2, 1fr)')};
  gap: ${(props) => (props.$isMobile ? '10px' : '12px')};
  padding: ${(props) => (props.$isMobile ? '20px 16px 16px 16px' : '0 24px 20px 24px')};
`;

export const TaskCard = styled.div`
  background: ${(props) => (props.$highlighted ? 'rgba(242, 250, 250, 0.5)' : '#fff')};
  border: 1px solid ${(props) => (props.$highlighted ? '#ddeaeb' : '#f0f0f0')};
  border-radius: 8px;
  padding: ${(props) => (props.$isMobile ? '12px' : '16px')};
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.$isMobile ? '8px' : '10px')};
`;

export const TaskIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$bgColor};
`;

export const TaskPoints = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #2b7b82;
`;

export const TaskTitle = styled.p`
  font-size: ${(props) => (props.$isMobile ? '13px' : '14px')};
  font-weight: 500;
  color: #222222;
  margin: 0;
  line-height: ${(props) => (props.$isMobile ? '1.3' : '1.35')};
`;

export const TruPointsButton = styled(Button)`
  height: 48px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 8px;
  border-color: #ccdfe1;
  background-color: #ffffff;
  color: #006169;
  transition: all 0.3s ease;

  &:hover,
  &:focus {
    background-color: #f2fafa;
    border-color: #006169;
    color: #006169;
  }

  &:active {
    background-color: #e8f5fb;
    border-color: #006169;
    color: #006169;
  }
`;
