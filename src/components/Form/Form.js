import React, { useState, useEffect } from "react";

import styles from "./Form.module.css";
import { categories, commentChoices, landscapes } from "../../lib/FormLibrary";

import { getDocuments } from "../../firebaseHelpers";

import { getSubCities } from "../../lib/helpers";

import { allLandscapes } from "../../data/lan";

//Firestore
import { db, addDoc, collection } from "../../firebaseSetup";

const Form = () => {
  //form inputs
  const [name, setName] = useState("");
  const [misc, setMisc] = useState("");
  const [glutenfree, setGlutenfree] = useState(null);
  const [city, setCity] = useState("");
  const [subCity, setSubCity] = useState("");
  const [address, setAddress] = useState("");
  const [landscape, setLandscape] = useState("");
  const [dbSubCities, setdSubCities] = useState("");
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState([]);
  const [chooseComment, setChooseComment] = useState([]);
  const [error, setError] = useState(false);

  //DB Fetch

  const [landscapeIndex, setLandscapeIndex] = useState(null);

  const resetForm = () => {
    setName("");
    setMisc("");
    setCity("");
    setSubCity("");
    setAddress("");
    setGlutenfree(null);
    setLandscape("");
    setComment("");
    setCategory([]);
    setChooseComment([]);
  };

  useEffect(() => {
    getDocuments("Cities")
      .then((data) => setdSubCities(data))
      .catch((e) => console.log("ERROR : ", e));
  }, []);

  const subs = (city) => {
    let sub = dbSubCities.find((item) => item.hasOwnProperty(city));

    return sub;
  };

  const addTipToDatabase = async (e) => {
    e.preventDefault();

    if (category.length < 1) {
      setError(true);
      return;
    }

    if (glutenfree === null) {
      setError(true);
      return;
    }
    const docRef = await addDoc(collection(db, "Tips"), {
      name,
      landscape,
      city,
      subCity,
      address,
      glutenfree,
      comment,
      comments: chooseComment,
      categoryOther: misc,
      categories: category,
      createdAt: Date.now(),
    });

    resetForm();
  };

  const getCategorites = (checkedCategory) => {
    if (!category.includes(checkedCategory)) {
      setCategory([checkedCategory, ...category]);
    } else {
      setCategory(() => {
        return category.filter((comment) => {
          return checkedCategory !== comment;
        });
      });
    }
  };

  const getCommentsCategories = (checkedComment) => {
    if (!chooseComment.includes(checkedComment)) {
      setChooseComment([...chooseComment, checkedComment]);
    } else {
      setChooseComment(() => {
        return chooseComment.filter((comment) => {
          return checkedComment !== comment;
        });
      });
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.mapTips}>
        <div className={styles.mapTipsBg}></div>
        <div className={styles.mapTipsFg}>
          <h1 className={styles.mapTipsHeader}>Tipsa till matkartan!</h1>
          <span className={styles.triLeft}></span>
          <span className={styles.triRight}></span>
        </div>
      </div>

      <form className={styles.form} onSubmit={addTipToDatabase}>
        <label className={styles.label}>
          Namn på stället*
          <input
            className={styles.input}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Namn"
            value={name}
            required
          />
        </label>
        <div className={styles.categoryWrapper}>
          <h3
            style={{ color: `${error ? "red" : "inherit"}` }}
            className={styles.categoryTitle}
          >
            Kategori*
          </h3>
          {categories.map((cat, idx) => (
            <React.Fragment key={idx}>
              <input
                id={`${cat}category`}
                onChange={() => getCategorites(cat)}
                type="checkbox"
                className={styles.categoryInput}
                value={cat}
                checked={category.includes(cat)}
              />
              <label
                htmlFor={`${cat}category`}
                className={styles.categoryLabel}
              >
                {cat}
              </label>
            </React.Fragment>
          ))}

          <input
            type="text"
            placeholder="Övrigt?"
            onChange={(e) => setMisc(e.target.value)}
            className={styles.input}
            value={misc}
          />
        </div>
        <div className={styles.glutenfriBtnWrapper}>
          <label className={styles.label}>
            Är platsen helt glutenfri ?*
            <div className={styles.checkboxWrapper}>
              <input
                id="glutenfreeTrue"
                className={styles.glutenfriBtn}
                onChange={() => setGlutenfree(true)}
                type="radio"
                name="glutenfree"
                checked={glutenfree === true}
              />
              <label className={styles.glutenfriLabel} htmlFor="glutenfreeTrue">
                Ja
              </label>
              <input
                id="glutenfreeFalse"
                className={styles.glutenfriBtn}
                onChange={() => setGlutenfree(false)}
                type="radio"
                name="glutenfree"
                checked={glutenfree === false}
              />
              <label
                className={styles.glutenfriLabel}
                htmlFor="glutenfreeFalse"
              >
                Nej
              </label>
            </div>
          </label>
        </div>
        <label className={styles.label}>
          Adress
          <input
            className={styles.input}
            type="text"
            placeholder="Adress"
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            required
          />
        </label>
        <label className={styles.label}>
          Län*
          <select
            value={landscape}
            className={styles.input}
            type="select"
            onChange={(e) => {
              setLandscapeIndex(
                e.target.selectedIndex - 1
              ); /* manipulates the options array */
              setLandscape(e.target.value);
            }}
            required
          >
            <option key="optKey" value="">
              Välj län...
            </option>
            {allLandscapes.map((landscape, idx) => (
              <option key={idx}>{landscape.name}</option>
            ))}
          </select>
        </label>
        {landscape && (
          <label className={styles.label}>
            Stad*
            <select
              className={styles.input}
              type="select"
              onChange={(e) => setCity(e.target.value)}
              value={city}
              required
            >
              <option key="optKey">Välj stad...</option>
              {allLandscapes[landscapeIndex].cities.map((city, idx) => (
                <option key={idx}>{city.city}</option>
              ))}
            </select>
            {city && subs(city) !== undefined && (
              <select
                className={styles.input}
                type="select"
                onChange={(e) => setSubCity(e.target.value)}
                value={subCity}
                required
              >
                <option key="optKey">Välj stadsdel...</option>
                {getSubCities(dbSubCities, city).map((city, idx) => (
                  <option key={idx}>{city}</option>
                ))}
              </select>
            )}
          </label>
        )}

        <div className={styles.commentChoicesWrapper}>
          <label className={styles.label}>
            Varför tipsar du om det här stället?
            <input
              className={styles.input}
              type="text"
              placeholder="Kommentar..."
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
          </label>
          {commentChoices.map((commentItem, idx) => (
            <React.Fragment key={idx}>
              <input
                id={commentItem + idx}
                onChange={(e) => getCommentsCategories(e.currentTarget.value)}
                type="checkbox"
                className={styles.commentChoicesInput}
                value={commentItem}
                checked={chooseComment.includes(commentItem)}
              />
              <label
                htmlFor={commentItem + idx}
                className={styles.commentChoicesLabel}
              >
                {commentItem}
              </label>
            </React.Fragment>
          ))}
        </div>
        <button className={styles.sendBtn} type="submit">
          Skicka in tips!
        </button>
        {error && (
          <p style={{ color: `${error ? "red" : "inherit"}` }}>
            Du måste välja om platsen är glutenfri eller inte.
          </p>
        )}
      </form>
    </section>
  );
};

export default Form;
