import tenantData from '@data';
import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DATE_FORMAT } from '../../constants/formats';
import { ProgressStyled } from '../../tenant/common/components/profile-completion/style';
import { getTimeDateString } from '../../utility/date';
import { capitalizeFirstLetter } from '../../utility/utility';
import { CustomCard, KeyValueCard, Text, TextWithIcon } from '../common';
import SummarySkeleton from './summary-skeleton';
import moment from 'moment';
const Summary = ({ summaryData, callAnalysisScore, loading }) => {
  const { t } = useTranslation();
  const { obtained, total } = callAnalysisScore || {};
  const classification = obtained > 60 ? 'high' : obtained > 30 ? 'medium' : 'low';

  const getFormattedMeetingDateTime = useCallback(() => {
    const meetingDate = summaryData?.meeting_details?.meeting_date;
    const meetingTime = summaryData?.meeting_details?.meeting_time;

    if (!meetingDate) return '';

    const date = moment(meetingDate, 'DD/MM/YYYY');
    if (!date.isValid()) return '';
    if (date.isBefore(moment(), 'day')) return '-';

    return `${date.format('MMM D, YYYY')}${meetingTime ? ` - ${meetingTime}` : ''}`;
  }, [summaryData?.meeting_details]);

  const keypoints = useMemo(
    () => [
      { label: 'Call Sentiment', value: summaryData?.client_sentiment },
      { label: 'Price Negotiation', value: summaryData?.call_tags?.pricing_discussed },
      { label: 'Amenities Discussed', value: summaryData?.call_tags?.amenities_discussed },
      { label: 'Meeting Probability', value: summaryData?.meeting_details?.meeting_probability },
      { label: 'Meeting Date/Time', value: getFormattedMeetingDateTime() },
      { label: 'Meeting Venue', value: summaryData?.meeting_details?.meeting_venue },
      { label: 'Lead Intent', value: summaryData?.lead_intent },
    ],
    [summaryData],
  );

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        {loading ? (
          <SummarySkeleton />
        ) : (
          <>
            <CustomCard
              title={
                <TextWithIcon
                  icon="LogoBayutIntelligence"
                  fontWeight={700}
                  value={t('Bayut Intelligence')}
                  style={{ fontSize: 18 }}
                  iconProps={{ size: 24 }}
                  gap="6px"
                />
              }
              description={
                <div style={{ wordBreak: 'keep-all' }}>{t('Represents the overall score of the call assessment.')}</div>
              }
              descriptionStyle={{ fontSize: 11 }}
              borderColor="#28B16D33"
              cardBackground="#F0FAF5"
              extraContent={
                <ProgressStyled
                  size={80}
                  type="circle"
                  strokeColor={tenantData.getClassificationColor(classification)}
                  strokeWidth={12}
                  percent={obtained}
                  format={(percent) => (
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: tenantData.getClassificationColor(classification),
                      }}
                    >
                      {percent}/{total}
                    </Text>
                  )}
                  style={{ '--remaining-color': '#D4EFE2' }}
                />
              }
            />
            <div style={{ margin: '24px 0' }}>
              {summaryData?.summary && <Text classname="fz-14">{summaryData?.summary}</Text>}
            </div>
            <KeyValueCard title="Keypoints" items={keypoints} />
          </>
        )}
      </div>
    </>
  );
};

export default Summary;
