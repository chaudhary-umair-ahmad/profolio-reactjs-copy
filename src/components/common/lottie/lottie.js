import React from 'react';
import ReactLottie from 'react-lottie';

const Lottie = ({ width, height, animationData, options }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
    ...options,
  };

  return <ReactLottie width={width} height={height} options={defaultOptions} />;
};

export default Lottie;
