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

const Deep = () => {
  const num = Math.floor(Math.random() * deepArray.length);
  const num2 = Math.floor(Math.random() * bkgdImages.length);
  return (
    <div
      className="deepBkgd"
      style={{ backgroundImage: `url(${bkgdImages[num2]})` }}
    >
      <div className="thought">
        <p>{deepArray[num]}</p>
      </div>
    </div>
  );
};

export default Deep;
