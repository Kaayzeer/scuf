import React, { useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

import styles from "./Slider.module.css";

import { iconsArray, buttons } from "../../lib/SliderLibrary";

export default function Slider({ click }) {
  const contRef = useRef(null);

  const scroll = (scrollOffset) => {
    contRef.current.scrollLeft += scrollOffset;
  };

  const nextSlide = () => {
    scroll(150);
  };

  const prevSlide = () => {
    scroll(-150);
  };
  return (
    <>
      <div className={styles.btnCunt}>
        <button onClick={prevSlide} className={styles.prev}>
          <IoIosArrowBack />
        </button>

        <button onClick={nextSlide} className={styles.next}>
          <IoIosArrowForward />
        </button>
      </div>
      <section ref={contRef} className={styles.container}>
        <div className={styles.buttonWrapper}>
          {buttons.map((button, idx) => (
            <button
              key={idx}
              className={styles.btnCat}
              onClick={() => click(button)}
            >
              {iconsArray[idx]} {button}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
