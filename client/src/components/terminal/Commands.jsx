import { useEffect } from 'react';
import Typist from 'react-typist-component';
import { useNavigate, Navigate } from 'react-router-dom';

// const About = () => {
//   const navigate = useNavigate();
//   function Redirect() {
//     // This never runs :
//     // useEffect(() => {
//     //   console.log('within effect');
//     //   navigate('/about');
//     // });
//     // This also does nothing
//     // return <Navigate to={'about'} />;
//     //  Gross but works
//     // if (typeof window !== 'undefined') {
//     //   window.location.replace('/about');
//     // }
//   }
//   return (
//     <Typist
//       typingDelay={10}
//       cursor={<span className='cursor'>|</span>}
//       // Error after moving this to own component :  Do not call Hooks inside other built-in Hooks. You can only call Hooks at the top level of your React function.
//       // https://reactjs.org/link/rules-of-hooks
//       onTypingDone={navigate('about')}
//       // onTypingDone={Redirect}
//     >
//       <p>Initializing digital resume . . . </p>
//       <p>Fetching latest commits from GitHub . . . </p>
//       <p>Fetching Zac's record collection from Discogs . . .</p>
//       <Typist.Delay ms={500} />
//     </Typist>
//   );
// };

const Directions = () => {
  const directionsArray = [
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
    'This is a forest, with trees in all directions. To the east, there appears to be sunlight.',
    'A rabbit runs out as you round the corner and you notice a glint of silver in the grass behind the large tree. The tree is massive and the bark starts to resemble a face as the arm like branches move swiftly to block your path.',
  ];
  let num = Math.floor(Math.random() * directionsArray.length);
  return (
    <Typist typingDelay={10}>
      <p>{directionsArray[num]}</p>
    </Typist>
  );
};
const Help = () => {
  return (
    <Typist typingDelay={25} cursor={<span className='cursor'>|</span>}>
      <p>
        Type <em>commands</em> to see some other things you can try. (Hint:
        There is no bad input, just maybe not the output you expected.)
      </p>
      <p>
        Type <em>about</em> to connect with me or click the ❔ in the upper
        right corner.
      </p>
    </Typist>
  );
};
const Look = () => {
  return (
    <Typist typingDelay={50} cursor={<span className='cursor'>|</span>}>
      This is a path winding through a dimly lit forest. The path leads
      north-south here. One particularly large tree with some low branches
      stands at the edge of the path.
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
export { Directions, Help, Look, NoMatch };
