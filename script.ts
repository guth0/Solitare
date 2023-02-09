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

// HTML elements
const newGameButton: HTMLButtonElement =
  document.querySelector("[data-new-game]")!;
const mainStackButtons: NodeListOf<HTMLButtonElement> =
  document.querySelectorAll("[data-main-stack]")!;
const suitStackButtons: NodeListOf<HTMLButtonElement> =
  document.querySelectorAll("[data-suit-stack]")!;
const deckButton: HTMLButtonElement = document.querySelector("[data-deck]")!;
const mainStackTextElements: NodeListOf<HTMLTextAreaElement> =
  document.querySelectorAll("[data-main-stack-display]")!;
const suitStackTextElements: NodeListOf<HTMLTextAreaElement> =
  document.querySelectorAll("[data-suit-stack-display]")!;
const deckTextElement: HTMLTextAreaElement = document.querySelector(
  "[data-deck-display]"
)!;
// HTML elements

// DISPLAY
const SUITS = ["H", "D", "S", "C"];
const CARDS = {
  0: "A",
  10: "J",
  11: "Q",
  12: "K",
};

class Card {
  position: number;
  suit: number;
  number: number;
  color: number;
  display: string;
  isRevealed: boolean = false;

  constructor(position: number) {
    this.position = position;
    this.suit = Math.floor(this.position / 13);
    this.number = this.position % 13;
    this.display = this.displayCard();
    this.isRevealed = false;
    if (this.suit == 0 || this.suit == 1) {
      this.color = 0;
    } else {
      this.color = 1;
    } // 0 = red, 1 = black
  }

  displayCard() {
    var number: number | string = this.number;
    if (this.number in Object.keys(CARDS)) {
      number = CARDS[number];
    } else {
      number = number + 1;
    }
    return `${number}-${SUITS[this.suit]}`;
  }
}

class Stack {
  button: HTMLButtonElement;
  textElement: HTMLTextAreaElement;
  stackType: string;
  cards: Card[];

  constructor(button: HTMLButtonElement, textElement: HTMLTextAreaElement) {
    this.button = button;
    this.textElement = textElement;
    this.stackType = button.getAttribute("stack-type")!;
    this.cards = [];
  }

  displayStack(): string {
    var display = "";
    this.cards.forEach((card) => {
      if (card.isRevealed) {
        display = `${display} ${card.display}`;
      } else {
        display = display + " [---]";
      }
    });
    return display;
  }
}

function updateDisplay(stacks: Stack[][]): void {
  stacks[2].forEach((stack) => {
    stack.textElement.innerText = stack.displayStack();
  });
  stacks[1].forEach((stack) => {
    let topCard: Card = stack.cards[0];
    if (topCard != undefined) {
      stack.textElement.innerText = topCard.display;
    } else {
      stack.textElement.innerText = "[---]";
    }
  });
  let stack: Stack = stacks[0][0];
  let topCard: Card = stack.cards[0];
  if (topCard != undefined) {
    stack.textElement.innerText = topCard.display;
  } else {
    stack.textElement.innerText = "[---]";
  }
}

function dealCards(): void {
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < i + 1; j++) {
      let card: Card = stacks[0][0].cards.shift()!;
      stacks[2][i].cards.push(card);
    }
  }
  stacks[2].forEach((stack) => {
    stack.cards[stack.cards.length - 1].isRevealed = true;
  });
}
// DISPLAY

// GAMEPLAY
function selectStack(stack: Stack) {
  if (selectedStack == undefined) {
    var selectedStack: Stack | undefined = stack;
    return;
  }
  if (selectedStack.stackType == "0") {
    if (stack.stackType == "0") {
      stack.cards.push(stack.cards.shift()!); // Remove ! and fix for when draw stack is empty
    } else {
      console.warn("Cannot Move Card to Deck!");
    }
  } else {
    if (isValid(selectedStack, stack)) {
      var card: Card | undefined = stack.cards.shift();
      if (card !== undefined) {
        selectedStack.cards.unshift(card);
        stack.cards[0].isRevealed = true;
      }
    } else {
      console.warn("Invalid Move");
    }
  }
  selectedStack = undefined;
  updateDisplay(stacks);
}

function isValid(stackFrom: Stack, stackTo: Stack) {
  let card = stackFrom.cards[0];
  console.log(`cards: ${card}`);
  let cardOn = stackTo.cards[0];
  console.log(`cardsOn: ${cardOn}`);
  if (stackTo.stackType == "1") {
    return card.suit == cardOn.suit && card.number == cardOn.number + 1;
  } else if (stackTo.stackType == "2") {
    return card.color != cardOn.color && card.number == cardOn.number - 1;
  }
}

function reset() {
  stacks.forEach((stackSet) => {
    stackSet.forEach((stack) => {
      stack.cards = [];
    });
  });
  for (var i = 0; i < 52; i++) {
    stacks[0][0].cards.push(new Card(i));
  }
  stacks[0][0].cards.sort((a) => 0.5 - Math.random());
  dealCards();

  stacks.forEach((stackSet) => {
    stackSet.forEach((stack) => {
      stack.textElement.innerText = "";
    });
  });
  //var selectedStack = null;  //Says this is useless, check!
}
// GAMEPLAY

// Stacks
function defineStacks(): Stack[][] {
  let deckStack: Stack = new Stack(deckButton, deckTextElement);
  let mainStacks: Stack[] = [];
  let suitStacks: Stack[] = [];

  for (var i = 0; i < mainStackButtons.length; i++) {
    var button = mainStackButtons[i];
    let textElement = mainStackTextElements[i];
    mainStacks.push(new Stack(button, textElement));
  }

  for (var i = 0; i < suitStackButtons.length; i++) {
    let button = suitStackButtons[i];
    let textElement = suitStackTextElements[i];
    suitStacks.push(new Stack(button, textElement));
  }

  return [[deckStack], suitStacks, mainStacks];
}

function setButtons(): void {
  stacks.forEach((stackSet) => {
    stackSet.forEach((stack) => {
      stack.button.addEventListener("click", () => {
        selectStack(stack);
      });
    });
  });

  newGameButton!.addEventListener("click", () => {
    reset();
    updateDisplay(stacks);
  });
}
// Stacks

// Variables
const stacks = defineStacks();
setButtons();
reset();
// Variables
