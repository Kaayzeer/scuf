import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

import styles from "./Login.module.css";
import Header from "../components/Header/Header";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgottenPassword, setForgottenPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { error, login, sendPasswordReset, message } = useLogin();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password) {
      console.log("inlogg ok");
      login(email, password);
    }

    navigate("/admin");
  };

  const sendPassword = async (e) => {
    e.preventDefault();
    await sendPasswordReset(forgottenPassword);

    setTimeout(() => {
      setIsLogin(true);
    }, 3000);
  };

  return (
    <>
      <Header title="Logga in" />
      <section className={styles.container}>
        {isLogin ? (
          <>
            <form className={styles.form} onSubmit={handleSubmit}>
              <h2 className={styles.title}>Logga in</h2>
              <label className={styles.label}>
                <span className={styles.span}>Email:</span>
                <input
                  className={styles.input}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </label>
              <label className={styles.label}>
                <span className={styles.span}>Lösenord:</span>
                <input
                  className={styles.input}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </label>
              <div className={styles.buttonWrapper}>
                <button className={styles.button}>Logga in</button>
                <button
                  className={styles.button}
                  onClick={() => {
                    setIsLogin(false);
                    setPassword("");
                  }}
                >
                  Glömt lösenord?
                </button>
              </div>
              {error && <p>{error}</p>}
            </form>
          </>
        ) : (
          <>
            <form className={styles.form} onSubmit={handleSubmit}>
              <h2 className={styles.title}>Glömt lösenord?</h2>
              <label className={styles.label}>
                <span className={styles.span}>Email:</span>
                <input
                  className={styles.input}
                  type="email"
                  onChange={(e) => setForgottenPassword(e.target.value)}
                  value={forgottenPassword}
                />
              </label>
              <div className={styles.buttonWrapper}>
                <button className={styles.button} onClick={sendPassword}>
                  Skicka
                </button>
                <button className={styles.button}>Tillbaka</button>
              </div>
              {error && <p className={styles.p}>{error}</p>}
              {message && <p className={styles.p}>{message}</p>}
            </form>
          </>
        )}
      </section>
    </>
  );
}
