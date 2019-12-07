const initialize = (annuitCœptis) => {
  const addUser = username => {
    const newUser = annuitCœptis.User.create(username);
    console.log('Added user: ', newUser);
    return newUser;
  }

  const speak = (words, conversation, author, parentNode = null) => {
    var newWordsSpoken;
    const lastWordsSpoken = parentNode || conversation[conversation.length-1];
    annuitCœptis.User.be(author.id);
    newWordsSpoken = annuitCœptis.Node.create(words);
    if (lastWordsSpoken) newWordsSpoken = annuitCœptis.Node.move(newWordsSpoken, lastWordsSpoken);
    conversation.push(
      newWordsSpoken
    );
    return newWordsSpoken;
  }

  const addCloud = (name, description, intName, intDesc, accMessage, invMessage, qualificationNodes) => {
    console.log(qualificationNodes);
    return annuitCœptis.Cloud.create({
      external: {
        name: name,
        description: description,
        qualification: qualificationNodes.map(node => node.id),
      },
      internal: {
        name: intName,
        description: intDesc,
        acceptanceMessage: '',
        invitationMessage: '',
        color1: '', color2: '', color3: '',
      }
    });
  }

  annuitCœptis.setTree({ data: [] }); // Erase everything
  annuitCœptis.setSettings({}); // Erase settings too

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
    heyoka = [],
    norNor = [],
    donaldTrump = [],
    moneyMan = [],
    sunlightFoundation = [],
    pb = [],
    jelly = [],
    newYorkTimes = [];

  // Populate nodes

  speak('Do you like peanut butter?', pb, userHeyoka);
  const pbYes = speak('Yes', pb, userCharlie, pb[0]);
  speak('No', pb, userCharlie, pb[0]);

  speak('Do you like jelly?', jelly, userHeyoka);
  const jellyYes = speak('Yes', jelly, userCharlie, jelly[0]);
  speak('No', jelly, userCharlie, jelly[0]);

  addCloud(
    'PB&J',
    'Peanut butter & jelly enthusiasts support group',
    'Peanut Butter & Jelly',
    'We love PB&J!',
    'Welcome to the PB&J cloud.',
    'Join for a peanut butter jelly time!',
    [ pbYes, jellyYes ]);

  return 'Okay, turkey.';
}

export default initialize;
