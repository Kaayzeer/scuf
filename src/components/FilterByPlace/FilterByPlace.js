import React from "react";
import styles from "./FilterByPlace.module.css";

export default function FilterByPlace({
  subCitiesarr,
  onFilterSubCityClick,
  selectElement,
}) {
  return (
    <section className={styles.container}>
      <form className={styles.form}>
        <label className={styles.label}>
          Välj område
          <select
            onChange={(e) => onFilterSubCityClick(e.target.value)}
            className={styles.input}
            defaultValue="default"
            type="select"
            ref={selectElement}
          >
            <option key="optkey" value="default">
              Stadsdel...
            </option>
            {subCitiesarr.map((subCity, idx) => (
              <option key={idx}>{subCity}</option>
            ))}
          </select>
        </label>
      </form>
    </section>
  );
}
