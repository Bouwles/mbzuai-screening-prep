import { useEffect } from 'react';
import { HashRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { dueMistakes, setLast, useStore } from './store/progress';
import { Home } from './pages/Home';
import { LearnIndex, LessonPage } from './pages/Learn';
import { FormulaSheet } from './pages/FormulaSheet';
import { Practice } from './pages/Practice';
import { Feed } from './pages/Feed';
import { BankBrowser } from './pages/Bank';
import { MockHome, MockRun, MockResults } from './pages/Mock';
import { Mistakes } from './pages/Mistakes';
import { Settings } from './pages/Settings';
import { STATIC, GENERATORS } from './engine/bank';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/learn', label: 'Learn' },
  { to: '/practice', label: 'Topic practice' },
  { to: '/feed', label: 'General questions' },
  { to: '/mock', label: 'Mock exams' },
  { to: '/mistakes', label: 'Mistakes' },
  { to: '/bank', label: 'Question bank' },
  { to: '/formulas', label: 'Formula sheet' },
  { to: '/settings', label: 'Settings' },
];

const LABELS: [RegExp, string][] = [
  [/^\/learn\/.+/, 'Lesson'],
  [/^\/learn$/, 'Learn'],
  [/^\/practice/, 'Topic practice'],
  [/^\/feed/, 'General questions'],
  [/^\/mistakes/, 'Mistakes review'],
  [/^\/bank/, 'Question bank'],
  [/^\/formulas/, 'Formula sheet'],
];

/** Remembers the last study page for "Continue where you left off". */
function TrackLast() {
  const { pathname } = useLocation();
  useEffect(() => {
    const hit = LABELS.find(([re]) => re.test(pathname));
    if (hit) setLast(pathname, hit[1]);
  }, [pathname]);
  return null;
}

function Shell() {
  const theme = useStore((s) => s.theme);
  const due = useStore((s) => dueMistakes(s).length);
  const activeMock = useStore((s) => s.activeMockId);
  const { pathname } = useLocation();
  const inExam = /^\/mock\/run/.test(pathname);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={`app ${inExam ? 'exam-mode' : ''}`}>
      <TrackLast />
      {!inExam && (
        <header className="topbar">
          <div className="topbar-inner">
            <NavLink to="/" className="brand" aria-label="Screening Prep home">
              <span className="brand-mark" aria-hidden>
                SP
              </span>
              <span className="brand-name">Screening Prep</span>
            </NavLink>
            <nav className="topnav" aria-label="Main">
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} end={n.end} className="nav-link">
                  {n.label}
                  {n.to === '/mistakes' && due > 0 && <span className="badge">{due}</span>}
                  {n.to === '/mock' && activeMock && <span className="badge live">Live</span>}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>
      )}
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<LearnIndex />} />
          <Route path="/learn/:sub" element={<LessonPage />} />
          <Route path="/formulas" element={<FormulaSheet />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/bank" element={<BankBrowser />} />
          <Route path="/mock" element={<MockHome />} />
          <Route path="/mock/run/:id" element={<MockRun />} />
          <Route path="/mock/results/:id" element={<MockResults />} />
          <Route path="/mistakes" element={<Mistakes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<p className="empty">Page not found.</p>} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <strong>Made by Paul Nercessian</strong>
          <span>
            Unofficial personal study tool. Not affiliated with or endorsed by MBZUAI. Questions are original practice material, not real exam questions.
          </span>
          <span>
            {STATIC.length.toLocaleString()} questions and {GENERATORS.length} generators
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
