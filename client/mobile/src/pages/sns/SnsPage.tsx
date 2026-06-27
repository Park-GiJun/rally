import { Button, Card, EmptyState, PageHeader, Spinner } from '../../components/ui';
import { useSns } from './useSns';
import styles from './SnsPage.module.css';

export default function SnsPage() {
  const {
    posts,
    isLoading,
    isError,
    text,
    setText,
    submit,
    isSubmitting,
    toggleLike,
    formatTime,
  } = useSns();

  return (
    <div className={styles.page}>
      <PageHeader
        title="SNS"
        description="그룹과 나누는 소셜 타임라인 · 게시하면 대시보드 피드에 기록돼요."
      />

      <Card padding="md" className={styles.composer}>
        <textarea
          className={styles.textarea}
          placeholder="지금 무슨 생각을 하고 있나요?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={500}
        />
        <div className={styles.composerActions}>
          <Button
            type="button"
            size="sm"
            onClick={submit}
            loading={isSubmitting}
            disabled={!text.trim()}
          >
            게시
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <div className={styles.center}>
          <Spinner size={32} />
        </div>
      ) : isError ? (
        <EmptyState title="타임라인을 불러오지 못했어요" description="잠시 후 다시 시도해 주세요." />
      ) : !posts || posts.length === 0 ? (
        <EmptyState title="아직 게시글이 없어요" description="위에서 첫 글을 남겨보세요." />
      ) : (
        <ul className={styles.list}>
          {posts.map((p) => (
            <li key={p.id}>
              <Card padding="md" className={styles.post}>
                <div className={styles.head}>
                  <span className={styles.avatar} aria-hidden="true">
                    {p.authorName.charAt(0)}
                  </span>
                  <div className={styles.meta}>
                    <span className={styles.author}>{p.authorName}</span>
                    <span className={styles.time}>{formatTime(p.createdAt)}</span>
                  </div>
                </div>
                <p className={styles.text}>{p.text}</p>
                <button
                  type="button"
                  className={`${styles.like} ${p.likedByMe ? styles.liked : ''}`}
                  onClick={() => toggleLike(p.id)}
                  aria-pressed={p.likedByMe}
                  aria-label={p.likedByMe ? '좋아요 취소' : '좋아요'}
                >
                  좋아요 {p.likes}
                </button>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
