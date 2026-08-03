import Styled from 'styled-components';

import tenantTheme from '@theme';
import { Swiper, SwiperSlide } from 'swiper/react';

export const ContentSlider = Styled(({rtl,...rest}) => <Swiper {...rest} />)`

// &.swiper{
//    padding-inline: 10px;
//  }
 .swiper-pagination-bullet {
background-color: ${({ theme }) => theme['primary-color']};
 }


  


`;
