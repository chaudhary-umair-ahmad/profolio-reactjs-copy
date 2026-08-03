import React, { forwardRef, useImperativeHandle, useRef, useState, useMemo } from 'react';
import { Drawer, Card, TextWithIcon, CustomCard, notification, Flex } from '../common';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import CallRecording from '../table/table-components/call-recording';
import LeadDetailDrawerHeader from './lead-detail-drawer-header';
import { useLazyGetZiwoAICallTrackingDataQuery } from '../../apis/lms';
import Summary from './summary';
import Transcription from './transcription';
import Assessment from './assessment';

const CallAnalysisDetailDrawer = forwardRef((props, ref) => {
  const drawerRef = useRef();
  const { isMobile, locale } = useSelector((state) => state.app.AppConfig);
  const [activeTab, setActiveTab] = useState('summary');
  const { t } = useTranslation();
  const [drawerData, setDrawerData] = useState({
    clientInfo: null,
    callAnalysisScore: null,
    recording_uuid: null,
    interestId: null,
  });
  useImperativeHandle(ref, () => ({
    open: ({ clientInfo, callAnalysisScore, recording_uuid, interestId }) => {
      setDrawerData({
        clientInfo: clientInfo || null,
        callAnalysisScore: callAnalysisScore || null,
        recording_uuid: recording_uuid || null,
        interestId: interestId || null,
      });
      setActiveTab('summary');
      getZiwoData(interestId);
      drawerRef.current.openDrawer();
    },
    close() {
      drawerRef.current.closeDrawer();
    },
    isOpen() {
      return drawerRef.current.isOpen();
    },
  }));
  const [getZiwoData, { data, isFetching, error, refetch }] = useLazyGetZiwoAICallTrackingDataQuery();
  const tabs = [
    { key: 'summary', tab: <div>{t('Summary')}</div>, title: 'Summary', slug: 'summary' },
    { key: 'transcription', tab: <div>{t('Transcription')}</div>, title: 'Transcription', slug: 'transcription' },
    { key: 'assessment', tab: <div>{t('Assessment')}</div>, title: 'Assessment', slug: 'assessment' },
  ];

  const renderCustomCard = (title, description) => (
    <CustomCard
      borderColor="#FCEDD9"
      cardBackground="#FEF8F0"
      title={
        <TextWithIcon
          icon="FaClock"
          iconProps={{ size: '16px' }}
          fontWeight={700}
          value={title}
          style={{ fontSize: '18px' }}
          gap="6px"
        />
      }
      description={<div style={{ wordBreak: 'keep-all' }}>{description}</div>}
      descriptionStyle={{ fontSize: '11px' }}
    />
  );

  const renderContent = () => {
    const sentiments = data?.ai_analyzed_data?.response_data?.sentiments;
    const summaryText = sentiments?.[locale === 'ar' ? 'summary_ar' : 'summary_en'];
    const transcript = sentiments?.[locale === 'ar' ? 'transcript_ar' : 'transcript_en'];
    const loadingCards = {
      summary: renderCustomCard(
        t('Summary in Progress'),
        t(
          'Bayut Intelligence is currently analysing your call to generate a detailed summary. Please hold on while we extract the key highlights for you.',
        ),
      ),
      transcription: renderCustomCard(
        t('Transcription in Progress'),
        t(
          'Transcription is being generated for your call. Once complete, you’ll be able to read the full dialogue here.',
        ),
      ),
      assessment: renderCustomCard(
        t('Assessment in Progress'),
        t(
          'We are evaluating the call quality and other metrics. The assessment will appear once our analysis is complete.',
        ),
      ),
    };

    const dataTabs = {
      summary: (
        <Summary
          locale={locale}
          summaryData={summaryText}
          callAnalysisScore={drawerData?.callAnalysisScore}
          loading={isFetching}
        />
      ),
      transcription: <Transcription locale={locale} transcriptData={transcript} loading={isFetching} />,
      assessment: (
        <Assessment
          locale={locale}
          assessment={sentiments?.assessment}
          loading={isFetching}
          error={error}
          refetch={refetch}
        />
      ),
    };

    return drawerData?.callAnalysisScore?.total ? dataTabs[activeTab] : loadingCards[activeTab];
  };
  const handleZiwoClose = (e) => {
    e.stopPropagation();
    drawerRef.current.closeDrawer();
  };

  return (
    <Drawer
      placement={isMobile ? 'bottom' : locale === 'ar' ? 'left' : 'right'}
      width={isMobile ? '100vw' : '50vw'}
      height={isMobile && '100vh'}
      ref={drawerRef}
      headerStyle={{
        paddingBottom: 0,
        paddingInline: isMobile && '12px',
        alignItems: 'start',
        border: 'none',
      }}
      bodyStyle={{
        paddingTop: '0',
        paddingInline: isMobile && '0px',
      }}
      title={
        <>
          <LeadDetailDrawerHeader
            leadData={drawerData?.clientInfo}
            detailDrawerRef={drawerRef}
            clientId={drawerData?.clientInfo?.id}
            leadId={drawerData?.clientInfo?.leadId}
            showBayutTag={true}
          />
          <div>
            <CallRecording
              recording_uuid={drawerData?.recording_uuid}
              leadId={drawerData?.clientInfo?.leadId}
              showPlayButton={false}
              style={{ marginBottom: 0 }}
            />
          </div>
        </>
      }
      footer={null}
      onClose={handleZiwoClose}
      onClick={(e) => e.stopPropagation()}
    >
      <Card
        style={{ marginTop: 3 }}
        tabList={tabs}
        activeTabKey={activeTab}
        onTabChange={setActiveTab}
        bodyStyle={{ paddingTop: 24 }}
        className="lead-detail-drawer"
      >
        {renderContent()}
      </Card>
    </Drawer>
  );
});

export default CallAnalysisDetailDrawer;
