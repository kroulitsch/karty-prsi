let cardback, trackerP, trackerE, skipButton, draw2, draw4, draw6, draw8, drawButton, drawButtons;
let srdceButton, pikyButton, krizeButton, karyButton, suitButtons;
let restartButton, musicButton, SFXButton, endRestartButton, playButton, pauseButton;

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
let ig;

let tp, te, skipImg;

let gamestate = -1;

const PAUSE = -1;
const PLAYING = 0;
const END = 1;

function preload() {
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

  font = loadFont("./libraries/prsifont.ttf");
  ig = loadImage("./images/ig.png");

  tp = loadImage("./images/tracker_player.png");
  te = loadImage("./images/tracker_enemy.png");
  skipImg = loadImage("./images/skip.png");

  cardback = loadImage("./images/card_back.png");
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

  //odstranění reklam a prázdných polí z webové stránky
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

  playButton = new Button(floor(width / 2), height * 0.78, "./images/play.png");
  playButton.setFunction(play);

  //refill(true);
  shuffleDeck(10000);

  drawCard(hand1, true, 5);
  drawCard(hand2, false, 5);

  for (let i = hand1.length - 1; i >= 0; i--) {
    let c = hand1[i];
    c.setPos(floor(1 / 7 * height) + i * 50, floor(6 / 7 * height));
  }
  for (let i = hand2.length - 1; i >= 0; i--) {
    let c = hand2[i];
    c.setPos(floor(1 / 7 * height) + i * 50, floor(1 / 7 * height));
  }

  song.loop();
  menusong.loop();

  textFont(font);
}

function draw() {
  background(40, 130, 40);
  song.setVolume(musicvolume);
  menusong.setVolume(musicvolume);
  for (let s of sfxSounds) {
    s.setVolume(sfxvolume);
  }

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

  image(cardback, floor(width - 300) - 2 * deck[0].image.height * 0.026, floor(height / 2) + 2 * deck[0].image.width * 0.026, floor(height / 4 * deck[0].image.width / deck[0].image.height), floor(height / 4));
  image(cardback, floor(width - 300) - deck[0].image.height * 0.026, floor(height / 2) + deck[0].image.width * 0.026, floor(height / 4 * deck[0].image.width / deck[0].image.height), floor(height / 4));
  deck[0].show();

  if (gamedeck.length > 0) {
    gamedeck[gamedeck.length - 1].show();
  }

  if (moveCounter % 2 == ENEMY) {
    image(trackerE, 80.5, height / 2, floor(height * 0.09), floor(height * 0.09));
  } else {
    image(trackerP, 80.5, height / 2, floor(height * 0.09), floor(height * 0.09));
  }

  restartButton.show();
  musicButton.show();
  SFXButton.show();

  if (hand1.length == 0 || hand2.length == 0) {
    gamestate = END;
  }

  if (gamestate == PLAYING) {
    if (menusong.isPlaying()) {
      menusong.stop();
      song.play();
    }

    if (!pauseButton.active) {
      pauseButton.activate();
    }
    pauseButton.show();
    if (aceTracker !== -1) {
      skipButton.show();
    }

    if (sevenCounter !== 0) {
      drawButton.setImage(drawButtons[sevenCounter - 1]);
      drawButton.show();
    }

    for (let b of suitButtons) {
      if (b.active) {
        b.activate();
      }

      if (suitChange == -2 && !b.active) {
        b.activate();
      } else if (suitChange == -1 && b.active) {
        b.activate();
      } else if (suitChange == b.id && !b.active) {
        b.activate();
      }
      b.show();
    }

    if (moveCounter % 2 == ENEMY && timeCounter > 100) {
      enemyMove();
    }

    timeCounter++;
  } else if (gamestate == END) {
    if (song.isPlaying()) {
      song.stop();
      menusong.play();
    }
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
    text("@KROULITSCH", width / 2 + 20, height - 20);

    image(ig, floor(width / 2) - 95, floor(height) - 28);
    if (!endRestartButton.active) {
      if (hand1.length == 0) {
        winSound.play();
      } else {
        loseSound.play();
      }
      restartButton.activate();
      endRestartButton.activate();
    }
    endRestartButton.show();
    musicButton.show();
    SFXButton.show();
  } else {
    if (song.isPlaying()) {
      song.stop();
      menusong.play();
    }
    if (!playButton.active) {
      playButton.activate();
    }

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
    text("@KROULITSCH", width / 2 + 20, height - 20);
    image(ig, floor(width / 2) - 95, floor(height) - 28);

    textSize(15);
    text("PRAVIDLA HRY:", width / 2, 190);
    text("VÁŠ TAH JE ZNAČEN       , SOUPEŘŮV TAH JE ZNAČEN       .", width / 2, 230);
    text("PRO LÍZNUTÍ KARTY KLIKNĚTE NA       .", width / 2, 270);
    text("PRO LÍZNUTÍ NA 7 KLIKNĚTE NA        .", width / 2, 310);
    text("PRO STÁNÍ NA ESO KLIKNĚTE NA         .", width / 2, 350);
    text("DÁMA SE DÁ POLOŽIT NA JAKOUKOLIV KARTU.", width / 2, 390);
    text("PO POLOŽENÍ DÁMY ZVOLTE POŽADOVANÝ ZNAK.", width / 2, 430);

    textSize(30);
    //text("PŘIPRAVENI? TAK JDEME NA TO!!!", width / 2, 670);

    image(tp, floor(width / 2) - 55.5, 220 + 0.5, 30, 30);
    image(te, floor(width / 2) + 250.5, 220 + 0.5, 30, 30);
    image(cardback, floor(width / 2) + 168.5, 260 + 0.5, 27, 38);
    image(draw2, floor(width / 2) + 159.5, 300 + 0.5, 40, 40);
    image(skipImg, floor(width / 2) + 159.5, 340 + 0.5, 35, 35);

    musicButton.show();
    SFXButton.show();
    restartButton.show();
    playButton.show();
  }
}

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

function drawCard(hand, flip = false, n = 1) {
  if (n == 1 && (aceTracker !== -1 || sevenCounter !== 0 || suitChange == -2)) {
    errorSound.play();
    return;
  }
  if (hand1.length > 24 && moveCounter % 2 == PLAYER && sevenCounter !== 0) {
    errorSound.play();
    return;
  }
  for (let i = 0; i < n; i++) {
    hand.push(deck[deck.length - 1]);
    if (flip) {
      hand[hand.length - 1].flip();
    }
    deck.length = deck.length - 1;
  }

  sevenTracker = -1;
  sevenCounter = 0;
  timeCounter = 0;
  moveCounter++;
}

function useCard(hand, n) {
  let card = hand[n];
  if (canUse(card)) {
    playSound.play();
    if (suitChange !== -1) {
      suitChange = -1;
    }
    if (gamedeck.length > 0) {
      gamedeck[gamedeck.length - 1].setPos(floor(width - 300), floor(height / 2));
      gamedeck[gamedeck.length - 1].flip();
      deck.unshift(gamedeck[gamedeck.length - 1]);
    }
    gamedeck = [];
    gamedeck.push(card);
    card.setPos(300, floor(height / 2));
    if (!card.visible) {
      card.flip();
    }
    if (card.value == 7) {
      sevenTracker = (moveCounter + 1) % 2;
      sevenCounter++;
      if (!drawButton.active) {
        drawButton.activate();
      }
    } else if (card.value == 1) {
      if (moveCounter % 2 == ENEMY) {
        skipButton.activate();
      } else if (skipButton.active) {
        skipButton.activate();
      }
      aceTracker = (moveCounter + 1) % 2;
    } else if (card.value == 12 && moveCounter % 2 == PLAYER) {
      suitChange = -2;
    } else {
      aceTracker = -1;
      sevenTracker = -1;
      sevenCounter = 0;
      suitChange = -1;
    }
    let hold = hand;
    hand = [];
    for (let i = 0; i < hold.length; i++) {
      if (i !== n) {
        hand.push(hold[i]);
      }
    }

    if (card.value !== 12) {
      moveCounter++;
    }
    timeCounter = 0;
  } else {
    errorSound.play();
  }
  return hand;
}

function skip() {
  skipSound.play();
  if (moveCounter % 2 == PLAYER) {
    skipButton.activate();
  }
  aceTracker = -1;
  moveCounter++;
  timeCounter = 0;
}

function draw7() {
  draw7Sound.play();
  if (moveCounter % 2 == PLAYER) {
    drawCard(hand1, true, sevenCounter * 2);
  } else {
    drawCard(hand2, false, sevenCounter * 2);
  }
  drawSound.play();
  drawButton.activate();
}

function changeSuit(button) {
  clickSound.play();
  suitChange = button.id;

  for (b of suitButtons) {
    if (b.id !== button.id) {
      b.activate();
    }
  }

  moveCounter++;
  timeCounter = 0;
}

function canUse(card) {
  if (gamedeck.length == 0) {
    return true;
  }

  if (suitChange !== -1) {
    if (card.suit == suitChange) {
      return true;
    } else if (card.value == 12) {
      return true;
    }
    return false;
  }

  let lastCard = gamedeck[gamedeck.length - 1];
  if (lastCard.value == 7 && card.value !== 7 && moveCounter % 2 == sevenTracker) {
    return false;
  } else if (lastCard.value == 1 && card.value !== 1 && moveCounter % 2 == aceTracker) {
    return false;
  } else if (card.value == 12) {
    return true;
  } else if (lastCard.suit == card.suit || lastCard.value == card.value) {
    return true;
  }

  return false;
}

function mouseClicked() {
  restartButton.clicked();
  pauseButton.clicked();
  endRestartButton.clicked();
  musicButton.clicked();
  SFXButton.clicked();
  playButton.clicked();
  if (gamestate == PLAYING) {
    if (moveCounter % 2 == PLAYER && (suitChange == -2 || suitChange == -1)) {
      skipButton.clicked();
      drawButton.clicked();
      srdceButton.clicked();
      pikyButton.clicked();
      krizeButton.clicked();
      karyButton.clicked();
    }

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

function getIndex(card, hand) {
  for (let i = 0; i < hand.length; i++) {
    if (card.suit === hand[i].suit && card.value === hand[i].value) {
      return i;
    }
  }
}

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

function enemyMove() {
  let playable = getPlayable();
  if (aceTracker == moveCounter % 2 && !hasValue(hand2, 1)) {
    skip();
  } else if (sevenCounter !== 0 && !hasValue(hand2, 7)) {
    draw7();
  } else if (playable.length > 0) {
    let i = random(playable);
    let c = hand2[i];
    hand2 = useCard(hand2, i);
    if (c.value == 12) {
      suitChange = mostSuit(hand2);
      clickSound.play();
      moveCounter++;
    }
  } else {
    drawCard(hand2);
    drawSound.play();
  }
}

function hasValue(array, value) {
  for (let c of array) {
    if (c.value == value) {
      return true;
    }
  }
  return false;
}

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

function restart(button) {
  clickSound.play();

  gamestate = PLAYING;

  if (button.id === "endRestart") {
    restartButton.activate();
    endRestartButton.activate();
    gamestate = PAUSE;
  }

  moveCounter = 0;
  timeCounter = 0;
  sevenTracker = -1;
  aceTracker = -1;
  sevenCounter = 0;
  suitChange = -1;

  for (let b of suitButtons) {
    if (b.active) {
      b.activate();
    }
  }

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

  shuffleDeck(10000);

  drawCard(hand1, true, 5);
  drawCard(hand2, false, 5);
}

function switchSFX() {
  if (SFXButton.id == UNMUTED) {
    SFXButton.id = MUTED;
    sfxvolume = 0;
    let img = loadImage("./images/no_sfx.png")
    SFXButton.setImage(img);
  } else {
    SFXButton.id = UNMUTED;
    sfxvolume = 1;
    let img = loadImage("./images/sfx.png")
    SFXButton.setImage(img);
    clickSound.play();
  }
}

function switchMusic() {
  clickSound.play();
  if (musicButton.id == UNMUTED) {
    musicButton.id = MUTED;
    musicvolume = 0;
    let img = loadImage("./images/no_music.png")
    musicButton.setImage(img);
  } else {
    musicButton.id = UNMUTED;
    musicvolume = 0.3;
    let img = loadImage("./images/music.png")
    musicButton.setImage(img);
  }
}

function play() {
  clickSound.play();
  playButton.activate();
  gamestate = PLAYING;
}

function pause() {
  clickSound.play();
  gamestate = PAUSE;
  pauseButton.activate();
}