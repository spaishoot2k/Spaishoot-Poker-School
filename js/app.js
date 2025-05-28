document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('table-container');
  
  // 1) Załaduj dane
  const resp = await fetch('quizzes/plo-5card/data.json');
  if (!resp.ok) {
    container.textContent = 'Błąd ładowania danych.';
    return;
  }
  const hands = await resp.json();
  
  // 2) Render pierwszej ręki
  renderHand(hands[0]);
});

function renderHand(hand) {
  const container = document.getElementById('table-container');
  container.innerHTML = '';                     // wyczyść placeholder
  container.style.background = '#163248';       // kolor stołu

  // === Pozycje i stacki ===
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

  // === Bet EP ===
  const bet = document.createElement('div');
  bet.className = 'bet-ep';
  bet.innerHTML = `
    <div class="chips"></div>
    <div class="bet-label">${hand.betEP} BB</div>
  `;
  container.append(bet);

  // === Flop ===
  const flop = document.createElement('div');
  flop.className = 'flop';
  hand.flop.forEach(c => {
    const card = document.createElement('div');
    card.className = `card rank-${c.slice(0,-1)} suit-${c.slice(-1)}`;
    card.textContent = c;
    flop.append(card);
  });
  container.append(flop);

  // === Pot ===
  const pot = document.createElement('div');
  pot.className = 'pot';
  pot.textContent = `Pot: ${(hand.potBefore + hand.betEP).toFixed(1)}
