import React from "react";
import Sweden from "@svg-maps/sweden";
import { RadioSVGMap } from "react-svg-map";
import styles from "./Map.module.css";

export default function Map({ handleClick, handleLocation }) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.flagContainer}>
          <div className={styles.flagWrapper}>
            <p className={styles.flagPara}>Välj en region på kartan!</p>
            <span className={styles.flagRod}> </span>
          </div>
        </div>

        <RadioSVGMap
          map={Sweden}
          onChange={handleClick}
          onLocationFocus={handleLocation}
          className={styles.map}
        />
      </div>
    </>
  );
}
