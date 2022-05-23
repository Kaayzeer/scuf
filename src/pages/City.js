import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

//components
import CategoriesList from "../components/CategoriesList/CategoriesList";
import FilterByPlace from "../components/FilterByPlace/FilterByPlace";
import Header from "../components/Header/Header";
import Search from "../components/Search/Search";
import Slider from "../components/Slider/Slider";

//helper functions
import { filterData } from "../lib/helpers";
import { getSubCities } from "../lib/helpers";

//firebase functions
import { getPlaceDocuments } from "../firebaseHelpers";
import { getSubCityDocuments } from "../firebaseHelpers";

export default function City() {
  const { city } = useParams();
  const [places, setPlaces] = useState([]);
  const [tips, setTips] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [subCities, setSubCities] = useState([]);
  const [showSubCities, setShowSubCities] = useState([]);

  useEffect(() => {
    getPlaceDocuments("Places", "city", city).then((data) => setTips(data));
    getSubCityDocuments("Cities").then((data) => setSubCities(data));
  }, []);

  const selectElement = useRef(null);
  const myRef = useRef(null);

  const scrollToRef = () => {
    myRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  useEffect(() => {
    scrollToRef(myRef);
  }, [scrollToRef]);

  const handleSliderClick = (category) => {
    let categoryCollection = [];
    tips.map((tip) => {
      if (tip.categories.includes(category)) categoryCollection.push(tip);
    });

    setPlaces(categoryCollection);

    selectElement.current.value = "default";
    setShowSubCities([]);
  };

  const onFilterSubCityClick = (subCity) => {
    let filterCollection = [];
    tips.map((cat, idx) => {
      if (cat.subCity.includes(subCity)) {
        filterCollection.push(cat);
      }
    });

    setShowSubCities(filterCollection);
    setPlaces([]);
  };

  const searchPlaces = (e) => {
    setSearchInput(e.target.value);
  };

  const handleClickSearch = (e) => {
    e.preventDefault();
    setPlaces(filterData(searchInput, tips));
  };

  return (
    <>
      <Header title={city} para="Vad söker du idag?" />
      <FilterByPlace
        subCitiesarr={getSubCities(subCities, city)}
        city={city}
        onFilterSubCityClick={onFilterSubCityClick}
        selectElement={selectElement}
      />
      <Slider click={handleSliderClick} />
      <Search
        text="Sök..."
        searchPlaces={searchPlaces}
        handleClickSearch={handleClickSearch}
      />
      <div ref={myRef}>
        {showSubCities.length > 0 && (
          <CategoriesList places={showSubCities} city={city} />
        )}
        <CategoriesList places={places} city={city} />
      </div>
    </>
  );
}
