var PlayerVsComputerGame = function(httpClient, ui, gameState) {
  this.httpClient = httpClient;
  this.ui = ui;
  this.gameState = gameState;
}

PlayerVsComputerGame.prototype.play = function() {
  this.ui.enableSpots(this.gameState.board);
  this.ui.displayHumanTurn();
}

PlayerVsComputerGame.prototype.takeTurn = function(spotId) {
  this.gameState.board[spotId] = this.gameState.getPlayerMarker();
  this.ui.showBoard(this.gameState.board);
  this.gameState.switchTurn();
  this.computerTurn();
}

PlayerVsComputerGame.prototype.computerTurn = function() {
  this.ui.disableSpots(this.gameState.board);
  this.ui.displayComputerTurn();
  this.httpClient.postUpdatedGame(PlayerVsComputerGame.prototype.endTurn, this.ui, this.gameState);
}

PlayerVsComputerGame.prototype.endTurn = function(response, ui, gameState) {
  gameState.board = response.board;
  gameState.status = response.status;
  ui.showBoard(gameState.board);
  if (gameState.isOver()) {
    PlayerVsComputerGame.prototype.endGame(gameState.status, ui)
  } else {
    ui.displayHumanTurn();
    ui.enableSpots(gameState.board);
    gameState.switchTurn();
  }
}

PlayerVsComputerGame.prototype.endGame = function(status, ui) {
  if (status === "tie") {
    ui.displayTie()
  } else if (status === "player1Wins") {
    ui.displayWinner("X");
  } else if (status === "player2Wins") {
    ui.displayWinner("O");
  }
}

module.exports = PlayerVsComputerGame;
