export const PLATFORMS = {
  BAYUT: 'bayut',
};

export const AREA_UNIT = {
  MARLA: 'marla',
  SQUARE_FEET: 'square_feet',
  SQUARE_YARD: 'square_yards',
  SQUARE_METER: 'square_meters',
  KANAL: 'kanal',
};
export const allowedFilesType = ['jpg', 'png', 'jpeg'];

export const TRUBROKER_REQUIREMENTS = [
  'An active Bayut Package',
  'Completed their profile',
  'Posted 2 or more listings',
];

export const RESPONSIVE_BROKER_REQUIREMENTS = [
  'You need to have Phone Call or WhatsApp tracking enabled.',
  'You must have received at least 5 phone calls and 10 WhatsApp messages to be eligible for badge evaluation.',
  'WhatsApp messages must be responded to within 4 hours to count towards your response rate.',
  'Calls and WhatsApp messages responded to outside of business hours (including weekends) will count towards both your response rate and TruPoints.',
  'Missed or unresponded calls/messages outside of business hours (including weekends) will not affect your response rate or TruPoints.',
];

export const SUPER_LISTER_REQUIREMENTS = [
  'Are new (not re-posted or edited).',
  'Are currently live.',
  'Are not duplicates',
  'Belong to the same agent.',
];

export const TRUPOINTS_LIST = [
  'Activate TruCheck™ For A Rental Property - 20 Points',
  'Overall Quality Score is greater than 80% - 10 Points',
  'Activate TruCheck™ For A Sale Property - 25 Points',
  'Post A Listing - 10 Points',
  'Active listing should be greater than 4 - 20 Points',
  'Post Or Apply Hot Listing - 15 Points',
  'Post Or Apply Signature Listing - 20 Points',
  'TruBroker For 3 Consecutive Months - 20 Points',
  'TruBroker For 6 Consecutive Months - 25 Points',
  'WhatsApp Response is within 30 minutes - 10 Points',
];

export const badgeRequirements = {
  TRUBROKER_REQUIREMENTS,
  RESPONSIVE_BROKER_REQUIREMENTS,
  SUPER_LISTER_REQUIREMENTS,
  TRUPOINTS_LIST,
};

export default {
  PLATFORMS,
  AREA_UNIT,
  allowedFilesType,
  badgeRequirements,
};
