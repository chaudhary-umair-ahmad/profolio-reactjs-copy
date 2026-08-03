import { Typography } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Flex, Group, Heading, Icon, Image } from '../common';
import cx from 'clsx';

const { Text } = Typography;

const SuccessModalContent = ({
  successImage,
  iconStyle,
  title,
  description,
  buttons,
  image,
  className,
  titleIcon,
  maxWidth,
  align,
  textCenter = true,
  imageWidth,
  gap,
  headingClassName,
  imageStyle,
  btnStyle,
  renderContent = () => {},
  handleButtonClick = () => {},
}) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  const onClickButton = (item) => {
    if (item?.onClick) {
      item?.onClick?.();
    }
    handleButtonClick(item);
  };

  return (
    <Group className={className}>
      <Flex
        className={textCenter && 'text-center'}
        vertical
        align={align || 'center'}
        style={{ maxWidth: maxWidth || 300, marginInline: 'auto' }}
        gap={gap}
      >
        {image ? (
          <Image src={image} width={imageWidth || 254} style={{ ...imageStyle }} />
        ) : (
          <Icon icon={successImage || 'IllustrationHourglass'} size={96} style={{ ...iconStyle }} />
        )}
        <Heading as={isMobile ? 'h5' : 'h4'} className={cx('fw-700', headingClassName, titleIcon && 'align-center-v')}>
          {titleIcon && titleIcon}
          {title}
        </Heading>
        <Text type="secondary">{description}</Text>
      </Flex>

      {renderContent()}
      {buttons?.length > 0 && (
        <Group template="repeat(auto-fit, minmax(0, 1fr))">
          {buttons.map((item) => (
            <Button
              type={item?.type}
              size={!isMobile && 'large'}
              block
              style={{
                '--btn-padding-y': '0.6217em',
                ...(btnStyle && btnStyle),
              }}
              key={item?.btnText}
              onClick={() => onClickButton(item)}
              {...(item?.href && { href: item?.href })}
              disabled={item?.disabled}
              loading={item?.loading}
              {...item?.btnProps}
            >
              {item?.btnText}
            </Button>
          ))}
        </Group>
      )}
    </Group>
  );
};

export default SuccessModalContent;
