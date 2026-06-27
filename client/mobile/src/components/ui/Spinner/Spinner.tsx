import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: number;
}

export function Spinner({ size = 24 }: SpinnerProps) {
  return (
    <span
      className={styles.spinner}
      style={{ width: size, height: size }}
      role="status"
      aria-label="로딩 중"
    />
  );
}

export default Spinner;
