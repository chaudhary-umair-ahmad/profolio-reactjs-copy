const autoGenerateUserDescriptionPayload = ({ values, content_type }) => {
  const getNameById = (list, id) => {
    return list?.find((item) => item.id === id)?.name || null;
  };

  return {
    content_lang:content_type,
    languages: values?.languages?.map((langId) => 
      getNameById(values?.languageList, langId)
    ),
    experience: getNameById(values?.experienceList, values?.experience),
    service_areas: values?.serviceArea,
    agency_name: values?.agency?.title,
  };
};

export default { autoGenerateUserDescriptionPayload };
