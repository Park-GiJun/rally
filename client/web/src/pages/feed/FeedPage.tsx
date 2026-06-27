import { Card, EmptyState, Spinner } from '../../components/ui';
import { CheckinComposer } from './CheckinComposer';
import { ActivityItem } from './ActivityItem';
import { useFeed } from './useFeed';
import { DEMO_MODE } from '../../config';
import styles from './FeedPage.module.css';

export default function FeedPage() {
  const { data: activities, isLoading, isError } = useFeed();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>피드</h1>
        <p className={styles.subtitle}>
          {DEMO_MODE
            ? '백엔드 없이 둘러보는 데모예요. 인증을 남기면 바로 피드에 쌓여요.'
            : '기록한 활동이 시간순으로 쌓여요.'}
        </p>
      </header>

      <CheckinComposer />

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
          description="위에서 첫 인증을 남겨 보세요."
        />
      ) : (
        <Card padding="sm">
          <ul className={styles.list}>
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
