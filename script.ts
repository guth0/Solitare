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

// TODO:
//   FIX:
//     updateDisplay()
//     selectStack()
//     isValid()
//     reset()
//   IMPLIMENT:
//     moveCard()
//   REMOVE:
//     change ".currentNumber" to ".cards.length"

// HTML elements
const newGameButton: HTMLButtonElement =
  document.querySelector("[data-new-game]")!;
const mainStacks: NodeListOf<HTMLElement> =
  document.querySelectorAll("[data-main-stack]")!;
const suitStacks: NodeListOf<HTMLElement> =
  document.querySelectorAll("[data-suit-stack]")!;
const deckStack: HTMLElement = document.querySelector("[data-deck]")!;
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
  suit: number;
  number: number;
  color: number;
  display: string;
  isRevealed: boolean = false;
  button: HTMLElement;
  stack: Stack;

  constructor(position: number, stack: Stack) {
    this.suit = Math.floor(position / 13);
    this.number = position % 13;
    this.display = this.displayCard();
    this.isRevealed = false;

    if (this.suit == 0 || this.suit == 1) {
      this.color = 0;
    } else {
      this.color = 1;
    } // 0 = red, 1 = black

    this.button = document.createElement("BUTTON");
    let text = document.createTextNode(this.display);
    this.button.appendChild(text);

    this.button.addEventListener("click", () => {
      this.selectCard();
    });
    this.stack = stack;
  }
  selectCard() {}

  displayCard(): string {
    if (CARDS[this.number] != undefined) {
      return `${CARDS[this.number]}-${SUITS[this.suit]}`;
    } else {
      return `${this.number + 1}-${SUITS[this.suit]}`;
    }
  }

  revealCard(): void {
    this.isRevealed = true;
    this.button.innerHTML = "";
    let text = document.createTextNode(this.display);
    this.button.appendChild(text);
  }

  hideCard(): void {
    this.isRevealed = false;
    this.button.innerHTML = "";
    let text = document.createTextNode("[---]");
    this.button.appendChild(text);
  }
}

class Stack {
  container: HTMLElement;
  cards: Card[] = [];
  addCard: Function;
  removeCard: Function;
  updateStack: Function;
  isValid: Function;

  constructor(container: HTMLElement) {
    this.container = container;
  }
}

class MainStack extends Stack {
  constructor(container: HTMLElement) {
    super(container);

    this.addCard = function addCard(card: Card): void {
      this.container.appendChild(card.button);
      this.cards.unshift(card);
    };

    this.removeCard = function removeCard(position?: number): Card[] {
      if (position == undefined) {
        position = 1;
      }
      this.container.removeChild(this.container.lastChild!);
      let removedCards: Card[] = [];
      for (let i = 0; i < position; i++) {
        removedCards.unshift(this.cards.shift()!);
      }
      if (this.cards[0].isRevealed == false) {
        this.cards[0].revealCard();
      }
      return removedCards;
    };

    this.updateStack = function updateStack(): void {
      this.container.innerHTML = "";
      let card: Card;
      for (let i = this.cards.length - 1; i >= 0; i--) {
        card = this.cards[i];
        this.container.appendChild(card.button[i]);
      }
    };

    this.isValid = function isValid(card: Card): boolean {
      return (
        card.color != this.cards[0].color &&
        card.number == this.cards[0].number - 1
      );
    };
  }
}

class SuitStack extends Stack {
  suit: number | undefined;

  constructor(container: HTMLElement, suit: number) {
    super(container);
    this.suit = suit;

    this.addCard = function addCard(card: Card): void {
      this.container.innerHTML = "";
      this.container.appendChild(card.button);
      this.cards.unshift(card);
    };

    this.removeCard = function removeCard(): Card {
      this.container.innerHTML = "";
      let card = this.cards.shift()!;
      this.container.appendChild(this.cards[0].button);
      return card;
    };

    this.updateStack = function updateStack(): void {
      this.container.innerHTML = "";
      if (this.cards.length > 0) {
        this.container.appendChild(this.cards[0].button);
      } else {
        this.container.appendChild(document.createTextNode("[---]"));
      }
    };

    this.isValid = function isValid(card: Card): boolean {
      return card.suit == this.suit && card.number == this.cards.length;
    };
  }
}

class DrawStack extends Stack {
  constructor(container: HTMLElement) {
    super(container);

    this.addCard = function isValid(): boolean {
      console.warn("Cards Cannot be moved into the deck!");
      return false;
    };

    this.removeCard = function removeCard(): Card {
      this.container.innerHTML = "";
      this.container.appendChild(this.cards[0].button);
      return this.cards.shift()!;
    };

    this.updateStack = function updateDeck(): void {
      this.container.innerHTML = "";
      let topCard = this.cards[0];
      if (topCard != undefined) {
        this.container.appendChild(topCard.button);
      } else {
        this.container.appendChild(document.createTextNode("[---]"));
      }
    };
  }

  cycleDeck(): void {
    this.container.removeChild(this.container.firstChild!);
    this.cards.push(this.cards.shift()!);
    this.container.appendChild(this.cards[0].button);
  }

  dealCards(): void {
    this.cards = [];
    for (var i = 0; i < 52; i++) {
      draw.cards.push(new Card(i, draw));
    }
    draw.cards.sort((a: any) => 0.5 - Math.random());

    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < i + 1; j++) {
        let card: Card = draw.cards.shift()!;
        mains[i].addCard(card);
      }
    }
    mains.forEach((stack: { cards: { isRevealed: boolean }[] }) => {
      stack.cards[0].isRevealed = true;
    });
  }
}

function updateDisplay(): void {
  mains.forEach((stack) => {
    stack.updateStack();
  });
  suits.forEach((stack) => {
    stack.updateStack();
  });
  draw.updateStack();
}
// DISPLAY

// GAMEPLAY
var selectedStack: Stack | undefined = undefined;
var cardPosition: number | undefined = undefined;

function selectStack(stack: Stack, position?: number): void {
  if (selectedStack == undefined) {
    selectedStack = stack;
    if (position == undefined) {
      cardPosition = undefined;
    } else {
      cardPosition = position;
    }

    console.log("BEING SELECTED");
    return;
  } else if (typeof stack == typeof deckStack) {
    if (typeof selectedStack == typeof deckStack) {
      draw.cycleDeck(); // Remove ! and fix for when draw stack is empty
    } else {
      console.warn("Cannot Move Card to Deck!");
    }
  } else {
    console.log("CHECKING VALIDITY");

    if (stack.isValid(stack) && selectedStack.cards.length > 0) {
      stack.addCard(selectedStack.removeCard());

      var card: Card | undefined = selectedStack.cards.shift()!;
      card.isRevealed = true;
      stack.cards.unshift(card);
      let toReveal = selectedStack.cards[0];
      if (toReveal != undefined) {
        toReveal.isRevealed = true;
      }
    } else {
      console.warn("Invalid Move (1)");
    }
  }
  console.log("BEING UNDEFINED");
  selectedStack = undefined;
  // updateDisplay();
}
function reset() {
  draw.container.innerHTML = "";
  mains.forEach((stack) => {
    while (stack.container.firstChild != null) {
      console.log(`REMOVING ${stack.container.firstChild}`);
      stack.container.removeChild(stack.container.firstChild);
    }
    stack.cards = [];
  });
  suits.forEach((stack: Stack) => {
    while (stack.container.firstChild != null) {
      console.log(`REMOVING ${stack.container.firstChild}`);
      stack.container.removeChild(stack.container.firstChild);
    }
    stack.cards = [];
  });
  draw.dealCards();
}
// GAMEPLAY

// Variables

const draw: DrawStack = new DrawStack(deckStack);

let temp: any = [];

for (var i = 0; i < 4; i++) {
  let element = suitStacks[i];
  temp.push(new SuitStack(element, i));
}

const suits = temp;

temp = [];
for (var i = 0; i < 7; i++) {
  let element = mainStacks[i];
  temp.push(new MainStack(element));
}
const mains: MainStack[] = temp;

newGameButton!.addEventListener("click", () => {
  reset();
  updateDisplay();
});
// Variables
