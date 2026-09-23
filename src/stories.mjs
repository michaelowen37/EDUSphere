// EduSphere. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
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
// The rest of pre-K, in the fewest words that still make a story.
STORIES['find-the-match'] = {
  about: 'two red mittens and the one that got lost',
  more: [{ serial: 'S120', after: 0, alt: 'The child checking a blue mitten against the red one and shaking their head' }, { serial: 'S121', after: 2, alt: 'Two red mittens held together, matching, the child smiling' }],
  title: 'The lost mitten', art: 'S119', cast: [],
  alt: 'A child holding up one red mitten, looking around the hallway, boots and coats behind',
  words: [
    'One red mitten. Where is the other? A mitten needs its match.',
    'A blue one? No. A big black one? No. Same means just alike.',
    'There, under the coat: a red mitten, just the same. Two mittens, one pair.',
  ],
};
STORIES['match-the-animals'] = {
  about: 'a duckling looking for another duckling in the yard',
  more: [{ serial: 'S123', after: 0, alt: 'The duckling face to face with a goat, both puzzled' }, { serial: 'S124', after: 2, alt: 'Two ducklings waddling together toward the pond' }],
  title: 'Which one is like me?', art: 'S122', cast: [],
  alt: 'A yellow duckling standing in a farmyard looking at a hen, a goat and a cat',
  words: [
    'A duckling looked around. Is that one like me? A hen. No.',
    'A goat? No. A cat? No. Not the same.',
    'Another duckling! Same yellow, same waddle. That is the match.',
  ],
};
STORIES['more-or-fewer'] = {
  about: 'two bowls of grapes and the one with more',
  more: [{ serial: 'S126', after: 0, alt: 'A child pointing at the heaped bowl' }, { serial: 'S127', after: 2, alt: 'Both bowls with the same number of grapes after sharing, the children eating' }],
  title: 'Two bowls', art: 'S125', cast: [],
  alt: 'Two bowls of grapes on a table, one heaped high, one nearly empty, two children looking',
  words: [
    'Two bowls of grapes. This one is full. That one has three.',
    'Which has more? The full one. More means a bigger group.',
    'Share them out, and now both bowls have the same.',
  ],
};
STORIES['first-marks'] = {
  about: 'a crayon that made its very first line',
  more: [{ serial: 'S129', after: 0, alt: 'The crayon partway along a curvy line, following a faint dotted path' }, { serial: 'S130', after: 2, alt: 'A finished squiggly line across the page, the child holding the crayon up proudly' }],
  title: 'The first line', art: 'S128', cast: [],
  alt: 'A big crayon starting a wobbly line on a large sheet of paper, a small hand holding it',
  words: [
    'A crayon touched the paper. It made a dot.',
    'The crayon moved. The dot became a line. Wobbly, but a line.',
    'Start at the dot. Follow the line. Every drawing starts this way.',
  ],
};
STORIES['three-dots'] = {
  about: 'three dots that turned into a triangle',
  more: [{ serial: 'S132', after: 0, alt: 'The pencil drawing a line from dot two to dot three' }, { serial: 'S133', after: 2, alt: 'A finished triangle drawn through the three dots' }],
  title: 'Three dots', art: 'S131', cast: [],
  alt: 'Three numbered dots on a page, a pencil at dot one',
  words: [
    'One. Two. Three. Three dots on the page.',
    'From one to two. From two to three. From three back to one.',
    'The dots became a triangle. Dots in order make a picture.',
  ],
};
STORIES['yellow-and-green'] = {
  about: 'the sun and the grass on a bright morning',
  more: [{ serial: 'S135', after: 0, alt: 'A child holding a yellow flower up to the yellow sun' }, { serial: 'S136', after: 2, alt: 'The child rolling in the green grass, green everywhere' }],
  title: 'Sun and grass', art: 'S134', cast: [],
  alt: 'A bright yellow sun above a field of green grass, a child lying in the grass looking up',
  words: [
    'The sun came up. Yellow. Bright yellow.',
    'The grass was under me. Green. Cool green.',
    'Yellow like the sun. Green like the grass. Two colors, one morning.',
  ],
};
STORIES['triangles-too'] = {
  about: 'a slice of pizza and its three corners',
  more: [{ serial: 'S138', after: 0, alt: 'The child counting the corners of a house roof drawn on paper' }, { serial: 'S139', after: 2, alt: 'A sailboat with a triangle sail, the child pointing' }],
  title: 'Three corners', art: 'S137', cast: [],
  alt: 'A slice of pizza on a plate, a child touching one corner with a finger',
  words: [
    'A slice of pizza. One corner. Two corners. Three corners.',
    'A triangle has three corners. The slice is a triangle.',
    'A roof is a triangle. A sail is a triangle. Count the corners: three.',
  ],
};
STORIES['big-and-little'] = {
  about: 'a big shoe and a little shoe by the door',
  more: [{ serial: 'S141', after: 0, alt: 'A small foot inside the huge shoe, lost in it' }, { serial: 'S142', after: 2, alt: 'The child wearing the little shoe, standing next to the big shoe' }],
  title: 'Two shoes', art: 'S140', cast: [],
  alt: 'A big grown-up shoe next to a tiny child shoe by a front door',
  words: [
    'By the door, two shoes. One big. One little.',
    'The big shoe was too big. My foot swam in it.',
    'The little shoe fit. Big for big feet. Little for little feet.',
  ],
};
STORIES['circle-and-square'] = {
  about: 'a ball that rolled and a block that would not',
  more: [{ serial: 'S144', after: 0, alt: 'The ball rolling away down the ramp, the block still at the top' }, { serial: 'S145', after: 2, alt: 'A child stacking blocks into a tower next to the ball' }],
  title: 'Round and cornered', art: 'S143', cast: [],
  alt: 'A red ball and a wooden block at the top of a small ramp',
  words: [
    'A ball is round. It rolled down the ramp.',
    'A block has corners. It sat there. It did not roll.',
    'Round rolls. Corners stay. A circle is round. A square has corners.',
  ],
};
STORIES['a-and-b'] = {
  about: 'the first two letters on a birthday banner',
  more: [{ serial: 'S147', after: 0, alt: 'A close look at a big letter A on the banner' }, { serial: 'S148', after: 2, alt: 'The letters A and B side by side, the child tracing them in the air' }],
  title: 'A and B', art: 'S146', cast: [],
  alt: 'A colorful banner with big letters on it, a child pointing at the first letter',
  words: [
    'On the banner were letters. The first was A.',
    'Next to it was B. A, then B.',
    'A and B are letters. Letters make words. Words make banners.',
  ],
};
STORIES['not-the-same'] = {
  about: 'three red apples and one green one',
  more: [{ serial: 'S150', after: 0, alt: 'A child pointing at the green apple' }, { serial: 'S151', after: 2, alt: 'The child taking a bite of the green apple, smiling' }],
  title: 'The green one', art: 'S149', cast: [],
  alt: 'Four apples in a row on a table, three red and one green',
  words: [
    'Four apples in a row. Red. Red. Red. Green.',
    'Which one is different? The green one. It is not alike.',
    'Different means not the same. The green apple was the odd one out, and it was delicious.',
  ],
};
STORIES['listen-and-tap-pictures'] = {
  about: 'a game of point to the picture',
  more: [{ serial: 'S153', after: 0, alt: 'The child\'s finger on the picture of the dog' }, { serial: 'S154', after: 2, alt: 'The child\'s finger on the picture of the cup, the grown-up clapping' }],
  title: 'Point to it', art: 'S152', cast: [],
  alt: 'A child sitting with a picture book open, a grown-up saying a word, pictures of a dog, a cup and a hat',
  words: [
    'Dog. Where is the dog? There. Tap.',
    'Cup. Where is the cup? There. Tap.',
    'Listen to the word. Find its picture. Tap it. That is the whole game.',
  ],
};
STORIES['animal-sounds'] = {
  about: 'a walk past the farm and every animal that spoke',
  more: [{ serial: 'S156', after: 0, alt: 'The duck with its beak open, the child laughing' }, { serial: 'S157', after: 2, alt: 'The cat on the fence post, the child listening with a hand to one ear' }],
  title: 'Who said that?', art: 'S155', cast: [],
  alt: 'A child walking past a farm fence, a cow, a duck and a cat looking over it',
  words: [
    'Moo. Who said that? The cow.',
    'Quack. Who said that? The duck.',
    'Meow. Who said that? The cat. Every animal has its own sound.',
  ],
};
STORIES['same-and-different'] = {
  about: 'two socks that looked the same until you looked',
  more: [{ serial: 'S159', after: 0, alt: 'A close look at the sock with a small hole in the toe' }, { serial: 'S160', after: 2, alt: 'The child holding up the matching pair, both without holes' }],
  title: 'Two socks', art: 'S158', cast: [],
  alt: 'Two striped socks laid side by side on a bed, a child looking closely',
  words: [
    'Two socks. Stripes and stripes. The same?',
    'Look again. This one has a hole. That one does not.',
    'Same looks alike. Different does not. Look twice before you say.',
  ],
};
STORIES['match-the-vehicles'] = {
  about: 'a toy garage and the cars that belong in pairs',
  more: [{ serial: 'S162', after: 0, alt: 'The child holding two identical red toy cars' }, { serial: 'S163', after: 2, alt: 'All the vehicles lined up in pairs on the garage floor' }],
  title: 'Two of each', art: 'S161', cast: [],
  alt: 'A toy garage with cars, trucks and a bus lined up, a child sorting them',
  words: [
    'Red car. Where is the other red car? There.',
    'Truck. Where is the other truck? There.',
    'Two of each, side by side. The same means just alike.',
  ],
};
STORIES['match-the-things'] = {
  about: 'tidying up when everything has a twin',
  more: [{ serial: 'S165', after: 0, alt: 'Two cups placed side by side on a shelf' }, { serial: 'S166', after: 2, alt: 'The tidy shelf with everything in pairs, the child sitting down happy' }],
  title: 'Everything has a twin', art: 'S164', cast: [],
  alt: 'A messy floor with cups, spoons and blocks, two of each, a child starting to sort',
  words: [
    'Cup. Another cup. Together.',
    'Spoon. Another spoon. Together.',
    'Every thing had a twin. Match them and the floor is tidy.',
  ],
};
STORIES['match-the-water-animals'] = {
  about: 'a pond where every swimmer had a friend just like it',
  more: [{ serial: 'S168', after: 0, alt: 'Two identical fish swimming side by side' }, { serial: 'S169', after: 2, alt: 'Two frogs on one lily pad' }],
  title: 'Pond pairs', art: 'S167', cast: [],
  alt: 'A pond with fish, ducks and frogs, two of each',
  words: [
    'A fish. Another fish, just the same.',
    'A frog. Another frog, just the same.',
    'In the pond, every swimmer had a match.',
  ],
};
STORIES['match-the-land-animals'] = {
  about: 'a field where the animals stood in twos',
  more: [{ serial: 'S171', after: 0, alt: 'Two rabbits hopping together' }, { serial: 'S172', after: 2, alt: 'Two spotted cows walking side by side' }],
  title: 'Two by two', art: 'S170', cast: [],
  alt: 'A field with rabbits, cows and sheep, two of each',
  words: [
    'Two rabbits. The same ears. The same hop.',
    'Two cows. The same spots.',
    'Two by two, the animals crossed the field. Same means just alike.',
  ],
};
STORIES['match-the-shapes'] = {
  about: 'a shape sorter and the hole that fit',
  more: [{ serial: 'S174', after: 0, alt: 'The triangle block pressed against the round hole, not going in' }, { serial: 'S175', after: 2, alt: 'The triangle block dropping into the triangle hole' }],
  title: 'The hole that fits', art: 'S173', cast: [],
  alt: 'A wooden shape sorter box with a circle, square and triangle hole, a child holding a triangle block',
  words: [
    'A triangle block. A round hole? No fit.',
    'A square hole? No fit.',
    'A triangle hole. Yes. Same shape, same fit.',
  ],
};
STORIES['match-the-solids'] = {
  about: 'blocks and balls in the toy box',
  more: [{ serial: 'S177', after: 0, alt: 'Two cubes stacked, a child adding a third' }, { serial: 'S178', after: 2, alt: 'Two balls rolling across the floor together' }],
  title: 'Blocks and balls', art: 'S176', cast: [],
  alt: 'A toy box with cubes, balls, cones and cans spilling out',
  words: [
    'A cube. Another cube, just the same. Stack them.',
    'A ball. Another ball. Roll them.',
    'Cubes stack. Balls roll. Match the solid to its twin.',
  ],
};
STORIES['more-and-fewer-5'] = {
  about: 'five ducks on the pond and three that flew away',
  more: [{ serial: 'S180', after: 0, alt: 'Three ducks flying up, two still on the water' }, { serial: 'S181', after: 2, alt: 'Two ducks left on the pond, the child holding up two fingers' }],
  title: 'Five, then two', art: 'S179', cast: [],
  alt: 'Five ducks on a pond, a child counting on fingers',
  words: [
    'Five ducks on the pond. One, two, three, four, five.',
    'Three flew away. Now two. Two is fewer than five.',
    'More is the bigger group. Fewer is the smaller. The pond went from more to fewer.',
  ],
};
STORIES['bigger-and-smaller'] = {
  about: 'a pumpkin patch and the pumpkin that fit in a wagon',
  more: [{ serial: 'S183', after: 0, alt: 'The child trying to lift the huge pumpkin' }, { serial: 'S184', after: 2, alt: 'The middle pumpkin sitting neatly in the wagon' }],
  title: 'The right pumpkin', art: 'S182', cast: [],
  alt: 'A pumpkin patch with big and small pumpkins, a child pulling a small wagon',
  words: [
    'A huge pumpkin. Too big. It did not fit the wagon.',
    'A tiny pumpkin. Too small. It rolled around.',
    'A middle one. Just right. Bigger takes more room; smaller takes less.',
  ],
};
STORIES['first-strokes'] = {
  about: 'a rainy window and the lines a finger drew',
  more: [{ serial: 'S186', after: 0, alt: 'A wavy line drawn across the fogged glass' }, { serial: 'S187', after: 2, alt: 'A window covered in lines and a smiling face drawn at the end' }],
  title: 'Lines on the window', art: 'S185', cast: [],
  alt: 'A child drawing with a finger on a fogged window, a line going down',
  words: [
    'The window was fogged. My finger went down. A line.',
    'Across. Another line. Then a wavy one.',
    'Start at the dot. Follow the line. Down, across, wavy: the first strokes of every letter.',
  ],
};
STORIES['connect-the-dots'] = {
  about: 'dots that became a boat when you went in order',
  more: [{ serial: 'S189', after: 0, alt: 'Half the dots joined, the hull of a boat appearing' }, { serial: 'S190', after: 2, alt: 'The finished boat with a sail, the child coloring it' }],
  title: 'The dot boat', art: 'S188', cast: [],
  alt: 'A page of numbered dots, a pencil starting at one',
  words: [
    'One to two. Two to three. What is it?',
    'Four, five, six. A shape is coming.',
    'Seven, eight. A boat! Go in order and the dots show you.',
  ],
};
STORIES['draw-the-shapes'] = {
  about: 'a circle drawn all the way round',
  more: [{ serial: 'S192', after: 0, alt: 'The circle half drawn on the board' }, { serial: 'S193', after: 2, alt: 'A finished circle, a square and a triangle on the board' }],
  title: 'All the way round', art: 'S191', cast: [],
  alt: 'A child drawing a circle on a chalkboard, starting at a dot',
  words: [
    'Start at the dot. Go round. Keep going.',
    'Almost there. Do not stop early.',
    'Back to the dot. A circle. Start at the dot and go all the way around.',
  ],
};
STORIES['big-bigger-biggest'] = {
  about: 'three bears and three bowls',
  more: [{ serial: 'S195', after: 0, alt: 'The little bear with the little bowl' }, { serial: 'S196', after: 2, alt: 'All three bears eating from the right bowls' }],
  title: 'Three bowls', art: 'S194', cast: [],
  alt: 'Three bowls in a row on a table, small, medium and large, three bears behind them',
  words: [
    'A little bowl. A middle bowl. A big bowl.',
    'Little bear, middle bear, big bear. Each one found its own.',
    'Little, middle-sized, biggest. Three sizes in a row.',
  ],
};
STORIES['helpers-all-around'] = {
  about: 'a walk to school and everyone who helped',
  more: [{ serial: 'S198', after: 0, alt: 'A bus driver smiling as children climb aboard' }, { serial: 'S199', after: 2, alt: 'A teacher at the classroom door welcoming children in' }],
  title: 'Helpers', art: 'S197', cast: [],
  alt: 'A crossing guard holding up a sign at a street corner, children crossing',
  words: [
    'The crossing guard stopped the cars. We crossed.',
    'The bus driver opened the door. We climbed in.',
    'The teacher opened the classroom. Helpers are all around. Every helper has a job.',
  ],
};
STORIES['first-sounds'] = {
  about: 'the sound at the start of every name in the room',
  more: [{ serial: 'S201', after: 0, alt: 'A child saying buh with a hand on their chest' }, { serial: 'S202', after: 2, alt: 'Two name cards side by side, the children pointing at the first letters' }],
  title: 'Start sounds', art: 'S200', cast: [],
  alt: 'A classroom circle, a teacher pointing at a child, name cards on the floor',
  words: [
    'Ben. Buh. Ben starts with buh.',
    'Sam. Sss. Sam starts with sss.',
    'Listen to the start of the word. Every word begins with a sound.',
  ],
};
STORIES['which-came-first'] = {
  about: 'two sounds at the zoo',
  more: [{ serial: 'S204', after: 0, alt: 'The lion mid-roar' }, { serial: 'S205', after: 2, alt: 'The parrot squawking on a branch, the child pointing back at the lion' }],
  title: 'Two sounds', art: 'S203', cast: [],
  alt: 'A child at a zoo fence with a lion and a parrot behind it',
  words: [
    'Roar. Then squawk. Which came first?',
    'The roar. That was the lion.',
    'Hold the first sound in your head while you hear the second.',
  ],
};
STORIES['which-came-second'] = {
  about: 'three sounds in the kitchen',
  more: [{ serial: 'S207', after: 0, alt: 'The kettle whistling with steam' }, { serial: 'S208', after: 2, alt: 'The dog barking at the back door, the clock on the wall behind' }],
  title: 'Three sounds', art: 'S206', cast: [],
  alt: 'A kitchen with a kettle, a clock and a dog, a child listening',
  words: [
    'Whistle. Tick. Woof. Three sounds.',
    'Which came second? Tick. The clock.',
    'Which came last? Woof. The dog. Keep the sounds in a row in your head.',
  ],
};
STORIES['big-letters'] = {
  about: 'the letters on the big red bus',
  more: [{ serial: 'S210', after: 0, alt: 'A close look at the big letter B on the bus' }, { serial: 'S211', after: 2, alt: 'The child saying the letters while the bus pulls away' }],
  title: 'Letters on the bus', art: 'S209', cast: [],
  alt: 'A big red bus with letters on its side, a child reading them from the sidewalk',
  words: [
    'On the bus were big letters. B. U. S.',
    'B says its name. U says its name. S says its name.',
    'Every letter has a name. Say them and you can read the bus.',
  ],
};
STORIES['first-letter-tracing'] = {
  about: 'a letter drawn in the sand',
  more: [{ serial: 'S213', after: 0, alt: 'The stick halfway down the first line of a letter' }, { serial: 'S214', after: 2, alt: 'A finished big letter L in the sand, the waves nearby' }],
  title: 'A letter in the sand', art: 'S212', cast: [],
  alt: 'A child on a beach drawing a big letter in wet sand with a stick',
  words: [
    'Start at the dot. Follow the arrow. Down.',
    'Across. Lift the stick.',
    'A letter in the sand. Start at the dot, follow the arrow, and any letter is yours.',
  ],
};
STORIES['more-big-letters'] = {
  about: 'letters built from sticks',
  more: [{ serial: 'S216', after: 0, alt: 'The stick T on the table' }, { serial: 'S217', after: 2, alt: 'Four stick letters in a row, the child clapping' }],
  title: 'Stick letters', art: 'S215', cast: [],
  alt: 'A child laying craft sticks on a table to make letters',
  words: [
    'One stick down. One stick across. An L.',
    'One stick down. One stick across the top. A T.',
    'Straight lines make letters. Start at the dot and lay the line.',
  ],
};
STORIES['trace-straight-letters'] = {
  about: 'L, T and F drawn on the steamy mirror',
  more: [{ serial: 'S219', after: 0, alt: 'The letter T drawn beside the L on the mirror' }, { serial: 'S220', after: 2, alt: 'L, T and F all drawn on the mirror, a smiling child behind' }],
  title: 'L, T and F', art: 'S218', cast: [],
  alt: 'A steamy bathroom mirror with a big L drawn on it by a small finger',
  words: [
    'Down, then across. L.',
    'Down, then across the top. T.',
    'Down, across the top, across the middle. F. Down, then across: three letters from two moves.',
  ],
};
// Kindergarten, in the fewest words that still make a story.
STORIES['rules-and-helpers'] = {
  about: 'a line at the slide and the grown-up who kept it fair',
  more: [{ serial: 'S222', after: 0, alt: 'Two children colliding at the bottom of the slide, both surprised' }, { serial: 'S223', after: 2, alt: 'A neat line at the top of the slide, one child sliding down alone, smiling' }],
  title: 'One at a time', art: 'S221', cast: [],
  alt: 'A playground slide with children waiting in a line, a grown-up at the bottom',
  words: [
    'Everyone wanted the slide at once. Bump. Ouch.',
    'A rule: one at a time. Wait at the top. Go when the slide is empty.',
    'Rules keep us safe. The helper at the bottom kept the rule, and nobody bumped again.',
  ],
};
STORIES['needs-and-wants'] = {
  about: 'a trip to the store with only enough for one',
  more: [{ serial: 'S225', after: 0, alt: 'The child looking at the toy on the shelf' }, { serial: 'S226', after: 2, alt: 'The family eating toast at the table, the child smiling anyway' }],
  title: 'The one thing', art: 'S224', cast: [],
  alt: 'A child and a grown-up in a store aisle, a loaf of bread in one hand, a toy in the other',
  words: [
    'Bread, or the toy? There was money for one.',
    'We need to eat. We want to play. Needs come first.',
    'The bread came home. The toy stayed. Next time, maybe. Wants can wait.',
  ],
};
STORIES['our-flag-and-holidays'] = {
  about: 'a flag going up the pole on a holiday morning',
  more: [{ serial: 'S228', after: 0, alt: 'A close look at the stars in the corner of the flag' }, { serial: 'S229', after: 2, alt: 'Children saluting the flag, the sun behind it' }],
  title: 'Up the pole', art: 'S227', cast: [],
  alt: 'A flag rising up a flagpole outside a school on a bright morning, children watching',
  words: [
    'Up went the flag. Red. White. Blue.',
    'Count the stripes: thirteen. Count the stars: fifty, one for each state.',
    'On a holiday the flag goes up and we remember why. Fifty stars, thirteen stripes.',
  ],
};
STORIES['jobs-people-do'] = {
  about: 'a morning when every grown-up went to a different job',
  more: [{ serial: 'S231', after: 0, alt: 'The baker holding out a loaf at the bakery door' }, { serial: 'S232', after: 2, alt: 'The nurse with a bandage, helping a child with a scraped knee' }],
  title: 'Off to work', art: 'S230', cast: [],
  alt: 'A street in the morning with a baker, a mail carrier, a bus driver and a nurse all heading out',
  words: [
    'The baker went to bake bread. The nurse went to help the sick.',
    'The mail carrier carried the mail. The driver drove the bus.',
    'Every job helps someone. People work to earn money for what they need.',
  ],
};
STORIES['voting-in-class'] = {
  about: 'a class that could not agree on a story until they voted',
  more: [{ serial: 'S234', after: 0, alt: 'The teacher counting raised hands' }, { serial: 'S235', after: 2, alt: 'The class listening to the whale story, the dragon book waiting on the shelf' }],
  title: 'Hands up', art: 'S233', cast: [],
  alt: 'A classroom with children raising hands, a teacher holding two books',
  words: [
    'Two books. Half wanted one. Half wanted the other.',
    'Hands up for the dragon. Hands up for the whale. One vote each.',
    'Eleven for the whale, nine for the dragon. More votes wins. The whale it was, and the dragon tomorrow.',
  ],
};
STORIES['our-two-flags'] = {
  about: 'two flags on one pole outside the courthouse',
  more: [{ serial: 'S237', after: 0, alt: 'A close look at the lone star on the Texas flag' }, { serial: 'S238', after: 2, alt: 'A child pointing up at both flags in the wind' }],
  title: 'Two flags', art: 'S236', cast: [],
  alt: 'A flagpole with two flags, the American flag above the Texas flag, a courthouse behind',
  words: [
    'Two flags on one pole. The top one had fifty stars.',
    'The one below had one big star. Red, white and blue too.',
    'Fifty stars for the country. One star for Texas. Both are ours.',
  ],
};
STORIES['count-to-10'] = {
  about: 'ten steps to the top of the slide',
  more: [{ serial: 'S240', after: 0, alt: 'The child halfway up, holding up five fingers' }, { serial: 'S241', after: 2, alt: 'The child at the top of the slide, ten fingers up, about to go' }],
  title: 'Ten steps', art: 'S239', cast: [],
  alt: 'A child climbing the ladder of a tall slide, counting each rung',
  words: [
    'One. Two. Three. Each step, one number.',
    'Four, five, six, seven. Higher and higher.',
    'Eight, nine, ten. The top. The last number says how many steps there were.',
  ],
};
STORIES['tracing-numbers'] = {
  about: 'a number 2 drawn in the frosting',
  more: [{ serial: 'S243', after: 0, alt: 'The finger halfway through the curve of the 2' }, { serial: 'S244', after: 2, alt: 'A finished 2 on the cake, two candles beside it' }],
  title: 'Two in the frosting', art: 'S242', cast: [],
  alt: 'A cake with a big 2 being drawn in the frosting with a finger',
  words: [
    'Start at the dot. Curve round, then down.',
    'Along the bottom. Stop. A two.',
    'Start at the dot, follow the arrow, and the number draws itself.',
  ],
};
STORIES['one-more-one-less'] = {
  about: 'cookies on a plate, one added and one eaten',
  more: [{ serial: 'S246', after: 0, alt: 'The plate with five cookies' }, { serial: 'S247', after: 2, alt: 'A child with crumbs on their face, four cookies left' }],
  title: 'One more, one less', art: 'S245', cast: [],
  alt: 'A plate with four cookies and a hand adding one',
  words: [
    'Four cookies. One more. Now five.',
    'Someone ate one. One less. Now four.',
    'One more is the next number. One less is the number before.',
  ],
};
STORIES['joining-and-taking-away'] = {
  about: 'two toy cars, three toy cars, and one that drove away',
  more: [{ serial: 'S249', after: 0, alt: 'Five cars parked in a row' }, { serial: 'S250', after: 2, alt: 'One car driving off, four left behind' }],
  title: 'Cars in the garage', art: 'S248', cast: [],
  alt: 'A toy garage with two cars inside and three more arriving',
  words: [
    'Two cars in the garage. Three drove in. Joining. Now five.',
    'One drove away. Taking away. Now four.',
    'Joining makes more. Taking away leaves fewer. Count to see.',
  ],
};
STORIES['comparing-numbers'] = {
  about: 'two towers of blocks and the taller one',
  more: [{ serial: 'S252', after: 0, alt: 'The child counting the taller tower block by block' }, { serial: 'S253', after: 2, alt: 'The child holding up six fingers next to the taller tower' }],
  title: 'Which is bigger?', art: 'S251', cast: [],
  alt: 'Two block towers side by side, one of six blocks and one of four, a child comparing',
  words: [
    'Six blocks. Four blocks. Which is bigger?',
    'Count up: four, five, six. Six comes later.',
    'The number you say later when counting is the bigger one. Six is bigger than four.',
  ],
};
STORIES['shapes'] = {
  about: 'a walk where every shape had a name',
  more: [{ serial: 'S255', after: 0, alt: 'The child touching the four corners of the square window' }, { serial: 'S256', after: 2, alt: 'The child counting the three corners of the roof' }],
  title: 'Shape walk', art: 'S254', cast: [],
  alt: 'A street with a round clock, a square window and a triangle roof, a child pointing',
  words: [
    'A round clock. No corners. A circle.',
    'A window. Four sides, four corners. A square.',
    'A roof. Three sides, three corners. A triangle. Count the sides and corners and the shape tells you its name.',
  ],
};
STORIES['tracing-shapes'] = {
  about: 'a square drawn on the sidewalk in chalk',
  more: [{ serial: 'S258', after: 0, alt: 'The square half drawn, two sides done' }, { serial: 'S259', after: 2, alt: 'The finished square with the child standing inside it' }],
  title: 'Chalk square', art: 'S257', cast: [],
  alt: 'A child drawing a big square on the sidewalk with chalk, starting at a dot',
  words: [
    'Start at the dot. Across. Down.',
    'Back across. Up.',
    'All the way around to the dot. A square. Start at the dot and go all the way around.',
  ],
};
STORIES['counting-by-tens'] = {
  about: 'counting fingers on ten friends',
  more: [{ serial: 'S261', after: 0, alt: 'A child counting along the line, pointing at each pair of hands' }, { serial: 'S262', after: 2, alt: 'The whole line with hands up, a big 100 in the air' }],
  title: 'Ten friends, ten fingers', art: 'S260', cast: [],
  alt: 'Ten children in a line holding up both hands',
  words: [
    'One friend: ten fingers. Two friends: twenty.',
    'Thirty. Forty. Fifty. Every friend adds ten.',
    'Sixty, seventy, eighty, ninety, one hundred. Ten friends, one hundred fingers. Count by tens.',
  ],
};
STORIES['longer-and-heavier'] = {
  about: 'a long stick and a heavy rock at the creek',
  more: [{ serial: 'S264', after: 0, alt: 'The stick laid across the water from bank to bank' }, { serial: 'S265', after: 2, alt: 'The child straining to lift the rock with both hands' }],
  title: 'Long and heavy', art: 'S263', cast: [],
  alt: 'A child at a creek holding a long stick, a big rock on the bank',
  words: [
    'The stick was long. It reached across the creek.',
    'The rock was heavy. It took two hands to lift.',
    'Longer reaches further. Heavier is harder to lift.',
  ],
};
STORIES['sorting'] = {
  about: 'a drawer of socks, sorted',
  more: [{ serial: 'S267', after: 0, alt: 'Three neat piles of socks' }, { serial: 'S268', after: 2, alt: 'The child counting the blue pile on their fingers' }],
  title: 'The sock drawer', art: 'S266', cast: [],
  alt: 'A pile of socks of different colors on a bed, a child sorting them into groups',
  words: [
    'Red socks here. Blue socks there. White socks in the middle.',
    'Alike with alike. Three piles.',
    'Then count each pile. Four red, six blue, two white. Sort first, count second.',
  ],
};
STORIES['solids'] = {
  about: 'shapes you can hold, in the toy box',
  more: [{ serial: 'S270', after: 0, alt: 'The child rolling the ball and stacking the block' }, { serial: 'S271', after: 2, alt: 'The four solids in a row on the table' }],
  title: 'Shapes you can hold', art: 'S269', cast: [],
  alt: 'A toy box with a ball, a block, a party hat and a can',
  words: [
    'A ball rolls. A sphere.',
    'A block stacks. A cube. A party hat comes to a point. A cone.',
    'A can rolls and stacks. A cylinder. Solid shapes are things you can hold.',
  ],
};
STORIES['making-ten'] = {
  about: 'ten fingers and the partner every number has',
  more: [{ serial: 'S273', after: 0, alt: 'Hands with six up and four down' }, { serial: 'S274', after: 2, alt: 'Hands with all ten up, the child grinning' }],
  title: 'Partners of ten', art: 'S272', cast: [],
  alt: 'A child holding up both hands, three fingers folded down',
  words: [
    'Ten fingers. Fold three down. Seven up.',
    'Three and seven make ten. Partners.',
    'Every number up to nine has a partner that makes ten. Fold and count to find it.',
  ],
};
STORIES['more-and-fewer-10'] = {
  about: 'two buckets of shells at the beach',
  more: [{ serial: 'S276', after: 0, alt: 'The shells from one bucket laid out in a line of eight' }, { serial: 'S277', after: 2, alt: 'The two lines of shells side by side, one longer' }],
  title: 'Two buckets', art: 'S275', cast: [],
  alt: 'Two buckets of shells on the sand, a child looking into both',
  words: [
    'Count this bucket: eight shells.',
    'Count that bucket: six shells.',
    'Eight is bigger than six. Count both, and the bigger number has more.',
  ],
};
STORIES['letter-names'] = {
  about: 'the alphabet song on the way to school',
  more: [{ serial: 'S279', after: 0, alt: 'The child singing with a big open mouth' }, { serial: 'S280', after: 2, alt: 'A row of letter blocks in order on a shelf' }],
  title: 'The alphabet song', art: 'S278', cast: [],
  alt: 'A child singing in the back seat of a car, letters floating around',
  words: [
    'A, B, C, D. The song goes in order.',
    'E, F, G. Every letter has a name.',
    'All the way to Z. Letters have names and an order, and the song keeps them in line.',
  ],
};
STORIES['big-and-small-letters'] = {
  about: 'a big G and a small g that were the same letter',
  more: [{ serial: 'S282', after: 0, alt: 'The child tracing the big G with a finger' }, { serial: 'S283', after: 2, alt: 'The child tracing the small g beside it' }],
  title: 'Big and small', art: 'S281', cast: [],
  alt: 'A page with a big letter and a small letter side by side, a child comparing them',
  words: [
    'Big G. Small g. They look different.',
    'But they are the same letter. Both say guh.',
    'Big and small are the same letter, dressed two ways.',
  ],
};
STORIES['letter-sounds'] = {
  about: 'the sound a letter makes when a word starts',
  more: [{ serial: 'S285', after: 0, alt: 'The child pointing at the B card' }, { serial: 'S286', after: 2, alt: 'A ball, a bat and a bear all lined up, each with a B' }],
  title: 'Buh for ball', art: 'S284', cast: [],
  alt: 'A child holding a ball, a big letter B on a card beside it',
  words: [
    'Ball. Buh. The word starts with buh.',
    'B is the letter. Buh is its sound.',
    'Letters make sounds. The first sound of a word is the letter it starts with.',
  ],
};
STORIES['beginning-sounds'] = {
  about: 'a game of what starts with',
  more: [{ serial: 'S288', after: 0, alt: 'The child picking up the mitten' }, { serial: 'S289', after: 2, alt: 'The mitten next to the letter M card' }],
  title: 'What starts with M?', art: 'S287', cast: [],
  alt: 'A child at a table with a mitten, a cup and a hat, a grown-up holding a letter M',
  words: [
    'M. Mmm. What starts with mmm?',
    'Cup? No. Hat? No. Mitten? Mmm-itten. Yes.',
    'Say the name. Hear the first sound. Match it to the letter.',
  ],
};
STORIES['rhymes'] = {
  about: 'a cat, a hat and a bat in a rhyme',
  more: [{ serial: 'S291', after: 0, alt: 'The cat and the hat side by side' }, { serial: 'S292', after: 2, alt: 'The bat swooping over, a word bubble with no words' }],
  title: 'Cat, hat, bat', art: 'S290', cast: [],
  alt: 'A cat wearing a hat with a bat flying above, cartoon and playful',
  words: [
    'Cat. Hat. They end the same. At, at.',
    'Bat. At again. Three words, one ending.',
    'Rhyming words end with the same sound. Say them and hear the match.',
  ],
};
STORIES['tracing-letters'] = {
  about: 'the letter T on the wet window',
  more: [{ serial: 'S294', after: 0, alt: 'The finger halfway down the first stroke' }, { serial: 'S295', after: 2, alt: 'A finished T with a smiley face beside it' }],
  title: 'T on the window', art: 'S293', cast: [],
  alt: 'A child drawing a letter T on a fogged window with one finger',
  words: [
    'Start at the dot. Down.',
    'Lift. Across the top.',
    'A T. Start at the dot, follow the arrow, stay on the line.',
  ],
};
STORIES['tracing-small-letters'] = {
  about: 'a small a that sat low on the line',
  more: [{ serial: 'S297', after: 0, alt: 'The pencil going round the bowl of the small a' }, { serial: 'S298', after: 2, alt: 'A row of small a letters on the line' }],
  title: 'Small letters sit low', art: 'S296', cast: [],
  alt: 'A lined page with a small letter a being traced, a big A above it',
  words: [
    'The big A stood tall. The small a sat low.',
    'Start at the dot. Round, then down.',
    'Small letters sit low. Start at the dot and follow the arrow.',
  ],
};
STORIES['tracing-more-letters'] = {
  about: 'the letter E, one line at a time',
  more: [{ serial: 'S300', after: 0, alt: 'The pencil lifted above the paper between strokes' }, { serial: 'S301', after: 2, alt: 'A finished E, bold and straight' }],
  title: 'One line at a time', art: 'S299', cast: [],
  alt: 'A child tracing a big E on paper, lifting the pencil between lines',
  words: [
    'Down. Lift.',
    'Across the top. Lift. Across the middle. Lift.',
    'Across the bottom. An E. One line at a time. Lift your finger between lines.',
  ],
};
STORIES['syllables'] = {
  about: 'clapping the beats in everyone\'s name',
  more: [{ serial: 'S303', after: 0, alt: 'A child clapping twice with a big smile' }, { serial: 'S304', after: 2, alt: 'Three children holding up one, two and three fingers' }],
  title: 'Clap your name', art: 'S302', cast: [],
  alt: 'A circle of children clapping, a teacher saying a name',
  words: [
    'Ben. Clap. One beat.',
    'Ma-ya. Clap, clap. Two beats.',
    'E-li-jah. Clap, clap, clap. Three. Say the word slowly and clap each beat.',
  ],
};
STORIES['sounding-out'] = {
  about: 'the word on the door, sounded out',
  more: [{ serial: 'S306', after: 0, alt: 'The child pointing at each letter in turn' }, { serial: 'S307', after: 2, alt: 'The door opening to show a cat inside' }],
  title: 'The word on the door', art: 'S305', cast: [],
  alt: 'A child in front of a door with a short word on a sign, reading it slowly',
  words: [
    'C. A. T. Cuh. A. Tuh.',
    'Say them slowly. Then faster. Cuh-a-tuh. Cat.',
    'Say each sound. Then say them fast together. That is reading.',
  ],
};
STORIES['which-way-we-read'] = {
  about: 'a finger that learned which way to go',
  more: [{ serial: 'S309', after: 0, alt: 'The finger sweeping along a line of text' }, { serial: 'S310', after: 2, alt: 'The finger dropping down to the start of the next line' }],
  title: 'Left to right', art: 'S308', cast: [],
  alt: 'A child with a finger on the first word of a page, a book open on a table',
  words: [
    'Start on the left. The finger goes right.',
    'End of the line. Down to the next. Left again.',
    'Start on the left. Go right. Then down to the next line. Every page, the same road.',
  ],
};
STORIES['word-meanings'] = {
  about: 'words on cards and the pictures they belong to',
  more: [{ serial: 'S312', after: 0, alt: 'The dog card placed on the dog picture' }, { serial: 'S313', after: 2, alt: 'All the words matched to their pictures in pairs' }],
  title: 'Word to picture', art: 'S311', cast: [],
  alt: 'A table with word cards and picture cards, a child matching a word to a picture of a dog',
  words: [
    'A card said dog. Where is the dog? There.',
    'A card said sun. Where is the sun? There.',
    'Match the word to the picture. A word means the thing it points to.',
  ],
};
STORIES['trace-slant-letters'] = {
  about: 'the letters with slanted lines, drawn in the sand',
  more: [{ serial: 'S315', after: 0, alt: 'A finished A in the sand next to the V' }, { serial: 'S316', after: 2, alt: 'V, A and N in a row in the sand, the tide coming in' }],
  title: 'V, A and N', art: 'S314', cast: [],
  alt: 'A child drawing a big V in the sand with a stick at the beach',
  words: [
    'Down a slant, up a slant. V.',
    'Up, down, across. A. Down, slant, up. N.',
    'Slanted lines make V, A and N. Start at the dot.',
  ],
};
// Grade 1, in the fewest words that still make a story.
STORIES['teen-numbers'] = {
  about: 'ten eggs in a carton and the ones that would not fit',
  more: [{ serial: 'S318', after: 0, alt: 'A child pointing at the three eggs outside the full carton' }, { serial: 'S319', after: 2, alt: 'Two full cartons and one egg beside them, the child holding up fingers' }],
  title: 'Ten and some more', art: 'S317', cast: [],
  alt: 'An egg carton full of ten eggs with three more eggs beside it on the counter',
  words: [
    'Ten eggs filled the carton. Three more sat beside it.',
    'Ten and three. Thirteen.',
    'Every teen number is ten and some more. Fill the ten, then count the rest.',
  ],
};
STORIES['adding-to-20'] = {
  about: 'two pockets of marbles poured into one jar',
  more: [{ serial: 'S321', after: 0, alt: 'The marbles piled in the jar, the child counting them' }, { serial: 'S322', after: 2, alt: 'A row of fourteen marbles laid out on the table' }],
  title: 'Two pockets', art: 'S320', cast: [],
  alt: 'A child emptying two pockets of marbles into a jar on a table',
  words: [
    'Left pocket: eight marbles. Right pocket: six.',
    'Into the jar together. Eight, then nine, ten, eleven, twelve, thirteen, fourteen.',
    'Fourteen marbles. Adding is putting together and counting on.',
  ],
};
STORIES['subtracting-to-20'] = {
  about: 'fifteen birds on a wire and the ones that flew',
  more: [{ serial: 'S324', after: 0, alt: 'Six birds lifting off the wire together' }, { serial: 'S325', after: 2, alt: 'Nine birds left on the wire, the sun going down' }],
  title: 'Birds on a wire', art: 'S323', cast: [],
  alt: 'Fifteen small birds sitting on a wire between two poles',
  words: [
    'Fifteen birds on the wire.',
    'Six flew away. Count back: fourteen, thirteen, twelve, eleven, ten, nine.',
    'Nine birds left. Taking away is counting back.',
  ],
};
STORIES['tens-and-ones'] = {
  about: 'bundles of ten sticks and the loose ones',
  more: [{ serial: 'S327', after: 0, alt: 'A child tying ten sticks into a bundle' }, { serial: 'S328', after: 2, alt: 'Three bundles in a row with four loose sticks, a card that reads nothing, just the sticks' }],
  title: 'Bundles and loose', art: 'S326', cast: [],
  alt: 'Bundles of ten craft sticks tied with rubber bands, some loose sticks beside them',
  words: [
    'Ten sticks. A rubber band. One bundle.',
    'Three bundles and four loose. Three tens and four ones. Thirty-four.',
    'Every number is bundles and loose sticks: tens and ones.',
  ],
};
STORIES['comparing-to-100'] = {
  about: 'two jars of buttons and the fuller one',
  more: [{ serial: 'S330', after: 0, alt: 'The jars side by side with the fuller one taller' }, { serial: 'S331', after: 2, alt: 'A child pointing at the fuller jar' }],
  title: 'Two jars', art: 'S329', cast: [],
  alt: 'Two jars of buttons on a shelf, one holding more than the other',
  words: [
    'This jar: 62 buttons. That jar: 48.',
    'Look at the tens first. Six tens is more than four tens.',
    '62 is bigger than 48. Compare the tens, then the ones.',
  ],
};
STORIES['writing-numbers'] = {
  about: 'a number 5 written on a birthday card',
  more: [{ serial: 'S333', after: 0, alt: 'The marker halfway through the round belly of the 5' }, { serial: 'S334', after: 2, alt: 'The finished card with a bold 5 and five candles drawn' }],
  title: 'Five on the card', art: 'S332', cast: [],
  alt: 'A child writing a big 5 on a birthday card with a marker',
  words: [
    'Start at the dot. Down. Round.',
    'Lift. Across the top.',
    'A five. Every number starts at its dot. Follow the arrow.',
  ],
};
STORIES['read-the-word'] = {
  about: 'the word on the cereal box',
  more: [{ serial: 'S336', after: 0, alt: 'The child pointing at each letter in turn' }, { serial: 'S337', after: 2, alt: 'The child smiling and pointing at a map picture on the box' }],
  title: 'On the box', art: 'S335', cast: [],
  alt: 'A child at breakfast reading a short word on a cereal box',
  words: [
    'Three letters on the box. M. A. P.',
    'Mmm. Aaa. Puh. Map.',
    'Say each sound. Push them together. That is reading a word.',
  ],
};
STORIES['sh-ch-th'] = {
  about: 'two letters that make one sound',
  more: [{ serial: 'S339', after: 0, alt: 'The shell card with the letters sh beside it' }, { serial: 'S340', after: 2, alt: 'The three cards in a row: shell, chair, thumb' }],
  title: 'Two letters, one sound', art: 'S338', cast: [],
  alt: 'A child at a table with a shell, a chair and a thumb drawn on cards',
  words: [
    'S and H together say shh. Shell.',
    'C and H together say ch. Chair. T and H together say th. Thumb.',
    'Two letters, one sound. Sh, ch, th.',
  ],
};
STORIES['silent-e'] = {
  about: 'the e at the end that changed a word',
  more: [{ serial: 'S342', after: 0, alt: 'The cap picture beside the cape picture' }, { serial: 'S343', after: 2, alt: 'The child covering the e with a finger, then uncovering it' }],
  title: 'The quiet e', art: 'S341', cast: [],
  alt: 'A child with two word cards, cap and cape, a picture of each',
  words: [
    'Cap. A hat. Add an e at the end.',
    'Cape. The a says its name now. The e is silent.',
    'A silent e at the end makes the vowel say its name.',
  ],
};
STORIES['read-the-sentence'] = {
  about: 'a note on the fridge, read word by word',
  more: [{ serial: 'S345', after: 0, alt: 'The child\'s finger under the first word of the note' }, { serial: 'S346', after: 2, alt: 'The dog outside the back door, wagging' }],
  title: 'The note on the fridge', art: 'S344', cast: [],
  alt: 'A child reading a short note stuck on a fridge with a magnet',
  words: [
    'The. Dog. Is. Out.',
    'Start at the capital letter. Stop at the period.',
    'The dog is out. Four words, one sentence, one idea.',
  ],
};
STORIES['what-happened'] = {
  about: 'a kite in a tree, retold in order',
  more: [{ serial: 'S348', after: 0, alt: 'The kite stuck in the tree' }, { serial: 'S349', after: 2, alt: 'Dad on a ladder handing the kite back' }],
  title: 'What happened first', art: 'S347', cast: [],
  alt: 'A child telling a story with three pictures on a table: a kite, a tree, a rescue',
  words: [
    'First, the kite went up. Then it caught in a tree.',
    'Last, Dad got it down.',
    'First, then, last. That is what happened, in order.',
  ],
};
STORIES['tracing-more-small-letters'] = {
  about: 'the letters with tails and bumps',
  more: [{ serial: 'S351', after: 0, alt: 'The pencil drawing the tail of a g below the line' }, { serial: 'S352', after: 2, alt: 'A row of finished small letters on the line' }],
  title: 'Tails and bumps', art: 'S350', cast: [],
  alt: 'A lined page with small letters being traced, some with tails below the line',
  words: [
    'A g has a tail that hangs below the line.',
    'An m has two bumps. A z zigzags.',
    'Tall sticks, bumps and zigzags. Start at the dot and follow the arrow.',
  ],
};
STORIES['trace-small-letters-3'] = {
  about: 'i, t and k, one line down then the rest',
  more: [{ serial: 'S354', after: 0, alt: 'The dot going on top of the i' }, { serial: 'S355', after: 2, alt: 'i, t and k finished in a row' }],
  title: 'One line down', art: 'S353', cast: [],
  alt: 'A child tracing the letter k on paper, the first stroke done',
  words: [
    'One line down. Then a dot. An i.',
    'One line down. Then across. A t.',
    'One line down, then two slants. A k. One line down, then the rest.',
  ],
};
STORIES['trace-small-letters-4'] = {
  about: 'c, v and x drawn in the frost',
  more: [{ serial: 'S357', after: 0, alt: 'The v drawn beside the c' }, { serial: 'S358', after: 2, alt: 'c, v and x on the frosty glass' }],
  title: 'Curve, point, cross', art: 'S356', cast: [],
  alt: 'A child drawing letters on a frosty car window',
  words: [
    'A curve. Round like a cup on its side. C.',
    'Down to a point and up. V.',
    'Two lines that cross. X. A curve, a point, a cross.',
  ],
};
STORIES['trace-small-letters-5'] = {
  about: 'n, u and r with their little arches',
  more: [{ serial: 'S360', after: 0, alt: 'The finger making the arch of the n' }, { serial: 'S361', after: 2, alt: 'n, u and r drawn in the sand tray' }],
  title: 'Little arches', art: 'S359', cast: [],
  alt: 'A child tracing the letter n with a finger on a sandy tray',
  words: [
    'A line down, then up and over. An arch. N.',
    'Down, round the bottom, up. U.',
    'Down, then a little hook. R. A line, then a little arch.',
  ],
};
STORIES['sun-moon-patterns'] = {
  about: 'a week of watching the sky',
  more: [{ serial: 'S363', after: 0, alt: 'The sun rising over the same roofs in the morning' }, { serial: 'S364', after: 2, alt: 'A row of moon shapes drawn in a notebook, crescent to full' }],
  title: 'The sky keeps time', art: 'S362', cast: [],
  alt: 'A child at a window at dusk, the moon rising over the roofs',
  words: [
    'The sun came up in the east. It went down in the west. Again the next day.',
    'The moon grew a little each night. Then it shrank.',
    'The sun and moon follow patterns that repeat. Watch a week and you will see.',
  ],
};
STORIES['water-changes'] = {
  about: 'an ice cube that went away and came back',
  more: [{ serial: 'S366', after: 0, alt: 'The glass with only water in it, a puddle where the cube was' }, { serial: 'S367', after: 2, alt: 'The child holding a new ice cube from the freezer tray' }],
  title: 'The ice cube', art: 'S365', cast: [],
  alt: 'An ice cube in a glass on a sunny table, a child watching it',
  words: [
    'The ice cube was hard. The sun warmed it. It melted into water.',
    'The water went into the freezer. It got cold. It turned back to ice.',
    'Cold makes ice. Heat melts it back to water. The same water, twice.',
  ],
};
STORIES['animal-needs'] = {
  about: 'a new puppy and the three things it needed',
  more: [{ serial: 'S369', after: 0, alt: 'The puppy drinking from the water bowl' }, { serial: 'S370', after: 2, alt: 'The puppy curled up asleep in its bed' }],
  title: 'What the puppy needed', art: 'S368', cast: [],
  alt: 'A puppy with a food bowl, a water bowl and a soft bed',
  words: [
    'The puppy was hungry. Food.',
    'The puppy was thirsty. Water. The puppy was tired. A home to sleep in.',
    'Animals need food, water and a home. So does the puppy.',
  ],
};
STORIES['leaders-near-and-far'] = {
  about: 'three leaders, three sizes of place',
  more: [{ serial: 'S372', after: 0, alt: 'The mayor cutting a ribbon at a new park' }, { serial: 'S373', after: 2, alt: 'The state capitol with its dome' }],
  title: 'Three leaders', art: 'S371', cast: [],
  alt: 'A child looking at three framed photos: a mayor at city hall, a governor at the capitol, a president at the White House',
  words: [
    'The mayor leads the city.',
    'The governor leads the state.',
    'The president leads the country. Mayor, governor, president: near to far.',
  ],
};
STORIES['goods-and-services'] = {
  about: 'a haircut and a hat, and which one you could hold',
  more: [{ serial: 'S375', after: 0, alt: 'The child holding up the hat' }, { serial: 'S376', after: 2, alt: 'The barber holding up a mirror to show the haircut' }],
  title: 'A haircut and a hat', art: 'S374', cast: [],
  alt: 'A child at a barbershop holding a new hat while getting a haircut',
  words: [
    'The hat was a thing. You could hold it. A good.',
    'The haircut was work done for you. You could not hold it. A service.',
    'Goods are things. Services are work done for you. Both cost money.',
  ],
};
STORIES['maps-of-my-world'] = {
  about: 'a map of the yard, drawn from above',
  more: [{ serial: 'S378', after: 0, alt: 'The finished map with a compass rose in the corner' }, { serial: 'S379', after: 2, alt: 'The child pointing east toward the rising sun' }],
  title: 'The yard from above', art: 'S377', cast: [],
  alt: 'A child drawing a map of the backyard on paper, the yard visible through the window',
  words: [
    'The sun rose over the fence. That way is east.',
    'North at the top. The tree to the west. The gate to the south.',
    'North, south, east, west. A map is the yard seen from above.',
  ],
};
STORIES['signs-around-town'] = {
  about: 'a red sign that everyone obeyed',
  more: [{ serial: 'S381', after: 0, alt: 'The child pointing at a green street sign' }, { serial: 'S382', after: 2, alt: 'A blue hospital sign with an H' }],
  title: 'The red sign', art: 'S380', cast: [],
  alt: 'A child at a corner looking up at a red stop sign, cars stopping',
  words: [
    'A red sign with eight sides. STOP. Every car stopped.',
    'A green sign said the street name. A blue sign showed the hospital.',
    'Signs tell everyone the same thing at once. Read the shape and the color.',
  ],
};
STORIES['symbols-of-our-country'] = {
  about: 'a bell, a statue and a fort',
  more: [{ serial: 'S384', after: 0, alt: 'The Statue of Liberty with her torch up' }, { serial: 'S385', after: 2, alt: 'The front of the Alamo under a blue sky' }],
  title: 'Bell, statue, fort', art: 'S383', cast: [],
  alt: 'A child looking at pictures of the Liberty Bell, the Statue of Liberty and the Alamo',
  words: [
    'A bell with a crack. The Liberty Bell.',
    'A green statue holding a torch. The Statue of Liberty.',
    'An old stone fort in Texas. The Alamo. Symbols stand for the country and its story.',
  ],
};
// Grade 2, in the fewest words that still make a story.
STORIES['hundreds-tens-ones'] = {
  about: 'a jar of 342 pennies, counted in stacks',
  more: [{ serial: 'S387', after: 0, alt: 'Ten stacks of ten pushed together into one big square of a hundred' }, { serial: 'S388', after: 2, alt: 'Three hundred-squares, four ten-stacks and two pennies laid out in order' }],
  title: 'Stacks of pennies', art: 'S386', cast: [],
  alt: 'A child at a table with stacks of pennies in rows, some stacks of ten, and a pile of loose ones',
  words: [
    'Pennies everywhere. Stack ten. Stack ten more. Ten stacks make a hundred.',
    'Three hundreds. Four stacks of ten. Two loose. 342.',
    'To compare two jars, look at the hundreds first, then the tens, then the ones.',
  ],
};
STORIES['adding-with-regrouping'] = {
  about: '27 stickers and 15 more, bundled by tens',
  more: [{ serial: 'S390', after: 0, alt: 'Twelve loose stickers being pressed into a new strip of ten with two left over' }, { serial: 'S391', after: 2, alt: 'Four strips of ten and two loose stickers in a row' }],
  title: 'Bundles of stickers', art: 'S389', cast: [],
  alt: 'A child with sheets of stickers in strips of ten and a few loose ones',
  words: [
    '27 stickers: two strips of ten and seven loose. 15 more: one strip and five loose.',
    'Seven and five loose is twelve. That is a new strip of ten and two left.',
    'Two strips, one strip, and the new strip: four. Four tens and two. 42. Carry the ten.',
  ],
};
STORIES['subtracting-with-regrouping'] = {
  about: '42 beads and the 18 that went on a necklace',
  more: [{ serial: 'S393', after: 0, alt: 'One string of ten snipped open, beads spilling loose' }, { serial: 'S394', after: 2, alt: 'Two strings of ten and four loose beads beside the finished necklace' }],
  title: 'Borrow a ten', art: 'S392', cast: [],
  alt: 'A child with strings of ten beads and loose beads, threading a necklace',
  words: [
    '42 beads: four strings of ten, two loose. Take 18 for the necklace.',
    'Eight loose from two? Cannot. Cut open a string. Now three strings and twelve loose.',
    'Twelve take eight leaves four. Three strings take one leaves two. 24 beads left. Borrow a ten when you must.',
  ],
};
STORIES['money'] = {
  about: 'the coins in a pocket, counted like a cashier',
  more: [{ serial: 'S396', after: 0, alt: 'The child pointing at the quarter first' }, { serial: 'S397', after: 2, alt: 'All the coins in a line from biggest to smallest' }],
  title: 'Counting the change', art: 'S395', cast: [],
  alt: 'A child laying coins on a counter: a quarter, two dimes, a nickel and pennies',
  words: [
    'A quarter. Twenty-five. A dime. Thirty-five. Another dime. Forty-five.',
    'A nickel. Fifty. Three pennies. Fifty-one, fifty-two, fifty-three.',
    'Start with the biggest coin and count on. Fifty-three cents.',
  ],
};
STORIES['rows-and-columns'] = {
  about: 'eggs in a carton, counted the fast way',
  more: [{ serial: 'S399', after: 0, alt: 'The child tapping along the top row of six' }, { serial: 'S400', after: 2, alt: 'A tray of cupcakes in three rows of four, the child grinning' }],
  title: 'Rows of eggs', art: 'S398', cast: [],
  alt: 'An open egg carton with two rows of six, a child counting',
  words: [
    'Two rows. Six in each row.',
    'Six and six. Twelve. No need to count every egg.',
    'Count the rows, count how many in each row, and add that number once per row.',
  ],
};
STORIES['vowel-teams'] = {
  about: 'two vowels that went for a walk',
  more: [{ serial: 'S402', after: 0, alt: 'The word rain on a weather chart, the a speaking and the i silent' }, { serial: 'S403', after: 2, alt: 'A row of vowel-team words on cards: boat, rain, tree, pie' }],
  title: 'Two vowels walking', art: 'S401', cast: [],
  alt: 'A child reading the word boat on a sign by a lake',
  words: [
    'B, o, a, t. Two vowels together: o and a.',
    'The first one talks. The o says its name. The a stays quiet. Boat.',
    'Two vowels together often make one long sound, and the first one does the talking.',
  ],
};
STORIES['two-syllable-words'] = {
  about: 'a long word clapped into two parts',
  more: [{ serial: 'S405', after: 0, alt: 'The card cut in two: rab and bit' }, { serial: 'S406', after: 2, alt: 'The two halves pushed back together, the child reading the whole word' }],
  title: 'Clap it in two', art: 'S404', cast: [],
  alt: 'A child clapping while reading the word rabbit on a card',
  words: [
    'Rabbit. Clap, clap. Two parts.',
    'Rab. Bit. Read each part, then push them together.',
    'Long words are short parts joined together. Split between the middle letters.',
  ],
};
STORIES['reading-for-meaning'] = {
  about: 'reading like a detective, with four questions',
  more: [{ serial: 'S408', after: 0, alt: 'A notebook page with four short answers' }, { serial: 'S409', after: 2, alt: 'The dog chasing a seagull down the beach, the girl running after' }],
  title: 'The four questions', art: 'S407', cast: [],
  alt: 'A child with a magnifying glass over a storybook, notes beside it',
  words: [
    'Who is in the story? A girl and her dog. Where? At the beach.',
    'What happened? The dog ran off. Why? It saw a seagull.',
    'Who, where, what, why. Answer those four and you understood the story.',
  ],
};
STORIES['word-meaning-from-context'] = {
  about: 'a new word figured out from its neighbors',
  more: [{ serial: 'S411', after: 0, alt: 'A very big dog stuck in a doorway' }, { serial: 'S412', after: 2, alt: 'The child writing the word enormous under a drawing of the dog' }],
  title: 'The word around it', art: 'S410', cast: [],
  alt: 'A child covering a word in a book with a thumb and reading the rest of the sentence',
  words: [
    'A new word. Do not stop. Read the sentence around it.',
    'The enormous dog could not fit through the door. Enormous must mean very big.',
    'The words around a new word tell you what it means. Ask what would fit.',
  ],
};
STORIES['complete-sentences'] = {
  about: 'a note that was not a sentence yet',
  more: [{ serial: 'S414', after: 0, alt: 'The note with the crossed-out first try and the fixed sentence below' }, { serial: 'S415', after: 2, alt: 'The dog running fast across the yard' }],
  title: 'Who and what', art: 'S413', cast: [],
  alt: 'A child writing a note on paper, a first try crossed out',
  words: [
    'Ran fast. Who ran? It is not a sentence yet.',
    'The dog ran fast. A who and a what. Now it is a sentence.',
    'A capital letter at the start. A period at the end. A who and a what in the middle.',
  ],
};
STORIES['describing-sentences'] = {
  about: 'the same sentence, dressed up',
  more: [{ serial: 'S417', after: 0, alt: 'A fluffy cat sitting on a sunny step' }, { serial: 'S418', after: 2, alt: 'The whiteboard with the plain sentence and the dressed-up one' }],
  title: 'Dressing up a sentence', art: 'S416', cast: [],
  alt: 'A child adding words to a sentence on a whiteboard',
  words: [
    'The cat sat. True, but plain.',
    'The fluffy cat sat quietly on the warm step. Now you can see it.',
    'Add words that say what it was like and how it happened.',
  ],
};
STORIES['tell-a-story-2'] = {
  about: 'the lost tooth, told in order',
  more: [{ serial: 'S420', after: 0, alt: 'A wobbly tooth being pushed with a tongue' }, { serial: 'S421', after: 2, alt: 'A small tooth under a pillow, a child asleep' }],
  title: 'The tooth story', art: 'S419', cast: [],
  alt: 'A child telling a story to a friend, three pictures on the table in a row',
  words: [
    'First, my tooth wobbled. Next, it fell out at lunch.',
    'Last, I put it under my pillow.',
    'First, next, last. Tell what happened in order and everyone can follow.',
  ],
};
STORIES['then-and-now'] = {
  about: 'grandma\'s school and mine',
  more: [{ serial: 'S423', after: 0, alt: 'The old one-room schoolhouse with a bell' }, { serial: 'S424', after: 2, alt: 'The new school with a big screen in the classroom' }],
  title: 'Then and now', art: 'S422', cast: [],
  alt: 'A child and a grandmother looking at an old black-and-white school photo beside a new one',
  words: [
    'Then: a chalkboard, a bell on a rope, one room.',
    'Now: a screen, a buzzer, many rooms.',
    'Then is the past. Now is today. A timeline puts them in order.',
  ],
};
STORIES['good-citizens'] = {
  about: 'a found wallet and what a good citizen did',
  more: [{ serial: 'S426', after: 0, alt: 'The wallet being handed to a smiling adult at a desk' }, { serial: 'S427', after: 2, alt: 'A class raising hands to vote' }],
  title: 'The found wallet', art: 'S425', cast: [],
  alt: 'A child holding up a wallet found on the sidewalk, an adult nearby',
  words: [
    'A wallet on the ground. Money inside.',
    'Honesty: give it back. Responsibility: take it to the office. Respect: say nothing unkind about who dropped it.',
    'Honesty, responsibility, respect. That is a good citizen. And when we vote, more wins.',
  ],
};
STORIES['producers-and-consumers'] = {
  about: 'the lemonade stand and the lemons it needed',
  more: [{ serial: 'S429', after: 0, alt: 'A bag of lemons and sugar on the counter' }, { serial: 'S430', after: 2, alt: 'A jar of coins and bills, the children counting' }],
  title: 'The lemonade stand', art: 'S428', cast: [],
  alt: 'Two children at a lemonade stand, a customer holding coins',
  words: [
    'We made lemonade. Producers. Neighbors bought it. Consumers.',
    'We spent six dollars on lemons and sugar. We took in fifteen.',
    'Producers make. Consumers buy. Money left is what you had minus what you spent: nine dollars.',
  ],
};
STORIES['maps-of-our-town'] = {
  about: 'the walk to the library, on a map',
  more: [{ serial: 'S432', after: 0, alt: 'The map key with small pictures: library, school, park' }, { serial: 'S433', after: 2, alt: 'The child arriving at the library steps' }],
  title: 'Three blocks north', art: 'S431', cast: [],
  alt: 'A child tracing a route on a town map with a finger, a key in the corner',
  words: [
    'A little book on the map. The key says that means library.',
    'From home, three blocks north, then one block east.',
    'The key tells you what the pictures mean. Count the blocks. Follow the map.',
  ],
};
STORIES['services-in-our-town'] = {
  about: 'a day when the town helped',
  more: [{ serial: 'S435', after: 0, alt: 'A firefighter with a hose, the child watching' }, { serial: 'S436', after: 2, alt: 'The library steps with a stack of borrowed books' }],
  title: 'The town helps', art: 'S434', cast: [],
  alt: 'A fire truck, a library, a school and a park on one street, a child waving',
  words: [
    'A fire on the corner. The fire truck came. The town sent it.',
    'A book to borrow. The library had it. A field to run in. The park was open.',
    'Police, fire, library, school, park. The town provides them for everyone.',
  ],
};
STORIES['saving-for-a-goal'] = {
  about: 'a jar and a twelve-dollar kite',
  more: [{ serial: 'S438', after: 0, alt: 'The jar half full with a mark for each week' }, { serial: 'S439', after: 2, alt: 'The child flying the kite in a field' }],
  title: 'The kite jar', art: 'S437', cast: [],
  alt: 'A child dropping coins into a jar with a drawing of a kite taped to it',
  words: [
    'The kite cost twelve dollars. The jar had nothing.',
    'Two dollars a week. One, two, three, four, five, six weeks.',
    'Twelve divided by two is six. Save a little each week. Weeks to save is the price divided by the weekly saving.',
  ],
};
STORIES['hard-or-soft'] = {
  about: 'four things on a table and how they felt',
  more: [{ serial: 'S441', after: 0, alt: 'The child squeezing the wet sponge, water dripping' }, { serial: 'S442', after: 2, alt: 'The four things sorted into hard and soft, wet and dry' }],
  title: 'Hard, soft, wet, dry', art: 'S440', cast: [],
  alt: 'A child touching four things on a table: a rock, a pillow, a wet sponge and a dry towel',
  words: [
    'The rock: hard. The pillow: soft.',
    'The sponge: wet. The towel: dry.',
    'Things have properties: hard or soft, wet or dry. Touch, and you know.',
  ],
};
// Grade 3, in the fewest words that still make a story.
STORIES['equivalent-fractions'] = {
  about: 'two pizzas, one cut in halves and one in quarters',
  more: [{ serial: 'S444', after: 0, alt: 'A half slice laid over two quarter slices, matching exactly' }, { serial: 'S445', after: 2, alt: 'The child writing 1/2 = 2/4 on a napkin' }],
  title: 'Two pizzas', art: 'S443', cast: [],
  alt: 'Two pizzas on a counter, one cut into two, one cut into four, a child comparing slices',
  words: [
    'One pizza cut in two. One cut in four. Same size pizzas.',
    'A half. Two quarters. Put them side by side. The same amount.',
    'One half equals two quarters. Multiply the top and the bottom by the same number and the fraction only changes its clothes.',
  ],
};
STORIES['comparing-fractions'] = {
  about: 'a third of a cake and an eighth of a cake',
  more: [{ serial: 'S447', after: 0, alt: 'The big third slice next to the thin eighth slice' }, { serial: 'S448', after: 2, alt: 'The child happily holding the third' }],
  title: 'Which slice is bigger?', art: 'S446', cast: [],
  alt: 'Two cakes, one cut into three slices and one into eight, a child choosing',
  words: [
    'A third of the cake, or an eighth? Eight is bigger than three. But look at the slices.',
    'The third is a big slice. The eighth is thin. More cuts, smaller pieces.',
    'Same top: the smaller bottom wins. One third is more cake than one eighth.',
  ],
};
STORIES['fractions-on-a-line'] = {
  about: 'a ruler with a fraction on it',
  more: [{ serial: 'S450', after: 0, alt: 'A close look at the four quarter marks in one inch' }, { serial: 'S451', after: 2, alt: 'The child measuring a leaf: three quarters of an inch' }],
  title: 'Marks on the ruler', art: 'S449', cast: [],
  alt: 'A child holding a ruler, finger on the three-quarter mark of the first inch',
  words: [
    'Zero to one inch. Four little steps between.',
    'One step: one quarter. Two: two quarters. Three: three quarters.',
    'Cut 0 to 1 into equal steps. The bottom number is how many steps make a whole; the top is how many you walk.',
  ],
};
STORIES['building-fractions'] = {
  about: 'five blocks that made a whole and the three that made a fraction',
  more: [{ serial: 'S453', after: 0, alt: 'Three blocks forward and two behind' }, { serial: 'S454', after: 2, alt: 'All five blocks back in a row, one whole' }],
  title: 'Blocks of a fifth', art: 'S452', cast: [],
  alt: 'Five equal blocks in a row on a table, three pulled forward',
  words: [
    'Five blocks make one whole. Each block is one fifth.',
    'Pull three forward. One fifth, one fifth, one fifth. Three fifths.',
    'A fraction is built from unit pieces. Take one away: two fifths. Add two: five fifths, a whole.',
  ],
};
STORIES['prefixes-and-suffixes'] = {
  about: 'the word happy and its costumes',
  more: [{ serial: 'S456', after: 0, alt: 'The un card snapped onto the front of happy' }, { serial: 'S457', after: 2, alt: 'The ly card snapped onto the end' }],
  title: 'Happy, unhappy, happily', art: 'S455', cast: [],
  alt: 'A child with word cards: happy, un, ly, moving them around',
  words: [
    'Happy. Put un in front. Unhappy. The front changed the meaning.',
    'Happy. Put ly at the end. Happily. The end changed the job.',
    'A prefix changes the front. A suffix changes the end. Take them off and the base word is still there.',
  ],
};
STORIES['fact-or-opinion'] = {
  about: 'the dog show and two kinds of sentences',
  more: [{ serial: 'S459', after: 0, alt: 'The dog standing on a scale' }, { serial: 'S460', after: 2, alt: 'Two children arguing about which dog is best, both smiling' }],
  title: 'Check it or argue it', art: 'S458', cast: [],
  alt: 'A child at a dog show with a notebook, writing two sentences',
  words: [
    'The dog weighs thirty pounds. You could put it on a scale. A fact.',
    'That dog is the best. You could argue all day. An opinion.',
    'A fact can be checked. An opinion is what someone thinks. Best, should and I think are opinion flags.',
  ],
};
STORIES['sequence-and-cause'] = {
  about: 'a muddy floor and the reason for it',
  more: [{ serial: 'S462', after: 0, alt: 'The wet dog shaking by the door' }, { serial: 'S463', after: 2, alt: 'The child mopping, the dog watching' }],
  title: 'Because and so', art: 'S461', cast: [],
  alt: 'A child looking at muddy footprints on a kitchen floor, a dog by the door',
  words: [
    'The floor was muddy because the dog came in from the rain.',
    'The dog was wet, so the floor got muddy. Same story, two words.',
    'Because points back to the reason. So points forward to the result. Then just says what came next.',
  ],
};
STORIES['states-of-matter'] = {
  about: 'an ice cube, a glass of water and a kettle',
  more: [{ serial: 'S465', after: 0, alt: 'The ice cube sitting square on the counter' }, { serial: 'S466', after: 2, alt: 'Steam rising from the kettle and spreading' }],
  title: 'Three states in the kitchen', art: 'S464', cast: [],
  alt: 'A child at a kitchen counter with an ice cube, a glass of water and a steaming kettle',
  words: [
    'The ice cube kept its shape. A solid.',
    'The water took the shape of the glass. A liquid. The steam spread through the whole room. A gas.',
    'A solid keeps its shape, a liquid takes the shape of its container, a gas fills whatever holds it.',
  ],
};
STORIES['forces-and-motion'] = {
  about: 'a wagon on a hill and the pushes that moved it',
  more: [{ serial: 'S468', after: 0, alt: 'The wagon slowing in the thick grass' }, { serial: 'S469', after: 2, alt: 'The wagon rolling back down the hill on its own' }],
  title: 'Pushes and pulls', art: 'S467', cast: [],
  alt: 'A child pulling a wagon up a grassy hill',
  words: [
    'The wagon would not move by itself. A pull. It rolled.',
    'On the grass it slowed. Friction. At the top, let go, and gravity pulled it back down.',
    'A force is a push or a pull. Friction slows moving things. Gravity pulls things down.',
  ],
};
STORIES['life-cycles'] = {
  about: 'a jar of pond water and what the eggs became',
  more: [{ serial: 'S471', after: 0, alt: 'Tadpoles with tiny legs in the jar' }, { serial: 'S472', after: 2, alt: 'A small frog on the rim of the jar, ready to leave' }],
  title: 'The jar of eggs', art: 'S470', cast: [],
  alt: 'A child looking into a jar of pond water with a cluster of frog eggs',
  words: [
    'Eggs in the jar. A week later, tadpoles.',
    'Tadpoles grew legs. Then they were small frogs.',
    'The frogs went back to the pond and laid eggs. A life cycle is a circle of stages, and it comes round again.',
  ],
};
STORIES['paragraph-shape'] = {
  about: 'a paragraph about a dog, built one sentence at a time',
  more: [{ serial: 'S474', after: 0, alt: 'The dog carrying a newspaper' }, { serial: 'S475', after: 2, alt: 'The finished paragraph with the first sentence underlined' }],
  title: 'The shape of it', art: 'S473', cast: [],
  alt: 'A child writing a paragraph on lined paper, the first sentence underlined',
  words: [
    'My dog is the best helper. That is the idea. First sentence.',
    'He brings the paper. He finds my shoes. He waits at the door. Details.',
    'One idea in the first sentence. Details in the sentences after it. A new idea means a new paragraph.',
  ],
};
STORIES['explain-how'] = {
  about: 'how to make a paper boat, written for a friend',
  more: [{ serial: 'S477', after: 0, alt: 'The half-folded paper with the corners turned down' }, { serial: 'S478', after: 2, alt: 'The finished paper boat floating in a sink' }],
  title: 'The paper boat', art: 'S476', cast: [],
  alt: 'A child folding a paper boat while writing steps on a card',
  words: [
    'What you need: one sheet of paper. That comes first.',
    'Fold in half. Fold the corners down. Fold the flaps up. Open it out. In order, or it will not float.',
    'Say what is needed, then give the steps in order. If a friend can follow it and end up with a boat, you explained it.',
  ],
};
STORIES['give-a-reason'] = {
  about: 'why the class should get a pet, said properly',
  more: [{ serial: 'S480', after: 0, alt: 'A fish in a bowl on a classroom shelf' }, { serial: 'S481', after: 2, alt: 'The class raising hands to agree' }],
  title: 'I think, because', art: 'S479', cast: [],
  alt: 'A child standing at the front of a class holding a card that says nothing, gesturing',
  words: [
    'I think our class should get a fish.',
    'Because we would learn to care for it. Because it is quiet. Two reasons.',
    'Say what you think, then say because. Two reasons, then say it again a new way: a fish would be a good classmate.',
  ],
};
STORIES['equal-groups'] = {
  about: 'three bags of apples, counted the fast way',
  more: [{ serial: 'S483', after: 0, alt: 'The apples tipped out into three rows of five' }, { serial: 'S484', after: 2, alt: 'The child writing 3 × 5 = 15 on the bag' }],
  title: 'Three bags', art: 'S482', cast: [],
  alt: 'A child with three paper bags of apples, five in each, on a table',
  words: [
    'Three bags. Five apples in each.',
    'Five, ten, fifteen. Three groups of five.',
    'Multiplying is adding the same number again and again. Groups times how many in each group: 3 × 5 = 15.',
  ],
};
STORIES['times-tables'] = {
  about: 'the seven times table and the trick that saved it',
  more: [{ serial: 'S486', after: 0, alt: 'The dot rectangle turned on its side' }, { serial: 'S487', after: 2, alt: 'The child covering half the times-table grid with a hand' }],
  title: 'Seven times eight', art: 'S485', cast: [],
  alt: 'A child at a table with a grid of dots, six across and seven down',
  words: [
    'Six times seven. A rectangle, six wide, seven tall. Forty-two dots.',
    'Seven times six is the same rectangle turned. Forty-two again.',
    'The facts to 10 × 10 are the tools every bigger multiplication uses. Learn half the table and you have the whole.',
  ],
};
STORIES['sharing-equally'] = {
  about: 'twelve cookies and four friends',
  more: [{ serial: 'S489', after: 0, alt: 'Four plates with three cookies each' }, { serial: 'S490', after: 2, alt: 'Everyone eating, the empty box in the middle' }],
  title: 'Deal them out', art: 'S488', cast: [],
  alt: 'Four children at a table, one dealing cookies one at a time onto four plates',
  words: [
    'Twelve cookies. Four friends. One each. Round again. Round again.',
    'Three on every plate. Twelve divided by four is three.',
    'Dividing is sharing out equally. It undoes multiplying: three cookies times four plates is twelve.',
  ],
};
STORIES['add-subtract-1000'] = {
  about: '256 marbles and 378 more in one jar',
  more: [{ serial: 'S492', after: 0, alt: 'The column sum on paper with the carried digits' }, { serial: 'S493', after: 2, alt: 'The full jar of marbles' }],
  title: 'Column by column', art: 'S491', cast: [],
  alt: 'A child pouring two bags of marbles into a jar, a tally on paper beside',
  words: [
    'Ones first: six and eight, fourteen. Write the 4, carry the ten.',
    'Tens: five and seven and the carried one, thirteen. Write the 3, carry the hundred. Hundreds: two and three and one, six.',
    '634 marbles. Ones, then tens, then hundreds. Carry when a column makes ten or more.',
  ],
};
STORIES['elements-of-art'] = {
  about: 'a cup drawn seven ways',
  more: [{ serial: 'S495', after: 0, alt: 'A close look at the shading on the cup' }, { serial: 'S496', after: 2, alt: 'The finished drawing beside the real cup' }],
  title: 'Seven ingredients', art: 'S494', cast: [],
  alt: 'A child drawing a cup, the drawing showing an outline, shading and a shadow',
  words: [
    'Line: the edge of the cup. Shape: the outline. Form: its roundness.',
    'Color: blue. Value: the dark side. Texture: the smooth glaze. Space: where it sits on the table.',
    'Seven ingredients in every picture: line, shape, form, color, texture, space and value.',
  ],
};
STORIES['the-color-wheel'] = {
  about: 'three jars of paint and the colors they made',
  more: [{ serial: 'S498', after: 0, alt: 'Three puddles of mixed paint on the plate' }, { serial: 'S499', after: 2, alt: 'A painted color wheel drying on the table' }],
  title: 'Three jars', art: 'S497', cast: [],
  alt: 'A child at a table with jars of red, yellow and blue paint, mixing on a plate',
  words: [
    'Red, yellow, blue. You cannot mix them from anything. Primary.',
    'Red and yellow made orange. Yellow and blue made green. Blue and red made purple. Secondary.',
    'Colors across the wheel from each other make each other look brighter. Red beside green, blue beside orange.',
  ],
};
STORIES['looking-at-a-picture'] = {
  about: 'a painting looked at four times',
  more: [{ serial: 'S501', after: 0, alt: 'A close look at the bright sail against the dark sky' }, { serial: 'S502', after: 2, alt: 'The child and grown-up talking in front of the painting' }],
  title: 'Four looks', art: 'S500', cast: [],
  alt: 'A child in front of a painting in a gallery, a grown-up beside them',
  words: [
    'First look: what is in it? A boat, a storm, two people.',
    'Second: how is it arranged? Dark sky, bright sail in the middle. Third: what might it mean? Hope in a storm.',
    'Describe, analyze, interpret, and only then judge. Most people start at judging. Slow down.',
  ],
};
STORIES['three-levels-of-government'] = {
  about: 'a pothole, a highway and a stamp',
  more: [{ serial: 'S504', after: 0, alt: 'A city crew filling the pothole' }, { serial: 'S505', after: 2, alt: 'A letter with a stamp dropped in the mailbox' }],
  title: 'Three levels', art: 'S503', cast: [],
  alt: 'A child on a street with a pothole, a highway sign in the distance and a mailbox',
  words: [
    'The pothole? The city fixes it. A mayor leads the city.',
    'The highway? The state builds it. A governor leads Texas.',
    'The stamp on the letter? The country prints it. A president leads the United States. Three levels, three jobs.',
  ],
};
STORIES['how-we-decide'] = {
  about: 'a classroom rule and a real law',
  more: [{ serial: 'S507', after: 0, alt: 'The rules poster with a few pictures' }, { serial: 'S508', after: 2, alt: 'A red light with cars stopped' }],
  title: 'Rule or law?', art: 'S506', cast: [],
  alt: 'A child looking at a classroom rules poster, a police officer outside the window',
  words: [
    'No running in the hall. A rule. For our school.',
    'Stop at a red light. A law. For everyone.',
    'A rule is for a small group. A law is for everyone. Congress makes laws, and everyone must follow them.',
  ],
};
STORIES['earning-and-choosing'] = {
  about: 'eleven dollars and two things wanted',
  more: [{ serial: 'S510', after: 0, alt: 'The child counting the bills' }, { serial: 'S511', after: 2, alt: 'The child walking out with the book, looking back at the ball' }],
  title: 'The eleven dollars', art: 'S509', cast: [],
  alt: 'A child at a store counter with eleven dollars, a book and a ball on the counter',
  words: [
    'Six dollars from chores. Five from a gift. Eleven.',
    'The book costs eight. The ball costs seven. Not enough for both.',
    'Scarcity means there is never enough for everything. The book came home; the ball was the cost of choosing it.',
  ],
};
// Grades 4 and 5, in the fewest words that still make a story.
STORIES['summarizing'] = {
  about: 'a long movie told in one minute',
  more: [{ serial: 'S513', after: 0, alt: 'A drawing of the three big events in three boxes' }, { serial: 'S514', after: 2, alt: 'The friend nodding, the clock showing one minute gone' }],
  title: 'One minute', art: 'S512', cast: [],
  alt: 'A child telling a friend about a movie, gesturing, a clock on the wall',
  words: [
    'The movie was two hours. My friend had one minute.',
    'The hero lost the map, crossed the desert, found the city. That is the story.',
    'Keep the big events. Drop the small details. Stay in order, and it still makes sense.',
  ],
};
STORIES['making-inferences'] = {
  about: 'muddy boots and a sigh',
  more: [{ serial: 'S516', after: 0, alt: 'The child mid-jump over a puddle' }, { serial: 'S517', after: 2, alt: 'The boots drying by the door' }],
  title: 'The muddy boots', art: 'S515', cast: [],
  alt: 'A child in muddy boots at the door, a parent sighing, a puddle outside',
  words: [
    'The boots were muddy. Mom sighed. Nobody said what happened.',
    'But I knew: puddle jumping.',
    'An inference is something the text shows without saying. A guess with a clue behind it.',
  ],
};
STORIES['similes-and-metaphors'] = {
  about: 'a brave friend described two ways',
  more: [{ serial: 'S519', after: 0, alt: 'The child roaring playfully' }, { serial: 'S520', after: 2, alt: 'The two sentences written on a board' }],
  title: 'Brave as a lion', art: 'S518', cast: [],
  alt: 'Two children, one standing tall, a lion drawn on the wall behind',
  words: [
    'She is as brave as a lion. That is a simile. It keeps the word as.',
    'She is a lion. That is a metaphor. It says it straight.',
    'Like or as makes a simile. Saying one thing is another makes a metaphor.',
  ],
};
STORIES['text-structure'] = {
  about: 'signal words as road signs',
  more: [{ serial: 'S522', after: 0, alt: 'A signpost with first, next, then' }, { serial: 'S523', after: 2, alt: 'A signpost with because and so' }],
  title: 'Road signs', art: 'S521', cast: [],
  alt: 'A child reading a page, road signs drawn in the margin',
  words: [
    'First, next, then: a sequence. The text is a road.',
    'Because and so: cause and effect. But and however: a comparison.',
    'Signal words tell you how a text is built. Read the signs and you know the shape of the road.',
  ],
};
STORIES['forms-of-energy'] = {
  about: 'one morning, five kinds of energy',
  more: [{ serial: 'S525', after: 0, alt: 'The toaster glowing orange inside' }, { serial: 'S526', after: 2, alt: 'The fan blades spinning' }],
  title: 'Five kinds before breakfast', art: 'S524', cast: [],
  alt: 'A kitchen at morning: a lamp on, a toaster glowing, a radio playing, a fan turning',
  words: [
    'The lamp: light. The toaster: heat. The radio: sound.',
    'The outlet: electrical. The fan blades: mechanical.',
    'Energy comes in forms: light, heat, sound, electrical and mechanical. One kitchen, five kinds.',
  ],
};
STORIES['circuits'] = {
  about: 'a bulb that lit only when the loop closed',
  more: [{ serial: 'S528', after: 0, alt: 'The bulb lit, the loop closed' }, { serial: 'S529', after: 2, alt: 'A paper clip in the loop, the bulb still lit; a plastic ruler in the loop, dark' }],
  title: 'The loop', art: 'S527', cast: [],
  alt: 'A child with a battery, a wire and a bulb, the wire not yet connected',
  words: [
    'Battery, wire, bulb. Nothing. The loop was open.',
    'Touch the last wire. Light. The loop was closed.',
    'Electricity flows only around a complete loop. Cut it anywhere and it stops.',
  ],
};
STORIES['changing-land'] = {
  about: 'a sandcastle and a week of weather',
  more: [{ serial: 'S531', after: 0, alt: 'The walls crumbling in the rain' }, { serial: 'S532', after: 2, alt: 'A new sandbar down the beach where the sand landed' }],
  title: 'The sandcastle', art: 'S530', cast: [],
  alt: 'A sandcastle on a beach, waves approaching',
  words: [
    'Rain crumbled the walls. Weathering.',
    'The waves carried the sand away. Erosion. Down the beach, the sand piled up in a new bank. Deposition.',
    'Weathering breaks rock. Erosion carries it. Deposition drops it. Break, carry, drop.',
  ],
};
STORIES['adaptations'] = {
  about: 'a duck\'s feet and a cactus\'s spines',
  more: [{ serial: 'S534', after: 0, alt: 'A close look at the duck\'s webbed foot' }, { serial: 'S535', after: 2, alt: 'A close look at the cactus spines' }],
  title: 'The right tools', art: 'S533', cast: [],
  alt: 'A duck paddling on a pond beside a cactus in a pot on the bank',
  words: [
    'The duck had webbed feet. Paddles for the water.',
    'The cactus had spines. A fence against thirsty animals.',
    'An adaptation solves a problem of the place a living thing lives. The right tools for the place.',
  ],
};
STORIES['topic-sentences'] = {
  about: 'a paragraph that said the big thing first',
  more: [{ serial: 'S537', after: 0, alt: 'A dog leading a person across a street' }, { serial: 'S538', after: 2, alt: 'The finished paragraph with the first sentence boxed' }],
  title: 'The big thing first', art: 'S536', cast: [],
  alt: 'A child writing a paragraph, the first sentence in a box',
  words: [
    'Dogs make good helpers. The big thing, first.',
    'They fetch. They guard. They guide. Every sentence after belongs to the first.',
    'The topic sentence says the big thing first. Every sentence after it helps.',
  ],
};
STORIES['opinion-paragraph'] = {
  about: 'a case for a longer recess',
  more: [{ serial: 'S540', after: 0, alt: 'Children running on the playground' }, { serial: 'S541', after: 2, alt: 'The paragraph with its four parts marked' }],
  title: 'Longer recess', art: 'S539', cast: [],
  alt: 'A child at a desk writing, a playground visible through the window',
  words: [
    'Opinion: recess should be longer.',
    'Reason one: we think better after running. Reason two: we get along better after playing.',
    'Opinion, then two reasons, then a closing sentence. Say the same thing a new way at the end.',
  ],
};
STORIES['narrative-paragraph'] = {
  about: 'the day the bird got into the house',
  more: [{ serial: 'S543', after: 0, alt: 'The bird on the curtain rod' }, { serial: 'S544', after: 2, alt: 'The bird flying out the open window' }],
  title: 'The bird in the house', art: 'S542', cast: [],
  alt: 'A small bird flying in a living room, a family ducking',
  words: [
    'Beginning: the door was open and a bird flew in.',
    'Middle: it circled the lamp, landed on the curtain, and everyone froze.',
    'End: Dad opened the window and it found its way out. Beginning, middle, end, and words a reader can picture.',
  ],
};
STORIES['first-texans'] = {
  about: 'three peoples, three ways to eat',
  more: [{ serial: 'S546', after: 0, alt: 'A Caddo cornfield near a river' }, { serial: 'S547', after: 2, alt: 'A Comanche rider on the open plain' }],
  title: 'Three kitchens', art: 'S545', cast: [],
  alt: 'A map of Texas with three regions marked, a child looking at it',
  words: [
    'In the wet east, the Caddo farmed corn.',
    'On the dry plains, the Comanche followed the buffalo. On the coast, the Karankawa fished.',
    'Many peoples lived in Texas first, and the land shaped how each one lived.',
  ],
};
STORIES['spanish-and-mexican-texas'] = {
  about: 'a mission bell and a new flag',
  more: [{ serial: 'S549', after: 0, alt: 'The town of San Antonio in 1718, a few buildings by a river' }, { serial: 'S550', after: 2, alt: 'Settlers arriving in wagons under the Mexican flag' }],
  title: 'The mission bell', art: 'S548', cast: [],
  alt: 'A stone mission with a bell tower under a big Texas sky',
  words: [
    'Spain built missions from the 1690s. A bell, a church, a few families.',
    'In 1821 Mexico won its freedom. A new flag over the same mission.',
    'Mexico opened the door to settlers, and more came than anyone planned.',
  ],
};
STORIES['texas-joins-the-union'] = {
  about: 'a country of its own, then a state',
  more: [{ serial: 'S552', after: 0, alt: 'A star being sewn onto a flag' }, { serial: 'S553', after: 2, alt: 'A Juneteenth celebration under the trees' }],
  title: 'The 28th star', art: 'S551', cast: [],
  alt: 'A Texas flag and an American flag side by side on a courthouse',
  words: [
    'For nine years Texas was its own country. Then in 1845, the 28th state.',
    'In 1861 it left to join the Confederacy.',
    'On June 19, 1865, freedom reached Texas. Juneteenth.',
  ],
};
STORIES['multi-digit-multiplication'] = {
  about: '23 boxes of 4 crayons, counted in pieces',
  more: [{ serial: 'S555', after: 0, alt: 'The boxes stacked in two piles, twenty and three' }, { serial: 'S556', after: 2, alt: 'The sum on paper: 80 + 12 = 92' }],
  title: 'Twenty-three boxes', art: 'S554', cast: [],
  alt: 'A child with a stack of small crayon boxes, working on paper',
  words: [
    '23 boxes, 4 crayons each. Break 23 into 20 and 3.',
    '20 boxes: 80 crayons. 3 boxes: 12 crayons.',
    '80 and 12: 92. Break a number into tens and ones, multiply each piece, add the pieces.',
  ],
};
STORIES['long-division'] = {
  about: '96 stickers for 4 friends, in rounds',
  more: [{ serial: 'S558', after: 0, alt: 'Four piles of twenty stickers' }, { serial: 'S559', after: 2, alt: 'Four piles of twenty-four, the box empty' }],
  title: 'Sharing in rounds', art: 'S557', cast: [],
  alt: 'A child dealing stickers onto four piles',
  words: [
    '96 stickers, 4 friends. Give each 20. That used 80.',
    'Sixteen left. Give each 4 more. Everyone has 24.',
    'Divide one digit at a time, bringing the next digit down. Long division is sharing in rounds.',
  ],
};
STORIES['factors-and-multiples'] = {
  about: 'twelve chairs and the ways to arrange them',
  more: [{ serial: 'S561', after: 0, alt: 'Three rows of four chairs' }, { serial: 'S562', after: 2, alt: 'Two rows of six chairs' }],
  title: 'Twelve chairs', art: 'S560', cast: [],
  alt: 'A child arranging twelve chairs in rows in a hall',
  words: [
    'One row of twelve. Two rows of six. Three rows of four.',
    'Those are the factors of twelve: 1, 2, 3, 4, 6, 12.',
    'A factor goes into a number exactly. A multiple is what a number counts up to: 12, 24, 36.',
  ],
};
STORIES['equivalent-and-decimals'] = {
  about: 'a quarter that was also 0.25',
  more: [{ serial: 'S564', after: 0, alt: 'Four quarters laid on a dollar' }, { serial: 'S565', after: 2, alt: 'The child writing 1/4 = 0.25' }],
  title: 'The quarter', art: 'S563', cast: [],
  alt: 'A child holding a quarter next to a dollar bill',
  words: [
    'A quarter is one fourth of a dollar. It is also 25 cents.',
    'Twenty-five out of a hundred. 0.25.',
    'A decimal is a fraction with 10 or 100 on the bottom. One fourth and 0.25 are the same money.',
  ],
};
STORIES['add-fractions'] = {
  about: 'a half pizza and a quarter pizza put together',
  more: [{ serial: 'S567', after: 0, alt: 'The half cut into two quarter slices' }, { serial: 'S568', after: 2, alt: 'Three quarter slices lined up' }],
  title: 'Half and a quarter', art: 'S566', cast: [],
  alt: 'A pizza box with half a pizza and a quarter of another, a child counting slices',
  words: [
    'Half a pizza and a quarter of a pizza. How much altogether?',
    'Cut the half into two quarters. Now count quarters: three.',
    'Same bottoms: add the tops, keep the bottom. Different bottoms: make them the same first.',
  ],
};
STORIES['balance-and-pattern'] = {
  about: 'a face, a flower and a fence',
  more: [{ serial: 'S570', after: 0, alt: 'The flower sketch with petals spreading from the center' }, { serial: 'S571', after: 2, alt: 'The fence sketch with its repeating posts' }],
  title: 'Three kinds of balance', art: 'S569', cast: [],
  alt: 'A child sketching a face, a flower and a fence in a notebook',
  words: [
    'A face: the same on both sides. Symmetrical.',
    'A flower: spreading from the middle. Radial. A fence: a post, a post, a post. Pattern.',
    'Balance can be symmetrical, asymmetrical or radial. Pattern is a thing repeated.',
  ],
};
STORIES['making-space-on-paper'] = {
  about: 'a road that ran into the distance',
  more: [{ serial: 'S573', after: 0, alt: 'The two trees, big near and small far' }, { serial: 'S574', after: 2, alt: 'The finished drawing with the vanishing point marked' }],
  title: 'The road to the horizon', art: 'S572', cast: [],
  alt: 'A child drawing a road that narrows toward a point on the horizon',
  words: [
    'The road was wide at the bottom of the page and thin at the top.',
    'The near tree was big and detailed. The far tree was small and plain.',
    'Overlap, size, placement and detail make a flat page look deep. The lines meet at a vanishing point.',
  ],
};
STORIES['art-tells-a-story'] = {
  about: 'a handprint on a cave wall',
  more: [{ serial: 'S576', after: 0, alt: 'A close look at the painted horses' }, { serial: 'S577', after: 2, alt: 'The child pressing a painted hand to paper' }],
  title: 'The handprint', art: 'S575', cast: [],
  alt: 'A child looking at a photo of ancient cave paintings, a handprint among the animals',
  words: [
    'Someone pressed a hand to a cave wall thousands of years ago.',
    'Around it, horses and bison. A story with no words.',
    'People made art before writing, and every culture since has told its stories in pictures.',
  ],
};
STORIES['adding-decimals'] = {
  about: 'two prices added like money',
  more: [{ serial: 'S579', after: 0, alt: 'The two prices written one above the other with the points aligned' }, { serial: 'S580', after: 2, alt: 'The child handing over the money' }],
  title: 'Two prices', art: 'S578', cast: [],
  alt: 'A child at a shop counter with two price tags, 2.50 and 1.35, and a calculator',
  words: [
    'Two dollars fifty. One dollar thirty-five.',
    'Line up the decimal points. Cents under cents, dollars under dollars.',
    'Add column by column: 3.85. Decimals are money, and money lines up.',
  ],
};
STORIES['multiplying-fractions'] = {
  about: 'half of a half of a pizza',
  more: [{ serial: 'S582', after: 0, alt: 'The half pizza cut into two quarters' }, { serial: 'S583', after: 2, alt: 'One quarter left in the box' }],
  title: 'Half of a half', art: 'S581', cast: [],
  alt: 'A pizza with one half remaining, a child cutting that half again',
  words: [
    'Half a pizza left. I ate half of it.',
    'Half of a half. A quarter.',
    'Tops times tops, bottoms times bottoms: 1 × 1 over 2 × 2. Of means multiply.',
  ],
};
STORIES['dividing-by-two-digits'] = {
  about: '288 eggs and cartons of 24',
  more: [{ serial: 'S585', after: 0, alt: 'Ten full cartons stacked' }, { serial: 'S586', after: 2, alt: 'Twelve cartons and an empty crate' }],
  title: 'Cartons of 24', art: 'S584', cast: [],
  alt: 'A child at a farm stand with a crate of eggs and empty cartons',
  words: [
    '288 eggs. Cartons hold 24. How many cartons?',
    'Ten cartons: 240. Forty-eight left: two more cartons.',
    'Twelve cartons. Estimate how many times the divisor fits, then bring down the next digit.',
  ],
};
STORIES['volume'] = {
  about: 'sugar cubes in a box',
  more: [{ serial: 'S588', after: 0, alt: 'The box with two full layers' }, { serial: 'S589', after: 2, alt: 'The child writing 4 × 3 × 2 = 24 on the box' }],
  title: 'Sugar cubes', art: 'S587', cast: [],
  alt: 'A child filling a small box with sugar cubes, one layer done',
  words: [
    'One layer: four across, three deep. Twelve cubes.',
    'Two layers high. Twelve twice. Twenty-four.',
    'Volume of a box is length times width times height. Count the cubes that fit.',
  ],
};
STORIES['order-of-operations'] = {
  about: 'a math sentence read like a recipe',
  more: [{ serial: 'S591', after: 0, alt: 'The package labeled 8 drawn around 4 × 2' }, { serial: 'S592', after: 2, alt: 'The two answers side by side, eleven circled' }],
  title: 'The package', art: 'S590', cast: [],
  alt: 'A child looking at 3 + 4 × 2 on a whiteboard, a wrapped package drawn beside it',
  words: [
    '3 + 4 × 2. The 4 × 2 is a package. It arrives already wrapped: eight.',
    'Then add the 3. Eleven, not fourteen.',
    'Brackets first, then multiply and divide, then add and subtract. To add first, you need brackets.',
  ],
};
STORIES['theme'] = {
  about: 'two friends, a fight, and what the story was really about',
  more: [{ serial: 'S594', after: 0, alt: 'The two friends arguing' }, { serial: 'S595', after: 2, alt: 'The two friends walking together again' }],
  title: 'What it was really about', art: 'S593', cast: [],
  alt: 'A child closing a book, thinking, two friends pictured on the cover',
  words: [
    'The story was about two friends. That is the topic.',
    'They fought and made up. The story said friendship survives a fight.',
    'The topic is what the story is about. The theme is what it says about it. The topic is a word; the theme is a sentence.',
  ],
};
STORIES['point-of-view'] = {
  about: 'the same afternoon told twice',
  more: [{ serial: 'S597', after: 0, alt: 'A storm cloud seen from a window' }, { serial: 'S598', after: 2, alt: 'A camera on a tripod in the corner of a room' }],
  title: 'Two cameras', art: 'S596', cast: [],
  alt: 'A child holding two books open, one saying I, one saying she',
  words: [
    'I saw the storm coming. First person. The camera is on my head.',
    'She saw the storm coming. Third person. The camera is on a tripod in the corner.',
    'I and we mean first person. He, she and they mean third. The camera decides what you are allowed to know.',
  ],
};
STORIES['idioms'] = {
  about: 'break a leg, and no one got hurt',
  more: [{ serial: 'S600', after: 0, alt: 'The child on stage, smiling, taking a bow' }, { serial: 'S601', after: 2, alt: 'A list of idioms on a poster: raining cats and dogs, piece of cake' }],
  title: 'Break a leg', art: 'S599', cast: [],
  alt: 'A child backstage before a play, a friend whispering to them',
  words: [
    'Break a leg, said my friend. I was scared.',
    'It means good luck. Nobody breaks anything.',
    'An idiom means something its words do not say. You learn it the way you learn a nickname.',
  ],
};
STORIES['text-evidence'] = {
  about: 'a claim with a line behind it',
  more: [{ serial: 'S603', after: 0, alt: 'The line underlined in the book' }, { serial: 'S604', after: 2, alt: 'The notebook with the claim and the page number' }],
  title: 'Point to the line', art: 'S602', cast: [],
  alt: 'A child with a book open, finger on one sentence, a notebook beside',
  words: [
    'I think the boy was scared. Prove it.',
    'Page 12: his hands shook. There is the line.',
    'A claim about a text needs a line from the text behind it. Point to it.',
  ],
};
STORIES['mixtures-and-solutions'] = {
  about: 'sand in one glass, salt in the other',
  more: [{ serial: 'S606', after: 0, alt: 'Sand settled at the bottom of the glass' }, { serial: 'S607', after: 2, alt: 'The child tasting the clear salty water' }],
  title: 'Two glasses', art: 'S605', cast: [],
  alt: 'Two glasses of water on a table, one cloudy with sand, one clear',
  words: [
    'Sand in water. It sank. I poured the water off. A mixture.',
    'Salt in water. It vanished. I could not pick it out, but I could taste it. A solution.',
    'A mixture keeps the properties of its parts and can be separated. A solution dissolves.',
  ],
};
STORIES['earth-sun-moon'] = {
  about: 'a spinning top, a lamp and a marble',
  more: [{ serial: 'S609', after: 0, alt: 'The top lit on one side by the lamp' }, { serial: 'S610', after: 2, alt: 'The marble on its path around the top' }],
  title: 'Top, lamp, marble', art: 'S608', cast: [],
  alt: 'A child with a lamp, a spinning top and a marble on a dark table',
  words: [
    'The top spins. One spin is a day.',
    'The top circles the lamp. One lap is a year. The marble circles the top. Once a month.',
    'The Earth spins for day and night, circles the sun for the year, and the moon circles the Earth.',
  ],
};
STORIES['inherited-and-learned'] = {
  about: 'brown eyes and a bicycle',
  more: [{ serial: 'S612', after: 0, alt: 'A close look at the matching brown eyes' }, { serial: 'S613', after: 2, alt: 'The child wobbling on the bike, then riding straight' }],
  title: 'Eyes and wheels', art: 'S611', cast: [],
  alt: 'A child with brown eyes riding a bicycle, a parent with the same eyes watching',
  words: [
    'Brown eyes, like my dad. Inherited.',
    'Riding a bike. I fell twenty times first. Learned.',
    'Inherited traits come from parents. Learned traits come from practice.',
  ],
};
STORIES['informational-piece'] = {
  about: 'a tour of the school, written down',
  more: [{ serial: 'S615', after: 0, alt: 'The school library with tall shelves' }, { serial: 'S616', after: 2, alt: 'The finished piece with its parts labeled' }],
  title: 'The tour', art: 'S614', cast: [],
  alt: 'A child writing at a desk, a map of the school beside the paper',
  words: [
    'Introduction: this is our school. The entrance.',
    'One paragraph for the gym, one for the library, one for the garden. The rooms.',
    'Conclusion: come and see it. The exit. Introduction, a paragraph for each part, a conclusion.',
  ],
};
STORIES['opinion-essay-5'] = {
  about: 'five paragraphs for a class pet',
  more: [{ serial: 'S618', after: 0, alt: 'A hamster in a cage on a classroom shelf' }, { serial: 'S619', after: 2, alt: 'The five boxes filled in' }],
  title: 'Five paragraphs', art: 'S617', cast: [],
  alt: 'A child writing a long essay, five boxes sketched in the margin',
  words: [
    'Paragraph one: our class should have a pet.',
    'Two, three, four: one reason each. It teaches care. It calms us. It is fun.',
    'Five: say it again, with the reasons behind it. Introduction, one paragraph per reason, a conclusion.',
  ],
};
STORIES['personal-narrative-5'] = {
  about: 'the moment the training wheels came off',
  more: [{ serial: 'S621', after: 0, alt: 'The parent\'s hand letting go of the seat' }, { serial: 'S622', after: 2, alt: 'The child riding to the end of the driveway alone' }],
  title: 'The moment', art: 'S620', cast: [],
  alt: 'A child on a bike at the top of a driveway, training wheels on the grass',
  words: [
    'Set the scene: a Saturday, a driveway, wheels off.',
    'Build to the moment: the wobble, the hand letting go, the balance.',
    'Say what changed: I was a rider now. Slow down at the moment that mattered.',
  ],
};
STORIES['thirteen-colonies'] = {
  about: 'thirteen colonies in three rows',
  more: [{ serial: 'S624', after: 0, alt: 'A New England fishing village' }, { serial: 'S625', after: 2, alt: 'A Southern tobacco field' }],
  title: 'Three rows', art: 'S623', cast: [],
  alt: 'A child looking at a map of the east coast with thirteen colonies in three colors',
  words: [
    'New England up top. The Middle colonies. The South.',
    'Settled from 1607 to 1732 by people wanting land, faith or a fresh start.',
    'Thirteen colonies in three regions, each with its own way to live.',
  ],
};
STORIES['road-to-revolution'] = {
  about: 'taxes, tea, shots, a declaration',
  more: [{ serial: 'S627', after: 0, alt: 'Tea crates splashing into the harbor' }, { serial: 'S628', after: 2, alt: 'The declaration being signed' }],
  title: 'Four steps to a war', art: 'S626', cast: [],
  alt: 'A child looking at a timeline with four pictures: a tax stamp, tea in a harbor, a musket, a signed page',
  words: [
    '1765: taxes with no vote. 1773: tea in the harbor.',
    '1775: shots at Lexington. 1776: a declaration.',
    'Taxes without a vote, then protests, then shots, then a declaration. Each step made the next one likelier.',
  ],
};
STORIES['the-constitution'] = {
  about: 'a plan too weak, then a plan that worked',
  more: [{ serial: 'S630', after: 0, alt: 'Three columns drawn on paper: Congress, President, courts' }, { serial: 'S631', after: 2, alt: 'The child tracing the signatures' }],
  title: 'The second plan', art: 'S629', cast: [],
  alt: 'A child looking at an old document under glass in a museum',
  words: [
    'The first plan, the Articles, could not even pay the bills.',
    'In 1787 the founders wrote a stronger one. Three branches.',
    'Each branch can stop the others. That is the point.',
  ],
};
STORIES['growing-west'] = {
  about: 'a purchase that doubled the map',
  more: [{ serial: 'S633', after: 0, alt: 'A wagon on a trail across the plains' }, { serial: 'S634', after: 2, alt: 'A railroad spike being hammered' }],
  title: 'Doubling the map', art: 'S632', cast: [],
  alt: 'A child with a map of the United States, coloring the middle third',
  words: [
    '1803: the Louisiana Purchase. Fifteen million dollars. The country doubled.',
    'Trails west. Gold in 1848. Railroads.',
    'Purchases, trails, gold and rails pulled people west, and the map filled in.',
  ],
};
STORIES['civil-war'] = {
  about: 'a country split, and a war to mend it',
  more: [{ serial: 'S636', after: 0, alt: 'A field after the fighting, quiet' }, { serial: 'S637', after: 2, alt: 'People celebrating freedom under a big tree' }],
  title: 'The split', art: 'S635', cast: [],
  alt: 'A child looking at a map with the country divided in two colors',
  words: [
    '1861: a country split over slavery went to war.',
    '1863: emancipation. 1865: surrender.',
    'Six hundred thousand dead, and slavery ended. A split over slavery, war from 1861 to 1865.',
  ],
};
// Middle school, in the fewest words that still make a story.
STORIES['dividing-fractions'] = {
  about: 'three pizzas and the halves inside them',
  more: [{ serial: 'S639', after: 0, alt: 'The three pizzas each cut in two' }, { serial: 'S640', after: 2, alt: 'Six half-slices lined up' }],
  title: 'How many halves', art: 'S638', cast: [],
  alt: 'Three whole pizzas on a counter, a child with a knife',
  words: [
    'Three pizzas. How many halves?',
    'Six. Each pizza holds two. So 3 ÷ 1/2 = 6.',
    'To divide by a fraction, flip it and multiply. Dividing by a small piece counts the pieces.',
  ],
};
STORIES['area-of-triangles'] = {
  about: 'a triangular garden bed and the rectangle around it',
  more: [{ serial: 'S642', after: 0, alt: 'The string stretched along the base and up the height' }, { serial: 'S643', after: 2, alt: 'The chalk rectangle with the triangle inside' }],
  title: 'Half a rectangle', art: 'S641', cast: [],
  alt: 'A child measuring a triangular garden bed with string, a rectangle chalked around it',
  words: [
    'The bed was a triangle. Base 6, height 4.',
    'The rectangle around it: 24. The triangle was exactly half.',
    'Twelve. Parallelogram: base times height. Triangle: half of that.',
  ],
};
STORIES['one-step-equations'] = {
  about: 'a mystery box on a balance',
  more: [{ serial: 'S645', after: 0, alt: 'Five weights lifted off each pan' }, { serial: 'S646', after: 2, alt: 'The box and seven weights level' }],
  title: 'The mystery box', art: 'S644', cast: [],
  alt: 'A balance scale with a box on one pan and weights on the other',
  words: [
    'A box and five weights balanced twelve weights.',
    'Take five off both pans. The box alone balanced seven.',
    'Do the same thing to both sides. Undo adding by subtracting. x = 7.',
  ],
};
STORIES['claims-and-reasons'] = {
  about: 'a case for a later start, and the reason that did not hold',
  more: [{ serial: 'S648', after: 0, alt: 'The card that reads nothing but is crossed out' }, { serial: 'S649', after: 2, alt: 'The student holding the two strong cards' }],
  title: 'The reason that fell', art: 'S647', cast: [],
  alt: 'A student at a podium with three cards, one of them crossed out',
  words: [
    'Claim: school should start later.',
    'Reason one: teenagers sleep late. Holds. Reason two: my cousin likes it. Does not hold it up.',
    'Find the claim first. Then test whether each reason really supports it.',
  ],
};
STORIES['tone-and-mood'] = {
  about: 'the same rain described two ways',
  more: [{ serial: 'S651', after: 0, alt: 'The cozy version, a lamp on inside' }, { serial: 'S652', after: 2, alt: 'The gray version, an empty street' }],
  title: 'Two rains', art: 'S650', cast: [],
  alt: 'A window with rain, a student writing two short paragraphs',
  words: [
    'The rain drummed happily on the roof. The writer is warm. Tone.',
    'The rain would not stop. The reader feels trapped. Mood.',
    'Tone is the writer\'s attitude. Mood is the feeling you are left with.',
  ],
};
STORIES['word-roots'] = {
  about: 'one root, five words',
  more: [{ serial: 'S654', after: 0, alt: 'The branches of the word tree with the five words' }, { serial: 'S655', after: 2, alt: 'A truck, a ship and a backpack, each carrying' }],
  title: 'The root port', art: 'S653', cast: [],
  alt: 'A student with a word tree drawn on paper, port at the trunk',
  words: [
    'Port means carry. Transport: carry across.',
    'Import: carry in. Export: carry out. Portable: able to be carried.',
    'A root you know unlocks every word built on it.',
  ],
};
STORIES['central-idea'] = {
  about: 'every paragraph on the same job',
  more: [{ serial: 'S657', after: 0, alt: 'A bee on a flower' }, { serial: 'S658', after: 2, alt: 'The three notes joined by arrows to one sentence' }],
  title: 'The same job', art: 'S656', cast: [],
  alt: 'A student with a printed article, each paragraph marked with a short note',
  words: [
    'Paragraph one: bees pollinate. Two: bees are dying. Three: what farmers can do.',
    'All three work the same job: we need bees.',
    'The central idea is what every paragraph is helping to say.',
  ],
};
STORIES['elements-and-compounds'] = {
  about: 'letters and words',
  more: [{ serial: 'S660', after: 0, alt: 'The tiles H, H and O separated' }, { serial: 'S661', after: 2, alt: 'The tiles pushed together as water' }],
  title: 'Letters and words', art: 'S659', cast: [],
  alt: 'A student with letter tiles spelling H2O on a table',
  words: [
    'H is a letter. O is a letter. Each one an element.',
    'H2O is a word spelled from them. A compound.',
    'An element is one kind of atom. A compound is two or more joined.',
  ],
};
STORIES['heat-transfer'] = {
  about: 'a pan, a pot and a campfire',
  more: [{ serial: 'S663', after: 0, alt: 'The swirl in the soup pot' }, { serial: 'S664', after: 2, alt: 'The child\'s face lit by the fire' }],
  title: 'Three ways', art: 'S662', cast: [],
  alt: 'A campsite with a pan on a fire, a pot of soup, a child warming hands',
  words: [
    'The pan handle got hot. Touch. Conduction.',
    'The soup swirled as the hot broth rose. Convection.',
    'The fire warmed my face from a distance. Radiation. Heat moves from warmer to cooler.',
  ],
};
STORIES['plate-tectonics'] = {
  about: 'two rugs on a floor',
  more: [{ serial: 'S666', after: 0, alt: 'The rugs pulled apart with a gap between' }, { serial: 'S667', after: 2, alt: 'The rugs sliding past each other, edges catching' }],
  title: 'Two rugs', art: 'S665', cast: [],
  alt: 'A student pushing two rugs together on a floor, one buckling',
  words: [
    'Push two rugs together. They buckle. Mountains.',
    'Pull them apart. The floor shows. A rift. Slide them past each other. They catch and jerk. An earthquake.',
    'The Earth\'s shell is plates that move. Push, pull, slide.',
  ],
};
STORIES['ecosystems'] = {
  about: 'grass, grasshopper, bird, hawk',
  more: [{ serial: 'S669', after: 0, alt: 'The bird with the grasshopper' }, { serial: 'S670', after: 2, alt: 'Mushrooms on a fallen log' }],
  title: 'Follow the energy', art: 'S668', cast: [],
  alt: 'A meadow with grass, a grasshopper, a bird and a hawk overhead',
  words: [
    'Grass makes food from sunlight. A producer.',
    'A grasshopper eats the grass. A bird eats the grasshopper. Consumers.',
    'When the bird dies, fungi break it down. Decomposers. Take away the grass and the whole chain goes hungry.',
  ],
};
STORIES['density'] = {
  about: 'two boxes the same size',
  more: [{ serial: 'S672', after: 0, alt: 'The two boxes on a scale, one side down' }, { serial: 'S673', after: 2, alt: 'A rock sinking and a feather floating in a tub' }],
  title: 'Feathers and rocks', art: 'S671', cast: [],
  alt: 'Two identical boxes on a table, one open with feathers, one with rocks',
  words: [
    'Same size. One full of feathers, one full of rocks.',
    'Same space, different mass. The rock box is denser.',
    'Density is mass divided by volume. Denser than water sinks; lighter floats.',
  ],
};
STORIES['argument-with-evidence'] = {
  about: 'a claim that finally got its numbers',
  more: [{ serial: 'S675', after: 0, alt: 'The nurse\'s log on a clipboard' }, { serial: 'S676', after: 2, alt: 'A new fountain in the hallway' }],
  title: 'Show the numbers', art: 'S674', cast: [],
  alt: 'A student at a desk with a claim written large and a graph beside it',
  words: [
    'Claim: our school needs more water fountains.',
    'Reason: students get thirsty. Evidence: the nurse logged forty headaches last month.',
    'A claim, reasons, and evidence for each reason. A reason without evidence is a louder opinion.',
  ],
};
STORIES['compare-and-contrast'] = {
  about: 'two towns, side by side',
  more: [{ serial: 'S678', after: 0, alt: 'The bridge town from above' }, { serial: 'S679', after: 2, alt: 'The ferry crossing the river' }],
  title: 'Two towns', art: 'S677', cast: [],
  alt: 'A student with two columns on a page: alike, different',
  words: [
    'Alike: both towns sit on a river. Both have a market.',
    'Different: one has a bridge, one has a ferry.',
    'How they are alike, how they differ, and what that shows: the bridge town grew faster.',
  ],
};
STORIES['narrative-with-dialogue'] = {
  about: 'two lines of talk that moved the story',
  more: [{ serial: 'S681', after: 0, alt: 'The bus pulling away' }, { serial: 'S682', after: 2, alt: 'The two walking off together' }],
  title: 'Let them talk', art: 'S680', cast: [],
  alt: 'Two characters at a bus stop, speech bubbles above them',
  words: [
    '"You\'re late," she said. "The bus was early," he said.',
    'Two lines, and you know them both.',
    'Dialogue moves the story and shows character. Quotation marks, a new line for each speaker.',
  ],
};
STORIES['maps-and-hemispheres'] = {
  about: 'an orange with lines drawn on it',
  more: [{ serial: 'S684', after: 0, alt: 'The orange with the equator drawn' }, { serial: 'S685', after: 2, alt: 'A globe beside the orange' }],
  title: 'The orange globe', art: 'S683', cast: [],
  alt: 'A student drawing lines on an orange with a marker',
  words: [
    'Rings around the orange, counted from the middle. Latitude.',
    'Segments top to bottom, counted from one line. Longitude.',
    'Seven continents, five oceans, and two numbers to find any place on Earth.',
  ],
};
STORIES['what-culture-is'] = {
  about: 'everything a newcomer would need to be taught',
  more: [{ serial: 'S687', after: 0, alt: 'The three sharing food at a table' }, { serial: 'S688', after: 2, alt: 'A calendar with holidays marked' }],
  title: 'What we would have to teach', art: 'S686', cast: [],
  alt: 'A new student being shown around a lunchroom by two others',
  words: [
    'The words we use. The food we eat. The holidays we keep.',
    'What is polite. What is rude. What everyone already knows.',
    'Culture is the way of life a group shares. You did not choose it; you soaked it up.',
  ],
};
STORIES['kinds-of-government'] = {
  about: 'who holds the remote',
  more: [{ serial: 'S690', after: 0, alt: 'Three people huddled over the remote' }, { serial: 'S691', after: 2, alt: 'Everyone raising a hand' }],
  title: 'The remote', art: 'S689', cast: [],
  alt: 'A family on a couch, one person holding the remote',
  words: [
    'One person holds the remote. A monarchy or a dictatorship.',
    'A small circle passes it around. An oligarchy. Everyone votes on the channel. A democracy.',
    'Governments differ by who decides.',
  ],
};
STORIES['kinds-of-economies'] = {
  about: 'who decides what gets made',
  more: [{ serial: 'S693', after: 0, alt: 'A family workshop making the same craft for generations' }, { serial: 'S694', after: 2, alt: 'A busy market with prices on chalkboards' }],
  title: 'Who decides', art: 'S692', cast: [],
  alt: 'A market street with stalls, a student looking at the stalls',
  words: [
    'Grandparents and tradition decide. A traditional economy.',
    'The government decides. A command economy. Buyers and sellers decide. A market economy.',
    'Economies differ by who decides. Most countries mix them.',
  ],
};
STORIES['people-on-the-move'] = {
  about: 'why the family moved, and how crowded the city was',
  more: [{ serial: 'S696', after: 0, alt: 'The empty main street they left' }, { serial: 'S697', after: 2, alt: 'The crowded city block they arrived at' }],
  title: 'Push and pull', art: 'S695', cast: [],
  alt: 'A family loading a car, a city skyline in the distance',
  words: [
    'No work at home. That pushed.',
    'A job in the city. That pulled.',
    'People move away from what pushes and toward what pulls. Density is how crowded the destination gets.',
  ],
};
STORIES['world-regions-today'] = {
  about: 'what makes a region a region',
  more: [{ serial: 'S699', after: 0, alt: 'A coastline shared by several countries' }, { serial: 'S700', after: 2, alt: 'A desert region shaded across borders' }],
  title: 'The neighborhood on the map', art: 'S698', cast: [],
  alt: 'A student with a world map, a region shaded in one color',
  words: [
    'A region is a neighborhood on a bigger map.',
    'The neighbors share something: a language, a climate, a coastline.',
    'That shared thing is what draws the line around them.',
  ],
};
STORIES['proportions'] = {
  about: 'the price of one pen',
  more: [{ serial: 'S702', after: 0, alt: 'One pen and two dimes' }, { serial: 'S703', after: 2, alt: 'Five pens and a dollar bill' }],
  title: 'The price of one', art: 'S701', cast: [],
  alt: 'A student at a shop counter with a pack of three pens',
  words: [
    'Three pens cost sixty cents. What is one?',
    'Twenty. So five pens are a dollar.',
    'Find what one unit is worth, then multiply. Or cross-multiply.',
  ],
};
STORIES['integers'] = {
  about: 'money owed, and a debt forgiven',
  more: [{ serial: 'S705', after: 0, alt: 'The IOU torn in half' }, { serial: 'S706', after: 2, alt: 'A number line with the jump to 8' }],
  title: 'The debt', art: 'S704', cast: [],
  alt: 'A student with a jar of coins and a note that says nothing, an IOU drawn',
  words: [
    'Five dollars in the jar. Three owed. Owing is negative.',
    'The three-dollar debt was forgiven. Better off by three. 5 - (-3) = 8.',
    'Adding a negative moves left. Subtracting a negative moves right.',
  ],
};
STORIES['two-step-equations'] = {
  about: 'shoes and socks, in reverse',
  more: [{ serial: 'S708', after: 0, alt: 'The shoes off, socks next' }, { serial: 'S709', after: 2, alt: 'The equation with two arrows undoing it' }],
  title: 'Shoes then socks', art: 'S707', cast: [],
  alt: 'A student pulling off shoes, socks still on',
  words: [
    'Socks on first, shoes on last. To undo: shoes off first.',
    '2x + 3 = 11. The plus 3 was last. Subtract 3 first: 2x = 8. Then undo the times 2: x = 4.',
    'Undo the steps in reverse order.',
  ],
};
STORIES['circles'] = {
  about: 'a string around a can',
  more: [{ serial: 'S711', after: 0, alt: 'The string laid straight beside three cans' }, { serial: 'S712', after: 2, alt: 'The can standing on paper with its circle traced' }],
  title: 'The string and the can', art: 'S710', cast: [],
  alt: 'A student wrapping a string around a can, then laying it flat beside it',
  words: [
    'String around the can. Lay it flat.',
    'A little more than three cans across. 3.14.',
    'Circumference is 3.14 times the diameter. Area is 3.14 times the radius squared.',
  ],
};
STORIES['authors-purpose'] = {
  about: 'three pages, three purposes',
  more: [{ serial: 'S714', after: 0, alt: 'The advertisement with bold claims' }, { serial: 'S715', after: 2, alt: 'The comic strip' }],
  title: 'Why was it written', art: 'S713', cast: [],
  alt: 'A student with three pages: a weather report, an advertisement, a comic',
  words: [
    'The weather report: facts and dates. To inform.',
    'The advertisement: should, must, best. To persuade. The comic: a plot and a joke. To entertain.',
    'Inform, persuade or entertain. The shape gives it away.',
  ],
};
STORIES['evidence-quality'] = {
  about: 'one story against ten thousand',
  more: [{ serial: 'S717', after: 0, alt: 'The friend\'s note' }, { serial: 'S718', after: 2, alt: 'The report open to a chart' }],
  title: 'One story', art: 'S716', cast: [],
  alt: 'A student with a friend\'s note in one hand and a thick report in the other',
  words: [
    'My friend says the vitamin works. One story.',
    'The study of ten thousand people says it does not. Evidence.',
    'Many cases from a checkable source beat one story.',
  ],
};
STORIES['connotation'] = {
  about: 'slim, thin, skinny',
  more: [{ serial: 'S720', after: 0, alt: 'A scale with the three cards balanced' }, { serial: 'S721', after: 2, alt: 'A face reacting to each word' }],
  title: 'Three words, one size', art: 'S719', cast: [],
  alt: 'Three word cards on a table, a student weighing them',
  words: [
    'Slim. Thin. Skinny. The same on a scale.',
    'They feel different. Slim is a compliment. Skinny is not.',
    'Connotation is the feeling a word carries beyond its meaning.',
  ],
};
STORIES['character-motive'] = {
  about: 'what she wanted and what she feared',
  more: [{ serial: 'S723', after: 0, alt: 'The character at a door, hand on the knob' }, { serial: 'S724', after: 2, alt: 'Two words in the margin: want, fear' }],
  title: 'Want and fear', art: 'S722', cast: [],
  alt: 'A student reading a novel, a character sketched in the margin',
  words: [
    'She lied to her brother. Why?',
    'She wanted his respect. She feared losing the house.',
    'Motive is what a character wants or fears. It is shown, not told.',
  ],
};
STORIES['body-systems'] = {
  about: 'the body as a city',
  more: [{ serial: 'S726', after: 0, alt: 'The road system drawn over the chest' }, { serial: 'S727', after: 2, alt: 'The phone lines drawn from the head' }],
  title: 'The city inside', art: 'S725', cast: [],
  alt: 'A student drawing a city map over an outline of a body',
  words: [
    'Heart and vessels: roads and trucks. Lungs: the air supply.',
    'Stomach and intestines: the kitchen. Brain and nerves: the phone lines.',
    'Each body system is a team of organs with one main job.',
  ],
};
STORIES['weather-systems'] = {
  about: 'air like water on a slope',
  more: [{ serial: 'S729', after: 0, alt: 'A kite pulling in the wind' }, { serial: 'S730', after: 2, alt: 'The map arrows from H to L' }],
  title: 'The slope of the air', art: 'S728', cast: [],
  alt: 'A student with a weather map, arrows from H to L',
  words: [
    'Cool air is heavy. It piles up. High pressure.',
    'Warm air is light. It rises. Low pressure. The heavy air slides toward the light. Wind.',
    'Warm air rises and cool air sinks; wind blows from high to low.',
  ],
};
STORIES['natural-selection'] = {
  about: 'pale moths on a sooty tree',
  more: [{ serial: 'S732', after: 0, alt: 'A bird taking a pale moth' }, { serial: 'S733', after: 2, alt: 'A trunk covered in dark moths' }],
  title: 'The moths', art: 'S731', cast: [],
  alt: 'A sooty tree trunk with a pale moth and a dark moth on it',
  words: [
    'Pale moths on a dark trunk were easy to see. Birds ate them.',
    'Dark moths hid. They had dark children.',
    'No moth changed color. The population changed because of who survived.',
  ],
};
STORIES['energy-in-ecosystems'] = {
  about: 'a thousand blades of grass and one hawk',
  more: [{ serial: 'S735', after: 0, alt: 'A field of grass with a few grasshoppers' }, { serial: 'S736', after: 2, alt: 'One hawk circling high' }],
  title: 'The pyramid', art: 'S734', cast: [],
  alt: 'A pyramid drawn on paper: grass, grasshoppers, birds, one hawk',
  words: [
    'A thousand units of grass. A hundred of grasshopper.',
    'Ten of bird. One of hawk.',
    'Only about a tenth of the energy passes to the next level. That is why there are more blades than hawks.',
  ],
};
STORIES['summary-and-response'] = {
  about: 'the summary that gave nothing away',
  more: [{ serial: 'S738', after: 0, alt: 'The first paragraph, plain' }, { serial: 'S739', after: 2, alt: 'The second paragraph with an opinion' }],
  title: 'Fair first', art: 'S737', cast: [],
  alt: 'A student writing two paragraphs, a line drawn between them',
  words: [
    'First: the article says cities should plant more trees, for shade and air.',
    'Nothing about what I think. A reader could not tell.',
    'Then: I agree, and here is why. Summarize fairly first, then respond.',
  ],
};
STORIES['argument-with-a-counterclaim'] = {
  about: 'the objection said out loud',
  more: [{ serial: 'S741', after: 0, alt: 'The opponent listening' }, { serial: 'S742', after: 2, alt: 'The team practicing in afternoon light' }],
  title: 'Say it first', art: 'S740', cast: [],
  alt: 'A student at a lectern, an opponent nodding',
  words: [
    'Some say a later start would cut practice time.',
    'True, but practice could shift, and rested players play better.',
    'Name the best objection and answer it. A fair counterclaim wins trust.',
  ],
};
STORIES['explanatory-essay'] = {
  about: 'starting where the reader is',
  more: [{ serial: 'S744', after: 0, alt: 'The younger child moving a piece' }, { serial: 'S745', after: 2, alt: 'The rulebook with words underlined and explained' }],
  title: 'One idea at a time', art: 'S743', cast: [],
  alt: 'A student explaining a board game to a younger child, piece by piece',
  words: [
    'Start with what they know. A board, a die, a piece.',
    'Add one rule. Then the next. Define each new word when it appears.',
    'Start where the reader is and add one idea at a time.',
  ],
};
STORIES['the-first-texans'] = {
  about: 'four regions, four ways of life',
  more: [{ serial: 'S747', after: 0, alt: 'The flat coast with tall grass' }, { serial: 'S748', after: 2, alt: 'The desert mountains at sunset' }],
  title: 'Four Texases', art: 'S746', cast: [],
  alt: 'A map of Texas with four natural regions, a student pointing',
  words: [
    'The Gulf Coastal Plains, wet and flat. The North Central Plains, rolling.',
    'The Great Plains, high and dry. The Mountains and Basins, desert.',
    'Four regions, and each one grew a different way of living.',
  ],
};
STORIES['spain-and-mexico-in-texas'] = {
  about: 'three centuries, a few missions, then a door opened',
  more: [{ serial: 'S750', after: 0, alt: 'The plaza at San Antonio' }, { serial: 'S751', after: 2, alt: 'Settlers\' wagons arriving' }],
  title: 'The empty attic', art: 'S749', cast: [],
  alt: 'A mission church with a bell under a wide sky, a few houses beside it',
  words: [
    'Spain claimed Texas for three centuries and settled little. Missions from the 1690s. San Antonio in 1718.',
    'Mexico took over in 1821 and invited Americans in.',
    'More came than anyone planned for.',
  ],
};
STORIES['revolution-and-republic'] = {
  about: 'from a cannon to eighteen minutes',
  more: [{ serial: 'S753', after: 0, alt: 'The Alamo at dawn' }, { serial: 'S754', after: 2, alt: 'The republic\'s lone star flag' }],
  title: 'Come and take it', art: 'S752', cast: [],
  alt: 'A small cannon and a flag on a field, October light',
  words: [
    'Gonzales, October 1835. A cannon and a flag: come and take it.',
    'The Alamo fell in March. San Jacinto in April took eighteen minutes.',
    'Then nine years as a republic of its own.',
  ],
};
STORIES['statehood-and-civil-war'] = {
  about: 'a state, a war, and the day freedom arrived',
  more: [{ serial: 'S756', after: 0, alt: 'The Union flag raised over a courthouse' }, { serial: 'S757', after: 2, alt: 'A family hearing the news at last' }],
  title: 'Juneteenth', art: 'S755', cast: [],
  alt: 'A crowd under trees celebrating, June light',
  words: [
    'Texas joined the Union in 1845. War with Mexico followed within a year.',
    'In 1861 Texas left to join the Confederacy.',
    'On June 19, 1865, freedom reached Texas, two years after it was declared. Juneteenth.',
  ],
};
STORIES['cattle-cotton-and-oil'] = {
  about: 'three fortunes',
  more: [{ serial: 'S759', after: 0, alt: 'The cattle drive on the trail' }, { serial: 'S760', after: 2, alt: 'The gusher at Spindletop' }],
  title: 'Three fortunes', art: 'S758', cast: [],
  alt: 'A longhorn, a cotton field and an oil derrick in one landscape',
  words: [
    'Cattle walked to the Kansas railroads from 1867.',
    'Cotton filled the fields.',
    'In 1901 Spindletop blew oil a hundred feet into the air, and everything changed.',
  ],
};
STORIES['modern-texas'] = {
  about: 'from farms to skylines',
  more: [{ serial: 'S762', after: 0, alt: 'The six flags on their poles' }, { serial: 'S763', after: 2, alt: 'A highway into a city at dusk' }],
  title: 'Six flags and a skyline', art: 'S761', cast: [],
  alt: 'A city skyline with six flags in front of it',
  words: [
    'Spain, France, Mexico, the Republic, the Confederacy, the United States. Six flags.',
    'The twentieth century added a seventh thing: cities.',
    'Farms gave way to Houston and Dallas, and Texas became the second-largest state.',
  ],
};
STORIES['slope'] = {
  about: 'a gentle hill and a steep one',
  more: [{ serial: 'S765', after: 0, alt: 'The steep hill with a rise and run marked' }, { serial: 'S766', after: 2, alt: 'The gentle hill' }],
  title: 'Two hills', art: 'S764', cast: [],
  alt: 'A student on a bike at the foot of two hills, one gentle, one steep',
  words: [
    'One across, two up. Steep. Slope 2.',
    'Four across, two up. Gentle. Slope one half.',
    'Slope is rise over run. In y = mx + b, m is the slope and b is where it starts.',
  ],
};
STORIES['exponents'] = {
  about: 'a sheet of paper folded five times',
  more: [{ serial: 'S768', after: 0, alt: 'The stack of layers at the edge' }, { serial: 'S769', after: 2, alt: 'The exponent written beside the folded sheet' }],
  title: 'Five folds', art: 'S767', cast: [],
  alt: 'A student folding a sheet of paper, layers visible at the edge',
  words: [
    'Fold once: two layers. Twice: four.',
    'Five folds: 2 × 2 × 2 × 2 × 2. Thirty-two layers.',
    'An exponent counts the multiplying. 2⁵.',
  ],
};
STORIES['square-roots'] = {
  about: 'a carpet of forty-nine tiles',
  more: [{ serial: 'S771', after: 0, alt: 'The finished seven-by-seven square' }, { serial: 'S772', after: 2, alt: 'A row of seven tiles measured against the side' }],
  title: 'The square carpet', art: 'S770', cast: [],
  alt: 'A student laying square tiles into a bigger square, seven by seven',
  words: [
    'Forty-nine tiles. Lay them square.',
    'Seven by seven.',
    'A square root asks which number times itself gives this. The square root of 49 is 7.',
  ],
};
STORIES['scientific-notation'] = {
  about: 'sliding the decimal point',
  more: [{ serial: 'S774', after: 0, alt: 'The point sliding past the zeros' }, { serial: 'S775', after: 2, alt: 'The short form beside the long one' }],
  title: 'The slide', art: 'S773', cast: [],
  alt: 'A student writing a very large number and sliding a decimal point along it',
  words: [
    '3,400,000. Too many zeros.',
    'Slide the point six places. 3.4 × 10⁶.',
    'A number from 1 to 10, times a power of ten. The exponent is the number of slides.',
  ],
};
STORIES['flawed-reasoning'] = {
  about: 'the rain and the washed car',
  more: [{ serial: 'S777', after: 0, alt: 'The rain falling on the clean car' }, { serial: 'S778', after: 2, alt: 'A friendly dog that does not bite' }],
  title: 'The washed car', art: 'S776', cast: [],
  alt: 'A student washing a car, dark clouds arriving',
  words: [
    'I washed the car. It rained. Washing causes rain? False cause.',
    'All dogs I met bite, so all dogs bite. Overgeneralizing.',
    'Learn the names of the tricks and they stop working on you.',
  ],
};
STORIES['irony'] = {
  about: 'the fire station that burned',
  more: [{ serial: 'S780', after: 0, alt: 'The firefighters with their hoses aimed at their own station' }, { serial: 'S781', after: 2, alt: 'The woman soaked in the storm, smiling' }],
  title: 'The gap', art: 'S779', cast: [],
  alt: 'A fire station with smoke coming out of its own roof, firefighters staring',
  words: [
    'The fire station burned down.',
    'Great weather, she said, in the storm.',
    'Irony is a gap: expected against actual, said against meant.',
  ],
};
STORIES['allusions'] = {
  about: 'one word that told a whole story',
  more: [{ serial: 'S783', after: 0, alt: 'The friend clutching a bag of candy' }, { serial: 'S784', after: 2, alt: 'The book open to the old miser' }],
  title: 'A Scrooge', art: 'S782', cast: [],
  alt: 'A student pointing at a friend who will not share, a book on the desk',
  words: [
    'Do not be such a Scrooge, she said.',
    'One word, and the whole story of the miser came with it.',
    'An allusion borrows a whole story in a few words. It only works if the reader knows the story.',
  ],
};
STORIES['objective-summary'] = {
  about: 'a mirror, not a review',
  more: [{ serial: 'S786', after: 0, alt: 'The park gate at dusk' }, { serial: 'S787', after: 2, alt: 'The summary with a red pen striking out an opinion' }],
  title: 'The mirror', art: 'S785', cast: [],
  alt: 'A student writing a summary with a mirror drawn in the margin',
  words: [
    'The article argues that the park should close at dusk, for safety.',
    'That is all. No liked, no hated.',
    'Say what the text says, in neutral words. Leave your opinion out.',
  ],
};
STORIES['chemical-reactions'] = {
  about: 'a folded paper and a burned one',
  more: [{ serial: 'S789', after: 0, alt: 'The paper folded into a crane' }, { serial: 'S790', after: 2, alt: 'The match touching the paper' }],
  title: 'Fold or burn', art: 'S788', cast: [],
  alt: 'A student with a folded paper in one hand and ash in a dish',
  words: [
    'Fold it. Still paper. A physical change.',
    'Burn it. Ash and smoke. You cannot fold it back.',
    'A chemical change makes a new substance; a physical change does not.',
  ],
};
STORIES['scale-of-the-universe'] = {
  about: 'nesting boxes',
  more: [{ serial: 'S792', after: 0, alt: 'The smallest box open with a moon inside' }, { serial: 'S793', after: 2, alt: 'All the boxes in a row from small to huge' }],
  title: 'Nesting boxes', art: 'S791', cast: [],
  alt: 'A student opening a set of nesting boxes, each labeled with a picture',
  words: [
    'The moon circles the Earth. The Earth circles the sun.',
    'The sun is one star in the galaxy. The galaxy is one of billions.',
    'Moon, planet, solar system, galaxy, universe: each layer unimaginably bigger than the last.',
  ],
};
STORIES['speed-and-graphs'] = {
  about: 'a walk drawn as a line',
  more: [{ serial: 'S795', after: 0, alt: 'The flat part of the line and the shoe' }, { serial: 'S796', after: 2, alt: 'The steep part and the school door' }],
  title: 'The walk on paper', art: 'S794', cast: [],
  alt: 'A student drawing a distance-time graph of a walk to school',
  words: [
    'Flat: I stopped to tie my shoe.',
    'Gentle slope: strolling. Steep: running for the bell.',
    'On a distance-time graph, flat is still, sloped is moving, steeper is faster.',
  ],
};
STORIES['weathering-to-fossils'] = {
  about: 'a laundry pile and a cliff',
  more: [{ serial: 'S798', after: 0, alt: 'The striped cliff with a fossil marked low down' }, { serial: 'S799', after: 2, alt: 'The laundry pile with the oldest shirt at the bottom' }],
  title: 'The laundry pile', art: 'S797', cast: [],
  alt: 'A student comparing a pile of laundry to a photo of a striped cliff',
  words: [
    'The shirt at the bottom went in first.',
    'Rock layers pile up the same way. Deeper is older.',
    'A fossil buried deep is older than one near the top.',
  ],
};
STORIES['thesis-and-outline'] = {
  about: 'a fight worth picking',
  more: [{ serial: 'S801', after: 0, alt: 'The three reasons listed beneath' }, { serial: 'S802', after: 2, alt: 'A reason crossed out that did not hold' }],
  title: 'Pick the fight', art: 'S800', cast: [],
  alt: 'A student writing one bold sentence at the top of a page, three lines beneath',
  words: [
    'Dogs are pets. That is a topic. Nobody argues.',
    'Dogs make better pets than cats for busy families. Now someone could argue.',
    'Write the thesis first, then list the reasons. If a reason does not hold the thesis up, it is not a reason.',
  ],
};
STORIES['evidence-paragraph'] = {
  about: 'the sentence most writers skip',
  more: [{ serial: 'S804', after: 0, alt: 'The corner with cars and a child waiting' }, { serial: 'S805', after: 2, alt: 'The three colors labeled in the margin' }],
  title: 'The warrant', art: 'S803', cast: [],
  alt: 'A student with a paragraph in three colors: claim, evidence, warrant',
  words: [
    'Claim: the town needs a crosswalk here. Evidence: twelve near-misses this year.',
    'Warrant: twelve near-misses mean the next one may not miss.',
    'Claim, evidence, warrant. The warrant says why the evidence counts.',
  ],
};
STORIES['full-essay'] = {
  about: 'five paragraphs, one skeleton',
  more: [{ serial: 'S807', after: 0, alt: 'The three middle boxes filled in' }, { serial: 'S808', after: 2, alt: 'The finished essay with the thesis underlined twice' }],
  title: 'The skeleton', art: 'S806', cast: [],
  alt: 'A student with five boxes sketched, the first and last shaded',
  words: [
    'Introduction with the thesis.',
    'Three body paragraphs, one reason each.',
    'A conclusion that says the thesis again, in the light of what was shown.',
  ],
};
STORIES['founding-documents'] = {
  about: 'why, how, and what may not',
  more: [{ serial: 'S810', after: 0, alt: 'The Declaration with its signatures' }, { serial: 'S811', after: 2, alt: 'The first amendment\'s four freedoms drawn as four pictures' }],
  title: 'Three papers', art: 'S809', cast: [],
  alt: 'A student looking at three documents under glass',
  words: [
    'The Declaration, 1776: why we left.',
    'The Constitution, 1787: how we run things.',
    'The Bill of Rights, 1791: what the government may not do.',
  ],
};
STORIES['early-republic'] = {
  about: 'a new country learning to drive',
  more: [{ serial: 'S813', after: 0, alt: 'Washington leaving office' }, { serial: 'S814', after: 2, alt: 'The Louisiana territory shaded on the map' }],
  title: 'Learning to drive', art: 'S812', cast: [],
  alt: 'A student looking at a map of the United States doubling in size',
  words: [
    'Washington set the habits: two terms, then go home.',
    'Jefferson bought Louisiana in 1803 and doubled the map.',
    'The War of 1812 proved the country could survive a fight.',
  ],
};
STORIES['sectional-crisis'] = {
  about: 'every new state a coin toss',
  more: [{ serial: 'S816', after: 0, alt: 'The map with the line of 1820 drawn across' }, { serial: 'S817', after: 2, alt: 'Lincoln\'s election on a newspaper front' }],
  title: 'The coin toss', art: 'S815', cast: [],
  alt: 'A student with a map of the states in two colors, a coin on the table',
  words: [
    'Every new state: slave or free? Compromises in 1820, 1850 and 1854 kept the score even.',
    'In 1860 Lincoln won without a single Southern state.',
    'The South left, and the compromises were over.',
  ],
};
STORIES['reconstruction'] = {
  about: 'three promises, and a century to keep them',
  more: [{ serial: 'S819', after: 0, alt: 'A voter at a ballot box in 1870' }, { serial: 'S820', after: 2, alt: 'A march a century later' }],
  title: 'Three promises', art: 'S818', cast: [],
  alt: 'A student reading three amendments on a poster',
  words: [
    'The 13th: no more slavery. The 14th: everyone born here is a citizen.',
    'The 15th: no one loses the vote for their race.',
    'Three promises in five years. Keeping them took a century.',
  ],
};
// Grades 9 and 10, told for readers.
STORIES['multi-step-equations'] = {
  about: 'laundry sorted into two baskets',
  more: [{ serial: 'S822', after: 0, alt: 'One basket filling up, the other emptying' }, { serial: 'S823', after: 2, alt: 'The equation solved beside the folded socks' }],
  title: 'Sorting laundry', art: 'S821', cast: [],
  alt: 'A teenager sorting socks into two baskets on a bed, an equation on a notebook beside',
  words: [
    'Socks on both sides of the bed. Gather them on one side. 5x + 3 = 2x + 15.',
    'Take 2x from both sides. Take 3 from both. 3x = 12.',
    'Divide by 3. x = 4. Whatever the shape of the equation, the moves are the same.',
  ],
};
STORIES['functions'] = {
  about: 'a vending machine that never lied',
  more: [{ serial: 'S825', after: 0, alt: 'The snack dropping into the tray' }, { serial: 'S826', after: 2, alt: 'A table of buttons and snacks on the machine' }],
  title: 'The vending machine', art: 'S824', cast: [],
  alt: 'A teenager at a vending machine pressing a button, a snack dropping',
  words: [
    'Press 3. Get a pretzel. Every single time.',
    'The rule inside is f(x) = 2x + 1. Press 3, get 7.',
    'One input, one output, always. One button never gives two different snacks.',
  ],
};
STORIES['systems-of-equations'] = {
  about: 'two clues, one pair of numbers',
  more: [{ serial: 'S828', after: 0, alt: 'The two notes side by side' }, { serial: 'S829', after: 2, alt: 'The pair written large: 3 and 2' }],
  title: 'Two clues', art: 'S827', cast: [],
  alt: 'A teenager with two sticky notes on a desk, each with a clue',
  words: [
    'Two numbers add to 5. That is one clue. Their difference is 1. That is the other.',
    'Only 3 and 2 fit both.',
    'Substitute one equation into the other and solve. Two clues, one answer.',
  ],
};
STORIES['factoring'] = {
  about: 'un-multiplying a rectangle',
  more: [{ serial: 'S831', after: 0, alt: 'The tiles split into two strips' }, { serial: 'S832', after: 2, alt: 'The two factors labeled on the sides' }],
  title: 'The rectangle undone', art: 'S830', cast: [],
  alt: 'A teenager with algebra tiles arranged in a rectangle',
  words: [
    'x² + 5x + 6 came from a rectangle: (x + 2) by (x + 3).',
    'Two numbers that multiply to 6 and add to 5: 2 and 3.',
    'Factoring is un-multiplying. Find the pair, and the rectangle appears.',
  ],
};
STORIES['exponential-growth'] = {
  about: 'a rumor that doubled',
  more: [{ serial: 'S834', after: 0, alt: 'The whisper spreading in a tree shape' }, { serial: 'S835', after: 2, alt: 'A graph curving up beside a flat line' }],
  title: 'The rumor', art: 'S833', cast: [],
  alt: 'A hallway with one student whispering to two, who each turn to two more',
  words: [
    'One person told two. They told four. Then eight.',
    'After ten rounds: a thousand people. Adding two each round would have reached twenty-one.',
    'Adding the same amount each step is linear. Multiplying is exponential.',
  ],
};
STORIES['rhetorical-appeals'] = {
  about: 'three ways to sell a bicycle',
  more: [{ serial: 'S837', after: 0, alt: 'A friend pointing at the gears' }, { serial: 'S838', after: 2, alt: 'The bicycle sold, a handshake' }],
  title: 'Selling the bicycle', art: 'S836', cast: [],
  alt: 'A teenager holding a bicycle for sale, three friends offering different pitches',
  words: [
    'Trust me, I have ridden it for years. Ethos.',
    'Imagine the wind on the hill. Pathos. It has twenty-one gears and new brakes. Logos.',
    'Ethos is credibility, pathos is feeling, logos is reason. Good arguments use the one that fits.',
  ],
};
STORIES['theme-development'] = {
  about: 'a character who changed her mind',
  more: [{ serial: 'S840', after: 0, alt: 'The character alone at the start' }, { serial: 'S841', after: 2, alt: 'The key passed across a table' }],
  title: 'The seed and the tree', art: 'S839', cast: [],
  alt: 'A teenager reading a novel, two sticky notes: page one, last page',
  words: [
    'Page one: she trusted no one.',
    'Last page: she handed him the key.',
    'A theme grows through a text. Track what changes between the first page and the last.',
  ],
};
STORIES['word-choice-effect'] = {
  about: 'sprinted, or ran',
  more: [{ serial: 'S843', after: 0, alt: 'A figure sprinting, blurred' }, { serial: 'S844', after: 2, alt: 'The two sentences side by side' }],
  title: 'The swap', art: 'S842', cast: [],
  alt: 'A teenager crossing out a word in a sentence and writing a plainer one',
  words: [
    'She sprinted to the door. Swap it: she ran to the door.',
    'What was lost? The speed. The fear.',
    'Swap the word for a plainer one. What is lost is what the writer\'s word was doing.',
  ],
};
STORIES['credible-sources'] = {
  about: 'a website with no name on it',
  more: [{ serial: 'S846', after: 0, alt: 'The page with its author line highlighted' }, { serial: 'S847', after: 2, alt: 'The blank page with question marks' }],
  title: 'Who wrote this?', art: 'S845', cast: [],
  alt: 'A teenager at a laptop looking at two pages, one with an author and date, one without',
  words: [
    'This page had an author, a date, and sources you could follow.',
    'That page had none of them. A rumor with a website.',
    'A credible source shows its work.',
  ],
};
STORIES['punnett-squares'] = {
  about: 'a raffle with four tickets',
  more: [{ serial: 'S849', after: 0, alt: 'The square filled in' }, { serial: 'S850', after: 2, alt: 'A family with one blue-eyed child' }],
  title: 'Four tickets', art: 'S848', cast: [],
  alt: 'A teenager drawing a two-by-two square on paper, a brown-eyed and a blue-eyed parent sketched',
  words: [
    'Each parent gives one card at random. Two Bb parents.',
    'Four tickets: BB, Bb, Bb, bb.',
    'Three show brown, one shows blue. A one in four chance of blue eyes.',
  ],
};
STORIES['respiration-and-photosynthesis'] = {
  about: 'a leaf and a lung, running opposite ways',
  more: [{ serial: 'S852', after: 0, alt: 'The leaf in sunlight' }, { serial: 'S853', after: 2, alt: 'A runner breathing hard' }],
  title: 'The leaf and the lung', art: 'S851', cast: [],
  alt: 'A leaf and a pair of lungs drawn facing each other with arrows between',
  words: [
    'The leaf takes carbon dioxide and water and makes sugar and oxygen.',
    'The lung takes that oxygen, the cells burn the sugar, and out come carbon dioxide and water.',
    'Photosynthesis and respiration run in opposite directions.',
  ],
};
STORIES['evidence-for-evolution'] = {
  about: 'three witnesses telling the same story',
  more: [{ serial: 'S855', after: 0, alt: 'The three limbs side by side' }, { serial: 'S856', after: 2, alt: 'Two DNA strands with matching letters' }],
  title: 'Three witnesses', art: 'S854', cast: [],
  alt: 'A teenager with three cards: a fossil, a bone diagram, a DNA strand',
  words: [
    'Fossils show older forms.',
    'An arm, a flipper and a wing share one bone plan. DNA shows close relatives share more letters.',
    'Fossils, homologous structures and DNA are separate lines of evidence pointing the same way.',
  ],
};
STORIES['cell-division'] = {
  about: 'a recipe book, copied two ways',
  more: [{ serial: 'S858', after: 0, alt: 'The full copy and the half copy' }, { serial: 'S859', after: 2, alt: 'Two half-books joined' }],
  title: 'Copying the book', art: 'S857', cast: [],
  alt: 'A teenager at a copier with a thick book, two stacks of pages',
  words: [
    'Mitosis photocopies all forty-six pages. A new cell just like the old.',
    'Meiosis makes a half-book of twenty-three.',
    'Two half-books from two parents make a whole.',
  ],
};
STORIES['protein-synthesis'] = {
  about: 'the recipe that never leaves the library',
  more: [{ serial: 'S861', after: 0, alt: 'The photocopy in hand' }, { serial: 'S862', after: 2, alt: 'A kitchen with the dish made' }],
  title: 'The library recipe', art: 'S860', cast: [],
  alt: 'A teenager in a library copying one page from a reference book that cannot be checked out',
  words: [
    'DNA is the book that never leaves the nucleus.',
    'RNA is a photocopy of one recipe. Transcription.',
    'The ribosome reads the copy and cooks the protein. Translation.',
  ],
};
STORIES['carbon-and-nitrogen-cycles'] = {
  about: 'a carbon atom that never got off the bus',
  more: [{ serial: 'S864', after: 0, alt: 'The rabbit eating the leaf' }, { serial: 'S865', after: 2, alt: 'The atom back in the air above the field' }],
  title: 'The bus that never stops', art: 'S863', cast: [],
  alt: 'A bus drawn on a loop through air, a leaf, a rabbit and soil',
  words: [
    'A carbon atom rode the air. A leaf picked it up.',
    'A rabbit ate the leaf. The rabbit breathed it out. Back on the bus.',
    'Carbon and nitrogen circle between air, soil, water and living things, never used up.',
  ],
};
STORIES['homeostasis'] = {
  about: 'a body that works like a thermostat',
  more: [{ serial: 'S867', after: 0, alt: 'The runner shivering in the shade afterward' }, { serial: 'S868', after: 2, alt: 'The loop drawn: sense, undo, stop' }],
  title: 'The thermostat', art: 'S866', cast: [],
  alt: 'A teenager on a run, sweating, a thermostat drawn beside',
  words: [
    'Too hot: sweat. The sweat cools.',
    'Too cold: shiver. The shivering warms. Then stop.',
    'Homeostasis keeps the inside steady by negative feedback: sense the change, undo it, stop.',
  ],
};
STORIES['analysis-paragraph'] = {
  about: 'the sentence after the quote',
  more: [{ serial: 'S870', after: 0, alt: 'The quotation copied out' }, { serial: 'S871', after: 2, alt: 'The explaining sentence underlined' }],
  title: 'After the quote', art: 'S869', cast: [],
  alt: 'A teenager writing under a quotation, an arrow from the quote to the next line',
  words: [
    'Claim: the narrator is lonely.',
    'Quote: "the house held its breath."',
    'Then the sentence that says what the quote shows: even the house feels empty to him. The quote never speaks for itself.',
  ],
};
STORIES['narrative-with-a-turn'] = {
  about: 'the moment the phone rang',
  more: [{ serial: 'S873', after: 0, alt: 'The phone ringing, everyone frozen' }, { serial: 'S874', after: 2, alt: 'The last line of the story, quiet' }],
  title: 'The turn', art: 'S872', cast: [],
  alt: 'A teenager writing, a phone drawn in the margin',
  words: [
    'Everything was ordinary. Dinner, homework.',
    'Then the phone rang. Slow down here.',
    'Build toward a turn, slow down at it, and let the ending show what the turn changed.',
  ],
};
STORIES['rhetorical-analysis'] = {
  about: 'a speech taken apart',
  more: [{ serial: 'S876', after: 0, alt: 'The speech highlighted in three colors' }, { serial: 'S877', after: 2, alt: 'The three questions answered in the margin' }],
  title: 'Taking a speech apart', art: 'S875', cast: [],
  alt: 'A teenager with a printed speech, three colored highlighters',
  words: [
    'What does it argue? Fund the library.',
    'Which appeals? A librarian\'s credibility, a child\'s story, the numbers.',
    'Do the appeals fit the claim? Yes. That is a rhetorical analysis.',
  ],
};
STORIES['the-shape-of-the-earth'] = {
  about: 'a cracked shell on a soft egg',
  more: [{ serial: 'S879', after: 0, alt: 'Two shell pieces pushed into a ridge' }, { serial: 'S880', after: 2, alt: 'A map with plate edges drawn' }],
  title: 'The cracked shell', art: 'S878', cast: [],
  alt: 'A teenager holding a hard-boiled egg with a cracked shell',
  words: [
    'The shell is cracked into pieces. Plates.',
    'Where pieces push together, they crumple. Mountains. Where they scrape past, the ground shakes.',
    'The earth\'s crust is broken into plates, and mountains, quakes and volcanoes happen at the edges.',
  ],
};
STORIES['climate-and-biomes'] = {
  about: 'three dials that set a climate',
  more: [{ serial: 'S882', after: 0, alt: 'A rainforest at one setting' }, { serial: 'S883', after: 2, alt: 'A tundra at another' }],
  title: 'Three dials', art: 'S881', cast: [],
  alt: 'A teenager turning three dials on a drawn control panel labeled with pictures',
  words: [
    'How far from the equator. How high up. How close to the sea.',
    'Turn them and you get rainforest, desert or tundra.',
    'Latitude, elevation and nearness to water decide climate. A biome is what lives there.',
  ],
};
STORIES['reading-maps'] = {
  about: 'a map as a shrunken photograph',
  more: [{ serial: 'S885', after: 0, alt: 'The ruler on the map' }, { serial: 'S886', after: 2, alt: 'The campsite symbol in the key' }],
  title: 'The shrunken photograph', art: 'S884', cast: [],
  alt: 'A teenager with a hiking map, a ruler laid across it',
  words: [
    'One centimeter on the map. Ten kilometers on the ground. Scale.',
    'The key says the little tent means a campsite. The compass says which way is north.',
    'Scale turns a distance on the map into a distance you would walk.',
  ],
};
STORIES['people-and-places'] = {
  about: 'a city block and a ranch',
  more: [{ serial: 'S888', after: 0, alt: 'The city block from above' }, { serial: 'S889', after: 2, alt: 'The ranch from above' }],
  title: 'The block and the ranch', art: 'S887', cast: [],
  alt: 'A teenager with two photos: a crowded city block, a wide ranch',
  words: [
    'Two thousand people on one block. Density high.',
    'Ten people on a ranch of a thousand acres. Density low.',
    'Density is people divided by area. Natural increase is births minus deaths.',
  ],
};
STORIES['resources-and-work'] = {
  about: 'a paycheck and a jar of coins',
  more: [{ serial: 'S891', after: 0, alt: 'A wind turbine and a young forest' }, { serial: 'S892', after: 2, alt: 'An oil barrel, half empty' }],
  title: 'Paycheck and jar', art: 'S890', cast: [],
  alt: 'A teenager with a paycheck in one hand and a jar of coins in the other',
  words: [
    'Trees regrow. Wind keeps blowing. A paycheck that keeps coming. Renewable.',
    'Oil and coal: a jar of coins. Spend it and it is gone.',
    'Renewable resources come back, and nonrenewable ones do not.',
  ],
};
STORIES['regions-of-the-world'] = {
  about: 'a map drawn with eyes closed',
  more: [{ serial: 'S894', after: 0, alt: 'The rough sketch with the Mediterranean labeled' }, { serial: 'S895', after: 2, alt: 'The sketch compared to a real map' }],
  title: 'The map in your head', art: 'S893', cast: [],
  alt: 'A teenager drawing a world map from memory on a whiteboard',
  words: [
    'Where is Egypt? Which sea is between Italy and Africa?',
    'A geographer can sketch it with eyes closed.',
    'A geographer carries a mental map of countries, capitals and features. The point is that you can too.',
  ],
};
STORIES['angle-relationships'] = {
  about: 'two sticks crossed on a table',
  more: [{ serial: 'S897', after: 0, alt: 'The bow tie pair shaded' }, { serial: 'S898', after: 2, alt: 'The two angles on one stick labeled' }],
  title: 'Two sticks', art: 'S896', cast: [],
  alt: 'A teenager crossing two sticks on a table, angles marked with chalk',
  words: [
    'Cross two sticks. The angles across from each other match. A bow tie.',
    'Angles side by side on one stick add to 180.',
    'A straight stick is half a turn. Opposite angles equal; angles on a line add to 180.',
  ],
};
STORIES['similar-triangles'] = {
  about: 'a photo and its enlargement',
  more: [{ serial: 'S900', after: 0, alt: 'The two triangles side by side' }, { serial: 'S901', after: 2, alt: 'The scale factor written between' }],
  title: 'The enlargement', art: 'S899', cast: [],
  alt: 'A teenager holding a small photo of a triangle sign next to a poster-sized print',
  words: [
    'Same shape, every length multiplied by the same number.',
    'The 3-4-5 triangle, three times bigger: 9-12-15.',
    'Same angles means the same shape. Find the scale factor and every side follows.',
  ],
};
STORIES['transformations'] = {
  about: 'a picture moved on a wall',
  more: [{ serial: 'S903', after: 0, alt: 'The picture and its mirror image' }, { serial: 'S904', after: 2, alt: 'The picture turned a quarter' }],
  title: 'Moving the picture', art: 'S902', cast: [],
  alt: 'A teenager sliding, flipping and turning a framed picture on a wall grid',
  words: [
    'Slide it: add to the coordinates.',
    'Flip it across the mirror: change the sign of x. (2, 3) becomes (-2, 3).',
    'Turn it a quarter: swap and flip. Translate, reflect, rotate.',
  ],
};
STORIES['right-triangle-trig'] = {
  about: 'standing at the corner',
  more: [{ serial: 'S906', after: 0, alt: 'The three sides labeled from the corner' }, { serial: 'S907', after: 2, alt: 'The three ratios written in chalk' }],
  title: 'At the corner', art: 'S905', cast: [],
  alt: 'A teenager standing at the corner of a right triangle chalked on a playground',
  words: [
    'Across from me: opposite. Beside me: adjacent. The long slant: hypotenuse.',
    'Sine is across over slant. Cosine is next over slant.',
    'Tangent is across over next. Stand at the angle and the names follow.',
  ],
};
STORIES['arcs-and-sectors'] = {
  about: 'a quarter of a pizza',
  more: [{ serial: 'S909', after: 0, alt: 'The slice held up' }, { serial: 'S910', after: 2, alt: 'The fraction written on the box' }],
  title: 'The quarter slice', art: 'S908', cast: [],
  alt: 'A teenager cutting a pizza into a ninety-degree slice',
  words: [
    'Ninety degrees. A quarter of the pizza.',
    'A quarter of the crust. A quarter of the area.',
    'Angle over 360 is the fraction of the circle. Multiply it by the circumference or the area.',
  ],
};
STORIES['spotting-bias'] = {
  about: 'true facts with the middle missing',
  more: [{ serial: 'S912', after: 0, alt: 'The article with holes cut in it' }, { serial: 'S913', after: 2, alt: 'A list of the missing facts' }],
  title: 'The missing middle', art: 'S911', cast: [],
  alt: 'A teenager reading an article with a gap drawn through it',
  words: [
    'Every fact in the article was true.',
    'The facts that would change the picture were missing. Loaded words filled the gap.',
    'Bias is a lean, not a lie. Look for missing facts and loaded words.',
  ],
};
STORIES['paraphrasing'] = {
  about: 'the same cargo in a different truck',
  more: [{ serial: 'S915', after: 0, alt: 'The boxes counted in both trucks' }, { serial: 'S916', after: 2, alt: 'The two versions side by side' }],
  title: 'The same cargo', art: 'S914', cast: [],
  alt: 'Two trucks drawn side by side, the same boxes in each',
  words: [
    'A paraphrase moves the cargo to a new truck. Every box rides along.',
    'Nothing new climbs in.',
    'A paraphrase keeps every fact and adds none. Check it against the original line by line.',
  ],
};
STORIES['complex-characters'] = {
  about: 'a character who wanted two things',
  more: [{ serial: 'S918', after: 0, alt: 'The character at a crossroads' }, { serial: 'S919', after: 2, alt: 'The two arrows on the sketch' }],
  title: 'Two wants', art: 'S917', cast: [],
  alt: 'A teenager reading, a character sketched with two arrows pulling opposite ways',
  words: [
    'She wanted to be honest. She wanted to be liked.',
    'The two pulled against each other. That was the story.',
    'A complex character wants two things that pull against each other.',
  ],
};
STORIES['symbols'] = {
  about: 'a green light mentioned four times',
  more: [{ serial: 'S921', after: 0, alt: 'The light seen across the water' }, { serial: 'S922', after: 2, alt: 'The four page numbers listed' }],
  title: 'The green light', art: 'S920', cast: [],
  alt: 'A teenager underlining the same phrase on four pages of a novel',
  words: [
    'A green light across the water. Page 21. Page 92. Page 180.',
    'A writer does not mention a light four times because of the light.',
    'A symbol is a thing that stands for an idea. Repetition is the clue.',
  ],
};
STORIES['ionic-and-covalent'] = {
  about: 'two ways to share a toy',
  more: [{ serial: 'S924', after: 0, alt: 'The ball handed over' }, { serial: 'S925', after: 2, alt: 'The ball held by both' }],
  title: 'Two ways to share', art: 'S923', cast: [],
  alt: 'Two pairs of children with a ball: one handing it over, one holding it together',
  words: [
    'Sodium hands its electron to chlorine. They stick because opposites attract. Ionic.',
    'Two hydrogens and an oxygen hold their electrons in the middle. Covalent.',
    'Ionic bonds give electrons; covalent bonds share them.',
  ],
};
STORIES['balancing-equations'] = {
  about: 'bricks in, bricks out',
  more: [{ serial: 'S927', after: 0, alt: 'The bricks before' }, { serial: 'S928', after: 2, alt: 'The bricks after, rearranged' }],
  title: 'The same bricks', art: 'S926', cast: [],
  alt: 'A teenager with plastic bricks arranged as molecules on a table',
  words: [
    'Two H₂ and one O₂: four hydrogen bricks, two oxygen bricks.',
    'Rearrange. Two H₂O. Four hydrogens, two oxygens.',
    'Balanced means every atom counted the same on both sides. No brick appears or vanishes.',
  ],
};
STORIES['acids-and-bases'] = {
  about: 'lemon juice, soap and water',
  more: [{ serial: 'S930', after: 0, alt: 'The pH strip dipped in lemon juice, red' }, { serial: 'S931', after: 2, alt: 'The strip in soapy water, blue' }],
  title: 'Lemon, soap, water', art: 'S929', cast: [],
  alt: 'Three cups on a table: lemon juice, soapy water, plain water, pH strips beside',
  words: [
    'Lemon juice bites. Below 7. Acid.',
    'Soap feels slippery. Above 7. Base.',
    'Water is neither. 7. Neutral. Each step on the scale is ten times stronger.',
  ],
};
STORIES['moles-and-molar-mass'] = {
  about: 'a dozen for chemists',
  more: [{ serial: 'S933', after: 0, alt: 'The two dozens on the scale' }, { serial: 'S934', after: 2, alt: 'Two beakers labeled by mass' }],
  title: 'A dozen for chemists', art: 'S932', cast: [],
  alt: 'A teenager weighing a dozen eggs and a dozen grapes on a scale',
  words: [
    'A dozen eggs weighs more than a dozen grapes. Same count, different mass.',
    'A mole is a dozen for chemists, only much bigger.',
    'A mole of water, 18 grams, weighs more than a mole of hydrogen, 2 grams.',
  ],
};
STORIES['reaction-types'] = {
  about: 'snapping together, splitting apart',
  more: [{ serial: 'S936', after: 0, alt: 'The two blocks joined' }, { serial: 'S937', after: 2, alt: 'A block swapping partners' }],
  title: 'Snap and split', art: 'S935', cast: [],
  alt: 'A teenager snapping two blocks together, then pulling one apart',
  words: [
    'A and B snap into AB. Synthesis.',
    'AB splits into A and B. Decomposition, the same picture run backward.',
    'Synthesis joins, decomposition splits, replacement swaps a partner.',
  ],
};
STORIES['gas-laws'] = {
  about: 'squeezing a balloon',
  more: [{ serial: 'S939', after: 0, alt: 'The balloon at full size' }, { serial: 'S940', after: 2, alt: 'The balloon squeezed small' }],
  title: 'The balloon', art: 'S938', cast: [],
  alt: 'A teenager squeezing a balloon between two hands',
  words: [
    'Squeeze the balloon. It pushes back harder.',
    'Halve its space and its pressure doubles.',
    'The same particles hit the walls twice as often. Squeeze a gas and its pressure rises.',
  ],
};
STORIES['concentration'] = {
  about: 'how strong the lemonade is',
  more: [{ serial: 'S942', after: 0, alt: 'The spoons counted' }, { serial: 'S943', after: 2, alt: 'The two glasses, equally sweet' }],
  title: 'Strong lemonade', art: 'S941', cast: [],
  alt: 'A teenager stirring sugar into two glasses of lemonade',
  words: [
    'Four spoons of sugar in two glasses. Two spoons per glass.',
    'Moles per liter is the same idea.',
    'Molarity is moles of solute divided by liters of solution. How much stuff in how much water.',
  ],
};
STORIES['literary-analysis'] = {
  about: 'a thesis about the whole book',
  more: [{ serial: 'S945', after: 0, alt: 'Three sticky notes in three colors' }, { serial: 'S946', after: 2, alt: 'The thesis written across the top of a page' }],
  title: 'The whole book', art: 'S944', cast: [],
  alt: 'A teenager with a novel bristling with sticky notes at the beginning, middle and end',
  words: [
    'A claim someone could dispute: the house is the real villain.',
    'Quotations from page 3, page 150, page 300.',
    'A sentence after each quotation saying what it shows. One scene proves a moment; three prove a pattern.',
  ],
};
STORIES['sourced-argument'] = {
  about: 'an argument that named its sources',
  more: [{ serial: 'S948', after: 0, alt: 'A citation written after a sentence' }, { serial: 'S949', after: 2, alt: 'The list of sources at the end' }],
  title: 'Named sources', art: 'S947', cast: [],
  alt: 'A teenager writing with three books open and a citation after each fact',
  words: [
    'Every fact had a name behind it.',
    'The reader could check each one.',
    'Every piece of evidence names its source. That is what separates an argument from an opinion with confidence.',
  ],
};
STORIES['reflective-essay'] = {
  about: 'before and after, and the gap between',
  more: [{ serial: 'S951', after: 0, alt: 'The counter with a customer smiling' }, { serial: 'S952', after: 2, alt: 'The two columns filled in' }],
  title: 'The gap', art: 'S950', cast: [],
  alt: 'A teenager writing, two columns on the page: before, after',
  words: [
    'Before: I thought the job was about money.',
    'After: it was about the people at the counter.',
    'Tell what happened, then what it meant. The gap between what you believed before and after is the essay.',
  ],
};
STORIES['ancient-civilizations'] = {
  about: 'a river that flooded on schedule',
  more: [{ serial: 'S954', after: 0, alt: 'A granary with clay tablets' }, { serial: 'S955', after: 2, alt: 'A scribe pressing marks into clay' }],
  title: 'The river that flooded', art: 'S953', cast: [],
  alt: 'A river flooding fields, farmers watching from a hill',
  words: [
    'The river flooded. The soil was rich. There was extra grain.',
    'Extra grain let some people stop farming: priests, builders, scribes.',
    'Counting the grain invented writing. Civilization began on flooding rivers.',
  ],
};
STORIES['greece-and-rome'] = {
  about: 'everyone votes, then some vote, then one rules',
  more: [{ serial: 'S957', after: 0, alt: 'The assembly on a hillside' }, { serial: 'S958', after: 2, alt: 'The senate in session' }],
  title: 'Three ways to run a city', art: 'S956', cast: [],
  alt: 'A drawing of an Athenian assembly, a Roman senate and an emperor on a throne',
  words: [
    'Athens: every citizen voted on everything. Direct democracy.',
    'Rome: elected representatives. A republic.',
    'Rome grew so large that one man, an emperor, took over.',
  ],
};
STORIES['middle-ages-and-renaissance'] = {
  about: 'land for loyalty, then a plague',
  more: [{ serial: 'S960', after: 0, alt: 'The knight kneeling before the lord' }, { serial: 'S961', after: 2, alt: 'A market with more coins changing hands after the plague' }],
  title: 'Land and plague', art: 'S959', cast: [],
  alt: 'A castle on a hill with fields below, a lord and a knight at the gate',
  words: [
    'After Rome fell, land was the only wealth. A lord gave land for loyalty; a knight gave service for land.',
    'The Black Death of 1347 killed a third of Europe.',
    'The survivors\' wages rose, and the old order cracked.',
  ],
};
STORIES['age-of-revolutions'] = {
  about: 'one idea, three revolutions',
  more: [{ serial: 'S963', after: 0, alt: 'The Declaration signed' }, { serial: 'S964', after: 2, alt: 'Haiti\'s flag raised' }],
  title: 'One idea', art: 'S962', cast: [],
  alt: 'Three flags being raised in three places: America, France, Haiti',
  words: [
    'The Enlightenment said rights come first and governments from consent.',
    'America tried it in 1776. France in 1789. Haiti in 1804.',
    'One idea, three revolutions, three different endings.',
  ],
};
STORIES['world-wars'] = {
  about: 'twenty years apart',
  more: [{ serial: 'S966', after: 0, alt: 'Trenches in 1916' }, { serial: 'S967', after: 2, alt: 'A treaty table in 1919' }],
  title: 'Twenty years', art: 'S965', cast: [],
  alt: 'A timeline on a classroom wall from 1914 to 1945, a student pointing at the gap',
  words: [
    '1914 to 1918. Then a peace so harsh it planted the next war.',
    '1939 to 1945. Far worse.',
    'The First World War made the peace that made the Second.',
  ],
};
// Grades 11 and 12, told for readers.
STORIES['quadratic-formula'] = {
  about: 'a machine that finds where the arch touches the ground',
  more: [{ serial: 'S969', after: 0, alt: 'The formula written beside the arch' }, { serial: 'S970', after: 2, alt: 'A parabola that never touches the floor' }],
  title: 'The arch', art: 'S968', cast: [],
  alt: 'A teenager sketching a parabola over a doorway, two points marked where it meets the floor',
  words: [
    'The arch crossed the floor in two places. Where?',
    'Feed a, b and c into the formula. Out come the two crossings.',
    'The part under the root says first whether there are two, one or none.',
  ],
};
STORIES['multiplying-binomials'] = {
  about: 'a garden bed with four patches',
  more: [{ serial: 'S972', after: 0, alt: 'The four patches labeled' }, { serial: 'S973', after: 2, alt: 'The sum written on a stake' }],
  title: 'Four patches', art: 'S971', cast: [],
  alt: 'A rectangular garden bed split into four patches with a string, a teenager measuring',
  words: [
    'The bed was x + 1 wide and x + 4 tall. Four patches.',
    'x², 4x, x and 4.',
    'Every piece of the first bracket multiplies every piece of the second. Add the patches: x² + 5x + 4.',
  ],
};
STORIES['sequences'] = {
  about: 'a staircase with even steps',
  more: [{ serial: 'S975', after: 0, alt: 'The rises marked on the stairs' }, { serial: 'S976', after: 2, alt: 'A second staircase that doubles' }],
  title: 'The staircase', art: 'S974', cast: [],
  alt: 'A teenager on a staircase, each step the same height, counting',
  words: [
    'Three, five, seven, nine. Each step adds two.',
    'The fifth step: the first plus four rises. 3 + 4 × 2 = 11.',
    'Arithmetic: add the same amount each time. Geometric: multiply by the same amount.',
  ],
};
STORIES['logarithms'] = {
  about: 'how many doublings',
  more: [{ serial: 'S978', after: 0, alt: 'The strip at thirty-two layers' }, { serial: 'S979', after: 2, alt: 'The equation written on the strip' }],
  title: 'How many doublings', art: 'S977', cast: [],
  alt: 'A teenager folding a paper strip and counting layers',
  words: [
    'Two doublings make four. Five make thirty-two.',
    'So log₂ 32 = 5.',
    'A logarithm is the exponent you were looking for.',
  ],
};
STORIES['absolute-value'] = {
  about: 'four steps from three',
  more: [{ serial: 'S981', after: 0, alt: 'The teenager at 7' }, { serial: 'S982', after: 2, alt: 'The teenager at -1' }],
  title: 'Four steps', art: 'S980', cast: [],
  alt: 'A number line chalked on a sidewalk, a teenager standing at 3',
  words: [
    'Four steps from 3. Which way?',
    'Right: 7. Left: -1.',
    'Absolute value is distance from zero, and distance has no direction. Two answers, always.',
  ],
};
STORIES['counterclaims'] = {
  about: 'the objection that got there first',
  more: [{ serial: 'S984', after: 0, alt: 'The opponent nodding' }, { serial: 'S985', after: 2, alt: 'The cost chart over three years' }],
  title: 'Getting there first', art: 'S983', cast: [],
  alt: 'A teenager at a debate table, the opponent\'s card already on the table',
  words: [
    'Some say the plan costs too much.',
    'It does cost more up front. It pays for itself in three years.',
    'Name the best objection, then answer it. A rebuttal that hides the objection loses.',
  ],
};
STORIES['satire'] = {
  about: 'praise with a straight face',
  more: [{ serial: 'S987', after: 0, alt: 'The phone dead on the table at noon' }, { serial: 'S988', after: 2, alt: 'The ad with a deadpan slogan and no words' }],
  title: 'The straight face', art: 'S986', cast: [],
  alt: 'A teenager reading a mock advertisement praising a terrible product',
  words: [
    'The ad praised the phone that dies at noon. Best phone ever.',
    'Nobody meant it. That was the point.',
    'Satire criticizes by exaggerating in a straight face. Find the exaggeration and you find the target.',
  ],
};
STORIES['sentence-structure'] = {
  about: 'a long sentence, then a short one',
  more: [{ serial: 'S990', after: 0, alt: 'The path down the hill' }, { serial: 'S991', after: 2, alt: 'The door, closed' }],
  title: 'Long, then short', art: 'S989', cast: [],
  alt: 'A teenager writing, one long line, then one word on its own',
  words: [
    'The long sentence carried the reader down the hill, past the barn, through the gate, to the door.',
    'Stop.',
    'Long sentences flow and build. Short sentences stop. Writers switch between them on purpose.',
  ],
};
STORIES['enough-evidence'] = {
  about: 'a big claim on a small pile',
  more: [{ serial: 'S993', after: 0, alt: 'The big sign leaning on the small pile' }, { serial: 'S994', after: 2, alt: 'A taller pile beside it' }],
  title: 'The small pile', art: 'S992', cast: [],
  alt: 'A teenager holding a large sign next to a tiny stack of papers',
  words: [
    'Relevant: is the evidence about the claim?',
    'Sufficient: is there enough of it?',
    'A big claim needs a big pile. Two different questions.',
  ],
};
STORIES['energy-kinds'] = {
  about: 'a ball held high, then dropped',
  more: [{ serial: 'S996', after: 0, alt: 'The ball at the top of its drop' }, { serial: 'S997', after: 2, alt: 'The ball a blur near the ground' }],
  title: 'Held, then dropped', art: 'S995', cast: [],
  alt: 'A teenager holding a ball above the ground, then the ball falling',
  words: [
    'Held high: stored energy. Potential.',
    'Falling: moving energy. Kinetic.',
    'Double the speed and the kinetic energy quadruples, because speed is squared.',
  ],
};
STORIES['waves'] = {
  about: 'a rope shaken at one end',
  more: [{ serial: 'S999', after: 0, alt: 'Long slow waves on the rope' }, { serial: 'S1000', after: 2, alt: 'Short fast waves on the rope' }],
  title: 'The rope', art: 'S998', cast: [],
  alt: 'A teenager shaking a rope tied to a fence, waves running along it',
  words: [
    'Crest to crest: the wavelength. How tall: the amplitude.',
    'How many crests a second: the frequency.',
    'Speed equals wavelength times frequency. Shake faster and the waves get shorter.',
  ],
};
STORIES['electricity'] = {
  about: 'a water pipe',
  more: [{ serial: 'S1002', after: 0, alt: 'The hose pinched, the flow thin' }, { serial: 'S1003', after: 2, alt: 'The hose open, the flow full' }],
  title: 'The pipe', art: 'S1001', cast: [],
  alt: 'A garden hose with a pump, a teenager watching the flow',
  words: [
    'The pump pushes: voltage. The pipe narrows: resistance.',
    'How much flows: current.',
    'Voltage equals current times resistance. Push harder or widen the pipe and more flows.',
  ],
};
STORIES['momentum'] = {
  about: 'a bike and a truck at the same speed',
  more: [{ serial: 'S1005', after: 0, alt: 'The truck\'s long stopping distance drawn' }, { serial: 'S1006', after: 2, alt: 'Two carts colliding on a track' }],
  title: 'The bike and the truck', art: 'S1004', cast: [],
  alt: 'A cyclist and a truck side by side at a light',
  words: [
    'Same speed. Far more mass in the truck.',
    'Far more momentum. Far harder to stop.',
    'Momentum is mass times velocity. In a collision it is passed along, never lost.',
  ],
};
STORIES['work-and-power'] = {
  about: 'the same box, carried and then run',
  more: [{ serial: 'S1008', after: 0, alt: 'The box on the top step' }, { serial: 'S1009', after: 2, alt: 'A stopwatch beside the stairs' }],
  title: 'The same box', art: 'S1007', cast: [],
  alt: 'A teenager carrying a box up stairs, then running up with it',
  words: [
    'Carry the box up the stairs. Force through a distance. Work.',
    'Run up with it. The same work, faster.',
    'Work is force times distance. Power is work divided by time.',
  ],
};
STORIES['series-and-parallel'] = {
  about: 'two strings of holiday lights',
  more: [{ serial: 'S1011', after: 0, alt: 'The dark section on the old string' }, { serial: 'S1012', after: 2, alt: 'The new string lit around a dead bulb' }],
  title: 'Two strings of lights', art: 'S1010', cast: [],
  alt: 'Two strings of lights on a porch, one with a dark section',
  words: [
    'The old string: one bulb died, the whole line went dark. Series, one path.',
    'The new string: one bulb died, the rest stayed lit. Parallel, many paths.',
    'Series is one path; parallel is many.',
  ],
};
STORIES['synthesis-essay'] = {
  about: 'organized by reasons, not by sources',
  more: [{ serial: 'S1014', after: 0, alt: 'The outline with sources under reasons' }, { serial: 'S1015', after: 2, alt: 'Two sources circled where they disagree' }],
  title: 'By reason', art: 'S1013', cast: [],
  alt: 'A teenager with three sources and one outline organized under three reasons',
  words: [
    'Not source one, source two, source three.',
    'Reason one, with whichever sources support it. Reason two. Reason three.',
    'Organize by your reasons, not by your sources. Where sources disagree, say so.',
  ],
};
STORIES['literary-argument'] = {
  about: 'a claim about the whole book, proved three times',
  more: [{ serial: 'S1017', after: 0, alt: 'The river scene at the start' }, { serial: 'S1018', after: 2, alt: 'The river scene at the end' }],
  title: 'Proved three times', art: 'S1016', cast: [],
  alt: 'A teenager with a novel open to three flagged pages',
  words: [
    'The claim: the river is the book\'s conscience.',
    'Beginning, middle, end: three scenes where the river judges.',
    'A disputable claim about the whole work, with evidence from start to finish. Three scenes prove a pattern.',
  ],
};
STORIES['op-ed'] = {
  about: 'thirty seconds of a stranger\'s attention',
  more: [{ serial: 'S1020', after: 0, alt: 'The reader looking up from the page' }, { serial: 'S1021', after: 2, alt: 'The single ask circled' }],
  title: 'Thirty seconds', art: 'S1019', cast: [],
  alt: 'A teenager reading an opinion page on a bus, a stopwatch drawn beside',
  words: [
    'First line: the hook.',
    'Then the position, the evidence, and one specific ask.',
    'Hook, position, evidence, ask, all for a reader who gives you thirty seconds.',
  ],
};
STORIES['gilded-age-and-progressives'] = {
  about: 'gold on the outside',
  more: [{ serial: 'S1023', after: 0, alt: 'The tenement stairs' }, { serial: 'S1024', after: 2, alt: 'A new law posted on a factory door' }],
  title: 'Gold on the outside', art: 'S1022', cast: [],
  alt: 'A mansion beside a tenement, a railroad between them',
  words: [
    'Railroads made fortunes. The workers who built them lived in slums.',
    'Gilded means gold on the outside.',
    'The Progressives, from about 1890 to 1920, wrote the rules that reined it in.',
  ],
};
STORIES['depression-and-new-deal'] = {
  about: 'one worker in four',
  more: [{ serial: 'S1026', after: 0, alt: 'Workers building a dam' }, { serial: 'S1027', after: 2, alt: 'A bank with a new insurance sign in the window' }],
  title: 'One in four', art: 'S1025', cast: [],
  alt: 'A breadline in 1932, four men in a row, one holding a sign',
  words: [
    'In 1929 the market crashed. By 1933 one worker in four had no job.',
    'The New Deal was the government hiring people, insuring banks, starting Social Security.',
    'The crash left a quarter of workers jobless; the New Deal put the government to work.',
  ],
};
STORIES['america-in-world-war-two'] = {
  about: 'a morning that ended the argument',
  more: [{ serial: 'S1029', after: 0, alt: 'Landing craft at dawn' }, { serial: 'S1030', after: 2, alt: 'A factory line of planes' }],
  title: 'The morning', art: 'S1028', cast: [],
  alt: 'A radio on a kitchen table, a family gathered around it, December',
  words: [
    'Pearl Harbor, December 7, 1941. The argument about staying out was over.',
    'D-Day, June 6, 1944, opened the road to Berlin.',
    'Factories at home built the ships and planes that won.',
  ],
};
STORIES['cold-war'] = {
  about: 'two powers that never fired directly',
  more: [{ serial: 'S1032', after: 0, alt: 'A rocket on the pad' }, { serial: 'S1033', after: 2, alt: 'The Berlin Wall coming down in 1989' }],
  title: 'The stare', art: 'S1031', cast: [],
  alt: 'Two chess players staring across a board, no piece moving',
  words: [
    'From 1945 to 1991, two nuclear powers stared at each other.',
    'They fought through others, raced to the moon, and came closest to war over Cuba in 1962.',
    'Two powers, never a direct shot, and the whole world holding its breath.',
  ],
};
STORIES['civil-rights-movement'] = {
  about: 'courts, feet, crowds, laws',
  more: [{ serial: 'S1035', after: 0, alt: 'A bus with an empty seat' }, { serial: 'S1036', after: 2, alt: 'A pen signing a law' }],
  title: 'Courts, feet, crowds, laws', art: 'S1034', cast: [],
  alt: 'A march on a wide avenue, signs held high',
  words: [
    'Courts first: Brown, 1954. Then feet: Montgomery, 1955.',
    'Then a crowd: Washington, 1963.',
    'Then laws: the Civil Rights Act of 1964 and the Voting Rights Act of 1965.',
  ],
};
STORIES['recent-america'] = {
  about: 'the shocks a generation was born into',
  more: [{ serial: 'S1038', after: 0, alt: 'A first dial-up connection' }, { serial: 'S1039', after: 2, alt: 'A crowd on election night 2008' }],
  title: 'The shocks', art: 'S1037', cast: [],
  alt: 'A teenager looking at a wall of photos from the last thirty years',
  words: [
    'The internet. September 11, 2001.',
    'The 2008 crash. The first Black president.',
    'Each changed what Americans argued about.',
  ],
};
STORIES['function-shifts'] = {
  about: 'a picture moved on the wall',
  more: [{ serial: 'S1041', after: 0, alt: 'The graph lifted' }, { serial: 'S1042', after: 2, alt: 'The graph slid right' }],
  title: 'The picture, moved', art: 'S1040', cast: [],
  alt: 'A teenager moving a framed graph on a grid wall',
  words: [
    'Adding outside the brackets lifts it up.',
    'Subtracting inside slides it right.',
    '(x - 2)² + 3 is x² moved 2 right and 3 up. Outside moves up or down; inside moves sideways.',
  ],
};
STORIES['composite-functions'] = {
  about: 'two machines in a row',
  more: [{ serial: 'S1044', after: 0, alt: 'The ball leaving the first machine' }, { serial: 'S1045', after: 2, alt: 'The ball leaving the second' }],
  title: 'Two machines', art: 'S1043', cast: [],
  alt: 'Two boxes in a row with a ball going in one side and out the other',
  words: [
    'g turns 3 into 4.',
    'f takes that 4 and turns it into 9.',
    'f(g(x)) means apply g first, then f. Work from the inside out.',
  ],
};
STORIES['unit-circle'] = {
  about: 'a walk around a circle of radius one',
  more: [{ serial: 'S1047', after: 0, alt: 'The walker at 45 degrees' }, { serial: 'S1048', after: 2, alt: 'The walker at 90, straight up' }],
  title: 'The walk', art: 'S1046', cast: [],
  alt: 'A teenager walking a circle chalked on a court, a flag at the center',
  words: [
    'However far you turn, your position across is the cosine.',
    'Your position up is the sine.',
    'At 45 degrees you are equally across and up. On the unit circle, x is cosine and y is sine.',
  ],
};
STORIES['half-life'] = {
  about: 'a halving clock',
  more: [{ serial: 'S1050', after: 0, alt: 'The stack at forty' }, { serial: 'S1051', after: 2, alt: 'The stack at ten' }],
  title: 'The halving clock', art: 'S1049', cast: [],
  alt: 'A teenager with a stack of 80 coins, removing half each time a timer rings',
  words: [
    'Eighty grams. One tick: forty.',
    'Two ticks: twenty. Three: ten.',
    'Count the half-lives that fit in the time, then halve that many times.',
  ],
};
STORIES['end-behavior'] = {
  about: 'what the ends do',
  more: [{ serial: 'S1053', after: 0, alt: 'The right end diving' }, { serial: 'S1054', after: 2, alt: 'An even-power curve with both ends up' }],
  title: 'The ends', art: 'S1052', cast: [],
  alt: 'A teenager sketching a curve that dives on one side and climbs on the other',
  words: [
    'Far from the middle, only the biggest power matters.',
    '-2x³: negative for big x, the right end dives. Positive for big negative x, the left end climbs.',
    'The highest power rules the ends. Odd power, opposite ends.',
  ],
};
STORIES['two-sources'] = {
  about: 'two witnesses to one event',
  more: [{ serial: 'S1056', after: 0, alt: 'The two headlines' }, { serial: 'S1057', after: 2, alt: 'A note listing what each left out' }],
  title: 'Two witnesses', art: 'S1055', cast: [],
  alt: 'Two newspaper front pages side by side on a table',
  words: [
    'Both agreed the bridge closed on March 3.',
    'One said shops lost trade. The other said the money was cut years ago.',
    'Hold both sources in mind. Where they differ is where the thinking starts.',
  ],
};
STORIES['assumptions'] = {
  about: 'the step the writer skipped',
  more: [{ serial: 'S1059', after: 0, alt: 'The missing step drawn in dashed lines' }, { serial: 'S1060', after: 2, alt: 'The assumption written on the step' }],
  title: 'The skipped step', art: 'S1058', cast: [],
  alt: 'A teenager drawing a staircase with one step missing',
  words: [
    'The argument jumped from more homework to better grades.',
    'It assumed the homework would be done.',
    'An assumption is the step the writer skipped. Ask what would have to be true.',
  ],
};
STORIES['precise-words'] = {
  about: 'walk, stroll, march, trudge',
  more: [{ serial: 'S1062', after: 0, alt: 'The trudging figure' }, { serial: 'S1063', after: 2, alt: 'The marching figure' }],
  title: 'Four walks', art: 'S1061', cast: [],
  alt: 'Four figures walking differently along a road, a teenager choosing a word',
  words: [
    'Walk. Stroll. March. Trudge. All walking, none the same.',
    'The tired one is trudging.',
    'Near-synonyms name slightly different things. The precise word names exactly this walk.',
  ],
};
STORIES['author-choices'] = {
  about: 'why the story starts here',
  more: [{ serial: 'S1065', after: 0, alt: 'The funeral scene' }, { serial: 'S1066', after: 2, alt: 'The wedding scene' }],
  title: 'Why here', art: 'S1064', cast: [],
  alt: 'A teenager holding a book open at the first page, a question mark drawn',
  words: [
    'The story could have started anywhere. It started at the funeral.',
    'It ended at the wedding.',
    'Where a story begins, where it ends, and the order in between are choices. Ask why.',
  ],
};
STORIES['rock-cycle'] = {
  about: 'rock that is never finished',
  more: [{ serial: 'S1068', after: 0, alt: 'Layers in a riverbank' }, { serial: 'S1069', after: 2, alt: 'A folded band of rock in a cliff' }],
  title: 'Never finished', art: 'S1067', cast: [],
  alt: 'A volcano, a riverbed and a mountain range in one landscape',
  words: [
    'Lava cooled: igneous.',
    'Rain ground it to sand that pressed into layers: sedimentary. Heat and squeezing: metamorphic.',
    'Melt it, and around it goes again. Rock is never finished.',
  ],
};
STORIES['climate-and-weather'] = {
  about: 'one rainy Tuesday and thirty years of them',
  more: [{ serial: 'S1071', after: 0, alt: 'The rain on the window' }, { serial: 'S1072', after: 2, alt: 'The long chart with its average line' }],
  title: 'Thirty years of Tuesdays', art: 'S1070', cast: [],
  alt: 'A teenager looking out at rain, a chart of thirty years pinned beside the window',
  words: [
    'One rainy Tuesday tells you nothing about a place.',
    'Thirty years of Tuesdays does.',
    'Weather is today; climate is decades of averages.',
  ],
};
STORIES['life-of-a-star'] = {
  about: 'a campfire that lasts billions of years',
  more: [{ serial: 'S1074', after: 0, alt: 'A red giant beside a small star' }, { serial: 'S1075', after: 2, alt: 'A supernova remnant' }],
  title: 'The long campfire', art: 'S1073', cast: [],
  alt: 'A teenager by a campfire looking up at the stars',
  words: [
    'It lit from a collapsing cloud.',
    'It burned steadily, swelled as the fuel ran low, and faded to an ember.',
    'A star fuses hydrogen into helium while it lasts. The biggest end in an explosion instead.',
  ],
};
STORIES['human-impact'] = {
  about: 'fixing a problem the way a doctor does',
  more: [{ serial: 'S1077', after: 0, alt: 'The sample held up to the light' }, { serial: 'S1078', after: 2, alt: 'A pipe upstream, found' }],
  title: 'The doctor\'s way', art: 'S1076', cast: [],
  alt: 'A teenager with a clipboard by a stream, taking a sample',
  words: [
    'Measure it, so you know it is real.',
    'Find the cause, so you know what to change.',
    'Act on the cause, not the symptom. People change the Earth in measurable ways, and the measurements guide the fix.',
  ],
};
STORIES['earths-layers'] = {
  about: 'a peach',
  more: [{ serial: 'S1080', after: 0, alt: 'The peach half with layers labeled' }, { serial: 'S1081', after: 2, alt: 'A seismograph trace' }],
  title: 'The peach', art: 'S1079', cast: [],
  alt: 'A teenager cutting a peach in half, the pit showing',
  words: [
    'The thin skin: crust.',
    'The thick flesh: the hot mantle.',
    'The pit: the core, liquid outside, solid inside. Earthquake waves told us so.',
  ],
};
STORIES['ocean-currents'] = {
  about: 'a conveyor belt of heavy water',
  more: [{ serial: 'S1083', after: 0, alt: 'The dye sinking and spreading' }, { serial: 'S1084', after: 2, alt: 'A world map with the belt drawn' }],
  title: 'The conveyor belt', art: 'S1082', cast: [],
  alt: 'A teenager pouring cold salty water into a tank of warm water, dye showing the flow',
  words: [
    'Cold, salty water is heavy. It sinks and creeps along the bottom.',
    'Warm water flows back along the top.',
    'Wind drives surface currents; cold salty water sinking drives the deep ones. A slow belt around the world.',
  ],
};
STORIES['natural-resources'] = {
  about: 'a forest cut slower than it grows',
  more: [{ serial: 'S1086', after: 0, alt: 'Saplings among stumps' }, { serial: 'S1087', after: 2, alt: 'The pump with a gauge near empty' }],
  title: 'The forest and the bank', art: 'S1085', cast: [],
  alt: 'A young forest on one side of a road, an oil pump on the other',
  words: [
    'Cut the forest slower than it grows and it lasts forever. Renewable.',
    'Oil is a bank account with no deposits.',
    'Renewable comes back on a human timescale; nonrenewable does not.',
  ],
};
STORIES['the-big-bang'] = {
  about: 'raisins in rising dough',
  more: [{ serial: 'S1089', after: 0, alt: 'The dough small with the raisins close' }, { serial: 'S1090', after: 2, alt: 'The dough risen with the raisins far apart' }],
  title: 'The rising dough', art: 'S1088', cast: [],
  alt: 'A teenager watching bread dough rise, raisins moving apart',
  words: [
    'Every raisin sees every other raisin moving away.',
    'The far ones move away fastest.',
    'Galaxies recede faster the farther they are; run the film backward and they were once together.',
  ],
};
STORIES['research-paper'] = {
  about: 'a question, the sources, your answer',
  more: [{ serial: 'S1092', after: 0, alt: 'The books open with notes' }, { serial: 'S1093', after: 2, alt: 'The answer written above the sources' }],
  title: 'The question first', art: 'S1091', cast: [],
  alt: 'A teenager with a question written on a card, books stacked beneath it',
  words: [
    'Start with a question.',
    'Report what the sources say.',
    'Build your own answer on top, saying which sources hold which part.',
  ],
};
STORIES['personal-essay'] = {
  about: 'one small true moment',
  more: [{ serial: 'S1095', after: 0, alt: 'The counter, the customer, the moment' }, { serial: 'S1096', after: 2, alt: 'The single photo' }],
  title: 'One true moment', art: 'S1094', cast: [],
  alt: 'A teenager writing about a single afternoon, one photo beside the page',
  words: [
    'Not the whole year. One afternoon at the counter.',
    'Told well, it showed who I was.',
    'One story, told well, that shows who you are. A small true moment beats a big vague one.',
  ],
};
STORIES['letter-to-an-editor'] = {
  about: 'one point, one ask, one page',
  more: [{ serial: 'S1098', after: 0, alt: 'The crossing at dusk' }, { serial: 'S1099', after: 2, alt: 'The letter printed in the paper' }],
  title: 'One page', art: 'S1097', cast: [],
  alt: 'A teenager sealing a short letter, a newspaper on the table',
  words: [
    'One point: the crossing needs a light.',
    'Backed by evidence: twelve near-misses.',
    'One specific ask, on one page. A busy stranger is reading.',
  ],
};
STORIES['principles-of-the-constitution'] = {
  about: 'a handful of ideas under everything',
  more: [{ serial: 'S1101', after: 0, alt: 'We the People carved in stone' }, { serial: 'S1102', after: 2, alt: 'Three columns drawn holding a roof' }],
  title: 'The handful', art: 'S1100', cast: [],
  alt: 'A teenager reading the preamble on a wall, a few words underlined',
  words: [
    'The people are the boss.',
    'Power is split so no one holds it all.',
    'The government may do only what the paper allows. Written in 1787, it rests on a handful of ideas.',
  ],
};
STORIES['three-branches'] = {
  about: 'three teams, three jobs',
  more: [{ serial: 'S1104', after: 0, alt: 'A veto stamp' }, { serial: 'S1105', after: 2, alt: 'A gavel' }],
  title: 'Three teams', art: 'S1103', cast: [],
  alt: 'A teenager sketching three buildings: the Capitol, the White House, the Supreme Court',
  words: [
    'Congress writes the rules.',
    'The President carries them out. The courts referee.',
    'Each can block the others, which is the point.',
  ],
};
STORIES['federalism'] = {
  about: 'a school and a school district',
  more: [{ serial: 'S1107', after: 0, alt: 'A dollar bill and a schoolhouse' }, { serial: 'S1108', after: 2, alt: 'The shared band shaded' }],
  title: 'Two governments', art: 'S1106', cast: [],
  alt: 'A teenager with a chart: national on top, state below, shared in the middle',
  words: [
    'Only the national government prints money or declares war.',
    'Only the states run schools and elections. Both can tax.',
    'Power is shared between the national government and the states, with a band in the middle they share.',
  ],
};
STORIES['bill-of-rights'] = {
  about: 'a fence around the government',
  more: [{ serial: 'S1110', after: 0, alt: 'Four pictures for the four freedoms' }, { serial: 'S1111', after: 2, alt: 'A courtroom with a jury' }],
  title: 'The fence', art: 'S1109', cast: [],
  alt: 'A teenager reading ten short amendments on a poster, a fence drawn around a small building',
  words: [
    'The first amendment alone protects four freedoms: speech, religion, press and assembly.',
    'The rest guard your home, your trial and your vote.',
    'The first ten amendments, ratified in 1791, are a fence around the government.',
  ],
};
STORIES['how-a-bill-becomes-law'] = {
  about: 'an obstacle course',
  more: [{ serial: 'S1113', after: 0, alt: 'The bill at the committee table' }, { serial: 'S1114', after: 2, alt: 'A veto and the two-thirds override drawn' }],
  title: 'The obstacle course', art: 'S1112', cast: [],
  alt: 'A teenager tracing a bill\'s path on a chart with hurdles',
  words: [
    'A committee. A vote in the House. A vote in the Senate.',
    'The President\'s desk. A veto sends it back.',
    'Two thirds of Congress can vote it through anyway. Introduced, studied, passed, signed.',
  ],
};
STORIES['elections-parties-and-voting'] = {
  about: 'two rounds, 270 to win',
  more: [{ serial: 'S1116', after: 0, alt: 'A primary ballot' }, { serial: 'S1117', after: 2, alt: 'The map colored in with the tally' }],
  title: 'Two rounds', art: 'S1115', cast: [],
  alt: 'A teenager at a table with a map of states and a tally of 270',
  words: [
    'In the primary each party picks its runner.',
    'In the general election the runners race.',
    'For president, states cast electoral votes, and 270 of 538 wins.',
  ],
};
STORIES['scarcity-and-opportunity-cost'] = {
  about: 'sixty dollars and two wants',
  more: [{ serial: 'S1119', after: 0, alt: 'The game chosen' }, { serial: 'S1120', after: 2, alt: 'The shoes left on the shelf' }],
  title: 'Sixty dollars', art: 'S1118', cast: [],
  alt: 'A teenager with sixty dollars, a game and a pair of shoes on a counter',
  words: [
    'The game or the shoes. Not both.',
    'Whichever you buy, the other is what it cost you.',
    'Scarcity means there is never enough of everything; opportunity cost is the next best thing given up.',
  ],
};
STORIES['competition-and-markets'] = {
  about: 'two lemonade stands on one street',
  more: [{ serial: 'S1122', after: 0, alt: 'The price sign being changed' }, { serial: 'S1123', after: 2, alt: 'A line at the stand with ice' }],
  title: 'Two stands', art: 'S1121', cast: [],
  alt: 'Two lemonade stands across a street from each other, a customer between',
  words: [
    'Two stands. One dropped its price. The other added ice.',
    'The customer chose. Both got better.',
    'Free enterprise means private property, free choice and competition. Profit is what a seller keeps after costs.',
  ],
};
STORIES['money-banking-and-the-fed'] = {
  about: 'a promise everyone accepts',
  more: [{ serial: 'S1125', after: 0, alt: 'A loan being signed' }, { serial: 'S1126', after: 2, alt: 'The thermostat turned down' }],
  title: 'The promise', art: 'S1124', cast: [],
  alt: 'A teenager depositing cash at a bank, a thermostat drawn on the wall',
  words: [
    'Money is a promise everyone accepts.',
    'Banks lend the promises out and pay you for the loan.',
    'The Fed is the referee: it raises rates to cool prices and lowers them to warm a slow economy.',
  ],
};
STORIES['gdp-inflation-and-unemployment'] = {
  about: 'the country\'s paycheck',
  more: [{ serial: 'S1128', after: 0, alt: 'A grocery receipt from two years apart' }, { serial: 'S1129', after: 2, alt: 'A help-wanted sign' }],
  title: 'The paycheck', art: 'S1127', cast: [],
  alt: 'A teenager reading three numbers on a news screen',
  words: [
    'GDP is the size of the country\'s paycheck.',
    'Inflation is prices creeping up so the paycheck buys less.',
    'Unemployment is the share of people who want work and cannot find it.',
  ],
};
// College, and the last kindergarten one.
STORIES['mean-median-mode'] = {
  about: 'six allowances and one rich friend',
  more: [{ serial: 'S1131', after: 0, alt: 'The coins shared out evenly' }, { serial: 'S1132', after: 2, alt: 'The nine-dollar pile beside the three-dollar piles' }],
  title: 'The rich friend', art: 'S1130', cast: [],
  alt: 'Six friends at a table with their weekly allowances laid out as coins, one pile much bigger',
  words: [
    'Two, three, three, four, five, nine dollars. The mean shares it out: about 4.3 each.',
    'The median is the middle pair: 3.5. The mode is the most common: 3.',
    'One rich friend pulls the mean and leaves the median where it was.',
  ],
};
STORIES['spread'] = {
  about: 'two classes with the same average',
  more: [{ serial: 'S1134', after: 0, alt: 'The tight cluster of scores' }, { serial: 'S1135', after: 2, alt: 'The wide scatter of scores' }],
  title: 'Same average, different classes', art: 'S1133', cast: [],
  alt: 'Two score sheets on a desk, both averaging 70, one tight and one wide',
  words: [
    'Both classes averaged 70.',
    'In one, everyone scored near 70. In the other, scores ran from 40 to 100.',
    'The mean cannot tell them apart. The spread can.',
  ],
};
STORIES['probability'] = {
  about: 'a spinner with three winning slices',
  more: [{ serial: 'S1137', after: 0, alt: 'A tally sheet after a hundred spins' }, { serial: 'S1138', after: 2, alt: 'The three winning slices shaded' }],
  title: 'The spinner', art: 'S1136', cast: [],
  alt: 'A spinner with eight equal slices, three shaded, a student spinning it',
  words: [
    'Eight slices. Three winners.',
    'Spin it a hundred times: about thirty-seven wins.',
    'Probability is the share of outcomes that count: 3 out of 8.',
  ],
};
STORIES['compound-interest'] = {
  about: 'a snowball rolled downhill',
  more: [{ serial: 'S1140', after: 0, alt: 'The snowball small at the top' }, { serial: 'S1141', after: 2, alt: 'The snowball large at the bottom' }],
  title: 'The snowball', art: 'S1139', cast: [],
  alt: 'A student rolling a snowball down a hill, it growing as it goes',
  words: [
    'A hundred dollars at ten percent. A year later: 110.',
    'The next ten percent lands on 110, not 100. Then 121. Then 133.',
    'The interest earns interest. That is the snowball.',
  ],
};
STORIES['correlation-causation'] = {
  about: 'ice cream and the pool',
  more: [{ serial: 'S1143', after: 0, alt: 'The line at the ice cream stand' }, { serial: 'S1144', after: 2, alt: 'The lifeguard watching the crowded water' }],
  title: 'Ice cream and the pool', art: 'S1142', cast: [],
  alt: 'A crowded beach with an ice cream stand and a lifeguard tower',
  words: [
    'Ice cream sales rose. So did swimming accidents. Both in July.',
    'Ice cream did not cause drowning.',
    'Hot weather sent people to both the stand and the pool. Look for the third thing.',
  ],
};
STORIES['thesis-statements'] = {
  about: 'a fight worth picking',
  more: [{ serial: 'S1146', after: 0, alt: 'The plain sentence crossed out' }, { serial: 'S1147', after: 2, alt: 'The bold one underlined' }],
  title: 'A fight worth picking', art: 'S1145', cast: [],
  alt: 'A student writing one bold sentence at the top of a page',
  words: [
    'Dogs are pets. Nobody argues. A topic.',
    'Dogs make better pets than cats for busy families. Now someone could argue.',
    'A thesis is a fight you are picking, in one sentence.',
  ],
};
STORIES['academic-structure'] = {
  about: 'the sentence that explains why',
  more: [{ serial: 'S1149', after: 0, alt: 'The corner with cars' }, { serial: 'S1150', after: 2, alt: 'The three colors in the margin' }],
  title: 'Claim, evidence, warrant', art: 'S1148', cast: [],
  alt: 'A student with a paragraph marked in three colors',
  words: [
    'Claim: the town needs a crosswalk here.',
    'Evidence: twelve near-misses this year.',
    'Warrant: twelve near-misses mean the next one may not miss. The warrant says why the evidence counts.',
  ],
};
STORIES['numbers-in-prose'] = {
  about: 'a number with no clothes on',
  more: [{ serial: 'S1152', after: 0, alt: 'The headline with a question mark' }, { serial: 'S1153', after: 2, alt: 'The same number with its base written beside' }],
  title: 'Forty percent of what', art: 'S1151', cast: [],
  alt: 'A student squinting at a headline with a big percentage and no context',
  words: [
    'Forty percent. Of what?',
    'Up compared with when? Out of how many?',
    'A number is naked without its clothes. Dress it before you trust it.',
  ],
};
STORIES['logical-consistency'] = {
  about: 'cheap, and also the most expensive ever',
  more: [{ serial: 'S1155', after: 0, alt: 'The two sentences side by side' }, { serial: 'S1156', after: 2, alt: 'A list of claims with one crossed out' }],
  title: 'Cheap and expensive', art: 'S1154', cast: [],
  alt: 'A student with two sentences from one article circled on a page',
  words: [
    'Paragraph two: the plan is cheap.',
    'Paragraph six: it costs more than anything before.',
    'List the claims and check whether they can all be true at once. These cannot.',
  ],
};
STORIES['primary-and-secondary-sources'] = {
  about: 'a letter from the trenches and a textbook',
  more: [{ serial: 'S1158', after: 0, alt: 'The letter\'s faded ink' }, { serial: 'S1159', after: 2, alt: 'The textbook\'s chapter heading' }],
  title: 'The letter and the textbook', art: 'S1157', cast: [],
  alt: 'A student holding an old handwritten letter beside an open textbook',
  words: [
    'The letter was written in the trenches. It was there. Primary.',
    'The textbook was written eighty years later. Secondary.',
    'A primary source was there; a secondary source tells you about it.',
  ],
};
STORIES['counting-time'] = {
  about: 'why 1750 is the eighteenth century',
  more: [{ serial: 'S1161', after: 0, alt: 'The first century marked on the line' }, { serial: 'S1162', after: 2, alt: 'The year 1750 with an 18 above it' }],
  title: 'One century ahead', art: 'S1160', cast: [],
  alt: 'A student counting centuries on a timeline with fingers',
  words: [
    'Years 1 to 100 were the first century.',
    'So 1701 to 1800 is the eighteenth.',
    'Take the hundreds digit and add one. Centuries are named one ahead of their years.',
  ],
};
STORIES['cause-and-effect'] = {
  about: 'dry wood and a match',
  more: [{ serial: 'S1164', after: 0, alt: 'The stacked wood' }, { serial: 'S1165', after: 2, alt: 'The match striking' }],
  title: 'Dry wood, then a match', art: 'S1163', cast: [],
  alt: 'A student building a campfire, dry wood stacked, a match in hand',
  words: [
    'The dry wood had been building for years. The long-term cause.',
    'The match was the trigger.',
    'Historians name both: the fuse and the spark.',
  ],
};
STORIES['the-big-turns'] = {
  about: 'eight hinges the world swung on',
  more: [{ serial: 'S1167', after: 0, alt: 'The printing press' }, { serial: 'S1168', after: 2, alt: 'The first internet connection' }],
  title: 'Eight hinges', art: 'S1166', cast: [],
  alt: 'A student in front of eight framed pictures in a hallway',
  words: [
    'Farming. Writing. Republics. Printing.',
    'The Columbian exchange. Industry. The atom. The internet.',
    'After each hinge, life could not swing back.',
  ],
};
STORIES['writing-history'] = {
  about: 'bricks and a house',
  more: [{ serial: 'S1170', after: 0, alt: 'The bricks in a pile' }, { serial: 'S1171', after: 2, alt: 'The house built' }],
  title: 'Bricks and a house', art: 'S1169', cast: [],
  alt: 'A student stacking bricks labeled with dates into the shape of a house',
  words: [
    'A fact is a brick: the war began in 1861.',
    'A thesis is a house someone could argue with: the war was about slavery.',
    'History writing builds houses from bricks.',
  ],
};
STORIES['ending-sounds'] = {
  about: 'the sound at the end of a word',
  more: [{ serial: 'S1173', after: 0, alt: 'The child pointing at the end of the word cat' }, { serial: 'S1174', after: 2, alt: 'The three cards with their last letters circled' }],
  title: 'The last sound', art: 'S1172', cast: [],
  alt: 'A child with a cat, a bus and a sun drawn on cards, saying each word slowly',
  words: [
    'Cat. Say it slowly. C, a, t. The last sound is t.',
    'Bus. B, u, s. The last sound is s.',
    'Say the word slowly. The last sound you hear is the ending sound.',
  ],
};
// Four modules added on 2026-09-23.
STORIES['dictionary-skills'] = {
  about: 'a word that hid on the wrong page',
  more: [{ serial: 'S1176', after: 0, alt: 'A finger sliding down a column of J words' }, { serial: 'S1177', after: 2, alt: 'The guide words at the top of the page, jug and jump' }],
  title: 'The wrong page', art: 'S1175', cast: [],
  alt: 'A child flipping through a big dictionary on a library table, a slip of paper with a word on it',
  words: [
    'I looked for jungle under G. Nothing.',
    'First letter: J. Then the second: U. The guide words said jug and jump. Between them.',
    'First letter, then second letter. Guide words say what a page holds.',
  ],
};
STORIES['simple-machines'] = {
  about: 'a piano and a ramp',
  more: [{ serial: 'S1179', after: 0, alt: 'The piano halfway up the ramp' }, { serial: 'S1180', after: 2, alt: 'A seesaw with a child near the middle and an adult at the end, balanced' }],
  title: 'The piano', art: 'S1178', cast: [],
  alt: 'Two people at the foot of a ramp with a piano on a dolly, a truck above',
  words: [
    'The piano would not lift. It rolled up the ramp.',
    'Less force, more distance. The ramp is longer than the truck is tall.',
    'A simple machine trades force for distance. The work is the same.',
  ],
};
STORIES['coordinate-plane'] = {
  about: 'three blocks east, two blocks north',
  more: [{ serial: 'S1182', after: 0, alt: 'The route drawn on the map' }, { serial: 'S1183', after: 2, alt: 'The corner marked with a gold dot' }],
  title: 'Three east, two north', art: 'S1181', cast: [],
  alt: 'A child on a city street map with numbered streets, finger on a corner',
  words: [
    'Walk three blocks east. Then two blocks north. The corner you reach is (3, 2).',
    'Walk north first, east second, and you reach a different corner.',
    'Across first, then up. Two numbers, one point.',
  ],
};
STORIES['watersheds'] = {
  about: 'a cup of water on a crumpled bag',
  more: [{ serial: 'S1185', after: 0, alt: 'Water running along the folds of the bag' }, { serial: 'S1186', after: 2, alt: 'The low corner of the tray, a small pool' }],
  title: 'The crumpled bag', art: 'S1184', cast: [],
  alt: 'A student pouring water over a crumpled paper bag on a tray',
  words: [
    'The creases were ridges. The folds were creeks.',
    'Every drop ran downhill to the same low corner.',
    'A watershed is all the land that drains to one river. Upstream becomes downstream.',
  ],
};
// Four modules added on 2026-09-23, second batch.
STORIES['quarter-hours'] = {
  about: 'a bus that came at quarter past',
  more: [{ serial: 'S1188', after: 0, alt: 'The bus arriving, the clock showing the long hand on the 3' }, { serial: 'S1189', after: 2, alt: 'The same clock later with the long hand on the 9, quarter to nine' }],
  title: 'Quarter past', art: 'S1187', cast: [],
  alt: 'A child at a bus stop looking at a big clock on a post, the long hand on the 3',
  words: [
    'The bus comes at quarter past eight. The long hand was on the 3.',
    'Quarter of the way round. Quarter past. Right on time.',
    'The long hand on the 3, 6 or 9 says quarter past, half past, quarter to.',
  ],
};
STORIES['sound'] = {
  about: 'a rubber band on a cup',
  more: [{ serial: 'S1191', after: 0, alt: 'The band blurred mid-shake' }, { serial: 'S1192', after: 2, alt: 'The child with an ear on the table, tapping the far end' }],
  title: 'The rubber band', art: 'S1190', cast: [],
  alt: 'A child plucking a rubber band stretched over a plastic cup',
  words: [
    'Pluck it. It buzzes. The buzz is the band shaking.',
    'Pluck harder: louder. Stretch it tighter: higher.',
    'Sound is a vibration. Bigger means louder; faster means higher.',
  ],
};
STORIES['microscopes'] = {
  about: 'a piece of cork and the rooms inside it',
  more: [{ serial: 'S1194', after: 0, alt: 'The eyepiece view: rows of tiny boxes' }, { serial: 'S1195', after: 2, alt: 'The focus knob being turned, the image sharpening' }],
  title: 'The rooms in the cork', art: 'S1193', cast: [],
  alt: 'A student looking into a microscope, a slice of cork on the slide',
  words: [
    'Cork under the lens. Rows of tiny boxes, like little rooms.',
    'Hooke saw the same thing in 1665 and called them cells.',
    'Lenses magnify; magnifications multiply; focus makes it sharp.',
  ],
};
STORIES['where-things-come-from'] = {
  about: 'the tag on a shirt and the road behind it',
  more: [{ serial: 'S1197', after: 0, alt: 'The four places marked on the map with a line between' }, { serial: 'S1198', after: 2, alt: 'A container ship stacked with boxes' }],
  title: 'The tag', art: 'S1196', cast: [],
  alt: 'A student reading the tag inside a shirt collar, a world map on the wall',
  words: [
    'Cotton from one country. Thread from another. Cloth from a third. Sewn in a fourth.',
    'The tag said one place. The shirt had been to four.',
    'A supply chain is the steps and places between a raw material and you.',
  ],
};
// Course stories: one longer story for a whole course, unlocked when every module in it is mastered.
export const COURSE_STORIES = {
  'fractions-intro': { title: 'The pizza that fed the whole street', about: 'a block party, three pizzas, and every fraction on the block', art: 'CS1', alt: 'A street block party with three pizzas on a folding table, children with paper plates, chalk marks on the sidewalk', cast: [], words: ['The pizzas arrived at noon: three of them, the same size, for a street with more mouths than slices. Someone had to cut them, and cutting is where fractions live. The first pizza went into halves. Two people, two halves, done. The second went into fourths, because four kids were standing there with plates, and a fourth is smaller than a half only if the pizza is the same size, which it was.', 'Then the arguments started. A boy said his two fourths were less than his sister\'s half. They laid the slices on one plate: they covered the same space. Two fourths and one half are the same fraction wearing different clothes. A girl with a third of a pizza was sure the boy with an eighth had more, because eight is bigger than three. They held them up. The third was the big one. More cuts, smaller pieces.', 'By the end of the afternoon the last pizza was gone in eighths, and someone had drawn a line on the sidewalk from 0 to 1 with chalk, marking where each slice would sit. A fraction is a share of one whole, it has a place on a line, and every one of them is built from little unit pieces. The street had eaten the lesson.'] },
  'reading-3': { title: 'The day the newspaper came to school', about: 'a class that wrote its own newspaper and learned to read like editors', art: 'CS2', alt: 'A classroom with a printed one-page newspaper held up, children at desks with red pens and headlines on the board', cast: [], words: ['The class was going to make a newspaper. One page, real stories, printed for the whole school. The first job was the hardest: every article needed a headline, and a headline is the main idea in five words. The story about the leaky roof had twelve facts in it. The headline was Roof Leaks Again.', 'The second job was words. The sports report used the word unbeatable, and half the class did not know it. Un means not; able means can be. Unbeatable: cannot be beaten. Prefixes and suffixes are handles on a word, and once you can see them, long words open. The third job was the trickiest: the lunch review said the pizza was the best in the world. Fact or opinion? Nobody could weigh the world\'s pizzas. Opinion, and it stayed, but it got a byline.', 'The last job was order. The story of the field trip had to go first, then, because, so: the bus was late because of the rain, so lunch moved indoors, then the sun came out. When the page was printed, every reader in the school found the main ideas, understood the long words, knew what was checked and what was argued, and followed each story in order. That is reading to understand.'] },
  'reading-4': { title: 'The letter with the missing lines', about: 'a letter from a grandmother, and everything it said without saying', art: 'CS3', alt: 'A child at a kitchen table reading a two-page handwritten letter, a dictionary open beside it, a garden photo tucked in the envelope', cast: [], words: ['The letter was two pages long and said almost nothing directly. That was the point. It began with the weather, which is how you know someone has something else to say. The grandchild who read it had learned to summarize: keep the big events, drop the details. The big events were three: a move, a new garden, and a question about visiting.', 'Then came the reading between the lines. The letter never said she was lonely. It said the house was quiet at night and that the garden was slow to grow when there was nobody to show it to. That is an inference: a guess with a clue behind it. She wrote that the new town was as strange as a shoe on the wrong foot, a simile, and later that the days were a long gray hallway, a metaphor, and both told the truth better than plain words would have.', 'The letter had a shape too: first the move, then the garden, then the question, signal words holding it together. And one word the reader did not know, disconsolate, sent them to the dictionary, past the D guide words, to a page that held it. Disconsolate: unable to be comforted. The reply went out that afternoon, and the visit was arranged for June.'] },
  'science-3': { title: 'The storm that came to the science fair', about: 'a science fair afternoon when the weather did the demonstrating', art: 'CS4', alt: 'A school science fair on a lawn with folding tables, dark clouds rolling in, a wagon rolling down a ramp, children grabbing posters', cast: [], words: ['The fair was set up outside, which everyone later agreed was a mistake. The first table had ice, water and a kettle: solid, liquid, gas, the three states, with a sign saying that heat moves things from one to the next. The second table had a wagon on a ramp for pushes and pulls. The third had a jar of tadpoles halfway to being frogs, and the fourth had a rain gauge that had never seen rain.', 'Then the sky went dark. The wind pushed the wagon down the ramp all by itself, which was the best demonstration of a force anyone gave all day. The rain filled the gauge to the second mark in ten minutes. The ice on the first table was gone, the kettle was cold, and the tadpoles did not mind at all, because a tadpole lives in the wet and was on its way to a frog either way.', 'The thunder came last, and a boy with his hand on the table felt it before he heard it. Sound is a vibration, and a big one shakes the ground. When the sun came out the tables were wet and the ribbons were soaked, but the judges had seen matter change state, forces move things, a life cycle turn, weather arrive, and sound travel, in one afternoon, without anyone pressing a button.'] },
  'science-4': { title: 'The night the lights went out', about: 'a family evening in a blackout, and everything that still worked', art: 'CS5', alt: 'A family in a dark kitchen with a flashlight beam, a candle, rain on the window, a hand pump in the corner', cast: [], words: ['At seven the lights went out on the whole street. The first thing anyone learned was which energy was which: the lamp had been light, the heater heat, the radio sound, the fridge motion, and all of it had been electrical until the line went down. The second thing was a circuit: a flashlight only lit when the switch closed the loop, and when the batteries were turned the wrong way, nothing.', 'Outside, the storm that had cut the line was doing other work. Rain was carrying the garden soil down the path: erosion, said the oldest child, who had done it in a tray at school. At the bottom, by the gate, it was piling into a small bank: deposition. The moths on the porch had gone quiet, and the owl in the pine did not care about the dark at all, because its eyes and its silent feathers were built for exactly this.', 'The last thing was the pump. The basement was taking on water, and the hand pump was a lever with a long handle: a lot of pulling to lift a little water, but lifting it. When the lights came back at midnight nobody was scared of the dark anymore. They had seen energy in five forms, a loop that must be closed, land moving, animals fitted to the night, and a machine that trades distance for force.'] },
  'science-5': { title: 'The trip to the lake', about: 'a weekend at the lake and the science that came along', art: 'CS6', alt: 'A family campsite by a lake at dusk, a tent, a campfire, a full moon rising over the water', cast: [], words: ['The lake trip started with lemonade. Sugar in water: it vanished but the drink was sweet. Sand from the shore in the bucket: it sank and could be poured off. A solution and a mixture, before the tent was even up. That night the moon came up over the water, and the youngest wanted to know why it changed shape. A ball, a flashlight, a slow walk around the campfire: the moon circles the Earth, and we see the lit side from different angles.', 'In the morning the tent was wet on the inside. Nobody had spilled anything. The night air had cooled and the water in it had turned to drops: condensation. By noon the drops were gone again, up into the air, and the clouds building over the far hills were the same water on its way back. The lake was one stop on a loop that never ends.', 'On the last day the cousins compared: two had brown eyes like their fathers, inherited; all of them could now skip a stone, learned. The drive home passed a field of sunflowers turned toward the sun, and the youngest, who had been paying attention, said that was inherited too. Nobody argued.'] },
  'science-6': { title: 'The kitchen laboratory', about: 'a rainy Saturday when a kitchen turned into a lab', art: 'CS7', alt: 'A kitchen counter with a microscope, a layered density tower in a glass, graham crackers on frosting, a pot of soup steaming', cast: [], words: ['It rained all Saturday, so the kitchen became a laboratory. First, the salt: a compound, two elements joined, sodium and chlorine, neither of which you would want on a table alone. Then the soup: the metal spoon got hot by conduction, the broth swirled by convection, and the face over the pot warmed by radiation. Three ways heat moves, one pot.', 'The graham crackers came out for plate tectonics. Two crackers on a layer of frosting, pushed together: they buckled. Pulled apart: the frosting showed, a rift. Slid past each other: they caught and jerked. The onion skin went under the microscope after that, a slice so thin the light came through, and there were the cells in rows, the same boxes Hooke saw in cork.', 'By evening the density tower was standing in a glass: honey, dish soap, water, oil, four layers that would not mix, the heaviest at the bottom. The last experiment was dinner, which was a food chain on a plate: the chicken had eaten the grain, the grain had eaten the sun. The rain stopped at eight. Nobody had noticed.'] },
  'math-6': { title: 'The paint job', about: 'two friends painting a fence, and every kind of number they needed', art: 'CS8', alt: 'Two teenagers painting a long wooden fence green, paint cans on the grass, a triangular gate, a neighbor holding a mug', cast: [], words: ['The fence needed painting, and the paint was a mix: two parts blue to one part yellow made the green the neighbor wanted. A ratio. Double the batch, four to two, and it is the same green. The paint came in half-gallon cans, and the fence needed three gallons: how many cans? Three divided by a half is six. Dividing by a small piece counts the pieces.', 'The money got complicated. They had been paid twenty dollars up front and had spent twenty-three on paint. Minus three. Then the neighbor added a tip and forgave the extra: subtracting a negative, and suddenly they were up. The fence had a triangular gate, and the paint can said it covered so many square feet, so they measured the gate: base six, height four, half of twenty-four, twelve square feet.', 'At the end the neighbor asked how many hours they had worked, and they only knew the total pay and the rate: forty-two dollars at seven an hour, x times seven equals forty-two, x equals six. One-step equations, said the older one, who had done them that week, and the younger one said that was just the fence backwards.'] },
  'history-4': { title: 'Six flags over one town', about: 'one Texas town, and the flags that flew over it', art: 'CS9', alt: 'A Texas town square with six flags on poles in front of a courthouse, children walking past', cast: [], words: ['The town had been a town for a very long time. Before the roads, the Caddo farmed corn on the river flats to the east, and the Comanche rode the plains beyond. Then a mission bell rang, and Spain called the place its own for a hundred years, though the priests were few and the settlers fewer. In 1821 a new flag went up: Mexico, and the door opened to families from the north.', 'More came than anyone planned. The arguments turned into a war. In October 1835 a cannon at Gonzales fired under a flag that said come and take it. In March 1836 the Alamo fell. In April, at San Jacinto, the fight took eighteen minutes, and the town belonged to a new country, the Republic of Texas, with a single star on its flag.', 'Nine years later the star joined twenty-seven others. Texas was the 28th state. The flags in the town square today tell the whole story in cloth: Spain, France, Mexico, the Republic, the Confederacy, and the United States. The children who walk past them are walking the same ground the Caddo farmed.'] },
  'history-5': { title: 'The road from the coast', about: 'a family who arrived in 1620 and the country that grew around their descendants', art: 'CS10', alt: 'An old wooden house on a rocky New England coast, a road running inland, a family group in period clothes on the step', cast: [], words: ['The first of them came off a ship in 1620 and built a house on the coast, in the New England row of what became thirteen colonies. Their grandchildren farmed. Their great-grandchildren paid a tax on tea they had no vote about, and in 1773 one of them was on a dark harbor tipping crates into the water.', 'In 1776 the family signed nothing but heard the Declaration read aloud in a market square. In 1787 they argued about the Constitution at the dinner table: a stronger plan than the first one, three branches, each able to stop the others. In 1803 a cousin went west into the Louisiana Purchase, fifteen million dollars for half a continent, and did not come back.', 'In 1861 two brothers of the family fought on opposite sides. In 1865 the one who lived came home to a country that had ended slavery at the cost of six hundred thousand lives. The house on the coast is a museum now, and the road from its door runs all the way to Texas.'] },
  'science-7': { title: 'The garden that taught everything', about: 'a school garden, one growing season, and seven lessons in the soil', art: 'CS11', alt: 'A school vegetable garden in full growth, staked beans, red and yellow tomatoes, a hawk circling above, students with a hose', cast: [], words: ['The school garden started as a rectangle of dirt in March. The first lesson was the body: the students who dug it went home tired and hungry, and the teacher drew a city on the board, roads for blood, a kitchen for the stomach, phone lines for the nerves. The second lesson was the leaves that came up in April: photosynthesis, light and water and air into sugar, and oxygen given away.', 'In May the weather turned. High pressure, cool sinking air, then a low, and wind that flattened the beans. The beans that were staked survived and set seed; the flat ones did not. Natural selection in one bed, said the teacher. The tomatoes came red and yellow from the same packet, and the class drew Punnett squares to see why.', 'By June the garden was feeding grasshoppers, which were feeding a pair of birds, which were feeding a hawk that came once a week, and everyone could see why there was one hawk and a thousand grasshoppers. The last lesson was the hose: the water came from the river the whole town drank, which came from the hills, which is where the rain went. A watershed, ending in a school bean.'] },
  'science-8': { title: 'The night sky over the quarry', about: 'a night at an old quarry with a telescope and a stopwatch', art: 'CS12', alt: 'An old quarry at night with layered rock walls, a telescope on a tripod, a small campfire, stars overhead', cast: [], words: ['They drove to the quarry because the sky was darkest there. The quarry walls were the first lesson: layers, the oldest at the bottom, a fossil shell halfway up that had been the sea floor before there were dinosaurs. The telescope went up on the flat ground. The first thing in it was the moon, then Jupiter, then a smudge that was a galaxy, and each was unimaginably farther than the last.', 'While they waited for full dark, the physics teacher rolled a marble down the quarry ramp and timed it with a stopwatch: distance against time, a curve on the graph, faster every second. A push started it; nothing stopped it but the gravel. Newton\'s first law, then the second when a heavier marble needed a bigger push for the same speed, then the third when the marble hit the wall and the wall pushed back.', 'The campfire was the last lesson: wood and air becoming ash and smoke and heat, a chemical change, nothing you could fold back. The atoms in the smoke had been in the tree, and before that in the air, and before that in a star. Everyone looked up again. The scale of it was the point.'] },
  'tech-3': { title: 'The robot birthday', about: 'a birthday party run by a toy robot that did exactly what it was told', art: 'CS13', alt: 'A birthday table with a small toy robot holding a cake slice on a plate, children laughing, a card with steps propped against a cup', cast: [], words: ['The robot came in a box on the morning of the party, and the first thing it did was nothing, because nobody had told it anything. Its buttons were inputs. Its little screen and its beep were outputs. In between it waited for steps. The birthday girl wrote the first program on a card: forward two, turn, beep. It did exactly that, and stopped, because that was the end of the card.', 'Serving the cake needed more steps than anyone expected. Cut, lift, put on a plate, hand it over: four steps, in order, once for every guest. Written out, that was forty lines. Then someone noticed the same four steps were repeating, and the card became one line: repeat the four steps ten times. The robot served ten plates without a mistake, and the card fit in a pocket.', 'The only disaster was the candles. The card said light the candles, and nobody had said find the matches first, so the robot stood by the cake holding nothing. Every step must be there, and in order. The girl added one line at the top, and the candles were lit, and the robot beeped once, which was the closest it could get to singing.'] },
  'tech-5': { title: 'The game that kept score', about: 'a class that built a game and learned what a program remembers and decides', art: 'CS14', alt: 'A classroom with a projected simple game, a paddle and ball, a scoreboard, students pointing at one line of code on a whiteboard', cast: [], words: ['The class built a game in a week. On Monday it had a ball and a paddle and no memory: every point was forgotten the moment it was scored. Tuesday brought variables: a box named score, a box named lives, and the game began to remember. Score went from 0 to 5 to 8, and lives went down from 3 to 2 when the ball got past.', 'Wednesday was for deciding. IF the ball touches the paddle THEN bounce, ELSE lose a life. IF lives is 0 THEN show the end. The game did not decide anything by itself; it asked yes-or-no questions the class had written and took whichever road the answer pointed down.', 'Thursday, the game was wrong. It ended after two lost balls, not three. Nobody deleted anything. They read the steps one at a time, and found the line that checked lives before taking one away instead of after. One line moved, and Friday was for playing.'] },
  'tech-7': { title: 'The message across the ocean', about: 'a photo that crossed the ocean in pieces and the lock that guarded the account it came from', art: 'CS15', alt: 'A teenager at a laptop with a beach sunset photo on screen, a world map behind with a dotted route across the ocean, a phone showing a code', cast: [], words: ['The photo was a sunset on a beach in Portugal, sent to a cousin in Texas. It did not travel as a photo. It was cut into packets, a few thousand of them, each stamped with an address that was a number, and each took whatever route was open: an undersea cable, a switch in London, a tower outside Dallas. They arrived out of order and were put back together in the right one.', 'The cousin\'s name for the site was words; the address the packets used was numbers, and a directory called DNS had turned one into the other before the first packet left. Underneath everything, the sunset was ones and zeros: every color a pattern of switches, on and off, in places worth 8, 4, 2, 1.', 'The next morning a message arrived saying the account was locked and to click now. The cousin did not click. He went to the site the usual way, typed the long password that was four unrelated words, answered the code on his phone, and found nothing locked at all. The sunset was still there. The scam was not.'] },
  'math-5': { title: 'The bake sale', about: 'a bake sale where every decimal, fraction and box counted', art: 'CS16', alt: 'A school bake sale table with brownies, lemonade, boxes of cookies, a handwritten price list and a cash box', cast: [], words: ['The bake sale needed a table, a cash box and a price list, and the price list was where the decimals lived. Brownies were 1.25, lemonade 0.75. A brownie and a lemonade: line up the points, add the cents, add the dollars, 2.00. The first customer paid with a five, and the change was decimals in reverse.', 'The brownies came from a recipe that made a tray, and half the tray had been eaten by breakfast. Half of what was left, for the sale: half of a half, a quarter of the tray. The cookies came in boxes of 24, and 288 cookies had been baked: how many boxes? Ten boxes used 240, two more used the 48, twelve boxes on the table.', 'The table was a grid, and the lemonade stand was three across and two up from the corner. The cash box was a box: four cookies long, three wide, two layers high, twenty-four cookies fit. At the end, the total came from a long sum with brackets in it, and the brackets went first, and the sale had made 143 dollars and 50 cents.'] },
  'reading-5': { title: 'The play', about: 'a class play, and everything the script did not say out loud', art: 'CS17', alt: 'A school stage with two children and a bicycle prop, a narrator at the side, an audience of families', cast: [], words: ['The class was putting on a play about two friends who fight over a bicycle and make up. The topic was two friends. The theme, which took a week of rehearsal to find, was that friendship survives a fight. The topic was two words; the theme was a sentence.', 'The script was in first person for one scene, the narrator saying I, and the audience only knew what she knew. Then the camera moved to the corner: third person, she and he, and suddenly the audience could see the bicycle hidden behind the shed that neither friend could. That was the whole trick of the play.', 'One line said the older friend had cold feet. A first grader in the front row asked why nobody brought him socks. An idiom, said the narrator, not skipping a beat. It means he was nervous. And when a parent asked afterward how they knew the ending was happy, the cast pointed to the last line, because a claim about a story needs a line behind it.'] },
  'reading-6': { title: 'The editorial', about: 'a student newspaper editorial and the week it took to write one honest argument', art: 'CS18', alt: 'A student at a laptop with a printed draft covered in red marks, a newspaper page on the wall behind', cast: [], words: ['The claim was simple: the school should start an hour later. The first draft had five reasons and three of them were the writer\'s cousin liking it. A reason has to hold the claim up, said the editor, and the cousin held nothing. Two reasons stayed: teenagers sleep late by biology, and rested students learn more.', 'The tone was the next fight. The first draft sounded angry, and angry writers get skipped. The second draft was warm and a little funny, and the mood a reader was left with was that the writer could be trusted. Along the way a word had to be looked up: somnolent, from the root somn, sleep, the same root as insomnia.', 'The last read-through asked one question of every paragraph: is it working the same job? One paragraph about the cafeteria was not, and it went. What was left was one central idea, held up by reasons that held, in a voice a reader would sit with. It ran on the front page.'] },
  'math-7': { title: 'The road trip', about: 'a family road trip with proportions, percents, negatives and one round pizza', art: 'CS19', alt: 'A family car on a highway with a map on the dashboard, a pizza box, a gas station sign with prices', cast: [], words: ['The map said 420 miles, and the car used a gallon every 30 miles, so 14 gallons: a proportion, the price of one mile scaled up. Gas was 20 percent more expensive than at home, which turned a 50-dollar fill-up into 60. The trip budget was 200 dollars, and by lunch it was minus 12, which is what happens when you subtract more than you have.', 'Lunch was pizza, and the pizza was a circle. A 14-inch pizza is 7 inches to the edge from the middle, and the area is pi times seven squared, about 154 square inches, which the youngest wanted to know in slices and the oldest wanted to know in inches of crust: pi times 14, about 44.', 'The last stretch was an equation. They had driven for x hours at 60 miles an hour plus a 30-mile detour, and the total was 210 miles. 60x plus 30 equals 210. Take the 30 away, divide by 60, three hours. Nobody was sure who had started the math, but nobody wanted to stop.'] },
  'math-8': { title: 'The treehouse', about: 'a treehouse built with slope, squares, roots and a right triangle', art: 'CS20', alt: 'A treehouse in a big tree with a long gentle ramp, a diagonal brace, a rope ladder, two teenagers with a tape measure', cast: [], words: ['The ramp up to the treehouse had to be gentle enough for a wagon: rise over run, and they settled on 1 to 4, one foot up for every four along. The floor was a square of 49 tiles, seven by seven, because the square root of 49 is 7 and nobody wanted to cut tiles. The rope ladder doubled its knots on every trial, 2, 4, 8, 16, 32: two to the fifth.', 'The brace was the hard part. A diagonal from the floor corner to the trunk had to be cut before anyone climbed: 6 feet along, 8 feet up, and the brace was the hypotenuse, 36 plus 64, the square root of 100, exactly 10 feet. The lumber yard had a 10-foot board.', 'When it was done they counted the nails in scientific notation as a joke, 3.4 times ten to the second, three hundred and forty, and wrote it on the wall. The wagon rolled up the ramp on the first try.'] },
  'history-6': { title: 'The market at the crossroads', about: 'one market town, and the whole world passing through it', art: 'CS21', alt: 'A busy market at a crossroads with stalls, people in varied dress, goods in crates, a signpost pointing four ways', cast: [], words: ['The market sat where two roads crossed, and you could find it on a map by two numbers, so many degrees north of the equator, so many east of Greenwich. On market day the town was a lesson in culture: the food, the words, the way people greeted each other, everything a newcomer would have to be taught.', 'The town had been governed three ways in living memory: once by a lord who decided everything, once by a small council, and now by everyone who voted. Its economy had changed too, from farms that made what their grandparents made, to a plan handed down from far away, to a market where buyers and sellers decided.', 'The people at the stalls had come from four directions, pushed by drought and pulled by work, and the goods had come from farther: cotton grown in one country, spun in another, sewn in a third, sold at the crossroads. A region, the schoolteacher said, is a neighborhood on a bigger map. The market was where the neighborhoods met.'] },
  'history-7': { title: 'The land under the highway', about: 'one Texas highway and the six centuries beneath it', art: 'CS22', alt: 'A long Texas highway running from the coast toward a city skyline, a mission, a longhorn and an oil derrick along the way', cast: [], words: ['The highway runs from the coast to the plains, and every mile of it is a chapter. The first miles cross the wet coastal plain where the Karankawa fished and the Caddo farmed corn to the east. Then a mission with a bell, Spain\'s claim for a century, and a town at San Antonio that Mexico inherited in 1821 and opened to settlers from the north.', 'The road passes Gonzales, where a cannon fired under a flag in October 1835, and the Alamo, which fell in March, and San Jacinto, where eighteen minutes made a country. The country lasted nine years, joined the Union in 1845, left it in 1861, and heard of freedom on June 19, 1865.', 'The last miles are cattle country that walked its herds to Kansas from 1867, then cotton, then, at Spindletop in 1901, oil a hundred feet in the air. The highway ends in a city that did not exist when the road began. Six flags have flown over the land beneath it, and a seventh thing, the skyline, is newer than any of them.'] },
  'history-8': { title: 'Four papers on the wall', about: 'a family\'s four framed papers and the republic they describe', art: 'CS23', alt: 'A hallway wall with four framed old documents, a family looking at them, a drawer half open below', cast: [], words: ['On the wall of the house hang four papers. The first is a copy of the Declaration of 1776, which says why they left. The second is the Constitution of 1787, which says how the country runs: three branches, each able to stop the others. The third is the Bill of Rights of 1791, the fence around the government.', 'The fourth paper is a land deed from 1804, from the Louisiana Purchase, when a president bought half a continent and a great-great-grandfather went west into it. The family\'s history runs through the early republic: two terms and go home, a war in 1812 the country survived, and then the slow arithmetic of new states, slave or free, and the compromises that kept the count even until 1860 broke it.', 'There is a fifth paper in a drawer, a letter from 1865. A son who had fought for the Union came home to three promises: no more slavery, everyone born here a citizen, no one losing the vote for their race. The letter says the promises were made. The rest of the wall is about how long they took to keep.'] },
  'health-4': { title: 'The week the phone charged and I did not', about: 'one student\'s week of sleep, labels, stairs and screens, kept in a notebook', art: 'CS24', alt: 'A child at a desk with an open notebook showing a week of checkmarks, a cereal box, a stopwatch and a phone charging on the side', cast: [], words: ['The notebook started as a dare from a teacher: one week, write down when you sleep, what you eat, when you move and when you look at a screen. Monday was honest and a little embarrassing. Nine hours of sleep, but the last hour of the night had been a screen, and the morning felt like wading. The brain, the teacher had said, files the day at night; Monday\'s files were still on the desk.', 'Tuesday was the cereal. Twelve grams of sugar per serving, and the serving was half of what went in the bowl, and sugar was the second ingredient in the race. Wednesday was the stairs: twelve beats in ten seconds sitting, twenty-five at the top, eighteen a minute later, thirteen after two. The heart came back fast, and that, it turned out, was the whole point.', 'By Friday the notebook had a rule in it that nobody had assigned: the phone charges overnight, and so do I. Screens off an hour before bed, eyes up from the tablet every twenty minutes, half the plate green and orange, an hour outside in whatever pieces the day allowed. Nothing in the week had been hard. It had only needed to be written down.'] },
  'reading-7': { title: 'The mystery of the missing bicycle', about: 'a class that read a mystery like detectives and caught the author\'s tricks', art: 'CS25', alt: 'A classroom with a mystery novel on each desk, a bicycle sketched on the board with clues pinned around it', cast: [], words: ['The novel was a mystery about a stolen bicycle, and the class read it the way detectives read a room. The first question was why the author had written it: not to inform, not to persuade, but to entertain, and knowing that told them to expect a trick. The second question was evidence. When a character said everyone knew the neighbor was a thief, the class wrote one story in the margin. When the police log said the bicycle was seen at the station at nine, they wrote evidence.', 'The words themselves were doing work. The neighbor was described as thin in one chapter and skinny in another, and the class caught the change: same size, different feeling. The author had turned the reader against him with a single word. Then there was the motive. The girl who took the bicycle wanted to reach her grandmother\'s house before dark, and feared being late more than being caught, and the author had shown both without ever saying them.', 'The bicycle turned up in the last chapter where the strongest evidence had pointed all along. Half the class had suspected the neighbor anyway, on the strength of one story and one skinny. That, the teacher said, was the lesson, and it was not about bicycles.'] },
  'reading-8': { title: 'The fire station that burned down', about: 'a town newspaper\'s worst week, read with a critical eye', art: 'CS26', alt: 'A fire station with smoke from its roof, firefighters staring, a newspaper front page in the foreground', cast: [], words: ['The town paper had a bad week and the class read every word of it. The fire station had burned down, which the paper called ironic, and it was: the one building that should never burn. The mayor\'s statement said the town had been unlucky, and the class caught the flawed reasoning in one line: two fires in a month did not mean the town was cursed, only that two fires had happened.', 'The editorial called the fire chief a Scrooge for cutting the budget, and the class had to know the old story to feel the sting; an allusion only works on readers who know what it points to. Then came the hardest assignment: an objective summary of the whole week, a mirror, not a review. Three drafts had an opinion hiding in them. The fourth said only what the paper said.', 'The next week the paper ran a correction. The station had not burned because of the budget; a heater had failed. The class, who had summarized without judging, had nothing to take back. The columnist who had called the chief a Scrooge did.'] },
  'science-9': { title: 'The strawberry and the frog', about: 'a biology year told through a strawberry, a pond and a family photo', art: 'CS28', alt: 'A kitchen table with a strawberry mash in a bag and white DNA strands rising, a jar with a leaf, a family photo pinned nearby', cast: [], words: ['The strawberry gave up its DNA in a plastic bag: mashed, salted, soaped, filtered, and topped with cold alcohol until white threads rose out of the pink. The recipe book of a living thing, visible in a kitchen. The family photo on the fridge explained the rest: brown eyes from both parents, and a Punnett square on the back of an envelope showing why the youngest had blue.', 'The pond behind the school was the second laboratory. A leaf in a jar of sunlit water bubbled oxygen; a jar of pond water in the dark did not. The frogs in the shallows had been eggs, then tadpoles, cells dividing and dividing, and every one of those divisions was a photocopy of the whole book. Meiosis made the half-books that started it.', 'The last week tied it together. The carbon in the strawberry had been in the air, and before that in a leaf, and would be in the air again. A sweaty run and a shivering wait for the bus were the same body keeping itself at one temperature two ways. A student who had started the year thinking biology was memorizing ended it thinking it was one long story about staying alive.'] },
  'science-10': { title: 'The kitchen chemist', about: 'a year of chemistry that never left the kitchen', art: 'CS29', alt: 'A kitchen with a periodic table taped inside an open cupboard, cabbage juice in cups turning pink and blue, a balloon, a kitchen scale', cast: [], words: ['The kitchen had a periodic table taped inside the cupboard door, and the first assignment was a scavenger hunt: sodium in the salt, iron in the pan, carbon in everything. The salt was two elements holding each other by a given electron, ionic; the water was two hydrogens and an oxygen sharing, covalent, and salt water lit a bulb where sugar water would not.', 'Baking soda and vinegar were the standard reaction, and the kitchen scale proved the mass was the same before and after when the bag was sealed. Red cabbage juice turned pink in vinegar and blue in soap, and a spoonful at a time of baking soda solution brought the vinegar back to purple: a titration on a plate. A mole was a dozen for chemists, counted by weight, the way a hundred paper clips are weighed instead of counted.', 'A balloon in the freezer shrank, and a balloon in the sun swelled: gas laws in the time it took to make dinner. Food coloring halved and halved again across five cups showed what concentration meant. By the end of the year the kitchen was still a kitchen. The cook just knew what was happening in it.'] },
  'science-11': { title: 'The skate park', about: 'an afternoon at the skate park, and all of physics under it', art: 'CS30', alt: 'A skate park at golden hour with a skater at the top of a ramp, another mid-air, lights on poles, a friend with a phone at the rail', cast: [], words: ['The skate park was a physics lab with a snack bar. The drop-in was acceleration, speed changing every tenth of a second. The top of the ramp was potential energy, stored; the bottom was kinetic, spent, and doubling the speed meant four times the energy, which is why the fast falls hurt. The skater who weighed the most carried the most momentum through the bowl and was hardest to stop.', 'A friend at the rail was measuring waves with a phone: the pitch of the wheels on the concrete, the crest-to-crest of a rope tied to the fence and shaken. The lights over the park ran on a circuit; when one bulb died, the rest stayed lit, so they were wired in parallel, which the skaters had never thought about and now could not stop noticing.', 'The last run of the day was work and power: the same climb up the ramp, once walked and once run, the same work done in half the time. Somebody asked what the point of physics was. The answer was on the ramp, and everybody there could already feel it in their knees.'] },
  'science-12': { title: 'The road trip to the observatory', about: 'a night drive to the mountains, and the Earth and sky along the way', art: 'CS31', alt: 'A car on a mountain road at night, an observatory dome on the summit, a striped cliff along the roadside, a city glowing far below', cast: [], words: ['The road climbed out of the city past a cliff face striped like a cake, oldest at the bottom, a fossil shell in a layer that had been sea floor. The rock had been lava once, then sand, then squeezed, and would be melted again in a time nobody in the car could imagine. The weather at the summit was cold and clear, and the driver said the weather was tonight and the climate was thirty years of tonights.', 'The observatory sat on a peak that had been a volcano, a mantle upwelling that had cooled. Inside the dome, the telescope found a red giant, a star swelling as its fuel ran low, and a smudge that was a galaxy moving away, faster the farther it was. The universe was rising like bread with raisins in it.', 'On the drive down they passed the reservoir that fed the city, a renewable resource as long as the rain kept coming, and the pipeline that carried oil that would not come back. The trip had crossed the rock cycle, the climate, the life of a star and the human hand on a planet in one night, and the youngest fell asleep before the city lights.'] },
  'history-10': { title: 'The stone in the wall', about: 'one carved stone that passed through every age of world history', art: 'CS32', alt: 'A museum case with a carved inscribed stone, a class of teenagers looking at it, a mural behind showing a river, a bridge and a railway', cast: [], words: ['The stone was cut from a quarry near a flooding river four thousand years ago, when extra grain let some people stop farming and start building. It carried an inscription, because counting grain had invented writing. Greek traders saw it in a harbor and Roman engineers built it into a bridge, and when Rome fell the bridge stood while the roads around it went to grass.', 'A lord claimed the land in the age when land was the only wealth. The plague came in 1347 and took the mason who was repairing the bridge, and his apprentice, who lived, charged double. Revolutions passed over the stone: a king lost his head in one country and a colony declared itself free in another, both on the same idea about rights.', 'The bridge was widened for a railway in the age of coal and steam, shelled in one world war and rebuilt after the second. The stone is in a museum now, its inscription behind glass, and the class that came to see it had just learned to read the marks. Four thousand years, and the grain count is still legible.'] },
  'history-11': { title: 'The house on Fourth Street', about: 'one Texas house, and America since 1877 seen from its porch', art: 'CS33', alt: 'A wooden porch on an old Texas house with a family in clothes from several eras gathered on the steps, a radio, a television and a phone among them', cast: [], words: ['The house on Fourth Street was built in 1889 by a railroad clerk, in the Gilded Age, when the fortunes were upstairs and the workers were in the basement. His daughter marched for the vote in 1917. His son lost the store in 1930, one worker in four out of work, and took a job building a dam for the New Deal. The radio in the front room announced Pearl Harbor on a Sunday.', 'The grandson went to Normandy in 1944 and came home to a country staring at another across a chessboard for forty-five years. His wife watched the moon landing on the same television that had shown the march on Washington in 1963 and the signing of the Voting Rights Act in 1965, which changed who voted on Fourth Street.', 'The great-granddaughter bought a computer in 1998 and was at her desk on September 11, 2001. She watched the 2008 election on a phone. The porch has been repainted seven times. The view from it is the whole history of the country since the clerk first sat down.'] },
  'government-12': { title: 'The pothole', about: 'one pothole on one street, and every level of government that touched it', art: 'CS34', alt: 'A city street with a pothole surrounded by orange cones, a city crew, a state engineer with a clipboard, a resident speaking to a council', cast: [], words: ['The pothole opened in March on a street that belonged to the city. Filling it was the mayor\'s job, and the city council voted the money in April, which was the principle of the whole system in a small size: the people\'s representatives decide, and no one person holds the purse. The crew came in May and found a pipe under the pothole that belonged to the state.', 'The state\'s engineers had their own rules, and their own legislature, and a governor who signed a bill that summer moving the money. Under the state pipe ran a federal fiber line, and the national government had a say too. Three levels, three jobs, one hole in the road: federalism with orange cones around it.', 'A resident who complained loudly at the council meeting was protected by the first amendment while she did it. The council could not silence her; the courts would have said so. The pothole was filled in August. It had taken three governments, one bill, a veto that did not happen and a citizen who would not stop talking. That is how it is supposed to work.'] },
  'economics-12': { title: 'The first paycheck', about: 'a first paycheck, and every economic idea that came with it', art: 'CS35', alt: 'A teenager at a kitchen table with a first paycheck, a phone and a bike advertisement, a budget sheet, a bank app on a laptop', cast: [], words: ['The first paycheck was smaller than the wage times the hours, which was the first lesson: taxes, and the second lesson was scarcity, because it could buy the phone or the bike but not both, and the bike was the cost of choosing the phone. The phone\'s price had risen since spring, because a ship of parts was late while people still wanted phones. Supply, demand, and a number that moved between them.', 'The store across the street had matched the price the week before, and the store on the corner had thrown in a case. Competition, and both got better. The paycheck went into a bank that lent it out and paid a little for the privilege, and the news said the Fed had raised rates, which meant the loan for the bike would cost more and prices might cool.', 'The last lesson was a budget on a sheet of paper: rent someday, a small savings goal now, and a rule to spend less than came in. The paycheck was 312 dollars. The economy that had produced it, taxed it, priced its phone and paid interest on it was the whole course, and the paper was the thing to keep.'] },
  'music-4': { title: 'The school concert', about: 'one spring concert, from the first tick of the beat to the last soft note', art: 'CS36', alt: 'A school stage with a small band of children in rows, a conductor with a raised pencil, music stands, parents in the dark', cast: [], words: ['The concert began the way every rehearsal had, with the teacher tapping a pencil on the stand: tick, tick, tick, tick. The beat came first, before any note, and the twenty-two players found it the way you find a heartbeat, without looking. The first piece was all quarter notes, one beat each, four to a measure, and nobody rushed.', 'The second piece had a solo, and the soloist read it off the staff the way she had learned in September: Every Good Boy Does Fine up the lines, FACE up the spaces, and the notes climbed the ladder as she played. The half notes held for two, the eighth notes came in pairs, and a whole note at the end sat for four full beats while the room held still.', 'The last piece was marked forte and allegro, loud and fast, and the drums took it at a run. Then, on the final page, a word nobody had noticed in rehearsal: piano. The whole band dropped to a whisper and the piece ended soft and slow, adagio, on one long note. The applause was forte. Nobody had told it to be.'] },
  'multiplication-3': { title: 'Frederick and the ants', about: 'eight-year-old Frederick, an ant farm, and the day counting stopped being enough', art: 'CS37', alt: 'A boy of eight at a windowsill with a glass ant farm, a times table taped above it, a digital microscope in its box beside him', cast: [], words: ['Frederick was eight and had an ant farm on his windowsill, a birthday present from his dad along with a digital microscope he was not yet allowed to touch without help. He counted the ants every morning. On the third morning there were too many to count one by one, so he counted the rows: four tunnels, six ants in each. Four groups of six. Twenty-four, without touching a single ant.', 'By the second week he had the times tables to ten taped above the farm, and he used them the way other kids used a calculator: seven tunnels of eight was fifty-six, and he could say it before his sister finished asking. When the ants had to be split into two farms, he divided: twenty-four ants, two farms, twelve each. Dividing was sharing out equally, and it undid the multiplying exactly.', 'The last thing he learned that spring was addition with big numbers, because the ant book said a colony could reach 1,000 and he wanted to know how far he had to go: 256 ants now, 378 more to hatch, 634, ones then tens then hundreds, carrying when a column overflowed. His dad found the sums penciled on the side of the farm and did not erase them. Frederick would be a biology professor one day. It started with a windowsill.'] },
  'math-4': { title: 'Chloe and the mural', about: 'nine-year-old Chloe, a wall to paint, and every number a mural needs', art: 'CS38', alt: 'A girl of nine on a stepladder at a long community-center wall, graph paper in hand, ninety-two small birds sketched in rows across the wall', cast: [], words: ['Chloe was nine and had been given a wall. The community center wanted a mural, her art teacher had said she could plan it, and planning turned out to be arithmetic. The wall was 23 feet wide and she wanted a row of 4 birds per foot: 23 times 4, broken into 20 times 4 and 3 times 4, eighty plus twelve, ninety-two birds. She drew ninety-two birds on graph paper and lost count twice.', 'The paint came in cans that covered 96 square feet, and the wall was 4 feet high, so each can covered 24 feet of wall length, shared out in rounds the way you deal cards. The birds needed to be arranged in equal rows: twelve chairs could go one by twelve, two by six or three by four, and so could ninety-two birds, in a few more ways than she had expected. Factors, her teacher called them.', 'The sky took a quarter of the wall and the grass a fourth, which she wrote as 0.25 twice, and together they were a half. Chloe had never cared about fractions and decimals until they told her where the horizon went. The mural is still on the wall of the center. The birds are a little uneven, and she likes that now.'] },
  'civics-3': { title: 'Mike and the crosswalk', about: 'eight-year-old Mike, a dangerous corner, and three governments in a row', art: 'CS39', alt: 'A boy of eight in an ironed shirt standing at a microphone at a city council meeting, a hand-drawn map of a street corner held up', cast: [], words: ['Mike was eight and walked to school past a corner where cars did not stop. His big brother had been clipped by a mirror there. Mike did what nobody in his house did: he went to a city council meeting, in a shirt his mom ironed, and said the corner needed a crosswalk. The mayor was there. The city, it turned out, owned the street.', 'The council took a vote, and the vote is how a group decides: hands up, count, the most wins, and the losers help anyway. Then the crosswalk needed a light, and the light needed money, and the money came from the state, which also had a governor and a legislature, and a stamp on the letter that came back was printed by the country. Three levels, three jobs, one corner.', 'While they waited, Mike did chores for eleven dollars and had to choose between a book and a ball, and the ball was the cost of the book. He was learning early that there is never enough for everything, and that things get fixed by people who show up. The crosswalk went in the next spring. His brother crossed it first.'] },
  'art-3': { title: 'Chloe looks at a picture', about: 'eight-year-old Chloe at a museum, and the four looks she learned to take', art: 'CS40', alt: 'A girl of eight in a bright yellow coat standing before a large painting of a boat in a storm, an older woman beside her, a museum bench behind', cast: [], words: ['Chloe was eight and already wore the brightest thing in any room. At the museum she stopped in front of a painting of a boat in a storm and said, before anyone asked, that she liked it. Her grandmother, who was not Georgette but might as well have been, told her that liking it was the last thing to say, not the first, and made her look four times.', 'First look: what is in it? A boat, a storm, two people, a bright sail. Second look: how is it built? A dark sky, and the sail placed in the middle where the eye goes. Line, shape, color, value: the seven ingredients of every picture, her teacher had said, and she could find them all. The sail was the lightest value in the whole painting, which was why she had seen it first.', 'Third look: what might it mean? Hope in a storm, she said, and her grandmother nodded. Fourth look: do I like it? Yes, still, and now she knew why. On the way home she mixed the storm in her head from the color wheel: blue and yellow made the sea green, and red across from it made the sail burn. She has been looking four times ever since.'] },
  'art-4': { title: 'Chloe draws the road home', about: 'nine-year-old Chloe, a flat page, and the trick that made it deep', art: 'CS41', alt: 'A girl of nine at a desk drawing a road that narrows to a vanishing point, a near tree large and a far tree small, her traced handprint in the corner', cast: [], words: ['Chloe was nine and could not make the road home look like a road. It sat on the page like a ribbon. Her teacher drew a dot on the horizon and said everything runs to it: the road wide at the bottom, thin at the top, the near tree big and detailed, the far tree small and plain. Overlap, size, placement, detail. The page was suddenly deep enough to walk into.', 'The next lesson was balance. Her own face was symmetrical, the same on both sides; a flower spread from the middle, radial; the fence along the road was a pattern, a post, a post, a post. She had been drawing all three for years without knowing they had names, and knowing the names made her choose them on purpose.', 'The last lesson was the oldest picture in the world, a handprint on a cave wall with horses around it, a story told with no words thousands of years before writing. Chloe put her own hand on the road drawing and traced it. Art tells a story, her teacher had said. Hers was about the way home, and the hand said who had walked it.'] },
  'writing-3': { title: 'Georgette and the letter', about: 'eight-year-old Georgette, a grandmother far away, and her first real paragraph', art: 'CS42', alt: 'A girl of eight at a kitchen table writing a letter in careful print, a paper boat floating in a bowl beside her, an envelope with a distant address', cast: [], words: ['Georgette was eight, read everything, and had never written a letter. Her grandmother lived a day\'s drive away and wrote every week in a hand like lace. Georgette wanted to answer with something worth reading. Her teacher taught her the shape first: the big idea in one sentence, then the details that hold it up. My dog is the best helper. He brings the paper. He finds my shoes. He waits at the door.', 'The second letter explained how to make the paper boats she had learned at school, and the first draft left out a step, so her grandmother\'s boat sank in the sink. What you need, then the steps in order, or the boat does not float. The third draft floated.', 'The third letter was a case: Georgette thought the family should visit at Christmas instead of summer, and she gave two reasons and said it again a new way at the end. I think, because, because, and so. Her grandmother came at Christmas. Georgette kept the letters in a shoebox, and years later, when she was the grandmother people wrote to, she still had them.'] },
  'writing-4': { title: 'Mike writes it down', about: 'nine-year-old Mike, a summer of hard work, and the paragraphs that came out of it', art: 'CS43', alt: 'A boy of nine at a school desk writing, a scrap truck visible through the window behind him, calloused hands on the paper', cast: [], words: ['Mike was nine and spent the summer hauling scrap with his uncle for money the house needed. When school started, the first assignment was a paragraph with a topic sentence, and he wrote the only big thing he knew: hard work is not the same as hard. Then the details: the truck, the weight, the way his hands stopped hurting in July.', 'The opinion paragraph was harder, because Mike had opinions and no practice saying them nicely. Recess should be longer. Reason one: kids think better after running. Reason two: kids get along better after playing. Say it again a new way at the end. His teacher wrote good in the margin, and he kept the page.', 'The small story was about the bird that got into the house that August: beginning, the door left open; middle, the bird on the curtain rod and everyone frozen; end, his uncle opening the window and the bird finding its way out. Mike had not known a summer of scrap could be a story. It turned out everything could, if you gave it a beginning, a middle and an end.'] },
  'writing-5': { title: 'Georgette and the class pet', about: 'ten-year-old Georgette, a five-paragraph case, and a hamster named after a poet', art: 'CS44', alt: 'A girl of ten at the front of a classroom holding a five-page essay, a hamster in a cage on the shelf behind her', cast: [], words: ['Georgette was ten and had decided the class needed a pet. She wrote an informational piece first, three paragraphs on how hamsters live, with an introduction that walked the reader in and a conclusion that walked them out. Her teacher said it read like a tour of a house. That was the idea.', 'Then the opinion essay: paragraph one, our class should have a pet; paragraphs two, three and four, one reason each, it teaches care, it calms us, it is fun; paragraph five, all of it again with the reasons behind it. The class voted. The hamster arrived in October and was named after a poet Georgette liked, which nobody else in the room had heard of.', 'The personal narrative came last, and it was about the moment the hamster escaped and she found it in her coat pocket after an hour of everyone searching. Set the scene, build to the moment, say what changed. What changed was that Georgette learned she could make a room of people do something with five paragraphs. She never forgot it.'] },
  'writing-6': { title: 'Mike argues for the later start', about: 'eleven-year-old Mike, an argument he almost lost, and the evidence that saved it', art: 'CS45', alt: 'A boy of eleven at a library table with a printed argument covered in notes, a nurse\'s log photocopy beside it', cast: [], words: ['Mike was eleven and wanted school to start later, mostly because he was up late doing dishes. His first draft argued from feeling. His teacher, a woman who did not care for feeling in an argument, sent it back with one word: evidence. So Mike found it: the nurse\'s log of morning headaches, a study of a school that had moved its bell, numbers that could be checked.', 'The compare-and-contrast came next, two towns on a river, one with a bridge and one with a ferry, and the last paragraph had to say what the comparison showed. The bridge town grew faster. Mike liked that the essay ended with a finding instead of a feeling.', 'The narrative with dialogue was the one he did not want to write, because it was about the night his mother said they might have to move and he said they would not. "You\'re late," she said. "The bus was early," he said. Two lines, and a reader knew both of them. He turned it in with his hands shaking. It was the best thing in the class.'] },
  'writing-7': { title: 'Chloe and the counterclaim', about: 'twelve-year-old Chloe, an art budget, and the objection she said out loud first', art: 'CS46', alt: 'A girl of twelve in a bright patterned jacket reading a letter aloud at a school board table, board members listening', cast: [], words: ['Chloe was twelve when the school cut the art budget, and she wrote to the board. Her first job was a fair summary of their reasons, with none of her opinion in it, and only then her response. Summarize fairly first; then say what you think. The board member who read it said it was the first letter that had understood them.', 'Her argument named the best objection before anyone else could: some say art is a luxury when reading scores are down. True, she wrote, and then the answer: the students who took art had raised their reading scores that year, and here were the numbers. A fair counterclaim wins trust, and trust was what she needed.', 'The explanatory essay was for the board members who had never taken art, starting where they were, one idea at a time: what a color wheel is, then what value means, then what a child learns by mixing green. The budget came back in the spring, smaller than before but back. Chloe kept the letter. Her handwriting had gotten neater in the middle of it.'] },
  'writing-8': { title: 'Frederick builds the essay', about: 'thirteen-year-old Frederick, a thesis about pond water, and the paragraph that proved it', art: 'CS47', alt: 'A boy of thirteen in an oversized lab coat at a desk with a jar of pond water, a microscope, and a five-paragraph essay with its thesis underlined', cast: [], words: ['Frederick was thirteen and had a jar of pond water on his desk and a thesis nobody could ignore: the pond behind the school was healthier than the county said. A topic is something nobody argues with; a thesis is a fight worth picking. His outline had three reasons, and one of them did not hold the thesis up, so it went.', 'The paragraph that proved it had a claim, evidence and the sentence most writers skip: the warrant. Claim: the pond is healthy. Evidence: fourteen kinds of insect larvae in one jar, counted under the microscope his dad had finally let him use alone. Warrant: mayfly larvae only live in clean water, so fourteen kinds means the water is clean. The evidence counted because the warrant said why.', 'The five-paragraph essay went to the county office with a photograph of the jar. The introduction said the thesis, three body paragraphs carried one reason each, and the conclusion said it again in the light of what was shown. The county sent someone to look. Frederick was there, in a lab coat two sizes too big, and the someone was impressed.'] },
  'history-9': { title: 'Mike reads the map', about: 'fourteen-year-old Mike, a bike trip across the state, and the whole of geography under his wheels', art: 'CS48', alt: 'A teenager of fourteen on a loaded bicycle on a long road with hills ahead, a paper map spread on the handlebars, wind turbines on a ridge', cast: [], words: ['Mike was fourteen and rode his bike across the state that summer with a paper map and a friend, because his family could not afford anything else and because Mike did not want anything else. The map had a scale, one inch to ten miles, and the first day taught him what ten miles felt like in the legs. The key said where the campsites were. The compass rose said which way was home.', 'The state changed under the wheels: wet plains near the coast, rolling hills, then high dry country where the climate had turned by latitude and elevation and distance from the sea. The towns changed too, crowded on the coast and thin on the plains, people per square mile, and Mike saw why: the jobs were where the water was. Fields of wind turbines stood on the ridges, a resource that came back every day, next to oil pumps drawing on one that would not.', 'By the last day he could sketch the state from memory, its rivers and its regions, the way a geographer carries a map in the head. He had also learned that the earth itself moved, that the hills he had climbed were plates pushed together over ages. He was tired and sunburned and would never again think of a place as a name on a sign.'] },
  'reading-9': { title: 'Chloe and the speech', about: 'fifteen-year-old Chloe, a scholarship speech, and the three ways to be believed', art: 'CS49', alt: 'A girl of fifteen in a vivid dress at a podium, a portfolio open on the table, a panel of judges taking notes', cast: [], words: ['Chloe was fifteen and had to give a speech for an art scholarship to a room of adults who had not decided anything. She built it with three tools: her credibility, ethos, the years of work in the portfolio on the table; feeling, pathos, the story of the mural she had painted at nine; and reason, logos, the numbers on what art programs did for a school. Good arguments use the one that fits, and she used all three, in that order.', 'The novel she was reading that month grew a theme the way her speech grew an argument. On page one the character trusted no one; on the last page she handed someone the key. Chloe tracked what changed between the two, because that is where a theme lives, and she found herself tracking her own speech the same way.', 'The judges asked where her numbers came from. She had checked: a study with an author, a date and sources you could follow, not a rumor with a website. One judge had swapped a word in his notes, sprinted for ran, and she noticed the speed leave the sentence. She won the scholarship. The speech is framed in her studio now, in a color the judges would not have chosen.'] },
  'reading-10': { title: 'Georgette and the two newspapers', about: 'sixteen-year-old Georgette, two front pages about one bridge, and how she learned to read a lean', art: 'CS50', alt: 'A girl of sixteen at a breakfast table with two newspapers side by side, a pencil, and a novel with a bookmark', cast: [], words: ['Georgette was sixteen and read two newspapers every morning because her father took one and her mother the other. The week the bridge closed, both were true and neither was whole. One said the shops were losing trade. The other said the money had been cut years ago. Bias is a lean, not a lie; she learned to look for the facts each had left out and the loaded words that filled the gap.', 'Her literature class was reading a novel with a green light in it, mentioned on page 21 and 92 and 180, and Georgette knew by then that a writer does not mention a light three times because of the light. A symbol is a thing that stands for an idea, and repetition is the clue. The character who wanted to be honest and wanted to be liked, and could not have both, was the most real person in the book.', 'The assignment was to paraphrase an editorial precisely, every fact kept and none added, the same cargo in a different truck. She did it twice, once for each paper, and laid them side by side. Where they differed was where the thinking started. She would be the person people came to for wisdom one day. It began with two papers on a kitchen table.'] },
  'reading-11': { title: 'Mike and the satire', about: 'seventeen-year-old Mike, a mock advertisement, and the objection he learned to say first', art: 'CS51', alt: 'A teenager of seventeen in a phone-store polo at a break-room table, a school newspaper with a mock advertisement, a stack of receipts', cast: [], words: ['Mike was seventeen and had a job at a phone store, so when the school paper ran a satire praising a phone that died at noon, he was the first to get the joke: praise with a straight face, and the target was every sales pitch he made all day. He wrote a reply arguing the store\'s side, and his English teacher made him name the best objection before his own case. Some say the plan costs too much. It does, up front. Then the answer.', 'The essay he wrote that spring had a long sentence that carried the reader from the store, past the mall, through the parking lot, to the bus, and then one word on its own line. Stop. He had learned that sentences have speeds, and that a writer switches them on purpose. His teacher read it aloud without saying whose it was.', 'The hardest lesson was enough: a big claim on a small pile of evidence, and Mike had a big claim about the store\'s prices and one week of receipts. Relevant, yes. Sufficient, no. He collected four more weeks before he said it out loud. Mike was becoming a fallibilist, a word he would not learn for years: someone who holds a belief tightly and the evidence for it more tightly still.'] },
  'reading-12': { title: 'Georgette reads two sources', about: 'eighteen-year-old Georgette, two witnesses to one fire, and the word she chose in the end', art: 'CS52', alt: 'A young woman of eighteen in a library archive with two typed witness statements side by side, a fire marshal\'s report, and a pencil', cast: [], words: ['Georgette was eighteen and writing a piece about the old fire station for the town history, and she had two witnesses. Both agreed on the date. One said the station burned because the budget was cut; the other said a heater failed. She held both in her head and did not choose. Where two sources differ is where the thinking starts, and the thinking led her to the fire marshal\'s report, which said heater.', 'The council member who had blamed the budget had skipped a step: from the cut to the fire, with no proof the two were connected. An assumption is the step the writer skipped, and Georgette learned to ask what would have to be true. She also learned that the four ways to describe the firefighters standing in the street were not the same: they walked, strolled, marched, trudged. They had trudged. She wrote trudged.', 'Her piece began at the fire and ended at the rebuilding, and she could say why: the author\'s choices about where to begin and end were the story\'s argument. The town history is in the library now, with her name in it. She was eighteen. The wisdom people would come to her for later was already in the way she read.'] },
  'math-9': { title: 'Frederick and the culture flask', about: 'fourteen-year-old Frederick, a flask of yeast, and the algebra that kept up with it', art: 'CS27', alt: 'A boy of fourteen in a too-big lab coat at a bench with a flask of cloudy yeast, a notebook of curves, a graduate student looking over his shoulder', cast: [], words: ['Frederick was fourteen and had been given a corner of a real lab for the summer, a flask of yeast and a rule: measure everything. The yeast doubled every ninety minutes, and by the second day he had learned the difference between adding and multiplying the hard way. Adding two each round would have reached twenty-one; doubling reached a thousand. Exponential, said the graduate student, and drew the curve.', 'The sugar feed was a function: put in a temperature, out came a growth rate, the same temperature never giving two answers, a vending machine that never lied. The budget for the flasks was two equations with one answer, a flat cost against a cost per flask, and the lines crossed at thirty. Frederick solved it in the margin of his notebook and the graduate student stopped checking his math.', 'The last week he needed the area of a rectangular tray of dishes, x plus 2 by x plus 3, and factored it the other way to find the sides from the area. The lab kept his notebook when the summer ended. He kept the habit. Everything measured, everything written down, and the curve always drawn.'] },
  'math-10': { title: 'Chloe and the shadow', about: 'fifteen-year-old Chloe, a sculpture too tall to measure, and the triangle that measured it', art: 'CS53', alt: 'A girl of fifteen holding a meter stick beside a tall abstract park sculpture, both casting long shadows on the paving', cast: [], words: ['Chloe was fifteen and wanted to know how tall the sculpture in the park was, because she was going to draw it and the proportions mattered. She could not climb it. So she stood at its foot with a meter stick and measured its shadow, then the stick\'s shadow, and the two triangles were the same shape: same angles, every length scaled by the same number. The stick\'s ratio gave the sculpture\'s height. Eleven meters.', 'Her drawing needed the sculpture turned: a rotation on the page, a quarter turn, coordinates swapped and one sign flipped. She reflected it across a line for a second version and slid it for a third, and the three drawings hung side by side in the school show, the same shape three ways.', 'The base of the sculpture was a circle, and she wanted a quarter of it for the frame of the picture, so she cut the crust and the pie both: angle over 360, a quarter of the circumference and a quarter of the area. She never took a trigonometry class she liked. She took one she used, and the sculpture is eleven meters tall, and she was right.'] },
  'math-11': { title: 'Mike and the arch', about: 'sixteen-year-old Mike, a doorway he was paid to build, and the curve that had two answers', art: 'CS54', alt: 'A teenager of sixteen in work gloves fitting a curved wooden garden arch between two posts, a tape measure and a notebook of curves on the grass', cast: [], words: ['Mike was sixteen and building a garden arch for a neighbor for money, the first thing he had ever been paid to design. The arch was a parabola, and it had to touch the ground in two places exactly six feet apart, and the quadratic formula told him where the curve crossed the ground before he cut a single board. The part under the root told him first whether it crossed at all.', 'The lumber came in lengths that multiplied out into four patches of a rectangle, and the rope ladder for the kids next door doubled its knots every trial, two, four, eight, sixteen: a geometric sequence, and he knew the tenth term without counting. The neighbor asked how many doublings would get to a thousand, and Mike knew that was a logarithm before he knew the word.', 'The last problem was the absolute value one: a post four feet from the center could go left or right, two answers, always, because distance has no direction. He set both posts. The arch stood. Mike had grown up believing failure was a verdict; that summer he learned it was a measurement, and measurements can be taken again.'] },
  'math-12': { title: 'Georgette and the tide', about: 'seventeen-year-old Georgette, a sea wall, and the circle that predicted the water', art: 'CS55', alt: 'A young woman of seventeen on a sea wall at dawn with a tide table and a notebook, a boat in the harbor below, a circle sketched in the margin', cast: [], words: ['Georgette was seventeen and spent the summer on her aunt\'s coast, where the tide was the whole calendar. She wanted to predict it, and the shape of a tide is a sine wave: a walk around a circle of radius one, the height of the water being how far up you are on the circle at any hour. At 45 degrees she was equally across and up; the water was halfway.', 'The tide table shifted every day, and shifting a function is moving the picture on the wall: add outside the brackets and it lifts; subtract inside and it slides right. Two machines in a row, hour into height and height into whether the boat could leave, was a composite function, and she worked it inside out every morning before breakfast.', 'Her aunt\'s well water was being tested for something that decayed with a half-life, and Georgette halved and halved the numbers until they were safe, four half-lives, sixteen times smaller. The ends of every curve she drew did what the highest power told them to. She left the coast in August with a notebook of tides and the habit of predicting things she could not control, which turned out to be most of life.'] },
  'history-college': { title: 'Mike thinks like a historian', about: 'Mike at twenty-one, the story of his own block, and the difference between bricks and a house', art: 'CS56', alt: 'A young man of twenty-one, bald and bearded, presenting at a community-college lectern with a photograph of an old city block, an elderly woman in the back row and a red-haired woman in the front', cast: [], words: ['Mike was twenty-one and taking one class at the community college between shifts, and the class was history, which he had assumed was memorizing. It was not. It was evidence. The first assignment was the history of his own block, and he had two kinds of sources: his grandmother, who had been there, primary; and a newspaper clipping written forty years later, secondary. The grandmother was more vivid and the clipping more careful, and he learned to use both.', 'The block had been built in 1889, which was the nineteenth century, because centuries are named one ahead of their years. The fire that had emptied it in 1958 had a long-term cause, the dry wood of a landlord who never repaired anything, and a trigger, a match. Historians name both, the fuse and the spark.', 'His final paper was a thesis, not a fact: the block was rebuilt because the neighbors organized, not because the city cared. Bricks are facts; a house is an argument you could lose. He defended it in front of the class with his grandmother in the back row. Savanah was in the front. That is how they met, and it is the only story of the block Mike still tells.'] },
  'math-college': { title: 'Frederick and the numbers that lied', about: 'Frederick at twenty-two, a lab full of data, and the day he stopped trusting an average', art: 'CS57', alt: 'A young man of twenty-two in a lab coat at a bench with a laptop of scattered data points, a napkin of calculations, and a flask set apart from the others', cast: [], words: ['Frederick was twenty-two and working in a real lab now, with a dataset of cell counts and a supervisor who wanted a number. The mean was easy and it lied: one flask had gone wild and pulled the average up while the median sat where the real flasks were. Two batches with the same mean had nothing else in common; one was tight and one was scattered. The spread told the story the average hid.', 'The probability of a contaminated flask was three in eight on the old equipment, and over a hundred runs it came out at thirty-seven, close enough to trust the odds. The grant money sat in an account earning interest on its interest, a snowball rolling downhill, and Frederick did the arithmetic on a napkin and understood why the university never spent it early.', 'His first paper had a correlation in it that the reviewers loved and Frederick did not: the cells grew faster in the summer flasks. So did the lab\'s ice cream budget. Hot rooms, not ice cream, and not summer either. Look for the third thing. He took the claim out. The paper was shorter and true, and his supervisor said that was the whole job.'] },
  'reading-college': { title: 'Georgette and the argument', about: 'Georgette at twenty, an academic argument that did not hold, and the four sentences that fixed it', art: 'CS58', alt: 'A young woman of twenty in a university library with a paper marked in red, a stack of journals, and a window onto a campus lawn', cast: [], words: ['Georgette was twenty and reading for a degree, and the first paper she wrote came back with one comment: this is a topic, not a thesis. Cities have parks. Nobody argues. Cities should fund parks before roads: now someone could. She picked the fight, and the fight organized everything after it.', 'Each paragraph needed a claim, evidence and a warrant, and the warrant was the sentence most writers skip, the one that says why the evidence counts. A paper she was assigned to review said forty percent, of nothing in particular, a number with no clothes on, and another said a plan was cheap in paragraph two and the most expensive ever in paragraph six. She listed the claims and checked whether they could all be true. They could not.', 'Her own paper ran eight pages and held. She had learned to read the way a careful person listens: for the step that was skipped, for the number without its base, for the two sentences that cannot both stand. Years later, when Mike brought her his troubles and asked what she thought, that is how she thought. It began in a library at twenty with a comment in red.'] },
  'writing-9': { title: 'Mike and the turn', about: 'fourteen-year-old Mike, an ordinary evening, and the phone call that changed the paragraph', art: 'CS59', alt: 'A boy of fourteen at a kitchen table with homework spread out, a wall phone ringing, a plate of dinner going cold', cast: [], words: ['Mike was fourteen when the analysis paragraph clicked: a claim about the narrator, a quotation, and then the sentence that said what the quotation showed. The quote never spoke for itself. He had been letting quotes speak for themselves for years and wondering why teachers wrote so what in the margin.', 'The narrative with a turn was assigned the week the phone rang at dinner and his uncle was in the hospital. Everything had been ordinary, dishes and homework, and then the phone. He wrote it slowly at the turn, the way the assignment said, and let the ending show what the call had changed, which was everything and, by the end of the year, nothing, because his uncle came home.', 'The rhetorical analysis was of the mayor\'s speech about the crosswalk Mike had asked for at eight. What did it argue, which appeals, did they fit? A boy\'s story, a nurse\'s credibility, the numbers. They fit. Mike gave the analysis an A in his own head before the teacher did, and was right, which was becoming a habit.'] },
  'writing-10': { title: 'Chloe writes about a painting', about: 'fifteen-year-old Chloe, a novel and a painting, and the argument that needed three scenes', art: 'CS60', alt: 'A girl of fifteen in a paint-flecked jacket at a desk with a novel bristling with sticky notes, a photograph of a community mural pinned above', cast: [], words: ['Chloe was fifteen and had a claim about the novel her class read that nobody else had made: the house was the real villain. Her teacher said prove it three times. She found the house on page 3, page 150 and page 300, quoted each, and after each quotation wrote the sentence that said what it showed. One scene proves a moment; three prove a pattern.', 'The sourced argument was about the school\'s plan to paint over the community-center mural she had planned at nine. Every fact had a name behind it: the center\'s director, the city\'s own survey, a study of murals and neighborhood pride. An argument with sources is an argument someone can check. The mural stayed.', 'The reflective essay was two columns. Before: she had thought art was about the picture. After: it was about the people who walked past it every day. The gap between the columns was the essay, and it was the first thing she wrote that made her mother cry, in the good way.'] },
  'writing-11': { title: 'Frederick writes the op-ed', about: 'sixteen-year-old Frederick, three sources that disagreed, and thirty seconds of a stranger\'s attention', art: 'CS61', alt: 'A boy of sixteen in a lab coat at the edge of a pond, a printed newspaper op-ed with his name on it, a county biologist crouched at the water', cast: [], words: ['Frederick was sixteen and had three sources on the pond behind the school, and they disagreed. The synthesis essay was organized by his reasons, not by his sources, and where the sources argued he said so instead of pretending. The literary argument that term was about a river in a novel being the book\'s conscience, proved from the first page to the last, and he realized he was making the same case twice, once for a river and once for a pond.', 'The op-ed was the one that mattered. The local paper gave him three hundred words and a stranger\'s thirty seconds. Hook: the county said the pond was dying, and it was not. Position, evidence, one specific ask: send a biologist. He rewrote the first line eleven times.', 'The paper ran it. A biologist came. Frederick was there in the lab coat that was almost the right size by then, and the biologist asked where he was applying to college, and Frederick, who had never thought of himself as the kind of person who got asked that, said he did not know yet. He knew by the fall.'] },
  'writing-12': { title: 'Georgette and the letter to the editor', about: 'eighteen-year-old Georgette, a research paper on her town\'s water, and one page for the paper', art: 'CS62', alt: 'A young woman of eighteen sealing a one-page letter, a thick research paper on the desk behind her, a newspaper folded to the letters page', cast: [], words: ['Georgette was eighteen and her research paper started with a question: where did the town\'s water come from, and was it safe? She reported what five sources said, then built her own answer on top and said which source held which part. The paper was long. The answer was short: the river, and mostly.', 'The personal essay for her college application was one afternoon, not a whole year: the day at eleven when she had found her grandmother\'s letters in a shoebox and understood that writing was how the two of them had been close across a day\'s drive. One small true moment, told well. It was the essay the admissions officer mentioned in the acceptance letter.', 'The letter to the editor was one point, one ask, one page: the town should publish its water tests, with the twelve results she had already found. A busy stranger was reading. The paper printed it on a Tuesday. The town published the tests in June. Georgette learned that year that a page can move a town, and that the page had better be right.'] },
};
export function courseStoryFor(courseId) { return COURSE_STORIES[courseId] || null; }
// Technology, added on 2026-09-23.
STORIES['inputs-and-outputs'] = {
  about: 'a talking toaster that only knew three things',
  more: [{ serial: 'S1200', after: 0, alt: 'The dial being turned to 3' }, { serial: 'S1201', after: 2, alt: 'Two slices of toast popping up' }],
  title: 'The toaster', art: 'S1199', cast: [],
  alt: 'A child pressing the lever on a toaster, the toast popping up, a cartoon speech bubble with no words',
  words: [
    'The toaster had a lever, a dial and a slot. Push, turn: inputs.',
    'Toast popped up: the output. In between, the toaster followed its steps: heat, wait, pop.',
    'Inputs tell a computer. Outputs show you. A program is the steps in between.',
  ],
};
STORIES['steps-in-order'] = {
  about: 'a sandwich made by someone who did exactly what she was told',
  more: [{ serial: 'S1203', after: 0, alt: 'The lid being unscrewed at last' }, { serial: 'S1204', after: 2, alt: 'A finished sandwich, the child laughing' }],
  title: 'Exactly as told', art: 'S1202', cast: [],
  alt: 'A child reading instructions aloud while a grown-up follows them literally, a knife stuck in a jar lid',
  words: [
    'Put the knife in the jar, the child said. The grown-up pushed the knife into the lid. Nobody had said open the jar.',
    'Start over. Open the jar. Then the knife. Then the bread. In order, with nothing skipped.',
    'An algorithm is steps in order. The order matters and every step must be there.',
  ],
};
STORIES['patterns-and-loops'] = {
  about: 'a necklace of beads that only needed one instruction',
  more: [{ serial: 'S1206', after: 0, alt: 'The two beads that repeat, held up' }, { serial: 'S1207', after: 2, alt: 'The finished necklace, red and blue all the way round' }],
  title: 'Repeat six times', art: 'S1205', cast: [],
  alt: 'A child threading red and blue beads, a card beside them reading repeat with no words',
  words: [
    'Red, blue, red, blue. Twelve beads, one pattern.',
    'Instead of twelve instructions: repeat red, blue six times.',
    'A loop repeats the same steps. Find the part that repeats.',
  ],
};
STORIES['variables'] = {
  about: 'a scoreboard at the park',
  more: [{ serial: 'S1209', after: 0, alt: 'The chalk number wiped and rewritten' }, { serial: 'S1210', after: 2, alt: 'The final scoreboard, home 7, away 5' }],
  title: 'The scoreboard', art: 'S1208', cast: [],
  alt: 'A park game with a chalk scoreboard, a child changing a number',
  words: [
    'Home: 0. Away: 0. Two boxes with names.',
    'Home scored. The number in the home box became 1, then 3. The box stayed; what was in it changed.',
    'A variable is a named box that holds a value and can change.',
  ],
};
STORIES['if-then'] = {
  about: 'a thermostat that never sleeps',
  more: [{ serial: 'S1212', after: 0, alt: 'The heater glowing as the room cools' }, { serial: 'S1213', after: 2, alt: 'The heater dark, the room warm' }],
  title: 'The little decider', art: 'S1211', cast: [],
  alt: 'A child looking at a thermostat on a wall, a small speech bubble drawn beside it with no words',
  words: [
    'IF the room is colder than 68 THEN heat on, ELSE heat off.',
    'All night it asked the same yes-or-no question and took one road or the other.',
    'IF a condition is true THEN a step runs. ELSE is the other road.',
  ],
};
STORIES['finding-the-bug'] = {
  about: 'a robot that ended up facing the wall',
  more: [{ serial: 'S1215', after: 0, alt: 'The child pacing out the steps with their own feet' }, { serial: 'S1216', after: 2, alt: 'The robot facing the door, the sheet corrected' }],
  title: 'The robot and the wall', art: 'S1214', cast: [],
  alt: 'A child with a toy robot facing a wall, a sheet of steps in hand',
  words: [
    'Turn right, walk three, turn left. The robot faced the wall.',
    'Walk the steps yourself. Right, three, left: the bug was the last turn. It should have been right.',
    'Debugging is reading the steps one at a time and checking each.',
  ],
};
STORIES['binary'] = {
  about: 'four light switches worth 8, 4, 2 and 1',
  more: [{ serial: 'S1218', after: 0, alt: 'The 8 and 2 switches up, the others down' }, { serial: 'S1219', after: 2, alt: 'All four up: 15' }],
  title: 'Four switches', art: 'S1217', cast: [],
  alt: 'A child at a row of four light switches, some up and some down',
  words: [
    'Four switches, worth 8, 4, 2 and 1.',
    'Flip on the 8 and the 2. The row says 10.',
    'Binary counts with places worth 8, 4, 2, 1. Add the places that are on.',
  ],
};
STORIES['how-the-internet-works'] = {
  about: 'a puzzle mailed one piece at a time',
  more: [{ serial: 'S1221', after: 0, alt: 'Envelopes arriving out of order on a doormat' }, { serial: 'S1222', after: 2, alt: 'The finished puzzle on a table' }],
  title: 'One piece per envelope', art: 'S1220', cast: [],
  alt: 'A child dropping envelopes into a mailbox, each with a puzzle piece drawn on it',
  words: [
    'A jigsaw puzzle, mailed one piece per envelope, each with the address and a number.',
    'The envelopes took different trucks and arrived out of order. The friend rebuilt the picture from the numbers.',
    'Messages travel as addressed packets; DNS turns names into number addresses.',
  ],
};
STORIES['passwords-and-privacy'] = {
  about: 'the message that said now',
  more: [{ serial: 'S1224', after: 0, alt: 'The phone set face down on the table' }, { serial: 'S1225', after: 2, alt: 'The real site open on a laptop, everything normal' }],
  title: 'Now, it said', art: 'S1223', cast: [],
  alt: 'A teenager looking at a phone with an urgent message, a thoughtful pause',
  words: [
    'Your account is locked. Click now. The message was in a hurry.',
    'The teenager did not click. She opened the site the usual way. Nothing was locked.',
    'Long passwords, a second proof, and never through the link.',
  ],
};
// Health, added on 2026-09-23.
STORIES['washing-hands'] = {
  about: 'glitter that would not come off with water alone',
  more: [{ serial: 'S1227', after: 0, alt: 'The glitter stuck after water alone' }, { serial: 'S1228', after: 2, alt: 'Clean hands held up, the glitter gone' }],
  title: 'The glitter', art: 'S1226', cast: [],
  alt: 'A child at a sink with glitter on their hands, a bar of soap, a grown-up counting on fingers',
  words: [
    'Glitter on both hands. Water only. Some stayed.',
    'Soap, and count to twenty. Between the fingers. Gone.',
    'Wash before eating and after the bathroom: soap, water, count to twenty.',
  ],
};
STORIES['brushing-teeth'] = {
  about: 'a fence with a picket for every tooth',
  more: [{ serial: 'S1230', after: 0, alt: 'The four corners of the mouth, one at a time' }, { serial: 'S1231', after: 2, alt: 'A two-minute timer ringing' }],
  title: 'The fence', art: 'S1229', cast: [],
  alt: 'A child brushing teeth in a mirror, a small fence drawn on the mirror with a picket for each tooth',
  words: [
    'A fence of teeth. Every picket needs paint, both sides.',
    'Two minutes. Top right, top left, bottom left, bottom right.',
    'Brush two times a day for two minutes, front, back and tops.',
  ],
};
STORIES['sleep-k'] = {
  about: 'a phone that charged overnight, and a boy who did not',
  more: [{ serial: 'S1233', after: 0, alt: 'The grumpy morning face at breakfast' }, { serial: 'S1234', after: 2, alt: 'The next night: bath, book, bed, and asleep' }],
  title: 'Charged', art: 'S1232', cast: [],
  alt: 'A child asleep in bed, a phone charging on the nightstand with a glowing light',
  words: [
    'The phone charged all night. The boy stayed up.',
    'In the morning the phone was at a hundred. The boy was at fifty, and grumpy.',
    'Ten to twelve hours of sleep, with the same quiet routine each night.',
  ],
};
STORIES['my-plate'] = {
  about: 'a plate that looked like a rainbow',
  more: [{ serial: 'S1236', after: 0, alt: 'The plate divided into four parts' }, { serial: 'S1237', after: 2, alt: 'The child drinking a glass of water' }],
  title: 'The rainbow plate', art: 'S1235', cast: [],
  alt: 'A child looking at a plate with red tomatoes, orange carrots, green peas and purple grapes',
  words: [
    'Red tomatoes. Orange carrots. Green peas. Purple grapes.',
    'Half the plate, all colors. A glass of water beside it.',
    'Half the plate fruits and vegetables; water to drink.',
  ],
};
STORIES['sleep-and-the-brain'] = {
  about: 'a librarian who only worked nights',
  more: [{ serial: 'S1239', after: 0, alt: 'The pile of papers on the desk at bedtime' }, { serial: 'S1240', after: 2, alt: 'The desk clear in the morning' }],
  title: 'The night librarian', art: 'S1238', cast: [],
  alt: 'A child asleep, a dream-library drawn above with a librarian filing papers',
  words: [
    'All day the papers piled up on the desk: spelling words, a math trick, a friend\'s name.',
    'The librarian came at night and filed them. Skip the night, and the desk was a mess in the morning.',
    'Nine to eleven hours; the brain files the day while you sleep; screens off an hour before.',
  ],
};
STORIES['reading-a-food-label'] = {
  about: 'a cereal box that won a race it should not have',
  more: [{ serial: 'S1242', after: 0, alt: 'The measuring cup beside the bowl, showing two servings' }, { serial: 'S1243', after: 2, alt: 'Two boxes compared side by side' }],
  title: 'The race on the box', art: 'S1241', cast: [],
  alt: 'A child reading the side of a cereal box at a breakfast table',
  words: [
    'The label said 12 grams of sugar. Per serving. The serving was half the bowl.',
    'The ingredients were a race result, and sugar came second.',
    'Check the serving size first; ingredients are listed most to least.',
  ],
};
STORIES['the-heart-at-work'] = {
  about: 'a pulse counted at the top of the stairs',
  more: [{ serial: 'S1245', after: 0, alt: 'The child running the stairs' }, { serial: 'S1246', after: 2, alt: 'The four numbers written on a hand' }],
  title: 'Top of the stairs', art: 'S1244', cast: [],
  alt: 'A child counting a pulse at the wrist at the top of a staircase, a stopwatch in the other hand',
  words: [
    'Sitting: twelve beats in ten seconds. After the stairs: twenty-five.',
    'A minute later: eighteen. Two minutes: thirteen. The heart came back fast.',
    'Muscles at work need more blood; an hour of play a day; a fit heart settles quickly.',
  ],
};
STORIES['screens-and-you'] = {
  about: 'twenty minutes, twenty feet, twenty seconds',
  more: [{ serial: 'S1248', after: 0, alt: 'The far trees out the window' }, { serial: 'S1249', after: 2, alt: 'The tablet set down, an hour before bed' }],
  title: 'Twenty, twenty, twenty', art: 'S1247', cast: [],
  alt: 'A child at a tablet looking up and out a window toward far trees',
  words: [
    'Sore eyes. A stiff neck. Twenty minutes had become sixty.',
    'Look twenty feet away for twenty seconds. The eyes let go.',
    'Screens off an hour before bed; a twenty-second break every twenty minutes; share only with a trusted adult.',
  ],
};
// Music, added on 2026-09-23.
STORIES['the-steady-beat'] = {
  about: 'a clock, a heartbeat and a marching song',
  more: [{ serial: 'S1251', after: 0, alt: 'The child\'s feet stepping in time' }, { serial: 'S1252', after: 2, alt: 'A hand on the chest, feeling a heartbeat' }],
  title: 'The clock in the song', art: 'S1250', cast: [],
  alt: 'A child marching in place next to a big ticking clock, a grown-up clapping',
  words: [
    'Tick, tick, tick. The clock kept time.',
    'The song had a clock inside it too. Left, right, left, right, the feet found it.',
    'The beat is the even pulse under a song, like a clock. Clap it, tap it, march to it.',
  ],
};
STORIES['high-and-low'] = {
  about: 'a bird and a cow at the fence',
  more: [{ serial: 'S1254', after: 0, alt: 'Fingers walking up the piano keys' }, { serial: 'S1255', after: 2, alt: 'The bird and the cow, one small and one big' }],
  title: 'The bird and the cow', art: 'S1253', cast: [],
  alt: 'A child at a fence with a bird on a post and a cow behind it',
  words: [
    'The bird sang. High. The cow mooed. Low.',
    'Inside, on the piano, the child walked fingers to the right and the notes climbed toward the bird.',
    'High and low is pitch. On a piano, right is higher.',
  ],
};
STORIES['loud-and-soft'] = {
  about: 'a lullaby and a parade on the same afternoon',
  more: [{ serial: 'S1257', after: 0, alt: 'The drum in the parade' }, { serial: 'S1258', after: 2, alt: 'The doll asleep by the window' }],
  title: 'The lullaby and the parade', art: 'S1256', cast: [],
  alt: 'A child singing softly to a doll by a window while a parade with a drum passes outside',
  words: [
    'The parade drum was loud. It had to reach the whole street.',
    'The lullaby was soft. It had to reach one baby.',
    'Loud and soft is dynamics. A song can grow louder or fade.',
  ],
};
STORIES['note-lengths'] = {
  about: 'a pizza cut into notes',
  more: [{ serial: 'S1260', after: 0, alt: 'The slices lined up from biggest to smallest' }, { serial: 'S1261', after: 2, alt: 'The child clapping eight quick claps' }],
  title: 'The music pizza', art: 'S1259', cast: [],
  alt: 'A child at a table with a pizza cut into a half, a quarter and two eighths, a sheet of music beside it',
  words: [
    'A whole pizza: a whole note. Four beats.',
    'Cut it in half: two half notes. Cut again: quarters, one beat each. Again: eighths, half a beat.',
    'Whole four beats, half two, quarter one, eighth a half. They add up like fractions.',
  ],
};
STORIES['the-staff'] = {
  about: 'a ladder of letters',
  more: [{ serial: 'S1263', after: 0, alt: 'The five lines drawn on a board with letters climbing' }, { serial: 'S1264', after: 2, alt: 'The child pointing at the top rung' }],
  title: 'The ladder', art: 'S1262', cast: [],
  alt: 'A child on a stepladder pointing at rungs, each rung and gap labeled with a note letter drawn in the air',
  words: [
    'Five lines. Four spaces. A ladder.',
    'Every Good Boy Does Fine up the lines. FACE up the spaces.',
    'Five lines and four spaces; lines E G B D F, spaces F A C E; higher on the staff is higher in pitch.',
  ],
};
STORIES['tempo-and-dynamics'] = {
  about: 'four Italian words on a music stand',
  more: [{ serial: 'S1266', after: 0, alt: 'The child playing loudly, then softly' }, { serial: 'S1267', after: 2, alt: 'A lullaby card marked piano and adagio' }],
  title: 'Four words', art: 'S1265', cast: [],
  alt: 'A child at a music stand with four words on cards: forte, piano, allegro, adagio',
  words: [
    'Forte: loud. Piano: soft. The instrument was named for doing both.',
    'Allegro: fast. Adagio: slow. The speed dial.',
    'Forte loud, piano soft; tempo is speed: allegro fast, adagio slow.',
  ],
};
export const STORY_WORD_LIMIT = { early: 200, older: 350 };
export function storyFor(moduleId) { return STORIES[moduleId] || null; }
