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
const newGameButton: HTMLButtonElement = document.querySelector("[data-new-game]")!;
const mainStackButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll("[data-main-stack]")!;
const suitStackButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll("[data-suit-stack]")!;
const deckButton:  HTMLButtonElement = document.querySelector("[data-deck]")!;
const mainStackTextElements: NodeListOf<HTMLTextAreaElement> = document.querySelectorAll(
  "[data-main-stack-display]"
)!;
const suitStackTextElements: NodeListOf<HTMLTextAreaElement> = document.querySelectorAll(
  "[data-suit-stack-display]"
)!;
const deckTextElement: HTMLTextAreaElement = document.querySelector("[data-deck-display]")!;
// HTML elements

// DISPLAY
const SUITS = ["H", "D", "S", "C"];
const CARDS = {
  0: "A",
  11: "J",
  12: "Q",
  13: "K",
};

class Card {
  position: number;
  suit: number
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
    var number = this.number;
    if (this.number.toString() in Object.keys(CARDS)) {
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

  displayStack(): string{
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

class Display {
  updateDisplay(stacks: Array<Array<Stack>>): void {
    
    stacks[2].forEach((stack) => {
      stack.textElement.innerText = stack.displayStack();

    })
    stacks[1].forEach((stack) => {
      let topCard: string = stack.cards[0].display;
      if (topCard != undefined) {
        stack.textElement.innerText = topCard;
      } else {
        stack.textElement.innerText = "[---]";
      };
    });
    let stack: Stack = stacks[0][0];
    let topCard: string = stack.cards[0].display;
    if (topCard != undefined) {
      stack.textElement.innerText = topCard
    } else {
      stack.textElement.innerText = "[---]";
    }
  }
  dealCards(): void{
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < i + 1; j++) {
        let card: Card = stacks[0][0].cards.shift()!
        stacks[2][i].cards.push(card);
      }
    }
    stacks[2].forEach((stack) => {
      stack.cards[stack.cards.length - 1].isRevealed = true;
    });
  }
}
// DISPLAY

// GAMEPLAY
class Gameplay{
  selectStack(stack: Stack) {
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
      if (this.isValid(selectedStack, stack)) {
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
    display.updateDisplay(stacks);
  }
  
  isValid(stackFrom: Stack, stackTo: Stack) {
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
  
  reset() {
    stacks.forEach((stackSet) => {
      stackSet.forEach((stack) => {
        stack.cards = [];
      });
    });
    for (var i = 0; i < 52; i++) {
      stacks[0][0].cards.push(new Card(i));
    }
    stacks[0][0].cards.sort((a) => 0.5 - Math.random());
    display.dealCards();
   
    stacks.forEach((stackSet) => {
      stackSet.forEach((stack) => {
        stack.textElement.innerText = "";
      });
    });
    //var selectedStack = null;  //Says this is useless, check!
  }
}
// GAMEPLAY

// Stacks
var deckStack: Stack = new Stack(deckButton, deckTextElement)
var mainStacks: Stack[] = []
var suitStacks: Stack[] = []

for (var i = 0; i < mainStackButtons.length; i++) {
  var button = mainStackButtons[i];
  var textElement = mainStackTextElements[i];
  mainStacks.push(new Stack(button, textElement));
}


for (var i = 0; i < suitStackButtons.length; i++) {
  var button = suitStackButtons[i];
  var textElement = suitStackTextElements[i];
  suitStacks.push(new Stack(button, textElement));
}

var stacks: Array<Array<Stack>> = [[deckStack], suitStacks, mainStacks];

stacks.forEach((stackSet) => {
  stackSet.forEach((stack) => {
    stack.button.addEventListener("click", () => {
      gameplay.selectStack(stack);
    });
  });
});

newGameButton!.addEventListener("click", () => {
  gameplay.reset();
  display.updateDisplay(stacks);
});
// Stacks

// Variables
const gameplay = new Gameplay();
const display = new Display();
gameplay.reset(); 
// Variables
