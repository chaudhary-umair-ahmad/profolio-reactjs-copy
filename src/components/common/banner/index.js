import tenantTheme from '@theme';
import { Typography } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getBaseURL, TENANT_KEY } from '../../../utility/env';
import { Button } from '../button/button';
import Flex from '../flex';
import Group from '../group/group';
import TextWithIcon from '../textWithIcon/textWithIcon';
import { BannerStyled } from './styled';

const { Title, Text } = Typography;

const Banner = (props) => {
  const {
    title,
    subtitle,
    list,
    href,
    titleAsH1,
    color = tenantTheme['warning-color'],
    breakTag = true,
    listItems = true,
    bannerPath,
  } = props;
  const { t } = useTranslation();
  const { isMobile, rtl } = useSelector((state) => state.app.AppConfig);

  // const LinkStyled = styled(Link)`
  //   border: 0;
  //   display: inline-flex;
  //   padding: var(--btn-padding-y) 1.2em;
  //   font-size: ${isMobile ? '0.8571429em' : '1.1428571em'};
  //   font-weight: 700;
  //   justify-self: start;
  // `;

  const renderBanner = () => (
    <BannerStyled
      as={Group}
      gap={isMobile ? '8px' : '16px'}
      {...props}
      bannerPath={bannerPath || `${getBaseURL()}/profolio-assets/${TENANT_KEY}/lite/banner-faces.png`}
    >
      <div>
        {titleAsH1 ? <Title>{title}</Title> : <Text className="cardTitle">{title}</Text>}
        {breakTag && <br />}
        {subtitle && <Text type="secondary">{subtitle}</Text>}
      </div>
      {listItems && (
        <Flex as="ul" wrap gap="4px 24px">
          {list?.map((item, index) => (
            <TextWithIcon
              as="li"
              title={item}
              icon="GoDotFill"
              iconProps={{ size: '1em', color: color, style: { marginBlockStart: 4 } }}
              style={{ alignItems: 'start' }}
              key={`banner-list-${index}`}
            >
              {item}
            </TextWithIcon>
          ))}
        </Flex>
      )}
      {href && (
        <Button className="btn-package" size="small" iconSize="12px" to={href} style={{ gap: '6px', border: 'none' }}>
          {t('Buy Package')}
        </Button>
      )}
    </BannerStyled>
  );

  return href ? <Link to={href}>{renderBanner()}</Link> : renderBanner();
};

// Banner.propTypes = {
//   title: PropTypes.string,
//   subtitle: PropTypes.string,
//   list: PropTypes.array,
//   href: PropTypes.string,
// };

export default Banner;
