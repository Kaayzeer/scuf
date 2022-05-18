import React, { useEffect, useState, useRef } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

import cardStyles from "../adminTipCard/AdminTipCard.module.css";
import styles from "../../pages/admin/AdminPanel.module.css";
import { RedCross } from "../../static/icons";
import { deleteDocument, updateDocument } from "../../firebaseHelpers";

export default function BigCityCard({ bigCity, setBigCities, bigCities }) {
  const [expand, setExpand] = useState(false);
  const [edit, setEdit] = useState(false);

  const formRef = useRef();

  useEffect(() => {
    if (edit) {
      setExpand(true);
    }
  }, [edit]);

  useEffect(() => {
    if (!expand && edit) {
      setEdit(false);
    }
  }, [expand]);

  const addSubCity = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const subCity = data.get("subCity");
    let changes = {
      [Object.keys(bigCity)[1]]: [...bigCity[Object.keys(bigCity)[1]], subCity],
    };
    await updateDocument("Cities", bigCity.id, changes);
    //update the state to avoid additional requests
    let tempCities = [...bigCities];
    let foundIndex = tempCities.findIndex((x) => x.id === bigCity.id);
    tempCities[foundIndex] = { id: bigCity.id, ...changes };
    setBigCities(tempCities);
    formRef.current.reset();
  };

  const handleDeleteCity = async () => {
    if (window.confirm("Är du säkert på att du vill ta bort staden?")) {
      await deleteDocument("Cities", bigCity.id)
        .then(() => {
          let tempCities = [...bigCities].filter((x) => x.id !== bigCity.id);
          setBigCities(tempCities);
        })
        .catch((e) => console.log("ERROR: ", e));
    }
  };
  const handleDeleteSubCity = async (subCityName) => {
    if (window.confirm("Är du säkert på att du vill ta bort stadsdelen?")) {
      let changes = {
        [Object.keys(bigCity)[1]]: bigCity[Object.keys(bigCity)[1]].filter(
          (x) => x !== subCityName
        ),
      };
      await updateDocument("Cities", bigCity.id, changes)
        .then(() => {
          let tempCities = [...bigCities];
          let foundIndex = tempCities.findIndex((x) => x.id === bigCity.id);
          tempCities[foundIndex] = { id: bigCity.id, ...changes };
          setBigCities(tempCities);
        })
        .catch((err) => console.log("ERROR: ", err));
    }
  };

  return (
    <li className={cardStyles.listItem}>
      <span
        className={cardStyles.downWrapper}
        style={{
          transition: "all 0.3s",
          maxHeight: expand ? "2500px" : "70px",
        }}
      >
        <div className={cardStyles.downInnerWrapper}>
          <div className={cardStyles.para} onClick={() => setExpand(!expand)}>
            <div>
              <p>{Object.keys(bigCity)[1]}</p>
            </div>
            <span className={cardStyles.rotateIcon}>
              <MdKeyboardArrowDown
                style={{
                  transition: "all 0.2s",
                  transform: expand && "rotate(-180deg)",
                }}
                fontSize={25}
              />
            </span>
          </div>
          <div>
            {edit && (
              <button
                className={cardStyles.btn}
                style={{
                  padding: "1rem 1rem",
                  marginRight: "1rem",
                  background: "white",
                  color: "red",
                  border: "1px solid red",
                }}
                onClick={() => handleDeleteCity()}
              >
                Ta bort
              </button>
            )}
            <button
              className={cardStyles.btn}
              style={
                edit
                  ? {
                      padding: "1rem 1rem",
                      background: "white",
                      border: "1px solid black",
                    }
                  : null
              }
              onClick={() => setEdit((edit) => !edit)}
            >
              {edit ? "Avbryt" : "Ändra"}
            </button>
          </div>
        </div>
        <div
          className={cardStyles.textVanish}
          style={{
            transition: "all 0.2s",
            maxHeight: expand ? "2500px" : "70px",
            opacity: expand ? 1 : 0,
          }}
        >
          {edit && (
            <form
              ref={formRef}
              className={styles.inlineForm}
              onSubmit={(e) => addSubCity(e)}
            >
              <input name="subCity" placeholder="Lägg till stadsdel" />
              <button className={styles.btn} type="submit">
                Lägg till
              </button>
            </form>
          )}
          {bigCity[Object.keys(bigCity)[1]].length > 0 ? (
            bigCity[Object.keys(bigCity)[1]].map((subCities, idx) => (
              <div key={idx} className={cardStyles.desc}>
                <p>{subCities}</p>
                {edit && (
                  <span onClick={() => handleDeleteSubCity(subCities)}>
                    <RedCross />
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className={cardStyles.desc}>
              <p>Staden har inte stadsdelar</p>
            </div>
          )}
        </div>
      </span>
    </li>
  );
}
