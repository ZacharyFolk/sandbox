import Typist from 'react-typist-component';

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

const NoMatch = () => {
  const num = Math.floor(Math.random() * nopeArray.length);
  return (
    <Typist typingDelay={10}>
      <p>{nopeArray[num]}</p>
    </Typist>
  );
};

export default NoMatch;
