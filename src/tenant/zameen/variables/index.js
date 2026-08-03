import chroma from 'chroma-js';

export default {
  zameen: {
    colors: {
      primaryColor: '#009f2b',
      primaryHover: '#009f2b',
      primaryLight: chroma.mix('#fff', '#009f2b', 0.18).set('hsl.h', 160),
      primaryLight1: chroma.mix('#fff', '#009f2b', 0.8),
      primaryLight2: chroma.mix('#fff', '#009f2b', 0.18).set('hsl.h', 160),
      primaryLight3: '#e7f1ed',
      primaryLight4: '#F2FAFA',
    },
  },
};
