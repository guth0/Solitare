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
    11: "J",
    12: "Q",
    13: "K"
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
        var number = this.number;
        if (this.number.toString() in Object.keys(CARDS)) {
            number = CARDS[number];
        }
        else {
            number = number + 1;
        }
        return "".concat(number, "-").concat(SUITS[this.suit]);
    };
    return Card;
}());
var Stack = /** @class */ (function () {
    function Stack(button, textElement) {
        this.button = button;
        this.textElement = textElement;
        this.stackType = button.getAttribute("stack-type");
        this.cards = [];
    }
    Stack.prototype.displayStack = function () {
        var display = "";
        this.cards.forEach(function (card) {
            if (card.isRevealed) {
                display = "".concat(display, " ").concat(card.display);
            }
            else {
                display = display + " [---]";
            }
        });
        return display;
    };
    return Stack;
}());
var Display = /** @class */ (function () {
    function Display() {
    }
    Display.prototype.updateDisplay = function (stacks) {
        stacks[2].forEach(function (stack) {
            stack.textElement.innerText = stack.displayStack();
        });
        stacks[1].forEach(function (stack) {
            var topCard = stack.cards[0].display;
            if (topCard != undefined) {
                stack.textElement.innerText = topCard;
            }
            else {
                stack.textElement.innerText = "[---]";
            }
            ;
        });
        var stack = stacks[0][0];
        var topCard = stack.cards[0].display;
        if (topCard != undefined) {
            stack.textElement.innerText = topCard;
        }
        else {
            stack.textElement.innerText = "[---]";
        }
    };
    Display.prototype.dealCards = function () {
        for (var i_1 = 0; i_1 < 7; i_1++) {
            for (var j = 0; j < i_1 + 1; j++) {
                var card = stacks[0][0].cards.shift();
                stacks[2][i_1].cards.push(card);
            }
        }
        stacks[2].forEach(function (stack) {
            stack.cards[stack.cards.length - 1].isRevealed = true;
        });
    };
    return Display;
}());
// DISPLAY
// GAMEPLAY
var Gameplay = /** @class */ (function () {
    function Gameplay() {
    }
    Gameplay.prototype.selectStack = function (stack) {
        if (selectedStack == undefined) {
            var selectedStack = stack;
            return;
        }
        if (selectedStack.stackType == "0") {
            if (stack.stackType == "0") {
                stack.cards.push(stack.cards.shift()); // Remove ! and fix for when draw stack is empty
            }
            else {
                console.warn("Cannot Move Card to Deck!");
            }
        }
        else {
            if (this.isValid(selectedStack, stack)) {
                var card = stack.cards.shift();
                if (card !== undefined) {
                    selectedStack.cards.unshift(card);
                    stack.cards[0].isRevealed = true;
                }
            }
            else {
                console.warn("Invalid Move");
            }
        }
        selectedStack = undefined;
        display.updateDisplay(stacks);
    };
    Gameplay.prototype.isValid = function (stackFrom, stackTo) {
        var card = stackFrom.cards[0];
        console.log("cards: ".concat(card));
        var cardOn = stackTo.cards[0];
        console.log("cardsOn: ".concat(cardOn));
        if (stackTo.stackType == "1") {
            return card.suit == cardOn.suit && card.number == cardOn.number + 1;
        }
        else if (stackTo.stackType == "2") {
            return card.color != cardOn.color && card.number == cardOn.number - 1;
        }
    };
    Gameplay.prototype.reset = function () {
        stacks.forEach(function (stackSet) {
            stackSet.forEach(function (stack) {
                stack.cards = [];
            });
        });
        for (var i = 0; i < 52; i++) {
            stacks[0][0].cards.push(new Card(i));
        }
        stacks[0][0].cards.sort(function (a) { return 0.5 - Math.random(); });
        display.dealCards();
        stacks.forEach(function (stackSet) {
            stackSet.forEach(function (stack) {
                stack.textElement.innerText = "";
            });
        });
        //var selectedStack = null;  //Says this is useless, check!
    };
    return Gameplay;
}());
// GAMEPLAY
// Stacks
var deckStack = new Stack(deckButton, deckTextElement);
var mainStacks = [];
var suitStacks = [];
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
var stacks = [[deckStack], suitStacks, mainStacks];
stacks.forEach(function (stackSet) {
    stackSet.forEach(function (stack) {
        stack.button.addEventListener("click", function () {
            gameplay.selectStack(stack);
        });
    });
});
newGameButton.addEventListener("click", function () {
    gameplay.reset();
    display.updateDisplay(stacks);
});
// Stacks
// Variables
var gameplay = new Gameplay();
var display = new Display();
gameplay.reset();
// Variables
