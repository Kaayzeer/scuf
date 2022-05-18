import React from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";

//icon
import CloseModal from "../../static/icons/CloseModal";

import { iconsArray, buttons } from "../../lib/SliderLibrary";

import styles from "./DescModal.module.css";

export default function DescModal({ place, city, setShowModal }) {
  let icon = iconsArray.map((icon) => {
    if (place.categories.includes(icon.type.name)) {
      return icon;
    }
  });

  return ReactDOM.createPortal(
    <section className={styles.modalBackdrop}>
      <div className={styles.modalContainer}>
        <span className={styles.modalHeader}>
          <span className={styles.titleWrapper}>
            <h3 className={styles.title}>{place.name}</h3>

            <span className={styles.triLeft}></span>
          </span>
          <span
            className={styles.closeIcon}
            onClick={() => setShowModal(false)}
          >
            <CloseModal />
          </span>
        </span>
        <div className={styles.modalBody}>
          <div className={styles.desContainer}>
            <button className={styles.categoryBtn}>{icon}</button>

            <div className={styles.desWrapper}>
              <h4 className={styles.desTitle}>Beskrivning:</h4>
              <p className={styles.des}>{place.comment}</p>
              <p className={styles.des}>{place.comments.join(", ")}</p>
            </div>
            <p className={styles.address}>{place.city}</p>
            <a
              href={`https://www.google.se/maps/place/${place.address}+${place.city}`}
              className={styles.mapsBtn}
            >
              Öppna i google maps
            </a>
          </div>
        </div>
      </div>
    </section>,

    document.body
  );
}
