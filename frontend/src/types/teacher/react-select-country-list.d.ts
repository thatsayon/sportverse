// src/types/react-select-country-list.d.ts
declare module "react-select-country-list" {
  interface Country {
    value: string; // ISO code (e.g., "US")
    label: string; // Country name (e.g., "United States")
  }

  interface CountryList {
    getData: () => Country[];
    getLabel: (value: string) => string;
    getValue: (label: string) => string;
  }

  function countryList(): CountryList;

  export default countryList;
}
