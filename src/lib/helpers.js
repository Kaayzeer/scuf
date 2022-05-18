export const filterData = (searchWord, places) => {
  // takes a string as searchWord and an array as places and returns an filtered array
  let results = [];

  for (let i = 0; i < places.length; i++) {
    for (let key in places[i]) {
      if (typeof places[i][key] == "string") {
        if (
          places[i][key].toLowerCase() == searchWord.toLowerCase() ||
          places[i][key].toLowerCase().includes(searchWord.toLowerCase())
        ) {
          results.push(places[i]);
          break;
        }
      } else if (Array.isArray(places[i][key])) {
        if (places[i][key].includes(searchWord)) {
          results.push(places[i]);
        } else {
          for (let keyInKey in places[i][key]) {
            if (
              places[i][key][keyInKey]
                .toLowerCase()
                .includes(searchWord.toLowerCase()) ||
              places[i][key][keyInKey].toLowerCase() == searchWord.toLowerCase()
            ) {
              results.push(places[i]);
              break;
            }
          }
        }
      }
    }
  }
  return results;
};

export const getSubCities = (variable, city) => {
  let subCitiesarr = [];

  variable.map((item, idx) => {
    for (const [key, value] of Object.entries(item)) {
      if (key == city) {
        subCitiesarr.push(...value);
      }
    }
  });

  return subCitiesarr;
};

export const getCities = (variable, city) => {
  let subCitiesarr = [];

  variable.map((item, idx) => {
    for (const [key, value] of Object.entries(item)) {
      if (key.cities.city == city) {
        subCitiesarr.push(...key);
      }
    }
  });

  return subCitiesarr;
};
