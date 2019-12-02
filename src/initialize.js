const initialize = (annuitCœptis) => {
  const addUser = username => {
    const newUser = annuitCœptis.addUser(username);
    console.log('Added user: ', newUser);
    return newUser;
  }

  const speak = (words, conversation, author) => {
    var newWordsSpoken;
    const lastWordsSpoken = conversation[conversation.length-1];
    annuitCœptis.setCurrentUser(author.id);
    newWordsSpoken = annuitCœptis.addNewNode(words);
    if (lastWordsSpoken) newWordsSpoken = annuitCœptis.move(newWordsSpoken, lastWordsSpoken);
    conversation.push(
      newWordsSpoken
    );
  }

  annuitCœptis.setTree({ data: [] }); // Erase everything

  // Setup users
  const userCharlie = addUser('💀 Charlie');
  const userBow = addUser('🌈 Magical Rainbow');
  const userHeyoka = addUser('🙃 ɐʞoʎǝH');
  const userNorNor = addUser('🦄 Nor Nor');
  const userBodhi = addUser('💩 Donald Trump');
  const userInigo = addUser('💸 Money Man');
  const userSunlightFoundation = addUser('🌄 Sunlight Foundation');

  // Set up conversations
  const charlie = [], bow = [], heyoka = [], sunlightFoundation = [];

  // Populate nodes
  speak("Hi", charlie, userCharlie);
  speak("Hello, Charlie!", charlie, userBow);

  speak("The evil out there is in here.", sunlightFoundation, userSunlightFoundation);
  speak("In your mind.", sunlightFoundation, userSunlightFoundation);
  speak("Shhh. It's sleeping, now.", sunlightFoundation, userSunlightFoundation);
  speak("You have what you want. You're content. But what lurks beneath?", sunlightFoundation, userSunlightFoundation);
  speak("...", sunlightFoundation, userSunlightFoundation);
  speak("We dare not discuss it.", sunlightFoundation, userSunlightFoundation);
  speak("Remember Ted Bundy?", sunlightFoundation, userSunlightFoundation);
  speak("He's a product of a system that is sick and corrupt.", sunlightFoundation, userSunlightFoundation);
  speak("Remember Jeffrey Epstein?", sunlightFoundation, userSunlightFoundation);
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
}

export default initialize;
