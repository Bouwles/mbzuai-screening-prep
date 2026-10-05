import { Link } from 'react-router-dom';
import { SYLLABUS } from '../syllabus';
import { LESSON_BY_SUBTOPIC } from '../engine/bank';
import { Rich, Tex } from '../components/Rich';

export function FormulaSheet() {
  return (
    <div className="page formula-sheet">
      <header className="page-head">
        <h1>Formula sheet</h1>
        <p className="lede">Every key formula and rule from the lessons, grouped by topic. Print it or save it as a PDF.</p>
        <button type="button" className="btn-primary no-print" onClick={() => window.print()}>
          Print
        </button>
      </header>
      {SYLLABUS.map((area) => (
        <section key={area.id} className="fs-area">
          <h2>{area.name}</h2>
          {area.topics.map((t) => (
            <div key={t.id} className="fs-topic">
              <h3>{t.name}</h3>
              {t.subtopics.map((s) => {
                const l = LESSON_BY_SUBTOPIC.get(s.id);
                if (!l) return null;
                return (
                  <div key={s.id} className="fs-sub">
                    <h4>
                      <Link to={`/learn/${s.id}`}>{s.name}</Link>
                    </h4>
                    <dl>
                      {l.formulas.map((f, i) => (
                        <div key={i} className="fs-row">
                          <dt>
                            <Rich text={f.label} />
                          </dt>
                          <dd>
                            <Tex src={f.tex} display />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                );
              })}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
