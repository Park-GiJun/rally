import { Button, Card, EmptyState, Input, PageHeader, Spinner } from '../../components/ui';
import { GamepadIcon } from '../../components/ui/icons';
import { formatRelativeTime } from '../../lib/format';
import { useLol } from './useLol';
import styles from './LolPage.module.css';

export default function LolPage() {
  const {
    profile,
    matches,
    ranking,
    isLoading,
    isError,
    name,
    setName,
    tagLine,
    setTagLine,
    submitLink,
    isLinking,
    sync,
    isSyncing,
  } = useLol();

  const total = profile ? profile.wins + profile.losses : 0;
  const winrate = total > 0 ? Math.round((profile!.wins / total) * 100) : 0;

  return (
    <div className={styles.page}>
      <PageHeader
        title="LoL 전적"
        description="소환사를 연동하고 랭크·오늘의 전적·그룹 랭킹을 한눈에 봐요."
        action={
          <Button variant="secondary" onClick={sync} loading={isSyncing}>
            전적 갱신
          </Button>
        }
      />

      {isLoading ? (
        <div className={styles.center}>
          <Spinner size={32} />
        </div>
      ) : isError ? (
        <EmptyState title="전적을 불러오지 못했어요" description="잠시 후 다시 시도해 주세요." />
      ) : (
        <div className={styles.sections}>
          {/* 1) 소환사 연동 */}
          <Card>
            <h3 className={styles.sectionTitle}>소환사 연동</h3>
            <p className={styles.sectionHint}>
              {profile?.name
                ? `현재 연동: ${profile.name} #${profile.tagLine}`
                : '아직 연동된 소환사가 없어요.'}
            </p>
            <div className={styles.linkForm}>
              <Input
                placeholder="소환사명"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitLink();
                }}
                maxLength={30}
              />
              <Input
                placeholder="#태그라인 (예: KR1)"
                value={tagLine}
                onChange={(e) => setTagLine(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitLink();
                }}
                maxLength={10}
              />
              <Button
                onClick={submitLink}
                loading={isLinking}
                disabled={!name.trim() || !tagLine.trim()}
              >
                연동
              </Button>
            </div>
          </Card>

          {/* 2) 랭크 카드 */}
          {profile && (
            <Card>
              <div className={styles.rankCard}>
                <div className={styles.rankBadge} aria-hidden="true">
                  <GamepadIcon width={28} height={28} />
                </div>
                <div className={styles.rankMain}>
                  <div className={styles.summoner}>
                    {profile.name}
                    <span className={styles.tag}>#{profile.tagLine}</span>
                  </div>
                  <div className={styles.tier}>
                    {profile.tier} {profile.rank}
                    <span className={styles.lp}>{profile.lp} LP</span>
                  </div>
                </div>
                <div className={styles.rankStats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>
                      {profile.wins}승 {profile.losses}패
                    </span>
                    <span className={styles.statLabel}>전적</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{winrate}%</span>
                    <span className={styles.statLabel}>승률</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* 3) 오늘의 전적 / 최근 매치 */}
          <Card>
            <h3 className={styles.sectionTitle}>최근 매치</h3>
            {!matches || matches.length === 0 ? (
              <EmptyState title="매치 기록이 없어요" description="전적 갱신을 눌러 불러와 보세요." />
            ) : (
              <ul className={styles.matchList}>
                {matches.map((m) => (
                  <li key={m.id} className={styles.matchItem}>
                    <span
                      className={`${styles.result} ${m.result === '승' ? styles.win : styles.lose}`}
                    >
                      {m.result}
                    </span>
                    <span className={styles.champion}>{m.champion}</span>
                    <span className={styles.kda}>
                      {m.kills} / {m.deaths} / {m.assists}
                    </span>
                    <span className={styles.time}>{formatRelativeTime(m.playedAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* 4) 그룹 랭킹표 */}
          <Card>
            <h3 className={styles.sectionTitle}>그룹 랭킹</h3>
            {!ranking || ranking.length === 0 ? (
              <EmptyState title="랭킹이 없어요" description="그룹원이 모이면 표시돼요." />
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.thRank}>순위</th>
                    <th>소환사</th>
                    <th>티어</th>
                    <th className={styles.thNum}>LP</th>
                    <th className={styles.thNum}>오늘 전적</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((row) => {
                    const mine = profile?.name === row.summonerName;
                    return (
                      <tr key={row.rank} className={mine ? styles.myRow : ''}>
                        <td className={styles.thRank}>{row.rank}</td>
                        <td className={styles.summonerCell}>{row.summonerName}</td>
                        <td>{row.tier}</td>
                        <td className={styles.thNum}>{row.lp}</td>
                        <td className={styles.thNum}>
                          {row.todayWins}승 {row.todayLosses}패
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
