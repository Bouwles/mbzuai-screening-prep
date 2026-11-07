import type { ServedQuestion } from '../types';
import { subtopicInfo } from '../syllabus';

const DIFF_LABEL = { foundation: 'Foundation', exam: 'Exam level' } as const;

export function QuestionMeta({ q, showTopic = true }: { q: ServedQuestion; showTopic?: boolean }) {
  const info = subtopicInfo(q.subtopic);
  return (
    <div className="q-meta">
      {showTopic && <span className="tag">{info.name}</span>}
      <span className={`tag diff-${q.difficulty}`}>{DIFF_LABEL[q.difficulty]}</span>
      {q.generated && <span className="tag tag-variant" title={`Generated variant of: ${q.templateTitle}`}>Generated variant</span>}
    </div>
  );
}
