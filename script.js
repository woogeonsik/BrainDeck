const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const allCardImages = [];
let deck = [];
let openedIndex = 0;
let cardsFlipped = false;

let timerInterval = null;
let startTime = 0;

// 선로딩 함수 (페이지 로드 시 호출)
function preloadCardImages() {
  for (let s of suits) {
    for (let r of ranks) {
      const suitCode = { '♠': 'S', '♥': 'H', '♦': 'D', '♣': 'C' }[s];
      const fileName = `${r}${suitCode}.png`;
      const img = new Image();
      img.src = `cards/${fileName}`;
      allCardImages.push(img);
    }
  }
  // 조커 2장도 미리 로드
  ['JK1.png', 'JK2.png'].forEach(jokerFile => {
    const img = new Image();
    img.src = `cards/${jokerFile}`;
    allCardImages.push(img);
  });
  // 카드 뒷면도 미리 로드
  const backImg = new Image();
  backImg.src = 'cards/back.png';
  allCardImages.push(backImg);
}

// 페이지 로드 시 선로딩 시작
window.addEventListener('load', preloadCardImages);



function createDeck() {
  deck = [];
  for (let s of suits) {
    for (let r of ranks) {
      deck.push({ suit: s, rank: r });
    }
  }
  // 조커 2장 추가
  deck.push({ suit: 'Joker', rank: 'JK1' });
  deck.push({ suit: 'Joker', rank: 'JK2' });
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
    cardDiv.dataset.index = idx;

    if (!faceUp) {
      // 뒷면 이미지
      const img = document.createElement('img');
      img.src = `cards/back.png`;
      img.alt = 'Back';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      cardDiv.appendChild(img);
      cardDiv.classList.add('back');
    } else {
      const img = document.createElement('img');
      let fileName = '';

      if (card.suit === 'Joker') {
        fileName = `${card.rank}.png`; // JK1.png, JK2.png
      } else {
        const suitCode = { '♠': 'S', '♥': 'H', '♦': 'D', '♣': 'C' }[card.suit];
        fileName = `${card.rank}${suitCode}.png`;
      }

      img.src = `cards/${fileName}`;
      img.alt = `${card.rank}${card.suit}`;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      cardDiv.appendChild(img);
    }

    container.appendChild(cardDiv);
  });
}


function startTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
  }
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
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
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
    cardDiv.innerHTML = '';

    const img = document.createElement('img');
    let fileName = '';

    if (card.suit === 'Joker') {
      fileName = `${card.rank}.png`; // JK1.png, JK2.png
    } else {
      const suitCode = { '♠': 'S', '♥': 'H', '♦': 'D', '♣': 'C' }[card.suit];
      fileName = `${card.rank}${suitCode}.png`;
    }

    img.src = `cards/${fileName}`;
    img.alt = `${card.rank}${card.suit}`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    cardDiv.appendChild(img);

    openedIndex++;
  } else {
    alert("모든 카드를 다 열었어요!");
  }
};

