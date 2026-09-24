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
      'So she counted the way ducks count. One bump of the beak for each. One. Two. Three. Four. Then nothing.',
      'The fifth duckling was stuck behind a lily pad, peeping. She went back for it. Five.',
      'Counting is how you know something is missing. You know before you can see it.',
    ],
  },
  'magnets': {
  about: 'a toy boat pulled across a pond by a magnet',
    title: 'The needle that knew', art: 'S3', more: [{ serial: 'S33', after: 0, alt: 'A toy boat with a magnet on its bow drifting on a pond, a child on the bank holding a magnet on a string' }, { serial: 'S34', after: 3, alt: 'Two bar magnets on a table, one flipped, pushing apart with a tiny gap between them' }], cast: [],
    alt: 'A small wooden fishing boat in thick fog, a compass needle glowing on its deck',
    words: [
      'A little fishing boat went out one morning. The fog rolled in behind it. Thick fog. The sea looked the same in every direction.',
      'The fisher turned the boat one way, then the other. Every way looked like home. Every way looked like nowhere.',
      'On the deck sat a compass: a tiny magnet on a pin. It did not care about the fog. It swung, wobbled, and settled, pointing north. A magnet always does.',
      'The fisher turned until north was on the left, and rowed. The harbor came out of the fog.',
      'A magnet pulls even when you cannot see what pulls it. That is why you can trust it.',
    ],
  },
  'telling-time': {
  about: 'a town that ran on the clock tower',
    title: 'The clock that ran the town', art: 'S4', more: [{ serial: 'S35', after: 0, alt: 'A town square with a clock tower reading three o\'clock, market stalls below' }, { serial: 'S36', after: 3, alt: 'The same clock face at half past, the long hand straight down, pigeons on the ledge' }], cast: [],
    alt: 'A tall clock tower above a small town square at sunrise, birds circling the clock face',
    words: [
      'In one small town, nobody owned a watch. There was one clock, high on the tower. All of them looked up at it.',
      'The baker looked up at six and lit her oven. The bus driver looked up at eight and shut his doors. The children looked up at three and ran.',
      'One winter the clock stopped. The town did not know it. The bread was late. The bus was early. The children waited at the gate. Everyone was doing their part, and nothing fit together.',
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
    'The sun never goes anywhere. The Earth turns slowly, like a ball rolling in a big room. Your side of the Earth turns to face the sun. Then it is day. When it turns away, it is night. The rooster is not in charge. Neither are you.',
    'He crowed anyway. It felt right.',
    'Day and night are the Earth turning, one turn a day. Nobody has to crow.',
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
    'The sun was hot. A gull circled. The crab hurried from rock to rock. It wanted a home that fit.',
    'It tried a bottle cap. Too flat. It tried a pebble. Too hard. Then it found an empty spiral shell in the tide pool. It backed in and fit just right.',
    'A habitat is where a living thing has what it needs. Food, water, shelter, and room. For the crab, that is the shore. Tide pools and spare shells.',
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
    'A plant needs three things. Water, light, and soil to hold its roots. Take one away and it shows you.',
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
    'Hot things cool down. Cold things warm up. It all ends up like the room.',
    'Hot and cold are how something feels next to you. Be careful with hot. Be slow with cold.',
  ],
};
// Pre-K stories: the fewest words that still make a story, three pictures each, read aloud.
STORIES['red-and-blue'] = {
  about: 'a red ball, a blue ball, and the girl who found hers by its color',
  more: [{ serial: 'S96', after: 1, alt: 'The two balls bumping and stopping together' }, { serial: 'S97', after: 3, alt: 'The girl hugging the red ball' }],
  title: 'Two balls', art: 'S95', cast: [],
  alt: 'A small girl between a red ball and a blue ball on the grass',
  words: [
    'A red ball rolled. A blue ball rolled. Bump. They stopped together.',
    'Which one was mine? They were the same size.',
    'Mine is red, I said. I picked the red one. The blue one went home with Sam.',
    'Red and blue are colors. They tell things apart.',
  ],
};
STORIES['big-and-small'] = {
  about: 'a big dog, a small dog, and one small bed',
  more: [{ serial: 'S99', after: 1, alt: 'The big dog with his legs hanging off the bed' }, { serial: 'S100', after: 3, alt: 'The small dog curled up in the small bed, the big dog on a rug' }],
  title: 'One small bed', art: 'S98', cast: [],
  alt: 'A big dog squeezed onto a small dog bed while a small dog watches',
  words: [
    'Big dog was big. Small dog was small. There was one small bed.',
    'Big dog tried it. His legs hung off. It did not fit.',
    'Small dog curled up in it. Just right. Big dog took the big rug.',
    'Big is more room. Small is less.',
  ],
};
STORIES['one-and-two'] = {
  about: 'one duck on a pond, and the splash that made two',
  more: [{ serial: 'S102', after: 1, alt: 'One duck alone on the water' }, { serial: 'S103', after: 3, alt: 'Two ducks swimming side by side' }],
  title: 'Splash', art: 'S101', cast: [],
  alt: 'One duck on a pond as another lands with a splash',
  words: [
    'One duck swam on the pond. One. All by itself.',
    'It quacked. Nobody quacked back.',
    'Splash. Another duck landed. Now there were two. Quack, quack.',
    'One, then two.',
  ],
};
STORIES['please-and-thank-you'] = {
  about: 'a cookie that came only when the magic word did',
  more: [{ serial: 'S105', after: 1, alt: 'The child grabbing, the plate pulled back' }, { serial: 'S106', after: 3, alt: 'The child holding a cookie with a big smile' }],
  title: 'The magic word', art: 'S104', cast: [],
  alt: 'A small child at a kitchen table reaching for a plate of cookies held by a parent',
  words: [
    'Cookie! I grabbed. The plate did not move.',
    'I grabbed again. Still no cookie.',
    'Cookie, please? The plate came down. Thank you! The cookie was mine.',
    'Please to ask. Thank you when you get it.',
  ],
};
STORIES['colours'] = {
  about: 'a rainbow after the rain, one color at a time',
  more: [{ serial: 'S108', after: 1, alt: 'The red band at the top of the rainbow' }, { serial: 'S109', after: 3, alt: 'The whole rainbow, every color in a row' }],
  title: 'One color at a time', art: 'S107', cast: [],
  alt: 'A child pointing at a rainbow over a wet backyard',
  words: [
    'The rain stopped. The sun came out. A rainbow began.',
    'I wanted to name it. It had so many colors.',
    'First red. Then orange. Then yellow. Green. Blue. Purple. One at a time.',
    'Every color has a name.',
  ],
};
STORIES['patterns'] = {
  about: 'red bead, blue bead, and what came next',
  more: [{ serial: 'S111', after: 1, alt: 'A string of beads, red blue red blue' }, { serial: 'S112', after: 3, alt: 'A hand picking a red bead for next' }],
  title: 'Red, blue, red, blue', art: 'S110', cast: [],
  alt: 'A child threading beads on a string, red and blue taking turns',
  words: [
    'Red bead. Blue bead. Red bead. Blue bead.',
    'What comes next? I did not know.',
    'Look back. Red, blue, red, blue. Say it. Red! A pattern repeats.',
    'A pattern repeats. Say it out loud to find what comes next.',
  ],
};
STORIES['taking-turns'] = {
  about: 'one swing, two children, and counting to ten',
  more: [{ serial: 'S114', after: 1, alt: 'One child swinging, the other waiting' }, { serial: 'S115', after: 3, alt: 'The children swapping places' }],
  title: 'Count to ten', art: 'S113', cast: [],
  alt: 'Two children at one swing, one counting on fingers',
  words: [
    'One swing. Two children. Both wanted it now.',
    'Pull. Pull. Nobody swung.',
    'You go, then I go. Count to ten. Then swap. Everyone swung.',
    'Wait, and then it is your turn.',
  ],
};
STORIES['listen-for-rhymes'] = {
  about: 'a cat on a mat with a hat, and the sound they shared',
  more: [{ serial: 'S117', after: 1, alt: 'The cat on the mat' }, { serial: 'S118', after: 3, alt: 'The cat wearing a hat' }],
  title: 'Cat, mat, hat', art: 'S116', cast: [],
  alt: 'A child in bed giggling at a cat in a hat on a mat',
  words: [
    'A cat sat on a mat. Cat. Mat.',
    'Hear it? They end the same.',
    'The cat put on a hat. Hat. Cat. Mat. All the same at the end.',
    'Rhymes end the same way.',
  ],
};
// The rest of pre-K, in the fewest words that still make a story.
STORIES['find-the-match'] = {
  about: 'one red mitten, and the hunt for the other',
  more: [{ serial: 'S120', after: 1, alt: 'A blue mitten and a big black mitten, not matches' }, { serial: 'S121', after: 3, alt: 'Two red mittens together on two hands' }],
  title: 'The other mitten', art: 'S119', cast: [],
  alt: 'A small boy holding one red mitten, looking in a basket of mittens',
  words: [
    'One red mitten. Cold hands. Where was the other?',
    'A blue one? No. A big black one? No.',
    'A red one, small, just like it. Yes. A match. Two warm hands.',
    'Same means just alike.',
  ],
};
STORIES['match-the-animals'] = {
  about: 'a duckling looking for one like itself',
  more: [{ serial: 'S123', after: 1, alt: 'The duckling next to a hen, not the same' }, { serial: 'S124', after: 3, alt: 'Two ducklings side by side, just alike' }],
  title: 'Like me?', art: 'S122', cast: [],
  alt: 'A duckling looking up at a hen, a goat and a cat in a farmyard',
  words: [
    'A duckling looked around. Is that one like me?',
    'A hen. No. A goat. No. A cat. No.',
    'Then, a duckling. Same feathers. Same peep. Yes, just alike.',
    'The same means just alike.',
  ],
};
STORIES['more-or-fewer'] = {
  about: 'two bowls of grapes, and the one with more',
  more: [{ serial: 'S126', after: 1, alt: 'The full bowl of grapes' }, { serial: 'S127', after: 3, alt: 'The bowl with three grapes' }],
  title: 'Two bowls', art: 'S125', cast: [],
  alt: 'A small girl looking at two bowls of grapes, one full and one nearly empty',
  words: [
    'Two bowls of grapes. This one was full. That one had three.',
    'Which one had more? I wanted more.',
    'The full one. More means a bigger group. I picked the full one.',
    'More means a bigger group.',
  ],
};
STORIES['first-marks'] = {
  about: 'a crayon that made a dot, and the dot that became a line',
  more: [{ serial: 'S129', after: 1, alt: 'One dot on the paper' }, { serial: 'S130', after: 3, alt: 'A wobbly line going across the page' }],
  title: 'The first line', art: 'S128', cast: [],
  alt: 'A small child pressing a fat crayon onto paper, a dot and a wobbly line',
  words: [
    'A crayon touched the paper. It made a dot.',
    'A dot is nice. But it does not go anywhere.',
    'The crayon moved. The dot became a line. Wobbly. Then it went off the page.',
    'Start at the dot. Follow the line.',
  ],
};
STORIES['three-dots'] = {
  about: 'three dots, and the shape that appeared when they joined',
  more: [{ serial: 'S132', after: 1, alt: 'The three numbered dots before any line' }, { serial: 'S133', after: 3, alt: 'A triangle made by joining the dots' }],
  title: 'One, two, three', art: 'S131', cast: [],
  alt: 'A child drawing a line from dot one to dot two to dot three on a page',
  words: [
    'One. Two. Three. Three dots on the page. Just dots.',
    'What were they for?',
    'From one to two. From two to three. From three back to one. A triangle!',
    'Start at 1 and draw to each dot in order.',
  ],
};
STORIES['yellow-and-green'] = {
  about: 'a yellow sun, green grass, and a morning outside',
  more: [{ serial: 'S135', after: 1, alt: 'The yellow sun in the sky' }, { serial: 'S136', after: 3, alt: 'A hand on cool green grass' }],
  title: 'Sun and grass', art: 'S134', cast: [],
  alt: 'A small child lying in green grass under a bright yellow sun',
  words: [
    'The sun came up. Yellow. Bright yellow.',
    'I lay down outside. Something cool was under me.',
    'Grass. Green. Cool green. Yellow up, green down.',
    'Yellow like the sun. Green like the grass.',
  ],
};
STORIES['triangles-too'] = {
  about: 'a slice of pizza with three corners',
  more: [{ serial: 'S138', after: 1, alt: 'A finger on each corner of the slice' }, { serial: 'S139', after: 3, alt: 'A triangle drawn next to the slice' }],
  title: 'Pizza corners', art: 'S137', cast: [],
  alt: 'A child holding a slice of pizza, counting its three corners',
  words: [
    'A slice of pizza. I counted the corners.',
    'One corner. Two corners. Three corners. Then no more.',
    'Three corners. That is a triangle. Pizza is a triangle. Yum.',
    'A triangle has three corners.',
  ],
};
STORIES['big-and-little'] = {
  about: 'two shoes by the door, one big and one little',
  more: [{ serial: 'S141', after: 1, alt: 'The big shoe with a small foot lost in it' }, { serial: 'S142', after: 3, alt: 'The little shoe fitting just right' }],
  title: 'Two shoes', art: 'S140', cast: [],
  alt: 'A small child with one foot in a huge shoe and one in a tiny shoe',
  words: [
    'By the door, two shoes. One big. One little.',
    'I tried the big one. My foot swam in it.',
    'I tried the little one. Just right. The big one was Dad\'s.',
    'Big and little. Point to the big one.',
  ],
};
STORIES['circle-and-square'] = {
  about: 'a ball that rolled and a block that sat still',
  more: [{ serial: 'S144', after: 1, alt: 'The ball rolling down the ramp' }, { serial: 'S145', after: 3, alt: 'The block sitting on the ramp, not moving' }],
  title: 'Roll or sit', art: 'S143', cast: [],
  alt: 'A child watching a ball roll down a ramp while a block sits at the top',
  words: [
    'A ball is round. It rolled down the ramp. Whee.',
    'I put the block on the ramp. It sat there.',
    'A block has corners. Corners do not roll. Round rolls. Corners sit.',
    'A circle is round. A square has corners.',
  ],
};
STORIES['a-and-b'] = {
  about: 'two letters on a party banner',
  more: [{ serial: 'S147', after: 1, alt: 'The letter A on the banner' }, { serial: 'S148', after: 3, alt: 'A and B side by side' }],
  title: 'A, then B', art: 'S146', cast: [],
  alt: 'A small child looking up at a birthday banner with big letters',
  words: [
    'On the banner were letters. Big ones.',
    'I did not know their names.',
    'The first was A. Next to it was B. A, then B. Grandma said them with me.',
    'A and B are letters.',
  ],
};
STORIES['not-the-same'] = {
  about: 'four apples in a row, and the one that was different',
  more: [{ serial: 'S150', after: 1, alt: 'The row of apples' }, { serial: 'S151', after: 3, alt: 'A hand picking up the green one' }],
  title: 'The green apple', art: 'S149', cast: [],
  alt: 'A child looking at four apples in a row, three red and one green',
  words: [
    'Four apples in a row. Red. Red. Red. Green.',
    'Which one was different? I looked and looked.',
    'The green one. It was not like the others. I ate it first.',
    'Different means not alike.',
  ],
};
STORIES['listen-and-tap-pictures'] = {
  about: 'a word said out loud, and the picture that matched it',
  more: [{ serial: 'S153', after: 1, alt: 'A picture of a dog and a picture of a cup' }, { serial: 'S154', after: 3, alt: 'A finger tapping the cup' }],
  title: 'Where is the dog?', art: 'S152', cast: [],
  alt: 'A child tapping a picture of a dog on a tablet among other pictures',
  words: [
    'Dog. Where is the dog? I looked at the pictures.',
    'There. Tap. The dog wagged.',
    'Cup. Where is the cup? There. Tap. Every word had a picture.',
    'Listen to the word. Tap its picture.',
  ],
};
STORIES['animal-sounds'] = {
  about: 'a moo, a quack and a meow, and who made them',
  more: [{ serial: 'S156', after: 1, alt: 'The cow with its mouth open' }, { serial: 'S157', after: 3, alt: 'The cat meowing' }],
  title: 'Who said that?', art: 'S155', cast: [],
  alt: 'A child at a farm fence with a cow, a duck and a cat looking over it',
  words: [
    'Moo. Who said that? I looked around.',
    'The cow. Then, quack. Who said that?',
    'The duck. Meow. The cat. Every animal has its own sound.',
    'Listen, then tap the animal that says it.',
  ],
};
STORIES['same-and-different'] = {
  about: 'two striped socks, and the hole that told them apart',
  more: [{ serial: 'S159', after: 1, alt: 'The two socks side by side' }, { serial: 'S160', after: 3, alt: 'A finger poking through the hole' }],
  title: 'Two socks', art: 'S158', cast: [],
  alt: 'A child holding two striped socks up close, one with a hole',
  words: [
    'Two socks. Stripes and stripes. The same?',
    'Look again. Something was not right.',
    'This one has a hole. That one does not. Different!',
    'Same looks alike. Different does not.',
  ],
};
STORIES['match-the-vehicles'] = {
  about: 'a red car looking for its twin',
  more: [{ serial: 'S162', after: 1, alt: 'A truck and a bus, not matches' }, { serial: 'S163', after: 3, alt: 'Two red cars side by side' }],
  title: 'The other red car', art: 'S161', cast: [],
  alt: 'A child holding a red toy car, looking at a line of toy vehicles',
  words: [
    'Red car. Where is the other red car?',
    'A truck? No. A bus? No.',
    'There. Another red car, just the same. Two red cars. Vroom, vroom.',
    'The same means just alike.',
  ],
};
STORIES['match-the-things'] = {
  about: 'a cup, a spoon, and the twins they each had',
  more: [{ serial: 'S165', after: 1, alt: 'Two cups together' }, { serial: 'S166', after: 3, alt: 'Two spoons together' }],
  title: 'Twins on the table', art: 'S164', cast: [],
  alt: 'A child pairing up cups and spoons on a table',
  words: [
    'Cup. Another cup. Together.',
    'Spoon. What went with it? Not a cup.',
    'Another spoon. Together. Every thing had a twin.',
    'The same means just alike.',
  ],
};
STORIES['match-the-water-animals'] = {
  about: 'a pond where every animal came in twos',
  more: [{ serial: 'S168', after: 1, alt: 'Two fish, just the same' }, { serial: 'S169', after: 3, alt: 'Two frogs on a lily pad' }],
  title: 'Two of each', art: 'S167', cast: [],
  alt: 'A child at a pond seeing two fish, two frogs and two ducks',
  words: [
    'A fish. Another fish, just the same.',
    'A frog. Where was its twin?',
    'On the lily pad. Another frog, just the same. In the pond, everyone had a match.',
    'The same means just alike.',
  ],
};
STORIES['match-the-land-animals'] = {
  about: 'rabbits and cows, two by two',
  more: [{ serial: 'S171', after: 1, alt: 'Two rabbits with the same ears' }, { serial: 'S172', after: 3, alt: 'Two cows with the same spots' }],
  title: 'Two by two', art: 'S170', cast: [],
  alt: 'A child at a farm with two rabbits and two cows',
  words: [
    'Two rabbits. The same ears. The same hop.',
    'Was every animal in twos?',
    'Two cows. The same spots. Two by two, the animals matched.',
    'The same means just alike.',
  ],
};
STORIES['match-the-shapes'] = {
  about: 'a triangle block and the hole it fit',
  more: [{ serial: 'S174', after: 1, alt: 'The triangle at the round hole, not fitting' }, { serial: 'S175', after: 3, alt: 'The triangle sliding into the triangle hole' }],
  title: 'The right hole', art: 'S173', cast: [],
  alt: 'A child pushing a triangle block toward a shape sorter',
  words: [
    'A triangle block. A round hole? No fit.',
    'A square hole? No fit. I pushed. It stuck.',
    'A triangle hole. Yes. In it went. Same shape, same hole.',
    'The same means just alike.',
  ],
};
STORIES['match-the-solids'] = {
  about: 'cubes that stacked and balls that rolled',
  more: [{ serial: 'S177', after: 1, alt: 'Two cubes stacked' }, { serial: 'S178', after: 3, alt: 'Two balls rolling away' }],
  title: 'Stack or roll', art: 'S176', cast: [],
  alt: 'A child stacking two cubes beside two balls',
  words: [
    'A cube. Another cube, just the same. Stack them.',
    'A ball. Another ball. Stack them?',
    'They rolled off. Balls roll. Cubes stack. Match the ones alike.',
    'The same means just alike.',
  ],
};
STORIES['more-and-fewer-5'] = {
  about: 'five ducks on a pond, and the two that were left',
  more: [{ serial: 'S180', after: 1, alt: 'Five ducks on the water' }, { serial: 'S181', after: 3, alt: 'Two ducks left, three in the sky' }],
  title: 'Five, then two', art: 'S179', cast: [],
  alt: 'A child counting ducks on a pond as three fly away',
  words: [
    'Five ducks on the pond. One, two, three, four, five.',
    'Three flew away. Flap, flap.',
    'Now two. Two is fewer than five. Five is more.',
    'More is the bigger group. Fewer is the smaller group.',
  ],
};
STORIES['bigger-and-smaller'] = {
  about: 'a huge pumpkin, a tiny one, and the one that fit the wagon',
  more: [{ serial: 'S183', after: 1, alt: 'The huge pumpkin beside the wagon, too big' }, { serial: 'S184', after: 3, alt: 'A middle pumpkin sitting in the wagon' }],
  title: 'The pumpkin wagon', art: 'S182', cast: [],
  alt: 'A child with a small wagon between a huge pumpkin and a tiny one',
  words: [
    'A huge pumpkin. Too big. It did not fit the wagon.',
    'A tiny pumpkin. Too small. It rolled around.',
    'A middle one. Just right. Bigger takes more room. Smaller takes less.',
    'Bigger takes more room. Smaller takes less.',
  ],
};
STORIES['first-strokes'] = {
  about: 'a finger on a foggy window, and the lines it made',
  more: [{ serial: 'S186', after: 1, alt: 'A line going down on the fog' }, { serial: 'S187', after: 3, alt: 'A wavy line across the glass' }],
  title: 'Lines on the window', art: 'S185', cast: [],
  alt: 'A child drawing lines on a foggy window with one finger',
  words: [
    'The window was fogged. My finger went down. A line.',
    'Across. Another line. Then a wavy one.',
    'Down, across, wavy. Lines can go any way. Start at the dot.',
    'Start at the dot and follow the line.',
  ],
};
STORIES['connect-the-dots'] = {
  about: 'dots that became a shape when joined in order',
  more: [{ serial: 'S189', after: 1, alt: 'Dots one to four joined' }, { serial: 'S190', after: 3, alt: 'A star made from all the dots' }],
  title: 'What is it?', art: 'S188', cast: [],
  alt: 'A child joining numbered dots on a page, a shape half made',
  words: [
    'One to two. Two to three. What is it?',
    'I could not tell yet.',
    'Four, five, six. A shape was coming. Seven, eight. A star!',
    'Start at 1 and draw to each dot in order.',
  ],
};
STORIES['draw-the-shapes'] = {
  about: 'a circle that would not close until the finger got back to the dot',
  more: [{ serial: 'S192', after: 1, alt: 'A circle with a gap' }, { serial: 'S193', after: 3, alt: 'A closed circle, the crayon back at the dot' }],
  title: 'Back to the dot', art: 'S191', cast: [],
  alt: 'A child drawing a circle with a fat crayon, almost back to the start',
  words: [
    'Start at the dot. Go round. Keep going.',
    'I stopped early. My circle had a gap.',
    'Almost there. Keep going. Back to the dot. Closed!',
    'Start at the dot and go all the way around.',
  ],
};
STORIES['big-bigger-biggest'] = {
  about: 'three bowls, three bears, and a match for each',
  more: [{ serial: 'S195', after: 1, alt: 'The three bowls in a row' }, { serial: 'S196', after: 3, alt: 'Each bear with its own bowl' }],
  title: 'Three bowls', art: 'S194', cast: [],
  alt: 'Three bears at a table with three bowls, little, middle and big',
  words: [
    'A little bowl. A middle bowl. A big bowl.',
    'Which bowl for which bear?',
    'Little bear, middle bear, big bear. Each one found its bowl.',
    'Little, middle, biggest. Three sizes in a row.',
  ],
};
STORIES['helpers-all-around'] = {
  about: 'a crossing guard, a bus driver, and a morning full of helpers',
  more: [{ serial: 'S198', after: 1, alt: 'The crossing guard holding up a stop sign' }, { serial: 'S199', after: 3, alt: 'The bus driver opening the door' }],
  title: 'Helpers', art: 'S197', cast: [],
  alt: 'A child crossing a street with a crossing guard, a school bus waiting',
  words: [
    'The crossing guard stopped the cars. We crossed.',
    'The bus driver opened the door. We climbed in.',
    'Helpers were all around me. Each one had a job.',
    'Helpers are all around. Every helper has a job.',
  ],
};
STORIES['first-sounds'] = {
  about: 'Ben, Sam, and the sounds their names start with',
  more: [{ serial: 'S201', after: 1, alt: 'Ben with his lips pressed for buh' }, { serial: 'S202', after: 3, alt: 'Sam hissing sss like a snake' }],
  title: 'Buh and sss', art: 'S200', cast: [],
  alt: 'Two children on a rug saying the first sounds of their names',
  words: [
    'Ben. Buh. Ben starts with buh.',
    'Sam. What does Sam start with?',
    'Sss. Like a snake. Sam starts with sss.',
    'Listen to the start of the word.',
  ],
};
STORIES['which-came-first'] = {
  about: 'a roar, a squawk, and which one came first',
  more: [{ serial: 'S204', after: 1, alt: 'The lion roaring' }, { serial: 'S205', after: 3, alt: 'The parrot squawking' }],
  title: 'The roar came first', art: 'S203', cast: [],
  alt: 'A child at a zoo hearing a lion roar and a parrot squawk',
  words: [
    'Roar. Then squawk. Which came first?',
    'I had to think back.',
    'The roar. That was the lion. The squawk came after.',
    'Hold the first sound in your head while you hear the rest.',
  ],
};
STORIES['which-came-second'] = {
  about: 'three sounds in a row, and which was second',
  more: [{ serial: 'S207', after: 1, alt: 'The kettle whistling' }, { serial: 'S208', after: 3, alt: 'The dog barking' }],
  title: 'Whistle, tick, woof', art: 'S206', cast: [],
  alt: 'A child listening to a kettle, a clock and a dog',
  words: [
    'Whistle. Tick. Woof. Three sounds.',
    'Which came second? Not the first. Not the last.',
    'Tick. The clock. Which came last? Woof. The dog.',
    'Keep the sounds in a row in your head.',
  ],
};
STORIES['big-letters'] = {
  about: 'three big letters on the side of a bus',
  more: [{ serial: 'S210', after: 1, alt: 'The letter B on the bus' }, { serial: 'S211', after: 3, alt: 'The letters B U S in a row' }],
  title: 'B, U, S', art: 'S209', cast: [],
  alt: 'A child pointing at big letters on a school bus',
  words: [
    'On the bus were big letters. B. U. S.',
    'I did not know them yet.',
    'B says its name. U says its name. S says its name. Bus!',
    'Every letter has a name.',
  ],
};
STORIES['first-letter-tracing'] = {
  about: 'a letter drawn in the sand with a stick',
  more: [{ serial: 'S213', after: 1, alt: 'The stick starting at a dot in the sand' }, { serial: 'S214', after: 3, alt: 'A finished letter with a dot at the top' }],
  title: 'A letter in the sand', art: 'S212', cast: [],
  alt: 'A child drawing a big letter in wet sand with a stick',
  words: [
    'Start at the dot. Follow the arrow. Down.',
    'The stick went the wrong way. Wiggly.',
    'Try again. Down. Across. Lift the stick. A letter in the sand!',
    'Start at the dot. Follow the arrow.',
  ],
};
STORIES['more-big-letters'] = {
  about: 'sticks that made an L and a T',
  more: [{ serial: 'S216', after: 1, alt: 'Two sticks making an L' }, { serial: 'S217', after: 3, alt: 'Two sticks making a T' }],
  title: 'Sticks make letters', art: 'S215', cast: [],
  alt: 'A child laying craft sticks into an L and a T',
  words: [
    'One stick down. One stick across. An L.',
    'Could sticks make more letters?',
    'One stick down. One stick across the top. A T. Straight sticks make letters.',
    'Straight lines make letters. Start at the dot.',
  ],
};
STORIES['trace-straight-letters'] = {
  about: 'down, then across, and the L, T and F that came from it',
  more: [{ serial: 'S219', after: 1, alt: 'A finger going down, then across' }, { serial: 'S220', after: 3, alt: 'L, T and F in a row' }],
  title: 'Down, then across', art: 'S218', cast: [],
  alt: 'A child tracing L, T and F on a page',
  words: [
    'Down, then across. L.',
    'What if across went on top?',
    'Down, then across the top. T. Down, across the top, across the middle. F.',
    'Down, then across. Start at the dot.',
  ],
};
// Kindergarten, in the fewest words that still make a story.
STORIES['rules-and-helpers'] = {
  about: 'a slide that hurt until the class made a rule, and the helper who fixed the rest',
  more: [{ serial: 'S222', after: 1, alt: 'A traffic jam of children on the slide, all going at once' }, { serial: 'S223', after: 3, alt: 'A firefighter waving from a big red truck outside the school' }],
  title: 'One at a time', art: 'S221', cast: [],
  alt: 'Children lining up at the top of a slide, a small boy rubbing his elbow, a teacher nearby',
  words: [
    'At recess, all of the kids wanted the slide at once. Bump. Ouch. Diego went down on top of Rosa. Rosa cried. Nobody had fun.',
    'The slide was fine. The kids were fine. Something else was missing.',
    'The teacher made a rule. One at a time. Wait at the top. Now the slide was fun again. Then a fire truck came by. The driver waved. A helper, with a job for the whole town.',
    'Rules keep us safe. Helpers do jobs for everyone.',
  ],
};
STORIES['needs-and-wants'] = {
  about: 'bread or a toy, money for one, and the girl who picked',
  more: [{ serial: 'S225', after: 1, alt: 'The bread in a paper bag, held close' }, { serial: 'S226', after: 3, alt: 'The toy still on the shelf, the girl waving to it' }],
  title: 'Bread or the toy', art: 'S224', cast: [],
  alt: 'A girl at a store counter looking from a loaf of bread to a toy, a few coins in her hand',
  words: [
    'Ana had money for one thing. Bread, or the toy? She wanted the toy. She really wanted the toy.',
    'But her tummy rumbled. Her mom asked, which one do we need?',
    'We need to eat. We want to play. Ana picked the bread. The toy could wait. Her tummy could not.',
    'Needs come first. Wants can wait.',
  ],
};
STORIES['our-flag-and-holidays'] = {
  about: 'a flag going up a pole, and the boy who counted its stripes and stars',
  more: [{ serial: 'S228', after: 1, alt: 'A close look at the stripes, thirteen red and white' }, { serial: 'S229', after: 3, alt: 'The blue corner full of white stars' }],
  title: 'Up went the flag', art: 'S227', cast: [],
  alt: 'A boy watching a big flag go up a pole in a schoolyard, his finger counting stripes',
  words: [
    'Up went the flag. Red. White. Blue. Sam wanted to know what was on it. It was too far up to see.',
    'So the teacher brought a small one down to his desk.',
    'Sam counted the stripes. Thirteen. He counted the stars. Fifty. That took a while. Red, white and blue, with fifty stars and thirteen stripes.',
    'Fifty stars, thirteen stripes, red white and blue.',
  ],
};
STORIES['jobs-people-do'] = {
  about: 'a morning when everyone went to work, and the tools they carried',
  more: [{ serial: 'S231', after: 1, alt: 'The baker holding a big bowl and a spoon' }, { serial: 'S232', after: 3, alt: 'The mail carrier with a full bag of letters' }],
  title: 'Off to work', art: 'S230', cast: [],
  alt: 'A street at morning with a baker, a nurse and a mail carrier heading off, each with their tools',
  words: [
    'In the morning, Lena watched everyone go to work. The baker went to bake bread. The nurse went to help the sick. Why did they all go?',
    'Lena thought they just liked it. Her dad said, they get paid, too.',
    'People work to earn money. Money buys needs, like food and a home. And every job has its tools. The baker had a bowl. The nurse had a stethoscope. The mail carrier had a big bag.',
    'People work to earn money for needs. Every job has its tools.',
  ],
};
STORIES['voting-in-class'] = {
  about: 'two books, one story time, and the fair way to pick',
  more: [{ serial: 'S234', after: 1, alt: 'Half the class pointing at a dragon book, half at a dog book' }, { serial: 'S235', after: 3, alt: 'A tally on the board, one side with more marks' }],
  title: 'Hands up', art: 'S233', cast: [],
  alt: 'Children on a classroom rug with their hands up, a teacher holding two picture books',
  words: [
    'Two books for story time. Half the class wanted the dragon. Half wanted the dog. Everyone shouted. Nobody could hear.',
    'Shouting did not pick a book. It only made it loud.',
    'The teacher said, hands up for the dragon. She counted. Hands up for the dog. She counted. One vote each. The dragon had more. The dragon won, and the dog got next week.',
    'One vote each. More votes wins.',
  ],
};
STORIES['our-two-flags'] = {
  about: 'two flags on one pole, and the boy who counted one star and fifty',
  more: [{ serial: 'S237', after: 1, alt: 'The top flag with fifty small stars' }, { serial: 'S238', after: 3, alt: 'The Texas flag with its one big star' }],
  title: 'Two flags, one pole', art: 'S236', cast: [],
  alt: 'A boy looking up at two flags on one pole, fifty stars on the top one and one big star below',
  words: [
    'Two flags flew on one pole. Kai asked why. One flag is enough, he said.',
    'His teacher asked him to count the stars on each.',
    'The top one had fifty. One star for every state. The one below had one big star. That was the flag for Texas. Our state. Two flags, one for the country and one for home.',
    'Fifty stars for the country. One star for Texas.',
  ],
};
STORIES['count-to-10'] = {
  about: 'ten steps up to a slide, and the boy who kept losing count halfway',
  more: [{ serial: 'S240', after: 1, alt: 'The boy stopped halfway up the ladder, looking down' }, { serial: 'S241', after: 3, alt: 'The boy at the top of the slide, both arms up' }],
  title: 'Ten steps', art: 'S239', cast: [],
  alt: 'A small boy climbing the ladder of a tall slide, counting each step out loud',
  words: [
    'Sam wanted to know how many steps went up the big slide. He climbed and counted. One, two, three, four. Then a bird flew by. He forgot where he was.',
    'He started again from the middle. That did not work. The numbers came out wrong.',
    'So he went to the bottom and started over, slowly. One step, one number. Five, six, seven. Higher and higher. Eight, nine, ten. The top. Ten steps.',
    'Count one at a time. The last number is how many.',
  ],
};
STORIES['tracing-numbers'] = {
  about: 'a number two that would not stay a two, until a girl started at the dot',
  more: [{ serial: 'S243', after: 1, alt: 'A finger on the dot, then curving round and down' }, { serial: 'S244', after: 3, alt: 'A finished 2 with a flat bottom line' }],
  title: 'Start at the dot', art: 'S242', cast: [],
  alt: 'A girl tracing a big number 2 on paper, a green dot at the top of the curve',
  words: [
    'Lena tried to draw a two. It came out like a snake. She tried again. A snake with a hat. Her brother laughed.',
    'Where did a two even start? Lena had no idea. She was starting in the middle.',
    'Her teacher put a dot at the top. Start here. Curve round, then down. Along the bottom. Stop. A two, every time.',
    'Start at the dot. Follow the arrow. That draws the number.',
  ],
};
STORIES['one-more-one-less'] = {
  about: 'four cookies on a plate, one more, one less, and a boy who kept track',
  more: [{ serial: 'S246', after: 1, alt: 'Five cookies on the plate after one more is added' }, { serial: 'S247', after: 3, alt: 'Four cookies, one bitten cookie in a hand' }],
  title: 'One more, one less', art: 'S245', cast: [],
  alt: 'A boy at a kitchen table watching a plate of cookies, one hand reaching for the plate',
  words: [
    'Four cookies sat on the plate. Mom put one more on. Diego said, now there are lots. Mom said, how many? Diego was not sure.',
    'He did not want to count them all again. Cookies do not wait.',
    'One more than four is the next number. Five. Then his sister ate one. One less than five is the number before. Four. Diego kept track without counting.',
    'One more is the next number. One less is the number before.',
  ],
};
STORIES['joining-and-taking-away'] = {
  about: 'cars in a garage, some driving in and one driving out',
  more: [{ serial: 'S249', after: 1, alt: 'Five cars parked in a row inside the garage' }, { serial: 'S250', after: 3, alt: 'One car rolling out of the garage, four left' }],
  title: 'Cars in the garage', art: 'S248', cast: [],
  alt: 'A girl playing with a toy garage, two cars inside and three rolling in',
  words: [
    'Two cars sat in the toy garage. Ana rolled three more in. Was it more cars now, or fewer? Ana said more. She did not know how many.',
    'The cars were all jumbled. She could not tell at a look.',
    'She counted. One, two, three, four, five. Joining made five. Then one car drove away. Taking away leaves fewer. She counted again. Four.',
    'Joining makes more. Taking away leaves fewer. Count to find out how many.',
  ],
};
STORIES['comparing-numbers'] = {
  about: 'six blocks, four blocks, and the way to tell which pile was bigger without a fight',
  more: [{ serial: 'S252', after: 1, alt: 'Blocks lined up in two rows, six and four' }, { serial: 'S253', after: 3, alt: 'A finger counting up past four to six' }],
  title: 'Which is bigger?', art: 'S251', cast: [],
  alt: 'Two children with two piles of blocks, one pile taller, both children pointing',
  words: [
    'Leo had six blocks. His friend had four. His friend said four was bigger. Leo said six. They both said it louder.',
    'Louder did not help. Neither could show it.',
    'Leo counted up. One, two, three, four. There was four. Five, six. There was six. Six came later. Later when you count means bigger.',
    'The number you say later when counting is the bigger one.',
  ],
};
STORIES['shapes'] = {
  about: 'a round clock, a square window, and the girl who counted corners',
  more: [{ serial: 'S255', after: 1, alt: 'The round clock with no corners, the girl running a finger around it' }, { serial: 'S256', after: 3, alt: 'The square window with four corners, one finger on each' }],
  title: 'Counting corners', art: 'S254', cast: [],
  alt: 'A girl in a bedroom pointing at a round clock and a square window',
  words: [
    'Rosa knew the clock was a circle. She knew the window was a square. But why? They were both just shapes to her.',
    'Her dad asked her to find the corners. On the clock her finger went round and round. No corners at all.',
    'On the window her finger stopped four times. Four corners. Four sides. A square. A circle has no corners. That is how you tell.',
    'Count the sides and corners to tell shapes apart.',
  ],
};
STORIES['tracing-shapes'] = {
  about: 'a square that a boy could not close, until he went all the way around',
  more: [{ serial: 'S258', after: 1, alt: 'A finger going across, then down, then back across' }, { serial: 'S259', after: 3, alt: 'A finished square with the dot where it started and ended' }],
  title: 'All the way around', art: 'S257', cast: [],
  alt: 'A boy tracing a square on paper, his finger nearly back at the starting dot',
  words: [
    'Kai traced a square. Across. Down. Back across. Then he stopped. His square had a gap. It looked like a cup.',
    'A square with a gap is not a square. Kai did not know what was missing.',
    'Start at the dot, his teacher said. Across. Down. Back across. Up. All the way around, back to the dot. The gap was gone.',
    'Start at the dot and go all the way around.',
  ],
};
STORIES['counting-by-tens'] = {
  about: 'a room full of fingers, counted ten at a time',
  more: [{ serial: 'S261', after: 1, alt: 'Two children with twenty fingers up between them' }, { serial: 'S262', after: 3, alt: 'Ten children, all hands up, the girl saying one hundred' }],
  title: 'Ten fingers each', art: 'S260', cast: [],
  alt: 'Children in a row holding up all ten fingers, a girl in front counting them',
  words: [
    'Mia wanted to count all the fingers in the room. She started with one. One, two, three. By the third friend she was tired. And lost.',
    'There were too many fingers to count one by one.',
    'Every friend had ten. So she counted by tens. Ten. Twenty. Thirty. Forty. Fifty. Every friend was one jump. Ten friends: one hundred fingers.',
    'Count by tens. Ten, twenty, thirty, all the way to one hundred.',
  ],
};
STORIES['longer-and-heavier'] = {
  about: 'a long stick and a heavy rock at the creek, and which was which',
  more: [{ serial: 'S264', after: 1, alt: 'The stick reaching all the way across the creek' }, { serial: 'S265', after: 3, alt: 'The boy straining to lift the rock with both hands' }],
  title: 'The stick and the rock', art: 'S263', cast: [],
  alt: 'A boy at a creek holding a long stick across the water, a big rock at his feet',
  words: [
    'Sam found a stick and a rock by the creek. Which one was bigger? The stick was longer. The rock was fatter. Sam could not decide.',
    'Bigger was two different things, it turned out.',
    'The stick was long. It reached across the creek. Longer reaches further. The rock was heavy. It took both hands to lift. Heavier is harder to lift.',
    'Longer reaches further. Heavier is harder to lift.',
  ],
};
STORIES['sorting'] = {
  about: 'a pile of socks that would not pair up until they were sorted by color',
  more: [{ serial: 'S267', after: 1, alt: 'Red socks in one pile, blue in another, white in a third' }, { serial: 'S268', after: 3, alt: 'The girl counting the red pile on her fingers' }],
  title: 'The sock pile', art: 'S266', cast: [],
  alt: 'A girl sitting in a pile of mixed socks, three small piles starting to form beside her',
  words: [
    'Ana had a mountain of clean socks to pair up. She grabbed two. Red and blue. No. Two more. Blue and white. No.',
    'Every pair she grabbed was wrong. The pile did not get smaller.',
    'So she sorted first. Red socks here. Blue socks there. White socks in the middle. Alike with alike. Then she counted each pile. Six red. Four blue. Two white.',
    'Put things that are alike together. Then count each group.',
  ],
};
STORIES['solids'] = {
  about: 'a ball that rolled, a block that stacked, and a party hat that came to a point',
  more: [{ serial: 'S270', after: 1, alt: 'The ball rolling away across the floor' }, { serial: 'S271', after: 3, alt: 'Blocks stacked in a tower, a party hat on top' }],
  title: 'Roll, stack, point', art: 'S269', cast: [],
  alt: 'A boy with a ball, a block and a party hat lined up on the floor',
  words: [
    'Diego tried to stack a ball on a block. It rolled off. He tried again. It rolled off again, farther.',
    'Some shapes stack. Some do not. Diego wanted to know which was which.',
    'A ball rolls. That is a sphere. A block stacks. That is a cube. A can rolls and stacks. That is a cylinder. A party hat comes to a point. That is a cone.',
    'Solid shapes are things you can hold: sphere, cube, cylinder, cone.',
  ],
};
STORIES['making-ten'] = {
  about: 'ten fingers, three folded down, and the seven that were still up',
  more: [{ serial: 'S273', after: 1, alt: 'Both hands open, all ten fingers up' }, { serial: 'S274', after: 3, alt: 'Two hands, three down and seven up, the numbers drawn beside them' }],
  title: 'Partners for ten', art: 'S272', cast: [],
  alt: 'A girl holding up her hands with three fingers folded down and seven up',
  words: [
    'Rosa had ten fingers. Her teacher said, fold three down. How many are up? Rosa did not want to count. Counting was slow.',
    'She looked at her hands. Three down. The rest up. The rest was how many?',
    'She counted them once. Seven. Three and seven make ten. Partners. Fold two down, eight are up. Two and eight. Partners too.',
    'Every number up to nine has a partner that makes ten.',
  ],
};
STORIES['more-and-fewer-10'] = {
  about: 'two buckets of shells at the beach, and which had more',
  more: [{ serial: 'S276', after: 1, alt: 'Eight shells laid out in a row on the sand' }, { serial: 'S277', after: 3, alt: 'Six shells in a second row, shorter than the first' }],
  title: 'Two buckets', art: 'S275', cast: [],
  alt: 'A boy at the beach with two buckets of shells, looking from one to the other',
  words: [
    'Leo had two buckets of shells. Which one had more? One bucket was bigger. It looked like more. His sister said no.',
    'A bigger bucket does not mean more shells. Leo had to check.',
    'He counted this bucket. Eight shells. He counted that bucket. Six shells. Eight is bigger than six. The small bucket had more.',
    'Count both. The bigger number has more.',
  ],
};
STORIES['letter-names'] = {
  about: 'a boy who kept losing his place in the alphabet, and the song that held it',
  more: [{ serial: 'S279', after: 1, alt: 'The boy stuck on the letter G, the rest of the letters faded' }, { serial: 'S280', after: 3, alt: 'All the letters in a row from A to Z, the boy grinning at the end' }],
  title: 'The song that holds them', art: 'S278', cast: [],
  alt: 'A small boy on a school bus singing with his mouth open, letters floating in a line above his head',
  words: [
    'Ben knew lots of letters. He did not know what came next. A, B, C, D, then he stopped. His mouth stayed open and nothing came out.',
    'His sister said, sing it. Ben said he could not sing letters. But he tried.',
    'A, B, C, D, E, F, G. The tune pulled the next letter out every time. H, I, J. He got all the way to Z.',
    'Letters have names and an order. The song keeps them in line.',
  ],
};
STORIES['big-and-small-letters'] = {
  about: 'a big G and a small g that looked like strangers, until they said the same sound',
  more: [{ serial: 'S282', after: 1, alt: 'The two cards side by side, the big G tall and the small g with a tail' }, { serial: 'S283', after: 3, alt: 'The girl saying guh with both cards held up together' }],
  title: 'Big G, small g', art: 'S281', cast: [],
  alt: 'A girl holding two cards, a big G in one hand and a small g in the other, looking from one to the other',
  words: [
    'Mia had two cards. One said G. One said g. They did not look alike at all. One was tall. One had a tail.',
    'She was sure they were two different letters. Her teacher shook her head.',
    'Say the sound, her teacher said. Big G says guh. Small g says guh. Same sound. Same letter, just in different clothes.',
    'Big and small are the same letter. One is dressed up. One is not.',
  ],
};
STORIES['letter-sounds'] = {
  about: 'a ball, a buh, and the boy who heard the letter before he saw it',
  more: [{ serial: 'S285', after: 1, alt: 'The boy with his lips pressed together making the buh sound' }, { serial: 'S286', after: 3, alt: 'The letter B next to a ball, a bat and a bug' }],
  title: 'Buh for ball', art: 'S284', cast: [],
  alt: 'A boy bouncing a red ball on a playground, a big letter B drawn in the air beside him',
  words: [
    'Leo said ball, and his teacher asked what sound it started with. Leo said B. She said, that is its name. What is its sound?',
    'He said ball again, slowly. He felt his lips pop at the start. Buh.',
    'Buh. That was the sound. B was the letter. The letter B makes the buh sound, and ball starts with it. So do bat and bug.',
    'Letters make sounds. The first sound of a word is its first letter.',
  ],
};
STORIES['beginning-sounds'] = {
  about: 'a hunt for things that start with mmm, and the mitten that won',
  more: [{ serial: 'S288', after: 1, alt: 'The girl with her lips closed, humming mmm' }, { serial: 'S289', after: 3, alt: 'A mitten, a moon and a mouse in a row' }],
  title: 'What starts with mmm', art: 'S287', cast: [],
  alt: 'A girl holding a mitten up high, a cup and a hat on the floor around her',
  words: [
    'Ana had to find something that started with mmm. She held up a cup. Cup. No mmm. She held up a hat. Hat. No mmm.',
    'She sat on the floor. Nothing in her room started with mmm.',
    'Then she saw her mitten. Mmm-itten. Her lips closed and hummed at the start. Mmm. That was it. Mitten started with mmm.',
    'Say the name. Hear the first sound. Match it to the letter.',
  ],
};
STORIES['rhymes'] = {
  about: 'a cat, a hat and a bat, and the ending they all shared',
  more: [{ serial: 'S291', after: 1, alt: 'The girl clapping when she hears the matching sound' }, { serial: 'S292', after: 3, alt: 'Three words with the same ending glowing at the end of each' }],
  title: 'Cat, hat, bat', art: 'S290', cast: [],
  alt: 'A girl in bed with a picture book, a cat, a hat and a bat drawn in the air above her',
  words: [
    'At bedtime Rosa heard a rhyme. The cat sat on the hat. She giggled. Cat and hat sounded like twins.',
    'Why did they sound alike? The starts were different. Cuh. Huh.',
    'The ends were the same. At. At. Then the bat came in. At again. Three words, one ending. That was what made them rhyme.',
    'Rhyming words end with the same sound.',
  ],
};
STORIES['tracing-letters'] = {
  about: 'a wet window, a finger, and the first T a boy ever made',
  more: [{ serial: 'S294', after: 1, alt: 'The finger starting at a dot and pulling straight down' }, { serial: 'S295', after: 3, alt: 'The finished T on the glass with a dot at the top' }],
  title: 'The T on the window', art: 'S293', cast: [],
  alt: 'A small boy drawing a letter T on a foggy window with one finger, rain outside',
  words: [
    'The window was foggy. Diego pressed a finger on it. A line. He wanted to make a T, like the one on his cup.',
    'He drew a line across. Then another line across. It looked like an equals sign.',
    'His mom put a dot at the top. Start here, she said. Down. Lift. Now across the top. A T, dripping a little.',
    'Start at the dot. Follow the arrow. Stay on the line.',
  ],
};
STORIES['tracing-small-letters'] = {
  about: 'a small a that would not stand up tall, and why it did not need to',
  more: [{ serial: 'S297', after: 1, alt: 'A finger going round in a circle, then straight down' }, { serial: 'S298', after: 3, alt: 'A big A and a small a on the line, one tall and one low' }],
  title: 'The small a sits low', art: 'S296', cast: [],
  alt: 'A girl tracing a small letter a on lined paper, a big A standing tall beside it',
  words: [
    'Lena traced a big A. It stood tall. Then came the small a. She made it tall too. It looked wrong.',
    'The small a did not want to be tall. It kept falling over.',
    'Start at the dot, her teacher said. Round, then down. The small a sat low on the line, like a curled-up cat. That was right.',
    'Small letters sit low. Start at the dot and follow the arrow.',
  ],
};
STORIES['tracing-more-letters'] = {
  about: 'an E made of four lines, and the finger that had to lift between them',
  more: [{ serial: 'S300', after: 1, alt: 'The chalk lifting off the board between two lines' }, { serial: 'S301', after: 3, alt: 'A finished E with four clean lines' }],
  title: 'The E, one line at a time', art: 'S299', cast: [],
  alt: 'A boy at a chalkboard drawing the letter E with a big piece of chalk, one line at a time',
  words: [
    'Kai tried to draw an E without lifting his chalk. He got a wiggly snake with teeth. It did not look like an E.',
    'His teacher laughed, kindly. An E is not one line, she said.',
    'Down. Lift. Across the top. Lift. Across the middle. Lift. Across the bottom. Four lines, three lifts. An E.',
    'One line at a time. Lift your finger between lines.',
  ],
};
STORIES['syllables'] = {
  about: 'the beats hiding in every name, found by clapping',
  more: [{ serial: 'S303', after: 1, alt: 'One clap for Ben, hands together' }, { serial: 'S304', after: 3, alt: 'Three claps for E-li-jah, hands up on the third' }],
  title: 'Clap your name', art: 'S302', cast: [],
  alt: 'Children in a circle clapping, a girl in the middle clapping her own name',
  words: [
    'Ben clapped his name. Ben. One clap. Maya clapped hers. Ma, ya. Two claps. Then it was Elijah\'s turn. He was not sure.',
    'He said his name fast. Elijah. It came out as one blur.',
    'Say it slowly, said the teacher. E. Li. Jah. Clap, clap, clap. Three beats were hiding in there the whole time.',
    'Say the word slowly and clap each beat.',
  ],
};
STORIES['sounding-out'] = {
  about: 'three sounds on a door, and the word they made when said fast',
  more: [{ serial: 'S306', after: 1, alt: 'Her finger under the C, then the A, then the T' }, { serial: 'S307', after: 3, alt: 'A cat sitting in the open doorway' }],
  title: 'The word on the door', art: 'S305', cast: [],
  alt: 'A girl standing at a door with three letters on it, sounding them out with her finger under each one',
  words: [
    'There were three letters on the door. C. A. T. Ana knew each one. She did not know the word.',
    'She said the letter names. See, ay, tee. That was not a word.',
    'Say the sounds, said her brother. Cuh. A. Tuh. Slowly. Then faster. Cuh-a-tuh. Cat. She opened the door, and there was the cat.',
    'Say each sound. Then say them fast together.',
  ],
};
STORIES['which-way-we-read'] = {
  about: 'a finger that went the wrong way on the page, and learned the road',
  more: [{ serial: 'S309', after: 1, alt: 'The finger at the end of a line, dropping down to the next' }, { serial: 'S310', after: 3, alt: 'The finger back at the left of the page, starting again' }],
  title: 'Which way the finger goes', art: 'S308', cast: [],
  alt: 'A boy on a reading rug with a book, his finger moving along a line of words',
  words: [
    'Theo put his finger on a page and went right to left. The words came out backward. Tac. Gid. It sounded like a robot.',
    'He tried starting in the middle. That was worse.',
    'Start on the left, said his teacher. Go right. At the end of the line, hop down. Back to the left. Now the words made sense.',
    'Start on the left. Go right. Then down to the next line.',
  ],
};
STORIES['word-meanings'] = {
  about: 'a card that said dog and the picture it was looking for',
  more: [{ serial: 'S312', after: 1, alt: 'The card placed on the picture of the dog' }, { serial: 'S313', after: 3, alt: 'Three cards on three pictures, all matched' }],
  title: 'The card and the picture', art: 'S311', cast: [],
  alt: 'A girl holding a word card, pictures of a dog, a sun and a fish on the table in front of her',
  words: [
    'Rosa had a card that said dog. On the table were pictures. A dog. A sun. A fish. Where did the card go?',
    'She put it on the sun. Her teacher smiled and shook her head.',
    'Rosa said the word. Dog. She looked for the dog. There. The card went on the dog. Then sun. There. The card went on the sun.',
    'Match the word to the picture. Say it, then find it.',
  ],
};
STORIES['trace-slant-letters'] = {
  about: 'a stick in the sand, and the slanted lines that made V, A and N',
  more: [{ serial: 'S315', after: 1, alt: 'Down a slant, up a slant, a V in the sand' }, { serial: 'S316', after: 3, alt: 'V, A and N in a row in the sand' }],
  title: 'Slants in the sand', art: 'S314', cast: [],
  alt: 'A boy drawing a big letter V in wet sand with a stick, waves behind him',
  words: [
    'Jamal had a stick and wet sand. He drew a line straight down. A line straight across. Every letter he knew was made of those.',
    'His sister asked for a V. Straight lines would not make a V.',
    'Slant, she said. Down a slant. Up a slant. V. Then up, down, and across the middle. A. Down, slant, up. N.',
    'Slanted lines make V, A and N. Start at the dot.',
  ],
};
// Grade 1, in the fewest words that still make a story.
STORIES['teen-numbers'] = {
  about: 'a full egg carton, three eggs beside it, and the number that was ten and some',
  more: [{ serial: 'S318', after: 1, alt: 'The full carton of ten eggs, lid open' }, { serial: 'S319', after: 3, alt: 'The three loose eggs in a row beside the carton' }],
  title: 'Ten and three', art: 'S317', cast: [],
  alt: 'A girl at a kitchen counter with a full egg carton and three eggs sitting beside it',
  words: [
    'Ten eggs filled the carton. Three more sat beside it. Mia had to say how many. She started counting from one and lost her place at eight.',
    'The carton was already ten. She did not need to count those again.',
    'Ten, and then three more. Eleven, twelve, thirteen. Ten and three is thirteen. Every teen number is ten and some more.',
    'A teen number is ten and some more.',
  ],
};
STORIES['adding-to-20'] = {
  about: 'marbles in two pockets, and the jar that held them all',
  more: [{ serial: 'S321', after: 1, alt: 'Eight marbles from the left pocket on the rug' }, { serial: 'S322', after: 3, alt: 'The jar with fourteen marbles inside' }],
  title: 'Two pockets', art: 'S320', cast: [],
  alt: 'A boy emptying two pockets of marbles into a glass jar on his bedroom floor',
  words: [
    'Leo had eight marbles in one pocket and six in the other. How many in all? He tried to count them in his pockets. Pockets are dark.',
    'He tipped them all into a jar. Now he could see them. But he still had to count.',
    'He started at eight, because the left pocket was already eight. Nine, ten, eleven, twelve, thirteen, fourteen. Eight and six is fourteen.',
    'Start with the bigger number. Count on from there.',
  ],
};
STORIES['subtracting-to-20'] = {
  about: 'fifteen birds on a wire, six that flew away, and counting back',
  more: [{ serial: 'S324', after: 1, alt: 'Fifteen birds in a neat row on the wire' }, { serial: 'S325', after: 3, alt: 'Nine birds left, six flying away into the sky' }],
  title: 'Birds on the wire', art: 'S323', cast: [],
  alt: 'A girl in a backyard looking up at a row of birds on a wire, a few flying off',
  words: [
    'Fifteen birds sat on the wire. Ana counted them twice. Then six flew away at once. How many were left? She had to count all over again.',
    'The birds kept moving. Counting them from one was slow.',
    'So she counted back from fifteen. Fourteen, thirteen, twelve, eleven, ten, nine. Six steps back. Nine birds left.',
    'Take away by counting back. One step for each one gone.',
  ],
};
STORIES['tens-and-ones'] = {
  about: 'sticks in bundles of ten, and the number a boy read without counting',
  more: [{ serial: 'S327', after: 1, alt: 'Ten sticks being bundled with a rubber band' }, { serial: 'S328', after: 3, alt: 'Three bundles and four loose sticks in a row' }],
  title: 'Bundles of ten', art: 'S326', cast: [],
  alt: 'A boy at a craft table with bundles of sticks held by rubber bands and a few loose sticks',
  words: [
    'Sam had a pile of sticks. His teacher asked how many. He started counting one at a time. The pile did not seem to get smaller.',
    'Then she handed him rubber bands. Ten sticks, one band. A bundle.',
    'He made three bundles. Four sticks were left over. Three tens and four ones. Thirty-four. He read the number off the bundles.',
    'Tens come in bundles. The ones are the loose ones.',
  ],
};
STORIES['comparing-to-100'] = {
  about: 'two jars of buttons, and the tens that settled which had more',
  more: [{ serial: 'S330', after: 1, alt: 'Buttons from one jar in stacks of ten, six stacks and two loose' }, { serial: 'S331', after: 3, alt: 'Four stacks and eight loose from the other jar' }],
  title: 'Two jars of buttons', art: 'S329', cast: [],
  alt: 'A girl comparing two big jars of buttons on a sewing table',
  words: [
    'This jar had 62 buttons. That jar had 48. Rosa wanted the bigger jar. The jars looked the same size. The numbers looked close.',
    'She did not want to count a hundred buttons twice.',
    'So she looked at the tens. Six tens. Four tens. Six tens is more, no matter what the ones say. 62 is bigger than 48.',
    'Look at the tens first. If the tens match, the ones decide.',
  ],
};
STORIES['writing-numbers'] = {
  about: 'a five that kept coming out backward, until a girl found its dot',
  more: [{ serial: 'S333', after: 1, alt: 'A finger going down, then round the belly of the five' }, { serial: 'S334', after: 3, alt: 'A finished five with the flat top line' }],
  title: 'The five', art: 'S332', cast: [],
  alt: 'A girl tracing a big number 5 on lined paper, a dot at the top',
  words: [
    'Lena wrote a five. It looked like an S. She wrote it again. An S with a hat. Her brother said it was a snake.',
    'A five has a place to start. Lena kept starting in the wrong spot.',
    'Start at the dot. Down. Round. Lift. Across the top. A five, every time. Every number has its own dot.',
    'Every number starts at its dot. Follow the arrow.',
  ],
};
STORIES['read-the-word'] = {
  about: 'three letters on a box, and the word that came out when they were pushed together',
  more: [{ serial: 'S336', after: 1, alt: 'The finger moving from M to A to P' }, { serial: 'S337', after: 3, alt: 'A map unfolded on the garage floor' }],
  title: 'The word on the box', art: 'S335', cast: [],
  alt: 'A boy looking at a box with three letters on it, his finger under the first letter',
  words: [
    'Three letters on the box. M. A. P. Kai knew them all. Em, ay, pee. That was not a word.',
    'Letter names do not make words. Sounds do.',
    'He said the sounds. Mmm. Aaa. Puh. Then he pushed them together. Mmm-aaa-puh. Map. He opened the box and there was a map.',
    'Say each sound. Push them together. Read the word.',
  ],
};
STORIES['sh-ch-th'] = {
  about: 'two letters that make one sound, and the shell that said shh',
  more: [{ serial: 'S339', after: 1, alt: 'The letters S and H together with a shell' }, { serial: 'S340', after: 3, alt: 'C and H with a chair, T and H with a thumb' }],
  title: 'Shell, chair, thumb', art: 'S338', cast: [],
  alt: 'A girl holding a shell to her ear on a beach, a chair and her thumb nearby',
  words: [
    'Ana found a shell. She tried to read the word on the sign. S, h, e, l, l. Sss-huh. That was not shell.',
    'Two of the letters were working as a team. She was reading them one by one.',
    'S and H together say shh. Shell. C and H together say ch. Chair. T and H together say th. Thumb. Two letters, one sound.',
    'Sh, ch and th are two letters that say one sound.',
  ],
};
STORIES['silent-e'] = {
  about: 'a cap that became a cape when one letter joined and said nothing',
  more: [{ serial: 'S342', after: 1, alt: 'The word cap with an e sliding onto the end' }, { serial: 'S343', after: 3, alt: 'The word cape, the a glowing' }],
  title: 'The quiet e', art: 'S341', cast: [],
  alt: 'A boy holding a cap in one hand and a superhero cape in the other',
  words: [
    'Leo read cap. A hat. Then he saw cape. He read it cap-eh. His sister laughed. There was no eh.',
    'The e at the end made no sound at all. So what was it for?',
    'It was there to change the a. Cap: the a says aa. Cape: the a says its name, ay. The e is silent. It works by staying quiet.',
    'A silent e at the end makes the vowel say its name.',
  ],
};
STORIES['read-the-sentence'] = {
  about: 'four words that were only a list until a girl found the capital and the period',
  more: [{ serial: 'S345', after: 1, alt: 'The capital T at the start of the sentence glowing' }, { serial: 'S346', after: 3, alt: 'The period at the end, the finger stopping there' }],
  title: 'From the capital to the period', art: 'S344', cast: [],
  alt: 'A girl on a rug reading a sentence in a book, her finger at the first capital letter',
  words: [
    'Rosa read the words one at a time. The. Dog. Is. Out. Four words. She did not know when to stop.',
    'A sentence is not a pile of words. It has a start and an end.',
    'Start at the capital letter. Read across. Stop at the period. The dog is out. Now it was a sentence, and it said something.',
    'A sentence starts with a capital letter and stops at a period.',
  ],
};
STORIES['what-happened'] = {
  about: 'a kite in a tree, and the three words that put the day in order',
  more: [{ serial: 'S348', after: 1, alt: 'The kite flying high on a windy day' }, { serial: 'S349', after: 3, alt: 'Dad on tiptoe pulling the kite from the branches' }],
  title: 'First, then, last', art: 'S347', cast: [],
  alt: 'A boy and his dad at a park with a kite stuck in a tree',
  words: [
    'Sam told the story of his kite. Dad got it down. It went up. It got stuck. His mom looked confused.',
    'All of it was true. It was in the wrong order.',
    'First, the kite went up. Then, it caught in a tree. Last, Dad got it down. Three little words, and the day made sense.',
    'First, then, last. Tell what happened in order.',
  ],
};
STORIES['tracing-more-small-letters'] = {
  about: 'a g with a tail, an m with two bumps, and a z that zigzagged',
  more: [{ serial: 'S351', after: 1, alt: 'The g with its tail hanging below the line' }, { serial: 'S352', after: 3, alt: 'The m with two bumps beside a z zigzag' }],
  title: 'Tails, bumps and zigzags', art: 'S350', cast: [],
  alt: 'A girl tracing small letters g, m and z on lined paper',
  words: [
    'Mia traced a g. She kept its tail on the line. It looked like a q with a hat. Her teacher smiled.',
    'Some small letters go below the line. Some have bumps. Some zigzag.',
    'A g has a tail that hangs below the line. An m has two bumps. A z zigzags across. Start at the dot for each one.',
    'Tall sticks, bumps and zigzags. Start at the dot and follow the arrow.',
  ],
};
STORIES['trace-small-letters-3'] = {
  about: 'one line down, and the dot, the bar or the kick that made i, t and k',
  more: [{ serial: 'S354', after: 1, alt: 'A finger drawing one line down, then a dot on top' }, { serial: 'S355', after: 3, alt: 'Three finished letters, i, t and k in a row' }],
  title: 'One line, then the rest', art: 'S353', cast: [],
  alt: 'A boy tracing i, t and k on lined paper, one line down first each time',
  words: [
    'Kai traced an i and forgot the dot. He traced a t and forgot the bar. Both looked like the letter l.',
    'Each one started the same way. One line down. Then something else.',
    'One line down, then a dot. An i. One line down, then across. A t. One line down, then a kick. A k. Start the same, finish your own way.',
    'One line down, then the rest. Start at the dot.',
  ],
};
STORIES['trace-small-letters-4'] = {
  about: 'a curve, a point and a cross, and the girl who found them in c, v and x',
  more: [{ serial: 'S357', after: 1, alt: 'A c curving like a cup on its side' }, { serial: 'S358', after: 3, alt: 'A v with its point and an x with its cross' }],
  title: 'Curve, point, cross', art: 'S356', cast: [],
  alt: 'A girl tracing c, v and x on paper, her finger curving, pointing and crossing',
  words: [
    'Ana traced a c. It came out as a circle. She traced a v. It came out round. All she drew was round.',
    'Not every letter is round. Some have points. Some cross.',
    'A c is a curve, like a cup on its side. A v goes down to a point and up. An x is two lines that cross. Curve, point, cross.',
    'A curve, a point, a cross. Start at the dot.',
  ],
};
STORIES['trace-small-letters-5'] = {
  about: 'a line and a little arch, and the n, u and r that share it',
  more: [{ serial: 'S360', after: 1, alt: 'A line down, then up and over into an arch' }, { serial: 'S361', after: 3, alt: 'The n, u and r finished in a row' }],
  title: 'Line and arch', art: 'S359', cast: [],
  alt: 'A boy tracing n, u and r on lined paper, an arch drawn beside them',
  words: [
    'Sam traced an n. Then a u. Then an r. His teacher asked what they had in common. Sam said nothing.',
    'He looked again. Each one had a line. Each one had a little arch, going one way or another.',
    'A line down, then up and over. An arch. That is an n. Down, round the bottom, and up. A u. A line down, then a small arch that stops. An r.',
    'A line, then a little arch. Start at the dot.',
  ],
};
STORIES['sun-moon-patterns'] = {
  about: 'a sun that came up in the same place every morning, and the girl who checked',
  more: [{ serial: 'S363', after: 1, alt: 'The sun setting behind the far hill in the west' }, { serial: 'S364', after: 3, alt: 'The moon changing shape across a row of nights' }],
  title: 'The same place every day', art: 'S362', cast: [],
  alt: 'A girl at a window at dawn, the sun rising over the same fence as yesterday',
  words: [
    'Rosa woke early and saw the sun come up over the fence. The next day, over the fence again. And the next. Was it always the same fence?',
    'She checked for a week. Every morning, the east. Every evening, the west.',
    'The sun and the moon follow patterns. Up in the east, down in the west, again the next day. The moon changed shape too. A little each night, round and back again.',
    'The sun and moon follow patterns that repeat.',
  ],
};
STORIES['water-changes'] = {
  about: 'an ice cube that turned into a puddle, and the puddle that turned back',
  more: [{ serial: 'S366', after: 1, alt: 'The puddle on the step in the sun' }, { serial: 'S367', after: 3, alt: 'A tray of water going into a freezer' }],
  title: 'Ice, water, ice', art: 'S365', cast: [],
  alt: 'A boy watching an ice cube melt into a puddle on a sunny step',
  words: [
    'Leo left an ice cube on the step. It was hard and cold. When he came back, it was a puddle. Where did the ice go?',
    'The sun had warmed it. Heat melts ice into water.',
    'Leo poured the water into a tray. He put it in the freezer. In the morning it was hard again. Cold makes ice. Heat melts it back. Round and round.',
    'Cold makes ice. Heat melts it back to water.',
  ],
};
STORIES['animal-needs'] = {
  about: 'a puppy that was hungry, thirsty and tired, and what fixed each one',
  more: [{ serial: 'S369', after: 1, alt: 'The puppy eating from its bowl' }, { serial: 'S370', after: 3, alt: 'The puppy asleep in its bed' }],
  title: 'What the puppy needed', art: 'S368', cast: [],
  alt: 'A girl kneeling beside a small puppy with a bowl, a water dish and a soft bed',
  words: [
    'The puppy whined. Ana did not know why. It had a collar. It had a name. It still whined.',
    'A puppy needs more than a name.',
    'It was hungry. Food. It was thirsty. Water. It was tired. A soft bed, a home. Fed and watered and rested, the puppy slept.',
    'Animals need food, water and a home.',
  ],
};
STORIES['leaders-near-and-far'] = {
  about: 'three leaders, three sizes of place, and the boy who put them in order',
  more: [{ serial: 'S372', after: 1, alt: 'A mayor at a town hall' }, { serial: 'S373', after: 3, alt: 'A capitol dome with a flag' }],
  title: 'Near and far', art: 'S371', cast: [],
  alt: 'A boy in a town square with three drawn circles behind him: a town, a state, a country',
  words: [
    'Kai heard about a mayor, a governor and a president. Three leaders. He thought they all did the same job.',
    'They do the same kind of job, for places of different sizes.',
    'The mayor leads the city. That is near. The governor leads the state. That is bigger. The president leads the whole country. That is far.',
    'Mayor for the city, governor for the state, president for the country.',
  ],
};
STORIES['goods-and-services'] = {
  about: 'a hat you could hold and a haircut you could not, and the money that paid for both',
  more: [{ serial: 'S375', after: 1, alt: 'The hat in a paper bag' }, { serial: 'S376', after: 3, alt: 'A barber snipping hair, scissors in hand' }],
  title: 'The hat and the haircut', art: 'S374', cast: [],
  alt: 'A girl outside a shop holding a new hat, a barber pole next door',
  words: [
    'Mia bought a hat and got a haircut on the same street. Both cost money. Only one of them went home in a bag.',
    'The haircut was not a thing. So what had she paid for?',
    'The hat was a good. A thing you can hold. The haircut was a service. Work someone did for her. Both were paid for with money, and money comes from work.',
    'Goods are things. Services are work done for you.',
  ],
};
STORIES['maps-of-my-world'] = {
  about: 'a sunrise over the fence, and the four directions a boy found from it',
  more: [{ serial: 'S378', after: 1, alt: 'The four directions drawn as a cross on the map' }, { serial: 'S379', after: 3, alt: 'The tree to the left of the fence marked on the map' }],
  title: 'Where the sun comes up', art: 'S377', cast: [],
  alt: 'A boy in a backyard at sunrise pointing east over a fence, a paper map in his other hand',
  words: [
    'Sam had a map of his yard. It said north at the top. He turned it every way. He still could not tell which way was which.',
    'The map needed one true direction to start from.',
    'The sun rose over the fence. That way was east. North was to the left of it. That was the top of the map. The tree was to the north. West was behind him. South was to the right.',
    'North, south, east, west. The sun rises in the east.',
  ],
};
STORIES['signs-around-town'] = {
  about: 'a red sign with eight sides, and how every car knew what to do at once',
  more: [{ serial: 'S381', after: 1, alt: 'The red stop sign up close' }, { serial: 'S382', after: 3, alt: 'A green sign with a name and an arrow' }],
  title: 'The sign that stopped everyone', art: 'S380', cast: [],
  alt: 'A girl at a street corner watching every car stop at a red eight-sided sign',
  words: [
    'Rosa watched a red sign with eight sides. Every car that came to it stopped. Nobody told the drivers to. How did they all know?',
    'The sign told them. All of them, at once.',
    'A stop sign says stop. A green sign says the street\'s name. A yellow sign says slow down, something is ahead. Read the sign, then do what it says.',
    'Signs tell everyone the same thing at once.',
  ],
};
STORIES['symbols-of-our-country'] = {
  about: 'a bell with a crack, a green statue with a torch, and what they stand for',
  more: [{ serial: 'S384', after: 1, alt: 'The Liberty Bell with its crack' }, { serial: 'S385', after: 3, alt: 'The Statue of Liberty holding her torch' }],
  title: 'The bell and the torch', art: 'S383', cast: [],
  alt: 'A boy looking at four pictures on a classroom wall: a cracked bell, a green statue, an old mission and a flag',
  words: [
    'Leo saw a picture of a bell. It had a big crack in it. Why keep a broken bell? His teacher said it was famous.',
    'Famous for what? A crack is a crack.',
    'The Liberty Bell rang for freedom, long ago. The Statue of Liberty holds a torch to welcome people. The Alamo is a Texas fort. The flag stands for the whole country. Each one stands for something bigger than itself.',
    'The bell, the statue, the Alamo and the flag stand for us.',
  ],
};
// Grade 2, in the fewest words that still make a story.
STORIES['hundreds-tens-ones'] = {
  about: 'a jar of pennies too many to count, and the stacks that counted them',
  more: [{ serial: 'S387', after: 1, alt: 'Ten stacks of ten pennies pushed together into one hundred' }, { serial: 'S388', after: 3, alt: 'Three hundred-groups, four stacks and two loose pennies in a row' }],
  title: 'Stacks of pennies', art: 'S386', cast: [],
  alt: 'A girl at a kitchen table with a big jar of pennies tipped out, a few neat stacks of ten beside the pile',
  words: [
    'Mia tipped her penny jar onto the table. Pennies rolled all over, cold and coppery. She started counting. One, two, three. By forty she lost her place.',
    'She counted again and lost it at fifty. The pile was too big for counting one at a time.',
    'So she stacked. Ten in a stack. Ten stacks pushed together made a hundred. Three hundreds. Four stacks left. Two loose pennies. Three, four, two. 342.',
    'Big numbers are just hundreds, tens and ones. Stack them and the counting does itself.',
  ],
};
STORIES['adding-with-regrouping'] = {
  about: 'twenty-seven stickers, fifteen more, and the loose ones that wanted a strip of their own',
  more: [{ serial: 'S390', after: 1, alt: 'Seven loose stickers and five loose stickers slid together into one row' }, { serial: 'S391', after: 3, alt: 'A new strip of ten stickers with two left over beside it' }],
  title: 'Bundles of stickers', art: 'S389', cast: [],
  alt: 'A boy at a desk with strips of ten stickers and a handful of loose ones, adding a new sheet to his pile',
  words: [
    'Sam had 27 stickers: two strips of ten and seven loose. His aunt gave him 15 more: one strip and five loose. He wanted one number for all of them.',
    'He tried counting every sticker. The loose ones kept sliding off the desk.',
    'So he added the loose ones first. Seven and five is twelve. That is a whole new strip of ten, with two left over. Now he had two strips, one strip, and the new strip. Four strips and two. 42.',
    'Ones first, then tens. When ten ones pile up, they become a new ten. Carry it over and count the strips.',
  ],
};
STORIES['subtracting-with-regrouping'] = {
  about: 'forty-two beads, a necklace that needed eighteen, and a string that had to be cut open',
  more: [{ serial: 'S393', after: 1, alt: 'One string of beads snipped open, its ten beads spilling loose' }, { serial: 'S394', after: 3, alt: 'The finished necklace beside three strings and four loose beads' }],
  title: 'Borrow a ten', art: 'S392', cast: [],
  alt: 'A girl at a craft table with strings of ten beads and two loose beads, a half-made necklace in front of her',
  words: [
    'Rosa had 42 beads: four strings of ten and two loose. Her necklace needed 18. She reached for eight loose beads and found only two.',
    'Two beads cannot give you eight. She sat back, stuck.',
    'Then she snipped one string open. Now she had three strings and twelve loose beads. Twelve take away eight left four. Three strings take away one string left two. Two strings and four: 24 beads left, and a necklace.',
    'Ones first, then tens. When the ones are not enough, borrow a ten. Open it up. Check by adding back: 24 and 18 is 42.',
  ],
};
STORIES['money'] = {
  about: 'a pocket of coins counted the way the cashier counts, biggest first',
  more: [{ serial: 'S396', after: 1, alt: 'A quarter, two dimes and a nickel lined up in a row' }, { serial: 'S397', after: 3, alt: 'Three pennies added at the end of the row, the boy counting on his fingers' }],
  title: 'Counting the change', art: 'S395', cast: [],
  alt: 'A boy at a store counter laying coins out in a row from biggest to smallest, a cashier smiling',
  words: [
    'Leo emptied his pocket onto the counter. A quarter, two dimes, a nickel and three pennies. The cashier waited. Leo started with a penny. One. Then a dime. Eleven? He was not sure.',
    'The coins were all mixed up and so was he.',
    'The cashier slid the biggest coin first. A quarter: twenty-five. A dime: thirty-five. Another dime: forty-five. A nickel: fifty. Then the pennies, one at a time: fifty-one, fifty-two, fifty-three. Fifty-three cents, enough for the gum.',
    'Start with the biggest coin and count on. Count dimes by tens and nickels by fives. The pennies come last.',
  ],
};
STORIES['rows-and-columns'] = {
  about: 'a carton of eggs that a girl counted without touching a single egg',
  more: [{ serial: 'S399', after: 1, alt: 'One row of six eggs with the finger at the end of it' }, { serial: 'S400', after: 3, alt: 'Both rows shown, six and six, a small twelve drawn beside the carton' }],
  title: 'Rows of eggs', art: 'S398', cast: [],
  alt: 'A girl holding open an egg carton with two neat rows of eggs, her finger pointing along one row',
  words: [
    'Dad asked Ana how many eggs were in the carton. She started to count them one by one. On the fourth egg it slipped and she had to catch it.',
    'Counting every egg was slow and a little dangerous.',
    'So she looked at the shape instead. Two rows. Six in each row. Six and six is twelve. She never touched another egg.',
    'Count the rows. Count how many in one row. Add that number once for every row. The counting is done before the eggs know it.',
  ],
};
STORIES['vowel-teams'] = {
  about: 'a boat with two vowels, and the one that did the talking',
  more: [{ serial: 'S402', after: 1, alt: 'The word boat with the o and a side by side' }, { serial: 'S403', after: 3, alt: 'The o glowing and the a quiet' }],
  title: 'The o that talked', art: 'S401', cast: [],
  alt: 'A girl reading the word boat on a sign by a pond, a small boat floating behind her',
  words: [
    'Lena read b, o, a, t. Bo-at. Two sounds in the middle. That was not a word she knew.',
    'The o and the a were next to each other. A team. Only one of them talks.',
    'The first one talks. The o says its name, oh. The a stays quiet. Boat. One long sound from two vowels.',
    'Two vowels together often make one long sound. The first one does the talking.',
  ],
};
STORIES['two-syllable-words'] = {
  about: 'a long word that split into two short ones a boy could read',
  more: [{ serial: 'S405', after: 1, alt: 'The word rabbit split in the middle with a small gap' }, { serial: 'S406', after: 3, alt: 'The two halves pushed back together' }],
  title: 'Rab, bit', art: 'S404', cast: [],
  alt: 'A boy reading a sign that says rabbit by a garden, a rabbit peeking from the lettuce',
  words: [
    'Rabbit. Six letters. Kai looked at the word and froze. It was too long to read all at once.',
    'His teacher said, clap it. Rab, bit. Two claps. Two parts.',
    'He split the word in the middle. Rab. Bit. He read each part. Then he pushed them back together. Rabbit. The long word was two short ones.',
    'Long words are short parts joined together. Split, read each part, then join them.',
  ],
};
STORIES['reading-for-meaning'] = {
  about: 'a girl, a dog, a beach, and the four questions that made a story make sense',
  more: [{ serial: 'S408', after: 1, alt: 'The girl and her dog on the page at the beach' }, { serial: 'S409', after: 3, alt: 'The dog digging up a bone, the girl laughing' }],
  title: 'Who, where, what, why', art: 'S407', cast: [],
  alt: 'A girl reading a picture book about a dog at a beach, four question marks floating over the page',
  words: [
    'Ana read the story and closed the book. Her dad asked what happened. She said, a dog. Then she stopped. That was all she had.',
    'She had read every word. She had not held on to any of it.',
    'She read it again with four questions. Who? A girl and her dog. Where? At the beach. What happened? The dog dug up a bone. Why? It smelled it. Now she could tell the whole story.',
    'Keep track of who, where, what and why. A why question wants a reason.',
  ],
};
STORIES['word-meaning-from-context'] = {
  about: 'a word a boy had never seen, and the words around it that gave it away',
  more: [{ serial: 'S411', after: 1, alt: 'The word enormous with the words around it circled' }, { serial: 'S412', after: 3, alt: 'The huge dog taking up the whole couch' }],
  title: 'The words around it', art: 'S410', cast: [],
  alt: 'A boy reading on a couch with an enormous dog stretched across his lap, one word glowing on the page',
  words: [
    'Leo hit a new word. Enormous. He stopped. He did not know it. He wanted to give up.',
    'His mom said, do not stop. Read the words around it.',
    'The enormous dog could not fit through the door. Could not fit. Enormous had to mean very big. The other words told him.',
    'The words around a new word tell you what it means.',
  ],
};
STORIES['complete-sentences'] = {
  about: 'two words that were not a sentence yet, and the who that fixed them',
  more: [{ serial: 'S414', after: 1, alt: 'The words ran fast alone on a line' }, { serial: 'S415', after: 3, alt: 'The dog ran fast, written out with a capital and a period' }],
  title: 'Who ran?', art: 'S413', cast: [],
  alt: 'A girl at a desk with the words ran fast on her paper, a teacher pointing at the empty space before them',
  words: [
    'Rosa wrote: ran fast. Her teacher read it and asked, who ran? Rosa said, the dog. Her teacher said, then say so.',
    'Ran fast told what happened. It did not tell who.',
    'The dog ran fast. Now there was a who and a what. A capital letter at the start. A period at the end. A whole sentence.',
    'A complete sentence needs a who and a what.',
  ],
};
STORIES['describing-sentences'] = {
  about: 'a cat that sat, and the words that showed what it was like',
  more: [{ serial: 'S417', after: 1, alt: 'The words the cat sat on a page, plain' }, { serial: 'S418', after: 3, alt: 'The same sentence with fluffy, quietly and warm added' }],
  title: 'The fluffy cat', art: 'S416', cast: [],
  alt: 'A girl on a porch step writing while a fluffy cat sits beside her in the sun',
  words: [
    'Mia wrote: the cat sat. It was true. Her brother read it and shrugged. So what?',
    'The sentence did not show anything. Which cat? How did it sit?',
    'The fluffy cat sat quietly on the warm step. Now her brother could see it. Fluffy said what the cat was like. Quietly said how. Warm said where.',
    'Add words that say what it was like and how it happened.',
  ],
};
STORIES['tell-a-story-2'] = {
  about: 'a wobbly tooth, and the three words that put the day in order',
  more: [{ serial: 'S420', after: 1, alt: 'The tooth falling out at the lunch table' }, { serial: 'S421', after: 3, alt: 'The tooth going under the pillow' }],
  title: 'The wobbly tooth', art: 'S419', cast: [],
  alt: 'A boy holding a tiny tooth in his palm, a pillow behind him',
  words: [
    'Sam told the story of his tooth. He said the pillow part first. Then the wobble. His friend was lost.',
    'It was all true. It was mixed up.',
    'First, my tooth wobbled. Next, it fell out at lunch. Last, I put it under my pillow. Three words, and the day lined up.',
    'First, next, last. Tell what happened in order.',
  ],
};
STORIES['then-and-now'] = {
  about: 'a chalkboard, a bell on a rope, and the school a girl\'s grandmother went to',
  more: [{ serial: 'S423', after: 1, alt: 'The old classroom, one room, wooden desks' }, { serial: 'S424', after: 3, alt: 'A modern classroom with a screen and many rooms down the hall' }],
  title: 'Then and now', art: 'S422', cast: [],
  alt: 'A girl standing in an old one-room schoolhouse with a chalkboard and a bell rope',
  words: [
    'Lena visited the school her grandmother went to. One room. A chalkboard. A bell on a rope. Lena thought it was a museum.',
    'It was a school. Just a school from then, not now.',
    'Then: a chalkboard, a bell on a rope, one room. Now: a screen, a buzzer, many rooms. Grandma was a girl then. Lena is a girl now. A timeline puts them in order.',
    'Then is the past. Now is today. A timeline puts them in order.',
  ],
};
STORIES['good-citizens'] = {
  about: 'a wallet on the ground with money in it, and the boy who gave it back',
  more: [{ serial: 'S426', after: 1, alt: 'The wallet open with money inside' }, { serial: 'S427', after: 3, alt: 'The boy handing the wallet to a grateful man' }],
  title: 'The wallet', art: 'S425', cast: [],
  alt: 'A boy holding a found wallet on a sidewalk, looking around for its owner',
  words: [
    'Kai found a wallet on the sidewalk. Money inside. Nobody was looking. He could keep it. His hand did not want to let go.',
    'Then he thought about the person who lost it.',
    'Honesty: give it back. Doing your part: pick up your own mess. Respect: listen when others talk. And when the class votes, more votes wins. Kai found the man and gave it back.',
    'Honesty, doing your part, respect. When we vote, more wins.',
  ],
};
STORIES['producers-and-consumers'] = {
  about: 'a lemonade stand, the neighbors who bought, and the money that was left',
  more: [{ serial: 'S429', after: 1, alt: 'Lemons, sugar and a pitcher on the table' }, { serial: 'S430', after: 3, alt: 'A jar of coins, six dollars counted out beside it' }],
  title: 'The lemonade stand', art: 'S428', cast: [],
  alt: 'Two children at a lemonade stand in a front yard, a neighbor holding out coins',
  words: [
    'Ana and her brother made lemonade and sold it. Neighbors came and paid. At the end, Ana wanted to know if they had made money.',
    'They had spent some first. Lemons, sugar, cups.',
    'They were the producers. They made the lemonade. The neighbors were consumers. They bought it. They took in ten dollars. They had spent six. Ten minus six: four dollars left.',
    'Producers make. Consumers buy. Money left is what you had minus what you spent.',
  ],
};
STORIES['maps-of-our-town'] = {
  about: 'a little book drawn on a map, and the key that said what it meant',
  more: [{ serial: 'S432', after: 1, alt: 'The map key with a book, a tree and a cross drawn beside words' }, { serial: 'S433', after: 3, alt: 'A finger counting three blocks north on the map' }],
  title: 'The key on the map', art: 'S431', cast: [],
  alt: 'A boy on library steps holding a town map, a small book symbol on it',
  words: [
    'Sam looked at the town map. There was a tiny book drawn on it. Why a book? He had no idea.',
    'In the corner was a box with pictures and words. The key.',
    'The key said a book means library. A tree means park. From home, three blocks north, and there it was. Sam counted the blocks with his finger.',
    'The key tells you what the pictures mean. Count the blocks. North is at the top.',
  ],
};
STORIES['services-in-our-town'] = {
  about: 'a fire truck, a library book and a park swing, and who sent them all',
  more: [{ serial: 'S435', after: 1, alt: 'The fire truck at a smoky corner' }, { serial: 'S436', after: 3, alt: 'The library, the school and the park in a row' }],
  title: 'Who sent the truck', art: 'S434', cast: [],
  alt: 'A girl watching a fire truck pass a library and a park on a town street',
  words: [
    'A fire started on the corner. A fire truck came fast. Rosa asked who had sent it. Nobody had called it, she thought.',
    'Someone had paid for that truck long before the fire.',
    'The town did. The town sends the fire truck. The town lends the library book. The town keeps the park and the school. Services, for everyone.',
    'Police, fire, library, school, park. The town provides them for everyone.',
  ],
};
STORIES['saving-for-a-goal'] = {
  about: 'a twelve-dollar kite, an empty jar, and two dollars a week',
  more: [{ serial: 'S438', after: 1, alt: 'The empty jar with the kite picture' }, { serial: 'S439', after: 3, alt: 'The jar full and the kite in the sky' }],
  title: 'The kite jar', art: 'S437', cast: [],
  alt: 'A boy holding a jar with a few dollars inside, a picture of a kite taped to it',
  words: [
    'The kite cost twelve dollars. Leo\'s jar had nothing in it. He wanted the kite now. Now was not going to work.',
    'He got two dollars a week. How many weeks?',
    'He saved. One week, two dollars. Two weeks, four. He counted ahead. Twelve divided by two is six. Six weeks. On week six, the kite flew.',
    'Save a little each week. Weeks to save is the price divided by what you save.',
  ],
};
STORIES['hard-or-soft'] = {
  about: 'a rock, a pillow, a sponge and a towel, and the girl who sorted them by feel',
  more: [{ serial: 'S441', after: 1, alt: 'A hand pressing a hard rock and a soft pillow' }, { serial: 'S442', after: 3, alt: 'A wet sponge dripping next to a dry towel' }],
  title: 'By feel', art: 'S440', cast: [],
  alt: 'A girl feeling a rock, a pillow, a wet sponge and a dry towel laid out on a mat',
  words: [
    'Mia had four things and one question. What are they like? She looked. Looking did not tell her much.',
    'So she touched them.',
    'The rock: hard. The pillow: soft. The sponge: wet. The towel: dry. Her hands knew what her eyes did not.',
    'Things have properties: hard or soft, wet or dry.',
  ],
};
// Grade 3, in the fewest words that still make a story.
STORIES['equivalent-fractions'] = {
  about: 'two pizzas and the argument over who got more',
  more: [{ serial: 'S444', after: 1, alt: 'A half slice and two quarter slices lined up crust to crust, matching exactly' }, { serial: 'S445', after: 3, alt: 'The girl holding up two quarters and the boy one half, both smiling' }],
  title: 'Two pizzas', art: 'S443', cast: [],
  alt: 'Two same-size pizzas on a kitchen counter, one cut in two and one cut in four, a boy and a girl leaning over them',
  words: [
    'Leo and his sister Ava ordered two pizzas the same size. The first came cut into two big pieces. The second came cut into four smaller ones. Leo took one piece of the first. Ava took two pieces of the second and said she had more, because two is more than one.',
    'Leo was sure she was wrong, but he could not say why. Two pieces did look like more. The cheese was going cold while they argued, and the box smelled of oregano. So they did the fair thing. They laid Ava\'s two pieces beside Leo\'s one and lined up the crusts.',
    'The edges matched exactly. Two quarters covered the very same pizza as one half. The pizza had not changed. Only the number of cuts had. Double the pieces and double how many you take, and you gain nothing and lose nothing.',
    'That is an equivalent fraction. Multiply the top and the bottom by the same number and the fraction only changes its clothes. Cut a thing finer, take more of the smaller pieces, and you are holding exactly what you held before.',
  ],
};
STORIES['comparing-fractions'] = {
  about: 'a birthday cake, and the slice that fooled everyone',
  more: [{ serial: 'S447', after: 1, alt: 'The cake cut into three on one side and eight on the other, seen from above' }, { serial: 'S448', after: 3, alt: 'A thick third slice next to a thin eighth slice on two plates' }],
  title: 'Which slice is bigger?', art: 'S446', cast: [],
  alt: 'A round birthday cake on a table, one third cut on a plate beside a thin eighth, a surprised child',
  words: [
    'At Maya\'s birthday, her uncle offered her a choice. She could have one third of the chocolate cake, or one eighth. Maya loved big numbers. Eight is much bigger than three. She chose the eighth.',
    'Then she watched her cousin get one third. His slice was a thick wedge with frosting piled on the edge. Hers was a thin sliver she could see through. She had chosen the bigger number and gotten the smaller cake. How?',
    'Her uncle showed her the two cakes side by side. Cut a cake into three and each piece is big. Cut the same cake into eight and each piece is small. The bottom number says how many cuts. More cuts, thinner slices. So with the same top, the smaller bottom wins.',
    'That is the trick of comparing fractions. Same bottom, the bigger top wins, because the slices are the same size. Same top, the smaller bottom wins, because the slices are bigger. Otherwise, rename them to match, and then look.',
  ],
};
STORIES['fractions-on-a-line'] = {
  about: 'a ruler, a bead and the walk from zero to one',
  more: [{ serial: 'S450', after: 1, alt: 'A close look at the space between 0 and 1 on the ruler, four small steps marked' }, { serial: 'S451', after: 3, alt: 'The bead sitting on the three-quarter mark, three steps counted on the child\'s fingers' }],
  title: 'Marks on the ruler', art: 'S449', cast: [],
  alt: 'A wooden ruler with a small green bead resting on the third mark between zero and one, a child counting',
  words: [
    'Sam needed to cut a straw to three quarters of an inch for a science model. The ruler said 0 and 1, and between them were little marks with no numbers at all. Where was three quarters?',
    'He guessed once and cut too short. He guessed again and cut too long. The straw was getting shorter and the model was getting later. The little marks had to mean something.',
    'His teacher put a bead at 0 and slid it. From 0 to 1 there were four equal steps. One step was one quarter. Two steps, two quarters. Three steps, three quarters. The bottom number said how many steps make a whole. The top said how many steps to walk. Sam walked three and cut.',
    'A number line is a road with signposts. Cut 0 to 1 into equal steps, and a fraction is just a place on that road. The bottom number is the size of each step. The top number is how far you have walked.',
  ],
};
STORIES['building-fractions'] = {
  about: 'five wooden blocks, and the fraction a girl built from them',
  more: [{ serial: 'S453', after: 1, alt: 'Three blocks pulled forward from the row of five, each block the same size' }, { serial: 'S454', after: 3, alt: 'The five blocks pushed back together into one whole bar' }],
  title: 'Blocks of a fifth', art: 'S452', cast: [],
  alt: 'Five wooden blocks in a row making one long bar, a girl pulling three of them forward on a table',
  words: [
    'Nadia had five wooden blocks that fit together into one long bar. The bar was one whole. Her brother asked her to show him three fifths, and she stared at the blocks. A fraction was a thing you wrote, not a thing you built. Or was it?',
    'She tried writing it on paper. Three over five. Her brother shrugged. He wanted to see it. The blocks clicked against each other as she pushed them around, and then she saw it.',
    'Each block was one fifth of the bar. She pulled three forward. One fifth, one fifth, one fifth. Three fifths, sitting on the table. Take one away and it was two fifths. Push all five together and it was five fifths, the whole bar again.',
    'A fraction is built from unit pieces, and it can be taken apart in more than one way. Three fifths is three little fifths, or one fifth and two fifths, or a whole bar with two fifths missing. Once you can build it, you can see it.',
  ],
};
STORIES['prefixes-and-suffixes'] = {
  about: 'a boy who thought unhappy and happily were three different words',
  more: [{ serial: 'S456', after: 1, alt: 'A finger covering the letters un on the card so only happy shows' }, { serial: 'S457', after: 3, alt: 'The boy sliding the card ly onto the end of happy' }],
  title: 'Happy, unhappy, happily', art: 'S455', cast: [],
  alt: 'A boy at a kitchen table with three word cards laid out, happy, unhappy and happily, a pencil in his hand',
  words: [
    'Diego had a spelling list with happy, unhappy and happily on it. Three words to learn, he thought, and each one was long. He groaned and put his head on the table. The paper smelled like fresh printer ink.',
    'His big sister slid a finger over the first two letters of unhappy. What was left? Happy. Then she covered the last two letters of happily. Happy again. Diego sat up. Were these even three words?',
    'They were one word wearing costumes. Un goes on the front and flips the meaning: happy becomes not happy. That is a prefix. Ly goes on the end and changes the job: happy becomes a way of doing something. That is a suffix. Take the costume off and the small word is still standing there.',
    'Half the long words you will ever meet are short words in costume. Find the front piece, find the end piece, and read the middle. Unkind, kindly, rewrite, careless, preheat. Once you can see the seams, long words stop being scary.',
  ],
};
STORIES['fact-or-opinion'] = {
  about: 'a dog show, a scale and the sentence nobody could check',
  more: [{ serial: 'S459', after: 1, alt: 'The scale needle pointing at thirty pounds' }, { serial: 'S460', after: 3, alt: 'Two children arguing over which dog is best, both pointing at different dogs' }],
  title: 'Check it or argue it', art: 'S458', cast: [],
  alt: 'A girl at a dog show holding a fluffy brown dog on a scale, a judge with a clipboard nearby',
  words: [
    'At the county dog show, Priya\'s neighbor said two things about her dog. The dog weighs thirty pounds. And that dog is the best one here. Priya wrote both down for the school paper. Her teacher circled the second one.',
    'What was wrong with it? Priya had heard it with her own ears. The neighbor had said it. But when she tried to prove it, she got stuck. Best according to whom? The kid next to her was sure the beagle was best, and he was not going to change his mind.',
    'The first sentence could be checked. Put the dog on the scale, and the needle says thirty. That is a fact. The second sentence could only be argued. It was what the neighbor thought. That is an opinion. Words like best, boring, should and I think are the flags that wave over an opinion.',
    'Every sentence you read is one or the other. Ask, could I check this with a scale, a map or a clock? If yes, it is a fact. If all you could do is argue, it is an opinion, and it belongs to the person who said it.',
  ],
};
STORIES['sequence-and-cause'] = {
  about: 'a muddy kitchen floor and the two words that told the same story',
  more: [{ serial: 'S462', after: 1, alt: 'The wet dog coming in from the rain, shaking water off' }, { serial: 'S463', after: 3, alt: 'The boy writing two sentences on a whiteboard, one starting with because and one with so' }],
  title: 'Because and so', art: 'S461', cast: [],
  alt: 'A muddy paw trail across a kitchen floor, a wet dog by the door, a boy holding a mop',
  words: [
    'Sam came home to a trail of muddy paw prints across the kitchen floor. His mom asked what happened. He knew, but when he tried to say it, the sentence came out in a tangle. The dog. The rain. The floor. The mud. In what order?',
    'He tried it as a list. Rain, dog, door, mud. His mom shook her head. That told her what, but not why. The mop was dripping and the dog was looking guilty and he still could not say it right.',
    'Then he tried a small word. The floor is muddy because the dog came in from the rain. Because pointed backward, at the reason. Or the other way: the dog was wet, so the floor got muddy. So pointed forward, at what happened. Same story, two words, and both made sense.',
    'A cause is why. An effect is what happened. Because looks back at the cause, so looks ahead to the effect, and first and then only say what order things came in. Pick the right little word and a tangle turns into a story.',
  ],
};
STORIES['states-of-matter'] = {
  about: 'an ice cube, a glass and a kettle, and the morning they were all the same thing',
  more: [{ serial: 'S465', after: 1, alt: 'An ice cube keeping its shape on a plate while a puddle spreads around it' }, { serial: 'S466', after: 3, alt: 'Steam rising from a kettle spout and spreading through the kitchen air' }],
  title: 'Three states in the kitchen', art: 'S464', cast: [],
  alt: 'A kitchen counter at breakfast with an ice cube on a plate, a glass of water and a steaming kettle',
  words: [
    'On Saturday morning, Theo dropped an ice cube on the counter and left it. He poured water into a glass. His mother put the kettle on. Three different things, he thought. Ice, water, steam.',
    'When he came back, the ice cube was gone. In its place was a puddle. The kettle was whistling and the window had gone foggy. Where did the ice go? And what was that fog on the glass?',
    'His mother tapped the counter. The ice cube kept its shape until it warmed. That is a solid. The water took the shape of the glass. That is a liquid. The steam spread through the whole kitchen. That is a gas. It was the same water all three times. Heat had moved it from one state to the next.',
    'Everything around you is a solid, a liquid or a gas. A solid keeps its shape. A liquid takes the shape of its container. A gas fills whatever holds it. Heat it and it moves up the list. Cool it and it comes back down.',
  ],
};
STORIES['forces-and-motion'] = {
  about: 'a stuck wagon on a hill and the three forces that moved it',
  more: [{ serial: 'S468', after: 1, alt: 'The wagon rolling slower and slower across thick grass' }, { serial: 'S469', after: 3, alt: 'The wagon rolling back down the hill on its own, the children watching' }],
  title: 'Pushes and pulls', art: 'S467', cast: [],
  alt: 'A red wagon at the bottom of a grassy hill, a boy pulling the handle, a girl pushing from behind',
  words: [
    'The wagon sat at the bottom of the hill and did nothing. Jamal wanted it at the top. He stood beside it and waited. Nothing happened. Wagons, it turns out, do not move by themselves.',
    'He pulled the handle and it rolled, squeaking, up the sidewalk. Then his sister steered it onto the grass to save time. It slowed and stopped, even though he was still pulling. The grass was fighting him. Why?',
    'His dad explained on the way up. A force is a push or a pull, and the wagon only moves when one acts on it. On the grass, friction rubbed against the wheels and slowed them. At the top, Jamal let go, and gravity pulled the wagon straight back down the hill without anyone touching it.',
    'Nothing moves without a force. A push or a pull gets things going, friction slows moving things, and gravity pulls everything toward the ground. Watch anything roll, slide or fall, and you will find those three at work.',
  ],
};
STORIES['life-cycles'] = {
  about: 'a jar of pond water and the eggs that turned into something new every week',
  more: [{ serial: 'S471', after: 1, alt: 'Tadpoles with tiny back legs swimming in the jar' }, { serial: 'S472', after: 3, alt: 'A small frog on the edge of the pond, and a new clump of eggs in the water' }],
  title: 'The jar of eggs', art: 'S470', cast: [],
  alt: 'A glass jar of pond water on a windowsill with a clump of frog eggs inside, a girl looking closely',
  words: [
    'Rosa scooped a clump of clear jelly from the pond and put it in a jar on the windowsill. Inside the jelly were little black dots. Her brother said they were dirt. She said they were eggs. Nobody could tell.',
    'A week later the dots had tails and were wriggling. Two weeks later they had back legs. Three weeks later, front legs, and the tails were shrinking. Every time Rosa looked, the thing in the jar was something different. Was it the same animal at all?',
    'It was. Her teacher drew a circle on the board. Egg, tadpole, tadpole with legs, small frog, grown frog. Each stage led to the next, and the last one laid eggs to start the circle again. Rosa carried the frogs back to the pond, and in spring the pond had new jelly.',
    'That circle is a life cycle. Every living thing goes through its own stages, and the last stage leads back to the first. A frog, a butterfly, an oak tree, and you. The shapes change, but the circle keeps turning.',
  ],
};
STORIES['paragraph-shape'] = {
  about: 'a paragraph about a dog that a girl built one sentence at a time',
  more: [{ serial: 'S474', after: 1, alt: 'A notebook page with one sentence at the top and a stack of shorter sentences under it' }, { serial: 'S475', after: 3, alt: 'The dog waiting at the front door with a pair of shoes' }],
  title: 'The shape of it', art: 'S473', cast: [],
  alt: 'A girl at a desk writing, a scruffy dog beside her holding a newspaper in its mouth',
  words: [
    'Lily had to write a paragraph about her dog, and she had a hundred things to say. He brings the paper. He finds her shoes. He waits at the door. She wrote them all down in a heap and read it back. It sounded like a shopping list.',
    'Her teacher asked one question. What is the paragraph about? Lily said, my dog. The teacher said, yes, but what about him? Lily looked at her heap of sentences. They were all true. None of them said the big thing.',
    'So she wrote the big thing first. My dog is the best helper. That was the idea, and it went in the first sentence. Then the heap became the proof. He brings the paper. He finds my shoes. He waits at the door. Every detail pointed back at the idea.',
    'That is the shape of a paragraph. One idea in the first sentence, details in the sentences after it, all of them holding the idea up. When a new idea shows up, it gets a new paragraph of its own.',
  ],
};
STORIES['explain-how'] = {
  about: 'a paper boat and the steps that only worked in one order',
  more: [{ serial: 'S477', after: 1, alt: 'A numbered list of folds on a page beside a sheet of paper' }, { serial: 'S478', after: 3, alt: 'A paper boat floating in a bathtub' }],
  title: 'The paper boat', art: 'S476', cast: [],
  alt: 'Two children at a table with sheets of paper, one holding a finished paper boat, the other a crumpled fold',
  words: [
    'Marcus could fold a paper boat with his eyes closed. His friend Eli could not, so Marcus wrote it down for him. Fold the corners. Fold in half. Fold the flaps. Open it out. Eli followed the note and ended up with a paper hat that sank.',
    'Marcus was annoyed. All the steps were there. He had not left one out. Eli held up the soggy hat and said, you said fold the corners before fold in half. Marcus looked at his note. He had.',
    'He wrote it again, slowly, the way his hands actually did it. What you need: one sheet of paper. Then the steps, in order. Fold in half. Fold the corners down. Fold the flaps up. Open it out. Eli followed it and the boat floated in the sink.',
    'Explaining how to do something has two parts. Say what is needed, then give the steps in the order they really happen. The test is simple. If a friend can follow your words and end up with a boat, you explained it.',
  ],
};
STORIES['give-a-reason'] = {
  about: 'a class that wanted a pet, and the girl who said why properly',
  more: [{ serial: 'S480', after: 1, alt: 'A poster with I think at the top and two because lines under it' }, { serial: 'S481', after: 3, alt: 'A goldfish in the tank on the classroom windowsill' }],
  title: 'I think, because', art: 'S479', cast: [],
  alt: 'A girl standing in front of her class beside an empty fish tank, classmates listening',
  words: [
    'Mia\'s class wanted a pet. When the teacher asked why, twelve kids shouted at once. Because pets are cool. Because. Just because. The teacher waited for the noise to stop and said, that is not a reason, that is a wish.',
    'Mia wanted the pet more than anyone. But she could hear that the shouting was not working. Wanting something was not the same as making a case for it. What did a case even look like?',
    'She put up her hand and said it in order. I think our class should get a fish. Because we would learn to care for something. Because a fish is quiet and will not bother the class next door. Then she said it again a new way: a fish would be a good classmate. The teacher wrote it on the board.',
    'That is how to give a reason. Say what you think. Then say because, twice, with two real reasons. Then say it again at the end in fresh words. The class got a fish, and the fish got a name.',
  ],
};
STORIES['equal-groups'] = {
  about: 'three bags of apples and the boy who was too slow counting them',
  more: [{ serial: 'S483', after: 1, alt: 'Apples tipped out into three neat rows of five' }, { serial: 'S484', after: 3, alt: 'The boy holding up three fingers on one hand and five on the other, grinning' }],
  title: 'Three bags', art: 'S482', cast: [],
  alt: 'Three paper bags of apples on a market stall, a boy counting with his finger, a line of customers waiting',
  words: [
    'Ben helped at his aunt\'s market stall. Three bags of apples, five in each, and a customer asking how many in all. Ben counted every apple with his finger. One, two, three. The customer sighed. Ben lost his place and started over.',
    'His aunt could say the answer before he had opened the second bag. Fifteen. Every time. Was she guessing? The apples smelled sweet and the line was getting longer.',
    'She tipped the apples into three rows of five. Five, ten, fifteen, she said, tapping each row. Three groups of five is three fives added together. That is all multiplying is. The same number, again and again, counted the fast way. Three times five is fifteen.',
    'Whenever things come in equal groups, you do not have to count them one by one. Groups times how many in each group. It works for bags of apples, rows of chairs and wheels on cars. Once you see the groups, the counting is already done.',
  ],
};
STORIES['times-tables'] = {
  about: 'the fact that would not stick, and the rectangle that made it stay',
  more: [{ serial: 'S486', after: 1, alt: 'The same rectangle of dots turned on its side, eight across and seven down' }, { serial: 'S487', after: 3, alt: 'A times table chart with the bottom half shaded, the girl pointing at the empty half' }],
  title: 'Seven times eight', art: 'S485', cast: [],
  alt: 'A girl at a table with a grid of colored dots on paper, seven across and eight down, tracing the rows',
  words: [
    'Every fact in the times table stuck for Lena except one. Seven times eight. She would learn it at night and lose it by morning. It was like a sock that kept disappearing in the wash.',
    'Her grandfather asked her what seven times eight even meant. She said, fifty-six. He said no, what does it mean. She did not know. She had been memorizing a sound, not a thing.',
    'He drew a rectangle of dots on a napkin, seven across and eight down. Fifty-six dots. Then he turned the napkin. Eight across and seven down. The same fifty-six. Seven eights and eight sevens were one rectangle looked at two ways. Lena counted the rows and the fact finally had a shape.',
    'The facts up to ten times ten are the tools every bigger multiplication uses. Every fact works both ways, so learn half the table and you own the whole thing. And a fact you can picture is a fact you keep.',
  ],
};
STORIES['sharing-equally'] = {
  about: 'twelve cookies, four friends and a fight that ended with a deal',
  more: [{ serial: 'S489', after: 1, alt: 'Three cookies on every plate, all four plates matching' }, { serial: 'S490', after: 3, alt: 'A girl checking her work: three cookies, four plates, twelve fingers held up' }],
  title: 'Deal them out', art: 'S488', cast: [],
  alt: 'Four children around a table with four plates, a girl dealing cookies out one at a time from a plate of twelve',
  words: [
    'Twelve cookies, four friends, and nobody wanted to be the one who got fewer. Everyone grabbed. Somebody got four, somebody got two, and the arguing started before anyone had taken a bite.',
    'Grace took the plate back. There had to be a fair way. Twelve was too many to just see. She could feel the warm cookies through the plate and everyone was staring at her.',
    'She dealt them out like cards. One for each friend, round the table. Then another round. Then another. The plate was empty and every plate had three. Twelve divided by four is three. And she could check it backward: three cookies times four friends is twelve.',
    'Dividing is sharing out equally, one round at a time. It undoes multiplying, so when a division looks hard, ask the backward question. What times four makes twelve? The answer to that is the answer to this.',
  ],
};
STORIES['add-subtract-1000'] = {
  about: 'two jars of marbles and the column that overflowed',
  more: [{ serial: 'S492', after: 1, alt: 'A close look at the ones column: 6 and 8 making 14, the 4 written and a small 1 carried' }, { serial: 'S493', after: 3, alt: 'The finished sum, 634, and the marbles poured together into one big jar' }],
  title: 'Column by column', art: 'S491', cast: [],
  alt: 'Two jars of marbles on a desk, one with 256 and one with 378, a boy writing the sum in columns',
  words: [
    'Marcus had 256 marbles in one jar and 378 in another. He wanted one number for the whole collection. He tried adding it in his head and got a different answer every time. The marbles clicked as he shook the jars, as if they were laughing.',
    'The trouble was the ones. Six and eight made fourteen, and fourteen would not fit in one column. Where did the extra ten go? He wrote it in the ones place and the answer came out enormous and wrong.',
    'His teacher showed him to go column by column, ones first. Six and eight is fourteen. Write the 4, carry the ten to the tens column. Tens: five and seven and the carried one is thirteen. Write the 3, carry the hundred. Hundreds: two and three and one is six. 634 marbles.',
    'Adding big numbers is just adding small columns in order, ones then tens then hundreds. When a column makes ten or more, carry the ten to the next column, where it belongs. Subtracting works the same way backward, borrowing instead of carrying.',
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
  about: 'a pothole, a highway and a stamp, and the three governments a boy met in one morning',
  more: [{ serial: 'S504', after: 1, alt: 'A city truck filling the pothole, a worker in an orange vest' }, { serial: 'S505', after: 3, alt: 'The boy dropping a stamped letter into a blue mailbox' }],
  title: 'Three levels', art: 'S503', cast: [],
  alt: 'A boy on a bike beside a pothole on a city street, a highway sign in the distance, a letter with a stamp in his basket',
  words: [
    'On Saturday, Tomas hit a pothole on his bike, rode past the highway crew fixing the overpass, and mailed a birthday card to his grandmother. Three ordinary things. Then his uncle asked who fixes the pothole, who builds the highway and who prints the stamp.',
    'Tomas said, the government. His uncle said, which one? Tomas did not know there was more than one. It felt like a trick question, and the pothole was still there.',
    'There are three, stacked like floors in a building. The city fills the pothole, and a mayor leads the city. The state builds the highway, and a governor leads Texas from Austin. The country prints the stamp, and a president leads the United States. Each level does the jobs that fit its size.',
    'Local, state and national. Three levels, three leaders, three sets of jobs. The next time something in your town gets fixed, built or mailed, ask which floor of the building did it.',
  ],
};
STORIES['how-we-decide'] = {
  about: 'a classroom rule and a red light, and why one of them was a law',
  more: [{ serial: 'S507', after: 1, alt: 'A crosswalk with cars stopped at a red light, a police officer nearby' }, { serial: 'S508', after: 3, alt: 'The Capitol building in Washington with three drawn figures for Congress, the President and the courts' }],
  title: 'Rule or law?', art: 'S506', cast: [],
  alt: 'A boy walking calmly down a school hallway past a No Running sign, a red traffic light visible through the window',
  words: [
    'Kai got told off twice in one day. Once for running in the hall, and once, on the way home, for starting to cross before the light turned. His dad said one of those was a rule and one was a law. Kai said they felt exactly the same.',
    'They both told him what to do. They both had someone watching. But when he asked why running in the hall was not a law, his dad laughed. Would a police officer pull over a kid for running in a hallway in another town?',
    'No. A rule is for a small group, like a school, and the school makes it. A law is for everyone, everywhere in the country, and it takes a whole system to make one. Congress writes the law. The President carries it out. The courts decide what it means when people disagree.',
    'Rule or law, the question is always the same: who does it cover? The hall rule stops at the school door. The red light follows you to every town in the country, because everyone had a say in making it.',
  ],
};
STORIES['earning-and-choosing'] = {
  about: 'eleven dollars, a book and a ball, and the thing that got left on the shelf',
  more: [{ serial: 'S510', after: 1, alt: 'Six dollars from chores and five from a card laid out on a bed and counted' }, { serial: 'S511', after: 3, alt: 'The girl walking out of the store with the book, glancing back at the ball' }],
  title: 'The eleven dollars', art: 'S509', cast: [],
  alt: 'A girl at a store counter with coins and bills in her hand, a book and a ball on the shelf in front of her',
  words: [
    'Rosa had eleven dollars. Six from chores, five from a birthday card. At the store she found the book she wanted for eight dollars and the ball she wanted for seven. She counted the money twice. It did not get bigger.',
    'She tried every trick. Maybe the ball was on sale. It was not. Maybe she could pay the rest next week. The cashier smiled and said no. Eleven dollars was eleven dollars, and fifteen was fifteen.',
    'That is scarcity. There is never enough for everything, so every choice gives something up. Rosa chose the book. The ball stayed on the shelf, and the ball was the real cost of the book. Not eight dollars. The ball. Economists call the thing you gave up the opportunity cost.',
    'Every time you spend money, time or attention, you are also not spending it on something else. Grown-ups make this choice all day long. The trick is not to avoid it. It is to know what you are giving up, and to choose on purpose.',
  ],
};
// Grades 4 and 5, in the fewest words that still make a story.
STORIES['summarizing'] = {
  about: 'a two-hour movie, a one-minute bus stop, and the boy who had to leave almost everything out',
  more: [{ serial: 'S513', after: 1, alt: 'A movie poster of a hero crossing a desert toward a distant city' }, { serial: 'S514', after: 3, alt: 'The bus doors open, the second boy nodding as he steps on' }],
  title: 'One minute', art: 'S512', cast: [],
  alt: 'Two boys at a bus stop, one talking fast with his hands, a bus coming down the street',
  words: [
    'Noah had seen the movie. His friend Eli had not, and Eli\'s bus was one minute away. Tell me the story, Eli said. Noah started at the very beginning, with the hero\'s breakfast, and the bus was already turning the corner.',
    'He could not do it. There were two hours of movie and he loved all of it. The dog, the joke about the boots, the song in the market. If he left any of it out, was it even the same story?',
    'The bus stopped and he had thirty seconds. The hero lost the map, crossed the desert, and found the city. That was it. No breakfast, no dog, no song. Eli said, oh, that sounds good, and got on the bus knowing exactly what the movie was about.',
    'A summary keeps the big events and drops the small details. It stays in order, and it leaves your opinion out. The test is the bus stop: if a friend can hear it in a minute and know the story, you have summarized it.',
  ],
};
STORIES['making-inferences'] = {
  about: 'muddy boots, a sigh, and the thing nobody said out loud',
  more: [{ serial: 'S516', after: 1, alt: 'A puddle on a sidewalk with a splash frozen mid-air' }, { serial: 'S517', after: 3, alt: 'A notebook page with a clue on one side and a guess on the other, an arrow between them' }],
  title: 'The muddy boots', art: 'S515', cast: [],
  alt: 'A pair of muddy rain boots dropped by a front door, a mother looking at them, a girl peeking from the stairs',
  words: [
    'When Tessa came downstairs, her brother\'s boots were by the door, caked in mud to the ankles. Her mom looked at them and sighed. Nobody said a word about where he had been.',
    'And yet Tessa knew. Puddle jumping, on the way home from school, the way he always did after rain. Nobody had told her. How could she be so sure of something she had not been told?',
    'Because she had two things. A clue in front of her, the mud on the boots, and something she already knew, that her brother could not pass a puddle. Put the clue together with what you know, and you get a fact the scene showed without saying. That is an inference.',
    'Writers do this to readers all the time. They show muddy boots and a sigh and trust you to work out the rest. An inference is not a wild guess. It is a guess with a clue behind it, and the clue is always in the text.',
  ],
};
STORIES['similes-and-metaphors'] = {
  about: 'a brave friend, and the two ways a girl found to say how brave',
  more: [{ serial: 'S519', after: 1, alt: 'The girl with the word AS glowing between her and a lion' }, { serial: 'S520', after: 3, alt: 'The girl drawn as a lion outright, mane and all, still in her school clothes' }],
  title: 'Brave as a lion', art: 'S518', cast: [],
  alt: 'A girl standing up for a small boy on a playground, a faint lion drawn in the air beside her',
  words: [
    'Rosa\'s friend Maya had stood up to the biggest kid in school without blinking. Rosa wanted to write it down and the word brave did not seem big enough. Brave was what you called someone at the dentist.',
    'She tried adding more brave. Very brave. Really very brave. It got longer and weaker every time. The bravest thing she had ever seen was turning into a pile of dull words.',
    'Then she stopped describing Maya and compared her. Maya is as brave as a lion. The little word as made it a simile, a comparison that says so. Then she went further. Maya is a lion. No like, no as. Maya simply was one, for the length of the sentence. That is a metaphor.',
    'Neither sentence is meant to be true. Maya has no mane. But both put a lion in the reader\'s head, and that is the job. Like or as makes a simile. Saying one thing is another makes a metaphor. Both say more than brave ever could.',
  ],
};
STORIES['text-structure'] = {
  about: 'a chapter that made no sense until a boy read its road signs',
  more: [{ serial: 'S522', after: 1, alt: 'A road with signs reading First, Next and Then, one after another' }, { serial: 'S523', after: 3, alt: 'A fork in the road with signs reading However and But' }],
  title: 'Road signs', art: 'S521', cast: [],
  alt: 'A boy reading a textbook page where the words first, because and however glow like road signs along a winding road',
  words: [
    'Jamal read the science chapter twice and could not have told you what it was about. The words were fine one at a time. Together they felt like a road with no signs, and he kept missing the turns.',
    'His teacher told him to stop reading the sentences and read the little words between them instead. First. Next. Then. Because. So. However. Jamal thought she was joking. Those were the words you skipped.',
    'They were the signs. First, next and then meant the text was a sequence, one step after another. Because and so meant cause and effect: this happened, so that happened. But and however meant a comparison, two things set against each other. Once he knew the shape of the road, the chapter made sense on the first try.',
    'Every text is built one of a few ways, and the signal words tell you which. Read the signs before the sentences, and you will know whether you are walking a line, a chain of causes, or a fork between two ideas.',
  ],
};
STORIES['forms-of-energy'] = {
  about: 'one kitchen before breakfast, and the five kinds of energy a boy counted in it',
  more: [{ serial: 'S525', after: 1, alt: 'A toaster glowing orange inside with bread in it' }, { serial: 'S526', after: 3, alt: 'The boy pointing at a fan, a lamp and a radio in turn, counting on his fingers' }],
  title: 'Five kinds before breakfast', art: 'S524', cast: [],
  alt: 'A boy in a bright kitchen at breakfast with a lamp, a toaster, a radio, a wall outlet and a spinning fan',
  words: [
    'Amir had to find five kinds of energy for homework, and he was sure it would take all day. Energy sounded like something in a power plant, or a rocket. Not something you would find at home before breakfast.',
    'He stood in the kitchen with a pencil and nothing on the page. The lamp was on. The toaster was ticking. His dad was listening to the radio. The fan was turning. He had been in this room a thousand times and never seen any energy in it.',
    'Then he looked again. The lamp gave off light. The toaster glowed with heat, and he could smell the bread starting to brown. The radio made sound. The outlet fed the fan electrical energy, and the fan turned it into moving blades, which is mechanical energy. Five kinds, one kitchen, before he had even eaten.',
    'Energy is never just one thing. It comes in forms, and every machine in your house changes one form into another: electrical into light, electrical into heat, electrical into motion. Once you can see the changes, no room is ever ordinary again.',
  ],
};
STORIES['circuits'] = {
  about: 'a bulb that would not light until the last wire closed the loop',
  more: [{ serial: 'S528', after: 1, alt: 'The bulb dark, one wire lying loose on the table' }, { serial: 'S529', after: 3, alt: 'The bulb lit, the wire touching, the girl grinning' }],
  title: 'The loop', art: 'S527', cast: [],
  alt: 'A girl at a table with a battery, a bulb and two wires, holding the last wire just short of the bulb',
  words: [
    'Jade had a battery, a bulb and two wires. The instructions said the bulb would light. She hooked one wire from the battery to the bulb and waited. Nothing. She wiggled it. Still nothing. The bulb sat there like a tiny glass egg.',
    'She checked the battery. It was new. She checked the bulb. It was fine. Everything worked and nothing worked. Her brother said the electricity was probably stuck inside the battery, which did not help at all.',
    'Then she noticed the second wire. It ran from the bulb back toward the battery and stopped an inch short. She touched it to the battery. Light. She lifted it. Dark. Electricity did not want a road. It wanted a loop, a full circle from the battery, through the bulb and back home.',
    'Every circuit is a loop, and electricity flows only when the loop is complete. Cut it anywhere and it stops. That is what a switch does: it opens the loop and closes it. Conductors like metal let the flow through; insulators like plastic stop it.',
  ],
};
STORIES['changing-land'] = {
  about: 'a sandcastle and the week of weather that broke it, moved it and built it again somewhere else',
  more: [{ serial: 'S531', after: 1, alt: 'The sandcastle walls crumbling in the rain, water running down them' }, { serial: 'S532', after: 3, alt: 'A new bank of sand piled up farther down the beach, the girl pointing at it' }],
  title: 'The sandcastle', art: 'S530', cast: [],
  alt: 'A tall sandcastle on a beach at sunset, a girl beside it, rain clouds gathering out at sea',
  words: [
    'Sofia built the best sandcastle of her life on the first day of vacation. Three towers, a moat, a wall you could stand a shell on. She came back every morning to check on it, and every morning it was a little less castle.',
    'On the second day the rain had softened the walls into lumps. By the fourth, the waves had carried half the sand out to sea. By the last day there was nothing at her spot at all. And yet, farther down the beach, a fresh bank of sand had piled up where none had been.',
    'The beach had done three jobs. Weathering broke the castle: rain and salt crumbled the packed sand. Erosion carried it: the waves dragged the loose grains away. Deposition dropped it: where the water slowed, the sand settled into a new bank. Break, carry, drop.',
    'The same three jobs shape every hill, canyon and river valley on Earth. Water, wind, ice and even roots break rock, carry it and drop it somewhere new. A sandcastle shows in one week what a mountain shows in a million years.',
  ],
};
STORIES['adaptations'] = {
  about: 'a duck, a cactus and the question of why each one looked so strange',
  more: [{ serial: 'S534', after: 1, alt: 'A close look at a duck\'s webbed foot pushing through water' }, { serial: 'S535', after: 3, alt: 'A cactus covered in spines, a thirsty rabbit keeping its distance' }],
  title: 'The right tools', art: 'S533', cast: [],
  alt: 'A duck paddling on a pond in the foreground and a tall cactus in a desert in the distance, a boy looking between them',
  words: [
    'At the zoo, Ravi watched a duck paddle across the pond and then walked into the desert house, where a cactus stood covered in spines. He thought both looked ridiculous. Feet like paddles. A plant like a pincushion. Why would anything grow that way?',
    'He asked the keeper whether the duck minded its silly feet. She asked him a question back. What would happen to a duck with feet like a chicken? He pictured it paddling and going nowhere. And a cactus with soft leaves, in a desert full of thirsty animals?',
    'Every strange part was a tool for a problem. Webbed feet solve the problem of pushing through water. Spines solve the problem of being eaten in a place where water is rare. The duck and the cactus were not ridiculous. They were exactly right for where they lived.',
    'An adaptation is a part or a habit that solves a problem of the place a living thing lives. When something looks odd, ask two questions. What is the problem here? And how does that part solve it? The answers turn the strangest creatures into the smartest.',
  ],
};
STORIES['topic-sentences'] = {
  about: 'a paragraph about dogs that a boy wrote backward, and then the right way round',
  more: [{ serial: 'S537', after: 1, alt: 'A page with one bold sentence at the top and three sentences lined up under it' }, { serial: 'S538', after: 3, alt: 'A dog fetching a newspaper, a dog beside a wheelchair, a dog at a gate, in three small pictures' }],
  title: 'The big thing first', art: 'S536', cast: [],
  alt: 'A boy writing at a kitchen table with a golden retriever resting its head on his knee',
  words: [
    'Sam wrote a paragraph about dogs. They fetch. They guard the house. They guide people who cannot see. It was all true, and his teacher wrote one question in the margin: what is this paragraph about?',
    'Sam was annoyed. It was about dogs, obviously. But when he read it again, he saw that every sentence was a fact standing on its own. Nobody had told the reader what the facts added up to.',
    'So he wrote the big thing first. Dogs make good helpers. Then the three facts followed, and suddenly they were not three facts. They were three ways of proving one idea. The first sentence told the reader what to look for, and every sentence after it delivered.',
    'The topic sentence says the big thing first. Every sentence after it backs the big thing up. Write it that way and a reader knows where they are going from the first line, which is the whole point of a paragraph.',
  ],
};
STORIES['opinion-paragraph'] = {
  about: 'a longer recess, and the girl who turned wanting it into a case for it',
  more: [{ serial: 'S540', after: 1, alt: 'Children running on a playground, then sitting alert at desks, in two panels' }, { serial: 'S541', after: 3, alt: 'A page with an opinion line at the top, two reason lines, and a closing line at the bottom' }],
  title: 'Longer recess', art: 'S539', cast: [],
  alt: 'A girl at the front of a classroom reading from a page, classmates listening, a playground through the window',
  words: [
    'Lena wanted a longer recess, and so did everyone. When the principal visited, half the class shouted it at her. She smiled and said, tell me why, and the room went quiet. Wanting something, it turned out, was not a reason.',
    'Lena went home and tried to write why. The first draft said recess should be longer because it should. She read it back and felt her face go hot. It was the same shout, written down.',
    'The second draft had a shape. Her opinion first: recess should be longer. Then reason one: we think better after we have run. Then reason two: we get along better after we have played. Then a closing sentence that said the opinion again a new way: give us more recess and you will get better students back. The principal read it twice.',
    'An opinion paragraph is an opinion, two reasons and a closing sentence. Say what you think at the start, prove it in the middle, and say it again at the end in fresh words. That is how a wish becomes an argument.',
  ],
};
STORIES['narrative-paragraph'] = {
  about: 'the day a bird got into the house, and the girl who wrote it so a reader could see it',
  more: [{ serial: 'S543', after: 1, alt: 'The bird perched on a curtain rod, everyone in the room staring up' }, { serial: 'S544', after: 3, alt: 'Dad opening the window and the bird flying out into the light' }],
  title: 'The bird in the house', art: 'S542', cast: [],
  alt: 'A sparrow flying in circles around a hanging lamp in a living room, a family frozen below it',
  words: [
    'A sparrow flew in through the open door and the whole afternoon turned upside down. That night Ava had to write about something that happened, and she wrote: a bird got in and then it got out. Her teacher said, I was not there. Let me see it.',
    'Ava did not know what that meant. It was true. A bird got in and got out. But reading it back, she could not see the bird either, and she had been standing right under it.',
    'She wrote it again in three parts. The beginning: the door was open and a sparrow shot in like a thrown ball. The middle: it circled the lamp twice, landed on the curtain rod, and everyone in the room froze with their hands up. The end: Dad slid the window open, and after one more circle the bird found the light and was gone.',
    'A small story has a beginning, a middle and an end, and it shows what happened with words a reader can see. Not a bird got in, but a sparrow like a thrown ball. The reader was not there. Your words take them.',
  ],
};
STORIES['first-texans'] = {
  about: 'three peoples who lived in Texas first, and the three kitchens the land gave them',
  more: [{ serial: 'S546', after: 1, alt: 'A Caddo village of round grass houses beside rows of corn in the wet east' }, { serial: 'S547', after: 3, alt: 'A Comanche rider following a buffalo herd across a dry plain' }],
  title: 'Three kitchens', art: 'S545', cast: [],
  alt: 'Three scenes side by side: a Caddo cornfield in green woods, Comanche riders on open plains, Karankawa fishers on a gray coast',
  words: [
    'When Diego\'s class was asked what the first Texans ate, he said buffalo, because that was the picture in every book. His teacher put a map on the wall and asked where in Texas. Diego pointed at the whole state.',
    'Then she pointed at three places. The wet forests of the east. The dry, open plains of the north and west. The gray marshy coast. Would a buffalo hunter do well in a marsh? Would a fisher do well on a dry plain? Diego was not so sure anymore.',
    'Each people had the kitchen its land gave it. In the wet east, the Caddo farmed corn and lived in villages of grass houses. On the dry plains, the Comanche followed the buffalo on horseback and carried their homes with them. On the coast, the Karankawa fished the bays from dugout canoes. Three lands, three ways to eat.',
    'Many peoples lived in Texas long before any state existed, and the land shaped how each of them lived. Look at where a people lived and you can guess what they ate, what they built and how far they moved. The map was the first cookbook.',
  ],
};
STORIES['spanish-and-mexican-texas'] = {
  about: 'a mission bell that rang under two flags, and the door that let the settlers in',
  more: [{ serial: 'S549', after: 1, alt: 'The same mission with the flag of Mexico now flying over it' }, { serial: 'S550', after: 3, alt: 'A line of covered wagons of American settlers arriving on a Texas road' }],
  title: 'The mission bell', art: 'S548', cast: [],
  alt: 'A stone mission with a bell tower at sunrise, the Spanish flag on the pole, a few families at the gate',
  words: [
    'The bell in the old mission tower had rung every morning since the 1690s, when Spain built the church, the walls and the little farm around it. Ana\'s great-great-grandmother had heard it as a girl. The bell never changed.',
    'The flag did. In 1821, Mexico won its freedom from Spain, and one morning the bell rang under a new flag on the same pole. Ana wondered how a place could belong to one country at breakfast and another by lunch.',
    'Mexico had a problem. Texas was huge and nearly empty, and an empty land is hard to hold. So it opened the door and invited American settlers to farm it. They came, and kept coming, until they outnumbered everyone else. The bell rang over more and more faces that had never seen Spain or Mexico.',
    'Spain built missions from the 1690s. Mexico took over in 1821 and invited settlers, who soon outnumbered the Mexicans in Texas. That crowd, gathered under the same bell, is the beginning of the next chapter, when Texas asked for a flag of its own.',
  ],
};
STORIES['texas-joins-the-union'] = {
  about: 'a flag with twenty-eight stars, a bell in Galveston, and the day freedom arrived late',
  more: [{ serial: 'S552', after: 1, alt: 'A crowd in Galveston on June 19, 1865, hearing the news of freedom read aloud' }, { serial: 'S553', after: 3, alt: 'A wooden derrick at Spindletop spraying oil high into the air in 1901' }],
  title: 'The 28th star', art: 'S551', cast: [],
  alt: 'A girl holding an old United States flag with twenty-eight stars beside a modern one with fifty',
  words: [
    'Mia found an old flag in her grandfather\'s attic with twenty-eight stars on it, not fifty. He told her the twenty-eighth star was Texas. For nine years Texas had been a country of its own. Then, in 1845, it joined the United States and the flag got a new star.',
    'But the story was not a straight line. In 1861 Texas left the Union to join the Confederacy in a war over slavery. And when that war ended, freedom did not reach Texas the day it was declared. Mia asked how freedom could be late. How do you not hear news like that?',
    'The news traveled slowly, and some did not want it heard. It was June 19, 1865, when soldiers in Galveston read the order that every enslaved person in Texas was free. That day became Juneteenth, a holiday that started in Texas and now belongs to the whole country. Then in 1901, at Spindletop, oil roared out of the ground and changed Texas again.',
    'Statehood in 1845, the Confederacy in 1861, Juneteenth on June 19, 1865, and oil in 1901. Four dates, and a flag that gained a star, lost it for a while, and won it back. History is a line with bends in it.',
  ],
};
STORIES['multi-digit-multiplication'] = {
  about: 'twenty-three boxes of crayons and the boy who counted them in two pieces',
  more: [{ serial: 'S555', after: 1, alt: 'Twenty boxes in one pile and three boxes in a smaller pile beside it' }, { serial: 'S556', after: 3, alt: 'The boy writing 80 and 12 on a notepad and adding them' }],
  title: 'Twenty-three boxes', art: 'S554', cast: [],
  alt: 'A boy in an art supply room with a stack of 23 small crayon boxes, counting them into two piles',
  words: [
    'The art teacher asked Leo to count how many crayons were in the supply room. There were 23 boxes with 4 crayons in each. Leo started multiplying in his head, lost the number, and started again. Twenty-three fours is a lot to hold at once.',
    'He tried counting the crayons one at a time and got to thirty before the teacher came back. This was going to take the whole afternoon. The boxes smelled like wax and he was tired of them already.',
    'Then he broke the 23 into pieces he could handle. Twenty boxes and three boxes. Twenty boxes of four is 80 crayons. Three boxes of four is 12. And 80 plus 12 is 92. Two easy multiplications and one addition, instead of one impossible one.',
    'Every big multiplication is a small one in disguise. Break the number into tens and ones, multiply each piece, then add the pieces together. That is the whole trick, and it works for 23 times 4 and for 523 times 4 alike.',
  ],
};
STORIES['long-division'] = {
  about: 'ninety-six stickers, four friends and the sharing that went round in rounds',
  more: [{ serial: 'S558', after: 1, alt: 'Four piles of twenty stickers each, sixteen stickers left in the girl\'s hand' }, { serial: 'S559', after: 3, alt: 'Four piles of twenty-four stickers, the sheet empty' }],
  title: 'Sharing in rounds', art: 'S557', cast: [],
  alt: 'A girl at a table with a big sheet of stickers and four small piles in front of four friends',
  words: [
    'Grace had a sheet of 96 stickers and four friends waiting. She did not want to hand them out one at a time. That was 96 moves, and her friends were already bored. Nobody could see the answer in one look, either.',
    'So she tried a bigger step. Could everyone get twenty? Four twenties is eighty. Yes. She peeled off twenty for each friend and had sixteen left. Sixteen was still too many to see in one look, but it was a much smaller problem than ninety-six.',
    'Second round. Four more each uses all sixteen. Twenty and four: every friend had twenty-four, and the sheet was empty. That is long division. Share the big part first, see what is left, share that, and keep going until nothing remains or too little to share. Whatever is left at the end is the remainder.',
    'Long division looks like a tower of little steps, but every step is the same move: share what you can, bring down what is left. Check it backward, four times twenty-four is ninety-six, and you know it is right.',
  ],
};
STORIES['factors-and-multiples'] = {
  about: 'twelve chairs and every way a boy could arrange them in equal rows',
  more: [{ serial: 'S561', after: 1, alt: 'Twelve chairs in two rows of six' }, { serial: 'S562', after: 3, alt: 'A list on the board: 1, 2, 3, 4, 6, 12, with a chair drawn beside it' }],
  title: 'Twelve chairs', art: 'S560', cast: [],
  alt: 'A boy in an empty classroom arranging twelve chairs into rows, several arrangements chalked on the floor',
  words: [
    'Owen had to set out twelve chairs for the school play, in equal rows. He put them in one long row of twelve and stepped back. It looked like a bus. He tried five rows and had two chairs left over with nowhere to go.',
    'Some numbers of rows worked and some did not, and he could not tell which was which until he had dragged every chair. The floor squeaked and his arms ached. There had to be a way to know first.',
    'He wrote the ones that worked. One row of twelve. Two rows of six. Three rows of four. Four rows of three. Six of two. Twelve of one. The numbers that worked were 1, 2, 3, 4, 6 and 12, and nothing else. Those were the factors of twelve, the numbers that go into it exactly.',
    'A factor goes into a number with nothing left over. A multiple is what a number makes when you count by it: 12, 24, 36. And a number with exactly two factors, itself and one, is prime, which is why thirteen chairs only ever make a bus.',
  ],
};
STORIES['equivalent-and-decimals'] = {
  about: 'a coin called a quarter, and the girl who found three names for it',
  more: [{ serial: 'S564', after: 1, alt: 'Four quarters arranged in a circle to make one dollar' }, { serial: 'S565', after: 3, alt: 'A receipt showing 0.25 beside a drawing of one fourth of a circle' }],
  title: 'The quarter', art: 'S563', cast: [],
  alt: 'A girl holding a quarter up to the light, a dollar bill and four quarters laid out on a desk',
  words: [
    'Lena found a quarter on the sidewalk and asked her dad why it was called that. He said because it is a quarter of a dollar. But the coin said twenty-five cents on it, and the price tag at the store said 0.25. Three names for one small coin.',
    'She lined up four quarters and they made a dollar. So one quarter was one fourth of the whole. But twenty-five? And that dot in 0.25? None of it looked like a fourth. She turned the coin over as if the answer might be on the back.',
    'Her dad drew a dollar as a hundred pennies in a square. A quarter is twenty-five of them. Twenty-five out of a hundred, which you can write as a fraction or as 0.25. A decimal is just a fraction with 10 or 100 on the bottom. One fourth, twenty-five hundredths and 0.25 are the same money.',
    'Fractions and decimals are two languages for one amount. Read a decimal place by place, tenths first, then hundredths, and you can turn it into a fraction. Read a fraction with a hundred on the bottom, and the decimal writes itself.',
  ],
};
STORIES['add-fractions'] = {
  about: 'half a pizza, a quarter of a pizza and a boy who could not add them until he cut',
  more: [{ serial: 'S567', after: 1, alt: 'The half pizza cut into two quarters with a pizza wheel' }, { serial: 'S568', after: 3, alt: 'Three quarter slices lined up in one box' }],
  title: 'Half and a quarter', art: 'S566', cast: [],
  alt: 'A boy at a counter with half a pizza in one box and a quarter of a pizza in another',
  words: [
    'Two boxes came back from the party. Half a pizza in one, a quarter of a pizza in the other. Marcus wanted to know how much pizza that was altogether, and he wrote one half plus one fourth. Then he stopped. Halves and fourths did not add. They were different sizes.',
    'He tried adding the tops and the bottoms and got two sixths, which was less pizza than he had started with. That could not be right. The cheese was cold and the math was getting worse.',
    'So he cut. One slice of the pizza wheel through the half, and it became two quarters. Now every piece was a quarter. Two quarters plus one quarter is three quarters. Same bottoms, so he added the tops and kept the bottom.',
    'Fractions only add when their pieces are the same size. Same bottoms: add or subtract the tops and keep the bottom. Different bottoms: cut until they match, then add. And simplify at the end if the pieces will join back up.',
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
  about: 'two prices at a bake sale, and the boy who added them the wrong way first',
  more: [{ serial: 'S579', after: 1, alt: 'Two prices written one above the other with the decimal points lined up' }, { serial: 'S580', after: 3, alt: 'The boy handing over the right coins with a grin' }],
  title: 'Two prices', art: 'S578', cast: [],
  alt: 'A boy at a bake sale table with a cupcake priced 2.50 and a cookie priced 1.35, coins in his hand',
  words: [
    'Marcus wanted a cupcake for two dollars fifty and a cookie for one dollar thirty-five. He added the numbers the way they looked on the sign, digits pushed together, and got a total that made the girl at the table laugh. It was more than a pizza.',
    'He tried again in his head and got a different number. The line behind him was growing and his coins were sweating in his hand. Numbers with a dot in them seemed to have their own rules.',
    'The girl wrote the two prices one above the other and lined up the dots. Cents under cents, dollars under dollars. Then she added column by column, just like whole numbers, and the dot stayed where the dots were. Three dollars eighty-five.',
    'Decimals are money, and money lines up. Put the decimal points under each other, add or subtract each column, and carry the point straight down. Every other rule you know for whole numbers still works.',
  ],
};
STORIES['multiplying-fractions'] = {
  about: 'half a pizza, a hungry girl, and the slice that turned out to be a quarter',
  more: [{ serial: 'S582', after: 1, alt: 'The half pizza cut into two quarters, one lifted out' }, { serial: 'S583', after: 3, alt: 'A notebook with one half times one half written and a quarter drawn beside it' }],
  title: 'Half of a half', art: 'S581', cast: [],
  alt: 'A girl at a kitchen counter with half a pizza in a box, cutting it down the middle',
  words: [
    'There was half a pizza left in the box, and Priya was allowed half of it. She ate her share and felt cheated. It was one slice. Half of something should be big, she thought, and this was small.',
    'She tried to write what she had eaten. Half of a half. A half times a half? That gave her one over four, which was a quarter, and a quarter was smaller than either half she had started with. How could multiplying make something smaller?',
    'Because of meant multiply, and she was multiplying by a fraction. Half of a whole pizza is big. Half of half a pizza is a quarter, and the box agreed: two cuts, four pieces, one in her hand. Tops times tops, bottoms times bottoms, one over four.',
    'When you multiply by a fraction, you take a part of something, and a part is smaller. Tops times tops, bottoms times bottoms, then simplify if you can. And when a problem says of, it is telling you to multiply.',
  ],
};
STORIES['dividing-by-two-digits'] = {
  about: '288 eggs, cartons of 24, and the guess that got a boy most of the way',
  more: [{ serial: 'S585', after: 1, alt: 'Ten full cartons stacked, a smaller pile of eggs left over' }, { serial: 'S586', after: 3, alt: 'Twelve full cartons and an empty tray' }],
  title: 'Cartons of 24', art: 'S584', cast: [],
  alt: 'A boy in a barn beside a big tray of eggs, a stack of empty egg cartons, counting on his fingers',
  words: [
    'Owen had 288 eggs and cartons that held 24. His aunt wanted to know how many cartons to order. Owen started filling cartons by hand to count them and gave up around the fourth one. There had to be a faster way.',
    'Dividing by a number like 4 was easy. Dividing by 24 felt impossible. Twenty-four was too big to see how many times it fit into anything.',
    'So he guessed. Ten cartons would hold 240 eggs. That left 48. Two more cartons would hold exactly 48. Ten and two: twelve cartons. He checked it backward, twelve times twenty-four is 288, and the answer stood.',
    'Dividing by a two-digit number is guessing well. Estimate how many times the divisor fits, take that much away, bring down what is left and estimate again. Then multiply your answer back and see if it lands.',
  ],
};
STORIES['volume'] = {
  about: 'a box of sugar cubes and the girl who counted them without counting them',
  more: [{ serial: 'S588', after: 1, alt: 'One layer of cubes, four across and three deep' }, { serial: 'S589', after: 3, alt: 'The box seen from the side, two layers high' }],
  title: 'Sugar cubes', art: 'S587', cast: [],
  alt: 'A girl looking into an open box of sugar cubes packed in neat rows and layers',
  words: [
    'Lena\'s job was to count the sugar cubes in the box before the party. She lifted them out one at a time and lost count at nineteen. Then she put them back and lost count again. The cubes were sticky and the party was in an hour.',
    'Her grandmother asked how many were in one layer. Lena looked at the top: four across, three deep. Twelve. And how many layers? She looked at the side. Two. She still did not see how that helped.',
    'Twelve cubes in a layer, two layers. Twelve twice is twenty-four. She had counted the whole box in two looks. The length times the width gave one layer, and the height told her how many layers to stack.',
    'The volume of a box is length times width times height, and the reason is the sugar cubes. Picture one layer, then count the layers. Every box, tank and room is filled the same way, one layer at a time.',
  ],
};
STORIES['order-of-operations'] = {
  about: 'a math sentence that came out two different ways, and the package that settled it',
  more: [{ serial: 'S591', after: 1, alt: 'The 4 × 2 wrapped like a parcel with an 8 on its label' }, { serial: 'S592', after: 3, alt: 'The card with 11 written under it and 14 crossed out' }],
  title: 'The package', art: 'S590', cast: [],
  alt: 'A boy at a desk with 3 + 4 × 2 on a card, a small wrapped package drawn around the 4 × 2',
  words: [
    'Two friends solved 3 + 4 × 2 and got two answers. Sam added first and got fourteen. Eli multiplied first and got eleven. They argued until the teacher came over, and each was sure the other had broken something.',
    'Sam said you read left to right, like a sentence. That seemed fair. Eli said multiplying came first. That seemed like a rule someone had made up. Who decided?',
    'The teacher drew a box around the 4 × 2. Think of it as a package, she said. It arrives already wrapped. Multiplication and division are packages, so their answer, eight, is ready before any adding starts. Then add the three. Eleven. If you want to add first, you need brackets to say so.',
    'Brackets first. Then multiply and divide, left to right. Then add and subtract, left to right. It is a rule everyone agreed to so that a math sentence means one thing everywhere, and the package is how to remember it.',
  ],
};
STORIES['theme'] = {
  about: 'two friends, a fight, and the question of what the story was really about',
  more: [{ serial: 'S594', after: 1, alt: 'The same two girls laughing together at the end of the day' }, { serial: 'S595', after: 3, alt: 'A notebook with the word topic on one line and theme on the line below it' }],
  title: 'What it was really about', art: 'S593', cast: [],
  alt: 'Two girls sitting apart on a school bench after an argument, a book open between them',
  words: [
    'The reading test asked what the story was about, and Kai wrote two friends. He was proud of that answer. The story was about two friends who fought and made up. What else could it be about?',
    'His teacher marked it half right. Half. He had named exactly who was in the story. He went back and read it a third time, looking for the half he had missed, and found only the same two friends.',
    'Then she asked a different question. Not who is in it, but what does it say? The friends fought, said awful things, and were still friends by the last page. The story was saying that a real friendship can survive a fight. That was the theme, the thing the story said about life. The friends were only the topic.',
    'Every story has both. The topic is what it is about: two friends, a dog, a war. The theme is what it says about being alive, and you find it by looking at what changed by the end. Name the topic, then ask what the story wanted you to know.',
  ],
};
STORIES['point-of-view'] = {
  about: 'the same afternoon told twice, once through the eyes and once from the corner',
  more: [{ serial: 'S597', after: 1, alt: 'The storm seen through the boy\'s own eyes, his hands on the windowsill' }, { serial: 'S598', after: 3, alt: 'The same room from the corner, the boy small at the window' }],
  title: 'Two cameras', art: 'S596', cast: [],
  alt: 'A boy writing at a window as storm clouds gather, a small drawn camera on his head and another on a tripod in the corner',
  words: [
    'Ana had to write about the afternoon the storm came, and she wrote it two ways by accident. In the first draft she wrote, I saw the storm coming. In the second she wrote, she saw the storm coming. Her teacher said both were fine and they were completely different.',
    'How could the same afternoon be different depending on one word? The storm was the storm. The window was the window. Ana read both drafts aloud and could feel the difference but could not name it.',
    'Her teacher explained with cameras. When you write I, the camera is on your head. The reader sees only what you see and feels what you feel. That is first person. When you write she, the camera is on a tripod in the corner. The reader can see the whole room, including you. That is third person.',
    'I and we mean first person. He, she and they mean third person. The point of view decides what the narrator can know and what the reader gets to see, so choose the camera before you choose the words.',
  ],
};
STORIES['idioms'] = {
  about: 'a friend who said break a leg, and the boy who took her at her word',
  more: [{ serial: 'S600', after: 1, alt: 'The boy checking his own legs in alarm behind the curtain' }, { serial: 'S601', after: 3, alt: 'The boy bowing on stage to applause, both legs fine' }],
  title: 'Break a leg', art: 'S599', cast: [],
  alt: 'A boy in a school play costume backstage, wide-eyed, a girl beside him giving a thumbs up',
  words: [
    'Right before Theo went on stage for the school play, his friend Maya grabbed his arm and said, break a leg. He froze. He had known Maya since kindergarten and she had never wished him harm before.',
    'He spent the first scene worrying about his legs. Had she cursed him? Was there a loose board? By the second scene he had said all his lines without falling, and Maya was grinning at him from the wings.',
    'Afterward she explained. Break a leg means good luck in the theater. Nobody breaks anything. It is an idiom, a phrase whose meaning is not in its words at all. You cannot work it out. You learn it by meeting it, the way you learn a nickname.',
    'Raining cats and dogs. Piece of cake. Hit the hay. Every language is full of idioms, and each one means something its words do not say. When a phrase makes no sense taken literally, ask what it means to the people who use it.',
  ],
};
STORIES['text-evidence'] = {
  about: 'a claim about a scared boy, and the line on page twelve that proved it',
  more: [{ serial: 'S603', after: 1, alt: 'The page with a single line of text glowing, his hands shook' }, { serial: 'S604', after: 3, alt: 'A notebook with a claim written and a page number beside it' }],
  title: 'Point to the line', art: 'S602', cast: [],
  alt: 'A girl with a paperback open to page twelve, her finger on one line, a classmate leaning in to see',
  words: [
    'In the book club, Priya said the boy in the story was scared. Marcus said he was not, he was just tired. They argued for five minutes and got nowhere, because each was sure and neither had anything but being sure.',
    'The teacher asked one question. Where? Priya said, in the middle somewhere. Marcus said, you can just tell. The teacher waited. Being sure, it turned out, did not count.',
    'Priya opened the book and hunted. Page twelve: his hands shook as he reached for the door. There it was. Not a feeling about the boy but a line the author had written, and it showed fear more directly than any other line in the chapter. Marcus read it and gave in.',
    'A claim about a text needs a line from the text behind it. Point to the page. Pick the line that shows the claim most directly, not the one that sort of hints at it. Evidence is what turns being sure into being right.',
  ],
};
STORIES['mixtures-and-solutions'] = {
  about: 'sand in one glass, salt in the other, and the one that vanished',
  more: [{ serial: 'S606', after: 1, alt: 'The sandy water poured off, sand left in the bottom of the glass' }, { serial: 'S607', after: 3, alt: 'The boy tasting the clear water and making a salty face' }],
  title: 'Two glasses', art: 'S605', cast: [],
  alt: 'Two glasses of water on a kitchen table, one cloudy with sand settling, one clear, a boy with a spoon',
  words: [
    'Theo stirred a spoon of sand into one glass of water and a spoon of salt into the other. The sand swirled, then sank. The salt swirled, then was gone. Same spoon, same water, and one of them had disappeared.',
    'Where did the salt go? He looked from the side and from the top. Nothing. He was ready to say it had stopped existing until he took a sip and pulled a face. It was in there, all right, in every drop.',
    'The sand had made a mixture. Each part kept its own properties, and he could pour the water off and leave the sand behind. The salt had made a solution, a special mixture where one part dissolves so completely into the other that you cannot pick it out, though you can still taste it.',
    'A mixture keeps the properties of its parts and can be separated. A solution is a mixture where one part dissolves and spreads evenly through the other. Sand and salt look alike in the spoon and behave nothing alike in the glass.',
  ],
};
STORIES['earth-sun-moon'] = {
  about: 'a spinning top, a lamp and a marble, and the girl who built the sky on a kitchen table',
  more: [{ serial: 'S609', after: 1, alt: 'The top circling the lamp, half of it lit, half in shadow' }, { serial: 'S610', after: 3, alt: 'The marble circling the top in a small ring' }],
  title: 'Top, lamp, marble', art: 'S608', cast: [],
  alt: 'A girl at a kitchen table spinning a top near a glowing lamp, a marble beside the top',
  words: [
    'Ava could not keep the three things straight. A day, a month, a year. They were all just time, and the sky did not come with labels. Her dad cleared the kitchen table and turned off every light but one.',
    'He set a spinning top near the lamp. Which side of the top is lit? The side facing the lamp. Now watch the top spin. Every side gets its turn in the light and its turn in the dark. Ava said, day and night. He nodded. One spin, one day.',
    'Then he carried the spinning top in a slow circle around the lamp. One lap, one year. Then he rolled a marble in a small ring around the top. One ring, about one month, and the marble was the moon. Three motions, three clocks.',
    'The Earth spins for day and night, circles the sun for the year, and the moon circles the Earth for the month. Once you have seen it on a table, you never lose it in the sky.',
  ],
};
STORIES['inherited-and-learned'] = {
  about: 'brown eyes, a bicycle, and the question that sorted them',
  more: [{ serial: 'S612', after: 1, alt: 'The boy falling off a bike on a lawn, his father laughing kindly' }, { serial: 'S613', after: 3, alt: 'Two columns on a page: from my parents, and from practice' }],
  title: 'Eyes and wheels', art: 'S611', cast: [],
  alt: 'A boy comparing his brown eyes with his father\'s in a mirror, a bicycle leaning by the door',
  words: [
    'Diego\'s homework asked which of his traits were inherited and which were learned. He had brown eyes, like his dad. He could ride a bike, like his dad. Both came from his dad, he figured, so both were inherited.',
    'His dad laughed and asked how the bike riding had gone at first. Diego remembered. Twenty falls, two scraped knees, one bent pedal. His dad had not handed him the skill. He had handed him the bike.',
    'That was the difference. Brown eyes came from his parents before he was born, and no amount of practice could change them. That is inherited. Riding came from falling twenty times and getting up twenty-one. That is learned. The question that sorts them is simple: could this have been practiced?',
    'Inherited traits come from parents. Learned traits come from practice and experience. Every living thing has both, and the way to tell them apart is to ask whether it could have been learned at all.',
  ],
};
STORIES['informational-piece'] = {
  about: 'a school tour that a boy wrote down, one room per paragraph',
  more: [{ serial: 'S615', after: 1, alt: 'Three doors in a hallway: the gym, the library and the garden' }, { serial: 'S616', after: 3, alt: 'The boy waving goodbye at the school exit' }],
  title: 'The tour', art: 'S614', cast: [],
  alt: 'A boy leading a small group through a school entrance hall, a notebook in his hand',
  words: [
    'New families were coming to see the school, and Diego was asked to write a guide. He wrote everything he knew in one long paragraph: the gym, the library, the lunch line, the garden, the smell of the art room. His teacher read it and said she felt lost.',
    'Lost? It was all there. He had not left anything out. But when he read it back, he could not find the library either. It was buried between the lunch line and the garden with nothing to mark the door.',
    'So he wrote it like a tour. An introduction that said what the school was: the entrance. One paragraph for the gym, one for the library, one for the garden: the rooms, each with its own idea and its own details. A conclusion that invited them to visit: the exit. Now a reader could walk through it.',
    'An informational piece is a building. Introduction with the topic, a paragraph for each part, a conclusion at the end. Each paragraph holds one idea and the details that belong to it. Write it like a tour and nobody gets lost.',
  ],
};
STORIES['opinion-essay-5'] = {
  about: 'a class pet, five paragraphs, and the girl who learned where each one goes',
  more: [{ serial: 'S618', after: 1, alt: 'Three cards in the middle of the row, each with a different reason drawn on it' }, { serial: 'S619', after: 3, alt: 'The last card, the first card\'s picture repeated with a bigger smile' }],
  title: 'Five paragraphs', art: 'S617', cast: [],
  alt: 'A girl at a desk with five index cards laid out in a row, a hamster cage drawn on the first',
  words: [
    'Rosa had one paragraph about why the class should have a pet, and it was a good one. Her teacher asked for five. Rosa thought that meant saying the same thing five times, and her second paragraph was the first one in different words.',
    'By the third she had run out of ways to say it. The essay was getting longer and emptier at the same time, like a balloon. There had to be a reason for five.',
    'There was. Paragraph one: the opinion. Our class should have a pet. Paragraphs two, three and four: one reason each, with room to explain it. It teaches us to care. It calms the room. It is fun. Paragraph five: the opinion again, carried by the three reasons behind it. Five jobs, five paragraphs.',
    'An opinion essay is an introduction with the opinion, one paragraph per reason, and a conclusion that says it again with the reasons behind it. Linking words like first, also and finally carry the reader from one to the next. Five is not more of the same. It is five different jobs.',
  ],
};
STORIES['personal-narrative-5'] = {
  about: 'the Saturday the training wheels came off, told with the slow part slowed down',
  more: [{ serial: 'S621', after: 1, alt: 'The training wheels lying in the grass beside a wrench' }, { serial: 'S622', after: 3, alt: 'The boy riding away down the sidewalk, arms steady, the father watching' }],
  title: 'The moment', art: 'S620', cast: [],
  alt: 'A boy wobbling on a bike in a driveway, his father\'s hand just leaving the seat',
  words: [
    'Sam wrote about the day he learned to ride a bike in three sentences. My dad took the training wheels off. I rode. It was fun. It was all true and it took eight seconds to read, which felt wrong for the biggest day of that summer.',
    'His teacher asked which part had mattered most. The moment his dad let go, Sam said. She asked how long that moment had taken. About two seconds. And how many words had he given it? Two.',
    'He wrote it again and slowed down at the right place. First the scene: a Saturday, the driveway hot, the wheels in the grass. Then the build: the wobble, his dad running beside him, the hand on the seat. Then the moment, stretched out: the hand gone, the front wheel shaking, and the second where it stopped shaking. Then what changed: he was a rider now.',
    'A personal narrative sets the scene, builds to the moment, and says what changed. The secret is pace. Move quickly through the ordinary parts and slow right down at the moment that mattered, so the reader lives there as long as you did.',
  ],
};
STORIES['thirteen-colonies'] = {
  about: 'thirteen colonies, three rows on a map, and the girl who saw the pattern in the weather',
  more: [{ serial: 'S624', after: 1, alt: 'The northern band: rocky shore, fishing boats and small farms under a cold sky' }, { serial: 'S625', after: 3, alt: 'The southern band: wide green fields and a warm river' }],
  title: 'Three rows', art: 'S623', cast: [],
  alt: 'A girl tracing an old map of the Atlantic coast with thirteen colonies marked in three bands of color',
  words: [
    'Maya had to learn thirteen colonies for a test, and thirteen felt like a lot of names to hold. She tried a song. She tried flashcards. By Thursday she could remember nine, and never the same nine.',
    'Her grandfather looked at her map and asked what the weather was like in each place. Maya said she was studying colonies, not weather. He asked again, and she looked at where they sat along the coast.',
    'They fell into three rows. New England up top, cold and rocky, where people fished and built ships and lived in tight towns. The Middle colonies in between, with rich soil for wheat and busy ports. The South, warm and wide, with big farms along slow rivers. Settled between 1607 and 1732 by people wanting land, faith or a fresh start, and the land told each row how to live.',
    'Thirteen colonies in three regions, each with its own way of living, shaped by its own weather and soil. Learn the three rows first, and the thirteen names have somewhere to hang.',
  ],
};
STORIES['road-to-revolution'] = {
  about: 'four steps that turned tax-paying colonists into a country, told through one family\'s teapot',
  more: [{ serial: 'S627', after: 1, alt: 'Crates of tea splashing into a dark harbor at night, seen from the shore' }, { serial: 'S628', after: 3, alt: 'A crowd in a town square listening as a declaration is read aloud' }],
  title: 'Four steps to a war', art: 'S626', cast: [],
  alt: 'A colonial family at a kitchen table, a teapot pushed aside, a printed notice on the wall',
  words: [
    'Eli\'s family had a very old teapot that nobody used, and a story to go with it. In 1765 his ancestors had to pay a new tax on paper, stamps and later tea, and they had never been asked. No vote, no say, just a bill.',
    'They grumbled and paid and grumbled more. Eli wondered why grumbling turned into a war. Plenty of people pay taxes they hate. What made these people different?',
    'It happened in steps. In 1765, taxes with no vote. In 1773, colonists dumped tea into Boston Harbor rather than pay, and the teapot went on a shelf for good. In 1775, shots at Lexington. And on July 4, 1776, a declaration that governments exist to serve the people, and a people may change one that does not.',
    'Taxes without a vote, then protests, then shots, then a declaration. Each step made the next one possible, and none of them was the whole story alone. A war is rarely one event. It is a staircase, and the teapot sat on the first step.',
  ],
};
STORIES['the-constitution'] = {
  about: 'a first plan too weak to pay its own bills, and the second plan that has lasted',
  more: [{ serial: 'S630', after: 1, alt: 'A worn set of papers marked as failed, an empty money chest beside them' }, { serial: 'S631', after: 3, alt: 'Three drawn figures side by side, Congress, the President and the Courts, linked by arrows' }],
  title: 'The second plan', art: 'S629', cast: [],
  alt: 'Delegates around a long table in a candlelit hall, a stack of papers in the middle, one man standing to speak',
  words: [
    'The country\'s first plan of government, the Articles of Confederation, could not even pay its own bills. Nadia could not believe it. A whole country with no way to collect money, no way to settle fights between states, no one in charge.',
    'She asked why they did not just fix it. Her teacher said they tried, and every fix needed every state to agree, and one state always said no. The plan was so weak that even fixing it was impossible.',
    'So in 1787, fifty-five delegates met in a hot hall and wrote a second plan. It gave the country three branches: a Congress to make laws, a President to carry them out, and courts to judge them. Each branch could stop the others, so no one branch could take over. Then a Bill of Rights was added to protect what the government could never touch.',
    'The Constitution was written after the Articles failed: three branches that check each other, and a Bill of Rights added soon after. The point was never that the government would be strong. The point was that no part of it could be too strong.',
  ],
};
STORIES['growing-west'] = {
  about: 'a purchase that doubled the map, and the trails, gold and rails that filled it in',
  more: [{ serial: 'S633', after: 1, alt: 'A wagon train on a long trail across the plains toward mountains' }, { serial: 'S634', after: 3, alt: 'A steam train crossing the same plains on new rails, gold pans by the track' }],
  title: 'Doubling the map', art: 'S632', cast: [],
  alt: 'A girl unfolding a map of the young United States that grows as it opens, a wagon trail drawn across it',
  words: [
    'In 1803 the United States bought a piece of land from France for fifteen million dollars, and the country doubled in size overnight. Priya thought that sounded like a great deal. Her teacher asked what the country planned to do with all that empty space.',
    'Nothing, at first. Nobody lived there but the peoples who had always lived there, and few Americans knew what was in it. A map twice as big is not twice as useful if the new half is blank.',
    'Then the blank half filled. Trails carried wagons west through the plains. In 1848 gold turned up in California, and tens of thousands rushed to it. Railroads followed the trails, and a war with Mexico added the southwest. By 1850 the country reached the Pacific Ocean, and the map that had doubled was full to the far edge.',
    'The Louisiana Purchase doubled the country in 1803; trails, gold and war carried it to the Pacific by 1850. A country grows twice: once on paper, and once when people go and live in the lines.',
  ],
};
STORIES['civil-war'] = {
  about: 'a country that split over slavery, and the four years it took to mend',
  more: [{ serial: 'S636', after: 1, alt: 'A map of the United States torn down the middle, two colors, 1861' }, { serial: 'S637', after: 3, alt: 'A stitched map, whole again, with a new amendment pinned beside it' }],
  title: 'The split', art: 'S635', cast: [],
  alt: 'A boy holding an old letter on a farmhouse porch, a map on the wall behind him divided into two colors',
  words: [
    'In a shoebox in the attic Marcus found a letter from 1862, written by a soldier to his sister. The soldier wrote that the country had split in two and he did not know if it would ever be one again. Marcus read it three times. A country can split?',
    'It can. In 1861 eleven southern states left the Union over slavery, which they wanted to keep and expand. The rest of the country said no. Neither side would give in, and the argument became a war.',
    'The war lasted four years. In 1863 President Lincoln declared the enslaved people in the rebelling states free. In 1865 the South surrendered, six hundred thousand soldiers had died, and the 13th Amendment ended slavery everywhere in the country. The soldier\'s sister got her letter. The country got itself back, changed.',
    'A split over slavery, war from 1861 to 1865, emancipation in 1863, and an amendment that ended slavery for good. The letter in the shoebox is how history reaches a boy in an attic: one family at a time.',
  ],
};
// Middle school, in the fewest words that still make a story.
STORIES['dividing-fractions'] = {
  about: 'three pizzas, a party of hungry kids, and the division that came out bigger than it went in',
  more: [{ serial: 'S639', after: 1, alt: 'The three pizzas cut into six halves, six children reaching for them' }, { serial: 'S640', after: 3, alt: 'A notebook page with 3 ÷ 1/2 = 6 and a flipped fraction beside it' }],
  title: 'How many halves', art: 'S638', cast: [],
  alt: 'A boy at a party table with three whole pizzas in a row, each about to be cut in half',
  words: [
    'Jamal had three pizzas and a rule that everyone at the party got half a pizza. How many kids could he feed? He wrote three divided by one half and stopped, because everything he knew said dividing made numbers smaller, and the answer had to be at least three.',
    'He tried to work it the long way and got one and a half, which meant one and a half kids, which was ridiculous. The pizzas were cooling. The kids were counting.',
    'So he stopped calculating and looked at the pizzas. Each one held two halves. Three pizzas held six halves. Six kids. Dividing by a half was not making the pizzas smaller; it was counting how many halves fit inside them. And the shortcut said the same thing: flip the half into two over one and multiply. Three times two, six.',
    'To divide by a fraction, flip it and multiply. Dividing by something smaller than one gives a bigger answer, because you are counting small pieces inside a big thing. Three pizzas, six halves, six happy kids.',
  ],
};
STORIES['area-of-triangles'] = {
  about: 'a triangular garden bed and the rectangle that happened to be drawn around it',
  more: [{ serial: 'S642', after: 1, alt: 'The rectangle of string with the triangle inside, the leftover corners shaded' }, { serial: 'S643', after: 3, alt: 'A notebook with a rectangle, a diagonal, and one half written under it' }],
  title: 'Half a rectangle', art: 'S641', cast: [],
  alt: 'A girl kneeling beside a triangular garden bed, a rectangle of string pegged around it',
  words: [
    'The new garden bed was a triangle, and Priya needed its area to order soil. She knew rectangles: base times height. But a triangle had a slanted side and no rule she could remember, and the soil truck was coming Tuesday.',
    'She pegged a rectangle of string around the bed just to see it better. Base six feet, height four. The rectangle was twenty-four square feet. That was too much, but by how much?',
    'She looked at the two leftover corners of the rectangle, the parts outside the triangle. Together they made up exactly the same shape as the triangle itself. The triangle was half of the rectangle around it. Twenty-four divided by two: twelve square feet. Six bags of soil, not twelve.',
    'A parallelogram is base times height. A triangle is half of that, because every triangle is half of a rectangle drawn around it. Use only the straight-up height, never the slanted side, and the halving does the rest.',
  ],
};
STORIES['one-step-equations'] = {
  about: 'a mystery box on a balance scale, and the trick of taking the same thing off both sides',
  more: [{ serial: 'S645', after: 1, alt: 'Five weights lifted off each pan at the same time, the beam still level' }, { serial: 'S646', after: 3, alt: 'The box alone on one pan balancing seven weights' }],
  title: 'The mystery box', art: 'S644', cast: [],
  alt: 'A boy at a balance scale, a sealed box and five small weights on one pan, twelve weights on the other, level',
  words: [
    'On the science table sat a balance with a sealed box and five weights on one pan and twelve weights on the other, perfectly level. Owen\'s job was to find out how heavy the box was without opening it. He stared at it as if the answer might be written on the lid.',
    'He tried guessing. Ten? Then the box plus five would be fifteen, and the scale would tip. Six? Then eleven, and it would tip the other way. Guessing could take all afternoon.',
    'Then he did something simpler. He took five weights off the left pan and five off the right at the same time. The beam did not move. Now the box sat alone on one side and seven weights on the other. The box weighed seven. He had undone the adding by subtracting, and the balance had stayed true because he did it to both sides.',
    'An equation is a balance. Do the same thing to both sides and it stays level. Undo adding by subtracting, undo multiplying by dividing, and check by putting the answer back in. The box is x, and x was seven all along.',
  ],
};
STORIES['claims-and-reasons'] = {
  about: 'a boy who argued for a later school start, and the reason that gave way under him',
  more: [{ serial: 'S648', after: 1, alt: 'Three index cards on a podium, the middle one crossed out' }, { serial: 'S649', after: 3, alt: 'The boy at the podium holding up the two cards that held' }],
  title: 'The reason that fell', art: 'S647', cast: [],
  alt: 'A boy at a classroom podium with three index cards, one of them crossed out',
  words: [
    'Marcus had three minutes at the podium and one thing he wanted: school should start an hour later. That was his claim. He had three index cards, one reason on each, and his hands were sweating onto the top one.',
    'Card one: teenagers\' bodies are wired to fall asleep late, so early starts cut into their sleep. Card two: his cousin in Ohio starts later and likes it. Card three: students who sleep more get better grades. He read all three and sat down feeling good. Then a girl in the back raised her hand and said, "What does your cousin liking it have to do with the rest of us?" The room laughed. Marcus did not have an answer.',
    'On the walk home he worked out what had gone wrong. A claim is the thing you are trying to prove. A reason is only worth keeping if it actually holds the claim up, the way a leg holds up a table. Card one held: sleep science supports a later start for everyone. Card three held: better sleep, better grades, for everyone. Card two was about one person\'s taste. Pull on it and the claim did not move at all. He crossed it out.',
    'Every argument you will ever hear works the same way: find the claim first, then push on each reason and see whether the claim moves. The strong ones hold. The weak ones, like a cousin in Ohio, fall away, and the argument is better without them.',
  ],
};
STORIES['tone-and-mood'] = {
  about: 'the same rain described by two writers, and the girl who could feel the difference before she could name it',
  more: [{ serial: 'S651', after: 1, alt: 'A cozy page, rain drumming cheerfully on a warm roof' }, { serial: 'S652', after: 3, alt: 'A gray page, endless rain on an empty street' }],
  title: 'Two rains', art: 'S650', cast: [],
  alt: 'A girl on a window seat with two open books, rain streaking the glass behind her',
  words: [
    'Ava read two stories on the same rainy afternoon. In the first, the rain drummed happily on the roof and the family played cards. In the second, the rain would not stop and a man stared out at an empty street. Same rain. Ava felt cozy after one and trapped after the other.',
    'Her teacher asked what the difference was. Ava said the rain. But it was the same rain, falling on the same kind of day. The difference was somewhere in the words, and she could not put her finger on it.',
    'She pointed to them. Drummed happily: the first writer liked the rain, and that attitude was tone. Would not stop, empty street: those words made her feel shut in, and that feeling was mood. The writer chose the words. The words made the tone and the mood. And Ava could prove it by pointing.',
    'Tone is the writer\'s attitude. Mood is the feeling you get. Both come out of the words on the page, so when someone asks how you know, point to the words. Two rains, two feelings, and the weather had nothing to do with it.',
  ],
};
STORIES['word-roots'] = {
  about: 'one root, five long words, and the boy who stopped being afraid of vocabulary lists',
  more: [{ serial: 'S654', after: 1, alt: 'A porter carrying bags, with the word port drawn on his cap' }, { serial: 'S655', after: 3, alt: 'Arrows drawn across a map: import in, export out, transport across' }],
  title: 'The root port', art: 'S653', cast: [],
  alt: 'A boy at a library table with five long words on cards, the letters p-o-r-t glowing in every one',
  words: [
    'Marcus had five words to learn by Friday: transport, import, export, portable and porter. Five unrelated words, he thought, five separate things to memorize. He groaned and started with the first.',
    'By Wednesday he could spell them and not one of them meant anything to him. He kept mixing up import and export. They looked almost the same, and that was the problem, or so he thought.',
    'Then his tutor circled four letters in every word. Port. It meant carry. Transport: carry across. Import: carry in. Export: carry out. Portable: able to be carried. Porter: someone who carries. Five words, one meaning, and the front piece told him which way the carrying went. The list learned itself.',
    'A root you know unlocks every word built on it. When a long word looks new, look for the part you already know. Port, aqua, bio, geo, tele: a few dozen roots open thousands of doors.',
  ],
};
STORIES['central-idea'] = {
  about: 'three paragraphs about bees that were secretly doing the same job',
  more: [{ serial: 'S657', after: 1, alt: 'Three workers pulling one rope, each paragraph drawn as a worker' }, { serial: 'S658', after: 3, alt: 'The article with one sentence written above it in bold: we need bees' }],
  title: 'The same job', art: 'S656', cast: [],
  alt: 'A girl reading an article in a garden, a bee on a flower beside her, three paragraphs glowing on the page',
  words: [
    'The article had three paragraphs. One about how bees pollinate. One about bees dying. One about what farmers could do. Lena had to say what the whole thing was about, and she wrote down the first paragraph\'s fact. Bees pollinate flowers.',
    'Marked wrong. She tried the second fact. Bees are dying. Also wrong. She had read the article, she could repeat every detail in it, and she could not say what it was about. That felt unfair.',
    'Her teacher asked what all three paragraphs were doing together. Not what each said, but what job they shared. Lena read them again as a team. Bees do essential work, bees are in trouble, and here is what to do about it. All three were pulling the same rope: we need bees, and we can help them. That was the central idea.',
    'The central idea is what every paragraph is helping to say. A detail from one paragraph is never the central idea, however true it is. Ask what job the paragraphs share, and the answer is the idea holding the whole thing up.',
  ],
};
STORIES['elements-and-compounds'] = {
  about: 'letters, words, and the girl who saw the alphabet in a glass of water',
  more: [{ serial: 'S660', after: 1, alt: 'A row of single letters on tiles, each one glowing on its own' }, { serial: 'S661', after: 3, alt: 'The tiles joined into a word, water, with a drop beside it' }],
  title: 'Letters and words', art: 'S659', cast: [],
  alt: 'A girl holding a glass of water up to the window, letters H and O floating in it like alphabet pasta',
  words: [
    'Rosa\'s science homework said water was made of hydrogen and oxygen, and she found that hard to believe. Hydrogen was a gas that burned. Oxygen was a gas she breathed. Water was a drink. How could two gases add up to a drink?',
    'She read the formula, H2O, and it looked like a code. Two Hs and an O. She knew the letters but not the word, and she could not see how letters became something you could swim in.',
    'Her brother said to think of it as spelling. H is a letter, one kind of atom, an element. O is another letter, another element. H2O is a word spelled from them: two hydrogen atoms joined to one oxygen atom, and the word is a compound with properties of its own. Letters burn and breathe. The word puts out fires.',
    'An element is one kind of atom. A compound is two or more kinds joined, and it can be nothing like its parts. Read a formula the way you read a word: the letters say which elements, the small numbers say how many of each.',
  ],
};
STORIES['heat-transfer'] = {
  about: 'a pan handle, a pot of soup and a campfire, and the three roads heat took to reach one boy',
  more: [{ serial: 'S663', after: 1, alt: 'A close look at a metal pan handle glowing with heat along its length' }, { serial: 'S664', after: 3, alt: 'Soup swirling in a pot, hot broth rising in the middle and sinking at the sides' }],
  title: 'Three ways', art: 'S662', cast: [],
  alt: 'A boy at a campfire with a pan on the flames, a pot of soup bubbling beside it, his face lit by the fire',
  words: [
    'At the campsite, Diego burned his hand on a pan handle that had never touched the flame. Then he watched the soup stir itself. Then he felt the fire warm his face from six feet away with nothing in between. Heat seemed to go wherever it wanted.',
    'He asked his aunt how the handle got hot when only the pan was in the fire. She asked him to think about the three things he had just noticed, and whether they were really the same trick.',
    'They were three tricks. The handle was conduction: heat passing by touch through the metal, atom to atom, up to his hand. The soup was convection: hot broth rose, cooled at the top, sank at the sides, and carried heat around in a loop. His face was radiation: heat crossing the empty air as rays, the way sunlight crosses space.',
    'Heat always moves from warmer to cooler, and it has three roads. Conduction by touch, convection by a moving liquid or gas, radiation by rays that need nothing to travel through. One campfire shows all three in a minute.',
  ],
};
STORIES['plate-tectonics'] = {
  about: 'two rugs on a living room floor, and the whole surface of the Earth',
  more: [{ serial: 'S666', after: 1, alt: 'The two rugs pulled apart, bare floor showing in the gap' }, { serial: 'S667', after: 3, alt: 'The rugs sliding past each other, one catching and jerking' }],
  title: 'Two rugs', art: 'S665', cast: [],
  alt: 'A boy on a living room floor pushing two thick rugs together so they buckle into a ridge',
  words: [
    'Kai\'s teacher said mountains were made by the ground moving, and Kai laughed. The ground did not move. He had stood on it his whole life and it had never gone anywhere.',
    'That night he pushed two rugs together on the living room floor and they buckled into a ridge. He pulled them apart and the bare floor showed in the gap. He slid them past each other and they caught, then jerked. He sat back on his heels and stopped laughing.',
    'The Earth\'s outer shell is not one piece. It is plates, like rugs, floating on hot rock and moving a few centimeters a year. Push two together and they buckle: mountains. Pull them apart and new floor rises into the gap: a rift, or the middle of an ocean. Slide them past each other and they catch and jerk: an earthquake.',
    'The Earth\'s shell is plates that move. Pushing together makes mountains, pulling apart makes new floor, sliding past makes earthquakes. The ground does move. It just moves slower than a boy on a rug can feel.',
  ],
};
STORIES['ecosystems'] = {
  about: 'grass, a grasshopper, a bird and a hawk, and the sunlight that traveled through all of them',
  more: [{ serial: 'S669', after: 1, alt: 'Sunlight falling on grass, the grass glowing faintly green' }, { serial: 'S670', after: 3, alt: 'Mushrooms and fungi on a fallen log at the edge of the meadow' }],
  title: 'Follow the energy', art: 'S668', cast: [],
  alt: 'A girl in a meadow watching a grasshopper on a blade of grass, a bird on a fence and a hawk circling above',
  words: [
    'Maya watched a hawk circle a meadow and wondered what a hawk was made of. Birds, she supposed. And birds were made of grasshoppers. And grasshoppers were made of grass. So was a hawk made of grass? That felt wrong and right at the same time.',
    'She followed it back one more step. What was grass made of? Dirt? Water? She dug up a blade and it did not look like dirt at all. Something else had built it.',
    'Sunlight had. Grass catches light and makes food from it, which makes grass a producer. The grasshopper eats the grass, the bird eats the grasshopper, the hawk eats the bird, and every one of them is a consumer, passing the sun\'s energy up the line. When the bird dies, fungi and bacteria break it down and return it to the soil: the decomposers. Then the grass grows again.',
    'Producers make food, consumers eat, decomposers break things down. Energy flows from the sun through everything alive, one link at a time, and nothing is wasted. A hawk really is made of sunlight, with several stops along the way.',
  ],
};
STORIES['density'] = {
  about: 'two boxes the same size, one of feathers and one of rocks, and the question of which one sinks',
  more: [{ serial: 'S672', after: 1, alt: 'The rock box sinking below the surface while the feather box floats' }, { serial: 'S673', after: 3, alt: 'A notebook with a fraction drawn: mass on top, volume on the bottom' }],
  title: 'Feathers and rocks', art: 'S671', cast: [],
  alt: 'A boy on a dock holding two identical boxes over the water, one labeled by a drawn feather, one by a drawn rock',
  words: [
    'Theo had two boxes exactly the same size. One was packed with feathers and one with rocks. His cousin bet him that size was what made things sink, and that two boxes the same size would do the same thing in the water.',
    'Theo was not sure. The boxes were the same size, that was true. But one of them made his arms ache and the other felt empty. Could the water tell the difference?',
    'He dropped them in. The feather box floated. The rock box sank straight down. Same space, different mass. The rock box was denser: more stuff packed into the same volume. Water has its own density, and anything denser than water goes under, whatever its size.',
    'Density is mass divided by volume. Denser than water sinks; less dense floats, and size has nothing to do with it. A steel ship floats because its whole hull, air and all, is less dense than the water it pushes aside.',
  ],
};
STORIES['argument-with-evidence'] = {
  about: 'a school that needed more water fountains, and the numbers that finally made anyone listen',
  more: [{ serial: 'S675', after: 1, alt: 'A nurse\'s log book open on a desk, a column of tally marks' }, { serial: 'S676', after: 3, alt: 'The boy presenting a chart to a principal who is nodding' }],
  title: 'Show the numbers', art: 'S674', cast: [],
  alt: 'A boy at a school water fountain with a clipboard, a line of thirsty students behind him',
  words: [
    'Diego\'s school had two water fountains for six hundred students, and he wanted more. He wrote to the principal: we need more fountains because students get thirsty. The principal wrote back: everyone gets thirsty. Nothing changed.',
    'Diego was angry. His reason was true. Students did get thirsty. But true was not the same as convincing, and he did not know what was missing.',
    'His science teacher asked one question. How do you know? Diego went to the nurse. She had logged forty headaches last month, most in the afternoon, most from students who had not had water since lunch. He wrote it again: claim, reason, and now evidence, the nurse\'s forty. The principal ordered two fountains.',
    'An argument is a claim, reasons, and evidence for each reason. A reason without evidence is only a feeling, however true it happens to be. Show the numbers, and a feeling becomes a case.',
  ],
};
STORIES['compare-and-contrast'] = {
  about: 'two river towns side by side, and what one bridge revealed',
  more: [{ serial: 'S678', after: 1, alt: 'A market square in the first town, busy with stalls' }, { serial: 'S679', after: 3, alt: 'A ferry crossing the river toward the second town' }],
  title: 'Two towns', art: 'S677', cast: [],
  alt: 'A girl standing on a riverbank between two small towns, a bridge on one side and a ferry on the other',
  words: [
    'Rosa\'s assignment was to compare two towns on the same river. She wrote that both had a market and both sat on the water. Then she ran out of things to say. They were the same, and the same is boring to write about.',
    'Her father asked how she got from one to the other. The first town had a bridge. The second had a ferry that ran twice a day. Rosa wrote that down as a difference and still could not see why anyone would care.',
    'Then she thought about what the difference did. The bridge town had a market every day, because farmers could cross whenever they liked. The ferry town had a market twice a week, when the ferry ran. The alike part set up the question. The different part answered it. And what it showed was that a river crossing shapes a whole town\'s week.',
    'Compare by saying how things are alike, how they differ, and what the difference shows. The first two are lists. The third is the point, and it is the only part a reader remembers.',
  ],
};
STORIES['narrative-with-dialogue'] = {
  about: 'two lines of talk that told a reader more than a page of description',
  more: [{ serial: 'S681', after: 1, alt: 'A page of description crossed out, two short lines of dialogue written beneath it' }, { serial: 'S682', after: 3, alt: 'The two characters seen close up, one annoyed, one sheepish' }],
  title: 'Let them talk', art: 'S680', cast: [],
  alt: 'A girl and a boy at a bus stop, speech bubbles between them, the bus pulling away in the background',
  words: [
    'Kai wrote a whole page describing his two characters. She was strict and always on time. He was easygoing and always late. His teacher read it and said she did not believe either of them yet.',
    'Not believe them? He had explained exactly what they were like. But explaining, it turned out, was the problem. The reader was being told, and readers do not trust being told.',
    'He cut the page and let them talk. "You\'re late," she said. "The bus was early," he said. Two lines, and a reader knew them both: her sharpness, his shrug. The dialogue also moved the story, because now they had somewhere to be and a problem getting there. Quotation marks around the words, a comma before the tag, and the characters did the rest.',
    'Dialogue moves the story and shows character faster than description ever can. Put quotation marks around the spoken words, a comma before the tag, and let people reveal themselves by what they say.',
  ],
};
STORIES['maps-and-hemispheres'] = {
  about: 'an orange with lines drawn on it, and the girl who finally understood where she was',
  more: [{ serial: 'S684', after: 1, alt: 'The orange with rings drawn around it from the middle, like belts' }, { serial: 'S685', after: 3, alt: 'The orange with lines from top to bottom, like segments of a peel' }],
  title: 'The orange globe', art: 'S683', cast: [],
  alt: 'A girl drawing rings and segments on an orange with a marker at a kitchen table',
  words: [
    'Maya\'s homework asked for the latitude and longitude of her town, and both numbers meant nothing to her. Lines on a globe. Why did a round world need lines at all, and why two kinds?',
    'Her grandmother handed her an orange and a marker. Draw a belt around the middle, she said. Maya did. That was the equator. Now draw more belts above it and below it. Those were latitude, and they told you how far north or south you stood.',
    'Then lines from the top to the bottom, like the segments of a peel. Those were longitude, counted east or west from one line everyone had agreed on. Where a belt crossed a segment, you had one spot on the orange, and one spot on the Earth. Seven continents and five oceans sat somewhere on that grid, and so did Maya\'s town.',
    'Latitude measures north or south of the equator; longitude measures east or west of the prime meridian. Two numbers name any place on the planet. The world has seven continents and five oceans, and every one of them has an address.',
  ],
};
STORIES['what-culture-is'] = {
  about: 'everything a newcomer would have to be taught, and how long the list turned out to be',
  more: [{ serial: 'S687', after: 1, alt: 'A lunch table with dishes from many kitchens' }, { serial: 'S688', after: 3, alt: 'A calendar page with holidays circled in different colors' }],
  title: 'What we would have to teach', art: 'S686', cast: [],
  alt: 'A boy at a whiteboard filling a long list, a new student watching with a friendly, puzzled face',
  words: [
    'A new student was coming from another country, and Theo\'s class was asked to list what she would need to know. Theo thought it would be a short list. The classroom rules. Where the bathroom was. Done.',
    'Then the list started growing. The words for things. What to eat and how to eat it. Which holidays the school kept. What was polite and what was rude. How close to stand, when to shake hands, what everyone already knew without being told. By the end it filled the board and spilled onto the next one.',
    'That whole board was culture: the way of life a group shares. Language, religion, customs, food, arts and government, and the thousand small habits underneath them. Theo had never seen his own culture because he had never had to explain it. The list was the first time it had stood still long enough to look at.',
    'Culture is the way of life a group shares, and it travels: with people who move, with food, with music, with words. Everyone has one, and the quickest way to see yours is to imagine teaching it to someone who was not born into it.',
  ],
};
STORIES['kinds-of-government'] = {
  about: 'a family fight over the remote, and the five ways a country decides who decides',
  more: [{ serial: 'S690', after: 1, alt: 'One person alone holding the remote, everyone else watching' }, { serial: 'S691', after: 3, alt: 'The whole family raising hands to vote on a show' }],
  title: 'The remote', art: 'S689', cast: [],
  alt: 'A family on a couch, one child holding the television remote high while everyone else reaches for it',
  words: [
    'In Nadia\'s house the remote was power. Whoever held it decided what everyone watched. On Monday her older brother kept it all night. On Tuesday her parents took it back. On Wednesday there was a vote. Nadia thought it was just a family. Her civics teacher said it was a whole unit.',
    'How could a remote be a government? Nadia laughed. Then the teacher asked one question about every government they had studied, and it was the same question. Who decides?',
    'One person holds the remote for life because of who their parents were: a monarchy. One person grabs it and will not let go: a dictatorship. A small circle passes it among themselves: an oligarchy. Religious leaders decide what is watched: a theocracy. Everyone votes on the channel: a democracy. Five governments, one remote.',
    'Governments differ by who decides: the people, a monarch, one dictator, a small group or religious leaders. The rest of the differences follow from that one answer, and the question works on any country and any couch.',
  ],
};
STORIES['kinds-of-economies'] = {
  about: 'who decides what gets made, from a grandmother\'s loom to a shopping mall',
  more: [{ serial: 'S693', after: 1, alt: 'A grandmother weaving at a loom in a village, the same cloth her mother wove' }, { serial: 'S694', after: 3, alt: 'A busy market where buyers and sellers bargain over prices' }],
  title: 'Who decides', art: 'S692', cast: [],
  alt: 'A girl on a busy market street with three shops in a row, a traditional loom, a government office and a bustling stall',
  words: [
    'Rosa\'s grandmother wove the same cloth her mother had woven, because that was what her village had always made. Rosa\'s uncle lived in a country where the government told factories what to build each year. Rosa lived where shops sold whatever people would buy. Three families, three worlds. Which one was right?',
    'Rosa could not decide, and her teacher said that was the point. None of them was simply right. Each one was an answer to one question, and it was the same question every time.',
    'Who decides what gets made? In a traditional economy, custom and the elders decide. In a command economy, the government decides. In a market economy, buyers and sellers decide by what they buy and sell. Most real countries mix them, and the size of an economy is measured by GDP per person: everything made in a year, shared out across everyone living there.',
    'Economies differ by who decides: custom, the government, the market, or a mix. GDP per person is GDP divided by the population, and it tells you how much economy each person has to live on. The loom, the office and the mall are three answers to one question.',
  ],
};
STORIES['people-on-the-move'] = {
  about: 'a family that left one place for another, and the two forces that did the moving',
  more: [{ serial: 'S696', after: 1, alt: 'A closed factory gate in a quiet town, a sign hanging crooked' }, { serial: 'S697', after: 3, alt: 'A crowded city street with lit shop windows and people everywhere' }],
  title: 'Push and pull', art: 'S695', cast: [],
  alt: 'A family with suitcases on a train platform, a small dry town behind them and a tall city ahead',
  words: [
    'When Jamal was seven his family moved from a small town to a huge city, and for years he blamed his parents for it. He had liked the town. Nobody had asked him. Then in sixth grade he had to write about why people move, and he asked his mother.',
    'There was no work in the town, she said. The factory had closed. And there was a job in the city. Jamal had assumed it was one decision, but it was two forces, and both of them had been stronger than his liking the town.',
    'Geographers call them push and pull. Push factors drive people out of a place: no work, war, drought, floods. Pull factors draw them somewhere else: jobs, safety, family, land. And where people end up gets crowded: population density is people divided by area, and water, food and work decide it. The city was dense because it pulled.',
    'People move away from what pushes and toward what pulls. Population density is how many people share each square mile, and it follows water, food and work. Every family that ever moved was pushed by something and pulled by something else.',
  ],
};
STORIES['world-regions-today'] = {
  about: 'a neighborhood on a bigger map, and what makes strangers into neighbors',
  more: [{ serial: 'S699', after: 1, alt: 'A coastline with several countries along it, all colored the same blue' }, { serial: 'S700', after: 3, alt: 'A mountain range crossing several borders, drawn as one shaded band' }],
  title: 'The neighborhood on the map', art: 'S698', cast: [],
  alt: 'A boy tracing a region on a large world map with his finger, countries inside it sharing one color',
  words: [
    'The test asked Marcus to name the regions of Africa, and he could not see any. A region was not a country. It had no flag, no border he could find on the map. How could he name something that was not there?',
    'His teacher asked him to think about his own neighborhood. It had no border either. Nobody had drawn a line around it. But everyone in it knew where it started and stopped. What made it a neighborhood?',
    'The neighbors shared something. The same street, the same school, the same corner store. A region is a neighborhood on a bigger map, and its neighbors share something too: a landform, a climate, a language or a history. The countries along one coast are a region. The countries across one desert are another. The shared thing draws the line.',
    'A region is a place that shares a landform, a climate, a language or a history, and every continent is made of them. Find what the places share, and the region draws itself.',
  ],
};
STORIES['proportions'] = {
  about: 'three pens for sixty cents, and the boy who could not price five until he priced one',
  more: [{ serial: 'S702', after: 1, alt: 'One pen alone on the counter with two dimes beside it' }, { serial: 'S703', after: 3, alt: 'Five pens lined up with a dollar bill under them' }],
  title: 'The price of one', art: 'S701', cast: [],
  alt: 'A boy at a school store counter holding three pens, a sign showing sixty cents, five pens waiting on the shelf',
  words: [
    'The school store sold three pens for sixty cents, and Marcus wanted five. He tried to work it out in line and got a different answer every time. Sixty for three, so five would be, what, a dollar twenty? Ninety? The cashier waited.',
    'He had the price of three and needed the price of five, and five was not three times anything easy. That was the snag. He was trying to jump straight from three to five.',
    'So he stopped at one. Sixty cents for three pens means twenty cents for one pen. Now five pens was easy: five times twenty, a dollar. He handed it over. And to check, he cross-multiplied: three over sixty equals five over a hundred, since three times a hundred is sixty times five.',
    'In any proportion, find what one unit is worth, then multiply by however many you need. Cross-multiply to check. The price of one is the key that opens the price of anything.',
  ],
};
STORIES['integers'] = {
  about: 'five dollars in a jar, three owed to a sister, and the debt that was forgiven',
  more: [{ serial: 'S705', after: 1, alt: 'A number line from minus five to ten with a jar drawn at five and a marker at two' }, { serial: 'S706', after: 3, alt: 'The note torn in half and the marker moved to eight' }],
  title: 'The debt', art: 'S704', cast: [],
  alt: 'A girl holding a jar with five dollars in it, a note reading three owed pinned beside it, her sister in the doorway',
  words: [
    'Nadia had five dollars in her jar and owed her sister three. So how much did she really have? Five, said her hands. Two, said her conscience. Owing money was like having less than nothing in that spot, and she did not know how to write that.',
    'She tried writing five and three side by side and staring at them. The owing part would not sit still. It was a minus, somehow, and minuses were supposed to make things smaller.',
    'Then her sister forgave the debt. Nadia did not gain three dollars, but she was three dollars better off, because a minus three had been taken away. Five minus negative three is eight. On a number line, taking away a negative moves you right. Adding a negative moves you left. When a plus and a minus meet, the bigger one wins and keeps its sign.',
    'Adding a negative moves left; subtracting a negative moves right. When a negative and a positive meet, the difference takes the sign of the larger. Money owed is the number line with feelings, and forgiveness is subtracting a negative.',
  ],
};
STORIES['two-step-equations'] = {
  about: 'socks, shoes and the order you take them off, and the boy who used it on an equation',
  more: [{ serial: 'S708', after: 1, alt: 'The equation 2x + 3 = 11 with the plus 3 circled as the last thing done' }, { serial: 'S709', after: 3, alt: 'The steps peeled back: 2x = 8, then x = 4' }],
  title: 'Shoes then socks', art: 'S707', cast: [],
  alt: 'A boy in a hallway pulling off shoes before socks, an equation drawn faintly on the wall behind him',
  words: [
    'Two x plus three equals eleven. Diego wanted to divide by two first, because the two came first, and got a mess with fractions in it. He tried subtracting three from just one side and the equation stopped being true. He put his pencil down.',
    'The problem had two steps hiding in it, and he did not know which to undo first. Undoing in the wrong order was like taking off socks before shoes.',
    'That was the trick. Whatever was done to x last is undone first. Someone had multiplied x by two, then added three. The plus three came last, so it went first: subtract three from both sides, and two x equals eight. Then undo the multiplying: divide both sides by two, and x is four. Two fours plus three is eleven. Shoes off, then socks.',
    'Undo the steps in reverse order: the last thing done to x is the first thing you undo, and you do it to both sides. Then put the answer back in and check. Any equation with two steps is just shoes and socks.',
  ],
};
STORIES['circles'] = {
  about: 'a string wrapped around a can, and the number that was hiding in every circle',
  more: [{ serial: 'S711', after: 1, alt: 'The string laid straight next to three cans and a little extra' }, { serial: 'S712', after: 3, alt: 'A circle with its diameter drawn across and its radius drawn from the center' }],
  title: 'The string and the can', art: 'S710', cast: [],
  alt: 'A girl wrapping a string around a soup can, then laying the string flat beside three cans in a row',
  words: [
    'Lena needed the distance around a soup can for a label, and a ruler would not bend. She wrapped a string around it, marked where it met, and laid the string flat. Then she wondered how many cans across the string was.',
    'She lined up cans. Three cans across, and a little bit more. She tried a mug. Three mugs across, and a little bit more. A plate. Three plates, and the same little bit. The little bit would not go away.',
    'It never does. The distance around any circle is about three and a bit times the distance across it, and the bit is always the same: 3.14, called pi. So circumference is 3.14 times the diameter. And the space inside, the area, is 3.14 times the radius times the radius. Lena cut her label to length.',
    'Circumference is 3.14 times the diameter. Area is 3.14 times the radius squared. Every circle carries the same hidden number, and a string around a can is where most people meet it.',
  ],
};
STORIES['authors-purpose'] = {
  about: 'three pages from the same newspaper, and the shape that told a girl what each one wanted',
  more: [{ serial: 'S714', after: 1, alt: 'A weather report page, all numbers and dates, next to an advertisement with bold words' }, { serial: 'S715', after: 3, alt: 'A comic strip panel with a small plot, the girl laughing' }],
  title: 'Three pages', art: 'S713', cast: [],
  alt: 'A girl at a breakfast table with a newspaper spread open to a weather report, an advertisement and a comic strip',
  words: [
    'Nadia read three pages of the Sunday paper in a row. A weather report. An advertisement for a mattress. A comic strip. Her teacher asked what each writer wanted from her, and Nadia said, to be read. That was true and useless.',
    'She looked again for what else they might want. The pages felt different in her hands, but she could not say how, and the words on each were just words.',
    'Then she noticed the shape. The weather report was facts and dates, laid out to be checked: it wanted to inform. The advertisement was full of should, must and best: it wanted to persuade. The comic had a setup and a punch line: it wanted to entertain. Three pages, three purposes, and each shape told her which.',
    'Inform, persuade or entertain. The shape of the writing tells you which, and the purpose tells you how to read it: check the facts, doubt the pitch, enjoy the story. Ask what the writer wants before you decide what to believe.',
  ],
};
STORIES['evidence-quality'] = {
  about: 'one friend who swore by a vitamin, and the ten thousand people who did not',
  more: [{ serial: 'S717', after: 1, alt: 'The friend, hand on heart, telling his one story' }, { serial: 'S718', after: 3, alt: 'A page of a study with a bar chart of ten thousand people' }],
  title: 'One story against ten thousand', art: 'S716', cast: [],
  alt: 'A boy in a pharmacy aisle holding a bottle of vitamins, a friend talking beside him, a thick study printed on a shelf tag',
  words: [
    'Marcus\'s friend swore a vitamin had cured his colds. Every winter, not one cold. Marcus was ready to spend his allowance on a bottle, because his friend was honest and the story was true.',
    'Then he found a study of ten thousand people that said the vitamin did nothing for colds. Now he had two true things that disagreed. His friend was not lying. Neither was the study. How could both be true?',
    'They could, because they were different kinds of evidence. His friend was one story: one person, one winter, no way to check what else changed. The study was many cases from a checkable source, counted and compared. One honest story is a start. Ten thousand counted cases are evidence. He kept his allowance.',
    'Many cases from a checkable source beat one story or a feeling, however sincere. Weak evidence does not make a claim false, but it does not make it true either. Ask how many, and who counted.',
  ],
};
STORIES['connotation'] = {
  about: 'three words that weighed the same on a scale and felt nothing alike',
  more: [{ serial: 'S720', after: 1, alt: 'Three words on a kitchen scale, all the same weight' }, { serial: 'S721', after: 3, alt: 'The same word said as a compliment and as an insult, two faces' }],
  title: 'Slim, thin, skinny', art: 'S719', cast: [],
  alt: 'A girl in a clothing store with three price tags reading three different words, a friend beside her frowning at one',
  words: [
    'Rosa called her friend skinny and her friend went quiet for the rest of the walk home. Rosa had meant it kindly. Skinny meant thin, and thin meant slim, and slim was a compliment. Where had it gone wrong?',
    'She lined the words up. Slim. Thin. Skinny. On a scale they meant the same thing. She would have sworn they were interchangeable.',
    'They were not, because words carry more than their meaning. Slim comes with approval. Thin is plain. Skinny carries a little worry, or a little scorn. That extra weight is connotation, the feeling a word carries beyond what it says. Swap a word for a plainer one, and notice what disappears. That is the connotation.',
    'Connotation is the feeling a word carries beyond its meaning. Writers choose it on purpose, and readers feel it whether they notice or not. Rosa apologized the next day, with a better word.',
  ],
};
STORIES['character-motive'] = {
  about: 'a girl in a novel who lied to her brother, and the reader who worked out why',
  more: [{ serial: 'S723', after: 1, alt: 'The girl in the story turning away from her brother with a folded paper behind her back' }, { serial: 'S724', after: 3, alt: 'A notebook page with two headings: wants and fears' }],
  title: 'What she wanted and what she feared', art: 'S722', cast: [],
  alt: 'A boy reading a novel in a library, a drawn figure of a girl beside him with two thought bubbles, one bright and one dark',
  words: [
    'In the novel, the girl lied to her brother about the letter from the bank. Kai stopped reading. She had been honest for two hundred pages. Why now? The author never said, and Kai wanted to close the book.',
    'His teacher asked him to look not at what the girl said but at what she did under pressure. She hid the letter. She took a second job. She stopped sleeping.',
    'Kai wrote two columns. What she wanted: her brother\'s respect. What she feared: losing the house. The lie sat right where those two met. She could not tell him without losing the first, and she could not let him find out without the second coming true. Nobody had told Kai her motive. Her actions had.',
    'Motive is what a character wants or fears, and it is shown by what they do, especially under pressure. Predict a character by their motive, not by their last line of dialogue, and the book stops surprising you for the wrong reasons.',
  ],
};
STORIES['body-systems'] = {
  about: 'a bite of an apple, and the whole city inside that had to work together to use it',
  more: [{ serial: 'S726', after: 1, alt: 'The city map: roads for blood vessels, a kitchen for the stomach, a power plant for the lungs' }, { serial: 'S727', after: 3, alt: 'Trucks on the roads carrying supplies from the kitchen to every building' }],
  title: 'The city inside', art: 'S725', cast: [],
  alt: 'A boy biting an apple, a faint drawing of a city map with roads and buildings glowing over his chest',
  words: [
    'Jamal bit into an apple and thought nothing of it. His science teacher asked him to think of everything. What had to happen for one bite to become part of his body?',
    'He said, you swallow it. She waited. He said, then it goes to your stomach. She was still waiting, and Jamal realized he did not actually know what happened next.',
    'Think of a city. The stomach and intestines are the kitchen, breaking the bite into pieces the body can use. The heart and blood vessels are the roads and trucks, carrying those pieces to every building. The lungs are the air supply. The brain and nerves are the phone lines running it all. Every system is a team of organs with one main job, and one bite needs all of them.',
    'Each body system is a team of organs with one job, and the systems depend on each other. One bite of an apple is a delivery to a whole city, and the city works only because no system works alone.',
  ],
};
STORIES['weather-systems'] = {
  about: 'air that piles up and slides like water on a slope, and the girl who saw the wind before it arrived',
  more: [{ serial: 'S729', after: 1, alt: 'Cool heavy air drawn as a hill of blue, warm air as a valley of red' }, { serial: 'S730', after: 3, alt: 'Two air masses meeting along a line of tall clouds' }],
  title: 'The slope of the air', art: 'S728', cast: [],
  alt: 'A girl on a hilltop watching a wall of clouds approach, her hair blowing toward the storm',
  words: [
    'From the hilltop Priya watched a line of clouds come across the valley, and felt the wind pick up before they arrived. Her uncle said the wind was blowing toward the storm. That seemed backward. Should the storm not push the wind ahead of it?',
    'She could not see air, so she could not see what was pushing what. All she had was the feeling on her face and a line of clouds getting closer.',
    'Her uncle told her to think of air as water on a slope. Cool air is heavy and piles up: high pressure. Warm air is light and rises: low pressure. The heavy air slides toward the light, and that sliding is wind. The storm was a place where warm air was rising, so the wind ran toward it. And the line of clouds was a front, where two air masses met and one shoved the other up.',
    'Warm air rises and cool air sinks; wind blows from high pressure to low. A front is where two air masses meet, and that is where the weather happens. Feel the wind on a hill and you can read the sky.',
  ],
};
STORIES['natural-selection'] = {
  about: 'pale moths on a tree that turned sooty, and the color change that no moth ever made',
  more: [{ serial: 'S732', after: 1, alt: 'A bird plucking a pale moth from a dark trunk' }, { serial: 'S733', after: 3, alt: 'A row of dark moths on the trunk a few years later, one pale one left' }],
  title: 'The moths', art: 'S731', cast: [],
  alt: 'A boy looking at moths on a soot-darkened tree trunk, one pale moth easy to spot, dark ones almost invisible',
  words: [
    'Theo read that the moths near an old factory town had turned dark over a hundred years, and he pictured moths going darker the way skin tans. His teacher said no moth had ever changed color in its life. Theo said then how did they turn dark?',
    'She showed him a photo of a tree trunk gone black with soot, and a pale moth sitting on it like a light on a hill. Birds eat moths. Which one would a bird see first?',
    'The pale one. On sooty trees, pale moths were easy to see and got eaten. Dark moths hid and lived, and they had dark children, because color is inherited. Year after year, more dark moths, fewer pale. Nobody changed. The group changed, because the ones who fit the place had the most children.',
    'Natural selection needs three things: variation, survival and inheritance. Helpful differences get passed on more, and over generations the group shifts to fit its place. No moth turned dark. The forest chose which moths would have children.',
  ],
};
STORIES['energy-in-ecosystems'] = {
  about: 'a thousand blades of grass and one hawk, and the tenth that leaks away at every step',
  more: [{ serial: 'S735', after: 1, alt: 'Buckets of water passed up a hill, most of the water spilling' }, { serial: 'S736', after: 3, alt: 'A single hawk circling over a field full of grass' }],
  title: 'The pyramid', art: 'S734', cast: [],
  alt: 'A girl in a meadow drawing a pyramid in a notebook: a wide base of grass, then grasshoppers, then birds, then one hawk',
  words: [
    'Maya wondered why the field had thousands of blades of grass, hundreds of grasshoppers, a few dozen birds and one hawk. If hawks were the strongest, why were there not more of them?',
    'She counted energy instead of animals. Say the grass held a thousand units of energy from the sun. How much reached the grasshoppers that ate it? She assumed most of it. That turned out to be the mistake.',
    'Only about a tenth. A grasshopper spends most of what it eats on moving, breathing and staying warm, and only a tenth becomes grasshopper. A thousand units of grass make a hundred units of grasshopper, ten of bird, one of hawk. The energy leaks away at every step, so each level has to be much bigger than the one above it.',
    'Only about a tenth of the energy passes to the next level of a food chain. That is why there is much more grass than there are hawks, and why the pyramid of life is always wide at the bottom.',
  ],
};
STORIES['summary-and-response'] = {
  about: 'a summary that gave nothing away, and the response that finally got to say something',
  more: [{ serial: 'S738', after: 1, alt: 'A page split by a line: a calm summary above, an opinionated response below' }, { serial: 'S739', after: 3, alt: 'A reader nodding at the summary with no idea what the writer thinks' }],
  title: 'The summary that gave nothing away', art: 'S737', cast: [],
  alt: 'A boy writing at a desk with an article beside him, one paragraph neat and plain, a second one full of underlines',
  words: [
    'Diego\'s summary of the article was one sentence long and it was mostly his opinion. The article says cities should plant more trees, which is obviously right. His teacher crossed out the last four words and wrote: not yet.',
    'Not yet? Diego thought summarizing was about what he thought of the thing. Otherwise what was the point of reading it?',
    'The point came in two parts. First, the summary: the article says cities should plant more trees, for shade and cleaner air, and it gives three cities as examples. Nothing about what Diego thought. A reader could not guess his opinion, and that was the test. Then the response, where he finally got to say obviously right, and why.',
    'Summarize fairly first, then respond. Keep your opinion out of the summary so a reader can trust it, and then spend the response on what you think and what you would push back on. Two jobs, two paragraphs.',
  ],
};
STORIES['argument-with-a-counterclaim'] = {
  about: 'the objection a girl was afraid to say out loud, and what happened when she said it first',
  more: [{ serial: 'S741', after: 1, alt: 'The coach\'s objection written on a card: it would cut practice time' }, { serial: 'S742', after: 3, alt: 'The girl\'s answer on the next card: practice can shift, and rested players play better' }],
  title: 'The objection said out loud', art: 'S740', cast: [],
  alt: 'A girl at a microphone in a school gym, a coach in the front row with folded arms, a sentence beginning Some say on her page',
  words: [
    'Priya was arguing for a later school start, and she knew exactly what the coach would say: it would cut practice time. She planned to leave that out and hope nobody thought of it. Her teacher read the draft and asked where the coach was.',
    'Priya said she had left him out on purpose. If she brought up the objection, would she not be arguing against herself?',
    'The opposite. She wrote it in: some say a later start would cut practice time. True, up front. Then she answered it: practice could shift later, and rested players play better than tired ones. When the coach stood up at the meeting to object, half the room said, she already covered that. Her argument looked stronger for having met him first.',
    'Name the best objection and answer it. A fair counterclaim makes your argument stronger, not weaker, because it shows you have looked at the other side and still stand where you stand.',
  ],
};
STORIES['explanatory-essay'] = {
  about: 'a board game explained to someone who had never seen a board, and the essay that started there',
  more: [{ serial: 'S744', after: 1, alt: 'A single die and a single piece on the board, the first rule' }, { serial: 'S745', after: 3, alt: 'A finished page with each new word underlined and an example beside it' }],
  title: 'Starting where the reader is', art: 'S743', cast: [],
  alt: 'A boy explaining a board game to his grandmother at a table, pieces and dice between them, one rule at a time',
  words: [
    'Sam had to explain how a board game worked to someone who had never played, and his first draft began with the scoring. His grandmother read it and asked what a piece was. Sam had been playing since he was six and had forgotten anyone could not know.',
    'He started again, from the top, and got lost in a different way: every sentence had three new words in it. His grandmother read it kindly and asked what a turn was.',
    'The third draft started where she was. A board, a die, a piece. Then one rule: roll the die and move that many spaces. Then the next rule. Each new word got its meaning the moment it appeared, and each rule got an example she could picture. By the end she was beating him.',
    'An explanatory essay starts where the reader is and adds one idea at a time. Define a new word when it appears, and give an example for every rule. If your grandmother can follow it, anyone can.',
  ],
};
STORIES['the-first-texans'] = {
  about: 'four regions of Texas, four ways of life, and the boy who found them on one drive',
  more: [{ serial: 'S747', after: 1, alt: 'Wet flat coastal land with fishing camps, then rolling wooded hills' }, { serial: 'S748', after: 3, alt: 'High dry plains with buffalo, then mountains and basins in the far west' }],
  title: 'Four regions', art: 'S746', cast: [],
  alt: 'A boy looking out a car window as the land changes from flat green coast to rolling hills to dry high plains to mountains',
  words: [
    'Kai\'s family drove across Texas in one long day, and Kai noticed the land keep changing outside the window. Flat and wet and green. Then rolling hills. Then high and dry and endless. Then mountains. He asked if they had left the state. They had not.',
    'His mother said the peoples who lived here first would have felt those changes more than he did, because the land decided what they ate. Kai did not see how land could decide anything.',
    'It decided everything. On the wet Gulf Coastal Plains, the Karankawa fished and gathered along the bays. On the rolling North Central Plains, the Caddo farmed corn in the woods. On the high, dry Great Plains, the Comanche followed the buffalo on horseback. In the Mountains and Basins of the far west, the Jumano farmed the rare rivers. Four regions, four kitchens, one state.',
    'Texas has four natural regions: the Gulf Coastal Plains, the North Central Plains, the Great Plains, and the Mountains and Basins. Each shaped how its first peoples lived, and you can still see the borders from a car window.',
  ],
};
STORIES['spain-and-mexico-in-texas'] = {
  about: 'three centuries of a Spanish claim, a few missions, and the door Mexico opened',
  more: [{ serial: 'S750', after: 1, alt: 'San Antonio in 1718, a small mission and a few houses on a big empty map' }, { serial: 'S751', after: 3, alt: 'Wagons of American settlers rolling through an open gate in 1821' }],
  title: 'Three centuries and a door', art: 'S749', cast: [],
  alt: 'A girl at an old stone mission at sunset, a Spanish flag faded on a pole, a wide empty plain behind it',
  words: [
    'Maya\'s history book said Spain owned Texas for three hundred years, and she pictured three hundred years of Spanish towns. Then she looked at the map from 1800. San Antonio. A few missions. And a great deal of nothing.',
    'Three centuries and almost no one? How could a country claim a place that size and hardly live in it? Maya thought the map must be missing something.',
    'It was not. Spain claimed Texas from the 1500s and settled little of it beyond San Antonio, founded in 1718, and a string of missions from the 1690s. The land was far from Mexico City and hard to hold. In 1821 Mexico won its independence, inherited the empty claim, and opened the door to American settlers to fill it. They came faster than anyone in Mexico City expected.',
    'Spain claimed Texas for three centuries and settled little of it. Mexico won independence in 1821 and invited settlers, who soon outnumbered everyone else. A claim on a map is not the same as a people on the land, and that gap is the next chapter.',
  ],
};
STORIES['revolution-and-republic'] = {
  about: 'from a small cannon in Gonzales to eighteen minutes at San Jacinto',
  more: [{ serial: 'S753', after: 1, alt: 'The walls of the Alamo at dawn, quiet, no fighting shown' }, { serial: 'S754', after: 3, alt: 'A watch showing eighteen minutes past the hour on the field at San Jacinto' }],
  title: 'From a cannon to eighteen minutes', art: 'S752', cast: [],
  alt: 'A boy holding a flag with a cannon and the words come and take it, a river and a low sun behind him',
  words: [
    'Theo could not understand how a war could be won in eighteen minutes. His grandfather said the Texas Revolution had been, at San Jacinto, and Theo said that sounded like a story someone made up later.',
    'His grandfather said, then start earlier. In October 1835, at Gonzales, the Mexican army came to take back a small cannon, and the settlers flew a flag that said come and take it. That was the first shot. Eighteen minutes was the last one.',
    'In between were six months. In March 1836 the Alamo fell after a siege, and at Goliad hundreds of prisoners were executed. Sam Houston retreated east, gathering men and anger. On April 21 at San Jacinto his army surprised the Mexican camp during its afternoon rest, and the fighting was over in eighteen minutes. Santa Anna was captured, and Texas was a republic.',
    'The revolution ran from Gonzales in October 1835 to San Jacinto in April 1836, with the Alamo and Goliad between. Eighteen minutes ended it only because six months had built it. That is how most quick endings work.',
  ],
};
STORIES['statehood-and-civil-war'] = {
  about: 'a republic that became a state, a war that followed within a year, and freedom that arrived late',
  more: [{ serial: 'S756', after: 1, alt: 'A map showing Texas joining the United States in 1845, a new star added' }, { serial: 'S757', after: 3, alt: 'A crowd in Galveston on June 19, 1865, hearing an order read aloud' }],
  title: 'A state, a war, and June nineteenth', art: 'S755', cast: [],
  alt: 'A girl on courthouse steps holding a flag with twenty-eight stars, a crowd gathered below in old-fashioned clothes',
  words: [
    'Ava\'s great-great-great-grandmother was born in the Republic of Texas and died in the United States without ever moving house. Ava asked how that was possible. Her aunt said the country moved, not the grandmother.',
    'In 1845 Texas joined the Union as the twenty-eighth state. Within a year the United States was at war with Mexico over where Texas ended. Ava thought that was the whole story. Her aunt said it was the first third.',
    'In 1861 Texas left the Union to join the Confederacy in a war over slavery. The war ended in 1865, but freedom reached Texas late: on June 19, 1865, soldiers in Galveston read the order that every enslaved person in the state was free. Juneteenth started there. Ava\'s grandmother had lived through all of it in one town.',
    'Texas joined the Union in 1845, war with Mexico followed in 1846, Texas left for the Confederacy in 1861, and freedom arrived in Galveston on June 19, 1865. One lifetime can hold a whole map of changes.',
  ],
};
STORIES['cattle-cotton-and-oil'] = {
  about: 'three fortunes made from the same ground, one after another',
  more: [{ serial: 'S759', after: 1, alt: 'A cattle drive heading north toward a railroad, dust rising' }, { serial: 'S760', after: 3, alt: 'The Spindletop gusher of 1901 spraying oil high over a wooden derrick' }],
  title: 'Three fortunes', art: 'S758', cast: [],
  alt: 'A boy on a fence looking across a landscape divided in three: cattle on the range, cotton in the fields, an oil derrick on the horizon',
  words: [
    'Jamal\'s town had a cattle brand on the welcome sign, a cotton gin turned into a museum, and an oil pump nodding beside the highway. He asked which one Texas was really about. His uncle said, all three, in order.',
    'How could one state be about three different things? Jamal thought a place picked one thing and stuck to it.',
    'Texas did not. From 1867, for about twenty years, cattle walked from Texas to the railroads in Kansas, and the drives made the first fortunes. Then cotton filled the fields and made the state\'s biggest crop. Then, in 1901 at Spindletop, oil blew a hundred feet into the air and changed everything again. Each fortune came from the same ground, and each one paid for the next.',
    'Cattle, cotton and oil, one after another, from the same land. When you ask what a place is about, the honest answer is usually a sequence, not a single thing.',
  ],
};
STORIES['modern-texas'] = {
  about: 'six flags over one state, and the seventh flag that only the twentieth century could raise',
  more: [{ serial: 'S762', after: 1, alt: 'A rocket lifting off with Mission Control drawn in the foreground' }, { serial: 'S763', after: 3, alt: 'A quiet farm road giving way to a highway and glass towers' }],
  title: 'From farms to skylines', art: 'S761', cast: [],
  alt: 'A girl standing before a row of six historic flags with a modern city skyline and a rocket rising behind them',
  words: [
    'Rosa counted the six flags on the plaza: Spain, France, Mexico, the Republic of Texas, the Confederacy, the United States. Six countries, one state. She thought the story was finished. Her teacher said the twentieth century added a seventh flag that was not a flag at all.',
    'Rosa did not know what that meant. All the flags were up there already. What could the twentieth century have added?',
    'A skyline. In one century Texas went from farms and ranches to the second-largest state by land and by people. NASA came to Houston and put Mission Control in Texas, so that the first words from the moon went through a Texas room. Highways, airports and glass towers rose where cotton had been. The seventh flag was the modern state itself.',
    'In the twentieth century Texas became the second-largest state by land and people, and the space program made Houston famous around the world. The six flags are the past. The skyline is the seventh.',
  ],
};
STORIES['slope'] = {
  about: 'a gentle hill, a steep hill, and the boy who measured them with a ruler instead of his legs',
  more: [{ serial: 'S765', after: 1, alt: 'A steep line rising two squares for every one across on graph paper' }, { serial: 'S766', after: 3, alt: 'A gentle line rising one square for every two across' }],
  title: 'Two hills', art: 'S764', cast: [],
  alt: 'A boy on a bike at the foot of two hills, one gentle and one steep, a ruler sketch floating beside him',
  words: [
    'Owen rode his bike up two hills on the way to school. The first was easy. The second made his legs burn. He knew the second was steeper, but when his teacher asked how much steeper, he had nothing but a feeling in his legs.',
    'He drew the two hills on graph paper and stared. Both went up. Both went across. Steep was somewhere in the relationship between the two, and he could not name it.',
    'Then he counted. The steep hill rose two squares for every one square across. Two over one, slope two. The gentle hill rose two squares for every four across. Two over four, slope one half. Rise over run, and the bigger the number, the harder the climb.',
    'Slope is rise over run. In y = mx + b, m is the slope and b is where the line crosses the y-axis. Owen\'s legs had known the answer all along; now the ruler could say it.',
  ],
};
STORIES['exponents'] = {
  about: 'a sheet of paper folded five times, and the pile that grew faster than anyone guessed',
  more: [{ serial: 'S768', after: 1, alt: 'The paper after two folds, four layers fanned out' }, { serial: 'S769', after: 3, alt: 'The thick five-fold pile next to 2 × 2 × 2 × 2 × 2 written out' }],
  title: 'Five folds', art: 'S767', cast: [],
  alt: 'A girl folding a sheet of paper for the fifth time, the pile suddenly thick, a notebook beside her',
  words: [
    'Priya bet her brother that folding a sheet of paper five times would make ten layers. Five folds, two layers each, ten. It was obvious. Her brother said thirty-two and would not say why.',
    'She folded once. Two layers. Twice. Four. Three times. Eight. That was not going up by two each time. It was doubling, and doubling ran away from her fast.',
    'Five folds: two times two times two times two times two. Thirty-two layers. The exponent, the little five, was just counting how many times she had multiplied by two. Two to the fifth. Her brother had counted the folds, not the layers.',
    'An exponent counts the multiplying. Same base, add exponents to multiply and subtract to divide, and anything to the power of zero is one. Five folds is thirty-two, and ten folds would be a thousand.',
  ],
};
STORIES['square-roots'] = {
  about: 'forty-nine floor tiles and the girl who had to lay them in a perfect square',
  more: [{ serial: 'S771', after: 1, alt: 'A tidy square of tiles, seven across and seven down' }, { serial: 'S772', after: 3, alt: 'A number line with perfect squares marked: 36, 49, 64' }],
  title: 'Forty-nine tiles', art: 'S770', cast: [],
  alt: 'A girl kneeling on a patio with forty-nine square tiles, laying them out in rows',
  words: [
    'Rosa had forty-nine tiles and one job: lay them in a square, no leftovers. She tried six across. One row short and some spare. She tried eight. Not enough tiles. The patio was hot and the tiles were heavy.',
    'A square meant the same number across as down. So she needed a number that, times itself, made forty-nine. She had never thought of a number that way before.',
    'Seven. Seven rows of seven is forty-nine. That is the square root: the number that, multiplied by itself, gives you the total. The perfect squares, 1, 4, 9, 16, 25, 36, 49, 64, are the tile counts that make tidy squares. Any other count leaves a leftover, and its root sits between two whole numbers.',
    'A square root asks which number times itself gives this. Know the perfect squares by heart, and a root you cannot find exactly still lives between two that you can.',
  ],
};
STORIES['scientific-notation'] = {
  about: 'a number with too many zeros, and the decimal point that slid to save it',
  more: [{ serial: 'S774', after: 1, alt: 'The number 3,400,000 with an arrow sliding the decimal point six places' }, { serial: 'S775', after: 3, alt: 'The tidy 3.4 × 10⁶ on the board' }],
  title: 'Sliding the point', art: 'S773', cast: [],
  alt: 'A boy at a whiteboard writing a very long number, the zeros trailing off the edge',
  words: [
    'Marcus had to copy the distance to a star into his notebook: 3,400,000 kilometers, and that was one of the short ones. By the fourth zero he had lost count. By the fifth he had written one too many. The star was now ten times farther away.',
    'Zeros were the problem. They looked alike, they were easy to drop, and nobody could tell at a glance whether a number had six or seven.',
    'His teacher slid the decimal point. Move it six places to the left and 3,400,000 becomes 3.4. Then write how far it moved: times ten to the sixth. 3.4 × 10⁶. Every digit that mattered was there, and the size lived in the exponent instead of a trail of zeros.',
    'Scientific notation is a number from 1 to 10, times a power of ten. The exponent counts how many places the decimal point moved. It is how scientists write the very large and the very small without losing a zero.',
  ],
};
STORIES['flawed-reasoning'] = {
  about: 'a washed car, a rainstorm, and the four ways an argument can look right and be wrong',
  more: [{ serial: 'S777', after: 1, alt: 'Four cards laid out, each showing a broken chain link with a different name' }, { serial: 'S778', after: 3, alt: 'The boy pointing at a card labeled in his own handwriting, grinning' }],
  title: 'The car and the rain', art: 'S776', cast: [],
  alt: 'A boy with a bucket beside a freshly washed car as rain begins to fall, a frustrated look on his face',
  words: [
    'Marcus washed the car on Saturday and it rained on Sunday. His uncle said, that is what you get for washing it, and everyone laughed. Marcus laughed too. Then he thought about it on the bus and stopped laughing. Did washing the car really cause the rain?',
    'It felt true. It happened right after. But when he tried to explain how a wet car pulls clouds across the sky, he could not. The argument had a shape that looked like reasoning and a middle made of nothing.',
    'His teacher had names for that. False cause: one thing came after another, so it must have been caused by it. Overgeneralizing: every dog I met bit me, so every dog bites. Attacking the person: you are only saying that because you are a kid. False choice: either we ban phones or nobody learns. Name the flaw, and the argument loses its grip.',
    'Flawed reasoning looks like reasoning until you name it. Overgeneralizing, false cause, attacking the person, false choice: four shapes that fool people every day. Once you can see the shape, you cannot unsee it, and the washed car stops causing rain.',
  ],
};
STORIES['irony'] = {
  about: 'a fire station that burned down, and the difference between bad luck and irony',
  more: [{ serial: 'S780', after: 1, alt: 'A woman in a storm saying great weather, umbrella inside out' }, { serial: 'S781', after: 3, alt: 'A stage with the audience seeing a shadow the hero cannot see' }],
  title: 'The fire station', art: 'S779', cast: [],
  alt: 'A girl looking at a burned fire station across the street, a fire truck parked outside it untouched',
  words: [
    'The fire station in Priya\'s town burned down, and the whole town called it ironic. A month later Priya broke her arm the day before a swim meet, and her friend said that was ironic too. Priya was not sure both could be right.',
    'Bad luck was everywhere. If every bad thing was irony, the word did not mean much. There had to be something more in the fire station than in her arm.',
    'There was a gap. A fire station is the one building that should never burn, so what happened stood against what everyone expected. That gap is irony. Her arm was just bad luck; nobody expects a broken arm to be impossible. The gap can sit between expected and actual. It can sit between what is said and what is meant, as in great weather in a storm. It can sit between what the audience knows and what the hero does not.',
    'Irony is a gap: expected against actual, said against meant, known against unknown. Bad luck alone is not irony. The fire station qualifies. The arm, however sore, does not.',
  ],
};
STORIES['allusions'] = {
  about: 'one word at the dinner table that carried a whole novel with it',
  more: [{ serial: 'S783', after: 1, alt: 'A faint drawing of an old miser in a nightcap hovering over the boy\'s shoulder' }, { serial: 'S784', after: 3, alt: 'A bookshelf with a few classic spines glowing' }],
  title: 'One word, one story', art: 'S782', cast: [],
  alt: 'A family at a dinner table, a boy holding tight to a plate of dessert while his sister rolls her eyes',
  words: [
    'Kai would not share his dessert, and his sister said, do not be such a Scrooge. Kai had never read the book. He still knew exactly what she meant, and he gave her half.',
    'How did one word do that? She had not told a story. She had not even said what a Scrooge was. Kai looked it up later and found a whole novel about a miser who counted coins while others went cold.',
    'That is an allusion. A writer borrows a whole story in a few words and trusts the reader to bring the rest. Scrooge means stingy, Achilles\' heel means the one weak spot, a Trojan horse means a gift that hides a trap. Know where the word points, and you know what the writer meant.',
    'An allusion borrows a whole story in a few words. When a word seems to carry more weight than it should, ask where it points, and read that story too. Writers pack their sentences with other people\'s books.',
  ],
};
STORIES['objective-summary'] = {
  about: 'a summary that came out as a review, and the mirror that fixed it',
  more: [{ serial: 'S786', after: 1, alt: 'A summary with the word unfortunately circled in red' }, { serial: 'S787', after: 3, alt: 'The same summary rewritten in plain words, no circles' }],
  title: 'The mirror', art: 'S785', cast: [],
  alt: 'A girl at a library table holding a page up to a small mirror, an article open beside her',
  words: [
    'Rosa summarized an article that argued the park should close at dusk. Her summary said the article unfortunately argued the park should close at dusk. Her teacher circled one word.',
    'Unfortunately. Rosa had not meant to put herself in the summary. But there she was, in one adverb, disagreeing with an article that had not asked her opinion.',
    'A summary is a mirror, her teacher said, not a review. Say what the text says, in neutral words. The article argues that the park should close at dusk, for safety. That is all. No liked, no hated, no unfortunately. Watch for the single words that let an opinion back in: sadly, of course, so-called, only.',
    'An objective summary says what the text says in neutral words and leaves your opinion out. The dangerous words are the small ones. A mirror does not sigh.',
  ],
};
STORIES['chemical-reactions'] = {
  about: 'a folded sheet of paper, a burned one, and the change a boy could not undo',
  more: [{ serial: 'S789', after: 1, alt: 'The paper folded into a plane, then unfolded flat again' }, { serial: 'S790', after: 3, alt: 'A scrap of paper turning to ash and smoke over the flame' }],
  title: 'Fold it, burn it', art: 'S788', cast: [],
  alt: 'A boy holding a folded paper airplane, a small pile of ash beside a campfire',
  words: [
    'Theo folded a sheet of paper into a plane, then flattened it out again. Same paper, a few creases. Then, at the campfire, he let a scrap catch the flame. It curled, went black, and became ash and smoke. He could not fold it back.',
    'Both were changes. Why could one be undone and the other could not? The paper had gone somewhere, and it was not coming back.',
    'Folding was a physical change. The paper was still paper, just a different shape. Burning was a chemical change. The paper\'s atoms had rearranged into new substances, ash and gases, and no atom was created or lost. The paper was not gone. It was everywhere, in a form no fold could reach.',
    'A chemical change makes a new substance; a physical change does not. In every reaction, atoms are rearranged, never created or destroyed. Fold it and it is still paper. Burn it and it is something else.',
  ],
};
STORIES['scale-of-the-universe'] = {
  about: 'nesting boxes, and the girl who found the Earth inside the smallest one',
  more: [{ serial: 'S792', after: 1, alt: 'The boxes lined up from smallest to largest, each labeled by a drawn planet, sun, galaxy' }, { serial: 'S793', after: 3, alt: 'A night sky with a faint band of stars, the girl pointing up' }],
  title: 'Boxes inside boxes', art: 'S791', cast: [],
  alt: 'A girl opening a set of nesting boxes in an attic, a tiny blue marble in the smallest one',
  words: [
    'Nadia found a set of nesting boxes in the attic. Inside the biggest was a smaller one, and inside that a smaller one, down to a tiny box with a blue marble in it. Her uncle said, that is where we live.',
    'The marble was the Earth, he said. Nadia laughed. Then she asked what the next box was, and the next, and stopped laughing somewhere around the fourth.',
    'The moon circles the Earth. The Earth and its neighbors circle the sun: the solar system. The sun is one star among billions in a galaxy. The galaxy is one among billions in the universe. Each layer sits inside the next, and the distances are so vast that astronomers measure them by how far light travels in a year.',
    'Moon, planet, solar system, galaxy, universe: each is inside the next. Distances are measured in light-years, because kilometers run out of zeros. The marble is small, and it is home.',
  ],
};
STORIES['speed-and-graphs'] = {
  about: 'a walk to school drawn as one line, and the boy who could read where he had run',
  more: [{ serial: 'S795', after: 1, alt: 'The flat part of the line, a shoe being tied' }, { serial: 'S796', after: 3, alt: 'The steep part of the line, the boy running for the bell' }],
  title: 'The walk on a graph', art: 'S794', cast: [],
  alt: 'A boy at a desk looking at a graph of his walk to school, a flat part, a gentle slope and a steep one',
  words: [
    'Kai timed his walk to school and marked how far he had gone every minute. Then he plotted it: time across, distance up. He expected a straight line. Instead the line had a flat bit, a gentle stretch and a steep jump at the end.',
    'The flat part puzzled him. Time kept passing, but the distance did not move. Had he stopped? He thought back. He had stopped to tie his shoe.',
    'That was it. On a distance-time graph, flat means standing still. A gentle slope means moving slowly, the stroll past the park. A steep slope means moving fast, the sprint for the bell. The slope is the speed. And the whole trip\'s average speed was the total distance over the total time, one gentler line from start to finish.',
    'On a distance-time graph, flat is still, sloped is moving, steeper is faster. The slope is the speed, and average speed is the whole distance over the whole time. A walk becomes a line, and the line remembers the shoe.',
  ],
};
STORIES['weathering-to-fossils'] = {
  about: 'a laundry pile, a cliff, and why the bottom is always the oldest',
  more: [{ serial: 'S798', after: 1, alt: 'The shirt at the bottom of the pile, worn on Monday' }, { serial: 'S799', after: 3, alt: 'A cliff of stripes with a shell fossil in a lower layer' }],
  title: 'The laundry pile', art: 'S797', cast: [],
  alt: 'A boy digging through a tall pile of laundry, a cliff of rock layers drawn on the wall behind him',
  words: [
    'Diego was looking for the shirt he had worn on Monday. It was Friday. The pile of laundry on his floor was tall, and Monday was nowhere near the top.',
    'He started digging. Thursday, Wednesday, Tuesday. Each shirt was under the one that came after it. Monday was at the bottom, because it had gone in first, and everything since had piled on top.',
    'Rock layers work the same way. Mud and sand settle one layer on top of another, year after year, so the deepest layer is the oldest. A fossil buried deep is older than one near the surface, and the layer around it, sand or mud or shells, says what the place was like when that creature lived.',
    'Layers pile up over time, so deeper is older. Fossils and the layers around them tell what a place was like and when. A cliff is a laundry pile that took a million years.',
  ],
};
STORIES['thesis-and-outline'] = {
  about: 'a topic nobody would argue with, and the fight worth picking instead',
  more: [{ serial: 'S801', after: 1, alt: 'The sentence dogs are pets crossed out, nobody arguing' }, { serial: 'S802', after: 3, alt: 'An outline: one thesis at the top, three reasons beneath' }],
  title: 'A fight worth picking', art: 'S800', cast: [],
  alt: 'A boy at a desk with a crossed-out sentence and a new one written underneath, three arrows branching from it',
  words: [
    'Sam\'s first thesis was dogs are pets. His teacher asked who would disagree. Sam thought about it. Nobody. Not one person on Earth would argue with him, and that, she said, was the problem.',
    'A thesis that everyone agrees with is a topic wearing a thesis costume. There was nothing to prove and nowhere for the essay to go.',
    'He tried again. Dogs make better pets than cats for busy families. Now someone would argue. His cousin would argue right now. And once he had a claim someone could fight, the reasons lined up under it on their own: dogs get you outside, dogs fit a schedule, dogs guard the house. The outline wrote itself.',
    'Write the thesis first, then list the reasons under it. A good thesis is one someone could disagree with, because an essay is a fight worth picking, and a fight needs another side.',
  ],
};
STORIES['evidence-paragraph'] = {
  about: 'twelve near-misses at a crosswalk, and the sentence most writers leave out',
  more: [{ serial: 'S804', after: 1, alt: 'A paragraph with claim and evidence, a blank line between them' }, { serial: 'S805', after: 3, alt: 'The blank line filled in, the paragraph whole' }],
  title: 'The missing sentence', art: 'S803', cast: [],
  alt: 'A girl at a street corner with a clipboard, a car braking hard at the crossing behind her',
  words: [
    'Ana wrote to the city. Claim: the town needs a crosswalk at Oak and Third. Evidence: twelve near-misses this year, counted by the crossing guard. She was proud of the number. The city wrote back and asked what the number had to do with a crosswalk.',
    'Ana was furious. The connection was obvious. Twelve near-misses meant danger, and a crosswalk fixed danger. But she had not written that sentence. She had assumed it.',
    'That sentence has a name: the warrant. It says why the evidence counts for the claim. Twelve near-misses mean that twelve times someone was nearly hurt, and painted crossings cut those numbers sharply. Claim, evidence, warrant. She sent it again with the warrant in, and the city sent a crew.',
    'A paragraph that proves something has three parts: the claim, the evidence, and the warrant that says why the evidence counts. The warrant is the sentence most often missing, because the writer already believes it.',
  ],
};
STORIES['full-essay'] = {
  about: 'five paragraphs, one skeleton, and the writer who built the body before the head',
  more: [{ serial: 'S807', after: 1, alt: 'A skeleton drawn beside the cards: one head, three ribs, one base' }, { serial: 'S808', after: 3, alt: 'The first card being written last, a thesis in bold' }],
  title: 'Body first', art: 'S806', cast: [],
  alt: 'A boy writing at a desk with five index cards in a row, the middle three filled in and the end cards blank',
  words: [
    'Diego stared at a blank page for twenty minutes trying to write his introduction. He could not introduce an essay he had not written. Every opening sentence promised something he did not have yet.',
    'His teacher told him to skip it. Write the body first. Diego thought that was cheating. Essays started at the top.',
    'They are read from the top. They are not built from it. He wrote three body paragraphs, one reason each, with evidence and a warrant. Then the introduction was easy: it promised exactly what the body delivered, with the thesis at the end of it. The conclusion looked back at the three reasons and said the thesis again in fresh words. Five paragraphs, one skeleton.',
    'A five-paragraph essay is an introduction with the thesis, three body paragraphs and a conclusion that looks back. Write the body first, then the introduction that fits it. Nobody builds a house starting with the roof.',
  ],
};
STORIES['founding-documents'] = {
  about: 'three documents on one wall, and the girl who found that each answered a different question',
  more: [{ serial: 'S810', after: 1, alt: 'The Declaration with the word why drawn above it' }, { serial: 'S811', after: 3, alt: 'The Bill of Rights with a drawn locked gate beside it' }],
  title: 'Why, how, and what may not', art: 'S809', cast: [],
  alt: 'A girl in a museum hall looking at three framed documents side by side',
  words: [
    'On the class trip, Maya stood in front of three framed documents and could not tell them apart. Old paper, fancy writing, the same few names at the bottom. Why did a country need three?',
    'Her guide asked her three questions instead. Why did the colonies leave? How does the government work? What may the government never do? Maya could not answer any of them, but she noticed they were different questions.',
    'Each document answered one. The Declaration of 1776 said why: governments exist for the people, and this one had failed them. The Constitution of 1787 said how: three branches, and a Congress where big and small states share power under the Great Compromise. The Bill of Rights of 1791 said what may never be done: speech, worship, a fair trial, untouched.',
    'The Declaration says why, the Constitution says how, and the Bill of Rights says what may never be done. Three questions, three answers, and a country runs on all of them at once.',
  ],
};
STORIES['early-republic'] = {
  about: 'a new country learning to drive, and the four lessons it took',
  more: [{ serial: 'S813', after: 1, alt: 'A drawn map doubling in size as a hand unfolds it' }, { serial: 'S814', after: 3, alt: 'A crowd at a polling place, many more men voting than before' }],
  title: 'Learning to drive', art: 'S812', cast: [],
  alt: 'A boy in a driving lesson on a country road, old maps and a flag on the seat beside him',
  words: [
    'Jamal got his learner\'s permit the week his class started the early republic, and his teacher said the two had a lot in common. A new country in 1789 was a driver with a brand-new license and no idea where the road went.',
    'Jamal did not see it. A country was not a car. But then he thought about his own first weeks: learning the habits, going farther than felt safe, a scare, and then finally being allowed to carry passengers.',
    'That was the order. Washington set the habits: two terms, then go home. Jefferson went farther, buying Louisiana in 1803 and doubling the map. The War of 1812 was the scare that made a loose collection of states feel like one nation. And Jackson opened the driver\'s seat wider, as more ordinary men gained the vote.',
    'Washington set the habits, Jefferson doubled the land, the War of 1812 made a nation, and Jackson widened the vote. A republic learns to drive the same way a teenager does: rules, reach, a fright, and then the keys.',
  ],
};
STORIES['sectional-crisis'] = {
  about: 'every new state a coin toss, and the compromises that bought less time each throw',
  more: [{ serial: 'S816', after: 1, alt: 'A ledger with two columns, slave and free, kept even by hand' }, { serial: 'S817', after: 3, alt: 'A courtroom sketch, then a ballot with one name winning' }],
  title: 'The coin toss', art: 'S815', cast: [],
  alt: 'A girl at a map of the United States flipping a coin over each new territory',
  words: [
    'Rosa noticed something strange in the chapter. Every time the country added a state, the whole nation held its breath. Why did one more state matter so much?',
    'Because each new state was a coin toss: slave or free. Every state sent senators, and whichever side had more senators could make the laws. The map was a scoreboard, and both sides counted every square.',
    'So they made deals. The Missouri Compromise of 1820 kept the score even. The Compromise of 1850 bought a few more years. The Kansas-Nebraska Act of 1854 let settlers vote and turned Kansas into a battlefield. Then the Dred Scott decision said the score could not be kept at all, and in 1860 Lincoln won without a single southern state. The tosses were over.',
    'Each new state asked slave or free, and the compromises of 1820, 1850 and 1854 each bought less time than the last. Dred Scott and Lincoln\'s election ended the bargaining. A country can only flip a coin so many times before it has to choose.',
  ],
};
STORIES['reconstruction'] = {
  about: 'three promises written into the Constitution, and the century it took to keep them',
  more: [{ serial: 'S819', after: 1, alt: 'The 13th, 14th and 15th written on three doors, one after another' }, { serial: 'S820', after: 3, alt: 'A crowd at a march in the 1960s holding the same three numbers' }],
  title: 'Three promises', art: 'S818', cast: [],
  alt: 'A boy on courthouse steps holding three folded papers, a long shadow stretching down the steps',
  words: [
    'Theo read the three amendments in a row and thought the story was over. The 13th ended slavery. The 14th made everyone born here a citizen. The 15th said no one loses the vote for their race. Three promises, all in writing, by 1870. What was left to fight about?',
    'Then he turned the page to 1877 and the soldiers went home from the South. Within a few years, the same states that had signed the promises found ways around them: poll taxes, literacy tests, laws that split every town in two. The promises stayed on the page and left the streets.',
    'It took nearly a century to bring them back. The marches, the courts and the laws of the 1950s and 1960s did not write new promises. They forced the country to keep the three it already had. Theo\'s grandmother had been at one of those marches, carrying a sign with three numbers on it.',
    'The 13th, 14th and 15th Amendments promised freedom, citizenship and the vote; after 1877 the promise was broken for decades, and the civil rights movement made the country keep it. A promise on paper is the beginning of a story, not the end.',
  ],
};
// Grades 9 and 10, told for readers.
STORIES['multi-step-equations'] = {
  about: 'socks on both sides of the bed, and the equation that cleaned up the same way',
  more: [{ serial: 'S822', after: 1, alt: 'The socks gathered into one basket on one side' }, { serial: 'S823', after: 3, alt: 'The equation 5x + 3 = 2x + 15 reduced line by line to x = 4' }],
  title: 'Two sides of the bed', art: 'S821', cast: [],
  alt: 'A teenage boy standing between two piles of socks on either side of a bed, an equation written on the wall',
  words: [
    'Owen\'s room had socks on both sides of the bed, and his math homework had x on both sides of the equals sign. 5x + 3 = 2x + 15. He had solved plenty of equations with x on one side. This one felt like it was fighting back.',
    'He tried subtracting 3, then got stuck staring at 5x and 2x on opposite sides, like two piles of laundry with a bed in between. Nothing he knew told him which pile to touch first.',
    'His sister told him to clean the room. Gather every sock on one side. Take 2x from both sides: 3x + 3 = 15. Now gather the numbers on the other side. Take 3 from both: 3x = 12. Divide by 3: x = 4. He put 4 back into the original, and both sides said 23.',
    'Whatever the shape of the equation, the moves are the same. Clear any brackets, gather every x on one side and every number on the other, then undo what is left and check. A room and an equation both clean up the same way.',
  ],
};
STORIES['functions'] = {
  about: 'a vending machine that never lied, and the rule inside it',
  more: [{ serial: 'S825', after: 1, alt: 'The button 3 pressed and one pretzel dropping' }, { serial: 'S826', after: 3, alt: 'A table of inputs and outputs: 1 to 3, 2 to 5, 3 to 7' }],
  title: 'The honest machine', art: 'S824', cast: [],
  alt: 'A girl pressing a button on a vending machine, a small drawn rule floating in its window',
  words: [
    'The vending machine outside the gym was the most honest thing at Lena\'s school. Press 3, get a pretzel. Every single time. Press 3 again, another pretzel. Never a candy bar, never nothing, never two.',
    'Her teacher called it a function, and Lena thought that was an odd name for a snack machine. Then he showed her one with a rule inside: press 1, get 3. Press 2, get 5. Press 3, get 7. Lena could not see the machine\'s insides, but she could see its habit.',
    'The rule was f(x) = 2x + 1. Press 3 and the machine doubles it and adds one: f(3) = 7. One input, one output, always the same. If pressing 3 ever gave two different answers, it would not be a function. It would be a broken machine.',
    'A function gives one output for each input, every time. f(3) means the rule applied to 3. When you can trust a machine the way Lena trusts the pretzel button, you are looking at a function.',
  ],
};
STORIES['systems-of-equations'] = {
  about: 'two clues at a birthday party, and the one pair of numbers that fit both',
  more: [{ serial: 'S828', after: 1, alt: 'The first clue: two numbers that add to 5' }, { serial: 'S829', after: 3, alt: 'The lock opening on 3 and 2' }],
  title: 'Two clues', art: 'S827', cast: [],
  alt: 'A boy at a party holding two folded clue cards, a wrapped gift with a number lock on it',
  words: [
    'The gift had a number lock, and Marcus\'s uncle gave him two clues on two cards. Two numbers add to 5. Their difference is 1. Marcus tried the first clue alone and found too many answers: 0 and 5, 1 and 4, 2 and 3.',
    'The second clue alone was no better: 4 and 3, 7 and 6, a hundred and ninety-nine. One clue narrowed the world. It did not pin it down.',
    'He used them together. From the first, the second number was 5 minus the first. He put that into the second clue: the first minus 5 minus the first equals 1. Solve, and the first number was 3. Then the second was 2. Only 3 and 2 fit both cards. The lock opened.',
    'A system of equations is two clues about the same unknowns. Substitute one equation into the other, solve for one unknown, then find the second, and check the pair in both. One clue narrows; two clues decide.',
  ],
};
STORIES['factoring'] = {
  about: 'a rectangle that had been multiplied out, and the girl who un-multiplied it',
  more: [{ serial: 'S831', after: 1, alt: 'The rectangle cut into four parts: x squared, 3x, 2x, 6' }, { serial: 'S832', after: 3, alt: 'Two numbers, 2 and 3, circled, with a product of 6 and a sum of 5' }],
  title: 'Un-multiplying', art: 'S830', cast: [],
  alt: 'A girl at a desk with a rectangle drawn on graph paper, its sides labeled x + 2 and x + 3',
  words: [
    'Priya could multiply (x + 2) by (x + 3) and get x² + 5x + 6 without thinking. Then the homework handed her x² + 5x + 6 and asked where it came from. Going backward felt like un-baking a cake.',
    'She drew the rectangle. Its area was x² + 5x + 6, and its sides had to be x plus something and x plus something else. The somethings had to multiply to 6, the corner piece. And they had to add to 5, the strip along the middle.',
    'Two numbers that multiply to 6 and add to 5: 2 and 3. So x² + 5x + 6 = (x + 2)(x + 3). And once it was two brackets, a new door opened: if the whole thing equals zero, one of the brackets must be zero, so x is either minus 2 or minus 3.',
    'To factor, find two numbers that multiply to c and add to b. If a product is zero, one of the brackets is zero, which is how a factored equation gives up its answers. Un-multiplying is baking in reverse.',
  ],
};
STORIES['exponential-growth'] = {
  about: 'a rumor that doubled at every telling, and the class that counted it',
  more: [{ serial: 'S834', after: 1, alt: 'A tree diagram: one, two, four, eight' }, { serial: 'S835', after: 3, alt: 'Two lines on a graph, one climbing gently, one shooting up' }],
  title: 'The rumor', art: 'S833', cast: [],
  alt: 'A boy whispering to two classmates in a hallway, each of them turning to two more',
  words: [
    'Diego told two friends a rumor at first period. By lunch the whole school knew. He had told exactly two people. How could two become six hundred by noon?',
    'His math teacher asked him to count. He told two. Each of them told two: four. Then eight, then sixteen. Diego assumed the rumor grew by a couple of people every round, and by ten rounds that would be twenty or so. Not six hundred.',
    'But it was not adding two each round. It was doubling. Two, four, eight, sixteen, thirty-two. After ten rounds, over a thousand. Adding the same amount each step is linear and climbs like stairs. Multiplying by the same amount each step is exponential and climbs like a rocket.',
    'Adding the same amount each step is linear growth. Multiplying by the same amount is exponential growth, and it runs away from every straight line eventually. A rumor is exponential. So is a savings account, given time.',
  ],
};
STORIES['rhetorical-appeals'] = {
  about: 'three ways to sell one bicycle, and which one fit the claim',
  more: [{ serial: 'S837', after: 1, alt: 'The girl pointing at her own scuffed knees, years of riding' }, { serial: 'S838', after: 3, alt: 'A small chart of the bike\'s price against new ones' }],
  title: 'Three ways to sell a bicycle', art: 'S836', cast: [],
  alt: 'A teenage girl at a garage sale beside a bicycle, three thought bubbles above her with a badge, a heart and a chart',
  words: [
    'Priya was selling her old bicycle at the garage sale and had three pitches ready. Trust me, I have ridden it for years. Imagine the wind on your face on the first warm day of spring. It costs a third of a new one and the frame is aluminum, so it will outlast you. The first buyer walked away from all three.',
    'Her brother said she had used every appeal in the book and had no idea what any of them was for. Priya said they were just sentences. He said each one was asking the buyer to trust a different thing.',
    'The first was ethos: trust me, because I know. The second was pathos: feel this, because feeling moves people. The third was logos: here is the reasoning and the numbers. None was better than the others. The question was whether the appeal fit the claim, and a buyer asking whether the brakes worked did not need the wind on his face.',
    'Ethos is credibility, pathos is feeling, logos is reasoning. Every argument leans on one or more, and the test is whether the appeal fits the claim. The second buyer asked about the brakes; Priya answered with logos, and the bicycle rolled away.',
  ],
};
STORIES['theme-development'] = {
  about: 'a character who trusted no one on page one and handed over a key on the last',
  more: [{ serial: 'S840', after: 1, alt: 'The first page: a girl with her arms crossed, a locked door behind her' }, { serial: 'S841', after: 3, alt: 'The last page: the same girl holding out a key' }],
  title: 'The key', art: 'S839', cast: [],
  alt: 'A boy reading a novel in bed, a small drawn key glowing on the final page',
  words: [
    'Marcus finished the novel and wrote its theme: trust. One word. His teacher said trust was a topic, not a theme, and asked him what the book said about it. Marcus said it was about trust, and he was starting to feel like they were speaking different languages.',
    'She told him to go back to page one and then to the last page, and to ignore the three hundred pages in between for a minute. Page one: the girl trusted no one, and she had good reasons. Last page: she handed him the key to her house.',
    'That gap was the theme. Not trust, but something like this: trust is a risk that becomes possible only after someone earns it slowly. The three hundred pages were the earning, step by step. The theme was not stated anywhere. It grew, and you could track it by what changed.',
    'A theme grows through a text. Find what a character believes at the start, what they do at the end, and the sentence that explains the change. That sentence is the theme, and the pages in between are how it developed.',
  ],
};
STORIES['word-choice-effect'] = {
  about: 'a girl who sprinted to the door, and what was lost when she only ran',
  more: [{ serial: 'S843', after: 1, alt: 'The word sprinted on a page, then swapped for ran' }, { serial: 'S844', after: 3, alt: 'A list of what the swap lost: urgency, fear, a reason' }],
  title: 'Sprinted, or ran', art: 'S842', cast: [],
  alt: 'A girl bursting through a doorway at full speed, a second faded version of her merely jogging',
  words: [
    'The sentence said she sprinted to the door. Lena\'s teacher asked what sprinted was doing there. Lena said it meant ran. Then why not write ran, the teacher asked. Lena did not know, and it bothered her all the way home.',
    'She tried the swap at her desk. She ran to the door. It was still a sentence, still true, still a girl and a door. But something had leaked out of it, and she could not say what.',
    'Then she could. Sprinted said the girl was afraid, or late, or desperate, that something was chasing her or waiting for her. Ran said nothing about why. The plainer word kept the fact and dropped the feeling. What was lost in the swap was exactly what the writer had chosen the word for.',
    'To find what a word is doing, swap it for a plainer one. What is lost is its effect. Sprinted carries fear and urgency that ran leaves behind, and a writer who chose it was telling you something without saying it.',
  ],
};
STORIES['credible-sources'] = {
  about: 'two web pages about the same medicine, and the one that showed its work',
  more: [{ serial: 'S846', after: 1, alt: 'The page with an author, a date and a list of sources' }, { serial: 'S847', after: 3, alt: 'A shop button hiding at the bottom of the nameless page' }],
  title: 'The page with no name', art: 'S845', cast: [],
  alt: 'A boy at a library computer with two web pages side by side, one with an author and date, one blank where they should be',
  words: [
    'Theo found two pages about the same vitamin. One was plain, with an author, a date and a list of studies at the bottom. The other was bright and confident, promised the vitamin cured colds, and had no name on it anywhere. Theo believed the bright one. It sounded surer.',
    'His teacher asked him to find out who had written it. He could not. When it was written. He could not. Where its claims came from. It did not say. Then she asked him to scroll to the bottom, where a button sold the vitamin.',
    'The plain page showed its work: an author with a reason to know, a date, evidence he could follow to its source. The bright page showed none of that, and the one thing it did show was who benefited if he believed it. Sure is not the same as credible. Sure is cheap.',
    'A credible source shows its work: an author, a date, evidence you can follow, and a reason to know. Then ask who benefits if you believe it. The page with no name had a reason to sound sure.',
  ],
};
STORIES['punnett-squares'] = {
  about: 'a raffle with four tickets, and the odds of brown eyes',
  more: [{ serial: 'S849', after: 1, alt: 'Two parents each holding two cards, B and b' }, { serial: 'S850', after: 3, alt: 'The grid showing BB, Bb, Bb and bb' }],
  title: 'Four tickets', art: 'S848', cast: [],
  alt: 'A girl at a kitchen table with a two-by-two grid drawn on paper, four squares filled in',
  words: [
    'Rosa\'s parents both have brown eyes, and her little brother has blue. Rosa wanted to know how that was possible. A friend said her brother must be adopted. Rosa knew he was not.',
    'Her biology teacher drew a raffle. Each parent has two cards for eye color and gives one at random. Both her parents carry a capital B, for brown, and a small b, for blue. Brown is dominant: one B is enough to show.',
    'Four tickets in the raffle: BB, Bb, Bb and bb. Three of the four show brown. One in four shows blue, because it got a small b from each parent. Her brother drew the one ticket. Nothing strange about it. Just odds.',
    'Each parent gives one of two alleles; capital is dominant, small is recessive. A Punnett square shows the odds for each child, not a promise about any one of them. Three tickets in four is not a guarantee, and one in four is not a mystery.',
  ],
};
STORIES['respiration-and-photosynthesis'] = {
  about: 'a leaf and a lung, running the same reaction in opposite directions',
  more: [{ serial: 'S852', after: 1, alt: 'A leaf with arrows: carbon dioxide and water in, sugar and oxygen out' }, { serial: 'S853', after: 3, alt: 'A lung with the arrows reversed' }],
  title: 'The leaf and the lung', art: 'S851', cast: [],
  alt: 'A boy breathing out toward a plant in a sunny garden, arrows drawn between his chest and its leaves',
  words: [
    'Kai learned photosynthesis in the morning and respiration after lunch, and by the bus ride home he had them tangled together. Both had sugar. Both had oxygen. Both had carbon dioxide. He could not remember which one made what.',
    'He wrote them side by side and noticed something. The same words appeared in both, but on opposite sides of the arrow.',
    'The leaf takes carbon dioxide and water, uses light, and makes sugar and oxygen. The lung takes that oxygen, the body burns the sugar with it for energy, and out come carbon dioxide and water. One reaction, run forward in the leaf and backward in the body. The plant builds the fuel and the animal spends it.',
    'Photosynthesis makes sugar and oxygen from carbon dioxide, water and light. Respiration burns sugar with oxygen for energy and gives back carbon dioxide and water. They are the same equation read in opposite directions, and every breath connects the two.',
  ],
};
STORIES['evidence-for-evolution'] = {
  about: 'three witnesses who never met, telling the same story',
  more: [{ serial: 'S855', after: 1, alt: 'A fossil of an ancient whale with small hind legs' }, { serial: 'S856', after: 3, alt: 'An arm, a flipper and a wing side by side, the same bones shaded' }],
  title: 'Three witnesses', art: 'S854', cast: [],
  alt: 'A girl in a museum between a fossil case, a display of an arm, a flipper and a wing, and a DNA model',
  words: [
    'Maya\'s cousin said evolution was just a guess, because nobody was there to see it. Maya did not know how to answer. She had not been there either.',
    'Her teacher asked how a court decides what happened when nobody in the room saw it. Witnesses. And the strongest case is three witnesses who never met, questioned separately, telling the same story.',
    'Fossils are one witness: older rocks hold simpler forms, and in between are creatures like whales with tiny hind legs. Bones are another: an arm, a flipper and a wing share one bone plan under the skin. DNA is the third: the animals that look most alike share the most letters. Three lines of evidence, gathered by different people in different ways, and they agree.',
    'Fossils, homologous structures and DNA are separate lines of evidence, gathered in different ways, and they point to the same history. Nobody needs to have been there when three witnesses who never met agree.',
  ],
};
STORIES['cell-division'] = {
  about: 'a recipe book copied two ways, once whole and once by halves',
  more: [{ serial: 'S858', after: 1, alt: 'A full photocopy of the book, forty-six pages, two identical stacks' }, { serial: 'S859', after: 3, alt: 'Four thin half-books of twenty-three pages each' }],
  title: 'The recipe book', art: 'S857', cast: [],
  alt: 'A boy at a kitchen counter with a thick recipe book, a photocopier beside it',
  words: [
    'Jamal cut his finger and a week later the skin was whole again, made of new cells. He also learned that a baby starts from two cells, one from each parent. If cells just copied themselves, how did the copy know when to be whole and when to be half?',
    'His teacher used a recipe book. Every one of Jamal\'s cells holds the same book: forty-six pages, his chromosomes. To heal a cut, a cell photocopies all forty-six and splits in two. Both new cells have the whole book. That is mitosis.',
    'Meiosis is different. It makes egg and sperm cells, and it copies only half the book, twenty-three pages, into each of four cells. Then a half-book from each parent joins to make a whole new one. Forty-six pages again, but a book nobody has ever read before.',
    'Mitosis makes two identical cells for growth and repair. Meiosis makes four cells with half the chromosomes, for eggs and sperm, so two halves can make a new whole. One book, copied two ways, for two different jobs.',
  ],
};
STORIES['protein-synthesis'] = {
  about: 'a library book that never leaves the building, and the photocopy that does',
  more: [{ serial: 'S861', after: 1, alt: 'The chained book, DNA, in a room marked nucleus' }, { serial: 'S862', after: 3, alt: 'A workbench reading the copy three letters at a time, beads threaded into a chain' }],
  title: 'The book that stays', art: 'S860', cast: [],
  alt: 'A girl at a library photocopier copying one page from a large reference book chained to a desk',
  words: [
    'Priya read that DNA holds the instructions for every protein in the body, and that DNA never leaves the nucleus. So how did the instructions get to where the proteins were built? A recipe locked in a room cannot cook anything.',
    'Her teacher pointed at the reference book chained to the library desk. You cannot take it home. You can photocopy one page.',
    'DNA is the chained book. Transcription photocopies one recipe, one gene, into a strip of RNA that can leave the nucleus. Translation happens at the ribosome, which reads the RNA three letters at a time, and each three-letter word names one amino acid. Bead by bead, the amino acids link into a protein.',
    'Transcription copies a gene into RNA; translation reads that RNA three letters at a time to build a protein. The book stays in the library, and the photocopy does the cooking.',
  ],
};
STORIES['carbon-and-nitrogen-cycles'] = {
  about: 'one carbon atom riding the air, a leaf, a rabbit and a fox, and never getting off',
  more: [{ serial: 'S864', after: 1, alt: 'The carbon atom in a leaf, then in a rabbit, then breathed back out' }, { serial: 'S865', after: 3, alt: 'Bacteria at a plant root turning air nitrogen into food' }],
  title: 'The atom on the bus', art: 'S863', cast: [],
  alt: 'A boy in a meadow watching a rabbit nibble a leaf, a small drawn atom hopping from air to leaf to rabbit',
  words: [
    'Theo asked where the carbon in his sandwich had come from. The bread, his teacher said. The wheat. And before the wheat? The air. Theo did not believe that bread was made of air.',
    'She followed one carbon atom. It rode the air as carbon dioxide. A wheat leaf pulled it in and built it into sugar. A rabbit ate the leaf and breathed the carbon back out. A different leaf caught it. A fox ate the rabbit. The atom never got off the bus.',
    'Nitrogen rides a different loop. Most of the air is nitrogen, but plants cannot use it straight from the sky. Bacteria in the soil change it into a form roots can drink, and animals eat the plants. When things die and rot, bacteria hand the nitrogen back to the soil and the air.',
    'Carbon and nitrogen circle between air, soil, water and living things. Plants take carbon from the air, bacteria make nitrogen usable, and nothing is ever used up. The atoms in the sandwich have been on the bus for a billion years.',
  ],
};
STORIES['homeostasis'] = {
  about: 'a body that works like a thermostat, sensing a change and undoing it',
  more: [{ serial: 'S867', after: 1, alt: 'Sweat on a hot day, cooling the skin' }, { serial: 'S868', after: 3, alt: 'Shivering on a cold day, warming up' }],
  title: 'The thermostat inside', art: 'S866', cast: [],
  alt: 'A girl adjusting a wall thermostat, a faint drawing of a body beside it with the same dial on its chest',
  words: [
    'On the hottest day of the year Ana\'s temperature was 98.6, and on the coldest day it was 98.6. She had never once thought about it. Then her teacher asked how a body knows.',
    'Ana thought about the thermostat in the hallway. Set it to 70. When the room gets warm, the cooling comes on. When it gets cold, the heat comes on. The room drifts, the thermostat notices, and it pushes the other way.',
    'That is homeostasis, and the push is called negative feedback: sense a change, act to undo it. Too hot, sweat, and the sweat cools you. Too cold, shiver, and the shivering warms you. Then stop. Blood sugar works the same way, with insulin after a meal and glucagon between them.',
    'Homeostasis keeps the inside steady by negative feedback: sense a change, act to undo it. Temperature and blood sugar both run on it. The thermostat in the hallway is the body\'s oldest idea.',
  ],
};
STORIES['analysis-paragraph'] = {
  about: 'a quotation that proved nothing until the sentence after it',
  more: [{ serial: 'S870', after: 1, alt: 'The claim and the quotation with nothing after them' }, { serial: 'S871', after: 3, alt: 'The added sentence, glowing, connecting the two' }],
  title: 'The sentence after the quote', art: 'S869', cast: [],
  alt: 'A girl at a desk with a paragraph on her screen, a quotation in the middle and a blank line beneath it',
  words: [
    'Rosa\'s paragraph was two sentences long. Claim: the narrator is lonely. Quote: the house held its breath. She had found the perfect line and she was done. Her teacher wrote one word in the margin: so?',
    'So? The quote proved it. The house held its breath. That was loneliness. Rosa read it again and saw that the quote did not say lonely anywhere. It said house and breath. She was the one who had connected them, in her head, and never on the page.',
    'She wrote the missing sentence. A house that holds its breath is waiting for someone, and so is the narrator; the author makes the building feel what she cannot say. Claim, quotation, and then a sentence saying what the quotation shows. The third sentence was the analysis. The first two were setup.',
    'An analysis paragraph is a claim, a quotation, and a sentence saying what the quotation shows. The quotation alone proves nothing; the sentence after it does the proving. Rosa had skipped the only sentence that was hers.',
  ],
};
STORIES['narrative-with-a-turn'] = {
  about: 'an ordinary evening, a phone that rang, and the writer who learned to slow down there',
  more: [{ serial: 'S873', after: 1, alt: 'Dinner dishes and a math book, everything ordinary' }, { serial: 'S874', after: 3, alt: 'A hand reaching for the ringing phone, the clock stopped' }],
  title: 'The phone rang', art: 'S872', cast: [],
  alt: 'A boy at a kitchen table with homework as a phone rings on the counter, the moment frozen',
  words: [
    'Kai wrote about the night his family got the news, and the whole thing took four sentences. Dinner. Homework. The phone rang. It was Grandma, and she was okay. His teacher said the story had a turn and he had driven straight past it.',
    'A turn? Kai said the phone rang and that was that. But when he thought back, the ten seconds between the ring and the voice had lasted an hour. He had written them in three words.',
    'He wrote it again. Everything ordinary first: the dishes, the math book, his brother humming. Then the phone, and he slowed all the way down. The second ring. His mother\'s hand stopping over the plate. The way nobody moved. Then the voice, and the way the kitchen changed color. The ending showed what had changed: he did the dishes without being asked.',
    'A narrative builds toward a turn, slows down at it, and lets the ending show what changed. The turn is the reason the story exists, and it deserves the most words, not the fewest.',
  ],
};
STORIES['rhetorical-analysis'] = {
  about: 'a speech taken apart into what it argued and how, by a boy who agreed with every word',
  more: [{ serial: 'S876', after: 1, alt: 'The transcript marked: a librarian\'s twenty years, a child\'s story, a chart' }, { serial: 'S877', after: 3, alt: 'A notebook with three questions and three answers' }],
  title: 'Taking it apart', art: 'S875', cast: [],
  alt: 'A boy in an auditorium with a speech transcript, three colored highlighters laid across it',
  words: [
    'Sam agreed with the speech completely. Fund the library. He wrote that it was a great speech and turned it in. His teacher handed it back and said she had not asked whether he agreed. She had asked how it was made.',
    'How it was made? It was made of words, and the words were right. Sam did not see what else there was to say.',
    'Three questions. What does it argue? Fund the library. Which appeals does it use? A librarian\'s twenty years, for ethos; a child who learned to read there, for pathos; a chart of circulation against budget, for logos. Do the appeals fit the claim? Mostly. The child was moving, but the chart did the real work, and the speech leaned harder on the child. Sam still agreed. Now he could say why the speech worked and where it wobbled.',
    'A rhetorical analysis asks what a text argues, which appeals it uses, and whether they fit the claim. Judge the making, not whether you agree. Agreeing is a feeling; analysis is a job.',
  ],
};
STORIES['the-shape-of-the-earth'] = {
  about: 'a cracked shell on a soft-boiled egg, and the planet under a girl\'s feet',
  more: [{ serial: 'S879', after: 1, alt: 'Two shell pieces pushed together, one riding up over the other' }, { serial: 'S880', after: 3, alt: 'A world map with mountain ranges and ocean ridges drawn along the cracks' }],
  title: 'The cracked egg', art: 'S878', cast: [],
  alt: 'A girl at breakfast holding a soft-boiled egg with its shell cracked into plates',
  words: [
    'Maya cracked her breakfast egg all over and stopped with the spoon in the air. The shell was in pieces, but the pieces still covered the egg, sliding a little on the soft inside. Her father said she was looking at the Earth.',
    'The Earth was not an egg, Maya said. It was rock all the way down. Her father asked why, then, there were mountains in some places and earthquakes in others and not everywhere.',
    'Because the crust is cracked into plates, riding on hot, soft rock beneath. Where two pieces push together, one rides up: mountains. Where they grind past each other, they stick and jerk: earthquakes. Where they pull apart, the soft inside rises and hardens: new ocean floor. Mountains sit along the cracks, not in the middle of the pieces.',
    'The Earth\'s crust is broken into plates, and mountains, earthquakes and new ocean floor happen where they meet. Mountain ranges and volcano chains follow the plate edges, which is why a map of them looks like a cracked shell.',
  ],
};
STORIES['climate-and-biomes'] = {
  about: 'three dials that set a climate, turned one at a time on a family road trip',
  more: [{ serial: 'S882', after: 1, alt: 'The car climbing from green valley to snow' }, { serial: 'S883', after: 3, alt: 'A coast town under mild skies next to a desert inland' }],
  title: 'Three dials', art: 'S881', cast: [],
  alt: 'A boy in a car on a mountain road, three drawn dials on the dashboard for latitude, height and distance to the sea',
  words: [
    'Jamal\'s family drove from the coast into the mountains in one day, and he wore shorts at breakfast and a coat at dinner. Same country, same date. He asked why the weather had changed so much in three hundred miles.',
    'His mother said three dials had turned. Jamal thought weather was just weather. She asked him to name what had changed about where they were.',
    'Farther from the sea, so the mild air that the ocean lends a coast was gone. Higher up, and temperature drops about six degrees Celsius for every thousand meters. And on a longer trip, farther from the equator, where the sun strikes at a slant. Latitude, elevation and nearness to water. Turn those three dials and you set a climate, and the climate sets what grows, which is the biome.',
    'Latitude, elevation and nearness to water decide climate, and climate decides the biome. Temperature drops about six degrees Celsius per thousand meters of height, which is why one road can pass through summer and winter.',
  ],
};
STORIES['reading-maps'] = {
  about: 'a map as a shrunken photograph, and the hour that lived in every fifteen degrees',
  more: [{ serial: 'S885', after: 1, alt: 'A ruler on the map: one centimeter, ten kilometers' }, { serial: 'S886', after: 3, alt: 'A globe with time zones drawn as slices' }],
  title: 'The shrunken photograph', art: 'S884', cast: [],
  alt: 'A girl with a paper map and a ruler on a kitchen table, a clock and a globe beside her',
  words: [
    'Lena measured her hike on the map. Four centimeters. Her father said that was forty kilometers and she would need more than a sandwich. Lena did not see how four centimeters of paper could be forty of anything.',
    'A map is a photograph that has been shrunk, he said, and the scale tells you by how much. One centimeter on the map, ten kilometers on the ground. Four centimeters, forty kilometers. Lena put the hike off.',
    'Then she noticed the map\'s edge marked degrees of longitude, and asked what those were for. The Earth turns all the way around, 360 degrees, in a day, so it turns fifteen degrees every hour. Every fifteen degrees east, the clocks read an hour later. The map held distances and time in the same lines.',
    'Scale turns a distance on the map into a distance on the ground. The Earth turns fifteen degrees of longitude every hour, so time zones follow the lines. A map is a shrunken photograph with a clock printed on it.',
  ],
};
STORIES['people-and-places'] = {
  about: 'a city block, a ranch, and the arithmetic of where people are',
  more: [{ serial: 'S888', after: 1, alt: 'Two thousand people on one block, windows stacked high' }, { serial: 'S889', after: 3, alt: 'Ten people on a ranch the size of a town' }],
  title: 'The block and the ranch', art: 'S887', cast: [],
  alt: 'A boy looking from a dense apartment block toward a distant ranch under a wide sky',
  words: [
    'Owen\'s cousin lived on a ranch with ten people for miles. Owen lived on a block with two thousand. His cousin said the ranch was bigger. Owen said the city was. They were both right about different things, and neither knew the word for it.',
    'The word was density: people divided by area. The ranch had more land. The block had more people per square mile, by a factor of thousands. Same country, two ways to live in it.',
    'Then the class looked at how places grow. Natural increase is births minus deaths, per thousand people a year. The urban share is the fraction living in cities, and it has been climbing for two centuries as farms need fewer hands and factories and offices need more. Owen\'s block was the whole trend in one street.',
    'Density is people divided by area. Natural increase is births minus deaths per thousand. The urban share is city people over all people, and most of the world now lives on the block, not the ranch.',
  ],
};
STORIES['resources-and-work'] = {
  about: 'a paycheck that keeps coming, a jar of coins that does not, and the four kinds of work',
  more: [{ serial: 'S891', after: 1, alt: 'A forest regrowing after a cut and a wind turbine turning' }, { serial: 'S892', after: 3, alt: 'A coal seam, used once, empty behind it' }],
  title: 'The paycheck and the jar', art: 'S890', cast: [],
  alt: 'A girl at a kitchen table between a paycheck envelope and a jar of coins, a window onto a forest and a mine',
  words: [
    'Rosa\'s mother got a paycheck every two weeks. Rosa had a jar of coins that got smaller every time she reached in. Her teacher said the world\'s resources came in those two kinds too.',
    'Rosa did not see how a forest was like a paycheck. Then she cut a Christmas tree with her uncle, and he pointed at the seedlings he had planted where last year\'s trees had stood.',
    'Trees regrow. Wind keeps blowing. Sunlight arrives every morning. Those are renewable, the paycheck that keeps coming. Coal, oil and copper are the jar: used once, and the jar gets lighter. And the work people do with resources comes in four kinds: primary takes them from the ground, secondary makes things from them, tertiary provides services, quaternary works with knowledge.',
    'Renewable resources come back and nonrenewable ones are used once. Work is primary, secondary, tertiary or quaternary, from the mine to the factory to the shop to the lab. A country\'s mix of the four says what stage it is in.',
  ],
};
STORIES['regions-of-the-world'] = {
  about: 'a map drawn with eyes closed, and the geographer who could',
  more: [{ serial: 'S894', after: 1, alt: 'A blank outline of the world with a few capitals pinned' }, { serial: 'S895', after: 3, alt: 'The same map filling in: Cairo, Paris, Brasília, Ottawa, Mexico City' }],
  title: 'The map behind your eyes', art: 'S893', cast: [],
  alt: 'A boy with his eyes shut drawing a rough world map on a whiteboard while classmates watch',
  words: [
    'The teacher asked Diego to close his eyes and point to Egypt on the wall map. He pointed at Brazil. Then she asked which sea lay between Italy and Africa. Diego had no idea there was one.',
    'He said he could look anything up in two seconds. She agreed. Then she asked how he would know a news story was wrong if he could not picture where it happened.',
    'A geographer carries a map behind the eyes: which countries share a border, which capital goes with which flag, what sea a ship would cross. Mexico City, Ottawa, Brasília, Paris, Berlin, Cairo, Nairobi, Beijing, Tokyo, Canberra. Diego started with ten capitals and one sea, the Mediterranean, and by spring he could draw the world badly with his eyes closed, which is the whole idea.',
    'A geographer carries a mental map of countries, capitals and features. Looking it up tells you where something is; knowing it lets you notice when something is wrong. Draw the world badly from memory, then fix it, and it stays.',
  ],
};
STORIES['angle-relationships'] = {
  about: 'two sticks crossed on a table, and the angles that had to match',
  more: [{ serial: 'S897', after: 1, alt: 'The crossed sticks with the two opposite angles shaded the same color' }, { serial: 'S898', after: 3, alt: 'A triangle cut from paper, its three corners torn off and lined up flat' }],
  title: 'The bow tie', art: 'S896', cast: [],
  alt: 'A girl crossing two chopsticks on a table, the four angles between them drawn faintly',
  words: [
    'Ana crossed two chopsticks on the table and her brother bet her that the angle on the left was bigger than the one on the right. She measured. They were the same. She twisted the sticks and measured again. Still the same, and she could not see why.',
    'Two sticks make four angles, like a bow tie. The two across from each other always matched, no matter how she twisted them. Not roughly. Exactly. That felt like a trick.',
    'It was not a trick. Any two angles side by side along one stick add to 180, a straight line. The left angle and the top angle add to 180. The right angle and the top angle add to 180. So left and right are both 180 minus the top: equal. Then she tore the three corners off a paper triangle and laid them side by side. A straight line. 180.',
    'Opposite angles are equal. Angles on a straight line add to 180. The three angles of a triangle add to 180. Three facts, and the first two prove the third if you draw one line and look.',
  ],
};
STORIES['similar-triangles'] = {
  about: 'a photo and its enlargement, and the number that made them the same shape',
  more: [{ serial: 'S900', after: 1, alt: 'A 3-4-5 triangle beside a 6-8-10 triangle, the same angles marked' }, { serial: 'S901', after: 3, alt: 'A ruler on both photos, one side four inches, the other twelve' }],
  title: 'The enlargement', art: 'S899', cast: [],
  alt: 'A boy at a print shop counter holding a small photo next to its poster-sized enlargement',
  words: [
    'Owen had a photo enlarged into a poster, and the poster looked exactly like the photo, only big. He measured a triangle in the picture: 3, 4 and 5 inches. On the poster it was 6, 8 and 10. He assumed the shop had added three to each side. Then it would have been 6, 7 and 8.',
    'It was not. Every side had been doubled. And the angles, when he checked them with a protractor, had not changed at all. The shape was the same. Only the size had moved.',
    'That is what similar means. Same angles, same shape, every length multiplied by the same number, the scale factor. From the photo to the poster the factor was 2. From the poster back to the photo it was one half. Find one pair of matching sides, divide, and you have the factor for every other pair.',
    'Same angles means the same shape. Find the scale factor from one pair of matching sides, then multiply every side by it. An enlargement is a triangle wearing a bigger coat.',
  ],
};
STORIES['transformations'] = {
  about: 'a picture moved on a wall, flipped in a mirror and turned a quarter, in the language of coordinates',
  more: [{ serial: 'S903', after: 1, alt: 'The picture slid right, every point shifted the same amount' }, { serial: 'S904', after: 3, alt: 'The picture turned a quarter turn, its corners swapped' }],
  title: 'The picture on the wall', art: 'S902', cast: [],
  alt: 'A girl holding a framed picture against a wall marked with a faint grid, a mirror on the door beside it',
  words: [
    'Lena hung a picture and her father said it was crooked. She slid it right. Then she turned it a quarter turn for fun and held it against the mirror on the door. Her homework that night had the same three moves with numbers on them, and she did not recognize them.',
    'The homework said translate, reflect, rotate. Lena had been doing exactly those things with a picture frame and a mirror an hour earlier.',
    'Slide it: add to the coordinates, the same amount to every point. Flip it across a mirror: change one sign, x for a vertical mirror, y for a horizontal one. Turn it a quarter turn: (x, y) becomes (-y, x). Every point on the picture obeys the same rule at once, which is why the picture stays a picture.',
    'Translate by adding to the coordinates. Reflect by flipping one sign. Rotate a quarter turn by sending (x, y) to (-y, x). The frame does not care what you call the moves; the coordinates do.',
  ],
};
STORIES['right-triangle-trig'] = {
  about: 'a boy standing at one corner of a triangle, naming the sides from where he stood',
  more: [{ serial: 'S906', after: 1, alt: 'The three sides labeled from his corner: opposite, adjacent, hypotenuse' }, { serial: 'S907', after: 3, alt: 'SOH CAH TOA written on the ground in chalk' }],
  title: 'Standing at the corner', art: 'S905', cast: [],
  alt: 'A boy standing at one corner of a large triangle chalked on the ground, pointing across at the far side',
  words: [
    'Sam could never remember which side was opposite and which was adjacent, so he chalked a big right triangle on the playground and stood in one corner. His teacher said that was the whole secret. The names depend on where you stand.',
    'From his corner, one side lay across from him: opposite. One side ran beside him along the ground: adjacent. The long slanted side, across from the right angle, was the hypotenuse no matter where he stood.',
    'Sine was opposite over hypotenuse. Cosine was adjacent over hypotenuse. Tangent was opposite over adjacent. SOH CAH TOA. He walked to the other sharp corner and the opposite and adjacent sides swapped names, because he had swapped corners. The ratios followed the angle he stood at, which was the point.',
    'Sine is opposite over hypotenuse, cosine is adjacent over hypotenuse, tangent is opposite over adjacent. The side names depend on which angle you stand at, and the ratios belong to that angle.',
  ],
};
STORIES['arcs-and-sectors'] = {
  about: 'a quarter of a pizza, and the fraction that ran the whole circle',
  more: [{ serial: 'S909', after: 1, alt: 'The quarter slice with its crust edge highlighted' }, { serial: 'S910', after: 3, alt: 'A circle with a 60-degree wedge shaded, one sixth' }],
  title: 'A quarter of the pizza', art: 'S908', cast: [],
  alt: 'A girl at a pizzeria cutting one quarter from a whole pizza, a ninety-degree angle drawn at the center',
  words: [
    'Rosa cut a quarter out of the pizza and her little brother asked how much crust he was getting. Rosa said a quarter, obviously. He asked how much pizza. A quarter. He asked how she knew both without measuring anything.',
    'She had not thought about it. The cut made a ninety-degree angle at the center. Ninety out of the whole 360 was a quarter. So a quarter of everything: crust, sauce, cheese, area.',
    'That was the rule. Angle over 360 is the fraction of the circle. Multiply the circumference by it and you get the arc, the crust. Multiply the area by it and you get the sector, the slice. A sixty-degree slice is a sixth of both. Her brother measured the crust with a string to check, and it came out a quarter.',
    'Angle over 360 is the fraction of the circle. Multiply the circumference by that fraction for the arc and the area by it for the sector. One angle at the center runs the whole slice.',
  ],
};
STORIES['spotting-bias'] = {
  about: 'an article where every fact was true and the middle was missing',
  more: [{ serial: 'S912', after: 1, alt: 'Charged words in the article circled: slammed, admitted, so-called' }, { serial: 'S913', after: 3, alt: 'A list of people quoted, with an empty line where the other side should be' }],
  title: 'The missing middle', art: 'S911', cast: [],
  alt: 'A girl at a kitchen table with a newspaper article, a wide blank gap drawn through its middle',
  words: [
    'Lena checked every fact in the article about the new park and every one was true. So she wrote that it was unbiased, and her teacher wrote back that true was not the same as fair. Lena had no idea how a page of true facts could lean.',
    'She read it again looking for a lie and found none. Then she read it looking for what was not there. The cost of the park was in the first paragraph. The cost of doing nothing was nowhere. The mayor had slammed the plan; the planners had admitted a delay; the so-called experts had spoken.',
    'Bias is a lean, not a lie. It lives in three places: the facts left out, the charged words that carry a verdict, and the voices missing from the page. Every person quoted opposed the park. Not one family who would use it had been asked. The middle of the story was simply gone.',
    'Bias is a lean, not a lie. Look for missing facts, charged words and missing voices. A page can be true in every sentence and still tell only half the story, and the half it leaves out is the bias.',
  ],
};
STORIES['paraphrasing'] = {
  about: 'the same cargo moved into a different truck, with nothing dropped and nothing added',
  more: [{ serial: 'S915', after: 1, alt: 'The original sentence and the paraphrase side by side, facts numbered' }, { serial: 'S916', after: 3, alt: 'One box left behind on the dock, circled' }],
  title: 'A different truck', art: 'S914', cast: [],
  alt: 'A boy at a loading dock moving boxes from one truck to another, counting them on a clipboard',
  words: [
    'Marcus paraphrased the paragraph and was proud of it, because not a single word matched the original. His teacher counted the facts in each. The original had five. Marcus\'s had three, plus one the author had never said.',
    'He had thought a paraphrase was about changing the words. It was about keeping the cargo. He had moved the load into a new truck and dropped two boxes on the dock, and somehow picked up a box that was not his.',
    'So he checked fact by fact. Who: kept. When: dropped, put back. How many: dropped, put back. The claim about why, which he had added because it seemed obvious: not in the original, out. Now the new truck carried exactly what the old one had, in different words.',
    'A paraphrase keeps every fact and adds none. Check yours against the original, fact by fact, the way a driver checks a manifest. Different words, same cargo, nothing on the dock.',
  ],
};
STORIES['complex-characters'] = {
  about: 'a character who wanted two things that could not both be had, and the reader who tracked which won',
  more: [{ serial: 'S918', after: 1, alt: 'The character on one page choosing safety, on the next choosing her brother' }, { serial: 'S919', after: 3, alt: 'A tally of scenes, one column for each want' }],
  title: 'Two wants', art: 'S917', cast: [],
  alt: 'A girl reading a novel in bed, a tug-of-war rope drawn above the page with two words at its ends',
  words: [
    'Rosa said the main character was inconsistent. In one chapter she risked everything for her brother and in the next she lied to stay safe. Rosa called that bad writing. Her teacher said it was the point of the book.',
    'A simple character wants one thing. A complex character wants two things that pull against each other, and cannot have both. This one wanted to keep her brother and wanted to stay alive, and the story was built from the scenes where she had to pick.',
    'Rosa went back and made a tally. Chapter three: brother. Chapter five: safety. Chapter nine: brother, at a cost. By the end the pattern was the story. Safety kept winning until it did not, and the scene where the brother won for good was the climax. She had not been inconsistent. She had been torn.',
    'A complex character wants two things that pull against each other. Name both, then watch which wins in each scene. The scenes where the tally flips are where the story lives.',
  ],
};
STORIES['symbols'] = {
  about: 'a green light mentioned four times, and what it meant each time',
  more: [{ serial: 'S921', after: 1, alt: 'Four bookmarks in a novel, each at a page with the same light' }, { serial: 'S922', after: 3, alt: 'The light seen from four distances, the last one very close and ordinary' }],
  title: 'The green light', art: 'S920', cast: [],
  alt: 'A boy on a dark dock looking across water at a small green light, the novel in his hand',
  words: [
    'Owen noticed a green light at the end of a dock mentioned on page one, and thought nothing of it. Then it came back on page forty. Then again on ninety. By the fourth time he was sure the author was doing it on purpose, and he had no idea why.',
    'A light is a light. But nobody mentions the same light four times by accident. Repetition was the signal. The question was what the thing stood for, and the answer changed with what the character was going through each time.',
    'On page one the character reached toward it: hope, a future he wanted. Later, when he had almost reached it, the light was just a bulb on a dock, smaller than it had looked. By the end it stood for the way wanting a thing can be better than having it. The light never changed. His situation did, and so did the meaning.',
    'A symbol is a thing that stands for an idea. Repetition is the signal, and the character\'s situation each time tells you the meaning. Four green lights, one bulb, four different things.',
  ],
};
STORIES['ionic-and-covalent'] = {
  about: 'two ways to share a toy, and the two ways atoms hold on to each other',
  more: [{ serial: 'S924', after: 1, alt: 'Sodium handing its electron to chlorine, the two sticking' }, { serial: 'S925', after: 3, alt: 'Two hydrogens and an oxygen holding electrons between them' }],
  title: 'Two ways to share', art: 'S923', cast: [],
  alt: 'Two small children with a toy, one handing it over and two others holding it together, atoms drawn faintly above them',
  words: [
    'Theo watched his little cousins fight over a toy until their mother stepped in with two rules. Either one of you gives it up, or you both hold it at the same time. His chemistry homework that night had the same two rules with electrons instead of a truck.',
    'Sodium and chlorine were the first kind. Sodium handed its outer electron to chlorine and let go. Now one was positive and one was negative, and opposites attract, so they stuck. That was ionic, and it made table salt.',
    'Two hydrogens and an oxygen were the second kind. Nobody gave anything up. They held the electrons between them, both hands on the toy, and that holding was the bond. That was covalent, and it made water. Metal with nonmetal tends to give; nonmetal with nonmetal tends to share.',
    'Ionic bonds give electrons; covalent bonds share them. Metal plus nonmetal is ionic, nonmetal plus nonmetal is covalent. Two rules for a toy, and two rules for everything solid, liquid and gas.',
  ],
};
STORIES['balancing-equations'] = {
  about: 'a pile of bricks taken apart and rebuilt, with every brick accounted for',
  more: [{ serial: 'S927', after: 1, alt: 'Two red pairs and one blue pair before rebuilding' }, { serial: 'S928', after: 3, alt: 'Two new pieces, each made of two red and one blue' }],
  title: 'Bricks in, bricks out', art: 'S926', cast: [],
  alt: 'A boy on the floor with red and blue building bricks, taking a small structure apart and rebuilding it',
  words: [
    'Kai wrote hydrogen plus oxygen makes water, H₂ + O₂ → H₂O, and felt done. His teacher counted the atoms. Two oxygen on the left, one on the right. Kai had lost an oxygen atom somewhere between the arrow\'s two ends.',
    'Atoms do not vanish. Whatever goes into a reaction comes out of it, just rearranged. Kai thought about his brother\'s building bricks. Take a structure apart and you can build something new, but you never end up with fewer bricks.',
    'So he counted bricks. Two H₂ and one O₂: four hydrogen bricks, two oxygen bricks. Rebuild them into two H₂O: four hydrogen, two oxygen. 2H₂ + O₂ → 2H₂O. He had changed the big numbers in front, how many of each piece, and never the small numbers inside, which would have changed what the piece was.',
    'Balanced means every atom counted the same on both sides. Change the big numbers in front, never the small numbers inside. Bricks in, bricks out, and nothing left on the floor.',
  ],
};
STORIES['acids-and-bases'] = {
  about: 'lemon juice, soap and water on a ruler that ran from 0 to 14',
  more: [{ serial: 'S930', after: 1, alt: 'The strip with lemon at 2, water at 7, soap at 9' }, { serial: 'S931', after: 3, alt: 'Vinegar and baking soda fizzing in a bowl, meeting in the middle' }],
  title: 'The ruler from 0 to 14', art: 'S929', cast: [],
  alt: 'A girl at a kitchen counter with a lemon, a bar of soap and a glass of water lined up beside a color strip',
  words: [
    'Maya\'s kitchen had three liquids on the counter and she tasted two of them by accident. Lemon juice bit. Soapy water tasted awful and felt slippery. Plain water tasted like nothing. She had just met the whole pH scale.',
    'Below 7 is acid, like the lemon. Exactly 7 is neutral, like water. Above 7 is base, like soap. Maya assumed 2 was a little more sour than 3.',
    'Each step is ten times. Lemon juice at 2 is ten times more acidic than something at 3 and a hundred times more than something at 4. And an acid and a base cancel each other toward 7: she poured vinegar onto baking soda, it fizzed, and what was left was closer to neutral than either had been.',
    'Below 7 is acid, 7 is neutral, above 7 is base. Each step is ten times, and an acid and a base cancel toward 7. The ruler runs from lemon to soap with water in the middle.',
  ],
};
STORIES['moles-and-molar-mass'] = {
  about: 'a dozen eggs, a dozen grapes, and the chemist\'s dozen',
  more: [{ serial: 'S933', after: 1, alt: 'Twelve eggs and twelve grapes, same count, different weight' }, { serial: 'S934', after: 3, alt: 'A water molecule with its atoms labeled and their masses added' }],
  title: 'A dozen for chemists', art: 'S932', cast: [],
  alt: 'A boy at a grocery scale weighing a dozen eggs and a dozen grapes side by side',
  words: [
    'At the store, Jamal weighed a dozen eggs and a dozen grapes. Same count, wildly different mass. His mother said chemists have a dozen too, only enormous, and it works the same way.',
    'A mole is a fixed count of particles, six hundred billion trillion of them. A mole of hydrogen atoms and a mole of oxygen atoms have the same count and different mass, like the eggs and the grapes.',
    'The mass of one mole is the molar mass, in grams, and you read it off the periodic table. Hydrogen is about 1, oxygen about 16. For water, add up the atoms in the formula: two hydrogens, 2, plus one oxygen, 16. Eighteen grams in a mole of water. A dozen tells you how many; the scale tells you how heavy.',
    'A mole is a fixed count, and molar mass is the grams in one mole. Add up the atoms in the formula, each times its mass. A dozen eggs and a dozen grapes taught the whole idea.',
  ],
};
STORIES['reaction-types'] = {
  about: 'things that snap together, split apart, swap partners or burn, sorted by counting',
  more: [{ serial: 'S936', after: 1, alt: 'Two pieces snapping into one, then one splitting into two' }, { serial: 'S937', after: 3, alt: 'A candle burning, oxygen drawn arriving from the air' }],
  title: 'Snap, split, swap, burn', art: 'S935', cast: [],
  alt: 'A girl at a lab bench with four small cards showing pieces joining, splitting, swapping and burning',
  words: [
    'Rosa faced a list of twenty reactions and one instruction: sort them. They looked like alphabet soup. Her teacher told her to ignore the letters and count what went in and what came out.',
    'Two things in, one thing out: A and B snap into AB. Synthesis. One thing in, two out: AB splits into A and B. Decomposition. Suddenly the list had shape.',
    'One element and a compound in, and the element takes a partner\'s place: single replacement. Two compounds in and they swap partners: double replacement. And anything with oxygen going in and carbon dioxide and water coming out was combustion, the thing burning. Twenty reactions, five bins, sorted by counting.',
    'Synthesis joins, decomposition splits, replacements swap, and combustion burns with oxygen. Count what goes in and what comes out, and the type names itself.',
  ],
};
STORIES['gas-laws'] = {
  about: 'a balloon squeezed in a fist, left in a hot car and shut in the freezer',
  more: [{ serial: 'S939', after: 1, alt: 'The balloon squeezed to half its size, straining' }, { serial: 'S940', after: 3, alt: 'The same balloon shrunken after an hour in the freezer' }],
  title: 'The balloon', art: 'S938', cast: [],
  alt: 'A boy squeezing a balloon in a parked car, the balloon puffed larger in the heat',
  words: [
    'Diego squeezed a balloon in his fist and it pushed back harder the smaller he made it. He left another in the hot car and came back to find it fat and tight. He put a third in the freezer and it shriveled. Three balloons, three surprises, one gas.',
    'His science teacher said the same rules ran all three. Diego thought a balloon was just rubber and air.',
    'Squeeze a gas and its pressure rises, because the same molecules hit the walls more often: halve its space and its pressure doubles, so pressure times volume stays the same. Heat a gas and the molecules move faster, so it expands if it can or its pressure rises if it cannot. Cool it and both fall. The balloons had been telling him the gas laws in the language of rubber.',
    'Squeeze a gas and its pressure rises; pressure times volume stays the same. Heat a gas and it expands or its pressure rises; cool it and the reverse. Three balloons is a whole chapter.',
  ],
};
STORIES['concentration'] = {
  about: 'lemonade that was too strong, and the two ways to fix it',
  more: [{ serial: 'S942', after: 1, alt: 'Four spoons of sugar going into two glasses' }, { serial: 'S943', after: 3, alt: 'Water poured in, the same sugar spread through more liquid' }],
  title: 'How strong the lemonade is', art: 'S941', cast: [],
  alt: 'A girl tasting lemonade at a kitchen counter, a bag of sugar and a pitcher of water beside her',
  words: [
    'Lena put four spoons of sugar into two glasses of lemonade and it was undrinkable. Her brother said take some sugar out. Her mother said add water. Both worked, and Lena wanted to know why two opposite moves fixed the same problem.',
    'Four spoons in two glasses was two spoons per glass. That number, how much stuff per how much liquid, was the strength. You could lower it by cutting the top of the fraction or by raising the bottom.',
    'Chemists call the strength molarity: moles of solute divided by liters of solution. Add water and the solute is unchanged, the same four spoons, but it is spread through more liquid, so the concentration drops. Lena added water. Four spoons in four glasses: one spoon per glass, and the lemonade was right.',
    'Molarity is moles of solute divided by liters of solution. Adding solvent lowers the concentration while the solute stays the same. Too strong means too much per liter, and more liters is the gentlest fix.',
  ],
};
STORIES['literary-analysis'] = {
  about: 'a thesis about the whole book, and the difference between a claim and a summary',
  more: [{ serial: 'S945', after: 1, alt: 'A summary sentence crossed out: the book is about a boy and a river' }, { serial: 'S946', after: 3, alt: 'A thesis sentence with three quotations lined up under it' }],
  title: 'A claim, not a summary', art: 'S944', cast: [],
  alt: 'A girl in a library with a novel and a page of notes, one sentence at the top crossed out and rewritten',
  words: [
    'Ana\'s thesis was that the novel was about a boy who goes down a river and learns about friendship. Her teacher said that was the back cover. Ana said it was true. Her teacher agreed it was true. Nobody could argue with it, and that was the problem.',
    'A summary tells what happens. A thesis makes a claim about what it means, one that a reader could push back on. Ana tried again: the river is the only place the boy can be honest, and every lie he tells happens on land.',
    'Now she had something to prove. She found three quotations, one from the raft, two from towns. After each she wrote a sentence saying what it showed: that the boy speaks plainly on the water and performs on shore. The essay had a spine. The back cover did not.',
    'A literary analysis is a thesis about the text, quotations as evidence, and a sentence after each saying what it shows. The thesis is a claim someone could argue with, not a summary nobody could.',
  ],
};
STORIES['sourced-argument'] = {
  about: 'an argument that named where every fact came from, and the one that did not',
  more: [{ serial: 'S948', after: 1, alt: 'Two cards side by side, one with a source and one blank at the bottom' }, { serial: 'S949', after: 3, alt: 'The boy pointing to the source line as a classmate asks a question' }],
  title: 'Where did you get that?', art: 'S947', cast: [],
  alt: 'A boy at a podium with index cards, each card carrying a small source line at the bottom',
  words: [
    'Diego argued that the school should switch to later start times and gave four strong facts. A classmate asked where the third one came from. Diego said he had read it somewhere. The room went quiet, and the fact he could not source was the one everyone remembered.',
    'The other three had come from a sleep study, a district report and a newspaper, and he knew it. But he had not said so. On paper they looked the same as the one he had picked up who knows where.',
    'He rewrote every card with a source line at the bottom. According to a 2019 study of two thousand students. According to the district\'s own transportation report. The fourth fact he could not trace, so he cut it, and the argument got stronger by getting shorter. Naming the source let the audience check him, which is why they believed him.',
    'Every piece of evidence names its source. That is what separates an argument from an opinion. A fact you cannot trace is not evidence yet, and cutting it makes the case better, not worse.',
  ],
};
STORIES['reflective-essay'] = {
  about: 'what a girl believed before, what changed it, and the gap in between',
  more: [{ serial: 'S951', after: 1, alt: 'The first paragraph: what happened, plainly' }, { serial: 'S952', after: 3, alt: 'The last paragraph: what it meant, with the word before circled' }],
  title: 'Before and after', art: 'S950', cast: [],
  alt: 'A girl writing at a desk with two photographs of herself, one older than the other',
  words: [
    'Priya wrote about the summer she worked at her aunt\'s shop, and it read like a diary. Monday, this happened. Tuesday, that happened. Her teacher said it was a good record and not yet a reflection. Priya asked what the difference was.',
    'A record tells what happened. A reflection tells what it meant, and the meaning lives in a gap. What did you believe before? What do you believe now? What, exactly, happened in between?',
    'Before the summer she believed customers were an interruption. After it she believed the customers were the job. The change happened on a slow Wednesday when an old man came in every day for a week and bought nothing, and her aunt greeted him by name each time. Priya told what happened, then told what it meant, and the essay stopped being a diary.',
    'A reflective essay tells what happened, then what it meant. Say what you believed before, what you believe now, and name the moment that changed it. The gap between the two is the essay.',
  ],
};
STORIES['ancient-civilizations'] = {
  about: 'a river that flooded on schedule, and the surplus that let people build, rule and write',
  more: [{ serial: 'S954', after: 1, alt: 'Granaries full of grain, a scribe counting jars with marks on clay' }, { serial: 'S955', after: 3, alt: 'A city wall rising beside the fields, workers who are not farming' }],
  title: 'The river that kept time', art: 'S953', cast: [],
  alt: 'A boy on a riverbank watching a wide river rise over its banks onto dark fields',
  words: [
    'Kai learned that the first cities grew on rivers and assumed it was for the drinking water. His teacher asked why, then, they grew on the rivers that flooded every year and not on the calm ones.',
    'The floods came on schedule. The Nile rose every summer and left dark, rich mud behind. A farmer on that mud grew more than his family could eat, year after year. The extra was the surplus, and the surplus changed everything.',
    'With a surplus, not everyone had to farm. Some could build walls, some could rule, some could pray, and some had to keep track of whose grain was in which storehouse. Writing began as that accounting: marks on clay for jars and sheep. Only later did anyone use it for a story or a law.',
    'Civilization began on flooding rivers where a surplus freed people to build, rule and write. Writing started as accounting, and cities started as storehouses with walls. The river kept the time, and the people kept the count.',
  ],
};
STORIES['greece-and-rome'] = {
  about: 'everyone votes, then some vote, then one rules, and the founders who studied all three',
  more: [{ serial: 'S957', after: 1, alt: 'Athenian citizens voting by show of hands on a hillside' }, { serial: 'S958', after: 3, alt: 'A Roman senate chamber, then the same chamber with one man on a raised chair' }],
  title: 'Everyone, some, one', art: 'S956', cast: [],
  alt: 'A girl in a museum hall between a Greek assembly relief, a Roman senate relief and a bust of an emperor',
  words: [
    'Rosa read that Athens had a democracy, Rome had a republic, and then Rome had emperors. She could not see why a class needed three words for governments that were all just old.',
    'Her teacher drew three circles. In Athens every citizen voted on every law himself, in a crowd on a hill: direct democracy. In the Roman republic citizens chose senators and consuls to vote for them: representation. Then in 27 BC one man, Augustus, kept the titles and took the power. The republic became an empire while keeping the republic\'s name.',
    'Everyone votes, then some vote, then one rules. Rosa asked which one America was. The founders had read all three stories, and they designed against the last one. Representatives like Rome, elected by the many like Athens, and power split so that no Augustus could gather it up.',
    'Athens invented direct democracy, Rome built a republic that became an empire in 27 BC, and the American founders designed against that ending. Three governments, one lesson about how power moves from everyone to some to one.',
  ],
};
STORIES['middle-ages-and-renaissance'] = {
  about: 'land for loyalty, then a plague that loosened every knot, then a press',
  more: [{ serial: 'S960', after: 1, alt: 'A lord handing land to a knight who kneels' }, { serial: 'S961', after: 3, alt: 'A printing press turning out pages, a crowd reading' }],
  title: 'Land, plague, press', art: 'S959', cast: [],
  alt: 'A boy in a castle courtyard looking at a knight, a plague-emptied village and a printing press in three archways',
  words: [
    'When Rome fell, Marcus assumed Europe fell into chaos and stayed there for a thousand years. His teacher said the years were not empty. They were held together by a deal.',
    'The deal was feudalism: a lord gave land to a knight, the knight gave loyalty and soldiers, and peasants worked the land for protection. Everyone was tied to someone above them. It was not fair, but it held, and it held for centuries.',
    'Then in 1347 the Black Death killed a third of Europe, and suddenly there were too few workers for the land. A peasant could leave and be paid elsewhere. The knots loosened. Into that loosened world came the Renaissance, a rebirth of learning. Around 1450 came the printing press, which put books in the hands of people who had never been allowed to own one.',
    'Feudalism held Europe together after Rome; the Black Death of 1347 loosened it; the Renaissance and the printing press of about 1450 spread ideas faster than any lord could stop. Land, then plague, then press.',
  ],
};
STORIES['age-of-revolutions'] = {
  about: 'one idea, three revolutions, and the different endings it got',
  more: [{ serial: 'S963', after: 1, alt: 'A quill signing a declaration in 1776' }, { serial: 'S964', after: 3, alt: 'A crowd in Paris in 1789, then the same square in a darker year' }],
  title: 'One idea, three endings', art: 'S962', cast: [],
  alt: 'A girl in a library with three books open: a declaration, a guillotine sketch and a slave rebellion',
  words: [
    'Ana read about the American, French and Haitian revolutions in one week and assumed they were three copies of the same event. Her teacher asked her to find the sentence all three began with.',
    'It was an Enlightenment idea: rights come first, and governments exist only by the consent of the governed. America tested it in 1776 and wrote a constitution that held. France tested it in 1789 and fell into terror, then an emperor. Haiti\'s enslaved people tested it in 1791 and won the only successful slave revolution in history.',
    'Same idea, three endings. Ana asked why. Her teacher said an idea is a seed, and the ground it lands on matters: who holds the army, how deep the hunger runs, whether the old order fights back or leaves. The seed was the same. The soil was not.',
    'The Enlightenment said rights come first and governments come from consent; America tested it in 1776, France in 1789 and Haiti in 1791, with three different endings. One idea can grow into a republic, a terror or a freedom, depending on the ground.',
  ],
};
STORIES['world-wars'] = {
  about: 'two wars twenty years apart, and the peace between them that made the second',
  more: [{ serial: 'S966', after: 1, alt: 'A signing hall in 1919, the treaty on the table, defeated men outside' }, { serial: 'S967', after: 3, alt: 'A memorial wall with too many names to read' }],
  title: 'Twenty years apart', art: 'S965', cast: [],
  alt: 'A boy walking between rows of white headstones with two dates, 1918 and 1945, on a stone at the end',
  words: [
    'Theo\'s great-grandfather had fought in the First World War and his grandfather in the Second, and Theo thought that was just bad luck in one family. His history teacher said the two wars were one story with an intermission.',
    'The First, from 1914 to 1918, ended with a peace that punished Germany with debt and shame. The debt broke its economy. The shame gave a man with a plan an audience. Twenty years later, in 1939, the Second began.',
    'The Second, from 1939 to 1945, killed sixty million people. Six million of them were Jews murdered in the Holocaust, not on battlefields but in camps built for the purpose. When it ended, the winners remembered 1919 and did the opposite: they rebuilt their enemies instead of punishing them, and the two great-grandsons of that choice have not fought each other since.',
    'The First World War, 1914 to 1918, made the peace that led to the Second, 1939 to 1945. Sixty million people died, six million of them in the Holocaust. The lesson the world took from the intermission was that how a war ends decides whether the next one starts.',
  ],
};
// Grades 11 and 12, told for readers.
STORIES['quadratic-formula'] = {
  about: 'a machine that finds where an arch touches the ground, and what it says when the arch never does',
  more: [{ serial: 'S969', after: 1, alt: 'The formula written out, the part under the root circled' }, { serial: 'S970', after: 3, alt: 'Three arches: one crossing the ground twice, one touching once, one floating above' }],
  title: 'Where the arch lands', art: 'S968', cast: [],
  alt: 'A boy at a skate park sketching the arch of a jump, two marks where it meets the ground',
  words: [
    'Owen filmed a friend\'s bike jump and traced the arch on paper. He wanted to know exactly where the wheels left the ground and where they landed. Factoring the equation got him nowhere; the numbers were not friendly.',
    'His teacher said there was a machine for exactly this, and it worked on every quadratic, friendly or not. Owen had seen it and been scared of it: x equals minus b, plus or minus the square root of b squared minus four a c, all over two a.',
    'He fed the machine his a, b and c. Out came two numbers: the takeoff and the landing. Then the teacher pointed at the part under the root. Positive, two answers, the arch crosses the ground twice. Zero, one answer, the arch just kisses it. Negative, no real answer, the arch never comes down at all. The machine told him how many landings to expect before it told him where.',
    'The quadratic formula solves every quadratic, and the part under the root tells you how many answers to expect: two, one or none. Owen\'s friend landed twice on paper and once in real life, which is a different lesson.',
  ],
};
STORIES['multiplying-binomials'] = {
  about: 'a garden bed with four patches, and the multiplication hiding in its shape',
  more: [{ serial: 'S972', after: 1, alt: 'The bed labeled x + 3 along one side and x + 2 along the other' }, { serial: 'S973', after: 3, alt: 'The four patches: x squared, 2x, 3x and 6' }],
  title: 'Four patches', art: 'S971', cast: [],
  alt: 'A girl standing over a rectangular garden bed divided into four patches by two paths',
  words: [
    'Lena had to multiply (x + 3) by (x + 2), and she wrote x squared plus 6, because x times x and 3 times 2 seemed like the whole job. Her answer was missing half the garden.',
    'Her father showed her the vegetable bed. One side was x plus 3 feet long, the other x plus 2, and two paths split it into four patches. Every patch was part of the bed. Lena had counted only the two corners.',
    'First: x times x, the big patch. Outer: x times 2. Inner: 3 times x. Last: 3 times 2. Four patches: x squared, 2x, 3x and 6. Then the two middle patches were the same kind and joined: x squared plus 5x plus 6. Every piece of the first bracket had to meet every piece of the second.',
    'Every piece of the first bracket multiplies every piece of the second. First, Outer, Inner, Last, then join the like terms. A garden bed with four patches is a multiplication you can walk around.',
  ],
};
STORIES['sequences'] = {
  about: 'a staircase with even steps, a staircase whose steps kept doubling, and the rule for step one hundred',
  more: [{ serial: 'S975', after: 1, alt: 'Even steps numbered, with the same rise written on each' }, { serial: 'S976', after: 3, alt: 'Steps doubling in height, 2, 4, 8, 16, drawn to scale' }],
  title: 'Two staircases', art: 'S974', cast: [],
  alt: 'A boy on a staircase looking up, a second staircase drawn beside it with steps growing taller',
  words: [
    'Kai counted the stairs to the roof: every step rose seven inches, and the fifth step was thirty-five inches up. He asked how high the hundredth would be and started multiplying before his brother told him there was a rule.',
    'A staircase with even steps is an arithmetic sequence: add the same amount each time. The nth step is the first step plus the rise times one less than n: a + (n - 1)d. Step one hundred was 7 + 99 × 7. He did not need to climb.',
    'Then his brother drew a different staircase where every step was twice the height of the one before: 2, 4, 8, 16. That was geometric: multiply by the same amount each time, and the nth term is a times r to the n minus 1. Step twenty on that staircase was over a million inches. Nobody was climbing that.',
    'Arithmetic: add the same amount each time, and the nth term is a + (n - 1)d. Geometric: multiply by the same amount, and the nth term is a times r to the n minus 1. Find the rule once, and step one hundred is a line of arithmetic, not a climb.',
  ],
};
STORIES['logarithms'] = {
  about: 'how many doublings it takes, and the number that answers it',
  more: [{ serial: 'S978', after: 1, alt: 'Eight becoming 16, 32, 64, with the doublings counted' }, { serial: 'S979', after: 3, alt: '2 to the x equals 64 written above log base 2 of 64 equals 6' }],
  title: 'How many doublings', art: 'S977', cast: [],
  alt: 'A girl at a kitchen counter folding dough, a chalk tally of doublings beside her',
  words: [
    'Rosa\'s bread recipe said to fold the dough until it had sixty-four layers. She started with one layer, folded, and had two. Folded again, four. She wanted to know how many folds would get her to sixty-four without folding sixty-four times to find out.',
    'Two to the something equals sixty-four. She knew the base, 2, and the result, 64. What she wanted was the exponent, and that was the one thing the equation would not hand her.',
    'That question has a name. A logarithm is the exponent you were looking for. Two to the x equals sixty-four means log base 2 of 64 equals x, and x is six, because six doublings take one to sixty-four. Rosa folded six times. Log is just how many doublings, said out loud.',
    'A logarithm is the exponent you were looking for. b to the x equals y means log base b of y equals x. Every log question is how many doublings, or triplings, or tenfoldings, it takes.',
  ],
};
STORIES['absolute-value'] = {
  about: 'every place that is four steps from three, in both directions',
  more: [{ serial: 'S981', after: 1, alt: 'A number line with 3 marked and two spots four away' }, { serial: 'S982', after: 3, alt: 'The two cases written out: x minus 3 equals 4, and equals minus 4' }],
  title: 'Four steps from three', art: 'S980', cast: [],
  alt: 'A boy standing on a numbered sidewalk at 3, looking four squares to his left and four to his right',
  words: [
    'The problem said the absolute value of x minus 3 equals 4, and Diego solved it: x is 7. He checked: 7 minus 3 is 4. Done. His teacher marked it half right, and Diego could not see what half he had missed.',
    'He stood on the sidewalk at square 3 and walked four steps forward to 7. Then he thought about absolute value: it is distance from zero, with no direction. Four steps from three could go the other way too.',
    'Four steps back landed on minus 1. The absolute value of minus 1 minus 3 is the absolute value of minus 4, which is 4. Two answers, one in each direction. The way to catch both is to split the equation into a positive case and a negative case, solve each, and check each.',
    'Absolute value is distance from zero, so an absolute value equation usually has two answers, one in each direction. Split into a positive case and a negative case, solve both, check both. Four steps from three is two places.',
  ],
};
STORIES['counterclaims'] = {
  about: 'the objection that got to the room before the argument did, and the writer who learned to say it first',
  more: [{ serial: 'S984', after: 1, alt: 'A draft with the strongest objection written in at the top, in the writer\'s own words' }, { serial: 'S985', after: 3, alt: 'A balance scale with the objection on one pan and the answer on the other' }],
  title: 'The objection that got there first', art: 'S983', cast: [],
  alt: 'A girl at a lectern, a raised hand in the audience already up before she has begun',
  words: [
    'Priya\'s essay argued for a four-day school week and she was sure of it. Her teacher read it and asked one question: what about parents who work five days? Priya had an answer. It was not in the essay, and the question had gotten to the room before her argument did.',
    'She had left the objection out on purpose, because putting it in felt like arguing against herself. That was backward. Every reader had already thought of it. Leaving it out did not remove it; it just let the reader win the point for free.',
    'So she named it first, in its strongest form: many families cannot cover a fifth day, and a four-day week shifts a cost onto them. Then she answered it, with the district\'s own survey and a plan for the fifth day. A rebuttal weighs the objection. It does not pretend it away, and it does not wave it off with a sentence.',
    'Name the best objection, then answer it. A rebuttal weighs the objection; it does not pretend it away. The strongest thing you can do to an argument against you is to make it yourself, better than they would, and then meet it.',
  ],
};
STORIES['satire'] = {
  about: 'an essay that praised something terrible with a straight face, and the boy who took it literally',
  more: [{ serial: 'S987', after: 1, alt: 'A line of the pamphlet with its calm, reasonable tone, the horror underneath' }, { serial: 'S988', after: 3, alt: 'Two arrows: what is exaggerated, and the real target behind it' }],
  title: 'A straight face', art: 'S986', cast: [],
  alt: 'A boy reading an old pamphlet in a library, his expression shifting from shock to a slow grin',
  words: [
    'Marcus read an old essay that calmly proposed solving poverty by selling children as food, with recipes. He was horrified and said so. His teacher asked whether he thought the author had meant it. Marcus said the author had written it, so obviously he meant it.',
    'Then Marcus noticed how reasonable the tone was. Numbers, costs, polite phrases. Nobody who meant it would be that calm. The calm was the point.',
    'That is satire: criticism delivered by exaggerating with a straight face. The exaggeration was the recipe. The real target was the people who talked about the poor as numbers and never as people. To read satire, find what is exaggerated, then find who is really being hit, and it is never the thing on the surface.',
    'Satire criticizes by exaggerating in a straight face. Find what is exaggerated, then find the real target. The calm tone is the tell, and the target is standing behind the joke, not in it.',
  ],
};
STORIES['sentence-structure'] = {
  about: 'a long sentence that carried a reader down a hill, and the short one at the bottom that stopped her',
  more: [{ serial: 'S990', after: 1, alt: 'A long sentence drawn as a slope' }, { serial: 'S991', after: 3, alt: 'A short sentence drawn as a wall' }],
  title: 'The long one, then the short one', art: 'S989', cast: [],
  alt: 'A girl in a reading nook with a page where one long winding sentence is followed by three short words',
  words: [
    'Lena read a paragraph where one sentence ran for four lines, winding through the woods and the rain and the lost dog and the road. Then the next sentence was three words. He was gone. She felt it in her chest and did not know why.',
    'She had been taught that a sentence was a container for a fact. Long and short were just sizes. But the long one had carried her somewhere and the short one had stopped her cold, and that was not about the facts.',
    'Long sentences flow and build; they gather momentum and pull the reader along. Short sentences stop and hit. The writer had used the long one to get her moving and the short one to make her walk into a wall. The shape of a sentence does something to your reading before you understand a word of it.',
    'Long sentences flow and build. Short sentences stop and hit. When a sentence moves you, ask what its shape did, because the writer chose the shape before the words.',
  ],
};
STORIES['enough-evidence'] = {
  about: 'a big claim resting on a small pile, and the two questions that are not the same question',
  more: [{ serial: 'S993', after: 1, alt: 'One relevant study, alone, under a sweeping claim' }, { serial: 'S994', after: 3, alt: 'The same claim, shrunk to fit the pile, and a taller pile beside it' }],
  title: 'A big claim on a small pile', art: 'S992', cast: [],
  alt: 'A boy at a science fair table with a large poster claim balanced on a very small stack of papers',
  words: [
    'Owen\'s poster said that a certain music made plants grow faster. His evidence was one study of twelve plants over two weeks, and it was a real study about exactly that. A judge asked whether the evidence was enough. Owen said it was relevant. She said that was a different question.',
    'Relevant means it bears on the claim. Sufficient means there is enough of it to hold the claim up. His one study was relevant. Whether twelve plants could carry the words all plants and faster was another matter.',
    'The bigger the claim, the more evidence it needs. Owen could shrink the claim to fit the pile: in one small study, these plants grew faster. Or he could grow the pile to fit the claim, with more studies, more plants, more weeks. What he could not do was leave a big claim on a small pile and call it proved.',
    'Relevant and sufficient are two different questions. The bigger the claim, the more evidence it needs. Match the size of the claim to the size of the pile, in either direction.',
  ],
};
STORIES['energy-kinds'] = {
  about: 'a ball held high, dropped, and the energy that changed shape without going anywhere',
  more: [{ serial: 'S996', after: 1, alt: 'The ball at the top, still, with potential energy drawn as a full bar' }, { serial: 'S997', after: 3, alt: 'The ball near the ground, fast, the bar now labeled kinetic' }],
  title: 'The ball on the balcony', art: 'S995', cast: [],
  alt: 'A girl on a balcony holding a ball over the railing, a faint arrow showing its fall',
  words: [
    'Priya held a ball over the balcony railing and asked her brother where its energy was. It was not moving. It was not doing anything. He said it had none. She let go.',
    'By the time it hit the courtyard it was moving fast, and moving things have energy. So where had the energy been while the ball sat still in her hand?',
    'In its position. A ball held high has potential energy, stored by being up where gravity can pull it. As it falls, that energy turns into kinetic energy, the energy of motion, a little more with every meter. At the top, all potential. At the bottom, all kinetic. In between, some of each, and the total never changed.',
    'Kinetic is energy of motion; potential is energy of position. One turns into the other, and nothing is lost along the way. The ball in her hand was not empty. It was loaded.',
  ],
};
STORIES['waves'] = {
  about: 'a rope shaken at one end, slowly and then fast, and what the waves did',
  more: [{ serial: 'S999', after: 1, alt: 'A slow shake: a few long waves on the rope' }, { serial: 'S1000', after: 3, alt: 'A fast shake: many short waves, the same speed down the rope' }],
  title: 'The rope', art: 'S998', cast: [],
  alt: 'A boy shaking one end of a long rope tied to a fence, waves running down its length',
  words: [
    'Marcus tied a rope to the fence and shook the free end. Slow shakes sent long, lazy waves down the rope. Fast shakes sent lots of short ones. He assumed the fast ones were also traveling faster.',
    'He timed them with his phone. A wave took the same time to reach the fence whether he shook slowly or fast. The speed had not changed. Only the length of each wave had.',
    'That is because the rope decides the speed, not the hand. What the hand decides is the frequency, how many waves per second. Speed equals wavelength times frequency, so at a fixed speed, a higher frequency has to come with a shorter wavelength. More waves per second, less rope per wave.',
    'Speed equals wavelength times frequency. At a fixed speed, higher frequency means shorter waves. The rope was never in a hurry; the hand just chopped the same speed into smaller pieces.',
  ],
};
STORIES['electricity'] = {
  about: 'a water pipe, a pump and a kink, and the electricity that behaves the same way',
  more: [{ serial: 'S1002', after: 1, alt: 'A pump pushing water: more push, more flow' }, { serial: 'S1003', after: 3, alt: 'A kinked hose: same push, less flow' }],
  title: 'The water pipe', art: 'S1001', cast: [],
  alt: 'A girl watering a garden with a hose, a kink in it, a small drawn battery and wire beside her',
  words: [
    'Ana was watering the garden when the hose kinked and the flow died to a trickle. Her dad turned the tap up and the trickle grew. Then he unkinked the hose and it gushed. He said she had just seen Ohm\'s law with water.',
    'Electricity in a wire, he said, is water in a pipe. Voltage is the push from the pump. Current is how much flows. Resistance is the kink.',
    'Turn up the push and more flows: more voltage, more current. Kink the pipe and less flows for the same push: more resistance, less current. Voltage equals current times resistance. A thin wire is a kinked hose; a thick one is wide open. The garden hose had explained a whole chapter.',
    'Voltage equals current times resistance. More push means more flow; more resistance means less. A pump, a pipe and a kink are the whole law.',
  ],
};
STORIES['momentum'] = {
  about: 'a bike and a truck at the same speed, and why one is easy to stop',
  more: [{ serial: 'S1005', after: 1, alt: 'A hand stopping the bike easily' }, { serial: 'S1006', after: 3, alt: 'Two carts colliding on a track, their totals written before and after' }],
  title: 'The bike and the truck', art: 'S1004', cast: [],
  alt: 'A boy at a crosswalk watching a bicycle and a truck roll toward the same stop line at the same speed',
  words: [
    'Sam watched a bike and a delivery truck coast toward the same stop line at the same slow speed. He could have stopped the bike with one hand. Nobody was stopping the truck with anything.',
    'Same speed. Different everything else. The difference was mass, and the thing that mass and speed make together has a name.',
    'Momentum is mass times velocity. The truck had a hundred times the mass, so a hundred times the momentum at the same speed, and stopping it takes a hundred times the effort. And when things collide, the total momentum before equals the total after: a fast cart hitting a slow one hands over exactly what it loses. Nothing vanishes; it moves from one body to the other.',
    'Momentum is mass times velocity. In a collision, total momentum before equals total momentum after. The truck and the bike had the same speed and not the same momentum, which is why you stop one with a hand.',
  ],
};
STORIES['work-and-power'] = {
  about: 'the same box carried up the stairs slowly, then run, and what changed',
  more: [{ serial: 'S1008', after: 1, alt: 'The box lifted a set height: force times distance' }, { serial: 'S1009', after: 3, alt: 'A stopwatch beside the stairs, the same work in less time' }],
  title: 'The same box, twice', art: 'S1007', cast: [],
  alt: 'A girl carrying a box up a flight of stairs, a second faded image of her running the same stairs',
  words: [
    'Lena carried a box up the stairs slowly and then, on a dare, ran the same box up the same stairs. She was far more tired the second time and assumed she had done more work. Her physics teacher said no.',
    'Work is force times distance. The box weighed the same and the stairs were the same height, so the work, the energy she had put into the box by lifting it, was identical both times. The box did not care how fast it arrived.',
    'What changed was power: work divided by time, measured in watts. The same work in half the time is twice the power, and her legs had felt the difference. A strong engine and a weak one can both lift the box; the strong one lifts it faster.',
    'Work is force times distance, and it is how energy gets into a thing. Power is work divided by time, in watts. The box got the same energy both trips; Lena spent it at two different rates.',
  ],
};
STORIES['series-and-parallel'] = {
  about: 'two strings of holiday lights, and why one bulb could darken a whole string',
  more: [{ serial: 'S1011', after: 1, alt: 'One path drawn through every bulb in a row' }, { serial: 'S1012', after: 3, alt: 'Separate paths to each bulb, one bulb dark and the rest lit' }],
  title: 'Two strings of lights', art: 'S1010', cast: [],
  alt: 'A boy on a porch with two strings of holiday lights, one dark along its whole length and one with a single bulb out',
  words: [
    'Two strings of lights went up on the porch, and one bulb burned out on each. On the first string, every light went dark. On the second, one bulb went dark and the rest kept shining. Kai wanted to know why the same failure had two different results.',
    'The first string was wired in series: one path through every bulb. Break it anywhere and the whole path is broken. The second was in parallel: a separate path to each bulb, so a break in one path leaves the others whole.',
    'Series also adds up resistance, every bulb adding to the drag, so the more bulbs you add, the dimmer each one glows. Parallel gives each bulb its own road, so each gets the full voltage, and adding more paths actually lowers the total resistance. Houses are wired in parallel for both reasons: one lamp out does not darken the kitchen.',
    'Series is one path, so one break darkens everything and resistances add. Parallel is separate paths, so the rest stay lit and each path gets the full voltage. One dead bulb tells you which kind of string you bought.',
  ],
};
STORIES['synthesis-essay'] = {
  about: 'an essay organized by its reasons instead of its sources, and what happened when two sources disagreed',
  more: [{ serial: 'S1014', after: 1, alt: 'An outline with one paragraph per source, crossed out' }, { serial: 'S1015', after: 3, alt: 'A new outline with one paragraph per reason, sources mixed under each' }],
  title: 'By reasons, not by sources', art: 'S1013', cast: [],
  alt: 'A girl at a desk with four sources fanned out and an outline that lists three reasons instead of four sources',
  words: [
    'Rosa had four sources about school gardens and wrote four paragraphs: what source A said, what source B said, and so on. It read like a book report on four books. Her teacher said a synthesis was not a parade of sources.',
    'Rosa had organized by where the evidence came from. She needed to organize by what it proved. The sources were witnesses; the reasons were the case.',
    'Three reasons, three paragraphs, sources mixed inside each wherever they helped. And in the second paragraph, two sources disagreed about cost. Rosa did not report both and move on. She judged between them: one had a budget from a real district and the other an estimate from a blog, and she said which she trusted and why.',
    'Organize by your reasons, not by your sources. Where sources disagree, judge between them and say why. A synthesis is your argument with their evidence in it, not their arguments in a row.',
  ],
};
STORIES['literary-argument'] = {
  about: 'a claim about a whole book, proved three times from three parts of it',
  more: [{ serial: 'S1017', after: 1, alt: 'Three bookmarks: beginning, middle, end' }, { serial: 'S1018', after: 3, alt: 'A rival reading written on a card and answered beneath it' }],
  title: 'Three times, from three places', art: 'S1016', cast: [],
  alt: 'A boy at a library table with a novel open in three places, a thesis on a card above them',
  words: [
    'Sam\'s claim was that the novel\'s narrator could not be trusted. He proved it with one scene from chapter two, and stopped. His teacher asked whether the narrator lied in chapter two or in the book.',
    'A claim about a whole work needs evidence from across the whole work. One scene proves a scene. Sam went back and found the narrator shading the truth in the middle and again at the end, in different ways.',
    'Then he did the hard part. The strongest reading against his was that the narrator was not lying but mistaken, an honest fool. Sam answered it: a fool gets things wrong at random; this narrator got things wrong only when the truth was unflattering. A pattern like that is a choice.',
    'A literary argument is a disputable claim about the whole work, proved with evidence from across it, and it answers the strongest reading against yours. Three places and one rival reading make a claim about a book instead of a claim about a page.',
  ],
};
STORIES['op-ed'] = {
  about: 'thirty seconds of a stranger\'s attention, and the four things an op-ed does with them',
  more: [{ serial: 'S1020', after: 1, alt: 'A hook line at the top, the reader\'s eyes caught' }, { serial: 'S1021', after: 3, alt: 'The last line, an ask, with a phone and a ballot beside it' }],
  title: 'Thirty seconds', art: 'S1019', cast: [],
  alt: 'A girl reading a newspaper op-ed at a kitchen table while a stranger on a train, drawn faintly, reads the same page',
  words: [
    'Ana wrote an op-ed for the town paper about the closing pool, and it began with the pool\'s history since 1962. Her teacher said the average reader gives an op-ed thirty seconds, and Ana had spent them all on the year 1962.',
    'A stranger on a train, a coffee going cold, a thumb ready to scroll. That was her reader. The reader did not owe her the thirty seconds. She had to earn every one of them.',
    'Hook: last Saturday, forty kids stood outside a locked gate. Position: the pool should stay open, and here is how. Evidence: the cost, the alternatives, the summer drowning numbers from the county. Ask: come to Tuesday\'s meeting, and here is the room. Four moves, five hundred words, nothing about 1962.',
    'An op-ed is a hook, a position, evidence and an ask, all for a reader who gives you thirty seconds. Earn the first five with the hook, and spend the rest telling them exactly what to do.',
  ],
};
STORIES['gilded-age-and-progressives'] = {
  about: 'gold on the outside, iron underneath, and the reformers who scraped the gold off',
  more: [{ serial: 'S1023', after: 1, alt: 'A gold-leaf frame around a cheap iron picture' }, { serial: 'S1024', after: 3, alt: 'A food inspector, a broken trust, a tax form, a ballot for senators' }],
  title: 'Gold on the outside', art: 'S1022', cast: [],
  alt: 'A boy on a street with a gilded mansion on one side and a smoking factory tenement on the other',
  words: [
    'Kai\'s book called the decades after 1877 the Gilded Age, and he thought gilded meant golden. His teacher asked him to look up gilded. Gold on the outside, something cheaper underneath.',
    'Railroads and steel made fortunes that built mansions with gold leaf on the ceilings. The same railroads and mills paid twelve-hour days to workers who lived six to a room, and children worked the looms. The gold was real. So was what it covered.',
    'The Progressives were the people who scraped at the gold. Food safety laws after the packing houses were exposed. Antitrust to break the giant companies. The income tax so the fortunes paid a share. The direct election of senators so money could not simply buy a seat. Not a revolution; a set of repairs.',
    'Railroads and industry made fortunes and misery after 1877; the Progressives answered with food safety, antitrust, the income tax and the direct election of senators. Gilded means gold over iron, and reform means looking underneath.',
  ],
};
STORIES['depression-and-new-deal'] = {
  about: 'one worker in four with no job, and the government that decided to be the employer',
  more: [{ serial: 'S1026', after: 1, alt: 'A stock ticker in 1929, then a shuttered bank' }, { serial: 'S1027', after: 3, alt: 'A work crew building a dam, a Social Security card beside it' }],
  title: 'One in four', art: 'S1025', cast: [],
  alt: 'A girl at a museum exhibit showing a 1933 bread line, four figures with one shaded',
  words: [
    'Rosa read that in 1933 a quarter of American workers had no job, and tried to picture it in her own town. Her father, her uncle, her neighbor, the mail carrier: one of the four with nothing. Then the next four. Then every four.',
    'The crash of 1929 had started it. Banks failed, savings vanished, factories closed because nobody could buy, and nobody could buy because the factories closed. The old answer was to wait. Waiting made it worse.',
    'The New Deal decided the government would hire people itself: dams, roads, parks, murals, trails, a million jobs where the market had none. And in 1935 it created Social Security, so that being old would not mean being poor. Not everything worked. Enough did to change what people expected their government to do.',
    'The 1929 crash left a quarter of workers jobless by 1933. The New Deal put people to work and created Social Security in 1935. The Depression is the reason the country still argues about what a government owes the people in a bad year.',
  ],
};
STORIES['america-in-world-war-two'] = {
  about: 'a Sunday morning that ended an argument, and the home front that won a war',
  more: [{ serial: 'S1029', after: 1, alt: 'Landing craft at dawn on a beach, June 6, 1944' }, { serial: 'S1030', after: 3, alt: 'Women on a factory line building aircraft' }],
  title: 'The morning that ended the argument', art: 'S1028', cast: [],
  alt: 'A family gathered around a kitchen radio on a Sunday morning, a newspaper with a harbor photo on the table',
  words: [
    'Theo asked why America waited two years to join a war that had started in 1939. His grandmother said the country had been arguing about it every day, and then one morning the argument was over.',
    'December 7, 1941. Pearl Harbor. By evening there was nothing left to argue about. The next day the country was at war, and the question changed from whether to how.',
    'How was everyone. Sixteen million served. On June 6, 1944, D-Day, they landed in France. At home, women built the planes and ships in numbers no one had planned for, and rationing meant a family counted sugar and gasoline. Victory came in 1945, in Europe in May and in the Pacific in August, and the country that had argued for two years had turned itself into a machine in four.',
    'Pearl Harbor, December 7, 1941, brought America into the war. D-Day was June 6, 1944. Victory came in 1945. At home, women went to work and families rationed, and the home front was as much the war as the front.',
  ],
};
STORIES['cold-war'] = {
  about: 'two powers that never fired at each other directly, and the week in 1962 when they almost did',
  more: [{ serial: 'S1032', after: 1, alt: 'A missile on a truck under palm trees, ships in a ring around an island' }, { serial: 'S1033', after: 3, alt: 'A wall coming down in 1989, people on top of it' }],
  title: 'Two powers, no shots', art: 'S1031', cast: [],
  alt: 'A boy at a world map with two large shaded countries and a small island between them circled',
  words: [
    'Jamal could not understand how a war could last from 1945 to 1991 without the two sides ever fighting. His teacher said that was the whole strangeness of it. Both had bombs that could end the other, so neither could afford to start.',
    'Instead they fought everywhere else: in Korea and Vietnam, in space, in chess, in who could build the bigger stockpile. Every crisis was a test of nerve, and the closest call came in October 1962.',
    'Soviet missiles were found in Cuba, ninety miles from Florida. For thirteen days the world waited for a mistake. Ships met at sea and turned around. A deal was made, some of it in secret, and the missiles left. Twenty-seven years later the Berlin Wall came down, and in 1991 the Soviet Union dissolved without a shot fired between the two.',
    'From 1945 to 1991, two nuclear powers never fought each other directly. The closest call was Cuba in 1962. It ended with the Soviet Union\'s collapse in 1991, and the lesson of thirteen days is how much of peace is nerve.',
  ],
};
STORIES['civil-rights-movement'] = {
  about: 'courts, feet, crowds and laws, and the order they came in',
  more: [{ serial: 'S1035', after: 1, alt: 'An empty bus seat, 1955' }, { serial: 'S1036', after: 3, alt: 'A president signing with many pens, 1964' }],
  title: 'Courts, feet, crowds, laws', art: 'S1034', cast: [],
  alt: 'A girl in a museum hall passing four displays: a courtroom, a bus, a crowd at a monument, a signed law',
  words: [
    'Maya knew the names, Brown and Montgomery and the March on Washington, and thought they had all happened in one summer. Her teacher laid them on a line. 1954. 1955. 1963. 1964. 1965. Eleven years, in a particular order.',
    'The courts came first. Brown v. Board in 1954 said separate schools were not equal. A ruling is a piece of paper until people move.',
    'Then feet: in 1955 the people of Montgomery walked to work for more than a year rather than ride the back of the bus. Then crowds: a quarter of a million in Washington in 1963. Then laws: the Civil Rights Act of 1964 and the Voting Rights Act of 1965 put the ruling into the country\'s hands. Each step made the next one possible.',
    'Brown in 1954, Montgomery in 1955, Washington in 1963, then the Civil Rights Act of 1964 and the Voting Rights Act of 1965. Courts, feet, crowds, laws. The order is the lesson: a ruling starts it, and people finish it.',
  ],
};
STORIES['recent-america'] = {
  about: 'the shocks a generation was born into, and the country that kept voting through all of them',
  more: [{ serial: 'S1038', after: 1, alt: 'A dial-up computer, then two towers, then a foreclosure sign' }, { serial: 'S1039', after: 3, alt: 'An inauguration in 2009, then an empty street in 2020' }],
  title: 'The shocks', art: 'S1037', cast: [],
  alt: 'A boy looking at a family photo wall where each photo has a year and a headline pinned beside it',
  words: [
    'Kai asked his parents what had happened in the world since they were his age, and they started listing. The internet in every house. September 11, 2001. The 2008 crash. The first Black president in 2009. The pandemic in 2020. Kai had been born into the middle of the list.',
    'Each one had felt, at the time, like the thing that would change everything. Some did. The internet did. The rest changed a lot and left the shape of the country standing.',
    'Through all of it, the same things kept happening on schedule: elections every two years, a census every ten, courts in session, a peaceful handoff of power. Kai\'s teacher said that was the story underneath the headlines. The shocks were real, and so was the frame that held.',
    'The internet, September 11, 2001, the 2008 crisis, the first Black president in 2009 and the 2020 pandemic. Through all of it, the country kept voting, counting and handing over power on schedule, which is the quiet half of recent history.',
  ],
};
STORIES['function-shifts'] = {
  about: 'a picture moved on a wall, and which part of the formula moved it which way',
  more: [{ serial: 'S1041', after: 1, alt: 'f(x) + 2 drawn above f(x), the same shape higher' }, { serial: 'S1042', after: 3, alt: 'f(x - 3) drawn to the right of f(x), the minus sending it right' }],
  title: 'The picture, moved', art: 'S1040', cast: [],
  alt: 'A girl holding a framed graph against a wall, faint copies of it shifted up and to the right',
  words: [
    'Lena had the graph of f(x) and was told to draw f(x - 3). She slid it three to the left, because minus meant left. Every point was wrong. The teacher\'s answer key had it three to the right, and Lena thought the key was wrong.',
    'She tested it. At x = 3, f(x - 3) is f(0). So the new graph does at 3 what the old one did at 0. The old point had moved right by three. Minus inside the brackets went right. It felt backward until she saw why: to get the same input, x had to be bigger.',
    'Outside the brackets was the easy half: f(x) + 2 lifts every point up by two, and minus 2 drops it. Inside the brackets moves the picture sideways, and the sign is reversed. Up and down are what you expect. Left and right are the opposite of what you expect, every time.',
    'Outside the brackets moves the graph up or down. Inside the brackets moves it sideways, and minus goes right. A picture moved on a wall follows the same rules, and the sideways one is the one to check twice.',
  ],
};
STORIES['composite-functions'] = {
  about: 'two machines in a row, and the order that changed the answer',
  more: [{ serial: 'S1044', after: 1, alt: 'The machines with g first and f second, inside out' }, { serial: 'S1045', after: 3, alt: 'The same machines swapped, a different number coming out' }],
  title: 'Two machines in a row', art: 'S1043', cast: [],
  alt: 'A boy feeding a number into the first of two machines on a bench, the output rolling into the second',
  words: [
    'Owen had two machines. One doubled a number; one added three. He fed in five and got thirteen. His friend fed in five and got sixteen. Same machines, same number, different answers, and both of them were sure they had done it right.',
    'They had used the machines in different orders. Owen doubled first, then added three: ten, then thirteen. His friend added three first, then doubled: eight, then sixteen. The order was the whole difference.',
    'That is a composite function. f(g(x)) means apply g first, then f, working from the inside out. If g doubles and f adds three, f(g(5)) is thirteen. Swap them and g(f(5)) is sixteen. The machines do not care which order you like; the answer does.',
    'f(g(x)) means apply g first, then f. Work from the inside out, and the order matters. Two machines in a row are two different machines depending on which one you feed first.',
  ],
};
STORIES['unit-circle'] = {
  about: 'a walk around a circle of radius one, reading the sine and cosine off the ground',
  more: [{ serial: 'S1047', after: 1, alt: 'Her position at 30 degrees, x and y marked as cosine and sine' }, { serial: 'S1048', after: 3, alt: 'The circle divided into quarters with the signs of x and y in each' }],
  title: 'A walk around the circle', art: 'S1046', cast: [],
  alt: 'A girl walking a large circle chalked on a playground, its center marked, a right triangle drawn from her spot to the center',
  words: [
    'Maya\'s teacher chalked a circle with radius one on the playground and asked her to walk it, stopping every so often. At each stop she was to say how far right of center she was and how far up. Maya did not see what that had to do with trigonometry.',
    'At thirty degrees she was about 0.87 to the right and exactly 0.5 up. Her teacher said: cosine 30 and sine 30. Maya looked down at her feet. The x was the cosine. The y was the sine. The whole table she had memorized was just where she stood.',
    'She learned five stops by heart: 0, 30, 45, 60 and 90 degrees. Then she kept walking. In the second quarter she was left of center, so cosine went negative while sine stayed positive. In the third both were negative. In the fourth, x positive again, y still down. The quarter she stood in set the signs.',
    'On the unit circle, x is cosine and y is sine. Know 0, 30, 45, 60 and 90 degrees, and let the quarter set the signs. Everything after that is walking.',
  ],
};
STORIES['half-life'] = {
  about: 'a clock that halved instead of ticking, and the sample that was never quite gone',
  more: [{ serial: 'S1050', after: 1, alt: 'A tray at the start, then half, then a quarter, then an eighth' }, { serial: 'S1051', after: 3, alt: 'The formula with one half raised to the number of half-lives' }],
  title: 'The halving clock', art: 'S1049', cast: [],
  alt: 'A boy at a lab bench with a tray of glowing pieces, half of them dimmed, a clock on the wall',
  words: [
    'Sam had a sample with a half-life of ten years and a question: how much would be left after thirty. He reasoned that if half went in ten years, all of it would be gone in twenty, and after thirty there would be less than nothing.',
    'His teacher asked what half of a half was. A quarter. And half of that? An eighth. The sample did not lose the same amount each decade. It lost half of whatever was left, and whatever was left never reached zero.',
    'So the clock ticks in halvings. Thirty years is three half-lives. Halve three times: one half, one quarter, one eighth. Amount left equals the start times one half to the power of the number of half-lives. An eighth remained, and after a hundred years a thousandth would, and it would still not be gone.',
    'Count the half-lives, then halve that many times. Amount left is the start times one half to the power of the number of half-lives. A halving clock never reaches zero; it only gets close.',
  ],
};
STORIES['end-behavior'] = {
  about: 'what the ends of a graph do when the middle stops mattering, settled by two facts',
  more: [{ serial: 'S1053', after: 1, alt: 'An even-power graph, both ends up; another with both ends down' }, { serial: 'S1054', after: 3, alt: 'An odd-power graph, one end down and one up' }],
  title: 'What the ends do', art: 'S1052', cast: [],
  alt: 'A girl at a desk with four sketched graphs, the middles scribbled over and only the far ends showing',
  words: [
    'Rosa had a polynomial with six terms and was asked what its graph did far to the left and far to the right. She started plotting points and gave up somewhere around x equals nine. The middle was a mess of hills.',
    'Her teacher told her to cross out every term but one. Far from zero, the highest power is so much bigger than the rest that the rest stop mattering. The ends belong to that one term.',
    'Two facts settle it. Is the highest power even or odd? Even means both ends go the same way; odd means they go opposite ways. Is its coefficient positive or negative? Positive sends the right end up; negative sends it down. Her six-term mess was x to the fourth with a minus sign: even, negative, both ends down. The middle could do what it liked.',
    'The highest power rules the ends. Even or odd, positive or negative: those two facts settle the shape far from the middle, and the middle is a separate question.',
  ],
};
STORIES['two-sources'] = {
  about: 'two witnesses to one event, and the reader who stopped asking which was lying',
  more: [{ serial: 'S1056', after: 1, alt: 'Two columns: where they agree, where they differ, what each adds' }, { serial: 'S1057', after: 3, alt: 'One event seen from two windows of the same house' }],
  title: 'Two witnesses', art: 'S1055', cast: [],
  alt: 'A girl at a table with two accounts of the same event side by side, a line drawn where they overlap',
  words: [
    'Maya read two accounts of the same factory fire, one by a worker and one by the owner, and they disagreed about how many exits were open. She decided one of them was lying and spent an hour trying to work out which.',
    'Her teacher asked her to hold both in mind instead of picking. Where did they agree? The date, the floor, the smoke. Where did they differ? The exits. What did each add that the other could not? The worker knew the stairwell; the owner knew the building plans.',
    'The difference was not a lie. The worker had run for the door she knew, found it locked, and remembered one exit. The owner counted the doors on the plans and remembered four. Two views of one fire, from the stairwell and from the office, and the truth needed both.',
    'Hold both sources in mind. Ask where they agree, where they differ, and what each adds. A difference is often two views of one thing, and the job is to stand where each witness stood.',
  ],
};
STORIES['assumptions'] = {
  about: 'the step the writer skipped, found by asking what would have to be true',
  more: [{ serial: 'S1059', after: 1, alt: 'The claim at the top, the reason below, a gap between' }, { serial: 'S1060', after: 3, alt: 'The missing stair drawn in dotted lines, labeled' }],
  title: 'The skipped step', art: 'S1058', cast: [],
  alt: 'A boy at a desk with an argument written as stairs, one stair missing between two others',
  words: [
    'The letter argued that the town should close the skate park because there had been two injuries there this year. Marcus felt something was wrong with the argument and could not find the bad sentence. Every sentence was true. Two injuries, one park.',
    'His teacher told him to stop hunting for a false sentence and hunt for a missing one. What would have to be true for two injuries to prove the park should close?',
    'It would have to be true that two injuries in a year is a lot. Marcus looked it up: the football field had had nine. That was the assumption, the step the writer skipped, and once it was written down it collapsed. The letter was not lying. It was standing on a stair that was not there.',
    'An assumption is the step the writer skipped. Ask what would have to be true for the reason to support the claim, write that step down, and see whether it holds. The weakest part of an argument is usually the sentence nobody wrote.',
  ],
};
STORIES['precise-words'] = {
  about: 'four ways to cross a room, and the one word that said which',
  more: [{ serial: 'S1062', after: 1, alt: 'Four figures: a stroll, a march, a trudge, a plain walk' }, { serial: 'S1063', after: 3, alt: 'One sentence with the word swapped four times, four different men' }],
  title: 'Walk, stroll, march, trudge', art: 'S1061', cast: [],
  alt: 'A girl watching four people cross a hallway in four different ways',
  words: [
    'Rosa wrote that her character walked to the principal\'s office. Her teacher asked how. Rosa said he walked. It was in the sentence. Her teacher said the sentence told her he had gone from one place to another and nothing else.',
    'Was he strolling, in no hurry, sure it was nothing? Marching, angry, ready to argue? Trudging, dreading every step? Each was a walk. Each was a different boy and a different story.',
    'Near-synonyms are not the same word wearing different clothes. Each one names a slightly different thing. Rosa chose trudged, and the sentence now carried his dread all the way down the hall without a word about how he felt. The precise word did the feeling\'s job.',
    'Near-synonyms name slightly different things. The precise word names exactly what happened, and it can carry a paragraph of feeling in one verb. Walk is a category; trudge is a boy.',
  ],
};
STORIES['author-choices'] = {
  about: 'a novel that began after the war instead of before it, and what that choice decided',
  more: [{ serial: 'S1065', after: 1, alt: 'The same story sketched with an earlier starting point' }, { serial: 'S1066', after: 3, alt: 'The last chapter and the one before it swapped, arrows showing the change' }],
  title: 'Why it starts here', art: 'S1064', cast: [],
  alt: 'A boy holding a novel open at the first page, a faint timeline behind him with the story starting late along it',
  words: [
    'Kai noticed that the novel began the day the soldier came home and never showed the war at all. He thought the author had skipped the interesting part. His teacher asked what the book would have been if it had started at the front.',
    'A war story. Battles, fear, the friends who did not come back. Instead it was a story about a kitchen, a wife who did not know what to say, and a man who flinched at the kettle. Starting late made the war a shadow instead of a subject.',
    'Every choice worked that way. Ending at the first good night\'s sleep instead of a year later said the story was about the first step, not the recovery. Putting the letter from the dead friend in the middle instead of at the start had its own effect. The reader learned the reason for the flinching only after watching it for a hundred pages. Where a story begins, where it ends, and the order of its parts are the author deciding what it means.',
    'Where a story begins, where it ends, and the order of its parts all shape its meaning. Ask what it would mean if the choice had gone the other way, and the author\'s reasons come into view.',
  ],
};
STORIES['rock-cycle'] = {
  about: 'a rock that was never finished, seen from a mountain path',
  more: [{ serial: 'S1068', after: 1, alt: 'Lava cooling into dark rock' }, { serial: 'S1069', after: 3, alt: 'Layers of sand pressing into stone, then bending under heat' }],
  title: 'Never finished', art: 'S1067', cast: [],
  alt: 'A boy on a mountain path holding three rocks: a glassy dark one, a layered sandy one and a banded one',
  words: [
    'On the hike Kai picked up three rocks that looked nothing alike: one dark and glassy, one sandy and layered, one banded like ribbon candy. He asked which one was the real rock. His aunt said all three, and that each had been the others.',
    'The glassy one was igneous, cooled from a melt. The layered one was sedimentary, pressed from pieces of older rock that had washed into a sea. The banded one was metamorphic, changed by heat and pressure deep underground without melting.',
    'Then she pointed at the mountain. The sedimentary rock had been made from the wreckage of an older mountain. Bury it deep and it becomes metamorphic. Melt it and it comes back as igneous. Weather it and its pieces make new layers. Any kind can become any other, given time, and none of them is the finished one.',
    'Igneous cooled from a melt, sedimentary was pressed from pieces, metamorphic was changed by heat and pressure. Each kind can become any other. A rock is a stage, not a destination.',
  ],
};
STORIES['climate-and-weather'] = {
  about: 'one rainy Tuesday, thirty years of Tuesdays, and the difference between them',
  more: [{ serial: 'S1071', after: 1, alt: 'One cold day circled on a calendar' }, { serial: 'S1072', after: 3, alt: 'A thirty-year line with the cold day as a single dot on it' }],
  title: 'One Tuesday and thirty years', art: 'S1070', cast: [],
  alt: 'A girl on a porch in the rain looking at a thirty-year chart of the town\'s weather',
  words: [
    'It snowed in April, and Ana\'s neighbor said that proved the climate was not warming. Ana thought that sounded right. It was cold. She could see her breath.',
    'Her science teacher asked whether one cold day proved anything about thirty years. Weather is what the sky does today. Climate is what it does on average over decades. A snowy Tuesday is weather. It says nothing about climate either way, hot or cold.',
    'Ana looked at the town\'s thirty-year chart. The line wandered up and down, week to week, like the weather. But the whole line had drifted, and the April snow was one dot on it. One dot can no more bend the line than one tall kid can change the average height of a class.',
    'Weather is today; climate is decades of average. A single day, hot or cold, tells you nothing about climate. Look at the line, not the dot.',
  ],
};
STORIES['life-of-a-star'] = {
  about: 'a campfire that lasts billions of years, and the two ways it goes out',
  more: [{ serial: 'S1074', after: 1, alt: 'A sun-like star swelling red, then shrinking to a small white ember' }, { serial: 'S1075', after: 3, alt: 'A heavy star blowing apart in a bright shell, a dense remnant at the center' }],
  title: 'The long campfire', art: 'S1073', cast: [],
  alt: 'A boy beside a campfire at night looking up at a sky full of stars',
  words: [
    'Owen watched the campfire burn down and asked whether stars burned down too. His uncle said yes, just slower. A star is a fire that lasts billions of years, and like a campfire, what happens at the end depends on how big it was.',
    'While it lasts, a star fuses hydrogen into helium in its core, and that fusion holds it up against its own gravity. When the hydrogen runs low, the balance breaks.',
    'A star like the sun swells into a red giant, sheds its outer layers, and settles into a white dwarf, a hot ember slowly cooling forever. A much heavier star goes the other way: it explodes as a supernova, scattering the elements that will make planets, and leaves behind a neutron star or a black hole. Same fuel, different ending, decided by mass.',
    'A star fuses hydrogen into helium while it lasts. A sun-like star ends as a white dwarf; a heavy star explodes and leaves a neutron star or a black hole. How the fire ends depends on how much wood there was.',
  ],
};
STORIES['human-impact'] = {
  about: 'a planet treated the way a doctor treats a patient: measure, find the cause, act',
  more: [{ serial: 'S1077', after: 1, alt: 'A river measured year by year, a line rising' }, { serial: 'S1078', after: 3, alt: 'A factory outflow, then a filter, then the line falling' }],
  title: 'The way a doctor does it', art: 'S1076', cast: [],
  alt: 'A girl in a clinic watching a doctor read a chart, a small globe on the desk with its own chart beside it',
  words: [
    'Rosa\'s uncle is a doctor, and she asked him why a lesson on the environment kept talking about measurement. He said measurement is the whole job. You do not treat a patient by how you feel about them.',
    'A doctor measures the change: temperature, blood pressure, the numbers over time. Then finds the cause. Then acts on the cause, not the symptom. Then measures again to see whether the action worked.',
    'People change the Earth in measurable ways with measurable causes. A river warms; the readings show it. The cause is found upstream, a plant\'s outflow. The action is a filter or a rule. The next year\'s readings say whether it worked. Rosa had thought the environment was a matter of caring. It was a matter of charts.',
    'People change the Earth in measurable ways with measurable causes. Measure the change, find the cause, act on the cause, then measure again. The planet is a patient, and the chart is how you know.',
  ],
};
STORIES['earths-layers'] = {
  about: 'a peach, and the earthquake waves that mapped what nobody could dig to',
  more: [{ serial: 'S1080', after: 1, alt: 'The peach in cross-section: skin, flesh, pit' }, { serial: 'S1081', after: 3, alt: 'Earthquake waves bending through the layers on a diagram' }],
  title: 'The peach', art: 'S1079', cast: [],
  alt: 'A boy cutting a peach in half at a kitchen counter, a diagram of the Earth beside it',
  words: [
    'Kai asked how anyone knew what the middle of the Earth was made of when the deepest hole ever drilled went only twelve kilometers. His mother handed him a peach and a knife.',
    'The skin is the crust, thin and cool, the part everything lives on. The flesh is the mantle, thick and slow-moving, hot enough to flow over millions of years. The pit is the core, and it has two parts: a liquid outer core and a solid inner one.',
    'Nobody dug there. Earthquakes did the mapping. Their waves travel at different speeds through different materials, and some kinds cannot pass through liquid at all. By timing waves arriving around the world, scientists drew the layers they could never see. The plates ride on the mantle, and the churning liquid core makes the magnetic field that turns a compass.',
    'Crust, mantle, outer core, inner core. Earthquake waves mapped the layers, the plates ride the mantle, and the liquid core makes the magnetic field. A peach and a seismograph are the whole picture.',
  ],
};
STORIES['ocean-currents'] = {
  about: 'a conveyor belt of heavy water, and why one coast is mild and another is not',
  more: [{ serial: 'S1083', after: 1, alt: 'Wind pushing surface water in a great loop' }, { serial: 'S1084', after: 3, alt: 'Cold salty water sinking near the pole and creeping along the bottom' }],
  title: 'The conveyor belt', art: 'S1082', cast: [],
  alt: 'A girl on a harbor wall in a light jacket, a map behind her with warm and cold currents drawn as arrows',
  words: [
    'Lena\'s cousin in a city at the same latitude as hers shivered through winters twice as cold, and Lena wanted to know why. Same distance from the equator, same sun. Her geography teacher pointed at the sea.',
    'Wind drives the surface currents, pushing warm water from the tropics toward the poles in great loops. Lena\'s coast sat beside a warm current. Her cousin\'s sat beside a cold one coming back down.',
    'Underneath, a slower engine runs. Near the poles, water gets cold and salty and heavy, and it sinks, crawling along the ocean floor for centuries before rising somewhere warm. Surface and deep together make a conveyor belt that carries heat around the planet, which is why coasts have the weather they do.',
    'Wind drives surface currents; cold salty water sinks and drives the deep ones. Currents carry heat, which is why two coasts at the same latitude can have different winters. The sea is a heating system with a very long loop.',
  ],
};
STORIES['natural-resources'] = {
  about: 'a forest cut slower than it grows, and the rate that decides which side of the line a resource is on',
  more: [{ serial: 'S1086', after: 1, alt: 'Trees planted faster than they are cut, the forest thickening' }, { serial: 'S1087', after: 3, alt: 'A well pumping a lake down faster than rain refills it' }],
  title: 'Slower than it grows', art: 'S1085', cast: [],
  alt: 'A boy in a managed forest with a cut stump beside rows of young trees',
  words: [
    'Sam\'s textbook listed forests under renewable and oil under nonrenewable, and he asked why, then, the rainforest was disappearing. If it was renewable, how could it run out?',
    'Renewable means it comes back on a human timescale. Oil takes millions of years, so it does not. A forest can regrow in decades, so it can. But can is not the same as does.',
    'His teacher showed him two forests. One was cut slower than it grew, and it would stand forever. The other was cut faster than it grew, and it was a coal mine with leaves. The same was true of a lake pumped faster than rain refilled it. For forests and water, the rate of use decides which side of the line they land on.',
    'Renewable comes back on a human timescale; nonrenewable does not. For forests and water, the rate of use decides which side of the line they land on. A forest cut slower than it grows is renewable; the same forest cut faster is not.',
  ],
};
STORIES['the-big-bang'] = {
  about: 'raisins in rising dough, and the three clues that the universe is still rising',
  more: [{ serial: 'S1089', after: 1, alt: 'Two raisins close together moving apart slowly, two far apart moving apart fast' }, { serial: 'S1090', after: 3, alt: 'A sky glowing faintly everywhere, and a chart of the elements' }],
  title: 'Raisins in the dough', art: 'S1088', cast: [],
  alt: 'A girl watching a ball of raisin dough rise on a kitchen counter, the raisins spreading apart',
  words: [
    'Ana\'s grandmother set raisin dough to rise, and Ana watched the raisins drift apart as the loaf swelled. Her grandmother said the sky did the same thing, and that the raisins had helped a lot of astronomers think.',
    'Every raisin sees every other raisin moving away, and the far ones move away faster, because there is more dough between them stretching. That is exactly what galaxies do: the farther they are, the faster they recede. If everything is spreading out now, it was once all together.',
    'Two more clues agree. A faint glow fills the whole sky evenly, the cooled-down light of a time when the universe was small and hot. And the mix of elements in old stars, mostly hydrogen with a fixed share of helium, is what the first minutes of such a beginning would cook. Three lines of evidence, gathered three ways.',
    'Galaxies recede faster the farther they are; a faint glow fills the sky; the mix of elements matches. Three lines of evidence point to a universe that began small and hot and is still rising, like dough.',
  ],
};
STORIES['research-paper'] = {
  about: 'a question, what the sources say, and the answer that was the writer\'s own',
  more: [{ serial: 'S1092', after: 1, alt: 'Each source with a job written beside it: background, data, counterpoint' }, { serial: 'S1093', after: 3, alt: 'The final answer paragraph, built on the sources but in her own voice' }],
  title: 'The question, the sources, the answer', art: 'S1091', cast: [],
  alt: 'A girl at a library table with a question written large on a card and a fan of sources below it',
  words: [
    'Ana had twelve sources for her paper on the town\'s water and no idea what the paper was about. She had read everything. She had highlighted everything. She had a pile, and a pile is not a paper.',
    'Her teacher asked what her question was. Ana did not have one; she had a topic. Water. A topic is a pile. A question is a spine: is the town\'s tap water safe to drink, and by whose standard?',
    'With a question, every source suddenly had a job or did not. Three gave background. Four gave the measurements. Two disagreed about the standard, and she judged between them. Three had no job and went back on the shelf. The last section was her own answer, built on the sources but hers: yes, by the federal standard, and no, by the stricter one, and here is what the gap means.',
    'A research paper is a question, what the sources say, and your own answer built on them. Every source is cited and every source does a job. A pile becomes a paper the moment it has a question.',
  ],
};
STORIES['personal-essay'] = {
  about: 'one small true moment that showed who a boy was, better than a list of everything he had done',
  more: [{ serial: 'S1095', after: 1, alt: 'A trophy shelf, faded, with one small photo in focus' }, { serial: 'S1096', after: 3, alt: 'A boy and his grandfather at a workbench, fixing a radio' }],
  title: 'One small moment', art: 'S1094', cast: [],
  alt: 'A boy at a desk with a long list of achievements crossed out and one short paragraph beside it',
  words: [
    'Sam\'s college essay listed everything: captain, honor roll, volunteer hours, the robotics award. It was all true, and his English teacher said she had learned nothing about him. She could have read the same list on a form.',
    'She asked him what he did on Saturday mornings. He fixed old radios with his grandfather, and had for six years, and had never once put that on a list because it was not an achievement.',
    'He wrote about one Saturday: the radio that would not come back, his grandfather\'s hands slowing down, the moment Sam realized he was now the one holding the soldering iron. Four hundred words, no awards. His teacher said now she knew who he was. The list had been what he had done; the radio was who he was.',
    'A personal essay is one story, told well, that shows who you are. A small moment beats a list of achievements, because the list says what you did and the moment shows how you are.',
  ],
};
STORIES['letter-to-an-editor'] = {
  about: 'one point, one ask, one page, for a stranger with a coffee going cold',
  more: [{ serial: 'S1098', after: 1, alt: 'A three-page draft with six points, marked down to one' }, { serial: 'S1099', after: 3, alt: 'The final page with its evidence and one bold ask at the end' }],
  title: 'One point, one ask', art: 'S1097', cast: [],
  alt: 'A girl folding a single typed page at a kitchen table, an envelope addressed to a newspaper',
  words: [
    'Lena\'s letter to the editor made six points about the new bus schedule and ran three pages. She was proud of its completeness. Her teacher said the editor would print none of it, and if he did, nobody would finish it.',
    'A letter to the editor is read by a busy stranger with a coffee going cold. That stranger will give it one page and will remember one thing. Six points is zero points.',
    'Lena picked the strongest: the last bus now leaves before the night shift ends. She backed it with one piece of evidence, the shift times at the hospital and the timetable side by side. She ended with one specific ask: move the last departure to 11:40. One page. The paper printed it, and the transit board read it aloud at its next meeting.',
    'One point, backed by evidence, and one specific ask, on a page a busy stranger will read. A letter that makes one point can win it; a letter that makes six is a letter about the writer.',
  ],
};
STORIES['principles-of-the-constitution'] = {
  about: 'a handful of ideas under everything, found by asking why each rule was there',
  more: [{ serial: 'S1101', after: 1, alt: 'The words We the People with an arrow pointing up at the whole document' }, { serial: 'S1102', after: 3, alt: 'A short list: popular sovereignty, limited government, separation of powers, checks and balances, federalism, individual rights' }],
  title: 'The ideas underneath', art: 'S1100', cast: [],
  alt: 'A boy in a museum looking at the Constitution in its case, a few large words glowing behind the glass',
  words: [
    'Theo tried to memorize the Constitution the way he had memorized state capitals and gave up around Article Two. There were too many rules and they did not seem to belong to each other.',
    'His teacher asked him to stop reading the rules and ask, of each one, why it was there. Why does Congress have two houses? Why can the President veto? Why does the whole thing start with We the People?',
    'The answers kept coming back to a handful of ideas. The people are the source of power. The government is limited to what the document allows. Power is split three ways and each part can check the others. Power is shared with the states. And some rights belong to individuals and cannot be voted away. Six ideas, written in 1787. Every rule was one of them wearing a specific coat.',
    'The Constitution rests on a few principles. The people are the source of power, the government is limited, power is separated and checked, shared with the states, and some rights are the person\'s own. Learn the six ideas and the rules explain themselves.',
  ],
};
STORIES['three-branches'] = {
  about: 'three teams with three jobs, and what happens when one of them reaches too far',
  more: [{ serial: 'S1104', after: 1, alt: 'A veto stamped on a bill, then a two-thirds vote overriding it' }, { serial: 'S1105', after: 3, alt: 'A court striking a law, and a Senate confirming a judge' }],
  title: 'Three teams', art: 'S1103', cast: [],
  alt: 'A girl at a whiteboard with three circles labeled by their jobs, arrows running between them',
  words: [
    'Rosa thought the President ran the country. Her teacher asked her to try to pass a law as President. Rosa could not; only Congress could. Then, as Congress, to enforce one. She could not; that was the President\'s. Then to decide what one meant. The courts.',
    'Three teams, three jobs. Congress makes the laws, the President carries them out, and the courts decide what they mean. No team could do another\'s job, and that was the first half of the design.',
    'The second half was reach. The President can veto a law; Congress can override with two thirds. The courts can strike a law down; the President appoints the judges and the Senate confirms them. Congress can impeach either. Each team can stop the others from going too far, which means nobody gets to run the country alone.',
    'Congress makes the laws, the President carries them out, and the courts decide what they mean. Each branch can check the others, so no one branch can take over. The design is three teams that need each other.',
  ],
};
STORIES['federalism'] = {
  about: 'a school and a school district, and which one decides what',
  more: [{ serial: 'S1107', after: 1, alt: 'A list of powers only the national government holds: coining money, the army, treaties' }, { serial: 'S1108', after: 3, alt: 'A list held by the states: schools, police, licenses' }],
  title: 'The school and the district', art: 'S1106', cast: [],
  alt: 'A boy in a school office looking at two signs: one from the district office and one from the principal',
  words: [
    'Owen\'s school could set its own dress code but could not change the school year, and he wanted to know who decided which decisions were whose. His principal said the district set some things, the school set others, and a few were shared.',
    'The country works the same way. The national government holds the enumerated powers, the ones the Constitution names: coining money, raising an army, making treaties, running the mail. Everything not named is reserved to the states: schools, police, marriage, driver\'s licenses.',
    'Some powers overlap. Both can tax; both can build roads; both can make laws, and when they conflict, the national law wins. That is federalism: power shared between the national government and the states, with a list for one, the rest for the other, and a rule for the overlap.',
    'Power is shared between the national government and the states. The national government holds the enumerated powers, the states hold the reserved ones, and some are concurrent. A school and its district are the same arrangement in miniature.',
  ],
};
STORIES['bill-of-rights'] = {
  about: 'a fence around the government, and which side of it a person stands on',
  more: [{ serial: 'S1110', after: 1, alt: 'The First Amendment as five gates: speech, press, religion, assembly, petition' }, { serial: 'S1111', after: 3, alt: 'A police officer at a door with a warrant, the Fourth Amendment' }],
  title: 'The fence', art: 'S1109', cast: [],
  alt: 'A girl on courthouse steps, a low fence drawn around the building with her standing outside it',
  words: [
    'Maya thought the Bill of Rights was a list of things people were allowed to do. Her teacher said to read the first words of the First Amendment. Congress shall make no law. It was a list of things the government could not do.',
    'That flipped it. A fence around the government, not a permission slip for the citizen. Ratified in 1791, ten amendments, each one a rail.',
    'The First protects religion, speech, press, assembly and petition. The Fourth stops searches without a warrant. The Fifth and Sixth guarantee due process and a fair, speedy, public trial with a lawyer. The Eighth forbids cruel punishment. Maya stood on the outside of the fence, where the rules did not reach her, and that was the point of building it.',
    'The first ten amendments, ratified in 1791, list what the government may never do to a person. The First Amendment protects religion, speech, press, assembly and petition; the Fourth through Eighth protect the accused. The fence is around the government, and the person is outside it.',
  ],
};
STORIES['how-a-bill-becomes-law'] = {
  about: 'an obstacle course with seven stations, and the bill that had to clear every one',
  more: [{ serial: 'S1113', after: 1, alt: 'A committee table with the bill under study, most bills stopping here' }, { serial: 'S1114', after: 3, alt: 'A conference table agreeing one text, then a pen and a veto stamp' }],
  title: 'The obstacle course', art: 'S1112', cast: [],
  alt: 'A boy on capitol steps holding a rolled bill, a course of seven hurdles drawn behind him',
  words: [
    'Kai had an idea for a law and assumed a bill was a form you filled in. His civics teacher drew an obstacle course on the board with seven stations and said most bills fall at the second one.',
    'Introduced by a member. Studied in committee, where most die quietly. Passed by one house. Passed by the other, usually in a slightly different form. Agreed as one text by a conference of both. Sent to the President, who signs or vetoes. And a veto overridden only by two thirds of each house.',
    'Seven stations, and the course was slow on purpose. A law that would bind everyone had to survive everyone\'s objections first. Kai\'s idea got to the second station in the class simulation and stopped there, which his teacher said was the most realistic thing that happened all week.',
    'A bill is introduced, studied in committee, passed by one house and then the other, agreed as one text, and signed or vetoed, with a veto overridden by two thirds. The course is long by design, and the committee is where most bills end.',
  ],
};
STORIES['elections-parties-and-voting'] = {
  about: 'two rounds, 270 to win, and the map that decides the second',
  more: [{ serial: 'S1116', after: 1, alt: 'A primary ballot with several names from one party' }, { serial: 'S1117', after: 3, alt: 'The Electoral College map with 270 marked as the line' }],
  title: 'Two rounds, 270', art: 'S1115', cast: [],
  alt: 'A girl watching election returns on a living room television, a map of states filling in with two colors',
  words: [
    'Ana watched the election returns and could not understand why the anchor kept saying 270 when the vote counts were in the millions. Her father said she was watching the second round of a two-round contest.',
    'The first round was the primaries, months earlier, when each party\'s voters chose that party\'s candidate from several. The second was the general election, when everyone chose between the winners.',
    'And for President the second round is counted by state. Each state has electors, its House seats plus two, and in most states whoever wins the state takes all of them. 270 is a majority of the 538. The millions were real votes, but the map was the scoreboard, and the map had to reach 270.',
    'Primaries choose each party\'s candidate, and the general election chooses the winner. A president is chosen by the Electoral College, 270 of 538, mostly state by state, which is why the night is a map.',
  ],
};
STORIES['scarcity-and-opportunity-cost'] = {
  about: 'sixty dollars, two wants, and the cost that was not on the price tag',
  more: [{ serial: 'S1119', after: 1, alt: 'The shoes bought, the concert poster fading behind' }, { serial: 'S1120', after: 3, alt: 'A price tag that reads: the concert' }],
  title: 'Sixty dollars, two wants', art: 'S1118', cast: [],
  alt: 'A boy at a shop counter with sixty dollars, a pair of shoes on one side and concert tickets on the other',
  words: [
    'Marcus had sixty dollars and two things he wanted: the shoes and the concert. Each cost sixty. He bought the shoes and told his sister they were a good deal. She asked what they had cost him. Sixty dollars, he said. She said no.',
    'Scarcity means there is never enough of everything. Sixty dollars could not be both. So every choice gives something up, and the thing given up is a cost that does not appear on any tag.',
    'The opportunity cost of the shoes was the concert, the best thing he did not choose. Not everything he could have bought, just the next best. When his sister asked whether the shoes were worth a concert, he found the question harder than when she had asked whether they were worth sixty dollars.',
    'Scarcity means there is never enough of everything, so every choice gives something up. The opportunity cost of a choice is the next best thing you did not choose. Sixty dollars was the price; the concert was the cost.',
  ],
};
STORIES['competition-and-markets'] = {
  about: 'two lemonade stands on one street, and what the second one did to the first',
  more: [{ serial: 'S1122', after: 1, alt: 'One stand alone, a high price on its sign' }, { serial: 'S1123', after: 3, alt: 'Two stands, prices lower and cups bigger on both' }],
  title: 'Two stands on one street', art: 'S1121', cast: [],
  alt: 'A girl at a lemonade stand looking down the block at a rival stand with a bigger sign',
  words: [
    'Rosa ran the only lemonade stand on her street and charged two dollars a cup. Then a boy opened a stand at the other end for one dollar. Rosa was furious. Her father said the street had just gotten a market.',
    'With one stand, Rosa set the price and the customers took it. With two, the customers had a choice, and the choice was a vote. Rosa dropped to a dollar fifty and added ice. The boy added lemons. Both stands got better, and the price stayed down.',
    'That is what competition does inside free enterprise: private property, free choice, the profit motive that made both of them try, and limited government that let them. Competition keeps prices down and quality up because every customer can walk to the other end of the block.',
    'Free enterprise means private property, free choice, the profit motive, competition and limited government. Competition keeps prices honest and quality rising, because the customer can always walk. Two stands are a market; one is a toll.',
  ],
};
STORIES['money-banking-and-the-fed'] = {
  about: 'a promise everyone accepts, a bank that lends it out, and the Fed that sets its price',
  more: [{ serial: 'S1125', after: 1, alt: 'A dollar with three labels: exchange, account, store' }, { serial: 'S1126', after: 3, alt: 'A deposit lent out at interest, and a dial marked by the Fed' }],
  title: 'A promise everyone accepts', art: 'S1124', cast: [],
  alt: 'A boy at a bank counter handing over a bill, a faint drawing of a barter trade fading behind him',
  words: [
    'Owen asked why a piece of paper was worth anything. His grandfather said it was a promise everyone accepted, and that a promise everyone accepts is the most useful invention in the world.',
    'Money does three jobs. It is a medium of exchange, so a farmer does not need a barber who wants eggs. It is a unit of account, so a car and a pencil are measured on one scale. It is a store of value, so today\'s work can buy next year\'s food.',
    'Banks take the promises in as deposits and lend most of them out, charging interest, the price of borrowing. And the Federal Reserve sets the basic level of that price: lower it and borrowing gets cheap and the economy speeds up; raise it and things cool. A dial on the price of a promise.',
    'Money is a medium of exchange, a unit of account and a store of value. Banks lend deposits and charge interest, the price of borrowing, and the Fed moves that price to speed up or cool the economy. The paper is a promise, and the Fed sets its rent.',
  ],
};
STORIES['gdp-inflation-and-unemployment'] = {
  about: 'the country\'s paycheck, the price of a sandwich, and the people who wanted work',
  more: [{ serial: 'S1128', after: 1, alt: 'A paycheck labeled GDP with this year and last year side by side' }, { serial: 'S1129', after: 3, alt: 'A sandwich menu with the price rising, and a line of people at a job board' }],
  title: 'The country\'s paycheck', art: 'S1127', cast: [],
  alt: 'A girl in a diner with a newspaper showing three numbers, a menu with an old price crossed out beside her',
  words: [
    'The news gave three numbers in one breath, GDP up two percent, inflation at four, unemployment at five, and Ana\'s uncle said the country was doing fine. Ana did not know whether any of the three was good.',
    'GDP is the country\'s paycheck: the value of everything it produces in a year, and its growth rate is this year\'s change divided by last year\'s total. Two percent meant the paycheck grew a little.',
    'Inflation is the sandwich. Four percent meant the same sandwich cost four percent more than last year, so a paycheck that grew two percent bought less. And unemployment counts people who want work and cannot find it, as a share of those working or looking. Five in a hundred wanted a job and had none. Three numbers, three stories, and fine depended on which one you were living in.',
    'GDP is the value of everything a country produces in a year, and its growth rate is the change divided by last year. Inflation is the rise in prices, and unemployment is the share of the labor force looking for work. The paycheck, the sandwich and the line at the job board.',
  ],
};
// College, and the last kindergarten one.
STORIES['mean-median-mode'] = {
  about: 'six roommates, one rich friend, and three honest averages that disagreed',
  more: [{ serial: 'S1131', after: 1, alt: 'Six monthly budgets in a row, one far taller' }, { serial: 'S1132', after: 3, alt: 'The same six sorted, a finger on the middle two' }],
  title: 'The rich friend', art: 'S1130', cast: [],
  alt: 'Six young adults around an apartment kitchen table, receipts spread out, one of them holding a much thicker wallet',
  words: [
    'Six roommates compared what they spent on food in a month: 180, 200, 200, 220, 250 and 900. Jamal announced the average was 325 and said nobody was overspending. The four people under 250 disagreed with him loudly.',
    'The 900 belonged to Dev, who ate out every night. One number had dragged the mean to a place where nobody actually lived. Jamal was right about the arithmetic and wrong about the roommates.',
    'The median told a different truth. Sort them, take the middle: 210. Dev could spend nine thousand and the median would not move. The mode, the most common, was 200. Three honest averages, and the mean was the only one Dev could pull.',
    'Mean adds and divides. Median is the middle. Mode is the most common. Extreme values pull the mean toward them, and the median ignores them, which is why a rich friend makes the mean lie and leaves the median alone.',
  ],
};
STORIES['spread'] = {
  about: 'two classes with the same average and nothing else in common',
  more: [{ serial: 'S1134', after: 1, alt: 'One row of scores bunched tightly around 75' }, { serial: 'S1135', after: 3, alt: 'Another row scattered from 40 to 100, the same 75 underneath' }],
  title: 'Same average, different rooms', art: 'S1133', cast: [],
  alt: 'A young woman at a lecture hall door looking at two rows of test scores with the same average written under each',
  words: [
    'Priya taught two sections and both averaged 75 on the midterm, so she planned the same review for each. The first class nodded through it. The second class was half lost and half bored, and she could not understand why the same lesson had landed so differently.',
    'She looked past the average. The first section\'s scores ran from 70 to 80: everyone in the same place. The second ran from 40 to 100: a few who needed everything and a few who needed nothing. The average had hidden the room.',
    'The spread is what the average hides. Range is biggest minus smallest, ten in one room and sixty in the other. A bigger spread means a more varied set, and a more varied set needs a different kind of teaching, not a better version of the same one.',
    'The average hides the spread. Range is biggest minus smallest, and a bigger spread means a more varied set. Two rooms with the same average can be two different problems.',
  ],
};
STORIES['probability'] = {
  about: 'a spinner with three winning slices, two spins, and the odds of getting nothing',
  more: [{ serial: 'S1137', after: 1, alt: 'The spinner with three of eight slices shaded' }, { serial: 'S1138', after: 3, alt: 'Two spins side by side, both landing on unshaded slices' }],
  title: 'Three slices', art: 'S1136', cast: [],
  alt: 'A young man at a game night table spinning a wheel with eight slices, three shaded as winners',
  words: [
    'The spinner at game night had eight slices and three won a prize. Marcus figured his chance was three in eight and spun. Nothing. His friend said he was due. Marcus spun again. Nothing. He was starting to believe in due.',
    'The spinner had no memory. Three in eight, every spin, no matter what the last one did. The two spins were independent, and being due was a feeling, not a probability.',
    'So what were the odds of two losses in a row? Not winning was one minus three eighths: five eighths. Two independent events multiply: five eighths times five eighths, about 39 percent. Two misses was not bad luck. It was the single most likely thing that could happen.',
    'Probability is favorable outcomes over all outcomes. Independent events multiply, and not happening is one minus happening. The spinner is never due, and two misses were the favorite all along.',
  ],
};
STORIES['compound-interest'] = {
  about: 'a snowball rolled downhill, and the account that grew the same way',
  more: [{ serial: 'S1140', after: 1, alt: 'A statement: interest paid on the balance, then on the balance plus interest' }, { serial: 'S1141', after: 3, alt: 'Two lines on a chart, one straight and one curving upward' }],
  title: 'The snowball', art: 'S1139', cast: [],
  alt: 'A young woman rolling a snowball down a hill, it growing with every turn, a bank statement drawn beside it',
  words: [
    'Lena put a thousand dollars in an account paying five percent and expected fifty dollars a year, forever. After year one she had 1,050. After year two she had 1,102.50, and the extra two-fifty confused her. Where had it come from?',
    'From the fifty. In year two the account paid five percent on 1,050, not on 1,000. The interest had earned interest. She thought of a snowball rolled downhill: it picks up snow in proportion to how big it already is, so the bigger it gets, the faster it grows.',
    'That is compound interest. The amount is the principal times one plus the rate, raised to the number of years. At five percent, a thousand dollars is about 1,629 after ten years and 4,322 after thirty. The last ten years add more than the first twenty, because by then the snowball is large.',
    'Compound interest pays interest on the interest. Amount is principal times one plus the rate, to the power of the years. The snowball\'s secret is time, not the hill.',
  ],
};
STORIES['correlation-causation'] = {
  about: 'ice cream sales and drownings that rose together every summer, and the four ways that can happen',
  more: [{ serial: 'S1143', after: 1, alt: 'Four small diagrams: A to B, B to A, a third thing to both, and a shrug' }, { serial: 'S1144', after: 3, alt: 'A sun drawn above both the ice cream cart and the crowded pool' }],
  title: 'Ice cream and the pool', art: 'S1142', cast: [],
  alt: 'A young man at a poolside snack bar looking at a chart where two lines rise together',
  words: [
    'Kai found a chart where ice cream sales and pool drownings rose and fell together across the year, and he wrote that ice cream causes drowning. His professor wrote back one word: how?',
    'Kai could not say how. He tried it the other way: drownings cause ice cream sales. That was worse. But the lines really did move together; that part was not in dispute.',
    'Together is not because. There are four doors. A causes B. B causes A. Something else causes both. Or coincidence. The third door had a name here: summer. Hot weather sells ice cream and fills pools, and pools with more people in them have more accidents. Ice cream was innocent.',
    'Correlation is not causation. When two things move together, hold four doors open: A causes B, B causes A, something causes both, or coincidence. The ice cream was standing next to the real cause.',
  ],
};
STORIES['thesis-statements'] = {
  about: 'a fight worth picking, between a thesis too broad to hold and one too obvious to matter',
  more: [{ serial: 'S1146', after: 1, alt: 'A thesis that says technology changed society, drawn as an ocean' }, { serial: 'S1147', after: 3, alt: 'A thesis that says phones are common, drawn as a pebble' }],
  title: 'A fight worth picking', art: 'S1145', cast: [],
  alt: 'A young woman at a dorm desk with three thesis drafts, the first too big, the second too small, the third circled',
  words: [
    'Rosa\'s first thesis was that technology has changed society. Her professor said she could not prove it in a lifetime. Her second was that most students own phones. He said nobody would argue and nobody would care. She had gone from an ocean to a pebble.',
    'A thesis is a claim someone could dispute. Too broad and it cannot be proved; too obvious and there is nothing to prove. The good one lived in between, where a reader would say prove it and mean it.',
    'Her third: phone bans in lecture halls raise attendance but not grades, and the university is measuring the wrong thing. Now there was a fight. A dean would argue. The data would have to be found. The essay had somewhere to go.',
    'A thesis is a claim someone could dispute, not a topic. Too broad and too obvious are both weak, in opposite directions. Find the sentence a smart reader would push back on, and write toward the pushback.',
  ],
};
STORIES['academic-structure'] = {
  about: 'the sentence that explains why the evidence counts, and how often it goes missing',
  more: [{ serial: 'S1149', after: 1, alt: 'Claim, evidence, and an empty slot labeled warrant' }, { serial: 'S1150', after: 3, alt: 'The slot filled, the paragraph now standing' }],
  title: 'The sentence that explains why', art: 'S1148', cast: [],
  alt: 'A young man at a seminar table with a paragraph on his laptop, a blank line highlighted between a quotation and the next claim',
  words: [
    'Theo\'s paper claimed that the city\'s new bike lanes had cut traffic deaths, and his evidence was a table showing deaths down eleven percent. He moved on to the next point. His professor circled the gap between them and wrote: why does this count?',
    'Theo thought the table spoke for itself. It did not. Deaths had fallen eleven percent in the whole city, and the bike lanes ran on twelve streets. Nothing on the page connected the number to the lanes.',
    'The missing sentence was the warrant. He went back to the data and found that deaths on the twelve streets fell thirty percent while the rest of the city fell four. Now he could write it: the drop was concentrated where the lanes went in, which is what you would see if the lanes were the cause. Claim, evidence, warrant. The third one had done all the work.',
    'An academic argument is a claim, evidence, and a warrant that says why the evidence counts. The warrant is the part most often missing, because the writer already believes it and forgets the reader does not.',
  ],
};
STORIES['numbers-in-prose'] = {
  about: 'a number with no clothes on, and the three questions that dress it',
  more: [{ serial: 'S1152', after: 1, alt: 'The headline: crime up 50 percent, and beneath it, from 2 to 3' }, { serial: 'S1153', after: 3, alt: 'Three questions on a sticky note: of what, compared with when, out of how many' }],
  title: 'A number with no clothes on', art: 'S1151', cast: [],
  alt: 'A young woman at a newsroom desk reading a headline with a large percentage and no base',
  words: [
    'The headline said burglaries in the neighborhood were up fifty percent, and Ana\'s roommates started talking about locks. Ana asked one question: fifty percent of what?',
    'She found the numbers. Two burglaries last year, three this year. Fifty percent, and also one more house. The headline was true, and it had walked into the room with no clothes on.',
    'A number needs three things to be judged. Percent of what: the base. Compared with when: last year, or a bad year chosen to flatter? Out of how many: three burglaries among four thousand homes. Dressed, the number was quiet. Naked, it had sounded like a wave.',
    'Percent of what, compared with when, out of how many. A number without its base cannot be judged, and a headline that leaves the base out is asking you not to.',
  ],
};
STORIES['logical-consistency'] = {
  about: 'a speech that called a plan the cheapest option and the most expensive ever, four minutes apart',
  more: [{ serial: 'S1155', after: 1, alt: 'A list of a speech\'s main claims, numbered' }, { serial: 'S1156', after: 3, alt: 'Two of the claims joined by a line and a question mark' }],
  title: 'Cheap, and the most expensive ever', art: 'S1154', cast: [],
  alt: 'A young man in a town hall audience with a notebook, two contradictory quotes written side by side',
  words: [
    'At the town hall, the speaker said the new bridge was the cheapest option on the table. Four minutes later he called it the most expensive project in the county\'s history. Owen wrote both down and nobody else seemed to notice.',
    'Each sentence sounded fine on its own. The speaker was fluent, confident and applauded. But the two claims could not both be true at once, and an argument that contradicts itself has not proved anything, however good it sounds a sentence at a time.',
    'Owen listed the speech\'s main claims and held them side by side. Cheapest option; most expensive ever. Safe for a century; must be replaced in thirty years. Three pairs that could not coexist. He asked about the first pair during questions, and the speaker had no answer, because there was none.',
    'Consistent means every claim can be true at once. List the main claims, then hold them side by side, because a contradiction hides easily across four minutes and not at all across one line.',
  ],
};
STORIES['primary-and-secondary-sources'] = {
  about: 'a letter from the trenches and a textbook about the trenches, and what each one knows',
  more: [{ serial: 'S1158', after: 1, alt: 'The letter, mud-stained, dated 1916' }, { serial: 'S1159', after: 3, alt: 'The textbook page with a map and a casualty table' }],
  title: 'The letter and the textbook', art: 'S1157', cast: [],
  alt: 'A young woman in an archive holding an old handwritten letter, a modern textbook open on the table beside it',
  words: [
    'Maya had a letter from her great-great-grandfather written in the trenches in 1916 and a textbook chapter on the same battle, and they did not agree about the weather. The textbook said the day was dry. The letter complained of mud to the knees.',
    'The letter was a primary source: made at the time, by someone there. The textbook was secondary: made a century later by someone looking back over hundreds of letters and maps. Each knew something the other could not.',
    'The letter knew the mud in one trench on one morning. The textbook knew the whole front and the whole month, and the average day had been dry. Neither was wrong. Maya learned to ask of every source who made it, when, and from where they were standing, and to want both kinds in the room.',
    'A primary source was made at the time by someone there; a secondary source was made later, looking back. Ask of every source who made it, when, and why. The letter knows the mud; the textbook knows the month.',
  ],
};
STORIES['counting-time'] = {
  about: 'why 1750 is the eighteenth century, and the year that does not exist',
  more: [{ serial: 'S1161', after: 1, alt: 'The years 1701 to 1800 bracketed and labeled 18th century' }, { serial: 'S1162', after: 3, alt: 'A timeline crossing from 1 BC straight to AD 1 with no zero' }],
  title: 'The century off by one', art: 'S1160', cast: [],
  alt: 'A young man at a library table with a long timeline, a gap drawn where year zero would be',
  words: [
    'Sam wrote that 1750 was in the seventeenth century, because it started with seventeen. His professor circled it. Sam was sure, and he was wrong by exactly one century, the way everyone is once.',
    'The first century was the years 1 to 100. So the second began in 101, and the eighteenth ran from 1701 to 1800. The hundreds digit plus one. 1750 was the eighteenth century, and so was 1800, and 1801 began the nineteenth.',
    'Then Sam tried to count from 50 BC to AD 50 and got a hundred years. There is no year zero; 1 BC steps straight to AD 1. So the count is the two numbers added, minus one: ninety-nine years. Two small traps, and every date in the course had walked past both.',
    'The years 1701 to 1800 are the 18th century: hundreds digit plus one. There is no year zero, so from a BC year to an AD year you add the two and subtract one. Time counts differently than a ruler does.',
  ],
};
STORIES['cause-and-effect'] = {
  about: 'dry wood and a match, and why the match gets all the credit',
  more: [{ serial: 'S1164', after: 1, alt: 'Years of drought drawn as a stack of dry seasons' }, { serial: 'S1165', after: 3, alt: 'One spark at the top of the stack, and a forest fire on the horizon' }],
  title: 'Dry wood and a match', art: 'S1163', cast: [],
  alt: 'A young woman crouched at a campfire, a stack of dry wood and a single struck match',
  words: [
    'Lena\'s essay said the war started because an archduke was shot. Her professor asked whether every shooting starts a war. Lena said this one did. He asked what the wood had been doing for the twenty years before the match.',
    'Long-term causes build for years: alliances that tied every country to a fight, arms races, empires rubbing at the edges. Those were the dry wood. The shooting was the trigger, the spark that would have gone out on a wet pile.',
    'And effects come in kinds too. Short-term: mobilization within weeks. Long-term: empires gone, borders redrawn, a peace that grew the next war. Lena rewrote her thesis. The match lit the fire; the wood decided how big it would be.',
    'Causes come in kinds: long-term causes build for years, a trigger is the spark, and effects can be short-term or long-term. Give the match its due and the wood its share.',
  ],
};
STORIES['the-big-turns'] = {
  about: 'eight hinges the world swung on, and how to tell a hinge from a headline',
  more: [{ serial: 'S1167', after: 1, alt: 'A plow, a clay tablet, a ballot, a printing press' }, { serial: 'S1168', after: 3, alt: 'A ship, a steam engine, a mushroom cloud, a glowing screen' }],
  title: 'Eight hinges', art: 'S1166', cast: [],
  alt: 'A young man walking a museum hall with eight doorways, each opening on a different age',
  words: [
    'Marcus asked what made an event important enough for the course, since the world had thousands of events a year. His professor said most events are weather. A few are hinges: after them, the door does not swing the same way again.',
    'Farming turned wanderers into villagers. Writing let a thought outlive its thinker. Republics put power in more hands. Printing made a book cheaper than a horse. The Columbian exchange traded crops, animals and diseases across an ocean. Industry moved work from muscle to engine. The atomic age put the end of the world within reach. The web put every library in every pocket.',
    'The test for a hinge was the same each time: did people afterward live in a way that was impossible before? A battle changes who rules. A hinge changes what a life is. Marcus started sorting the headlines of his own decade with the same question.',
    'Farming, writing, republics, printing, the Columbian exchange, industry, the atomic age and the web are the great turns. Each changed what a human life could be, which is the test that separates a hinge from a headline.',
  ],
};
STORIES['writing-history'] = {
  about: 'bricks and a house, and the difference between a fact and a claim',
  more: [{ serial: 'S1170', after: 1, alt: 'A stack of bricks labeled facts, no shape yet' }, { serial: 'S1171', after: 3, alt: 'The bricks built into a small house with one sentence over the door' }],
  title: 'Bricks and a house', art: 'S1169', cast: [],
  alt: 'A young woman at a study desk with a pile of index cards on one side and a single sentence pinned above them',
  words: [
    'Rosa\'s history paper was twelve pages of facts, all of them correct, in date order. Her professor gave it back and said it was a pile of bricks. Rosa asked what was wrong with bricks. He said nothing, and that nobody lives in a pile.',
    'A fact is not a claim. A thesis is a sentence somebody could disagree with, and the facts are what you build it out of. Rosa had the materials and no house.',
    'She wrote the sentence: the famine was a policy failure before it was a crop failure. Now the bricks had somewhere to go, and some of them did not belong. Then she matched her words to her evidence: certainly where the record was thick, probably where it was thin, and one paragraph that said plainly what could not be known. The house stood, and it was honest about its weak wall.',
    'A fact is not a claim; a thesis is a sentence somebody could disagree with. Match the strength of your words to the strength of the evidence, so the house stands on what the bricks can hold.',
  ],
};
STORIES['ending-sounds'] = {
  about: 'a cat said very slowly, and the little tuh at the end',
  more: [{ serial: 'S1173', after: 1, alt: 'The boy with his tongue tapping behind his teeth for the tuh sound' }, { serial: 'S1174', after: 3, alt: 'The letters C, A and T with the last one glowing' }],
  title: 'The sound at the end', art: 'S1172', cast: [],
  alt: 'A boy saying a word slowly with a cat on his lap, three letters floating out of his mouth',
  words: [
    'Sam could hear the start of cat. Cuh. He could not hear the end. It went by too fast.',
    'His dad said, say it slowly. Sam said cat. His dad said, slower.',
    'C. A. T. There it was. A little tuh at the end. His tongue tapped behind his teeth. Then bus. B, u, s. The last sound was sss.',
    'Say the word slowly. The last sound is the ending sound.',
  ],
};
// Four modules added on 2026-09-23.
STORIES['dictionary-skills'] = {
  about: 'a word that hid on the wrong page until a girl read the words at the top',
  more: [{ serial: 'S1176', after: 1, alt: 'The top of a dictionary page with the guide words jug and jump' }, { serial: 'S1177', after: 3, alt: 'The girl\'s finger landing on the word jungle between them' }],
  title: 'The wrong page', art: 'S1175', cast: [],
  alt: 'A girl flipping through a thick dictionary at a library table, frustrated, one finger holding a page',
  words: [
    'Priya needed the word jungle for her report and opened the dictionary to G, because that was the sound she heard. Nothing. She flipped forward and back until the pages blurred. The dictionary was enormous and the word was hiding.',
    'She almost gave up and guessed the spelling. Then she noticed two words printed at the top of every page in bold, one on the left and one on the right. She had never once looked at them.',
    'They were guide words, and they told her what each page held. Jungle starts with J, so she went to J. The second letter is U, so she went past the JA and JO pages. Then she found the page whose guide words were jug and jump. Jungle sits between them, and there it was.',
    'A dictionary is sorted by the first letter, then the second, then the third. The guide words at the top of a page name its first and last entries, so you never have to read the page to know whether your word is on it.',
  ],
};
STORIES['simple-machines'] = {
  about: 'a piano too heavy to lift, and the ramp that did not make it any lighter',
  more: [{ serial: 'S1179', after: 1, alt: 'Two movers straining to lift the piano straight up, unable to' }, { serial: 'S1180', after: 3, alt: 'The long ramp beside the tall truck bed, the piano halfway up' }],
  title: 'The piano', art: 'S1178', cast: [],
  alt: 'Movers rolling an upright piano up a long ramp into a truck, a girl watching from the driveway',
  words: [
    'The movers could not lift Grandma\'s piano into the truck. Two of them strained until their faces went red and the piano rose about an inch. Nina watched from the driveway, sure the piano was staying.',
    'Then they pulled a long metal ramp from the truck and laid it against the back. They rolled the piano up it, slowly, and it went in. Nina did not understand. The piano weighed the same as it had a minute ago. Where had the weight gone?',
    'Nowhere. The ramp had made a trade. Instead of lifting the piano straight up four feet, the movers pushed it along twelve feet of ramp. Less force, more distance. The work was exactly the same, spread out over a longer path. That is what every simple machine does.',
    'A ramp, a lever, a pulley, a wheel: each one trades force for distance, or distance for force, and the total work never changes. Machines do not make jobs smaller. They make them possible, by stretching a hard push into a long easy one.',
  ],
};
STORIES['coordinate-plane'] = {
  about: 'a treasure map, two numbers, and the boy who walked them in the wrong order',
  more: [{ serial: 'S1182', after: 1, alt: 'The boy walking three paths east, then two north, to a marked corner' }, { serial: 'S1183', after: 3, alt: 'The same boy at a different corner after walking north first' }],
  title: 'Three east, two north', art: 'S1181', cast: [],
  alt: 'A boy holding a treasure map in a park, a grid of paths drawn on the ground, a small X in the distance',
  words: [
    'The treasure map said the prize was at 3, 2 and nothing else. Jamal stood at the start of a park laid out in straight paths and had no idea what the two numbers wanted from him. Three what? Two what?',
    'He tried walking two paths and then three and found himself at a bench with nothing under it. He tried three and then two in every direction and found another bench. The map was either broken or he was.',
    'His sister took the map. Across first, then up, she said. Three blocks east along the bottom, then two blocks north. The corner she reached had a small stone with an X on it. Two numbers, one point, and the order was the whole secret.',
    'The coordinate plane works exactly like that park. The first number says how far across, the second says how far up, and swapping them lands you somewhere else. Two numbers, one point, always across first.',
  ],
};
STORIES['watersheds'] = {
  about: 'a crumpled paper bag, a cup of water, and the corner where every drop ended up',
  more: [{ serial: 'S1185', after: 1, alt: 'A close look at the creases of the bag, drops running down them like creeks' }, { serial: 'S1186', after: 3, alt: 'A river map with every stream feeding one river' }],
  title: 'The crumpled bag', art: 'S1184', cast: [],
  alt: 'A boy pouring water from a cup over a crumpled paper bag, the water running along the creases',
  words: [
    'Kai lived on a street with a storm drain and a creek at the bottom of the hill, and he had never once wondered where the creek came from. Then his teacher handed him a crumpled paper bag and a cup of water.',
    'He poured a little water on the top of the bag. It ran along the creases, joined other trickles, and gathered in one low corner. He poured on the other side. Different creases, same corner. He could not make the water go anywhere else.',
    'The creases were ridges. The folds between them were creeks. Every drop that fell on the bag ran downhill to the same river, and all the land that drained to that corner was its watershed. His street, his storm drain, the creek: one bag, one corner.',
    'A watershed is all the land that drains to one river, and upstream becomes downstream. What you pour on the top of the bag ends up in the corner, which is why a town cares what happens on the hill above it.',
  ],
};
// Four modules added on 2026-09-23, second batch.
STORIES['quarter-hours'] = {
  about: 'a bus at quarter past eight, and the long hand that told a boy how long he had',
  more: [{ serial: 'S1188', after: 1, alt: 'The clock with the long hand on the 3' }, { serial: 'S1189', after: 3, alt: 'The long hand on the 9, the boy grabbing his bag' }],
  title: 'Quarter past', art: 'S1187', cast: [],
  alt: 'A boy in a kitchen looking at a wall clock, the long hand on the 3, a school bag by the door',
  words: [
    'The bus came at quarter past eight. Sam looked at the clock. The long hand was on the 3. Was that quarter past? He was not sure.',
    'He did not want to miss the bus again.',
    'His mom showed him. Long hand on the 3: quarter past. On the 6: half past. On the 9: quarter to. The long hand was on the 3. Time to go.',
    'The long hand on the 3 says quarter past. On the 6, half past. On the 9, quarter to.',
  ],
};
STORIES['sound'] = {
  about: 'a rubber band, a cup and the buzz that a boy could feel with his finger',
  more: [{ serial: 'S1191', after: 1, alt: 'The rubber band a blur as it shakes, plucked hard' }, { serial: 'S1192', after: 3, alt: 'The band stretched tighter across the cup, the boy listening' }],
  title: 'The rubber band', art: 'S1190', cast: [],
  alt: 'A rubber band stretched over the top of a paper cup, a boy plucking it, his other finger touching the band',
  words: [
    'Owen stretched a rubber band over a paper cup and plucked it. Twang. He plucked it again and, while it was still buzzing, touched it with his finger. It tickled. The sound stopped the moment he touched it.',
    'That was strange. Why would a finger stop a sound? He tried again. Every time the band shook, there was a sound. Every time he held it still, silence. The sound and the shaking were somehow the same thing.',
    'They were. Sound is a vibration, something shaking fast enough to shake the air. Owen plucked harder and the band shook wider, and the sound got louder. He stretched the band tighter and it shook faster, and the sound went higher. Bigger shake, louder. Faster shake, higher.',
    'Every sound you have ever heard is something vibrating, from a guitar string to your own voice. Put a hand on your throat and hum. That buzz is you, shaking the air.',
  ],
};
STORIES['microscopes'] = {
  about: 'a slice of cork under a lens, and the tiny rooms a girl found inside it',
  more: [{ serial: 'S1194', after: 1, alt: 'The view through the lens: rows of tiny box-shaped rooms in the cork' }, { serial: 'S1195', after: 3, alt: 'An old engraving-style drawing of the same cork cells from 1665' }],
  title: 'The rooms in the cork', art: 'S1193', cast: [],
  alt: 'A girl at a microscope, her eye to the lens, a thin slice of cork on the slide',
  words: [
    'Lena put a shaving of cork under the microscope, expecting to see cork. Brown, soft, boring. What she saw instead was a wall of tiny boxes in rows, like the rooms of a building seen from above. She checked the slide twice to be sure it was cork.',
    'Her teacher asked how much bigger the boxes looked than they really were. Lena read the two lenses: ten and forty. She added them and said fifty. The teacher shook her head.',
    'The lenses multiply. Ten times forty is four hundred, so each tiny room looked four hundred times its real size. The focus knob made the walls sharp. And in 1665, a man named Hooke had looked at cork through the same kind of lens and seen the same rooms. He called them cells, after the small rooms in a monastery.',
    'Lenses magnify, magnifications multiply, and focus makes the picture sharp. Every living thing is built of cells, and a piece of cork was the first place anyone saw them.',
  ],
};
STORIES['where-things-come-from'] = {
  about: 'the tag on a shirt and the four countries the shirt had visited before the store',
  more: [{ serial: 'S1197', after: 1, alt: 'A cotton field, a spinning mill, a weaving loom and a sewing floor in four small panels' }, { serial: 'S1198', after: 3, alt: 'A cargo ship stacked with containers leaving a port' }],
  title: 'The tag', art: 'S1196', cast: [],
  alt: 'A girl reading the tag inside a shirt, a small trail of drawn map pins leading away from it',
  words: [
    'Lena\'s new shirt said Made in Vietnam on the tag, so she assumed the whole shirt came from Vietnam. Her geography teacher asked where the cotton was grown. Lena checked the tag again. It did not say.',
    'She followed the shirt backward and it kept going. The cotton was grown in one country. Spun into thread in another. Woven into cloth in a third. Sewn in a fourth. Shipped across an ocean and trucked to her store. The tag named one place. The shirt had been to five.',
    'That road is a supply chain: the steps and places between a raw material and you. Each place along it does what it does best and cheapest, which is called specializing, and then trades for the rest. No one country makes a whole shirt. They make it together, one stop at a time.',
    'A supply chain is the steps and places between a raw material and you. Places specialize and trade, so almost nothing you own comes from just one place. The tag is the last stop, not the whole trip.',
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
  'reading-11': { title: 'Chloe and the satire', about: 'seventeen-year-old Chloe, a satire about paint, and the claim that needed five weeks of receipts', art: 'CS51', alt: 'A teenager of seventeen in a craft-store apron at a break-room table, a school newspaper with a mock advertisement, a stack of receipts', cast: [], words: ['Chloe was seventeen and had a job at an art supply store, so when the school paper ran a satire praising a paint that dried before you could use it, she was the first to get the joke: praise with a straight face, and the target was every sales pitch she made all day. She wrote a reply arguing the store\'s side, and her English teacher made her name the best objection before her own case. Some say the good paint costs too much. It does, up front. Then the answer.', 'The essay she wrote that spring had a long sentence that carried the reader from the store, past the mall, through the parking lot, to the bus, and then one word on its own line. Stop. She had learned that sentences have speeds, the way a brush stroke does, and that a writer switches them on purpose. Her teacher read it aloud without saying whose it was.', 'The hardest lesson was enough: a big claim on a small pile of evidence, and Chloe had a big claim about the store\'s prices and one week of receipts. Relevant, yes. Sufficient, no. She collected four more weeks before she said it out loud, and she painted the chart herself, which is how the whole class ended up reading it.'] },
  'reading-12': { title: 'Georgette reads two sources', about: 'eighteen-year-old Georgette, two witnesses to one fire, and the word she chose in the end', art: 'CS52', alt: 'A young woman of eighteen in a library archive with two typed witness statements side by side, a fire marshal\'s report, and a pencil', cast: [], words: ['Georgette was eighteen and writing a piece about the old fire station for the town history, and she had two witnesses. Both agreed on the date. One said the station burned because the budget was cut; the other said a heater failed. She held both in her head and did not choose. Where two sources differ is where the thinking starts, and the thinking led her to the fire marshal\'s report, which said heater.', 'The council member who had blamed the budget had skipped a step: from the cut to the fire, with no proof the two were connected. An assumption is the step the writer skipped, and Georgette learned to ask what would have to be true. She also learned that the four ways to describe the firefighters standing in the street were not the same: they walked, strolled, marched, trudged. They had trudged. She wrote trudged.', 'Her piece began at the fire and ended at the rebuilding, and she could say why: the author\'s choices about where to begin and end were the story\'s argument. The town history is in the library now, with her name in it. She was eighteen. The wisdom people would come to her for later was already in the way she read.'] },
  'math-9': { title: 'Frederick and the culture flask', about: 'fourteen-year-old Frederick, a flask of yeast, and the algebra that kept up with it', art: 'CS27', alt: 'A boy of fourteen in a too-big lab coat at a bench with a flask of cloudy yeast, a notebook of curves, a graduate student looking over his shoulder', cast: [], words: ['Frederick was fourteen and had been given a corner of a real lab for the summer, a flask of yeast and a rule: measure everything. The yeast doubled every ninety minutes, and by the second day he had learned the difference between adding and multiplying the hard way. Adding two each round would have reached twenty-one; doubling reached a thousand. Exponential, said the graduate student, and drew the curve.', 'The sugar feed was a function: put in a temperature, out came a growth rate, the same temperature never giving two answers, a vending machine that never lied. The budget for the flasks was two equations with one answer, a flat cost against a cost per flask, and the lines crossed at thirty. Frederick solved it in the margin of his notebook and the graduate student stopped checking his math.', 'The last week he needed the area of a rectangular tray of dishes, x plus 2 by x plus 3, and factored it the other way to find the sides from the area. The lab kept his notebook when the summer ended. He kept the habit. Everything measured, everything written down, and the curve always drawn.'] },
  'math-10': { title: 'Chloe and the shadow', about: 'fifteen-year-old Chloe, a sculpture too tall to measure, and the triangle that measured it', art: 'CS53', alt: 'A girl of fifteen holding a meter stick beside a tall abstract park sculpture, both casting long shadows on the paving', cast: [], words: ['Chloe was fifteen and wanted to know how tall the sculpture in the park was, because she was going to draw it and the proportions mattered. She could not climb it. So she stood at its foot with a meter stick and measured its shadow, then the stick\'s shadow, and the two triangles were the same shape: same angles, every length scaled by the same number. The stick\'s ratio gave the sculpture\'s height. Eleven meters.', 'Her drawing needed the sculpture turned: a rotation on the page, a quarter turn, coordinates swapped and one sign flipped. She reflected it across a line for a second version and slid it for a third, and the three drawings hung side by side in the school show, the same shape three ways.', 'The base of the sculpture was a circle, and she wanted a quarter of it for the frame of the picture, so she cut the crust and the pie both: angle over 360, a quarter of the circumference and a quarter of the area. She never took a trigonometry class she liked. She took one she used, and the sculpture is eleven meters tall, and she was right.'] },
  'math-11': { title: 'Mike and the arch', about: 'sixteen-year-old Mike, a doorway he was paid to build, and the curve that had two answers', art: 'CS54', alt: 'A teenager of sixteen in work gloves fitting a curved wooden garden arch between two posts, a tape measure and a notebook of curves on the grass', cast: [], words: ['Mike was sixteen and building a garden arch for a neighbor for money, the first thing he had ever been paid to design. The arch was a parabola, and it had to touch the ground in two places exactly six feet apart, and the quadratic formula told him where the curve crossed the ground before he cut a single board. The part under the root told him first whether it crossed at all.', 'The lumber came in lengths that multiplied out into four patches of a rectangle, and the rope ladder for the kids next door doubled its knots every trial, two, four, eight, sixteen: a geometric sequence, and he knew the tenth term without counting. The neighbor asked how many doublings would get to a thousand, and Mike knew that was a logarithm before he knew the word.', 'The last problem was the absolute value one: a post four feet from the center could go left or right, two answers, always, because distance has no direction. He set both posts. The arch stood. Mike had grown up believing failure was a verdict; that summer he learned it was a measurement, and measurements can be taken again.'] },
  'math-12': { title: 'Frederick and the tide', about: 'seventeen-year-old Frederick, a sea wall, and the circle that predicted the water', art: 'CS55', alt: 'A young man of seventeen on a sea wall at dawn with a tide table and a notebook, a boat in the harbor below, a circle sketched in the margin', cast: [], words: ['Frederick was seventeen and spent the summer at a marine station on his uncle\'s coast, where the tide was the whole calendar. He wanted to predict it, and the shape of a tide is a sine wave: a walk around a circle of radius one, the height of the water being how far up you are on the circle at any hour. At 45 degrees he was equally across and up; the water was halfway.', 'The tide table shifted every day, and shifting a function is moving the picture on the wall: add outside the brackets and it lifts; subtract inside and it slides right. Two machines in a row, hour into height and height into whether the sampling boat could leave, was a composite function, and he worked it inside out every morning before the lab opened.', 'The station was testing well water for something that decayed with a half-life, and Frederick halved and halved the numbers until they were safe, four half-lives, sixteen times smaller. The ends of every curve he drew did what the highest power told them to. He left the coast in August with a notebook of tides and the habit of predicting things he could not control, which turned out to be most of science.'] },
  'history-college': { title: 'Mike thinks like a historian', about: 'Mike at twenty-one, the story of his own block, and the difference between bricks and a house', art: 'CS56', alt: 'A young man of twenty-one, bald and bearded, presenting at a community-college lectern with a photograph of an old city block, an elderly woman in the back row and a red-haired woman in the front', cast: [], words: ['Mike was twenty-one and taking one class at the community college between shifts, and the class was history, which he had assumed was memorizing. It was not. It was evidence. The first assignment was the history of his own block, and he had two kinds of sources: his grandmother, who had been there, primary; and a newspaper clipping written forty years later, secondary. The grandmother was more vivid and the clipping more careful, and he learned to use both.', 'The block had been built in 1889, which was the nineteenth century, because centuries are named one ahead of their years. The fire that had emptied it in 1958 had a long-term cause, the dry wood of a landlord who never repaired anything, and a trigger, a match. Historians name both, the fuse and the spark.', 'His final paper was a thesis, not a fact: the block was rebuilt because the neighbors organized, not because the city cared. Bricks are facts; a house is an argument you could lose. He defended it in front of the class with his grandmother in the back row. Savanah was in the front. That is how they met, and it is the only story of the block Mike still tells.'] },
  'math-college': { title: 'Frederick and the numbers that lied', about: 'Frederick at twenty-two, a lab full of data, and the day he stopped trusting an average', art: 'CS57', alt: 'A young man of twenty-two in a lab coat at a bench with a laptop of scattered data points, a napkin of calculations, and a flask set apart from the others', cast: [], words: ['Frederick was twenty-two and working in a real lab now, with a dataset of cell counts and a supervisor who wanted a number. The mean was easy and it lied: one flask had gone wild and pulled the average up while the median sat where the real flasks were. Two batches with the same mean had nothing else in common; one was tight and one was scattered. The spread told the story the average hid.', 'The probability of a contaminated flask was three in eight on the old equipment, and over a hundred runs it came out at thirty-seven, close enough to trust the odds. The grant money sat in an account earning interest on its interest, a snowball rolling downhill, and Frederick did the arithmetic on a napkin and understood why the university never spent it early.', 'His first paper had a correlation in it that the reviewers loved and Frederick did not: the cells grew faster in the summer flasks. So did the lab\'s ice cream budget. Hot rooms, not ice cream, and not summer either. Look for the third thing. He took the claim out. The paper was shorter and true, and his supervisor said that was the whole job.'] },
  'reading-college': { title: 'Georgette and the argument', about: 'Georgette at twenty, an academic argument that did not hold, and the four sentences that fixed it', art: 'CS58', alt: 'A young woman of twenty in a university library with a paper marked in red, a stack of journals, and a window onto a campus lawn', cast: [], words: ['Georgette was twenty and reading for a degree, and the first paper she wrote came back with one comment: this is a topic, not a thesis. Cities have parks. Nobody argues. Cities should fund parks before roads: now someone could. She picked the fight, and the fight organized everything after it.', 'Each paragraph needed a claim, evidence and a warrant, and the warrant was the sentence most writers skip, the one that says why the evidence counts. A paper she was assigned to review said forty percent, of nothing in particular, a number with no clothes on, and another said a plan was cheap in paragraph two and the most expensive ever in paragraph six. She listed the claims and checked whether they could all be true. They could not.', 'Her own paper ran eight pages and held. She had learned to read the way a careful person listens: for the step that was skipped, for the number without its base, for the two sentences that cannot both stand. Years later, when Mike brought her his troubles and asked what she thought, that is how she thought. It began in a library at twenty with a comment in red.'] },
  'writing-9': { title: 'Mike and the turn', about: 'fourteen-year-old Mike, an ordinary evening, and the phone call that changed the paragraph', art: 'CS59', alt: 'A boy of fourteen at a kitchen table with homework spread out, a wall phone ringing, a plate of dinner going cold', cast: [], words: ['Mike was fourteen when the analysis paragraph clicked: a claim about the narrator, a quotation, and then the sentence that said what the quotation showed. The quote never spoke for itself. He had been letting quotes speak for themselves for years and wondering why teachers wrote so what in the margin.', 'The narrative with a turn was assigned the week the phone rang at dinner and his uncle was in the hospital. Everything had been ordinary, dishes and homework, and then the phone. He wrote it slowly at the turn, the way the assignment said, and let the ending show what the call had changed, which was everything and, by the end of the year, nothing, because his uncle came home.', 'The rhetorical analysis was of the mayor\'s speech about the crosswalk Mike had asked for at eight. What did it argue, which appeals, did they fit? A boy\'s story, a nurse\'s credibility, the numbers. They fit. Mike gave the analysis an A in his own head before the teacher did, and was right, which was becoming a habit.'] },
  'writing-10': { title: 'Chloe writes about a painting', about: 'fifteen-year-old Chloe, a novel and a painting, and the argument that needed three scenes', art: 'CS60', alt: 'A girl of fifteen in a paint-flecked jacket at a desk with a novel bristling with sticky notes, a photograph of a community mural pinned above', cast: [], words: ['Chloe was fifteen and had a claim about the novel her class read that nobody else had made: the house was the real villain. Her teacher said prove it three times. She found the house on page 3, page 150 and page 300, quoted each, and after each quotation wrote the sentence that said what it showed. One scene proves a moment; three prove a pattern.', 'The sourced argument was about the school\'s plan to paint over the community-center mural she had planned at nine. Every fact had a name behind it: the center\'s director, the city\'s own survey, a study of murals and neighborhood pride. An argument with sources is an argument someone can check. The mural stayed.', 'The reflective essay was two columns. Before: she had thought art was about the picture. After: it was about the people who walked past it every day. The gap between the columns was the essay, and it was the first thing she wrote that made her mother cry, in the good way.'] },
  'writing-11': { title: 'Frederick writes the op-ed', about: 'sixteen-year-old Frederick, three sources that disagreed, and thirty seconds of a stranger\'s attention', art: 'CS61', alt: 'A boy of sixteen in a lab coat at the edge of a pond, a printed newspaper op-ed with his name on it, a county biologist crouched at the water', cast: [], words: ['Frederick was sixteen and had three sources on the pond behind the school, and they disagreed. The synthesis essay was organized by his reasons, not by his sources, and where the sources argued he said so instead of pretending. The literary argument that term was about a river in a novel being the book\'s conscience, proved from the first page to the last, and he realized he was making the same case twice, once for a river and once for a pond.', 'The op-ed was the one that mattered. The local paper gave him three hundred words and a stranger\'s thirty seconds. Hook: the county said the pond was dying, and it was not. Position, evidence, one specific ask: send a biologist. He rewrote the first line eleven times.', 'The paper ran it. A biologist came. Frederick was there in the lab coat that was almost the right size by then, and the biologist asked where he was applying to college, and Frederick, who had never thought of himself as the kind of person who got asked that, said he did not know yet. He knew by the fall.'] },
  'writing-12': { title: 'Mike and the letter to the editor', about: 'eighteen-year-old Mike, a research question about the water, and the one-page letter that moved a town', art: 'CS62', alt: 'A young man of eighteen sealing a one-page letter at a workbench, a thick research paper beside him, a newspaper folded to the letters page', cast: [], words: ['Mike was eighteen and his research paper started with a question he did not trust anyone else to answer: where did the town\'s water come from, and was it safe? He reported what five sources said, then built his own answer on top and said which source held which part. The paper was long. The answer was short: the river, and mostly.', 'The personal essay for his application was one afternoon, not a whole year: the day at twelve when a job site foreman had handed him a level and told him to check the man\'s own work. One small true moment, told well, about learning that being trusted to find a mistake is the beginning of being trusted at all. It was the essay the admissions officer mentioned in the acceptance letter.', 'The letter to the editor was one point, one ask, one page: the town should publish its water tests, with the twelve results he had already found. A busy stranger was reading. The paper printed it on a Tuesday. The town published the tests in June. Mike learned that year that a page can move a town, and that the page had better be right, because he had checked every number twice.'] },
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
  about: 'a girl who had to send the number 10 across a field with nothing but four flashlights',
  more: [{ serial: 'S1218', after: 1, alt: 'Four flashlights in a row on a fence post at dusk, the first and third lit' }, { serial: 'S1219', after: 3, alt: 'The friend across the field holding up ten fingers' }],
  title: 'Four flashlights', art: 'S1217', cast: [],
  alt: 'A girl on a dark fence line with four flashlights lined up on the post, a friend far across the field',
  words: [
    'Priya had one job at the campout: tell her friend across the field how many marshmallows to bring back from the car. The number was ten. She had no phone, no paper, and the field was too wide to shout across. All she had was a row of four flashlights on the fence post.',
    'She tried flashing one light ten times. Her friend counted eight, then lost track when a moth flew past. She tried again. Nine. The marshmallows were not getting any closer.',
    'Then she stopped counting flashes and started using places. She gave each flashlight a value, left to right: 8, 4, 2 and 1. A light that was on meant count me. A light that was off meant skip me. To send ten, she turned on the 8 and the 2 and left the other two dark. Her friend added the lit ones, 8 plus 2, and held up ten fingers. No counting, no moths, one look.',
    'That is binary. Every place is a switch that is on or off, a 1 or a 0. You read the number by adding the values of the places that are on. Priya\'s four flashlights could say any number from 0 to 15. Your phone has billions of switches. Every photo, song and message on it is a very long row of lights that are on or off.',
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
    'Ten to twelve hours of sleep. The same quiet routine each night.',
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
    'Half the plate fruits and greens; water to drink.',
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
  about: 'a clock that kept time, and the song that had a clock inside it',
  more: [{ serial: 'S1251', after: 1, alt: 'The clock with its hands and a tick drawn beside it' }, { serial: 'S1252', after: 3, alt: 'Children clapping together in time' }],
  title: 'The clock in the song', art: 'S1250', cast: [],
  alt: 'A girl tapping a steady beat on her knees while a clock ticks on the wall',
  words: [
    'Tick, tick, tick. The clock on the wall kept time. Mia tapped along. Then the music teacher played a song. Keep tapping, she said.',
    'The song had lots of notes. Mia did not know where to tap.',
    'Under the notes was a pulse, even as the clock. The beat. She found it and tapped it. Every song has a clock inside it.',
    'The beat is the even pulse under a song, like a clock.',
  ],
};
STORIES['high-and-low'] = {
  about: 'a bird, a cow and a piano, and which way the notes climbed',
  more: [{ serial: 'S1254', after: 1, alt: 'The bird on a branch, its song drawn high' }, { serial: 'S1255', after: 3, alt: 'Fingers walking to the right on the piano keys' }],
  title: 'Bird high, cow low', art: 'S1253', cast: [],
  alt: 'A boy on a farm hearing a bird sing high and a cow moo low, a small piano drawn beside him',
  words: [
    'The bird sang. The cow mooed. Kai said they were the same sound. His sister said one was high and one was low.',
    'What did high and low mean for a sound? A sound was not up or down.',
    'Inside, on the piano, Kai walked his fingers to the right. The notes climbed, higher and higher, toward the bird. To the left they sank toward the cow. High and low is pitch.',
    'High and low is pitch. On a piano, right is higher.',
  ],
};
STORIES['loud-and-soft'] = {
  about: 'a parade drum, a lullaby, and why one had to be loud and one had to be soft',
  more: [{ serial: 'S1257', after: 1, alt: 'The big drum with sound waves drawn bursting out' }, { serial: 'S1258', after: 3, alt: 'A parent singing softly to a sleeping baby' }],
  title: 'The drum and the lullaby', art: 'S1256', cast: [],
  alt: 'A girl covering her ears at a loud parade drum, a baby asleep in a stroller nearby',
  words: [
    'The parade drum was so loud that Ana covered her ears. That night her mom sang a lullaby. It was so soft Ana could barely hear it. Why not sing loud too?',
    'Loud and soft are for different jobs.',
    'The drum had to reach the whole street. Loud. The lullaby had to reach one sleepy baby. Soft. A song can grow louder or fade away. That is dynamics.',
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
// Depth modules, added on 2026-09-23.
STORIES['area-and-perimeter'] = {
  about: 'a garden bed that needed two different numbers, and the girl who thought one would do',
  more: [{ serial: 'S1269', after: 1, alt: 'A tape measure running along the fence: four feet, three feet, four feet, three feet' }, { serial: 'S1270', after: 3, alt: 'The bed seen from above, divided into twelve one-foot squares of soil' }],
  title: 'Around and inside', art: 'S1268', cast: [],
  alt: 'A rectangular garden bed with a wire fence around it, a girl kneeling beside it with a tape measure',
  words: [
    'Priya\'s mom asked her to measure the garden bed so they could buy fence wire and soil. Priya measured once, wrote down a number, and thought she was done. At the store the wire was right and the soil was three bags short.',
    'How could one garden need two numbers? It was the same bed. She had measured it carefully. But the wire went around the edge, and the soil filled the inside, and those were not the same thing at all.',
    'She measured again, two ways. Around the edge: four feet, three feet, four feet, three feet. Fourteen feet of wire. That was the perimeter. Inside: four rows of three squares, twelve square feet of soil. That was the area. Two questions, two numbers.',
    'Perimeter is the walk around the edge, and it is measured in feet. Area is the surface covered, and it is measured in squares. Before you measure anything, ask which one the question wants. The fence and the soil will never agree.',
  ],
};
STORIES['angles-and-lines'] = {
  about: 'a bedroom door and the four angles it made between closed and flat against the wall',
  more: [{ serial: 'S1272', after: 1, alt: 'The door open just a crack, a narrow wedge of light on the floor' }, { serial: 'S1273', after: 3, alt: 'The door straight out from the wall, making a square corner' }],
  title: 'The door', art: 'S1271', cast: [],
  alt: 'A boy slowly swinging a bedroom door open, its angle to the wall growing wider',
  words: [
    'Kai\'s homework asked for an acute angle, a right angle and an obtuse angle from around the house. He looked at the clock, the table and the roof and could not find any. Angles seemed to live only on worksheets.',
    'Then his little sister opened his door a crack to spy on him. The door and the wall made a thin wedge. He pushed it a bit wider. A bigger wedge. He pushed it straight out. A square corner. He pushed it all the way back. Flat.',
    'The door had been drawing angles the whole time. Barely open, a small wedge: acute, less than a right angle. Straight out from the wall: a right angle, 90 degrees, the corner of a square. Pushed farther back: obtuse, wider than a right angle. Flat against the other wall: a straight line.',
    'Angles are everywhere two lines meet. A right angle is 90 degrees, acute is smaller, obtuse is wider. Lines that run side by side and never meet are parallel, like the top and bottom of the door. Lines that cross at a square corner are perpendicular. Open any door and you can see all of it.',
  ],
};
STORIES['mean-median-mode-6'] = {
  about: 'six allowances, four kinds of average, and the friend who moved the mean without moving anyone else',
  more: [{ serial: 'S1275', after: 1, alt: 'The dollars shared out evenly across all six places' }, { serial: 'S1276', after: 3, alt: 'The six stacks lined up from smallest to tallest, a finger on the middle two' }],
  title: 'The friend who moved the mean', art: 'S1274', cast: [],
  alt: 'Six children at a lunch table, each with a small stack of dollar bills, one stack much taller',
  words: [
    'Six friends compared allowances at lunch: two, three, three, four, five and nine dollars. Nadia said the average was four and a half. Marcus said most people got three. Lena said the middle was three and a half. All three were right, which made no sense.',
    'They argued about which number was the real one. The nine-dollar friend, Sam, said the average was four and a half and that proved everyone was doing fine. The two-dollar friend did not feel fine.',
    'There were four honest numbers, and each told something different. The mean added it all and shared it out: four and a half, pulled upward by Sam. The median was the middle after sorting, three and a half, and Sam could not move it. The mode was the most common, three. The range was highest minus lowest, seven, and it measured the gap between Sam and everyone else.',
    'Mean: add and share. Median: the middle. Mode: the most common. Range: highest minus lowest. One big number can drag the mean far from where most people are, which is why the median often tells the truer story.',
  ],
};
STORIES['four-quadrants'] = {
  about: 'a city whose streets were counted from the center, and two corners that were the same distance apart in opposite directions',
  more: [{ serial: 'S1278', after: 1, alt: 'A map with four colored quarters around the center point, numbered counterclockwise' }, { serial: 'S1279', after: 3, alt: 'Two pins on the map, one at three east and two north, one at three west and two south' }],
  title: 'East and north', art: 'S1277', cast: [],
  alt: 'A girl standing at a city center plaza, streets marked in four directions, a map in her hand',
  words: [
    'Ava\'s new city counted its streets from the center. Three blocks east and two blocks north was her school, at 3, 2. She understood that. Then her friend gave an address of minus three, minus two, and Ava did not know a street could be negative.',
    'She walked three blocks east and two north and found the school. Then she tried to walk minus three blocks and stood on the corner, stuck. You cannot take a negative step. Or could you?',
    'Her friend showed her. Negative across just meant west instead of east. Negative up meant south instead of north. Minus three, minus two was three blocks west and two blocks south, the same distance from the center as the school, on the opposite corner of the city. The center split the city into four quarters, and the signs told you which one you were in.',
    'Positive across is right, negative is left; positive up, negative down. The four quadrants count counterclockwise from the top right, and a point\'s signs tell you which quadrant it lives in before you take a single step.',
  ],
};
STORIES['linear-functions'] = {
  about: 'a taxi meter that ticked in a straight line, and the two points that gave away its rule',
  more: [{ serial: 'S1281', after: 1, alt: 'The meter reading five dollars at three miles' }, { serial: 'S1282', after: 3, alt: 'A graph with a line crossing the y-axis at two' }],
  title: 'The taxi meter', art: 'S1280', cast: [],
  alt: 'A girl in the back of a taxi watching the meter, a graph of a straight line drawn in the window',
  words: [
    'Lena watched the taxi meter tick and tried to guess the fare before it did. At three miles it read five dollars. At five miles, seven. She could not see the rule, but she could feel that there was one.',
    'The meter had started at two dollars before the taxi moved an inch. Then it climbed. Every mile added the same amount. Two points were enough, if she could read them.',
    'From three to five miles, the fare rose two dollars. A dollar a mile. That was the slope, m. And the two dollars at the start, before any miles, was b, where the line began on the y-axis. Fare equals one times the miles plus two. y = mx + b.',
    'A linear function is y = mx + b: m is the slope, the change for each step, and b is where the line starts. Two points on any straight line are enough to write its rule.',
  ],
};
STORIES['volume-of-cylinders'] = {
  about: 'a stack of coins, a soup can, and the volume that was just a circle stacked up',
  more: [{ serial: 'S1284', after: 1, alt: 'Ten coins stacked into a short cylinder' }, { serial: 'S1285', after: 3, alt: 'A cone-shaped paper cup beside a can of the same height' }],
  title: 'A circle, stacked', art: 'S1283', cast: [],
  alt: 'A boy stacking coins beside a soup can on a kitchen counter, comparing their heights',
  words: [
    'Jamal needed the volume of a soup can for a science project, and the formula in the book looked like alphabet soup. Pi r squared h. He knew what the letters were. He had no idea why they were there.',
    'He stacked coins on the counter instead. One coin was a flat circle. Ten coins was a short tower. The tower was just the circle, ten times over.',
    'That was the can. The base was a circle, and its area was pi r squared. Stack that circle up the height of the can, h, and you have the whole can: pi r squared times h. Then he folded a paper cone with the same base and height and filled it three times to fill the can. A cone is a third.',
    'The volume of a cylinder is pi r squared times h, a circle stacked to its height. A cone with the same base and height holds exactly a third of it.',
  ],
};
STORIES['context-clues'] = {
  about: 'a stranger of a word at a party, and the friends it came with',
  more: [{ serial: 'S1287', after: 1, alt: 'A close look at a sentence with the word frigid, the word shiver right beside it' }, { serial: 'S1288', after: 3, alt: 'The girl closing a dictionary with a satisfied smile' }],
  title: 'The friends it came with', art: 'S1286', cast: [],
  alt: 'A girl reading a book by a window, one word on the page glowing, the words around it drawn like friendly people',
  words: [
    'Ava was reading a story about a mountain climb when she hit a word she had never seen. Frigid. She stopped dead. The whole page seemed to lock behind that one word, the way a door locks when you do not know the code.',
    'She could have skipped it. She could have asked. The dictionary was across the room and the couch was warm. But she read the sentence again, slowly, and something caught her eye.',
    'The frigid wind made the climbers shiver and pull their hoods tight. Shiver. Hoods. The word had come to the party with friends, and the friends gave it away. Frigid meant very cold. She never opened the dictionary.',
    'Most new words arrive surrounded by clues: the words beside them, the picture, the sentence before. Read around the stranger before you look it up, and you will guess right more often than not. When the friends stay quiet, then the dictionary does the introducing.',
  ],
};
STORIES['character-and-setting'] = {
  about: 'a new girl who said she was shy, and what she did at recess',
  more: [{ serial: 'S1290', after: 1, alt: 'The new girl standing quietly at the edge of the classroom on her first morning' }, { serial: 'S1291', after: 3, alt: 'A notebook page with two columns: where and when, and what she did' }],
  title: 'What she did at recess', art: 'S1289', cast: [],
  alt: 'A schoolyard at recess with a new girl handing her swing to a smaller crying child, other children watching',
  words: [
    'Jonah\'s teacher asked the class to describe the new girl after her first day. Everybody wrote the same thing. She is shy. That was what she had said about herself that morning, in a voice so small the back row missed it.',
    'Jonah started to write it too, then stopped. At recess he had seen something. A first grader was crying because every swing was taken. The new girl got off her swing without a word and gave it to him. Shy people did not do that. Or did they?',
    'He wrote it differently. The where was the playground. The when was recess, under a hot sun with the chains creaking. Those two were the setting. And who she was did not come from what she said about herself. It came from what she did.',
    'That is how characters work in every story. Setting is the where and the when. Characters show you who they are by what they say and do, and when the two disagree, believe what they do.',
  ],
};
STORIES['plot-and-conflict'] = {
  about: 'a flood tale drawn as a hill, and the boy who found the top of it',
  more: [{ serial: 'S1293', after: 1, alt: 'The bottom of the hill: a boy, a small town, storm clouds gathering' }, { serial: 'S1294', after: 3, alt: 'The top of the hill: a rowboat on a dark river at night' }],
  title: 'The hill', art: 'S1292', cast: [],
  alt: 'A boy drawing a hill shape across a page, small pictures from a story placed along its slope',
  words: [
    'Owen liked the story about the boy and the flood, but when his teacher asked where the climax was, he had no idea. It all seemed important. The town, the storm, the river, the boat, the morning after. How could one part be the top?',
    'She told him to draw the story as a hill. He started at the bottom with what he knew at the beginning: the boy, the town, the storm coming. That was the exposition, the setup. Then he climbed.',
    'The river rose. The bridge went. The boy had to get his grandmother across in the dark. Each step up the hill was the conflict getting worse. At the very top, the boat in the black water, the moment when everything could go either way. That was the climax. Then the slope down: the far bank, the morning, the resolution.',
    'A plot rises from exposition through conflict to a climax and settles in the resolution. Draw any story as a hill and the climax finds itself: it is the one point where the whole thing hangs in the balance.',
  ],
};
STORIES['poetry-elements'] = {
  about: 'a nursery rhyme clapped out, and the textbook that would not clap',
  more: [{ serial: 'S1296', after: 1, alt: 'A page of a poem with the line endings glowing: cat, hat, sat, mat' }, { serial: 'S1297', after: 3, alt: 'A poem laid out in four groups of lines like four small rooms' }],
  title: 'The song without music', art: 'S1295', cast: [],
  alt: 'A girl clapping along to a nursery rhyme in a classroom while a boy tries to clap a textbook and gives up',
  words: [
    'Priya\'s teacher asked the class to clap along to a nursery rhyme, and everyone found the beat in a second. Then she asked them to clap along to a paragraph from the science textbook. Nobody could. The class laughed. Priya wanted to know why.',
    'Both were words. Both were English. But one of them had a pulse you could feel with your hands and the other lay flat on the page like a road with no bumps. Where did the pulse come from?',
    'From how the poem was built. The beat they clapped was rhythm, the pattern of stressed sounds. Cat and hat at the line endings were rhyme, matching sounds where the lines stop. The groups of lines with space between them were stanzas, a poem\'s paragraphs. Some poems keep the rhythm and the rhyme. Free verse keeps neither and finds its shape another way.',
    'Stanzas are a poem\'s paragraphs, rhyme matches endings, rhythm is the beat, and free verse keeps neither. A poem is a song with the music taken out, and clapping is how you put it back.',
  ],
};
STORIES['soil-and-rocks'] = {
  about: 'a jar of muddy water that sorted itself overnight',
  more: [{ serial: 'S1299', after: 1, alt: 'The jar the next morning, settled into layers: sand at the bottom, silt, dark rotted bits near the top' }, { serial: 'S1300', after: 3, alt: 'A garden bed of dark crumbly loam with a seedling in it' }],
  title: 'The jar', art: 'S1298', cast: [],
  alt: 'A tall glass jar of muddy water on a table, a girl shaking it hard, dirt swirling inside',
  words: [
    'Priya dug a scoop of dirt from the garden, dropped it in a jar of water, and shook it until the whole thing was brown. It looked like one thing. Mud. She set it on the table and went to bed.',
    'In the morning the jar had sorted itself into stripes. Gritty sand sat at the bottom. Fine silt lay above it. Dark bits floated near the top. She had put in one scoop of dirt. How could one thing become four?',
    'Because soil was never one thing. It is broken rock, ground up over thousands of years, mixed with the rotted leaves and roots of things that once lived. The heavy sand sank first. The clay stayed cloudy the longest. The dark rotted stuff floated.',
    'Gardeners know the mix by feel. Clay holds water. Sand drains fast. Loam, the mix of both with rotted life in it, is what gardens love. The ground under your feet is a recipe, and a jar of water reads it out.',
  ],
};
STORIES['food-chains-3'] = {
  about: 'a bucket of sunlight passed hand to hand up a line, and how little reached the top',
  more: [{ serial: 'S1302', after: 1, alt: 'A grasshopper on a blade of grass, a bird watching from a branch' }, { serial: 'S1303', after: 3, alt: 'A hawk high above a field, a small splash of water at the bottom of a bucket' }],
  title: 'The bucket line', art: 'S1301', cast: [],
  alt: 'Children in a line passing a bucket of water up a hill, the first bucket brimming, spilling a little at each hand',
  words: [
    'At camp, the kids formed a line to pass a bucket of water up the hill. The first bucket was full to the brim. Every hand along the line spilled a little. By the time it reached the top, only a splash sloshed at the bottom.',
    'That afternoon their counselor asked a strange question. Why are there so many blades of grass in a field and so few hawks over it? The kids guessed hawks were shy. Nobody guessed the bucket.',
    'The sun fills the first bucket. Grass catches the sunlight and makes food, so grass is the producer. A grasshopper eats the grass, a bird eats the grasshopper, a hawk eats the bird. Each one is a consumer, and each hand spills some of the energy. The hawk gets the splash. When anything dies, decomposers recycle it into the soil.',
    'That is a food chain, and every link depends on the one below it. It takes a whole field of grass to feed one hawk. Take away the grass, and the whole line goes dry.',
  ],
};
STORIES['forces-and-motion-5'] = {
  about: 'a tug of war that nobody won, until one small girl walked over',
  more: [{ serial: 'S1305', after: 1, alt: 'A small girl stepping in to join one end of the rope' }, { serial: 'S1306', after: 3, alt: 'The flag sliding across the line, one team stumbling forward' }],
  title: 'The rope that did not move', art: 'S1304', cast: [],
  alt: 'Two teams of children pulling a rope on a field, a flag tied at the middle hanging still',
  words: [
    'Two teams pulled on the rope with everything they had, and the flag in the middle did not move an inch. Faces were red. Shoes were digging into the grass. Kai, watching from the side, thought nobody was pulling at all. How could that much effort add up to nothing?',
    'The coach asked him the same thing. Both teams were pulling hard, so why did the flag stay put? Kai said maybe the rope was stuck. The coach shook his head and pointed at the small girl beside Kai.',
    'She walked over and grabbed the end of one team\'s rope. The flag slid across the line and the other team stumbled forward. Two equal pulls had canceled out, balanced, and the flag had no reason to move. One more pull tipped the balance, and the motion changed.',
    'A force is a push or a pull that changes motion. Balanced forces cancel and nothing changes. Unbalanced forces make things start, stop, speed up or turn. The flag was never stuck. It was perfectly balanced, until it was not.',
  ],
};
STORIES['fossils-and-earth-5'] = {
  about: 'a seashell found two thousand feet up a mountain, and what it said about the rock',
  more: [{ serial: 'S1308', after: 1, alt: 'Layers of rock on a cliff face, the shell in one of the middle layers' }, { serial: 'S1309', after: 3, alt: 'The same place drawn as a shallow sea floor long ago, shells settling in sand' }],
  title: 'The shell on the mountain', art: 'S1307', cast: [],
  alt: 'A girl on a rocky mountain trail holding a fossil seashell up against the sky',
  words: [
    'Two thousand feet up a mountain trail, Nadia found a seashell pressed into the rock. A seashell. She checked the map in case the sea was nearby. The nearest ocean was three hundred miles away.',
    'Had somebody carried it up and dropped it? It was inside the rock, not on it. Had the sea once come up this high? That was a lot of water. Her uncle told her the shell had never moved. The rock had.',
    'The rock was made of layers, like pages in a book, each one laid down as mud and sand on an old sea floor. The shell had settled into one of those layers when this place was under water. Then, over millions of years, the land rose, and the sea floor became a mountain with the shell still in it. Deeper layers were older; the shell\'s layer said the place had once been a shallow sea.',
    'Fossils are traces kept in layered rock. The deeper the layer, the older it is, and every fossil says what its place was like when it formed. A shell on a mountain is not a mystery. It is a page from the mountain\'s own book.',
  ],
};
STORIES['immigration-and-cities'] = {
  about: 'a grandmother\'s ship, one bag, and the recipe that crossed the ocean with her',
  more: [{ serial: 'S1311', after: 1, alt: 'A crowded tenement room with six people, a stove and one window' }, { serial: 'S1312', after: 3, alt: 'A grandmother and granddaughter cooking the same recipe in a modern kitchen' }],
  title: 'The ship in the family tree', art: 'S1310', cast: [],
  alt: 'A young woman on the deck of a crowded steamship holding one bag, a harbor and a great statue ahead',
  words: [
    'Rosa\'s great-great-grandmother came to America at nineteen with one bag, and Rosa wanted to know what was in it. Clothes, her grandmother said. A photograph. And the recipe for the bread the family still baked every Sunday.',
    'Rosa tried to picture the trip. A ship packed with strangers, and a harbor she had only seen in books. Then Ellis Island, where they checked your eyes and your papers and let you through or sent you home. Why would anyone take that risk for a bag and a recipe?',
    'For work, mostly. Around 1900 the cities were full of factories that needed hands, and millions came for them. They lived in tenements, one room for six people, one window, and worked long days. They also brought their food, their music and their words, and the cities grew larger and louder and more mixed than any cities had ever been.',
    'Around 1900 immigrants arrived through Ellis Island, worked in factories, lived in tenements and reshaped the cities. Every family that came changed the country a little, and the bread on Rosa\'s table is the proof that the change is still going on.',
  ],
};
STORIES['industry-and-invention'] = {
  about: 'a shirt that took a week to sew, then a hundred in a day, and everything that sped up with it',
  more: [{ serial: 'S1314', after: 1, alt: 'A woman sewing one shirt by hand at a window, a whole week on the calendar behind her' }, { serial: 'S1315', after: 3, alt: 'Rows of sewing machines in a bright factory, shirts moving along a line' }],
  title: 'The week and the day', art: 'S1313', cast: [],
  alt: 'A girl comparing a hand-sewn shirt on a chair with a rack of identical factory shirts, a steam engine in the background',
  words: [
    'Lena\'s history project was a shirt. Before machines, one shirt took a skilled person about a week to sew by hand. After machines, a factory could turn out a hundred in a day. She wrote the two numbers down and did not believe them.',
    'A week and a day. How could anything speed up that much? And if shirts changed that fast, what else did? She started a list and it would not stop growing.',
    'Steam engines turned the machines, so a factory no longer had to sit beside a river. The telegraph carried news across the country in seconds instead of weeks. Railroads carried the shirts, and everything else, to towns that had never seen a factory. The light bulb stretched the working day past sunset. Each invention pushed the others faster.',
    'Factories, steam, the telegraph, the railroad and the light bulb moved work and life faster than anyone had known. A shirt in a day was not the whole story. It was the first thing people noticed in a world that had started to run.',
  ],
};
// Depth modules, second batch, 2026-09-23.
STORIES['measuring-things'] = {
  about: 'a puppy measured three ways, and why one ruler was never going to be enough',
  more: [{ serial: 'S1317', after: 1, alt: 'The puppy standing on a kitchen scale, the needle at six pounds' }, { serial: 'S1318', after: 3, alt: 'A measuring cup of water being poured into the puppy\'s bowl' }],
  title: 'Three ways to measure a puppy', art: 'S1316', cast: [],
  alt: 'A wriggling puppy on a rug with a girl holding a tape measure along its back, a kitchen scale nearby',
  words: [
    'The vet\'s form had three blanks for the new puppy. How long. How heavy. How much water each day. Ellie grabbed the ruler and started with the puppy, who did not want to be measured at all.',
    'Fourteen inches, nose to tail, after four tries. Then she held the ruler against the puppy again for the second blank and stopped. A ruler cannot tell you how heavy something is. She needed a different tool.',
    'The kitchen scale said six pounds. The measuring cup said two cups of water a day. Three questions, three tools. Inches and feet for how long. Pounds for how heavy. Cups and gallons for how much liquid. The trick was matching the unit to the question.',
    'Every measurement starts with the question. Are you asking how long, how heavy or how much? Pick the unit that answers it, and the tool comes with it. A ruler on a puppy will only ever tell you one of the three.',
  ],
};
STORIES['graphs-and-tallies'] = {
  about: 'five minutes of cars, counted twice, and the picture that ended an argument',
  more: [{ serial: 'S1320', after: 1, alt: 'A page of tally marks in bundles of five under the words red, blue and white' }, { serial: 'S1321', after: 3, alt: 'A bar graph on the page with the blue bar standing tallest' }],
  title: 'The cars', art: 'S1319', cast: [],
  alt: 'Two children on a front porch with a clipboard, counting the cars going by, a red car passing',
  words: [
    'Kai said most cars on their street were red. His sister Ana said blue. They sat on the porch for five minutes to settle it and called out colors. Red, blue, blue, white, red, blue. By the end, neither could remember the count.',
    'They tried again, this time writing every car as a word. The list got long fast, and counting the list took longer than watching the cars. There had to be a quicker way to keep score.',
    'Ana drew a mark for each car under its color, and every fifth mark crossed the bundle. Tallies, in fives. Then she turned the tallies into bars. The blue bar stood tallest by two, and nobody had to count again. The picture said it.',
    'Tallies count in fives so a long count stays easy. Bar graphs and pictographs turn the counts into a picture, and a good title and labels say what the picture means. Show the data well and the argument ends by itself.',
  ],
};
STORIES['multiplying-decimals'] = {
  about: 'five dollars, a tenth, and a girl who was sure the answer had to be bigger',
  more: [{ serial: 'S1323', after: 1, alt: 'One dime beside a dollar, the dime a tenth of it' }, { serial: 'S1324', after: 3, alt: 'A notebook page with 5 × 0.1 = 0.5 and the decimal places counted' }],
  title: 'The dimes', art: 'S1322', cast: [],
  alt: 'A girl at a table with a five-dollar bill and a row of five dimes beside it',
  words: [
    'Maya multiplied five dollars by a tenth and got fifty cents. She was certain something had gone wrong. Multiplying was supposed to make things bigger, and fifty cents was much smaller than five dollars.',
    'She did it again and got fifty cents again. She tried it on the calculator and it said 0.5. The machine was on the other side. She stared at the dot as if it might move.',
    'Then she thought about dimes. A tenth of a dollar is a dime. Five dollars, a tenth each: five dimes. Fifty cents. The answer was smaller because a tenth of something is smaller than the thing. Multiply the digits as whole numbers, five times one is five, then give the answer as many decimal places as the question had.',
    'Multiplying by a decimal less than one makes a number smaller, and that is correct, not broken. Multiply the digits, then count the decimal places in the question and put that many in the answer. The dimes never lie.',
  ],
};
STORIES['data-and-line-plots'] = {
  about: 'ten bean sprouts, ten heights, and the lonely dot that told the story',
  more: [{ serial: 'S1326', after: 1, alt: 'A line plot with a tall stack of dots above 4 and one dot alone above 7' }, { serial: 'S1327', after: 3, alt: 'A line graph of one bean\'s height rising day by day' }],
  title: 'Ten beans', art: 'S1325', cast: [],
  alt: 'Ten bean sprouts in cups on a windowsill, a girl measuring one with a ruler, a chart beside her',
  words: [
    'Rosa grew ten bean sprouts for the science fair and measured each one. Four centimeters, four, three, four, five, four, seven, three, four, five. She wrote the ten numbers in a row and stared at them. They told her nothing.',
    'Her teacher asked which height was most common and which sprout was the odd one. Rosa started counting the fours on her fingers and lost track. Ten numbers was enough to get lost in.',
    'So she drew a line, numbered it, and put one dot above each measurement. The dots stacked. The pile at four was tallest by far. And one lonely dot sat above seven, the surprise sprout that had beaten everyone. She could see the whole experiment in one look.',
    'A line plot stacks one dot per measurement, so the common answer piles up and the odd one stands alone. A line graph is different: it joins points to show how one thing changes over time. Pick the picture that matches the question.',
  ],
};
STORIES['probability-7'] = {
  about: 'a hundred coin flips, a tally that would not land on fifty, and what the average finally showed',
  more: [{ serial: 'S1329', after: 1, alt: 'The tally sheet showing fifty-three heads and forty-seven tails' }, { serial: 'S1330', after: 3, alt: 'A second sheet, forty-eight heads, and both sheets side by side' }],
  title: 'A hundred flips', art: 'S1328', cast: [],
  alt: 'A boy flipping a coin at a desk, a tally sheet beside him with two tall columns of marks',
  words: [
    'Owen flipped a coin a hundred times to prove it was fair. Fifty-three heads. He frowned. Fair should be fifty. He flipped another hundred. Forty-eight. The coin seemed unable to make up its mind.',
    'Along the way it had thrown six heads in a row once and five tails in a row twice. Owen was sure the coin was broken, or the universe was.',
    'Neither. The probability of heads is one half: one wanted outcome over two possible outcomes. That does not mean fifty every time. It means that over many flips, heads comes up about half the time, with streaks along the way. Fifty-three and forty-eight are what half looks like in real life.',
    'Probability is wanted outcomes over all outcomes, from zero for impossible to one for certain. A half is what you expect on average, not a promise for any hundred flips, and the streaks are not the coin being broken. They are chance doing what chance does.',
  ],
};
STORIES['scale-drawings'] = {
  about: 'a bedroom twelve feet wide drawn on a six-inch page, and the one factor that made it fit',
  more: [{ serial: 'S1332', after: 1, alt: 'A drawing of the room with a scale bar: one inch to two feet' }, { serial: 'S1333', after: 3, alt: 'The real window and the drawn window side by side, the same shape' }],
  title: 'The bedroom on the page', art: 'S1331', cast: [],
  alt: 'A girl kneeling on a bedroom floor with a tape measure, a small neat drawing of the room on a page beside her',
  words: [
    'Rosa wanted to rearrange her bedroom without moving anything twice, so she decided to draw it first. The room was twelve feet wide. The page was six inches wide. She drew the first wall and ran out of paper before the door.',
    'She tried again smaller, but then the window was too big for the wall and the bed did not fit through the door on paper either. Everything she drew was a different size from everything else.',
    'The fix was one number. One inch on the page for every two feet in the room. Twelve feet became six inches. The eight-foot wall became four inches. The three-foot window became an inch and a half. Every length shrank by the same factor, so the shapes stayed true and only the size changed.',
    'A scale drawing multiplies every length by the same factor. The shape stays; only the size changes. Choose the factor once, and a room, a map or a blueprint fits any page.',
  ],
};
STORIES['cause-and-effect-4'] = {
  about: 'an icy road, a late bus, and the two words that could tell it either way round',
  more: [{ serial: 'S1335', after: 1, alt: 'A close look at the icy road with tire tracks sliding' }, { serial: 'S1336', after: 3, alt: 'A whiteboard with two sentences joined by arrows pointing opposite ways' }],
  title: 'The icy road', art: 'S1334', cast: [],
  alt: 'Children waiting at a snowy bus stop, a school bus far down an icy road',
  words: [
    'The bus was twenty minutes late and Owen\'s toes were frozen. When it finally came, the driver said the road was icy. Owen wrote it in his journal as two facts. The road was icy. The bus was late. They sat there like strangers.',
    'His teacher read it and asked which one caused the other. Owen said, both? The ice and the lateness had happened at the same time, and he could not see which came first.',
    'The ice came first. The road was icy, so the bus was late. Or the same two things the other way round: the bus was late because the road was icy. The ice was the cause, the thing that made something happen. The late bus was the effect, the thing that happened.',
    'A cause makes something happen and an effect is what happened. So points forward from the cause to the effect. Because points back from the effect to the cause. Pick either word and the two strangers become one story.',
  ],
};
STORIES['text-features'] = {
  about: 'a chapter a boy understood in two minutes, before he had read a single paragraph',
  more: [{ serial: 'S1338', after: 1, alt: 'A table of contents page with chapter titles and page numbers' }, { serial: 'S1339', after: 3, alt: 'A glossary page at the back of the book, words in bold with short meanings' }],
  title: 'Two minutes first', art: 'S1337', cast: [],
  alt: 'A boy with a science book open, his finger on a bold heading, a captioned photo and bold words standing out on the page',
  words: [
    'Marcus had a chapter on volcanoes to read and ten minutes before dinner. He started at the first word and was still on the first page when his mom called. Reading was a wall, and he had barely scratched it.',
    'The next night his dad showed him a trick. Do not read the chapter yet, he said. Just look at it. Marcus thought that was cheating. How could looking at a chapter tell you what it said?',
    'He read the headings first: what a volcano is, why it erupts, kinds of volcanoes. Then the captions under the pictures. Then the bold words. Two minutes, and he knew the shape of the whole chapter before the first paragraph. When he did read it, every sentence had a place to go.',
    'Headings, bold words and captions guide you through a page. The contents, the index and the glossary guide you through a whole book. They are the map printed inside the territory, and the readers who look at the map first are the ones who do not get lost.',
  ],
};
STORIES['comparing-texts'] = {
  about: 'one storm told by a poem and by a newspaper, and what the two said together',
  more: [{ serial: 'S1341', after: 1, alt: 'The poem\'s page, a sky cracked open in a drawing beside the words' }, { serial: 'S1342', after: 3, alt: 'The newspaper\'s rain map with two inches marked' }],
  title: 'Two storms', art: 'S1340', cast: [],
  alt: 'A boy at a table with a poem on one side and a newspaper weather report on the other, rain on the window',
  words: [
    'Owen read two things about the same storm. A poem said the sky broke open and the street became a river. The newspaper said two inches of rain fell in one hour. He decided one of them was lying.',
    'Which one? He had been in the storm. The street had felt like a river. But two inches did not sound like much, and nobody had seen the sky break. He could not make the two texts agree.',
    'His mother said they did not have to. The poem was telling how the storm felt. The newspaper was telling what the storm measured. Both were true, and side by side they were the whole storm: the feeling and the facts. What they shared was the event. How they differed was the job each one was doing.',
    'To compare two texts, ask what they share, how they differ, and what the difference shows. When they seem to disagree, a third source often settles it. Two texts on one subject are not a contest. They are two windows on the same room.',
  ],
};
STORIES['reading-an-argument'] = {
  about: 'a letter to the school that rested on one cousin, and the study that could have held it up',
  more: [{ serial: 'S1344', after: 1, alt: 'The letter with one sentence about a cousin circled in red' }, { serial: 'S1345', after: 3, alt: 'The girl opening the research report and reading a chart' }],
  title: 'The cousin', art: 'S1343', cast: [],
  alt: 'A girl reading a letter at a school office counter, a thick research report lying unopened beside it',
  words: [
    'A letter to the school newspaper said classes should start later. Lena agreed before she finished the first line. Then she got to the reason. The writer\'s cousin went to a school that started later and liked it.',
    'Lena wanted the letter to be right. But she could hear her teacher\'s voice asking, and how many cousins is that? One. One cousin, who liked something. Was that enough to change the whole school\'s day?',
    'It was not. A claim is held up by reasons, and reasons are held up by evidence. One cousin\'s opinion is a story, not evidence. Sitting on the desk next to the letter was a study of two thousand students who slept more and did better when school started later. That was evidence. The writer had never opened it.',
    'When you read an argument, find the claim, then the reasons, then ask what holds each reason up. Without evidence, an argument is only an opinion with good posture. With it, even a short letter can change a school.',
  ],
};
STORIES['figurative-language-7'] = {
  about: 'a clock that glared, a smile that was sunshine, and the boy who stopped taking sentences literally',
  more: [{ serial: 'S1347', after: 1, alt: 'A girl whose smile is drawn as a small sun' }, { serial: 'S1348', after: 3, alt: 'A notebook with three columns: simile, metaphor, personification' }],
  title: 'The clock that glared', art: 'S1346', cast: [],
  alt: 'A boy at a desk late at night, a wall clock drawn with an angry face glaring down at him',
  words: [
    'The clock glared at me, the story said, and Owen wrote in the margin: clocks cannot glare. He was right, and he was missing the point, and his teacher circled the note with a smile.',
    'Later in the same chapter, a girl\'s smile was sunshine. Not like sunshine. Was. Owen underlined that too. The book seemed to be lying on purpose.',
    'It was, and that was the craft. The glaring clock was personification: a thing given a human act, so the reader feels the pressure of midnight. The smile that was sunshine was a metaphor: one thing said to be another, no like or as. A face as bright as the sun would have been a simile, the gentler cousin with the little word in it.',
    'Similes compare with like or as, metaphors say one thing is another, personification gives human acts to things. None of them is meant literally, and all of them make a reader feel what a plain sentence only reports.',
  ],
};
STORIES['text-structures-7'] = {
  about: 'two articles that read completely differently, and the signal words that gave their shapes away',
  more: [{ serial: 'S1350', after: 1, alt: 'An article with the words however and similarly highlighted, two columns drawn around it' }, { serial: 'S1351', after: 3, alt: 'An article with the trouble was and then one answer, a knot and a scissors drawn beside it' }],
  title: 'Two rooms', art: 'S1349', cast: [],
  alt: 'A girl comparing two printed articles, arrows drawn between paragraphs on one and a line of dominoes on the other',
  words: [
    'Lena read an article about two rival cities and an article about a drought, and she understood the first and got lost in the second. Same magazine, same page size. Why did one feel like a map and the other like fog?',
    'She went back to the second one and looked for what the first had. The city article kept saying however and similarly. The drought article never did. Did that matter?',
    'It did. However and similarly were signal words for compare and contrast: two rooms side by side, the reader walking between them. The drought article said the trouble was, and then, one answer: a problem and its solution, one long hallway. The moment she knew each article\'s shape, she knew where to stand in it.',
    'A text has a structure, and its signal words tell you which one: time order, comparison, problem and solution, cause and effect. Find the signal words in the first paragraph, and the rest of the piece has a floor plan.',
  ],
};
STORIES['purpose-and-bias'] = {
  about: 'a campaign pamphlet with a frame around it, and what the frame left out',
  more: [{ serial: 'S1353', after: 1, alt: 'The pamphlet\'s words should, must and best glowing' }, { serial: 'S1354', after: 3, alt: 'A list of costs written in the empty space outside the frame' }],
  title: 'Outside the frame', art: 'S1352', cast: [],
  alt: 'A boy holding a bright campaign pamphlet, a drawn picture frame around it with blank space outside',
  words: [
    'A pamphlet came through Theo\'s door: vote for her. Should, must, best, on every line. Theo could tell it wanted him to do something. His mother asked what it wanted him not to see.',
    'Not to see? It was a page of words. Everything on it was there to read. Theo read it twice and found no lie on it anywhere.',
    'The lean was not in what the page said. It was in what it left out. Should and must told him the purpose: to persuade. Then he drew a frame around the pamphlet and asked what lived outside it. The costs. Not one number, anywhere on the page. Bias is the shape of the frame.',
    'Every text has a purpose: to inform, to persuade or to entertain. A bias is a lean you can see in what a text leaves out. Read the page, then read the empty space around it.',
  ],
};
STORIES['theme-across-texts'] = {
  about: 'a novel about brothers and a fable about two foxes, and the one sentence they both sang',
  more: [{ serial: 'S1356', after: 1, alt: 'Two brothers in a novel, one confessing something hard' }, { serial: 'S1357', after: 3, alt: 'Two foxes in a fable, one holding out a stolen hen' }],
  title: 'One tune, two songs', art: 'S1355', cast: [],
  alt: 'A girl reading in bed with a thick novel in one hand and a thin book of fables in the other',
  words: [
    'Lena read a long novel about two brothers and, the same week, a one-page fable about two foxes. Her teacher asked what they had in common. Nothing, Lena said. One had cars and a hospital. The other had a hen.',
    'Then she thought about how each ended. The brother who told the truth lost a friend and kept his brother. The fox who told the truth lost the hen and kept the den. Different stories. Same shape at the end.',
    'A theme is not a topic. It is a sentence about what a story says. Both stories said that honesty costs something and is worth it. The novel showed it over three hundred pages. The fable said it outright in a moral at the bottom. Two songs, one tune.',
    'A theme is a sentence about what a story says about life, and very different texts can share one. A fable states its theme as a moral; a novel makes you find it. Look at what each character paid, and what they kept.',
  ],
};
STORIES['properties-of-matter-4'] = {
  about: 'a box of odd objects and the four tests that sorted them',
  more: [{ serial: 'S1359', after: 1, alt: 'A nail jumping to a magnet while a cork lies still' }, { serial: 'S1360', after: 3, alt: 'A cork floating in a bowl of water and a coin resting on the bottom' }],
  title: 'Four tests', art: 'S1358', cast: [],
  alt: 'A girl at a science table with a nail, a cork, a coin, a metal spoon and a sugar cube, a magnet and a bowl of water',
  words: [
    'Maya\'s teacher tipped a box onto the table: a nail, a cork, a coin, a metal spoon and a sugar cube. Sort them, she said. Maya lined them up by size. Then by color. Neither felt like science. They were just objects, and objects do not have opinions.',
    'The teacher put four tools beside them. A magnet, a bowl of water, a mug of hot water and a spoon for stirring. Try each one on each object, she said, and write what happens. Maya thought the answers would be boring.',
    'The magnet grabbed the nail and ignored the cork. The cork floated and the coin sank with a clink. In the hot water, the metal spoon warmed her fingers in seconds while the cork stayed cool. The sugar vanished in a stir. Four tests, and the objects had sorted themselves without her.',
    'Every kind of matter has properties. Some you measure, like mass and temperature. Some you test, like whether it is magnetic, whether it floats, whether it carries heat, whether it dissolves. Objects do have opinions. You just have to ask the right questions.',
  ],
};
STORIES['food-webs-4'] = {
  about: 'a meadow of animal cards tied together with string, and what happened when one card came out',
  more: [{ serial: 'S1362', after: 1, alt: 'A mouse card being lifted and three strings going slack' }, { serial: 'S1363', after: 3, alt: 'A hawk card still held tight by a string from the snake card' }],
  title: 'The strings', art: 'S1361', cast: [],
  alt: 'A classroom floor covered in animal and plant cards joined by crossing strings, children holding the ends',
  words: [
    'Mr. Ortiz laid cards on the floor: grass, grasshopper, mouse, snake, bird, hawk. Each student held a string from the thing that was eaten to the thing that ate it. Grass to mouse. Mouse to hawk. Grass to grasshopper to bird to hawk. Snake to hawk. Soon the strings crossed everywhere.',
    'Then he picked up the mouse card. Three strings dropped to the floor. The class expected the hawk to fall too. It was the mouse that fed the hawk, after all. But the hawk card did not move. Why not?',
    'Because the hawk still had the snake. A food chain is one line. A food web is all the lines at once, and every animal that eats more than one thing has more than one string holding it up. Plants sit at the bottom of every string. Pull one card and the web bends. It does not break.',
    'Real meadows work like the strings. The arrows run from the eaten to the eater, plants sit at the base, and a web with many links bends when one animal vanishes. A web with few links snaps. That is why variety keeps a place alive.',
  ],
};
export const STORY_WORD_LIMIT = { early: 200, older: 350 };
export function storyFor(moduleId) { return STORIES[moduleId] || null; }
