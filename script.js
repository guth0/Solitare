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
//
// TODO:
//   FIX:
//     selectStack() !! I think it ALWAYS cycles the deck
//     isValid()
//   IMPLIMENT:
//     moveCard()
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// HTML elements
var newGameButton = document.querySelector("[data-new-game]");
var mainStacks = document.querySelectorAll("[data-main-stack]");
var suitStacks = document.querySelectorAll("[data-suit-stack]");
var deckStack = document.querySelector("[data-deck]");
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
    function Card(position, stack) {
        var _this = this;
        this.suit = Math.floor(position / 13);
        this.number = position % 13;
        this.display = this.displayCard();
        if (this.suit == 0 || this.suit == 1) {
            this.color = 0;
        }
        else {
            this.color = 1;
        } // 0 = red, 1 = black
        this.stack = stack;
        this.button = document.createElement("button");
        this.button.innerText = this.display;
        if (this.color == 0) {
            this.button.style.color = "red";
        }
        else {
            this.button.style.color = "black";
        }
        this.button.addEventListener("click", function () {
            _this.stack.selectCard(_this);
        });
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
    function Stack(container) {
        this.cards = [];
        this.container = container;
    }
    return Stack;
}());
var MainStack = /** @class */ (function (_super) {
    __extends(MainStack, _super);
    function MainStack(container, numHidden) {
        var _this = _super.call(this, container) || this;
        _this.numHidden = numHidden;
        if (_this.numHidden != 0) {
            for (var i_1 = 0; i_1 < numHidden; i_1++) {
                _this.container.innerText = _this.container.innerText + "[---] ";
            }
        }
        _this.addCard = function addCard(card) {
            card.position = this.cards.length;
            this.cards.unshift(card);
            var button = document.createElement("button");
            button.innerText = card.display;
            this.container.appendChild(button);
            card.stack = this;
        };
        _this.removeCard = function removeCard() {
            var card = this.cards.shift();
            this.numHidden -= 1;
            return card;
        };
        _this.updateStack = function updateStack() {
            this.container.innerHTML = "";
            if (this.numHidden != 0) {
                for (var i_2 = 0; i_2 < numHidden; i_2++) {
                    this.container.innerText += "[---] ";
                }
            }
            for (var i_3 = this.cards.length - numHidden - 1; i_3 >= 0; i_3--) {
                var card = this.cards[i_3];
                console.log("".concat(card, " -- ").concat(i_3));
                this.container.appendChild(card.button);
            }
        };
        _this.isValid = function isValid(card) {
            return (card.color != this.cards[0].color &&
                card.number == this.cards[0].number - 1);
        };
        _this.reset = function reset() {
            this.cards = [];
            this.container.innerHTML = "";
        };
        _this.selectCard = function selectCard(card) {
            selectStack(this, card.position);
        };
        return _this;
    }
    MainStack.prototype.revealCard = function () {
        console.log("FUNCTION NOT IMPLEMENTED!");
    };
    return MainStack;
}(Stack));
var SuitStack = /** @class */ (function (_super) {
    __extends(SuitStack, _super);
    function SuitStack(container, suit) {
        var _this = _super.call(this, container) || this;
        _this.button = document.createElement("button");
        _this.suit = suit;
        console.log("suit: ".concat(_this.suit, " | ").concat(SUITS[_this.suit]));
        _this.defaultHTML = "".concat(SUITS[_this.suit], ": ");
        _this.container.innerHTML = _this.defaultHTML;
        _this.container.appendChild(_this.button);
        _this.button.innerText = "[---]";
        if (_this.suit == 0 || _this.suit == 1) {
            _this.button.style.color = "red";
        }
        _this.button.addEventListener("click", function () {
            selectStack(_this);
        });
        _this.addCard = function addCard(card) {
            this.cards.unshift(card);
            this.button.innerText = card.display;
            card.stack = this;
        };
        _this.removeCard = function removeCard() {
            var card = this.cards.shift();
            this.button.innerText = this.cards[0].display;
            return card;
        };
        _this.updateStack = function updateStack() {
            if (this.cards.length > 0) {
                this.button.innerText = this.cards[0].button;
            }
            else {
                this.button.innerText = "[---]"; // THERE IS NO BUTTON TO HIT ON THIS SUIT STACKS
            }
        };
        _this.isValid = function isValid(card) {
            console.log("card(".concat(card.suit, ") == stack(").concat(this.suit, ") = ").concat(card.suit == this.suit));
            console.log("card(".concat(card.number, ") == stack(").concat(this.cards.length, ") = ").concat(card.number == this.cards.length));
            return card.suit == this.suit && card.number == this.cards.length;
        };
        _this.reset = function reset() {
            this.button.innerText = "[---]";
            this.cards = [];
        };
        _this.selectCard = function selectCard(card) {
            console.warn("YOU SHOULD NOT SEE THIS");
        };
        return _this;
    }
    return SuitStack;
}(Stack));
var DrawStack = /** @class */ (function (_super) {
    __extends(DrawStack, _super);
    function DrawStack(container) {
        var _this = _super.call(this, container) || this;
        _this.defaultHTML = "Deck: ";
        _this.button = document.createElement("button");
        _this.container.innerHTML = _this.defaultHTML;
        _this.container.appendChild(_this.button);
        _this.button.innerText = "[---]";
        _this.button.addEventListener("click", function () {
            selectStack(_this);
        });
        _this.isValid = function isValid() {
            console.warn("Cards Cannot be moved into the deck!");
            return false;
        };
        _this.addCard = function addCard() {
            console.warn("Cards Cannot be moved into the deck!");
            return false;
        };
        _this.removeCard = function removeCard() {
            var card = this.cards.shift(); // MIGHT NOT ALWAYS BE NON-NULL
            this.button.innerText = this.cards[0].display;
            return card;
        };
        _this.updateStack = function updateDeck() {
            var topCard = this.cards[0];
            if (topCard != undefined) {
                this.button.innerText = topCard.display;
            }
            else {
                this.button.innerText = "[---]";
            }
        };
        _this.reset = function reset() {
            this.button.innerText = "[---]";
            this.cards = [];
        };
        _this.selectCard = function () {
            console.warn("YOU SHOULD NOT SEE THIS");
        };
        return _this;
    }
    DrawStack.prototype.cycleDeck = function () {
        this.cards.push(this.cards.shift());
        this.button.innerText = this.cards[0].display;
    };
    DrawStack.prototype.dealCards = function () {
        this.cards = [];
        for (var i = 0; i < 52; i++) {
            draw.cards.push(new Card(i, draw));
        }
        draw.cards.sort(function (a) { return 0.5 - Math.random(); });
        for (var i_4 = 0; i_4 < 7; i_4++) {
            for (var j = 0; j < i_4 + 1; j++) {
                var card = draw.cards.shift();
                mains[i_4].addCard(card);
            }
        }
    };
    return DrawStack;
}(Stack));
function updateDisplay() {
    mains.forEach(function (stack) {
        stack.updateStack();
    });
    suits.forEach(function (stack) {
        stack.updateStack();
    });
    draw.updateStack();
}
// DISPLAY
// GAMEPLAY
var selectedStack = undefined;
var cardPosition = undefined;
function moveCard(stackTo, stackFrom, position) { }
function selectStack(stack, position) {
    if (selectedStack == undefined) {
        selectedStack = stack;
        cardPosition = position;
        console.log("BEING SELECTED");
        return;
    }
    else if (stack instanceof DrawStack) {
        if (selectedStack instanceof DrawStack) {
            draw.cycleDeck(); // Remove ! and fix for when draw stack is empty
        }
        else {
            console.warn("Cannot Move Card to Deck!");
        }
    }
    else {
        console.log("CHECKING VALIDITY");
        if (selectedStack.cards.length > 0 &&
            stack.isValid(selectedStack.cards[0])) {
            card = selectedStack.removeCard();
            stack.addCard(card);
            var card = selectedStack.cards.shift();
            stack.cards.unshift(card);
        }
        else {
            if (selectedStack.cards.length < 0)
                console.warn("Invalid Move: No cards in Stack!");
            if (stack.isValid(selectedStack.cards[0]) == false)
                console.warn("Invalid Move: Incorrect Card!");
        } // May present problems
    }
    console.log("BEING UNDEFINED");
    selectedStack = undefined;
    // updateDisplay();
}
function reset() {
    draw.reset();
    mains.forEach(function (stack) {
        stack.reset();
    });
    suits.forEach(function (stack) {
        stack.reset();
    });
}
// GAMEPLAY
// Variables
var draw = new DrawStack(deckStack);
var temp = [];
for (var i = 0; i < 4; i++) {
    var element = suitStacks[i];
    var stack = new SuitStack(element, i);
    temp.push(stack);
}
var suits = temp;
temp = [];
for (var i = 0; i < 7; i++) {
    var element = mainStacks[i];
    temp.push(new MainStack(element, i));
}
var mains = temp;
newGameButton.addEventListener("click", function () {
    reset();
    draw.dealCards();
    updateDisplay();
});
// Variables
