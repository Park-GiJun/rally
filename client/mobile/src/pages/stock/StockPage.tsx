import { Button, Card, EmptyState, Input, PageHeader, Spinner } from '../../components/ui';
import { ChartIcon, PlusIcon } from '../../components/ui/icons';
import { useStock } from './useStock';
import styles from './StockPage.module.css';

function formatNum(value: number): string {
  return value.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
}

function formatPct(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}%`;
}

/** 손익 부호에 따른 색 클래스(이익=success, 손실=danger, 0=중립). */
function signClass(value: number): string {
  if (value > 0) return styles.gain;
  if (value < 0) return styles.loss;
  return styles.flat;
}

export default function StockPage() {
  const {
    holdings,
    isLoading,
    isError,
    totals,
    symbol,
    setSymbol,
    name,
    setName,
    shares,
    setShares,
    avgCost,
    setAvgCost,
    canSubmit,
    submit,
    isSubmitting,
    remove,
    refresh,
    isRefreshing,
  } = useStock();

  return (
    <div className={styles.page}>
      <PageHeader
        title="주식"
        description="관심종목을 담아 실시간 시세와 평가손익을 확인해요."
        action={
          <Button variant="secondary" onClick={refresh} loading={isRefreshing}>
            <span className={styles.actionLabel}>
              <ChartIcon width={16} height={16} />
              시세 갱신
            </span>
          </Button>
        }
      />

      <Card padding="md" className={styles.summary}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>평가금액</span>
          <strong className={styles.statValue}>{formatNum(totals.value)}</strong>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>평가손익</span>
          <strong className={`${styles.statValue} ${signClass(totals.profit)}`}>
            {totals.profit > 0 ? '+' : ''}
            {formatNum(totals.profit)}
          </strong>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>수익률</span>
          <strong className={`${styles.statValue} ${signClass(totals.profit)}`}>
            {formatPct(totals.profitPct)}
          </strong>
        </div>
      </Card>

      <Card padding="md" className={styles.form}>
        <div className={styles.fields}>
          <Input
            label="종목 코드"
            placeholder="NVDA, 005930…"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            maxLength={12}
          />
          <Input
            label="종목명"
            placeholder="엔비디아"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
          />
          <Input
            label="수량"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="0"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
          />
          <Input
            label="평단가"
            type="number"
            min={0}
            inputMode="decimal"
            placeholder="0"
            value={avgCost}
            onChange={(e) => setAvgCost(e.target.value)}
          />
        </div>
        <Button type="button" onClick={submit} disabled={!canSubmit} loading={isSubmitting}>
          <span className={styles.actionLabel}>
            <PlusIcon width={16} height={16} />
            추가
          </span>
        </Button>
      </Card>

      {isLoading ? (
        <div className={styles.center}>
          <Spinner size={32} />
        </div>
      ) : isError ? (
        <EmptyState title="시세를 불러오지 못했어요" description="잠시 후 다시 시도해 주세요." />
      ) : !holdings || holdings.length === 0 ? (
        <EmptyState title="관심종목이 없어요" description="위에서 첫 종목을 담아 보세요." />
      ) : (
        <Card padding="sm">
          <ul className={styles.list}>
            {holdings.map((h) => {
              const profit = (h.price - h.avgCost) * h.shares;
              return (
                <li key={h.id} className={styles.item}>
                  <div className={styles.itemMain}>
                    <span className={styles.symbol}>{h.symbol}</span>
                    <span className={styles.name}>{h.name}</span>
                  </div>
                  <div className={styles.priceCol}>
                    <span className={styles.price}>{formatNum(h.price)}</span>
                    <span className={`${styles.changePct} ${signClass(h.changePct)}`}>
                      {formatPct(h.changePct)}
                    </span>
                  </div>
                  <div className={styles.plCol}>
                    <span className={styles.shares}>{h.shares.toLocaleString('ko-KR')}주</span>
                    <span className={`${styles.profit} ${signClass(profit)}`}>
                      {profit > 0 ? '+' : ''}
                      {formatNum(profit)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => remove(h.id)}
                    aria-label="삭제"
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
