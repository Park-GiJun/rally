import { Button, Card, EmptyState, Input, PageHeader, Spinner } from '../../components/ui';
import { CheckIcon, FlameIcon } from '../../components/ui/icons';
import { useHabit } from './useHabit';
import styles from './HabitPage.module.css';

export default function HabitPage() {
  const {
    habits,
    isLoading,
    isError,
    name,
    setName,
    submit,
    isSubmitting,
    checkIn,
    remove,
  } = useHabit();

  const doneToday = (habits ?? []).filter((h) => h.checkedToday).length;

  return (
    <div className={styles.page}>
      <PageHeader
        title="습관"
        description={`오늘 인증 ${doneToday}개 · 인증하면 대시보드 피드에 기록돼요.`}
      />

      <Card padding="sm" className={styles.composer}>
        <Input
          className={styles.input}
          placeholder="새 습관을 입력하고 Enter"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          maxLength={60}
        />
        <Button onClick={submit} disabled={isSubmitting || !name.trim()}>
          추가
        </Button>
      </Card>

      {isLoading ? (
        <div className={styles.center}>
          <Spinner size={32} />
        </div>
      ) : isError ? (
        <EmptyState title="습관을 불러오지 못했어요" description="잠시 후 다시 시도해 주세요." />
      ) : !habits || habits.length === 0 ? (
        <EmptyState title="습관이 없어요" description="위에서 첫 습관을 추가해 보세요." />
      ) : (
        <div className={styles.list}>
          {habits.map((h) => (
            <Card key={h.id} padding="md" className={styles.item}>
              <div className={styles.info}>
                <span className={styles.name}>{h.name}</span>
                <span className={styles.streak}>
                  <FlameIcon width={16} height={16} />
                  {h.streak}일 연속
                </span>
              </div>
              <button
                type="button"
                className={`${styles.check} ${h.checkedToday ? styles.checked : ''}`}
                onClick={() => checkIn(h.id)}
                disabled={h.checkedToday}
                aria-label={h.checkedToday ? '오늘 인증 완료' : '인증하기'}
              >
                <CheckIcon width={20} height={20} />
              </button>
              <button
                type="button"
                className={styles.remove}
                onClick={() => remove(h.id)}
                aria-label="삭제"
              >
                ×
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
