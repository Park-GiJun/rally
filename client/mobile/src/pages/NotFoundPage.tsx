import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>페이지를 찾을 수 없어요</h1>
      <p className={styles.description}>
        주소가 바뀌었거나 삭제된 페이지일 수 있어요.
      </p>
      <Link to="/">
        <Button variant="secondary">피드로 돌아가기</Button>
      </Link>
    </div>
  );
}
