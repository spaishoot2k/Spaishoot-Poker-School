document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('table-container');

  // załaduj dane
  const resp = await fetch('quizzes/plo-5card/data.json');
  if (!resp.ok) {
    container.textContent = 'Błąd ładowania danych.';
    return;
  }
  const hands = await resp.json();
  renderHand(hands[0]);
});

function renderHand(hand) {
  const container = document.getElementById('table-container');
  container.innerHTML = '';
  container.style.background = '#163248';

  // pozycje
  const positions = document.createElement('div');
  positions.className = 'positions';
  for (let pos of ['EP','MP','CO','SB','BB']) {
    const div = document.createElement('div');
    div.className = `pos pos-${pos.toLowerCase()}`;
    div.innerHTML = `
      <div class="avatar avatar-${pos.toLowerCase()}"></div>
      <div class="stack">${hand.position[pos]} BB</div>
      <div class="pos-label">${pos}</div>
    `;
    positions.append(div);
  }
  container.append(positions);

  // bet EP
  const bet = document.createElement('div');
  bet.className = 'bet-ep';
  bet.innerHTML = `
    <div class="chips"></div>
    <div class="bet-label">${hand.betEP} BB</div>
  `;
  container.append(bet);

  // flop
  const flop = document.createElement('div');
  flop.className = 'flop';
  hand.flop.forEach(c => {
    const card = document.createElement('div');
    card.className = `card rank-${c.slice(0,-1)} suit-${c.slice(-1)}`;
    card.textContent = c;
    flop.append(card);
  });
  container.append(flop);

  // pot
  const pot = document.createElement('div');
  pot.className = 'pot';
  pot.textContent = `Pot: ${(hand.potBefore + hand.betEP).toFixed(1)} BB`;
  container.append(pot);

  // hero
  const hero = document.createElement('div');
  hero.className = 'hero';
  hero.innerHTML = `
    <div class="avatar avatar-hero"></div>
    <div class="stack">${hand.position.BB - hand.betEP} BB</div>
    <div class="pos-label">Hero</div>
  `;
  container.append(hero);

  // hero hand
  const hh = document.createElement('div');
  hh.className = 'hero-hand';
  hand.handHero.forEach(c => {
    const card = document.createElement('div');
    card.className = `card rank-${c.slice(0,-1)} suit-${c.slice(-1)}`;
    card.textContent = c;
    hh.append(card);
  });
  container.append(hh);

  // buttons
  const btns = document.createElement('div');
  btns.className = 'buttons';
  btns.innerHTML = `
    <button class="btn-call">CALL</button>
    <button class="btn-fold">FOLD</button>
  `;
  container.append(btns);
}
let hands = [];
let current = 0;
let score = 0;

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('table-container');
  const resp = await fetch('quizzes/plo-5card/data.json');
  if (!resp.ok) {
    container.textContent = 'Błąd ładowania danych.';
    return;
  }
  hands = await resp.json();
  renderHand(hands[current]);
});

function renderHand(hand) {
  const container = document.getElementById('table-container');
  container.innerHTML = '';             
  container.style.background = '#163248';

  // -- Pozycje i stacki
  const positions = document.createElement('div');
  positions.className = 'positions';
  for (let pos of ['EP','MP','CO','SB','BB']) {
    const div = document.createElement('div');
    div.className = `pos pos-${pos.toLowerCase()}`;
    div.innerHTML = `
      <div class="avatar avatar-${pos.toLowerCase()}"></div>
      <div class="stack">${hand.position[pos]} BB</div>
      <div class="pos-label">${pos}</div>
    `;
    positions.append(div);
  }
  container.append(positions);

  // -- Bet EP
  const bet = document.createElement('div');
  bet.className = 'bet-ep';
  bet.innerHTML = `
    <div class="chips"></div>
    <div class="bet-label">${hand.betEP} BB</div>
  `;
  container.append(bet);

  // -- Flop
  const flop = document.createElement('div');
  flop.className = 'flop';
  hand.flop.forEach(c => {
    const card = document.createElement('div');
    card.className = `card rank-${c.slice(0,-1)} suit-${c.slice(-1)}`;
    card.textContent = c;
    flop.append(card);
  });
  container.append(flop);

  // -- Pot
  const pot = document.createElement('div');
  pot.className = 'pot';
  pot.textContent = `Pot: ${(hand.potBefore + hand.betEP).toFixed(1)} BB`;
  container.append(pot);

  // -- Hero
  const hero = document.createElement('div');
  hero.className = 'hero';
  hero.innerHTML = `
    <div class="avatar avatar-hero"></div>
    <div class="stack">${(hand.position.BB - hand.betEP).toFixed(1)} BB</div>
    <div class="pos-label">Hero</div>
  `;
  container.append(hero);

  // -- Hero hand
  const hh = document.createElement('div');
  hh.className = 'hero-hand';
  hand.handHero.forEach(c => {
    const card = document.createElement('div');
    card.className = `card rank-${c.slice(0,-1)} suit-${c.slice(-1)}`;
    card.textContent = c;
    hh.append(card);
  });
  container.append(hh);

  // -- Przyciski
  const btns = document.createElement('div');
  btns.className = 'buttons';
  btns.innerHTML = `
    <button class="btn-call">CALL</button>
    <button class="btn-fold">FOLD</button>
  `;
  container.append(btns);

  // Podłączamy kliknięcia
  container.querySelector('.btn-call').onclick  = () => handleAnswer('call');
  container.querySelector('.btn-fold').onclick = () => handleAnswer('fold');
}

function handleAnswer(answer) {
  const hand = hands[current];
  const correct = hand.correct;       // "call" lub "fold"
  const isRight = answer === correct;
  if (isRight) score++;

  // Pokaż overlay z wyjaśnieniem
  showFeedback(isRight, hand.explanation);
}

function showFeedback(isRight, explanation) {
  // prosty overlay
  const overlay = document.createElement('div');
  overlay.className = 'feedback';
  overlay.innerHTML = `
    <div class="feedback-content">
      <p class="result ${isRight?'right':'wrong'}">
        ${isRight? '✔ Poprawnie!' : '✖ Błąd.'}
      </p>
      <p class="explanation">${explanation}</p>
      <button id="next-btn">Dalej</button>
    </div>
  `;
  document.body.append(overlay);

  document.getElementById('next-btn').onclick = () => {
    document.body.removeChild(overlay);
    current++;
    if (current < hands.length) {
      renderHand(hands[current]);
    } else {
      showSummary();
    }
  };
}

function showSummary() {
  const container = document.getElementById('table-container');
  container.innerHTML = `
    <div class="summary">
      <h2>Quiz zakończony</h2>
      <p>Twój wynik: ${score}/${hands.length}</p>
      <button id="restart-btn">Powtórz</button>
    </div>
  `;
  document.getElementById('restart-btn').onclick = () => {
    score = 0; current = 0;
    renderHand(hands[0]);
  };
}
