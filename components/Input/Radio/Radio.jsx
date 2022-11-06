import React from "react";
import styles from "./Radio.module.scss";

export function Radio({ options, name, onValueChange, value }) {
  if (!options) return;
  return (
    <div className={styles.container}>
      {options.map((opt) => (
        <React.Fragment key={opt}>
          <input
            onChange={() => onValueChange(opt)}
            type="radio"
            name={name}
            id={opt}
            checked={value === opt}
          />
          <label htmlFor={opt}>{opt}</label>
        </React.Fragment>
      ))}
    </div>
  );
}
