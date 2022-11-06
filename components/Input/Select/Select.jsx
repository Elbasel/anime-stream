import React, { useRef } from "react";
import styles from "./Select.module.scss";

export function Select({ name, options, onValueChange, value }) {
  if (!options) return;

  const selectRef = useRef(null);

  const handleChange = (opt) => {
    selectRef.current.open = false;
    onValueChange(opt);
  };

  return (
    <div className={styles.Select}>
      <details ref={selectRef}>
        <summary className={styles.radios}>
          {options.map((opt) => (
            <input
              key={opt}
              onChange={() => handleChange(opt)}
              type="radio"
              name={name}
              id={opt}
              title={opt}
              checked={opt === value}
            />
          ))}
        </summary>
        <ul className={styles.list}>
          {options.map((opt) => (
            <li key={opt}>
              <label htmlFor={opt}>
                {opt}
                <span></span>
              </label>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
