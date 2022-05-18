import React from "react";
import styles from "./Header.module.css";

export default function Header({ title, para }) {
    return (
        <>
            <header className={styles.header}>
                <div className={styles.titleContainer}>
                    <h1 className={styles.h1}>{title}</h1>
                    <p className={styles.p}>{para}</p>
                </div>
            </header>
            <section className={styles.circleSection}>
                <span className={styles.circleW1}></span>
                <span className={styles.circleW2}></span>
                <span className={styles.circleW3}></span>
                <span className={styles.circleG1}></span>
                <span className={styles.circleG2}></span>
                <span className={styles.circleG3}></span>
            </section>
        </>
    );
}
