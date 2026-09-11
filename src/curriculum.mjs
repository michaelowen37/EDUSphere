// ---------------------------------------------------------------------
// THE CURRICULUM PLAN
//
// This file answers two questions a school will ask: "what does each grade cover?"
// and "how do I know it is all there?" It lists, for every grade and subject, the
// published standards we build to, and which of our modules cover each one.
//
// The targets are not ours. They are the state's (Texas TEKS first, Common Core
// alongside). What is ours is the sequencing and the practice.
//
// A grade and subject is either 'ready' or 'planned'. For anything marked ready, the
// coverage test fails while any standard has no module. Planned entries report their
// gaps without failing, so this file can hold the whole map while the content is
// still being written. Never mark something ready to make a test pass.
//
// STATES. A module is the unit; a standard is a label on it. Most states use the
// Common Core (CCSS) or a close variant of it. Texas uses its own (TEKS). So every
// standard below carries a framework, an educator picks their state once, and coverage
// is shown against that state's framework. Adding a state means adding one line to
// STATES; adding a framework means adding its codes to the standards.
// ---------------------------------------------------------------------

export const FRAMEWORKS = {
  TEKS: { name: 'Texas Essential Knowledge and Skills' },
  CCSS: { name: 'Common Core State Standards' },
};
// Pre-K has no Common Core. For those grades the Texas Prekindergarten Guidelines stand in
// for TEKS and the federal Head Start framework (used by daycare centers nationwide)
// stands in for CCSS, under the same two keys so every state still gets a coverage line.

// Which framework each state builds to. States that adopted Common Core and then
// renamed or lightly revised it are listed as CCSS: the content is the same to within
// a few codes, and those differences are handled per standard, not per state.
export const STATES = [
  ['AL', 'Alabama', 'CCSS'], ['AK', 'Alaska', 'CCSS'], ['AZ', 'Arizona', 'CCSS'], ['AR', 'Arkansas', 'CCSS'],
  ['CA', 'California', 'CCSS'], ['CO', 'Colorado', 'CCSS'], ['CT', 'Connecticut', 'CCSS'], ['DE', 'Delaware', 'CCSS'],
  ['DC', 'District of Columbia', 'CCSS'], ['FL', 'Florida', 'CCSS'], ['GA', 'Georgia', 'CCSS'], ['HI', 'Hawaii', 'CCSS'],
  ['ID', 'Idaho', 'CCSS'], ['IL', 'Illinois', 'CCSS'], ['IN', 'Indiana', 'CCSS'], ['IA', 'Iowa', 'CCSS'],
  ['KS', 'Kansas', 'CCSS'], ['KY', 'Kentucky', 'CCSS'], ['LA', 'Louisiana', 'CCSS'], ['ME', 'Maine', 'CCSS'],
  ['MD', 'Maryland', 'CCSS'], ['MA', 'Massachusetts', 'CCSS'], ['MI', 'Michigan', 'CCSS'], ['MN', 'Minnesota', 'CCSS'],
  ['MS', 'Mississippi', 'CCSS'], ['MO', 'Missouri', 'CCSS'], ['MT', 'Montana', 'CCSS'], ['NE', 'Nebraska', 'CCSS'],
  ['NV', 'Nevada', 'CCSS'], ['NH', 'New Hampshire', 'CCSS'], ['NJ', 'New Jersey', 'CCSS'], ['NM', 'New Mexico', 'CCSS'],
  ['NY', 'New York', 'CCSS'], ['NC', 'North Carolina', 'CCSS'], ['ND', 'North Dakota', 'CCSS'], ['OH', 'Ohio', 'CCSS'],
  ['OK', 'Oklahoma', 'CCSS'], ['OR', 'Oregon', 'CCSS'], ['PA', 'Pennsylvania', 'CCSS'], ['RI', 'Rhode Island', 'CCSS'],
  ['SC', 'South Carolina', 'CCSS'], ['SD', 'South Dakota', 'CCSS'], ['TN', 'Tennessee', 'CCSS'], ['TX', 'Texas', 'TEKS'],
  ['UT', 'Utah', 'CCSS'], ['VT', 'Vermont', 'CCSS'], ['VA', 'Virginia', 'CCSS'], ['WA', 'Washington', 'CCSS'],
  ['WV', 'West Virginia', 'CCSS'], ['WI', 'Wisconsin', 'CCSS'], ['WY', 'Wyoming', 'CCSS'],
].map(([code, name, framework]) => ({ code, name, framework }));
export function stateFor(code) { return STATES.find((st) => st.code === code) || null; }
export function frameworkForState(code) { const st = stateFor(code); return st ? st.framework : 'CCSS'; }

export const CURRICULUM = [
  {
    grade: 'PK4', subject: 'Math', status: 'ready',
    source: 'Texas Prekindergarten Guidelines (2015), Domain V Mathematics; Head Start Early Learning Outcomes Framework, Mathematics Development',
    standards: [
      { framework: 'TEKS', code: 'PK.V.A.1', text: 'Know that objects, or parts of an object, can be counted.', moduleIds: ['count-to-3'] },
      { framework: 'TEKS', code: 'PK.V.A.3', text: 'Count 1 to 10 items, with one count per item, and know the last number is the total.', moduleIds: ['count-to-3'] },
      { framework: 'TEKS', code: 'PK.V.A.8', text: 'Compare sets to determine which has more or fewer.', moduleIds: ['count-to-3'] },
      { framework: 'TEKS', code: 'PK.V.D.1', text: 'Sort objects that are the same and different into groups and use language to describe how the groups are similar and different.', moduleIds: ['colours', 'same-and-different'] },
      { framework: 'TEKS', code: 'PK.V.E.1', text: 'Sort objects by common attributes such as size, shape, or colour.', moduleIds: ['same-and-different'] },
      { framework: 'TEKS', code: 'PK.V.E.3', text: 'Recognize and create patterns.', moduleIds: ['patterns'] },
      { framework: 'CCSS', code: 'ELOF.P-MATH.1', text: 'Knows number names and the count sequence.', moduleIds: ['count-to-3'] },
      { framework: 'CCSS', code: 'ELOF.P-MATH.5', text: 'Compares numbers and sets.', moduleIds: ['count-to-3'] },
      { framework: 'CCSS', code: 'ELOF.P-MATH.7', text: 'Understands simple patterns.', moduleIds: ['patterns'] },
      { framework: 'CCSS', code: 'ELOF.P-MATH.8', text: 'Measures objects by their various attributes and compares them.', moduleIds: ['same-and-different'] },
    ],
  },
  {
    grade: 'K', subject: 'Math', status: 'ready', // every TEKS standard has a module; CCSS K.NBT.A.1 (teen numbers as ten and some more) is the one open item
    source: 'Texas Essential Knowledge and Skills, Kindergarten Mathematics (TEKS §111.2); Common Core Kindergarten Mathematics',
    standards: [
      { framework: 'TEKS', code: 'K.2A', text: 'Count forward and backward to at least 20 with and without objects.', moduleIds: ['count-to-5', 'count-to-10'] },
      { framework: 'TEKS', code: 'K.2B', text: 'Read, write, and represent whole numbers from 0 to at least 20.', moduleIds: ['count-to-5', 'count-to-10'] },
      { framework: 'TEKS', code: 'K.2C', text: 'Count a set of objects up to at least 20 and say the last number counted is the total.', moduleIds: ['count-to-5', 'count-to-10'] },
      { framework: 'TEKS', code: 'K.2D', text: 'Recognize instantly the quantity of a small group of objects.', moduleIds: ['count-to-5'] },
      { framework: 'TEKS', code: 'K.2E', text: 'Generate a set using objects that is more than, less than, or equal to a given number.', moduleIds: ['comparing-numbers'] },
      { framework: 'TEKS', code: 'K.2F', text: 'Generate a number that is one more or one less than a given number up to 20.', moduleIds: ['one-more-one-less'] },
      { framework: 'TEKS', code: 'K.2G', text: 'Compare sets of objects up to at least 20 using comparative language.', moduleIds: ['count-to-10', 'comparing-numbers'] },
      { framework: 'TEKS', code: 'K.2H', text: 'Use comparative language to describe two numbers up to 20 presented as written numerals.', moduleIds: ['comparing-numbers'] },
      { framework: 'TEKS', code: 'K.3A', text: 'Model the action of joining to represent addition and separating to represent subtraction.', moduleIds: ['joining-and-taking-away'] },
      { framework: 'TEKS', code: 'K.3B', text: 'Solve word problems using objects and drawings to find sums up to 10 and differences within 10.', moduleIds: ['joining-and-taking-away'] },
      { framework: 'TEKS', code: 'K.3C', text: 'Explain the strategies used to solve problems involving adding and subtracting within 10.', moduleIds: ['joining-and-taking-away'] },
      { framework: 'TEKS', code: 'K.5A', text: 'Recite numbers up to at least 100 by ones and tens beginning with any given number.', moduleIds: ['counting-by-tens'] },
      { framework: 'TEKS', code: 'K.6A', text: 'Identify two-dimensional shapes, including circles, triangles, rectangles, and squares.', moduleIds: ['shapes'] },
      { framework: 'TEKS', code: 'K.6B', text: 'Identify three-dimensional solids, including cylinders, cones, spheres, and cubes.', moduleIds: ['solids'] },
      { framework: 'TEKS', code: 'K.6E', text: 'Classify and sort two- and three-dimensional figures by attributes.', moduleIds: ['shapes'] },
      { framework: 'TEKS', code: 'K.7A', text: 'Give an example of a measurable attribute of an object, including length, capacity, and weight.', moduleIds: ['longer-and-heavier'] },
      { framework: 'TEKS', code: 'K.7B', text: 'Compare two objects with a common measurable attribute.', moduleIds: ['longer-and-heavier'] },
      { framework: 'TEKS', code: 'K.8A', text: 'Collect, sort, and organize data into two or three categories.', moduleIds: ['sorting'] },
      { framework: 'CCSS', code: 'K.CC.A.1', text: 'Count to 100 by ones and by tens.', moduleIds: ['counting-by-tens'] },
      { framework: 'CCSS', code: 'K.CC.A.2', text: 'Count forward beginning from a given number within the known sequence.', moduleIds: ['one-more-one-less'] },
      { framework: 'CCSS', code: 'K.CC.A.3', text: 'Write numbers from 0 to 20 and represent a number of objects with a written numeral.', moduleIds: ['count-to-5', 'count-to-10'] },
      { framework: 'CCSS', code: 'K.CC.B.4', text: 'Understand the relationship between numbers and quantities; connect counting to cardinality.', moduleIds: ['count-to-5', 'count-to-10'] },
      { framework: 'CCSS', code: 'K.CC.B.5', text: 'Count to answer how many questions about as many as 20 things.', moduleIds: ['count-to-5', 'count-to-10'] },
      { framework: 'CCSS', code: 'K.CC.C.6', text: 'Identify whether the number of objects in one group is greater than, less than, or equal to another group.', moduleIds: ['count-to-10', 'comparing-numbers'] },
      { framework: 'CCSS', code: 'K.CC.C.7', text: 'Compare two numbers between 1 and 10 presented as written numerals.', moduleIds: ['comparing-numbers'] },
      { framework: 'CCSS', code: 'K.OA.A.1', text: 'Represent addition and subtraction with objects, fingers, drawings, sounds, or acting out situations.', moduleIds: ['joining-and-taking-away'] },
      { framework: 'CCSS', code: 'K.OA.A.2', text: 'Solve addition and subtraction word problems, and add and subtract within 10.', moduleIds: ['joining-and-taking-away'] },
      { framework: 'CCSS', code: 'K.OA.A.3', text: 'Decompose numbers less than or equal to 10 into pairs in more than one way.', moduleIds: ['making-ten'] },
      { framework: 'CCSS', code: 'K.OA.A.4', text: 'For any number from 1 to 9, find the number that makes 10 when added to the given number.', moduleIds: ['making-ten'] },
      { framework: 'CCSS', code: 'K.OA.A.5', text: 'Fluently add and subtract within 5.', moduleIds: ['joining-and-taking-away'] },
      { framework: 'CCSS', code: 'K.NBT.A.1', text: 'Compose and decompose numbers from 11 to 19 into ten ones and some further ones.', moduleIds: [] },
      { framework: 'CCSS', code: 'K.MD.A.1', text: 'Describe measurable attributes of objects, such as length or weight.', moduleIds: ['longer-and-heavier'] },
      { framework: 'CCSS', code: 'K.MD.A.2', text: 'Directly compare two objects with a measurable attribute in common.', moduleIds: ['longer-and-heavier'] },
      { framework: 'CCSS', code: 'K.MD.B.3', text: 'Classify objects into given categories; count the numbers of objects in each category and sort by count.', moduleIds: ['sorting'] },
      { framework: 'CCSS', code: 'K.G.A.2', text: 'Correctly name shapes regardless of their orientations or overall size.', moduleIds: ['shapes'] },
      { framework: 'CCSS', code: 'K.G.A.3', text: 'Identify shapes as two-dimensional or three-dimensional.', moduleIds: ['solids'] },
      { framework: 'CCSS', code: 'K.G.B.4', text: 'Analyze and compare two- and three-dimensional shapes, describing their similarities and differences.', moduleIds: ['shapes'] },
    ],
  },
  {
    grade: 'K', subject: 'Reading', status: 'ready', // every TEKS and Common Core standard has a module
    source: 'Texas Essential Knowledge and Skills, Kindergarten English Language Arts and Reading (TEKS §110.2); Common Core Kindergarten Reading: Foundational Skills',
    standards: [
      { framework: 'TEKS', code: 'K.2A.i', text: 'Identify and produce rhyming words.', moduleIds: ['rhymes'] },
      { framework: 'TEKS', code: 'K.2A.ii', text: 'Recognize spoken alliteration or groups of words that begin with the same sound.', moduleIds: ['letter-sounds'] },
      { framework: 'TEKS', code: 'K.2A.iv', text: 'Identify syllables in spoken words.', moduleIds: ['syllables'] },
      { framework: 'TEKS', code: 'K.2B.i', text: 'Identify and match the common sounds that letters represent.', moduleIds: ['letter-sounds'] },
      { framework: 'TEKS', code: 'K.2B.ii', text: 'Use letter-sound relationships to decode, including VC, CVC, CCVC, and CVCC words.', moduleIds: ['sounding-out'] },
      { framework: 'TEKS', code: 'K.2C', text: 'Demonstrate print awareness, including identifying all uppercase and lowercase letters.', moduleIds: ['letter-names', 'big-and-small-letters'] },
      { framework: 'TEKS', code: 'K.2D.i', text: 'Identify all uppercase and lowercase letters.', moduleIds: ['letter-names', 'big-and-small-letters'] },
      { framework: 'TEKS', code: 'K.2D.ii', text: 'Recognize that print is read left to right and top to bottom.', moduleIds: ['which-way-we-read'] },
      { framework: 'TEKS', code: 'K.2E', text: 'Develop handwriting by accurately forming all uppercase and lowercase letters.', moduleIds: ['tracing-letters'] },
      { framework: 'TEKS', code: 'K.3B', text: 'Use illustrations and text to learn or clarify word meanings.', moduleIds: ['word-meanings'] },
      { framework: 'CCSS', code: 'RF.K.1.D', text: 'Recognize and name all upper- and lowercase letters of the alphabet.', moduleIds: ['letter-names', 'big-and-small-letters'] },
      { framework: 'CCSS', code: 'RF.K.2.A', text: 'Recognize and produce rhyming words.', moduleIds: ['rhymes'] },
      { framework: 'CCSS', code: 'RF.K.2.B', text: 'Count, pronounce, blend, and segment syllables in spoken words.', moduleIds: ['syllables'] },
      { framework: 'CCSS', code: 'RF.K.2.D', text: 'Isolate and pronounce the initial, medial vowel, and final sounds in three-phoneme words.', moduleIds: ['letter-sounds'] },
      { framework: 'CCSS', code: 'RF.K.3.A', text: 'Demonstrate basic knowledge of one-to-one letter-sound correspondences.', moduleIds: ['letter-sounds'] },
      { framework: 'CCSS', code: 'RF.K.1.A', text: 'Follow words from left to right, top to bottom, and page by page.', moduleIds: ['which-way-we-read'] },
    ],
  },
  {
    grade: '1', subject: 'Math', status: 'ready',
    source: 'Texas Essential Knowledge and Skills, Grade 1 Mathematics (TEKS §111.3); Common Core Grade 1 Mathematics',
    standards: [
      { framework: 'TEKS', code: '1.2B', text: 'Use concrete and pictorial models to compose and decompose numbers up to 120 as tens and ones.', moduleIds: ['teen-numbers', 'tens-and-ones'] },
      { framework: 'TEKS', code: '1.2C', text: 'Use objects, pictures, and expanded and standard forms to represent numbers up to 120.', moduleIds: ['tens-and-ones'] },
      { framework: 'TEKS', code: '1.2E', text: 'Use place value to compare whole numbers up to 120 using comparative language.', moduleIds: ['comparing-to-100'] },
      { framework: 'TEKS', code: '1.2G', text: 'Represent the comparison of two numbers to 100 using the symbols greater than, less than, or equal to.', moduleIds: ['comparing-to-100'] },
      { framework: 'TEKS', code: '1.3B', text: 'Use objects and pictorial models to solve word problems involving joining, separating, and comparing sets within 20.', moduleIds: ['adding-to-20', 'subtracting-to-20'] },
      { framework: 'TEKS', code: '1.3D', text: 'Apply basic fact strategies to add and subtract within 20, including making 10 and decomposing a number.', moduleIds: ['adding-to-20', 'subtracting-to-20'] },
      { framework: 'CCSS', code: '1.NBT.B.2', text: 'Understand that the two digits of a two-digit number represent amounts of tens and ones.', moduleIds: ['teen-numbers', 'tens-and-ones'] },
      { framework: 'CCSS', code: '1.NBT.B.3', text: 'Compare two two-digit numbers based on meanings of the tens and ones digits.', moduleIds: ['comparing-to-100'] },
      { framework: 'CCSS', code: '1.OA.B.4', text: 'Understand subtraction as an unknown-addend problem.', moduleIds: ['subtracting-to-20'] },
      { framework: 'CCSS', code: '1.OA.C.6', text: 'Add and subtract within 20, using strategies such as counting on and making ten.', moduleIds: ['adding-to-20', 'subtracting-to-20'] },
      { framework: 'CCSS', code: '1.NBT.C.5', text: 'Given a two-digit number, mentally find 10 more or 10 less than the number.', moduleIds: ['tens-and-ones'] },
    ],
  },
  {
    grade: '1', subject: 'Reading', status: 'ready',
    source: 'Texas Essential Knowledge and Skills, Grade 1 English Language Arts and Reading (TEKS §110.3); Common Core Grade 1 Reading: Foundational Skills and Literature',
    standards: [
      { framework: 'TEKS', code: '1.2B.i', text: 'Decode words in isolation and in context by applying common letter-sound correspondences (closed syllables).', moduleIds: ['read-the-word', 'read-the-sentence'] },
      { framework: 'TEKS', code: '1.2B.ii', text: 'Decode words with initial and final consonant blends, digraphs, and trigraphs.', moduleIds: ['sh-ch-th'] },
      { framework: 'TEKS', code: '1.2B.iii', text: 'Decode words with closed syllables, open syllables, VCe syllables, vowel teams, and r-controlled syllables.', moduleIds: ['silent-e'] },
      { framework: 'TEKS', code: '1.4', text: 'Use appropriate fluency (rate, accuracy, and prosody) when reading grade-level text.', moduleIds: ['read-the-sentence'] },
      { framework: 'TEKS', code: '1.6', text: 'Use metacognitive skills to both develop and deepen comprehension; ask and answer questions about a text.', moduleIds: ['what-happened'] },
      { framework: 'CCSS', code: 'RF.1.3.A', text: 'Know the spelling-sound correspondences for common consonant digraphs.', moduleIds: ['sh-ch-th'] },
      { framework: 'CCSS', code: 'RF.1.3.B', text: 'Decode regularly spelled one-syllable words.', moduleIds: ['read-the-word'] },
      { framework: 'CCSS', code: 'RF.1.3.C', text: 'Know final -e and common vowel team conventions for representing long vowel sounds.', moduleIds: ['silent-e'] },
      { framework: 'CCSS', code: 'RF.1.4.A', text: 'Read grade-level text with purpose and understanding.', moduleIds: ['read-the-sentence'] },
      { framework: 'CCSS', code: 'RL.1.1', text: 'Ask and answer questions about key details in a text.', moduleIds: ['what-happened'] },
    ],
  },
  {
    grade: '2', subject: 'Math', status: 'ready',
    source: 'Texas Essential Knowledge and Skills, Grade 2 Mathematics (TEKS §111.4); Common Core Grade 2 Mathematics',
    standards: [
      { framework: 'TEKS', code: '2.2A', text: 'Use concrete and pictorial models to compose and decompose numbers up to 1,200 as a sum of thousands, hundreds, tens, and ones.', moduleIds: ['hundreds-tens-ones'] },
      { framework: 'TEKS', code: '2.2B', text: 'Use standard, word, and expanded forms to represent numbers up to 1,200.', moduleIds: ['hundreds-tens-ones'] },
      { framework: 'TEKS', code: '2.4B', text: 'Add up to four two-digit numbers and subtract two-digit numbers using mental strategies and algorithms based on place value.', moduleIds: ['adding-with-regrouping', 'subtracting-with-regrouping'] },
      { framework: 'TEKS', code: '2.5A', text: 'Determine the value of a collection of coins up to one dollar.', moduleIds: ['money'] },
      { framework: 'TEKS', code: '2.5B', text: 'Use the cent symbol, dollar sign, and decimal point to name the value of a collection of coins.', moduleIds: ['money'] },
      { framework: 'TEKS', code: '2.6A', text: 'Model, create, and describe contextual multiplication situations in which equivalent sets of concrete objects are joined.', moduleIds: ['rows-and-columns'] },
      { framework: 'TEKS', code: '2.9G', text: 'Read and write time to the nearest one-minute increment using analog and digital clocks.', moduleIds: ['telling-time'] },
      { framework: 'CCSS', code: '2.NBT.A.1', text: 'Understand that the three digits of a three-digit number represent amounts of hundreds, tens, and ones.', moduleIds: ['hundreds-tens-ones'] },
      { framework: 'CCSS', code: '2.NBT.A.3', text: 'Read and write numbers to 1000 using base-ten numerals, number names, and expanded form.', moduleIds: ['hundreds-tens-ones'] },
      { framework: 'CCSS', code: '2.NBT.B.5', text: 'Fluently add and subtract within 100 using strategies based on place value.', moduleIds: ['adding-with-regrouping', 'subtracting-with-regrouping'] },
      { framework: 'CCSS', code: '2.MD.C.7', text: 'Tell and write time from analog and digital clocks to the nearest five minutes.', moduleIds: ['telling-time'] },
      { framework: 'CCSS', code: '2.MD.C.8', text: 'Solve word problems involving dollar bills, quarters, dimes, nickels, and pennies.', moduleIds: ['money'] },
      { framework: 'CCSS', code: '2.OA.C.3', text: 'Determine whether a group of objects (up to 20) has an odd or even number of members.', moduleIds: ['rows-and-columns'] },
      { framework: 'CCSS', code: '2.OA.C.4', text: 'Use addition to find the total number of objects arranged in rectangular arrays.', moduleIds: ['rows-and-columns'] },
    ],
  },
  {
    grade: '2', subject: 'Reading', status: 'ready',
    source: 'Texas Essential Knowledge and Skills, Grade 2 English Language Arts and Reading (TEKS §110.4); Common Core Grade 2 Reading: Foundational Skills, Literature and Language',
    standards: [
      { framework: 'TEKS', code: '2.2B.ii', text: 'Decode words with vowel teams and diphthongs.', moduleIds: ['vowel-teams'] },
      { framework: 'TEKS', code: '2.2B.iii', text: 'Decode multisyllabic words with closed syllables, open syllables, and VCe syllables.', moduleIds: ['two-syllable-words'] },
      { framework: 'TEKS', code: '2.2B.vi', text: 'Decode compound words, contractions, and common abbreviations.', moduleIds: ['two-syllable-words'] },
      { framework: 'TEKS', code: '2.3B', text: 'Use context within and beyond a sentence to determine the meaning of unfamiliar words.', moduleIds: ['word-meaning-from-context'] },
      { framework: 'TEKS', code: '2.6', text: 'Use metacognitive skills to both develop and deepen comprehension of increasingly complex texts.', moduleIds: ['reading-for-meaning'] },
      { framework: 'TEKS', code: '2.7C', text: 'Use text evidence to support an appropriate response; describe the order of events.', moduleIds: ['reading-for-meaning'] },
      { framework: 'CCSS', code: 'RF.2.3.B', text: 'Know spelling-sound correspondences for additional common vowel teams.', moduleIds: ['vowel-teams'] },
      { framework: 'CCSS', code: 'RF.2.3.C', text: 'Decode regularly spelled two-syllable words with long vowels.', moduleIds: ['two-syllable-words'] },
      { framework: 'CCSS', code: 'RL.2.1', text: 'Ask and answer such questions as who, what, where, when, why, and how to demonstrate understanding of key details.', moduleIds: ['reading-for-meaning'] },
      { framework: 'CCSS', code: 'RL.2.3', text: 'Describe how characters in a story respond to major events and challenges.', moduleIds: ['reading-for-meaning'] },
      { framework: 'CCSS', code: 'L.2.4.A', text: 'Use sentence-level context as a clue to the meaning of a word or phrase.', moduleIds: ['word-meaning-from-context'] },
    ],
  },
  {
    grade: '3', subject: 'Reading', status: 'ready',
    source: 'Texas Essential Knowledge and Skills, Grade 3 English Language Arts and Reading (TEKS §110.5); Common Core Grade 3 Reading: Informational Text and Language',
    standards: [
      { framework: 'TEKS', code: '3.3C', text: 'Identify the meaning of and use words with affixes such as im-, non-, dis-, in-, pre-, -ness, -y, and -ful.', moduleIds: ['prefixes-and-suffixes'] },
      { framework: 'TEKS', code: '3.9D.i', text: 'Recognize characteristics and structures of informational text, including the central idea with supporting evidence.', moduleIds: ['main-idea'] },
      { framework: 'TEKS', code: '3.9D.iii', text: 'Recognize organizational patterns such as cause and effect and problem and solution.', moduleIds: ['sequence-and-cause'] },
      { framework: 'TEKS', code: '3.10D.iv', text: 'Recognize characteristics of persuasive text, including distinguishing facts from opinion.', moduleIds: ['fact-or-opinion'] },
      { framework: 'CCSS', code: 'RI.3.2', text: 'Determine the main idea of a text; recount the key details and explain how they support the main idea.', moduleIds: ['main-idea'] },
      { framework: 'CCSS', code: 'RI.3.3', text: 'Describe the relationship between a series of events, ideas, or steps, using language that pertains to time, sequence, and cause/effect.', moduleIds: ['sequence-and-cause'] },
      { framework: 'CCSS', code: 'RI.3.6', text: 'Distinguish their own point of view from that of the author of a text.', moduleIds: ['fact-or-opinion'] },
      { framework: 'CCSS', code: 'L.3.4.B', text: 'Determine the meaning of the new word formed when a known affix is added to a known word.', moduleIds: ['prefixes-and-suffixes'] },
    ],
  },
  {
    grade: '4', subject: 'Math', status: 'ready',
    source: 'Texas Essential Knowledge and Skills, Grade 4 Mathematics (TEKS §111.6); Common Core Grade 4 Mathematics',
    standards: [
      { framework: 'TEKS', code: '4.2E', text: 'Represent decimals, including tenths and hundredths, using concrete and visual models and money.', moduleIds: ['equivalent-and-decimals'] },
      { framework: 'TEKS', code: '4.2G', text: 'Relate decimals to fractions that name tenths and hundredths.', moduleIds: ['equivalent-and-decimals'] },
      { framework: 'TEKS', code: '4.3E', text: 'Represent and solve addition and subtraction of fractions with equal denominators.', moduleIds: ['add-fractions'] },
      { framework: 'TEKS', code: '4.4B', text: 'Determine products of a number and 10 or 100; identify prime and composite numbers.', moduleIds: ['factors-and-multiples'] },
      { framework: 'TEKS', code: '4.4D', text: 'Use strategies and algorithms to multiply up to a four-digit number by a one-digit number and a two-digit number by a two-digit number.', moduleIds: ['multi-digit-multiplication'] },
      { framework: 'TEKS', code: '4.4E', text: 'Represent the quotient of up to a four-digit whole number divided by a one-digit whole number.', moduleIds: ['long-division'] },
      { framework: 'TEKS', code: '4.4F', text: 'Use strategies and algorithms to divide up to a four-digit dividend by a one-digit divisor.', moduleIds: ['long-division'] },
      { framework: 'CCSS', code: '4.NBT.B.5', text: 'Multiply a whole number of up to four digits by a one-digit whole number, and multiply two two-digit numbers.', moduleIds: ['multi-digit-multiplication'] },
      { framework: 'CCSS', code: '4.NBT.B.6', text: 'Find whole-number quotients and remainders with up to four-digit dividends and one-digit divisors.', moduleIds: ['long-division'] },
      { framework: 'CCSS', code: '4.OA.B.4', text: 'Find all factor pairs for a whole number in the range 1 to 100; determine whether a given whole number is prime or composite.', moduleIds: ['factors-and-multiples'] },
      { framework: 'CCSS', code: '4.NF.B.3', text: 'Understand addition and subtraction of fractions as joining and separating parts referring to the same whole.', moduleIds: ['add-fractions'] },
      { framework: 'CCSS', code: '4.NF.C.6', text: 'Use decimal notation for fractions with denominators 10 or 100.', moduleIds: ['equivalent-and-decimals'] },
      { framework: 'CCSS', code: '4.NF.C.7', text: 'Compare two decimals to hundredths by reasoning about their size.', moduleIds: ['equivalent-and-decimals'] },
    ],
  },
  {
    grade: '3', subject: 'Math', status: 'ready', // every TEKS and Common Core standard listed has a module
    source: 'Texas Essential Knowledge and Skills, Grade 3 Mathematics (TEKS §111.5); Common Core Grade 3 Mathematics',
    standards: [
      { framework: 'TEKS', code: '3.3A', text: 'Represent fractions greater than zero and less than or equal to one with denominators of 2, 3, 4, 6, and 8 using concrete objects and pictorial models.', moduleIds: ['fraction-meaning'] },
      { framework: 'TEKS', code: '3.3B', text: 'Determine the corresponding fraction greater than zero and less than or equal to one that represents a point on a number line.', moduleIds: ['fractions-on-a-line'] },
      { framework: 'TEKS', code: '3.3C', text: 'Explain that the unit fraction 1/b represents the quantity formed by one part of a whole partitioned into b equal parts.', moduleIds: ['fraction-meaning'] },
      { framework: 'TEKS', code: '3.3D', text: 'Compose and decompose a fraction as a sum of unit fractions.', moduleIds: ['building-fractions'] },
      { framework: 'TEKS', code: '3.3E', text: 'Solve problems involving partitioning an object or a set of objects among two or more recipients.', moduleIds: ['building-fractions'] },
      { framework: 'TEKS', code: '3.3F', text: 'Represent equivalent fractions with denominators of 2, 3, 4, 6, and 8 using objects and pictorial models.', moduleIds: ['equivalent-fractions'] },
      { framework: 'TEKS', code: '3.3G', text: 'Explain that two fractions are equivalent if and only if they are both represented by the same point on a number line or the same portion of a whole.', moduleIds: ['equivalent-fractions'] },
      { framework: 'TEKS', code: '3.3H', text: 'Compare two fractions having the same numerator or denominator in problems by reasoning about their sizes.', moduleIds: ['comparing-fractions'] },
      { framework: 'TEKS', code: '3.4A', text: 'Solve with fluency one-step and two-step problems involving addition and subtraction within 1,000.', moduleIds: ['add-subtract-1000'] },
      { framework: 'TEKS', code: '3.4D', text: 'Determine the total number of objects when equally sized groups are combined or arranged in arrays.', moduleIds: ['equal-groups'] },
      { framework: 'TEKS', code: '3.4F', text: 'Recall facts to multiply up to 10 by 10 with automaticity.', moduleIds: ['times-tables'] },
      { framework: 'TEKS', code: '3.4K', text: 'Solve one-step and two-step problems involving multiplication and division within 100.', moduleIds: ['sharing-equally'] },
      { framework: 'CCSS', code: '3.NF.A.1', text: 'Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts.', moduleIds: ['fraction-meaning'] },
      { framework: 'CCSS', code: '3.NF.A.2', text: 'Understand a fraction as a number on the number line.', moduleIds: ['fractions-on-a-line'] },
      { framework: 'CCSS', code: '3.NF.A.3', text: 'Explain equivalence of fractions and compare fractions by reasoning about their size.', moduleIds: ['equivalent-fractions', 'comparing-fractions'] },
      { framework: 'CCSS', code: '3.OA.A.1', text: 'Interpret products of whole numbers.', moduleIds: ['equal-groups'] },
      { framework: 'CCSS', code: '3.OA.C.7', text: 'Fluently multiply and divide within 100.', moduleIds: ['times-tables'] },
      { framework: 'CCSS', code: '3.NBT.A.2', text: 'Fluently add and subtract within 1000.', moduleIds: ['add-subtract-1000'] },
    ],
  },
];

// Every module a plan names must exist, and every module that exists should be named
// by at least one standard. The second check catches content with no purpose.
export function coverageReport(modules, framework = null) {
  const ids = new Set(modules.map((m) => m.id));
  const named = new Set();
  const rows = CURRICULUM.map((plan) => {
    const standards = plan.standards.filter((st) => !framework || st.framework === framework);
    const missing = standards.filter((st) => st.moduleIds.length === 0).map((st) => st.code);
    const unknown = standards.flatMap((st) => st.moduleIds.filter((id) => !ids.has(id)));
    plan.standards.forEach((st) => st.moduleIds.forEach((id) => named.add(id)));
    const covered = standards.length - missing.length;
    return { grade: plan.grade, subject: plan.subject, status: plan.status, framework: framework || 'all', total: standards.length, covered, missing, unknown };
  });
  const orphans = modules.filter((m) => !named.has(m.id)).map((m) => m.id);
  return { rows, orphans };
}
