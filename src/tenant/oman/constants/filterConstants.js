const VALUE_EQUALS_KEY = (key) => `filter[${key}]`;
const VALUE_CONTAINS_KEY = (key) => `filter${key}]`;
const VALUE_IN_ARRAY_KEY = (key) => `filter[${key}]`;

export const filterConstants = {
  VALUE_EQUALS_KEY,
  VALUE_CONTAINS_KEY,
  VALUE_IN_ARRAY_KEY,
};
