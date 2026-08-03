import { Typography } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { Flex, TextWithIcon } from '..';
import tenantTheme from '@theme';

const { Text } = Typography;

const IconWithSubtext = (props) => {
  const { isMobile } = useSelector((state) => state.app.AppConfig);

  const { icon, title, textSize, subText, className, justify, vertical = false, gap, style, loading, ...rest } = props;
  return (
    <Flex
      vertical={vertical}
      align="center"
      justify={justify}
      className={className}
      gap={gap || (isMobile ? '0px' : '4px')}
      {...rest}
      style={{ ...style }}
    >
      <TextWithIcon
        icon={icon || 'IconTotalCredit'}
        textSize={textSize}
        title={title}
        textColor={tenantTheme['primary-color']}
        fontWeight="700"
        style={{ alignSelf: isMobile && 'end' }}
        gap="4px"
        loading={loading}
      />
      <Text className="color-gray-dark fz-12">{subText}</Text>
    </Flex>
  );
};

export default IconWithSubtext;
