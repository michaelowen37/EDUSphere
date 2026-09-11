// =====================================================================
//  EduSphere — Phase 0 prototype
//  FILE: src/logic.mjs
//
//  Everything in this file is plain JavaScript with NO screen code in it.
//  It holds four things, in this order:
//    1. CONTENT      — the subject, the modules, and the lesson text
//    2. GENERATORS   — small functions that build practice questions
//    3. CORE RULES   — how an attempt is assembled and how mastery is decided
//    4. DERIVATIONS  — how progress and reports are computed from the event log
//
//  Design rule that everything below follows:
//    The EVENT LOG is the single source of truth. The app never stores
//    "mastered = true" anywhere. It stores what happened (an attempt, a
//    lesson view, a reset) and computes mastery, status, and every report
//    number from those events. Anyone can recompute a report and get the
//    same answer. That is what makes reports verifiable.
//
//  This file is tested by tests/logic.test.mjs. Run:  node tests/logic.test.mjs
//  The same text is copied into the browser artifact by build.sh, so what
//  is tested is exactly what runs.
// =====================================================================

// ---------------------------------------------------------------------
// 0. SETTINGS — the knobs a founder might want to turn
// ---------------------------------------------------------------------
// Optional sections. Turn one off and it disappears from every screen — used when
// the platform is sold for trade or corporate training, where K-12 reflection content
// does not belong. Nothing else in the app depends on these being on.
export const FEATURES = {
  reflection: true,  // the Wonder questions AND the Wisdom cards (they share this switch)
  lifeSkills: true,  // the Recommended Life Skills section in the educator view
  checks: true,      // placement checks and progress checks
};

export const CONFIG = {
  CORE_QUESTIONS_PER_ATTEMPT: 5,   // questions from the current module in one practice set
  MASTERY_MIN_CORRECT: 4,          // how many of those must be right to count as mastered
  REVIEW_QUESTIONS_PER_ATTEMPT: 1, // extra question from an earlier module (measures retention, never affects the gate)
  CHOICES_PER_QUESTION: 4,         // options shown for multiple-choice questions
};

// ---------------------------------------------------------------------
// 1. CONTENT
//    Vocabulary is deliberately generic (subject / module / topic), not
//    "grade" or "school", so the same structure can later hold a trade
//    course or a corporate training course without renaming anything.
// ---------------------------------------------------------------------
// Every grade the platform can hold, in order. 'K' is kindergarten.
// A course names one of these; screens group by grade first, then subject.
export const GRADES = ['PK3', 'PK4', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'C'];
export function gradeLabel(grade) { return grade === 'K' ? 'Kindergarten' : grade === 'PK3' ? 'Pre-K 3' : grade === 'PK4' ? 'Pre-K 4' : grade === 'C' ? 'College level' : `Grade ${grade}`; }
// Short form for tight spaces, e.g. "Fractions (Grade 3 - Math)" or "Counting (KG - Math)".
export function gradeShort(grade) { return grade === 'K' ? 'KG' : grade === 'PK3' ? 'Pre-K 3' : grade === 'PK4' ? 'Pre-K 4' : grade === 'C' ? 'College' : `Grade ${grade}`; }
// The way a person would say it in a sentence: "Kindergarten math", "third grade reading".
const GRADE_WORDS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'];
export function gradeInSentence(grade) { return grade === 'K' ? 'Kindergarten' : grade === 'PK3' ? 'pre-K 3' : grade === 'PK4' ? 'pre-K 4' : grade === 'C' ? 'college level' : `${GRADE_WORDS[Number(grade) - 1]} grade`; }
// One line for a course anywhere it appears in a list.
export function courseLabel(course) { return `${course.title} (${gradeShort(course.grade)} - ${course.subject})`; }

// A COURSE belongs to exactly one subject (Math, Reading, Science, ...) and
// holds an ordered list of modules. Modules unlock in order WITHIN a course.
// An educator can turn courses on or off per learner (see enabledCourseIds).
export const COURSES = [
  {
    id: 'fractions-intro',
    grade: '3',
    subject: 'Math',
    title: 'Fractions',
    audience: 'Grades 3–4',
    modules: FRACTION_MODULES(),
  },
  {
    id: 'numbers-1',
    grade: '1',
    subject: 'Math',
    title: 'Numbers to 20',
    audience: 'Grade 1',
    readAloud: true, // first graders are still learning to read; questions stay spoken and tapped
    modules: GRADE1_MATH_MODULES(),
  },
  {
    id: 'reading-1',
    grade: '1',
    subject: 'Reading',
    title: 'Reading words and sentences',
    audience: 'Grade 1',
    readAloud: true, // the instructions are spoken; the words to read are shown, never spoken
    modules: GRADE1_READING_MODULES(),
  },
  {
    id: 'numbers-2',
    grade: '2',
    subject: 'Math',
    title: 'Numbers to 1,000',
    audience: 'Grade 2',
    modules: GRADE2_MATH_MODULES(),
  },
  {
    id: 'reading-2',
    grade: '2',
    subject: 'Reading',
    title: 'Reading longer words and stories',
    audience: 'Grade 2',
    modules: GRADE2_READING_MODULES(),
  },
  {
    id: 'reading-3',
    grade: '3',
    subject: 'Reading',
    title: 'Reading to understand',
    audience: 'Grade 3',
    modules: GRADE3_READING_MODULES(),
  },
  {
    id: 'math-4',
    grade: '4',
    subject: 'Math',
    title: 'Bigger numbers and operations',
    audience: 'Grade 4',
    modules: GRADE4_MATH_MODULES(),
  },
  {
    id: 'multiplication-3',
    grade: '3',
    subject: 'Math',
    title: 'Multiplication and division',
    audience: 'Grade 3',
    modules: MULTIPLICATION_MODULES(),
  },
  {
    id: 'first-steps-pk',
    grade: 'PK4',
    subject: 'Math',
    title: 'First steps',
    audience: 'Pre-K',
    readAloud: true,
    linear: false, // parallel activities: a child need not finish patterns before counting
    modules: PREK_MODULES(),
  },
  {
    id: 'counting-k',
    grade: 'K',
    subject: 'Math',
    title: 'Counting',
    audience: 'Kindergarten',
    readAloud: true, // questions are spoken; answers are tapped, never typed
    modules: COUNTING_MODULES(),
  },
  {
    id: 'letters-k',
    grade: 'K',
    subject: 'Reading',
    title: 'Letters',
    audience: 'Kindergarten',
    readAloud: true,
    modules: LETTER_MODULES(),
  },
];

// Every module from every course, in one flat list, each stamped with its courseId.
export const MODULES = COURSES.flatMap((c) => c.modules.map((m) => ({ ...m, courseId: c.id })));

export function getCourse(courseId) { return COURSES.find((c) => c.id === courseId) || null; }

// A pre-reader course is one where the student cannot yet read. Everything on screen has
// to work without words: spoken lessons, symbols instead of status labels, and tapping
// instead of typing. Reading aloud is the primary channel here, not an aid bolted on top.
// Some modules only make sense with a finger on glass: tracing letters, dragging blocks.
// Educators see a warning before assigning a course that contains one.
export function courseNeedsTouch(courseId) {
  return MODULES.some((m) => m.courseId === courseId && m.needsTouch === true);
}

export function isPreReader(courseId) {
  const c = getCourse(courseId);
  return !!(c && c.readAloud);
}

// How many questions a module asks, and how many must be right. A course can override
// both, because five quick questions suit counting while a physics module may want three
// long ones. Everything downstream reads these rather than assuming the default.
export function moduleRules(moduleId) {
  const mod = getModule(moduleId);
  const course = mod ? getCourse(mod.courseId) : null;
  return {
    questions: (mod && mod.questions) || (course && course.questionsPerAttempt) || CONFIG.CORE_QUESTIONS_PER_ATTEMPT,
    toMaster: (mod && mod.toMaster) || (course && course.questionsToMaster) || CONFIG.MASTERY_MIN_CORRECT,
  };
}

// Grades that actually have courses, in order — so a grade with nothing in it is never offered.
export function gradesWithCourses() { return GRADES.filter((g) => COURSES.some((c) => c.grade === g)); }

// Courses for one grade, grouped by subject: [{ subject, courses: [...] }, ...]
// Which courses are worth showing first. Once a placement check exists it decides this.
// Until then we go with the grades a student is already working in, and fall back to the
// earliest grade we have, so a brand new student is never shown a wall of thirteen grades.
// When every module of a course is mastered, the next course up in the same subject is
// ready to be switched on. Returns the ids to add, so the screen can record it as an
// event and tell the student. A placement check, once built, will jump further.
export function coursesToUnlock(events) {
  const enabled = enabledCourseIds(events);
  const done = deriveProgress(events).masteredIds;
  const out = [];
  for (const id of enabled) {
    const c = getCourse(id);
    if (!c || !c.modules.every((m) => done.includes(m.id))) continue;
    const later = COURSES.filter((x) => x.subject === c.subject && GRADES.indexOf(x.grade) > GRADES.indexOf(c.grade) && !enabled.includes(x.id)).sort(byGradeOrder);
    if (later.length && !out.includes(later[0].id)) out.push(later[0].id);
  }
  return out;
}

// Pre-K first, college last, then by subject. Every course list on an educator screen uses this.
export function byGradeOrder(a, b) { return GRADES.indexOf(a.grade) - GRADES.indexOf(b.grade) || a.subject.localeCompare(b.subject) || a.title.localeCompare(b.title); }

export function recommendedCourseIds(events, level) {
  const enabled = enabledCourseIds(events);
  const placed = COURSES.filter((c) => enabled.includes(c.id));
  if (placed.length > 0) {
    const grades = [...new Set(placed.map((c) => c.grade))];
    return COURSES.filter((c) => grades.includes(c.grade)).sort(byGradeOrder).map((c) => c.id);
  }
  // A starting level narrows the recommendation to that band, so a new sixth grader is
  // not handed kindergarten counting.
  const band = levelFor(level);
  if (band) {
    // Start small: the two lowest grades in the band that have courses. Everything else in
    // the band sits under "show other courses", so a new student is not handed ten courses.
    const grades = gradesWithCourses().filter((g) => band.grades.includes(g)).slice(0, 1);
    return COURSES.filter((c) => grades.includes(c.grade)).sort(byGradeOrder).map((c) => c.id);
  }
  const first = gradesWithCourses()[0];
  return COURSES.filter((c) => c.grade === first).map((c) => c.id);
}

export function subjectsForGrade(grade) {
  const inGrade = COURSES.filter((c) => c.grade === grade);
  const subjects = [...new Set(inGrade.map((c) => c.subject))];
  return subjects.map((subject) => ({ subject, courses: inGrade.filter((c) => c.subject === subject) }));
}

// Kindergarten reading: letter names, order, and big/small letters. No pictures
// of objects are needed, so everything stays computable and license-free.
function LETTER_MODULES() { return [
  {
    id: 'letter-names',
    order: 1,
    title: 'Letter names',
    tagline: 'A, B, C',
    lesson: {
      paragraphs: ['Every letter has a name. This is A. This is B. This is C.', 'The letters go in order: A, B, C, D, E.'],
      keyIdea: 'Letters have names and an order.',
      example: { kind: 'letters', text: 'A B C D E', caption: 'A, B, C, D, E.' },
      script: [
        { say: 'This is A. This is B. This is C.', show: { kind: 'letters', text: 'A B C' } },
        { say: 'Every letter has a name.', show: { kind: 'letters', text: 'A B C' } },
        { say: 'Letters go in order. A, B, C, D, E.', show: { kind: 'letters', text: 'A B C D E' } },
      ],
    },
    sources: ['Aligned with Common Core RF.K.1.d (recognize and name letters) and Texas TEKS K.2.A.'],
    generators: ['r-tap-letter', 'r-after', 'r-before', 'r-first-letter', 'r-count-letters'],
  },
  {
    id: 'big-and-small-letters',
    order: 2,
    title: 'Big and small letters',
    tagline: 'B and b',
    lesson: {
      paragraphs: ['Every letter has a big shape and a small shape. Big B. Small b.', 'They are the same letter with the same name.'],
      keyIdea: 'Big and small are the same letter.',
      example: { kind: 'letters', text: 'B b   D d   G g', caption: 'Big B and small b. Big D and small d. Big G and small g.' },
      script: [
        { say: 'Big B. Small b.', show: { kind: 'letters', text: 'B b' } },
        { say: 'Every letter has a big shape and a small shape.', show: { kind: 'letters', text: 'D d' } },
        { say: 'They are the same letter with the same name.', show: { kind: 'letters', text: 'G g' } },
      ],
    },
    sources: ['Aligned with Common Core RF.K.1.d and Texas TEKS K.2.A.'],
    generators: ['r-match-small', 'r-match-big', 'r-tap-letter', 'r-first-letter', 'r-count-letters'],
  },
  {
    id: 'letter-sounds',
    order: 3,
    title: 'Letter sounds',
    tagline: 'What each letter says',
    requires: ['big-and-small-letters'],
    lesson: {
      paragraphs: ['Every letter makes a sound. M says mmm, like the start of moon. S says sss, like the start of sun.', 'Say the word slowly and listen for the first sound. That sound tells you the first letter.'],
      keyIdea: 'Letters make sounds. The first sound of a word is its first letter.',
      example: { kind: 'letters', text: 'M', caption: 'M says mmm. Moon starts with M.' },
      script: [
        { say: 'This is M. M says mmm. Mmm, moon.', show: { kind: 'letters', text: 'M' } },
        { say: 'This is S. S says sss. Sss, sun.', show: { kind: 'letters', text: 'S' } },
        { say: 'Say a word slowly. The first sound you hear is the first letter.', show: { kind: 'letters', text: 'M S' } },
      ],
    },
    sources: ['Aligned with Texas TEKS K.2B.i (identify and match the common sounds that letters represent) and Common Core RF.K.3.A.'],
    generators: ['rs-word-starts', 'rs-letter-for-sound', 'rs-pick-word', 'rs-same-start', 'rs-odd-start'],
  },
  {
    id: 'rhymes',
    order: 4,
    title: 'Rhymes',
    tagline: 'Words that sound alike',
    requires: ['letter-sounds'],
    lesson: {
      paragraphs: ['Words rhyme when their endings sound the same. Cat and hat rhyme. Dog and log rhyme.', 'Say the words out loud and listen to how they end.'],
      keyIdea: 'Rhyming words end with the same sound.',
      example: { kind: 'letters', text: 'cat hat', caption: 'Cat, hat. They rhyme.' },
      script: [
        { say: 'Cat. Hat. They end the same way. Cat and hat rhyme.', show: { kind: 'letters', text: 'cat hat' } },
        { say: 'Dog. Log. Dog and log rhyme.', show: { kind: 'letters', text: 'dog log' } },
        { say: 'Listen to the end of the word. Same ending, same rhyme.', show: { kind: 'letters', text: 'cat hat' } },
      ],
    },
    sources: ['Aligned with Texas TEKS K.2A.i (identify and produce rhyming words) and Common Core RF.K.2.A.'],
    generators: ['rr-does-rhyme', 'rr-pick-rhyme', 'rr-odd-rhyme', 'rr-same-end', 'rr-which-two'],
  },
  {
    id: 'tracing-letters',
    order: 5,
    title: 'Tracing letters',
    tagline: 'Draw them with your finger',
    requires: ['letter-names'],
    needsTouch: true,
    lesson: {
      paragraphs: ['Every letter is made of a few strokes. Start at the dot and follow the arrow.', 'Go slowly. Lift your finger when the line ends, then start the next one at its dot.'],
      keyIdea: 'Start at the dot. Follow the arrow. Stay on the line.',
      example: { kind: 'letters', text: 'L', caption: 'Down, then across. That is L.' },
      script: [
        { say: 'Start at the dot. Go down. That is one line.', show: { kind: 'letters', text: 'L' } },
        { say: 'Now start at the new dot. Go across. That makes L.', show: { kind: 'letters', text: 'L' } },
        { say: 'Start at the dot. Follow the arrow. Stay on the line.', show: { kind: 'letters', text: 'L' } },
      ],
    },
    sources: ['Aligned with Texas TEKS K.2E (develop handwriting by accurately forming all uppercase and lowercase letters) and Common Core L.K.1.A.'],
    generators: ['rt-trace-easy', 'rt-trace-easy', 'rt-trace-medium', 'rt-trace-medium', 'rt-trace-any'],
  },
  {
    id: 'syllables',
    order: 6,
    title: 'Clapping syllables',
    tagline: 'The beats in a word',
    requires: ['rhymes'],
    lesson: {
      paragraphs: ['Every word has beats. Clap them as you say the word. Cat has one clap. Rabbit has two: rab, bit.', 'Long words have more beats. Ba-na-na has three.'],
      keyIdea: 'Say the word slowly and clap each beat.',
      example: { kind: 'letters', text: 'rab bit', caption: 'Rab, bit. Two claps.' },
      script: [
        { say: 'Cat. One clap. Cat.', show: { kind: 'letters', text: 'cat' } },
        { say: 'Rabbit. Rab. Bit. Two claps.', show: { kind: 'letters', text: 'rab bit' } },
        { say: 'Banana. Ba. Na. Na. Three claps.', show: { kind: 'letters', text: 'ba na na' } },
      ],
    },
    sources: ['Aligned with Texas TEKS K.2A.iv (identify syllables in spoken words) and Common Core RF.K.2.B.'],
    generators: ['ry-how-many-claps', 'ry-pick-two', 'ry-pick-one', 'ry-more-claps', 'ry-same-claps'],
  },
  {
    id: 'sounding-out',
    order: 7,
    title: 'Sounding out words',
    tagline: 'Three sounds make a word',
    requires: ['letter-sounds'],
    lesson: {
      paragraphs: ['Short words are made of a few sounds in a row. Say each sound, then push them together.', 'C, a, t. Cat. S, u, n. Sun.'],
      keyIdea: 'Say each sound. Then say them fast together.',
      example: { kind: 'letters', text: 'c a t', caption: 'C, a, t. Cat.' },
      script: [
        { say: 'C. A. T. Now fast. Cat.', show: { kind: 'letters', text: 'c a t' } },
        { say: 'S. U. N. Now fast. Sun.', show: { kind: 'letters', text: 's u n' } },
        { say: 'Say each sound. Then push them together.', show: { kind: 'letters', text: 'cat' } },
      ],
    },
    sources: ['Aligned with Texas TEKS K.2B.ii (use letter-sound relationships to decode VC and CVC words) and Common Core RF.K.3.'],
    generators: ['rd-blend', 'rd-first-sound', 'rd-last-sound', 'rd-middle-sound', 'rd-which-word'],
  },
  {
    id: 'which-way-we-read',
    order: 8,
    title: 'Which way we read',
    tagline: 'Left to right, top to bottom',
    requires: ['letter-names'],
    lesson: {
      paragraphs: ['We read from left to right, one word after another. When a line ends we go down to the next one.', 'The first word is on the left. The last word is on the right.'],
      keyIdea: 'Start on the left. Go right. Then down to the next line.',
      example: { kind: 'letters', text: 'A B C', caption: 'Start with A. Then B. Then C.' },
      script: [
        { say: 'Start on the left. A. Then go right. B. C.', show: { kind: 'letters', text: 'A B C' } },
        { say: 'When the line ends, go down to the next line.', show: { kind: 'letters', text: 'A B C' } },
        { say: 'The first one is on the left. The last one is on the right.', show: { kind: 'letters', text: 'A B C' } },
      ],
    },
    sources: ['Aligned with Texas TEKS K.2D.ii (recognize that print is read left to right and top to bottom) and Common Core RF.K.1.A.'],
    generators: ['rw-first', 'rw-last', 'rw-next', 'rw-count-words', 'rw-which-way'],
  },
  {
    id: 'word-meanings',
    order: 9,
    title: 'What a word means',
    tagline: 'Pictures tell you',
    requires: ['sounding-out'],
    lesson: {
      paragraphs: ['A picture can tell you what a word means. If the word says dog and the picture shows a dog, they match.', 'When you meet a new word, look at the picture for a clue.'],
      keyIdea: 'Match the word to the picture.',
      example: { kind: 'shape', name: 'circle', caption: 'Circle. The picture shows a circle.' },
      script: [
        { say: 'This word says circle. The picture shows a circle. They match.', show: { kind: 'shape', name: 'circle' } },
        { say: 'A picture is a clue to what a word means.', show: { kind: 'shape', name: 'square' } },
        { say: 'Read the word. Look at the picture. Do they match?', show: { kind: 'shape', name: 'triangle' } },
      ],
    },
    sources: ['Aligned with Texas TEKS K.3B (use illustrations and text to learn or clarify word meanings) and Common Core RI.K.7.'],
    generators: ['rm-match-picture', 'rm-pick-word', 'rm-does-match', 'rm-count-word', 'rm-shape-word'],
  },
]; }

// Kindergarten content. Lessons are two short spoken sentences with a picture.
// Pictures are described as { kind: 'dots', count } and drawn by the screen code.
// Pre-K. Everything here is looking, matching and tapping. Nothing is read, nothing is
// typed, and every question has a picture. These prepare a three- or four-year-old for
// kindergarten counting and letters, and they are deliberately short.
function PREK_MODULES() { return [
  {
    id: 'colours',
    order: 1,
    title: 'Colors',
    tagline: 'Red, blue, yellow, green',
    lesson: {
      paragraphs: ['Things have colors. This is red. This is blue.', 'Look at the color and say its name.'],
      keyIdea: 'Every color has a name.',
      example: { kind: 'swatch', colour: 'red', caption: 'Red.' },
      script: [
        { say: 'Red.', show: { kind: 'swatch', colour: 'red' } },
        { say: 'Blue.', show: { kind: 'swatch', colour: 'blue' } },
        { say: 'Yellow.', show: { kind: 'swatch', colour: 'yellow' } },
        { say: 'Green.', show: { kind: 'swatch', colour: 'green' } },
      ],
    },
    sources: ['Aligned with Texas Prekindergarten Guidelines V.D.1 (sorting objects by attributes such as color) and Head Start ELOF Goal P-MATH 5.'],
    generators: ['pc-tap-colour', 'pc-name-colour', 'pc-same-colour', 'pc-different-colour', 'pc-tap-colour'],
  },
  {
    id: 'same-and-different',
    order: 2,
    title: 'Same and different',
    tagline: 'Find the match',
    lesson: {
      paragraphs: ['Two things are the same when they look alike. Two things are different when they do not.', 'Look carefully. Find the one that matches.'],
      keyIdea: 'Same looks alike. Different does not.',
      example: { kind: 'pair', a: { shape: 'circle', colour: 'green' }, b: { shape: 'circle', colour: 'green' }, caption: 'Two circles are the same.' },
      script: [
        { say: 'A circle. Another circle. They are the same.', show: { kind: 'pair', a: { shape: 'circle', colour: 'green' }, b: { shape: 'circle', colour: 'green' } } },
        { say: 'A circle. A square. They are different.', show: { kind: 'pair', a: { shape: 'circle', colour: 'green' }, b: { shape: 'square', colour: 'green' } } },
        { say: 'Look carefully. Find the one that matches.', show: { kind: 'pair', a: { shape: 'triangle', colour: 'blue' }, b: { shape: 'triangle', colour: 'blue' } } },
      ],
    },
    sources: ['Aligned with Texas Prekindergarten Guidelines V.D.1 and V.E.1 (matching and sorting) and Head Start ELOF Goal P-MATH 8.'],
    generators: ['ps-find-match', 'ps-odd-one-out', 'ps-same-colour-shape', 'ps-bigger', 'ps-smaller'],
  },
  {
    id: 'patterns',
    order: 3,
    title: 'Patterns',
    tagline: 'What comes next?',
    requires: ['same-and-different'],
    lesson: {
      paragraphs: ['A pattern repeats. Circle, square, circle, square. What comes next? Circle.', 'Say the pattern out loud. Your voice will tell you what comes next.'],
      keyIdea: 'A pattern repeats. Say it out loud to find what comes next.',
      example: { kind: 'pattern', items: ['circle', 'square', 'circle', 'square'], caption: 'Circle, square, circle, square.' },
      script: [
        { say: 'Circle. Square. Circle. Square.', show: { kind: 'pattern', items: ['circle', 'square', 'circle', 'square'] } },
        { say: 'What comes next? Circle.', show: { kind: 'pattern', items: ['circle', 'square', 'circle', 'square', 'circle'] } },
        { say: 'A pattern repeats. Say it out loud.', show: { kind: 'pattern', items: ['triangle', 'circle', 'triangle', 'circle'] } },
      ],
    },
    sources: ['Aligned with Texas Prekindergarten Guidelines V.E.3 (recognize and create patterns) and Head Start ELOF Goal P-MATH 7.'],
    generators: ['pp-what-next', 'pp-what-next', 'pp-which-repeats', 'pp-missing', 'pp-what-next'],
  },
  {
    id: 'count-to-3',
    order: 4,
    title: 'One, two, three',
    tagline: 'First counting',
    lesson: {
      paragraphs: ['One. Two. Three. Touch each one as you say it.', 'The last number you say is how many.'],
      keyIdea: 'Touch and count. One, two, three.',
      example: { kind: 'dots', count: 3, caption: 'One, two, three.' },
      script: [
        { say: 'One.', show: { kind: 'dots', count: 1 } },
        { say: 'One. Two.', show: { kind: 'dots', count: 2 } },
        { say: 'One. Two. Three.', show: { kind: 'dots', count: 3 } },
        { say: 'Touch each one and say the number.', show: { kind: 'dots', count: 3 } },
      ],
    },
    sources: ['Aligned with Texas Prekindergarten Guidelines V.A.1 to V.A.3 (counting and cardinality to at least 3) and Head Start ELOF Goal P-MATH 1.'],
    generators: ['p3-how-many', 'p3-tap-group', 'p3-tap-one', 'p3-more', 'p3-how-many'],
  },
]; }

function COUNTING_MODULES() { return [
  {
    id: 'count-to-5',
    order: 1,
    requires: ['count-to-3'],
    title: 'Count to 5',
    tagline: 'One, two, three, four, five',
    lesson: {
      paragraphs: ['Count each one. Touch it and say the number.', 'The last number you say tells how many there are.'],
      keyIdea: 'The last number you say is how many.',
      example: { kind: 'dots', count: 3, caption: 'One, two, three. There are 3.' },
      // Spoken script for children who cannot read. Always show before telling: the
      // example comes first, then the instruction, then the rule it teaches.
      script: [
        { say: 'One. Two. Three. There are three.', show: { kind: 'dots', count: 3 } },
        { say: 'Count each one. Touch it and say the number.', show: { kind: 'dots', count: 3 } },
        { say: 'The last number you say is how many.', show: { kind: 'dots', count: 3 } },
      ],
    },
    sources: ['Aligned with Common Core math standards K.CC.B.4 and K.CC.B.5 (counting to tell how many).'],
    generators: ['k5-how-many', 'k5-tap-group', 'k5-more', 'k5-fewer', 'k5-after', 'k5-same'],
  },
  {
    id: 'count-to-10',
    order: 2,
    title: 'Count to 10',
    tagline: 'Bigger groups',
    lesson: {
      paragraphs: ['Bigger groups work the same way. Count each one and say the number.', 'Count slowly. The last number tells how many.'],
      keyIdea: 'Count one at a time. The last number is how many.',
      example: { kind: 'dots', count: 7, caption: 'One, two, three, four, five, six, seven. There are 7.' },
      script: [
        { say: 'One. Two. Three. Four. Five. Six. Seven. There are seven.', show: { kind: 'dots', count: 7 } },
        { say: 'Bigger groups work the same way. Count slowly.', show: { kind: 'dots', count: 7 } },
        { say: 'The last number you say is how many.', show: { kind: 'dots', count: 7 } },
      ],
    },
    sources: ['Aligned with Common Core math standards K.CC.B.5 and K.CC.C.6 (counting to 10 and comparing groups).'],
    generators: ['k10-how-many', 'k10-tap-group', 'k10-more', 'k10-fewer', 'k10-after', 'k10-same'],
  },
  {
    id: 'one-more-one-less',
    order: 3,
    title: 'One more, one less',
    tagline: 'Next door numbers',
    requires: ['count-to-10'],
    lesson: {
      paragraphs: ['Every number has a neighbor on each side. One more than 4 is 5. One less than 4 is 3.', 'Count on to find one more. Count back to find one less.'],
      keyIdea: 'One more is the next number. One less is the number before.',
      example: { kind: 'dots', count: 4, caption: 'Four. One more makes five.' },
      script: [
        { say: 'Four. Add one. Now there are five.', show: { kind: 'dots', count: 5 } },
        { say: 'One more is the next number you say when you count.', show: { kind: 'dots', count: 5 } },
        { say: 'Five. Take one away. Now there are four.', show: { kind: 'dots', count: 4 } },
        { say: 'One less is the number just before.', show: { kind: 'dots', count: 4 } },
      ],
    },
    sources: ['Aligned with Texas TEKS K.2F (one more and one less than a given number up to 20) and Common Core K.CC.A.2.'],
    generators: ['km-one-more', 'km-one-less', 'km-one-more-pic', 'km-one-less-pic', 'km-which-neighbour'],
  },
  {
    id: 'joining-and-taking-away',
    order: 4,
    title: 'Joining and taking away',
    tagline: 'Putting together, taking apart',
    requires: ['one-more-one-less'],
    lesson: {
      paragraphs: ['When two groups join, count them all together to find how many. When some go away, count what is left.', 'Three birds on a fence, then two more land. Count them all: five birds.'],
      keyIdea: 'Joining makes more. Taking away leaves fewer. Count to find out how many.',
      example: { kind: 'dots', count: 5, caption: 'Three and two more. That makes five.' },
      script: [
        { say: 'Three birds. Two more birds land. Count them all. Five birds.', show: { kind: 'dots', count: 5 } },
        { say: 'When groups join, there are more. Count them all to find how many.', show: { kind: 'dots', count: 5 } },
        { say: 'Five birds. Two fly away. Count what is left. Three birds.', show: { kind: 'dots', count: 3 } },
        { say: 'When some go away, there are fewer. Count what is left.', show: { kind: 'dots', count: 3 } },
      ],
    },
    sources: ['Aligned with Texas TEKS K.3A, K.3B and K.3C (joining and separating, word problems within 10) and Common Core K.OA.A.1 and K.OA.A.2.'],
    generators: ['km-join-story', 'km-take-story', 'km-join-pic', 'km-take-pic', 'km-how-many-more'],
  },
  {
    id: 'comparing-numbers',
    order: 5,
    title: 'Which is bigger?',
    tagline: 'Comparing numbers',
    requires: ['count-to-10'],
    lesson: {
      paragraphs: ['A bigger number means more things. When you count, the numbers you say later are bigger.', 'Seven comes after four when you count, so seven is bigger than four.'],
      keyIdea: 'The number you say later when counting is the bigger one.',
      example: { kind: 'dots', count: 7, caption: 'Seven is bigger than four.' },
      script: [
        { say: 'Seven. Four. Seven has more. Seven is bigger.', show: { kind: 'dots', count: 7 } },
        { say: 'When you count, the numbers you say later are bigger.', show: { kind: 'dots', count: 7 } },
        { say: 'Four is smaller than seven. It has fewer.', show: { kind: 'dots', count: 4 } },
      ],
    },
    sources: ['Aligned with Texas TEKS K.2E, K.2G and K.2H (comparing sets and written numerals up to 20) and Common Core K.CC.C.7.'],
    generators: ['km-bigger', 'km-smaller', 'km-more-less-same', 'km-make-more', 'km-make-fewer'],
  },
  {
    id: 'shapes',
    order: 6,
    title: 'Shapes',
    tagline: 'Circle, triangle, square, rectangle',
    requires: ['count-to-5'],
    lesson: {
      paragraphs: ['A circle is round with no corners. A triangle has three sides and three corners.', 'A square has four sides that are all the same. A rectangle has four sides too, but two are longer.'],
      keyIdea: 'Count the sides and corners to tell shapes apart.',
      example: { kind: 'shape', name: 'triangle', caption: 'A triangle. Three sides, three corners.' },
      script: [
        { say: 'This is a circle. It is round. It has no corners.', show: { kind: 'shape', name: 'circle' } },
        { say: 'This is a triangle. One, two, three sides. Three corners.', show: { kind: 'shape', name: 'triangle' } },
        { say: 'This is a square. Four sides, all the same.', show: { kind: 'shape', name: 'square' } },
        { say: 'This is a rectangle. Four sides. Two long, two short.', show: { kind: 'shape', name: 'rectangle' } },
      ],
    },
    sources: ['Aligned with Texas TEKS K.6A and K.6E (identify and classify two-dimensional shapes) and Common Core K.G.A.2.'],
    generators: ['ks-name', 'ks-tap', 'ks-sides', 'ks-odd-one-out', 'ks-corners'],
  },
  {
    id: 'counting-by-tens',
    order: 7,
    title: 'Counting by tens',
    tagline: 'Ten, twenty, thirty',
    requires: ['count-to-10'],
    lesson: {
      paragraphs: ['Counting by tens is a fast way to count big groups. Ten, twenty, thirty, forty, fifty.', 'Each jump adds ten more. Say them in order and you reach one hundred in ten jumps.'],
      keyIdea: 'Count by tens: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100.',
      example: { kind: 'tens', count: 3, caption: 'Ten, twenty, thirty.' },
      script: [
        { say: 'Ten. Twenty. Thirty. Each group has ten.', show: { kind: 'tens', count: 3 } },
        { say: 'Counting by tens is fast. Ten, twenty, thirty, forty, fifty.', show: { kind: 'tens', count: 5 } },
        { say: 'Ten jumps of ten reach one hundred.', show: { kind: 'tens', count: 10 } },
      ],
    },
    sources: ['Aligned with Texas TEKS K.5A (recite numbers up to at least 100 by ones and tens) and Common Core K.CC.A.1.'],
    generators: ['kt-next-ten', 'kt-how-many-tens', 'kt-tap-tens', 'kt-before-ten', 'kt-count-on'],
  },
  {
    id: 'longer-and-heavier',
    order: 8,
    title: 'Longer and heavier',
    tagline: 'Comparing size',
    requires: ['comparing-numbers'],
    lesson: {
      paragraphs: ['Things can be compared by how long they are and how heavy they are.', 'A longer thing reaches further. A heavier thing is harder to lift.'],
      keyIdea: 'Longer reaches further. Heavier is harder to lift.',
      example: { kind: 'bars', lengths: [3, 7], caption: 'The bottom one is longer.' },
      script: [
        { say: 'Two lines. This one is short. This one is long.', show: { kind: 'bars', lengths: [3, 7] } },
        { say: 'Longer reaches further. Shorter stops sooner.', show: { kind: 'bars', lengths: [7, 3] } },
        { say: 'A heavy thing is hard to lift. A light thing is easy.', show: { kind: 'bars', lengths: [5, 5] } },
      ],
    },
    sources: ['Aligned with Texas TEKS K.7A and K.7B (measurable attributes; compare two objects) and Common Core K.MD.A.1 and K.MD.A.2.'],
    generators: ['kl-longer', 'kl-shorter', 'kl-same-length', 'kl-heavier-words', 'kl-taller'],
  },
  {
    id: 'sorting',
    order: 9,
    title: 'Sorting',
    tagline: 'Putting things in groups',
    requires: ['shapes'],
    lesson: {
      paragraphs: ['Sorting means putting things that are alike together. All the circles in one group, all the squares in another.', 'Then you can count each group and see which has more.'],
      keyIdea: 'Put things that are alike together. Then count each group.',
      example: { kind: 'shape', name: 'circle', caption: 'Circles go with circles.' },
      script: [
        { say: 'Circles go with circles. Squares go with squares.', show: { kind: 'shape', name: 'circle' } },
        { say: 'That is sorting. Things that are alike go together.', show: { kind: 'shape', name: 'square' } },
        { say: 'Then count each group. Which group has more?', show: { kind: 'dots', count: 4 } },
      ],
    },
    sources: ['Aligned with Texas TEKS K.8A (collect, sort, and organize data into two or three categories) and Common Core K.MD.B.3.'],
    generators: ['ko-belongs', 'ko-count-group', 'ko-which-group-more', 'ko-does-not-belong', 'ko-how-many-groups'],
  },
  {
    id: 'solids',
    order: 10,
    title: 'Solid shapes',
    tagline: 'Ball, box, can, cone',
    requires: ['shapes'],
    lesson: {
      paragraphs: ['Some shapes are flat, like a drawing. Some are solid, like things you can hold.', 'A ball is a sphere. A box is a cube. A can is a cylinder. An ice cream cone is a cone.'],
      keyIdea: 'Solid shapes are things you can hold: sphere, cube, cylinder, cone.',
      example: { kind: 'solid', name: 'sphere', caption: 'A ball is a sphere.' },
      script: [
        { say: 'A ball. It rolls every way. That is a sphere.', show: { kind: 'solid', name: 'sphere' } },
        { say: 'A box. Flat sides and corners. That is a cube.', show: { kind: 'solid', name: 'cube' } },
        { say: 'A can. Round, with flat ends. That is a cylinder.', show: { kind: 'solid', name: 'cylinder' } },
        { say: 'An ice cream cone. A point at one end. That is a cone.', show: { kind: 'solid', name: 'cone' } },
      ],
    },
    sources: ['Aligned with Texas TEKS K.6B (identify three-dimensional solids) and Common Core K.G.A.3.'],
    generators: ['kd-name-solid', 'kd-tap-solid', 'kd-real-thing', 'kd-flat-or-solid', 'kd-rolls'],
  },
  {
    id: 'making-ten',
    order: 11,
    title: 'Making ten',
    tagline: 'Pairs that make ten',
    requires: ['joining-and-taking-away'],
    lesson: {
      paragraphs: ['Ten is a special number. Two numbers that join to make ten are partners.', 'Seven needs three more to make ten. Four needs six. Find the partner.'],
      keyIdea: 'Every number up to nine has a partner that makes ten.',
      example: { kind: 'tenframe', filled: 7, caption: 'Seven, and three more make ten.' },
      script: [
        { say: 'Seven in the frame. Three empty. Seven and three make ten.', show: { kind: 'tenframe', filled: 7 } },
        { say: 'Four in the frame. Six empty. Four and six make ten.', show: { kind: 'tenframe', filled: 4 } },
        { say: 'Count the empty spaces. That is how many more make ten.', show: { kind: 'tenframe', filled: 8 } },
      ],
    },
    sources: ['Aligned with Common Core K.OA.A.3 and K.OA.A.4 (decompose numbers; find the number that makes 10) and Texas TEKS K.3B.'],
    generators: ['kn-partner', 'kn-frame', 'kn-two-ways', 'kn-take-from-ten', 'kn-is-ten'],
  },
]; }

// Grade 1 math. Still spoken and tapped, because reading is only just beginning.
// Everything builds on the kindergarten Counting course.
function GRADE1_MATH_MODULES() { return [
  {
    id: 'teen-numbers',
    order: 1,
    title: 'Teen numbers',
    tagline: 'Ten and some more',
    requires: ['making-ten'],
    lesson: {
      paragraphs: ['Numbers from 11 to 19 are ten and some more. Thirteen is ten and three.', 'Fill a ten-frame, then count the extra ones.'],
      keyIdea: 'A teen number is one ten and some ones.',
      example: { kind: 'tenframe', filled: 10, caption: 'Ten, and three more, is thirteen.' },
      script: [
        { say: 'Ten. And three more. Thirteen.', show: { kind: 'tenframe', filled: 10 } },
        { say: 'Teen numbers are ten and some more.', show: { kind: 'dots', count: 3 } },
        { say: 'Fill the ten. Then count the extra ones.', show: { kind: 'tenframe', filled: 10 } },
      ],
    },
    sources: ['Aligned with Texas TEKS 1.2B (compose and decompose numbers to 120 as tens and ones) and Common Core K.NBT.A.1 and 1.NBT.B.2.'],
    generators: ['g1-ten-and', 'g1-teen-split', 'g1-teen-pic', 'g1-which-teen', 'g1-teen-after'],
  },
  {
    id: 'adding-to-20',
    order: 2,
    title: 'Adding to 20',
    tagline: 'Count on',
    lesson: {
      paragraphs: ['To add, start with the bigger number and count on. 8 + 3: say eight, then nine, ten, eleven.', 'Making ten helps. 8 + 5 is 8 + 2 + 3, which is 10 + 3, which is 13.'],
      keyIdea: 'Start big, count on. Make ten when you can.',
      example: { kind: 'tenframe', filled: 8, caption: 'Eight and five. Fill the ten, then three more. Thirteen.' },
      script: [
        { say: 'Eight. Count on three. Nine, ten, eleven. Eight and three is eleven.', show: { kind: 'dots', count: 8 } },
        { say: 'Start with the bigger number. Then count on.', show: { kind: 'dots', count: 8 } },
        { say: 'Make ten when you can. Eight and two is ten. Then three more. Thirteen.', show: { kind: 'tenframe', filled: 8 } },
      ],
    },
    sources: ['Aligned with Texas TEKS 1.3B and 1.3D (addition within 20; basic facts) and Common Core 1.OA.C.6.'],
    generators: ['g1-add', 'g1-add-story', 'g1-make-ten-add', 'g1-add-pic', 'g1-add-missing'],
  },
  {
    id: 'subtracting-to-20',
    order: 3,
    title: 'Subtracting to 20',
    tagline: 'Count back',
    lesson: {
      paragraphs: ['To subtract, count back. 12 take away 3: say twelve, then eleven, ten, nine.', 'Subtracting undoes adding. If 9 + 4 = 13, then 13 take away 4 is 9.'],
      keyIdea: 'Count back. Subtracting undoes adding.',
      example: { kind: 'dots', count: 9, caption: 'Twelve take away three. Nine.' },
      script: [
        { say: 'Twelve. Take away three. Eleven, ten, nine. Nine are left.', show: { kind: 'dots', count: 9 } },
        { say: 'Count back to take away.', show: { kind: 'dots', count: 9 } },
        { say: 'Subtracting undoes adding. Nine and four is thirteen. Thirteen take away four is nine.', show: { kind: 'dots', count: 9 } },
      ],
    },
    sources: ['Aligned with Texas TEKS 1.3B and 1.3D (subtraction within 20) and Common Core 1.OA.B.4 and 1.OA.C.6.'],
    generators: ['g1-sub', 'g1-sub-story', 'g1-sub-undo', 'g1-sub-pic', 'g1-compare-diff'],
  },
  {
    id: 'tens-and-ones',
    order: 4,
    title: 'Tens and ones',
    tagline: 'Numbers to 100',
    requires: ['counting-by-tens'],
    lesson: {
      paragraphs: ['Bigger numbers are made of tens and ones. 34 is three tens and four ones.', 'Count the tens first, then the ones. Three tens is thirty. Thirty and four is thirty-four.'],
      keyIdea: 'Tens first, then ones.',
      example: { kind: 'tens', count: 3, caption: 'Three tens and four ones. Thirty-four.' },
      script: [
        { say: 'Three tens. Ten, twenty, thirty.', show: { kind: 'tens', count: 3 } },
        { say: 'And four ones. Thirty-four.', show: { kind: 'dots', count: 4 } },
        { say: 'Count the tens first, then the ones.', show: { kind: 'tens', count: 3 } },
      ],
    },
    sources: ['Aligned with Texas TEKS 1.2B and 1.2C (tens and ones to 120) and Common Core 1.NBT.B.2.'],
    generators: ['g1-tens-ones', 'g1-how-many-tens', 'g1-how-many-ones', 'g1-build-number', 'g1-ten-more'],
  },
  {
    id: 'comparing-to-100',
    order: 5,
    title: 'Bigger and smaller to 100',
    tagline: 'Compare two numbers',
    lesson: {
      paragraphs: ['To compare two numbers, look at the tens first. More tens means a bigger number.', 'If the tens are the same, look at the ones. 47 and 43: same tens, so 7 ones beats 3 ones. 47 is bigger.'],
      keyIdea: 'Compare the tens first. Then the ones.',
      example: { kind: 'tens', count: 4, caption: 'Forty-seven and forty-three. Same tens. Seven beats three.' },
      script: [
        { say: 'Sixty and forty. Six tens is more than four tens. Sixty is bigger.', show: { kind: 'tens', count: 6 } },
        { say: 'Look at the tens first.', show: { kind: 'tens', count: 6 } },
        { say: 'Same tens? Then look at the ones.', show: { kind: 'tens', count: 4 } },
      ],
    },
    sources: ['Aligned with Texas TEKS 1.2E and 1.2G (compare and order whole numbers to 120) and Common Core 1.NBT.B.3.'],
    generators: ['g1-bigger', 'g1-smaller', 'g1-between', 'g1-order-three', 'g1-more-less-same'],
  },
]; }

// Grade 1 reading. The instruction is spoken, but the word or sentence to read is only
// ever shown, because reading it is the point. Pictures do the checking.
function GRADE1_READING_MODULES() { return [
  {
    id: 'read-the-word',
    order: 1,
    title: 'Read the word',
    tagline: 'Words and their pictures',
    requires: ['word-meanings'],
    lesson: {
      paragraphs: ['You can read short words by saying each sound and pushing them together. Then find the picture that matches.', 'Box. B, o, x. Box. Tap the box.'],
      keyIdea: 'Sound it out. Then find the picture.',
      example: { kind: 'letters', text: 'box', caption: 'B, o, x. Box.' },
      script: [
        { say: 'Read this word. Sound it out.', show: { kind: 'letters', text: 'box' } },
        { say: 'B. O. X. Box. Now find the box.', show: { kind: 'solid', name: 'cube' } },
        { say: 'Sound it out. Then find the picture.', show: { kind: 'letters', text: 'box' } },
      ],
    },
    sources: ['Aligned with Texas TEKS 1.2B.i (decode words with closed syllables) and Common Core RF.1.3.B.'],
    generators: ['r1-word-picture', 'r1-word-colour', 'r1-word-number', 'r1-which-word', 'r1-word-shape'],
  },
  {
    id: 'sh-ch-th',
    order: 2,
    title: 'Sh, ch and th',
    tagline: 'Two letters, one sound',
    lesson: {
      paragraphs: ['Sometimes two letters make one sound. S and h together say sh, like ship. C and h say ch, like chip. T and h say th, like this.', 'Look for the pair at the start or the end of a word.'],
      keyIdea: 'Sh, ch and th are two letters that make one sound.',
      example: { kind: 'letters', text: 'sh ch th', caption: 'Sh. Ch. Th.' },
      script: [
        { say: 'S and h say sh. Ship.', show: { kind: 'letters', text: 'ship' } },
        { say: 'C and h say ch. Chip.', show: { kind: 'letters', text: 'chip' } },
        { say: 'T and h say th. This.', show: { kind: 'letters', text: 'this' } },
      ],
    },
    sources: ['Aligned with Texas TEKS 1.2B.ii (decode words with consonant digraphs) and Common Core RF.1.3.A.'],
    generators: ['r1-starts-with', 'r1-ends-with', 'r1-which-pair', 'r1-same-pair', 'r1-odd-pair'],
  },
  {
    id: 'silent-e',
    order: 3,
    title: 'The silent e',
    tagline: 'It makes the vowel say its name',
    lesson: {
      paragraphs: ['An e on the end of a word is often silent. It changes the vowel before it. Cap becomes cape. Kit becomes kite.', 'The vowel says its own name: a says A, i says I, o says O.'],
      keyIdea: 'A silent e on the end makes the vowel say its name.',
      example: { kind: 'letters', text: 'cap cape', caption: 'Cap. Add an e. Cape.' },
      script: [
        { say: 'Cap. Add a silent e. Cape.', show: { kind: 'letters', text: 'cap cape' } },
        { say: 'Kit. Add a silent e. Kite.', show: { kind: 'letters', text: 'kit kite' } },
        { say: 'The silent e makes the vowel say its name.', show: { kind: 'letters', text: 'cape kite' } },
      ],
    },
    sources: ['Aligned with Texas TEKS 1.2B.iii (decode words with vowel-consonant-e syllables) and Common Core RF.1.3.C.'],
    generators: ['r1-add-e', 'r1-has-silent-e', 'r1-long-or-short', 'r1-pick-long', 'r1-take-e'],
  },
  {
    id: 'read-the-sentence',
    order: 4,
    title: 'Read the sentence',
    tagline: 'Words in a row',
    lesson: {
      paragraphs: ['A sentence is words in a row that tell you something. Read it from left to right, one word at a time.', 'The circle is red. Read it, then find the red circle.'],
      keyIdea: 'Read left to right. Then find what it says.',
      example: { kind: 'letters', text: 'The circle is red.', caption: 'The circle is red.' },
      script: [
        { say: 'Read this sentence, one word at a time.', show: { kind: 'letters', text: 'The circle is red.' } },
        { say: 'The. Circle. Is. Red. Now find the red circle.', show: { kind: 'item', shape: 'circle', colour: 'red' } },
        { say: 'Read left to right. Then find what it says.', show: { kind: 'letters', text: 'The circle is red.' } },
      ],
    },
    sources: ['Aligned with Texas TEKS 1.4 (read grade-level text with fluency) and Common Core RF.1.4.A.'],
    generators: ['r1-sentence-picture', 'r1-sentence-which', 'r1-sentence-colour', 'r1-sentence-count', 'r1-sentence-yes-no'],
  },
  {
    id: 'what-happened',
    order: 5,
    title: 'What happened?',
    tagline: 'Understanding a little story',
    lesson: {
      paragraphs: ['A story tells you what happened. Read it slowly. Then answer a question about it.', 'The dog ran to the red box. Where did the dog run? To the red box.'],
      keyIdea: 'Read the story. The answer is in the words.',
      example: { kind: 'letters', text: 'The dog ran to the box.', caption: 'The dog ran to the box.' },
      script: [
        { say: 'Read the story. Then a question comes.', show: { kind: 'letters', text: 'The dog ran to the box.' } },
        { say: 'Where did the dog run? To the box. The answer is in the words.', show: { kind: 'letters', text: 'the box' } },
        { say: 'Read the story slowly. The answer is in the words.', show: { kind: 'letters', text: 'The dog ran to the box.' } },
      ],
    },
    sources: ['Aligned with Texas TEKS 1.6 (comprehension: ask and answer questions about a text) and Common Core RL.1.1.'],
    generators: ['r1-who', 'r1-where', 'r1-what-colour', 'r1-how-many', 'r1-true-false'],
  },
]; }

// Grade 2 math. Reading is expected now, so questions are written and some answers typed.
function GRADE2_MATH_MODULES() { return [
  {
    id: 'hundreds-tens-ones',
    order: 1,
    title: 'Hundreds, tens and ones',
    tagline: 'Numbers to 1,000',
    requires: ['tens-and-ones'],
    lesson: {
      paragraphs: [
        'Three-digit numbers have three places: hundreds, tens and ones. In 347 the 3 means three hundreds, the 4 means four tens, and the 7 means seven ones.',
        'A hundred is ten tens. Ten hundreds make a thousand. Each place is worth ten times the place to its right.',
        'You can write a number the long way to see its parts: 347 = 300 + 40 + 7.',
      ],
      keyIdea: 'Each digit has a place. Hundreds, tens, ones.',
      example: { kind: 'bars', lengths: [3, 4, 7], caption: '3 hundreds, 4 tens, 7 ones. 347.' },
    },
    sources: ['Aligned with Texas TEKS 2.2A and 2.2B (compose and decompose numbers to 1,200 as hundreds, tens and ones; expanded form) and Common Core 2.NBT.A.1 and 2.NBT.A.3.'],
    generators: ['g2-place-value', 'g2-expanded', 'g2-digit-means', 'g2-build-3digit', 'g2-hundred-more'],
  },
  {
    id: 'adding-with-regrouping',
    order: 2,
    title: 'Adding two-digit numbers',
    tagline: 'Carry a ten',
    requires: ['adding-to-20'],
    lesson: {
      paragraphs: [
        'Add the ones first. If they come to ten or more, that makes a new ten: write the ones and carry the ten to the tens place.',
        '47 + 38: 7 + 8 = 15, so write 5 and carry 1 ten. Then 4 + 3 + 1 = 8 tens. The answer is 85.',
        'Line the numbers up so ones sit under ones and tens under tens. Then it is one place at a time.',
      ],
      keyIdea: 'Ones first. Ten or more? Carry a ten.',
      example: { kind: 'tens', count: 8, caption: '47 + 38 = 85. Eight tens and five ones.' },
    },
    sources: ['Aligned with Texas TEKS 2.4B (add up to four two-digit numbers using place value) and Common Core 2.NBT.B.5.'],
    generators: ['g2-add', 'g2-add-story', 'g2-add-carry-ones', 'g2-add-missing', 'g2-add-three'],
  },
  {
    id: 'subtracting-with-regrouping',
    order: 3,
    title: 'Subtracting two-digit numbers',
    tagline: 'Borrow a ten',
    requires: ['subtracting-to-20'],
    lesson: {
      paragraphs: [
        'Subtract the ones first. If you cannot, borrow a ten from the tens place: the tens go down by one and the ones go up by ten.',
        '52 − 27: you cannot take 7 from 2, so borrow. 52 becomes 4 tens and 12 ones. 12 − 7 = 5, and 4 − 2 = 2. The answer is 25.',
        'Check by adding back: 25 + 27 = 52.',
      ],
      keyIdea: 'Ones first. Cannot take away? Borrow a ten.',
      example: { kind: 'tens', count: 2, caption: '52 − 27 = 25. Two tens and five ones.' },
    },
    sources: ['Aligned with Texas TEKS 2.4B (subtract two-digit numbers using place value) and Common Core 2.NBT.B.5.'],
    generators: ['g2-sub', 'g2-sub-story', 'g2-sub-borrow-ones', 'g2-sub-check', 'g2-sub-compare'],
  },
  {
    id: 'telling-time',
    order: 4,
    title: 'Telling time',
    tagline: 'Hours and half hours',
    lesson: {
      paragraphs: [
        'A clock has two hands. The short hand points to the hour. The long hand shows the minutes. When the long hand points straight up, it is exactly that hour.',
        'When the long hand points straight down, it is half past. The short hand sits between two numbers then, past the hour it belongs to.',
        'There are 60 minutes in an hour, so half past means 30 minutes past.',
      ],
      keyIdea: 'Short hand: hour. Long hand up: o\'clock. Long hand down: half past.',
      example: { kind: 'clock', hour: 3, minute: 0, caption: 'Three o\'clock.' },
    },
    sources: ['Aligned with Texas TEKS 2.9G (read and write time to the nearest one-minute increment) and Common Core 1.MD.B.3 and 2.MD.C.7.'],
    generators: ['g2-read-clock', 'g2-half-past', 'g2-which-clock', 'g2-minutes-in', 'g2-hour-later'],
  },
  {
    id: 'money',
    order: 5,
    title: 'Coins and dollars',
    tagline: 'Counting money',
    lesson: {
      paragraphs: [
        'A penny is 1 cent. A nickel is 5 cents. A dime is 10 cents. A quarter is 25 cents. A dollar is 100 cents.',
        'To count coins, start with the biggest and count on. A quarter, a dime and a penny: 25, 35, 36 cents.',
        'Counting by fives and tens makes nickels and dimes fast.',
      ],
      keyIdea: 'Know each coin. Start with the biggest and count on.',
      example: { kind: 'bars', lengths: [5, 2, 1], caption: 'A quarter, a dime, a penny. 36 cents.' },
    },
    sources: ['Aligned with Texas TEKS 2.5A and 2.5B (determine the value of a collection of coins up to one dollar) and Common Core 2.MD.C.8.'],
    generators: ['g2-coin-value', 'g2-count-coins', 'g2-make-amount', 'g2-change', 'g2-which-more-money'],
  },
  {
    id: 'rows-and-columns',
    order: 6,
    title: 'Rows and columns',
    tagline: 'Getting ready to multiply',
    requires: ['adding-with-regrouping'],
    lesson: {
      paragraphs: [
        'Things in neat rows and columns are called an array. Three rows of 4 is 4 + 4 + 4, which is 12.',
        'Adding the same number again and again is called repeated addition. It is the first step toward multiplying.',
        'Count the rows, count how many are in each row, then add that number that many times.',
      ],
      keyIdea: 'Rows of the same size. Add the row that many times.',
      example: { kind: 'array', rows: 3, cols: 4, caption: '3 rows of 4. 4 + 4 + 4 = 12.' },
    },
    sources: ['Aligned with Texas TEKS 2.6A (model, create, and describe contextual multiplication situations with equal groups) and Common Core 2.OA.C.4.'],
    generators: ['g2-array-total', 'g2-repeated-add', 'g2-rows-in', 'g2-which-array', 'g2-even-odd'],
  },
]; }

// Grade 2 reading. Written questions now. Word lists carry every fact the checker needs.
function GRADE2_READING_MODULES() { return [
  {
    id: 'vowel-teams',
    order: 1,
    title: 'Vowel teams',
    tagline: 'Two vowels, one sound',
    requires: ['silent-e'],
    lesson: {
      paragraphs: [
        'Two vowels together often make one long sound. In rain, the ai says A. In boat, the oa says O. In feet, the ee says E.',
        'A good rule for many of them: when two vowels go walking, the first one does the talking. It says its own name.',
        'Look for the pair in the middle of the word. Then say the first vowel\'s name.',
      ],
      keyIdea: 'Two vowels together: the first one says its name.',
      example: { kind: 'letters', text: 'rain boat feet', caption: 'Rain. Boat. Feet.' },
    },
    sources: ['Aligned with Texas TEKS 2.2B.ii (decode words with vowel teams) and Common Core RF.2.3.B.'],
    generators: ['r2-team-sound', 'r2-which-team', 'r2-team-word', 'r2-same-team', 'r2-odd-team'],
  },
  {
    id: 'two-syllable-words',
    order: 2,
    title: 'Reading longer words',
    tagline: 'Break them into parts',
    requires: ['syllables'],
    lesson: {
      paragraphs: [
        'Long words are just short parts joined together. Rabbit is rab and bit. Basket is bas and ket. Read each part, then put them together.',
        'Look for two consonants in the middle, like the bb in rabbit or the sk in basket. The word usually splits between them.',
        'Compound words are two whole words stuck together: sunset is sun and set. Read each word and you have it.',
      ],
      keyIdea: 'Split a long word into parts. Read each part. Join them.',
      example: { kind: 'letters', text: 'rab bit', caption: 'Rab. Bit. Rabbit.' },
    },
    sources: ['Aligned with Texas TEKS 2.2B.iii and 2.2B.vi (decode multisyllabic words and compound words) and Common Core RF.2.3.C.'],
    generators: ['r2-split-word', 'r2-join-parts', 'r2-compound', 'r2-compound-parts', 'r2-count-parts'],
  },
  {
    id: 'reading-for-meaning',
    order: 3,
    title: 'What does the story say?',
    tagline: 'Finding the answer in the words',
    requires: ['what-happened'],
    lesson: {
      paragraphs: [
        'Longer stories have more to keep track of: who, where, what happened first, what happened next. Read the whole thing before you answer anything.',
        'When a question asks why, look for a reason in the story. The reason is usually near the thing it explains.',
        'When a question asks what happened first, find the order the story tells it in.',
      ],
      keyIdea: 'Read it all. The answer is in the words, and so is the order.',
      example: { kind: 'letters', text: 'first, then, last', caption: 'First. Then. Last.' },
    },
    sources: ['Aligned with Texas TEKS 2.6 and 2.7C (comprehension; describe the order of events) and Common Core RL.2.1 and RL.2.3.'],
    generators: ['r2-why', 'r2-first', 'r2-last', 'r2-who-did', 'r2-how-felt'],
  },
  {
    id: 'word-meaning-from-context',
    order: 4,
    title: 'Working out a new word',
    tagline: 'Clues around it',
    lesson: {
      paragraphs: [
        'When you meet a word you do not know, the words around it often tell you what it means. If a story says the dog was famished and ate three bowls of food, famished must mean very hungry.',
        'Read the whole sentence. Ask what word would make sense there. That is usually the meaning.',
        'You do not need a dictionary for every new word. The sentence is the first place to look.',
      ],
      keyIdea: 'The words around a new word tell you what it means.',
      example: { kind: 'letters', text: 'famished', caption: 'Famished. Very hungry.' },
    },
    sources: ['Aligned with Texas TEKS 2.3B (use context within and beyond a sentence to determine the meaning of unfamiliar words) and Common Core L.2.4.A.'],
    generators: ['r2-context', 'r2-context', 'r2-opposite', 'r2-context', 'r2-best-fit'],
  },
]; }

// Grade 3 reading. Longer passages, main ideas, prefixes and suffixes, and telling fact from opinion.
function GRADE3_READING_MODULES() { return [
  {
    id: 'main-idea',
    order: 1,
    title: 'The main idea',
    tagline: 'What a paragraph is mostly about',
    requires: ['reading-for-meaning'],
    lesson: {
      paragraphs: [
        'Every paragraph is mostly about one thing. That one thing is the main idea. The other sentences give details that support it.',
        'To find it, ask: what is this whole paragraph about? Often the first or last sentence says it plainly. The details are the examples and reasons in between.',
        'A detail is true but small. The main idea is the big thing the details add up to.',
      ],
      keyIdea: 'Ask what the whole paragraph is about. Details support it.',
      example: { kind: 'letters', text: 'main idea', caption: 'The big thing the details add up to.' },
    },
    sources: ['Aligned with Texas TEKS 3.9D.i (recognize central idea and supporting evidence) and Common Core RI.3.2.'],
    generators: ['r3-main-idea', 'r3-detail', 'r3-not-in-passage', 'r3-best-title', 'r3-main-idea'],
  },
  {
    id: 'prefixes-and-suffixes',
    order: 2,
    title: 'Prefixes and suffixes',
    tagline: 'Word parts that change meaning',
    requires: ['two-syllable-words'],
    lesson: {
      paragraphs: [
        'A prefix goes on the front of a word and changes its meaning. Un means not, so unhappy means not happy. Re means again, so reread means read again.',
        'A suffix goes on the end. Ful means full of, so hopeful means full of hope. Less means without, so hopeless means without hope.',
        'When you meet a long word, look for a prefix or suffix you know. The rest is usually a word you know too.',
      ],
      keyIdea: 'Prefix at the front, suffix at the end. Each one changes the meaning in the same way every time.',
      example: { kind: 'letters', text: 'un + happy', caption: 'Un means not. Unhappy: not happy.' },
    },
    sources: ['Aligned with Texas TEKS 3.3C (identify the meaning of and use words with affixes) and Common Core L.3.4.B.'],
    generators: ['r3-prefix-meaning', 'r3-suffix-meaning', 'r3-build-word', 'r3-which-affix', 'r3-take-affix'],
  },
  {
    id: 'fact-or-opinion',
    order: 3,
    title: 'Fact or opinion',
    tagline: 'Can it be checked?',
    lesson: {
      paragraphs: [
        'A fact is something that can be checked. Spiders have eight legs. You can count them. An opinion is what someone thinks or feels. Spiders are scary. Nobody can check that; it depends on the person.',
        'Words like best, worst, beautiful and boring are clues that a sentence is an opinion. Numbers, dates and things you can measure are clues that it is a fact.',
        'Both are fine to write. The skill is knowing which is which, especially when someone wants you to believe something.',
      ],
      keyIdea: 'A fact can be checked. An opinion is what someone thinks.',
      example: { kind: 'letters', text: 'fact | opinion', caption: 'Can it be checked, or is it what someone thinks?' },
    },
    sources: ['Aligned with Texas TEKS 3.10D.iv (recognize characteristics of persuasive text: fact and opinion) and Common Core RI.3.6.'],
    generators: ['r3-fact-opinion', 'r3-fact-opinion', 'r3-which-is-fact', 'r3-which-is-opinion', 'r3-clue-word'],
  },
  {
    id: 'sequence-and-cause',
    order: 4,
    title: 'Because, so, then',
    tagline: 'Why things happen and in what order',
    lesson: {
      paragraphs: [
        'Stories and explanations link events. A cause is why something happened. An effect is what happened because of it. It rained, so the game was canceled. The rain is the cause; the canceled game is the effect.',
        'Words like because, so, since and as a result point to a cause and its effect. Words like first, next, then and finally point to the order things happened.',
        'When you read, notice these words. They tell you how the pieces fit together.',
      ],
      keyIdea: 'Because points to a cause. So points to an effect. First, next, then give the order.',
      example: { kind: 'letters', text: 'cause → effect', caption: 'It rained, so the game was canceled.' },
    },
    sources: ['Aligned with Texas TEKS 3.9D.iii (organizational patterns such as cause and effect and chronological order) and Common Core RI.3.3.'],
    generators: ['r3-cause', 'r3-effect', 'r3-order', 'r3-signal-word', 'r3-what-next'],
  },
]; }

// Grade 4 math. Multi-digit work, long division, factors, and fractions with decimals.
function GRADE4_MATH_MODULES() { return [
  {
    id: 'multi-digit-multiplication',
    order: 1,
    title: 'Multiplying bigger numbers',
    tagline: 'Two digits times one, and two times two',
    requires: ['times-tables'],
    lesson: {
      paragraphs: [
        'To multiply 34 × 6, split 34 into 30 and 4. Do each part: 30 × 6 = 180, and 4 × 6 = 24. Add them: 204.',
        'For two-digit by two-digit, split both. 23 × 14 is (23 × 10) + (23 × 4), which is 230 + 92, which is 322.',
        'Splitting by place value is the whole trick. Every big multiplication is a few small ones added together.',
      ],
      keyIdea: 'Split by place value. Multiply the parts. Add them up.',
      example: { kind: 'array', rows: 6, cols: 10, caption: '34 × 6: think 30 × 6 and 4 × 6, then add.' },
    },
    sources: ['Aligned with Texas TEKS 4.4D (multiply up to a four-digit number by a one-digit number and a two-digit by two-digit) and Common Core 4.NBT.B.5.'],
    generators: ['g4-two-by-one', 'g4-split-first', 'g4-two-by-two', 'g4-multiply-story', 'g4-estimate-product'],
  },
  {
    id: 'long-division',
    order: 2,
    title: 'Dividing bigger numbers',
    tagline: 'With and without remainders',
    requires: ['sharing-equally'],
    lesson: {
      paragraphs: [
        'To divide 84 by 4, ask how many groups of 4 fit in 80: that is 20. Then how many fit in 4: that is 1. So 84 ÷ 4 = 21.',
        'Sometimes something is left over. 17 ÷ 5: five fits three times (15), and 2 is left. We write 3 remainder 2, or 3 R2.',
        'Check by multiplying back and adding the remainder: 3 × 5 + 2 = 17.',
      ],
      keyIdea: 'Divide the big part, then the small part. What is left over is the remainder.',
      example: { kind: 'array', rows: 4, cols: 5, caption: '20 ÷ 4 = 5. Four rows of five.' },
    },
    sources: ['Aligned with Texas TEKS 4.4E and 4.4F (represent and use strategies to divide up to a four-digit dividend by a one-digit divisor) and Common Core 4.NBT.B.6.'],
    generators: ['g4-divide-exact', 'g4-divide-remainder', 'g4-check-division', 'g4-divide-story', 'g4-remainder-only'],
  },
  {
    id: 'factors-and-multiples',
    order: 3,
    title: 'Factors and multiples',
    tagline: 'What divides in, what it builds',
    requires: ['times-tables'],
    lesson: {
      paragraphs: [
        'A factor of a number divides into it with nothing left over. The factors of 12 are 1, 2, 3, 4, 6 and 12, because each of those divides 12 exactly.',
        'A multiple of a number is what you get by multiplying it. The multiples of 4 are 4, 8, 12, 16, and on forever.',
        'A prime number has exactly two factors, itself and 1. So 7 is prime, and 8 is not, because 2 and 4 divide it.',
      ],
      keyIdea: 'Factors divide in. Multiples build up. A prime has only two factors.',
      example: { kind: 'array', rows: 3, cols: 4, caption: '3 and 4 are factors of 12. 12 is a multiple of both.' },
    },
    sources: ['Aligned with Texas TEKS 4.4B (determine products with factors and identify prime and composite numbers) and Common Core 4.OA.B.4.'],
    generators: ['g4-is-factor', 'g4-list-factor', 'g4-multiple', 'g4-prime', 'g4-next-multiple'],
  },
  {
    id: 'equivalent-and-decimals',
    order: 4,
    title: 'Fractions and decimals',
    tagline: 'Tenths and hundredths',
    requires: ['equivalent-fractions'],
    lesson: {
      paragraphs: [
        'A decimal is a fraction with 10 or 100 on the bottom, written with a point. 3/10 is 0.3. 25/100 is 0.25.',
        'Tenths and hundredths are related: 3/10 is the same as 30/100, so 0.3 and 0.30 are the same amount.',
        'To compare decimals, line up the points and compare digit by digit from the left. 0.4 is bigger than 0.35 because 4 tenths beats 3 tenths.',
      ],
      keyIdea: 'A decimal is tenths and hundredths written with a point.',
      example: { kind: 'bar', parts: 10, shaded: 3, caption: '3/10 is 0.3.' },
    },
    sources: ['Aligned with Texas TEKS 4.2E and 4.2G (represent decimals using models; relate decimals to fractions) and Common Core 4.NF.C.6 and 4.NF.C.7.'],
    generators: ['g4-fraction-to-decimal', 'g4-decimal-to-fraction', 'g4-compare-decimals', 'g4-tenths-hundredths', 'g4-decimal-picture'],
  },
  {
    id: 'add-fractions',
    order: 5,
    title: 'Adding and subtracting fractions',
    tagline: 'Same bottom number',
    requires: ['building-fractions'],
    lesson: {
      paragraphs: [
        'When the bottom numbers match, add or subtract the tops and keep the bottom. 3/8 + 2/8 = 5/8. 7/8 − 3/8 = 4/8.',
        'A fraction bigger than one can be written as a mixed number. 5/4 is one whole and 1/4, written 1 1/4.',
        'If the answer can be simplified, do it. 4/8 is the same as 1/2.',
      ],
      keyIdea: 'Same bottom: add or subtract the tops. Keep the bottom.',
      example: { kind: 'bar', parts: 8, shaded: 5, caption: '3/8 + 2/8 = 5/8.' },
    },
    sources: ['Aligned with Texas TEKS 4.3E (add and subtract fractions with equal denominators) and Common Core 4.NF.B.3.'],
    generators: ['g4-add-fraction', 'g4-sub-fraction', 'g4-mixed-number', 'g4-fraction-story', 'g4-simplify'],
  },
]; }

function MULTIPLICATION_MODULES() { return [
  {
    id: 'equal-groups',
    order: 1,
    title: 'Equal groups',
    tagline: 'What multiplying means',
    requires: ['joining-and-taking-away'],
    lesson: {
      paragraphs: [
        'Multiplying is a fast way to add the same number again and again. Three groups of 4 is 4 + 4 + 4, which is 12. We write it as 3 × 4 = 12.',
        'The first number says how many groups. The second says how many are in each group. Swap them and the answer stays the same: 4 groups of 3 is also 12.',
        'Objects arranged in rows and columns are called an array. An array with 3 rows of 4 shows 3 × 4 at a glance.',
      ],
      keyIdea: 'Groups times what is in each group. Same-size groups, added fast.',
      example: { kind: 'array', rows: 3, cols: 4, caption: '3 rows of 4. 3 × 4 = 12.' },
    },
    sources: ['Aligned with Texas TEKS 3.4D and 3.4K (equal groups and arrays; one-step problems) and Common Core 3.OA.A.1 and 3.OA.A.3.'],
    generators: ['mu-groups-total', 'mu-array', 'mu-story', 'mu-which-equation', 'mu-swap'],
  },
  {
    id: 'times-tables',
    order: 2,
    title: 'Times tables to 10',
    tagline: 'Facts you just know',
    lesson: {
      paragraphs: [
        'Once you know what multiplying means, the facts up to 10 × 10 are worth knowing by heart. They come up constantly, and knowing them frees your mind for the harder parts of a problem.',
        'There are patterns that help. Anything times 2 is doubled. Anything times 5 ends in 0 or 5. Anything times 9 has digits that add to 9. Anything times 10 just gains a zero.',
        'Practice a few facts at a time. Speed comes with repetition, and the memory checks later will keep them fresh.',
      ],
      keyIdea: 'Know the facts to 10 × 10 by heart. Patterns make most of them easy.',
      example: { kind: 'array', rows: 6, cols: 7, caption: '6 rows of 7. 6 × 7 = 42.' },
    },
    sources: ['Aligned with Texas TEKS 3.4F (recall facts to multiply up to 10 by 10 with automaticity) and Common Core 3.OA.C.7.'],
    generators: ['tt-fact', 'tt-fact', 'tt-missing-factor', 'tt-pattern', 'tt-fact-story'],
  },
  {
    id: 'sharing-equally',
    order: 3,
    title: 'Dividing',
    tagline: 'Sharing into equal groups',
    lesson: {
      paragraphs: [
        'Dividing is sharing out equally. 12 cookies shared among 3 friends gives 4 each. We write it as 12 ÷ 3 = 4.',
        'Dividing undoes multiplying. If 3 × 4 = 12, then 12 ÷ 3 = 4 and 12 ÷ 4 = 3. Every multiplication fact hides two division facts.',
        'To divide, ask: what number times the divisor makes the total? 20 ÷ 5: what times 5 makes 20? Four.',
      ],
      keyIdea: 'Dividing undoes multiplying. Ask what times the divisor makes the total.',
      example: { kind: 'array', rows: 3, cols: 4, caption: '12 shared into 3 rows. 4 in each. 12 ÷ 3 = 4.' },
    },
    sources: ['Aligned with Texas TEKS 3.4K (solve problems involving multiplication and division within 100) and Common Core 3.OA.A.2 and 3.OA.B.6.'],
    generators: ['dv-share', 'dv-fact', 'dv-story', 'dv-undo', 'dv-how-many-groups'],
  },
  {
    id: 'add-subtract-1000',
    order: 4,
    title: 'Adding and subtracting to 1,000',
    tagline: 'Bigger numbers, same idea',
    requires: ['joining-and-taking-away'],
    lesson: {
      paragraphs: [
        'Numbers to 1,000 are made of hundreds, tens and ones. 347 is 3 hundreds, 4 tens and 7 ones. Adding and subtracting works one place at a time.',
        'Add the ones first. If they make 10 or more, carry a ten to the tens place. Then add the tens, then the hundreds. Subtracting works the other way: if you cannot take the ones away, borrow a ten.',
        'Two-step problems ask you to do two things in a row. Read carefully, decide what happens first, and do that before the second step.',
      ],
      keyIdea: 'Work one place at a time: ones, then tens, then hundreds.',
      example: { kind: 'bars', lengths: [3, 4, 7], caption: '347 is 3 hundreds, 4 tens, 7 ones.' },
    },
    sources: ['Aligned with Texas TEKS 3.4A (one-step and two-step problems within 1,000) and Common Core 3.NBT.A.2.'],
    generators: ['as-add', 'as-subtract', 'as-story-add', 'as-story-subtract', 'as-two-step'],
  },
]; }

function FRACTION_MODULES() { return [
  {
    id: 'fraction-meaning',
    order: 1,
    title: 'What a fraction means',
    tagline: 'Parts of a whole',
    lesson: {
      paragraphs: [
        'A fraction is a way to describe part of something. Imagine a pizza cut into 4 equal slices. If you eat 1 slice, you ate 1/4 of the pizza.',
        'The bottom number is called the denominator. It tells you how many equal parts the whole was cut into. In 1/4, the whole was cut into 4 equal parts.',
        'The top number is called the numerator. It tells you how many of those parts you are talking about. In 1/4, you are talking about 1 part.',
        'The parts must be equal. If the slices are different sizes, the bottom number does not tell you anything useful.',
      ],
      keyIdea: 'Bottom number: how many equal parts in the whole. Top number: how many parts you have.',
      example: { parts: 4, shaded: 1, caption: '1 of 4 equal parts is shaded, so 1/4 of the bar is shaded.' },
    },
    // Shown to the learner as plain text, never as a link (keeps young learners on task).
    sources: ['Aligned with Common Core math standard 3.NF.A.1 (a fraction as equal parts of a whole).'],
    generators: ['m1-part-eaten', 'm1-part-left', 'm1-picture', 'm1-top-or-bottom', 'm1-what-number-means'],
  },
  {
    id: 'equivalent-fractions',
    order: 2,
    title: 'Equivalent fractions',
    tagline: 'Same amount, different name',
    lesson: {
      paragraphs: [
        'Equivalent fractions are different names for the same amount. Half a pizza is 1/2. Cut each half in two and you have 4 slices, and that same half is now 2 slices: 2/4. Same pizza, same amount, different name.',
        'To find an equivalent fraction, multiply the top and the bottom by the same number. Multiply 1/2 by 2 on top and bottom and you get 2/4. Multiply by 3 and you get 3/6. All three are the same amount.',
        'You can also go the other way: divide the top and bottom by the same number to get a simpler name. Divide 4/8 by 4 on top and bottom and you get 1/2.',
        'A common mistake is adding the same number to the top and bottom. 1/2 is not the same as 2/3. Adding changes the amount; multiplying does not.',
      ],
      keyIdea: 'Multiply (or divide) the top and bottom by the same number and the amount stays the same.',
      example: { parts: 4, shaded: 2, caption: '2/4 of the bar is shaded. That is the same amount as 1/2.' },
    },
    sources: ['Aligned with Common Core math standards 3.NF.A.3 and 4.NF.A.1 (recognizing and generating equivalent fractions).'],
    generators: ['m2-which-equals', 'm2-fill-bottom', 'm2-fill-top', 'm2-simplify', 'm2-equivalent-or-not'],
  },
  {
    id: 'comparing-fractions',
    order: 3,
    title: 'Comparing fractions',
    tagline: 'Which one is bigger?',
    lesson: {
      paragraphs: [
        'When two fractions have the same bottom number, the pieces are the same size. So the fraction with the bigger top number is bigger: 5/8 is bigger than 3/8.',
        'When two fractions have the same top number, you have the same number of pieces, but the pieces are different sizes. A bigger bottom number means smaller pieces. So 1/3 is bigger than 1/4.',
        'When both numbers are different, rename the fractions so they share a bottom number. To compare 2/3 and 3/4, use twelfths: 2/3 = 8/12 and 3/4 = 9/12. Now compare the tops: 9 is bigger, so 3/4 is bigger.',
        'Another quick check is to compare each fraction to one half. 3/5 is more than half. 2/5 is less than half. So 3/5 is bigger.',
      ],
      keyIdea: 'Same bottom: compare the tops. Same top: the smaller bottom is bigger. Otherwise, rename them to share a bottom number.',
      example: { parts: 8, shaded: 5, caption: '5/8 is bigger than 3/8: the pieces are the same size, and there are more of them.' },
    },
    sources: ['Aligned with Common Core math standards 3.NF.A.3.d and 4.NF.A.2 (comparing fractions).'],
    generators: ['m3-same-bottom', 'm3-same-top', 'm3-different', 'm3-smallest-of-three', 'm3-true-false'],
  },
  {
    id: 'fractions-on-a-line',
    order: 4,
    title: 'Fractions on a number line',
    tagline: 'A fraction is a place',
    lesson: {
      paragraphs: [
        'A fraction is not only part of a shape. It is also a number, with a place on the number line between 0 and 1.',
        'To find 3/4, cut the space from 0 to 1 into 4 equal steps. Count 3 steps from 0. That point is 3/4.',
        'The bottom number tells you how many steps make a whole. The top number tells you how many steps to count.',
      ],
      keyIdea: 'Cut 0 to 1 into equal steps. Count steps to find the fraction.',
      example: { kind: 'numberline', parts: 4, mark: 3, caption: 'Four steps to 1. Three steps along is 3/4.' },
    },
    sources: ['Aligned with Texas TEKS 3.3B (the fraction that represents a point on a number line) and Common Core 3.NF.A.2.'],
    generators: ['nl-which-fraction', 'nl-how-many-steps', 'nl-place', 'nl-halfway', 'nl-closer-to'],
  },
  {
    id: 'building-fractions',
    order: 5,
    title: 'Building fractions',
    tagline: 'Unit fractions add up',
    lesson: {
      paragraphs: [
        'A fraction like 3/5 is made of three pieces, each 1/5. We say 3/5 = 1/5 + 1/5 + 1/5. A single piece, 1/5, is called a unit fraction.',
        'You can also take a fraction apart into bigger pieces: 3/5 = 2/5 + 1/5. As long as the bottom numbers match, you just add the tops.',
        'Sharing works the same way. Two pizzas shared among 4 people is 2/4 each, which is the same as 1/2.',
      ],
      keyIdea: 'A fraction is a sum of unit fractions. Same bottom, add the tops.',
      example: { kind: 'bar', parts: 5, shaded: 3, caption: '3/5 is 1/5 + 1/5 + 1/5.' },
    },
    sources: ['Aligned with Texas TEKS 3.3D and 3.3E (compose and decompose fractions; partition among recipients) and Common Core 3.NF.A.1.'],
    generators: ['bf-how-many-units', 'bf-sum-of-units', 'bf-split', 'bf-share', 'bf-add-same-bottom'],
  },
]; }

export function getModule(moduleId) {
  return MODULES.find((m) => m.id === moduleId) || null;
}

// ---------------------------------------------------------------------
// 2. QUESTION GENERATORS
//    Questions are built from small random numbers, not written one by
//    one, so retries get fresh questions and there is no limit on variety.
//    Every answer and every explanation is computed by arithmetic, so a
//    question can never contain a made-up fact. The tests re-check the
//    arithmetic independently.
//
//    A question looks like:
//      { genId, seed, type: 'choice' | 'number', story, prompt, choices, answer, explain, visual, explainVisual }
//      - story:   one short line of setup shown above the question (or null)
//      - prompt:  the question itself, kept to one short sentence
//      - choices: list of strings (only for type 'choice')
//      - answer:  a string. For 'choice' it is one of the choices.
//                 For 'number' it is a whole number written as a string.
//      - visual:  { parts, shaded } to draw a bar with the question, or null
//      - explainVisual: a list of { parts, shaded, label } bars shown with the explanation, or null
// ---------------------------------------------------------------------

// -- Seeded random numbers (same seed => same numbers, which makes questions reproducible) --
export function makeRng(seed) {
  let s = (seed >>> 0) || 1;
  return function rng() {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function randInt(rng, min, max) { return min + Math.floor(rng() * (max - min + 1)); }
export function pick(rng, list) { return list[Math.floor(rng() * list.length)]; }
export function shuffle(rng, list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// -- Fraction helpers --
export function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
export function lcm(a, b) { return (a * b) / gcd(a, b); }
export function frac(n, d) { return { n, d }; }
export function fracText(f) { return `${f.n}/${f.d}`; }
export function fracValue(f) { return f.n / f.d; }
export function fracEqual(a, b) { return a.n * b.d === b.n * a.d; }
export function fracCompare(a, b) { const l = a.n * b.d; const r = b.n * a.d; return l === r ? 0 : l > r ? 1 : -1; }

// A random "filler" wrong answer, used when the planned wrong answers collide.
function randomFraction(rng) {
  const d = randInt(rng, 2, 10);
  return frac(randInt(rng, 1, d), d);
}

// Builds the shuffled list of options for a fraction question.
// Rules: the correct answer is always included exactly once; any wrong answer
// that is the same amount as the correct one (e.g. 2/4 vs 1/2), a duplicate,
// or has a bottom number under 2 is thrown out and replaced.
export function buildFractionChoices(rng, correct, distractors) {
  const seen = new Set([fracText(correct)]);
  const out = [correct];
  const tryAdd = (f) => {
    if (out.length >= CONFIG.CHOICES_PER_QUESTION) return;
    if (!Number.isInteger(f.n) || !Number.isInteger(f.d) || f.n < 1 || f.d < 2) return;
    const t = fracText(f);
    if (seen.has(t) || out.some((g) => fracEqual(g, f))) return; // no two options may be the same amount
    seen.add(t);
    out.push(f);
  };
  distractors.forEach(tryAdd);
  let guard = 0;
  while (out.length < CONFIG.CHOICES_PER_QUESTION && guard++ < 100) tryAdd(randomFraction(rng));
  return shuffle(rng, out).map(fracText);
}

// A fraction that is already in simplest form, with a small bottom number.
function pickSimpleFraction(rng) {
  const d = pick(rng, [2, 3, 4, 5, 6, 8]);
  let n = randInt(rng, 1, d - 1);
  while (gcd(n, d) !== 1) n = randInt(rng, 1, d - 1);
  return frac(n, d);
}

const FOODS = [
  { thing: 'pizza', piece: 'slices' },
  { thing: 'chocolate bar', piece: 'pieces' },
  { thing: 'cake', piece: 'slices' },
  { thing: 'pie', piece: 'pieces' },
  { thing: 'sandwich', piece: 'pieces' },
];
const singular = (word) => word.slice(0, -1); // "slices" -> "slice"

export const GENERATORS = {
  // ---------- Module 1: what a fraction means ----------
  'm1-part-eaten': (rng) => {
    const f = pick(rng, FOODS);
    const n = randInt(rng, 3, 10);
    const m = randInt(rng, 1, n - 1);
    const correct = frac(m, n);
    return {
      type: 'choice',
      story: `A ${f.thing} is cut into ${n} equal ${f.piece}. You eat ${m} ${m === 1 ? singular(f.piece) : f.piece}.`,
      prompt: 'What fraction did you eat?',
      choices: buildFractionChoices(rng, correct, [frac(n, m), frac(n - m, n), frac(m, n + 1)]),
      answer: fracText(correct),
      explain: `${n} equal parts, so the bottom number is ${n}. You ate ${m}, so the top number is ${m}. That is ${m}/${n}.`,
      visual: rng() < 0.5 ? { parts: n, shaded: m } : null,
      explainVisual: [{ parts: n, shaded: m, label: `${m}/${n} eaten` }],
    };
  },
  'm1-part-left': (rng) => {
    const f = pick(rng, FOODS);
    const n = randInt(rng, 4, 10);
    const m = randInt(rng, 1, n - 1);
    const left = n - m;
    const correct = frac(left, n);
    return {
      type: 'choice',
      story: `A ${f.thing} is cut into ${n} equal ${f.piece}. ${m} ${m === 1 ? singular(f.piece) + ' is' : f.piece + ' are'} eaten.`,
      prompt: 'What fraction is left?',
      choices: buildFractionChoices(rng, correct, [frac(m, n), frac(n, left), frac(left, m)]),
      answer: fracText(correct),
      explain: `${n} − ${m} = ${left} ${f.piece} are left, out of ${n}. So ${left}/${n} is left.`,
      visual: null,
      explainVisual: [{ parts: n, shaded: left, label: `${left}/${n} left` }],
    };
  },
  'm1-picture': (rng) => {
    const n = randInt(rng, 2, 10);
    const m = randInt(rng, 1, n - 1);
    const correct = frac(m, n);
    return {
      type: 'choice',
      story: 'Look at the bar.',
      prompt: 'What fraction is shaded?',
      choices: buildFractionChoices(rng, correct, [frac(n, m), frac(n - m, n), frac(m, n - m)]),
      answer: fracText(correct),
      explain: `${n} equal parts, ${m} shaded: ${m}/${n}.`,
      visual: { parts: n, shaded: m },
      explainVisual: null,
    };
  },
  'm1-top-or-bottom': (rng) => {
    const f = pick(rng, FOODS);
    const n = randInt(rng, 3, 10);
    const m = randInt(rng, 1, n - 1);
    const askTop = rng() < 0.5;
    return {
      type: 'number',
      story: `A ${f.thing} is cut into ${n} equal ${f.piece}. You eat ${m}.`,
      prompt: `What is the ${askTop ? 'top' : 'bottom'} number of the fraction you ate?`,
      choices: null,
      answer: String(askTop ? m : n),
      explain: askTop
        ? `The top number (numerator) counts the parts you ate: ${m}. The fraction is ${m}/${n}.`
        : `The bottom number (denominator) counts all the equal parts: ${n}. The fraction is ${m}/${n}.`,
      visual: null,
      explainVisual: [{ parts: n, shaded: m, label: `${m}/${n}` }],
    };
  },
  'm1-what-number-means': (rng) => {
    const n = randInt(rng, 3, 9);
    const m = randInt(rng, 1, n - 1);
    const askBottom = rng() < 0.5;
    const bottomMeaning = 'How many equal parts the whole is split into';
    const topMeaning = 'How many of the parts you are talking about';
    const correct = askBottom ? bottomMeaning : topMeaning;
    const wrong = [askBottom ? topMeaning : bottomMeaning, 'How many parts are missing', 'How big the whole is'];
    return {
      type: 'choice',
      story: `Look at the fraction ${m}/${n}.`,
      prompt: `What does the ${askBottom ? 'bottom' : 'top'} number tell you?`,
      choices: shuffle(rng, [correct, ...wrong]),
      answer: correct,
      explain: askBottom
        ? `The bottom number (denominator) tells you the whole is split into ${n} equal parts.`
        : `The top number (numerator) tells you that you are talking about ${m} of the parts.`,
      visual: null,
      explainVisual: [{ parts: n, shaded: m, label: `${m}/${n}` }],
    };
  },

  // ---------- Module 2: equivalent fractions ----------
  'm2-which-equals': (rng) => {
    const { n: a, d: b } = pickSimpleFraction(rng);
    const k = randInt(rng, 2, 4);
    const correct = frac(a * k, b * k);
    return {
      type: 'choice',
      story: null,
      prompt: `Which fraction equals ${a}/${b}?`,
      choices: buildFractionChoices(rng, correct, [frac(a + k, b + k), frac(a, b * k), frac(a * k, b * (k + 1))]),
      answer: fracText(correct),
      explain: `Multiply top and bottom by ${k}: ${a} × ${k} = ${a * k} and ${b} × ${k} = ${b * k}. So ${a}/${b} = ${a * k}/${b * k}.`,
      visual: null,
      explainVisual: [{ parts: b, shaded: a, label: `${a}/${b}` }, { parts: b * k, shaded: a * k, label: `${a * k}/${b * k}` }],
    };
  },
  'm2-fill-bottom': (rng) => {
    const { n: a, d: b } = pickSimpleFraction(rng);
    const k = randInt(rng, 2, 4);
    return {
      type: 'number',
      story: `${a}/${b} = ${a * k}/__`,
      prompt: 'What number goes in the blank?',
      choices: null,
      answer: String(b * k),
      explain: `The top went from ${a} to ${a * k}. That is times ${k}. Do the same to the bottom: ${b} × ${k} = ${b * k}.`,
      visual: null,
      explainVisual: [{ parts: b, shaded: a, label: `${a}/${b}` }, { parts: b * k, shaded: a * k, label: `${a * k}/${b * k}` }],
    };
  },
  'm2-fill-top': (rng) => {
    const { n: a, d: b } = pickSimpleFraction(rng);
    const k = randInt(rng, 2, 4);
    return {
      type: 'number',
      story: `${a}/${b} = __/${b * k}`,
      prompt: 'What number goes in the blank?',
      choices: null,
      answer: String(a * k),
      explain: `The bottom went from ${b} to ${b * k}. That is times ${k}. Do the same to the top: ${a} × ${k} = ${a * k}.`,
      visual: null,
      explainVisual: [{ parts: b, shaded: a, label: `${a}/${b}` }, { parts: b * k, shaded: a * k, label: `${a * k}/${b * k}` }],
    };
  },
  'm2-simplify': (rng) => {
    const { n: a, d: b } = pickSimpleFraction(rng);
    const k = randInt(rng, 2, 4);
    const correct = frac(a, b);
    return {
      type: 'choice',
      story: null,
      prompt: `What is ${a * k}/${b * k} in simplest form?`,
      choices: buildFractionChoices(rng, correct, [frac(a * k - 1, b * k - 1), frac(a, b + 1), frac(a + 1, b)]),
      answer: fracText(correct),
      explain: `Divide top and bottom by ${k}: ${a * k} ÷ ${k} = ${a} and ${b * k} ÷ ${k} = ${b}. Simplest form: ${a}/${b}.`,
      visual: null,
      explainVisual: [{ parts: b * k, shaded: a * k, label: `${a * k}/${b * k}` }, { parts: b, shaded: a, label: `${a}/${b}` }],
    };
  },
  'm2-equivalent-or-not': (rng) => {
    const { n: a, d: b } = pickSimpleFraction(rng);
    const k = randInt(rng, 2, 4);
    const isEquivalent = rng() < 0.5;
    const other = isEquivalent ? frac(a * k, b * k) : frac(a + k, b + k);
    const yes = 'Yes, they are the same amount';
    const no = 'No, they are different amounts';
    return {
      type: 'choice',
      story: null,
      prompt: `Is ${a}/${b} the same amount as ${other.n}/${other.d}?`,
      choices: [yes, no],
      answer: isEquivalent ? yes : no,
      explain: isEquivalent
        ? `Yes. Multiply the top and bottom of ${a}/${b} by ${k} and you get ${a * k}/${b * k}.`
        : `No. Multiplying top and bottom of ${a}/${b} by ${k} gives ${a * k}/${b * k}, not ${a + k}/${b + k}. Adding changes the amount.`,
      visual: null,
      explainVisual: [{ parts: b, shaded: a, label: `${a}/${b}` }, { parts: other.d, shaded: other.n, label: `${other.n}/${other.d}` }],
    };
  },

  // ---------- Module 3: comparing fractions ----------
  'm3-same-bottom': (rng) => {
    const n = randInt(rng, 4, 10);
    const a = randInt(rng, 1, n - 1);
    let b = randInt(rng, 1, n - 1);
    while (b === a) b = randInt(rng, 1, n - 1);
    const big = Math.max(a, b);
    return {
      type: 'choice',
      story: null,
      prompt: `Which is bigger: ${a}/${n} or ${b}/${n}?`,
      choices: shuffle(rng, [`${a}/${n}`, `${b}/${n}`]),
      answer: `${big}/${n}`,
      explain: `Same bottom number, so the pieces are the same size. More pieces is more: ${big}/${n} is bigger.`,
      visual: null,
      explainVisual: [{ parts: n, shaded: a, label: `${a}/${n}` }, { parts: n, shaded: b, label: `${b}/${n}` }],
    };
  },
  'm3-same-top': (rng) => {
    const a = randInt(rng, 1, 3);
    const options = [2, 3, 4, 5, 6, 8, 10].filter((d) => d > a);
    const n = pick(rng, options);
    let m = pick(rng, options);
    while (m === n) m = pick(rng, options);
    const small = Math.min(n, m);
    const large = Math.max(n, m);
    return {
      type: 'choice',
      story: null,
      prompt: `Which is bigger: ${a}/${n} or ${a}/${m}?`,
      choices: shuffle(rng, [`${a}/${n}`, `${a}/${m}`]),
      answer: `${a}/${small}`,
      explain: `Both have ${a} piece${a > 1 ? 's' : ''}. In ${a}/${small} the whole is split into only ${small} parts, so each piece is bigger. ${a}/${small} is bigger.`,
      visual: null,
      explainVisual: [{ parts: n, shaded: a, label: `${a}/${n}` }, { parts: m, shaded: a, label: `${a}/${m}` }],
    };
  },
  'm3-different': (rng) => {
    const pair = pickDifferentPair(rng);
    const { x, y } = pair;
    const bigger = fracCompare(x, y) > 0 ? x : y;
    return {
      type: 'choice',
      story: null,
      prompt: `Which is bigger: ${fracText(x)} or ${fracText(y)}?`,
      choices: shuffle(rng, [fracText(x), fracText(y)]),
      answer: fracText(bigger),
      explain: explainCommonDenominator(x, y, bigger),
      visual: null,
      explainVisual: [{ parts: x.d, shaded: x.n, label: fracText(x) }, { parts: y.d, shaded: y.n, label: fracText(y) }],
    };
  },
  'm3-smallest-of-three': (rng) => {
    const denoms = [2, 3, 4, 6, 8];
    const set = [];
    let guard = 0;
    while (set.length < 3 && guard++ < 200) {
      const d = pick(rng, denoms);
      const f = frac(randInt(rng, 1, d - 1), d);
      if (set.every((g) => !fracEqual(g, f))) set.push(f);
    }
    let smallest = set[0];
    for (const f of set) if (fracCompare(f, smallest) < 0) smallest = f;
    const L = set.reduce((acc, f) => lcm(acc, f.d), 1);
    const renamed = set.map((f) => `${fracText(f)} = ${(f.n * L) / f.d}/${L}`).join(', ');
    return {
      type: 'choice',
      story: `Look at these three: ${set.map(fracText).join(', ')}.`,
      prompt: 'Which one is the smallest?',
      choices: shuffle(rng, set.map(fracText)),
      answer: fracText(smallest),
      explain: `Rename them all with the bottom number ${L}: ${renamed}. The smallest top number wins: ${fracText(smallest)}.`,
      visual: null,
      explainVisual: set.map((f) => ({ parts: f.d, shaded: f.n, label: fracText(f) })),
    };
  },
  'm3-true-false': (rng) => {
    const { x, y } = pickDifferentPair(rng);
    const claimTrue = fracCompare(x, y) > 0;
    const bigger = claimTrue ? x : y;
    return {
      type: 'choice',
      story: `${fracText(x)} is bigger than ${fracText(y)}.`,
      prompt: 'True or false?',
      choices: ['True', 'False'],
      answer: claimTrue ? 'True' : 'False',
      explain: `${claimTrue ? 'True.' : 'False.'} ${explainCommonDenominator(x, y, bigger)}`,
      visual: null,
      explainVisual: [{ parts: x.d, shaded: x.n, label: fracText(x) }, { parts: y.d, shaded: y.n, label: fracText(y) }],
    };
  },
};

// Pre-K colours, matching, patterns, first counting. Choices like 'swatch:red' and
// 'item:circle-red' are pictures the screen draws.
const COLOURS = ['red', 'blue', 'yellow', 'green'];
const pickColour = (rng) => COLOURS[randInt(rng, 0, COLOURS.length - 1)];
const otherColours = (rng, not, n) => shuffle(rng, COLOURS.filter((c) => c !== not)).slice(0, n);
const PATTERN_SHAPES = ['circle', 'square', 'triangle'];
Object.assign(GENERATORS, {
  'pc-tap-colour': (rng) => {
    const c = pickColour(rng);
    return { type: 'choice', story: null, prompt: `Tap ${c}.`, choices: shuffle(rng, [c, ...otherColours(rng, c, 2)].map((x) => `swatch:${x}`)), answer: `swatch:${c}`,
      explain: `This one is ${c}.`, visual: null, explainVisual: null };
  },
  'pc-name-colour': (rng) => {
    const c = pickColour(rng);
    return { type: 'choice', story: null, prompt: 'What color is this?', choices: shuffle(rng, [c, ...otherColours(rng, c, 2)]), answer: c,
      explain: `It is ${c}.`, visual: { kind: 'swatch', colour: c }, explainVisual: null };
  },
  'pc-same-colour': (rng) => {
    const c = pickColour(rng); const other = otherColours(rng, c, 1)[0];
    const shapeA = pick(rng, PATTERN_SHAPES); const shapeB = pick(rng, PATTERN_SHAPES);
    return { type: 'choice', story: null, prompt: 'Tap the one that is the same color.', choices: shuffle(rng, [`item:${shapeA}-${c}`, `item:${shapeB}-${other}`]), answer: `item:${shapeA}-${c}`,
      explain: `Both are ${c}.`, visual: { kind: 'swatch', colour: c }, explainVisual: null };
  },
  'pc-different-colour': (rng) => {
    const c = pickColour(rng); const other = otherColours(rng, c, 1)[0];
    const choices = shuffle(rng, [`item:circle-${c}#0`, `item:circle-${c}#1`, `item:circle-${other}#2`]);
    return { type: 'choice', story: 'Two are the same color.', prompt: 'Tap the one that is different.', choices, answer: choices.find((x) => x.includes(`-${other}#`)),
      explain: `Two are ${c}. This one is ${other}.`, visual: null, explainVisual: null };
  },
  'ps-find-match': (rng) => {
    const sh = pick(rng, PATTERN_SHAPES); const c = pickColour(rng);
    const other = pick(rng, PATTERN_SHAPES.filter((x) => x !== sh)); const oc = otherColours(rng, c, 1)[0];
    return { type: 'choice', story: null, prompt: 'Tap the one that matches.', choices: shuffle(rng, [`item:${sh}-${c}`, `item:${other}-${c}`, `item:${sh}-${oc}`]), answer: `item:${sh}-${c}`,
      explain: `Same shape, same color. It matches.`, visual: { kind: 'item', shape: sh, colour: c }, explainVisual: null };
  },
  'ps-odd-one-out': (rng) => {
    const sh = pick(rng, PATTERN_SHAPES); const c = pickColour(rng);
    const other = pick(rng, PATTERN_SHAPES.filter((x) => x !== sh));
    const choices = shuffle(rng, [`item:${sh}-${c}#0`, `item:${sh}-${c}#1`, `item:${other}-${c}#2`]);
    return { type: 'choice', story: 'Two are the same.', prompt: 'Tap the one that is different.', choices, answer: choices.find((x) => x.startsWith(`item:${other}-`)),
      explain: `Two are ${sh}s. This one is a ${other}.`, visual: null, explainVisual: null };
  },
  'ps-same-colour-shape': (rng) => {
    const sh = pick(rng, PATTERN_SHAPES); const c = pickColour(rng); const oc = otherColours(rng, c, 1)[0];
    return { type: 'choice', story: null, prompt: 'Which one is exactly the same?', choices: shuffle(rng, [`item:${sh}-${c}`, `item:${sh}-${oc}`]), answer: `item:${sh}-${c}`,
      explain: `Same ${sh}, same ${c}. Exactly the same.`, visual: { kind: 'item', shape: sh, colour: c }, explainVisual: null };
  },
  'ps-bigger': (rng) => {
    const sh = pick(rng, PATTERN_SHAPES); const c = pickColour(rng);
    return { type: 'choice', story: null, prompt: 'Tap the bigger one.', choices: shuffle(rng, [`item:${sh}-${c}-big`, `item:${sh}-${c}-small`]), answer: `item:${sh}-${c}-big`,
      explain: 'This one is bigger.', visual: null, explainVisual: null };
  },
  'ps-smaller': (rng) => {
    const sh = pick(rng, PATTERN_SHAPES); const c = pickColour(rng);
    return { type: 'choice', story: null, prompt: 'Tap the smaller one.', choices: shuffle(rng, [`item:${sh}-${c}-big`, `item:${sh}-${c}-small`]), answer: `item:${sh}-${c}-small`,
      explain: 'This one is smaller.', visual: null, explainVisual: null };
  },
  'pp-what-next': (rng) => {
    const [a, b] = shuffle(rng, PATTERN_SHAPES).slice(0, 2); const c = pickColour(rng);
    const items = [a, b, a, b]; const next = a; const wrong = b;
    return { type: 'choice', story: null, prompt: 'What comes next?', choices: shuffle(rng, [`item:${next}-${c}`, `item:${wrong}-${c}`]), answer: `item:${next}-${c}`,
      explain: `${a}, ${b}, ${a}, ${b}. Next comes ${a}.`, visual: { kind: 'pattern', items, colour: c }, explainVisual: null };
  },
  'pp-which-repeats': (rng) => {
    const [a, b, d] = shuffle(rng, PATTERN_SHAPES); const c = pickColour(rng);
    const yes = randInt(rng, 0, 1) === 1;
    const items = yes ? [a, b, a, b, a, b] : [a, b, d, a, d, b];
    return { type: 'choice', story: null, prompt: 'Does this repeat the same way each time?', choices: ['Yes', 'No'], answer: yes ? 'Yes' : 'No',
      explain: yes ? `${a}, ${b}, ${a}, ${b}. It repeats.` : 'The order keeps changing. It does not repeat.', visual: { kind: 'pattern', items, colour: c }, explainVisual: null };
  },
  'pp-missing': (rng) => {
    const [a, b] = shuffle(rng, PATTERN_SHAPES).slice(0, 2); const c = pickColour(rng);
    const items = [a, b, '?', b, a, b]; const missing = a;
    return { type: 'choice', story: null, prompt: 'Which one is missing?', choices: shuffle(rng, [`item:${missing}-${c}`, `item:${b}-${c}`]), answer: `item:${missing}-${c}`,
      explain: `${a}, ${b}, ${a}, ${b}. The missing one is ${a}.`, visual: { kind: 'pattern', items, colour: c }, explainVisual: null };
  },
  'p3-how-many': (rng) => {
    const n = randInt(rng, 1, 3);
    return { type: 'choice', story: null, prompt: 'How many?', choices: shuffle(rng, ['1', '2', '3']), answer: String(n),
      explain: `${countUp(n)}. There ${n === 1 ? 'is' : 'are'} ${n}.`, visual: { kind: 'dots', count: n }, explainVisual: null };
  },
  'p3-tap-group': (rng) => {
    const n = randInt(rng, 1, 3);
    return { type: 'choice', story: null, prompt: `Tap ${n}.`, choices: shuffle(rng, [1, 2, 3].map((c) => `dots:${c}`)), answer: `dots:${n}`,
      explain: `This is ${n}: ${countUp(n)}.`, visual: null, explainVisual: null };
  },
  'p3-tap-one': (rng) => {
    const other = randInt(rng, 2, 3);
    return { type: 'choice', story: null, prompt: 'Tap the one with just one.', choices: shuffle(rng, ['dots:1', `dots:${other}`]), answer: 'dots:1',
      explain: 'This has just one.', visual: null, explainVisual: null };
  },
  'p3-more': (rng) => {
    const [a, b] = shuffle(rng, [1, 2, 3]).slice(0, 2);
    return { type: 'choice', story: null, prompt: 'Which has more?', choices: shuffle(rng, [`dots:${a}`, `dots:${b}`]), answer: `dots:${Math.max(a, b)}`,
      explain: `${Math.max(a, b)} is more than ${Math.min(a, b)}.`, visual: null, explainVisual: null };
  },
});

// Counting questions. A choice written as 'dots:4' means "a picture of 4 dots";
// the screen draws it. The learner taps a picture or a big number, never types.
function countWords(n) { return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][n]; }
function countUp(n) { return Array.from({ length: n }, (_, i) => countWords(i + 1)).join(', '); }
function distinctCounts(rng, howMany, max, mustInclude) {
  const out = [mustInclude];
  let guard = 0;
  while (out.length < howMany && guard++ < 100) { const c = randInt(rng, 1, max); if (!out.includes(c)) out.push(c); }
  return out;
}
function makeCountingGenerators(prefix, max) {
  return {
    [`${prefix}-how-many`]: (rng) => {
      const n = randInt(rng, 1, max);
      const choices = shuffle(rng, distinctCounts(rng, Math.min(4, max), max, n).map(String));
      return { type: 'choice', story: null, prompt: 'How many?', choices, answer: String(n),
        explain: `${countUp(n)}. There are ${n}.`, visual: { kind: 'dots', count: n }, explainVisual: null };
    },
    [`${prefix}-tap-group`]: (rng) => {
      const n = randInt(rng, 1, max);
      const choices = shuffle(rng, distinctCounts(rng, 3, max, n).map((c) => `dots:${c}`));
      return { type: 'choice', story: null, prompt: `Tap the group with ${n}.`, choices, answer: `dots:${n}`,
        explain: `This group has ${n}: ${countUp(n)}.`, visual: null, explainVisual: null };
    },
    [`${prefix}-more`]: (rng) => {
      const [a, b] = distinctCounts(rng, 2, max, randInt(rng, 1, max));
      const big = Math.max(a, b);
      return { type: 'choice', story: null, prompt: 'Which group has more?', choices: shuffle(rng, [`dots:${a}`, `dots:${b}`]), answer: `dots:${big}`,
        explain: `${big} is more than ${Math.min(a, b)}.`, visual: null, explainVisual: null };
    },
    [`${prefix}-fewer`]: (rng) => {
      const [a, b] = distinctCounts(rng, 2, max, randInt(rng, 1, max));
      const small = Math.min(a, b);
      return { type: 'choice', story: null, prompt: 'Which group has fewer?', choices: shuffle(rng, [`dots:${a}`, `dots:${b}`]), answer: `dots:${small}`,
        explain: `${small} is fewer than ${Math.max(a, b)}.`, visual: null, explainVisual: null };
    },
    [`${prefix}-after`]: (rng) => {
      const n = randInt(rng, 1, max - 1);
      const choices = shuffle(rng, distinctCounts(rng, Math.min(4, max), max, n + 1).map(String));
      return { type: 'choice', story: null, prompt: `What comes after ${n}?`, choices, answer: String(n + 1),
        explain: `${countWords(n)}, then ${countWords(n + 1)}. After ${n} comes ${n + 1}.`, visual: { kind: 'dots', count: n }, explainVisual: null };
    },
    [`${prefix}-same`]: (rng) => {
      const n = randInt(rng, 1, max);
      const choices = shuffle(rng, distinctCounts(rng, 3, max, n).map((c) => `dots:${c}`));
      return { type: 'choice', story: null, prompt: 'Tap the group with the same number.', choices, answer: `dots:${n}`,
        explain: `Both groups have ${n}.`, visual: { kind: 'dots', count: n }, explainVisual: null };
    },
  };
}
Object.assign(GENERATORS, makeCountingGenerators('k5', 5), makeCountingGenerators('k10', 10));

// Fractions on a number line and built from unit fractions. Bottom numbers stay small.
const NL_BOTTOMS = [2, 3, 4, 6, 8];
Object.assign(GENERATORS, {
  'nl-which-fraction': (rng) => {
    const parts = pick(rng, NL_BOTTOMS); const mark = randInt(rng, 1, parts - 1);
    const wrongs = new Set(); let guard = 0;
    while (wrongs.size < 3 && guard++ < 30) { const w = pick(rng, [`${mark + 1}/${parts}`, `${Math.max(1, mark - 1)}/${parts}`, `${parts}/${mark}`, `${mark}/${parts + 1}`, `${mark}/${mark + parts}`]); if (w !== `${mark}/${parts}` && !/^0\//.test(w)) wrongs.add(w); }
    return { type: 'choice', story: null, prompt: 'What fraction is the dot on?', choices: shuffle(rng, [`${mark}/${parts}`, ...wrongs]), answer: `${mark}/${parts}`,
      explain: `The line is cut into ${parts} steps. The dot is ${mark} steps from 0. That is ${mark}/${parts}.`, visual: { kind: 'numberline', parts, mark }, explainVisual: null };
  },
  'nl-how-many-steps': (rng) => {
    const parts = pick(rng, NL_BOTTOMS);
    return { type: 'choice', story: `The line from 0 to 1 is cut into equal steps for fractions with ${parts} on the bottom.`, prompt: 'How many steps make one whole?', choices: shuffle(rng, [...new Set([String(parts), String(parts + 1), String(parts - 1), String(parts * 2)])]), answer: String(parts),
      explain: `The bottom number is the number of equal steps in a whole: ${parts}.`, visual: { kind: 'numberline', parts, mark: 0 }, explainVisual: null };
  },
  'nl-place': (rng) => {
    const parts = pick(rng, NL_BOTTOMS); const mark = randInt(rng, 1, parts - 1);
    return { type: 'number', story: `Find ${mark}/${parts} on a line cut into ${parts} steps.`, prompt: 'How many steps from 0 is it?', choices: [], answer: String(mark),
      explain: `${mark}/${parts} is ${mark} steps of ${parts}.`, visual: { kind: 'numberline', parts, mark }, explainVisual: null };
  },
  'nl-halfway': (rng) => {
    const parts = pick(rng, [4, 6, 8]);
    return { type: 'choice', story: null, prompt: `On a line cut into ${parts} steps, which fraction is halfway to 1?`, choices: shuffle(rng, [...new Set([`${parts / 2}/${parts}`, `${parts / 2 + 1}/${parts}`, `1/${parts}`, `${parts - 1}/${parts}`])]), answer: `${parts / 2}/${parts}`,
      explain: `Half of ${parts} steps is ${parts / 2}. Halfway is ${parts / 2}/${parts}, which is the same as 1/2.`, visual: { kind: 'numberline', parts, mark: parts / 2 }, explainVisual: null };
  },
  'nl-closer-to': (rng) => {
    const parts = pick(rng, [4, 6, 8]); let mark = randInt(rng, 1, parts - 1); if (mark * 2 === parts) mark += 1;
    const answer = mark * 2 < parts ? '0' : '1';
    return { type: 'choice', story: `Look at ${mark}/${parts} on the line.`, prompt: 'Is it closer to 0 or to 1?', choices: ['0', '1'], answer,
      explain: `${mark} of ${parts} steps is ${mark * 2 < parts ? 'less' : 'more'} than halfway, so it is closer to ${answer}.`, visual: { kind: 'numberline', parts, mark }, explainVisual: null };
  },
  'bf-how-many-units': (rng) => {
    const parts = pick(rng, NL_BOTTOMS); const top = randInt(rng, 2, parts - 1 > 1 ? parts - 1 : parts);
    return { type: 'number', story: `Think about ${top}/${parts}.`, prompt: `How many pieces of 1/${parts} is that?`, choices: [], answer: String(top),
      explain: `${top}/${parts} is ${Array.from({ length: top }, () => `1/${parts}`).join(' + ')}. That is ${top} pieces.`, visual: { kind: 'bar', parts, shaded: top }, explainVisual: null };
  },
  'bf-sum-of-units': (rng) => {
    const parts = pick(rng, NL_BOTTOMS); const top = randInt(rng, 2, Math.max(2, parts - 1));
    const right = Array.from({ length: top }, () => `1/${parts}`).join(' + ');
    const wrong1 = Array.from({ length: Math.max(1, top - 1) }, () => `1/${parts}`).join(' + ');
    const wrong2 = Array.from({ length: top }, () => `1/${parts + 1}`).join(' + ');
    return { type: 'choice', story: null, prompt: `Which sum makes ${top}/${parts}?`, choices: shuffle(rng, [right, wrong1, wrong2]), answer: right,
      explain: `${top} pieces of 1/${parts} make ${top}/${parts}.`, visual: { kind: 'bar', parts, shaded: top }, explainVisual: null };
  },
  'bf-split': (rng) => {
    const parts = pick(rng, [4, 6, 8]); const top = randInt(rng, 3, parts - 1); const a = randInt(rng, 1, top - 1); const b = top - a;
    const right = `${a}/${parts} + ${b}/${parts}`;
    return { type: 'choice', story: null, prompt: `Which pair adds up to ${top}/${parts}?`, choices: shuffle(rng, [right, `${a}/${parts} + ${b + 1}/${parts}`, `${a}/${parts + 2} + ${b}/${parts + 2}`]), answer: right,
      explain: `Same bottom, add the tops: ${a} + ${b} = ${top}. So ${right} = ${top}/${parts}.`, visual: { kind: 'bar', parts, shaded: top }, explainVisual: null };
  },
  'bf-share': (rng) => {
    const people = pick(rng, [2, 3, 4, 6]); const things = randInt(rng, 1, people - 1);
    const wrongs = [...new Set([`${people}/${things}`, `1/${things + people}`, `${things}/${people + 1}`, `${things + 1}/${people}`])].filter((w) => w !== `${things}/${people}`).slice(0, 3);
    return { type: 'choice', story: `${things} ${things === 1 ? 'pizza is' : 'pizzas are'} shared equally among ${people} people.`, prompt: 'How much does each person get?', choices: shuffle(rng, [`${things}/${people}`, ...wrongs]), answer: `${things}/${people}`,
      explain: `Each person gets ${things} of ${people} equal shares: ${things}/${people}.`, visual: null, explainVisual: null };
  },
  'bf-add-same-bottom': (rng) => {
    const parts = pick(rng, NL_BOTTOMS); const a = randInt(rng, 1, Math.max(1, parts - 2)); const b = randInt(rng, 1, Math.max(1, parts - a - 1));
    // Wrong answers must differ in VALUE, not only in spelling, or two choices could mean the same amount.
    const value = (f) => { const [n, d] = f.split('/').map(Number); return n / d; };
    const right = `${a + b}/${parts}`;
    const wrongs = [];
    for (const w of [`${a + b}/${parts * 2}`, `${a * b}/${parts}`, `${a + b}/${parts + 1}`, `${a + b + 1}/${parts}`]) {
      if (Math.abs(value(w) - value(right)) > 1e-9 && wrongs.every((x) => Math.abs(value(x) - value(w)) > 1e-9)) wrongs.push(w);
    }
    return { type: 'choice', story: null, prompt: `${a}/${parts} + ${b}/${parts} = ?`, choices: shuffle(rng, [right, ...wrongs.slice(0, 3)]), answer: right,
      explain: `Same bottom, so add the tops: ${a} + ${b} = ${a + b}. The answer is ${a + b}/${parts}.`, visual: { kind: 'bar', parts, shaded: a + b }, explainVisual: null };
  },
});

// Grade 3 reading. Passages are built from parts so the checker can re-derive the answers.
const PASSAGES = [
  { topic: 'bees', main: 'Bees are important because they help plants grow.', details: ['They carry pollen from flower to flower.', 'Many fruits could not grow without them.', 'A single hive can visit thousands of flowers in a day.'], title: 'Why bees matter', notIn: 'Bees live for a hundred years.' },
  { topic: 'the moon', main: 'The moon looks different on different nights because of where the sun shines on it.', details: ['Sometimes we see a thin sliver.', 'Sometimes we see a full circle.', 'It takes about a month to go through all its shapes.'], title: 'The changing moon', notIn: 'The moon is made of ice.' },
  { topic: 'recycling', main: 'Recycling turns old things into new things instead of throwing them away.', details: ['Old paper can become new paper.', 'Cans can be melted and used again.', 'Less trash ends up in the ground.'], title: 'A second life for trash', notIn: 'Recycling was invented last year.' },
  { topic: 'octopuses', main: 'Octopuses are clever animals that can solve problems.', details: ['They can open jars to get food.', 'They squeeze through tiny gaps.', 'Some change color to hide.'], title: 'A clever creature', notIn: 'Octopuses have four arms.' },
  { topic: 'sleep', main: 'Sleep helps your body and brain get ready for the next day.', details: ['Your muscles rest and repair.', 'Your brain sorts what you learned.', 'Children need more sleep than adults.'], title: 'Why we sleep', notIn: 'Sleeping makes you shorter.' },
];
const PREFIXES = [['un', 'not', 'happy', 'unhappy'], ['un', 'not', 'kind', 'unkind'], ['re', 'again', 'read', 'reread'], ['re', 'again', 'build', 'rebuild'], ['pre', 'before', 'heat', 'preheat'], ['dis', 'the opposite of', 'agree', 'disagree'], ['mis', 'wrongly', 'spell', 'misspell']];
const SUFFIXES = [['ful', 'full of', 'hope', 'hopeful'], ['ful', 'full of', 'care', 'careful'], ['less', 'without', 'hope', 'hopeless'], ['less', 'without', 'fear', 'fearless'], ['er', 'a person who', 'teach', 'teacher'], ['er', 'a person who', 'paint', 'painter'], ['ly', 'in that way', 'quick', 'quickly']];
const FACTS = ['Spiders have eight legs.', 'Water freezes at zero degrees.', 'The heart pumps blood.', 'A week has seven days.', 'Plants need light to grow.', 'Bats can fly.', 'Ice is frozen water.', 'The sun is a star.'];
const OPINIONS = ['Spiders are scary.', 'Winter is the best season.', 'Vegetables taste awful.', 'Blue is the prettiest color.', 'Math is boring.', 'Cats are better than dogs.', 'Rainy days are the worst.', 'Football is the most fun sport.'];
const OPINION_CLUES = ['best', 'worst', 'awful', 'prettiest', 'boring', 'better', 'fun', 'scary'];
const CAUSES = [
  { cause: 'it rained all morning', effect: 'the game was canceled' }, { cause: 'the alarm did not ring', effect: 'Sam was late for school' },
  { cause: 'the plant got no water', effect: 'its leaves turned brown' }, { cause: 'Mia practiced every day', effect: 'she won the race' },
  { cause: 'the bridge was closed', effect: 'the bus took a longer way' }, { cause: 'the ice cream sat in the sun', effect: 'it melted' },
];
const SEQUENCES = [
  ['crack the eggs', 'mix them with milk', 'pour them into the pan', 'eat the eggs'],
  ['plant the seed', 'water it every day', 'watch the sprout appear', 'pick the flower'],
  ['put on your socks', 'put on your shoes', 'tie the laces', 'walk out the door'],
  ['pick a book', 'read the first page', 'read to the end', 'tell a friend about it'],
];
const passageText = (p) => `${p.main} ${p.details.join(' ')}`;
Object.assign(GENERATORS, {
  'r3-main-idea': (rng) => {
    const p = pick(rng, PASSAGES);
    return { type: 'choice', story: passageText(p), prompt: 'What is this paragraph mostly about?', choices: shuffle(rng, [p.main, pick(rng, p.details), pick(rng, PASSAGES.filter((x) => x !== p)).main]), answer: p.main,
      explain: `Every detail supports one idea: ${p.main}`, visual: null, explainVisual: null };
  },
  'r3-detail': (rng) => {
    const p = pick(rng, PASSAGES); const d = pick(rng, p.details);
    return { type: 'choice', story: passageText(p), prompt: 'Which sentence is a detail that supports the main idea?', choices: shuffle(rng, [d, p.main, p.notIn]), answer: d,
      explain: `${d} That is one of the details. The main idea is the bigger point they support.`, visual: null, explainVisual: null };
  },
  'r3-not-in-passage': (rng) => {
    const p = pick(rng, PASSAGES);
    return { type: 'choice', story: passageText(p), prompt: 'Which of these is NOT said in the paragraph?', choices: shuffle(rng, [p.notIn, pick(rng, p.details), p.main]), answer: p.notIn,
      explain: `The paragraph never says that. Check the words, not your memory.`, visual: null, explainVisual: null };
  },
  'r3-best-title': (rng) => {
    const p = pick(rng, PASSAGES); const others = shuffle(rng, PASSAGES.filter((x) => x !== p)).slice(0, 2).map((x) => x.title);
    return { type: 'choice', story: passageText(p), prompt: 'Which title fits best?', choices: shuffle(rng, [p.title, ...others]), answer: p.title,
      explain: `The paragraph is about ${p.topic}, so the best title is "${p.title}".`, visual: null, explainVisual: null };
  },
  'r3-prefix-meaning': (rng) => {
    const [pre, meaning, base, word] = pick(rng, PREFIXES);
    const others = shuffle(rng, [...new Set(PREFIXES.map((x) => x[1]))].filter((m) => m !== meaning)).slice(0, 2);
    return { type: 'choice', story: `${word} is ${pre} + ${base}.`, prompt: `What does the prefix ${pre} mean?`, choices: shuffle(rng, [meaning, ...others]), answer: meaning,
      explain: `${pre} means ${meaning}. So ${word} means ${meaning} ${base}.`, visual: { kind: 'letters', text: `${pre} + ${base}` }, explainVisual: null };
  },
  'r3-suffix-meaning': (rng) => {
    const [suf, meaning, base, word] = pick(rng, SUFFIXES);
    const others = shuffle(rng, [...new Set(SUFFIXES.map((x) => x[1]))].filter((m) => m !== meaning)).slice(0, 2);
    return { type: 'choice', story: `${word} is ${base} + ${suf}.`, prompt: `What does the suffix ${suf} mean?`, choices: shuffle(rng, [meaning, ...others]), answer: meaning,
      explain: `${suf} means ${meaning}. So ${word} means ${meaning} ${base}.`, visual: { kind: 'letters', text: `${base} + ${suf}` }, explainVisual: null };
  },
  'r3-build-word': (rng) => {
    const usePrefix = randInt(rng, 0, 1) === 1;
    const [affix, meaning, base, word] = pick(rng, usePrefix ? PREFIXES : SUFFIXES);
    const others = shuffle(rng, (usePrefix ? PREFIXES : SUFFIXES).filter((x) => x[3] !== word)).slice(0, 2).map((x) => x[3]);
    return { type: 'choice', story: `Add ${affix} to ${base}.`, prompt: 'Which word do you get?', choices: shuffle(rng, [word, ...others]), answer: word,
      explain: `${base} with ${affix} is ${word}: ${meaning} ${base}.`, visual: { kind: 'letters', text: base }, explainVisual: null };
  },
  'r3-which-affix': (rng) => {
    const usePrefix = randInt(rng, 0, 1) === 1;
    const [affix, meaning, base, word] = pick(rng, usePrefix ? PREFIXES : SUFFIXES);
    const pool = [...new Set([...PREFIXES, ...SUFFIXES].map((x) => x[0]))].filter((a) => a !== affix);
    return { type: 'choice', story: `Look at ${word}.`, prompt: `Which part is the ${usePrefix ? 'prefix' : 'suffix'}?`, choices: shuffle(rng, [affix, ...shuffle(rng, pool).slice(0, 2)]), answer: affix,
      explain: `${word} is ${usePrefix ? affix + ' + ' + base : base + ' + ' + affix}. The ${usePrefix ? 'prefix' : 'suffix'} is ${affix}.`, visual: { kind: 'letters', text: word }, explainVisual: null };
  },
  'r3-take-affix': (rng) => {
    const usePrefix = randInt(rng, 0, 1) === 1;
    const [affix, meaning, base, word] = pick(rng, usePrefix ? PREFIXES : SUFFIXES);
    const others = [...new Set(shuffle(rng, (usePrefix ? PREFIXES : SUFFIXES).filter((x) => x[2] !== base)).map((x) => x[2]))].slice(0, 2);
    return { type: 'choice', story: `Take ${affix} off ${word}.`, prompt: 'Which word is left?', choices: shuffle(rng, [base, ...others]), answer: base,
      explain: `${word} without ${affix} is ${base}.`, visual: { kind: 'letters', text: word }, explainVisual: null };
  },
  'r3-fact-opinion': (rng) => {
    const isFact = randInt(rng, 0, 1) === 1; const sentence = pick(rng, isFact ? FACTS : OPINIONS);
    return { type: 'choice', story: sentence, prompt: 'Is this a fact or an opinion?', choices: ['Fact', 'Opinion'], answer: isFact ? 'Fact' : 'Opinion',
      explain: isFact ? 'It can be checked, so it is a fact.' : 'It is what someone thinks, so it is an opinion.', visual: null, explainVisual: null };
  },
  'r3-which-is-fact': (rng) => {
    const f = pick(rng, FACTS); const others = shuffle(rng, OPINIONS).slice(0, 2);
    return { type: 'choice', story: null, prompt: 'Which sentence is a fact?', choices: shuffle(rng, [f, ...others]), answer: f,
      explain: `${f} That can be checked. The others are what someone thinks.`, visual: null, explainVisual: null };
  },
  'r3-which-is-opinion': (rng) => {
    const o = pick(rng, OPINIONS); const others = shuffle(rng, FACTS).slice(0, 2);
    return { type: 'choice', story: null, prompt: 'Which sentence is an opinion?', choices: shuffle(rng, [o, ...others]), answer: o,
      explain: `${o} That is what someone thinks. The others can be checked.`, visual: null, explainVisual: null };
  },
  'r3-clue-word': (rng) => {
    const o = pick(rng, OPINIONS); const clue = OPINION_CLUES.find((c) => o.toLowerCase().includes(c));
    const words = o.replace(/\./, '').split(' ').filter((w) => !clue.includes(w.toLowerCase()) && w.length > 2);
    return { type: 'choice', story: o, prompt: 'Which word shows this is an opinion?', choices: shuffle(rng, [clue, ...shuffle(rng, words).slice(0, 2).map((w) => w.toLowerCase())]), answer: clue,
      explain: `${clue} is a judging word. It tells you someone is giving a view, not a fact.`, visual: null, explainVisual: null };
  },
  'r3-cause': (rng) => {
    const c = pick(rng, CAUSES); const others = shuffle(rng, CAUSES.filter((x) => x !== c)).slice(0, 2).map((x) => x.cause);
    return { type: 'choice', story: `${c.cause[0].toUpperCase() + c.cause.slice(1)}, so ${c.effect}.`, prompt: 'What was the cause?', choices: shuffle(rng, [c.cause, ...others]), answer: c.cause,
      explain: `The cause is why it happened: ${c.cause}.`, visual: null, explainVisual: null };
  },
  'r3-effect': (rng) => {
    const c = pick(rng, CAUSES); const others = shuffle(rng, CAUSES.filter((x) => x !== c)).slice(0, 2).map((x) => x.effect);
    return { type: 'choice', story: `Because ${c.cause}, ${c.effect}.`, prompt: 'What was the effect?', choices: shuffle(rng, [c.effect, ...others]), answer: c.effect,
      explain: `The effect is what happened because of it: ${c.effect}.`, visual: null, explainVisual: null };
  },
  'r3-order': (rng) => {
    const seq = pick(rng, SEQUENCES); const i = randInt(rng, 1, 3);
    return { type: 'choice', story: `First, ${seq[0]}. Next, ${seq[1]}. Then, ${seq[2]}. Finally, ${seq[3]}.`, prompt: `What comes right after you ${seq[i - 1]}?`, choices: shuffle(rng, [seq[i], ...seq.filter((_, k) => k !== i && k !== i - 1).slice(0, 2)]), answer: seq[i],
      explain: `After you ${seq[i - 1]}, you ${seq[i]}.`, visual: null, explainVisual: null };
  },
  'r3-signal-word': (rng) => {
    const causeWord = randInt(rng, 0, 1) === 1;
    const word = causeWord ? pick(rng, ['because', 'so', 'since', 'as a result']) : pick(rng, ['first', 'next', 'then', 'finally']);
    return { type: 'choice', story: `Look at the word: ${word}.`, prompt: 'What does it point to?', choices: ['A cause or effect', 'The order of events'], answer: causeWord ? 'A cause or effect' : 'The order of events',
      explain: causeWord ? `${word} links a cause to its effect.` : `${word} tells you when something happened in the order.`, visual: { kind: 'letters', text: word }, explainVisual: null };
  },
  'r3-what-next': (rng) => {
    const seq = pick(rng, SEQUENCES);
    return { type: 'choice', story: `First, ${seq[0]}. Next, ${seq[1]}. Then, ${seq[2]}.`, prompt: 'What most likely comes last?', choices: shuffle(rng, [seq[3], seq[0], pick(rng, SEQUENCES.filter((x) => x !== seq))[3]]), answer: seq[3],
      explain: `Finally, ${seq[3]}. That finishes what the steps were building to.`, visual: null, explainVisual: null };
  },
});

// Grade 2 reading. Word lists carry the facts the checker needs.
const VOWEL_TEAMS = [
  ['rain', 'ai', 'A'], ['pail', 'ai', 'A'], ['wait', 'ai', 'A'], ['boat', 'oa', 'O'], ['road', 'oa', 'O'], ['soap', 'oa', 'O'],
  ['feet', 'ee', 'E'], ['seed', 'ee', 'E'], ['keep', 'ee', 'E'], ['meat', 'ea', 'E'], ['leaf', 'ea', 'E'], ['bead', 'ea', 'E'],
];
const SPLIT_WORDS = [['rabbit', 'rab', 'bit'], ['basket', 'bas', 'ket'], ['napkin', 'nap', 'kin'], ['picnic', 'pic', 'nic'], ['magnet', 'mag', 'net'], ['sunset', 'sun', 'set'], ['muffin', 'muf', 'fin'], ['cactus', 'cac', 'tus']];
const COMPOUNDS = [['sunset', 'sun', 'set'], ['bedtime', 'bed', 'time'], ['pancake', 'pan', 'cake'], ['raincoat', 'rain', 'coat'], ['football', 'foot', 'ball'], ['cupcake', 'cup', 'cake'], ['doghouse', 'dog', 'house'], ['inside', 'in', 'side']];
const CONTEXT_WORDS = [
  { word: 'famished', meaning: 'very hungry', sentence: 'The dog was famished, so it ate three bowls of food.', wrong: ['very sleepy', 'very fast'] },
  { word: 'enormous', meaning: 'very big', sentence: 'The enormous truck could not fit under the bridge.', wrong: ['very small', 'very slow'] },
  { word: 'timid', meaning: 'shy and easily scared', sentence: 'The timid kitten hid under the bed when the doorbell rang.', wrong: ['loud and brave', 'tired and hungry'] },
  { word: 'gleaming', meaning: 'shining brightly', sentence: 'After the wash, the gleaming car sparkled in the sun.', wrong: ['dirty and dull', 'broken down'] },
  { word: 'drowsy', meaning: 'sleepy', sentence: 'After the long walk, the drowsy boy yawned and lay down.', wrong: ['excited', 'angry'] },
  { word: 'ancient', meaning: 'very old', sentence: 'The ancient tree had been there since before the town was built.', wrong: ['brand new', 'very tall'] },
  { word: 'vanished', meaning: 'disappeared', sentence: 'The rabbit vanished into its hole and could not be seen anywhere.', wrong: ['grew bigger', 'fell asleep'] },
  { word: 'fragile', meaning: 'easily broken', sentence: 'Carry the fragile vase with both hands so it does not break.', wrong: ['very heavy', 'very cheap'] },
];
const OPPOSITES = [['big', 'small'], ['hot', 'cold'], ['fast', 'slow'], ['happy', 'sad'], ['wet', 'dry'], ['loud', 'quiet'], ['full', 'empty'], ['old', 'new']];
const STORY2 = [
  { who: 'Mia', animal: 'dog', place: 'the park', reason: 'it was raining', felt: 'happy', first: 'put on her coat', last: 'came home wet' },
  { who: 'Ben', animal: 'cat', place: 'the shop', reason: 'they needed bread', felt: 'tired', first: 'found his shoes', last: 'ate a sandwich' },
  { who: 'Zoe', animal: 'hen', place: 'the farm', reason: 'the hen was lost', felt: 'worried', first: 'looked in the barn', last: 'found the hen' },
  { who: 'Max', animal: 'fox', place: 'the woods', reason: 'he wanted to draw it', felt: 'excited', first: 'packed his pencils', last: 'showed his drawing' },
];
Object.assign(GENERATORS, {
  'r2-team-sound': (rng) => {
    const [w, team, sound] = pick(rng, VOWEL_TEAMS);
    return { type: 'choice', story: null, prompt: `Which vowel sound does ${w} have?`, choices: shuffle(rng, ['A', 'E', 'O']), answer: sound,
      explain: `${w} has ${team}. The first vowel says its name: ${sound}.`, visual: { kind: 'letters', text: w }, explainVisual: null };
  },
  'r2-which-team': (rng) => {
    const [w, team] = pick(rng, VOWEL_TEAMS);
    return { type: 'choice', story: null, prompt: `Which two vowels are in ${w}?`, choices: shuffle(rng, ['ai', 'oa', 'ee', 'ea']), answer: team,
      explain: `${w} has the vowel team ${team}.`, visual: { kind: 'letters', text: w }, explainVisual: null };
  },
  'r2-team-word': (rng) => {
    const sound = pick(rng, ['A', 'E', 'O']);
    const right = pick(rng, VOWEL_TEAMS.filter((x) => x[2] === sound))[0];
    const others = shuffle(rng, VOWEL_TEAMS.filter((x) => x[2] !== sound)).slice(0, 2).map((x) => x[0]);
    return { type: 'choice', story: null, prompt: `Which word has the long ${sound} sound?`, choices: shuffle(rng, [right, ...others]), answer: right,
      explain: `${right} says ${sound}.`, visual: null, explainVisual: null };
  },
  'r2-same-team': (rng) => {
    const [w, team] = pick(rng, VOWEL_TEAMS);
    const twin = pick(rng, VOWEL_TEAMS.filter((x) => x[1] === team && x[0] !== w))[0];
    const other = pick(rng, VOWEL_TEAMS.filter((x) => x[1] !== team))[0];
    return { type: 'choice', story: null, prompt: `Which word has the same vowel team as ${w}?`, choices: shuffle(rng, [twin, other]), answer: twin,
      explain: `${w} and ${twin} both have ${team}.`, visual: { kind: 'letters', text: w }, explainVisual: null };
  },
  'r2-odd-team': (rng) => {
    const team = pick(rng, ['ai', 'oa', 'ee', 'ea']);
    const [a, b] = shuffle(rng, VOWEL_TEAMS.filter((x) => x[1] === team)).slice(0, 2).map((x) => x[0]);
    const odd = pick(rng, VOWEL_TEAMS.filter((x) => x[1] !== team))[0];
    return { type: 'choice', story: `Two of these have ${team}.`, prompt: 'Which one does not?', choices: shuffle(rng, [a, b, odd]), answer: odd,
      explain: `${a} and ${b} have ${team}. ${odd} does not.`, visual: null, explainVisual: null };
  },
  'r2-split-word': (rng) => {
    const [w, a, b] = pick(rng, SPLIT_WORDS);
    const right = `${a} ${b}`;
    const wrong1 = `${w.slice(0, 2)} ${w.slice(2)}`; const wrong2 = `${w.slice(0, 4)} ${w.slice(4)}`;
    return { type: 'choice', story: null, prompt: `Where does ${w} split into two parts?`, choices: shuffle(rng, [...new Set([right, wrong1, wrong2])]), answer: right,
      explain: `${w} splits between the two middle letters: ${right}.`, visual: { kind: 'letters', text: w }, explainVisual: null };
  },
  'r2-join-parts': (rng) => {
    const [w, a, b] = pick(rng, SPLIT_WORDS);
    const others = shuffle(rng, SPLIT_WORDS.filter((x) => x[0] !== w)).slice(0, 2).map((x) => x[0]);
    return { type: 'choice', story: `${a} and ${b}.`, prompt: 'Which word do the parts make?', choices: shuffle(rng, [w, ...others]), answer: w,
      explain: `${a} and ${b} together make ${w}.`, visual: { kind: 'letters', text: `${a} ${b}` }, explainVisual: null };
  },
  'r2-compound': (rng) => {
    const [w, a, b] = pick(rng, COMPOUNDS);
    const others = shuffle(rng, COMPOUNDS.filter((x) => x[0] !== w)).slice(0, 2).map((x) => x[0]);
    return { type: 'choice', story: `${a} and ${b}.`, prompt: 'Which compound word do they make?', choices: shuffle(rng, [w, ...others]), answer: w,
      explain: `${a} and ${b} stuck together make ${w}.`, visual: { kind: 'letters', text: `${a} + ${b}` }, explainVisual: null };
  },
  'r2-compound-parts': (rng) => {
    const [w, a, b] = pick(rng, COMPOUNDS);
    const right = `${a} and ${b}`;
    // The wrong pairs must not rebuild the right one when two compounds share a part (cupcake, pancake).
    const other = pick(rng, COMPOUNDS.filter((x) => x[0] !== w && x[1] !== a && x[2] !== b));
    return { type: 'choice', story: null, prompt: `Which two words make ${w}?`, choices: shuffle(rng, [right, `${a} and ${other[2]}`, `${other[1]} and ${b}`]), answer: right,
      explain: `${w} is ${right}.`, visual: { kind: 'letters', text: w }, explainVisual: null };
  },
  'r2-count-parts': (rng) => {
    const two = pick(rng, SPLIT_WORDS)[0]; const one = pick(rng, CVC_WORDS);
    const three = pick(rng, ['banana', 'elephant', 'umbrella', 'butterfly']);
    const chosen = pick(rng, [[one, 1], [two, 2], [three, 3]]);
    return { type: 'choice', story: null, prompt: `How many parts does ${chosen[0]} have?`, choices: ['1', '2', '3'], answer: String(chosen[1]),
      explain: `${chosen[0]} has ${chosen[1]} ${chosen[1] === 1 ? 'part' : 'parts'}.`, visual: { kind: 'letters', text: chosen[0] }, explainVisual: null };
  },
  'r2-why': (rng) => {
    const st = pick(rng, STORY2);
    const others = shuffle(rng, STORY2.filter((x) => x !== st)).slice(0, 2).map((x) => x.reason);
    return { type: 'choice', story: `${st.who} ${st.first}. Then ${st.who} went to ${st.place} because ${st.reason}. At the end ${st.who} ${st.last}.`, prompt: `Why did ${st.who} go to ${st.place}?`, choices: shuffle(rng, [`Because ${st.reason}`, ...others.map((r) => `Because ${r}`)]), answer: `Because ${st.reason}`,
      explain: `The story says ${st.who} went because ${st.reason}.`, visual: null, explainVisual: null };
  },
  'r2-first': (rng) => {
    const st = pick(rng, STORY2);
    return { type: 'choice', story: `${st.who} ${st.first}. Then ${st.who} went to ${st.place} because ${st.reason}. At the end ${st.who} ${st.last}.`, prompt: 'What happened first?', choices: shuffle(rng, [`${st.who} ${st.first}`, `${st.who} went to ${st.place}`, `${st.who} ${st.last}`]), answer: `${st.who} ${st.first}`,
      explain: `The story starts with it: ${st.who} ${st.first}.`, visual: null, explainVisual: null };
  },
  'r2-last': (rng) => {
    const st = pick(rng, STORY2);
    return { type: 'choice', story: `${st.who} ${st.first}. Then ${st.who} went to ${st.place} because ${st.reason}. At the end ${st.who} ${st.last}.`, prompt: 'What happened last?', choices: shuffle(rng, [`${st.who} ${st.first}`, `${st.who} went to ${st.place}`, `${st.who} ${st.last}`]), answer: `${st.who} ${st.last}`,
      explain: `The story ends with it: ${st.who} ${st.last}.`, visual: null, explainVisual: null };
  },
  'r2-who-did': (rng) => {
    const st = pick(rng, STORY2);
    const others = shuffle(rng, STORY2.filter((x) => x !== st)).slice(0, 2).map((x) => x.who);
    return { type: 'choice', story: `${st.who} ${st.first}. Then ${st.who} went to ${st.place} because ${st.reason}. At the end ${st.who} ${st.last}.`, prompt: `Who ${st.last}?`, choices: shuffle(rng, [st.who, ...others]), answer: st.who,
      explain: `It was ${st.who}.`, visual: null, explainVisual: null };
  },
  'r2-how-felt': (rng) => {
    const st = pick(rng, STORY2);
    const others = shuffle(rng, STORY2.filter((x) => x !== st)).slice(0, 2).map((x) => x.felt);
    return { type: 'choice', story: `${st.who} felt ${st.felt} and went to ${st.place}. At the end ${st.who} ${st.last}.`, prompt: `How did ${st.who} feel?`, choices: shuffle(rng, [st.felt, ...others]), answer: st.felt,
      explain: `The story says ${st.who} felt ${st.felt}.`, visual: null, explainVisual: null };
  },
  'r2-context': (rng) => {
    const it = pick(rng, CONTEXT_WORDS);
    return { type: 'choice', story: it.sentence, prompt: `What does ${it.word} mean?`, choices: shuffle(rng, [it.meaning, ...it.wrong]), answer: it.meaning,
      explain: `The rest of the sentence gives it away: ${it.word} means ${it.meaning}.`, visual: { kind: 'letters', text: it.word }, explainVisual: null };
  },
  'r2-opposite': (rng) => {
    const [a, b] = pick(rng, OPPOSITES); const ask = randInt(rng, 0, 1) === 1 ? [a, b] : [b, a];
    const others = shuffle(rng, OPPOSITES.filter((x) => x[0] !== a)).slice(0, 2).map((x) => x[randInt(rng, 0, 1)]);
    return { type: 'choice', story: null, prompt: `What is the opposite of ${ask[0]}?`, choices: shuffle(rng, [ask[1], ...others]), answer: ask[1],
      explain: `The opposite of ${ask[0]} is ${ask[1]}.`, visual: { kind: 'letters', text: ask[0] }, explainVisual: null };
  },
  'r2-best-fit': (rng) => {
    const it = pick(rng, CONTEXT_WORDS);
    const blank = it.sentence.replace(it.word, '____');
    const others = shuffle(rng, CONTEXT_WORDS.filter((x) => x.word !== it.word)).slice(0, 2).map((x) => x.word);
    return { type: 'choice', story: blank, prompt: 'Which word fits the blank?', choices: shuffle(rng, [it.word, ...others]), answer: it.word,
      explain: `${it.word} means ${it.meaning}, which is what the sentence needs.`, visual: null, explainVisual: null };
  },
});

// Grade 1 reading. Word lists carry the facts the checker needs.
const PIC_WORDS = [
  { word: 'box', visual: { kind: 'solid', name: 'cube' }, key: 'solid:cube' }, { word: 'can', visual: { kind: 'solid', name: 'cylinder' }, key: 'solid:cylinder' },
  { word: 'ball', visual: { kind: 'solid', name: 'sphere' }, key: 'solid:sphere' }, { word: 'cone', visual: { kind: 'solid', name: 'cone' }, key: 'solid:cone' },
];
const COLOUR_WORDS = ['red', 'blue', 'yellow', 'green'];
const DIGRAPH_WORDS = [
  ['ship', 'sh', 'start'], ['shop', 'sh', 'start'], ['fish', 'sh', 'end'], ['wish', 'sh', 'end'], ['shell', 'sh', 'start'],
  ['chip', 'ch', 'start'], ['chat', 'ch', 'start'], ['much', 'ch', 'end'], ['rich', 'ch', 'end'], ['chin', 'ch', 'start'],
  ['thin', 'th', 'start'], ['bath', 'th', 'end'], ['this', 'th', 'start'], ['moth', 'th', 'end'], ['that', 'th', 'start'],
];
const SILENT_E = [['cap', 'cape'], ['kit', 'kite'], ['hop', 'hope'], ['tap', 'tape'], ['pin', 'pine'], ['not', 'note'], ['cub', 'cube'], ['rob', 'robe'], ['mad', 'made'], ['rid', 'ride']];
const STORY_NAMES = ['Sam', 'Ben', 'Mia', 'Zoe', 'Max', 'Ava'];
const STORY_ANIMALS = ['dog', 'cat', 'hen', 'pig', 'fox'];
const STORY_PLACES = ['the box', 'the bed', 'the hill', 'the shop', 'the bus'];
Object.assign(GENERATORS, {
  'r1-word-picture': (rng) => {
    const it = pick(rng, PIC_WORDS); const others = shuffle(rng, PIC_WORDS.filter((x) => x.word !== it.word)).slice(0, 2);
    return { type: 'choice', story: null, prompt: 'Read the word. Tap its picture.', choices: shuffle(rng, [it, ...others].map((x) => x.key)), answer: it.key,
      explain: `${it.word[0].toUpperCase() + it.word.slice(1)}. This is the ${it.word}.`, visual: { kind: 'letters', text: it.word }, explainVisual: null };
  },
  'r1-word-colour': (rng) => {
    const c = pick(rng, COLOUR_WORDS); const others = shuffle(rng, COLOUR_WORDS.filter((x) => x !== c)).slice(0, 2);
    return { type: 'choice', story: null, prompt: 'Read the word. Tap that color.', choices: shuffle(rng, [c, ...others].map((x) => `swatch:${x}`)), answer: `swatch:${c}`,
      explain: `The word says ${c}.`, visual: { kind: 'letters', text: c }, explainVisual: null };
  },
  'r1-word-number': (rng) => {
    const n = randInt(rng, 1, 6);
    return { type: 'choice', story: null, prompt: 'Read the word. Tap that many.', choices: shuffle(rng, distinctCounts(rng, 3, 6, n).map((c) => `dots:${c}`)), answer: `dots:${n}`,
      explain: `The word says ${NUMBER_WORDS[n - 1]}. That is ${n}.`, visual: { kind: 'letters', text: NUMBER_WORDS[n - 1] }, explainVisual: null };
  },
  'r1-which-word': (rng) => {
    const it = pick(rng, PIC_WORDS); const others = shuffle(rng, PIC_WORDS.filter((x) => x.word !== it.word)).slice(0, 2);
    return { type: 'choice', story: null, prompt: 'Which word goes with the picture?', choices: shuffle(rng, [it.word, ...others.map((x) => x.word)]), answer: it.word,
      explain: `This is a ${it.word}.`, visual: it.visual, explainVisual: null };
  },
  'r1-word-shape': (rng) => {
    const names = ['circle', 'square', 'triangle', 'rectangle']; const sh = pick(rng, names);
    return { type: 'choice', story: null, prompt: 'Read the word. Tap that shape.', choices: shuffle(rng, [sh, ...shuffle(rng, names.filter((x) => x !== sh)).slice(0, 2)].map((x) => `shape:${x}`)), answer: `shape:${sh}`,
      explain: `The word says ${sh}.`, visual: { kind: 'letters', text: sh }, explainVisual: null };
  },
  'r1-starts-with': (rng) => {
    const [w, pair] = pick(rng, DIGRAPH_WORDS.filter((x) => x[2] === 'start'));
    return { type: 'choice', story: null, prompt: 'Which two letters does it start with?', choices: shuffle(rng, ['sh', 'ch', 'th']), answer: pair,
      explain: `${w} starts with ${pair}.`, visual: { kind: 'letters', text: w }, explainVisual: null };
  },
  'r1-ends-with': (rng) => {
    const [w, pair] = pick(rng, DIGRAPH_WORDS.filter((x) => x[2] === 'end'));
    return { type: 'choice', story: null, prompt: 'Which two letters does it end with?', choices: shuffle(rng, ['sh', 'ch', 'th']), answer: pair,
      explain: `${w} ends with ${pair}.`, visual: { kind: 'letters', text: w }, explainVisual: null };
  },
  'r1-which-pair': (rng) => {
    const pair = pick(rng, ['sh', 'ch', 'th']);
    const right = pick(rng, DIGRAPH_WORDS.filter((x) => x[1] === pair))[0];
    const others = shuffle(rng, DIGRAPH_WORDS.filter((x) => x[1] !== pair)).slice(0, 2).map((x) => x[0]);
    return { type: 'choice', story: `Find ${pair}.`, prompt: `Which word has ${pair} in it?`, choices: shuffle(rng, [right, ...others]), answer: right,
      explain: `${right} has ${pair} in it.`, visual: { kind: 'letters', text: pair }, explainVisual: null };
  },
  'r1-same-pair': (rng) => {
    const [w, pair] = pick(rng, DIGRAPH_WORDS);
    const twin = pick(rng, DIGRAPH_WORDS.filter((x) => x[1] === pair && x[0] !== w))[0];
    const other = pick(rng, DIGRAPH_WORDS.filter((x) => x[1] !== pair))[0];
    return { type: 'choice', story: null, prompt: 'Which word has the same two-letter sound?', choices: shuffle(rng, [twin, other]), answer: twin,
      explain: `${w} and ${twin} both have ${pair}.`, visual: { kind: 'letters', text: w }, explainVisual: null };
  },
  'r1-odd-pair': (rng) => {
    const pair = pick(rng, ['sh', 'ch', 'th']);
    const [a, b] = shuffle(rng, DIGRAPH_WORDS.filter((x) => x[1] === pair)).slice(0, 2).map((x) => x[0]);
    const odd = pick(rng, DIGRAPH_WORDS.filter((x) => x[1] !== pair))[0];
    return { type: 'choice', story: `Two have ${pair}.`, prompt: 'Which one does not?', choices: shuffle(rng, [a, b, odd]), answer: odd,
      explain: `${a} and ${b} have ${pair}. ${odd} does not.`, visual: null, explainVisual: null };
  },
  'r1-add-e': (rng) => {
    const [short, long] = pick(rng, SILENT_E);
    const others = shuffle(rng, SILENT_E.filter((x) => x[1] !== long)).slice(0, 2).map((x) => x[1]);
    return { type: 'choice', story: `Add a silent e to ${short}.`, prompt: 'Which word do you get?', choices: shuffle(rng, [long, ...others]), answer: long,
      explain: `${short} with a silent e is ${long}.`, visual: { kind: 'letters', text: short }, explainVisual: null };
  },
  'r1-has-silent-e': (rng) => {
    const [short, long] = pick(rng, SILENT_E); const yes = randInt(rng, 0, 1) === 1;
    return { type: 'choice', story: null, prompt: 'Does this word end with a silent e?', choices: ['Yes', 'No'], answer: yes ? 'Yes' : 'No',
      explain: yes ? `${long} ends with a silent e. The vowel says its name.` : `${short} has no e on the end. The vowel is short.`, visual: { kind: 'letters', text: yes ? long : short }, explainVisual: null };
  },
  'r1-long-or-short': (rng) => {
    const [short, long] = pick(rng, SILENT_E); const isLong = randInt(rng, 0, 1) === 1;
    return { type: 'choice', story: null, prompt: 'Does the vowel say its name?', choices: ['Yes', 'No'], answer: isLong ? 'Yes' : 'No',
      explain: isLong ? `${long} has a silent e, so the vowel says its name.` : `${short} has no silent e, so the vowel is short.`, visual: { kind: 'letters', text: isLong ? long : short }, explainVisual: null };
  },
  'r1-pick-long': (rng) => {
    const [short, long] = pick(rng, SILENT_E);
    return { type: 'choice', story: null, prompt: 'Which word has a vowel that says its name?', choices: shuffle(rng, [long, short]), answer: long,
      explain: `${long} has the silent e. ${short} does not.`, visual: null, explainVisual: null };
  },
  'r1-take-e': (rng) => {
    const [short, long] = pick(rng, SILENT_E);
    const others = shuffle(rng, SILENT_E.filter((x) => x[0] !== short)).slice(0, 2).map((x) => x[0]);
    return { type: 'choice', story: `Take the silent e off ${long}.`, prompt: 'Which word is left?', choices: shuffle(rng, [short, ...others]), answer: short,
      explain: `${long} without the e is ${short}.`, visual: { kind: 'letters', text: long }, explainVisual: null };
  },
  'r1-sentence-picture': (rng) => {
    const sh = pick(rng, ['circle', 'square', 'triangle']); const c = pick(rng, COLOUR_WORDS);
    const wrongShape = pick(rng, ['circle', 'square', 'triangle'].filter((x) => x !== sh)); const wrongColour = pick(rng, COLOUR_WORDS.filter((x) => x !== c));
    return { type: 'choice', story: null, prompt: 'Read the sentence. Tap what it says.', choices: shuffle(rng, [`item:${sh}-${c}`, `item:${wrongShape}-${c}`, `item:${sh}-${wrongColour}`]), answer: `item:${sh}-${c}`,
      explain: `The ${sh} is ${c}. This is the ${c} ${sh}.`, visual: { kind: 'letters', text: `The ${sh} is ${c}.` }, explainVisual: null };
  },
  'r1-sentence-which': (rng) => {
    const sh = pick(rng, ['circle', 'square', 'triangle']); const c = pick(rng, COLOUR_WORDS);
    const right = `The ${sh} is ${c}.`;
    const w1 = `The ${pick(rng, ['circle', 'square', 'triangle'].filter((x) => x !== sh))} is ${c}.`; const w2 = `The ${sh} is ${pick(rng, COLOUR_WORDS.filter((x) => x !== c))}.`;
    return { type: 'choice', story: null, prompt: 'Which sentence matches the picture?', choices: shuffle(rng, [right, w1, w2]), answer: right,
      explain: `It is a ${c} ${sh}. ${right}`, visual: { kind: 'item', shape: sh, colour: c }, explainVisual: null };
  },
  'r1-sentence-colour': (rng) => {
    const sh = pick(rng, ['circle', 'square', 'triangle']); const c = pick(rng, COLOUR_WORDS);
    return { type: 'choice', story: null, prompt: 'Read the sentence. What color is it?', choices: shuffle(rng, [c, ...shuffle(rng, COLOUR_WORDS.filter((x) => x !== c)).slice(0, 2)]), answer: c,
      explain: `The sentence says the ${sh} is ${c}.`, visual: { kind: 'letters', text: `The ${sh} is ${c}.` }, explainVisual: null };
  },
  'r1-sentence-count': (rng) => {
    const n = randInt(rng, 1, 5); const thing = pick(rng, ['cats', 'hats', 'cups', 'pens', 'dogs']);
    return { type: 'choice', story: null, prompt: 'Read the sentence. How many?', choices: shuffle(rng, distinctCounts(rng, 3, 6, n).map(String)), answer: String(n),
      explain: `The sentence says ${NUMBER_WORDS[n - 1]} ${thing}. That is ${n}.`, visual: { kind: 'letters', text: `I see ${NUMBER_WORDS[n - 1]} ${thing}.` }, explainVisual: null };
  },
  'r1-sentence-yes-no': (rng) => {
    const sh = pick(rng, ['circle', 'square', 'triangle']); const c = pick(rng, COLOUR_WORDS); const yes = randInt(rng, 0, 1) === 1;
    const shownColour = yes ? c : pick(rng, COLOUR_WORDS.filter((x) => x !== c));
    return { type: 'choice', story: null, prompt: 'Read the sentence. Is it true about the picture?', choices: ['Yes', 'No'], answer: yes ? 'Yes' : 'No',
      explain: yes ? `The ${sh} is ${c}. True.` : `The sentence says ${c}, but the ${sh} is ${shownColour}. Not true.`, visual: { kind: 'item', shape: sh, colour: shownColour }, explainVisual: { kind: 'letters', text: `The ${sh} is ${c}.` } };
  },
  'r1-who': (rng) => {
    const name = pick(rng, STORY_NAMES); const animal = pick(rng, STORY_ANIMALS); const place = pick(rng, STORY_PLACES);
    const others = shuffle(rng, STORY_NAMES.filter((x) => x !== name)).slice(0, 2);
    return { type: 'choice', story: `${name} has a ${animal}. The ${animal} ran to ${place}.`, prompt: `Who has the ${animal}?`, choices: shuffle(rng, [name, ...others]), answer: name,
      explain: `The story says ${name} has a ${animal}.`, visual: null, explainVisual: null };
  },
  'r1-where': (rng) => {
    const name = pick(rng, STORY_NAMES); const animal = pick(rng, STORY_ANIMALS); const place = pick(rng, STORY_PLACES);
    const others = shuffle(rng, STORY_PLACES.filter((x) => x !== place)).slice(0, 2);
    return { type: 'choice', story: `${name} has a ${animal}. The ${animal} ran to ${place}.`, prompt: `Where did the ${animal} run?`, choices: shuffle(rng, [place, ...others]), answer: place,
      explain: `The story says the ${animal} ran to ${place}.`, visual: null, explainVisual: null };
  },
  'r1-what-colour': (rng) => {
    const name = pick(rng, STORY_NAMES); const c = pick(rng, COLOUR_WORDS); const thing = pick(rng, ['hat', 'cup', 'bag', 'box']);
    return { type: 'choice', story: `${name} got a ${c} ${thing}. ${name} put it on the bed.`, prompt: `What color is the ${thing}?`, choices: shuffle(rng, [c, ...shuffle(rng, COLOUR_WORDS.filter((x) => x !== c)).slice(0, 2)]), answer: c,
      explain: `The story says a ${c} ${thing}.`, visual: null, explainVisual: null };
  },
  'r1-how-many': (rng) => {
    const name = pick(rng, STORY_NAMES); const n = randInt(rng, 2, 6); const thing = pick(rng, ['cats', 'hats', 'cups', 'pens', 'dogs']);
    return { type: 'choice', story: `${name} has ${NUMBER_WORDS[n - 1]} ${thing}. ${name} likes them a lot.`, prompt: `How many ${thing} does ${name} have?`, choices: shuffle(rng, distinctCounts(rng, 3, 6, n).map(String)), answer: String(n),
      explain: `The story says ${NUMBER_WORDS[n - 1]} ${thing}. That is ${n}.`, visual: null, explainVisual: null };
  },
  'r1-true-false': (rng) => {
    const name = pick(rng, STORY_NAMES); const animal = pick(rng, STORY_ANIMALS); const place = pick(rng, STORY_PLACES); const yes = randInt(rng, 0, 1) === 1;
    const claimPlace = yes ? place : pick(rng, STORY_PLACES.filter((x) => x !== place));
    return { type: 'choice', story: `${name} has a ${animal}. The ${animal} ran to ${place}.`, prompt: `Is this true? The ${animal} ran to ${claimPlace}.`, choices: ['Yes', 'No'], answer: yes ? 'Yes' : 'No',
      explain: yes ? `Yes. The story says ${place}.` : `No. The story says ${place}, not ${claimPlace}.`, visual: null, explainVisual: null };
  },
});

// Grade 1 number sense. Spoken and tapped. Answers are arithmetic on the numbers shown.
const nearNumbers = (rng, right, lo, hi, n = 4) => {
  const out = [right]; let guard = 0;
  while (out.length < n && guard++ < 60) { const c = Math.max(lo, Math.min(hi, right + pick(rng, [-10, -2, -1, 1, 2, 10]))); if (!out.includes(c)) out.push(c); }
  return shuffle(rng, out.map(String));
};
Object.assign(GENERATORS, {
  'g1-ten-and': (rng) => {
    const ones = randInt(rng, 1, 9);
    return { type: 'choice', story: `Ten and ${ones} more.`, prompt: 'What number is that?', choices: nearNumbers(rng, 10 + ones, 10, 20), answer: String(10 + ones),
      explain: `Ten and ${ones} is ${10 + ones}.`, visual: { kind: 'tenframe', filled: 10 }, explainVisual: { kind: 'dots', count: ones } };
  },
  'g1-teen-split': (rng) => {
    const n = randInt(rng, 11, 19);
    return { type: 'choice', story: `${n} is ten and some more.`, prompt: 'How many more than ten?', choices: nearNumbers(rng, n - 10, 1, 9), answer: String(n - 10),
      explain: `${n} is ten and ${n - 10}.`, visual: { kind: 'tenframe', filled: 10 }, explainVisual: { kind: 'dots', count: n - 10 } };
  },
  'g1-teen-pic': (rng) => {
    const ones = randInt(rng, 1, 9);
    return { type: 'choice', story: 'A full ten, and this many more.', prompt: 'What number is it?', choices: nearNumbers(rng, 10 + ones, 10, 20), answer: String(10 + ones),
      explain: `Ten and ${ones} makes ${10 + ones}.`, visual: { kind: 'dots', count: ones }, explainVisual: null };
  },
  'g1-which-teen': (rng) => {
    const n = randInt(rng, 11, 19);
    return { type: 'choice', story: null, prompt: `Which shows ${n}?`, choices: shuffle(rng, [...new Set([`dots:${n - 10}`, `dots:${Math.max(1, n - 11)}`, `dots:${Math.min(9, n - 9)}`])]), answer: `dots:${n - 10}`,
      explain: `${n} is ten and ${n - 10}. The ten is the frame; these are the ${n - 10} more.`, visual: { kind: 'tenframe', filled: 10 }, explainVisual: null };
  },
  'g1-teen-after': (rng) => {
    const n = randInt(rng, 10, 18);
    return { type: 'choice', story: null, prompt: `What comes after ${n}?`, choices: nearNumbers(rng, n + 1, 10, 20), answer: String(n + 1),
      explain: `After ${n} comes ${n + 1}.`, visual: null, explainVisual: null };
  },
  'g1-add': (rng) => {
    const a = randInt(rng, 2, 10); const b = randInt(rng, 1, Math.min(10, 20 - a));
    return { type: 'choice', story: null, prompt: `${a} + ${b} = ?`, choices: nearNumbers(rng, a + b, 0, 20), answer: String(a + b),
      explain: `Start at ${Math.max(a, b)} and count on ${Math.min(a, b)}. ${a} + ${b} = ${a + b}.`, visual: { kind: 'dots', count: a }, explainVisual: null };
  },
  'g1-add-story': (rng) => {
    const a = randInt(rng, 3, 10); const b = randInt(rng, 2, Math.min(10, 20 - a)); const thing = kidThing(rng);
    return { type: 'choice', story: `${a} ${thing}. Then ${b} more.`, prompt: 'How many now?', choices: nearNumbers(rng, a + b, 0, 20), answer: String(a + b),
      explain: `${a} and ${b} more is ${a + b}.`, visual: { kind: 'dots', count: a }, explainVisual: null };
  },
  'g1-make-ten-add': (rng) => {
    const a = randInt(rng, 6, 9); const b = randInt(rng, 10 - a + 1, 9);
    const toTen = 10 - a; const rest = b - toTen;
    return { type: 'choice', story: `${a} + ${b}. First make ten: ${a} + ${toTen} = 10.`, prompt: `Then add the rest. What is ${a} + ${b}?`, choices: nearNumbers(rng, a + b, 10, 20), answer: String(a + b),
      explain: `${a} + ${toTen} = 10, then 10 + ${rest} = ${a + b}.`, visual: { kind: 'tenframe', filled: a }, explainVisual: null };
  },
  'g1-add-pic': (rng) => {
    const a = randInt(rng, 2, 8); const b = randInt(rng, 1, 10 - a);
    return { type: 'choice', story: `${a} and ${b} more.`, prompt: 'Tap the group that shows the total.', choices: shuffle(rng, distinctCounts(rng, 3, 10, a + b).map((c) => `dots:${c}`)), answer: `dots:${a + b}`,
      explain: `${a} + ${b} = ${a + b}.`, visual: { kind: 'dots', count: a }, explainVisual: null };
  },
  'g1-add-missing': (rng) => {
    const a = randInt(rng, 2, 9); const total = randInt(rng, a + 1, Math.min(20, a + 10));
    return { type: 'choice', story: null, prompt: `${a} + ? = ${total}`, choices: nearNumbers(rng, total - a, 1, 10), answer: String(total - a),
      explain: `Count on from ${a} to ${total}. That is ${total - a}.`, visual: { kind: 'dots', count: a }, explainVisual: null };
  },
  'g1-sub': (rng) => {
    const a = randInt(rng, 5, 20); const b = randInt(rng, 1, Math.min(10, a - 1));
    return { type: 'choice', story: null, prompt: `${a} − ${b} = ?`, choices: nearNumbers(rng, a - b, 0, 20), answer: String(a - b),
      explain: `Count back ${b} from ${a}. ${a} − ${b} = ${a - b}.`, visual: null, explainVisual: null };
  },
  'g1-sub-story': (rng) => {
    const a = randInt(rng, 6, 20); const b = randInt(rng, 2, Math.min(10, a - 1)); const thing = kidThing(rng);
    return { type: 'choice', story: `${a} ${thing}. ${b} go away.`, prompt: 'How many are left?', choices: nearNumbers(rng, a - b, 0, 20), answer: String(a - b),
      explain: `${a} take away ${b} leaves ${a - b}.`, visual: null, explainVisual: null };
  },
  'g1-sub-undo': (rng) => {
    const a = randInt(rng, 2, 10); const b = randInt(rng, 1, 10);
    return { type: 'choice', story: `${a} + ${b} = ${a + b}.`, prompt: `So what is ${a + b} − ${b}?`, choices: nearNumbers(rng, a, 0, 20), answer: String(a),
      explain: `Subtracting undoes adding. ${a + b} − ${b} = ${a}.`, visual: null, explainVisual: null };
  },
  'g1-sub-pic': (rng) => {
    const a = randInt(rng, 4, 10); const b = randInt(rng, 1, a - 1);
    return { type: 'choice', story: `${a}, then ${b} go away.`, prompt: 'Tap the group that shows what is left.', choices: shuffle(rng, distinctCounts(rng, 3, 10, a - b).map((c) => `dots:${c}`)), answer: `dots:${a - b}`,
      explain: `${a} − ${b} = ${a - b}.`, visual: { kind: 'dots', count: a }, explainVisual: null };
  },
  'g1-compare-diff': (rng) => {
    const [a, b] = distinctCounts(rng, 2, 10, randInt(rng, 2, 10));
    return { type: 'choice', story: `${Math.max(a, b)} and ${Math.min(a, b)}.`, prompt: 'How many more is the bigger one?', choices: nearNumbers(rng, Math.abs(a - b), 1, 9), answer: String(Math.abs(a - b)),
      explain: `${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(a - b)}. That is ${Math.abs(a - b)} more.`, visual: { kind: 'dots', count: Math.max(a, b) }, explainVisual: { kind: 'dots', count: Math.min(a, b) } };
  },
  'g1-tens-ones': (rng) => {
    const tens = randInt(rng, 2, 9); const ones = randInt(rng, 1, 9);
    return { type: 'choice', story: `${tens} tens and ${ones} ones.`, prompt: 'What number is that?', choices: nearNumbers(rng, tens * 10 + ones, 10, 99), answer: String(tens * 10 + ones),
      explain: `${tens} tens is ${tens * 10}. And ${ones} ones. ${tens * 10 + ones}.`, visual: { kind: 'tens', count: tens }, explainVisual: { kind: 'dots', count: ones } };
  },
  'g1-how-many-tens': (rng) => {
    const n = randInt(rng, 21, 99);
    return { type: 'choice', story: `Look at ${n}.`, prompt: 'How many tens?', choices: nearNumbers(rng, Math.floor(n / 10), 1, 9), answer: String(Math.floor(n / 10)),
      explain: `${n} has ${Math.floor(n / 10)} tens and ${n % 10} ones.`, visual: null, explainVisual: null };
  },
  'g1-how-many-ones': (rng) => {
    const n = randInt(rng, 21, 99);
    return { type: 'choice', story: `Look at ${n}.`, prompt: 'How many ones?', choices: nearNumbers(rng, n % 10, 0, 9), answer: String(n % 10),
      explain: `${n} has ${Math.floor(n / 10)} tens and ${n % 10} ones.`, visual: null, explainVisual: null };
  },
  'g1-build-number': (rng) => {
    const tens = randInt(rng, 1, 9); const ones = randInt(rng, 1, 9); const n = tens * 10 + ones;
    const right = `${tens} tens and ${ones} ones`;
    const wrong1 = `${ones} tens and ${tens} ones`; const wrong2 = `${tens} tens and ${ones === 9 ? 8 : ones + 1} ones`;
    return { type: 'choice', story: null, prompt: `Which makes ${n}?`, choices: shuffle(rng, [...new Set([right, wrong1, wrong2])]), answer: right,
      explain: `${n} is ${right}.`, visual: { kind: 'tens', count: tens }, explainVisual: null };
  },
  'g1-ten-more': (rng) => {
    const n = randInt(rng, 11, 89);
    return { type: 'choice', story: null, prompt: `What is ten more than ${n}?`, choices: nearNumbers(rng, n + 10, 10, 99), answer: String(n + 10),
      explain: `Ten more adds one ten. ${n} + 10 = ${n + 10}.`, visual: null, explainVisual: null };
  },
  'g1-bigger': (rng) => {
    const a = randInt(rng, 10, 99); let b = randInt(rng, 10, 99); if (b === a) b = a === 99 ? 98 : a + 1;
    return { type: 'choice', story: null, prompt: 'Which number is bigger?', choices: shuffle(rng, [String(a), String(b)]), answer: String(Math.max(a, b)),
      explain: Math.floor(a / 10) !== Math.floor(b / 10) ? `${Math.max(a, b)} has more tens.` : `Same tens. ${Math.max(a, b)} has more ones.`, visual: null, explainVisual: null };
  },
  'g1-smaller': (rng) => {
    const a = randInt(rng, 10, 99); let b = randInt(rng, 10, 99); if (b === a) b = a === 99 ? 98 : a + 1;
    return { type: 'choice', story: null, prompt: 'Which number is smaller?', choices: shuffle(rng, [String(a), String(b)]), answer: String(Math.min(a, b)),
      explain: Math.floor(a / 10) !== Math.floor(b / 10) ? `${Math.min(a, b)} has fewer tens.` : `Same tens. ${Math.min(a, b)} has fewer ones.`, visual: null, explainVisual: null };
  },
  'g1-between': (rng) => {
    const lo = randInt(rng, 10, 90); const hi = lo + randInt(rng, 4, 9); const mid = randInt(rng, lo + 1, hi - 1);
    const out = mid + pick(rng, [-15, 15, hi - lo + 3]);
    return { type: 'choice', story: `Between ${lo} and ${hi}.`, prompt: 'Which number is in between?', choices: shuffle(rng, [...new Set([String(mid), String(Math.max(0, out)), String(hi + 1)])]), answer: String(mid),
      explain: `${mid} is bigger than ${lo} and smaller than ${hi}.`, visual: null, explainVisual: null };
  },
  'g1-order-three': (rng) => {
    const nums = []; let guard = 0;
    while (nums.length < 3 && guard++ < 40) { const n = randInt(rng, 10, 99); if (!nums.includes(n)) nums.push(n); }
    const sorted = [...nums].sort((x, y) => x - y);
    const right = sorted.join(', ');
    const wrong1 = [...sorted].reverse().join(', '); const wrong2 = [sorted[1], sorted[0], sorted[2]].join(', ');
    return { type: 'choice', story: `${nums.join(', ')}.`, prompt: 'Which puts them in order, smallest first?', choices: shuffle(rng, [...new Set([right, wrong1, wrong2])]), answer: right,
      explain: `Smallest to biggest: ${right}.`, visual: null, explainVisual: null };
  },
  'g1-more-less-same': (rng) => {
    const a = randInt(rng, 10, 99); const same = randInt(rng, 0, 2) === 0; const b = same ? a : Math.max(10, Math.min(99, a + pick(rng, [-20, -3, 3, 20])));
    const answer = a > b ? 'More' : a < b ? 'Less' : 'The same';
    return { type: 'choice', story: `${a} compared to ${b}.`, prompt: 'Is the first number more, less, or the same?', choices: ['More', 'Less', 'The same'], answer,
      explain: answer === 'The same' ? `${a} and ${b} are the same.` : `${a} is ${answer.toLowerCase()} than ${b}.`, visual: null, explainVisual: null };
  },
});

// Grade 2. Answers are arithmetic on the numbers in the question.
const COINS = [['penny', 1], ['nickel', 5], ['dime', 10], ['quarter', 25]];
const coinName = (v) => COINS.find((c) => c[1] === v)[0];
const hourWord = (h) => ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'][h % 12];
Object.assign(GENERATORS, {
  'g2-place-value': (rng) => {
    const h = randInt(rng, 1, 9); const t = randInt(rng, 0, 9); const o = randInt(rng, 0, 9);
    return { type: 'number', story: `${h} hundreds, ${t} tens and ${o} ones.`, prompt: 'What number is that?', choices: [], answer: String(h * 100 + t * 10 + o),
      explain: `${h * 100} + ${t * 10} + ${o} = ${h * 100 + t * 10 + o}.`, visual: { kind: 'bars', lengths: [h, Math.max(1, t), Math.max(1, o)] }, explainVisual: null };
  },
  'g2-expanded': (rng) => {
    const n = randInt(rng, 101, 999); const h = Math.floor(n / 100); const t = Math.floor((n % 100) / 10); const o = n % 10;
    const right = `${h * 100} + ${t * 10} + ${o}`;
    return { type: 'choice', story: null, prompt: `Which is ${n} written the long way?`, choices: shuffle(rng, [...new Set([right, `${h} + ${t} + ${o}`, `${h * 100} + ${t} + ${o}`, `${h * 10} + ${t * 10} + ${o}`])]), answer: right,
      explain: `${n} is ${h} hundreds, ${t} tens and ${o} ones: ${right}.`, visual: null, explainVisual: null };
  },
  'g2-digit-means': (rng) => {
    const n = randInt(rng, 111, 999); const place = pick(rng, ['hundreds', 'tens', 'ones']);
    const digit = place === 'hundreds' ? Math.floor(n / 100) : place === 'tens' ? Math.floor((n % 100) / 10) : n % 10;
    const value = place === 'hundreds' ? digit * 100 : place === 'tens' ? digit * 10 : digit;
    return { type: 'number', story: `Look at the ${place} digit in ${n}.`, prompt: 'What is it worth?', choices: [], answer: String(value),
      explain: `The ${place} digit is ${digit}. It is worth ${value}.`, visual: null, explainVisual: null };
  },
  'g2-build-3digit': (rng) => {
    const n = randInt(rng, 101, 999); const h = Math.floor(n / 100); const t = Math.floor((n % 100) / 10); const o = n % 10;
    const right = `${h} hundreds, ${t} tens, ${o} ones`;
    // When the digits repeat, the swapped versions would equal the right one; a plain wrong digit never does.
    const wrongA = `${t} hundreds, ${h} tens, ${o} ones`; const wrongB = `${h} hundreds, ${o} tens, ${t} ones`; const wrongC = `${h} hundreds, ${t} tens, ${o === 9 ? 8 : o + 1} ones`;
    return { type: 'choice', story: null, prompt: `Which makes ${n}?`, choices: shuffle(rng, [...new Set([right, wrongA, wrongB, wrongC])].slice(0, 3).includes(right) ? [...new Set([right, wrongA, wrongB, wrongC])].slice(0, 3) : [right, wrongC]), answer: right,
      explain: `${n} is ${right}.`, visual: null, explainVisual: null };
  },
  'g2-hundred-more': (rng) => {
    const n = randInt(rng, 100, 899); const more = randInt(rng, 0, 1) === 1;
    return { type: 'number', story: null, prompt: `What is 100 ${more ? 'more' : 'less'} than ${n}?`, choices: [], answer: String(more ? n + 100 : n - 100),
      explain: `${more ? 'Add' : 'Take away'} one hundred: ${more ? n + 100 : n - 100}.`, visual: null, explainVisual: null };
  },
  'g2-add': (rng) => {
    const a = randInt(rng, 12, 89); const b = randInt(rng, 11, 99 - a);
    return { type: 'number', story: null, prompt: `${a} + ${b} = ?`, choices: [], answer: String(a + b),
      explain: (a % 10) + (b % 10) >= 10 ? `Ones: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}, write ${((a % 10) + (b % 10)) % 10} and carry a ten. ${a} + ${b} = ${a + b}.` : `Ones: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}. Tens: ${Math.floor(a / 10)} + ${Math.floor(b / 10)}. ${a} + ${b} = ${a + b}.`, visual: null, explainVisual: null };
  },
  'g2-add-story': (rng) => {
    const a = randInt(rng, 15, 60); const b = randInt(rng, 12, 99 - a); const thing = g3thing(rng);
    return { type: 'number', story: `A jar has ${a} ${thing}. ${b} more are added.`, prompt: `How many ${thing} are in the jar now?`, choices: [], answer: String(a + b),
      explain: `${a} + ${b} = ${a + b}.`, visual: null, explainVisual: null };
  },
  'g2-add-carry-ones': (rng) => {
    const o1 = randInt(rng, 5, 9); const o2 = randInt(rng, 10 - o1, 9); const t1 = randInt(rng, 1, 4); const t2 = randInt(rng, 1, 4);
    const a = t1 * 10 + o1; const b = t2 * 10 + o2;
    return { type: 'choice', story: `${a} + ${b}. The ones make ${o1 + o2}.`, prompt: 'What do you write in the ones place, and what do you carry?', choices: shuffle(rng, [`Write ${(o1 + o2) % 10}, carry 1 ten`, `Write ${o1 + o2}, carry nothing`, `Write ${(o1 + o2) % 10}, carry nothing`]), answer: `Write ${(o1 + o2) % 10}, carry 1 ten`,
      explain: `${o1 + o2} is ${(o1 + o2) % 10} and one ten. Write ${(o1 + o2) % 10}, carry the ten. ${a} + ${b} = ${a + b}.`, visual: null, explainVisual: null };
  },
  'g2-add-missing': (rng) => {
    const a = randInt(rng, 12, 60); const total = randInt(rng, a + 11, 99);
    return { type: 'number', story: null, prompt: `${a} + ? = ${total}`, choices: [], answer: String(total - a),
      explain: `${total} − ${a} = ${total - a}. So ${a} + ${total - a} = ${total}.`, visual: null, explainVisual: null };
  },
  'g2-add-three': (rng) => {
    const a = randInt(rng, 10, 40); const b = randInt(rng, 10, 30); const c = randInt(rng, 10, 99 - a - b);
    return { type: 'number', story: null, prompt: `${a} + ${b} + ${c} = ?`, choices: [], answer: String(a + b + c),
      explain: `${a} + ${b} = ${a + b}, then + ${c} = ${a + b + c}.`, visual: null, explainVisual: null };
  },
  'g2-sub': (rng) => {
    const a = randInt(rng, 30, 99); const b = randInt(rng, 11, a - 10);
    return { type: 'number', story: null, prompt: `${a} − ${b} = ?`, choices: [], answer: String(a - b),
      explain: (a % 10) < (b % 10) ? `You cannot take ${b % 10} from ${a % 10}, so borrow a ten. ${a} − ${b} = ${a - b}.` : `Ones: ${a % 10} − ${b % 10}. Tens: ${Math.floor(a / 10)} − ${Math.floor(b / 10)}. ${a} − ${b} = ${a - b}.`, visual: null, explainVisual: null };
  },
  'g2-sub-story': (rng) => {
    const a = randInt(rng, 40, 99); const b = randInt(rng, 12, a - 10); const thing = g3thing(rng);
    return { type: 'number', story: `A box holds ${a} ${thing}. ${b} are taken out.`, prompt: `How many ${thing} are left?`, choices: [], answer: String(a - b),
      explain: `${a} − ${b} = ${a - b}.`, visual: null, explainVisual: null };
  },
  'g2-sub-borrow-ones': (rng) => {
    const t = randInt(rng, 3, 9); const o = randInt(rng, 0, 4); const sub = randInt(rng, o + 1, 9); const a = t * 10 + o;
    return { type: 'choice', story: `${a} − ${sub}. You cannot take ${sub} from ${o}.`, prompt: 'What does borrowing a ten give you?', choices: shuffle(rng, [`${t - 1} tens and ${o + 10} ones`, `${t} tens and ${o + 10} ones`, `${t - 1} tens and ${o} ones`]), answer: `${t - 1} tens and ${o + 10} ones`,
      explain: `One ten becomes ten ones: ${t - 1} tens and ${o + 10} ones. Then ${o + 10} − ${sub} = ${o + 10 - sub}.`, visual: null, explainVisual: null };
  },
  'g2-sub-check': (rng) => {
    const a = randInt(rng, 30, 99); const b = randInt(rng, 11, a - 10);
    const right = `${a - b} + ${b} = ${a}`;
    return { type: 'choice', story: `${a} − ${b} = ${a - b}.`, prompt: 'Which addition checks it?', choices: shuffle(rng, [...new Set([right, `${a - b} + ${a} = ${b}`, `${a} + ${b} = ${a + b}`])]), answer: right,
      explain: `Adding back gives the start: ${right}.`, visual: null, explainVisual: null };
  },
  'g2-sub-compare': (rng) => {
    const a = randInt(rng, 30, 99); const b = randInt(rng, 11, a - 5); const thing = g3thing(rng);
    return { type: 'number', story: `Ava has ${a} ${thing}. Ben has ${b}.`, prompt: 'How many more does Ava have?', choices: [], answer: String(a - b),
      explain: `${a} − ${b} = ${a - b} more.`, visual: null, explainVisual: null };
  },
  'g2-read-clock': (rng) => {
    const h = randInt(rng, 1, 12);
    const right = `${hourWord(h)} o'clock`;
    const wrongs = [`${hourWord(h % 12 + 1)} o'clock`, `half past ${hourWord(h)}`, `${hourWord(h === 1 ? 12 : h - 1)} o'clock`];
    return { type: 'choice', story: null, prompt: 'What time is it?', choices: shuffle(rng, [right, ...wrongs]), answer: right,
      explain: `The short hand points to ${h} and the long hand points straight up. ${right}.`, visual: { kind: 'clock', hour: h, minute: 0 }, explainVisual: null };
  },
  'g2-half-past': (rng) => {
    const h = randInt(rng, 1, 12);
    const right = `half past ${hourWord(h)}`;
    return { type: 'choice', story: null, prompt: 'What time is it?', choices: shuffle(rng, [right, `half past ${hourWord(h % 12 + 1)}`, `${hourWord(h)} o'clock`, `${hourWord(h % 12 + 1)} o'clock`]), answer: right,
      explain: `The long hand points straight down, so it is half past. The short hand is just past ${h}. ${right}.`, visual: { kind: 'clock', hour: h, minute: 30 }, explainVisual: null };
  },
  'g2-which-clock': (rng) => {
    const h = randInt(rng, 1, 12); const half = randInt(rng, 0, 1) === 1;
    const right = `clock:${h}:${half ? 30 : 0}`;
    const wrongs = [`clock:${h % 12 + 1}:${half ? 30 : 0}`, `clock:${h}:${half ? 0 : 30}`];
    return { type: 'choice', story: null, prompt: `Tap the clock that shows ${half ? 'half past ' + hourWord(h) : hourWord(h) + " o'clock"}.`, choices: shuffle(rng, [right, ...wrongs]), answer: right,
      explain: half ? `Long hand down, short hand just past ${h}.` : `Long hand up, short hand on ${h}.`, visual: null, explainVisual: null };
  },
  'g2-minutes-in': (rng) => {
    const kind = pick(rng, ['an hour', 'half an hour', 'two hours']);
    const answer = kind === 'an hour' ? 60 : kind === 'half an hour' ? 30 : 120;
    return { type: 'number', story: null, prompt: `How many minutes are in ${kind}?`, choices: [], answer: String(answer),
      explain: `An hour is 60 minutes. ${kind[0].toUpperCase() + kind.slice(1)} is ${answer} minutes.`, visual: null, explainVisual: null };
  },
  'g2-hour-later': (rng) => {
    const h = randInt(rng, 1, 12); const later = randInt(rng, 1, 3); const h2 = ((h + later - 1) % 12) + 1;
    return { type: 'choice', story: `It is ${hourWord(h)} o'clock.`, prompt: `What time is it ${later} ${later === 1 ? 'hour' : 'hours'} later?`, choices: shuffle(rng, [...new Set([`${hourWord(h2)} o'clock`, `${hourWord(h2 % 12 + 1)} o'clock`, `${hourWord(h)} o'clock`])]), answer: `${hourWord(h2)} o'clock`,
      explain: `${later} ${later === 1 ? 'hour' : 'hours'} after ${h} is ${h2}.`, visual: { kind: 'clock', hour: h, minute: 0 }, explainVisual: null };
  },
  'g2-coin-value': (rng) => {
    const [name, value] = pick(rng, COINS);
    return { type: 'choice', story: null, prompt: `How many cents is a ${name}?`, choices: shuffle(rng, COINS.map((c) => String(c[1]))), answer: String(value),
      explain: `A ${name} is ${value} ${value === 1 ? 'cent' : 'cents'}.`, visual: null, explainVisual: null };
  },
  'g2-count-coins': (rng) => {
    const picked = [pick(rng, COINS), pick(rng, COINS), pick(rng, COINS)].sort((x, y) => y[1] - x[1]);
    const total = picked.reduce((sum, c) => sum + c[1], 0);
    return { type: 'number', story: `A ${picked[0][0]}, a ${picked[1][0]} and a ${picked[2][0]}.`, prompt: 'How many cents altogether?', choices: [], answer: String(total),
      explain: `Start big and count on: ${picked[0][1]}, ${picked[0][1] + picked[1][1]}, ${total}. ${total} cents.`, visual: null, explainVisual: null };
  },
  'g2-make-amount': (rng) => {
    const [a, b] = [pick(rng, COINS), pick(rng, COINS)];
    const total = a[1] + b[1];
    const right = `a ${a[0]} and a ${b[0]}`;
    const wrongs = COINS.filter((c) => c[1] + a[1] !== total && c[1] + b[1] !== total).slice(0, 2).map((c) => `a ${a[0]} and a ${c[0]}`);
    return { type: 'choice', story: null, prompt: `Which coins make ${total} cents?`, choices: shuffle(rng, [...new Set([right, ...wrongs])]), answer: right,
      explain: `${a[1]} + ${b[1]} = ${total}.`, visual: null, explainVisual: null };
  },
  'g2-change': (rng) => {
    const price = randInt(rng, 5, 95); const paid = 100;
    return { type: 'number', story: `Something costs ${price} cents. You pay with a dollar.`, prompt: 'How many cents change do you get?', choices: [], answer: String(paid - price),
      explain: `A dollar is 100 cents. 100 − ${price} = ${paid - price}.`, visual: null, explainVisual: null };
  },
  'g2-which-more-money': (rng) => {
    const a = randInt(rng, 2, 4); const b = randInt(rng, 2, 4);
    const coinA = pick(rng, COINS); let coinB = pick(rng, COINS); if (coinB[1] === coinA[1]) coinB = COINS[(COINS.indexOf(coinA) + 1) % COINS.length];
    const totalA = a * coinA[1]; const totalB = b * coinB[1];
    if (totalA === totalB) return GENERATORS['g2-which-more-money'](rng);
    const left = `${a} ${coinA[0]}${a > 1 ? 's' : ''}`; const rightSide = `${b} ${coinB[0]}${b > 1 ? 's' : ''}`;
    return { type: 'choice', story: `${left[0].toUpperCase() + left.slice(1)}, or ${rightSide}.`, prompt: 'Which is more money?', choices: shuffle(rng, [left, rightSide]), answer: totalA > totalB ? left : rightSide,
      explain: `${left} is ${totalA} cents. ${rightSide} is ${totalB} cents.`, visual: null, explainVisual: null };
  },
  'g2-array-total': (rng) => {
    const rows = randInt(rng, 2, 5); const cols = randInt(rng, 2, 5);
    return { type: 'number', story: null, prompt: 'How many in the array?', choices: [], answer: String(rows * cols),
      explain: `${rows} rows of ${cols}. ${Array.from({ length: rows }, () => cols).join(' + ')} = ${rows * cols}.`, visual: { kind: 'array', rows, cols }, explainVisual: null };
  },
  'g2-repeated-add': (rng) => {
    const rows = randInt(rng, 2, 5); const cols = randInt(rng, 2, 5);
    const right = Array.from({ length: rows }, () => cols).join(' + ');
    const wrong1 = Array.from({ length: cols }, () => rows).join(' + ');
    const wrong2 = Array.from({ length: rows }, () => cols + 1).join(' + ');
    return { type: 'choice', story: null, prompt: 'Which addition matches the rows?', choices: shuffle(rng, [...new Set([right, wrong1, wrong2])]), answer: right,
      explain: `${rows} rows, ${cols} in each: ${right} = ${rows * cols}.`, visual: { kind: 'array', rows, cols }, explainVisual: null };
  },
  'g2-rows-in': (rng) => {
    const rows = randInt(rng, 2, 5); const cols = randInt(rng, 2, 5);
    return { type: 'number', story: null, prompt: 'How many rows?', choices: [], answer: String(rows),
      explain: `Count the rows across: ${rows}.`, visual: { kind: 'array', rows, cols }, explainVisual: null };
  },
  'g2-which-array': (rng) => {
    const rows = randInt(rng, 2, 4); const cols = randInt(rng, 2, 5);
    return { type: 'choice', story: `${rows} rows of ${cols}.`, prompt: 'Tap the array that shows it.', choices: shuffle(rng, [`array:${rows}x${cols}`, `array:${rows + 1}x${cols}`, `array:${rows}x${cols + 1}`]), answer: `array:${rows}x${cols}`,
      explain: `This one has ${rows} rows with ${cols} in each.`, visual: null, explainVisual: null };
  },
  'g2-even-odd': (rng) => {
    const n = randInt(rng, 2, 20);
    return { type: 'choice', story: `Can ${n} things be put in two equal rows?`, prompt: `Is ${n} even or odd?`, choices: ['Even', 'Odd'], answer: n % 2 === 0 ? 'Even' : 'Odd',
      explain: n % 2 === 0 ? `${n} makes two rows of ${n / 2}. Even.` : `${n} leaves one left over. Odd.`, visual: { kind: 'dots', count: Math.min(10, n) }, explainVisual: null };
  },
});

// Grade 4. Answers are arithmetic on the numbers in the question; the checker redoes each.
// (gcd already exists above, from the fractions module.)
// Wrong fraction answers must differ in VALUE, not only in spelling, or two choices could
// mean the same amount. This keeps three that do.
function fractionChoices(rng, right, candidates) {
  const value = (f) => { const [n, d] = f.split('/').map(Number); return n / d; };
  const kept = [];
  for (const w of candidates) if (Math.abs(value(w) - value(right)) > 1e-9 && kept.every((k) => Math.abs(value(k) - value(w)) > 1e-9) && !kept.includes(w)) kept.push(w);
  return shuffle(rng, [right, ...kept.slice(0, 3)]);
}
Object.assign(GENERATORS, {
  'g4-two-by-one': (rng) => {
    const a = randInt(rng, 12, 99); const b = randInt(rng, 3, 9);
    return { type: 'number', story: null, prompt: `${a} × ${b} = ?`, choices: [], answer: String(a * b),
      explain: `${Math.floor(a / 10) * 10} × ${b} = ${Math.floor(a / 10) * 10 * b}, and ${a % 10} × ${b} = ${(a % 10) * b}. Add: ${a * b}.`, visual: null, explainVisual: null };
  },
  'g4-split-first': (rng) => {
    const a = randInt(rng, 21, 89); const b = randInt(rng, 3, 9); const tens = Math.floor(a / 10) * 10;
    const right = `${tens} × ${b} and ${a % 10} × ${b}`;
    return { type: 'choice', story: `To work out ${a} × ${b}, split ${a} by place value.`, prompt: 'Which two smaller multiplications do you add?', choices: shuffle(rng, [...new Set([right, `${tens} × ${b} and ${a % 10} + ${b}`, `${a} × ${Math.floor(b / 2)} and ${a} × ${b - Math.floor(b / 2) + 1}`])]), answer: right,
      explain: `${a} is ${tens} + ${a % 10}, so multiply each part by ${b} and add.`, visual: null, explainVisual: null };
  },
  'g4-two-by-two': (rng) => {
    const a = randInt(rng, 12, 40); const b = randInt(rng, 11, 25);
    return { type: 'number', story: null, prompt: `${a} × ${b} = ?`, choices: [], answer: String(a * b),
      explain: `${a} × ${Math.floor(b / 10) * 10} = ${a * Math.floor(b / 10) * 10}, and ${a} × ${b % 10} = ${a * (b % 10)}. Add: ${a * b}.`, visual: null, explainVisual: null };
  },
  'g4-multiply-story': (rng) => {
    const rows = randInt(rng, 12, 48); const each = randInt(rng, 4, 9); const thing = g3thing(rng);
    return { type: 'number', story: `A hall has ${rows} rows of seats with ${each} seats in each row.`, prompt: 'How many seats are there?', choices: [], answer: String(rows * each),
      explain: `${rows} × ${each} = ${rows * each}.`, visual: null, explainVisual: null };
  },
  'g4-estimate-product': (rng) => {
    const a = randInt(rng, 18, 92); const b = randInt(rng, 3, 9);
    const ra = Math.round(a / 10) * 10; const est = ra * b;
    return { type: 'choice', story: `Estimate ${a} × ${b} by rounding ${a} to the nearest ten.`, prompt: 'About how much is it?', choices: shuffle(rng, [...new Set([String(est), String(est + b * 10), String(est - b * 10), String(a + b)])]), answer: String(est),
      explain: `${a} rounds to ${ra}. ${ra} × ${b} = ${est}. The exact answer, ${a * b}, is close to that.`, visual: null, explainVisual: null };
  },
  'g4-divide-exact': (rng) => {
    const b = randInt(rng, 3, 9); const q = randInt(rng, 11, 99);
    return { type: 'number', story: null, prompt: `${b * q} ÷ ${b} = ?`, choices: [], answer: String(q),
      explain: `${b} × ${q} = ${b * q}, so ${b * q} ÷ ${b} = ${q}.`, visual: null, explainVisual: null };
  },
  'g4-divide-remainder': (rng) => {
    const b = randInt(rng, 3, 9); const q = randInt(rng, 4, 30); const r = randInt(rng, 1, b - 1); const n = b * q + r;
    const right = `${q} R${r}`;
    return { type: 'choice', story: null, prompt: `${n} ÷ ${b} = ?`, choices: shuffle(rng, [...new Set([right, `${q + 1} R${r}`, `${q} R${(r + 1) % b}`, `${q - 1} R${r}`])]), answer: right,
      explain: `${b} × ${q} = ${b * q}, and ${n} − ${b * q} = ${r} left over. ${right}.`, visual: null, explainVisual: null };
  },
  'g4-check-division': (rng) => {
    const b = randInt(rng, 3, 9); const q = randInt(rng, 4, 30); const r = randInt(rng, 0, b - 1); const n = b * q + r;
    const right = `${q} × ${b} + ${r} = ${n}`;
    return { type: 'choice', story: `${n} ÷ ${b} = ${q} R${r}.`, prompt: 'Which check proves it?', choices: shuffle(rng, [...new Set([right, `${q} × ${b} − ${r} = ${n}`, `${q} + ${b} + ${r} = ${n}`])]), answer: right,
      explain: `Multiply back and add the remainder: ${right}.`, visual: null, explainVisual: null };
  },
  'g4-divide-story': (rng) => {
    const b = randInt(rng, 3, 8); const q = randInt(rng, 12, 60); const thing = g3thing(rng);
    return { type: 'number', story: `${b * q} ${thing} are packed equally into ${b} boxes.`, prompt: 'How many in each box?', choices: [], answer: String(q),
      explain: `${b * q} ÷ ${b} = ${q}.`, visual: null, explainVisual: null };
  },
  'g4-remainder-only': (rng) => {
    const b = randInt(rng, 3, 9); const q = randInt(rng, 4, 40); const r = randInt(rng, 1, b - 1); const n = b * q + r;
    return { type: 'number', story: `${n} ${g3thing(rng)} are shared among ${b} friends.`, prompt: 'How many are left over?', choices: [], answer: String(r),
      explain: `${b} × ${q} = ${b * q}. ${n} − ${b * q} = ${r} left over.`, visual: null, explainVisual: null };
  },
  'g4-is-factor': (rng) => {
    const n = randInt(rng, 12, 60); const yes = randInt(rng, 0, 1) === 1;
    const factors = Array.from({ length: n }, (_, i) => i + 1).filter((f) => n % f === 0 && f > 1 && f < n);
    const nonFactors = Array.from({ length: 10 }, (_, i) => i + 2).filter((f) => n % f !== 0);
    if (!factors.length || !nonFactors.length) return GENERATORS['g4-is-factor'](rng);
    const f = yes ? pick(rng, factors) : pick(rng, nonFactors);
    return { type: 'choice', story: null, prompt: `Is ${f} a factor of ${n}?`, choices: ['Yes', 'No'], answer: yes ? 'Yes' : 'No',
      explain: yes ? `${n} ÷ ${f} = ${n / f} with nothing left over, so yes.` : `${n} ÷ ${f} leaves ${n % f} over, so no.`, visual: null, explainVisual: null };
  },
  'g4-list-factor': (rng) => {
    const n = pick(rng, [12, 16, 18, 20, 24, 28, 30, 36]);
    const factors = Array.from({ length: n }, (_, i) => i + 1).filter((f) => n % f === 0);
    const right = pick(rng, factors.filter((f) => f > 1 && f < n));
    const wrongs = [...new Set([right + 1, right + 5, n + 1].filter((w) => n % w !== 0))].slice(0, 2);
    return { type: 'choice', story: null, prompt: `Which of these is a factor of ${n}?`, choices: shuffle(rng, [String(right), ...wrongs.map(String)]), answer: String(right),
      explain: `${n} ÷ ${right} = ${n / right}. No remainder, so ${right} is a factor.`, visual: null, explainVisual: null };
  },
  'g4-multiple': (rng) => {
    const b = randInt(rng, 3, 9); const k = randInt(rng, 2, 9); const right = b * k;
    const wrongs = [...new Set([right + 1, right - 1, right + Math.floor(b / 2) || right + 2].filter((w) => w % b !== 0))].slice(0, 2);
    return { type: 'choice', story: null, prompt: `Which of these is a multiple of ${b}?`, choices: shuffle(rng, [String(right), ...wrongs.map(String)]), answer: String(right),
      explain: `${b} × ${k} = ${right}, so ${right} is a multiple of ${b}.`, visual: null, explainVisual: null };
  },
  'g4-prime': (rng) => {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]; const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25];
    const isPrime = randInt(rng, 0, 1) === 1; const n = pick(rng, isPrime ? primes : composites);
    const factor = isPrime ? null : [2, 3, 5, 7].find((f) => n % f === 0);
    return { type: 'choice', story: null, prompt: `Is ${n} a prime number?`, choices: ['Yes', 'No'], answer: isPrime ? 'Yes' : 'No',
      explain: isPrime ? `Only 1 and ${n} divide ${n}, so it is prime.` : `${factor} divides ${n} (${factor} × ${n / factor}), so it is not prime.`, visual: null, explainVisual: null };
  },
  'g4-next-multiple': (rng) => {
    const b = randInt(rng, 3, 9); const k = randInt(rng, 2, 8);
    return { type: 'number', story: `${b * (k - 1)}, ${b * k}, ...`, prompt: `What is the next multiple of ${b}?`, choices: [], answer: String(b * (k + 1)),
      explain: `Multiples of ${b} go up by ${b}. After ${b * k} comes ${b * (k + 1)}.`, visual: null, explainVisual: null };
  },
  'g4-fraction-to-decimal': (rng) => {
    const tenths = randInt(rng, 0, 1) === 1; const top = tenths ? randInt(rng, 1, 9) : randInt(rng, 1, 99);
    const answer = tenths ? `0.${top}` : `0.${String(top).padStart(2, '0')}`;
    const wrongs = tenths ? [`0.0${top}`, `${top}.0`, `0.${top}${top}`] : [`0.${top}`, `${top}.00`, `0.0${top}`];
    return { type: 'choice', story: null, prompt: `Write ${top}/${tenths ? 10 : 100} as a decimal.`, choices: shuffle(rng, [...new Set([answer, ...wrongs])].slice(0, 4)), answer,
      explain: `${top} ${tenths ? 'tenths' : 'hundredths'} is ${answer}.`, visual: tenths ? { kind: 'bar', parts: 10, shaded: top } : null, explainVisual: null };
  },
  'g4-decimal-to-fraction': (rng) => {
    const tenths = randInt(rng, 0, 1) === 1; const top = tenths ? randInt(rng, 1, 9) : randInt(rng, 1, 99);
    const dec = tenths ? `0.${top}` : `0.${String(top).padStart(2, '0')}`;
    const right = `${top}/${tenths ? 10 : 100}`;
    const wrongs = [`${top}/${tenths ? 100 : 10}`, `${tenths ? 10 : 100}/${top}`, `${top + 1}/${tenths ? 10 : 100}`];
    return { type: 'choice', story: null, prompt: `Write ${dec} as a fraction.`, choices: shuffle(rng, [...new Set([right, ...wrongs])].slice(0, 4)), answer: right,
      explain: `${dec} is ${top} ${tenths ? 'tenths' : 'hundredths'}: ${right}.`, visual: null, explainVisual: null };
  },
  'g4-compare-decimals': (rng) => {
    const a = randInt(rng, 1, 99); let b = randInt(rng, 1, 99); if (b === a) b = a === 99 ? 98 : a + 1;
    const da = `0.${String(a).padStart(2, '0')}`; const db = `0.${String(b).padStart(2, '0')}`;
    return { type: 'choice', story: null, prompt: 'Which decimal is bigger?', choices: shuffle(rng, [da, db]), answer: a > b ? da : db,
      explain: `Compare tenths first, then hundredths. ${a > b ? da : db} is bigger.`, visual: null, explainVisual: null };
  },
  'g4-tenths-hundredths': (rng) => {
    const t = randInt(rng, 1, 9);
    return { type: 'choice', story: `${t}/10 is the same amount as ?/100.`, prompt: 'What goes on top?', choices: shuffle(rng, [...new Set([String(t * 10), String(t), String(t * 10 + 1), String(t + 10)])]), answer: String(t * 10),
      explain: `${t} tenths is ${t * 10} hundredths. Both are ${`0.${t}`}.`, visual: { kind: 'bar', parts: 10, shaded: t }, explainVisual: null };
  },
  'g4-decimal-picture': (rng) => {
    const t = randInt(rng, 1, 9);
    return { type: 'choice', story: null, prompt: 'What decimal does the shaded part show?', choices: shuffle(rng, [...new Set([`0.${t}`, `0.0${t}`, `${t}.0`, `0.${(t + 1) % 10 || 1}`])]), answer: `0.${t}`,
      explain: `${t} of 10 parts are shaded. That is ${t}/10, or 0.${t}.`, visual: { kind: 'bar', parts: 10, shaded: t }, explainVisual: null };
  },
  'g4-add-fraction': (rng) => {
    const d = pick(rng, [4, 5, 6, 8, 10, 12]); const a = randInt(rng, 1, d - 2); const b = randInt(rng, 1, d - a - 1);
    return { type: 'choice', story: null, prompt: `${a}/${d} + ${b}/${d} = ?`, choices: fractionChoices(rng, `${a + b}/${d}`, [`${a + b}/${d * 2}`, `${a * b}/${d}`, `${a + b + 1}/${d}`, `${a + b + 2}/${d}`]), answer: `${a + b}/${d}`,
      explain: `Same bottom, add the tops: ${a} + ${b} = ${a + b}. ${a + b}/${d}.`, visual: { kind: 'bar', parts: d, shaded: a + b }, explainVisual: null };
  },
  'g4-sub-fraction': (rng) => {
    const d = pick(rng, [4, 5, 6, 8, 10, 12]); const a = randInt(rng, 2, d - 1); const b = randInt(rng, 1, a - 1);
    return { type: 'choice', story: null, prompt: `${a}/${d} − ${b}/${d} = ?`, choices: fractionChoices(rng, `${a - b}/${d}`, [`${a - b}/${d - b}`, `${a + b}/${d}`, `${a - b + 1}/${d}`, `${Math.max(1, a - b - 1)}/${d}`]), answer: `${a - b}/${d}`,
      explain: `Same bottom, subtract the tops: ${a} − ${b} = ${a - b}. ${a - b}/${d}.`, visual: { kind: 'bar', parts: d, shaded: a - b }, explainVisual: null };
  },
  'g4-mixed-number': (rng) => {
    const d = pick(rng, [2, 3, 4, 5, 6, 8]); const whole = randInt(rng, 1, 3); const part = randInt(rng, 1, d - 1); const top = whole * d + part;
    const right = `${whole} ${part}/${d}`;
    return { type: 'choice', story: null, prompt: `Write ${top}/${d} as a mixed number.`, choices: shuffle(rng, [...new Set([right, `${whole + 1} ${part}/${d}`, `${whole} ${part + 1 > d - 1 ? 1 : part + 1}/${d}`, `${part} ${whole}/${d}`])]), answer: right,
      explain: `${d}/${d} makes one whole. ${top}/${d} is ${whole} wholes and ${part}/${d} left: ${right}.`, visual: null, explainVisual: null };
  },
  'g4-fraction-story': (rng) => {
    const d = pick(rng, [6, 8, 10, 12]); const a = randInt(rng, 1, d - 2); const b = randInt(rng, 1, d - a - 1);
    return { type: 'choice', story: `A pizza is cut into ${d} slices. Sam eats ${a} and Mia eats ${b}.`, prompt: 'What fraction of the pizza is eaten?', choices: fractionChoices(rng, `${a + b}/${d}`, [`${a + b}/${d * 2}`, `${a * b}/${d}`, `${d - a - b}/${d}`, `${a + b + 1}/${d}`]), answer: `${a + b}/${d}`,
      explain: `${a} + ${b} = ${a + b} slices of ${d}: ${a + b}/${d}.`, visual: { kind: 'bar', parts: d, shaded: a + b }, explainVisual: null };
  },
  'g4-simplify': (rng) => {
    const pairs = [[2, 4], [2, 6], [2, 8], [3, 6], [4, 8], [3, 9], [4, 6], [6, 8], [5, 10], [4, 12], [6, 12], [8, 12], [3, 12], [9, 12], [2, 10], [6, 9]];
    const [top, bottom] = pick(rng, pairs); const g = gcd(top, bottom); const right = `${top / g}/${bottom / g}`;
    const wrongs = [`${top / g}/${bottom}`, `${top}/${bottom / g}`, `${top / g + 1}/${bottom / g}`].filter((w) => w !== right);
    return { type: 'choice', story: null, prompt: `Simplify ${top}/${bottom}.`, choices: shuffle(rng, [...new Set([right, ...wrongs])].slice(0, 4)), answer: right,
      explain: `Divide top and bottom by ${g}: ${top}/${bottom} = ${right}.`, visual: { kind: 'bar', parts: bottom, shaded: top }, explainVisual: null };
  },
});

// Grade 3 multiplication and division. Every answer is a product or a quotient of the
// numbers in the question, so the independent checker can redo it from the words.
const G3_THINGS = ['cookies', 'stickers', 'marbles', 'pencils', 'apples', 'cards', 'books', 'coins', 'shells', 'crayons'];
const g3thing = (rng) => G3_THINGS[randInt(rng, 0, G3_THINGS.length - 1)];
const nearProducts = (rng, a, b) => {
  const right = a * b;
  const cands = new Set([right]);
  let guard = 0;
  while (cands.size < 4 && guard++ < 40) {
    const wrong = pick(rng, [right + a, right - a, right + b, right - b, right + 1, right - 1, a + b, (a + 1) * b, a * (b + 1)]);
    if (wrong > 0 && wrong !== right) cands.add(wrong);
  }
  return shuffle(rng, [...cands].map(String));
};
Object.assign(GENERATORS, {
  'mu-groups-total': (rng) => {
    const groups = randInt(rng, 2, 6); const each = randInt(rng, 2, 6);
    return { type: 'choice', story: `${groups} groups. ${each} in each group.`, prompt: 'How many altogether?', choices: nearProducts(rng, groups, each), answer: String(groups * each),
      explain: `${Array.from({ length: groups }, () => each).join(' + ')} = ${groups * each}. That is ${groups} × ${each}.`, visual: { kind: 'array', rows: groups, cols: each }, explainVisual: null };
  },
  'mu-array': (rng) => {
    const rows = randInt(rng, 2, 6); const cols = randInt(rng, 2, 7);
    return { type: 'choice', story: null, prompt: 'Which multiplication does this array show?', choices: shuffle(rng, [`${rows} × ${cols}`, `${rows} + ${cols}`, `${rows + 1} × ${cols}`, `${rows} × ${cols + 1}`]), answer: `${rows} × ${cols}`,
      explain: `${rows} rows with ${cols} in each row. ${rows} × ${cols} = ${rows * cols}.`, visual: { kind: 'array', rows, cols }, explainVisual: null };
  },
  'mu-story': (rng) => {
    const groups = randInt(rng, 2, 8); const each = randInt(rng, 2, 9); const thing = g3thing(rng);
    return { type: 'number', story: `There are ${groups} bags. Each bag has ${each} ${thing}.`, prompt: `How many ${thing} are there in all?`, choices: [], answer: String(groups * each),
      explain: `${groups} bags of ${each} is ${groups} × ${each} = ${groups * each}.`, visual: { kind: 'array', rows: groups, cols: each }, explainVisual: null };
  },
  'mu-which-equation': (rng) => {
    const groups = randInt(rng, 2, 7); const each = randInt(rng, 2, 9); const thing = g3thing(rng);
    const right = `${groups} × ${each} = ${groups * each}`;
    return { type: 'choice', story: `${groups} boxes with ${each} ${thing} in each.`, prompt: 'Which number sentence matches?', choices: shuffle(rng, [right, `${groups} + ${each} = ${groups + each}`, `${groups} × ${each} = ${groups * each + each}`, `${each} − ${groups} = ${Math.abs(each - groups)}`]), answer: right,
      explain: `${groups} groups of ${each} is multiplication: ${right}.`, visual: null, explainVisual: null };
  },
  'mu-swap': (rng) => {
    const a = randInt(rng, 2, 9); let b = randInt(rng, 2, 9); if (b === a) b = a === 9 ? 8 : a + 1;
    return { type: 'choice', story: `${a} × ${b} = ${a * b}.`, prompt: `So what is ${b} × ${a}?`, choices: nearProducts(rng, a, b), answer: String(a * b),
      explain: `Swapping the numbers does not change the answer. ${b} × ${a} = ${a * b} too.`, visual: null, explainVisual: null };
  },
  'tt-fact': (rng) => {
    const a = randInt(rng, 2, 10); const b = randInt(rng, 2, 10);
    return { type: 'number', story: null, prompt: `${a} × ${b} = ?`, choices: [], answer: String(a * b),
      explain: `${a} × ${b} = ${a * b}.`, visual: null, explainVisual: null };
  },
  'tt-missing-factor': (rng) => {
    const a = randInt(rng, 2, 10); const b = randInt(rng, 2, 10);
    return { type: 'number', story: null, prompt: `${a} × ? = ${a * b}`, choices: [], answer: String(b),
      explain: `${a} × ${b} = ${a * b}, so the missing number is ${b}.`, visual: null, explainVisual: null };
  },
  'tt-pattern': (rng) => {
    const kind = pick(rng, [2, 5, 9, 10]); const a = randInt(rng, 2, 10);
    const hint = kind === 2 ? 'Times 2 is doubling.' : kind === 5 ? 'Times 5 ends in 0 or 5.' : kind === 9 ? 'The digits of a times-9 answer add up to 9.' : 'Times 10 just adds a zero.';
    return { type: 'choice', story: hint, prompt: `${a} × ${kind} = ?`, choices: nearProducts(rng, a, kind), answer: String(a * kind),
      explain: `${hint} ${a} × ${kind} = ${a * kind}.`, visual: null, explainVisual: null };
  },
  'tt-fact-story': (rng) => {
    const a = randInt(rng, 3, 10); const b = randInt(rng, 3, 10); const thing = g3thing(rng);
    return { type: 'number', story: `A pack holds ${b} ${thing}. You buy ${a} packs.`, prompt: `How many ${thing} is that?`, choices: [], answer: String(a * b),
      explain: `${a} packs × ${b} = ${a * b}.`, visual: null, explainVisual: null };
  },
  'dv-share': (rng) => {
    const each = randInt(rng, 2, 9); const groups = randInt(rng, 2, 9); const total = each * groups; const thing = g3thing(rng);
    return { type: 'number', story: `${total} ${thing} shared equally among ${groups} friends.`, prompt: 'How many does each friend get?', choices: [], answer: String(each),
      explain: `${groups} × ${each} = ${total}, so ${total} ÷ ${groups} = ${each}.`, visual: { kind: 'array', rows: groups, cols: each }, explainVisual: null };
  },
  'dv-fact': (rng) => {
    const b = randInt(rng, 2, 10); const q = randInt(rng, 2, 10);
    return { type: 'number', story: null, prompt: `${b * q} ÷ ${b} = ?`, choices: [], answer: String(q),
      explain: `What times ${b} makes ${b * q}? ${q}. So ${b * q} ÷ ${b} = ${q}.`, visual: null, explainVisual: null };
  },
  'dv-story': (rng) => {
    const groups = randInt(rng, 2, 8); const each = randInt(rng, 2, 9); const total = groups * each; const thing = g3thing(rng);
    return { type: 'number', story: `${total} ${thing} are put into boxes of ${each}.`, prompt: 'How many boxes are filled?', choices: [], answer: String(groups),
      explain: `${groups} × ${each} = ${total}, so ${total} ÷ ${each} = ${groups} boxes.`, visual: null, explainVisual: null };
  },
  'dv-undo': (rng) => {
    const a = randInt(rng, 2, 9); let b = randInt(rng, 2, 9); if (b === a) b = a === 9 ? 8 : a + 1;
    const right = `${a * b} ÷ ${a} = ${b}`;
    // Wrong answers differ from the right one in the result or the form, so none can coincide.
    return { type: 'choice', story: `${a} × ${b} = ${a * b}.`, prompt: 'Which division fact goes with it?', choices: shuffle(rng, [right, `${a * b} ÷ ${a} = ${b + 1}`, `${a} ÷ ${b} = ${a * b}`, `${a * b} ÷ ${b} = ${a + 1}`]), answer: right,
      explain: `Dividing undoes multiplying. ${right}.`, visual: null, explainVisual: null };
  },
  'dv-how-many-groups': (rng) => {
    const each = randInt(rng, 2, 9); const groups = randInt(rng, 2, 9); const total = each * groups;
    return { type: 'choice', story: `${total} ${g3thing(rng)} in groups of ${each}.`, prompt: 'How many groups?', choices: nearProducts(rng, groups, 1), answer: String(groups),
      explain: `${groups} groups of ${each} make ${total}. ${total} ÷ ${each} = ${groups}.`, visual: null, explainVisual: null };
  },
});

// Adding and subtracting to 1,000. Answers are plain arithmetic on the numbers shown.
Object.assign(GENERATORS, {
  'as-add': (rng) => {
    const a = randInt(rng, 100, 850); const b = randInt(rng, 12, 999 - a);
    return { type: 'number', story: null, prompt: `${a} + ${b} = ?`, choices: [], answer: String(a + b),
      explain: `Ones, then tens, then hundreds. ${a} + ${b} = ${a + b}.`, visual: null, explainVisual: null };
  },
  'as-subtract': (rng) => {
    const a = randInt(rng, 200, 999); const b = randInt(rng, 12, a - 10);
    return { type: 'number', story: null, prompt: `${a} − ${b} = ?`, choices: [], answer: String(a - b),
      explain: `Take the ones, then the tens, then the hundreds, borrowing where needed. ${a} − ${b} = ${a - b}.`, visual: null, explainVisual: null };
  },
  'as-story-add': (rng) => {
    const a = randInt(rng, 120, 600); const b = randInt(rng, 45, 999 - a); const thing = g3thing(rng);
    return { type: 'number', story: `A shop had ${a} ${thing}. A delivery brought ${b} more.`, prompt: `How many ${thing} does the shop have now?`, choices: [], answer: String(a + b),
      explain: `${a} + ${b} = ${a + b}.`, visual: null, explainVisual: null };
  },
  'as-story-subtract': (rng) => {
    const a = randInt(rng, 300, 999); const b = randInt(rng, 45, a - 50); const thing = g3thing(rng);
    return { type: 'number', story: `A library had ${a} ${thing}. ${b} were lent out.`, prompt: `How many ${thing} are left?`, choices: [], answer: String(a - b),
      explain: `${a} − ${b} = ${a - b}.`, visual: null, explainVisual: null };
  },
  'as-two-step': (rng) => {
    const a = randInt(rng, 200, 600); const b = randInt(rng, 40, 300); const c = randInt(rng, 20, Math.min(250, a + b - 30)); const thing = g3thing(rng);
    return { type: 'number', story: `A team collected ${a} ${thing} on Monday and ${b} on Tuesday. Then they gave ${c} away.`, prompt: `How many ${thing} do they have now?`, choices: [], answer: String(a + b - c),
      explain: `First add: ${a} + ${b} = ${a + b}. Then take away: ${a + b} − ${c} = ${a + b - c}.`, visual: null, explainVisual: null };
  },
});

// Shapes. A choice written as 'shape:circle' is a picture the screen draws.
const SHAPES = [
  { name: 'circle', sides: 0, corners: 0 },
  { name: 'triangle', sides: 3, corners: 3 },
  { name: 'square', sides: 4, corners: 4 },
  { name: 'rectangle', sides: 4, corners: 4 },
];
const pickShape = (rng) => SHAPES[randInt(rng, 0, SHAPES.length - 1)];
const otherShapes = (rng, not, n) => shuffle(rng, SHAPES.filter((x) => x.name !== not.name)).slice(0, n);
Object.assign(GENERATORS, {
  'ks-name': (rng) => {
    const sh = pickShape(rng);
    const choices = shuffle(rng, [sh, ...otherShapes(rng, sh, 2)].map((x) => x.name));
    return { type: 'choice', story: null, prompt: 'What shape is this?', choices, answer: sh.name,
      explain: sh.sides === 0 ? 'It is round with no corners, so it is a circle.' : `Count the sides: ${sh.sides}. It is a ${sh.name}.`, visual: { kind: 'shape', name: sh.name }, explainVisual: null };
  },
  'ks-tap': (rng) => {
    const sh = pickShape(rng);
    const choices = shuffle(rng, [sh, ...otherShapes(rng, sh, 2)].map((x) => `shape:${x.name}`));
    return { type: 'choice', story: null, prompt: `Tap the ${sh.name}.`, choices, answer: `shape:${sh.name}`,
      explain: `This one is the ${sh.name}.`, visual: null, explainVisual: null };
  },
  'ks-sides': (rng) => {
    const sh = SHAPES[randInt(rng, 1, SHAPES.length - 1)]; // not the circle
    return { type: 'choice', story: null, prompt: 'How many sides does it have?', choices: shuffle(rng, ['3', '4', '5']), answer: String(sh.sides),
      explain: `Count the sides of the ${sh.name}: ${sh.sides}.`, visual: { kind: 'shape', name: sh.name }, explainVisual: null };
  },
  'ks-odd-one-out': (rng) => {
    const sh = pickShape(rng); const other = otherShapes(rng, sh, 1)[0];
    const choices = shuffle(rng, [`shape:${other.name}`, `shape:${sh.name}`, `shape:${sh.name}`].map((c, i) => `${c}#${i}`));
    return { type: 'choice', story: `Two are the same shape.`, prompt: 'Tap the one that is different.', choices, answer: choices.find((c) => c.startsWith(`shape:${other.name}`)),
      explain: `Two are ${sh.name}s. The ${other.name} is different.`, visual: null, explainVisual: null };
  },
  'ks-corners': (rng) => {
    const sh = pickShape(rng);
    return { type: 'choice', story: null, prompt: 'Does it have corners?', choices: ['Yes', 'No'], answer: sh.corners > 0 ? 'Yes' : 'No',
      explain: sh.corners > 0 ? `A ${sh.name} has ${sh.corners} corners.` : 'A circle is round all the way around. No corners.', visual: { kind: 'shape', name: sh.name }, explainVisual: null };
  },
});

// Solid shapes. A choice 'solid:cube' is a picture the screen draws.
const SOLIDS = [
  { name: 'sphere', thing: 'a ball', rolls: true, flatSides: false },
  { name: 'cube', thing: 'a box', rolls: false, flatSides: true },
  { name: 'cylinder', thing: 'a can', rolls: true, flatSides: true },
  { name: 'cone', thing: 'an ice cream cone', rolls: true, flatSides: true },
];
const pickSolid = (rng) => SOLIDS[randInt(rng, 0, SOLIDS.length - 1)];
const otherSolids = (rng, not, n) => shuffle(rng, SOLIDS.filter((x) => x.name !== not.name)).slice(0, n);
Object.assign(GENERATORS, {
  'kd-name-solid': (rng) => {
    const sd = pickSolid(rng);
    return { type: 'choice', story: null, prompt: 'What solid shape is this?', choices: shuffle(rng, [sd, ...otherSolids(rng, sd, 2)].map((x) => x.name)), answer: sd.name,
      explain: `It is shaped like ${sd.thing}. That is a ${sd.name}.`, visual: { kind: 'solid', name: sd.name }, explainVisual: null };
  },
  'kd-tap-solid': (rng) => {
    const sd = pickSolid(rng);
    return { type: 'choice', story: null, prompt: `Tap the ${sd.name}.`, choices: shuffle(rng, [sd, ...otherSolids(rng, sd, 2)].map((x) => `solid:${x.name}`)), answer: `solid:${sd.name}`,
      explain: `This one is the ${sd.name}, like ${sd.thing}.`, visual: null, explainVisual: null };
  },
  'kd-real-thing': (rng) => {
    const sd = pickSolid(rng);
    return { type: 'choice', story: `Think of ${sd.thing}.`, prompt: 'What solid shape is it?', choices: shuffle(rng, [sd, ...otherSolids(rng, sd, 2)].map((x) => x.name)), answer: sd.name,
      explain: `${sd.thing[0].toUpperCase() + sd.thing.slice(1)} is a ${sd.name}.`, visual: { kind: 'solid', name: sd.name }, explainVisual: null };
  },
  'kd-flat-or-solid': (rng) => {
    const solid = randInt(rng, 0, 1) === 1;
    const sd = pickSolid(rng); const sh = pickShape(rng);
    return { type: 'choice', story: null, prompt: 'Is this shape flat or solid?', choices: ['Flat', 'Solid'], answer: solid ? 'Solid' : 'Flat',
      explain: solid ? `A ${sd.name} is solid. You can hold it.` : `A ${sh.name} is flat, like a drawing.`, visual: solid ? { kind: 'solid', name: sd.name } : { kind: 'shape', name: sh.name }, explainVisual: null };
  },
  'kd-rolls': (rng) => {
    const sd = pickSolid(rng);
    return { type: 'choice', story: null, prompt: 'Can it roll?', choices: ['Yes', 'No'], answer: sd.rolls ? 'Yes' : 'No',
      explain: sd.rolls ? `A ${sd.name} has a round part, so it rolls.` : `A ${sd.name} has flat sides all round, so it slides but does not roll.`, visual: { kind: 'solid', name: sd.name }, explainVisual: null };
  },
});

// Making ten. A ten-frame with some spaces filled; the empty spaces are the partner.
Object.assign(GENERATORS, {
  'kn-partner': (rng) => {
    const n = randInt(rng, 1, 9);
    return { type: 'choice', story: `${n} needs some more to make 10.`, prompt: 'How many more?', choices: shuffle(rng, distinctCounts(rng, 4, 9, 10 - n).map(String)), answer: String(10 - n),
      explain: `${n} and ${10 - n} make 10. Count the empty spaces.`, visual: { kind: 'tenframe', filled: n }, explainVisual: null };
  },
  'kn-frame': (rng) => {
    const n = randInt(rng, 1, 9);
    return { type: 'choice', story: null, prompt: 'How many empty spaces?', choices: shuffle(rng, distinctCounts(rng, 4, 9, 10 - n).map(String)), answer: String(10 - n),
      explain: `${n} filled, ${10 - n} empty. ${n} and ${10 - n} make 10.`, visual: { kind: 'tenframe', filled: n }, explainVisual: null };
  },
  'kn-two-ways': (rng) => {
    const a = randInt(rng, 1, 9); const b = 10 - a;
    const right = `${a} and ${b}`;
    const wrongs = [`${a} and ${b + 1 <= 9 ? b + 1 : b - 1}`, `${a + 1 <= 9 ? a + 1 : a - 1} and ${b}`];
    return { type: 'choice', story: null, prompt: 'Which pair makes 10?', choices: [...new Set(shuffle(rng, [right, ...wrongs]))], answer: right,
      explain: `${a} and ${b} make 10.`, visual: { kind: 'tenframe', filled: a }, explainVisual: null };
  },
  'kn-take-from-ten': (rng) => {
    const n = randInt(rng, 1, 9);
    return { type: 'choice', story: `Ten, then ${n} go away.`, prompt: 'How many are left?', choices: shuffle(rng, distinctCounts(rng, 4, 9, 10 - n).map(String)), answer: String(10 - n),
      explain: `10 take away ${n} leaves ${10 - n}.`, visual: { kind: 'tenframe', filled: 10 }, explainVisual: { kind: 'dots', count: 10 - n } };
  },
  'kn-is-ten': (rng) => {
    const a = randInt(rng, 1, 9); const yes = randInt(rng, 0, 1) === 1; const b = yes ? 10 - a : Math.max(1, Math.min(9, 10 - a + (randInt(rng, 0, 1) ? 1 : -1)));
    return { type: 'choice', story: `${a} and ${b}.`, prompt: 'Do they make 10?', choices: ['Yes', 'No'], answer: a + b === 10 ? 'Yes' : 'No',
      explain: a + b === 10 ? `${a} and ${b} make 10.` : `${a} and ${b} make ${a + b}, not 10.`, visual: { kind: 'tenframe', filled: a }, explainVisual: null };
  },
});

// Counting by tens. A choice 'tens:3' is a picture of three groups of ten.
const TEN_WORDS = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'one hundred'];
Object.assign(GENERATORS, {
  'kt-next-ten': (rng) => {
    const n = randInt(rng, 1, 9);
    const answer = String((n + 1) * 10);
    const choices = shuffle(rng, [answer, String((n + 2 > 10 ? n - 1 : n + 2) * 10), String(n * 10), String(n * 10 + 1)]);
    return { type: 'choice', story: null, prompt: `Counting by tens, what comes after ${n * 10}?`, choices: [...new Set(choices)], answer,
      explain: `${TEN_WORDS[n]}, then ${TEN_WORDS[n + 1]}. After ${n * 10} comes ${answer}.`, visual: { kind: 'tens', count: n }, explainVisual: null };
  },
  'kt-how-many-tens': (rng) => {
    const n = randInt(rng, 2, 6);
    const choices = shuffle(rng, distinctCounts(rng, 4, 10, n).map((c) => String(c * 10)));
    return { type: 'choice', story: null, prompt: 'Count by tens. How many?', choices, answer: String(n * 10),
      explain: `${Array.from({ length: n }, (_, i) => TEN_WORDS[i + 1]).join(', ')}. There are ${n * 10}.`, visual: { kind: 'tens', count: n }, explainVisual: null };
  },
  'kt-tap-tens': (rng) => {
    const n = randInt(rng, 2, 5);
    const choices = shuffle(rng, distinctCounts(rng, 3, 6, n).map((c) => `tens:${c}`));
    return { type: 'choice', story: null, prompt: `Tap the picture that shows ${n * 10}.`, choices, answer: `tens:${n}`,
      explain: `${n} groups of ten make ${n * 10}.`, visual: null, explainVisual: null };
  },
  'kt-before-ten': (rng) => {
    const n = randInt(rng, 2, 10);
    const answer = String((n - 1) * 10);
    const choices = [...new Set(shuffle(rng, [answer, String(n * 10), String((n < 10 ? n + 1 : n - 2) * 10), String((n - 1) * 10 + 1)]))];
    return { type: 'choice', story: null, prompt: `Counting by tens, what comes before ${n * 10}?`, choices, answer,
      explain: `${TEN_WORDS[n - 1]} comes before ${TEN_WORDS[n]}.`, visual: { kind: 'tens', count: n - 1 }, explainVisual: null };
  },
  'kt-count-on': (rng) => {
    const n = randInt(rng, 1, 7);
    const answer = String((n + 2) * 10);
    const choices = [...new Set(shuffle(rng, [answer, String((n + 1) * 10), String((n + 3) * 10), String((n + 2) * 10 + 1)]))];
    return { type: 'choice', story: `${n * 10}, ${(n + 1) * 10}, ...`, prompt: 'What comes next?', choices, answer,
      explain: `${TEN_WORDS[n]}, ${TEN_WORDS[n + 1]}, ${TEN_WORDS[n + 2]}.`, visual: null, explainVisual: null };
  },
});

// Longer, shorter, heavier. A choice 'bar:7' is a line seven units long.
const HEAVY_PAIRS = [['a feather', 'a rock', 'a rock'], ['a leaf', 'a book', 'a book'], ['a balloon', 'a bucket of water', 'a bucket of water'], ['a sock', 'a chair', 'a chair'], ['a crayon', 'a car', 'a car'], ['a paper cup', 'a brick', 'a brick']];
Object.assign(GENERATORS, {
  'kl-longer': (rng) => {
    const [a, b] = distinctCounts(rng, 2, 9, randInt(rng, 2, 9));
    return { type: 'choice', story: null, prompt: 'Which line is longer?', choices: shuffle(rng, [`bar:${a}`, `bar:${b}`]), answer: `bar:${Math.max(a, b)}`,
      explain: 'The longer line reaches further.', visual: null, explainVisual: null };
  },
  'kl-shorter': (rng) => {
    const [a, b] = distinctCounts(rng, 2, 9, randInt(rng, 2, 9));
    return { type: 'choice', story: null, prompt: 'Which line is shorter?', choices: shuffle(rng, [`bar:${a}`, `bar:${b}`]), answer: `bar:${Math.min(a, b)}`,
      explain: 'The shorter line stops sooner.', visual: null, explainVisual: null };
  },
  'kl-same-length': (rng) => {
    const n = randInt(rng, 2, 8); const other = distinctCounts(rng, 2, 9, n)[1];
    return { type: 'choice', story: null, prompt: 'Which line is the same length as the top one?', choices: shuffle(rng, [`bar:${n}`, `bar:${other}`]), answer: `bar:${n}`,
      explain: 'They reach the same distance. They are the same length.', visual: { kind: 'bars', lengths: [n] }, explainVisual: null };
  },
  'kl-heavier-words': (rng) => {
    const [light, heavy, answer] = HEAVY_PAIRS[randInt(rng, 0, HEAVY_PAIRS.length - 1)];
    return { type: 'choice', story: `${light[0].toUpperCase() + light.slice(1)} and ${heavy}.`, prompt: 'Which is heavier?', choices: shuffle(rng, [light, heavy]), answer,
      explain: `${heavy[0].toUpperCase() + heavy.slice(1)} is heavier. It is harder to lift.`, visual: null, explainVisual: null };
  },
  'kl-taller': (rng) => {
    const [a, b] = distinctCounts(rng, 2, 9, randInt(rng, 2, 9));
    return { type: 'choice', story: null, prompt: 'Which is taller?', choices: shuffle(rng, [`tower:${a}`, `tower:${b}`]), answer: `tower:${Math.max(a, b)}`,
      explain: 'The taller one reaches higher.', visual: null, explainVisual: null };
  },
});

// Sorting into groups. Groups are shapes, because a child already knows those.
Object.assign(GENERATORS, {
  'ko-belongs': (rng) => {
    const sh = pickShape(rng); const other = otherShapes(rng, sh, 1)[0];
    return { type: 'choice', story: `This is the ${sh.name} group.`, prompt: 'Which one belongs in it?', choices: shuffle(rng, [`shape:${sh.name}`, `shape:${other.name}`]), answer: `shape:${sh.name}`,
      explain: `A ${sh.name} goes with the ${sh.name}s.`, visual: { kind: 'shape', name: sh.name }, explainVisual: null };
  },
  'ko-count-group': (rng) => {
    const n = randInt(rng, 1, 6); const sh = pickShape(rng);
    return { type: 'choice', story: `Here is the ${sh.name} group.`, prompt: 'How many are in it?', choices: shuffle(rng, distinctCounts(rng, 4, 8, n).map(String)), answer: String(n),
      explain: `Count the ${sh.name}s: ${countUp(n)}. There are ${n}.`, visual: { kind: 'dots', count: n }, explainVisual: null };
  },
  'ko-which-group-more': (rng) => {
    const [a, b] = distinctCounts(rng, 2, 8, randInt(rng, 1, 8));
    return { type: 'choice', story: `Circles: ${a}. Squares: ${b}.`, prompt: 'Which group has more?', choices: shuffle(rng, ['Circles', 'Squares']), answer: a > b ? 'Circles' : 'Squares',
      explain: `${Math.max(a, b)} is more than ${Math.min(a, b)}.`, visual: null, explainVisual: null };
  },
  'ko-does-not-belong': (rng) => {
    const sh = pickShape(rng); const odd = otherShapes(rng, sh, 1)[0];
    const choices = shuffle(rng, [`shape:${sh.name}#0`, `shape:${sh.name}#1`, `shape:${odd.name}#2`]);
    return { type: 'choice', story: `This is the ${sh.name} group.`, prompt: 'Which one does not belong?', choices, answer: choices.find((c) => c.startsWith(`shape:${odd.name}`)),
      explain: `The ${odd.name} does not belong with the ${sh.name}s.`, visual: null, explainVisual: null };
  },
  'ko-how-many-groups': (rng) => {
    const n = randInt(rng, 2, 3);
    const names = shuffle(rng, SHAPES.map((x) => x.name)).slice(0, n);
    return { type: 'choice', story: `${names.map((x) => x[0].toUpperCase() + x.slice(1)).join(', ')}.`, prompt: 'How many groups is that?', choices: ['2', '3', '4'], answer: String(n),
      explain: `${names.join(', ')}. That is ${n} kinds, so ${n} groups.`, visual: null, explainVisual: null };
  },
});

// Kindergarten number sense beyond counting. Every answer is arithmetic on the numbers
// drawn, so nothing here can be wrong. Stories use everyday things a child knows.
const KID_THINGS = ['apples', 'blocks', 'birds', 'cars', 'cookies', 'balls', 'ducks', 'stars', 'fish', 'hats'];
const kidThing = (rng) => KID_THINGS[randInt(rng, 0, KID_THINGS.length - 1)];
Object.assign(GENERATORS, {
  'km-one-more': (rng) => {
    const n = randInt(rng, 1, 9);
    return { type: 'choice', story: null, prompt: `One more than ${n} is?`, choices: shuffle(rng, distinctCounts(rng, 4, 10, n + 1).map(String)), answer: String(n + 1),
      explain: `${countWords(n)}, then ${countWords(n + 1)}. One more than ${n} is ${n + 1}.`, visual: { kind: 'dots', count: n }, explainVisual: { kind: 'dots', count: n + 1 } };
  },
  'km-one-less': (rng) => {
    const n = randInt(rng, 2, 10);
    return { type: 'choice', story: null, prompt: `One less than ${n} is?`, choices: shuffle(rng, distinctCounts(rng, 4, 10, n - 1).map(String)), answer: String(n - 1),
      explain: `Count back one from ${n}. One less than ${n} is ${n - 1}.`, visual: { kind: 'dots', count: n }, explainVisual: { kind: 'dots', count: n - 1 } };
  },
  'km-one-more-pic': (rng) => {
    const n = randInt(rng, 1, 9);
    return { type: 'choice', story: null, prompt: `Tap the group with one more than ${n}.`, choices: shuffle(rng, distinctCounts(rng, 3, 10, n + 1).map((c) => `dots:${c}`)), answer: `dots:${n + 1}`,
      explain: `This group has ${n + 1}. That is one more than ${n}.`, visual: { kind: 'dots', count: n }, explainVisual: null };
  },
  'km-one-less-pic': (rng) => {
    const n = randInt(rng, 2, 10);
    return { type: 'choice', story: null, prompt: `Tap the group with one less than ${n}.`, choices: shuffle(rng, distinctCounts(rng, 3, 10, n - 1).map((c) => `dots:${c}`)), answer: `dots:${n - 1}`,
      explain: `This group has ${n - 1}. That is one less than ${n}.`, visual: { kind: 'dots', count: n }, explainVisual: null };
  },
  'km-which-neighbour': (rng) => {
    const n = randInt(rng, 2, 9);
    const more = randInt(rng, 0, 1) === 1;
    const answer = String(more ? n + 1 : n - 1);
    return { type: 'choice', story: null, prompt: `Which is one ${more ? 'more' : 'less'} than ${n}?`, choices: shuffle(rng, [String(n - 1), String(n + 1), String(n)]), answer,
      explain: `One ${more ? 'more' : 'less'} than ${n} is ${answer}.`, visual: { kind: 'dots', count: n }, explainVisual: null };
  },
  'km-join-story': (rng) => {
    const a = randInt(rng, 1, 5); const b = randInt(rng, 1, 10 - a); const thing = kidThing(rng);
    return { type: 'choice', story: `${countWords(a)[0].toUpperCase() + countWords(a).slice(1)} ${thing}. Then ${b} more.`, prompt: 'How many now?', choices: shuffle(rng, distinctCounts(rng, 4, 10, a + b).map(String)), answer: String(a + b),
      explain: `${a} and ${b} more makes ${a + b}. Count them all: ${countUp(a + b)}.`, visual: { kind: 'dots', count: a }, explainVisual: { kind: 'dots', count: a + b } };
  },
  'km-take-story': (rng) => {
    const a = randInt(rng, 3, 10); const b = randInt(rng, 1, a - 1); const thing = kidThing(rng);
    return { type: 'choice', story: `${countWords(a)[0].toUpperCase() + countWords(a).slice(1)} ${thing}. Then ${b} go away.`, prompt: 'How many are left?', choices: shuffle(rng, distinctCounts(rng, 4, 10, a - b).map(String)), answer: String(a - b),
      explain: `${a} take away ${b} leaves ${a - b}. Count what is left: ${countUp(a - b)}.`, visual: { kind: 'dots', count: a }, explainVisual: { kind: 'dots', count: a - b } };
  },
  'km-join-pic': (rng) => {
    const a = randInt(rng, 1, 5); const b = randInt(rng, 1, 10 - a);
    return { type: 'choice', story: `${a} and ${b} more.`, prompt: 'Tap the group that shows them all together.', choices: shuffle(rng, distinctCounts(rng, 3, 10, a + b).map((c) => `dots:${c}`)), answer: `dots:${a + b}`,
      explain: `${a} and ${b} together is ${a + b}.`, visual: { kind: 'dots', count: a }, explainVisual: null };
  },
  'km-take-pic': (rng) => {
    const a = randInt(rng, 3, 10); const b = randInt(rng, 1, a - 1);
    return { type: 'choice', story: `${a}, then ${b} go away.`, prompt: 'Tap the group that shows what is left.', choices: shuffle(rng, distinctCounts(rng, 3, 10, a - b).map((c) => `dots:${c}`)), answer: `dots:${a - b}`,
      explain: `${a} take away ${b} leaves ${a - b}.`, visual: { kind: 'dots', count: a }, explainVisual: null };
  },
  'km-how-many-more': (rng) => {
    const total = randInt(rng, 3, 10); const have = randInt(rng, 1, total - 1); const thing = kidThing(rng);
    return { type: 'choice', story: `You have ${have} ${thing}. You want ${total}.`, prompt: 'How many more do you need?', choices: shuffle(rng, distinctCounts(rng, 4, 10, total - have).map(String)), answer: String(total - have),
      explain: `Count on from ${have} to ${total}. That is ${total - have} more.`, visual: { kind: 'dots', count: have }, explainVisual: { kind: 'dots', count: total } };
  },
  'km-bigger': (rng) => {
    const [a, b] = distinctCounts(rng, 2, 10, randInt(rng, 1, 10));
    return { type: 'choice', story: null, prompt: 'Which number is bigger?', choices: shuffle(rng, [String(a), String(b)]), answer: String(Math.max(a, b)),
      explain: `${Math.max(a, b)} comes later when you count, so it is bigger than ${Math.min(a, b)}.`, visual: null, explainVisual: { kind: 'dots', count: Math.max(a, b) } };
  },
  'km-smaller': (rng) => {
    const [a, b] = distinctCounts(rng, 2, 10, randInt(rng, 1, 10));
    return { type: 'choice', story: null, prompt: 'Which number is smaller?', choices: shuffle(rng, [String(a), String(b)]), answer: String(Math.min(a, b)),
      explain: `${Math.min(a, b)} comes first when you count, so it is smaller than ${Math.max(a, b)}.`, visual: null, explainVisual: { kind: 'dots', count: Math.min(a, b) } };
  },
  'km-more-less-same': (rng) => {
    const a = randInt(rng, 1, 10); const same = randInt(rng, 0, 2) === 0; const b = same ? a : distinctCounts(rng, 2, 10, a)[1];
    const answer = a > b ? 'More' : a < b ? 'Less' : 'The same';
    return { type: 'choice', story: `This group has ${a}. The other group has ${b}.`, prompt: 'Is this group more, less, or the same?', choices: ['More', 'Less', 'The same'], answer,
      explain: answer === 'The same' ? `${a} and ${b} are the same.` : `${a} is ${answer.toLowerCase()} than ${b}.`, visual: { kind: 'dots', count: a }, explainVisual: null };
  },
  'km-make-more': (rng) => {
    const n = randInt(rng, 1, 8);
    const bigger = distinctCounts(rng, 3, 10, randInt(rng, n + 1, 10)).filter((c) => c !== n);
    const right = bigger.find((c) => c > n);
    const choices = shuffle(rng, [right, ...distinctCounts(rng, 3, n, n).slice(0, 2)].map((c) => `dots:${c}`));
    return { type: 'choice', story: `Here are ${n}.`, prompt: 'Tap a group that has more than this.', choices, answer: `dots:${right}`,
      explain: `${right} is more than ${n}.`, visual: { kind: 'dots', count: n }, explainVisual: null };
  },
  'km-make-fewer': (rng) => {
    const n = randInt(rng, 3, 10);
    const right = randInt(rng, 1, n - 1);
    const others = distinctCounts(rng, 3, 10, randInt(rng, n, 10)).filter((c) => c >= n).slice(0, 2);
    const choices = shuffle(rng, [right, ...others].map((c) => `dots:${c}`));
    return { type: 'choice', story: `Here are ${n}.`, prompt: 'Tap a group that has fewer than this.', choices, answer: `dots:${right}`,
      explain: `${right} is fewer than ${n}.`, visual: { kind: 'dots', count: n }, explainVisual: null };
  },
});

// Syllables. The count is given per word so it can be re-checked without a dictionary.
const SYLLABLE_WORDS = [
  ['cat', 1], ['dog', 1], ['sun', 1], ['hat', 1], ['fish', 1], ['ball', 1],
  ['rabbit', 2], ['apple', 2], ['window', 2], ['pencil', 2], ['monkey', 2], ['tiger', 2],
  ['banana', 3], ['elephant', 3], ['umbrella', 3], ['butterfly', 3],
];
const SYL_SPLIT = { rabbit: 'rab bit', apple: 'ap ple', window: 'win dow', pencil: 'pen cil', monkey: 'mon key', tiger: 'ti ger', banana: 'ba na na', elephant: 'el e phant', umbrella: 'um brel la', butterfly: 'but ter fly' };
const sylWord = (rng, n) => pick(rng, SYLLABLE_WORDS.filter(([, c]) => !n || c === n));
Object.assign(GENERATORS, {
  'ry-how-many-claps': (rng) => {
    const [w, n] = sylWord(rng);
    return { type: 'choice', story: `Say it slowly: ${w}.`, prompt: 'How many claps?', choices: ['1', '2', '3'], answer: String(n),
      explain: `${SYL_SPLIT[w] || w}. ${n} ${n === 1 ? 'clap' : 'claps'}.`, visual: { kind: 'letters', text: w }, explainVisual: null };
  },
  'ry-pick-two': (rng) => {
    const [w] = sylWord(rng, 2); const [o] = sylWord(rng, 1);
    return { type: 'choice', story: null, prompt: 'Which word has two claps?', choices: shuffle(rng, [w, o]), answer: w,
      explain: `${SYL_SPLIT[w]}. Two claps. ${o} has one.`, visual: null, explainVisual: null };
  },
  'ry-pick-one': (rng) => {
    const [w] = sylWord(rng, 1); const [o] = sylWord(rng, randInt(rng, 2, 3));
    return { type: 'choice', story: null, prompt: 'Which word has one clap?', choices: shuffle(rng, [w, o]), answer: w,
      explain: `${w}. One clap. ${o} has more.`, visual: null, explainVisual: null };
  },
  'ry-more-claps': (rng) => {
    const [a, na] = sylWord(rng); let [b, nb] = sylWord(rng); let guard = 0;
    while (nb === na && guard++ < 20) [b, nb] = sylWord(rng);
    if (nb === na) [b, nb] = sylWord(rng, na === 1 ? 3 : 1);
    const answer = na > nb ? a : b;
    return { type: 'choice', story: `${a[0].toUpperCase() + a.slice(1)} and ${b}.`, prompt: 'Which word has more claps?', choices: shuffle(rng, [a, b]), answer,
      explain: `${answer} has ${Math.max(na, nb)} claps.`, visual: null, explainVisual: null };
  },
  'ry-same-claps': (rng) => {
    const n = randInt(rng, 1, 3);
    const [a] = sylWord(rng, n); let [b] = sylWord(rng, n); let guard = 0;
    while (b === a && guard++ < 20) [b] = sylWord(rng, n);
    const [o] = sylWord(rng, n === 1 ? 2 : 1);
    return { type: 'choice', story: `Listen: ${a}.`, prompt: 'Which word has the same number of claps?', choices: shuffle(rng, [b, o]), answer: b,
      explain: `${a} and ${b} both have ${n} ${n === 1 ? 'clap' : 'claps'}.`, visual: { kind: 'letters', text: a }, explainVisual: null };
  },
});

// Sounding out. Three-sound words where every letter says its plain sound.
const CVC_WORDS = ['cat', 'dog', 'sun', 'hat', 'pig', 'bed', 'cup', 'map', 'net', 'top', 'bus', 'fan', 'hen', 'jam', 'log', 'mud', 'pen', 'red', 'sit', 'wig'];
Object.assign(GENERATORS, {
  'rd-blend': (rng) => {
    const w = pick(rng, CVC_WORDS);
    const others = shuffle(rng, CVC_WORDS.filter((x) => x !== w)).slice(0, 2);
    return { type: 'choice', story: `${w[0]}, ${w[1]}, ${w[2]}.`, prompt: 'Say the sounds fast. Which word is it?', choices: shuffle(rng, [w, ...others]), answer: w,
      explain: `${w[0]}, ${w[1]}, ${w[2]}. ${w}.`, visual: { kind: 'letters', text: w.split('').join(' ') }, explainVisual: null };
  },
  'rd-first-sound': (rng) => {
    const w = pick(rng, CVC_WORDS);
    return { type: 'choice', story: `Listen: ${w}.`, prompt: 'What is the first sound?', choices: shuffle(rng, [w[0], w[1], w[2]]).filter((c, i, arr) => arr.indexOf(c) === i), answer: w[0],
      explain: `${w} starts with ${w[0]}.`, visual: { kind: 'letters', text: w }, explainVisual: null };
  },
  'rd-last-sound': (rng) => {
    const w = pick(rng, CVC_WORDS);
    return { type: 'choice', story: `Listen: ${w}.`, prompt: 'What is the last sound?', choices: shuffle(rng, [w[0], w[1], w[2]]).filter((c, i, arr) => arr.indexOf(c) === i), answer: w[2],
      explain: `${w} ends with ${w[2]}.`, visual: { kind: 'letters', text: w }, explainVisual: null };
  },
  'rd-middle-sound': (rng) => {
    const w = pick(rng, CVC_WORDS);
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return { type: 'choice', story: `Listen: ${w}.`, prompt: 'What is the middle sound?', choices: shuffle(rng, [w[1], ...shuffle(rng, vowels.filter((v) => v !== w[1])).slice(0, 2)]), answer: w[1],
      explain: `${w[0]}, ${w[1]}, ${w[2]}. The middle sound is ${w[1]}.`, visual: { kind: 'letters', text: w }, explainVisual: null };
  },
  'rd-which-word': (rng) => {
    const w = pick(rng, CVC_WORDS);
    const near = CVC_WORDS.filter((x) => x !== w && (x[0] === w[0] || x[2] === w[2]));
    const others = shuffle(rng, near.length >= 2 ? near : CVC_WORDS.filter((x) => x !== w)).slice(0, 2);
    return { type: 'choice', story: `Read: ${w.split('').join(' ')}.`, prompt: 'Which word did you read?', choices: shuffle(rng, [w, ...others]), answer: w,
      explain: `${w[0]}, ${w[1]}, ${w[2]} makes ${w}.`, visual: { kind: 'letters', text: w.split('').join(' ') }, explainVisual: null };
  },
});

// Which way we read. A line of three or four short words; the child says which comes first.
const READ_LINES = [['the', 'cat', 'sat'], ['I', 'see', 'a', 'dog'], ['we', 'can', 'run'], ['my', 'red', 'hat'], ['big', 'fish', 'swim'], ['go', 'up', 'the', 'hill']];
Object.assign(GENERATORS, {
  'rw-first': (rng) => {
    const line = pick(rng, READ_LINES);
    return { type: 'choice', story: `${line.join(' ')}`, prompt: 'Which word do we read first?', choices: shuffle(rng, [...new Set(line)]), answer: line[0],
      explain: `We start on the left. The first word is ${line[0]}.`, visual: { kind: 'letters', text: line.join(' ') }, explainVisual: null };
  },
  'rw-last': (rng) => {
    const line = pick(rng, READ_LINES);
    return { type: 'choice', story: `${line.join(' ')}`, prompt: 'Which word do we read last?', choices: shuffle(rng, [...new Set(line)]), answer: line[line.length - 1],
      explain: `We end on the right. The last word is ${line[line.length - 1]}.`, visual: { kind: 'letters', text: line.join(' ') }, explainVisual: null };
  },
  'rw-next': (rng) => {
    const line = pick(rng, READ_LINES); const i = randInt(rng, 0, line.length - 2);
    return { type: 'choice', story: `${line.join(' ')}`, prompt: `Which word comes right after ${line[i]}?`, choices: shuffle(rng, [...new Set(line)].filter((w) => w !== line[i])), answer: line[i + 1],
      explain: `After ${line[i]} comes ${line[i + 1]}, moving right.`, visual: { kind: 'letters', text: line.join(' ') }, explainVisual: null };
  },
  'rw-count-words': (rng) => {
    const line = pick(rng, READ_LINES);
    return { type: 'choice', story: `${line.join(' ')}`, prompt: 'How many words?', choices: ['3', '4', '5'], answer: String(line.length),
      explain: `${line.join(', ')}. That is ${line.length} words.`, visual: { kind: 'letters', text: line.join(' ') }, explainVisual: null };
  },
  'rw-which-way': (rng) => {
    const yes = randInt(rng, 0, 1) === 1;
    return { type: 'choice', story: yes ? 'We read from left to right.' : 'We read from right to left.', prompt: 'Is that right?', choices: ['Yes', 'No'], answer: yes ? 'Yes' : 'No',
      explain: 'We read from left to right, then down to the next line.', visual: { kind: 'letters', text: 'A B C' }, explainVisual: null };
  },
});

// Word meanings from pictures. The pictures are the shapes and counts the child already knows.
const MEANING_ITEMS = [
  { word: 'circle', visual: { kind: 'shape', name: 'circle' } }, { word: 'square', visual: { kind: 'shape', name: 'square' } },
  { word: 'triangle', visual: { kind: 'shape', name: 'triangle' } }, { word: 'rectangle', visual: { kind: 'shape', name: 'rectangle' } },
  { word: 'ball', visual: { kind: 'solid', name: 'sphere' } }, { word: 'box', visual: { kind: 'solid', name: 'cube' } },
  { word: 'can', visual: { kind: 'solid', name: 'cylinder' } }, { word: 'cone', visual: { kind: 'solid', name: 'cone' } },
];
const NUMBER_WORDS = ['one', 'two', 'three', 'four', 'five', 'six'];
Object.assign(GENERATORS, {
  'rm-match-picture': (rng) => {
    const it = pick(rng, MEANING_ITEMS);
    const others = shuffle(rng, MEANING_ITEMS.filter((x) => x.word !== it.word)).slice(0, 2);
    return { type: 'choice', story: null, prompt: 'Which word goes with the picture?', choices: shuffle(rng, [it.word, ...others.map((x) => x.word)]), answer: it.word,
      explain: `The picture shows a ${it.word}.`, visual: it.visual, explainVisual: null };
  },
  'rm-pick-word': (rng) => {
    const it = pick(rng, MEANING_ITEMS);
    const others = shuffle(rng, MEANING_ITEMS.filter((x) => x.word !== it.word)).slice(0, 2);
    const key = (x) => `${x.visual.kind}:${x.visual.name}`;
    return { type: 'choice', story: `The word is ${it.word}.`, prompt: 'Tap the picture that matches.', choices: shuffle(rng, [it, ...others].map(key)), answer: key(it),
      explain: `${it.word[0].toUpperCase() + it.word.slice(1)} looks like this.`, visual: null, explainVisual: null };
  },
  'rm-does-match': (rng) => {
    const it = pick(rng, MEANING_ITEMS); const yes = randInt(rng, 0, 1) === 1;
    const shown = yes ? it : pick(rng, MEANING_ITEMS.filter((x) => x.word !== it.word));
    return { type: 'choice', story: `The word says ${it.word}.`, prompt: 'Does the picture match?', choices: ['Yes', 'No'], answer: yes ? 'Yes' : 'No',
      explain: yes ? `The picture shows a ${it.word}. They match.` : `The picture shows a ${shown.word}, not a ${it.word}.`, visual: shown.visual, explainVisual: null };
  },
  'rm-count-word': (rng) => {
    const n = randInt(rng, 1, 6);
    return { type: 'choice', story: null, prompt: 'Which word tells how many?', choices: shuffle(rng, distinctCounts(rng, 3, 6, n).map((c) => NUMBER_WORDS[c - 1])), answer: NUMBER_WORDS[n - 1],
      explain: `${countUp(n)}. The word is ${NUMBER_WORDS[n - 1]}.`, visual: { kind: 'dots', count: n }, explainVisual: null };
  },
  'rm-shape-word': (rng) => {
    const it = pick(rng, MEANING_ITEMS.slice(0, 4));
    return { type: 'choice', story: `Read the word: ${it.word}.`, prompt: 'Tap that shape.', choices: shuffle(rng, [it, ...shuffle(rng, MEANING_ITEMS.slice(0, 4).filter((x) => x.word !== it.word)).slice(0, 2)].map((x) => `shape:${x.visual.name}`)), answer: `shape:${it.visual.name}`,
      explain: `${it.word[0].toUpperCase() + it.word.slice(1)}. This is the ${it.word}.`, visual: null, explainVisual: null };
  },
});


// Letter questions. Choices are single letters; the screen shows them large and the voice names them.
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Strokes for tracing, on a 100 by 100 grid. Each stroke is a list of points from its
// starting dot. A letter is traced when the finger's path stays near every stroke in
// turn. Straight-line letters first, because they are easiest to form.
export const TRACE_LETTERS = {
  L: { strokes: [[[30, 15], [30, 85]], [[30, 85], [75, 85]]] },
  T: { strokes: [[[20, 15], [80, 15]], [[50, 15], [50, 85]]] },
  I: { strokes: [[[50, 15], [50, 85]]] },
  H: { strokes: [[[25, 15], [25, 85]], [[75, 15], [75, 85]], [[25, 50], [75, 50]]] },
  E: { strokes: [[[30, 15], [30, 85]], [[30, 15], [75, 15]], [[30, 50], [65, 50]], [[30, 85], [75, 85]]] },
  F: { strokes: [[[30, 15], [30, 85]], [[30, 15], [75, 15]], [[30, 50], [65, 50]]] },
  V: { strokes: [[[20, 15], [50, 85], [80, 15]]] },
  A: { strokes: [[[50, 15], [20, 85]], [[50, 15], [80, 85]], [[32, 60], [68, 60]]] },
  N: { strokes: [[[25, 85], [25, 15], [75, 85], [75, 15]]] },
  M: { strokes: [[[20, 85], [20, 15], [50, 60], [80, 15], [80, 85]]] },
  O: { strokes: [[[50, 15], [22, 30], [15, 50], [22, 70], [50, 85], [78, 70], [85, 50], [78, 30], [50, 15]]] },
  C: { strokes: [[[78, 28], [50, 15], [22, 30], [15, 50], [22, 70], [50, 85], [78, 72]]] },
};
const TRACE_EASY = ['L', 'T', 'I', 'H', 'E', 'F'];
const TRACE_MEDIUM = ['V', 'A', 'N', 'M'];
const TRACE_ANY = Object.keys(TRACE_LETTERS);

// Was the traced path close enough? Every stroke must be visited in order: for each
// point along a stroke, some drawn point must lie within `tolerance` grid units. This
// forgives a wobbly hand but not a letter drawn in the wrong shape.
export function traceMatches(letter, paths, tolerance = 14) {
  const def = TRACE_LETTERS[letter];
  if (!def || !Array.isArray(paths) || paths.length === 0) return false;
  const drawn = paths.flat();
  if (drawn.length < 4) return false;
  const near = (p) => drawn.some(([x, y]) => Math.hypot(x - p[0], y - p[1]) <= tolerance);
  const sample = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n]);
  for (const stroke of def.strokes) {
    for (let i = 1; i < stroke.length; i++) {
      for (const p of sample(stroke[i - 1], stroke[i], 6)) if (!near(p)) return false;
    }
  }
  // And the drawing must not be a scribble over everything: it should not wander far
  // from the letter. Most drawn points should be near some stroke.
  const strokePoints = def.strokes.flatMap((st) => st.flatMap((p, i) => (i === 0 ? [p] : sample(st[i - 1], p, 8))));
  const onLetter = drawn.filter(([x, y]) => strokePoints.some((p) => Math.hypot(x - p[0], y - p[1]) <= tolerance + 6)).length;
  return onLetter / drawn.length >= 0.7;
}

// A tracing question. The answer is the letter; the screen checks the finger path with traceMatches.
function traceQuestion(letters) {
  return (rng) => {
    const L = pick(rng, letters);
    return { type: 'trace', story: null, prompt: `Trace the letter ${L}.`, choices: [], answer: L,
      explain: `That is ${L}. Start at the dot and follow the arrow.`, visual: { kind: 'letters', text: L }, explainVisual: null };
  };
}
Object.assign(GENERATORS, {
  'rt-trace-easy': traceQuestion(TRACE_EASY),
  'rt-trace-medium': traceQuestion(TRACE_MEDIUM),
  'rt-trace-any': traceQuestion(TRACE_ANY),
});
// Words a kindergartener knows, each starting with one clear consonant sound.
const SOUND_WORDS = [
  { word: 'moon', letter: 'M', sound: 'mmm' }, { word: 'map', letter: 'M', sound: 'mmm' },
  { word: 'sun', letter: 'S', sound: 'sss' }, { word: 'sock', letter: 'S', sound: 'sss' },
  { word: 'fish', letter: 'F', sound: 'fff' }, { word: 'fan', letter: 'F', sound: 'fff' },
  { word: 'bed', letter: 'B', sound: 'buh' }, { word: 'ball', letter: 'B', sound: 'buh' },
  { word: 'dog', letter: 'D', sound: 'duh' }, { word: 'duck', letter: 'D', sound: 'duh' },
  { word: 'top', letter: 'T', sound: 'tuh' }, { word: 'tap', letter: 'T', sound: 'tuh' },
  { word: 'pig', letter: 'P', sound: 'puh' }, { word: 'pan', letter: 'P', sound: 'puh' },
  { word: 'nut', letter: 'N', sound: 'nnn' }, { word: 'net', letter: 'N', sound: 'nnn' },
];
// Families of words that end the same way. Every word is one a child can say.
const RHYME_FAMILIES = [
  ['cat', 'hat', 'bat', 'mat'], ['dog', 'log', 'fog', 'jog'], ['sun', 'bun', 'run', 'fun'],
  ['pig', 'wig', 'dig', 'big'], ['hen', 'pen', 'ten', 'men'], ['cup', 'pup', 'up'],
  ['bed', 'red', 'fed'], ['top', 'hop', 'mop', 'pop'],
];
const SHORT_WORDS = ['CAT', 'DOG', 'SUN', 'BED', 'PIG', 'HAT', 'CUP', 'MAP', 'BUS', 'FOX', 'JAM', 'LEG', 'NET', 'RUG', 'WEB'];
function otherLetters(rng, howMany, exclude) {
  const out = [];
  let guard = 0;
  while (out.length < howMany && guard++ < 100) { const L = ALPHABET[randInt(rng, 0, 25)]; if (L !== exclude && !out.includes(L)) out.push(L); }
  return out;
}
Object.assign(GENERATORS, {
  'r-tap-letter': (rng) => {
    const L = ALPHABET[randInt(rng, 0, 25)];
    return { type: 'choice', story: null, prompt: `Tap the letter ${L}.`, choices: shuffle(rng, [L, ...otherLetters(rng, 3, L)]), answer: L,
      explain: `This is ${L}.`, visual: null, explainVisual: null };
  },
  'r-after': (rng) => {
    const i = randInt(rng, 0, 24);
    const L = ALPHABET[i]; const next = ALPHABET[i + 1];
    return { type: 'choice', story: null, prompt: `What letter comes after ${L}?`, choices: shuffle(rng, [next, ...otherLetters(rng, 3, next).filter((x) => x !== L).slice(0, 3)]), answer: next,
      explain: `${L}, then ${next}. ${next} comes after ${L}.`, visual: { kind: 'letters', text: ALPHABET.slice(Math.max(0, i - 2), i + 3).split('').join(' ') }, explainVisual: null };
  },
  'r-before': (rng) => {
    const i = randInt(rng, 1, 25);
    const L = ALPHABET[i]; const prev = ALPHABET[i - 1];
    return { type: 'choice', story: null, prompt: `What letter comes before ${L}?`, choices: shuffle(rng, [prev, ...otherLetters(rng, 3, prev).filter((x) => x !== L).slice(0, 3)]), answer: prev,
      explain: `${prev}, then ${L}. ${prev} comes before ${L}.`, visual: { kind: 'letters', text: ALPHABET.slice(Math.max(0, i - 2), i + 3).split('').join(' ') }, explainVisual: null };
  },
  'r-first-letter': (rng) => {
    const word = pick(rng, SHORT_WORDS);
    const L = word[0];
    return { type: 'choice', story: `Look at the word ${word}.`, prompt: 'Tap its first letter.', choices: shuffle(rng, [L, ...otherLetters(rng, 3, L)]), answer: L,
      explain: `${word} starts with ${L}.`, visual: { kind: 'letters', text: word }, explainVisual: null };
  },
  // Letter sounds. Each word starts with a plain consonant sound a child can hear.
  // The sound words below are spoken; the letter is what the child taps.
  'rs-word-starts': (rng) => {
    const w = pick(rng, SOUND_WORDS);
    return { type: 'choice', story: `Listen: ${w.word}.`, prompt: 'What letter does it start with?', choices: shuffle(rng, [w.letter, ...otherLetters(rng, 3, w.letter)]), answer: w.letter,
      explain: `${w.word} starts with ${w.letter}. ${w.letter} says ${w.sound}.`, visual: { kind: 'letters', text: w.word }, explainVisual: null };
  },
  'rs-letter-for-sound': (rng) => {
    const w = pick(rng, SOUND_WORDS);
    return { type: 'choice', story: `Which letter says ${w.sound}?`, prompt: 'Tap it.', choices: shuffle(rng, [w.letter, ...otherLetters(rng, 3, w.letter)]), answer: w.letter,
      explain: `${w.letter} says ${w.sound}, like ${w.word}.`, visual: null, explainVisual: null };
  },
  'rs-pick-word': (rng) => {
    const w = pick(rng, SOUND_WORDS);
    const others = shuffle(rng, SOUND_WORDS.filter((x) => x.letter !== w.letter)).slice(0, 2).map((x) => x.word);
    return { type: 'choice', story: `${w.letter} says ${w.sound}.`, prompt: `Which word starts with ${w.letter}?`, choices: shuffle(rng, [w.word, ...others]), answer: w.word,
      explain: `${w.word} starts with ${w.sound}. That is ${w.letter}.`, visual: { kind: 'letters', text: w.letter }, explainVisual: null };
  },
  'rs-same-start': (rng) => {
    const w = pick(rng, SOUND_WORDS);
    const twin = pick(rng, SOUND_WORDS.filter((x) => x.letter === w.letter && x.word !== w.word)) || w;
    const other = pick(rng, SOUND_WORDS.filter((x) => x.letter !== w.letter));
    return { type: 'choice', story: `Listen: ${w.word}.`, prompt: 'Which word starts the same way?', choices: shuffle(rng, [twin.word, other.word]), answer: twin.word,
      explain: `${w.word} and ${twin.word} both start with ${w.sound}.`, visual: { kind: 'letters', text: w.word }, explainVisual: null };
  },
  'rs-odd-start': (rng) => {
    const w = pick(rng, SOUND_WORDS);
    const twin = pick(rng, SOUND_WORDS.filter((x) => x.letter === w.letter && x.word !== w.word)) || w;
    const odd = pick(rng, SOUND_WORDS.filter((x) => x.letter !== w.letter));
    return { type: 'choice', story: 'Two start the same way.', prompt: 'Which one starts differently?', choices: shuffle(rng, [w.word, twin.word, odd.word]), answer: odd.word,
      explain: `${w.word} and ${twin.word} start with ${w.sound}. ${odd.word} starts with ${odd.sound}.`, visual: null, explainVisual: null };
  },
// Rhymes. Each family is a set of words that end the same way.
  'rr-does-rhyme': (rng) => {
    const fam = pick(rng, RHYME_FAMILIES); const [a, b] = shuffle(rng, fam).slice(0, 2);
    const yes = randInt(rng, 0, 1) === 1;
    const c = yes ? b : pick(rng, pick(rng, RHYME_FAMILIES.filter((f) => f !== fam)));
    return { type: 'choice', story: `${a}. ${c}.`, prompt: 'Do they rhyme?', choices: ['Yes', 'No'], answer: yes ? 'Yes' : 'No',
      explain: yes ? `${a} and ${c} end the same way. They rhyme.` : `${a} and ${c} end differently. They do not rhyme.`, visual: { kind: 'letters', text: `${a} ${c}` }, explainVisual: null };
  },
  'rr-pick-rhyme': (rng) => {
    const fam = pick(rng, RHYME_FAMILIES); const [a, b] = shuffle(rng, fam).slice(0, 2);
    const others = shuffle(rng, RHYME_FAMILIES.filter((f) => f !== fam)).slice(0, 2).map((f) => pick(rng, f));
    return { type: 'choice', story: `Listen: ${a}.`, prompt: 'Which word rhymes with it?', choices: shuffle(rng, [b, ...others]), answer: b,
      explain: `${a} and ${b} rhyme. They end the same way.`, visual: { kind: 'letters', text: a }, explainVisual: null };
  },
  'rr-odd-rhyme': (rng) => {
    const fam = pick(rng, RHYME_FAMILIES); const [a, b] = shuffle(rng, fam).slice(0, 2);
    const odd = pick(rng, pick(rng, RHYME_FAMILIES.filter((f) => f !== fam)));
    return { type: 'choice', story: 'Two of these rhyme.', prompt: 'Which one does not?', choices: shuffle(rng, [a, b, odd]), answer: odd,
      explain: `${a} and ${b} rhyme. ${odd} does not.`, visual: null, explainVisual: null };
  },
  'rr-same-end': (rng) => {
    const fam = pick(rng, RHYME_FAMILIES); const [a, b] = shuffle(rng, fam).slice(0, 2);
    const ending = a.slice(-2);
    const others = shuffle(rng, RHYME_FAMILIES.filter((f) => f !== fam)).slice(0, 2).map((f) => pick(rng, f));
    return { type: 'choice', story: `${a} ends with ${ending}.`, prompt: `Which word also ends with ${ending}?`, choices: shuffle(rng, [b, ...others]), answer: b,
      explain: `${b} ends with ${ending} too. ${a} and ${b} rhyme.`, visual: { kind: 'letters', text: a }, explainVisual: null };
  },
  'rr-which-two': (rng) => {
    const fam = pick(rng, RHYME_FAMILIES); const [a, b] = shuffle(rng, fam).slice(0, 2);
    const odd = pick(rng, pick(rng, RHYME_FAMILIES.filter((f) => f !== fam)));
    const pair = `${a} and ${b}`;
    const wrong1 = `${a} and ${odd}`; const wrong2 = `${b} and ${odd}`;
    return { type: 'choice', story: `${a}, ${b}, ${odd}.`, prompt: 'Which two rhyme?', choices: shuffle(rng, [pair, wrong1, wrong2]), answer: pair,
      explain: `${a} and ${b} end the same way.`, visual: null, explainVisual: null };
  },
  'r-count-letters': (rng) => {
    const word = pick(rng, SHORT_WORDS);
    const n = word.length;
    return { type: 'choice', story: `Look at the word ${word}.`, prompt: 'How many letters?', choices: shuffle(rng, ['2', '3', '4', '5']), answer: String(n),
      explain: `${word.split('').join(', ')}. That is ${n} letters.`, visual: { kind: 'letters', text: word }, explainVisual: null };
  },
  'r-match-small': (rng) => {
    const L = ALPHABET[randInt(rng, 0, 25)];
    return { type: 'choice', story: `This is big ${L}.`, prompt: `Tap small ${L}.`, choices: shuffle(rng, [L.toLowerCase(), ...otherLetters(rng, 3, L).map((x) => x.toLowerCase())]), answer: L.toLowerCase(),
      explain: `Big ${L} and small ${L.toLowerCase()} are the same letter.`, visual: { kind: 'letters', text: L }, explainVisual: null };
  },
  'r-match-big': (rng) => {
    const L = ALPHABET[randInt(rng, 0, 25)];
    return { type: 'choice', story: `This is small ${L.toLowerCase()}.`, prompt: `Tap big ${L}.`, choices: shuffle(rng, [L, ...otherLetters(rng, 3, L)]), answer: L,
      explain: `Small ${L.toLowerCase()} and big ${L} are the same letter.`, visual: { kind: 'letters', text: L.toLowerCase() }, explainVisual: null };
  },
});

// Two fractions with different bottom numbers and different amounts.
function pickDifferentPair(rng) {
  const denoms = [2, 3, 4, 5, 6, 8, 10];
  let x; let y; let guard = 0;
  do {
    const b = pick(rng, denoms);
    let d = pick(rng, denoms);
    while (d === b) d = pick(rng, denoms);
    x = frac(randInt(rng, 1, b - 1), b);
    y = frac(randInt(rng, 1, d - 1), d);
  } while (fracEqual(x, y) && guard++ < 100);
  return { x, y };
}

function explainCommonDenominator(x, y, bigger) {
  const L = lcm(x.d, y.d);
  const xTop = (x.n * L) / x.d;
  const yTop = (y.n * L) / y.d;
  return `Rename both with the bottom number ${L}: ${fracText(x)} = ${xTop}/${L} and ${fracText(y)} = ${yTop}/${L}. ${Math.max(xTop, yTop)} is the bigger top, so ${fracText(bigger)} is bigger.`;
}

// Turns a choice like 'dots:4' into words a child can hear: "the group with 4".
export function describeChoice(choice) {
  const m = /^dots:(\d+)$/.exec(choice);
  return m ? `the group with ${m[1]}` : choice;
}

export function generateQuestion(genId, seed) {
  const generator = GENERATORS[genId];
  if (!generator) throw new Error(`Unknown question generator: ${genId}`);
  return { genId, seed, ...generator(makeRng(seed)) };
}

// ---------------------------------------------------------------------
// 5. WONDER — open questions with no right answer
//    Shown after a module is mastered. Never graded, never gating.
//    A child's own words are NEVER stored (compliance rule); only that a
//    reflection happened, how long it took, and roughly how much was written.
//    Every prompt and every perspective below was written and approved by a
//    human. Perspectives are shown side by side and none is declared right;
//    none takes a side for or against religion or non-belief.
// ---------------------------------------------------------------------
export const WONDER = [
  {
    id: 'w-one-thing',
    theme: 'ups-and-downs',
    stage: 'growing',
    courseIds: ['fractions-intro'],
    answerMode: 'typed',
    prompt: 'If you cut a cookie into pieces, is it still one cookie, or is it now many things? What makes something "one thing"?',
    perspectives: [
      { voice: 'A scientist', says: 'The amount of cookie is exactly the same before and after you cut it. Nothing was added and nothing was taken away. Whether we call the result one thing or many things is a choice about how we are counting, and different ways of counting turn out to be useful for different jobs.' },
      { voice: 'An artist', says: 'A whole cookie and a pile of crumbs are both worth looking at, just in different ways. Breaking something apart can reveal shapes and patterns that were hidden while it was whole. Sometimes you have to take a thing apart before you can really see it.' },
      { voice: 'A grandparent of faith', says: 'Many traditions teach that wholeness is about far more than the number of pieces something has. A family is still one family even when everybody is in a different room. What holds a thing together is not always something you can see.' },
      { voice: 'A skeptic', says: 'Maybe "one thing" is simply a phrase we find handy, rather than a fact about the world. Before agreeing or disagreeing, I would want to know how we could test it. What would we measure to find out whether something really counts as one?' },
    ],
    closing: 'What would you count it as, and why? Is there a question hiding in here that nobody has fully answered yet?',
  },
  {
    id: 'w-doubling',
    theme: 'world',
    stage: 'growing',
    courseIds: ['multiplication-3'],
    answerMode: 'typed',
    prompt: 'If you keep doubling something, does it ever stop getting bigger? Could there be a number too big to imagine?',
    perspectives: [
      { voice: 'A scientist', says: 'Doubling never has to stop. You can always double again, and the number gets bigger every time. There are numbers so large that no one has ever written them out, and they are still just as real as the number three.' },
      { voice: 'An artist', says: 'Try drawing it on a page. One dot, then two, then four, then eight. Very quickly the page is full and you have to imagine the rest. That moment, when the picture stops and the imagining starts, is where art lives.' },
      { voice: 'A grandparent of faith', says: 'People have long used very big numbers to talk about things that feel endless, like stars in the sky or the sand on a beach. When something is too big to count, some of us feel wonder rather than worry, and either feeling is a fine place to start.' },
      { voice: 'A skeptic', says: 'I would want to be careful with the word imagine. We can name a number without picturing it. So is there a number too big to imagine, or only too big to picture? Those might not be the same thing.' },
    ],
    closing: 'What is the biggest number you can think of? Now double it. What just happened?',
  },
  {
    id: 'w-favourite-colour',
    theme: 'feelings',
    stage: 'early',
    courseIds: ['first-steps-pk'],
    answerMode: 'pick',
    prompt: 'Which color makes you happiest?',
    options: ['Red', 'Blue', 'Yellow', 'Green'],
    simple: [
      { voice: 'An artist says', says: 'Every color is somebody\'s favorite.' },
      { voice: 'A scientist says', says: 'Your eyes see colors. Your heart picks one.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Colors are light bouncing off things into your eyes. Every person sees them a little differently, so the color that makes you happiest might look a little different to someone else.' },
      { voice: 'An artist', says: 'Painters spend their whole lives choosing colors. There is no wrong favorite. The one you picked can be the start of your very first painting.' },
      { voice: 'A grandparent of faith', says: 'Many people see the colors of the world as a gift to be enjoyed. Whatever you believe, it is a fine thing to stop and notice a color you love.' },
      { voice: 'A skeptic', says: 'Would you pick the same color tomorrow? It might change, and that is interesting. Try asking yourself again next week and see.' },
    ],
    closing: 'What is one thing that is your favorite color?',
  },
  {
    id: 'w-biggest-number',
    theme: 'world',
    stage: 'early',
    courseIds: ['numbers-1'],
    answerMode: 'pick',
    prompt: 'Is there a biggest number of all?',
    options: ['Yes', 'No', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Whatever number you say, you can always add one more.' },
      { voice: 'An artist says', says: 'Try to draw the biggest number. You will run out of paper first.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Whatever number you name, you can always add one more, and that number is bigger. So there is no biggest number. People have thought hard about this for a very long time, and it still surprises most of us.' },
      { voice: 'An artist', says: 'Try drawing the biggest number you can as dots on a page. You will run out of paper long before you run out of numbers. That feeling of running out is a good one to sit with.' },
      { voice: 'A grandparent of faith', says: 'Some people find comfort in the idea that numbers never end. It reminds them that the world is bigger than what we can hold in our heads. That is a fine thing to wonder about at any age.' },
      { voice: 'A skeptic', says: 'How would we check? If someone told me they had found the biggest number, I would ask them to add one to it. If they could, they were wrong. That is a test anyone can do.' },
    ],
    closing: 'What is the biggest number you can say? Now say the one after it.',
  },
  {
    id: 'w-story-true',
    theme: 'world',
    stage: 'early',
    courseIds: ['reading-1'],
    answerMode: 'pick',
    prompt: 'Can a story be true and made up at the same time?',
    options: ['Yes', 'No', 'Not sure'],
    simple: [
      { voice: 'An artist says', says: 'A made-up story can still tell you something true.' },
      { voice: 'A scientist says', says: 'The dog in the story is not real. The feeling might be.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'The dog in a story did not really run to the box, because there is no dog. But a story can still show something true about how dogs behave or how people feel. The events are made up while the idea inside them is not.' },
      { voice: 'An artist', says: 'Made-up stories are how people have always shared what is true about being alive. A story about a brave mouse can make a real child feel braver. That is a real effect from a made-up thing.' },
      { voice: 'A grandparent of faith', says: 'Many families tell old stories to teach what matters. Some believe those stories happened, and some see them as ways of saying something true. Either way, the story is treasured because of what it carries.' },
      { voice: 'A skeptic', says: 'I would ask what we mean by true. Did it really happen, or does it tell us something correct about the world? Those are different questions, and the answers can differ too. Keeping those two questions apart stops a lot of arguments.' },
    ],
    closing: 'Think of a story you love. What in it did not happen, and what in it is true anyway?',
  },
  {
    id: 'w-time',
    theme: 'world',
    stage: 'growing',
    courseIds: ['numbers-2'],
    answerMode: 'typed',
    prompt: 'A clock measures time. But what is time? Is it a thing, like a rock, or is it something else?',
    perspectives: [
      { voice: 'A scientist', says: 'Time is what clocks measure, and that sounds like a joke until you notice it is the most honest answer we have. Scientists can measure time incredibly precisely, and they still argue about what it really is. Both of those things are true at once.' },
      { voice: 'An artist', says: 'Time feels different depending on what you are doing. An hour of waiting drags and an hour of drawing vanishes. A clock says they were the same, and your heart says they were not. Which one is telling the truth?' },
      { voice: 'A grandparent of faith', says: 'Many traditions teach that time is a gift, and that how we spend it matters more than how much of it we have. That is why so many people pause to give thanks before a meal or at the end of a day.' },
      { voice: 'A skeptic', says: 'I would want to separate two questions. How do we measure time, which we understand well. And what time is, which nobody has settled. It is fine to be sure about the first and unsure about the second.' },
    ],
    closing: 'Think of an hour that went fast and an hour that went slow. What was different about them?',
  },
  {
    id: 'w-new-word',
    theme: 'world',
    stage: 'growing',
    courseIds: ['reading-2'],
    answerMode: 'typed',
    prompt: 'Where do words come from? Who decided that "dog" means a dog?',
    perspectives: [
      { voice: 'A scientist', says: 'Nobody decided it in one go. Words grow and change over hundreds of years as people use them. The word dog once meant one particular kind of dog, and slowly everyone started using it for all of them. Language is something people do together without anyone in charge.' },
      { voice: 'An artist', says: 'Poets make up new words all the time, and a few of them stick. Every word you know was once brand new to someone. When you invent a word with a friend and you both use it, you are doing exactly what the whole world did.' },
      { voice: 'A grandparent of faith', says: 'Many traditions have stories about the first words, or about a time when everyone spoke one language. Whether you take them as history or as stories, they show how much people have always wondered about this.' },
      { voice: 'A skeptic', says: 'I would check the claim that nobody decided. Some words really were decided, by dictionary writers or scientists naming a new thing. So the honest answer is that most words grew and a few were chosen, and it is worth knowing which is which.' },
    ],
    closing: 'Make up a word for something that has no name yet. What would it be?',
  },
  {
    id: 'w-true-for-everyone',
    theme: 'world',
    stage: 'growing',
    courseIds: ['reading-3'],
    answerMode: 'typed',
    prompt: 'Is anything true for everyone, everywhere? Or is everything just someone\'s opinion?',
    perspectives: [
      { voice: 'A scientist', says: 'Some things hold no matter who checks them. Water freezes at the same temperature in every country, and it did before anyone was around to measure it. That is what makes something a fact rather than a view: it does not care who is looking.' },
      { voice: 'An artist', says: 'Whether a song is beautiful is not a fact, and that is not a weakness. Opinions are how we tell each other who we are. A world where everything could be checked would have no room for taste, and taste is half of life.' },
      { voice: 'A grandparent of faith', says: 'Many people hold that some truths about how to treat one another are real for everyone, not just opinions, even if they cannot be proved like a sum. Other people see those as opinions too. It is one of the oldest conversations there is, and it is still going.' },
      { voice: 'A skeptic', says: 'I would be careful in both directions. Calling a view a fact is a way of ending an argument early, and calling a fact a view is a way of dodging it. The useful habit is asking: how would we check?' },
    ],
    closing: 'Name one thing you are sure is a fact, and one thing you are sure is only your opinion. How do you know which is which?',
  },
  {
    id: 'w-infinite-primes',
    theme: 'world',
    stage: 'growing',
    courseIds: ['math-4'],
    answerMode: 'typed',
    prompt: 'Prime numbers get rarer as numbers get bigger. Do they ever run out completely? How could anyone know?',
    perspectives: [
      { voice: 'A scientist', says: 'They never run out, and this was proved more than two thousand years ago by a Greek mathematician named Euclid. His argument fits on a napkin: multiply all the primes you know, add one, and the result cannot be divided by any of them, so there must be another. It is one of the oldest proofs still taught.' },
      { voice: 'An artist', says: 'There is something beautiful about a pattern that thins out but never stops. Like stars getting sparser as you look further out, but never reaching a last one. Mathematicians describe the gaps between primes the way painters describe light.' },
      { voice: 'A grandparent of faith', says: 'Many people over the centuries have seen in mathematics a kind of order that was there before anyone found it. Whether you see that as design or as simply how things are, the primes going on forever is the sort of fact that makes people stop and think.' },
      { voice: 'A skeptic', says: 'Notice the difference between checking and proving. You could check a million numbers and still not know about the million and first. Euclid did not check; he showed why a last prime is impossible. That is a stronger kind of knowing, and worth recognizing when you see it.' },
    ],
    closing: 'What is a fact you believe because you checked it, and one you believe because someone showed you why it must be true?',
  },
  {
    id: 'w-sky-blue',
    theme: 'world',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Why is the sky blue?',
    options: ['The sea', 'The sun', 'Nobody knows'],
    simple: [
      { voice: 'A scientist says', says: 'Sunlight has every color in it. The air scatters the blue bits all over the sky.' },
      { voice: 'An artist says', says: 'Look again at sunset. The same sky turns orange and pink.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Sunlight looks white but it has every color mixed in. When it passes through the air, the blue part gets scattered in all directions, so wherever you look up, blue is coming at you. At sunset the light travels through more air and the blue scatters away before it reaches you, which is why the reds are left.' },
      { voice: 'An artist', says: 'Painters have argued about the color of the sky for hundreds of years, and none of them paints it plain blue. There is violet near the top, pale near the horizon, and it changes every hour. Try looking for five minutes and naming every color you see.' },
      { voice: 'A grandparent of faith', says: 'Whatever you believe about how the sky came to be, most people agree it is a good thing to look at now and then. Some traditions make a point of stopping each day to notice it, and that habit is worth having whatever its reason.' },
      { voice: 'A skeptic', says: 'The sea is a common guess, and a good test is to ask what happens in the desert, far from any sea. The sky is still blue there. A guess that fails a simple test like that is worth letting go of, however nice it sounds.' },
    ],
    closing: 'What color is the sky right now, if you look carefully?',
  },
  {
    id: 'w-share-fair',
    theme: 'feelings',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'If you have three cookies and two friends, what is the fair way to share?',
    options: ['One each', 'Break them', 'Keep them'],
    simple: [
      { voice: 'A scientist says', says: 'Three cookies, three people. One each is exactly equal.' },
      { voice: 'An artist says', says: 'Fair does not always mean the same. It means everyone feels okay.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Three cookies and three people, counting you, means one each with nothing left over. That is the equal answer, and equal is one kind of fair. If there were only two cookies, you could break each in half and everyone would get two halves.' },
      { voice: 'An artist', says: 'Fair and equal are not always the same thing. If one friend has not eaten all day, giving them more might be the fairer choice even though it is not equal. The interesting part is deciding together.' },
      { voice: 'A grandparent of faith', says: 'Sharing is one of the first things every family and every tradition teaches. Not because it is easy, but because it is hard, and doing it anyway is how people learn to trust each other.' },
      { voice: 'A skeptic', says: 'I would ask what the friends think is fair before deciding for them. Sometimes the person you are being fair to has a different idea, and finding out is quicker than guessing.' },
    ],
    closing: 'Can you think of a time when the fair thing and the equal thing were different?',
  },
  {
    id: 'w-dreams',
    theme: 'world',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Where do dreams come from?',
    options: ['My head', 'Outside', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Your brain keeps working while you sleep. Dreams are some of that work.' },
      { voice: 'An artist says', says: 'Dreams mix up your day into new pictures. That is a kind of art.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Your brain does not switch off when you sleep. It sorts through the day, and some of that sorting shows up as pictures and stories. Scientists can see the brain being very busy during dreams, even though they still argue about what dreams are for.' },
      { voice: 'An artist', says: 'A dream takes bits of your day and puts them together in ways you would never plan. That is close to what artists try to do on purpose. Some keep a notebook by the bed to catch dreams before they fade.' },
      { voice: 'A grandparent of faith', says: 'People have paid attention to dreams for as long as there have been people. Some traditions see meaning in them, some see rest. Either way, it is worth noticing that you dream, and telling someone about it in the morning.' },
      { voice: 'A skeptic', says: 'I would want to separate what we know from what we guess. We know the brain is active. We do not know for certain why dreams take the shape they do. It is fine to enjoy a mystery without pretending it is solved.' },
    ],
    closing: 'What is the strangest dream you remember? What bits of real life were in it?',
  },
  {
    id: 'w-mistakes',
    theme: 'failure',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'Is a mistake a bad thing? Can you learn anything without making one?',
    perspectives: [
      { voice: 'A scientist', says: 'Science runs on mistakes more than on successes. Most experiments fail, and the failures narrow down where the truth can be. A result that surprises you is often worth more than one you expected, because it means something you believed was wrong, and now you know.' },
      { voice: 'An artist', says: 'Every good drawing sits on top of a hundred bad ones. The bad ones are not wasted; they are how your hand learned. People who never make mistakes are usually people who never try anything new.' },
      { voice: 'A grandparent of faith', says: 'Most traditions have a lot to say about getting things wrong and starting again. Forgiveness, including forgiving yourself, is a skill people have practiced for thousands of years. It is not about pretending the mistake did not happen.' },
      { voice: 'A skeptic', says: 'I would separate two things: the mistake itself and what you do next. The same wrong answer can be useless or valuable depending on whether you look at why it was wrong. The learning is in the looking, not the mistake.' },
    ],
    closing: 'Think of a mistake you made this week. What did it teach you that a right answer would not have?',
  },
  {
    id: 'w-machines-think',
    theme: 'world',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'A calculator gets sums right every time. Does that mean it understands math?',
    perspectives: [
      { voice: 'A scientist', says: 'A calculator follows rules built into it, very fast and very reliably. It does not know what a number is, or that it is doing math at all. Getting the right answer and understanding why it is right are different things, and the second one is what school is really for.' },
      { voice: 'An artist', says: 'A piano plays the right note when you press a key, but nobody says the piano understands music. Understanding is the part that happens in the person. The tool just helps it show.' },
      { voice: 'A grandparent of faith', says: 'People have long wondered what makes a mind a mind. Whatever you believe about that, most of us feel there is something in understanding that a machine ticking through rules does not have. Naming what that something is turns out to be very hard.' },
      { voice: 'A skeptic', says: 'I would ask how we would tell the difference. If a thing gives every right answer, what test shows it does not understand? That question is harder than it looks, and clever people disagree about the answer. Being unsure here is the honest position.' },
    ],
    closing: 'Can you explain why 3 × 4 is 12 without just saying it is? A calculator cannot. Can you?',
  },
  {
    id: 'w-same-river',
    theme: 'ups-and-downs',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'Every cell in your body gets replaced over the years. Are you still the same person you were as a baby?',
    perspectives: [
      { voice: 'A scientist', says: 'Almost none of the material in you now was in you as a baby. Yet something continues: the pattern, the memories, the way the parts are arranged. A river is never the same water twice, and we still call it the same river.' },
      { voice: 'An artist', says: 'You are more like a song than a statue. A song is the same song even though every note is gone the moment it sounds. What makes you you is the tune, not the notes.' },
      { voice: 'A grandparent of faith', says: 'Many traditions hold that a person is more than their body, and this question is one of the reasons why. Others see the self as a story that keeps being told. Both agree there is something worth calling you that lasts.' },
      { voice: 'A skeptic', says: 'I would ask what we mean by same, because the same atoms are gone, most of the same memories remain, and the same name is still yours. The question feels deep because same is doing several jobs at once. Pull them apart and each one has a clearer answer.' },
    ],
    closing: 'What is one thing about you that has stayed the same since you were small, and one thing that has completely changed?',
  },
  {
    id: 'w-sleep-night',
    theme: 'world',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Why do we sleep at night and not in the day?',
    options: ['At night', 'Because it is dark', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Your body has a clock inside. It feels sleepy when it gets dark.' },
      { voice: 'An artist says', says: 'Night is quiet. Quiet is good for dreaming.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Your body has a clock inside it that follows the light. When it gets dark, the clock tells your body to slow down and get sleepy. When the sun comes up, it tells you to wake. That clock is why it is so hard to stay awake late.' },
      { voice: 'An artist', says: 'Night is when the world goes quiet and the colors fade to blue and gray. Lots of painters love that hour. Sleeping then means you wake to the brightest part of the day, when there is the most to see.' },
      { voice: 'A grandparent of faith', says: 'Many families end the day the same way each night, with a story or a song or a few quiet words. The habit matters as much as the sleep. It tells your body and your heart that the day is done.' },
      { voice: 'A skeptic', says: 'Owls sleep in the day and are up all night, so night sleep is not a rule for every animal. It is a rule for people. I would ask what is different about us, and the answer has to do with our eyes and the light.' },
    ],
    closing: 'What is the first thing you notice when you wake up?',
  },
  {
    id: 'w-rain',
    theme: 'world',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Where does rain come from?',
    options: ['The clouds', 'The sea', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Water goes up into the sky as tiny bits, then falls back down as rain.' },
      { voice: 'An artist says', says: 'Rain is the sky giving the water back.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'The sun warms the sea and the puddles, and tiny bits of water float up into the sky where you cannot see them. High up it is cold, so they gather into clouds. When the drops get heavy enough, they fall. The same water goes round and round.' },
      { voice: 'An artist', says: 'Rain changes how everything looks. Colors get deeper, the ground shines, and the sound on a roof is a kind of music. Some artists go out on purpose when it rains, just to see.' },
      { voice: 'A grandparent of faith', says: 'For most of history, rain was the difference between a good year and a hungry one. That is why so many traditions have songs and prayers about it. Being glad of rain is an old feeling.' },
      { voice: 'A skeptic', says: 'A good test of the cloud idea is to leave a bowl of water in the sun and watch it slowly disappear. Where did it go? If you can answer that, you have most of the story of rain.' },
    ],
    closing: 'Where do you think a puddle goes when it dries up?',
  },
  {
    id: 'w-animals-talk',
    theme: 'world',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Do animals talk to each other?',
    options: ['Yes', 'No', 'Sort of'],
    simple: [
      { voice: 'A scientist says', says: 'Animals do not use words, but they tell each other things with sounds and moves.' },
      { voice: 'An artist says', says: 'A wagging tail says a lot without any words.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Animals do not have words the way we do, but they tell each other plenty. Bees dance to say where the flowers are. Birds sing to say this tree is mine. A dog can tell you it is happy without a single word.' },
      { voice: 'An artist', says: 'Watch a cat for a while and you will see it has a whole language of tail and ears and eyes. Artists who draw animals learn that language first. You cannot draw a happy dog without knowing what one looks like.' },
      { voice: 'A grandparent of faith', says: 'Old stories from all over the world have animals that talk. Maybe that is because people always felt animals had something to say, even without words. Listening carefully is a kind of respect.' },
      { voice: 'A skeptic', says: 'It depends what we mean by talk. If talk means words and sentences, then no. If it means telling someone something on purpose, then yes, all the time. The word is doing a lot of work here.' },
    ],
    closing: 'What is one thing a pet or a bird has told you without words?',
  },
  {
    id: 'w-leaves',
    theme: 'world',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Why do leaves change color in the autumn?',
    options: ['They get old', 'The cold', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'The green fades away in autumn, and the yellow and red were hiding underneath.' },
      { voice: 'An artist says', says: 'Autumn is when the trees show all their colors at once.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Leaves are green because of a color that helps them use sunlight. In autumn the tree stops making it, and the green fades. The yellow and orange were there all along, hidden under the green. Some trees make red on top of that.' },
      { voice: 'An artist', says: 'For a few weeks every tree turns into a painting. The trick artists notice is that no two leaves are the same color, even on one branch. Pick up ten and line them up.' },
      { voice: 'A grandparent of faith', says: 'Many traditions see the year as a circle: growing, resting, growing again. Autumn is the resting part. There is something calm about watching a tree let go of its leaves without any fuss.' },
      { voice: 'A skeptic', says: 'A good question is why some trees stay green all winter. If cold alone changed the color, they would change too. So it is not just the cold. Finding the odd one out often shows you the real reason.' },
    ],
    closing: 'Find a leaf outside. How many colors can you count on just that one?',
  },
  {
    id: 'w-bigger-better',
    theme: 'world',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Is bigger always better?',
    options: ['Yes', 'No', 'Sometimes'],
    simple: [
      { voice: 'A scientist says', says: 'An elephant is big, but an ant can carry more than its own weight.' },
      { voice: 'An artist says', says: 'A small picture can say more than a big one.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'It depends on the job. An elephant is huge but cannot climb a tree. An ant is tiny and can lift many times its own weight. Every size is good at something and bad at something else.' },
      { voice: 'An artist', says: 'A tiny drawing can be looked at up close and hold a whole story. A giant painting can fill a room. Neither one is better than the other. They are for different moments.' },
      { voice: 'A grandparent of faith', says: 'Lots of old stories are about something small doing something the big ones could not. People have always liked those stories, and I think it is because most of us feel small sometimes.' },
      { voice: 'A skeptic', says: 'Better for what? Bigger is better for a bed and worse for a pocket. Until someone says what the thing is for, the question cannot be answered, and noticing that is the first step.' },
    ],
    closing: 'What is one thing that is better small, and one thing that is better big?',
  },
  {
    id: 'w-friend',
    theme: 'feelings',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'What makes a friend a friend?',
    options: ['Playing', 'Being kind', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Friends are people who spend time together and look after each other.' },
      { voice: 'An artist says', says: 'A friend is someone you can be quiet with.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'People who study friendship find a few things that keep coming up: spending time together, helping each other, and being able to trust the other person. It is not about how many friends you have. One good one is plenty.' },
      { voice: 'An artist', says: 'A friend is someone you can be quiet with. When you do not have to talk, and it is still nice, that is the real sign. Talking together is the easy part. A comfortable quiet is much rarer.' },
      { voice: 'A grandparent of faith', says: 'Every tradition I know of puts kindness near the center of friendship. Not being kind to get something back, just being kind. Friends made that way tend to last.' },
      { voice: 'A skeptic', says: 'I would ask whether a friend has to be a person. Some people say a dog can be a friend. Some say a book can. What we count as a friend tells us what we think friendship is.' },
    ],
    closing: 'What is one thing a good friend did for you, and one thing you did for a friend?',
  },
  {
    id: 'w-music-move',
    theme: 'feelings',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Why does music make us want to move?',
    options: ['It is fun', 'The beat', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Your body hears the beat and wants to keep time with it.' },
      { voice: 'An artist says', says: 'Music is a feeling you can hear. Moving is how it gets out.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'A steady beat is something your body can follow, the way your heart follows a rhythm. Even babies bounce to music before anyone shows them how. Scientists think the part of the brain that plans movement lights up when it hears a beat.' },
      { voice: 'An artist', says: 'Dancers say the music tells them what to do. A slow song asks for slow arms. A fast drum asks for feet. The music is already moving; you are just joining in.' },
      { voice: 'A grandparent of faith', says: 'People have sung and danced together at every important moment for as long as anyone knows: births, weddings, harvests, goodbyes. Moving together to the same beat is one of the oldest ways of feeling like one group.' },
      { voice: 'A skeptic', says: 'Not everyone wants to move to music, and some people cannot hear it at all. So I would ask what is different about the ones who feel it and the ones who do not. The answer might be more interesting than the beat.' },
    ],
    closing: 'What song makes you want to move, and which part of your body moves first?',
  },
  {
    id: 'w-sun-night',
    theme: 'world',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Where does the sun go at night?',
    options: ['Behind the world', 'It turns off', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'The sun stays still. The world turns, and our side turns away.' },
      { voice: 'An artist says', says: 'Somewhere else, someone is watching our sunset as their sunrise.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'The sun does not go anywhere. The whole world is slowly turning, and at night our side has turned away from it. Somewhere on the other side of the world, it is the middle of the day right now. Tomorrow morning we turn back to face it.' },
      { voice: 'An artist', says: 'When the sun sets here, it is rising for someone else. Painters have tried for hundreds of years to catch the last minute of light. It never looks the same twice, and it never waits.' },
      { voice: 'A grandparent of faith', says: 'Nearly every people in history had stories about the sun going away and coming back. It was the most important thing in the sky, and a promise that it would return each morning was a promise worth having.' },
      { voice: 'A skeptic', says: 'A good check: if the sun turned off, the moon would go dark too, because the moon only shines with borrowed sunlight. But the moon is often bright at night. So the sun must still be on, just out of sight.' },
    ],
    closing: 'If you could ride with the sun for one whole day, what would you see?',
  },
  {
    id: 'w-brave-scared',
    theme: 'feelings',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Can you be brave and scared at the same time?',
    options: ['Yes', 'No', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Brave is what you do. Scared is what you feel. You can do both at once.' },
      { voice: 'An artist says', says: 'The bravest people in stories are scared first.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Being scared is a feeling your body makes to keep you safe. Being brave is a choice you make anyway. So yes, they happen together all the time. In fact, you cannot be brave without being a little scared first. There would be nothing to be brave about.' },
      { voice: 'An artist', says: 'In every good story the hero is frightened before the big moment. If they were not, the story would be boring. The fear is what makes the bravery mean something.' },
      { voice: 'A grandparent of faith', says: 'Many traditions say courage is not the absence of fear but doing the right thing with fear in your belly. Old soldiers, nurses and parents all know that feeling well.' },
      { voice: 'A skeptic', says: 'I would look closely at the word brave. Is jumping off something high brave, or just not thinking? I would say bravery needs the fear, and needs a good reason too. Without both, it is something else.' },
    ],
    closing: 'Tell about a time you did something even though you were scared. What happened after?',
  },
  {
    id: 'w-smallest',
    theme: 'world',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'What is the smallest thing you can think of?',
    options: ['A seed', 'A speck of dust', 'Smaller'],
    simple: [
      { voice: 'A scientist says', says: 'Everything is made of bits far too small to see.' },
      { voice: 'An artist says', says: 'Try drawing something so small the pencil is too big.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'A grain of sand looks small, but it is made of billions of bits far too tiny to see, and those are made of smaller bits still. Scientists have found things so small that a million of them side by side would not reach across a hair.' },
      { voice: 'An artist', says: 'Try to draw something smaller than the tip of your pencil. You cannot, so you have to draw it big, which is what artists do with tiny things. A drawing of a seed can fill a whole page.' },
      { voice: 'A grandparent of faith', says: 'Some of the oldest wise sayings are about how the smallest things matter: a seed, a word, a kind act. The small thing is often where the big thing starts.' },
      { voice: 'A skeptic', says: 'Every time someone found the smallest thing, someone else found something smaller inside it. So I would be careful with the word smallest. Maybe there is no smallest. That would be strange, and strange is worth wondering about.' },
    ],
    closing: 'Look at your hand very closely. What is the smallest thing you can see on it?',
  },
  {
    id: 'w-all-books',
    theme: 'world',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'If you read every book ever written, would you know everything?',
    perspectives: [
      { voice: 'A scientist', says: 'No, because most of what is known was never written down, and most of what will be known has not been found yet. Books hold what people already worked out. Finding new things is a different skill, and reading alone does not give it to you.' },
      { voice: 'An artist', says: 'Books cannot teach you how a strawberry tastes or how it feels to finish a race. Some knowing only comes from doing. The person who has read about swimming is not a swimmer.' },
      { voice: 'A grandparent of faith', says: 'Many traditions distinguish between knowing about something and truly knowing it. You can read every book about kindness and still not be kind. The second kind of knowing is the one that changes a life.' },
      { voice: 'A skeptic', says: 'Books disagree with each other constantly. Read them all and you would know what everyone thinks, which is not the same as knowing what is true. You would then have to decide, and that is the hard part.' },
    ],
    closing: 'What is something you know that you could never have learned from a book?',
  },
  {
    id: 'w-rules',
    theme: 'world',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'Why do we have rules? Would things be better without any?',
    perspectives: [
      { voice: 'A scientist', says: 'Watch a game with no rules and it stops being a game within a minute. Rules are what let strangers play together without arguing over every move. The best rules are the ones that let more happen, not fewer things.' },
      { voice: 'An artist', says: 'A poem has rules about lines and rhythm, and it is the rules that make it a poem. Total freedom often produces nothing at all. Artists choose their limits on purpose, because limits give the work a shape.' },
      { voice: 'A grandparent of faith', says: 'Most traditions have a short list of rules at their heart, and the interesting thing is how similar those lists are across the world. Do not steal, do not lie, look after the weak. Rules that everyone arrives at separately are probably worth keeping.' },
      { voice: 'A skeptic', says: 'Some rules exist because they help, and some exist because someone powerful wanted them. I would ask, for each rule, who it helps. A rule you cannot explain is a rule worth questioning, politely.' },
    ],
    closing: 'Think of one rule you think is good and one you think is silly. What is the difference between them?',
  },
  {
    id: 'w-promise',
    theme: 'feelings',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'Is it ever right to break a promise?',
    perspectives: [
      { voice: 'A scientist', says: 'People who keep promises get trusted, and trust is what lets groups do big things together. But a promise is made with the knowledge you had at the time. If you promised to meet a friend and then found a child hurt on the way, most people would say breaking it was right.' },
      { voice: 'An artist', says: 'Stories are full of terrible promises, ones that should never have been made and cost everything to keep. The lesson in those stories is usually to be careful what you promise, not to break them lightly.' },
      { voice: 'A grandparent of faith', says: 'Keeping your word is close to sacred in most traditions. And yet those same traditions allow for mercy when keeping a promise would cause real harm. The tension between the two is old, and it is not fully solved.' },
      { voice: 'A skeptic', says: 'I would separate breaking a promise from breaking it quietly. Going back to the person, explaining, and asking to be released is different from just not showing up. The first keeps the trust even when the promise goes.' },
    ],
    closing: 'Have you ever had to choose between a promise and something else that mattered? What did you decide?',
  },
  {
    id: 'w-slow-time',
    theme: 'feelings',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'Why does time seem to go slowly when you are bored and fast when you are having fun?',
    perspectives: [
      { voice: 'A scientist', says: 'Your brain does not have a clock in it. It judges time by how much is happening. A full hour feels short while it is happening and long when you look back on it, because there is so much to remember. An empty hour is the reverse.' },
      { voice: 'An artist', says: 'Musicians know this trick very well. A slow song can feel endless or it can feel like it passes in a breath, and the difference is whether something in it holds your attention. Boredom is attention with nowhere to land.' },
      { voice: 'A grandparent of faith', says: 'Some traditions treat boredom as a doorway rather than a problem. The moments with nothing to do are where people notice things they were too busy to see. That slow hour might be trying to show you something.' },
      { voice: 'A skeptic', says: 'A watch says the two hours were the same length. So the question is really about the mind, not about time. Why does a mind with nothing to do keep checking the clock? That is the thing to wonder about.' },
    ],
    closing: 'Describe an hour that felt very long. What would have made it feel short?',
  },
  {
    id: 'w-plants-know',
    theme: 'world',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'Do plants know things?',
    perspectives: [
      { voice: 'A scientist', says: 'Plants have no brain, but they respond to their world in surprising ways. They turn toward light, grow roots toward water, and some release warning chemicals when insects bite them, so their neighbors can prepare. Whether that counts as knowing is a fair question.' },
      { voice: 'An artist', says: 'A sunflower turning its face across the sky through the day looks like attention. Whether it is or not, watching one for an afternoon will change how you look at a garden.' },
      { voice: 'A grandparent of faith', says: 'Many people have talked to their plants for as long as there have been gardens. Whether the plant hears is beside the point. The talking makes the gardener notice the plant, and noticed plants tend to do well.' },
      { voice: 'A skeptic', says: 'I would want to know what we mean by know. A thermostat responds to temperature and nobody says it knows anything. If a plant is doing more than a thermostat, what exactly is the more? That is where the interesting argument lives.' },
    ],
    closing: 'Put a plant near a window and watch it for a week. What does it do?',
  },
  {
    id: 'w-alive',
    theme: 'world',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'What makes something alive?',
    perspectives: [
      { voice: 'A scientist', says: 'Living things grow, use energy, respond to what is around them, and make more of themselves. A rock does none of those. A fire does some of them, which is why the list took scientists a long time to agree on, and it still has awkward cases at the edges.' },
      { voice: 'An artist', says: 'Artists spend a lot of effort making things look alive: a line that seems to move, a face that seems about to speak. So there is a kind of aliveness you can see even in paint. Whether that is the same thing is a lovely question.' },
      { voice: 'A grandparent of faith', says: 'Many traditions hold that life is something more than the list of things a body does, and that this something deserves respect. You do not have to share the belief to notice that people who hold it tend to treat living things gently.' },
      { voice: 'A skeptic', says: 'Try the list on a virus. It makes copies of itself but cannot do it alone, and does not grow or eat. Scientists still argue about whether it is alive. When experts disagree about a definition, the definition is doing less work than we thought.' },
    ],
    closing: 'Is a seed alive? What about a dried seed in a packet? Where would you draw the line?',
  },
  {
    id: 'w-nobody-remembers',
    theme: 'world',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'If nobody remembers something happening, did it still happen?',
    perspectives: [
      { voice: 'A scientist', says: 'Yes, it happened all the same. Rocks record floods that no person ever saw, and rings in a tree record dry years nobody wrote down. The world keeps a record whether or not anyone is watching. Memory is just one kind of record, and not the most reliable.' },
      { voice: 'An artist', says: 'Most of what ever happened is forgotten, and that thought makes some people sad and some people free. Artists often work to rescue small things from being forgotten: a face, a street, an afternoon.' },
      { voice: 'A grandparent of faith', says: 'Many traditions teach that nothing is truly lost, that every act matters whether or not it is remembered. That belief has helped people do good things in secret for a very long time.' },
      { voice: 'A skeptic', says: 'I would ask how we would know about a thing nobody remembers. We could not point to it. So the question is really about whether things exist without us noticing, and I think a tree falling in an empty forest still lands.' },
    ],
    closing: 'What is something you did this week that nobody else knows about? Did it still count?',
  },
  {
    id: 'w-laugh',
    theme: 'feelings',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'Why do we laugh?',
    perspectives: [
      { voice: 'A scientist', says: 'Laughter is older than language. Other apes do a version of it when they play, and babies laugh months before they talk. It seems to be a signal that says this is safe, this is play, and it spreads between people faster than almost anything.' },
      { voice: 'An artist', says: 'Comedians say a joke works when it takes you somewhere you expected and then turns. The laugh is the turn. Which is why explaining a joke kills it: the surprise is the whole thing.' },
      { voice: 'A grandparent of faith', says: 'Some traditions treat joy as a duty, not a treat. A shared laugh at the table is one of the oldest ways a family says it is still a family. Do not let anyone tell you laughter is not serious.' },
      { voice: 'A skeptic', says: 'People also laugh when they are nervous, or embarrassed, or to be polite. So laughter is not only about funny things. I would say it is a sound that means the situation is fine, and jokes are just one way of making it fine.' },
    ],
    closing: 'What is the last thing that made you laugh out loud? Why do you think it was funny?',
  },
  {
    id: 'w-right-kind',
    theme: 'feelings',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'Is it better to be right or to be kind?',
    perspectives: [
      { voice: 'A scientist', says: 'Being right about the world matters: a wrong answer about medicine can hurt someone. But being right and being harsh about it are separate choices. The best scientists correct each other kindly, because that is how people stay willing to be corrected.' },
      { voice: 'An artist', says: 'The world is full of people who were right and nobody listened, because of how they said it. Kindness is how a true thing gets through the door. Without it, the truth stays outside.' },
      { voice: 'A grandparent of faith', says: 'Nearly every tradition puts kindness above cleverness. Not because truth does not matter, but because a truth delivered cruelly does damage of its own. Speak the truth, they say, and speak it gently.' },
      { voice: 'A skeptic', says: 'I would refuse the choice. It is almost always possible to be both, and picking one is usually an excuse. If you find yourself being unkind, ask whether you are actually right or just annoyed.' },
    ],
    closing: 'Think of a time someone told you a hard truth kindly. How did they do it?',
  },
  {
    id: 'w-robot-friend',
    theme: 'feelings',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'Could a robot ever be your friend?',
    perspectives: [
      { voice: 'A scientist', says: 'Today a robot can talk, remember what you said, and seem to care. What it cannot do, as far as anyone can tell, is actually feel anything. A friend who cannot feel is a strange kind of friend, and it is worth knowing the difference before you decide.' },
      { voice: 'An artist', says: 'Children have always made friends with things that cannot feel: a stuffed animal, an imaginary companion. That friendship was real on one side. The question is whether one-sided friendship is a lesser thing or just a different thing.' },
      { voice: 'A grandparent of faith', says: 'Many traditions hold that what makes a person a person is something a machine cannot have, however clever. Other people are much less sure of that. Either way, most would say the people around you deserve your friendship first.' },
      { voice: 'A skeptic', says: 'I would ask what a friend does that a robot could not. Keep a secret? Show up when it is inconvenient? Disagree with you for your own good? Make that list, then check the robot against it. The list will teach you what friendship is.' },
    ],
    closing: 'What is one thing a real friend does that you would not want a machine to do instead?',
  },
  {
    id: 'w-fell-off-bike',
    theme: 'failure',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'When you fall off a bike, what should you do next?',
    options: ['Get back on', 'Stop riding', 'Cry first'],
    simple: [
      { voice: 'A scientist says', says: 'Everyone who can ride a bike fell off first. Falling is part of learning.' },
      { voice: 'An artist says', says: 'It is okay to cry, and then get back on.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Nobody has ever learned to ride a bike without falling off. Your body learns balance by finding out what does not work. Each fall teaches your legs something, even if it does not feel like it at the time. Getting back on is how the lesson sticks.' },
      { voice: 'An artist', says: 'It is fine to sit on the ground for a minute first. Being upset is not the opposite of being brave. When you are ready, the bike is still there, and so is the part of you that wanted to ride it.' },
      { voice: 'A grandparent of faith', says: 'Every family has a story about the day someone learned to ride. Nobody tells the story of the first perfect go, because there was never one. The falls are the story, and they are told with a smile.' },
      { voice: 'A skeptic', says: 'I would ask what went wrong before getting back on. Too fast, looked down, forgot to pedal? A fall you understand is worth more than three you do not. Then get back on and ride.' },
    ],
    closing: 'What is something you can do now that you fell over learning?',
  },
  {
    id: 'w-got-it-wrong',
    theme: 'failure',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'You tried a question and got it wrong. Is that bad?',
    options: ['Yes', 'No', 'A little'],
    simple: [
      { voice: 'A scientist says', says: 'A wrong answer shows you what to learn next. That is useful.' },
      { voice: 'An artist says', says: 'Every drawing I love came after a lot of ones I threw away.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'A wrong answer is information. It tells you exactly where the gap is, which a lucky right answer never does. Scientists get things wrong every single day, and the wrong results are how they find their way to the right ones.' },
      { voice: 'An artist', says: 'My best drawings sit on top of a pile of ones that did not work. Nobody sees the pile, but it is there under every good one. The wrong ones were practice for the right one.' },
      { voice: 'A grandparent of faith', says: 'Being wrong and trying again is one of the oldest lessons there is. Nobody expects a child to get everything right the first time. What people notice is whether you try again.' },
      { voice: 'A skeptic', says: 'Getting it wrong is only bad if you stop there. Getting it wrong and then finding out why is one of the best things that can happen. So the question is really what you do next.' },
    ],
    closing: 'What is one thing you got wrong today, and what did it show you?',
  },
  {
    id: 'w-try-again',
    theme: 'failure',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Why does trying again usually work better than trying the first time?',
    options: ['You know more', 'Luck', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'The second time, you already know one thing that does not work.' },
      { voice: 'An artist says', says: 'The second try has the first try inside it.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'The second time you try, you carry the first time with you. You know one way that did not work, and your hands remember more than you think. That is why the tenth try is nearly always better than the first, at anything.' },
      { voice: 'An artist', says: 'A singer sings a song a hundred times before anyone hears it. Each time is a little different, and the differences add up. The version people hear has all the others hiding inside it.' },
      { voice: 'A grandparent of faith', says: 'Patience is a word grown-ups use a lot, and this is what it means: trying again without being cross at yourself. Most traditions say it is one of the most important things a person can learn.' },
      { voice: 'A skeptic', says: 'Trying again the exact same way does not always help. Trying again a little differently does. So I would say the trick is not just trying again, it is noticing what to change.' },
    ],
    closing: 'What is something you had to try more than once before it worked?',
  },
  {
    id: 'w-angry-feeling',
    theme: 'feelings',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'When you feel angry, where do you feel it in your body?',
    options: ['My hands', 'My tummy', 'My face'],
    simple: [
      { voice: 'A scientist says', says: 'Angry feelings show up in the body first: hot face, tight hands, fast heart.' },
      { voice: 'An artist says', says: 'If anger had a color and a shape, what would yours look like?' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Anger starts in the body before you even know it is there. Your heart speeds up, your hands get tight, your face gets warm. Learning to notice those signs early is like seeing a wave before it reaches you. You get a moment to choose what to do.' },
      { voice: 'An artist', says: 'Try giving your anger a color and a shape. Is it red and spiky, or gray and heavy? Drawing a feeling is a way of getting it out of your body and onto paper, where you can look at it.' },
      { voice: 'A grandparent of faith', says: 'Every tradition has something to say about anger, and most say the same thing: the feeling is not wrong, but what you do with it matters. Taking a slow breath before you act is advice older than any book.' },
      { voice: 'A skeptic', says: 'Some people say count to ten, and I would ask whether that actually works for you. Try it and notice what happens. If it does not, try something else, like walking to the door and back. Find your own way to let the wave pass.' },
    ],
    closing: 'What is one thing that helps your body calm down when it is angry?',
  },
  {
    id: 'w-sad-okay',
    theme: 'feelings',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Is it okay to feel sad?',
    options: ['Yes', 'No', 'Sometimes'],
    simple: [
      { voice: 'A scientist says', says: 'Sad is a normal feeling. It comes, and then it goes.' },
      { voice: 'An artist says', says: 'Some of the most beautiful songs are sad ones.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Sadness is one of the feelings every person has, in every country, at every age. It usually comes when something is lost or missed, and it tends to pass on its own if you let it. Feeling sad does not mean anything is broken.' },
      { voice: 'An artist', says: 'Some of the best songs and stories are sad ones, and people love them. That tells you sadness is not something to hide. It is part of being a whole person, and it can even be beautiful.' },
      { voice: 'A grandparent of faith', says: 'Nearly every tradition makes room for sadness with special days or songs or quiet times. Grown-ups feel sad too, more than they let on. Telling someone you feel sad is one of the bravest things a person can do.' },
      { voice: 'A skeptic', says: 'I would separate feeling sad from being stuck in sad. The first is normal and passes. If it does not pass for a long time, that is when to tell a grown-up you trust. Knowing the difference is useful.' },
    ],
    closing: 'What helps you when you feel sad? Who could you tell?',
  },
  {
    id: 'w-name-feeling',
    theme: 'feelings',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Why does it help to say what you are feeling out loud?',
    options: ['It gets smaller', 'People can help', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Naming a feeling makes it a little smaller and easier to hold.' },
      { voice: 'An artist says', says: 'A feeling with a name is a feeling you can do something with.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Scientists have found something surprising: when people say the name of a feeling, the part of the brain that makes the feeling calms down a little. Saying I am frustrated is not just talking. It actually helps the feeling settle.' },
      { voice: 'An artist', says: 'A feeling without a name is like a shape in the dark. Give it a name and you can see its edges. Then you can draw it, or talk about it, or decide what to do with it.' },
      { voice: 'A grandparent of faith', says: 'Families that talk about feelings at the dinner table tend to be families where people feel safe. It is a habit worth starting young. Even a small word like tired or worried is a good start.' },
      { voice: 'A skeptic', says: 'Sometimes people do not have the right word yet, and that is fine. Try pointing to where it is in your body, or saying what it is like. Close enough is still useful.' },
    ],
    closing: 'What are you feeling right now? Can you find a word for it?',
  },
  {
    id: 'w-bad-day',
    theme: 'ups-and-downs',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Everyone has bad days. What makes a bad day end?',
    options: ['Sleep', 'Time', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Every day ends, and a new one starts. Bad days do not last forever.' },
      { voice: 'An artist says', says: 'Even a gray day has a little bit of color in it somewhere.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Every day has an end built into it. Whatever happened, you sleep and the next day is new. Scientists who study happiness find that most bad feelings fade faster than we expect, and a good sleep helps more than almost anything.' },
      { voice: 'An artist', says: 'Even on a gray day there is one small good thing somewhere: a warm drink, a funny dog, a song. Finding it does not fix the day. It just reminds you that the day is not all one color.' },
      { voice: 'A grandparent of faith', says: 'Old sayings from every corner of the world say the same thing: this too shall pass. People have been having bad days for as long as there have been days, and they got through them. You will get through yours too.' },
      { voice: 'A skeptic', says: 'I would ask what made it a bad day. One bad thing, or a lot of small ones? Sometimes a bad day is really a bad hour that spread. Naming the actual bad thing makes it smaller than the whole day.' },
    ],
    closing: 'What is one small good thing that happened on a day that felt bad?',
  },
  {
    id: 'w-everyone-struggles',
    theme: 'ups-and-downs',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Does everyone find some things hard?',
    options: ['Yes', 'No', 'Only me'],
    simple: [
      { voice: 'A scientist says', says: 'Everyone finds some things hard. Even grown-ups. Even experts.' },
      { voice: 'An artist says', says: 'The people who look like it is easy have just practiced a lot.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Everyone finds some things hard, without exception. The people who look like it is easy have practiced for years, or they are good at that one thing and struggle with something else you never see. There is no such person as someone who finds everything easy.' },
      { voice: 'An artist', says: 'The finished painting looks easy. What you do not see is the wall of rubbed-out lines behind it. Every person who is good at something has a wall like that.' },
      { voice: 'A grandparent of faith', says: 'When you struggle, you are doing exactly what every person who ever lived has done. That is not a comfort to make you feel better. It is simply true, and it means you belong.' },
      { voice: 'A skeptic', says: 'I would be careful with the feeling that says only me. It is a very common feeling, and it is almost always wrong. Ask three people what they find hard and see what they say.' },
    ],
    closing: 'What is something you find hard? Who else do you think finds it hard too?',
  },
  {
    id: 'w-things-change',
    theme: 'ups-and-downs',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Some days feel great and some feel awful. Is that normal?',
    options: ['Yes', 'No', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Feelings go up and down like waves. That is how they are meant to work.' },
      { voice: 'An artist says', says: 'A song with only one note would be boring. Ups and downs are the music.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Feelings go up and down for everyone, like waves on the sea. That is not a sign something is wrong. It is how feelings work. A person who felt exactly the same every day would be the unusual one.' },
      { voice: 'An artist', says: 'A song with one note would be unbearable. It is the ups and downs that make it a song. Your days are like that too. The great ones are great partly because the hard ones exist.' },
      { voice: 'A grandparent of faith', says: 'Many traditions teach that hard times and good times both pass, and that neither one is the whole story. Holding on loosely to both is a skill, and older people will tell you it takes a lifetime.' },
      { voice: 'A skeptic', says: 'I would watch out for the story that says a bad day means a bad life. One of those is a single day. The other is a lot of days. Keep them separate and the bad day gets to stay just a day.' },
    ],
    closing: 'What was your best moment this week, and your hardest? Are you still here after both?',
  },
  {
    id: 'w-slow-learner',
    theme: 'failure',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Is it bad to learn something slowly?',
    options: ['Yes', 'No', 'Depends'],
    simple: [
      { voice: 'A scientist says', says: 'Slow learning often lasts longer than fast learning.' },
      { voice: 'An artist says', says: 'A tree grows slowly. Nobody says a tree is bad at growing.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Something surprising: things learned slowly often stay longer than things learned fast. When you have to work at it, your brain builds more paths to it. Slow is not a problem. Slow is often how deep gets done.' },
      { voice: 'An artist', says: 'A tree takes years to grow and nobody says it is bad at growing. Some things are meant to take time. The speed you learn something says nothing about how well you will know it in the end.' },
      { voice: 'A grandparent of faith', says: 'Many of the wisest people in old stories were slow to start. What mattered was that they kept going. The tortoise wins that race for a reason.' },
      { voice: 'A skeptic', says: 'Slow compared to whom? Everyone learns different things at different speeds. The child who is fast at reading may be slow at swimming. There is no one speed, so there is nothing to be bad at.' },
    ],
    closing: 'What is something you learned slowly that you are glad you kept at?',
  },
  {
    id: 'w-experiment-fail',
    theme: 'failure',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'Most experiments fail. Why do scientists keep doing them?',
    perspectives: [
      { voice: 'A scientist', says: 'A failed experiment rules something out, and ruling things out is most of the work. The famous discoveries came after hundreds of results that went nowhere. If a scientist only ran experiments that were sure to work, they would never learn anything new.' },
      { voice: 'An artist', says: 'It is the same in a studio. Most sketches go in the bin. The bin is not a graveyard, it is a workshop. Every failed sketch taught the hand something the final drawing needed.' },
      { voice: 'A grandparent of faith', says: 'There is a very old idea that the person who never fails has never really tried. Failure is proof of effort. Many traditions honor the attempt as much as the result.' },
      { voice: 'A skeptic', says: 'I would add one thing: failure is only useful if it is recorded. A failed experiment that nobody writes down teaches nothing. Scientists keep going because they keep notes, and so should you.' },
    ],
    closing: 'What is something you tried this month that did not work? What did it rule out?',
  },
  {
    id: 'w-frustration',
    theme: 'feelings',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'What is frustration, and what is it trying to tell you?',
    perspectives: [
      { voice: 'A scientist', says: 'Frustration is the feeling of wanting something and being blocked. It is useful information: it tells you that you care about the thing. People rarely feel frustrated about things that do not matter to them. The trick is hearing the message without letting the feeling drive.' },
      { voice: 'An artist', says: 'Every artist knows the moment when the picture in your head will not come out of your hand. That gap between them is frustration. It is also the exact place where skill grows, because it shows you what you cannot do yet.' },
      { voice: 'A grandparent of faith', says: 'Old advice for frustration is nearly always the same across traditions: step away, breathe, come back. Not because the problem changes, but because you do. A short walk has solved more problems than most people admit.' },
      { voice: 'A skeptic', says: 'I would ask what is actually blocking you. Sometimes it is the problem. Sometimes it is tiredness, hunger, or a noise in the room. Frustration blames the problem, but the real cause is often somewhere else.' },
    ],
    closing: 'Think of the last time you felt frustrated. What was it telling you that you cared about?',
  },
  {
    id: 'w-worry',
    theme: 'feelings',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'What is the difference between worrying about something and thinking about it?',
    perspectives: [
      { voice: 'A scientist', says: 'Thinking moves forward: it looks for a next step. Worrying goes round in a circle, replaying the same fear without getting anywhere. Scientists who study this say the difference is whether you are solving or just spinning. You can feel which one you are doing if you check.' },
      { voice: 'An artist', says: 'Worry is like drawing the same line over and over, harder each time, until the paper tears. Thinking is drawing the next line. When you notice you are going over the same line, that is the moment to lift the pencil.' },
      { voice: 'A grandparent of faith', says: 'Nearly every tradition has a practice for setting worries down: a prayer, a walk, a quiet minute, a talk with someone older. They all work the same way. They stop the circle for long enough to see out of it.' },
      { voice: 'A skeptic', says: 'A useful test: ask what you could do about it in the next hour. If there is something, do it. If there is nothing, the worry is not helping and you have permission to set it down. That is simple to say and not easy to do.' },
    ],
    closing: 'What is something you have been worrying about? Is there one small thing you could do about it?',
  },
  {
    id: 'w-comparison',
    theme: 'ups-and-downs',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'Why does it feel bad to compare yourself to someone who seems better at everything?',
    perspectives: [
      { voice: 'A scientist', says: 'People compare themselves to others automatically; it is wired in. But the comparison is nearly always unfair, because you see the other person from the outside and yourself from the inside, with all your doubts included. You are comparing their highlights with your full story.' },
      { voice: 'An artist', says: 'Every artist has looked at someone else and felt small. The ones who keep going learn to look at the other person and ask what can I learn from that, instead of why am I not that. Same look, different question, completely different feeling.' },
      { voice: 'A grandparent of faith', says: 'Envy is one of the oldest feelings there is, and every tradition warns about it, not because it is evil but because it makes you miserable and gets you nothing. Being glad for someone else is a skill you can practice, and it feels far better.' },
      { voice: 'A skeptic', says: 'Someone who seems better at everything does not exist. You are seeing a few things they are good at and filling in the rest. Ask them what they struggle with and watch the picture change.' },
    ],
    closing: 'Is there someone you compare yourself to? What is one thing you could learn from them instead?',
  },
  {
    id: 'w-story-you-tell',
    theme: 'ups-and-downs',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'When something goes wrong, you tell yourself a story about it. Is the story always true?',
    perspectives: [
      { voice: 'A scientist', says: 'The brain writes a story about every event, fast and automatically, and it is often wrong. A friend not replying becomes they are angry at me, when in fact their phone was flat. Noticing the story as a story, rather than a fact, is one of the most useful skills a person can have.' },
      { voice: 'An artist', says: 'A writer knows the same events can be told as a comedy or a tragedy. The facts do not change; the telling does. You are the writer of your own day, and you get to choose which version you tell.' },
      { voice: 'A grandparent of faith', says: 'Many traditions teach that suffering comes less from what happens and more from what we tell ourselves about it. It is an old insight, and modern science has mostly agreed with it. The story is where the power is.' },
      { voice: 'A skeptic', says: 'When you catch yourself telling a story like they hate me or I always fail, ask for the evidence. Not the feeling, the evidence. Most of these stories have very little, and they shrink fast when asked to show it.' },
    ],
    closing: 'Think of something that went wrong recently. What story did you tell about it? Is there another story that fits the same facts?',
  },
  {
    id: 'w-hard-things-pass',
    theme: 'ups-and-downs',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'Think of the hardest thing you have been through. You are still here. What does that tell you?',
    perspectives: [
      { voice: 'A scientist', says: 'People are far more resilient than they expect. Studies of people after hard events find that most recover, and many say they grew from it. The hard thing did not feel survivable at the time. That is what hard things feel like. And yet here you are.' },
      { voice: 'An artist', says: 'The scar is proof that the wound healed. Artists often find their best work comes after their worst year, not because pain is good, but because getting through it gave them something to say.' },
      { voice: 'A grandparent of faith', says: 'Every older person you know has a list of things they thought would break them and did not. Ask one of them about it. The list is long, and they are still here to tell it. That is not a matter of luck. That is what people are.' },
      { voice: 'A skeptic', says: 'I would be honest that some hard things leave marks, and getting through is not the same as being fine. But getting through is real, and it is evidence. The next hard thing will meet a person who has already done it once.' },
    ],
    closing: 'What is one hard thing you got through? What did you learn about yourself from it?',
  },
  {
    id: 'w-ask-for-help',
    theme: 'feelings',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'Why is it so hard to ask for help, and why is it worth it?',
    perspectives: [
      { voice: 'A scientist', says: 'People overestimate how much others will judge them for asking, and underestimate how happy others are to help. Both of those have been measured carefully. Asking for help is usually cheaper than you think and pays back more than you expect.' },
      { voice: 'An artist', says: 'Every great work you have heard of had people behind it whose names you do not know. Nobody does the work alone. The idea of the lone genius is mostly a story, and not a helpful one.' },
      { voice: 'A grandparent of faith', says: 'Most traditions build asking for help into their daily life, through prayer, community, or simply the habit of eating together. They understood something: needing others is not a weakness. It is how people are designed to work.' },
      { voice: 'A skeptic', says: 'Try a small experiment this week. Ask someone for a small thing this week and watch their face. My prediction is that they will be pleased. If I am wrong, you have learned something too.' },
    ],
    closing: 'What is one thing you could use help with right now? Who could you ask?',
  },
  {
    id: 'w-gravity',
    theme: 'world',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'What would happen if gravity switched off for one second?',
    perspectives: [
      { voice: 'A scientist', says: 'Everything not held down would drift upward very slightly, and the air itself would start to spread out. One second is short, so most things would barely move. But the oceans and the atmosphere would begin to leave, and turning gravity back on would slam it all home. One second would be a bad second.' },
      { voice: 'An artist', says: 'Imagine every leaf, every drop of rain, every loose hair lifting at once and then settling. Painters have tried to catch that kind of moment, where the ordinary world does something impossible for an instant.' },
      { voice: 'A grandparent of faith', says: 'Some things we never notice until they stop. Gravity is one of those things. Gratitude for the things that never fail is a practice in many traditions, and this thought experiment is a good reason for it.' },
      { voice: 'A skeptic', says: 'I would ask what switched off means, because gravity is not a switch, it is a property of everything that has mass. To turn it off you would have to turn off mass. Sometimes a question shows you that it cannot happen, and that is an answer too.' },
    ],
    closing: 'What is something around you right now that only stays put because of gravity?',
  },
  {
    id: 'w-why-questions',
    theme: 'world',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'Why do little children ask why so much? Should we ever stop?',
    perspectives: [
      { voice: 'A scientist', says: 'Children ask why because they are building a model of how the world works, and every why fills in a piece. Scientists never stop; they just get better at asking why in ways that can be tested. The best scientists are the ones who kept the habit of a child.' },
      { voice: 'An artist', says: 'Artists ask why too, but a different why: why does this color feel sad, why does that shape feel calm. The question does not stop being useful when you grow up. It just finds new things to point at.' },
      { voice: 'A grandparent of faith', says: 'Some of the oldest texts in the world are collections of questions, not answers. Asking has always been honored. The people who stop asking are usually the ones who think they already know, and they are usually wrong.' },
      { voice: 'A skeptic', says: 'Never stop, but do get better at it. A good why has a way to find out. A lazy why just wants someone else to do the thinking. Learn the difference and you will be dangerous, in the best way.' },
    ],
    closing: 'What is something you have wanted to know for a long time but never asked? Ask it now.',
  },
  {
    id: 'w-practice-boring',
    theme: 'failure',
    stage: 'growing',
    courseIds: [],
    answerMode: 'typed',
    prompt: 'Practice is often boring. Why does it work anyway?',
    perspectives: [
      { voice: 'A scientist', says: 'Practice works by repetition, and the boring part is where the repetition happens. Your brain strengthens whatever paths get used, whether or not you are enjoying it. Scientists have found that the most effective practice often feels harder and less fun than the kind that feels good.' },
      { voice: 'An artist', says: 'Musicians play scales for years. Nobody ever claps for a scale. But the piece that gets applause is built out of them. Boring practice is the foundation, and nobody sees the foundation.' },
      { voice: 'A grandparent of faith', says: 'Many traditions have daily practices that are deliberately plain: a short prayer, a few quiet minutes, the same words each morning. The plainness is the point. Doing a small thing every day is stronger than doing a big thing once.' },
      { voice: 'A skeptic', says: 'Boring practice works, but boring practice with no thought works less well. Ask yourself after each go what was hard about it, and practice that bit. It is still repetitive, but now it is aimed.' },
    ],
    closing: 'What is something you are practicing? What is the boring part, and what is it building?',
  },
  {
    id: 'w-birds-fly',
    theme: 'world',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'How do birds fly?',
    options: ['Their wings', 'Magic', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Wings push the air down, and the air pushes the bird up.' },
      { voice: 'An artist says', says: 'Watch a bird land. It is the most careful thing you will see all day.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'A bird pushes its wings down against the air, and the air pushes back up. Its bones are hollow so it is very light, and its feathers make a smooth shape the air slides over. Every part of a bird is built for the sky.' },
      { voice: 'An artist', says: 'Watch a bird land on a branch. It slows, tilts, spreads its tail, and stops exactly where it meant to. People have drawn birds for thousands of years trying to catch that moment.' },
      { voice: 'A grandparent of faith', says: 'For most of history, flying was something only birds could do, and people looked up at them with wonder. That wonder is still a fine thing to feel, even now that we have aeroplanes.' },
      { voice: 'A skeptic', says: 'A good test: could a bird fly if it had no feathers? People have wondered that, and the answer is no, not well. So it is not just the wings. Every bit of the bird matters.' },
    ],
    closing: 'If you could fly for one minute, where would you go first?',
  },
  {
    id: 'w-shadow',
    theme: 'world',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'What is a shadow?',
    options: ['Dark light', 'Where light cannot go', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'A shadow is the place where you are blocking the light.' },
      { voice: 'An artist says', says: 'Shadows change shape all day. Try tracing yours.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Light travels in straight lines. When something is in the way, the light cannot get past, and the dark patch behind it is the shadow. Your shadow is long in the morning and short at midday because the sun is in a different place.' },
      { voice: 'An artist', says: 'Painters spend a long time learning shadows, because a picture with no shadows looks flat. Try tracing your shadow on the ground with chalk in the morning, then again after lunch. It will have moved a long way.' },
      { voice: 'A grandparent of faith', says: 'Shadows appear in a lot of old stories, sometimes as something scary and sometimes as a friend that follows you everywhere. Both are true in a way. A shadow is always yours.' },
      { voice: 'A skeptic', says: 'Can you have a shadow in the dark? Try it and see. With no light there is no shadow at all. So a shadow is not a thing on its own. It is a missing piece of light, and that is a strange idea to sit with.' },
    ],
    closing: 'Go and find your shadow. What shape is it right now?',
  },
  {
    id: 'w-why-wash-hands',
    theme: 'world',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Why do we wash our hands?',
    options: ['Germs', 'Dirt', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Tiny living things too small to see live on your hands. Soap washes them off.' },
      { voice: 'An artist says', says: 'Warm water and bubbles is a small nice thing you can do every day.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Your hands pick up tiny living things called germs everywhere they go. You cannot see them, but some of them can make you ill. Soap grabs them and water carries them away. Twenty seconds of washing is one of the best tricks anyone ever found for staying well.' },
      { voice: 'An artist', says: 'There is something calming about warm water and bubbles. Some people sing a song while they wash, which is how long it takes. It is a tiny kind thing you do for yourself and everyone you touch.' },
      { voice: 'A grandparent of faith', says: 'Many traditions have washing as part of a special moment, before a meal or a prayer. Long before anyone knew about germs, people felt that clean hands mattered. They were right for reasons they did not yet know.' },
      { voice: 'A skeptic', says: 'How do we know washing works, if we cannot see the germs? Scientists tested it. Hospitals where doctors washed their hands had far fewer sick patients. That is how you know something works: you check.' },
    ],
    closing: 'What song lasts about as long as washing your hands?',
  },
  {
    id: 'w-worried-first-day',
    theme: 'feelings',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Is it normal to feel worried before something new?',
    options: ['Yes', 'No', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Everyone feels wobbly before something new. Your body is getting ready.' },
      { voice: 'An artist says', says: 'The wobble means you care about it.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Feeling worried before something new is your body getting ready. Your heart speeds up and your tummy flutters, and that is the same thing that happens before something exciting. Grown-ups feel it too, before a new job or a big day. It nearly always fades once the new thing starts.' },
      { voice: 'An artist', says: 'Performers feel wobbly before every show, even after years. Many say the wobble means they care about doing well. If you did not care, you would not feel it. So the feeling is a kind of compliment to yourself.' },
      { voice: 'A grandparent of faith', says: 'First days are old ground for every family. Someone in your family stood at a door once, unsure, and walked through anyway. Ask them about it some time. Their story might sound a lot like yours.' },
      { voice: 'A skeptic', says: 'I would ask what exactly you are worried about. Often it is a picture in your head of what might go wrong, and that picture is usually worse than the real thing. Say the worry out loud and see if it shrinks.' },
    ],
    closing: 'What is one new thing you were worried about that turned out fine?',
  },
  {
    id: 'w-jealous',
    theme: 'feelings',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'What does it feel like when a friend gets something you wanted?',
    options: ['Sad', 'Cross', 'Both'],
    simple: [
      { voice: 'A scientist says', says: 'That mixed-up feeling has a name: jealous. Everyone gets it.' },
      { voice: 'An artist says', says: 'You can feel jealous and still be glad for your friend, at the same time.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'That prickly feeling has a name, jealous, and everyone gets it, grown-ups too. It usually mixes a bit of sad and a bit of cross. Naming it does not make it go away, but it makes it smaller and easier to be honest about.' },
      { voice: 'An artist', says: 'You can feel jealous and be glad for your friend at the same time. That sounds impossible, but hearts can hold two things at once. Saying I am happy for you, and I wish I had one too, is honest and kind.' },
      { voice: 'A grandparent of faith', says: 'Nearly every old story has someone who got jealous and did something they regretted. The stories are told so we can learn the cheaper way. Feeling jealous is completely fine. Acting on it is where the trouble starts.' },
      { voice: 'A skeptic', says: 'I would ask whether you really wanted the thing, or whether you just wanted to be the one who got it. Those are different, and the second one fades fast once you notice it.' },
    ],
    closing: 'When did you feel jealous? What would have helped in that moment?',
  },
  {
    id: 'w-say-sorry',
    theme: 'feelings',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Why is it hard to say sorry, and why does it help?',
    options: ['It feels bad', 'It helps the other person', 'Both'],
    simple: [
      { voice: 'A scientist says', says: 'Saying sorry is hard because it means admitting a mistake. It helps because it fixes things.' },
      { voice: 'An artist says', says: 'A real sorry is small and quiet and means a lot.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Saying sorry is hard because it means admitting you got something wrong, and nobody likes that feeling. But it works every time. People who apologize properly are trusted more, not less, because everyone knows mistakes happen. It is the fixing that matters.' },
      { voice: 'An artist', says: 'A real sorry is short. It does not come with a but. It looks at the person and means it. That is harder than a long speech, and it is worth more.' },
      { voice: 'A grandparent of faith', says: 'Every tradition teaches saying sorry, and most add something about forgiving too. The two of them go together. A family where people can say sorry is a family where people feel safe to be wrong.' },
      { voice: 'A skeptic', says: 'I would watch for a sorry that is really an excuse in disguise, like sorry you feel that way. A real one names what you did. The test is whether the other person feels better or worse afterwards.' },
    ],
    closing: 'Think of a time someone said sorry to you. What made it feel real?',
  },
  {
    id: 'w-lost-game',
    theme: 'failure',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'How does it feel to lose a game, and what can you do with that feeling?',
    options: ['Cross', 'Sad', 'Fine'],
    simple: [
      { voice: 'A scientist says', says: 'Losing feels bad for a little while. Then you get another go.' },
      { voice: 'An artist says', says: 'The people who lose the most games are the ones who play the most.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Losing feels bad, and that is normal. The feeling is there to make you want to do better. The trick is to let it pass in a few minutes rather than carry it all day. Then look at one thing you could try differently next time.' },
      { voice: 'An artist', says: 'The people who have lost the most games are the ones who have played the most, and they are usually the best players. Every loss is a game you played. Nobody gets good by watching.' },
      { voice: 'A grandparent of faith', says: 'Old wisdom says to be a good loser and a quiet winner. It sounds old-fashioned, and it works. People remember how you lose far more than whether you did.' },
      { voice: 'A skeptic', says: 'I would ask what you actually lost. A game, which will be played again tomorrow. Not a friend, not a limb. Keeping the size of the loss honest helps the feeling stay the right size too.' },
    ],
    closing: 'What is a game you lost that you would like to play again? What would you try differently?',
  },
  {
    id: 'w-cannot-yet',
    theme: 'failure',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'What is the difference between I cannot do it and I cannot do it yet?',
    options: ['One word', 'A lot', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Yet is a small word that means you are still on the way.' },
      { voice: 'An artist says', says: 'Every artist was once someone who could not draw yet.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'One word, and it changes everything. I cannot do it closes a door. I cannot do it yet says the door is still open and you are walking toward it. People who think in yets keep trying, and trying is how the yet turns into can.' },
      { voice: 'An artist', says: 'Every artist was once a person who could not draw yet. Every musician could not play yet. Yet is the word for the middle of learning something, and the middle is where everyone spends most of their time.' },
      { voice: 'A grandparent of faith', says: 'Patience with yourself is a kind of faith, faith that the person you are becoming is on the way. Most traditions say the same thing about growing up: it takes the time it takes.' },
      { voice: 'A skeptic', says: 'Yet is honest as long as you keep going. Saying yet and then giving up is just a nicer way of saying no. The word only works if you back it up with another try.' },
    ],
    closing: 'What is something you cannot do yet? What could you try today?',
  },
  {
    id: 'w-hard-is-good',
    theme: 'failure',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'When something is hard, does that mean you are bad at it?',
    options: ['Yes', 'No', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Hard means your brain is working. That is when it grows.' },
      { voice: 'An artist says', says: 'If it was easy, you would already know it.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Hard does not mean bad at it. Hard means your brain is stretching, and stretching is exactly when it grows. Things that feel easy are things you already know. The hard part is the learning part, every single time.' },
      { voice: 'An artist', says: 'If it were easy, there would be nothing to learn. Artists look for the hard bit on purpose, because that is where the next skill is hiding. The feeling of hard is a signpost, not a verdict.' },
      { voice: 'A grandparent of faith', says: 'Grown-ups sometimes forget how hard things were the first time. Ask one to tell you about learning to read, or drive, or cook. They will remember it was hard, and they will be glad they kept going.' },
      { voice: 'A skeptic', says: 'Sometimes hard means you need a different approach, not more effort. If you have tried the same way five times, try a new way, or ask someone. Hard is information about what to do next, so read it carefully.' },
    ],
    closing: 'What is something that is hard right now? What is one small piece of it you can already do?',
  },
  {
    id: 'w-stuck',
    theme: 'failure',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'What can you do when you feel stuck?',
    options: ['Try again', 'Ask for help', 'Take a break'],
    simple: [
      { voice: 'A scientist says', says: 'Stuck is a normal part of learning. A break, a question, or a new way usually unsticks it.' },
      { voice: 'An artist says', says: 'Sometimes the best thing is to step back and look from further away.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Everyone gets stuck, and there are three things that usually work. Take a short break, because your brain keeps working on it quietly. Ask someone, because a fresh pair of eyes sees what you cannot. Or try it a different way, because the stuck way is not the only way.' },
      { voice: 'An artist', says: 'Painters step back from the canvas when it goes wrong. From across the room you can see what is off. Stuck often means you are too close. Step back, breathe, look again.' },
      { voice: 'A grandparent of faith', says: 'Being stuck teaches patience, which nothing else teaches quite as well. Sit with it for a moment before you fight it. The way through often shows up when you stop pushing.' },
      { voice: 'A skeptic', says: 'I would check whether you are actually stuck or just tired. The two feel exactly the same. If it is tiredness, no trick works except rest. If it is real stuck, then break it into smaller pieces and find the first one you can do.' },
    ],
    closing: 'What is one thing that helped you last time you were stuck?',
  },
  {
    id: 'w-good-and-bad-same-day',
    theme: 'ups-and-downs',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Can a day be good and bad at the same time?',
    options: ['Yes', 'No', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Most days are a mix. That is what days are like.' },
      { voice: 'An artist says', says: 'A picture with only bright colors is not a real picture.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Most days are a mix, and that is normal. A good morning and a hard afternoon are both real. If you look for one word to describe the whole day, you will usually get it wrong. Two words is more honest.' },
      { voice: 'An artist', says: 'A painting with only bright colors looks fake. It needs shadow to make the light show. Days work the same way. The hard bit of a day is part of what makes the good bit feel good.' },
      { voice: 'A grandparent of faith', says: 'Old sayings from everywhere agree: take the good with the bad. Not because the bad is fine, but because waiting for a day with no bad in it means waiting forever. Both is how days come.' },
      { voice: 'A skeptic', says: 'When you say a day was bad, check: was it all bad, or was there one bad thing that took over? Usually it is one thing. Giving that one thing its own name keeps it from eating the whole day.' },
    ],
    closing: 'What was one good thing and one hard thing about today?',
  },
  {
    id: 'w-feelings-pass',
    theme: 'ups-and-downs',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Do feelings last forever?',
    options: ['Yes', 'No', 'Some do'],
    simple: [
      { voice: 'A scientist says', says: 'Feelings come like weather. Even big ones pass.' },
      { voice: 'An artist says', says: 'A storm feels like it will never end, and then it does.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Feelings are a lot like weather. They come, they feel like everything while they are here, and then they pass. Scientists have measured this: even a very strong feeling usually changes within minutes if you let it. Knowing that makes the big ones easier to sit through.' },
      { voice: 'An artist', says: 'In the middle of a storm it feels like it will never end. Then the sky clears and you can hardly remember the rain. Artists paint both, the storm and the clearing, because both are true.' },
      { voice: 'A grandparent of faith', says: 'This too shall pass is one of the oldest sayings there is, and it was said about feelings as much as anything. Every older person has proof of it in their own life. Ask one of them and see.' },
      { voice: 'A skeptic', says: 'Most feelings pass on their own, but some hang around if you keep feeding them by thinking about the same thing. So I would say feelings pass if you let them. The letting is the skill.' },
    ],
    closing: 'What is a big feeling you had last week? Is it still as big now?',
  },
  {
    id: 'w-everyone-different',
    theme: 'ups-and-downs',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Is it okay to be different from everyone else?',
    options: ['Yes', 'No', 'Sometimes'],
    simple: [
      { voice: 'A scientist says', says: 'No two people are the same. Different is how people come.' },
      { voice: 'An artist says', says: 'The best pictures are the ones nobody else could have made.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'No two people are alike, not even twins. Different is not something that happens to a few people. It is how every person is made. Being different is the normal way to be.' },
      { voice: 'An artist', says: 'The only pictures worth looking at are the ones nobody else could have made. Your differences are the part of you that no one else can copy. That is not a problem to fix. That is the whole point.' },
      { voice: 'A grandparent of faith', says: 'Many traditions teach that every person is made on purpose, and that includes the bits that are unusual. Families are full of people who are different from each other, and that is what makes a family interesting.' },
      { voice: 'A skeptic', says: 'Everyone feels different sometimes, which means feeling different is one of the most common feelings there is. Being unusual is the usual way to be. That is a strange thing, and a true one.' },
    ],
    closing: 'What is one thing about you that is different from your friends? Do you like it?',
  },
  {
    id: 'w-ocean-deep',
    theme: 'world',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'How deep is the ocean?',
    options: ['Very', 'To the middle of the world', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'The deepest part is so deep that a mountain would disappear in it.' },
      { voice: 'An artist says', says: 'Nobody has seen most of the ocean. Imagine what is down there.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'The deepest part of the ocean is so deep that the tallest mountain on Earth would sink into it with room to spare. It is pitch dark down there and very cold, and there are still creatures living in it that nobody has ever seen up close.' },
      { voice: 'An artist', says: 'Most of the ocean has never been seen by human eyes. That means most of the ocean is still up to your imagination. Artists have filled it with sea monsters for thousands of years, and who is to say they were wrong?' },
      { voice: 'A grandparent of faith', says: 'The sea has always made people feel small in a good way. Standing on a beach and looking out is one of the oldest ways of feeling wonder. You do not need to know how deep it is to feel that.' },
      { voice: 'A skeptic', says: 'How would anyone measure something that deep? People lowered ropes for hundreds of years and ran out of rope. Then they used sound, which bounces back. Every big fact has a story of how someone found it out.' },
    ],
    closing: 'If you could go to the bottom of the sea in a little window boat, what would you hope to see?',
  },
  {
    id: 'w-cat-purr',
    theme: 'world',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Why do cats purr?',
    options: ['They are happy', 'They are talking', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'Cats purr when they are happy, and sometimes when they are hurt too. Nobody knows all of why.' },
      { voice: 'An artist says', says: 'A purr is a tiny engine of contentment.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Cats purr when they are content, but also sometimes when they are frightened or hurt, which puzzled scientists for a long time. Some think the purring helps a cat heal. The strange truth is that nobody fully knows why cats purr, and cats are not telling.' },
      { voice: 'An artist', says: 'A purring cat on your lap is one of the calmest sounds there is. Some people say it is a tiny engine of happiness. Whatever it is for, the sound is a gift to whoever is nearby.' },
      { voice: 'A grandparent of faith', says: 'Cats have lived beside people for thousands of years, and in some old traditions they were treated as almost sacred. A creature that hums when it is happy is easy to love. Perhaps that is the whole reason.' },
      { voice: 'A skeptic', says: 'I like this one because the honest answer is we do not fully know. That is well worth remembering. Not every question has a finished answer yet, and saying I am not sure is sometimes the smartest thing a person can say.' },
    ],
    closing: 'What is a sound that makes you feel calm?',
  },
  {
    id: 'w-old-people-know',
    theme: 'world',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'Why do older people know so many things?',
    options: ['They read a lot', 'They lived a lot', 'Not sure'],
    simple: [
      { voice: 'A scientist says', says: 'They have had more days to learn things in. Every day adds a little.' },
      { voice: 'An artist says', says: 'Ask an older person a question and watch what happens.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Older people have simply had more days, and every day teaches something. Not just facts, but how things go, what usually happens next, which mistakes are worth avoiding. That kind of knowing takes years to build and cannot be rushed.' },
      { voice: 'An artist', says: 'Ask an older person a real question and watch their face. Most have stories nobody has asked them for in years. Some of the best things you will ever hear are waiting inside someone who is over seventy.' },
      { voice: 'A grandparent of faith', says: 'Every tradition asks children to respect their elders, and the reason is practical: the elders remember what did not work last time. That is worth more than it sounds. They are also, most of them, very glad to be asked.' },
      { voice: 'A skeptic', says: 'Older people know a lot, and they also sometimes know things that were true once and are not any more. So listen well, and check what you hear. Do both at the same time. That is a kind of respect too.' },
    ],
    closing: 'What is one question you could ask an older person this week?',
  },
  {
    id: 'w-help-someone',
    theme: 'feelings',
    stage: 'early',
    courseIds: [],
    answerMode: 'pick',
    prompt: 'How does it feel to help someone?',
    options: ['Good', 'Tiring', 'Both'],
    simple: [
      { voice: 'A scientist says', says: 'Helping someone makes your own brain feel good. It is built that way.' },
      { voice: 'An artist says', says: 'The smallest help can be the biggest thing in the day of someone else.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'Helping someone makes your own brain release a little wave of good feeling. It is built in, and scientists think it is part of why people managed to live together for so long. The feeling is real, and it is yours to keep.' },
      { voice: 'An artist', says: 'The smallest help can be the biggest thing in the day of someone else. Holding a door, picking up a dropped glove, noticing someone alone. You will not always know what it meant to them, and that is perfectly fine. It still counted for something.' },
      { voice: 'A grandparent of faith', says: 'Every tradition puts helping others right at the center. Not as a rule to obey, but as the thing that makes a life feel like it was worth living. The people who help most are usually the happiest, and that is not a coincidence.' },
      { voice: 'A skeptic', says: 'Helping feels good, and it can also be tiring, and both are true. So I would say help in ways you can keep up, rather than one big burst and then nothing. Small and steady is the real thing.' },
    ],
    closing: 'Who did you help this week? How did it feel afterwards?',
  },
  {
    id: 'w-ants-elephant',
    theme: 'world',
    stage: 'early',
    courseIds: ['counting-k', 'letters-k'],
    answerMode: 'pick',
    prompt: 'Is a big group of tiny ants more than one elephant, or less?',
    options: ['More', 'Less', 'It depends'],
    // For children who cannot read yet: two voices, one short sentence each, meant to be
    // heard rather than read. Four paragraphs is far too much to listen to at five.
    simple: [
      { voice: 'A scientist says', says: 'There are more ants, but the elephant is heavier.' },
      { voice: 'An artist says', says: 'Ants make a wiggly line. An elephant is one big shape.' },
    ],
    perspectives: [
      { voice: 'A scientist', says: 'It depends on what you are counting. There are many more ants in the group, but the elephant is far heavier than all of them put together. Both answers are correct once you say which one you mean.' },
      { voice: 'An artist', says: 'A line of ants moves and changes shape as you watch it. An elephant is one big shape that stays where it is. They are both wonderful to draw, and they need completely different kinds of lines.' },
      { voice: 'A grandparent of faith', says: 'Some people believe that every living thing matters, however small it happens to be. In that way of thinking, a tiny ant and a huge elephant are both special. Being big is not the same as being important.' },
      { voice: 'A skeptic', says: 'I would rather find out than guess. We could count the ants one by one, or we could put them on a scale. Which answer we get depends entirely on which test we decide to run.' },
    ],
    closing: 'What else could we count instead? What else could we weigh?',
  },
];

// Nothing reaches a student until somebody at the school has read it and said yes.
// Reflection questions are the most sensitive content in the platform, so approval is
// deliberately opt in rather than opt out. An unreviewed question simply never appears.
export function emptyWonderReview() { return { version: 1, approved: [], hidden: [] }; }

// Ordered the way a student meets them, from the first in kindergarten to the last in
// twelfth grade. Within a stage we go by the earliest grade the question can appear in.
// The grade a student first meets this question, in words. Used instead of listing every
// module, which was more detail than an educator needs while reviewing.
export function wonderFirstSeen(w) {
  const grades = w.courseIds.map((id) => { const c = getCourse(id); return c ? c.grade : null; }).filter(Boolean);
  if (grades.length === 0) return '';
  const earliest = grades.sort((a, b) => GRADES.indexOf(a) - GRADES.indexOf(b))[0];
  return gradeLabel(earliest);
}

export function wonderInOrder() {
  const earliestGrade = (w) => Math.min(...w.courseIds.map((id) => {
    const c = getCourse(id);
    return c ? GRADES.indexOf(c.grade) : 99;
  }));
  const stageOrder = (w) => LIFE_STAGES.findIndex((st) => st.id === (w.stage || 'early'));
  return [...WONDER].sort((a, b) => stageOrder(a) - stageOrder(b) || earliestGrade(a) - earliestGrade(b));
}

// Approves everything that has not been removed. Removed questions stay removed.
// Everything back to awaiting review, so a school can start over. Removed questions stay removed.
export function unapproveAllWonder(review) {
  return { ...review, approved: [] };
}

export function approveAllWonder(review) {
  const ids = WONDER.filter((w) => !review.hidden.includes(w.id)).map((w) => w.id);
  return { ...review, approved: [...new Set([...review.approved, ...ids])] };
}
export function isWonderApproved(review, id) { return review.approved.includes(id); }
export function isWonderHidden(review, id) { return review.hidden.includes(id); }
export function approveWonder(review, id) {
  return { ...review, approved: review.approved.includes(id) ? review.approved : [...review.approved, id], hidden: review.hidden.filter((x) => x !== id) };
}
export function unapproveWonder(review, id) {
  return { ...review, approved: review.approved.filter((x) => x !== id) };
}
export function hideWonder(review, id) {
  return { ...review, hidden: review.hidden.includes(id) ? review.hidden : [...review.hidden, id], approved: review.approved.filter((x) => x !== id) };
}
export function restoreWonder(review, id) {
  return { ...review, hidden: review.hidden.filter((x) => x !== id) };
}
// How many are still waiting for somebody to look at them.
export function wonderAwaitingReview(review) {
  return WONDER.filter((w) => !review.approved.includes(w.id) && !review.hidden.includes(w.id)).length;
}

// The four things a reflection is for. Every question carries one, and the rotation
// keeps them in balance. After a failed round, the questions about failure and feelings
// come first, because that is when they land.
export const WONDER_THEMES = {
  world: 'Curiosity about the world',
  failure: 'Failure is how learning happens',
  feelings: 'Naming and handling feelings',
  'ups-and-downs': 'Hard days are normal, and we get through them',
};
// How often a reflection comes round: after this many finished rounds, pass or fail,
// since the last one. Rounds rather than masteries, so a child who is struggling meets
// more reflections, not fewer.
export const WONDER_EVERY = 2;
// A question is never offered more than this many times to one student. Once every
// question in the pool has hit the limit, the reflection is skipped rather than repeated.
export const WONDER_MAX_REPEATS = 2;

// Which stage a course belongs to, for sharing reflection questions across courses.
export function stageForGrade(grade) {
  if (['PK3', 'PK4', 'K', '1', '2'].includes(grade)) return 'early';
  if (['3', '4', '5'].includes(grade)) return 'growing';
  if (['6', '7', '8'].includes(grade)) return 'teen';
  return 'grown';
}

// The reflection a student should meet now, or null if none is due or none is approved.
// Due means WONDER_EVERY modules mastered since the last reflection was answered. The
// pool is every approved question for this course or this course's stage, and the one
// answered longest ago (or never) comes first, so questions rotate rather than repeat.
export function nextWonder(events, courseId, review, preReader = false) {
  const state = review || emptyWonderReview();
  const active = activeEvents(events);
  let since = 0; let lastRoundFailed = false; let seen = false;
  for (let i = active.length - 1; i >= 0; i--) {
    const e = active[i];
    if (e.type === 'wonder_answered') break;
    if (e.type === 'attempt_completed') { if (!seen) { lastRoundFailed = !isMasteredAttempt(e); seen = true; } since++; }
  }
  if (since < WONDER_EVERY) return null;
  const course = getCourse(courseId);
  const stage = course ? stageForGrade(course.grade) : 'early';
  const pool = WONDER.filter((w) => state.approved.includes(w.id) && !state.hidden.includes(w.id)
    && (w.courseIds.includes(courseId) || (w.stage || 'early') === stage)
    && (!preReader || Array.isArray(w.simple)));
  if (pool.length === 0) return null;
  const lastAt = {}; const times = {};
  for (const e of active) if (e.type === 'wonder_answered') { lastAt[e.wonderId] = e.at; times[e.wonderId] = (times[e.wonderId] || 0) + 1; }
  const fresh = pool.filter((w) => (times[w.id] || 0) < WONDER_MAX_REPEATS);
  if (fresh.length === 0) return null;
  // Theme balance: the theme met longest ago comes first. After a failed round, the
  // failure and feelings questions jump the queue.
  const themeLast = {};
  for (const e of active) if (e.type === 'wonder_answered') { const w = WONDER.find((x) => x.id === e.wonderId); if (w) themeLast[w.theme || 'world'] = e.at; }
  const comfort = (w) => (lastRoundFailed && ['failure', 'feelings', 'ups-and-downs'].includes(w.theme || 'world') ? 0 : 1);
  fresh.sort((a, b) => (times[a.id] || 0) - (times[b.id] || 0)
    || comfort(a) - comfort(b)
    || String(themeLast[a.theme || 'world'] || '').localeCompare(String(themeLast[b.theme || 'world'] || ''))
    || String(lastAt[a.id] || '').localeCompare(String(lastAt[b.id] || ''))
    || (b.courseIds.includes(courseId) ? 1 : 0) - (a.courseIds.includes(courseId) ? 1 : 0));
  return fresh[0];
}

export function wonderFor(courseId, seed, review) {
  const state = review || emptyWonderReview();
  const list = WONDER.filter((w) => w.courseIds.includes(courseId) && state.approved.includes(w.id) && !state.hidden.includes(w.id));
  if (list.length === 0) return null;
  return list[Math.abs(seed) % list.length];
}

// The only thing stored about a reflection: which one, when, how long, roughly how much.
export function makeWonderEvent(wonderId, moduleId, at, seconds, wordCount) {
  return { type: 'wonder_answered', at, wonderId, moduleId, seconds, wordCount };
}

// ---------------------------------------------------------------------
// 7. ROSTER — the students an administrator has created
//    Students never type their own ID; they pick it from this list. That is
//    why a typo can never strand a child's progress in an unreachable record.
//    A roster is { version, students: [{ id, label, createdAt, active }] }.
//    Every function here returns a NEW roster; nothing is edited in place.
// ---------------------------------------------------------------------
// An educator's rough guess at where a new student is. It decides where the placement
// check starts, so an older student never sees pre-K questions. It is a starting point,
// not a judgement, and the check moves up or down from here.
export const LEVELS = [
  { id: 'early', title: 'Early years', blurb: 'Pre-K to grade 2. Unable to read or just beginning to.', grades: ['PK3', 'PK4', 'K', '1', '2'], picture: true },
  { id: 'elementary', title: 'Elementary', blurb: 'Grades 3 to 5.', grades: ['3', '4', '5'], picture: false },
  { id: 'middle', title: 'Middle school', blurb: 'Grades 6 to 8.', grades: ['6', '7', '8'], picture: false },
  { id: 'high', title: 'High school and beyond', blurb: 'Grade 9 through college-level.', grades: ['9', '10', '11', '12', 'C'], picture: false },
];
export function levelFor(id) { return LEVELS.find((l) => l.id === id) || null; }

// Pictures a young student can recognise instead of reading their name. These are drawn
// in the app, never uploaded: a photo of a child is personal information, and a small set
// of friendly animals does the same job with nothing to protect.
export const PICTURES = ['fox', 'owl', 'frog', 'whale', 'bee', 'cat', 'turtle', 'rabbit', 'bear', 'fish', 'duck', 'snail'];
// A background colour behind the animal. Twelve animals times six colours is seventy-two
// pictures, enough that no two children in a large school need share one. Colour is
// something a four-year-old tells apart instantly, which is why it is the second axis.
export const TINTS = [
  { id: 'sun', color: '#F6E7B2' },
  { id: 'sky', color: '#CFE3F2' },
  { id: 'leaf', color: '#D2E6C8' },
  { id: 'berry', color: '#F2CFD8' },
  { id: 'peach', color: '#F8DAC2' },
  { id: 'lilac', color: '#DDD3EE' },
];
export function tintFor(id) { return TINTS.find((t) => t.id === id) || null; }

// Is this picture already on the sign-in screen? Active students only, so a hidden or
// merged record does not keep a picture out of use.
export function pictureInUse(roster, picture, tint, exceptId = null) {
  return roster.students.some((s) => s.active && s.id !== exceptId && s.picture === picture && s.tint === tint);
}

// The first combination nobody is using, so an educator can accept a suggestion and move on.
export function firstFreePicture(roster) {
  for (const tint of TINTS) for (const picture of PICTURES) if (!pictureInUse(roster, picture, tint.id)) return { picture, tint: tint.id };
  return { picture: PICTURES[0], tint: TINTS[0].id };
}

export function emptyRoster() { return { version: 1, students: [] }; }

// Turns whatever an admin typed into a safe storage key: letters, numbers, underscores.
export function normalizeStudentId(raw) {
  return String(raw || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

export function findStudent(roster, id) {
  return roster.students.find((s) => s.id === normalizeStudentId(id)) || null;
}

export function activeStudents(roster) { return roster.students.filter((s) => s.active); }

// Adds a student. Returns { roster, error } — error is a plain sentence for the screen.
export function addStudent(roster, rawId, at, extras = {}) {
  const id = normalizeStudentId(rawId);
  if (!id) return { roster, error: 'Enter a student ID first.' };
  if (findStudent(roster, id)) return { roster, error: 'That student ID is already on the list.' };
  if (!levelFor(extras.level)) return { roster, error: 'Choose a starting level first.' };
  const level = extras.level;
  const picture = PICTURES.includes(extras.picture) ? extras.picture : null;
  const tint = picture && tintFor(extras.tint) ? extras.tint : picture ? TINTS[0].id : null;
  const student = { id, label: String(rawId).trim(), createdAt: at, active: true, level, picture, tint };
  return { roster: { ...roster, students: [...roster.students, student] }, error: null };
}

// Changes the name shown on screen. The id never changes, so progress is never lost.
export function renameStudent(roster, id, newLabel) {
  const label = String(newLabel || '').trim();
  if (!label) return { roster, error: 'Enter a name first.' };
  return { roster: { ...roster, students: roster.students.map((s) => (s.id === normalizeStudentId(id) ? { ...s, label } : s)) }, error: null };
}

// Changes the starting level or the picture. Either can be left empty.
export function setStudentLevel(roster, id, level) {
  const clean = levelFor(level) ? level : null;
  return { ...roster, students: roster.students.map((s) => (s.id === normalizeStudentId(id) ? { ...s, level: clean } : s)) };
}
export function setStudentPicture(roster, id, picture, tint) {
  const clean = PICTURES.includes(picture) ? picture : null;
  const cleanTint = clean ? (tintFor(tint) ? tint : TINTS[0].id) : null;
  return { ...roster, students: roster.students.map((s) => (s.id === normalizeStudentId(id) ? { ...s, picture: clean, tint: cleanTint } : s)) };
}

// Hides a student without deleting anything, so their record can be brought back.
export function setStudentActive(roster, id, active) {
  return { ...roster, students: roster.students.map((s) => (s.id === normalizeStudentId(id) ? { ...s, active } : s)) };
}

// Merging two records (a child was added twice). The kept student stays; the other
// is marked merged and hidden. Their event logs are joined in time order, so nothing
// a child did is ever thrown away.
export function mergeStudents(roster, keepId, mergeId) {
  const keep = findStudent(roster, keepId);
  const merge = findStudent(roster, mergeId);
  if (!keep || !merge) return { roster, error: 'Pick two students on the list.' };
  if (keep.id === merge.id) return { roster, error: 'Pick two different students.' };
  return {
    roster: { ...roster, students: roster.students.map((s) => (s.id === merge.id ? { ...s, active: false, mergedInto: keep.id } : s)) },
    error: null,
  };
}

export function mergeEventLogs(eventsA, eventsB) {
  return [...eventsA, ...eventsB].sort((x, y) => String(x.at).localeCompare(String(y.at)));
}

// ---------------------------------------------------------------------
// 8. LIFE SKILLS — suggestions for educators, not modules for students
//    The whole point of making the academic work efficient is the time it
//    frees up. This section is what an educator does with that time. None
//    of it is graded, none of it is tracked, and no child ever sees it.
//    Each entry says what the skill is, why it matters, and a few ways to
//    practice it. They are listed from earliest to most mature rather than
//    pinned to a grade, because nobody can honestly say cooking belongs in
//    third rather than second, and a mixed age classroom has no single grade
//    to look under. The order is a sequence, not a schedule.
// ---------------------------------------------------------------------
export const LIFE_SKILLS = [
  // ---- Earliest ----
  {
    id: 'ls-bike',
    stage: 'early',
    title: 'Riding a bike',
    why: 'Learning to ride is one of the first times a child fails repeatedly at something and then succeeds anyway. That memory is worth more than the skill itself. It becomes the thing they can point to later, when something else feels impossible.',
    ways: ['Start with a balance bike or take the pedals off, so balance comes before pedalling.', 'Practice on grass rather than pavement. Falling matters less when it hurts less.', 'Let them decide when the helping hand comes off, even if they take longer than you would like.'],
  },
  {
    id: 'ls-dressing',
    stage: 'early',
    title: 'Getting dressed and tying shoes',
    why: 'Doing something for yourself feels different from having it done for you. Small daily tasks are where independence is actually built. They also happen to be excellent practice for fingers that are still learning fine control.',
    ways: ['Lay clothes out the night before and let them do the rest in the morning.', 'Teach one shoe. Let them try the second on their own.', 'Build in extra time so nobody has to take over at the last minute.'],
  },
  {
    id: 'ls-feelings',
    stage: 'early',
    title: 'Naming how you feel',
    why: 'A child who can say "I am frustrated" is far less likely to throw something. Putting a name to a feeling makes it smaller and easier to handle. This is the foundation everything else about emotions gets built on.',
    ways: ['Name your own feelings out loud during the day, so they hear it modelled.', 'Keep a small set of faces on the wall and let them point rather than explain.', 'Ask what the feeling wanted them to do, not just what it was.'],
  },
  {
    id: 'ls-boredom',
    stage: 'early',
    title: 'Being bored on purpose',
    why: 'Boredom is uncomfortable, and that discomfort is exactly where imagination starts. Children who are never bored never learn to entertain themselves. The skill being practiced here is tolerating an empty moment without reaching for something.',
    ways: ['Set aside twenty minutes with no screens, no toys and no plan.', 'Resist the urge to rescue them from complaining about it.', 'Notice out loud what they invented once the twenty minutes are over.'],
  },
  {
    id: 'ls-helping',
    stage: 'early',
    title: 'Helping at home',
    why: 'Contributing to a household is how a child learns they matter to a group. The job itself is almost beside the point. What sticks is the sense of being counted on.',
    ways: ['Give a job that is genuinely needed rather than one invented for them.', 'Accept work that is done badly rather than redoing it in front of them.', 'Rotate jobs so nobody gets stuck with the worst one forever.'],
  },
  {
    id: 'ls-newpeople',
    stage: 'early',
    title: 'Talking to someone new',
    why: 'Starting a conversation is a skill, not a personality trait, and it improves with practice. Young children can learn the shape of it long before they need it. Greet, ask a question, listen to the answer.',
    ways: ['Practice ordering their own food at a counter.', 'Give them one question to ask a new person, so they are not starting from nothing.', 'Talk about what the other person said afterwards, so listening counts as part of it.'],
  },

  {
    id: 'ls-sharing',
    stage: 'early',
    title: 'Sharing and taking turns',
    why: 'Waiting your turn is genuinely hard when you are four. It is also the first version of a skill you will use for the rest of your life. Every negotiation an adult makes is built on this.',
    ways: ['Play games with clear turns, so the rule does the work instead of an adult.', 'Name the wait out loud. Saying "it is hard to wait" makes it easier to bear.', 'Let a small argument run for a moment before stepping in.'],
  },
  {
    id: 'ls-tidying',
    stage: 'early',
    title: 'Putting your things away',
    why: 'A child who tidies their own mess learns that actions have a tail. It is also the cheapest possible lesson in respecting a shared space. Doing it badly still counts.',
    ways: ['Give everything one obvious home, so tidying is not also a puzzle.', 'Tidy alongside them rather than supervising from a chair.', 'Keep it short. Five focused minutes beats an hour of complaining.'],
  },
  {
    id: 'ls-outdoors',
    stage: 'early',
    title: 'Playing outside',
    why: 'Outdoor play builds balance, judgement and stamina in ways no indoor activity matches. It also gives a child the chance to take a small risk and survive it. That confidence is hard to teach any other way.',
    ways: ['Go out in poor weather sometimes, since the right coat solves most of it.', 'Let them climb slightly higher than feels comfortable to you.', 'Leave long stretches unplanned so they invent the game themselves.'],
  },
  {
    id: 'ls-asking',
    stage: 'early',
    title: 'Asking for help',
    why: 'Some children would rather struggle in silence than admit they are stuck. Asking well is a skill, and it needs practice before the stakes are high. It starts with knowing that being stuck is normal.',
    ways: ['Say what you tried first, then what you need. Practice that shape out loud.', 'Thank them for asking rather than jumping straight to the answer.', 'Talk about a time you were stuck yourself and had to ask.'],
  },

  {
    id: 'ls-calm-body',
    stage: 'early',
    title: 'Calming your body down',
    why: 'Big feelings land in the body before they reach words. A child who can slow their own breathing has a way out of a moment that would otherwise run away with them. It works because it is physical, not because they understand it.',
    ways: ['Breathe out for longer than you breathe in, and count it together.', 'Practice when they are calm, so the skill is there when they are not.', 'Do it alongside them rather than instructing from across the room.'],
  },
  {
    id: 'ls-feelings-pass',
    stage: 'early',
    title: 'Noticing that feelings pass',
    why: 'To a small child a bad feeling can seem permanent. Watching one arrive and then leave, over and over, teaches otherwise. That single idea prevents an enormous amount of later distress.',
    ways: ['Afterwards, ask how long the feeling lasted. They are usually surprised.', 'Name the ending as clearly as the beginning. "That one has gone now."', 'Avoid rushing them out of it, since the lesson is in the waiting.'],
  },

  // ---- Growing up ----
  {
    id: 'ls-speaking',
    stage: 'growing',
    title: 'Speaking in front of people',
    why: 'Most adults rank public speaking above heights and spiders on their list of fears. Children who start early rarely develop that fear at all. The trick is many small audiences rather than one big terrifying one.',
    ways: ['Two minutes on something they already love, in front of four people.', 'Record it and let them watch it back themselves rather than being critiqued.', 'Build up the audience slowly across the year instead of all at once.'],
  },
  {
    id: 'ls-money',
    stage: 'growing',
    title: 'Handling money',
    why: 'Money is abstract until a child has held some and had to choose. Spending their own money on the wrong thing teaches more than any lecture about saving. Do it now, while the amounts are small enough to be harmless.',
    ways: ['Give a small amount and let them spend it badly without stepping in.', 'Set a savings goal they chose, then track it somewhere visible.', 'Talk about the price of things you buy together, including why you sometimes choose the dearer one.'],
  },
  {
    id: 'ls-business',
    stage: 'growing',
    title: 'Running a small business',
    why: 'A lemonade stand contains almost everything a real business does. There are costs, a price, customers who say no, and a profit to count at the end. It is the quickest way to make several abstract ideas concrete.',
    ways: ['Work out the cost of the supplies before setting a price.', 'Let them handle the money and the customers, however slowly it goes.', 'Count the profit together at the end and talk honestly about whether it was worth the effort.'],
  },
  {
    id: 'ls-cooking',
    stage: 'growing',
    title: 'Cooking a simple meal',
    why: 'Feeding yourself is the most practical independence there is. Cooking also quietly teaches reading, measuring, sequencing and timing. A child who can make three meals will never be stuck.',
    ways: ['Pick one meal and make it repeatedly until it is genuinely theirs.', 'Let them use a real knife with real supervision rather than a plastic one.', 'Put them in charge of the whole thing once a week, including the clearing up.'],
  },
  {
    id: 'ls-reading',
    stage: 'growing',
    title: 'Reading for pleasure',
    why: 'Reading for school and reading for fun are almost different activities. The second one is where vocabulary, patience and imagination actually grow. It also breaks the habit of reaching for a screen the moment things go quiet.',
    ways: ['Let them abandon books they are not enjoying without any guilt.', 'Keep a set reading time rather than a set number of pages.', 'Let them see you reading, since it is far more persuasive than being told to.'],
  },
  {
    id: 'ls-argument',
    stage: 'growing',
    title: 'Settling an argument',
    why: 'Falling out with a friend is normal. Knowing how to repair it is the rare part. A child who can apologize properly and hear an apology has a skill many adults never manage.',
    ways: ['Teach the difference between "sorry you feel that way" and a real apology.', 'Have each side say the other point of view before responding to it.', 'Let them work it out themselves where it is safe to, even when it is slow.'],
  },
  {
    id: 'ls-living',
    stage: 'growing',
    title: 'Caring for a living thing',
    why: 'A plant or an animal does not care whether a child feels like helping today. That is precisely the lesson. Something depends on them, and the consequences of forgetting are visible.',
    ways: ['Start with a plant, which is forgiving and cheap to replace.', 'Put the responsibility entirely on them, including remembering.', 'Talk about what happened when it was forgotten, without making it a punishment.'],
  },
  {
    id: 'ls-screens',
    stage: 'growing',
    title: 'Noticing what screens do to you',
    why: 'Telling a child screens are bad achieves very little. Helping them notice how they feel after two hours achieves a great deal. The goal is self-awareness rather than obedience.',
    ways: ['Ask how they feel after a long session, without judging the answer.', 'Try a screen-free day together, so it is not something imposed on them alone.', 'Let them help set the rules, since rules they helped write get broken less often.'],
  },
  {
    id: 'ls-chores',
    stage: 'growing',
    title: 'Doing a job properly',
    why: 'There is a difference between finishing a job and doing it well. Learning to spot that difference is worth more than the job itself. It is also the beginning of taking pride in work.',
    ways: ['Agree what "done" looks like before they start.', 'Let them check their own work before you look at it.', 'Praise the standard rather than the speed.'],
  },
  {
    id: 'ls-plans',
    stage: 'growing',
    title: 'Making a plan and sticking to it',
    why: 'A goal without a plan stays a wish. Breaking something into steps is a skill that transfers to almost everything. Children can learn it on something small and enjoyable.',
    ways: ['Pick a project they chose, then write the steps down together.', 'Put the plan somewhere visible and tick things off.', 'Talk about what went wrong afterwards without treating it as failure.'],
  },
  {
    id: 'ls-disagree',
    stage: 'growing',
    title: 'Disagreeing without falling out',
    why: 'Being able to say "I see it differently" without it becoming a fight is rare even among adults. It is much easier to learn young. The goal is to stay curious rather than to win.',
    ways: ['Have them argue the opposite side of something they believe.', 'Practice saying what the other person meant before replying.', 'Notice out loud when they change their mind, since that takes courage.'],
  },
  {
    id: 'ls-firstaid',
    stage: 'growing',
    title: 'Basic first aid',
    why: 'Knowing what to do in the first thirty seconds matters more than most people realize. A child who can clean a cut and call for help is genuinely useful. It also makes them calmer when something goes wrong.',
    ways: ['Teach cleaning and covering a small cut, and let them do it themselves.', 'Practice calling emergency services out loud, including the address.', 'Keep the first aid kit somewhere they can reach and know about.'],
  },

  {
    id: 'ls-inner-voice',
    stage: 'growing',
    title: 'The voice in your head',
    why: 'Everyone has a running commentary in their head, and most people assume it is simply true. Noticing that it is talking, rather than being carried along by it, changes everything. It is the beginning of thinking about your own thinking.',
    ways: ['Ask what their head said just then, as though reporting someone else.', 'Point out that the voice has been wrong before, without arguing with it.', 'Try giving it a silly name, which makes it much easier to notice.'],
  },
  {
    id: 'ls-hard-feelings',
    stage: 'growing',
    title: 'Sitting with a difficult feeling',
    why: 'The instinct with an unpleasant feeling is to fix it, fight it or flee from it. Learning to simply let it be there is harder and far more useful. Feelings that are allowed to run their course tend to pass quicker.',
    ways: ['Name it without adding a story about whose fault it is.', 'Find where it sits in the body, since that gives it edges.', 'Wait it out together for two minutes before deciding anything.'],
  },
  {
    id: 'ls-mind-exercise',
    stage: 'growing',
    title: 'Exercising the mind',
    why: 'Attention is trainable in much the same way muscles are. Puzzles, memory games, an instrument and long books all strengthen it, and short bursts of video quietly weaken it. What you practice is what you get.',
    ways: ['Pick one thing that needs sustained attention and do it several times a week.', 'Stretch the length gradually rather than starting long.', 'Notice out loud when their focus lasted longer than it used to.'],
  },
  {
    id: 'ls-gratitude',
    stage: 'growing',
    title: 'Noticing what is already good',
    why: 'It takes no effort to notice what is wrong, and real effort to notice what is fine. Attention is a habit, and it can be pointed either way. Children who practice this are measurably steadier.',
    ways: ['Name three ordinary good things at the same time each day.', 'Keep it small and specific rather than grand and vague.', 'Say yours too, since it is far more persuasive than instructing them.'],
  },

  // ---- Teen ----
  {
    id: 'ls-cook-full',
    stage: 'teen',
    title: 'Cooking for other people',
    why: 'Cooking one meal for yourself is useful. Cooking for four, on time, with everything hot at once, is a different skill entirely. It teaches planning, timing and hospitality in one go.',
    ways: ['Give them the whole meal, including the shopping list and the budget.', 'Let the timing go wrong once, since that is where the lesson is.', 'Have them cook for someone outside the family occasionally.'],
  },
  {
    id: 'ls-budget',
    stage: 'teen',
    title: 'Living on a budget',
    why: 'Money runs out faster than anyone expects the first time. Better that happens at sixteen with a small amount than at twenty two with rent to pay. The habit of tracking is what carries forward.',
    ways: ['Give a set amount for a month rather than money on request.', 'Track everything for one month, including the small things.', 'Talk honestly about a time your own budgeting went wrong.'],
  },
  {
    id: 'ls-tire',
    stage: 'teen',
    title: 'Changing a tire and basic car care',
    why: 'Being stranded is mostly a matter of not knowing three simple things. Checking oil, checking tire pressure and changing a wheel cover most of it. It is an afternoon that pays off for decades.',
    ways: ['Do it in a driveway before it is ever needed at the roadside.', 'Have them do it alone once while you watch and say nothing.', 'Show where the jack points are, since that is what people get wrong.'],
  },
  {
    id: 'ls-email',
    stage: 'teen',
    title: 'Writing to someone in authority',
    why: 'Writing to a teacher, a landlord or an employer follows rules nobody teaches directly. Getting the tone right opens doors, and getting it wrong quietly closes them. It is a short skill with a long reach.',
    ways: ['Write a real email that has to be sent, not a pretend one.', 'Read it aloud before sending, since the ear catches what the eye misses.', 'Talk about what the reader needs to know in the first two lines.'],
  },
  {
    id: 'ls-phone',
    stage: 'teen',
    title: 'Noticing what your phone is doing to you',
    why: 'Phones are engineered to be hard to put down, and knowing that is half the defense. The goal is not abstinence but awareness. A teenager who can name the pull is far better placed than one told to resist it.',
    ways: ['Look at the weekly screen time figure together without judgement.', 'Try a full day off and talk about the first hour honestly.', 'Let them set their own limits, since imposed ones get resented and dodged.'],
  },
  {
    id: 'ls-conflict',
    stage: 'teen',
    title: 'Repairing a friendship',
    why: 'Most friendships end from neglect and awkwardness rather than any real falling out. Knowing how to go back after a bad moment is unusual and valuable. It gets harder to learn the longer you leave it.',
    ways: ['Talk about the difference between explaining and excusing.', 'Practice going first, since somebody has to.', 'Accept that some repairs do not work, and that trying still counted.'],
  },

  {
    id: 'ls-rumination',
    stage: 'teen',
    title: 'Getting out of a thought loop',
    why: 'Turning the same thought over for hours feels like solving something, but it almost never is. Recognising the loop is most of the escape. The way out is usually action or attention rather than more thinking.',
    ways: ['Notice when the thought has stopped producing anything new.', 'Break it with something physical rather than another thought.', 'Write the worry down once, then stop rewriting it in your head.'],
  },
  {
    id: 'ls-reframe',
    stage: 'teen',
    title: 'Questioning your own story',
    why: 'We build a whole account of an event from a single glance or remark, then defend it as fact. Learning to ask what else could be true is a genuine superpower. It is also the fastest way to defuse an argument.',
    ways: ['Ask what a kind explanation of the same behavior would sound like.', 'Separate what actually happened from what it was assumed to mean.', 'Notice how confident the story felt while it was wrong.'],
  },
  {
    id: 'ls-solitude',
    stage: 'teen',
    title: 'Being alone without a screen',
    why: 'Time alone with your own thoughts is where reflection happens, and it is the first thing a phone takes away. Most people find the first ten minutes uncomfortable and the next thirty valuable. That discomfort is worth pushing through.',
    ways: ['Go for a walk with no phone, no music and no destination.', 'Expect the boredom, and treat it as the point rather than a failure.', 'Talk afterwards about what came to mind, since it is often unexpected.'],
  },
  {
    id: 'ls-help-mental',
    stage: 'teen',
    title: 'Knowing when to ask for help',
    why: 'Every mind has hard stretches, and there is no medal for handling one alone. Knowing the difference between a rough week and something that needs help is a skill worth having early. So is knowing who to ask.',
    ways: ['Agree who they would talk to before there is anything to talk about.', 'Treat it as ordinary maintenance rather than an emergency measure.', 'Say plainly that asking for help is a sign of judgement, not weakness.'],
  },

  // ---- Nearly grown ----
  {
    id: 'ls-taxes',
    stage: 'grown',
    title: 'Taxes and payslips',
    why: 'A first payslip is confusing and most people never really get it explained. Understanding what was taken and why turns a mystery into a manageable task. It also makes it much harder to be taken advantage of.',
    ways: ['Walk through a real payslip line by line.', 'File a simple return together before they have to do it alone.', 'Explain the difference between what you earn and what you keep.'],
  },
  {
    id: 'ls-investing',
    stage: 'grown',
    title: 'Saving and investing',
    why: 'Compound growth is the closest thing to free money, and it rewards starting early more than being clever. The main lesson is patience. The second is that anyone promising fast returns is usually selling something.',
    ways: ['Show the same amount saved at twenty and at thirty side by side.', 'Open a small real account rather than a pretend one.', 'Talk about scams and pressure tactics as plainly as about returns.'],
  },
  {
    id: 'ls-interview',
    stage: 'grown',
    title: 'Interviewing for a job',
    why: 'An interview is a conversation with rules, and knowing the rules makes it far less frightening. Most of it can be practiced. The rest is turning up prepared and asking a decent question at the end.',
    ways: ['Do a real practice interview with someone who is not family.', 'Prepare three stories that show something rather than claim it.', 'Have a question ready for them, since it is always noticed.'],
  },
  {
    id: 'ls-rent',
    stage: 'grown',
    title: 'Renting a place to live',
    why: 'A lease is a serious contract that most people sign without reading. Knowing what to look for prevents years of expensive regret. Take photographs on the day you move in.',
    ways: ['Read a real lease together and mark anything unclear.', 'Photograph the condition of everything before moving anything in.', 'Work out the true monthly cost, including bills and deposits.'],
  },
  {
    id: 'ls-hard-talk',
    stage: 'grown',
    title: 'Having a difficult conversation',
    why: 'Asking for a raise, ending a relationship or raising a problem at work all use the same skill. Say the thing, stay calm, listen. Avoiding these conversations costs far more than having them.',
    ways: ['Write down the one sentence that matters most before starting.', 'Practice saying it out loud, since it is easier the second time.', 'Agree with yourself what a good outcome looks like beforehand.'],
  },
  {
    id: 'ls-self-talk',
    stage: 'grown',
    title: 'How you speak to yourself',
    why: 'Most people talk to themselves in a way they would never accept from a friend. Noticing that gap, and closing it a little, changes how much energy is left for everything else. It is a habit rather than a personality.',
    ways: ['Ask whether they would say that sentence to someone they cared about.', 'Rewrite the harshest line into something merely honest.', 'Notice it out loud rather than trying to argue it away.'],
  },
  {
    id: 'ls-meaning',
    stage: 'grown',
    title: 'Working out what matters to you',
    why: 'Nobody hands you a set of values. Working out what you actually care about, rather than what you are supposed to care about, is quiet work that pays off for a lifetime. It is easier with a bit of boredom and a bit of honesty.',
    ways: ['Ask what they would do with a free year and no need for money.', 'Notice which of their commitments feel like duty and which feel like choice.', 'Revisit the question yearly, since the answer moves.'],
  },
];

// A skill's place in the list is its maturity. First is earliest, last is most mature.
// The screen uses that position to shade each one, from the palest green at the top to
// deep forest green at the bottom.
// Markers down the single scrolling column. They give a long list some structure
// without breaking the sense of one continuous sequence.
export const LIFE_STAGES = [
  { id: 'early', title: 'Early', blurb: 'First steps towards doing things without help.' },
  { id: 'growing', title: 'Growing up', blurb: 'Skills that need a little independence to practice.' },
  { id: 'teen', title: 'Teen', blurb: 'Bigger responsibilities, and the habits that carry into adult life.' },
  { id: 'grown', title: 'Nearly grown', blurb: 'The things nobody teaches you before you suddenly need them.' },
];

export function lifeSkillsInOrder() {
  const total = LIFE_SKILLS.length;
  return LIFE_SKILLS.map((sk, i) => ({
    ...sk,
    position: i + 1,
    total,
    stage: sk.stage || 'early',
    // 0 for the very first skill, 1 for the last. The screen turns this into a colour.
    maturity: total <= 1 ? 0 : Math.round((i / (total - 1)) * 100) / 100,
  }));
}

// Which skills a classroom has already covered. This is the educator's own bookmark.
// It is never attached to a student, which keeps the whole section outside the student
// record and out of reach of the privacy rules that govern everything else.
export function emptyCoveredSkills() { return { version: 1, covered: [] }; }
export function isCovered(state, id) { return state.covered.includes(id); }
export function toggleCovered(state, id) {
  return { ...state, covered: state.covered.includes(id) ? state.covered.filter((x) => x !== id) : [...state.covered, id] };
}
export function coveredCount(state, skills) { return skills.filter((sk) => state.covered.includes(sk.id)).length; }

// ---------------------------------------------------------------------
// 9. BACKUP FILES — the whole classroom in one file
//    Local-first: nothing lives on a server. The record of what happened is the
//    truth, so a file holding every record is a complete backup, and restoring it on
//    another device recreates everything. Restoring never overwrites: event logs are
//    joined, and the roster is merged by student id, so restoring an old file onto a
//    newer device can only add history, never lose it.
// ---------------------------------------------------------------------
export const BACKUP_VERSION = 1;

export function buildBackup({ roster, records, wonderReview, covered, deviceName, recovery }, at) {
  return {
    app: 'EduSphere',
    // First thing in the file, so anyone who opens it sees it at once. Proof of ownership
    // for a PIN reset: only this classroom's backups carry it, and a student does not have
    // the educator's backup file. It can also be typed in instead of choosing the file.
    recovery: recovery || null,
    recoveryNote: recovery ? 'RECOVERY CODE. Keep this file somewhere safe. To reset a forgotten educator PIN, choose this file on the sign-in screen or type the code above.' : null,
    version: BACKUP_VERSION,
    savedAt: at,
    deviceName: String(deviceName || '').trim() || null,
    studentIds: roster.students.filter((s) => s.active).map((s) => s.id),
    roster,
    records: records.map((r) => ({ name: r.name, events: r.events })),
    wonderReview,
    covered,
  };
}

// A file name that says where it came from and what it holds, so a folder of backups
// from ten devices can be read without opening anything:
// edusphere-ipad-3-12-students-2026-09-10.json
export function backupFileName(deviceName, studentCount, at) {
  // Apostrophes vanish rather than becoming hyphens, so "Mike's laptop" reads as mikes-laptop.
  const device = String(deviceName || 'device').trim().toLowerCase().replace(/['\u2019]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'device';
  return `edusphere-${device}-${studentCount}-${studentCount === 1 ? 'student' : 'students'}-${String(at).slice(0, 10)}.json`;
}

// Checks a file before anything is merged from it. Returns a plain sentence on failure.
export function checkBackup(data) {
  if (!data || typeof data !== 'object') return 'That file is not an EduSphere backup.';
  if (data.app !== 'EduSphere') return 'That file is not an EduSphere backup.';
  if (typeof data.version !== 'number' || data.version > BACKUP_VERSION) return 'That backup was made by a newer version of EduSphere. Update the app and try again.';
  if (!data.roster || !Array.isArray(data.roster.students)) return 'That backup has no student list in it.';
  if (!Array.isArray(data.records)) return 'That backup has no student records in it.';
  return null;
}

// Joins a backup into what is already on this device. Students are matched by id, events
// are joined in time order without duplicates, and the educator's own settings (which
// reflection questions are approved, which skills are covered) take the union.
export function mergeBackup(current, backup) {
  const students = [...current.roster.students];
  for (const st of backup.roster.students) {
    const i = students.findIndex((x) => x.id === st.id);
    if (i < 0) students.push(st);
    else students[i] = { ...st, ...students[i], active: students[i].active || st.active };
  }
  const records = new Map(current.records.map((r) => [r.name, r]));
  for (const r of backup.records) {
    const existing = records.get(r.name);
    if (!existing) { records.set(r.name, { name: r.name, events: [...r.events] }); continue; }
    const seen = new Set(existing.events.map((e) => JSON.stringify(e)));
    const added = r.events.filter((e) => !seen.has(JSON.stringify(e)));
    records.set(r.name, { name: r.name, events: mergeEventLogs(existing.events, added) });
  }
  const union = (a, b) => [...new Set([...(a || []), ...(b || [])])];
  return {
    roster: { ...current.roster, students },
    records: [...records.values()],
    wonderReview: { version: 1, approved: union(current.wonderReview.approved, backup.wonderReview && backup.wonderReview.approved), hidden: union(current.wonderReview.hidden, backup.wonderReview && backup.wonderReview.hidden) },
    covered: { version: 1, covered: union(current.covered.covered, backup.covered && backup.covered.covered) },
    addedStudents: backup.roster.students.filter((st) => !current.roster.students.some((x) => x.id === st.id)).length,
  };
}

// A random recovery code, made once when the educator account is created. It lives in
// the educator profile on the device and inside every backup file. Resetting a
// forgotten PIN means showing a backup that carries the matching code.
export function makeRecoveryCode(seed) {
  const rng = makeRng(seed);
  return Array.from({ length: 4 }, () => randInt(rng, 1000, 9999)).join('-');
}
export function backupProvesOwnership(backup, recovery) {
  return !!(recovery && backup && backup.recovery && String(backup.recovery) === String(recovery));
}
// The same check for a code typed by hand: spaces and case do not matter.
export function codeMatches(typed, recovery) {
  const clean = (x) => String(x || '').replace(/[^0-9]/g, '');
  return !!(recovery && clean(typed).length === 16 && clean(typed) === clean(recovery));
}

// How long since the last backup, in whole days, or null if there has never been one.
export function daysSinceBackup(lastAt, now) {
  if (!lastAt) return null;
  return Math.floor((new Date(now) - new Date(lastAt)) / 86400000);
}

// ---------------------------------------------------------------------
// 3. CORE RULES
// ---------------------------------------------------------------------

// Builds one practice set for a module. Same (moduleId, seed, masteredIds) => same set.
//   core:   the questions that count toward mastery
//   review: one question from an EARLIER, already-mastered module (retention check only)
export function buildAttempt(moduleId, seed, masteredIds) {
  const mod = getModule(moduleId);
  if (!mod) throw new Error(`Unknown module: ${moduleId}`);
  const rng = makeRng(seed);
  const order = shuffle(rng, mod.generators);
  const core = [];
  const howMany = moduleRules(moduleId).questions;
  for (let i = 0; i < howMany; i++) {
    core.push(generateQuestion(order[i % order.length], randInt(rng, 1, 2147483646)));
  }
  let review = null;
  const earlierMastered = MODULES.filter((m) => m.courseId === mod.courseId && m.order < mod.order && masteredIds.includes(m.id));
  if (CONFIG.REVIEW_QUESTIONS_PER_ATTEMPT > 0 && earlierMastered.length > 0) {
    const rm = pick(rng, earlierMastered);
    review = { moduleId: rm.id, question: generateQuestion(pick(rng, rm.generators), randInt(rng, 1, 2147483646)) };
  }
  return { moduleId, seed, core, review };
}

// Decides whether a typed or tapped answer is right.
export function checkAnswer(question, given) {
  if (question.type === 'trace') {
    try { return traceMatches(question.answer, typeof given === 'string' ? JSON.parse(given) : given); } catch (e) { return false; }
  }
  if (given === null || given === undefined) return false;
  const g = String(given).trim();
  if (g === '') return false;
  if (question.type === 'number') return /^-?\d+$/.test(g) && Number(g) === Number(question.answer);
  return g === question.answer;
}

// Turns a finished practice set into the event that gets stored.
// Only facts are stored (what was asked, what was answered, whether it was right).
// Mastery is NOT stored here — it is computed from the facts in section 4.
// `correct` here means right FIRST TIME. Younger students retry until they get it, so
// counting every eventual success would make mastery meaningless. First-try accuracy is
// what actually tells you whether they knew it.
export function makeAttemptEvent(attempt, coreResults, reviewResult, startedAt, finishedAt) {
  const coreCorrect = coreResults.filter((r) => r.correct).length;
  return {
    type: 'attempt_completed',
    at: finishedAt,
    startedAt,
    moduleId: attempt.moduleId,
    seed: attempt.seed,
    core: coreResults,
    review: reviewResult,
    coreCorrect,
    coreTotal: coreResults.length,
  };
}

export function makeLessonViewedEvent(moduleId, at) {
  return { type: 'lesson_viewed', at, moduleId };
}

export function makeResetEvent(at) {
  return { type: 'progress_reset', at };
}

// Clears progress for ONE module only (a student just needs to redo counting).
// Like every reset, this adds a record rather than deleting one.
export function makeModuleResetEvent(moduleId, at) {
  return { type: 'module_reset', at, moduleId };
}

// ---------------------------------------------------------------------
// 4. DERIVATIONS — everything the screens and reports show comes from here
// ---------------------------------------------------------------------

// A reset does not delete history (history is never deleted). It marks a
// point in time; only events after the latest reset count as "current".
export function activeEvents(events) {
  let start = 0;
  events.forEach((e, i) => { if (e.type === 'progress_reset') start = i + 1; });
  return events.slice(start);
}

export function isMasteredAttempt(event) {
  return event.type === 'attempt_completed' && event.coreCorrect >= moduleRules(event.moduleId).toMaster;
}

export function deriveProgress(events) {
  const active = activeEvents(events);
  // When was each module last reset on its own? Anything at or before that is ignored for that module.
  const moduleResetAt = {};
  for (const e of active) if (e.type === 'module_reset') moduleResetAt[e.moduleId] = e.at;
  const perModule = {};
  for (const m of MODULES) {
    perModule[m.id] = {
      attempts: 0, lessonViews: 0, mastered: false, masteredAt: null, bestCore: 0,
      coreCorrect: 0, coreTotal: 0, firstAttemptAt: null, lastAttemptAt: null,
    };
  }
  const review = { asked: 0, correct: 0 };
  for (const e of active) {
    const p = perModule[e.moduleId];
    if (!p) continue;
    if (moduleResetAt[e.moduleId] && String(e.at) <= String(moduleResetAt[e.moduleId])) continue; // cleared by a module reset
    if (e.type === 'lesson_viewed') p.lessonViews += 1;
    if (e.type === 'attempt_completed') {
      p.attempts += 1;
      p.coreCorrect += e.coreCorrect;
      p.coreTotal += e.coreTotal;
      p.bestCore = Math.max(p.bestCore, e.coreCorrect);
      p.firstAttemptAt = p.firstAttemptAt || e.at;
      p.lastAttemptAt = e.at;
      if (!p.mastered && isMasteredAttempt(e)) { p.mastered = true; p.masteredAt = e.at; }
      if (e.review) { review.asked += 1; if (e.review.correct) review.correct += 1; }
    }
  }
  const masteredIds = MODULES.filter((m) => perModule[m.id].mastered).map((m) => m.id);
  return { perModule, review, masteredIds };
}

// A module is 'mastered', 'available' (the first module, or the one right after
// a mastered module), or 'locked'. A locked module cannot be opened.
// Everything a module needs mastered first: the module before it in its own course, and
// any module it names in `requires`, which may live in another course or another grade.
// This is the dependency graph. It is what stops a student meeting fractions before they
// can count, and it is what loop-back routing walks down when they struggle.
export function prerequisitesOf(moduleId) {
  const mod = getModule(moduleId);
  if (!mod) return [];
  const course = getCourse(mod.courseId);
  // Most courses are a chain: each module needs the one before it. A course marked
  // linear: false is a set of parallel activities (pre-K), where only named prerequisites count.
  const sorted = [...course.modules].sort((a, b) => a.order - b.order);
  const i = sorted.findIndex((m) => m.id === moduleId);
  const inCourse = course.linear !== false && i > 0 ? [sorted[i - 1].id] : [];
  return [...new Set([...inCourse, ...(mod.requires || [])])];
}

// ---------------------------------------------------------------------
// LOOP-BACK ROUTING
// When a student keeps missing a module, the problem is often further back than the
// module itself. After two failed rounds the platform reopens the prerequisite for a
// quick check, even if it was mastered before. That check must be passed again before
// the student returns. This is how a fifth grader struggling with fractions ends up
// briefly back in third-grade division, and comes back up with the gap closed.
// ---------------------------------------------------------------------
export const LOOP_BACK_AFTER = 2; // failed rounds in a row before we look further back

// The failed rounds on a module since it was last passed, counting back from the latest.
export function failedStreak(events, moduleId) {
  const active = activeEvents(events).filter((e) => e.type === 'attempt_completed' && e.moduleId === moduleId);
  let n = 0;
  for (let i = active.length - 1; i >= 0; i--) { if (isMasteredAttempt(active[i])) break; n++; }
  return n;
}

// Does this module need a loop back right now, and to where? Returns the prerequisite to
// revisit, or null. The most recent prerequisite in the chain is the first suspect.
export function loopBackTarget(events, moduleId) {
  if (failedStreak(events, moduleId) < LOOP_BACK_AFTER) return null;
  const prereqs = prerequisitesOf(moduleId);
  if (prereqs.length === 0) return null;
  // Do not send them back again if the prerequisite has already been re-passed since the failures began.
  const active = activeEvents(events);
  const lastFail = [...active].reverse().find((e) => e.type === 'attempt_completed' && e.moduleId === moduleId);
  const target = prereqs[prereqs.length - 1];
  const rePassed = active.some((e) => e.type === 'attempt_completed' && e.moduleId === target && isMasteredAttempt(e) && lastFail && String(e.at) > String(lastFail.at));
  return rePassed ? null : target;
}

// Recorded when a loop back happens, so the educator can see it on the report.
export function makeLoopBackEvent(fromModuleId, toModuleId, at) {
  return { type: 'looped_back', at, moduleId: fromModuleId, toModuleId };
}

// A module is open when every prerequisite is mastered. There is no other way in.
export function moduleStatuses(progress) {
  return MODULES.map((m) => {
    if (progress.perModule[m.id].mastered) return { id: m.id, status: 'mastered' };
    const ready = prerequisitesOf(m.id).every((id) => progress.perModule[id] && progress.perModule[id].mastered);
    return { id: m.id, status: ready ? 'available' : 'locked' };
  });
}

// Walks the graph to make sure it is one: every named prerequisite exists, and no module
// requires itself through any chain. The tests call this; a cycle would lock a student out
// of a module forever, so it must never ship.
export function checkPrerequisiteGraph() {
  const problems = [];
  const ids = new Set(MODULES.map((m) => m.id));
  for (const m of MODULES) for (const r of m.requires || []) if (!ids.has(r)) problems.push(`${m.id} requires ${r}, which does not exist`);
  const visiting = new Set(); const done = new Set();
  const visit = (id, trail) => {
    if (done.has(id)) return;
    if (visiting.has(id)) { problems.push(`cycle: ${[...trail, id].join(' -> ')}`); return; }
    visiting.add(id);
    for (const r of prerequisitesOf(id)) if (ids.has(r)) visit(r, [...trail, id]);
    visiting.delete(id); done.add(id);
  };
  for (const m of MODULES) visit(m.id, []);
  return problems;
}

// Which courses an educator has switched on for this learner. With no setting, all courses are on.
// Stored as an event like everything else, so the history of who enabled what is kept.
export function makeCoursesEnabledEvent(courseIds, at) {
  return { type: 'courses_enabled', at, courseIds: [...courseIds] };
}
export function enabledCourseIds(events) {
  let ids = COURSES.map((c) => c.id);
  for (const e of events) if (e.type === 'courses_enabled') ids = e.courseIds.filter((id) => getCourse(id));
  return ids;
}

// The confidence score (1–5). It answers "did they pass by understanding, or by luck?"
// The rules are listed in CONFIDENCE_RULES and printed on every report, so the
// score is never a black box. Time signals are only used when timings exist.
export const CONFIDENCE_RULES = [
  'Confidence starts at 1 for any module that has been practiced.',
  `+2 if the module is mastered (${CONFIG.MASTERY_MIN_CORRECT} or more of ${CONFIG.CORE_QUESTIONS_PER_ATTEMPT} correct in one set).`,
  '+1 if the most recent practice set was perfect.',
  '+1 if the last 8 or more core answers in this module were all correct, OR at least 2 review questions from this module have been asked and 80% or more were correct.',
  'The highest score is 5. "Guessing?" is shown when 2 or more answers in the latest set were wrong in under 4 seconds.',
];

function median(numbers) {
  const a = [...numbers].sort((x, y) => x - y);
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}

export function computeConfidence(moduleId, events) {
  const active = activeEvents(events);
  const attempts = active.filter((e) => e.type === 'attempt_completed' && e.moduleId === moduleId);
  if (attempts.length === 0) return { score: null, signals: [], streak: 0, medianSec: null, reviewsAsked: 0, reviewsCorrect: 0 };
  const latest = attempts[attempts.length - 1];
  const signals = [];
  let score = 1;
  if (attempts.some(isMasteredAttempt)) { score += 2; signals.push('mastered'); }
  if (latest.coreCorrect === latest.coreTotal) { score += 1; signals.push('latest set perfect'); }
  const answers = attempts.flatMap((e) => e.core);
  let streak = 0;
  for (let i = answers.length - 1; i >= 0 && answers[i].correct; i--) streak += 1;
  const reviews = active.filter((e) => e.type === 'attempt_completed' && e.review && e.review.moduleId === moduleId).map((e) => e.review);
  const reviewsCorrect = reviews.filter((r) => r.correct).length;
  const retentionStrong = reviews.length >= 2 && reviewsCorrect / reviews.length >= 0.8;
  if (streak >= 8) signals.push(`${streak} correct in a row`);
  if (retentionStrong) signals.push(`review ${reviewsCorrect} of ${reviews.length} correct`);
  if (streak >= 8 || retentionStrong) score += 1;
  score = Math.min(5, score);
  const fastWrong = latest.core.filter((r) => !r.correct && typeof r.timeMs === 'number' && r.timeMs < 4000).length;
  if (fastWrong >= 2) signals.push('guessing?');
  const times = answers.map((r) => r.timeMs).filter((t) => typeof t === 'number' && t >= 0);
  const medianSec = times.length ? Math.round(median(times) / 100) / 10 : null;
  return { score, signals, streak, medianSec, reviewsAsked: reviews.length, reviewsCorrect };
}

// The progress report. Every number here is recomputed from the event log
// each time, and the report carries its own definitions so a reader knows
// exactly what each number means.
// Plain-language definitions for the educator report. Written for someone who does
// not work in technology: every term the page uses, explained in ordinary sentences.
export const EXPLANATIONS = [
  {
    term: 'Practiced',
    plain: 'When a student opens a module and clicks through all available questions, they have practiced it. They can practice any module as often as they like and expect fresh sets of questions and answers as they go. The more they practice, the more opportunities we have to introduce questions from prior modules as a form of memory check. These old questions do not count against their mastery of the current module.',
  },
  {
    term: 'Mastered',
    plain: 'A module is considered mastered once a student answers a pre-determined number of questions correctly (depending on the grade and subject matter) within a single session. One session, rather than patching several sessions from varying days or times, shows true understanding. Until a student achieves this mastery mark, the following modules continue to remain locked. The result? No student is pushed forward without a solid understanding of the prerequisites.',
  },
  {
    term: 'Confidence, scored 1 to 5',
    plain: 'This is our best estimate of whether or not a student truly understands a module (versus simply having a good day). Everyone starts at 1. Mastering a module adds 2 and a flawless round adds another. The last point, or a perfect confidence score, will always be the hardest to achieve. It comes either from eight correct answers in a row or from continuing to reliably answer material correctly as it reappears over time. Spaced repetition, or the re-introduction of material over increasingly lengthened periods of time, is a highly effective technique when it comes to long-term retention of information.',
  },
  {
    term: 'What holds a confidence score down',
    plain: 'A score stays low when a student has practiced a module one or more times without mastering it. A reliable way of keeping confidence down is scoring lower on consecutive attempts or not answering enough questions correctly in a row. The goal is to ensure that the information sticks. If two or more wrong answers come back in under four seconds, the progress report adds a note that says "guessing?" This is because answering quickly usually indicates tapping rather than thinking.',
  },
  {
    term: 'Answered correctly',
    plain: 'Out of every question answered within a module, this is the share they get right. It includes the shaky attempts, the perfect ones and everything in between. This creates a fair picture of the entire journey rather than relying only on "mastered."',
  },
  {
    term: 'Typical answering time',
    plain: 'Every student answers questions at a pace that is unique to them. We use these individualized times to work out what is typical then watch for answers that arrive significantly faster or slower. Alongside the confidence score, this timing tells you a great deal. Quick and correct equals fluency while quick and incorrect might mean guessing.',
  },
  {
    term: 'Not assigned',
    plain: "A course and its corresponding modules are switched off and hidden from the student. They do not appear for the student until assigned (different from \"Not started\").",
  },
  {
    term: 'Reflections',
    plain: 'These are the "Wonder" questions which have no right or wrong answer. They are not graded nor do they impact timing, confidence or mastery scores. The goal of these is to promote improved retention of information through story, curiosity, critical thinking and an open mind. Whatever they write is never saved for privacy compliance reasons.',
  },
];

// ---------------------------------------------------------------------
// Words for people. Two builders that turn the numbers into sentences.
// Both follow the house style: complete sentences, varied length, simple terms.
// ---------------------------------------------------------------------

// What to say to a learner when a practice round ends. Names what they just did and
// what comes next, so the screen talks to them rather than reporting on them.
export function encouragementFor(events, moduleId, mastered) {
  const mod = getModule(moduleId);
  if (!mod) return '';
  const course = getCourse(mod.courseId);
  const progress = deriveProgress(events);
  const inCourse = MODULES.filter((m) => m.courseId === mod.courseId).sort((a, b) => a.order - b.order);
  const next = inCourse.find((m) => m.order === mod.order + 1);
  const courseDone = inCourse.every((m) => progress.masteredIds.includes(m.id));
  if (!mastered) {
    const p = progress.perModule[moduleId];
    const tries = p ? p.attempts : 1;
    if (tries <= 1) return `Good first try at ${mod.title.toLowerCase()}. Let us go through it once more and then have another go.`;
    return `${mod.title} is a tricky one. You are getting closer every time, so let us look at it again together.`;
  }
  if (courseDone) {
    const enabled = enabledCourseIds(events);
    const nextCourse = COURSES.filter((c) => enabled.includes(c.id) && c.id !== course.id)
      .find((c) => !MODULES.filter((m) => m.courseId === c.id).every((m) => progress.masteredIds.includes(m.id)));
    return nextCourse
      ? `You have mastered ${course.title.toLowerCase()}! Great job! Next we will learn about ${nextCourse.title.toLowerCase()}.`
      : `You have mastered ${course.title.toLowerCase()}! Great job! That was the last course for now.`;
  }
  return next
    ? `You have mastered ${mod.title.toLowerCase()}! Great job! Next up is ${next.title.toLowerCase()}.`
    : `You have mastered ${mod.title.toLowerCase()}! Great job!`;
}

// The story of one module for an educator, in plain conversational sentences: how many
// times it was read and practiced, how each attempt went, whether the timing suggests
// guessing, what the platform will do about it, and where confidence stands now.
export function moduleStory(learnerName, events, moduleId) {
  const mod = getModule(moduleId);
  if (!mod) return '';
  const active = activeEvents(events);
  const resetAt = active.filter((e) => e.type === 'module_reset' && e.moduleId === moduleId).map((e) => e.at).sort().pop() || '';
  const mine = active.filter((e) => e.moduleId === moduleId && String(e.at) > resetAt);
  const reads = mine.filter((e) => e.type === 'lesson_viewed').length;
  const attempts = mine.filter((e) => e.type === 'attempt_completed');
  const name = learnerName;
  const rules = moduleRules(moduleId);

  if (attempts.length === 0 && reads === 0) return `${name} has not opened ${mod.title.toLowerCase()} yet. There is nothing to report until they do.`;
  if (attempts.length === 0) return `${name} has read the ${mod.title.toLowerCase()} lesson ${reads === 1 ? 'once' : reads + ' times'} but has not practiced it yet. Nothing counts until a practice round is finished.`;

  const times = (n) => (n === 1 ? 'once' : n === 2 ? 'twice' : `${n} times`);
  const parts = [`${name} read this lesson ${times(reads || 1)} and practiced it ${times(attempts.length)}.`];
  const loops = mine.filter((e) => e.type === 'looped_back');
  if (loops.length) { const back = getModule(loops[loops.length - 1].toModuleId); parts.push(`After repeated misses the platform sent ${name} back to ${back ? back.title.toLowerCase() : 'the module before'} for a quick check, then brought them forward again.`); }

  // Each attempt in order, without turning into a table.
  attempts.forEach((a, i) => {
    const passed = a.coreCorrect >= rules.toMaster;
    const label = attempts.length === 1 ? 'That attempt' : i === 0 ? 'The first attempt' : i === attempts.length - 1 ? 'The most recent attempt' : `Attempt ${i + 1}`;
    if (passed) parts.push(`${label} reached ${a.coreCorrect} out of ${a.coreTotal}, which is enough to count as mastered.`);
    else parts.push(`${label} came to ${a.coreCorrect} out of ${a.coreTotal}, so the module stayed open for more practice.`);
  });

  // Timing: their pace on this module against their pace everywhere else.
  const answerTimes = (list) => list.flatMap((a) => (a.core || []).map((r) => r.timeMs)).filter((t) => typeof t === 'number' && t > 0);
  // The latest attempt is what matters: a fast final round after a slow first one is the guessing pattern.
  const here = answerTimes([attempts[attempts.length - 1]]);
  const everywhere = answerTimes(active.filter((e) => e.type === 'attempt_completed' && e.moduleId !== moduleId));
  const median = (list) => { if (!list.length) return null; const s2 = [...list].sort((x, y) => x - y); return s2[Math.floor(s2.length / 2)]; };
  const hereSec = median(here) !== null ? Math.round(median(here) / 100) / 10 : null;
  const usualSec = median(everywhere) !== null ? Math.round(median(everywhere) / 100) / 10 : null;
  const fastWrong = attempts.flatMap((a) => a.core || []).filter((r) => !r.correct && r.timeMs < 4000).length;
  if (hereSec !== null && usualSec !== null && hereSec < usualSec * 0.6) {
    parts.push(`On that last round ${name} answered in about ${hereSec} seconds each, noticeably quicker than the ${usualSec} seconds they usually take.`);
    if (fastWrong >= 2) parts.push('Several of the quick answers were wrong, which suggests guessing rather than working it out.');
  } else if (hereSec !== null) {
    parts.push(`Their answers on the last round took about ${hereSec} seconds each, which is a normal pace for them.`);
  }

  // What happens next, said plainly.
  const progress = deriveProgress(events);
  const p = progress.perModule[moduleId];
  const conf = computeConfidence(moduleId, events);
  const suspiciouslyQuick = hereSec !== null && usualSec !== null && hereSec < usualSec * 0.6;
  if (fastWrong >= 2 || suspiciouslyQuick || (p && p.mastered && attempts.length >= 3)) {
    parts.push('To ensure true mastery, these types of questions will be introduced again at a later time for further evaluation.');
  } else if (p && p.mastered) {
    parts.push('Questions from here will reappear now and then as memory checks, so we can see that it has stuck.');
  } else {
    parts.push('Until the mark is reached, the modules after this one stay locked, and every practice round brings fresh questions.');
  }
  if (conf.score !== null) parts.push(`${name}'s confidence score in ${mod.title.toLowerCase()} currently stands at ${conf.score} out of 5.`);
  if (p && p.mastered && p.masteredAt) parts.push(`Mastered on ${new Date(p.masteredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.`);
  return parts.join(' ');
}

// ---------------------------------------------------------------------
// THE CLASS VIEW — every student at once, most in need first
// A teacher with twenty students wants one glance, not twenty reports. Each student
// gets a need score built from things already in their record: modules stuck on,
// loop backs, guessing flags, low confidence, and days since they last practiced.
// Higher means more in need. The reasons are listed in words so the score is never a
// mystery.
// ---------------------------------------------------------------------
export function classView(students, now) {
  const rows = students.map(({ id, label, events }) => {
    const report = buildReport(label || id, events);
    const active = activeEvents(events);
    const assigned = report.modules.filter((m) => report.enabledCourseIds.includes(m.courseId));
    const attempts = active.filter((e) => e.type === 'attempt_completed');
    const lastAt = attempts.length ? attempts[attempts.length - 1].at : null;
    const daysIdle = lastAt ? Math.floor((new Date(now) - new Date(lastAt)) / 86400000) : null;
    const reasons = [];
    let score = 0;

    // Stuck: a module with two or more misses in a row and no pass since.
    const stuck = assigned.filter((m) => !m.mastered && failedStreak(events, m.id) >= 2);
    if (stuck.length) { score += 3 * stuck.length; reasons.push(`stuck on ${stuck.map((m) => m.title.toLowerCase()).join(', ')}`); }

    // Loop backs in the last while mean the platform already had to step in.
    const loops = active.filter((e) => e.type === 'looped_back').length;
    if (loops) { score += 2 * loops; reasons.push(`${loops} loop ${loops === 1 ? 'back' : 'backs'}`); }

    // Guessing flags.
    const guessing = assigned.filter((m) => m.confidence.signals.some((x) => /guessing/.test(x)));
    if (guessing.length) { score += 2 * guessing.length; reasons.push(`guessing in ${guessing.map((m) => m.title.toLowerCase()).join(', ')}`); }

    // Low confidence on mastered work suggests it may not hold.
    const shaky = assigned.filter((m) => m.mastered && m.confidence.score !== null && m.confidence.score <= 2);
    if (shaky.length) { score += shaky.length; reasons.push(`low confidence in ${shaky.map((m) => m.title.toLowerCase()).join(', ')}`); }

    // Not practicing at all.
    if (attempts.length === 0 && assigned.length) { score += 2; reasons.push('has not started'); }
    else if (daysIdle !== null && daysIdle >= 7) { score += 1 + Math.min(3, Math.floor(daysIdle / 7)); reasons.push(`${daysIdle} days since last practice`); }

    const mastered = assigned.filter((m) => m.mastered).length;
    const next = assigned.find((m) => !m.mastered && moduleStatuses(deriveProgress(events)).find((x) => x.id === m.id).status === 'available');
    return {
      id, label: label || id, score, reasons,
      mastered, total: assigned.length,
      next: next ? next.title : null,
      daysIdle,
      band: score >= 5 ? 'needs help now' : score >= 2 ? 'keep an eye on' : 'on track',
    };
  });
  return rows.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
}

// The one-paragraph version a teacher can read in ten seconds.
export function classSummary(rows) {
  if (rows.length === 0) return 'No students yet.';
  const now = rows.filter((r) => r.band === 'needs help now');
  const eye = rows.filter((r) => r.band === 'keep an eye on');
  const fine = rows.length - now.length - eye.length;
  const parts = [];
  if (now.length) parts.push(`${now.length} ${now.length === 1 ? 'student needs' : 'students need'} help now: ${now.map((r) => r.label).join(', ')}.`);
  if (eye.length) parts.push(`${eye.length} worth keeping an eye on.`);
  parts.push(`${fine} on track.`);
  return parts.join(' ');
}

// The transcript: a record of work done, including courses that are no longer switched on.
// Courses a student never opened are left out, because an empty row proves nothing and a
// transcript should only report what actually happened. Nothing personal appears here
// beyond the school-issued identifier the school itself chose.
export function buildTranscript(learnerName, events) {
  const report = buildReport(learnerName, events);
  const courses = COURSES.map((course) => {
    const rows = report.modules.filter((m) => m.courseId === course.id);
    const touched = rows.filter((m) => m.attempts > 0 || m.mastered);
    if (touched.length === 0) return null;
    const mastered = rows.filter((m) => m.mastered);
    const dates = mastered.map((m) => m.masteredAt).filter(Boolean).sort();
    const scores = rows.filter((m) => m.confidence.score !== null).map((m) => m.confidence.score);
    return {
      id: course.id,
      title: course.title,
      subject: course.subject,
      grade: course.grade,
      label: courseLabel(course),
      complete: mastered.length === rows.length,
      stillAssigned: report.enabledCourseIds.includes(course.id),
      modulesTotal: rows.length,
      modulesMastered: mastered.length,
      startedAt: rows.map((m) => m.firstAttemptAt).filter(Boolean).sort()[0] || null,
      completedAt: mastered.length === rows.length && dates.length ? dates[dates.length - 1] : null,
      averageConfidence: scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : null,
      modules: rows.map((m) => ({ id: m.id, title: m.title, mastered: m.mastered, masteredAt: m.masteredAt, attempts: m.attempts, confidence: m.confidence.score })),
    };
  }).filter(Boolean);
  const byGrade = (a, b) => GRADES.indexOf(a.grade) - GRADES.indexOf(b.grade) || a.subject.localeCompare(b.subject);
  return {
    learnerName,
    generatedAt: new Date().toISOString(),
    completed: courses.filter((c) => c.complete).sort(byGrade),
    inProgress: courses.filter((c) => !c.complete).sort(byGrade),
    retention: report.retention,
    note: 'This record contains no personal information beyond the identifier chosen by the school. It holds no names of family members, no contact details and nothing a student has written.',
  };
}

// A paragraph an educator (or a parent) can read without decoding numbers.
// Everything in it comes from the report, so it can never disagree with the figures.
export function summaryParagraph(report) {
  const name = report.learnerName;
  const assigned = report.modules.filter((m) => report.enabledCourseIds.includes(m.courseId));
  if (assigned.length === 0) return `${name} has no courses switched on yet. Choose some below and they will appear here.`;

  // Group by grade and subject, because that is how a person describes it out loud.
  const groups = [];
  for (const m of assigned) {
    const course = getCourse(m.courseId);
    const key = `${course.grade}|${course.subject}`;
    let g = groups.find((x) => x.key === key);
    if (!g) { g = { key, grade: course.grade, subject: course.subject, total: 0, mastered: 0, confidences: [] }; groups.push(g); }
    g.total += 1;
    if (m.mastered) g.mastered += 1;
    if (m.confidence.score !== null) g.confidences.push(m.confidence.score);
  }
  groups.sort((a, b) => GRADES.indexOf(a.grade) - GRADES.indexOf(b.grade) || a.subject.localeCompare(b.subject));

  // "1 of 5 modules in Kindergarten math and 2 of 4 in third grade reading"
  const phrases = groups.map((g, i) => {
    const noun = i === 0 ? ` ${g.total === 1 ? 'module' : 'modules'}` : '';
    return `${g.mastered} of ${g.total}${noun} in ${gradeInSentence(g.grade)} ${g.subject.toLowerCase()}`;
  });
  const list = phrases.length === 1 ? phrases[0] : `${phrases.slice(0, -1).join(', ')} and ${phrases[phrases.length - 1]}`;
  let text = `${name} has mastered ${list}.`;
  // The same facts as parts, for a screen that wants a bulleted list followed by sentences.
  const parts = { lead: `${name} has mastered:`, items: groups.map((g) => `${g.mastered} of ${g.total} in ${gradeInSentence(g.grade)} ${g.subject.toLowerCase()}`), rest: '' };

  // How sure we are, described the way a teacher would say it rather than as a number.
  const strong = groups.filter((g) => g.confidences.length && g.confidences.reduce((a, b) => a + b, 0) / g.confidences.length >= 4);
  const building = groups.filter((g) => g.confidences.length && g.confidences.reduce((a, b) => a + b, 0) / g.confidences.length < 3);
  if (strong.length) text += ` Confidence is strongest in ${strong.map((g) => `${gradeInSentence(g.grade)} ${g.subject.toLowerCase()}`).join(' and ')}.`;
  if (building.length) text += ` There is still ground to make up in ${building.map((g) => `${gradeInSentence(g.grade)} ${g.subject.toLowerCase()}`).join(' and ')}.`;
  if (!strong.length && !building.length && groups.some((g) => g.confidences.length)) text += ' Confidence is steady across the board so far.';
  if (!groups.some((g) => g.confidences.length)) text += ' There has not been enough practice yet to say much about confidence.';

  // Reflections, in words rather than a fraction.
  if (report.reflectionsAvailable > 0) {
    if (report.reflections === 0) text += ' No reflections have been answered yet.';
    else if (report.reflections >= report.reflectionsAvailable) text += ' Every reflection has been completed.';
    else text += ` ${report.reflections} of ${report.reflectionsAvailable} reflections have been completed.`;
  }
  parts.rest = text.slice(`${name} has mastered ${list}.`.length).trim();
  summaryParagraph.lastParts = parts;
  return text;
}

// The summary as a bulleted list plus the sentences that follow it.
export function summaryParts(report) {
  const text = summaryParagraph(report);
  const parts = summaryParagraph.lastParts;
  if (!parts || !parts.items.length) return { lead: text, items: [], rest: '' };
  return parts;
}

export function buildReport(learnerName, events) {
  const progress = deriveProgress(events);
  const active = activeEvents(events);
  const modules = [...MODULES].sort((a, b) => a.courseId.localeCompare(b.courseId) || a.order - b.order).map((m) => {
    const p = progress.perModule[m.id];
    return {
      id: m.id,
      courseId: m.courseId,
      subject: getCourse(m.courseId).subject,
      courseTitle: getCourse(m.courseId).title,
      title: m.title,
      attempts: p.attempts,
      lessonViews: p.lessonViews,
      mastered: p.mastered,
      masteredAt: p.masteredAt,
      bestScore: p.attempts ? `${p.bestCore} of ${moduleRules(m.id).questions}` : null,
      accuracyPercent: p.coreTotal ? Math.round((100 * p.coreCorrect) / p.coreTotal) : null,
      firstAttemptAt: p.firstAttemptAt,
      lastAttemptAt: p.lastAttemptAt,
      confidence: computeConfidence(m.id, events),
    };
  });
  return {
    learnerName,
    generatedAt: new Date().toISOString(),
    modulesMastered: progress.masteredIds.length,
    modulesTotal: MODULES.length,
    enabledCourseIds: enabledCourseIds(events), // a setting, not progress: it survives a reset
    totalAttempts: active.filter((e) => e.type === 'attempt_completed').length,
    reflections: active.filter((e) => e.type === 'wonder_answered').length,
    reflectionsAvailable: FEATURES.reflection ? WONDER.length : 0, // approval is applied on screen, where the review state lives
    retention: {
      asked: progress.review.asked,
      correct: progress.review.correct,
      percent: progress.review.asked ? Math.round((100 * progress.review.correct) / progress.review.asked) : null,
    },
    modules,
    definitions: [
      `Mastered: at least ${CONFIG.MASTERY_MIN_CORRECT} of the ${CONFIG.CORE_QUESTIONS_PER_ATTEMPT} core questions correct in a single practice set.`,
      'Accuracy: correct core answers divided by all core questions answered, across every attempt.',
      'Retention: review questions come from earlier mastered modules. They never affect mastery; they measure whether learning stuck.',
      'Attempts: completed practice sets. Only events after the most recent reset are counted.',
      'Every number is recomputed from the stored event log each time this report is opened.',
      'Reflections: Wonder questions answered. They are never graded, and the words a child writes are never stored.',
      ...CONFIDENCE_RULES,
    ],
  };
}

// ---------------------------------------------------------------------
// 6. BRAND — the logo (pure numbers; the screen draws it)
//
//    The sphere: short arcs that are real circles on a real sphere, seen
//    from the front, so they curve consistently and read as solid. Denser
//    and darker toward the lower right (light comes from the upper left).
//    Arcs that would cross the wordmark are skipped, so the letters stay
//    clear without a box behind them.
//
//    The wordmark: letters stored as outlines, not as a font name, so the
//    logo looks identical on every phone, browser, and printer. Rounded
//    corners come from stroking each letter with its own color.
// ---------------------------------------------------------------------

// Letter outlines, drawn on a 1000-unit grid. `adv` is how far to move
// right after the letter. Replacing the brand font means replacing these.
export const WORDMARK_GLYPHS = {
  'E': { d: 'M233.0 -565.0V-423.0H462.0V-291.0H233.0V-137.0H492.0V0.0H62.0V-702.0H492.0V-565.0Z', adv: 541 },
  'D': { d: 'M693.0 -351.0Q693.0 -248.0 647.5 -168.0Q602.0 -88.0 518.5 -44.0Q435.0 0.0 325.0 0.0H62.0V-702.0H325.0Q436.0 -702.0 519.0 -658.0Q602.0 -614.0 647.5 -534.5Q693.0 -455.0 693.0 -351.0ZM519.0 -351.0Q519.0 -448.0 465.0 -502.0Q411.0 -556.0 314.0 -556.0H233.0V-148.0H314.0Q411.0 -148.0 465.0 -201.0Q519.0 -254.0 519.0 -351.0Z', adv: 727 },
  'U': { d: 'M230.0 -702.0V-282.0Q230.0 -219.0 261.0 -185.0Q292.0 -151.0 352.0 -151.0Q412.0 -151.0 444.0 -185.0Q476.0 -219.0 476.0 -282.0V-702.0H647.0V-283.0Q647.0 -189.0 607.0 -124.0Q567.0 -59.0 499.5 -26.0Q432.0 7.0 349.0 7.0Q266.0 7.0 200.5 -25.5Q135.0 -58.0 97.0 -123.5Q59.0 -189.0 59.0 -283.0V-702.0Z', adv: 705 },
  'S': { d: 'M42.0 -210.0H224.0Q228.0 -171.0 251.0 -150.5Q274.0 -130.0 311.0 -130.0Q349.0 -130.0 371.0 -147.5Q393.0 -165.0 393.0 -196.0Q393.0 -222.0 375.5 -239.0Q358.0 -256.0 332.5 -267.0Q307.0 -278.0 260.0 -292.0Q192.0 -313.0 149.0 -334.0Q106.0 -355.0 75.0 -396.0Q44.0 -437.0 44.0 -503.0Q44.0 -601.0 115.0 -656.5Q186.0 -712.0 300.0 -712.0Q416.0 -712.0 487.0 -656.5Q558.0 -601.0 563.0 -502.0H378.0Q376.0 -536.0 353.0 -555.5Q330.0 -575.0 294.0 -575.0Q263.0 -575.0 244.0 -558.5Q225.0 -542.0 225.0 -511.0Q225.0 -477.0 257.0 -458.0Q289.0 -439.0 357.0 -417.0Q425.0 -394.0 467.5 -373.0Q510.0 -352.0 541.0 -312.0Q572.0 -272.0 572.0 -209.0Q572.0 -149.0 541.5 -100.0Q511.0 -51.0 453.0 -22.0Q395.0 7.0 316.0 7.0Q239.0 7.0 178.0 -18.0Q117.0 -43.0 80.5 -92.0Q44.0 -141.0 42.0 -210.0Z', adv: 615 },
  'p': { d: 'M405.0 -566.0Q474.0 -566.0 530.0 -531.0Q586.0 -496.0 618.5 -431.0Q651.0 -366.0 651.0 -280.0Q651.0 -194.0 618.5 -128.5Q586.0 -63.0 530.0 -27.5Q474.0 8.0 405.0 8.0Q347.0 8.0 302.5 -16.0Q258.0 -40.0 233.0 -78.0V266.0H62.0V-558.0H233.0V-479.0Q258.0 -518.0 302.0 -542.0Q346.0 -566.0 405.0 -566.0ZM354.0 -417.0Q303.0 -417.0 267.5 -380.0Q232.0 -343.0 232.0 -279.0Q232.0 -215.0 267.5 -178.0Q303.0 -141.0 354.0 -141.0Q405.0 -141.0 441.0 -178.5Q477.0 -216.0 477.0 -280.0Q477.0 -344.0 441.5 -380.5Q406.0 -417.0 354.0 -417.0Z', adv: 679 },
  'h': { d: 'M617.0 -326.0V0.0H447.0V-303.0Q447.0 -359.0 418.0 -390.0Q389.0 -421.0 340.0 -421.0Q291.0 -421.0 262.0 -390.0Q233.0 -359.0 233.0 -303.0V0.0H62.0V-740.0H233.0V-483.0Q259.0 -520.0 304.0 -542.0Q349.0 -564.0 405.0 -564.0Q501.0 -564.0 559.0 -500.5Q617.0 -437.0 617.0 -326.0Z', adv: 674 },
  'e': { d: 'M585.0 -238.0H198.0Q202.0 -186.0 231.5 -158.5Q261.0 -131.0 304.0 -131.0Q368.0 -131.0 393.0 -185.0H575.0Q561.0 -130.0 524.5 -86.0Q488.0 -42.0 433.0 -17.0Q378.0 8.0 310.0 8.0Q228.0 8.0 164.0 -27.0Q100.0 -62.0 64.0 -127.0Q28.0 -192.0 28.0 -279.0Q28.0 -366.0 63.5 -431.0Q99.0 -496.0 163.0 -531.0Q227.0 -566.0 310.0 -566.0Q391.0 -566.0 454.0 -532.0Q517.0 -498.0 552.5 -435.0Q588.0 -372.0 588.0 -288.0Q588.0 -264.0 585.0 -238.0ZM413.0 -333.0Q413.0 -377.0 383.0 -403.0Q353.0 -429.0 308.0 -429.0Q265.0 -429.0 235.5 -404.0Q206.0 -379.0 199.0 -333.0Z', adv: 616 },
  'r': { d: 'M408.0 -564.0V-383.0H361.0Q297.0 -383.0 265.0 -355.5Q233.0 -328.0 233.0 -259.0V0.0H62.0V-558.0H233.0V-465.0Q263.0 -511.0 308.0 -537.5Q353.0 -564.0 408.0 -564.0Z', adv: 428 },
  'e': { d: 'M585.0 -238.0H198.0Q202.0 -186.0 231.5 -158.5Q261.0 -131.0 304.0 -131.0Q368.0 -131.0 393.0 -185.0H575.0Q561.0 -130.0 524.5 -86.0Q488.0 -42.0 433.0 -17.0Q378.0 8.0 310.0 8.0Q228.0 8.0 164.0 -27.0Q100.0 -62.0 64.0 -127.0Q28.0 -192.0 28.0 -279.0Q28.0 -366.0 63.5 -431.0Q99.0 -496.0 163.0 -531.0Q227.0 -566.0 310.0 -566.0Q391.0 -566.0 454.0 -532.0Q517.0 -498.0 552.5 -435.0Q588.0 -372.0 588.0 -288.0Q588.0 -264.0 585.0 -238.0ZM413.0 -333.0Q413.0 -377.0 383.0 -403.0Q353.0 -429.0 308.0 -429.0Q265.0 -429.0 235.5 -404.0Q206.0 -379.0 199.0 -333.0Z', adv: 616 }
};

// Lays a word out as SVG paths at a given size. Returns the paths and the width.
export function layoutWord(text, size, x, y, tracking = -0.02) {
  let cursor = x;
  const paths = [];
  for (const ch of text) {
    const g = WORDMARK_GLYPHS[ch];
    if (!g) continue;
    const adv = ((g.adv + tracking * 1000) * size) / 1000;
    // Each letter remembers its own middle, so the pointer can fade letters as well as arcs.
    paths.push({ d: g.d, transform: `translate(${cursor.toFixed(1)} ${y}) scale(${(size / 1000).toFixed(4)})`, cx: cursor + adv / 2, cy: y - size * 0.36 });
    cursor += adv;
  }
  return { paths, width: cursor - x, x, y, size };
}

// The sphere's arcs. keepOut: boxes (the two words) that no arc may cross.
export function buildSphereArcs(cx, cy, r, seed, keepOut, tries) {
  const rng = makeRng(seed);
  const segments = [];
  const hits = (x, y) => keepOut.some((b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
  const norm = (v) => { const len = Math.hypot(v[0], v[1], v[2]); return [v[0] / len, v[1] / len, v[2] / len]; };
  for (let i = 0; i < tries; i++) {
    // A random circle around the sphere: pick an axis, then two directions square to it.
    const n = norm([rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1]);
    const a = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const u = norm([n[1] * a[2] - n[2] * a[1], n[2] * a[0] - n[0] * a[2], n[0] * a[1] - n[1] * a[0]]);
    const v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
    const start = rng() * 6.283;
    const span = 1.1 + rng() * 1.3;
    const steps = Math.max(3, Math.round(span * 6));
    const pts = [];
    let depth = 0;
    let visible = true;
    for (let k = 0; k <= steps; k++) {
      const t = start + (span * k) / steps;
      const c = Math.cos(t); const sn = Math.sin(t);
      const p = [u[0] * c + v[0] * sn, u[1] * c + v[1] * sn, u[2] * c + v[2] * sn];
      if (p[2] < 0.05) { visible = false; break; } // behind the sphere, or right on the rim
      pts.push([cx + p[0] * r, cy - p[1] * r]);
      depth += p[2];
    }
    if (!visible) continue;
    const [mx, my] = pts[Math.floor(pts.length / 2)];
    if (pts.some(([x, y]) => hits(x, y))) continue;
    const towardLight = Math.max(0, Math.min(1, 0.5 + ((cx - mx) + (cy - my)) / (2 * r)));
    const low = Math.max(0, (my - cy) / r);
    if (rng() > 0.75 * (1 - 0.08 * low)) continue; // thin the weave, a little more near the bottom
    const z = depth / (steps + 1);
    segments.push({
      points: pts.map((p) => p.map((c) => c.toFixed(1)).join(',')).join(' '),
      width: Math.round((0.7 + 1.3 * z) * 0.8 * 100) / 100,
      opacity: Math.round((0.22 + 0.6 * z) * (1 - 0.25 * low) * 100) / 100,
      gold: rng() < 0.12,
      lit: towardLight,
    });
  }
  return segments;
}

// A few short gold flecks in the empty space on the left.
export function buildSphereFlecks(cx, cy, r, seed, keepOut, count) {
  const rng = makeRng(seed);
  const hits = (x, y) => keepOut.some((b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
  const out = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 60) {
    const a = rng() * 6.283;
    const rad = r * (0.35 + 0.6 * Math.sqrt(rng()));
    const x = cx + rad * Math.cos(a); const y = cy + rad * Math.sin(a);
    if (x >= cx - 10 || hits(x, y)) continue;
    const dir = rng() * 6.283; const len = 8 + rng() * 16;
    const x2 = x + len * Math.cos(dir); const y2 = y + len * Math.sin(dir);
    if (Math.hypot(x2 - cx, y2 - cy) > r * 0.98 || hits(x2, y2)) continue;
    out.push({ points: `${x.toFixed(1)},${y.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`, opacity: Math.round((0.35 + 0.35 * rng()) * 100) / 100 });
  }
  return out;
}

// The single gold arc under the wordmark, bowing the opposite way to the arcs above.
export function buildAccentArc(x0, x1, y, lift) {
  const pts = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    pts.push(`${(x0 + (x1 - x0) * t).toFixed(1)},${(y + lift * Math.sin(Math.PI * t)).toFixed(1)}`);
  }
  return pts.join(' ');
}
