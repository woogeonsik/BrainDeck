const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

let deck = [];
let openedIndex = 0;
let cardsFlipped = false;

let timerInterval = null;
let startTime = 0;

function createDeck() {
  deck = [];
  for (let s of suits) {
    for (let r of ranks) {
      deck.push({suit: s, rank: r});
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function renderCards(faceUp = true) {
  const container = document.getElementById('card-container');
  container.innerHTML = '';
  deck.forEach((card, idx) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.classList.toggle('back', !faceUp);
    cardDiv.dataset.index = idx;

    // 🟥 색상 지정 (♥, ♦: 빨간색 / ♠, ♣: 검정색)
    if (card.suit === '♥' || card.suit === '♦') {
      cardDiv.style.color = 'red';
    } else {
      cardDiv.style.color = 'black';
    }

    cardDiv.textContent = faceUp ? `${card.rank}${card.suit}` : '';
    container.appendChild(cardDiv);
  });
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const sec = Math.floor(elapsed / 1000);
    const min = Math.floor(sec / 60);
    document.getElementById('timer').textContent =
      `${String(min).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

document.getElementById('startBtn').onclick = () => {
  createDeck();
  shuffleDeck();
  renderCards(true);
  openedIndex = 0;
  cardsFlipped = false;

  document.getElementById('doneBtn').disabled = false;
  document.getElementById('openBtn').disabled = true;

  startTimer();
};

document.getElementById('doneBtn').onclick = () => {
  cardsFlipped = true;
  renderCards(false);
  openedIndex = 0;

  document.getElementById('doneBtn').disabled = true;
  document.getElementById('openBtn').disabled = false;

  stopTimer(); // 타이머 멈추는 함수 호출
};

document.getElementById('openBtn').onclick = () => {
  if (!cardsFlipped) return;

  if (openedIndex < deck.length) {
    const container = document.getElementById('card-container');
    const card = deck[openedIndex];
    const cardDiv = container.querySelector(`div[data-index="${openedIndex}"]`);
    cardDiv.classList.remove('back');
    cardDiv.textContent = `${card.rank}${card.suit}`;

    // 🟥 색상 지정
    if (card.suit === '♥' || card.suit === '♦') {
      cardDiv.style.color = 'red';
    } else {
      cardDiv.style.color = 'black';
    }

    openedIndex++;
  } else {
    alert("모든 카드를 다 열었어요!");
  }
};

