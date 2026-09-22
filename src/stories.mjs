// Story-based learning. One story per module, written ahead of time because the app is static and
// offline: nothing is generated while a student is reading. Each story is a Miniature Gladwell arc,
// a specific person (or thing) with a concrete problem, a friction point that common sense cannot
// solve, the module's idea as the tool that solves it, and an echo that zooms out to the world.
// Early-years stories stay under 200 words and are read aloud; older ones stay under 350.
// `art` is the serial of the illustration in docs/ART-REQUESTS.md; the picture lives at
// art/stories/<serial>.webp once it exists, and a placeholder shows until then.
// The core cast (docs/CHARACTERS.md) appears only where the moment is big enough to deserve them;
// most stories belong to someone else, or to no one at all.
export const STORIES = {
  'count-to-3': {
  about: 'a boy counting three river stones',
    title: 'Three stones', art: 'S1', more: [{ serial: 'S29', after: 0, alt: 'Three river stones lined up on a wooden porch step, a small hand reaching for the third' }, { serial: 'S30', after: 2, alt: 'A jar with three fireflies glowing at dusk, held up in two small hands' }], cast: ['Mike'],
    alt: 'A small boy crouched at the edge of a creek, three smooth stones lined up on a flat rock',
    words: [
      'Mike had a job. Three stones from the creek. Not a pile. Three.',
      'The creek was full of stones. Big ones, wet ones, ones that sparkled. Mike scooped a handful and ran back. "That is a lot of stones," came the answer, with a laugh. "I asked for three."',
      'So Mike put one stone on the flat rock. One. He put another next to it. Two. He put one more. Three. Then he stopped.',
      'All three got skipped across the water, and each one bounced. That is what a number is. It is where you stop.',
    ],
  },
  'count-to-5': {
  about: 'five ducklings and the one that fell behind',
    title: 'Five ducklings', art: 'S2', more: [{ serial: 'S31', after: 0, alt: 'Five ducklings following a mother duck along a muddy pond edge' }, { serial: 'S32', after: 3, alt: 'One duckling stuck behind a reed while the other four go ahead, the mother looking back' }], cast: [],
    alt: 'A mother duck on a pond with five ducklings in a wobbly line behind her',
    words: [
      'A mother duck swam across the pond every morning. Behind her came her ducklings, in a wobbly line.',
      'One day the line looked short. She swam in a circle and looked again. Something was wrong, but she could not say what.',
      'So she counted the way ducks count, one bump of the beak for each. One. Two. Three. Four. Then nothing.',
      'The fifth duckling was stuck behind a lily pad, peeping. She went back for it. Five.',
      'Counting is how you know something is missing before you can even see what it is.',
    ],
  },
  'magnets': {
  about: 'a toy boat pulled across a pond by a magnet',
    title: 'The needle that knew', art: 'S3', more: [{ serial: 'S33', after: 0, alt: 'A toy boat with a magnet on its bow drifting on a pond, a child on the bank holding a magnet on a string' }, { serial: 'S34', after: 3, alt: 'Two bar magnets on a table, one flipped, pushing apart with a tiny gap between them' }], cast: [],
    alt: 'A small wooden fishing boat in thick fog, a compass needle glowing on its deck',
    words: [
      'A little fishing boat went out one morning and the fog rolled in behind it. Thick fog. The sea looked the same in every direction.',
      'The fisher turned the boat one way, then the other. Every way looked like home. Every way looked like nowhere.',
      'On the deck sat a compass: a tiny magnet on a pin. It did not care about the fog. It swung, wobbled, and settled, pointing north, the way a magnet always does.',
      'The fisher turned until north was on the left, and rowed. The harbor came out of the fog.',
      'A magnet pulls even when you cannot see what it is pulling toward. That is why you can trust it.',
    ],
  },
  'telling-time': {
  about: 'a town that ran on the clock tower',
    title: 'The clock that ran the town', art: 'S4', more: [{ serial: 'S35', after: 0, alt: 'A town square with a clock tower reading three o\'clock, market stalls below' }, { serial: 'S36', after: 3, alt: 'The same clock face at half past, the long hand straight down, pigeons on the ledge' }], cast: [],
    alt: 'A tall clock tower above a small town square at sunrise, birds circling the clock face',
    words: [
      'In one small town, nobody owned a watch. There was one clock, high on the tower, and everybody looked up at it.',
      'The baker looked up at six and lit her oven. The bus driver looked up at eight and shut his doors. The children looked up at three and ran.',
      'One winter the clock stopped. The town did not know it. The bread was late, the bus was early, the children waited at the gate. Everyone was doing their part, and nothing fit together.',
      'A girl with a ladder wound the clock. The hands moved again. By noon the town was a town again.',
      'A clock does not make time. It lets everyone agree on it.',
    ],
  },
  'fraction-meaning': {
  about: 'a girl and a pizza cut into equal slices',
    title: 'The broken cups', art: 'S5', more: [{ serial: 'S37', after: 0, alt: 'A round pizza cut into four equal slices on a checkered table, one slice lifted' }, { serial: 'S38', after: 3, alt: 'Two pizzas side by side, one cut in four and one in eight, a girl comparing slices' }], cast: [],
    alt: 'A young baker in a warm kitchen holding one small measuring cup over a bowl, broken cups on the floor',
    words: [
      'Maya baked for the whole street. The morning of the harvest fair, she reached for her measuring cups and knocked the set off the shelf. Clink, clink, crack. Every cup broke but one: the smallest, marked one quarter.',
      'The recipe said three quarters of a cup of sugar. Maya stood there with a quarter cup in her hand and forty people expecting cake.',
      'Then she looked at the cup again. One quarter. The recipe did not want a special cup. It wanted three of these.',
      'She filled the little cup. Poured. Filled it. Poured. Filled it. Poured. Three quarters of a cup, exactly, out of a piece she already had.',
      'A fraction is not a strange kind of number. It is an instruction: cut the whole into equal parts, and take this many. Three quarters means quarters, three of them. Maya\'s cake was the best on the street, and she never bought a bigger cup again.',
    ],
  },
  'water-cycle': {
  about: 'a painter watching a lake rise into mist and fall as rain',
    diagram: { kind: 'cycle' }, title: 'The lake that would not stay', art: 'S6', more: [{ serial: 'S39', after: 0, alt: 'A teenage girl painting a lake at sunrise, mist rising off the water' }, { serial: 'S40', after: 3, alt: 'Rain falling on the same lake, the painter under an umbrella, puddles gathering' }], cast: ['Chloe'],
    alt: 'A teenage girl in a bright paint-splashed jacket painting a lake at dawn, mist lifting off the water',
    words: [
      'Chloe had decided to paint the lake once a day for a year. Same spot, same hour, sunrise. She wanted to see if a place could hold still.',
      'It could not. In July the shore crept out and the rocks showed. In October the lake climbed back and swallowed them. On cold mornings a white mist rose off the water like the lake was leaving.',
      'It was leaving. That mist was the lake, evaporating, becoming air. It rose, cooled, and gathered into cloud. The cloud drifted over the hills and fell as rain into the streams that ran back into the lake. What Chloe thought was one still thing was a loop she was standing inside.',
      'Her three hundred and sixty five paintings were not one lake. They were the same water, caught at different points on its journey.',
      'The water in your glass has been a cloud, a river, and a lake, and it will be again. Nothing is used up. It only moves.',
    ],
  },
  'cells': {
  about: 'a jar of pond water seen through a microscope',
    diagram: { kind: 'cell' }, title: 'The pond that moved', art: 'S7', more: [{ serial: 'S41', after: 0, alt: 'A digital microscope on a kitchen table beside a jar of green pond water, a kitchen with a window behind' }, { serial: 'S42', after: 3, alt: 'A zoom illustration of a leaf surface magnified: walls of cells connected, each with similar structures inside, together forming part of the whole leaf' }], cast: ['Frederick'],
    alt: 'A young man in a university lab looking into a microscope, a jar of pond water beside him, remembering a boy at a kitchen table with the same jar',
    words: [
      'Frederick stood in a lab that smelled of pond water, thinking about a kitchen table from years before.',
      'That day his dad had set a small digital microscope on the kitchen table and a jar of green water from the ditch. "Look," he said. Frederick looked. The water was moving. Not sloshing. Moving. Tiny clear boxes drifted past, some with a green tint, some with a dark spot in the middle, one spinning slowly like it was searching.',
      'He asked what they were. His dad did not know. So Frederick spent the years since finding out.',
      'They were cells, the smallest things that are alive. Each one had a wall that let some things in and kept others out, a nucleus holding the instructions, and, in the green ones, tiny factories that turned sunlight into food. A leaf, a fish, and Frederick himself were built from the same kind of box, arranged differently.',
      'Everything alive is made of things too small to see, each one busy. Frederick still keeps the jar.',
    ],
  },
  'photosynthesis': {
  about: 'a boy whose plant leaned toward the window',
    diagram: { kind: 'leaf' }, title: 'The flower in the basement', art: 'S8', more: [{ serial: 'S43', after: 0, alt: 'A boy watering a potted plant on a sunny windowsill, light streaming in' }, { serial: 'S44', after: 4, alt: 'The same plant leaning toward the window, a soft cutaway of one leaf drinking light' }], cast: [],
    alt: 'A teenager in a dim basement holding a drooping yellow-leaved flower in a pot, a bright window high above',
    words: [
      'Silas won the flower at the county fair, a prize-winning orange lily, and he wanted to keep it safe. So he put it in the basement, where it was cool and nothing could knock it over.',
      'He gave it the best soil in town. He watered it every morning. Within a week the leaves turned pale, then yellow, and drooped like they were tired.',
      'More water did nothing. Better soil did nothing. The flower was fed and watered and dying, and Silas could not see why.',
      'Then his neighbor asked a strange question: "What is it eating?" Not drinking. Eating. Plants do not eat soil. They eat light. Inside every green leaf are chloroplasts, tiny solar panels that take carbon dioxide from the air, water from the roots, and the energy of sunlight, and build sugar out of them. No light, no sugar. No sugar, no lily.',
      'Silas carried it up to the window. In three days the leaves were green again.',
      'Every forest you have ever seen is made mostly of air and light, woven together by leaves.',
    ],
  },
  'pythagorean-theorem': {
  about: 'a deck that would not square up until three, four and five',
    diagram: { kind: 'pythag' }, title: 'The rope with twelve knots', art: 'S9', more: [{ serial: 'S45', after: 0, alt: 'A young man measuring a deck frame with a tape measure, lumber on sawhorses' }, { serial: 'S46', after: 3, alt: 'A chalk drawing on plywood of a right triangle with squares on its sides, the lengths shown as tiles' }], cast: ['Mike'],
    alt: 'A young man kneeling at the corner of a half-built wooden deck, stretching a knotted rope into a triangle',
    words: [
      'Mike was building his first deck alone. The boards were good, the posts were set, and the corner was wrong. He could feel it. Not by much. Just enough that every board after it would be a little more wrong than the last.',
      'A square is a square only if its corner is exactly a right angle, and Mike had no tool big enough to check a corner that size. His square was eight inches long. The deck was twelve feet.',
      'The old carpenter he worked for did not use a tool. He used a rope with knots tied at equal spaces, and he laid it out as a triangle: three spaces on one side, four on the next, five on the last. If the corner was true, the rope closed. If not, the fifth side came up short or long.',
      'Three, four, five. It works because three squared plus four squared is nine plus sixteen, which is twenty five, which is five squared. In a right triangle the two short sides squared always add up to the long side squared. The Egyptians laid out fields with that rope four thousand years ago.',
      'Mike stretched the rope. It closed. He moved the post two fingers and it closed better. The deck is still standing.',
    ],
  },
  'newtons-laws': {
  about: 'a girl and the carts on the farm',
    diagram: { kind: 'forces' }, title: 'The cart that would not start', art: 'S10', more: [{ serial: 'S47', after: 0, alt: 'A young woman pushing a heavy wheelbarrow across a farmyard, chickens scattering' }, { serial: 'S48', after: 4, alt: 'An empty cart rolling downhill on a dirt track while a full cart barely moves, a barn behind' }], cast: ['Savanah'],
    alt: 'A young woman on a farm road at dusk, shoulder against a heavy loaded cart, a barn behind her',
    words: [
      'The truck was broken, so Savanah had to get the feed to the barn by cart. Six sacks. She put her shoulder to it and pushed. Nothing.',
      'She pushed harder. It rocked and stopped. It felt personal, like the cart had decided.',
      'It had not decided anything. A thing at rest stays at rest until a force moves it, and a heavy thing needs a bigger force, because force equals mass times acceleration. Six sacks of feed have a lot of mass. Her first shove was fighting all of it at once.',
      'So she stopped fighting and started leaning, one long steady push. The cart crept, then rolled, then wanted to keep rolling, which is the other half of the same law: a thing in motion stays in motion. At the barn door she had to lean the other way to stop it.',
      'Every push she gave the cart, the cart gave back to her feet, which is why she could feel the road through her boots. That is the third law: push on the world and the world pushes back exactly as hard.',
      'Savanah left the farm a few years later for the city. She still moves heavy things the same way: one steady force, and let the motion do the rest.',
    ],
  },
  'periodic-table': {
  about: 'a professor who found the pattern in the elements',
    diagram: { kind: 'periodic', group: 1 }, title: 'The professor who guessed', art: 'S11', more: [{ serial: 'S49', after: 0, alt: 'An older professor at a chalkboard with a hand-drawn grid of squares behind him, a lecture hall' }, { serial: 'S50', after: 3, alt: 'A lab bench close up: a jar of shiny metal shavings, a glass tube of pale gas, a wooden tray of rock samples' }], cast: ['Frederick'],
    alt: 'An older professor with a large gray handlebar mustache in a white lab coat, gesturing at a periodic table poster in a lecture hall',
    words: [
      'On the first day of class, Professor Frederick wrote the name of an element on the board that none of his students had heard of. Then he described it: a soft metal, cut with a knife, that catches fire in water. He had never touched it either.',
      'A student asked how he could know that about something he had never seen. Frederick tapped the periodic table on the wall. "It told me."',
      'The table is not a list. It is a map. Every element sits in a row, its period, and a column, its group, and the position is the prediction. Down the far left column sit lithium, sodium, potassium: one loose outer electron each, which is why all of them react violently with water. Far right sit the noble gases, their outer shells full, which is why they barely react at all. Second from the right, the halogens, each one electron short and eager to grab one.',
      'Frederick\'s mystery element was in the far left column, two rows below potassium. Same column, same outer electron, same behavior. He had not guessed. He had read the map.',
      'That is what a good arrangement does. Put things where they belong, and the pattern tells you about the things you have not met yet.',
    ],
  },
  'supply-demand-and-price': {
  about: 'a jam stall and what happened to its price',
    diagram: { kind: 'curves' }, title: 'The day it rained', art: 'S12', more: [{ serial: 'S51', after: 0, alt: 'A woman behind a market stall of jam jars with a handwritten sign, a line of customers' }, { serial: 'S52', after: 3, alt: 'The same stall late in the day, few jars left, the sign changed, no line' }], cast: ['Savanah'],
    alt: 'A confident woman in a smart coat under a market awning in a city street, rain falling, a stack of umbrellas beside her',
    words: [
      'Savanah\'s first business in the city was a market stall, and the stall sold umbrellas, badly. On sunny days nobody stopped. She dropped the price twice. Still nobody.',
      'Then one Tuesday the sky opened. Within ten minutes there was a line. People who had walked past a nine-dollar umbrella all summer were now paying fifteen without asking.',
      'Nothing about the umbrellas had changed. What changed was demand. When more people want a thing, the price it can command rises. When fewer want it, the price falls. Supply works the same way in reverse. When umbrellas are scarce and the rain is falling, each one is worth more. When every stall on the street has a stack, the price sinks back.',
      'The price where the number people want to buy matches the number sellers want to sell is the equilibrium. On sunny days it was low. In the rain it jumped. Savanah did not set the price. The weather and the crowd did, and she learned to read them.',
      'She sold the stall two years later and bought the building. Every price you have ever paid was a message about who wanted what, and how badly.',
    ],
  },
  'budgets-saving-and-credit': {
  about: 'a boy saving coins for a red bicycle',
    title: 'The bike jar', art: 'S13', more: [{ serial: 'S53', after: 0, alt: 'A father and a small boy at a kitchen table with a jar of coins and a paper list' }, { serial: 'S54', after: 3, alt: 'A red bicycle in a shop window with a price tag, a boy pressing his nose to the glass' }], cast: ['Mike', 'Jaxon'],
    alt: 'A father and a six-year-old boy at a kitchen table, coins sorted into three labeled jars, a drawing of a red bicycle taped to the wall',
    words: [
      'Jaxon wanted the red bike in the shop window. Mike said yes. Then he put three jars on the table.',
      'Jaxon got a small allowance for chores. Every week, Mike had him split it: one jar for spending, one for giving, one for the bike. The bike jar got the most.',
      'By the third week, Jaxon wanted to move the bike money into the spending jar for candy. Mike did not say no. He asked how long the bike would take if he did. Jaxon counted. Forever. The candy went back on the shelf.',
      'That is a budget: a plan for money before the money arrives, so the decisions are already made when the candy appears. The shop also offered a card that would let Jaxon ride the bike today and pay later, with interest. Mike showed him the math: the same bike, plus a fourth jar that never fills, only drains.',
      'The bike jar took eleven weeks. Jaxon still has the jar. Mike still has his own three, bigger, on a shelf in the garage.',
    ],
  },
};
STORIES['texas-revolution'] = {
  about: 'a battle that was lost on purpose',
  diagram: { kind: 'map', region: 'texas', spots: [[86, 80, 'San Antonio'], [112, 76, 'San Jacinto']] }, title: 'The battle that was lost on purpose', art: 'S14', cast: ['Georgette', 'Mike'],
  alt: 'An older woman in a red coat and a teenage boy at a kitchen table, an old map of Texas spread between them and a teacup at its corner',
  more: [{ serial: 'S55', after: 0, alt: 'An elderly woman and a boy at a kitchen table over a hand-drawn map of Texas rivers' }, { serial: 'S56', after: 3, alt: 'A wide field at dawn with a lone oak and morning mist, a distant line of tents' }, { serial: 'S15', after: 2, alt: 'The stone walls of the Alamo at dawn, a single flag above them, quiet and golden' }],
  words: [
    'Mike wanted to know why the famous battle was the one Texas lost. Georgette poured the tea, spread the old map on the table, and put her finger on San Antonio.',
    '"Two hundred or so men held the Alamo for thirteen days," she said. "On the sixth of March, 1836, it fell. Nearly all of them died." She moved her finger east, a long way, to a bend in a river. "Six weeks later, here, Sam Houston won Texas in eighteen minutes."',
    'Mike looked from one finger to the other. Why would anyone remember the loss?',
    'Because the thirteen days were the point. Every day the Alamo held was a day Santa Anna\'s army stood still, and a day for the rest of Texas to get away, gather, and choose its ground. When Houston\'s men charged at San Jacinto on the twenty-first of April, they shouted the name of the fort they had lost. The loss had bought the win.',
    'Georgette folded the map. Some defeats are not the end of a story. They are the price of the ending.',
  ],
};
STORIES['inside-the-atom'] = {
  about: 'a marble in the middle of an empty stadium',
  diagram: { kind: 'atom' }, title: 'The balloon on the wall', art: 'S16', more: [{ serial: 'S57', after: 0, alt: 'A science classroom: a tiny marble in the center of a huge chalk circle on the floor, students standing at the edge' }, { serial: 'S58', after: 3, alt: 'A soft illustration of a fuzzy electron cloud around a bright dense center, drawn as light' }], cast: [],
  alt: 'A child at a birthday party pressing a rubbed balloon to a wall, where it hangs by itself, hair standing up',
  words: [
    'At a birthday party, a boy rubbed a balloon on his hair, pressed it to the wall, and let go. It stayed. The room went quiet. Then everybody tried it.',
    'Nothing was glued. Nothing was wet. A balloon that had been ordinary a second ago now clung to the wall like it belonged there.',
    'Inside every atom is a small, heavy center, the nucleus, made of protons and neutrons, wrapped in a cloud of tiny, light electrons. The nucleus never moves in a game like this. But the outer electrons are loosely held, and rubbing the balloon scraped some of them off the hair and onto the rubber. Now the balloon carried extra electrons, a negative charge, and the wall, with its charges nudged apart, pulled it in.',
    'The number of protons is what makes an atom the element it is: six for carbon, seventy-nine for gold. Electrons can come and go. Protons stay put.',
    'Almost everything you can touch, push, or stick to a wall is the outside of atoms shaking hands. The inside is a fortress nobody at the party ever reached.',
  ],
};
STORIES['negative-numbers'] = {
  about: 'a thermometer that went below zero',
  diagram: { kind: 'numberline', from: -3, to: 2, mark: -3 }, title: 'The elevator that counted backward', art: 'S17', more: [{ serial: 'S59', after: 0, alt: 'An outdoor thermometer on a frosty barn wall reading below zero, icicles' }, { serial: 'S60', after: 3, alt: 'A stairwell with floors above and below ground, an elevator door open at a lower level' }], cast: [],
  alt: 'An elevator panel with buttons from minus 3 up to 5, a hand pressing minus 3, a parking garage glimpsed through the door',
  words: [
    'Lena parked on level minus three. She knew because the sign said so, in big white paint, and because the elevator button for it sat below the button marked 0.',
    'Her meeting was on the second floor. She pressed 2. The elevator rose, and rose, and rose, and she started to wonder if it had broken. It stopped exactly where it should.',
    'Zero is the ground. Below it the numbers keep going, with a minus sign to say which way. From minus three to two is not two floors. It is three floors up to zero, then two more: five floors in all. The distance between two numbers is how far apart they sit, no matter which side of zero they are on.',
    'On the way down that evening she pressed minus three again, and counted the floors past zero on her fingers.',
    'A thermometer, a bank balance, a diver under the sea: the world needs numbers on both sides of nothing.',
  ],
};
STORIES['ratios'] = {
  about: 'a painter mixing blue and yellow into the same green',
  diagram: { kind: 'groups', a: 2, b: 1, aLabel: 'blue', bLabel: 'yellow' }, title: 'Two blues to one yellow', art: 'S18', more: [{ serial: 'S61', after: 0, alt: 'A young woman in a paint shop mixing blue and yellow into a pot, shelves of pigments' }, { serial: 'S62', after: 3, alt: 'A row of green paint samples, each mixed from a different number of spoonfuls, on a workbench' }], cast: ['Chloe'],
  alt: 'A young woman in bright clothes at a market stall abroad, mixing paint on a palette, jars of blue and yellow beside her',
  words: [
    'Chloe found the green in a market far from home: a deep, wet, leaf green that she mixed by accident on a scrap of card. Two blobs of blue, one blob of yellow. She wanted a whole jar of it.',
    'So she poured in more blue and more yellow, a bit of each, and stirred. The jar turned a green she did not want. Too yellow. She added blue. Too blue. The scrap of card sat there, still perfect, still tiny.',
    'The card had the answer. Two to one. The mix did not care how much paint there was. It cared about the proportion: for every two parts of blue, one part of yellow. Four blues and two yellows is the same green. Twenty and ten is the same green. Two and two is a different green.',
    'Chloe measured the jar in spoonfuls, two blue for every one yellow, and got her leaf green by the pint.',
    'A ratio is a recipe that ignores size. It is why a photo can be printed as a poster and still be the same picture.',
  ],
};
STORIES['industrial-revolution'] = {
  about: 'a water wheel and the town of chimneys that replaced it',
  title: 'The loom in the valley', art: 'S19', more: [{ serial: 'S63', after: 0, alt: 'A river with a water wheel turning beside a stone mill, a quiet village' }, { serial: 'S64', after: 3, alt: 'A smoky mill town with tall chimneys, rows of brick houses and a steam engine' }], cast: [],
  alt: 'A weaver at a hand loom in a cottage window, and beyond the window a tall brick mill with a water wheel and smoke',
  words: [
    'In one English valley in 1790, a weaver named Tom made cloth at a hand loom in his front room. He was good. A piece of cloth took him a week, and it fed his family for a week.',
    'Then a mill went up by the river. Inside it, a water wheel turned shafts, and the shafts turned looms, forty of them, tended by children younger than Tom\'s. The mill made in a day what Tom made in a month, and sold it for less than his thread cost.',
    'Tom could not weave faster. Nobody could. The change was not in the hands. It was in the power. A river, then coal and steam, could do the work of a hundred arms without tiring, and whoever owned the wheel owned the price of cloth.',
    'Cloth became cheap. For the first time, poor people owned more than one shirt. And Tom\'s loom went quiet, and his family moved to the mill town, and his children worked the machines that had beaten him.',
    'That is the Industrial Revolution in one valley: the price of everything fell, and the cost landed on particular people. Both halves are true, and history is the argument about which half to look at first.',
  ],
};
STORIES['main-idea'] = {
  about: 'a reader finding the one sentence that mattered',
  title: 'The movie in one sentence', art: 'S20', more: [{ serial: 'S65', after: 0, alt: 'A child reading a picture book inside a blanket fort with a flashlight' }, { serial: 'S66', after: 3, alt: 'An open notebook with one big sentence circled and small notes branching from it' }], cast: [],
  alt: 'A boy on a porch step telling a story with his hands to an old woman in a rocking chair, a paper cinema ticket in his lap',
  words: [
    'Sam came home from the cinema bursting. His grandmother, who had not been, asked what the film was about.',
    'He told her about the boat, and the storm, and the dog, and the part where the lighthouse went dark, and the girl with the lantern, and the ending. It took eleven minutes. She nodded politely, and when he finished she said, "Yes, but what was it about?"',
    'Sam thought. Everything he had said had happened. But the film was not about a boat, or a dog. All of those pieces pointed at one thing. "It was about a girl who would not give up until everyone was safe," he said.',
    'His grandmother smiled. "Now I have seen it."',
    'Every story, every paragraph, every page of a textbook has one idea the details are working for. Find the sentence that all the other sentences are helping, and you have the main idea. The rest is the dog and the storm.',
  ],
};
STORIES['weather-and-seasons'] = {
  about: 'a tree through four seasons',
  diagram: { kind: 'thermometer', c: 38 }, title: 'Cold in July', art: 'S21', more: [{ serial: 'S67', after: 0, alt: 'One hillside tree shown across four seasons in a single wide picture, snow to summer leaves' }, { serial: 'S68', after: 3, alt: 'A globe tilted on its stand with a lamp shining on it, a child\'s hands turning it' }], cast: [],
  alt: 'A girl in a sunny backyard reading a letter, and in a thought bubble, a boy in a scarf under a gray winter sky',
  words: [
    'In July, Ava got a letter from her pen pal in Australia. He wrote about snow. In July.',
    'Ava was standing in a Texas backyard in a hundred degrees, reading about a boy who was building a snowman. Same month, same planet. She checked the date twice.',
    'The Earth leans. As it travels around the Sun, one half leans toward the light and gets long days and high sun: summer. The other half leans away and gets short days and low sun: winter. In July, the northern half leans in and Texas bakes; the southern half leans out and Australia shivers. In January they swap.',
    'Ava wrote back and told him it was too hot to go outside. He did not believe her either.',
    'Seasons are not about how close the Sun is. They are about which way you are leaning.',
  ],
};
STORIES['dna-and-genes'] = {
  about: 'a pale fox cub among red ones',
  diagram: { kind: 'basepairs' }, title: 'The recipe book', art: 'S22', more: [{ serial: 'S69', after: 0, alt: 'A family of foxes at a den entrance, one pale cub among red cubs' }, { serial: 'S70', after: 3, alt: 'A twisted ladder rising like a spiral staircase, rungs in two colors, glowing softly' }], cast: [],
  alt: 'Two sisters in a bakery kitchen each holding an identical old handwritten recipe book, two slightly different cakes on the counter',
  words: [
    'Two sisters ran two bakeries in two towns, and every so often a customer swore their honey cakes tasted the same. They had never baked together. They did not even like each other much.',
    'What they shared was a book. Their mother had copied her recipe book twice, by hand, one for each daughter. Same pages, same recipes, same instructions for the honey cake.',
    'That is what DNA is: a book of instructions, copied and handed down. Each recipe in the book is a gene, and each gene tells the body how to make one thing, a protein, the way a recipe makes one cake. The whole book, every cell in you carries a copy. Your honey cake, your eye color, the shape of your ears: recipes.',
    'The two cakes were not identical. One sister used more honey; one oven ran hot. A gene is a recipe, not a photograph. What you get also depends on the kitchen.',
    'Every living thing is baking from a book it was handed, and the book is very old.',
  ],
};
STORIES['day-and-night'] = {
  about: 'a child watching the sun go down and the Earth turn',
  diagram: { kind: 'daynight' }, title: 'The rooster and the sun', art: 'S23', more: [{ serial: 'S71', after: 0, alt: 'A child at a bedroom window at sunset, the sky orange, a streetlight flickering on' }, { serial: 'S72', after: 3, alt: 'The Earth from space, half lit by the sun and half dark, a tiny house marker on the edge of night' }], cast: [],
  alt: 'A proud rooster on a fence post crowing at a rising sun, a small farm behind him',
  words: [
    'Every morning the rooster crowed, and every morning the sun came up. The rooster was sure he did it.',
    'One morning he slept late. He woke in a panic and crowed as loud as he could. The sun was already up. It had not waited for him.',
    'The sun never goes anywhere. The Earth turns, slowly, like a ball rolling in a very big room. When your side of the Earth turns to face the sun, it is day. When it turns away, it is night. The rooster is not in charge. Neither are you.',
    'He crowed anyway. It felt right.',
    'Day and night are the Earth turning, one turn a day, whether or not anybody crows.',
  ],
};
STORIES['speed-and-acceleration'] = {
  about: 'a red bike on a hill and a father with a stopwatch',
  diagram: { kind: 'plot', fn: 'accel' }, title: 'The red bike, part two', art: 'S24', more: [{ serial: 'S73', after: 0, alt: 'A boy on a red bicycle at the top of a gentle hill, a father beside him with a stopwatch' }, { serial: 'S74', after: 3, alt: 'The same bicycle at the bottom of the hill, spokes blurred, the father\'s arms raised' }], cast: ['Mike', 'Jaxon'],
  alt: 'A small boy wobbling on a red bicycle down a gentle grassy slope, a bald bearded man jogging beside him with one hand out',
  words: [
    'The red bike from the jar was finally on the grass, and Jaxon was on it, and Mike was running beside him with one hand near the seat. Every time Jaxon pedaled, Mike had to run faster. Then the grass sloped down, and Jaxon stopped pedaling, and Mike still had to run faster.',
    'That confused Jaxon later, at dinner. He had not done anything on the slope. Why did he go faster and faster?',
    'Speed is how fast you are going right now: how far, in how long. Acceleration is different. It is how fast your speed is changing. On the flat, pedaling added speed. On the slope, gravity kept adding it, a little more each second, without any pedaling at all. Mike was not running to keep up with a speed. He was running to keep up with a speed that would not stop growing.',
    'Then the flat came, the bike slowed, and Mike could walk. That was acceleration too, pointed the other way.',
    'Everything that starts, stops, or turns is accelerating. Steady speed is the rare, quiet thing in between.',
  ],
};
STORIES['percents'] = {
  about: 'a shopkeeper whose half-off sale was not what it seemed',
  diagram: { kind: 'percentgrid', shaded: 50 }, title: 'Half off what?', art: 'S25', more: [{ serial: 'S75', after: 0, alt: 'A small clothes shop with winter coats on a rack and a paper sale sign in the window' }, { serial: 'S76', after: 3, alt: 'Two price tags on one coat sleeve, one crossed out and one circled, close up' }], cast: [],
  alt: 'A shopkeeper flipping a sale sign in a small clothes shop window, a customer squinting at two price tags',
  words: [
    'Rosa ran a small clothes shop, and every spring she put the winter coats on sale. One year she tried something: she raised every price by fifty percent on Monday, and on Tuesday put up a sign that said half off.',
    'A coat that had been eighty dollars was now sixty. The customers were delighted. Rosa was confused. Half off should have undone the raise. Why was she still ahead?',
    'Because a percent is not a number. It is a fraction of whatever is in front of it. Fifty percent of eighty is forty, so the price went to one hundred twenty. But fifty percent of one hundred twenty is sixty, not forty. The second half came off a bigger pile.',
    'Percent means out of a hundred, and the hundred is always the current amount, not the original one. That is why a fall and a rise of the same percent never bring you back to where you started.',
    'Rosa took the sign down and put the old prices back. Her customers had been paying twenty dollars for the feeling of a bargain.',
  ],
};
STORIES['genes-and-traits'] = {
  about: 'two gray cats and their orange kitten',
  diagram: { kind: 'punnett' }, title: 'The kittens that did not match', art: 'S26', more: [{ serial: 'S77', after: 0, alt: 'A barn loft with two gray cats and four kittens in a basket, one bright orange' }, { serial: 'S78', after: 3, alt: 'The orange kitten grown up, sitting on a fence post in the sun, the barn behind' }], cast: [],
  alt: 'Two gray cats on a barn floor with a basket of kittens, three gray and one bright orange',
  words: [
    'Two gray barn cats had four kittens. Three were gray. One was orange, bright as a marmalade jar, and nobody could say where it came from.',
    'The farmer checked the barn for strays. There were none. Both parents were gray, plain as fog. How do two gray cats make an orange kitten?',
    'Each kitten gets two copies of the coat-color gene, one from each parent. Gray was dominant: one gray copy and the kitten shows gray. Orange was recessive: it shows only when a kitten gets two orange copies. Both parents were carrying a hidden orange copy behind their gray one. Three kittens got at least one gray copy. One kitten drew orange from both, and the hidden trait finally showed.',
    'The farmer kept that kitten. It never had to wonder where it came from. It had always been there, in both parents, waiting.',
    'A trait can skip a generation without leaving. Recessive does not mean weak. It means quiet.',
  ],
};
STORIES['light-and-optics'] = {
  about: 'a straw that looked broken in a glass of water',
  diagram: { kind: 'lightray', angle: 40 }, title: 'The straw that broke', art: 'S27', more: [{ serial: 'S79', after: 0, alt: 'A glass of water with a straw that looks bent at the surface, on a cafe table in sunlight' }, { serial: 'S80', after: 3, alt: 'A still lake at sunset reflecting the sky like a mirror, a young woman sketching on the shore' }], cast: ['Chloe'],
  alt: 'A woman in bright clothes sketching a glass of water with a straw that looks bent at the surface, sunlight on a cafe table',
  words: [
    'Chloe was sketching a glass of water at a cafe table, because she sketches everything, and the straw would not draw right. Above the water it stood straight. Below the water it leaned, as if it had snapped at the surface.',
    'She pulled the straw out. Straight. She put it back. Broken again. The water was doing something to what she saw.',
    'Light slows down when it passes from air into water, and when light changes speed at a slant, it bends. That is refraction. The light from the bottom of the straw bent on its way out of the water, so it reached her eye from a slightly different direction than the light from the top. Her eye, trusting light to travel straight, put the bottom of the straw where the bent light seemed to come from.',
    'A still pond does the other thing: it bounces light back, and you see yourself. That is reflection. Water can do both, depending on the angle, which is why a lake is a mirror at sunset and a window at noon.',
    'Chloe drew the straw bent. It was the true picture. Seeing is light arriving, and light does not always take the straight road.',
  ],
};
STORIES['habitats'] = {
  about: 'a hermit crab looking for a shell that fit',
  title: 'The crab with no shell', art: 'S28', more: [{ serial: 'S81', after: 0, alt: 'A hermit crab crawling across wet sand toward a tide pool, gulls above' }, { serial: 'S82', after: 3, alt: 'A tide pool close up: an empty spiral shell, small fish, anemones, the crab backing into the shell' }], cast: [],
  alt: 'A small hermit crab on a sandy beach peeking out of a borrowed spiral shell, a tide pool behind it',
  words: [
    'A little hermit crab had grown too big for its shell. It crawled out onto the sand with nothing on its back.',
    'The sun was hot. A gull circled. The crab hurried from rock to rock, looking for a home that fit.',
    'It tried a bottle cap. Too flat. It tried a pebble. Too hard. Then it found an empty spiral shell in the tide pool, backed in, and fit just right.',
    'A habitat is the place where a living thing has what it needs: food, water, shelter, and room. For the crab, that is the shore, with its tide pools and its spare shells.',
    'Every animal is looking for the place that fits it. The crab just does it more often.',
  ],
};
STORIES['kinds-of-weather'] = {
  about: "a puddle that came and went with the weather",
  diagram: { kind: 'thermometer', c: 22 },
  more: [{ serial: 'S84', after: 0, alt: 'The same puddle under a bright sun, half dried, a small dog sniffing at it' }, { serial: 'S85', after: 2, alt: 'The yard in falling snow, the puddle a patch of ice, small boots beside it' }],
  title: 'The puddle by the gate', art: 'S83', cast: [],
  alt: 'Rain falling into a big puddle by a garden gate, a child in a yellow raincoat looking down at it',
  words: [
    'Rain came in the night. In the morning there was a puddle by the gate.',
    'Then the sun came out. The puddle got smaller and smaller. By lunch it was gone.',
    'The wind blew. The clouds came back. Rain fell, and the puddle was there again.',
    'One cold day, the puddle turned hard. It was ice. You could tap it with a stick.',
    'Rain, sun, wind, snow. The weather changes, and the puddle shows you.',
  ],
};
STORIES['living-or-not'] = {
  about: "a rock and a snail that looked alike but were not",
  more: [{ serial: 'S87', after: 1, alt: 'The snail stretching out of its shell and creeping across a wet leaf, the rock behind it' }, { serial: 'S88', after: 3, alt: 'A child watering a small plant in a pot while the rock sits on the windowsill' }],
  title: 'The rock and the snail', art: 'S86', cast: [],
  alt: 'A gray rock and a snail with a spiral shell side by side on a garden path, a child crouching to look',
  words: [
    'On the path there was a rock. Next to it was a snail. They were the same size and the same gray.',
    'The rock did not move. The snail moved. Slowly, but it moved.',
    'The rock did not eat. The snail ate a leaf. The rock did not grow. The snail was bigger by summer.',
    'A plant in a pot is alive too. It drinks, it grows, it turns to the light.',
    'Alive things eat, grow and move. A rock does none of those. That is how you tell.',
  ],
};
STORIES['what-plants-need'] = {
  about: "a bean seed on a windowsill that would not grow until it had light",
  more: [{ serial: 'S90', after: 1, alt: 'The pot moved into a dark cupboard, the sprout pale and bent toward the crack of light' }, { serial: 'S91', after: 3, alt: 'The bean plant tall and green on the sunny windowsill with a child measuring it against a ruler' }],
  title: 'The bean on the windowsill', art: 'S89', cast: [],
  alt: 'A small clay pot on a sunny windowsill with a bean seed pushed into the soil, a child watering it with a tiny cup',
  words: [
    'A bean seed went into a pot of soil. It got a drink of water every morning.',
    'One day a green sprout came up. It grew toward the window.',
    'Then the pot went into a dark cupboard by mistake. The sprout went pale and thin. It bent toward the crack of light under the door.',
    'Back on the windowsill, it turned green again and grew tall.',
    'A plant needs three things: water, light, and soil to hold its roots. Take one away and it shows you.',
  ],
};
STORIES['hot-and-cold'] = {
  about: "a cup of cocoa and a snow cone, and which one to hold with mittens",
  more: [{ serial: 'S93', after: 1, alt: 'A snow cone in a paper cup, a child holding it and pulling a face at the cold' }, { serial: 'S94', after: 3, alt: 'Both cups side by side on a table, steam rising from one, frost on the other' }],
  title: 'Two cups', art: 'S92', cast: [],
  alt: 'A steaming cup of cocoa on a table with a child blowing on it, a window with sun outside',
  words: [
    'The cocoa was hot. Steam came up from the cup. You had to blow on it and wait.',
    'The snow cone was cold. It made your teeth hurt. You had to eat it slowly.',
    'The cocoa stood in the sun and got cooler. The snow cone stood in the sun and melted into a puddle.',
    'Hot things cool down. Cold things warm up. Everything ends up like the room.',
    'Hot and cold are how something feels next to you. Be careful with hot. Be slow with cold.',
  ],
};
// Pre-K stories: the fewest words that still make a story, three pictures each, read aloud.
STORIES['red-and-blue'] = {
  about: "a red ball and a blue ball that got mixed up at the park",
  more: [{ serial: 'S96', after: 1, alt: 'Two toddlers each holding up a ball, one red, one blue, the balls side by side' }, { serial: 'S97', after: 2, alt: 'The red ball rolling back to its red bucket, the blue ball to its blue bucket' }],
  title: 'Red ball, blue ball', art: 'S95', cast: [],
  alt: 'A red ball and a blue ball rolling toward each other on green park grass, two toddlers watching',
  words: [
    'A red ball rolled. A blue ball rolled. They bumped and stopped together.',
    'Which one is mine? Look. Red is red. Blue is blue.',
    'The red ball went to the red bucket. The blue ball went to the blue bucket. Everyone was happy.',
  ],
};
STORIES['big-and-small'] = {
  about: "a big dog and a small dog and the one bed between them",
  more: [{ serial: 'S99', after: 0, alt: 'The big dog squeezed into the tiny bed, paws hanging over the sides' }, { serial: 'S100', after: 2, alt: 'The big dog in the big bed and the small dog in the small bed, both asleep' }],
  title: 'Big dog, small dog', art: 'S98', cast: [],
  alt: 'A big fluffy dog and a small dog standing beside one small dog bed, looking at each other',
  words: [
    'Big dog was big. Small dog was small. There was one small bed.',
    'Big dog tried the small bed. His legs hung out. It did not fit.',
    'Then a big bed came. Big dog took the big bed. Small dog took the small bed. Big for big, small for small.',
  ],
};
STORIES['one-and-two'] = {
  about: "one duck on a pond, and then a friend",
  more: [{ serial: 'S102', after: 0, alt: 'A second duck landing on the pond with a splash next to the first' }, { serial: 'S103', after: 2, alt: 'Two ducks swimming side by side, two little wakes behind them' }],
  title: 'One duck, two ducks', art: 'S101', cast: [],
  alt: 'One yellow duck alone on a still pond, reeds at the edge, morning light',
  words: [
    'One duck swam on the pond. One. All by itself.',
    'Splash. Another duck landed. Now there were two. One, two.',
    'Two ducks swam together. Two is more fun than one.',
  ],
};
STORIES['please-and-thank-you'] = {
  about: "a cookie that only came out when the magic word did",
  more: [{ serial: 'S105', after: 0, alt: 'A child at the kitchen counter reaching toward a plate of cookies, a grown-up hand holding the plate still' }, { serial: 'S106', after: 2, alt: 'The child holding a cookie with both hands and smiling up' }],
  title: 'The magic word', art: 'S104', cast: [],
  alt: 'A plate of cookies on a kitchen counter, a small hand reaching, a grown-up smiling and waiting',
  words: [
    'Cookie! said the child, and grabbed. The plate did not move.',
    'Cookie, please? said the child. The plate came closer. A cookie came out.',
    'Thank you, said the child. Please opens the door. Thank you closes it nicely.',
  ],
};
STORIES['colours'] = {
  about: "a rainbow that came out one color at a time after the rain",
  more: [{ serial: 'S108', after: 0, alt: 'The rainbow half drawn in the sky, red and orange and yellow showing, the rest still faint' }, { serial: 'S109', after: 2, alt: 'The full rainbow over the houses with a child pointing and naming the colors' }],
  title: 'One color at a time', art: 'S107', cast: [],
  alt: 'A child at a window watching the rain stop and the sun come out, a faint rainbow beginning',
  words: [
    'The rain stopped. The sun came out. A rainbow began.',
    'First red. Then orange. Then yellow. Then green. Then blue. Then purple.',
    'Six colors, in a row, every time. Say them, and the rainbow is yours.',
  ],
};
STORIES['patterns'] = {
  about: "a necklace of beads that went red, blue, red, blue",
  more: [{ serial: 'S111', after: 0, alt: 'A child threading beads onto a string, a bowl of red beads and a bowl of blue beads' }, { serial: 'S112', after: 2, alt: 'The finished necklace around the child\'s neck, red blue red blue all the way round' }],
  title: 'Red, blue, red, blue', art: 'S110', cast: [],
  alt: 'A string of beads half finished on a table, red, blue, red, blue, a small hand holding the next bead',
  words: [
    'Red bead. Blue bead. Red bead. Blue bead.',
    'What comes next? Look back. Red, blue, red, blue. Red comes next.',
    'A pattern tells you what comes next. Say it out loud and you can never lose your place.',
  ],
};
STORIES['taking-turns'] = {
  about: "one swing and two children who found the fair way",
  more: [{ serial: 'S114', after: 0, alt: 'Two children both holding the swing chains, neither one sitting, both frowning' }, { serial: 'S115', after: 2, alt: 'One child swinging high while the other counts on fingers, both laughing' }],
  title: 'One swing', art: 'S113', cast: [],
  alt: 'A single swing on a playground, two children standing on either side of it',
  words: [
    'One swing. Two children. Both wanted it now.',
    'You go, then I go. Count to ten. Then swap.',
    'Ten pushes each, again and again. Taking turns means everyone gets a go.',
  ],
};
STORIES['listen-for-rhymes'] = {
  about: "a cat on a mat with a hat, and the words that sound alike",
  more: [{ serial: 'S117', after: 0, alt: 'The cat wearing a tall hat, sitting up straight on the mat' }, { serial: 'S118', after: 2, alt: 'The cat, the hat and the mat in a row, each with a word bubble of the same shape' }],
  title: 'Cat, hat, mat', art: 'S116', cast: [],
  alt: 'A striped cat sitting on a round mat, a small hat on the floor beside it',
  words: [
    'A cat sat on a mat. Cat. Mat. Hear it? They end the same.',
    'The cat put on a hat. Hat. Cat. Mat. Three words, one sound at the end.',
    'Words that end the same are rhymes. Say cat, and listen for what rhymes.',
  ],
};
export const STORY_WORD_LIMIT = { early: 200, older: 350 };
export function storyFor(moduleId) { return STORIES[moduleId] || null; }
