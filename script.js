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
    this.display = this.displayCard;
  }

  displayCard() {
    var number = this.number;
    if (Object.keys(CARDS).includes(this.number.toString())) {
      number = CARDS[number];
    } else {
      number = number + 1;
    }
    return `${number}-${suits[suit]}`;
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

function displayCard(card) {
  let number = card % 13;
  let suit = Math.floor(card / 13);
  if (Object.keys(CARDS).includes(number.toString())) {
    number = CARDS[number];
  }
  return `${number + 1}-${SUITS[suit]}`;
}

function displayStack(stack, revealedTo) {
  var display = "";
  for (var i = 0; i < stack.length; i++) {
    var card = stack[i];
    var pos = stack.length - j - 1;
    if (pos > revealedTo) {
      display = display + " ?-?";
    } else display = f`${display} ${display(card)} `;
  }
}

function updateDisplay() {
  for (var i = 0; i < 7; i++) {
    var stack = mainStacks[i];
    mainStackTextElements[i].innerText = displayStack(stack, mainRevealedTo[i]);
  }
}

function selectStack(buttonNumber, buttonType) {}

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

const dealButton = document.querySelector("[deal-button]");
const mainStackButtons = document.querySelectorAll("[data-main-stack]");
const suitStackButtons = document.querySelectorAll("[data-suit-stack]");
const deckButton = document.querySelector("[data-deck]");
const mainStackTextElements = document.querySelectorAll(
  "[data-main-stack-display]"
);
const suitStackTextElements = document.querySelectorAll(
  "[data-suit-stack-display]"
);
const dekckTextElement = document.querySelector("[data-deck-display]");

var suitStacks = [[], [], [], []]; // heart, diamond, spade, club
var drawStack = Array.from(Array(52).keys()).sort((a) => 0.5 - Math.random());
drawStack.forEach((position) => {
  drawStack[position] = Card(position);
});
var mainStacks; // = deal_cards(draw_stack)
var mainRevealedTo = [0, 0, 0, 0, 0, 0, 0];
const SUITS = ["H", "D", "S", "C"];
const CARDS = {
  0: "A",
  11: "J",
  12: "Q",
  13: "K",
};

mainStackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectStack(button.getAttribute("buttonNumber"), "stack");
  });
});

suitStackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectStack(button.getAttribute("buttonNumber"), "suit");
  });
});

deckButton.addEventListener("click", () => {
  selectStack(deckButton.getAttribute("buttonNumber"), "deck");
});

dealButton.addEventListener("click", () => {
  mainStacks = dealCards(drawStack);
  updateDisplay();
});
