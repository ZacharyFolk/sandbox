import Typist from 'react-typist-component';
import Modal from '../../utils/Modal';

const CurseResponse = () => {
  const ralphie = '/images/ralphie.jpg';
  return (
    <>
      <Modal open={true} duration={3000}>
        <img src={ralphie} alt="Take a break!" />
        <p className="curse">Time out! </p>
      </Modal>
    </>
  );
};
const CageTips = (props) => {
  const tipsArray = [
    'Game loaded. Press any key to continue.',
    'Dealing cards. . . . ',
    'You start the game with 10 ❤s and the game ends if you run out. Regain lost ❤ with a correct match. Good luck!',
    'Uh Oh. Only 3 tries left!',
    'Not looking good...',
    'Game over.  Press Enter to play again.',
    'Congratulations! You did it. Press Enter to play again.',
  ];
  return tipsArray[props.num];
};
const Deep = () => {
  const bkgdImages = [
    '/images/deep/deep1.jpg',
    '/images/deep/deep2.jpg',
    '/images/deep/deep3.jpg',
    '/images/deep/deep4.jpg',
  ];
  const deepArray = [
    "If you ever crawl inside an old hollow log and go to sleep, and while you're in there some guys come and seal up both ends and then put it on a truck and take it to another city, boy, I don't know what to tell you.",
    "One thing vampire children have to be taught early on is, don't run with a wooden stake.",

    "If you go to a costume party at your boss's house, wouldn't you think a good costume would be to dress up like the boss's wife? Trust me, it's not.",
    "There's nothing so tragic as seeing a family pulled apart by something as simple as a pack of wolves.",

    "Instead of studying for finals, what about just going to the Bahamas and catching some rays? Maybe you'll flunk, but you might have flunked anyway; that's my point.",
    "I think college administrators should encourage students to urinate on walls and bushes, because then when students from another college come sniffing around, they'll know this is someone else's territory.",

    "He was the kind of man who was not ashamed to show affection. I guess that's what I hated about him.",

    'If they have moving sidewalks in the future, when you get on them, I think you should have to assume sort of a walking shape so as not to frighten the dogs.',

    "Love can sweep you off your feet and carry you along in a way you've never known before. But the ride always ends, and you end up feeling lonely and bitter. Wait. It's not love I'm describing. I'm thinking of a monorail.",

    'Sometimes life seems like a dream, especially when I look down and see that I forgot to put on my pants.',

    'I guess more bad things have been done in the name of progress than any other. I myself have been guilty of this. When I was a teen-ager, I stole a car and drove it out into the desert and set it on fire. When the police showed up, I just shrugged and said, "Hey, progress." Boy, did I have a lot to learn.',

    'Marta was watching the football game with me when she said, "You know, most of these sports are based on the idea of one group protecting its territory from invasion by another group." "Yeah," I said, trying not to laugh. Girls are funny.',

    'Here\'s a good trick: Get a job as a judge at the Olympics. Then, if some guy sets a world record, pretend that you didn\'t see it and go, "Okay, is everybody ready to start now?"',

    "If you go to a party, and you want to be the popular one at the party, do this: Wait until no one is looking, then kick a burning log out of the fireplace onto the carpet. Then jump on top of it with your body and yell, \"Log o' fire! Log o' fire!\" I've never done this, but I think it'd work.",

    'Tonight, when we were eating dinner, Marta said something that really knocked me for a loop. She said, "I love carrots." "Good," I said as I gritted my teeth real hard. "Then maybe you and carrots would like to go into the bedroom and have sex!" They didn\'t, but maybe they will sometime, and I can watch.',

    "If I had a mine shaft, I don't think I would just abandon it. There's got to be a better way.",

    'Of all the tall tales, I think my favorite is the one about Eli Whitney and the interchangeable parts.',

    'To me, it\'s a good idea to always carry two sacks of something when you walk around. That way, if anybody says, "Hey, can you give me a hand?" You can say, "Sorry, got these sacks."',

    'If life deals you lemons, why not go kill someone with the lemons (maybe by shoving them down his throat).',

    'Instead of having "answers" on a math test, they should just call them "impressions," and if you got a different "impression," so what, can\'t we all be brothers?',

    "I can picture in my mind a world without war, a world without hate. And I can picture us attacking that world, because they'd never expect it.",

    "If I ever get real rich, I hope I'm not real mean to poor people, like I am now.",

    'I remember how my great-uncle Jerry would sit on the porch and whittle all day long. Once he whittled me a toy boat out of a larger toy boat I had. It was almost as good as the first one, except now it had bumpy whittle marks all over it. And no paint, because he had whittled off the paint.',

    'It takes a big man to cry, but it takes a bigger man to laugh at that man.',

    'One thing kids like is to be tricked. For instance, I was going to take my little nephew to Disneyland, but instead I drove him to an old burned-out warehouse. "Oh, no," I said. "Disneyland burned down." He cried and cried, but I think that deep down, he thought it was a pretty good joke. I started to drive over to the real Disneyland, but it was getting pretty late.',

    'Maybe in order to understand mankind, we have to look at the word itself: "Mankind". Basically, it\'s made up of two separate words - "mank" and "ind". What do these words mean? It\'s a mystery, and that\'s why so is mankind.',

    'The face of a child can say it all, especially the mouth part of the face.',

    'When you go in for a job interview, I think a good thing to ask is if they ever press charges.',

    "To me, clowns aren't funny. In fact, they're kind of scary. I've wondered where this started and I think it goes back to the time I went to the circus, and a clown killed my dad.",

    "I think a good gift for the President would be a chocolate revolver. And since he is so busy, you'd probably have to run up to him real quick and give it to him.",

    "If you're in a war, instead of throwing a hand grenade at the enemy, throw one of those small pumpkins. Maybe it'll make everyone think how stupid war is, and while they are thinking, you can throw a real grenade at them.",

    "The next time I have meat and mashed potatoes, I think I'll put a very large blob of potatoes on my plate with just a little piece of meat. And if someone asks me why I didn't get more meat, I'll just say, \"Oh, you mean this?\" and pull out a big piece of meat from inside the blob of potatoes, where I've hidden it. Good magic trick, huh?",

    "A funny thing to do is, if you're out hiking and your friend gets bitten by a poisonous snake, tell him you're going to go for help, then go about ten feet and pretend that *you* got bit by a snake. Then start an argument with him about who's going to go get help. A lot of guys will start crying. That's why it makes you feel good when you tell them it was just a joke.",
  ];

  const num = Math.floor(Math.random() * deepArray.length);
  const num2 = Math.floor(Math.random() * bkgdImages.length);
  return (
    <div
      className="deepBkgd"
      style={{ backgroundImage: `url(${bkgdImages[num2]})` }}
    >
      <p className="thought">{deepArray[num]}</p>
    </div>
  );
};
const Directions = () => {
  const directionsArray = [
    // chatGPT gone wild!
    'You find yourself in a deep tropical forest, surrounded by towering trees and the sounds of exotic birds and animals. The air is thick with humidity and the scent of flowers and herbs.',
    'As you walk further into the forest, you come across the Crystal Caves of Naica. The entrance is hidden behind a curtain of vines, and as you push them aside, you are met with a breathtaking sight.',
    'You reach the edge of the cliff, in front of  you there are giant selenite crystals that jut out of the walls and ceiling, glinting in the dim light. Some of them are so large that you can barely wrap your arms around them.',
    'You continue your journey and come across the Rainbow Mountains of Zhangye Danxia. The multi-colored sandstone layers create a stunning rainbow effect that stretches as far as the eye can see. You stand in awe, wondering how such a natural wonder could exist.',
    'You come across the Great Blue Hole of Balzia. The deep blue water is almost hypnotic as it swirls around the massive underwater sinkhole. There is a tiny boat just outside the edge of the whirlpool.',
    "You decide to take a break and rest at the Wave, a sandstone rock formation with towering red and orange striped cliffs. As you sit and admire the view, you can't help but feel small in the face of such natural beauty.",
    'Continuing on your journey, you come across the Marble Caves of Chile Chico. The intricate marble caves can only be accessed by boat, and as you glide through the cool, clear water, you are struck by the beauty of the swirling patterns in the marble.',
    'You come across the Hang Son Doong Cave, the largest cave in the world.  The ceiling towers over 500 feet above you and the cave stretches on for nearly 5 miles. You feel like you have stepped into another world.',
    "As you enter the forest, the sun is completely blocked by the dense canopy of tall, dark trees and a quiet darkness surrounds you. The air is cool and still, and you can't shake the feeling of being watched.",
    'It is pitch black. You are likely to be eaten by a grue.',
    ' You are in a small clearing in a well marked forest path that extends to the east and west.',
    'This is a forest, with trees in all directions. To the east there appears to be sunlight.',
    'A rabbit runs out as you round the corner and you notice a glint of silver in the grass behind the large tree. The tree is massive and the bark starts to resemble a face as the arm like branches move swiftly to block your path.',
    'As you wander through the scorched earth, the only sign of life is the occasional mutated creature roaming the barren wasteland.',
    'The once bustling city is now nothing but crumbling ruins, a haunting reminder of the destruction that occurred.',
    'The air is thick with toxic smog, making it difficult to breathe as you navigate through the debris.',
    'You come across a rare and functioning pre-apocalypse vehicle, a valuable find in this desolate world.',
    'The ground beneath your feet is unstable, the result of frequent earthquakes caused by the aftermath of the disaster.',
    'As you move east, you notice a faint light in the distance. It could be a sign of civilization or danger.',
    'The sky is a dull grey, the sun obscured by the never-ending ash clouds.',
    'You come across a small stream, the water irradiated and undrinkable.',
    'The west holds the promise of a new beginning, but the journey will be treacherous.',
    'The once lush forest is now a twisted, dark version of its former self, the trees twisted and corrupted.',
    'You find an old bunker, the door open invitingly, but the unknown dangers within make you hesitate.',
    'The north is a frozen wasteland, the snow never-ending and the temperatures unbearable.',
    'As you head south, you notice a large tower in the distance, a beacon of hope or a trap?',
    'You come across a small abandoned camp, a fire still burning in the makeshift hearth.',
    'The east holds the key to salvation, but the path is fraught with danger.',
    'The ground is littered with the bones of those who came before you, a warning of the perils ahead.',
    'You find an old map, worn and tattered, but still legible and potentially valuable.',
    'The south is a desert of endless sand, the heat sapping your strength with every step.',
    'As you move up, you notice a strange object in the distance, a mysterious technology from a lost civilization.',
    'The once clear sky is now a mass of dark storm clouds, the rain never-ending and the winds howling.',
    'You come across a small oasis, a rare and precious find in this hostile world.',
    'The west holds the key to understanding the past, but the truth may be too painful to bear.',
    'The ground is scorched and blackened, a testament to the power of the apocalypse.',
    'You find a rare and powerful weapon, a valuable tool in this dangerous world.',
    'The east holds the promise of a better future, but the cost may be too high.',
    'The once vibrant and lively world is now a shadow of its former self, the ruins of civilization a constant reminder of what was lost.',
    'You find yourself in the bustling, neon-lit streets of the city, the hum of chatter and the honking of cars all around you. As you make your way through the crowds, you find yourself face to face with the imposing facade of the local grocery store. The smell of fresh produce and the sound of carts being wheeled around fill the air. As you enter, you are greeted by the endless aisles of food, each one offering its own unique selection of products. You must navigate your way through the labyrinth of food, carefully selecting the perfect items and avoiding the pitfalls of expired goods or overpriced products. Will you be able to find what you need and make it to the check-out before the store closes?',
    'You find yourself standing in front of the cold marble exterior of the local bank. The sound of chatter and the clicking of heels on the ground echo through the air as you approach the entrance. As you enter the grand lobby, you are greeted by the sight of tellers and security guards, each one ready to assist you with your financial needs. But be warned, the bank is not without its dangers. Hackers and identity thieves lurk around every corner, ready to steal your hard-earned money. Can you navigate your way through the complex web of financial transactions and secure your wealth?',
    'You find yourself in a dimly lit room, the musty smell of books filling your nostrils. The sound of pages turning and the hushed whispers of patrons echo through the air as you make your way through the stacks. This is the local library, a repository of knowledge and a labyrinth of books. As you explore the shelves, you must be careful not to get lost in the endless rows of literature. Can you find the book you need and escape the library before it closes?',
    'You find yourself in the sterile and fluorescent-lit halls of your workplace. The sound of phones ringing and the clack of keyboard fills the air as you make your way to your desk. But be warned, the daily grind of the 9-5 is not without its challenges. Meetings and deadlines loom around every corner, and one misstep could mean the difference between a successful career and unemployment. Can you navigate the corporate landscape and come out on top?',
    'You find yourself in the cramped and crowded streets of the city, the sound of chatter and honking cars filling the air. Ahead of you, stands the imposing post office building, the hub of mail and parcels. But be warned, the journey to the post office is not without its challenges. Long lines and the risk of lost mail threaten to derail your plans. Can you navigate the crowds and successfully send your mail?',
    'This is a path winding through a dimly lit forest. The path leads north-south here. One particularly large tree with some low branches stands at the edge of the path.',
  ];
  let num = Math.floor(Math.random() * directionsArray.length);
  return (
    <Typist typingDelay={50} cursor={<span className="cursor">|</span>}>
      <p>{directionsArray[num]}</p>
    </Typist>
  );
};
const Games = () => {
  return (
    <>
      Here are some of the latest projects that are ready to play with. Read
      more about how they were built on the blog!
    </>
  );
};
const Hello = () => {
  return (
    <Typist typingDelay={100}>
      <p>Hi! Thanks for stopping by!</p>
    </Typist>
  );
};
const TheInfo = () => {
  const infoQuotes = [
    'When information is cheap, attention becomes expensive.',
    'It is not the amount of knowledge that makes a brain. It is not even the distribution of knowledge. It is the interconnectedness.',
    'Information is not knowledge and knowledge is not wisdom.',
    'Every new medium transforms the nature of human thought. In the long run, history is the story of information becoming aware of itself.',
    'Everything we care about lies somewhere in the middle, where pattern and randomness interlace.',
    'Forgetting used to be a failing, a waste, a sign of senility. Now it takes effort. It may be as important as remembering.',
    'The universe is computing its own destiny.',
    'Redundancy—inefficient by definition—serves as the antidote to confusion.',
    'Evolution itself embodies an ongoing exchange of information between organism and environment .... The gene has its cultural analog, too: the meme. In cultural evolution, a meme is a replicator and propagator — an idea, a fashion, a chain letter, or a conspiracy theory. On a bad day, a meme is a virus.',
    "Vengeful conquerors burn books as if the enemy's souls reside there, too.",
    'We have met the Devil of Information Overload and his impish underlings, the computer virus, the busy signal, the dead link, and the PowerPoint presentation.',
    'It sometimes seems as if curbing entropy is our quixotic purpose in this universe.',
    "With words we begin to leave traces behind us like breadcrumbs: memories in symbols for others to follow. Ants deploy their pheromones, trails of chemical information; Theseus unwound Ariadne's thread. Now people leave paper trails.",
    'Where, then, is any particular gene—say, the gene for long legs in humans? This is a little like asking where is Beethoven’s Piano Sonata in E minor. Is it in the original handwritten score? The printed sheet music? Any one performance—or perhaps the sum of all performances, historical and potential, real and imagined? The quavers and crotchets inked on paper are not the music. Music is not a series of pressure waves sounding through the air; nor grooves etched in vinyl or pits burned in CDs; nor even the neuronal symphonies stirred up in the brain of the listener. The music is the information. Likewise, the base pairs of DNA are not genes. They encode genes. Genes themselves are made of bits.',
    'Every natural language has redundancy built in; this is why people can understand text riddled with errors and why they can understand conversation in a noisy room.',
    'DNA is the quintessential information molecule, the most advanced message processor at the cellular level—an alphabet and a code, 6 billion bits to form a human being',
  ];
  let num = Math.floor(Math.random() * infoQuotes.length);

  return (
    <Modal open={true}>
      <blockquote>
        <p>{infoQuotes[num]}</p>
        <cite>&mdash;James Gleick - The Information</cite>
      </blockquote>
    </Modal>
  );
};
const InitialText = () => {
  return (
    <Typist typingDelay={100}>
      <h1 className="main-heading"> **** ZACS WEBSITE BASIC V 1.2.2 ****</h1>
    </Typist>
  );
};

const Jeopardy = () => {
  return (
    <Typist typingDelay={100}>
      <p>Welcome to trivia with over 200,000 questions!</p>
    </Typist>
  );
};
const NoMatch = () => {
  const nopeArray = [
    "I'm sorry, Dave. I'm, afraid I can't do that.",
    'Nope.',
    'That is not something I recognize.',
    'The oldest known color photograph was taken in 1861 by James Clerk Maxwell.',
    'The longest word in the English language, according to the Guinness Book of World Records, is pneumonoultramicroscopicsilicovolcanoconiosis.',
    'The only continent without native reptiles or snakes is Antarctica.',
    "The world's largest snowflake on record was 15 inches wide and 8 inches thick.",
    'In ancient Rome, it was considered a sign of leadership to be born with a crooked nose.',
    'The first known contraceptive was crocodile dung, used by ancient Egyptians.',
    'A group of hedgehogs is called a prickle.',
    'A baby octopus is about the size of a flea when it is born.',
    'Giraffes can go for weeks without drinking water because they get most of their hydration from the plants they eat.',
    "The Great Barrier Reef, the world's largest coral reef system, can be seen from space.",
    'The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.',
    'The tallest tree on record was a coast redwood in California that was 379.1 feet tall.',
    "The word 'queue' is the only word in the English language with five consecutive vowels.",
    'The lifespan of a single taste bud is about 10 days.',
    'The average person spends about 5 years of their life dreaming.',
    'The skin of a dolphin is about 10 times thicker than that of a human.',
    'The longest wedding veil was over 7 miles long.',
    'The lifespan of a single taste bud is about 10 days.',
    'The fingerprints of Koalas are so similar to humans that they have on occasions been confused at crime scenes.',
    "The world's largest snowflake fell in Montana in 1887 and was 15 inches wide and 8 inches thick.",
    'The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.',
  ];
  let num = Math.floor(Math.random() * nopeArray.length);
  return (
    <Typist typingDelay={10}>
      <p>{nopeArray[num]}</p>
    </Typist>
  );
};

const Help = () => {
  return (
    <Typist typingDelay={10}>
      <p>
        Available commands : about | home | help | games | look | cagematch.
      </p>
      <p>
        If you would enjoy playing the most pointless "adventure game" ever
        created, try typing a direction.
      </p>
      <p>
        Adding more stuff every day... a lot of secret eggs. For now if I don't
        understand I will be sure and share some random facts!
      </p>
    </Typist>
  );
};

export {
  CageTips,
  CurseResponse,
  Deep,
  Directions,
  Games,
  Hello,
  Help,
  TheInfo,
  InitialText,
  Jeopardy,
  NoMatch,
};
