import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <h4 className={styles.footer__title}>
        <a href="https://github.com/MaDKnighT404">Georgii Koloidi || </a>
        <span>Battleaxe@bk.ru || </span> <span>+7 918 204 28 88</span>
      </h4>
    </footer>
  );
};

export default Footer;
