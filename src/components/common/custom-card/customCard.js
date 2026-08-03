import tenantTheme from '@theme';
import { Card } from 'antd';
import cx from 'clsx';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Flex, Icon, LinkWithIcon, Text } from '..';
import { CardMetaStyled } from '../../../container/pages/user-settings/style';
import { IconSwitch } from '../../svg';

const CustomCard = ({
  avatarIcon,
  title,
  description,
  link,
  hideExternalLink = false,
  disabled,
  cardBackground,
  iconProps,
  titleClass,
  isVerified,
  borderWidth = 1,
  iconSize = 32,
  onClick = () => {},
  internalLink,
  cardPadding,
  cardStyle,
  className,
  key,
  anchorClass = '',
  anchorStyle = true,
  extraContent = null,
  alignItems,
  descriptionStyles,
  borderColor,
  textStyle,
  gap,
  fontSize,
  cursor,
}) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const renderCard = () => {
    return (
      <Card
        className={cx('mb-8', className)}
        style={{ borderColor: borderColor, borderWidth: borderWidth, backgroundColor: cardBackground, cursor: cursor, ...cardStyle }}
        styles={{ body: { padding: cardPadding || 16 } }}
        disabled={disabled}
        onClick={onClick}
        key={key}
      >
        <Flex justify="space-between" align={alignItems || 'center'} gap={gap || '20px'}>
          <CardMetaStyled
            className="p-0 profile-card"
            style={{ alignItems: 'center' }}
            avatar={
              avatarIcon ? <Icon size={iconSize} icon={avatarIcon} iconProps={iconProps ? iconProps : {}} /> : null
            }
            title={
              title ? (
                <Flex
                  gap="8px"
                  align="center"
                  className={cx(
                    titleClass ? titleClass : 'fw-600',
                    fontSize ? `fz-${fontSize}` : !textStyle && (isMobile ? 'fz-12' : 'fz-14')
                  )}
                  style={{
                    ...(textStyle || {}),
                    ...(!textStyle && { color: isVerified ? tenantTheme['primary-color'] + 'aa' : '' }),
                  }}
                >
                  {title}
                </Flex>
              ) : null
            }
            description={
              description ? (
                <div className="color-gray-dark fz-12" style={descriptionStyles}>
                  {description}
                </div>
              ) : null
            }
          />
          {extraContent && extraContent}
        </Flex>
      </Card>
    );
  };

  return link ? (
    internalLink ? (
      <Link to={link} style={{ cursor: cursor || 'pointer' }}>{renderCard()} </Link>
    ) : (
      <a style={anchorStyle ? { width: '100%', cursor: cursor || 'pointer' } : { cursor: cursor || 'pointer' }} className={anchorClass} href={link} target="_blank" rel="noopener noreferrer">
        {renderCard()}
      </a>
    )
  ) : (
    renderCard()
  );
};

export default CustomCard;
