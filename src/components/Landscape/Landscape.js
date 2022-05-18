import React from "react";
import styles from "./Landscape.module.css";

import DisplayCity from "./DisplayCity";

const Landscape = ({ landscape, cities }) => {
  const filteredCities = () => {
    let arr = [];
    cities.map((item) => {
      if (!arr.includes(item.city)) {
        arr.push(item.city);
      }
    });

    return arr;
  };

  return (
    <section className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.landscapeWrapper}>
          <h1 className={styles.h1}>{landscape}</h1>
          {cities.length === 0 ? (
            <p className={styles.p}>Finns inga städer i {landscape}!</p>
          ) : (
            <>
              <p className={styles.p}>Var i {landscape}?</p>
              {filteredCities().map((city, idx) => (
                <DisplayCity key={idx} city={city} cities={cities} />
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Landscape;
