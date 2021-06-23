//declare variables: cards, suits
const x = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["H", "S", "C", "D"];
var deck = [],
  deck2 = [],
  deck3 = [],
  deck4 = [];
let myhistory = [];
let bettingstage = true;
let winner = false;
let blackjack = 1;

// make a deck
var shuffle = function (object) {
  for (let i = 0; i < 400; i++) {
    var suit = Math.floor(Math.random() * 4);
    var z = x[Math.floor(Math.random() * 13)].concat(suits[suit]);
    if (!object.includes(z)) {
      object.push(z);
    }
  }
};
shuffle(deck);
shuffle(deck2);
shuffle(deck3);
shuffle(deck4);
deck = deck.concat(deck2).concat(deck3).concat(deck4);

document.getElementById("hit").addEventListener("click", function () {
  if (bettingstage && winner == true) {
    return;
  }
  if (bettingstage) {
    hit("playerhand");
    hit("playerhand");
    hit("dealerhand");
    bettingstage = false;
  } else {
    hit("playerhand");
  }
});

document.getElementById("stand").addEventListener("click", function () {
  if (bettingstage) {
    return;
  }
  gamestagestyle();
  recursive("dealerhand");
});

document.getElementById("reset").addEventListener("click", function () {
  if (!bettingstage) {
    return
  }
  reset();
});

function recursive(who) {
  let scores4 = checkscore("dealerscore");
  if (scores4 > 16) {
    callwinner();
    return;
  } else {
    setTimeout(function () {
      hit("dealerhand");
      recursive();
    }, 600);
  }
}

function checkscore(who) {
  let scores3 = document.getElementById(who).innerHTML;
  let patt1 = /[0-9]/g;
  scores3 = scores3.match(patt1).join("");
  //in the Ace event, we take last two numbers
  if (scores3.length > 2) {
    scores3 = scores3.slice(-2);
  }
  console.log(scores3);
  return scores3;
}

function hit(who) {
  addImage(who);
  calculatescore(who);
}

function addImage(who) {
  //pick a random card from deck
  let card = deck[Math.floor(Math.random() * deck.length)];
  deck.splice(deck.findIndex(x => x == card), 1)
  //create object card to append to DOM
  var card2 = document.createElement("img");
  card2.classList.add("card");
  card2.id += `${card}`;
  card2.src = `cards/${card}.svg`;
  document.getElementById(who).appendChild(card2);
}

function calculatescore(who) {
  // use spread operator and map
  let aceCounter = 0;
  let scores = [...document.getElementById(who).children].map((x) =>
    x.id.slice(0, -1)
  );
  let scores2 = 0;
  for (let i in scores) {
    if (scores[i] == "J" || scores[i] == "Q" || scores[i] == "K") {
      scores[i] = 10;
    } else if (scores[i] == "A") {
      scores[i] = 0;
      aceCounter++;
    }
  }
  scores2 = scores.reduce(function (x, y) {
    return parseInt(x) + parseInt(y);
  });
  if (who == "playerhand") {
    who = "playerscore";
  } else {
    who = "dealerscore";
  }
  // return higher of Ace counter and score or 10 plus ace counter plus score, under 21
  let lower = aceCounter + parseInt(scores2);
  let higher = 10 + aceCounter + parseInt(scores2);

  if (aceCounter > 0 && who == 'dealerscore') {
    scores2 = higher;
  }

  if (aceCounter > 0 && who == 'playerscore') {
    //check for blackjack
    if (aceCounter == 1 && higher == 21 && document.getElementById('playerhand').children.length == 2) {
      blackjack = 1.5;
    }
    console.log(aceCounter, lower, higher, blackjack);
    if (lower < 22) {
      scores2 = lower;
    }
    if (higher < 22 && higher > lower) {
      scores2 = higher;
    }

    //bust situation
    if (higher > 21 && lower > 21) {
      scores2 = lower
    }
  }
  document.getElementById(who).innerHTML = scores2;
  if (aceCounter > 0 && higher < 21) {
    document.getElementById(who).innerHTML = `${lower} or ${higher}`;
  }
  if (scores2 > 21) {
    document.getElementById(who).innerHTML += " bust";
    callwinner(true, who);
  }
}

function callwinner(bust, who) {
  //make sure we only call this function once
  if (winner) {
    return;
  }
  winner = true;
  bettingstage = true;
  //if bust disallow hit
  if (bust && who == "playerscore") {
    console.log("dealer wins");
    dealerwins();
    return;
  } else if (bust && who == "dealerscore") {
    console.log("player wins");
    playerwins();
    return;
  }
  if (checkscore("playerscore") > checkscore("dealerscore")) {
    console.log("player wins");
    playerwins();
  } else if (checkscore("playerscore") < checkscore("dealerscore")) {
    console.log("dealer wins");
    dealerwins();
  } else if (checkscore("playerscore") == checkscore("dealerscore")) {
    console.log("tie");
  }
}

function dealerwins() {
  let dealer = document.getElementById("chips").innerHTML;
  dealer = parseInt(dealer.substring(dealer.indexOf(":") + 1)) - 100;
  console.log(dealer);
  document.getElementById("chips").innerHTML = `chips: ${dealer}`;

  //save history
  myhistory.push(`D wins with ${checkscore("dealerscore")}`);
}

function playerwins() {
  let player = document.getElementById("chips").innerHTML;
  player =
    parseInt(player.substring(player.indexOf(":") + 1)) + 100 * blackjack;
  console.log(player);
  document.getElementById("chips").innerHTML = `chips: ${player}`;

  //save history
  myhistory.push(`P wins with ${checkscore("playerscore")}`);
}

function reset() {
  var xx = document.getElementById("dealerhand");
  console.log(xx);
  while (xx.firstChild) {
    xx.removeChild(xx.lastChild);
  }
  var yy = document.getElementById("playerhand");
  console.log(yy);
  while (yy.firstChild) {
    yy.removeChild(yy.lastChild);
  }
  // let's reset all the game variables here
  document.getElementById("dealerscore").innerHTML = 0;
  document.getElementById("playerscore").innerHTML = 0;
  disallowstand = true;
  winner = false;
  blackjack = 1;
}

//styling functions
function gamestagestyle() {
  // in game stage the player cannot hit
  document.getElementById("hit").style.border = "1px solid red";
}