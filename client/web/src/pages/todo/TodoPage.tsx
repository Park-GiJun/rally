import { Card, EmptyState, PageHeader, Spinner } from '../../components/ui';
import { CheckIcon } from '../../components/ui/icons';
import { useTodo } from './useTodo';
import styles from './TodoPage.module.css';

export default function TodoPage() {
  const {
    todos,
    isLoading,
    isError,
    title,
    setTitle,
    submit,
    isSubmitting,
    toggle,
    remove,
  } = useTodo();

  const remaining = (todos ?? []).filter((t) => !t.done).length;

  return (
    <div className={styles.page}>
      <PageHeader
        title="할 일"
        description={`남은 할 일 ${remaining}개 · 완료하면 대시보드 피드에 기록돼요.`}
      />

      <Card padding="sm" className={styles.composer}>
        <input
          className={styles.input}
          placeholder="할 일을 입력하고 Enter"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          maxLength={120}
        />
        <button
          type="button"
          className={styles.add}
          onClick={submit}
          disabled={isSubmitting || !title.trim()}
        >
          추가
        </button>
      </Card>

      {isLoading ? (
        <div className={styles.center}>
          <Spinner size={32} />
        </div>
      ) : isError ? (
        <EmptyState title="할 일을 불러오지 못했어요" description="잠시 후 다시 시도해 주세요." />
      ) : !todos || todos.length === 0 ? (
        <EmptyState title="할 일이 없어요" description="위에서 첫 할 일을 추가해 보세요." />
      ) : (
        <Card padding="sm">
          <ul className={styles.list}>
            {todos.map((t) => (
              <li key={t.id} className={styles.item}>
                <button
                  type="button"
                  className={`${styles.check} ${t.done ? styles.checked : ''}`}
                  onClick={() => toggle(t.id)}
                  aria-label={t.done ? '완료 취소' : '완료'}
                >
                  {t.done && <CheckIcon width={14} height={14} />}
                </button>
                <span className={`${styles.label} ${t.done ? styles.done : ''}`}>
                  {t.title}
                </span>
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => remove(t.id)}
                  aria-label="삭제"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
