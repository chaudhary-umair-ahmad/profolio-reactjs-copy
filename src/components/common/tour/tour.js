import React, { useEffect, useState } from 'react';
import { TourStyled } from './styled';

const Tour = ({ children, steps, onClose = () => {}, ...rest }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const onStepChange = (currentStep) => {
    steps?.[currentStep - 1]?.onChange && steps?.[currentStep - 1]?.onChange();
  };

  return (
    <TourStyled
      rootClassName="walk-through"
      steps={steps}
      onChange={onStepChange}
      disabledInteraction
      open={open}
      onClose={() => {
        onClose();
        setOpen(false);
      }}
      scrollIntoViewOptions={false}
      {...rest}
    >
      {children}
    </TourStyled>
  );
};

export default Tour;
