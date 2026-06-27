import type { Activity } from '../../types/activity';
import { formatRelativeTime } from '../../lib/format';
import { activitySummary, typeMeta } from './activityMeta';
import styles from './ActivityItem.module.css';

export interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const meta = typeMeta(activity.type);
  const summary = activitySummary(activity);

  return (
    <li className={styles.item}>
      <span
        className={styles.dot}
        style={{ background: meta.colorVar }}
        aria-hidden="true"
      />
      <div className={styles.body}>
        <div className={styles.head}>
          <span className={styles.type} style={{ color: meta.colorVar }}>
            {meta.label}
          </span>
          <span className={styles.meta}>
            {activity.actorName ?? `actor #${activity.actorId}`}
            {activity.groupId != null && ` · group #${activity.groupId}`}
          </span>
          <time className={styles.time} dateTime={activity.occurredAt}>
            {formatRelativeTime(activity.occurredAt)}
          </time>
        </div>
        {summary && <p className={styles.summary}>{summary}</p>}
      </div>
    </li>
  );
}

export default ActivityItem;
