import * as Sentry from '@sentry/react';

import { Result } from 'antd';
import React, { useEffect, useState } from 'react';
import { isProduction } from '../../../utility/env';
import { Button } from '../button/button';
import Icon from '../icon/icon';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    return () => {
      setHasError(false); // Reset error state on unmount
    };
  }, []);

  const renderError = () => {
    return (
      <Result
        icon={<Icon icon="BiSad" size={120} />}
        title="Something went wrong!"
        subTitle={errorMessage}
        extra={
          <Button
            type="primary"
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </Button>
        }
      />
    );
  };

  if (isProduction) {
    return <Sentry.ErrorBoundary fallback={renderError}>{children}</Sentry.ErrorBoundary>;
  }
  if (hasError) {
    return (
      <Result
        icon={<Icon icon="BiSad" size={120} />}
        title="Something went wrong!"
        subTitle={errorMessage}
        extra={
          <Button
            type="primary"
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </Button>
        }
      />
    );
  }
  return children;
};

export default ErrorBoundary;
