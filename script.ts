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
//     MainStack.removeCard()
//   IMPLIMENT:
//     moveCard()
//   REMOVE:
//     Card.revealCard()
//     Card.hideCard()

// HTML elements
const newGameButton: HTMLButtonElement =
  document.querySelector("[data-new-game]")!;
const mainStacks: NodeListOf<HTMLDivElement> =
  document.querySelectorAll("[data-main-stack]")!;
const suitStacks: NodeListOf<HTMLDivElement> =
  document.querySelectorAll("[data-suit-stack]")!;
const deckStack: HTMLDivElement = document.querySelector("[data-deck]")!;
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
    this.stack = stack;
  }

  displayCard(): string {
    if (CARDS[this.number] != undefined) {
      return `${CARDS[this.number]}-${SUITS[this.suit]}`;
    } else {
      return `${this.number + 1}-${SUITS[this.suit]}`;
    }
  }
}

class Stack {
  selectCard(card: Card) {
    throw new Error("Method not implemented.");
  }
  container: HTMLDivElement;
  cards: Card[] = [];
  addCard: Function;
  removeCard: Function;
  updateStack: Function;
  isValid: Function;
  reset: Function;

  constructor(container: HTMLDivElement) {
    this.container = container;
  }
}

class MainStack extends Stack {
  constructor(container: HTMLDivElement) {
    super(container);

    this.addCard = function addCard(card: Card): void {
      console.log("FUNCTION NOT IMPLEMENTED!");
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
      this.cards.forEach((card: Card) => {
        let button = document.createElement("button");
        button.innerText = card.display;
        this.container.appendChild(button);

        this.button.addEventListener("click", () => {
          card.stack.selectCard(card);
        });
      });
    };

    this.isValid = function isValid(card: Card): boolean {
      return (
        card.color != this.cards[0].color &&
        card.number == this.cards[0].number - 1
      );
    };

    this.reset = function reset(): void {
      this.cards = [];
      this.container.innerHTML = "";
    };
  }
}

class SuitStack extends Stack {
  suit: number | undefined;
  defaultHTML: string;
  button: HTMLButtonElement = document.createElement("button");

  constructor(container: HTMLDivElement, suit: number) {
    super(container);
    this.suit = suit;
    this.defaultHTML = `${SUITS[this.suit]}: `;
    this.container.innerHTML = this.defaultHTML;
    this.container.appendChild(this.button);
    this.button.innerHTML = "[---]";

    this.button.addEventListener("click", () => {
      console.log("FUNCTION NOT IMPLEMENTED!");
    });

    this.addCard = function addCard(card: Card): void {
      this.cards.unshift(card);
      this.button.innerText = card.display;
    };

    this.removeCard = function removeCard(): Card {
      let card = this.cards.shift()!;
      this.button.innerText = this.cards[0].display;
      return card;
    };

    this.updateStack = function updateStack(): void {
      this.container.innerHTML = this.defaultHTML;
      if (this.cards.length > 0) {
        this.button.innerText = this.cards[0].button;
      } else {
        this.button.innerText = "[---]"; // THERE IS NO BUTTON TO HIT ON THIS SUIT STACKS
      }
    };

    this.isValid = function isValid(card: Card): boolean {
      return card.suit == this.suit && card.number == this.cards.length;
    };

    this.reset = function reset(): void {
      this.button.innerHTML = "[---]";
      this.cards = [];
    };
  }
}

class DrawStack extends Stack {
  defaultHTML: string = "Deck: ";
  button: HTMLButtonElement = document.createElement("button");

  constructor(container: HTMLDivElement) {
    super(container);
    this.container.innerHTML = this.defaultHTML;
    this.container.appendChild(this.button);
    this.button.innerText = "[---]";

    this.button.addEventListener("click", () => {
      console.log("FUNCTION NOT IMPLEMENTED!");
    });

    this.addCard = function isValid(): boolean {
      console.warn("Cards Cannot be moved into the deck!");
      return false;
    };

    this.removeCard = function removeCard(): Card {
      let card = this.cards.shift()!; // MIGHT NOT ALWAYS BE NON-NULL
      this.button.innerText = this.cards[0].display;
      return card;
    };

    this.updateStack = function updateDeck(): void {
      let topCard = this.cards[0];
      if (topCard != undefined) {
        this.button.innerText = topCard.display;
      } else {
        this.button.innerText = "[---]";
      }
    };

    this.reset = function reset(): void {
      this.button.innerText = "[---]";
      this.cards = [];
    };
  }

  cycleDeck(): void {
    this.cards.push(this.cards.shift()!);
    this.button.innerText = this.cards[0].display;
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
  draw.reset();
  mains.forEach((stack: MainStack) => {
    stack.reset();
  });
  suits.forEach((stack: SuitStack) => {
    stack.reset();
  });

  draw.dealCards();
  updateDisplay();
}
// GAMEPLAY

// Variables

const draw: DrawStack = new DrawStack(deckStack);

let temp: any = [];

for (var i = 0; i < 4; i++) {
  let element = suitStacks[i];
  temp.push(new SuitStack(element, i));
}

const suits: SuitStack[] = temp;

temp = [];
for (var i = 0; i < 7; i++) {
  let element = mainStacks[i];
  temp.push(new MainStack(element));
}
const mains: MainStack[] = temp;

newGameButton!.addEventListener("click", () => {
  console.log(suits[0].container.innerHTML);
  reset();
  console.log(suits[0].container.innerHTML);
  updateDisplay();
  console.log(suits[0].container.innerHTML);
});
// Variables
