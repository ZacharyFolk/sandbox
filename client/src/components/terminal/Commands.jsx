import Typist from 'react-typist-component';
const About = () => {
  // TODO : Figure out how too get this to work in separate component
  // navigate function is just ignored in Commands.jsx, no errors, nothing
  // maybe could get it to run in a useEffect in there but I had no luck
  return <>More about Me</>;
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
    <Typist typingDelay={50} cursor={<span className='cursor'>|</span>}>
      <p>{directionsArray[num]}</p>
    </Typist>
  );
};
const Games = () => {
  return (
    <>
      A list of games I built for fun and learnings.... ok, just one game for
      now, but more coming soon!
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
const InitialText = () => {
  return (
    <Typist typingDelay={100}>
      <h1 className='main-heading'> **** ZACS WEBSITE BASIC V 0.1 ****</h1>
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
  About,
  CageTips,
  Directions,
  Games,
  Hello,
  Help,
  InitialText,
  NoMatch,
};
