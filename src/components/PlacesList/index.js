import React, { useState, useEffect, useCallback } from "react";
import { filterData } from "../../lib/helpers";
import { getDocuments } from "../../firebaseHelpers";
import AdminTipCard from "../adminTipCard";

import styles from "../../pages/admin/AdminPanel.module.css";

export default function PlacesList({
  handleModalOpen,
  title,
  buttonValue,
  places,
  setPlaces,
}) {
  const [showAll, setShowAll] = useState(false);

  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [search, setSearch] = useState("");

  const filterPlaces = useCallback(
    (e) => {
      if (e) e.preventDefault();
      let filtered = filterData(search, places);
      setFilteredPlaces(filtered);
    },
    [search, places]
  );

  const getAllPlaces = useCallback(() => {
    getDocuments("Places")
      .then((data) => setPlaces(data))
      .catch((e) => console.log("ERROR : ", e));
  }, [setPlaces]);

  useEffect(getAllPlaces, [getAllPlaces]);

  useEffect(filterPlaces, [search, filterData]);

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>
          {title} ({places.length})
        </h1>
        <button className={styles.btn} onClick={() => handleModalOpen()}>
          {buttonValue}
        </button>
      </div>
      <form
        className={styles.restaurantSearch}
        onSubmit={(e) => filterPlaces(e)}
      >
        <input
          text="Sök på restauranger"
          value={search}
          placeholder="Sök på alla platser"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Sök</button>
      </form>

      <ul className={styles.ul}>
        {search.length > 0 && filteredPlaces.length > 0 ? (
          filteredPlaces.map((place, i) => (
            <AdminTipCard
              key={i}
              tip={place}
              index={i}
              handleModalOpen={() => handleModalOpen(place, "place")}
            />
          ))
        ) : search.length > 0 ? (
          <span>Inga platser funna!</span>
        ) : showAll && !search ? (
          places.map((place, i) => (
            <AdminTipCard
              key={i}
              tip={place}
              handleModalOpen={() => handleModalOpen(place, "place")}
              index={i}
            />
          ))
        ) : null}
      </ul>
      <span
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          paddingBottom: "3rem",
        }}
      >
        <button
          className={styles.showAll}
          onClick={() => {
            setSearch("");
            setShowAll((showAll) => !showAll);
          }}
        >
          {showAll ? "Minimera" : "Visa alla"}
        </button>
      </span>
    </div>
  );
}
