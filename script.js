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
var newGameButton = document.querySelector("[data-new-game]");
var mainStackButtons = document.querySelectorAll("[data-main-stack]");
var suitStackButtons = document.querySelectorAll("[data-suit-stack]");
var deckButton = document.querySelector("[data-deck]");
var mainStackTextElements = document.querySelectorAll("[data-main-stack-display]");
var suitStackTextElements = document.querySelectorAll("[data-suit-stack-display]");
var deckTextElement = document.querySelector("[data-deck-display]");
// HTML elements
// DISPLAY
var SUITS = ["H", "D", "S", "C"];
var CARDS = {
    0: "A",
    10: "J",
    11: "Q",
    12: "K"
};
var Card = /** @class */ (function () {
    function Card(position) {
        this.isRevealed = false;
        this.position = position;
        this.suit = Math.floor(this.position / 13);
        this.number = this.position % 13;
        this.display = this.displayCard();
        this.isRevealed = false;
        if (this.suit == 0 || this.suit == 1) {
            this.color = 0;
        }
        else {
            this.color = 1;
        } // 0 = red, 1 = black
    }
    Card.prototype.displayCard = function () {
        if (CARDS[this.number] != undefined) {
            return "".concat(CARDS[this.number], "-").concat(SUITS[this.suit]);
        }
        else {
            return "".concat(this.number + 1, "-").concat(SUITS[this.suit]);
        }
    };
    return Card;
}());
var Stack = /** @class */ (function () {
    function Stack(button, textElement, suit) {
        this.cards = [];
        this.currentNumber = 0;
        this.button = button;
        this.textElement = textElement;
        this.stackType = button.getAttribute("stack-type");
        this.suit = suit;
    }
    Stack.prototype.displayStack = function () {
        var display = "";
        for (var i = this.cards.length - 1; i < -1; i--) {
            var card = this.cards[i];
            if (card.isRevealed) {
                display = "".concat(display, " ").concat(card.display);
            }
            else {
                display = display + " [---]";
            }
        }
        return display;
    };
    return Stack;
}());
function updateDisplay(stacks) {
    stacks[2].forEach(function (stack) {
        stack.textElement.innerText = stack.displayStack();
    });
    stacks[1].forEach(function (stack) {
        var topCard = stack.cards[0];
        if (topCard != undefined) {
            stack.textElement.innerText = topCard.display;
        }
        else {
            stack.textElement.innerText = "[---]";
        }
    });
    var stack = stacks[0][0];
    var topCard = stack.cards[0];
    if (topCard != undefined) {
        stack.textElement.innerText = topCard.display;
    }
    else {
        stack.textElement.innerText = "[---]";
    }
}
function dealCards() {
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < i + 1; j++) {
            var card = stacks[0][0].cards.shift();
            stacks[2][i].cards.push(card);
        }
    }
    stacks[2].forEach(function (stack) {
        stack.cards[0].isRevealed = true;
    });
}
// DISPLAY
// GAMEPLAY
var selectedStack;
function selectStack(stack) {
    if (selectedStack == undefined) {
        selectedStack = stack;
        console.log("BEING SELECTED");
        return;
    }
    else if (stack.stackType == "0") {
        if (selectedStack.stackType == "0") {
            stack.cards.push(stack.cards.shift()); // Remove ! and fix for when draw stack is empty
        }
        else {
            console.warn("Cannot Move Card to Deck!");
        }
    }
    else {
        console.log("CHECKING VALIDITY");
        if (isValid(selectedStack, stack)) {
            var card = selectedStack.cards.shift();
            if (card !== undefined) {
                stack.cards.unshift(card);
                selectedStack.cards[0].isRevealed = true;
                stack.currentNumber++;
            }
            else {
                console.warn("Invalid Move");
            }
        }
        else {
            console.warn("Invalid Move");
        }
    }
    console.log("BEING UNDEFINED");
    selectedStack = undefined;
    updateDisplay(stacks);
}
function isValid(stackFrom, stackTo) {
    var card = stackFrom.cards[0];
    console.log("card: ".concat(card.display));
    if (stackTo.stackType == "2") {
        var cardOn = stackTo.cards[0];
        console.log("cardOn: ".concat(cardOn.display));
        ///////
        console.log("".concat(card.color, " != ").concat(cardOn.color, ": ").concat(card.color != cardOn.color));
        console.log("".concat(card.number, " == ").concat(cardOn.number - 1, ": ").concat(card.number == cardOn.number - 1));
        ///////
        return card.color != cardOn.color && card.number == cardOn.number;
    }
    else if (stackTo.stackType == "1") {
        ////////////////////////////////
        console.log("".concat(card.suit, " == ").concat(stackTo.suit, ": ").concat(card.suit == stackTo.suit));
        console.log("".concat(card.number, " == ").concat(stackTo.currentNumber, ": ").concat(card.number == stackTo.currentNumber));
        ////////////////
        return card.suit == stackTo.suit && card.number == stackTo.currentNumber;
    }
    else
        return false;
}
// card: 5-D (from deck)
// cardOn: 6-C (to main stack 7)
// 0 != 1: true
// 4 == 4: true
// Invalid Move @line 170
// BEING UNDEFINED
function reset() {
    stacks.forEach(function (stackSet) {
        stackSet.forEach(function (stack) {
            stack.cards = [];
        });
    });
    for (var i = 0; i < 52; i++) {
        stacks[0][0].cards.push(new Card(i));
    }
    stacks[0][0].cards.sort(function (a) { return 0.5 - Math.random(); });
    dealCards();
    stacks.forEach(function (stackSet) {
        stackSet.forEach(function (stack) {
            stack.textElement.innerText = "";
        });
    });
}
// GAMEPLAY
// Stacks
function defineStacks() {
    var deckStack = new Stack(deckButton, deckTextElement);
    var mainStacks = [];
    var suitStacks = [];
    for (var i = 0; i < 7; i++) {
        var button = mainStackButtons[i];
        var textElement = mainStackTextElements[i];
        mainStacks.push(new Stack(button, textElement));
    }
    for (var i = 0; i < 4; i++) {
        var button = suitStackButtons[i];
        var textElement = suitStackTextElements[i];
        suitStacks.push(new Stack(button, textElement, i));
    }
    return [[deckStack], suitStacks, mainStacks];
}
function setButtons() {
    stacks.forEach(function (stackSet) {
        stackSet.forEach(function (stack) {
            stack.button.addEventListener("click", function () {
                selectStack(stack);
            });
        });
    });
    newGameButton.addEventListener("click", function () {
        reset();
        updateDisplay(stacks);
    });
}
// Stacks
// Variables
var stacks = defineStacks();
setButtons();
reset();
// Variables
