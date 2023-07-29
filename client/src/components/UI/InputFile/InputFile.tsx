import React from 'react';
import styles from './Input.module.scss';
const InputFile = ({ onChange }: { onChange(e: React.ChangeEvent<HTMLInputElement>): void }) => {
  return (
    <div className={styles.input__wrapper}>
      <input
        name="file"
        type="file"
        id="input__file"
        className={styles.input__file}
        multiple
        onChange={onChange}
      />
      <label htmlFor="input__file" className={styles.input__file_button}>
        <span className={styles.input__file_button_text}>Выберите файл</span>
      </label>
    </div>
  );
};

export default InputFile;
