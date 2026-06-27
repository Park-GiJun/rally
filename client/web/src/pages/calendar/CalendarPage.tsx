import { Button, Card, EmptyState, Input, PageHeader, Spinner } from '../../components/ui';
import { useCalendar } from './useCalendar';
import styles from './CalendarPage.module.css';

/** YYYY-MM-DD → "6월 27일 (금)" 형식. */
function formatDateHeading(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${weekday})`;
}

export default function CalendarPage() {
  const {
    agenda,
    isLoading,
    isError,
    isEmpty,
    title,
    setTitle,
    date,
    setDate,
    time,
    setTime,
    note,
    setNote,
    submit,
    isSubmitting,
    remove,
  } = useCalendar();

  return (
    <div className={styles.page}>
      <PageHeader title="캘린더" description="개인 일정" />

      <Card padding="md" className={styles.composer}>
        <Input
          label="일정"
          placeholder="무엇을 할까요?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
        />
        <div className={styles.row}>
          <Input
            type="date"
            label="날짜"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            type="time"
            label="시간"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <Input
          label="메모"
          placeholder="선택 입력"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={200}
        />
        <Button
          onClick={submit}
          loading={isSubmitting}
          disabled={!title.trim() || !date}
        >
          일정 추가
        </Button>
      </Card>

      {isLoading ? (
        <div className={styles.center}>
          <Spinner size={32} />
        </div>
      ) : isError ? (
        <EmptyState title="일정을 불러오지 못했어요" description="잠시 후 다시 시도해 주세요." />
      ) : isEmpty ? (
        <EmptyState title="등록된 일정이 없어요" description="위에서 첫 일정을 추가해 보세요." />
      ) : (
        <div className={styles.agenda}>
          {agenda.map((group) => (
            <section key={group.date} className={styles.group}>
              <h2 className={styles.dateHeading}>{formatDateHeading(group.date)}</h2>
              <Card padding="sm">
                <ul className={styles.list}>
                  {group.events.map((event) => (
                    <li key={event.id} className={styles.item}>
                      <span className={styles.time}>{event.time ?? '종일'}</span>
                      <div className={styles.body}>
                        <span className={styles.title}>{event.title}</span>
                        {event.note && <span className={styles.note}>{event.note}</span>}
                      </div>
                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => remove(event.id)}
                        aria-label="삭제"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
