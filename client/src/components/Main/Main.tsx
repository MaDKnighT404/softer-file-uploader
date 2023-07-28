import { FileUploader } from '../FileUploader';
import styles from './Main.module.scss';

const Main = () => {
  return (
    <main className={styles.main}>
      <div className={styles.main__wrapper}>
        <FileUploader />
      </div>
    </main>
  );
};

export default Main;
