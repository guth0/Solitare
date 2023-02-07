// Stacks:
//   4 suit stacks
//   7 main stacks
//     accending number of cards (1-7)
//     only top card is revealed
//   Draw piles
//     one for deck (Top shown)
//       starts with all other cards
// Moving cards:
//   Can move a card from deck to bottom of deack
//     Can move top of deck to main stacks or suit stacks
//       Card below becomes visible
//   Can move card from top of main stack to other top of main stack
//     Only can place if card is one higher/lower than the one below
//     Only can place if card is other color than the one below
//   Suit stacks MUST start with ACE and continue in sequential order
//     Can draw from top of Suit stack (RESEARCH MORE)
// UI:
//   Timer (Update after every move until create UI)
//   Move count

// DISPLAY
const SUITS = ["H", "D", "S", "C"];
const CARDS = {
  0: "A",
  11: "J",
  12: "Q",
  13: "K",
};

class Card {
  constructor(position) {
    this.position = position;
    this.suit = Math.floor(this.position / 13);
    this.number = this.position % 13;
    if (this.suit == 0 || this.suit == 1) {
      this.color = 0;
    } else {
      this.color = 1;
    } // 0 = red, 1 = black
    this.display = this.displayCard();
  }

  displayCard() {
    var number = this.number;
    if (Object.keys(CARDS).includes(this.number.toString())) {
      number = CARDS[number];
    } else {
      number = number + 1;
    }
    return `${number}-${SUITS[this.suit]}`;
  }
}

class Stack {
  constructor(button, textElement) {
    this.button = button;
    this.textElement = textElement;
    this.buttonNumber = button.getAttribute("buttonCode");
  }
}

function dealCards(cards) {
  let returntCards = [[], [], [], [], [], [], []];
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < i + 1; j++) {
      returntCards[i].push(cards.shift());
    }
  }
  return returntCards;
}

function displayStack(stack, revealedTo) {
  var display = "";
  for (var i = 0; i < stack.length; i++) {
    var card = stack[i];
    var pos = stack.length - i - 1;
    if (pos > revealedTo) {
      display = display + " [---]";
    } else {
      display = `${display} ${card.display}`;
    }
  }
  return display;
}

function updateDisplay() {
  for (var i = 0; i < 7; i++) {
    var stack = mainStacks[i];
    console.log(stack);
    mainStackTextElements[i].innerText = displayStack(stack, mainRevealedTo[i]);
  }
  for (var i = 0; i < 4; i++) {
    var stack = suitStacks[i];
    var topCard = stack[0];
    if (topCard != undefined) {
      suitStackTextElements[i].innerText = `${topCard.display}`;
    } else {
      suitStackTextElements[i].innerText = "[---]";
    }
  }
  if (drawStack.length > 0) {
    deckTextElement.innerText = drawStack[0].display;
  } else {
    deckTextElement.innerText = "[---]";
  }
}
// DISPLAY

// GAMEPLAY
function selectStack(stack) {
  if (selectedStack == null) {
    selectedStack = stack;
  } else {
    if (stack.number == 0) {
      if (selectedStack.number == 0) {
        drawStack.push(drawStack.shift());
      } else {
        console.warn("Cannot Move Card to Deck!");
      }
    }
    if (isValid()) {
      selectedStack = null;
    }
    updateDisplay();
  }
}

function isValid(card, cardPlacedOn, stackType) {
  if (stackType == "suit") {
    return (
      card.suit == cardPlacedOn.suit && card.number == cardPlacedOn.number + 1
    );
  } else if (stackType == "main") {
    return (
      card.color != cardPlacedOn.color && card.number == cardPlacedOn.number - 1
    );
  }
}

function reset() {
  suitStacks = [[], [], [], []]; // heart, diamond, spade, club
  drawStack = [];
  for (var i = 0; i < 52; i++) {
    drawStack.push(new Card(i));
  }
  drawStack.sort((a) => 0.5 - Math.random());
  mainStacks = dealCards(drawStack);
  mainRevealedTo = [0, 0, 0, 0, 0, 0, 0];
  suitStackTextElements.forEach((stack) => {
    stack.innerText = "";
  });
  mainStackTextElements.forEach((stack) => {
    stack.innerText = "";
  });
  deckTextElement.innerText = "";
  selectedStack = null;
}
// GAMEPLAY

// HTML elements
const newGameButton = document.querySelector("[data-new-game]");
const mainStackButtons = document.querySelectorAll("[data-main-stack]");
const suitStackButtons = document.querySelectorAll("[data-suit-stack]");
const deckButton = document.querySelector("[data-deck]");
const mainStackTextElements = document.querySelectorAll(
  "[data-main-stack-display]"
);
const suitStackTextElements = document.querySelectorAll(
  "[data-suit-stack-display]"
);
const deckTextElement = document.querySelector("[data-deck-display]");
// HTML elements

// Buttons
var stacks = [new Stack(deckButton, deckTextElement)];

for (var i = 0; i < mainStackButtons.length; i++) {
  var button = mainStackButtons[i];
  var textElement = mainStackTextElements[i];
  stacks.push(new Stack(button, textElement));
}

for (var i = 0; i < suitStackButtons.length; i++) {
  var button = suitStackButtons[i];
  var textElement = suitStackTextElements[i];
  stacks.push(new Stack(button, textElement));
}

stacks.forEach((stack) => {
  stack.button.addEventListener("click", () => {
    selectStack(stack);
  });
});

newGameButton.addEventListener("click", () => {
  reset();
  updateDisplay();
});
// Buttons

// Variables
var selectedStack = null;
var suitStacks = [[], [], [], []]; // heart, diamond, spade, club
var drawStack = [];
for (var i = 0; i < 52; i++) {
  drawStack.push(new Card(i));
}
drawStack.sort((a) => 0.5 - Math.random());
var mainStacks = dealCards(drawStack);
var mainRevealedTo = [0, 0, 0, 0, 0, 0, 0];
// Variablesl

console.log(deckButton.getAttribute("buttonCode"));
