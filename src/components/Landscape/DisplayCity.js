import styles from "./Landscape.module.css";
import { useNavigate } from "react-router-dom";

const DisplayCity = ({ city, cities }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/city/${city}`);
  };
  return (
    <a className={styles.link} href="" onClick={handleClick}>
      <h3 className={styles.h3}>{city}</h3>
    </a>
  );
};

export default DisplayCity;
