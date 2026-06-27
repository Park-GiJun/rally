import { Link } from 'react-router-dom';
import { Card, EmptyState, Spinner } from '../../components/ui';
import { ActivityItem } from '../feed/ActivityItem';
import { FEED_FILTERS, SECTIONS } from '../../lib/sections';
import { DEMO_MODE } from '../../config';
import { useDashboard } from './useDashboard';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const {
    groups,
    groupId,
    setGroupId,
    sectionKey,
    setSectionKey,
    counts,
    activities,
    isLoading,
    isError,
  } = useDashboard();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.heading}>실시간 피드</h2>
        <p className={styles.sub}>
          {DEMO_MODE
            ? '백엔드 없이 둘러보는 데모예요. 각 섹션에서 기록하면 여기로 모여요.'
            : '그룹과 섹션의 활동이 시간순으로 모여요.'}
        </p>
      </header>

      {/* 도메인 요약 카드 */}
      <div className={styles.summary}>
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.key} to={s.path} className={styles.statCard}>
              <span
                className={styles.statIcon}
                style={{ color: s.accentVar, background: 'var(--color-bg-subtle)' }}
              >
                <Icon width={18} height={18} />
              </span>
              <span className={styles.statBody}>
                <span className={styles.statLabel}>{s.label}</span>
                <span className={styles.statCount}>{counts[s.key] ?? 0}</span>
              </span>
            </Link>
          );
        })}
      </div>

      {/* 필터: 그룹 + 섹션 */}
      <div className={styles.filters}>
        <select
          className={styles.groupSelect}
          value={groupId === undefined ? 'all' : String(groupId)}
          onChange={(e) => {
            const v = e.target.value;
            setGroupId(v === 'all' ? undefined : v === 'null' ? null : Number(v));
          }}
        >
          <option value="all">전체 그룹</option>
          {groups.map((g) => (
            <option key={g.id ?? 'personal'} value={g.id === null ? 'null' : String(g.id)}>
              {g.name}
            </option>
          ))}
        </select>

        <div className={styles.chips}>
          {FEED_FILTERS.map((s) => (
            <button
              key={s.key}
              type="button"
              className={`${styles.chip} ${sectionKey === s.key ? styles.chipActive : ''}`}
              onClick={() => setSectionKey(s.key)}
              style={{ ['--accent' as string]: s.accentVar }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 피드 */}
      {isLoading ? (
        <div className={styles.center}>
          <Spinner size={32} />
        </div>
      ) : isError ? (
        <EmptyState
          title="피드를 불러오지 못했어요"
          description="잠시 후 다시 시도해 주세요."
        />
      ) : !activities || activities.length === 0 ? (
        <EmptyState
          title="아직 활동이 없어요"
          description="각 섹션에서 기록하면 이 피드에 쌓여요."
        />
      ) : (
        <Card padding="sm">
          <ul className={styles.list}>
            {activities.map((a) => (
              <ActivityItem key={a.id} activity={a} />
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
