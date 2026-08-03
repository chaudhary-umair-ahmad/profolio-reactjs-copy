import React, { useState } from 'react';

import { Icon } from '..';
import { Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { TagStyled } from './styled';

const { CheckableTag } = TagStyled;

const Tag = (props) => {
  const {
    closable = false,
    onClose,
    color,
    checked,
    onChange,
    shape,
    size,
    data,
    hottags,
    animate,
    children,
    bordered = false,
    gradient,
    style,
    ...rest
  } = props;

  const [state, setState] = useState({
    checked: true,
    selectedTags: [],
  });

  const tagsFromServer = data;

  const log = (e) => {
    onClose(e);
  };

  const handleChange = (checke) => {
    setState({ ...state, checke });
    if (onChange) onChange(checke);
  };

  const handleChangeHot = (tag, checke) => {
    const { selectedTags } = state;
    const nextSelectedTags = checke ? [...selectedTags, tag] : selectedTags.filter((t) => t !== tag);
    setState({
      ...state,
      selectedTags: nextSelectedTags,
    });
    if (onChange) onChange(nextSelectedTags);
  };

  const { selectedTags } = state;

  return checked ? (
    <CheckableTag props={props} checked={state.checked} onChange={handleChange} {...rest} />
  ) : hottags ? (
    <>
      <span style={{ marginInlineEnd: 8 }}>Categories:</span>
      {tagsFromServer.map((tag) => (
        <CheckableTag
          key={tag}
          checked={selectedTags.indexOf(tag) > -1}
          onChange={(checke) => handleChangeHot(tag, checke)}
          {...rest}
        >
          {tag}
        </CheckableTag>
      ))}
    </>
  ) : animate ? (
    <AnimatedTags data={data} onChange={onChange} {...rest} />
  ) : (
    <TagStyled
      closable={closable}
      onClose={log}
      color={color}
      closeIcon={<Icon icon="MdClose" />}
      shape={shape}
      size={size}
      bordered={bordered}
      gradient={gradient}
      style={{ ...style }}
      {...rest}
    >
      {children}
    </TagStyled>
  );
};

// Tag.propTypes = {
//   data: PropTypes.arrayOf(PropTypes.string),
//   closable: PropTypes.bool,
//   onClose: PropTypes.func,
//   color: PropTypes.string,
//   checked: PropTypes.bool,
//   onChange: PropTypes.func,
//   hottags: PropTypes.bool,
//   animate: PropTypes.bool,
//   children: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.node]),
//   shape: PropTypes.string,
//   bordered: PropTypes.bool,
//   style: PropTypes.object,
// };

const AnimatedTags = (props) => {
  const { data, onChange } = props;
  const [state, setState] = useState({ tags: data, inputVisible: false, inputValue: '' });

  const handleClose = (removedTag) => {
    const tags = state.tags.filter((tag) => tag !== removedTag);
    setState({ tags });
    if (onChange) onChange(tags);
  };

  const showInput = () => {
    setState({ ...state, inputVisible: true });
  };

  const handleInputChange = (e) => {
    setState({ ...state, inputValue: e.target.value });
  };

  const handleInputConfirm = () => {
    const { inputValue } = state;
    let { tags } = state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }

    if (onChange) onChange(tags);
    setState({
      ...state,
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  const forMap = (tag) => {
    const tagElem = (
      <TagStyle
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </TagStyle>
    );

    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  const { tags, inputVisible, inputValue } = state;
  const tagChild = tags.map(forMap);

  return (
    <div>
      <div style={{ marginBottom: 10 }}>{tagChild}</div>

      {inputVisible && (
        <Input
          autoFocus
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}

      {!inputVisible && (
        <TagStyle onClick={showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
          <PlusOutlined /> New Tag
        </TagStyle>
      )}
    </div>
  );
};

// AnimatedTags.propTypes = {
//   data: PropTypes.array,
//   onChange: PropTypes.func,
// };

export { Tag };
