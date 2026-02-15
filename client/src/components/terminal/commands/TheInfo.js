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
  'Where, then, is any particular gene—say, the gene for long legs in humans? This is a little like asking where is Beethoven\'s Piano Sonata in E minor. Is it in the original handwritten score? The printed sheet music? Any one performance—or perhaps the sum of all performances, historical and potential, real and imagined? The quavers and crotchets inked on paper are not the music. Music is not a series of pressure waves sounding through the air; nor grooves etched in vinyl or pits burned in CDs; nor even the neuronal symphonies stirred up in the brain of the listener. The music is the information. Likewise, the base pairs of DNA are not genes. They encode genes. Genes themselves are made of bits.',
  'Every natural language has redundancy built in; this is why people can understand text riddled with errors and why they can understand conversation in a noisy room.',
  'DNA is the quintessential information molecule, the most advanced message processor at the cellular level—an alphabet and a code, 6 billion bits to form a human being',
];

const TheInfo = () => {
  const num = Math.floor(Math.random() * infoQuotes.length);
  return (
    <>
      <blockquote>
        <p>{infoQuotes[num]}</p>
        <cite>&mdash;James Gleick - The Information</cite>
      </blockquote>
    </>
  );
};

export default TheInfo;
