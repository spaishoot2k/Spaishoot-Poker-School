document.addEventListener('DOMContentLoaded', async () => {
  const resp = await fetch('quizzes/plo-5card/data.json');
  if (!resp.ok) {
    document.getElementById('table-container').textContent = 'Błąd ładowania danych.';
    return;
  }
  const hands = await resp.json();
  renderHand(hands[0]);
});

function renderHand(hand) {
  const container = document.getElementById('table-container');
  container.innerHTML = '';             // wyczyść placeholder
  container.style.background = '#163248'; // kolor stołu

  // pozycje i stacki
  const positions = document.createElement('div');
  positions.className = 'positions';
  for (let pos of ['EP','MP','CO','SB','BB']) {
    const p = document.createElement('div');
    p.className = `pos pos-${pos.toLowerCase()}`;
    p.innerHTML = `<div class="avatar avatar-${pos.toLowerCase()}"></div>
                   <div class="stack">${hand.position[pos]} BB</div>
                   <div class="pos-label">${pos}</div>`;
    positions.append(p);
  }
  container.append(positions);

  // bet EP
  const bet = document.createElement('div');
  bet.className = 'bet-ep';
  bet.innerHTML = `<div class="chips"></div>
                   <div class="bet-label">${hand.betEP} BB</div>`;
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

  // Hero (zawsze na dole)
  const hero = document.createElement('div');
  hero.className = 'hero';
  hero.innerHTML = `<div class="avatar avatar-hero"></div>
                    <div class="stack">${hand.position.BB - hand.betEP} BB</div>
                    <div class="pos-label">Hero</div>`;
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
  btns.innerHTML = `<button class="btn-call">CALL</button>
                    <button class="btn-fold">FOLD</button>`;
  container.append(btns);
}
