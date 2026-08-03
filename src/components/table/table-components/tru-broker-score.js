import tenantTheme from '@theme';
import React, { useRef } from 'react';
import { TextWithIcon } from '../../common';
import TruBrokerActivityDrawer from '../../tru-broker/tru-broker-activity-drawer';
import TruBrokerLeaderBoard from '../../tru-broker/tru-broker-leaderboard';
import { getPositionSuffix } from '../../../utility/utility';

export const TruBrokerScore = (props) => {
  const { scoreTitle, scoreIcon, userId, style, iconProps, textSize, scoreValue } = props;
  const truPointsActivityDrawerRef = useRef();
  const truBrokerLeaderBoardRef = useRef();

  return (
    <>
      <TextWithIcon
        title={
          props?.subKey == 'agent_rank' ? (
            scoreValue > 0 ? (
              <div>
                {scoreTitle}
                <sup>{getPositionSuffix(scoreValue)}</sup>
              </div>
            ) : (
              scoreTitle
            )
          ) : (
            scoreTitle
          )
        }
        icon={scoreIcon}
        onClick={() => {
          if (props?.subKey == 'tru_points' && Number(scoreValue) > 0) {
            truPointsActivityDrawerRef?.current && truPointsActivityDrawerRef?.current?.openDrawer(userId);
          }
          if (props?.subKey == 'agent_rank' && Number(scoreValue) > 0) {
            truBrokerLeaderBoardRef.current && truBrokerLeaderBoardRef.current.showLeaderBoard(props);
          }
        }}
        gap="4px"
        style={
          style
            ? style
            : {
                flexDirection: 'row-reverse',
                justifyContent: 'flex-end',
                '--svg-color': tenantTheme['primary-color'] + 'aa',
                cursor: 'pointer',
              }
        }
        textSize={textSize}
        iconProps={iconProps}
      />
      <TruBrokerLeaderBoard ref={truBrokerLeaderBoardRef} />
      <TruBrokerActivityDrawer ref={truPointsActivityDrawerRef} />
    </>
  );
};
