// Definicja kart
const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

function getSuitClass(card) {
    if (card.includes('♠')) return 'spades';
    if (card.includes('♥')) return 'hearts';
    if (card.includes('♦')) return 'diamonds';
    if (card.includes('♣')) return 'clubs';
    return '';
}

// Przykładowe rozdania (możesz dodać więcej)
const quizHands = [
    {
        communityCards: ['A♠', 'K♠', '2♥'],
        playerCards: ['Q♠', 'J♠'],
        pot: 300,
        stack: 5000,
        betToCall: 150,
        position: 'BTN',
        villainPosition: 'EP',
        villainAction: 'raise to 150',
        blinds: '25/50',
        street: 'FLOP',
        correctAction: 'raise',
        explanation: 'Mamy bardzo silny draw z dwoma overcardami na BTN vs EP raise. Raise jest tutaj standardowym zagraniem ze względu na equity i pozycję.'
    }
];

let currentHandIndex = 0;
let score = 0;

// Elementy DOM
const communityCardsEl = document.getElementById('community-cards');
const playerCardsEl = document.getElementById('player-cards');
const potEl = document.getElementById('pot');
const totalPotEl = document.getElementById('total-pot');
const stackEl = document.querySelector('#hero-position .stack-display');
const handNumberEl = document.getElementById('hand-number');
const scoreEl = document.getElementById('score');
const currentActionEl = document.getElementById('current-action');
const bettingRoundEl = document.querySelector('.betting-round');

// Przyciski akcji
document.getElementById('fold-btn').addEventListener('click', () => makeDecision('fold'));
document.getElementById('call-btn').addEventListener('click', () => makeDecision('call'));
document.getElementById('raise-btn').addEventListener('click', () => makeDecision('raise'));

// Przyciski wielkości raise'a
document.querySelectorAll('.bet-size-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sizing = e.target.textContent;
        makeDecision('raise', sizing);
    });
});

function createCardElement(card) {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${getSuitClass(card)}`;
    cardEl.textContent = card;
    return cardEl;
}

function clearBets() {
    document.querySelectorAll('.player-bet').forEach(el => el.textContent = '');
}

function resetPositions() {
    document.querySelectorAll('.player-position').forEach(el => {
        el.style.opacity = '0.5';
    });
}

function displayHand(hand) {
    // Wyczyść poprzednie karty i zakłady
    communityCardsEl.innerHTML = '';
    playerCardsEl.innerHTML = '';
    clearBets();
    resetPositions();

    // Wyświetl karty wspólne
    hand.communityCards.forEach(card => {
        communityCardsEl.appendChild(createCardElement(card));
    });

    // Wyświetl karty gracza
    hand.playerCards.forEach(card => {
        playerCardsEl.appendChild(createCardElement(card));
    });

    // Aktualizuj informacje o rozdaniu
    potEl.textContent = `Pot: ${hand.pot}`;
    totalPotEl.textContent = `Blinds: ${hand.blinds}`;
    stackEl.textContent = hand.stack;
    handNumberEl.textContent = `Rozdanie ${currentHandIndex + 1}/30`;
    scoreEl.textContent = `Wynik: ${score}/${currentHandIndex}`;
    bettingRoundEl.textContent = hand.street;
    
    // Wyświetl akcję przeciwnika
    currentActionEl.textContent = `${hand.villainPosition} ${hand.villainAction}`;

    // Pokaż zakład przeciwnika
    const villainBetEl = document.querySelector(`.${hand.villainPosition.toLowerCase()} .player-bet`);
    if (villainBetEl) {
        villainBetEl.textContent = hand.betToCall;
    }

    // Podświetl aktywne pozycje
    document.querySelector(`.${hand.position.toLowerCase()}`).style.opacity = '1';
    document.querySelector(`.${hand.villainPosition.toLowerCase()}`).style.opacity = '1';

    // Zresetuj timer
    const timerBar = document.querySelector('.timer-bar');
    timerBar.style.animation = 'none';
    timerBar.offsetHeight; // Trigger reflow
    timerBar.style.animation = null;
}

function makeDecision(action, sizing = '') {
    const currentHand = quizHands[currentHandIndex];
    
    if (action === currentHand.correctAction) {
        score++;
        alert('Poprawna decyzja! ' + currentHand.explanation);
    } else {
        alert('Niepoprawna decyzja. ' + currentHand.explanation);
    }

    currentHandIndex++;
    
    if (currentHandIndex < quizHands.length) {
        displayHand(quizHands[currentHandIndex]);
    } else {
        alert(`Quiz zakończony! Twój wynik: ${score}/${quizHands.length}`);
        if (confirm('Czy chcesz rozpocząć quiz od nowa?')) {
            currentHandIndex = 0;
            score = 0;
            displayHand(quizHands[0]);
        }
    }
}

// Rozpocznij quiz
displayHand(quizHands[0]);
