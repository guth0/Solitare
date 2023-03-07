// UI:
//   Timer (Update after every move until create UI)
//   Move count
//   Fix the main stacks positioning

// HTML elements
const newGameButton: HTMLButtonElement =
  document.querySelector("[data-new-game]")!;
const mainStacks: NodeListOf<HTMLDivElement> =
  document.querySelectorAll("[data-main-stack]")!;
const suitStacks: NodeListOf<HTMLDivElement> =
  document.querySelectorAll("[data-suit-stack]")!;
const deckStack: HTMLDivElement = document.querySelector("[data-deck]")!;
const newFromWin: HTMLButtonElement = document.querySelector(
  "[data-new-from-win]"
)!;
const winScreen: HTMLDivElement = document.querySelector("[data-win-screen]")!;
// HTML elements

// DISPLAY
const SUITS = ["H", "D", "S", "C"];
const STACK_SUITS = ["HEARTS", "DIAMONDS", "SPADES", "CLUBS"];
const CARDS = {
  0: "A",
  10: "J",
  11: "Q",
  12: "K",
};

class Card {
  suit: number;
  number: number;
  color: "red" | "black";
  display: string;
  stack: Stack;
  position: number;
  button: HTMLButtonElement;

  constructor(position: number, stack: Stack) {
    this.suit = Math.floor(position / 13);
    this.number = position % 13;
    this.display = this.displayCard();

    if (this.suit == 0 || this.suit == 1) {
      this.color = "red";
    } else {
      this.color = "black";
    }
    this.stack = stack;

    this.button = document.createElement("button");
    this.button.innerText = this.display;
    this.button.classList.add(this.color);

    this.button.addEventListener("click", () => {
      this.stack.selectCard(this);
    });
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
  container: HTMLElement;
  cards: Card[] = [];
  addCard: Function;
  removeCard: Function;
  updateStack: Function;
  isValid: Function;
  reset: Function;
  selectCard: Function;

  constructor(container: HTMLElement) {
    this.container = container;
  }
}

class MainStack extends Stack {
  numHidden: number;
  emptyButton: HTMLButtonElement = document.createElement("button");

  constructor(container: HTMLDivElement, numHidden: number) {
    super(container);
    this.numHidden = numHidden;

    this.emptyButton.innerHTML = "[   ]";
    this.emptyButton.onclick = () => {
      selectStack(this);
    };
    this.emptyButton.classList.add("black");

    this.addCard = function addCard(card: Card): void {
      card.position = this.cards.length;
      this.cards.unshift(card);
      card.stack = this;
    };

    this.removeCard = function removeCard(): Card {
      let card: Card = this.cards.shift()!;
      return card;
    };

    this.updateStack = function updateStack(): void {
      this.container.innerHTML = "";

      if (this.numHidden != 0) {
        for (var i = 0; i < this.numHidden; i++) {
          this.container.innerText += "[---]";
          let lineBreak = document.createElement("br");
          this.container.appendChild(lineBreak);
        }
      }
      if (this.cards.length > 0) {
        for (var i = this.cards.length - this.numHidden - 1; i >= 0; i--) {
          let card = this.cards[i];
          let lineBreak = document.createElement("br");
          this.container.appendChild(card.button);
          this.container.appendChild(lineBreak);
        }
      } else {
        this.container.appendChild(this.emptyButton);
      }
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

    this.selectCard = function selectCard(card: Card): void {
      selectStack(this, card.position);
    };
  }
}

class SuitStack extends Stack {
  suit: number | undefined;
  defaultHTML: string;

  constructor(container: HTMLDivElement, suit: number) {
    super(container);
    this.suit = suit;
    this.defaultHTML = `${STACK_SUITS[this.suit]}<br>`;
    this.container.innerHTML = this.defaultHTML + "[   ]";

    if (this.suit == 0 || this.suit == 1) {
      this.container.classList.add("red");
    } else {
      this.container.classList.add("black");
    }

    this.container.addEventListener("click", () => {
      selectStack(this);
    });

    this.addCard = function addCard(card: Card): void {
      this.cards.unshift(card);
      this.container.innerHTML = this.defaultHTML + card.display;
      card.stack = this;
    };

    this.removeCard = function removeCard(): Card {
      let card = this.cards.shift()!;
      return card;
    };

    this.updateStack = function updateStack(): void {
      this.container.innerHTML = this.defaultHTML;
      if (this.cards.length > 0) {
        this.container.innerHTML += this.cards[0].display;
      } else {
        this.container.innerHTML += "[   ]";
      }
    };

    this.isValid = function isValid(card: Card): boolean {
      return card.suit == this.suit && card.number == this.cards.length;
    };

    this.reset = function reset(): void {
      this.container.innerHTML = this.defaultHTML + "[   ]";
      this.cards = [];
    };
    this.selectCard = function () {
      console.warn("YOU SHOULD NOT SEE THIS");
    };
  }
}

class DrawStack extends Stack {
  defaultHTML: string = "Deck<br>";
  currentColor: "red" | "black" = "black";

  constructor(container: HTMLDivElement) {
    super(container);
    this.container.innerHTML = this.defaultHTML + "[   ]";

    this.container.addEventListener("click", () => {
      selectStack(this);
    });

    this.isValid = function isValid(): boolean {
      console.warn("Cards Cannot be moved into the deck!");
      return false;
    };

    this.addCard = function addCard(): boolean {
      console.warn("Cards Cannot be moved into the deck!");
      return false;
    };

    this.removeCard = function removeCard(): Card {
      let card = this.cards.shift()!;
      return card;
    };

    this.updateStack = function updateStack(): void {
      this.container.innerHTML = this.defaultHTML;
      if (this.cards.length > 0) {
        let topCard = this.cards[0];
        this.container.innerHTML += topCard.display;
        this.updateColor(topCard.color);
      } else {
        this.container.innerHTML += "[   ]";
        if (this.currentColor == "red") {
          this.container.classList.remove("red");
          this.currentColor = "black";
        }
      }
    };

    this.reset = function reset(): void {
      this.container.innerHTML = this.defaultHTML + "[   ]";
      this.cards = [];
    };

    this.selectCard = function () {
      console.warn("YOU SHOULD NOT SEE THIS");
    };
  }

  updateColor(Cardcolor: string): void {
    if (this.currentColor != Cardcolor) {
      if (this.currentColor == "black") {
        this.container.classList.add("red");
        this.currentColor = "red";
      } else {
        this.container.classList.remove("red");
        this.currentColor = "black";
      }
    }
  }

  cycleDeck(): void {
    this.cards.push(this.cards.shift()!);
    this.updateStack();
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

function showWinScreen(): void {
  winScreen.style.display = "flex";
}

function hideWinScreen(): void {
  winScreen.style.display = "none";
}
// DISPLAY

// GAMEPLAY
var selectedStack: Stack | undefined = undefined;
var cardPosition: number | undefined = undefined;

function moveCard(stackTo: Stack, stackFrom: Stack, index: number): void {
  let cards: Card[] = [];
  for (let i = 0; i <= index; i++) {
    cards.unshift(stackFrom.removeCard());
  }
  cards.forEach((card) => {
    stackTo.addCard(card);
  });
  if (
    stackFrom instanceof MainStack &&
    stackFrom.numHidden != 0 &&
    stackFrom.cards.length == stackFrom.numHidden
  ) {
    stackFrom.numHidden -= 1;
  }
}

function selectStack(
  stack: Stack,
  position: number = stack.cards.length - 1
): void {
  if (selectedStack == undefined) {
    if (stack.cards.length > 0) {
      selectedStack = stack;
      selectedStack.container.classList.add("selected");
      cardPosition = position;
    } else {
      console.warn("CANNOT MOVE CARD FROM EMPTY STACK");
    }
    return;
  } else if (stack instanceof DrawStack) {
    if (selectedStack instanceof DrawStack) {
      draw.cycleDeck();
    } else {
      console.warn("Cannot Move Card to Deck!");
    }
  } else if (stack.cards.length == 0 && stack instanceof MainStack) {
    let index = selectedStack.cards.length - cardPosition! - 1;
    moveCard(stack, selectedStack, index);
  } else if (selectedStack != stack) {
    let index = selectedStack.cards.length - cardPosition! - 1;
    if (
      selectedStack.cards.length > 0 &&
      stack.isValid(selectedStack.cards[index])
    ) {
      moveCard(stack, selectedStack, index);
    } else {
      if (selectedStack.cards.length < 0)
        console.warn("Invalid Move: No cards in Stack!");
      if (stack.isValid(selectedStack.cards[index]))
        console.warn("Invalid Move: Incorrect Card!");
    }
  }
  selectedStack.container.classList.remove("selected");
  selectedStack = undefined;
  updateDisplay();
  if (isWon()) showWinScreen();
}
function reset() {
  draw.reset();
  mains.forEach((stack: MainStack) => {
    stack.reset();
  });
  suits.forEach((stack: SuitStack) => {
    stack.reset();
  });
  if (selectedStack != undefined) {
    selectedStack.container.classList.remove("selected");
    selectedStack = undefined;
  }
  for (let i = 0; i < 7; i++) {
    mains[i].numHidden = i;
  }
}

function isWon(): boolean {
  let topSuits: Card[] = suits.map((suitstack) => suitstack.cards[0]);
  if (topSuits.every((card) => card != undefined)) {
    let nums = topSuits.map((card) => card.number);
    if (nums.every((num) => num == 12)) return true;
  }
  return false;
}

function newGame(): void {
  reset();
  draw.dealCards();
  updateDisplay();
}
// GAMEPLAY

// Variables
const draw: DrawStack = new DrawStack(deckStack);

let temp: any = [];

for (var i = 0; i < 4; i++) {
  let element = suitStacks[i];
  let stack = new SuitStack(element, i);
  temp.push(stack);
}

const suits: SuitStack[] = temp;

temp = [];
for (var i = 0; i < 7; i++) {
  let element = mainStacks[i];
  temp.push(new MainStack(element, i));
}
const mains: MainStack[] = temp;

newGameButton!.addEventListener("click", () => {
  newGame();
});

newFromWin.onclick = () => {
  hideWinScreen();
  newGame();
};
// Variables

// Dev Tools
function setWin(): void {
  reset();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 13; j++) {
      let stack = suits[i];
      stack.cards.unshift(new Card(j + i * 13, stack));
    }
  }
  updateDisplay();
}

function setAmostWin(): void {
  setWin();
  let card = suits[0].removeCard();
  mains[0].addCard(card);
  updateDisplay();
}
// Dev Tools
