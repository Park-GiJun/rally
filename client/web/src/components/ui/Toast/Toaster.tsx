import { useToastStore } from '../../../store/toastStore';
import styles from './Toaster.module.css';

/** 전역 토스트 컨테이너. main.tsx 에서 한 번 마운트한다. */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container} role="region" aria-label="알림">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          className={[styles.toast, styles[t.type]].join(' ')}
          onClick={() => remove(t.id)}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}

export default Toaster;
