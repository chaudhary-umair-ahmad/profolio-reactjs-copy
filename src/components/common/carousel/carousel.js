import { Carousel as AntdCarousel, Image } from 'antd';
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { Button } from '../button/button';
import { useSelector } from 'react-redux';

const Carousel = forwardRef((props, ref) => {
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const { children, initialSlide, currentSlide, setCurrentSlide, isDisableRight, maxIndex, isDisableLeft, ...rest } =
    props;
  const carouselRef = useRef(null);

  useImperativeHandle(ref, () => ({
    setIndex(index) {
      setCurrentSlide(index);
      carouselRef.current && carouselRef.current.goTo(index, false);
    },
  }));

  const goToSlide = useCallback(
    (slideNumber, dontAnimate = false) => {
      const maxSlides = maxIndex;
      let newSlide = currentSlide + slideNumber;
      if (newSlide < 0) {
        newSlide = 0;
      } else if (newSlide > maxSlides) {
        newSlide = maxSlides;
      }
      setCurrentSlide(newSlide);
      carouselRef.current && carouselRef.current.goTo(newSlide, false);
    },
    [currentSlide, ref],
  );

  return (
    <>
      <AntdCarousel
        ref={carouselRef}
        afterChange={(index) => setCurrentSlide(index)}
        initialSlide={initialSlide}
        {...rest}
      >
        {children}
      </AntdCarousel>

      <Button
        style={{ borderRadius: '50%', border: 0 }}
        type="primaryOutlined"
        icon="IoIosArrowBack"
        className="prev-btn flipX"
        disabled={isDisableLeft}
        onClick={() => goToSlide(-1)}
        size={isMobile ? 'small' : 'large'}
      />
      <Button
        type="primaryOutlined"
        icon="IoIosArrowForward"
        className="next-btn flipX"
        disabled={isDisableRight}
        onClick={() => goToSlide(1)}
        style={{ border: 0, borderRadius: '50%' }}
        size={isMobile ? 'small' : 'large'}
      />
    </>
  );
});

export default Carousel;
