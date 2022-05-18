import React, { useState, useEffect, useRef } from "react";
import { getDocuments, addNewDocument } from "../../firebaseHelpers";

import styles from "../../pages/admin/AdminPanel.module.css";
import BigCityCard from "../BigCityCard";

export default function BigCitiesList({ title, buttonValue }) {
  const [bigCities, setBigCities] = useState([]);
  const [addCity, setAddCity] = useState(false);

  const formRef = useRef();

  useEffect(() => {
    getDocuments("Cities")
      .then((data) => setBigCities(data))
      .catch((e) => console.log("ERROR : ", e));
  }, []);
  const addBigCity = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const city = data.get("bigCity").trim();
    await addNewDocument("Cities", { [city]: [] }).then(() => {
      let tempCities = [...bigCities, { id: "", [city]: [] }];
      setBigCities(tempCities);
      formRef.current.reset();
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>
          {title} ({bigCities.length})
        </h1>
        <button
          className={styles.btn}
          onClick={() => setAddCity((addCity) => !addCity)}
        >
          {addCity ? "Avbryt" : buttonValue}
        </button>
      </div>
      {addCity && (
        <form
          ref={formRef}
          className={styles.inlineForm}
          onSubmit={(e) => addBigCity(e)}
        >
          <input name="bigCity" placeholder="Lägg till storstad" />
          <button className={styles.btn} type="submit">
            +
          </button>
        </form>
      )}

      <ul className={styles.ul}>
        {bigCities.map((bigCity, index) => (
          <BigCityCard
            key={index}
            bigCity={bigCity}
            bigCities={bigCities}
            setBigCities={setBigCities}
          />
        ))}
      </ul>
    </div>
  );
}
