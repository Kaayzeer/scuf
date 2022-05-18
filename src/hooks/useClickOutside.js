import { useState, useEffect, useRef } from "react";

export default function useClickOutside(initialIsVisible) {
    const [clickedOutside, setClickedOutside] = useState(false);
    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setClickedOutside(true);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    return { ref, clickedOutside };
}
