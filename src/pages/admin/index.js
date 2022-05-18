import React, { useState, useEffect } from "react";
import styles from "./AdminPanel.module.css";

// custom hooks
import { useLogout } from "./../../hooks/useLogout";

// components
import AdminTipCard from "./../../components/adminTipCard";
import EditTipModal from "../../components/editTipModal";

// helper funcs
import { getDocuments } from "../../firebaseHelpers";
import PlacesList from "../../components/PlacesList";
import BigCitiesList from "../../components/BigCitiesList";

export default function AdminPanel() {
  const [tips, setTips] = useState([]);
  const [places, setPlaces] = useState([]);
  const [bigCities, setBigCities] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [modal, setModal] = useState({
    //open edit modal
    open: false,
    tipObject: {},
    type: "",
  });

  const handleShowAll = () => setShowAll((showAll) => !showAll);

  const handleModalOpen = (tip, type = "") => {
    setModal({
      open: true,
      tipObject: tip && tip, // if tip is passed
      type: type, // to differenciate the behavior of the form to the type - "tip" | "place" | ""
    });
  };

  const itemsToRender = showAll || tips.length < 5 ? tips : tips.slice(0, 2);

  useEffect(() => {
    getDocuments("Tips")
      .then((data) => data.sort((a, b) => b.createdAt - a.createdAt))
      .then((data) => setTips(data))
      .catch((e) => console.log("ERROR : ", e));
    getDocuments("Places")
      .then((data) => setPlaces(data))
      .catch((e) => console.log("ERROR : ", e));
  }, []);

  useEffect(() => {
    getDocuments("Cities")
      .then((data) => setBigCities(data))
      .catch((e) => console.log("ERROR : ", e));
  }, []);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Nya Tips ({tips.length})</h1>
        </div>
        <ul className={styles.ul}>
          {itemsToRender.map((tip, index) => (
            <AdminTipCard
              key={tip.id}
              tip={tip}
              handleModalOpen={() => handleModalOpen(tip, "tip")}
              index={index}
            />
          ))}

          <li
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              paddingBottom: "3rem",
            }}
          >
            {tips.length < 5 ? null : (
              <button className={styles.showAll} onClick={handleShowAll}>
                Visa {showAll ? "mindre" : "fler"}
              </button>
            )}
          </li>
        </ul>
      </div>
      <PlacesList
        handleModalOpen={handleModalOpen}
        places={places}
        setPlaces={setPlaces}
        title="Hantera restauranger"
        buttonValue="Lägg till nytt"
      />
      <BigCitiesList buttonValue="Lägg till storstad" title="Hantera städer" />
      {modal.open && (
        <EditTipModal
          bigCities={bigCities}
          setModal={setModal}
          tip={modal.tipObject}
          modal={modal}
          listToUpdate={tips}
          setListToUpdate={setTips}
          addedList={places}
          setAddedList={setPlaces}
          setTips={setTips}
          tips={tips}
          setPlaces={setPlaces}
          places={places}
        />
      )}
    </>
  );
}

export function Header() {
  const { logout } = useLogout();

  return (
    <header className={styles.header}>
      <div className={styles.titleContainer}>
        <h1 className={styles.h1}>Matkartan Admin</h1>
        <button
          className={styles.btn}
          style={{ background: "white" }}
          onClick={logout}
        >
          Logga ut
        </button>
      </div>
    </header>
  );
}
