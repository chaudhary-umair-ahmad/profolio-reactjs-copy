import React from 'react';
import PropTypes from 'prop-types';
import { CardFirstVisitTitle, CardFirstVistStyled, SubTitle, TextWrap } from './styled';
import { Button } from '..';

const CardFirstVist = (props) => {
  const {
    cardTitle = 'Title',
    subTitle = 'Sub Title',
    href = '#!',
    btnText = 'Post Listing',
    listItems,
    buttonProps,
    onClick,
    isMobile,
    ...rest
  } = props;
  return (
    <CardFirstVistStyled {...rest}>
      <TextWrap style={rest.wraperStyle}>
        <CardFirstVisitTitle>{cardTitle}</CardFirstVisitTitle>
        <SubTitle>{subTitle}</SubTitle>
        {listItems && <div className="listItems mb-24">{listItems}</div>}
        <Button href={href} icon="MdOutlineAddLocationAlt" onClick={onClick} {...buttonProps}>
          {btnText}
        </Button>
      </TextWrap>
    </CardFirstVistStyled>
  );
};

CardFirstVist.propTypes = {
  children: PropTypes.node,
  cardTitle: PropTypes.string,
  subTitle: PropTypes.string,
  listItems: PropTypes.string,
  btnText: PropTypes.string,
  href: PropTypes.string,
  buttonProps: PropTypes.object,
};

// CardFirstVist.defaultProps = {
//   cardTitle: 'Title',
//   subTitle: 'Sub Title',
//   href: '#!',
//   btnText: 'Post Listing',
// };

export default CardFirstVist;
