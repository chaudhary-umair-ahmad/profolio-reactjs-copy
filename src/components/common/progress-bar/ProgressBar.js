import tenantData from '@data';
import { Col, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import TextWithIcon from '../textWithIcon/textWithIcon';
import { ProgressBarContainer, ProgressBarFill, ProgressBarPercentage } from './style';

function ProgressBar({ done, successfull, total, selectedPlatorm }) {
  const percentage = ((done / total) * 100)?.toFixed(2);

  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);

  return (
    <>
      {isMobile ? (
        <>
          <Row style={{ gap: '10px' }}>
            <div>Applying {selectedPlatorm === 'zameen' ? 'Refresh' : 'Boost'}</div>
            <div>
              {successfull}/{total}
            </div>
          </Row>
          <Row>
            <div>
              <ProgressBarContainer>
                <ProgressBarFill style={{ width: `${percentage}%` }} />
                <ProgressBarPercentage></ProgressBarPercentage>
              </ProgressBarContainer>
            </div>
            <div>{`${percentage}%`}</div>
          </Row>
        </>
      ) : (
        <>
          <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Col>Applying {selectedPlatorm === 'zameen' ? 'Refresh' : 'Boost'} </Col>
            <Col>
              <Row style={{ gap: '10px' }}>
                {successfull}/{total}
                <ProgressBarContainer>
                  <ProgressBarFill style={{ width: `${percentage}%` }} />
                  <ProgressBarPercentage></ProgressBarPercentage>
                </ProgressBarContainer>
                {`${percentage}%`}
              </Row>
            </Col>
          </Row>
        </>
      )}

      {percentage == 100.0 && (
        <div style={{ display: 'flex', flexDirection: 'column', margin: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <TextWithIcon
              icon="MdCheck"
              iconProps={{
                hasBackground: true,
                color: tenantData.platformList.find((p) => p.slug === 'zameen').brandColor,
                style: { padding: 3 },
                size: 14,
              }}
              textSize="14px"
              title={`${successfull} Listings were successfully ${
                selectedPlatorm === 'zameen' ? 'Refreshed' : 'Boosted to Top'
              }`}
            />
          </div>
          {total - successfull > 0 && (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <TextWithIcon
                icon="MdClose"
                iconProps={{
                  hasBackground: true,
                  color: 'red',
                  style: { padding: 3 },
                  size: 14,
                }}
                textSize="14px"
                title={`${total - successfull} Listings could not ${
                  selectedPlatorm === 'zameen' ? 'be Refreshed' : 'Boosted to Top'
                }`}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ProgressBar;
