let hands = [];
let current = 0;
let userAnswers = [];

// Kolejność miejsc wokół stołu:
const seatOrder = ['EP','MP','CO','BTN','SB','BB'];

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
  container.innerHTML = '';  // czyścimy cały kontener

  // 1) Pozycje i stacki (EP, MP, CO, BTN, SB, BB)
  const positions = document.createElement('div');
  positions.className = 'positions';
  seatOrder.forEach(pos => {
    const div = document.createElement('div');
    div.className = `pos pos-${pos.toLowerCase()}`;

    if (pos === 'BTN') {
      // dealer‐chip placeholder
      div.innerHTML = `
        <div class="dealer-placeholder"></div>
        <div class="pos-label">BTN</div>
      `;
    } else {
      div.innerHTML = `
        <div class="avatar avatar-${pos.toLowerCase()}"></div>
        <div class="stack">${hand.position[pos]} BB</div>
        <div class="pos-label">${pos}</div>
      `;
    }
    positions.append(div);
  });
  container.append(positions);

  // 2) Bet EP
  const bet = document.createElement('div');
  bet.className = 'bet-ep';
  bet.innerHTML = `
    <div class="bet-label">${hand.betEP} BB</div>
    <div class="chips"></div>
  `;
  container.append(bet);

  // 3) Flop
  const flop = document.createElement('div');
  flop.className = 'flop';
  hand.flop.forEach(c => {
    const card = document.createElement('div');
    card.className = `card rank-${c.slice(0,-1)} suit-${c.slice(-1)}`;
    card.textContent = c;
    flop.append(card);
  });
  container.append(flop);

  // 4) Pot
  const pot = document.createElement('div');
  pot.className = 'pot';
  pot.textContent = `Pot: ${(hand.potBefore + hand.betEP).toFixed(1)} BB`;
  container.append(pot);

  // 5) Hero (BB)
  const hero = document.createElement('div');
  hero.className = 'hero';
  hero.innerHTML = `
    <div class="avatar avatar-hero"></div>
    <div class="stack">${(hand.position.BB - hand.betEP).toFixed(1)} BB</div>
    <div class="pos-label">Hero</div>
  `;
  container.append(hero);

  // 6) Ręka Hero
  const hh = document.createElement('div');
  hh.className = 'hero-hand';
  hand.handHero.forEach(c => {
    const card = document.createElement('div');
    card.className = `card rank-${c.slice(0,-1)} suit-${c.slice(-1)}`;
    card.textContent = c;
    hh.append(card);
  });
  container.append(hh);

  // 7) Przyciski
  const btns = document.createElement('div');
  btns.className = 'buttons';
  btns.innerHTML = `
    <button class="btn-call">CALL</button>
    <button class="btn-fold">FOLD</button>
    <button class="btn-pot">POT</button>
  `;
  container.append(btns);

  // Obsługa odpowiedzi
  btns.querySelector('.btn-call').onclick =  () => handleAnswer('call');
  btns.querySelector('.btn-fold').onclick =  () => handleAnswer('fold');
  btns.querySelector('.btn-pot').onclick  =  () => handleAnswer('pot');
}

function handleAnswer(answer) {
  userAnswers[current] = answer;
  current++;
  if (current < hands.length) {
    renderHand(hands[current]);
  } else {
    showSummary();
  }
}

function showSummary() {
  const container = document.getElementById('table-container');
  container.innerHTML = '';

  const total = hands.length;
  const correctCount = hands.reduce((sum, hand, i) =>
    sum + (userAnswers[i] === hand.correct ? 1 : 0),
  0);

  // Wynik
  const h2 = document.createElement('h2');
  h2.textContent = `Quiz zakończony – wynik: ${correctCount}/${total}`;
  h2.style.color = '#fff';
  container.append(h2);

  // Szczegóły
  const list = document.createElement('ol');
  list.style.color = '#fff';
  list.style.marginTop = '20px';
  hands.forEach((hand, i) => {
    const mark = userAnswers[i] === hand.correct ? '✔' : '✖';
    const item = document.createElement('li');
    item.style.marginBottom = '12px';
    item.innerHTML = `
      <strong>Ręka ${i+1}:</strong> Flop: ${hand.flop.join(' ')}<br>
      Twoja odpowiedź: <em>${userAnswers[i]}</em> ${mark}<br>
      Poprawna odpowiedź: <em>${hand.correct}</em><br>
      <div style="margin-top:6px;color:#ddd;">
        ${hand.explanation}
      </div>
    `;
    list.append(item);
  });
  container.append(list);

  // Restart
  const btn = document.createElement('button');
  btn.textContent = 'Zagraj ponownie';
  btn.onclick = () => {
    current = 0;
    userAnswers = [];
    renderHand(hands[0]);
  };
  btn.style.marginTop = '20px';
  btn.style.padding = '8px 16px';
  btn.style.fontSize = '16px';
  container.append(btn);
}
