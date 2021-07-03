//declare variables: cards, suits
const x = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["H", "S", "C", "D"];
let counter = 0;
let deck = {};
let arr = [];
let players = ["player", "dealer"];
let blackjack = 1;
let bettingstage = true;
let winner = null;
let doubled = false;
let myhistory = [];

// make a deck / shuffle the deck
var shuffle = function () {
  for (let i = 0; i < 300; i++) {
    var suit = Math.floor(Math.random() * 4);
    var z = x[Math.floor(Math.random() * 13)].concat(suits[suit]);
    if (!Object.values(deck).includes(z)) {
      deck[i] = z;
    }
  }
  arr = Object.values(deck).sort();
};
shuffle();

// window onload
window.onload = function () {
  //listen to buttons
  document.getElementById("hit").addEventListener("click", function () {
    document.getElementById("double").style.color = "grey";
    if (doubled) {
      return;
    } else if (!bettingstage) {
      hit("player");
    }
  });
  document.getElementById("stand").addEventListener("click", function () {
    if (!bettingstage) {
      stand();
    }
  });
  document.getElementById("nexthand").addEventListener("click", function () {
    if (parseInt(document.getElementById("chips").innerHTML) == 0) {
      return;
    }
    // if 2*betsize is more than chips we grey out the double option
    if (
      2 * parseInt(document.getElementById("betsize").innerHTML) >
      parseInt(document.getElementById("chips").innerHTML)
    ) {
      document.getElementById("double").style.color = "grey";
    }
    if (bettingstage) {
      reset();
      playingstagestyle();
      bettingstage = false;
      hit("player");
      hit("player");
      hit("dealer");
      document.getElementById("hit").classList.remove("hidden");
      document.getElementById("stand").classList.remove("hidden");
      document.getElementById("double").classList.remove("hidden");
      document.getElementById("nexthand").classList.remove("hidden");
      document.getElementById("morechips").classList.remove("hidden");
    }
  });
  document
    .getElementById("increase_bet")
    .addEventListener("click", function () {
      if (bettingstage) {
        increasebet();
      }
    });
  document
    .getElementById("decrease_bet")
    .addEventListener("click", function () {
      if (bettingstage) {
        decreasebet();
      }
      if (parseInt(document.getElementById("betsize").innerHTML) < 100) {
        document.getElementById("betsize").innerHTML = "100";
      }
    });
  document.getElementById("morechips").addEventListener("click", function () {
    if (bettingstage) {
      bettingstagestyle();
    }
    if (parseInt(document.getElementById("betsize").innerHTML) < 100) {
      document.getElementById("betsize").innerHTML = "100";
    }
    document.getElementById("chips").innerHTML = (
      parseInt(document.getElementById("chips").innerHTML) + 100
    ).toString();
  });
  document.getElementById("max_bet").addEventListener("click", function () {
    if (bettingstage) {
      maxbet();
    }
  });

  document.getElementById("double").addEventListener("click", function () {
    // if chips is less than 2 times the betsize, return
    if (
      2 * parseInt(document.getElementById("betsize").innerHTML) >
      parseInt(document.getElementById("chips").innerHTML)
    ) {
      return;
    }
    let divs = document.getElementById("player").children;
    let count = 0;
    for (let i in divs) {
      if (divs[i].localName === "img") {
        count++;
      }
    }
    // if only 2 player cards & chips a.l. 2*betsize
    if (count == 2) {
      document.getElementById("betsize").innerHTML = (
        2 * parseInt(document.getElementById("betsize").innerHTML)
      ).toString();
      doubled = true;
      document.getElementById("hit").style.color = "grey";
      document.getElementById("double").style.color = "grey";
      // if you can double, hit then stand.
      hit("player");
      stand();
    }
  });

  function maxbet() {
    document.getElementById("betsize").innerHTML =
      document.getElementById("chips").innerHTML;
  }

  function increasebet() {
    if (
      bettingstage &&
      parseInt(document.getElementById("betsize").innerHTML) <
        parseInt(document.getElementById("chips").innerHTML)
    ) {
      // if betsize + 100 is more than chips then betsize = chips
      if (
        parseInt(document.getElementById("betsize").innerHTML) + 100 >
        parseInt(document.getElementById("chips").innerHTML)
      ) {
        document.getElementById("betsize").innerHTML =
          document.getElementById("chips").innerHTML;
        return;
      }
      document.getElementById("betsize").innerHTML = (
        parseInt(document.getElementById("betsize").innerHTML) + 100
      ).toString();
    }
  }

  function decreasebet() {
    if (
      bettingstage &&
      parseInt(document.getElementById("betsize").innerHTML) > 100
    ) {
      document.getElementById("betsize").innerHTML = (
        parseInt(document.getElementById("betsize").innerHTML) - 100
      ).toString();
    }
  }
};
// hits player or dealer
function hit(who) {
  if (bettingstage) {
    return;
  }
  counter = Math.abs(arr.length - 52);
  var h = arr[Math.floor(Math.random() * arr.length)];
  myhistory.push(`${who} ${h}`);
  arr = arr.filter((e) => e !== h);
  //create object card to append to DOM
  var card = document.createElement("img");
  card.classList.add("playingcard");
  card.id = "card" + counter.toString();
  card.id += ` ${h}`;
  card.src = `cards/${h}.svg`;
  document.getElementById(who).appendChild(card);
  var y = getscoreofcards(who, null);
  // if score is greater than 21 then bust the who
  if (y > 21) {
    document.getElementById(who + "bust").innerHTML = "bust";
    if (who == "player") {
      winner = "dealer";
      endofgame(true);
    } else {
      winner = "player";
      endofgame(true);
    }
    bettingstage = true;
  }
  document.getElementById(`${who}score`).innerHTML = y.toString();
}

// pass cards in (of who) and get score out
function getscoreofcards(who, final) {
  var cards = returnhand(who);
  var total = 0;
  var acecounter = 0;
  for (let i in cards) {
    //convert J, Q, K to 10
    if (cards[i] == "J" || cards[i] == "Q" || cards[i] == "K") {
      cards[i] = 10;
    }
    if (cards[i] != "A") {
      cards[i] = parseInt(cards[i]);
    }
  }
  // if it doesn't contain A -> calc score
  if (!cards.includes("A")) {
    for (let i in cards) {
      total += cards[i];
    }
    return total;
  }
  // if it contains 1 or more Ace.
  //check if who is player, and one ace, and one ten card
  else {
    for (let i in cards) {
      if (cards[i] != "A") {
        total += cards[i];
      }
      if (cards[i] == "A") {
        acecounter++;
      }
    }
    if (acecounter == 1 && cards.length == 1) {
      return 11;
    }
    if (
      acecounter == 1 &&
      total == 10 &&
      cards.length == 2 &&
      who == "player"
    ) {
      blackjack = 1.5;
    }
    // return 11 + total, or all 1s and total
    var a = acecounter + total;
    var b = 10 + total + acecounter;
    // if the higher total is 21 we want to return 21.
    if (b == 21) {
      return 21;
    } else if (b > 21) {
      return a;
    }
    // if it's the dealer's final hand we want to return the highest number available to the dealer.
    if (who == "dealer") {
      return b;
    }
    if (final) {
      return b;
    }
    // if there's more than 1 ace we return the soft Aces
    // + total, as well as the one hard Ace (11) and soft Ace(s), + total.
    return "total is " + a.toString() + " or " + b.toString();
  }
}

//function to return hand of player || dealer
function returnhand(who) {
  var x = document.getElementById(who).children;
  var cards = [];
  for (let i in x) {
    //get the cards first
    if (x[i].localName == "img") {
      cards.push(x[i].id);
    }
  }
  for (let i in cards) {
    // if its 10 remove last letter/ suit
    if (cards[i][cards[i].length - 3] == 1) {
      cards[i] = cards[i].substring(cards[i].length - 3, cards[i].length - 1);
    } else {
      //remove last letter/ suit
      cards[i] = cards[i].substring(cards[i].length - 2, cards[i].length - 1);
    }
  }
  return cards;
}

//dealer's gameplay
function stand() {
  check17();
  setTimeout(function () {
    endofgame(null);
  }, 1500);
}

//dealer hits to 17 using recursive call
function check17() {
  if (getscoreofcards("dealer", null) > 16) {
    return;
  } else {
    hit("dealer");
    setTimeout(function () {
      check17();
    }, 400);
  }
}

//resets game stage style to betting
function bettingstagestyle() {
  document.getElementById("hit").style.color = "grey";
  document.getElementById("stand").style.color = "grey";
  document.getElementById("nexthand").style.color = "black";
  document.getElementById("nexthand").style.fontWeight = "bold";
  document.getElementById("increase_bet").style.color = "black";
  document.getElementById("decrease_bet").style.color = "black";
  document.getElementById("max_bet").style.color = "black";
  document.getElementById("double").style.color = "grey";
}

//sets game stage style to playing
function playingstagestyle() {
  document.getElementById("hit").style.color = "white";
  document.getElementById("stand").style.color = "white";
  document.getElementById("nexthand").style.color = "grey";
  document.getElementById("increase_bet").style.color = "red";
  document.getElementById("decrease_bet").style.color = "red";
  document.getElementById("max_bet").style.color = "red";
  document.getElementById("double").style.color = "white";
  // betsize*2 > chips, double style is grey
  if (
    2 * parseInt(document.getElementById("betsize").innerHTML) >
    parseInt(document.getElementById("chips").innerHTML)
  ) {
    document.getElementById("double").style.color = "grey";
  }
}

//delete all cards and reset variables
function reset() {
  //delete all cards in play (divs)
  var x = document.getElementById("player").children;
  for (let i = 0; i < x.length; i++) {
    if (x[i].localName == "img") {
      var yy = document.getElementById(x[i].id);
      yy.remove();
      i--;
    }
  }
  var a = document.getElementById("dealer").children;
  for (let i = 0; i < a.length; i++) {
    if (a[i].localName == "img") {
      var y = document.getElementById(a[i].id);
      y.remove();
      i--;
    }
  }
  //reset style and elements
  document.getElementById("winner").innerHTML = "";
  document.getElementById("playerbust").innerHTML = "";
  document.getElementById("dealerbust").innerHTML = "";
  playingstagestyle();

  // reset values
  blackjack = 1;
  doubled = false;
}

//check winner
function endofgame(bust) {
  //change style
  bettingstagestyle();
  //make a new deck
  if (arr.length < 10) {
    shuffle();
  }
  //if player busts, and dealer wins
  if (bust && winner == "dealer") {
    losemoney();
  }
  // if dealer busts we check for blackjack
  else if (bust && winner == "player") {
    checkblackjack();
  }
  // if dealer wins and is not bust
  else if (
    getscoreofcards("dealer", null) > getscoreofcards("player", true) &&
    getscoreofcards("dealer", null) < 22
  ) {
    losemoney();
  }
  // if dealer hits to 17 or over but is less than player
  else if (getscoreofcards("dealer", null) < getscoreofcards("player", true)) {
    checkblackjack();
  }
  // if they are tied.
  else if (getscoreofcards("dealer", null) == getscoreofcards("player", true)) {
    document.getElementById("winner").innerHTML = "push - tie";
  }
  // resetting betsize amount if it's lower than the chips the player has
  if (
    parseInt(document.getElementById("betsize").innerHTML) >
    parseInt(document.getElementById("chips").innerHTML)
  ) {
    document.getElementById("betsize").innerHTML =
      document.getElementById("chips").innerHTML;
  }
  bettingstage = true;
}

//dealer wins; player loses
function losemoney() {
  document.getElementById("winner").innerHTML = "dealer wins!";
  document.getElementById("chips").innerHTML = (
    parseInt(document.getElementById("chips").innerHTML) -
    parseInt(document.getElementById("betsize").innerHTML)
  ).toString();
  // betsize is lower of betsize e.g. 300, or default bet 100
  if (parseInt(document.getElementById("chips").innerHTML) < 200) {
    document.getElementById("betsize").innerHTML = "100";
  }
  //set styling if chips are worth 0
  if (parseInt(document.getElementById("chips").innerHTML) <= 0) {
    document.getElementById("nexthand").style.color = "grey";
  }
}

//player wins so check blackjack
function checkblackjack() {
  document.getElementById("winner").innerHTML = "player wins!";
  if (blackjack == 1.5) {
    document.getElementById("winner").innerHTML = "blackjack!";
    document.getElementById("chips").innerHTML = (
      parseInt(document.getElementById("chips").innerHTML) +
      blackjack * parseInt(document.getElementById("betsize").innerHTML)
    ).toString();
  }
  if (blackjack == 1) {
    document.getElementById("chips").innerHTML = (
      parseInt(document.getElementById("chips").innerHTML) +
      parseInt(document.getElementById("betsize").innerHTML)
    ).toString();
  }
  bettingstage = true;
}
