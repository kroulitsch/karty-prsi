let cardback, trackerP, trackerE, skipButton, draw2, draw4, draw6, draw8, drawButton, drawButtons;
let srdceButton, pikyButton, krizeButton, karyButton, suitButtons;
let restartButton, musicButton, SFXButton, endRestartButton, playButton, pauseButton;
let diffButton, diffArray;

const EASY = 0;
const NORMAL = 1;
const HARD = 2;

let difficulty = EASY;

let song, menusong, sfxSounds, skipSound, drawSound, playSound, clickSound, draw7Sound, errorSound, winSound, loseSound;

let deck = [];
let hand1 = [];
let hand2 = [];
let gamedeck = [];

let moveCounter = 0;
let timeCounter = 0;
let aceTracker = -1;
let sevenTracker = -1;
let sevenCounter = 0;
let suitChange = -1;

const PLAYER = 0;
const ENEMY = 1;

const SRDCE = 0;
const PIKY = 1;
const KRIZE = 2;
const KARY = 3;

const MUTED = 0;
const UNMUTED = 1;

let musicvolume = 0.3;
let sfxvolume = 1;
sfxSounds = [];

let font;
let ig, github;

let tp, te, skipImg;

let gamestate = -1;

const PAUSE = -1;
const PLAYING = 0;
const END = 1;

function preload() {
  // preload sounds
  song = loadSound("./sounds/home.mp3");
  menusong = loadSound("./sounds/menu.mp3");
  skipSound = loadSound("./sounds/skip.wav");
  clickSound = loadSound("./sounds/click.wav");
  draw7Sound = loadSound("./sounds/draw7.wav");
  playSound = loadSound("./sounds/play.wav");
  drawSound = loadSound("./sounds/draw.wav");
  errorSound = loadSound("./sounds/error.wav");
  winSound = loadSound("./sounds/win.wav");
  loseSound = loadSound("./sounds/lose.wav");

  sfxSounds.push(skipSound, clickSound, draw7Sound, drawSound, playSound, errorSound, winSound, loseSound);

  // preload font
  font = loadFont("./libraries/prsifont.ttf");

  // preload images
  ig = loadImage("./images/ig.png");
  github = loadImage("./images/github.png");

  tp = loadImage("./images/tracker_player.png");
  te = loadImage("./images/tracker_enemy.png");
  skipImg = loadImage("./images/skip.png");

  cardback = loadImage("./images/card_back.png");

  // game deck setup
  for (let i = 0; i < 4; i++) {
    for (let j = 1; j <= 13; j++) {
      let d = new Card(i, j);
      d.setPos(floor(windowWidth - 300), floor(windowHeight / 2));
      deck.push(d);
    }
  }

  trackerP = loadImage("./images/tracker_player.png");
  trackerE = loadImage("./images/tracker_enemy.png");
  draw2 = loadImage("./images/draw2.png");
  draw4 = loadImage("./images/draw4.png");
  draw6 = loadImage("./images/draw6.png");
  draw8 = loadImage("./images/draw8.png");
  drawButtons = [];
  drawButtons.push(draw2, draw4, draw6, draw8);

  // remove ads from the empty HTML fields on the site (only notable at the website)
  var divs = document.getElementsByTagName('div');
  var div;
  var i = divs.length;

  while (i--) {
    div = divs[i];
    div.parentNode.removeChild(div);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  userStartAudio();
  imageMode(CENTER);

  // buttons setup
  skipButton = new Button(floor(width / 2), floor(height / 2), "./images/skip.png");
  skipButton.setFunction(skip);

  drawButton = new Button(floor(width / 2) + 0.5, floor(height / 2) + 0.5, "./images/draw2.png");
  drawButton.setFunction(draw7);

  srdceButton = new Button(floor(width / 2) + 40, floor(height / 2) - 40, "./images/srdce.png", false, SRDCE);
  srdceButton.setFunction(changeSuit);
  pikyButton = new Button(floor(width / 2) - 40, floor(height / 2) - 40, "./images/piky.png", false, PIKY);
  pikyButton.setFunction(changeSuit);
  krizeButton = new Button(floor(width / 2) - 40, floor(height / 2) + 40, "./images/krize.png", false, KRIZE);
  krizeButton.setFunction(changeSuit);
  karyButton = new Button(floor(width / 2) + 40, floor(height / 2) + 40, "./images/kary.png", false, KARY);
  karyButton.setFunction(changeSuit);

  suitButtons = [];
  suitButtons.push(srdceButton, pikyButton, krizeButton, karyButton);

  restartButton = new Button(width - 30, 30, "./images/restart.png", true, "restart");
  restartButton.setFunction(restart);
  pauseButton = new Button(width - 69, 30, "./images/pause.png", true);
  pauseButton.setFunction(pause);
  musicButton = new Button(width - 30, height - 30, "./images/music.png", true, UNMUTED);
  musicButton.setFunction(switchMusic);
  SFXButton = new Button(width - 69, height - 30, "./images/sfx.png", true, UNMUTED);
  SFXButton.setFunction(switchSFX);

  endRestartButton = new Button(floor(width / 2), floor(height / 2), "./images/restart_big.png", false, "endRestart");
  endRestartButton.setFunction(restart);

  playButton = new Button(floor(width / 2), floor(height * 0.78), "./images/play.png");
  playButton.setFunction(play);

  diffArray = [];
  diffArray.push("./images/diff_easy.png", "./images/diff_normal.png", "./images/diff_hard.png");
  diffButton = new Button(floor(width / 2) + 0.5, floor(height * 0.58) + 0.5, diffArray[difficulty], true);
  diffButton.setFunction(setDifficulty);

  // shuffle deck and draw 5 cards for each player

  //refill(true);
  shuffleDeck(10000);

  drawCard(hand1, true, 5);
  drawCard(hand2, false, 5);

  // physically draw the cards onto the screen
  for (let i = hand1.length - 1; i >= 0; i--) {
    let c = hand1[i];
    c.setPos(floor(1 / 7 * height) + i * 50, floor(6 / 7 * height));
  }
  for (let i = hand2.length - 1; i >= 0; i--) {
    let c = hand2[i];
    c.setPos(floor(1 / 7 * height) + i * 50, floor(1 / 7 * height));
  }

  // loop both songs
  song.loop();
  menusong.loop();

  textFont(font);
}

function draw() {
  background(40, 130, 40);

  // set volume of the audio
  song.setVolume(musicvolume);
  menusong.setVolume(musicvolume);
  for (let s of sfxSounds) {
    s.setVolume(sfxvolume);
  }

  // redraw both current hands onto the creen
  for (let i = hand1.length - 1; i >= 0; i--) {
    let c = hand1[i];
    c.setPos(floor(1 / 7 * height) + i * 50, floor(6 / 7 * height));
  }

  for (let i = hand2.length - 1; i >= 0; i--) {
    let c = hand2[i];
    c.setPos(floor(1 / 7 * height) + i * 50, floor(1 / 7 * height));
  }

  for (let c of hand1) {
    c.show();
  }

  for (let c of hand2) {
    c.show();
  }

  // draw both the play deck and the drawing deck
  image(cardback, floor(width - 300) - 2 * deck[0].image.height * 0.026, floor(height / 2) + 2 * deck[0].image.width * 0.026, floor(height / 4 * deck[0].image.width / deck[0].image.height), floor(height / 4));
  image(cardback, floor(width - 300) - deck[0].image.height * 0.026, floor(height / 2) + deck[0].image.width * 0.026, floor(height / 4 * deck[0].image.width / deck[0].image.height), floor(height / 4));
  deck[0].show();

  if (gamedeck.length > 0) {
    gamedeck[gamedeck.length - 1].show();
  }

  // draw the correct game tracking token
  if (moveCounter % 2 == ENEMY) {
    image(trackerE, 80.5, floor(height / 2) + 0.5, floor(height * 0.09) + 0.5, floor(height * 0.09));
  } else {
    image(trackerP, 80.5, floor(height / 2) + 0.5, floor(height * 0.09) + 0.5, floor(height * 0.09));
  }

  // show the buttons
  restartButton.show();
  musicButton.show();
  SFXButton.show();

  // check if anyone won
  if (hand1.length == 0 || hand2.length == 0) {
    // if yes, go to the end screen
    gamestate = END;
  }

  // game is in the gameplay screen
  if (gamestate == PLAYING) {
    // play correct song
    if (menusong.isPlaying()) {
      menusong.stop();
      song.play();
    }

    // show/hide all relevant buttons
    if (!pauseButton.active) {
      pauseButton.activate();
    }
    pauseButton.show();

    // check if ace or any streak of sevens was played, if yes, show relevant buttons
    if (aceTracker !== -1) {
      skipButton.show();
    }

    if (sevenCounter !== 0) {
      drawButton.setImage(drawButtons[sevenCounter - 1]);
      drawButton.show();
    }

    // suit buttons on queen placement
    for (let b of suitButtons) {
      // deactivate all buttons
      if (b.active) {
        b.activate();
      }

      // queen was just placed, activate all the suit buttons
      if (suitChange == -2 && !b.active) {
        b.activate();
      // if no queen was placed, deactivate all the buttons
      } else if (suitChange == -1 && b.active) {
        b.activate();
      // if the specific suit was chosen, activate just that button
      } else if (suitChange == b.id && !b.active) {
        b.activate();
      }

      // show the relevant buttons
      b.show();
    }

    // if the enemy is on the move, wait 100 ticks before performing a move for a "thinking" effect
    if (moveCounter % 2 == ENEMY && timeCounter > 100) {
      enemyMove();
    }

    timeCounter++;

  // game is in the end screen
  } else if (gamestate == END) {
    // play the correct song
    if (song.isPlaying()) {
      song.stop();
      menusong.play();
    }

    // write the text onto the screen
    background(0, 200);
    textAlign(CENTER);
    textSize(60);
    noStroke();
    fill(255);
    if (hand1.length == 0) {
      text("VYHRÁLI JSTE!", width / 2, 100);
      textSize(30);
      text("POCHLUBTE SE KAMARÁDŮM A MŮŽETE HRÁT ZNOVU!", width / 2, 200);
    } else {
      text("PROHRÁLI JSTE!", width / 2, 100);
      textSize(30);
      text("TO ALE NEVADÍ, PŘÍŠTĚ BUDETE LEPŠÍ!", width / 2, 200);
    }

    text("DÍKY ZA HRU!", width / 2, height / 2 + 200);
    textSize(20);
    text("CREATED BY:", width / 2, height - 60);
    text("KROULITSCH", width / 2 + 20, height - 20);

    image(ig, floor(width / 2) - 85, floor(height) - 28);
    image(github, floor(width / 2) - 119, floor(height) - 28);

    // just in the first frame of the endscreen
    if (!endRestartButton.active) {
      // play the correct win/lose sound
      if (hand1.length == 0) {
        winSound.play();
      } else {
        loseSound.play();
      }

      // activate and show relevant buttons
      restartButton.activate();
      endRestartButton.activate();
    }
    endRestartButton.show();
    musicButton.show();
    SFXButton.show();

  // game is in the main menu screen
  } else {
    // play correct song
    if (song.isPlaying()) {
      song.stop();
      menusong.play();
    }

    // activate the play button
    if (!playButton.active) {
      playButton.activate();
    }

    if (!diffButton.active && moveCounter == 0) {
      diffButton.activate();
    }

    // write the text onto the screen
    background(0, 200);
    textAlign(CENTER);
    textSize(60);
    noStroke();
    fill(255);
    text("PRŠÍ", width / 2, 100);
    textSize(25);
    text("VÍTEJTE V KLASICKÉ KARETNÍ HŘE PRŠÍ!", width / 2, 150);

    textSize(20);
    text("CREATED BY:", width / 2, height - 60);
    text("KROULITSCH", width / 2 + 20, height - 20);

    image(ig, floor(width / 2) - 85, floor(height) - 28);
    image(github, floor(width / 2) - 119, floor(height) - 28);

    // game rules
    textSize(15);
    text("PRAVIDLA HRY:", width / 2, 190);
    text("VÁŠ TAH JE ZNAČEN       , SOUPEŘŮV TAH JE ZNAČEN       .", width / 2, 230);
    text("PRO LÍZNUTÍ KARTY KLIKNĚTE NA       .", width / 2, 270);
    text("PRO LÍZNUTÍ NA 7 KLIKNĚTE NA        .", width / 2, 310);
    text("PRO STÁNÍ NA ESO KLIKNĚTE NA         .", width / 2, 350);
    text("DÁMA SE DÁ POLOŽIT NA JAKOUKOLIV KARTU.", width / 2, 390);
    text("PO POLOŽENÍ DÁMY ZVOLTE POŽADOVANÝ ZNAK.", width / 2, 430);
    text("VYBERTE SI OBTÍŽNOST:", width / 2, 510);

    textSize(30);
    text("PŘIPRAVENI? TAK JDEME NA TO!!!", width / 2, 670);

    // draw icons into the text
    image(tp, floor(width / 2) - 55.5, 220 + 0.5, 30, 30);
    image(te, floor(width / 2) + 250.5, 220 + 0.5, 30, 30);
    image(cardback, floor(width / 2) + 168.5, 260 + 0.5, 27, 38);
    image(draw2, floor(width / 2) + 159.5, 300 + 0.5, 40, 40);
    image(skipImg, floor(width / 2) + 159.5, 340 + 0.5, 35, 35);

    // show relevant buttons
    musicButton.show();
    SFXButton.show();
    restartButton.show();
    playButton.show();
    diffButton.show();
  }
}

/**
 * @brief This function performs a certain number of card swaps in the drawing deck.
 * Selects two cards at random and swaps their positions.
 * @param {*} iterations number of iterations to shuffle the deck
 */
function shuffleDeck(iterations) {
  for (let i = 0; i < iterations; i++) {
    let a = floor(random(0, deck.length));
    let b = floor(random(0, deck.length));
    while (b == a) {
      b = floor(random(0, deck.length - 1));
    }

    let hold = deck[a];
    deck[a] = deck[b];
    deck[b] = hold;
  }
}

/**
 * @brief This function draws a certain number of cards from the deck into certain hand,
 * either flipped or unflipped.
 * @param {*} hand hand into which to draw the cards
 * @param {*} flip whether to make the cards' frontside (true) or backside (false) visible
 * @param {*} n number of cards to draw (for example if opponent placed a seven, the player should draw 2 cards)
 */
function drawCard(hand, flip = false, n = 1) {
  // basic draw, but the ace or seven is active, or the queen suit select is awaiting a choice
  if (n == 1 && (aceTracker !== -1 || sevenCounter !== 0 || suitChange == -2)) {
    // that is not allowed
    errorSound.play();
    return;
  }

  // if the hand is too big and a seven is placed
  if (hand1.length > 24 && moveCounter % 2 == PLAYER && sevenCounter !== 0) {
    // that is also not allowed
    errorSound.play();
    return;
  }

  // otherwise draw the selected number of cards into the selected hand
  for (let i = 0; i < n; i++) {
    hand.push(deck[deck.length - 1]);
    if (flip) {
      hand[hand.length - 1].flip();
    }
    deck.length = deck.length - 1;
  }

  // reset the special cards trackers and time counter
  sevenTracker = -1;
  sevenCounter = 0;
  timeCounter = 0;
  moveCounter++;
}

/**
 * @brief This function is used to play a card in a selected hand at the specific position in this hand
 * @param {*} hand hand to be played from
 * @param {*} n card position to be played
 * @returns the updated hand
 */
function useCard(hand, n) {
  let card = hand[n];

  // if the card is eligible to play
  if (canUse(card)) {
    playSound.play();

    // if the card is played, we no longer need the selected suit button to be shown
    if (suitChange !== -1) {
      suitChange = -1;
    }

    // update the positions of other cards in hand
    if (gamedeck.length > 0) {
      gamedeck[gamedeck.length - 1].setPos(floor(width - 300), floor(height / 2));
      gamedeck[gamedeck.length - 1].flip();
      deck.unshift(gamedeck[gamedeck.length - 1]);
    }

    // move the card from hand to the game deck
    gamedeck = [];
    gamedeck.push(card);
    card.setPos(300, floor(height / 2));

    // make the card visible
    if (!card.visible) {
      card.flip();
    }

    // special cards handles

    // seven increments the seven counter and sets the seven tracker
    if (card.value == 7) {
      sevenTracker = (moveCounter + 1) % 2;
      sevenCounter++;

      // show the apropriate draw button
      if (!drawButton.active) {
        drawButton.activate();
      }

    // ace sets the ace tracker and shows/hides the skip button
    } else if (card.value == 1) {
      if (moveCounter % 2 == ENEMY) {
        skipButton.activate();
      } else if (skipButton.active) {
        skipButton.activate();
      }
      aceTracker = (moveCounter + 1) % 2;

    // queen sets the suitChange tracker to "queen was just placed"
    } else if (card.value == 12 && moveCounter % 2 == PLAYER) {
      suitChange = -2;

    // ordinary cards just reset the potentially activated trackers and counters
    } else {
      aceTracker = -1;
      sevenTracker = -1;
      sevenCounter = 0;
      suitChange = -1;
    }

    // repush the cards into the hand to fill the hole after the just played card
    let hold = hand;
    hand = [];
    for (let i = 0; i < hold.length; i++) {
      if (i !== n) {
        hand.push(hold[i]);
      }
    }

    // if we skipped ace, the move counter does not increment, because the current player plays again
    if (card.value !== 12) {
      moveCounter++;
    }

    // reset the time counter after each successfully played card
    timeCounter = 0;
  } else { // if the card is not eligible to play
    errorSound.play();
  }

  // return the updated hand
  return hand;
}

/**
 * @brief This function performs a skip on ace
 */
function skip() {
  // play the right sound
  skipSound.play();
  // show/hide the skip button
  if (moveCounter % 2 == PLAYER) {
    skipButton.activate();
  }

  // reset the trackers and counters
  aceTracker = -1;
  moveCounter++;
  timeCounter = 0;
}

/**
 * @brief This function performs a draw of the correct amount of cards on a streak of sevens
 */
function draw7() {
  // play the right sound
  draw7Sound.play();

  // draw the correct amount of cards into the right hand
  if (moveCounter % 2 == PLAYER) {
    drawCard(hand1, true, sevenCounter * 2);
  } else {
    drawCard(hand2, false, sevenCounter * 2);
  }

  // play the draw sound and deactivate the draw button
  drawSound.play();
  drawButton.activate();
}

/**
 * @brief This function performs a suit change on queen
 * @param {*} button the suit button which was chosen by the player
 */
function changeSuit(button) {
  // play the right sound and set the suit choice
  clickSound.play();
  suitChange = button.id;

  // deactivate all the unchosen buttons
  for (b of suitButtons) {
    if (b.id !== button.id) {
      b.activate();
    }
  }

  moveCounter++;
  timeCounter = 0;
}

/**
 * @brief This function checks if a specific card is available for play based on the 
 * current state of the game
 * @param {*} card card to be checked
 * @returns true if the card can be played, false otherwise
 */
function canUse(card) {
  // first card can be played always
  if (gamedeck.length == 0) {
    return true;
  }

  // if the suit is actively being changed, only the right suit or other queen can be played
  if (suitChange !== -1) {
    if (card.suit == suitChange) {
      return true;
    } else if (card.value == 12) {
      return true;
    }
    return false;
  }

  let lastCard = gamedeck[gamedeck.length - 1];
  // if there is a seven, only other seven can be played
  if (lastCard.value == 7 && card.value !== 7 && moveCounter % 2 == sevenTracker) {
    return false;
  // if there is an ace, only other ace can be played
  } else if (lastCard.value == 1 && card.value !== 1 && moveCounter % 2 == aceTracker) {
    return false;
  // queen can be played on any card except seven and ace
  } else if (card.value == 12) {
    return true;
  // basic game rule, if the suits or values match, the card can be played
  } else if (lastCard.suit == card.suit || lastCard.value == card.value) {
    return true;
  }

  // any other possible case is forbidden
  return false;
}

/**
 * @brief This function handles a mouse click anywhere on the screen, calls relevant buttons' methods
 * or handles card clicks
 */
function mouseClicked() {
  // button click
  restartButton.clicked();
  pauseButton.clicked();
  endRestartButton.clicked();
  musicButton.clicked();
  SFXButton.clicked();
  playButton.clicked();
  diffButton.clicked();
  if (gamestate == PLAYING) {
    if (moveCounter % 2 == PLAYER && (suitChange == -2 || suitChange == -1)) {
      skipButton.clicked();
      drawButton.clicked();
      srdceButton.clicked();
      pikyButton.clicked();
      krizeButton.clicked();
      karyButton.clicked();
    }

    // card click
    if (moveCounter % 2 == PLAYER) {
      for (let i = hand1.length - 1; i >= 0; i--) {
        let c = hand1[i];
        if (c.clicked()) {
          c.use();
          break;
        }
      }

      if (deck[0].clicked() && hand1.length <= 24) {
        drawCard(hand1, true);
        drawSound.play();
      }
    }
  }
}

/**
 * @brief This function returns 
 * @param {*} card card to be searched for
 * @param {*} hand hand to be searched
 * @returns an index of the hand array
 */
function getIndex(card, hand) {
  for (let i = 0; i < hand.length; i++) {
    if (card.suit === hand[i].suit && card.value === hand[i].value) {
      return i;
    }
  }
}

/**
 * @brief This function returns the subset of the enemy's hand containing only playable cards.
 * This function is used in the decision making algorithm.
 * @returns array of all playable cards in the enemy's hand
 */
function getPlayable() {
  let playable = [];
  for (let i = 0; i < hand2.length; i++) {
    let c = hand2[i];
    if (canUse(c)) {
      playable.push(i);
    }
  }

  return playable;
}

/**
 * @brief This function performs the enemy's move, includes the decision making algorithm.
 */
function enemyMove() {
  // get all playable cards
  let playable = getPlayable();
  // if an ace is active and we don't have an ace, skip
  if (aceTracker == moveCounter % 2 && !hasValue(hand2, 1)) {
    skip();
  // if a seven is active and we don't have a seven, draw on seven
  } else if (sevenCounter !== 0 && !hasValue(hand2, 7)) {
    draw7();
  // else play a random card from playable cards
  } else if (playable.length > 0) {
    let i = random(playable);
    let c = hand2[i];
    hand2 = useCard(hand2, i);
    // if we played a queen, choose the suit we have the most of
    if (c.value == 12) {
      suitChange = mostSuit(hand2);
      clickSound.play();
      moveCounter++;
    }
  // if we don't have any playable cards, draw a card
  } else {
    drawCard(hand2);
    drawSound.play();
  }
}

/**
 * @brief This function checks if a specific array contains a card of a selected value
 * @param {*} array card array to be searched
 * @param {*} value value to be searched for
 * @returns true if found, false otherwise
 */
function hasValue(array, value) {
  for (let c of array) {
    if (c.value == value) {
      return true;
    }
  }
  return false;
}

/**
 * @brief This function returns the most frequent suit of the card array
 * @param {*} array card array to be searched
 * @returns the suit that occured the most
 */
function mostSuit(array) {
  let n = 0;
  let record = 0;
  let recordSuit = -1;

  for (let i = 0; i < 4; i++) {
    for (let c of array) {
      if (c.suit == i) {
        n++;
      }
    }

    if (n > record) {
      record = n;
      recordSuit = i;
    }
    n = 0;
  }

  return recordSuit;
}

/**
 * @brief This function performs a game restart based on the caller button
 * @param {*} button the caller button
 */
function restart(button) {
  clickSound.play();

  gamestate = PLAYING;

  // if the game was restarted from the end screen, restart to the main menu
  if (button.id === "endRestart") {
    restartButton.activate();
    endRestartButton.activate();
    gamestate = PAUSE;
  }

  // restart every tracker and counter
  moveCounter = 0;
  timeCounter = 0;
  sevenTracker = -1;
  aceTracker = -1;
  sevenCounter = 0;
  suitChange = -1;

  // deactivate all relevant buttons
  for (let b of suitButtons) {
    if (b.active) {
      b.activate();
    }
  }

  // reset both hands and deck
  for (let c of hand1) {
    if (c.visible) {
      c.flip();
    }

    c.setPos(floor(width - 300), floor(height / 2));
    deck.push(c);
  }

  hand1 = [];

  for (let c of hand2) {
    if (c.visible) {
      c.flip();
    }

    c.setPos(floor(width - 300), floor(height / 2));
    deck.push(c);
  }

  hand2 = [];

  for (let c of gamedeck) {
    if (c.visible) {
      c.flip();
    }

    c.setPos(floor(width - 300), floor(height / 2));
    deck.push(c);
  }

  gamedeck = [];

  // reshuffle the drawing deck
  shuffleDeck(10000);

  // draw 5 cards to each player
  drawCard(hand1, true, 5);
  drawCard(hand2, false, 5);
}

/**
 * @brief This function is used by the SFX button, changes the button's appearance and SFX volume
 */
function switchSFX() {
  if (SFXButton.id == UNMUTED) {
    SFXButton.id = MUTED;
    sfxvolume = 0;
    let img = loadImage("./images/no_sfx.png");
    SFXButton.setImage(img);
  } else {
    SFXButton.id = UNMUTED;
    sfxvolume = 1;
    let img = loadImage("./images/sfx.png");
    SFXButton.setImage(img);
    clickSound.play();
  }
}

/**
 * @brief This function is used by the Music button, changes the button's appearance and music volume
 */
function switchMusic() {
  clickSound.play();
  if (musicButton.id == UNMUTED) {
    musicButton.id = MUTED;
    musicvolume = 0;
    let img = loadImage("./images/no_music.png");
    musicButton.setImage(img);
  } else {
    musicButton.id = UNMUTED;
    musicvolume = 0.3;
    let img = loadImage("./images/music.png");
    musicButton.setImage(img);
  }
}

/**
 * @brief This function is used by the Play button, starts the game
 */
function play() {
  clickSound.play();
  playButton.activate();
  diffButton.activate();
  gamestate = PLAYING;
}

/**
 * @brief This function is used by the Pause button, pauses the game
 */
function pause() {
  clickSound.play();
  gamestate = PAUSE;
  pauseButton.activate();
}

/**
 * @brief This function is used by the Difficulty button, iterates through difficulties
 */
function setDifficulty() {
  clickSound.play();
  difficulty++;
  difficulty %= 3;
  let img = loadImage(diffArray[difficulty])
  diffButton.setImage(img);
}