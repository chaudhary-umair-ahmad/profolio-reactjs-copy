import React from 'react';
import { Card, Text, Group } from '../common';
import { SkeletonBody } from '../skeleton/Skeleton';

const TranscriptSkeleton = () => {
  return (
    <Group vertical gap="12px">
      {[1, 2, 3, 4, 5].map((_, index) => (
        <Card
          key={index}
          bodyStyle={{
            backgroundColor: '#f5f5f5',
            minHeight: '50px',
          }}
          style={{ border: 'none' }}
        >
          <SkeletonBody type="title" style={{ height: 18 }} />
        </Card>
      ))}
    </Group>
  );
};

const Transcription = ({ transcriptData, loading }) => {
  const transcript = transcriptData ? transcriptData.split('\n') : [];
  return (
    <div>
      {loading ? (
        <TranscriptSkeleton />
      ) : (
        transcript.map((text, index) => (
          <Card
            key={index}
            bodyStyle={{
              backgroundColor: index % 2 === 0 ? '#ffffff' : '#E1F2F066',
              minHeight: '50px',
            }}
            style={{ border: 'none' }}
          >
            <Text>{text}</Text>
          </Card>
        ))
      )}
    </div>
  );
};

export default Transcription;
