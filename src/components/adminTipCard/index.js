import { useState } from "react";
import styles from "./AdminTipCard.module.css";
import { MdKeyboardArrowDown } from "react-icons/md";
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
export default function AdminTipCard({ tip, handleModalOpen, index }) {
  const [expand, setExpand] = useState(false);

  return (
    <li className={styles.listItem} style={{ animationDelay: `${index}00ms` }}>
      <span className={styles.upWrapper}>
        <h3 className={styles.title}>{tip.name}</h3>
        <span className={styles.rotateIcon} onClick={() => setExpand(!expand)}>
          <MdKeyboardArrowDown
            style={{
              transition: "all 0.2s",
              transform: expand && "rotate(-180deg)",
            }}
            fontSize={25}
          />
        </span>
      </span>
      <span
        className={styles.downWrapper}
        style={{
          transition: "all 0.3s",
          maxHeight: expand ? "700px" : "70px",
        }}
      >
        <div className={styles.downInnerWrapper}>
          <div className={styles.para}>
            {expand ? (
              tip.categories.map((cat, idx) => (
                <span key={idx} className={styles.icon}>
                  {tip.categories?.length > 0 &&
                  Object.keys(icons).includes(cat)
                    ? icons[cat]
                    : icons.Övrigt}
                </span>
              ))
            ) : (
              <span className={styles.icon}>
                {tip.categories?.length > 0 &&
                Object.keys(icons).includes(tip.categories[0])
                  ? icons[tip.categories[0]]
                  : icons.Övrigt}
              </span>
            )}
            <div>
              <p>{tip.city}</p>
            </div>
          </div>
          <button className={styles.btn} onClick={() => handleModalOpen()}>
            Granska
          </button>
        </div>
        <div
          className={styles.textVanish}
          style={{
            transition: "all 0.2s",
            maxHeight: expand ? "600px" : "70px",
            opacity: expand ? 1 : 0,
          }}
        >
          <div className={styles.desc}>
            <span>Adress:</span>
            <p>
              {tip.address}
              {tip.subCity && ", " + tip.subCity}
            </p>
          </div>
          {tip.categories && (
            <div className={styles.desc}>
              <span>Kategorier:</span>
              <p>
                {tip.categories?.length > 1
                  ? tip.categories?.join(", ")
                  : tip.categories[0]}
              </p>
            </div>
          )}

          <div className={styles.desc}>
            <span>Kategori övrigt:</span>
            <p>{tip.categoryOther}</p>
          </div>
          <div className={styles.desc}>
            <span>Egen kommentar:</span>
            <p>{tip.comment}</p>
          </div>
          {tip.comments && (
            <div className={styles.desc}>
              <span>Kommentarer:</span>
              <p>
                {tip.comments.lenght > 1
                  ? tip.comments?.join(", ")
                  : tip.comments[0]}
              </p>
            </div>
          )}
          <div className={styles.desc}>
            <span>Helt glutenfritt:</span>
            <p>{tip.glutenfree ? "Ja" : "Nej"}</p>
          </div>
          <div className={styles.desc}>
            <span>Län:</span>
            <p>{tip.landscape}</p>
          </div>
        </div>
      </span>
    </li>
  );
}
