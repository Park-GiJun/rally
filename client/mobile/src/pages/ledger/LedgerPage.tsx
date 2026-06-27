import { Button, Card, EmptyState, Input, PageHeader, Spinner } from '../../components/ui';
import { PlusIcon } from '../../components/ui/icons';
import { useLedger } from './useLedger';
import styles from './LedgerPage.module.css';

function formatWon(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export default function LedgerPage() {
  const {
    entries,
    isLoading,
    isError,
    summary,
    kind,
    setKind,
    amount,
    setAmount,
    category,
    setCategory,
    memo,
    setMemo,
    date,
    setDate,
    canSubmit,
    submit,
    isSubmitting,
    remove,
  } = useLedger();

  return (
    <div className={styles.page}>
      <PageHeader
        title="가계부"
        description="수입·지출을 기록하면 대시보드 피드에 남아요."
      />

      <div className={styles.summary}>
        <Card padding="md" className={styles.stat}>
          <span className={styles.statLabel}>수입</span>
          <strong className={`${styles.statValue} ${styles.income}`}>
            {formatWon(summary.income)}
          </strong>
        </Card>
        <Card padding="md" className={styles.stat}>
          <span className={styles.statLabel}>지출</span>
          <strong className={`${styles.statValue} ${styles.expense}`}>
            {formatWon(summary.expense)}
          </strong>
        </Card>
        <Card padding="md" className={styles.stat}>
          <span className={styles.statLabel}>잔액</span>
          <strong className={`${styles.statValue} ${styles.net}`}>
            {formatWon(summary.net)}
          </strong>
        </Card>
      </div>

      <Card padding="md" className={styles.form}>
        <div className={styles.toggle} role="group" aria-label="수입/지출 선택">
          <button
            type="button"
            className={`${styles.toggleBtn} ${kind === 'income' ? styles.toggleActive : ''}`}
            onClick={() => setKind('income')}
            aria-pressed={kind === 'income'}
          >
            수입
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${kind === 'expense' ? styles.toggleActive : ''}`}
            onClick={() => setKind('expense')}
            aria-pressed={kind === 'expense'}
          >
            지출
          </button>
        </div>

        <div className={styles.fields}>
          <Input
            label="금액"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            label="분류"
            placeholder="식비, 교통, 급여…"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            maxLength={20}
          />
          <Input
            label="메모"
            placeholder="선택 입력"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            maxLength={60}
          />
          <Input
            label="날짜"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <Button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          loading={isSubmitting}
        >
          <span className={styles.addLabel}>
            <PlusIcon width={16} height={16} />
            기록 추가
          </span>
        </Button>
      </Card>

      {isLoading ? (
        <div className={styles.center}>
          <Spinner size={32} />
        </div>
      ) : isError ? (
        <EmptyState title="내역을 불러오지 못했어요" description="잠시 후 다시 시도해 주세요." />
      ) : !entries || entries.length === 0 ? (
        <EmptyState title="기록이 없어요" description="위에서 첫 수입·지출을 기록해 보세요." />
      ) : (
        <Card padding="sm">
          <ul className={styles.list}>
            {entries.map((e) => (
              <li key={e.id} className={styles.item}>
                <div className={styles.itemMain}>
                  <span className={styles.category}>{e.category}</span>
                  {e.memo && <span className={styles.memo}>{e.memo}</span>}
                </div>
                <span className={styles.date}>{e.date}</span>
                <span
                  className={`${styles.amount} ${e.kind === 'income' ? styles.income : styles.expense}`}
                >
                  {e.kind === 'income' ? '+' : '-'}
                  {formatWon(e.amount)}
                </span>
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => remove(e.id)}
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
