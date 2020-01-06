import { MODEL_TYPES } from './class/Models';

const initialize = (annuitCœptisII) => {
  const addUser = username => {
    const newUser = annuitCœptisII.create({ name: username }, MODEL_TYPES.USER);
    return newUser;
  }

  const speak = (words, conversation, author, parentNode = null) => {
    var newWordsSpoken;
    const lastWordsSpoken = parentNode || conversation[conversation.length-1];
    console.log('conversation', conversation);
    author.be();
    newWordsSpoken = annuitCœptisII.create(
      { text: words },
      MODEL_TYPES.TEXT_NODE
    );
    newWordsSpoken.setParent(lastWordsSpoken);
    conversation.push(
      newWordsSpoken
    );
    return newWordsSpoken;
  }

  const addCloud = (data) => {
    return annuitCœptisII.create(data, MODEL_TYPES.CLOUD);
  }

  annuitCœptisII.clear(); annuitCœptisII.save(); // Erase everything

  // Setup users
  const userCharlie = addUser('💀 Charlie');
  const userBow = addUser('🌈 Magical Rainbow');
  const userHeyoka = addUser('🙃 ɐʞoʎǝH');
  const userNorNor = addUser('🦄 Nor Nor');
  const userDonaldTrump = addUser('💩 Donald Trump');
  const userMoneyMan = addUser('💸 Money Man');
  const userSunlightFoundation = addUser('🌄 Sunlight Foundation');
  const userNewYorkTimes = addUser('📰 New York Times');

  // Set Up Certificates
  /*
  annuitCœptisII.create({
    emoji: '',
    name: 'Personal affront, without apology',
  }, MODEL_TYPES.CERTIFICATE);
  */

  annuitCœptisII.create({
    'emoji': '😏',
    'name': 'Facetious',
    'title': 'Playfully jocular, humorous',
    'subtitle': 'Sportive; jocular, without lack of dignity; abounding in fun: as, a facetious companion.',
    'redux': `fa•ce•tious fə-sē′shəs
      adj.
      Playfully jocular; humorous.
      Sportive; jocular, without lack of dignity; abounding in fun: as, a facetious companion.
      Full of pleasantry; playful, but not undignified; exciting laughter: as, a facetious story.`,
  }, MODEL_TYPES.CERTIFICATE);

  annuitCœptisII.create({
    'emoji': '✅',
    'name': 'Answered Question',
    'title': 'This question has been answered.',
    'subtitle': 'This question was asked to a specific person, and that person has provided a satisfactory answer to it.',
    'redux': `Earlier, a question was asked to a specific person, and that person has provided a satisfying answer.`,
  }, MODEL_TYPES.CERTIFICATE);

  annuitCœptisII.create({
    'emoji': '🤐',
    'name': 'Half Truth',
    'title': 'Truth which misleads',
    'subtitle': 'A statement, especially one intended to deceive, that omits some of the facts necessary for a full description or account.',
    'redux': ` half•-truth hăf′troo͞th″, häf′-►

      n.
      A statement, especially one intended to deceive, that omits some of the facts necessary for a full description or account.
      n.
      A proposition or statement only partly true, or which conveys only part of the truth.
      n.
      a partially true statement, especially one intended to deceive or mislead.`,
  }, MODEL_TYPES.CERTIFICATE);

  annuitCœptisII.create({
    'emoji': '😇',
    'name': 'Hypocrisy',
    'title': 'Professing without possessing',
    'subtitle': 'The practice of professing beliefs, feelings, or virtues that one does not hold or possess; falseness.',
    'redux': `hy•poc•ri•sy hĭ-pŏk′rĭ-sē

      n.
      The practice of professing beliefs, feelings, or virtues that one does not hold or possess; falseness.
      n.
      An act or instance of such falseness.
      n.
      Dissimulation of one's real character or belief; especially, a false assumption of piety or virtue; a feigning to be better than one is; the action or character of a hypocrite.`,
  }, MODEL_TYPES.CERTIFICATE);

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
    sept10 = [];

  // Populate nodes

  speak('Do you like peanut butter?', pb, userHeyoka);
  const pbYes = speak('Yes', pb, userCharlie, pb[0]);
  speak('No', pb, userCharlie, pb[0]);

  speak('Do you like jelly?', jelly, userHeyoka);
  const jellyYes = speak('Yes', jelly, userCharlie, jelly[0]);
  speak('No', jelly, userCharlie, jelly[0]);

  speak(`I would like this to become a hot topic on the hill. Would you?

"NEWSWEEK has learned that while U.S. intelligence received no specific warning, the state of alert had been high during the past two weeks, and a particularly urgent warning may have been received the night before the attacks, causing some top Pentagon brass to cancel a trip. Why that same information was not available to the 266 people who died aboard the four hijacked commercial aircraft may become a hot topic on the Hill."

By Michael Hirsh

NEWSWEEK

Sept. 13, 2003`, sept10, userNewYorkTimes);

    speak(`Top goverment officals often get info that the general public can't.`, sept10, userCharlie, sept10[0]);
      speak(`Indeed, Andrew. That is correct.`, sept10, userHeyoka, sept10[1]);

    speak(`It's been awhile but didn't Michael Moore cover this in his documentary Fahrenheit 911`, sept10, userCharlie, sept10[0]);
    speak(`Was that type of attack even a contingency?`, sept10, userBow, sept10[0]);
    speak(`Tossing out conspiracies for the moment and assuming that there was no 'inside job' element to the attacks, for the sake of not ending up in the weeds, foreign terrorist attacks on the homefront were still for the most part almost blissfully hypothetical. While it's probably long been the case that government officials deviate from travel plans based on chatter, I wonder if they could have ever truly conceived of such a successful, devastating attack developing out of what was probably fairly routine for them.`, sept10, userDonaldTrump, sept10[0]);
    const wreckage = speak(`anyone point out a single peice of aircraft wreckage in this photo, just curious`, sept10, userSunlightFoundation, sept10[0]);
      speak(`go away`, sept10, userCharlie, wreckage);

  addCloud({
    trackedNodeId: pbYes.getId(),
    default: {
      name: 'Peanut Butter',
    },
    to_others_about_member: {
      description: 'likes peanut butter',
    },
    to_member_about_member: {
      description: 'looks like you like peanut butter',
    },
    to_member_about_others: {
      description: 'these people like peanut butter',
    },
  });

  return 'Okay, turkey.';
}

export default initialize;
