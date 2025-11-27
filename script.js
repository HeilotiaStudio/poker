document.addEventListener('DOMContentLoaded', () => {
  // Correct way to get Hand in browser
  const Hand = window.PokerSolver ? window.PokerSolver.Hand : null;
  if (!Hand) {
    alert('PokerSolver library not loaded!');
    return;
  }

  const deckRanks = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
  const deckSuits = ['h','d','c','s'];

  function generateDeck() {
    const deck = [];
    for (let r of deckRanks)
      for (let s of deckSuits)
        deck.push(r + s);
    return deck;
  }

  function removeCards(deck, cards) {
    return deck.filter(c => !cards.includes(c));
  }

  function generateTurnRiverCombos(deck) {
    const combos = [];
    for (let i = 0; i < deck.length; i++) {
      for (let j = i + 1; j < deck.length; j++) {
        combos.push([deck[i], deck[j]]);
      }
    }
    return combos;
  }

  function calculateHandOdds(playerCards, communityCards) {
    const deck = removeCards(generateDeck(), [...playerCards, ...communityCards]);
    const combos = generateTurnRiverCombos(deck);

    const playerHand = Hand.solve([...playerCards, ...communityCards]);
    let wins = 0, ties = 0, losses = 0;

    for (const combo of combos) {
      const fullHand = [...playerCards, ...communityCards, ...combo];
      const oppHand = Hand.solve(fullHand);

      const winners = Hand.winners([playerHand, oppHand]);
      if (winners.length === 2) ties++;
      else if (winners[0] === playerHand) wins++;
      else losses++;
    }

    const total = combos.length;
    return {
      winPct: ((wins / total) * 100).toFixed(2),
      tiePct: ((ties / total) * 100).toFixed(2),
      losePct: ((losses / total) * 100).toFixed(2),
    };
  }

  document.getElementById('calcBtn').addEventListener('click', () => {
    const hole = document.getElementById('hole').value.trim().split(' ');
    const flop = document.getElementById('flop').value.trim().split(' ').filter(Boolean);

    if (hole.length !== 2) {
      alert('Please enter exactly 2 hole cards.');
      return;
    }

    const btn = document.getElementById('calcBtn');
    btn.disabled = true;
    btn.innerText = 'Calculating...';

    setTimeout(() => {
      const { winPct, tiePct, losePct } = calculateHandOdds(hole, flop);
      document.getElementById('resultText').innerText =
        `Chance to improve: ${winPct}% | Same: ${tiePct}% | Worse: ${losePct}%`;

      btn.disabled = false;
      btn.innerText = 'Calculate Odds';
    }, 50);
  });
});








