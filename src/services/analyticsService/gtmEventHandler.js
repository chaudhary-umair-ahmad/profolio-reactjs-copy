import ReactGA from 'react-ga4';

export const trackEventGA4 = (args) => {
  const { category, event, is_non_interaction, params } = args;
  setTimeout(() => {
    ReactGA.event(event, { category, is_non_interaction, ...params });
  }, 10);
};
