import React, { useState } from "react";
import styles from "./CategoriesList.module.css";

import DescModal from "../DescModal/DescModal";

import {
  Bageri,
  Kafé,
  Hotell,
  Matbutik,
  Nöjesfält,
  Restaurang,
  Snabbmatsrestaurang,
  Catering,
  Övrigt,
} from "../../static/icons";

const icons = {
  Bageri: <Bageri />,
  Kafé: <Kafé />,
  Hotell: <Hotell />,
  Matbutik: <Matbutik />,
  Nöjesfält: <Nöjesfält />,
  Restaurang: <Restaurang />,
  Snabbmatsrestaurang: <Snabbmatsrestaurang />,
  Catering: <Catering />,
  Övrigt: <Övrigt />,
};

export default function CategoriesList({ places, city }) {
  const [showModal, setShowModal] = useState(false);
  const [clickedPlace, setClickedPlace] = useState([]);

  const handleOpenModal = (place) => {
    setClickedPlace(place);
    setShowModal(true);
  };
  return (
    <section className={showModal ? styles.modalStyle : styles.container}>
      <ul className={styles.ul}>
        {places.map((place, idx) => (
          <React.Fragment key={idx}>
            <li className={styles.list} onClick={() => handleOpenModal(place)}>
              <span className={styles.upWrapper}>
                <h3 className={styles.title}>{place.name}</h3>
              </span>
              <span className={styles.downWrapper}>
                <span className={styles.icon}>
                  {Object.keys(icons).includes(place.categories[0])
                    ? icons[place.categories[0]]
                    : icons.Övrigt}
                </span>
                <p className={styles.address}>{place.city}</p>
              </span>
            </li>

            {showModal && (
              <DescModal
                place={clickedPlace}
                city={city}
                setShowModal={setShowModal}
              />
            )}
          </React.Fragment>
        ))}
      </ul>
    </section>
  );
}
