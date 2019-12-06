const initialize = (annuitCœptis) => {
  const addUser = username => {
    const newUser = annuitCœptis.User.create(username);
    console.log('Added user: ', newUser);
    return newUser;
  }

  const speak = (words, conversation, author) => {
    var newWordsSpoken;
    const lastWordsSpoken = conversation[conversation.length-1];
    annuitCœptis.User.be(author.id);
    newWordsSpoken = annuitCœptis.Node.create(words);
    if (lastWordsSpoken) newWordsSpoken = annuitCœptis.Node.move(newWordsSpoken, lastWordsSpoken);
    conversation.push(
      newWordsSpoken
    );
    return newWordsSpoken;
  }

  const addCloud = (name, description, qualificationNodes) => {
    console.log(qualificationNodes);
    return annuitCœptis.Cloud.create({
      external: {
        name: name,
        description: description,
        qualification: qualificationNodes.map(node => node.id),
      },
      internal: {
        name: '',
        acceptanceMessage: '',
        invitationMessage: '',
        color1: '', color2: '', color3: '',
      }
    });
  }

  annuitCœptis.setTree({ data: [] }); // Erase everything

  // Setup users
  const userCharlie = addUser('💀 Charlie');
  const userBow = addUser('🌈 Magical Rainbow');
  const userHeyoka = addUser('🙃 ɐʞoʎǝH');
  const userNorNor = addUser('🦄 Nor Nor');
  const userDonaldTrump = addUser('💩 Donald Trump');
  const userMoneyMan = addUser('💸 Money Man');
  const userSunlightFoundation = addUser('🌄 Sunlight Foundation');
  const userNewYorkTimes = addUser('📰 New York Times');

  // Set up conversations
  const
    charlie = [],
    bow = [],
    helpPeopleBow = [],
    breakFree = [],
    heyoka = [],
    norNor = [],
    donaldTrump = [],
    moneyMan = [],
    sunlightFoundation = [],
    newYorkTimes = [];

  // Populate nodes

  // Bow wants to help
  `I want help all the people
  The people who need a new world
  The old world. The natural world
  I want to be there`
  .split("\n").forEach(text => speak(text, helpPeopleBow, userBow));

  `Aho
  This is my purpose, and I'm pleased that you share it.
  I need your support.`
  .split("\n").forEach(text => speak(text, helpPeopleBow, userHeyoka));

  `I want to be there for the feminine. I want to protect the feminine, the women. I want to stand up and say things. I want to take the blows because I feel like I can. I am not afraid. And I'm not afraid to die to protect what I believe in. Not when I'm around will I let anyone be hurt and repressed. Help us find the crowd we need, to work together. We must work together. Let us find our people, the rainbow people
  I want to support you. However I can.`
  .split("\n").forEach(text => speak(text, helpPeopleBow, userBow));

  `Thank you baby ❤️️
  Same`
  .split("\n").forEach(text => speak(text, helpPeopleBow, userHeyoka));

  `Thank you
  💜`
  .split("\n").forEach(text => speak(text, helpPeopleBow, userBow));

  // Break Free
  `I'm starting to break free. All along, the eccentric curious child was trying to break out. Even if I'm judged as weak or strange, an outsider to the hierarchy of man, inside I feel free. Is that what it feels like to accept yourself? To feel your body, to feel your heart like a warm fire? I don't want it to end`
  .split("\n").forEach(text => speak(text, breakFree, userCharlie));

  `That's good. I've always felt like an outsider. It's a shame how parents and society seem to aim to steal everything precious from kids, to turn them into the zombies that we call adults nowadays.`
  .split("\n").forEach(text => speak(text, breakFree, userBow));

  `It all too often turns into threats. It means being socially excluded, your reputation (And livelihood at stake), and physical force. But if it means destroying yourself to fit in, to "win" then it isn't worth it. You slowly learn to lose touch with yourself entirely just to get your basic human needs met. And it's terribly messed up. It turns into a cycle of mutual control and abuse. "I force myself into a mould, and you must too" And so abuse, addiction, and mental illness are perpetuated. I'm trying to get out of it, and slowly it's working. But the threat of not conforming to expectations is always there, trying to get you to live on fear. The fear that if you go all in with authenticity, you'll be broken to pieces. But the cycle has to be broken, so someone has to make the first step`
  .split("\n").forEach(text => speak(text, breakFree, userCharlie));

  `This human bondage was formed gradually, over thousands of years. They didn't just cook this scheme up in 1990. It's traditional.
  Wanna break free? Of course you do. That's why young people have a tradition of rebellion, typically sometime in their "coming of age" years, teen-age, during a period of natural enlightenment... personal renaissance. It's traditional to struggle against your bonds, and to discover their unexpected strength and solidity. Their ancestral roots. And, most disheartening of all, to discover that those who have always professed to love you most, are not on your side in that struggle... that they do not support your liberation... that they sigh with annoyance at your screams and turn the TV up louder.
  Welcome to Earth. 21st century. Welcome, child. We love you*
  *some restrictions apply, see adult for details, offer void in New Jersey.`
  .split("\n").forEach(text => speak(text, breakFree, userHeyoka));

  `Better late than never I guess? I didn't really have a rebellious phase. I usually latched onto and mimicked people. A collage of bits and pieces of those I admired. So it's strange noticing a range of emotions and thoughts I haven't had since childhood. It's familar, but surreal. I guess that's what happens when you loosen the pressure to conform to an image? It's like starting over from scratch but it's not that bad`
  .split("\n").forEach(text => speak(text, breakFree, userCharlie));

  `http://www.stevescottsite.com/how-to-chain-an-elephant`
  .split("\n").forEach(text => speak(text, breakFree, userHeyoka));


  // Cult Recruits
  speak("The evil out there is in here.", sunlightFoundation, userSunlightFoundation);
  speak("In your mind.", sunlightFoundation, userSunlightFoundation);
  speak("Shhh. It's sleeping, now.", sunlightFoundation, userSunlightFoundation);
  speak("You have what you want. You're content. But what lurks beneath?", sunlightFoundation, userSunlightFoundation);
  speak("...", sunlightFoundation, userSunlightFoundation);
  speak("We dare not discuss it.", sunlightFoundation, userSunlightFoundation);
  speak("Remember Ted Bundy?", sunlightFoundation, userSunlightFoundation);
  speak("He's a product of a system that is sick and corrupt.", sunlightFoundation, userSunlightFoundation);
  const epstein = speak("Remember Jeffrey Epstein?", sunlightFoundation, userSunlightFoundation);
  speak("Yeah. Same story.", sunlightFoundation, userSunlightFoundation);
  speak("Imagine that. A sick world, producing sick individuals.", sunlightFoundation, userSunlightFoundation);
  speak("Not so hard to believe, right?", sunlightFoundation, userSunlightFoundation);
  speak("...", sunlightFoundation, userSunlightFoundation);
  speak("The world is sick.", sunlightFoundation, userSunlightFoundation);
  speak("The cure is inches away from us, but we don't recognize it as such.", sunlightFoundation, userSunlightFoundation);
  speak("But some of us do.", sunlightFoundation, userSunlightFoundation);
  speak("Join us.", sunlightFoundation, userSunlightFoundation);
  speak("Sunlight Foundation", sunlightFoundation, userSunlightFoundation);
  speak("Are you in?", sunlightFoundation, userSunlightFoundation);

  addCloud('Jeffrey Epstein', 'Didn\'t kill himself.', [ epstein ]);

  return 'Okay, turkey.';
}

export default initialize;
