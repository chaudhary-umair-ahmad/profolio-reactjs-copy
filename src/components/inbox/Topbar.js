import { Button, Dropdown, Icon } from '../common';

import { MessageAction } from './style';
import { NavLink } from 'react-router-dom';
import React from 'react';
import { Tooltip } from 'antd';
import propTypes from 'prop-types';
import { t } from 'i18next';

const Topbar = ({ refreshState, showTopbar, onFolderClick, onDeleteClick, folders }) => {
  return (
    <>
      <MessageAction>
        <Tooltip placement="bottom" title={t("Refresh")}>
          <NavLink onClick={refreshState} to="/refresh">
            <Icon icon="MdRefresh" size={18} style={{ width: 'auto' }} />
          </NavLink>
        </Tooltip>

        {!!showTopbar && (
          <>
            <Tooltip placement="bottom" title="Delete">
              <Button className="btn-icon" shape="cirle" icon="HiOutlineTrash" onClick={onDeleteClick} />
            </Tooltip>
            {!!folders && !!folders.length && (
              <Dropdown
                suffixIcon={false}
                options={folders}
                getOptionLabel={it => it?.name}
                getOptionValue={it => it?.id}
                onChange={value => {
                  onFolderClick(value.id);
                }}
                prefixIcon="AiFillFolder"
              />
            )}
          </>
        )}
      </MessageAction>
    </>
  );
};

Topbar.propTypes = {
  refreshState: propTypes.func.isRequired,
};

export default Topbar;
