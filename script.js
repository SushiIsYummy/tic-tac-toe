
(function() {
  let gameSection = document.querySelector('.game-section');
  let gameboardDOM = document.querySelector('.gameboard');
  let playerTurnMessage = document.createElement('p');
  let restartButton = document.createElement('button');
  let player1Name = '';
  let player2Name = '';
  let player1SVGContainer = document.querySelector('.player1-svg-container');
  let player2SVGContainer = document.querySelector('.player2-svg-container');
  let player1SVG = document.querySelector('.player1-svg');
  let player2SVG = document.querySelector('.player2-svg');

  const Gameboard = (() => {
    let gameboard = Array(9).fill(null);
    let winningPositions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], 
                            [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    
    let turn = 1;
  
    let gameWon = false;

    const getTurn = () => turn;

    const getGameWon = () => gameWon;

    const incrementTurn = () => turn++;

    const resetGame = () => {
      turn = 1;
      gameWon = false;
      gameboard = Array(9).fill(null);
    }

    const getGameBoard = () => {
      return [...gameboard];
    }

    const addSymbol = (symbol, index) => {
      if (spotAvailable(index)) {
        let symbolClass = symbol + 'Symbol';
        let targetDiv = document.querySelector(`div[data-index="${index}"].grid-square`);
        let targetSVG = targetDiv.querySelector(`.${symbolClass}`);

        targetDiv.classList.add('occupied');
        targetSVG.classList.remove('hidden-svg');
        gameboard[index] = symbol;
        
        incrementTurn();

        if (winCheck(symbol).win) {
          gameWon = true;
          if (symbol === 'o') {
            endGame(player1Name);
            colorWinningPositionAndWinner(winCheck(symbol).winningPosition, 'o');
          } else if (symbol === 'x') {
            endGame(player2Name);
            colorWinningPositionAndWinner(winCheck(symbol).winningPosition, 'x');
          }
        }

        if (turn >= 10 && !gameWon) {
          gameWon = true;
          endGame(null);
        }
      }
    };

    const colorWinningPositionAndWinner = (winningPosition, symbol) => {
      winningPosition.forEach((index) => {
        let targetGridSquare = document.querySelector(`div[data-index="${index}"].grid-square`);
        targetGridSquare.style.backgroundColor = "yellow";
      });

      if (symbol === 'o') {
        player1SVGContainer = document.querySelector('.player1-svg-container');
        player1SVGContainer.style.backgroundColor = "yellow";
        player1SVG.classList.remove('current-turn');
      } else if (symbol === 'x') {
        player2SVGContainer = document.querySelector('.player2-svg-container');
        player2SVGContainer.style.backgroundColor = "yellow";
        player2SVG.classList.remove('current-turn');
      }
    }

    const endGame = (playerWon) => {
      
      removeEventListenersFromGridSquares();

      if (playerWon === null) {
        playerTurnMessage.textContent = "Tie! No winner!";
        playerTurnMessage.style.color = "red";
        player1SVG.classList.remove('current-turn');
        player1SVG.classList.remove('other-turn');
        player2SVG.classList.remove('current-turn');
        player2SVG.classList.remove('other-turn');
        return;
      }

      playerTurnMessage.textContent = playerWon + " Wins!";
    }

    const spotAvailable = (index) => {
      return gameboard[index] === null ? true : false;
    }
    
    const winCheck = (symbol) => {

      for (let i = 0; i < winningPositions.length; i++) {
        let win = true;
        let previousSymbol = symbol;
        for (let j = 0; j < winningPositions[i].length; j++) {
          if (gameboard[winningPositions[i][j]] !== previousSymbol) {
            win = false;
            break;
          } else {
            previousSymbol = gameboard[winningPositions[i][j]];
          }
        }

        if (win) {
          return { win, winningPosition: winningPositions[i] } 
        }
      }
        return { win:false , winningPosition: null };
    }
  
    return { gameboard, addSymbol, getTurn, getGameWon, resetGame, getGameBoard }
  })();
  
  (function setUpBoard() {

    for (let i = 0; i < Gameboard.getGameBoard().length; i++) {
      let gridSquare = document.createElement('div');
      const svgX = '<svg class="svg-content xSymbol" width="100%" height="100%" viewBox="0 0 100 100">'
                  + '<line x1="0" y1="0" x2="100" y2="100" />'
                  + '<line x1="100" y1="0" x2="0" y2="100" />'
              + '</svg>';

      const svgO = '<svg class="svg-content oSymbol" width="100%" height="100%" viewBox="0 0 100 100">'
      + '<circle cx="50%" cy="50%" r="47.5%" fill="none" stroke="black" stroke-width="3" />'
      + '</svg>';
      
      gridSquare.classList.add('grid-square');
      gridSquare.setAttribute('data-index', i);
      gridSquare.innerHTML += svgX;
      gridSquare.innerHTML += svgO;
      
      gameboardDOM.appendChild(gridSquare);
    }

    document.querySelectorAll('.svg-content').forEach((svg) => {
      svg.classList.add('hidden-svg');
    });
  })();

  function addEventListenersToGridSquares() {
    let allGridSquares = document.querySelectorAll('.grid-square');
      
    allGridSquares.forEach((gridSquare) => {
      gridSquare.addEventListener('mouseover', mouseOverGridSquare);
      gridSquare.addEventListener('mouseout', mouseOutGridSquare);
      gridSquare.addEventListener('click', clickGridSquare);
    });
  }

  function removeEventListenersFromGridSquares() {
    let allGridSquares = document.querySelectorAll('.grid-square');
      
    allGridSquares.forEach((gridSquare) => {
      gridSquare.removeEventListener('mouseover', mouseOverGridSquare);
      gridSquare.removeEventListener('mouseout', mouseOutGridSquare);
      gridSquare.removeEventListener('click', clickGridSquare);
    });
  }

  function mouseOverGridSquare(e) {
    let targetGridSquare = e.target;

    if (!targetGridSquare.classList.contains('occupied')
        && Gameboard.getTurn() % 2 === 1) {
      let targetSVG = targetGridSquare.querySelector('.oSymbol');
      targetSVG.style.visibility = 'visible';
      // targetSVG.querySelector('circle').style.stroke = "#808080";
      targetSVG.querySelector('circle').style.stroke = "#808080";
      targetGridSquare.style.backgroundColor = '#D3D3D3';
    } else if (!targetGridSquare.classList.contains('occupied')
               && Gameboard.getTurn() % 2 === 0) {
      let targetSVG = targetGridSquare.querySelector('.xSymbol');
      targetSVG.style.visibility = 'visible';
      targetSVG.querySelectorAll('line').forEach(line => line.style.stroke = "#808080")
      targetGridSquare.style.backgroundColor = '#D3D3D3';
    } else {
      targetGridSquare.style.backgroundColor = 'red';
    }
  }

  function mouseOutGridSquare(e) {
    let targetGridSquare = e.target;
    if (!targetGridSquare.classList.contains('occupied') 
        && Gameboard.getTurn() % 2 === 1) {
      let targetSVG = targetGridSquare.querySelector('.oSymbol');
      targetSVG.style.visibility = 'hidden';
      targetSVG.querySelector('circle').style.stroke = "black";
      targetGridSquare.style.backgroundColor = 'white';
    } else if (!targetGridSquare.classList.contains('occupied')
               && Gameboard.getTurn() % 2 === 0) {
      let targetSVG = targetGridSquare.querySelector('.xSymbol');
      targetSVG.style.visibility = 'hidden';
      targetSVG.querySelectorAll('line').forEach(line => line.style.stroke = "#808080")
      targetGridSquare.style.backgroundColor = 'white';
    } else {
      targetGridSquare.style.backgroundColor = 'white';
    }
  }

  function clickGridSquare(e) {
    let targetGridSquare = e.target;

    if (!targetGridSquare.classList.contains('occupied')
        && Gameboard.getTurn() % 2 === 1) {
      let targetSVG = targetGridSquare.querySelector('.oSymbol');
      targetSVG.style.visibility = 'visible';
      targetSVG.querySelector('circle').style.stroke = 'blue';
      targetGridSquare.style.backgroundColor = 'white';
      Gameboard.addSymbol('o', targetGridSquare.dataset.index);

      if (!Gameboard.getGameWon()) {
        displayPlayerTurn();
      }
    } else if (!targetGridSquare.classList.contains('occupied')
               && Gameboard.getTurn() % 2 === 0) {
      let targetSVG = targetGridSquare.querySelector('.xSymbol');
      targetSVG.style.visibility = 'visible';
      targetSVG.querySelectorAll('line').forEach(line => line.style.stroke = 'green');
      targetGridSquare.style.backgroundColor = 'white';
      Gameboard.addSymbol('x', targetGridSquare.dataset.index);
      
      if (!Gameboard.getGameWon()) {
        displayPlayerTurn();
      }
    }
  }

  function displayPlayerTurn() {
    if (Gameboard.getTurn() % 2 === 0) {
      playerTurnMessage.innerHTML = player2Name + "'s Turn";
      playerTurnMessage.style.color = "green";
      player2SVG.classList.add('current-turn');
      player2SVG.classList.remove('other-turn');
      player1SVG.classList.add('other-turn')
      player1SVG.classList.remove('current-turn');
    } else {
      playerTurnMessage.innerHTML = player1Name + "'s Turn";
      playerTurnMessage.style.color = "blue";
      player1SVG.classList.add('current-turn');
      player1SVG.classList.remove('other-turn');
      player2SVG.classList.add('other-turn')
      player2SVG.classList.remove('current-turn');
    }
  }
  
  let startGameButton = document.querySelector('.start-game-button');
  startGameButton.addEventListener('click', startGame, { once: true });

  function startGame() {
    startGameButton.remove();
    restartButton.textContent = "Restart";
    restartButton.classList.add('restart-game-button');
    restartButton.addEventListener('click', restartGame);

    playerTurnMessage.classList.add('player-turn-message');
    gameSection.insertBefore(playerTurnMessage, gameboardDOM);
    gameSection.appendChild(restartButton);
    
    let player1Input = document.querySelector('.player1-input');
    let player2Input = document.querySelector('.player2-input');
    
    player1Name = player1Input.value === '' ? 'Player 1': player1Input.value;
    player2Name = player2Input.value === '' ? 'Player 2': player2Input.value;
    
    addEventListenersToGridSquares();
    displayPlayerTurn();
  }

  function resetGridSquares() {
    let allGridSquares = document.querySelectorAll('.grid-square');

    allGridSquares.forEach((gridSquare) => {
      gridSquare.classList.remove('occupied');
      gridSquare.style.backgroundColor = 'white';
      let svg = gridSquare.querySelector('svg:not(.hidden-svg)');

      if (svg !== null) {
        svg.classList.add('hidden-svg');
        svg.style.visibility = 'hidden';
      }
    })
  }

  function restartGame() {
    let player1Input = document.querySelector('.player1-input');
    let player2Input = document.querySelector('.player2-input');

    player1Name = player1Input.value === '' ? 'Player 1': player1Input.value;
    player2Name = player2Input.value === '' ? 'Player 2': player2Input.value;

    resetGridSquares();
    Gameboard.resetGame();
    addEventListenersToGridSquares();
    displayPlayerTurn();

    player1SVGContainer.style.backgroundColor = "white";
    player2SVGContainer.style.backgroundColor = "white";
  }

})();