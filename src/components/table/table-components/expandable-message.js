import { useState } from 'react';
import { Button } from '../../common';

export const ExpandableMessage = (props) => {
  const [showFullMessage, setShowFullMessage] = useState(false);
  const { message, isExpandable } = props;
  const messageLength = 100;

  return (
    <div style={{ whiteSpace: 'normal' }}>
      {isExpandable ? (
        <>
          {!showFullMessage && message?.length > messageLength ? (
            <>{message?.slice(0, messageLength)}...</>
          ) : (
            <>{message}</>
          )}
          {message?.length > messageLength && (
            <Button
              className="p-0"
              type="link"
              onClick={() => {
                setShowFullMessage(!showFullMessage);
              }}
            >
              {!showFullMessage ? t('View More') : t('View Less')}
            </Button>
          )}
        </>
      ) : (
        message
      )}
    </div>
  );
};

