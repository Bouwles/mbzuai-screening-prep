# MBZUAI BSc Screening Exam: Research Notes

Researched 2026-10-04 for the Fall 2027 intake. **Unofficial** study aid, not affiliated with MBZUAI.

> **Access note.** mbzuai.ac.ae sits behind Cloudflare, so direct fetches and an automated browser got
> HTTP 403 / "you have been blocked". The live pages were read through the `r.jina.ai` reader proxy
> (same content as the live site) and checked against Wayback snapshots. The applicant-portal knowledge
> article (`apply.mbzuai.ac.ae/.../What-is-the-Screening-Exam`) needs a login and was **not** read.
> The **Screening Exam Guide** linked from the admissions page (SharePoint, view-only) **was** retrieved:
> `MBZUAI Screening Exam Guide_2027.pdf`, 11 pages, "Admissions · Fall 2027 Intake", modified 2026-10-01.

---

## (a) Official facts (MBZUAI sources only)

Sources:
- **[UGA]** https://mbzuai.ac.ae/admissions/undergraduate-admissions/ (live page, read 2026-10-04)
- **[UGP]** https://mbzuai.ac.ae/study/ug-admission-process/ (now a short landing page for the two tracks)
- **[G27]** Screening Exam Guide, Fall 2027, linked from [UGA]:
  https://mbzuaiac-my.sharepoint.com/:b:/g/personal/admission_infosession_mbzuai_ac_ae/IQDp2HylP3QaSLuuWneTnel6AVU0e1brMSYfhY7Fn_vkDnI
- **[ENG]/[BUS]** https://mbzuai.ac.ae/academics/undergraduate-program/bachelor-in-artificial-intelligence-engineering (and `-business`)

### Who, when, how
| Fact | Source |
|---|---|
| **All** applicants must take the screening exam. | [UGA] |
| You get an invitation to book the exam **within 10 days of submitting** the application. | [UGA] |
| The guide says to **complete** the exam **within 10 calendar days of submitting** the application. Credentials, Exam PIN and Demo-Test PIN arrive within 24 h of scheduling. | [G27] p.2 |
| The exam "assesses knowledge and skills relevant to your **chosen track**". There are two tracks: **AI-Business** (no coding experience needed) and **AI-Engineering** (coding/STEM familiarity helps). | [UGA], [UGP] |
| **60 minutes**, timed, **one sitting**, **single attempt**, **Inspera Exam Portal**, **AI proctored**. | [G27] cover, p.2 |
| You get a **24-hour testing window** (times in GST, UTC+4). Finish at least **2 h before the window closes**. | [G27] p.5 |
| Allowed: **blank paper, pen/pencil and a calculator** only. No headphones, smartwatches, other devices or help. | [G27] p.5 |
| **No negative marking**, "so answer every question." | [G27] p.5 |
| Scores go straight to Admissions. **Individual scores are not shared with applicants.** | [G27] p.6 |
| Leaving the portal, or another app taking focus, ends the session with **no retake**. You need Windows 10/11 64-bit or macOS 11+, no ARM, no Linux/Chromebook/tablet, one display, a webcam and a mic. | [G27] p.3 |
| Do the Demo Test ≥48 h before the exam and install the portal ≥2 days before. | [G27] p.4 |
| The guide gives **no question count**. Questions have **4 options (A–D)**, a single answer, and "varying difficulty". | [G27] p.6–8 |

### Topics (exact wording from [UGA]; the guide refers back to it)
- **Math:** Algebra, Functions, Probability, Statistics, Matrix and Vectors, Calculus, Discrete Mathematics
- **Computational Thinking & Logic:** Logic, Pattern Recognition
- **Programming Fundamentals:** Algorithmic Problem Solving, Basic Syntax Concepts, Functions, Basic Data Structures
- **Data & AI Reasoning:** Data Interpretation, Basic Machine Learning Concepts

No topic weights or section split are published.

### Fee, waivers, thresholds ([UGA])
- Application fee **AED 200**, paid **after** the screening exam. Applications with unpaid fees are not reviewed.
- Fee waived if the overall screening score is **"75% or above"** (≥75%, not >75%), or on enrolment (refund), or when the exam itself is waived.
- **Exam waiver** needs **SAT Math 760 and SAT total 1400** (both), or a **gold/silver/bronze medal** at an international olympiad (IOI, IMO, IOAI, IPhO, IBO, IChO).
- **No published pass mark for admission.** 75% is only the fee-waiver line.

### Recommended Coursera courses ([UGA]): all six match expectations
An Intuitive Introduction to Probability · Computational Thinking for Problem Solving · Machine Learning
Introduction for Everyone · Mathematics for Machine Learning: Linear Algebra · Programming for Everybody
(Getting Started with Python) · Introduction to Calculus.

### Official UNDERGRADUATE sample questions ([G27] p.6–8, 4 questions, answers verified)
1. f(x)=(2x−1)/(x+3). Find g(5) where g = f⁻¹. → **−16/3** (A). *Functions / algebra.*
2. 8% defective; test sensitivity 90%; false-positive rate 5%. Find P(defective | flagged). → **≈61.0%** (B). *Bayes; calculator helps.*
3. 98% train accuracy, 62% test accuracy. → **overfitting** (B). *Basic ML.*
4. Confusion matrix TP 30, FP 20, FN 10, TN 140. Which statement is true? → **recall 75%** (C). Accuracy is 85% and precision 60%. *Data interpretation / ML metrics.*

The same guide has 6 **graduate** samples: linear vs logistic regression, gradient w.r.t. weights, the **trig 3×3 system** (answer (π/2, π, 0)), 6 red/2 blue balls (**3/4**), linked-list search (**n**), and FOR→WHILE pseudocode (**D**).
**So the trig system is a graduate sample, not an undergraduate one.**

### Other official context
- Shortlisted applicants get an **online interview** with a **technical component** that covers maths readiness and problem solving ([UGA] FAQ).
- Fall 2027 dates: portal opened **7 Sep 2026**. **Early Action deadline 1 Nov 2026** (decision 15 Jan 2027). **Regular Decision deadline 1 Feb 2027** (decision 1 Apr 2027) ([UGA]).
- Typical successful applicants have a ≥90% overall average and ≥90% in maths/STEM. SAT/ACT are optional ([UGA] FAQ).
- First-year core includes Python Programming, Calculus & Linear Algebra, and Probability & Statistics ([ENG]/[BUS] study plans). That matches the exam topics.
- The UG screening exam does **not** appear on the archived Jan 2026 and Apr 2026 versions of [UGP]
  (web.archive.org). It looks **new for the Fall 2027 cycle**, so there are almost no first-hand UG reports yet.

### Graduate exam guidelines, for comparison (MBZUAI PDFs on staticcdn)
| Version | Facts |
|---|---|
| "Online Entry Exam Guidelines", PDF dated **Sep 2023**. Same file as the student's `MBZUAI_Entry_Exam_Instructions.pdf`. https://staticcdn.mbzuai.ac.ae/mbzuaiwpprd01/PDF/MBZUAI_Entry_Exam_Instructions.pdf | **40 questions, max 45 min**, 24-h window, AI proctoring, Inspera, one attempt, "Submit" appears after the last item, **no negative marking**, paper + pen + calculator ("minimal use is advised"), arrive 30 min early for ID checks. Topics: Math, Programming, ML (by programme). |
| "Online Screening Exam Instructions", PDF dated **Nov 2024**. https://staticcdn.mbzuai.ac.ae/mbzuaiwpprd01/2023/06/MBZUAI-Online-Screening-Exam-Instructions.pdf | **Max 60 min** (no count stated), 24-h/7-day window, otherwise the same rules. |
| Fall 2027 guide [G27] | **60 min** for UG and graduate. |

**Takeaway:** 40 Q / 45 min is the **2023 graduate** format. Every newer official document says **60 min**. The current question count is unpublished.

---

## (b) The three PDFs the student supplied
1. **`MBZUAI_Entry_Exam_Instructions.pdf`**: official MBZUAI, **graduate**, Sep 2023. 40 MCQ, 45 min, no negative marking, Inspera, Submit after the last item, calculator allowed with minimal use advised, 6 sample questions (the same 6 graduate samples as in [G27]). **Superseded on duration by [G27] (60 min).**
2. **`MBZUAI-Screening-Test-Complete-Guide.pdf`** (Scribd 996148454, 2 pages, Nov 2025): **unofficial** open-ended prep list aimed at **Master's** applicants. Sections: Math, Programming, ML basics, "bonus" logical/analytical thinking. Fine as a topic checklist, but it is not the UG syllabus.
3. **`Exam.pdf`** (Scribd 974621193, 39 pages, Jul 2024): **unofficial** book of 155 MCQs. **The answer key is unreliable:**
   - Duplicated options in Q3, Q11, Q15, Q17 and others. Example: Q155 lists "120" as both b) and c).
   - Off-syllabus items: C++/Java, databases, threads, simplex/LP.
   - Q155 `print(reduce(lambda x, y: x*y, range(1, 6)))` never imports `functools`, so Python 3 raises **NameError**. The keyed "120" is wrong as written. (Checked in the PDF text.)
   - Use it for practice ideas only. Never trust its key.
- **Online copy of the official samples:** the GitHub gist https://gist.github.com/TheMR-777/d62b9f7ff62a9a6979540d37767c3c93 bolds **5/8** for the 6 red/2 blue "second ball red" question. The correct answer is **3/4** (6/8 by symmetry), which is also the official key in [G27].

---

## (c) Applicant reports (hints, not facts)
Searches covered Reddit (search tools blocked, reddit.com returned 403), Quora, LinkedIn, Medium, YouTube, Scribd, Studocu and blogs.
**I found no first-hand undergraduate reports.** That fits an exam that appears new this cycle and has strict confidentiality rules.
| Source | What it says | Reliability |
|---|---|---|
| Scribd "MBZUAI Graduate Admission Online Screening Exam Guide" (doc 966283263, uploaded copy of an MBZUAI graduate guide) | Grad, 60 min. Face must stay centred. Submit after the last item. No negative marking. Scores not disclosed. A search-engine summary also claimed **you cannot go back to previous questions**, and that the exam **ends after three face/noise detections**. I could not find either line in the decoded text. | Medium for what I decoded; **unverified** for the back-navigation and three-strikes claims |
| Scribd/Studocu/pdfcoffee copies of "MBZUAI entry exam instructions 2022.01.27" | Grad, 2022: 40 Q / 45 min, Math / Programming / ML, "AI and human proctoring". | Old format |
| GitHub gist (above) | Copies the 60-min graduate guide and samples, with a **wrong key** on the balls question. | Low for answers |
| YouTube IIE "MBZUAI Q&A with current students" / student interviews | General admissions and student life. Nothing exam-specific was visible from the descriptions. | Not useful for the exam |
Overall: there is no reliable public evidence on difficulty or question count. The best evidence of style is the 4 official UG samples: 4-option MCQs, school-to-first-year level, applied (Bayes, confusion matrix) rather than proof-based.

---

## (d) Scope of the six Coursera courses (from the course pages)
| Course (provider) | Level / length | Scope |
|---|---|---|
| An Intuitive Introduction to Probability (U. Zurich) | Beginner, ~3 wk × 10 h, 5 modules | Intuitive, applied probability "toolbox": basic and conditional probability/Bayes, random variables, expectation/variance, binomial and normal distributions, covariance/correlation. Module names were not captured, so this list is the usual syllabus. |
| Computational Thinking for Problem Solving (UPenn) | Beginner, ~2 wk × 10 h, 4 modules | Pillars (decomposition, pattern recognition, abstraction, algorithms). Expressing/analysing algorithms (incl. basic efficiency). How a computer works. Applied CT in Python. |
| Machine Learning Introduction for Everyone (IBM) | Beginner, ~6 h, 3 modules | What ML is. Supervised vs unsupervised. Classification, regression, deep and reinforcement learning (overview). **Evaluating models.** No-code regression project. |
| Mathematics for ML: Linear Algebra (Imperial) | Beginner, ~2 wk × 10 h, 5 modules | Vectors (modulus, dot product, projection, basis). Matrices as transformations. Solving linear systems, inverses, determinants. Change of basis. Eigenvalues/eigenvectors (PageRank). |
| Programming for Everybody (U. Michigan) | Beginner, ~2 wk × 10 h, 7 modules | Python basics: variables/expressions, conditionals, functions, loops. Very gentle; **no data structures** (those come later in the specialization). |
| Introduction to Calculus (U. Sydney) | **Intermediate**, ~6 wk × 10 h, 5 modules | Precalculus (equations, inequalities). Functions (polynomial, exp/log, trig, inverse, composition). Derivatives and rules. Curve sketching and optimisation. Integrals and the Fundamental Theorem of Calculus. |
**Depth gauge:** all except Calculus are beginner level. The expected level is roughly upper-secondary maths plus intro Python and intro ML vocabulary. The calculus course is the deepest piece, so derivatives, optimisation and basic integrals are fair game.

---

## (e) How this changed the app
- **Topic taxonomy** mirrors MBZUAI's list exactly: the 4 areas and 15 subtopics in the official wording.
- **75% target line** = the fee-waiver threshold. The official text says **"75% or above"**, so the app must treat 75% as passing (`>=`). It is not an admission cut-off; none is published.
- **Mock lengths:** 15 / 30 / 60 min plus a "full" format. *Update from this research:* the official Fall 2027 guide says **60 min**. The 40 Q / 45 min format came from the **2023 graduate** PDF. The full mock should be **60 min**; keep 40Q/45 only as a labelled "2023 graduate format" option.
- **Pace:** ~67.5 s/question (45 min / 40 Q) was the only official pace evidence. The current question count is unknown. Keeping 67.5 s/Q (≈53 Q in 60 min) is a **conservative** choice: training faster than needed is safer. Label the count as an estimate.
- **Area weights are estimates**, because MBZUAI publishes none: currently Math 45%, Programming 25%, Data & AI 15%, CT&Logic 15%. *Evidence update:* the 4 official UG samples are 2 Math (functions, probability) + 2 Data & AI (overfitting, confusion matrix) + 0 Programming. Suggested rebalance: **Math 40 / Data & AI 25 / Programming 20 / CT&Logic 15**. Still an estimate.
- **Difficulty mix** 30/50/20 (Foundation/Exam/Challenge). The guide says "varying difficulty". *Correction:* the trig 3×3 system is a **graduate** sample, so it no longer justifies Challenge items. UG samples sit at upper-secondary to first-year level; Bayes with a calculator is the hardest. Keep the 20% Challenge share as stretch practice, but cap it at first-year level.
- **Pseudocode questions included.** The official samples (FOR→WHILE) use language-neutral pseudocode, and the Business track needs no coding experience. Keep Python plus pseudocode, and avoid language-specific trivia.
- **Calculator:** a physical calculator is allowed (the 2027 guide no longer says "minimal use"), so keep numbers calculator-friendly. Bayes and percentage questions with decimals are realistic.
- **No negative marking:** mocks should warn about unanswered questions and teach "never leave blanks".
- **Single attempt, proctored, one sitting:** the full mock should run as one timed sitting with no pause.
- **Optional linear mode** (no going back, Submit only after the last item): the "Submit after last item" rule is official. "Cannot go back" is unverified, so make it a toggle, default off.
- **Official UG samples** (4) can go into the bank verbatim as "Official sample", with the correct keys above. Graduate samples can be tagged "graduate (harder)".
- **Never trust the `Exam.pdf` key.** Any item adapted from it must be re-solved, de-duplicated and kept on syllabus.
- **Track awareness:** the exam is "relevant to your chosen track". A future Engineering/Business toggle could shift Programming weight. No public data on how the versions differ.
- **Deadline banner:** EA deadline is 1 Nov 2026, and the exam must be done within 10 days of submitting. If the student applies EA, the exam lands by about 11 Nov 2026.
- All tunables live in `src/config/exam.ts`. Update its header comment: it still cites the 2023 graduate 40 Q / 45 min format and says scoring "above" 75%.

---

## UI research: how popular revision tools look (Oct 2026)

The first design (dark, sidebar, controls in the top-right) was rejected, so the redesign follows the tools students already use. Sources: the products' own sites and help centres (khanacademy.org, brilliant.org, quizlet.com, duolingo.com, savemyexams.com, revisionvillage.com, the College Board's Bluebook help pages, Magoosh, UWorld, Inspera), plus third-party design-token write-ups. Treat exact hex values from third parties as approximations.

| Finding | Seen in | How it changed the app |
|---|---|---|
| Light, near-white canvas with dark slate text; dark mode optional | Khan, Quizlet, Duolingo, Bluebook, Save My Exams | Light theme is the default; dark stays in Settings |
| One accent colour; green and red only for right and wrong | Khan, Duolingo, Bluebook | One blue accent; tinted green/red feedback |
| Practice in a focus view with the site navigation hidden | Khan, Brilliant, Duolingo, Quizlet | Practice hides the navigation: exit top-left, thin progress bar |
| Primary action fixed at the bottom right; nothing important in the top-right | Khan, Duolingo, Bluebook, Inspera, UWorld | Check/Next at the bottom right; top-right corner left empty |
| Feedback inline in the bottom bar, explanation below the question | Khan, Duolingo, Brilliant, Magoosh | Bottom bar turns green/red; mark scheme opens under the question |
| Exam mode: timer at the top centre (hideable), question navigator popover at the bottom | Bluebook, Inspera | Mock exam screen copies this layout |
| Home leads with one "up next" action; stats small | Khan "Mission", Up Learn, Anki | "Up next" card first, then compact progress cards |
| Large outlined option tiles with letter circles, keys 1–4 | Bluebook, Quizlet, Duolingo | Same, with A–D circles and keyboard shortcuts |

(The research also suggested short fades; they were left out because the brief asks for no animation at all.)
