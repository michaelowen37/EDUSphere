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
    where: 'Mike, before he could count past three.', title: 'Three stones', art: 'S1', cast: ['Mike'],
    alt: 'A small boy crouched at the edge of a creek, three smooth stones lined up on a flat rock',
    words: [
      'Mike had a job. Three stones from the creek. Not a pile. Three.',
      'The creek was full of stones. Big ones, wet ones, ones that sparkled. Mike scooped a handful and ran back. "That is a lot of stones," came the answer, with a laugh. "I asked for three."',
      'So Mike put one stone on the flat rock. One. He put another next to it. Two. He put one more. Three. Then he stopped.',
      'All three got skipped across the water, and each one bounced. That is what a number is. It is where you stop.',
    ],
  },
  'count-to-5': {
    title: 'Five ducklings', art: 'S2', cast: [],
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
    title: 'The needle that knew', art: 'S3', cast: [],
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
    title: 'The clock that ran the town', art: 'S4', cast: [],
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
    title: 'The broken cups', art: 'S5', cast: [],
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
    where: 'Chloe, the year of three hundred and sixty five paintings.', title: 'The lake that would not stay', art: 'S6', cast: ['Chloe'],
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
    where: 'Frederick, years after the jar of pond water, still holding it.', title: 'The pond that moved', art: 'S7', cast: ['Frederick'],
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
    title: 'The flower in the basement', art: 'S8', cast: [],
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
    where: 'Mike, the summer of his first deck. The family comes later.', title: 'The rope with twelve knots', art: 'S9', cast: ['Mike'],
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
    where: 'Savanah, still on the farm. The city is a few years off.', title: 'The cart that would not start', art: 'S10', cast: ['Savanah'],
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
    where: 'Frederick, the professor, a lifetime after the microscope.', title: 'The professor who guessed', art: 'S11', cast: ['Frederick'],
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
    where: 'Savanah, first year in the city, first business.', title: 'The day it rained', art: 'S12', cast: ['Savanah'],
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
    where: 'Mike and Jaxon. The red bike comes back in physics.', title: 'The bike jar', art: 'S13', cast: ['Mike', 'Jaxon'],
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
  where: 'Georgette and Mike, at the kitchen table where he asked his hardest questions.', title: 'The battle that was lost on purpose', art: 'S14', cast: ['Georgette', 'Mike'],
  alt: 'An older woman in a red coat and a teenage boy at a kitchen table, an old map of Texas spread between them and a teacup at its corner',
  more: [{ serial: 'S15', after: 2, alt: 'The stone walls of the Alamo at dawn, a single flag above them, quiet and golden' }],
  words: [
    'Mike wanted to know why the famous battle was the one Texas lost. Georgette poured the tea, spread the old map on the table, and put her finger on San Antonio.',
    '"Two hundred or so men held the Alamo for thirteen days," she said. "On the sixth of March, 1836, it fell. Nearly all of them died." She moved her finger east, a long way, to a bend in a river. "Six weeks later, here, Sam Houston won Texas in eighteen minutes."',
    'Mike looked from one finger to the other. Why would anyone remember the loss?',
    'Because the thirteen days were the point. Every day the Alamo held was a day Santa Anna\'s army stood still, and a day for the rest of Texas to get away, gather, and choose its ground. When Houston\'s men charged at San Jacinto on the twenty-first of April, they shouted the name of the fort they had lost. The loss had bought the win.',
    'Georgette folded the map. Some defeats are not the end of a story. They are the price of the ending.',
  ],
};
STORIES['inside-the-atom'] = {
  title: 'The balloon on the wall', art: 'S16', cast: [],
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
  title: 'The elevator that counted backward', art: 'S17', cast: [],
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
  where: 'Chloe, far from home, mixing the colors she came for.', title: 'Two blues to one yellow', art: 'S18', cast: ['Chloe'],
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
  title: 'The loom in the valley', art: 'S19', cast: [],
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
  title: 'The movie in one sentence', art: 'S20', cast: [],
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
  title: 'Cold in July', art: 'S21', cast: [],
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
  title: 'The recipe book', art: 'S22', cast: [],
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
  title: 'The rooster and the sun', art: 'S23', cast: [],
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
  where: 'Jaxon and the red bike from the jar. Mike, running.', title: 'The red bike, part two', art: 'S24', cast: ['Mike', 'Jaxon'],
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
  title: 'Half off what?', art: 'S25', cast: [],
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
  title: 'The kittens that did not match', art: 'S26', cast: [],
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
  title: 'The straw that broke', art: 'S27', cast: ['Chloe'],
  where: 'Chloe, sketching everything, as always. The lake was years ago.',
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
  title: 'The crab with no shell', art: 'S28', cast: [],
  alt: 'A small hermit crab on a sandy beach peeking out of a borrowed spiral shell, a tide pool behind it',
  words: [
    'A little hermit crab had grown too big for its shell. It crawled out onto the sand with nothing on its back.',
    'The sun was hot. A gull circled. The crab hurried from rock to rock, looking for a home that fit.',
    'It tried a bottle cap. Too flat. It tried a pebble. Too hard. Then it found an empty spiral shell in the tide pool, backed in, and fit just right.',
    'A habitat is the place where a living thing has what it needs: food, water, shelter, and room. For the crab, that is the shore, with its tide pools and its spare shells.',
    'Every animal is looking for the place that fits it. The crab just does it more often.',
  ],
};
export const STORY_WORD_LIMIT = { early: 200, older: 350 };
export function storyFor(moduleId) { return STORIES[moduleId] || null; }
