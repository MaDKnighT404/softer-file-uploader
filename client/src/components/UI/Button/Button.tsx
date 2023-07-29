import classNames from 'classnames';
import styles from './Button.module.scss';

const Button = ({
  title,
  className,
  onClick,
}: {
  title: string;
  className?: string;
  onClick?: () => void;
}) => {
  const buttonClasses = classNames(styles.button, className && styles[className]);

  return (
    <button className={buttonClasses} onClick={onClick}>
      {title}
    </button>
  );
};

export default Button;
