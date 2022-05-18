import { useState, useRef, useEffect } from "react";

//Components
import Landscape from "../components/Landscape/Landscape";
import Header from "../components/Header/Header";
import Map from "../components/Map/Map";
import Form from "../components/Form/Form";

//Firestore
import { db } from "../firebaseSetup";
import { getDocs, collection, query, where } from "firebase/firestore";

function Home() {
  const [isShowing, setIsShowing] = useState(false);
  const [landscape, setLandscape] = useState([]);
  const [cities, setCities] = useState("");

  const myRef = useRef(null);

  const scrollToRef = () => {
    myRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  useEffect(() => {
    if (isShowing) {
      scrollToRef(myRef);
    }
  }, [isShowing]);

  const handleClick = () => {
    setIsShowing(true);
  };

  const handleLocation = (e) => {
    setLandscape(e.target.getAttribute("name"));
    getCities(e.target.getAttribute("name"));
  };

  const getCities = async (landscape) => {
    var cities = new Array();
    const q = query(
      collection(db, "Places"),
      where("landscape", "==", landscape)
    );
    const citiesSnapshot = await getDocs(q);
    citiesSnapshot.docs.forEach((doc) => {
      cities.push({ id: doc.id, ...doc.data() });
    });
    setCities(cities);
  };

  return (
    <>
      <Header
        title="Glutenfria Matkartan"
        para="Hitta till hundratals caféer och restauranger med glutenfria
            alternativ"
      />
      <Map handleClick={handleClick} handleLocation={handleLocation} />
      {!isShowing && <Form />}
      {isShowing && (
        <div ref={myRef}>
          <Landscape landscape={landscape} cities={cities} />
        </div>
      )}
    </>
  );
}

export default Home;
