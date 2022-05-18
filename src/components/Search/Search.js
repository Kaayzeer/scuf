import React from "react";
import styles from "./Search.module.css";

export default function Search({ text, searchPlaces, handleClickSearch }) {
  return (
    <section className={styles.container}>
      <form className={styles.form}>
        <input
          placeholder={text}
          className={styles.input}
          onChange={searchPlaces}
        ></input>
        <button className={styles.inputBtn} onClick={handleClickSearch}>
          Sök
        </button>
      </form>
    </section>
  );
}
