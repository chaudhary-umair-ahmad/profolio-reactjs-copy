import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import { ContentSlider } from './styled';
const CarouselSwiper = (props) => {
  const { swiperOptions = {}, className, children } = props;
  const swipperSettings = useMemo(() => ({ modules: [Navigation, Pagination, Scrollbar, A11y], ...swiperOptions }), []);
  const { rtl } = useSelector((state) => state.app.AppConfig);

  return (
    <div dir={rtl ? 'rtl' : 'ltr'}>
      <ContentSlider className={className} {...swipperSettings}>
        {children?.map((child, index) => {
          return <SwiperSlide key={index}>{child}</SwiperSlide>;
        })}
      </ContentSlider>
    </div>
  );
};
export default CarouselSwiper;
