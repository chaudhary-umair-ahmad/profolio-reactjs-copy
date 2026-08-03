import React, { useMemo } from 'react';
import { DataTable, Text } from '../common';
import { useTranslation } from 'react-i18next';
const Assessment = ({ assessment, isFetching, loading, error, refetch }) => {
  const { t } = useTranslation();
  const agentPerformance = assessment?.agent_performance;
  const leadPotential = assessment?.lead_potential;
  const grandScore = assessment?.grand_score;

  const tableData = useMemo(
    () => [
      {
        key: 'agent_performance',
        title: t('Agent Performance (50 points)'),
        category: 'Agent Performance',
        isCategoryHeader: true,
      },
      {
        key: 'greeting_tone',
        title: t('Greeting and Tone'),
        score: agentPerformance?.greeting_tone.obtained,
        outOf: agentPerformance?.greeting_tone.total,
      },
      {
        key: 'information_delivery',
        title: t('Information Delivery'),
        score: agentPerformance?.information_delivery.obtained,
        outOf: agentPerformance?.information_delivery.total,
      },
      {
        key: 'qualification_effort',
        title: t('Qualification Effort'),
        score: agentPerformance?.qualification_effort.obtained,
        outOf: agentPerformance?.qualification_effort.total,
      },
      {
        key: 'next_steps_offered',
        title: t('Next Steps Offered'),
        score: agentPerformance?.next_steps_offered.obtained,
        outOf: agentPerformance?.next_steps_offered.total,
      },
      {
        key: 'lead_potential',
        title: t('Lead Potential (50 points)'),
        isCategoryHeader: true,
      },
      {
        key: 'clarity_of_intent',
        title: t('Clarity of Intent'),
        score: leadPotential?.clarity_of_intent.obtained,
        outOf: leadPotential?.clarity_of_intent.total,
      },
      {
        key: 'engagement_level',
        title: t('Engagement Level'),
        score: leadPotential?.engagement_level.obtained,
        outOf: leadPotential?.engagement_level.total,
      },
      {
        key: 'urgency',
        title: t('Urgency'),
        score: leadPotential?.urgency.obtained,
        outOf: leadPotential?.urgency.total,
      },
      {
        key: 'budget_disclosure',
        title: t('Budget Disclosure'),
        score: leadPotential?.budget_disclosure.obtained,
        outOf: leadPotential?.budget_disclosure.total,
      },
      {
        key: 'total',
        title: t('Total'),
        score: grandScore?.obtained,
        outOf: grandScore?.total,
        isTotal: true,
      },
    ],
    [assessment],
  );
  const renderText = (text, row) => (
    <Text style={{ color: row?.isTotal && '#009F2B' }}>
      {row?.isTotal || row?.isCategoryHeader ? <strong>{text}</strong> : text}
    </Text>
  );
  const columns = useMemo(
    () => [
      {
        title: t('TITLE'),
        dataIndex: 'title',
        key: 'title',
        onHeaderCell: () => ({ style: { backgroundColor: '#F3FAF9' } }),
        render: (text, row) => renderText(text, row),
      },
      {
        title: t('SCORE'),
        dataIndex: 'score',
        key: 'score',
        onHeaderCell: () => ({ style: { backgroundColor: '#F3FAF9' } }),
        render: (text, row) => renderText(text, row),
      },
      {
        title: t('OUT OF'),
        dataIndex: 'outOf',
        key: 'outOf',
        onHeaderCell: () => ({ style: { backgroundColor: '#F3FAF9' } }),
        render: (text, row) => renderText(text, row),
      },
    ],
    [],
  );
  return (
    <DataTable
      columns={columns}
      data={tableData}
      loading={isFetching}
      skeletonLoading={loading}
      onRow={(record, index) => {
        return {
          style: record.isTotal ? { backgroundColor: '#F3FAF9' } : {},
        };
      }}
      error={error}
      onErrorRetry={refetch}
    />
  );
};

export default Assessment;
