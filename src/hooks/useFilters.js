import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const useFilters = () => {
  const [filtersObject, setFiltersObject] = useState({});
  const [filterTags, setFilterTags] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryObj = useMemo(() => Object.fromEntries([...searchParams]), [searchParams]);

  useEffect(() => {
    setFiltersObject(queryObj);
  }, [queryObj]);

  const setTagsAndFilters = () => {};

  return { filtersObject, setFiltersObject, setTagsAndFilters, filterTags };
};

export default useFilters;
