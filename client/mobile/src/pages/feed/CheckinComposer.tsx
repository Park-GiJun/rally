import type { KeyboardEvent } from 'react';
import { Button, Card } from '../../components/ui';
import { useCheckinComposer } from './useCheckinComposer';
import styles from './CheckinComposer.module.css';

/** 오늘의 인증(CHECKIN) 작성 박스. 피드 상단에 둔다. */
export function CheckinComposer() {
  const { note, setNote, submit, submitting } = useCheckinComposer();

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  }

  return (
    <Card className={styles.card} padding="sm">
      <textarea
        className={styles.textarea}
        placeholder="오늘의 활동을 인증해 보세요"
        value={note}
        maxLength={280}
        rows={2}
        disabled={submitting}
        onChange={(e) => setNote(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className={styles.footer}>
        <span className={styles.hint}>⌘/Ctrl + Enter 로 기록</span>
        <Button
          size="sm"
          onClick={submit}
          loading={submitting}
          disabled={!note.trim()}
        >
          인증하기
        </Button>
      </div>
    </Card>
  );
}

export default CheckinComposer;
