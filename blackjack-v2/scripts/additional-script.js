class Game {
  constructor(){
    this.bettingstage = false
  }
}
let game = new Game()

class Card {
  constructor(card, suit) {
    this.card = card;
    this.suit = suit;
    this.src = `./cards/${this.card}${this.suit}.svg`;

    //this.value
    if (card == "J" || card == "Q" || card == "K") {
      this.value = 10;
    } else if (card == "A") {
      this.value = card;
    } else {
      this.value = parseInt(card);
    }
  }
}

// make a deck
function newdeck(nDeck, numberOfDecks = 1) {
  for (let h = 0; h < numberOfDecks; h++) {
    for (let i in cards) {
      for (let j in suits) {
        let card = new Card(`${cards[i]}`, `${suits[j]}`);
        nDeck.push(card);
      }
    }
  }
  return nDeck;
}

//shuffle a deck
function shuffle(arr) {
  let newArr = [];
  let count = 0;
  while (newArr.length < arr.length) {
    let sCard = arr[Math.floor(Math.random() * arr.length)];
    for (let i in newArr) {
      if (newArr[i] == sCard) {
        count++;
      }
    }
    if (count < arr.length / 52) {
      newArr.push(sCard);
    }
    count = 0;
  }
  return newArr;
}
deck = newdeck(deck, 2);
deck = shuffle(deck);
console.log(deck, deck.length);
