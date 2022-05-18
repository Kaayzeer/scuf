import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
// firebase imports
import { auth } from "../firebaseSetup";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const { dispatch } = useAuthContext();

  const login = (email, password) => {
    setError(null);

    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        dispatch({ type: "LOGIN", payload: res.user });
        console.log("success");
      })
      .catch((err) => {
        console.error("login gick inte igenom");
        setError(err.message);
      });
  };

  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("password sent to email");
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };

  return { error, login, sendPasswordReset, message };
};
