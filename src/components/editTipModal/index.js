import React, { useEffect, useState } from "react";
import styles from "./EditTipModal.module.css";

import { categories, commentChoices } from "../../lib/FormLibrary";
import { allLandscapes } from "../../data/lan";

import CloseModal from "./../../static/icons/CloseModal";
import useClickOutside from "./../../hooks/useClickOutside";
import {
  addNewDocument,
  deleteDocument,
  updateDocument,
} from "../../firebaseHelpers";

export default function EditTipModal({
  setModal,
  setTips,
  tips,
  setPlaces,
  places,
  modal,
  setListToUpdate,
  listToUpdate,
  tip,
  bigCities,
  addedList,
  setAddedList,
}) {
  const initialValues = {
    name: "",
    categories: [],
    categoryOther: "",
    glutenfree: null,
    address: "",
    city: "",
    subCity: "", // om staden har under
    landscape: "",
    comments: [],
    comment: "",
    createdAt: Date.now(),
  };

  const [formData, setFormData] = useState(tip ? tip : initialValues);
  const { ref, clickedOutside } = useClickOutside(false);
  const [errorsMsg, setErrorsMsg] = useState({});

  const errorSchema = {
    name: (val) => typeof val == "string" && val.length > 2,
    categories: (val) => val.length >= 1 || formData.categoryOther.length > 2,
    categoryOther: (val) =>
      (typeof val == "string" && val.length > 2) ||
      formData.categories.length > 0,
    glutenfree: (val) => val !== null,
    address: (val) => typeof val == "string" && val.length > 2,
    city: (val) => val.length > 2,
    landscape: (val) => typeof val == "string" && val.length > 2,
    subCity: (val) =>
      findCityInArr(formData.city) !== undefined
        ? typeof val == "string" && val.length > 2
        : true,
    comments: (val) => val.length >= 1 || formData.comment.length > 2,
    comment: (val) => {
      return (
        (typeof val == "string" && val.length > 2) ||
        formData.categories.length > 0
      );
    },
  };

  //filter object by the expressioned defined in schema
  const validateErrors = (object, schema) =>
    Object.keys(schema).filter((key) => !schema[key](object[key]));

  //if useClickOutside-hook returns true, run handleModalClose
  useEffect(() => {
    if (clickedOutside) handleModalClose();
  }, [clickedOutside]);

  const exractedSubCities = (cityName) => {
    let arr = [];
    allLandscapes.forEach((item) => {
      if (item.name === cityName) {
        arr = [...item.cities];
      }
    });
    return arr;
  };

  const resetForm = () => {
    setFormData(initialValues);
  };

  const handleModalClose = () => {
    setModal({ open: false, tipObject: {}, type: "" });
  };

  const findCityInArr = (city) => {
    return bigCities.find((item) => item.hasOwnProperty(city));
  };

  const addTipToDatabase = (e) => {
    e.preventDefault();

    const errors = validateErrors(formData, errorSchema);
    if (errors.length > 0) {
      let temp = {};
      errors.forEach((val) => {
        temp = { [val]: true, ...temp };
      });
      setErrorsMsg(temp);
      return;
    }

    try {
      if (formData && formData.id) {
        updateDocument("Places", formData.id, formData)
          .then(() => {
            if (modal.type === "tip") {
              deleteDocument("Tips", formData.id);
              let tempData = [...listToUpdate].filter(
                (x) => x.id !== formData.id
              );
              setListToUpdate(tempData);
              setAddedList([...addedList, formData]);
            } else {
              if (!places.find((x) => x.id === formData.id)) {
                setPlaces([...places, formData]);
              } else {
                let temp = places.map((place) =>
                  place.id !== formData.id ? place : formData
                );
                setPlaces(temp);
              }
            }
            handleModalClose();
          })
          .catch((e) => console.log("Error: ", e));
      } else {
        addNewDocument("Places", formData)
          .then(() => {
            setAddedList([...addedList, formData]);
          })
          .then(() => handleModalClose())
          .catch((e) => console.log("Error: ", e));
      }
    } catch (e) {
      console.error(e);
    }
    resetForm();
  };

  const handleDeleteTip = async (collection) => {
    if (formData.id) {
      if (
        window.confirm(
          `Är du säkert på att du vill ta bort ${
            modal.type === "tip" ? "tipset" : "platsen"
          } ${formData.name}?`
        )
      ) {
        await deleteDocument(collection, formData.id)
          .then(() => {
            handleModalClose();
            if (modal.type === "tip") {
              let temp = [...tips].filter((x) => x.id !== formData.id);
              setTips(temp);
            } else {
              let temp = [...places].filter((x) => x.id !== formData.id);
              setPlaces(temp);
            }
          })
          .catch((e) => console.log("Error", e));
      }
    } else {
      handleModalClose();
    }
  };

  const handleCheckbox = (e, arr) => {
    const stateCopy = { ...formData };
    if (e.target.checked) {
      if (!stateCopy[arr].includes(e.target.value)) {
        stateCopy[arr].push(e.target.value);
        setFormData(stateCopy);
      }
    } else {
      stateCopy[arr] = stateCopy[arr].filter((cat) => cat !== e.target.value);
      setFormData({ ...stateCopy });
    }
  };

  return (
    <div className={styles.bgOverlay}>
      <section ref={ref} className={styles.container}>
        <div className={styles.mapTips}>
          <div className={styles.textArea}>
            {tip ? (
              <>
                <h1>{formData.name}</h1>
                <h2>{formData.city}</h2>
                <p>{formData.address}</p>
              </>
            ) : (
              <h1>Lägg till nytt</h1>
            )}
          </div>
          <button className={styles.close} onClick={handleModalClose}>
            <CloseModal />
          </button>
        </div>

        <form className={styles.form} onSubmit={(e) => addTipToDatabase(e)}>
          <label className={styles.label}>
            Namn på Restaurang{" "}
            {errorsMsg.name && (
              <span className={styles.error}>Vänligen fyll i fältet</span>
            )}
            <input
              className={styles.input}
              inputMode="text"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              type="text"
              placeholder="Namn"
              value={formData.name}
            />
          </label>
          <label className={styles.categoryTitle}>
            Kategori{" "}
            {errorsMsg.categories ||
              (errorsMsg.categoryOther ? (
                <span className={styles.error}>Vänligen fyll i fältet</span>
              ) : null)}
            <div className={styles.categoryWrapper}>
              {categories.map((category, idx) => (
                <div key={idx} className={styles.categoryItem}>
                  <input
                    id={`${category}category`}
                    onChange={(e) => handleCheckbox(e, "categories")}
                    type="checkbox"
                    className={styles.categoryInput}
                    value={category}
                    checked={formData.categories.includes(category)}
                  />
                  <label
                    htmlFor={`${category}category`}
                    className={styles.categoryLabel}
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Övrigt?"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categoryOther: e.target.value,
                })
              }
              className={styles.input}
              value={formData.categoryOther}
            />
          </label>
          <label className={styles.label}>
            Är platsen helt glutenfri ?{" "}
            {errorsMsg.glutenfree && (
              <span className={styles.error}>Vänligen fyll i fältet</span>
            )}
            <div className={styles.checkboxWrapper}>
              <input
                id="glutenfreeTrue"
                className={styles.glutenfriBtn}
                onChange={() => setFormData({ ...formData, glutenfree: true })}
                type="radio"
                name="glutenfree"
                checked={formData.glutenfree === true}
              />
              <label className={styles.glutenfriLabel} htmlFor="glutenfreeTrue">
                Ja
              </label>
              <input
                id="glutenfreeFalse"
                className={styles.glutenfriBtn}
                onChange={() => setFormData({ ...formData, glutenfree: false })}
                type="radio"
                name="glutenfree"
                checked={formData.glutenfree === false}
              />
              <label
                className={styles.glutenfriLabel}
                htmlFor="glutenfreeFalse"
              >
                Nej
              </label>
            </div>
          </label>

          <label className={styles.label}>
            Adress{" "}
            {errorsMsg.address && (
              <span className={styles.error}>Vänligen fyll i fältet</span>
            )}
            <input
              className={styles.input}
              type="text"
              placeholder="Gatunamn 123"
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              value={formData.address}
            />
          </label>
          <label className={styles.label}>
            Län{" "}
            {errorsMsg.landscape && (
              <span className={styles.error}>Vänligen fyll i fältet</span>
            )}
            <select
              value={formData.landscape}
              className={styles.input}
              type="select"
              onChange={(e) => {
                setFormData({ ...formData, landscape: e.target.value });
              }}
            >
              <option key={"optkey"} value="">
                Välj län
              </option>
              {allLandscapes.map((landscape, i) => (
                <option key={i} value={landscape.name}>
                  {landscape.name}
                </option>
              ))}
            </select>
          </label>

          {formData.landscape && (
            <label className={styles.label}>
              Stad{" "}
              {errorsMsg.city && (
                <span className={styles.error}>Vänligen fyll i fältet</span>
              )}
              <select
                value={formData.city}
                className={styles.input}
                type="select"
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              >
                <option key="optkey">Välj stad...</option>
                {exractedSubCities(formData.landscape).map((city, i) => (
                  <option key={i} value={city.city}>
                    {city.city}
                  </option>
                ))}
              </select>
            </label>
          )}
          {formData.city && findCityInArr(formData.city) !== undefined ? (
            <label className={styles.label}>
              Stadsdel{" "}
              {errorsMsg.subCity && (
                <span className={styles.error}>Vänligen fyll i fältet</span>
              )}
              <select
                value={formData.subCity}
                className={styles.input}
                type="select"
                onChange={(e) =>
                  setFormData({ ...formData, subCity: e.target.value })
                }
              >
                <option value="" key="optkey">
                  Välj stadsdel...
                </option>
                {findCityInArr(formData.city)[formData.city].map(
                  (subCity, i) => (
                    <option key={i} value={subCity}>
                      {subCity}
                    </option>
                  )
                )}
              </select>
            </label>
          ) : null}

          <div className={styles.commentChoicesWrapper}>
            <label className={styles.label}>
              Vad är bra med platsen?{" "}
              {errorsMsg.comment || errorsMsg.comments ? (
                <span className={styles.error}>Vänligen fyll i fältet</span>
              ) : null}
              <input
                className={styles.input}
                type="text"
                placeholder="Kommentar..."
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                value={formData.comment}
              />
            </label>
            <div className={styles.commentInnerWrapper}>
              {commentChoices.map((comment, idx) => (
                <div key={idx} className={styles.commentChoicesItem}>
                  <input
                    id={comment + idx}
                    onChange={(e) => handleCheckbox(e, "comments")}
                    type="checkbox"
                    className={styles.commentChoicesInput}
                    value={comment}
                    checked={formData.comments.includes(comment)}
                  />
                  <label
                    htmlFor={comment + idx}
                    className={styles.commentChoicesLabel}
                  >
                    {comment}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.checkboxWrapper}>
            <button type="submit" className={styles.sendBtn}>
              Godkänn
            </button>
            <button
              type="button"
              className={styles.sendBtn}
              onClick={() =>
                handleDeleteTip(modal.type === "tip" ? "Tips" : "Places")
              }
            >
              {modal.type === "tip"
                ? "Neka"
                : modal.type === "place"
                ? "Ta bort"
                : "Avbryt"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
