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
        this.isRevealed = false;
        this.suit = Math.floor(position / 13);
        this.number = position % 13;
        this.display = this.displayCard();
        this.isRevealed = false;
        if (this.suit == 0 || this.suit == 1) {
            this.color = 0;
        }
        else {
            this.color = 1;
        } // 0 = red, 1 = black
        this.button = document.createElement("BUTTON");
        var text = document.createTextNode(this.display);
        this.button.appendChild(text);
        this.button.addEventListener("click", function () {
            _this.selectCard();
        });
        this.stack = stack;
    }
    Card.prototype.selectCard = function () { };
    Card.prototype.displayCard = function () {
        if (CARDS[this.number] != undefined) {
            return "".concat(CARDS[this.number], "-").concat(SUITS[this.suit]);
        }
        else {
            return "".concat(this.number + 1, "-").concat(SUITS[this.suit]);
        }
    };
    Card.prototype.revealCard = function () {
        this.isRevealed = true;
        this.button.innerHTML = "";
        var text = document.createTextNode(this.display);
        this.button.appendChild(text);
    };
    Card.prototype.hideCard = function () {
        this.isRevealed = false;
        this.button.innerHTML = "";
        var text = document.createTextNode("[---]");
        this.button.appendChild(text);
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
    function MainStack(container) {
        var _this = _super.call(this, container) || this;
        _this.addCard = function addCard(card) {
            this.container.appendChild(card.button);
            this.cards.unshift(card);
        };
        _this.removeCard = function removeCard(position) {
            if (position == undefined) {
                position = 1;
            }
            this.container.removeChild(this.container.lastChild);
            var removedCards = [];
            for (var i_1 = 0; i_1 < position; i_1++) {
                removedCards.unshift(this.cards.shift());
            }
            if (this.cards[0].isRevealed == false) {
                this.cards[0].revealCard();
            }
            return removedCards;
        };
        _this.updateStack = function updateStack() {
            this.container.innerHTML = "";
            var card;
            for (var i_2 = this.cards.length - 1; i_2 >= 0; i_2--) {
                card = this.cards[i_2];
                this.container.appendChild(card.button);
            }
        };
        _this.isValid = function isValid(card) {
            return (card.color != this.cards[0].color &&
                card.number == this.cards[0].number - 1);
        };
        return _this;
    }
    return MainStack;
}(Stack));
var SuitStack = /** @class */ (function (_super) {
    __extends(SuitStack, _super);
    function SuitStack(container, suit) {
        var _this = _super.call(this, container) || this;
        _this.suit = suit;
        _this.defaultHTML = "".concat(SUITS[_this.suit], ": ");
        _this.addCard = function addCard(card) {
            this.container.innerHTML = this.defaultHTML;
            this.container.appendChild(card.button);
            this.cards.unshift(card);
        };
        _this.removeCard = function removeCard() {
            this.container.innerHTML = this.defaultHTML;
            var card = this.cards.shift();
            this.container.appendChild(this.cards[0].button);
            return card;
        };
        _this.updateStack = function updateStack() {
            this.container.innerHTML = this.defaultHTML;
            if (this.cards.length > 0) {
                this.container.appendChild(this.cards[0].button);
            }
            else {
                this.container.appendChild(document.createTextNode("[---]"));
            }
        };
        _this.isValid = function isValid(card) {
            return card.suit == this.suit && card.number == this.cards.length;
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
        _this.addCard = function isValid() {
            console.warn("Cards Cannot be moved into the deck!");
            return false;
        };
        _this.removeCard = function removeCard() {
            this.container.innerHTML = this.defaultHTML;
            this.container.appendChild(this.cards[0].button);
            return this.cards.shift();
        };
        _this.updateStack = function updateDeck() {
            this.container.innerHTML = this.defaultHTML;
            var topCard = this.cards[0];
            if (topCard != undefined) {
                this.container.appendChild(topCard.button);
            }
            else {
                this.container.appendChild(document.createTextNode("[---]"));
            }
        };
        return _this;
    }
    DrawStack.prototype.cycleDeck = function () {
        this.container.removeChild(this.container.firstChild);
        this.cards.push(this.cards.shift());
        this.container.appendChild(this.cards[0].button);
    };
    DrawStack.prototype.dealCards = function () {
        this.cards = [];
        for (var i = 0; i < 52; i++) {
            draw.cards.push(new Card(i, draw));
        }
        draw.cards.sort(function (a) { return 0.5 - Math.random(); });
        for (var i_3 = 0; i_3 < 7; i_3++) {
            for (var j = 0; j < i_3 + 1; j++) {
                var card = draw.cards.shift();
                mains[i_3].addCard(card);
            }
        }
        mains.forEach(function (stack) {
            stack.cards[0].isRevealed = true;
        });
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
function selectStack(stack, position) {
    if (selectedStack == undefined) {
        selectedStack = stack;
        if (position == undefined) {
            cardPosition = undefined;
        }
        else {
            cardPosition = position;
        }
        console.log("BEING SELECTED");
        return;
    }
    else if (typeof stack == typeof deckStack) {
        if (typeof selectedStack == typeof deckStack) {
            draw.cycleDeck(); // Remove ! and fix for when draw stack is empty
        }
        else {
            console.warn("Cannot Move Card to Deck!");
        }
    }
    else {
        console.log("CHECKING VALIDITY");
        if (stack.isValid(stack) && selectedStack.cards.length > 0) {
            stack.addCard(selectedStack.removeCard());
            var card = selectedStack.cards.shift();
            card.isRevealed = true;
            stack.cards.unshift(card);
            var toReveal = selectedStack.cards[0];
            if (toReveal != undefined) {
                toReveal.isRevealed = true;
            }
        }
        else {
            console.warn("Invalid Move (1)");
        }
    }
    console.log("BEING UNDEFINED");
    selectedStack = undefined;
    // updateDisplay();
}
function reset() {
    draw.container.innerHTML = draw.defaultHTML;
    mains.forEach(function (stack) {
        while (stack.container.firstChild != null) {
            stack.container.removeChild(stack.container.firstChild);
        }
        stack.cards = [];
    });
    suits.forEach(function (stack) {
        if (stack.container.firstChild != null) {
            stack.container.removeChild(stack.container.firstChild);
            stack.cards = [];
        }
    });
    draw.dealCards();
    updateDisplay();
}
// GAMEPLAY
// Variables
var draw = new DrawStack(deckStack);
var temp = [];
for (var i = 0; i < 4; i++) {
    var element = suitStacks[i];
    temp.push(new SuitStack(element, i));
}
var suits = temp;
temp = [];
for (var i = 0; i < 7; i++) {
    var element = mainStacks[i];
    temp.push(new MainStack(element));
}
var mains = temp;
newGameButton.addEventListener("click", function () {
    reset();
    updateDisplay();
});
// Variables
