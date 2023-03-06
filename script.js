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
//     Moving same stack to an empty stack for the second time leaves all the cards except for first
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
var _Ballsack_instances, _Ballsack_thingy_get;
// HTML elements
var newGameButton = document.querySelector("[data-new-game]");
var mainStacks = document.querySelectorAll("[data-main-stack]");
var suitStacks = document.querySelectorAll("[data-suit-stack]");
var deckStack = document.querySelector("[data-deck]");
var newFromWin = document.querySelector("[data-new-from-win]");
var winScreen = document.querySelector("[data-win-screen]");
// HTML elements
// DISPLAY
var SUITS = ["H", "D", "S", "C"];
var STACK_SUITS = ["HEARTS", "DIAMONDS", "SPADES", "CLUBS"];
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
            this.color = "red";
        }
        else {
            this.color = "black";
        } // 0 = red, 1 = black
        this.stack = stack;
        this.button = document.createElement("button");
        this.button.innerText = this.display;
        this.button.classList.add(this.color);
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
        _this.emptyButton = document.createElement("button");
        _this.numHidden = numHidden;
        _this.emptyButton.innerHTML = "[   ]";
        _this.emptyButton.onclick = function () {
            selectStack(_this);
        };
        _this.emptyButton.classList.add("black");
        _this.addCard = function addCard(card) {
            card.position = this.cards.length;
            this.cards.unshift(card);
            card.stack = this;
        };
        _this.removeCard = function removeCard() {
            var card = this.cards.shift();
            return card;
        };
        _this.updateStack = function updateStack() {
            this.container.innerHTML = "";
            if (this.numHidden != 0) {
                for (var i = 0; i < this.numHidden; i++) {
                    this.container.innerText += "[---] ";
                }
            }
            if (this.cards.length > 0) {
                for (var i = this.cards.length - this.numHidden - 1; i >= 0; i--) {
                    var card = this.cards[i];
                    this.container.appendChild(card.button);
                }
            }
            else {
                this.container.appendChild(this.emptyButton);
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
    return MainStack;
}(Stack));
var SuitStack = /** @class */ (function (_super) {
    __extends(SuitStack, _super);
    function SuitStack(container, suit) {
        var _this = _super.call(this, container) || this;
        _this.suit = suit;
        _this.defaultHTML = "".concat(STACK_SUITS[_this.suit], "<br>");
        _this.container.innerHTML = _this.defaultHTML + "[   ]";
        if (_this.suit == 0 || _this.suit == 1) {
            _this.container.classList.add("red");
        }
        else {
            _this.container.classList.add("black");
        }
        _this.container.addEventListener("click", function () {
            selectStack(_this);
        });
        _this.addCard = function addCard(card) {
            this.cards.unshift(card);
            this.container.innerHTML = this.defaultHTML + card.display;
            card.stack = this;
        };
        _this.removeCard = function removeCard() {
            var card = this.cards.shift();
            return card;
        };
        _this.updateStack = function updateStack() {
            this.container.innerHTML = this.defaultHTML;
            if (this.cards.length > 0) {
                this.container.innerHTML += this.cards[0].display;
            }
            else {
                this.container.innerHTML += "[   ]";
            }
        };
        _this.isValid = function isValid(card) {
            return card.suit == this.suit && card.number == this.cards.length;
        };
        _this.reset = function reset() {
            this.container.innerHTML = this.defaultHTML + "[   ]";
            this.cards = [];
        };
        _this.selectCard = function () {
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
        _this.defaultHTML = "Deck<br>";
        _this.container.innerHTML = _this.defaultHTML + "[   ]";
        _this.container.addEventListener("click", function () {
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
            var card = this.cards.shift();
            return card;
        };
        _this.updateStack = function updateStack() {
            this.container.innerHTML = this.defaultHTML;
            if (this.cards.length > 0) {
                this.container.innerHTML += this.cards[0].display;
            }
            else {
                this.container.innerHTML += "[   ]";
                if (this.currentColor == "red") {
                    this.container.classList.remove("red");
                    this.currentColor = "black";
                }
            }
        };
        _this.reset = function reset() {
            this.container.innerHTML = "";
            this.cards = [];
        };
        _this.selectCard = function () {
            console.warn("YOU SHOULD NOT SEE THIS");
        };
        return _this;
    }
    DrawStack.prototype.cycleDeck = function () {
        this.cards.push(this.cards.shift());
        this.updateStack();
    };
    DrawStack.prototype.dealCards = function () {
        this.cards = [];
        for (var i = 0; i < 52; i++) {
            draw.cards.push(new Card(i, draw));
        }
        draw.cards.sort(function (a) { return 0.5 - Math.random(); });
        for (var i_1 = 0; i_1 < 7; i_1++) {
            for (var j = 0; j < i_1 + 1; j++) {
                var card = draw.cards.shift();
                mains[i_1].addCard(card);
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
function showWinScreen() {
    winScreen.style.display = "flex";
}
function hideWinScreen() {
    winScreen.style.display = "none";
}
// DISPLAY
// GAMEPLAY
var selectedStack = undefined;
var cardPosition = undefined;
function moveCard(stackTo, stackFrom, index) {
    var cards = [];
    for (var i_2 = 0; i_2 <= index; i_2++) {
        cards.unshift(stackFrom.removeCard());
    }
    cards.forEach(function (card) {
        stackTo.addCard(card);
    });
    if (stackFrom instanceof MainStack &&
        stackFrom.numHidden != 0 &&
        stackFrom.cards.length == stackFrom.numHidden) {
        stackFrom.numHidden -= 1;
    }
}
function selectStack(stack, position) {
    if (position === void 0) { position = stack.cards.length - 1; }
    if (selectedStack == undefined) {
        if (stack.cards.length > 0) {
            selectedStack = stack;
            selectedStack.container.classList.add("selected");
            cardPosition = position;
        }
        else {
            console.warn("CANNOT MOVE CARD FROM EMPTY STACK");
        }
        return;
    }
    else if (stack instanceof DrawStack) {
        if (selectedStack instanceof DrawStack) {
            draw.cycleDeck();
        }
        else {
            console.warn("Cannot Move Card to Deck!");
        }
    }
    else if (stack.cards.length == 0 && stack instanceof MainStack) {
        var index = selectedStack.cards.length - cardPosition - 1;
        moveCard(stack, selectedStack, index);
    }
    else if (selectedStack != stack) {
        var index = selectedStack.cards.length - cardPosition - 1;
        if (selectedStack.cards.length > 0 &&
            stack.isValid(selectedStack.cards[index])) {
            moveCard(stack, selectedStack, index);
        }
        else {
            if (selectedStack.cards.length < 0)
                console.warn("Invalid Move: No cards in Stack!");
            if (stack.isValid(selectedStack.cards[index]))
                console.warn("Invalid Move: Incorrect Card!");
        }
    }
    selectedStack.container.classList.remove("selected");
    selectedStack = undefined;
    updateDisplay();
    if (isWon())
        showWinScreen();
}
function reset() {
    draw.reset();
    mains.forEach(function (stack) {
        stack.reset();
    });
    suits.forEach(function (stack) {
        stack.reset();
    });
    if (selectedStack != undefined) {
        selectedStack.container.classList.remove("selected");
        selectedStack = undefined;
    }
    for (var i_3 = 0; i_3 < 7; i_3++) {
        mains[i_3].numHidden = i_3;
    }
}
function isWon() {
    var topSuits = suits.map(function (suitstack) { return suitstack.cards[0]; });
    if (topSuits.every(function (card) { return card != undefined; })) {
        var nums = topSuits.map(function (card) { return card.number; });
        if (nums.every(function (num) { return num == 12; }))
            return true;
    }
    return false;
}
function newGame() {
    reset();
    draw.dealCards();
    updateDisplay();
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
    newGame();
});
newFromWin.onclick = function () {
    hideWinScreen();
    newGame();
};
// Variables
// Dev Tools
function setWin() {
    for (var i_4 = 0; i_4 < 4; i_4++) {
        for (var j = 0; j < 13; j++) {
            var stack = suits[i_4];
            stack.cards.unshift(new Card(j + i_4 * 13, stack));
        }
    }
    updateDisplay();
}
function setAmostWin() {
    setWin();
    var card = suits[0].removeCard();
    mains[0].addCard(card);
    updateDisplay();
}
// Dev Tools
//testing
var Ballsack = /** @class */ (function () {
    function Ballsack(thingy) {
        _Ballsack_instances.add(this);
        this.thing = thingy;
    }
    return Ballsack;
}());
_Ballsack_instances = new WeakSet(), _Ballsack_thingy_get = function _Ballsack_thingy_get() {
    return this.thing;
};
var simple = new Ballsack(12);
//testing
