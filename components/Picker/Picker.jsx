import { useEffect, useRef } from "react";
import styles from "./Picker.module.scss";

export default function Picker({ options = [], onValueChange, selectedValue }) {
  if (!onValueChange) onValueChange = () => {};


  const selectedRef = useRef(null)
  useEffect(() => {
    selectedRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [selectedRef.current]);


  return (
    <div className={styles.container}>
      <h3 className={styles.title}>List Of Episodes :</h3>
      {options.map((opt) => {
        const itemProps = opt.id === selectedValue ? { ref: selectedRef } : {};

        return (
          <div
            key={opt.id}
            className={`${styles.option} ${
              opt.id === selectedValue ? styles.selected : ""
            }`}
            onClick={() => onValueChange(opt.id)}
        {...itemProps}
          >
            <span>{opt.number}</span>
            <span>
              {opt.title.replaceAll("Eps", "").replaceAll(/\d:/g, "")}
            </span>
          </div>
        );
      })}
    </div>
  );
}
