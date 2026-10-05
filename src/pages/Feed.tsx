import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { nextFeed } from '../engine/select';
import { QuestionSession } from '../components/QuestionSession';
import { Rng, freshSeed } from '../lib/rng';
import { dueMistakes, getState } from '../store/progress';

export function Feed() {
  const rng = useMemo(() => new Rng(freshSeed()), []);
  const next = useCallback((used: Set<string>, count: number) => nextFeed(used, rng, count, dueMistakes(getState())), [rng]);
  const nav = useNavigate();
  return (
    <div className="page">
      <QuestionSession mode="feed" title="General questions" onExit={() => nav('/')} next={next} limit={null} />
    </div>
  );
}
