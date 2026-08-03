import algoliasearch from 'algoliasearch';
import tenantConstants from '@constants';

const { LOCATION_LEVELS } = tenantConstants;

export default class Algolia {
  static #locationsClient;
  static #locationIndex;
  static #projectsIndex;

  static getProjectsInstance() {
    if (!this.#projectsIndex) {
      this.#projectsIndex = algoliasearch(process.env.REACT_APP_ALGOLIA_APP_ID, process.env.REACT_APP_ALGOLIA_KEY);
    }
    return this.#projectsIndex;
  }

  static getLocationsInstance() {
    if (!this.#locationsClient) {
      this.#locationsClient = algoliasearch(process.env.REACT_APP_ALGOLIA_APP_ID, process.env.REACT_APP_ALGOLIA_KEY);
    }
    return this.#locationsClient;
  }

  static getSubLocationsQuery = (locationId) => {
    return {
      filters: `city_id=${locationId}`,
      numericFilters: [`level > ${LOCATION_LEVELS?.city}`],
      // hitsPerPage: 12,
    };
  };

  static getPopularLocalities = (cityId) => {
    return {
      filters: `city_id=${cityId}`,
      numericFilters: [`level > ${LOCATION_LEVELS?.city}`],
      // hitsPerPage: 12,
    };
  };

  static getLocationsByName = (cityId, name, multipleCities = false, operator = 'OR') => {
    return {
      query: name,
      filters: multipleCities ? `${cityId.map((id) => `city_id=${id}`).join(` ${operator} `)}` : `city_id=${cityId}`,
      numericFilters: [`level > ${LOCATION_LEVELS?.city}`],
    };
  };
  static getCitiesByName = (name) => {
    return {
      query: name,
      numericFilters: [`level = ${LOCATION_LEVELS?.city}`],
    };
  };
  static getCityById = (cityId) => {
    return {
      filters: `city_id=${cityId}`,
      numericFilters: [`level = ${LOCATION_LEVELS?.city}`],
    };
  };

  static getLocationsChildsFromLevel = (locationId, level = 0) => {
    return {
      filters: `hierarchy.id=${locationId} AND level > ${level}`,
      hitsPerPage: 1000,
    };
  };
  static getLocationsChildsFromLevelWithParent = (locationId, level) => {
    return {
      filters: `hierarchy.id=${locationId} AND level >= ${level}`,
      hitsPerPage: 1000,
    };
  };

  static getLocationsAtLevel = (locationId, level) => {
    return {
      filters: `hierarchy.id=${locationId} AND level=${level}`,
      hitsPerPage: 1000,
    };
  };

  static getLocationsIndex() {
    if (!this.#locationIndex) {
      this.#locationIndex = this.getLocationsInstance().initIndex(process.env.REACT_APP_ALGOLIA_LOCATION_INDEX);
    }
    return this.#locationIndex;
  }

  static getProjectsIndex() {
    if (!this.#projectsIndex) {
      this.#projectsIndex = this.getProjectsInstance().initIndex(process.env.REACT_APP_ALGOLIA_PROJECTS_INDEX);
    }
    return this.#projectsIndex;
  }

  static getCitiesQuery = () => {
    return {
      filters: `published_pages.title:society`,
      numericFilters: [`level = ${LOCATION_LEVELS?.city}`],
    };
  };

  static getAllCities = () => {
    return {
      numericFilters: [`level = ${LOCATION_LEVELS?.city}`],
      hitsPerPage: 250,
    };
  };

  static getLocationsOfMultipleCities = (cities, operator = 'OR') => {
    return {
      filters: `${cities.map((id) => `city_id=${id}`).join(` ${operator} `)}`,
      numericFilters: [`level > ${LOCATION_LEVELS?.city}`],
      hitsPerPage: 250,
    };
  };
  static getMultipleCitiesByID = (cities, operator = 'OR') => {
    return {
      filters: `${cities?.map((id) => `city_id=${id}`).join(` ${operator} `)}`,
      numericFilters: [`level = ${LOCATION_LEVELS?.city}`],
    };
  };
}
