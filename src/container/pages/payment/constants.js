export const AGE_OPTIONS = [
  {
    value: 1,
    label: 'Ages 18-29',
    label_l1: 'الأعمار 18-29',
  },
  {
    value: 2,
    label: 'Ages 30-41',
    label_l1: 'الأعمار 30-41',
  },
  {
    value: 3,
    label: 'Ages 42-53',
    label_l1: 'الأعمار 42-53',
  },
  {
    value: 4,
    label: 'Ages 53 or above',
    label_l1: 'الأعمار 53 فما فوق',
  },
];

export const CART_INITIAL_STATE = {
  id: null,
  source: 'profolio',
  total: 0,
  total_credits: 0.0,
  refundable_amount: null,
  discount: 0,
  amount: 0,
  total_amount: 0,
  available_channels: [
    {
      id: 1,
      slug: 'checkout',
      enabled: true,
      fee: 0,
      total_amount: 0,
      net_amount: 0,
    },
    {
      id: 3,
      slug: 'tabby',
      enabled: true,
      fee: 0,
      total_amount: 0,
      net_amount: 0,
    },
  ],
};
