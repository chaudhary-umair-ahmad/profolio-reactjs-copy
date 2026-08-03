export const getDynamicFieldsList = (response) => response?.dynamic_fields ?? [];

export function buildDynamicFieldsResponse(dynamicFields = []) {
  return { dynamic_fields: dynamicFields };
}

export function mergeDynamicFieldsResponses(...responses) {
  return buildDynamicFieldsResponse(responses.flatMap((response) => getDynamicFieldsList(response)));
}
