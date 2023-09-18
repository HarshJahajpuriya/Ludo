let numberOfPlayers = 4;//later we can take this from user

const GREEN = 'green';
const RED = 'red';
const YELLOW = 'yellow';
const BLUE = 'blue';

const SAFE_ZONES = [66, 44, 19, 6, 5, 27, 52, 65];

let playerTurns = [1,2,3,4];
let playerTurnIndex = 0;

let players = [];
let playerTurn = 1;
let dices = [];

(function () {
    let dicesNodeList = document.querySelectorAll("[id^='diceP']");
    dices = [dicesNodeList[2], dicesNodeList[0], dicesNodeList[1], dicesNodeList[3]]
})();

let diceValue = 0;
enableDice()

let Token = function (id, playerNumber) {
    this.id = id;
    this.cellTokenIndex = 0;
    this.playerNumber = playerNumber;
    this.color = '';
    this.color = playerNumber == 1 ? GREEN
        : playerNumber == 2 ? RED
            : playerNumber == 3 ? YELLOW
                : playerNumber == 4 ? BLUE : '';
    this.cellIndex = -1;
    this.position = id;
    this.imageUrl = 'images/' + this.color + '_token.png';
    let cell = document.getElementById(this.id);
    cell.addEventListener('click', moveToken);
    cell.classList.add('initial-cell-bg');
    cell.style.backgroundImage = 'url(' + this.imageUrl + ')';
}

let Player = function (playerNumber) {
    this.number = playerNumber;
    this.color = '';
    this.path = [];
    this.tokens = [new Token('p' + playerNumber + '1', playerNumber), new Token('p' + playerNumber + '2', playerNumber), new Token('p' + playerNumber + '3', playerNumber), new Token('p' + playerNumber + '4', playerNumber)];
    this.tokenPositions = ['p' + playerNumber + '1', 'p' + playerNumber + '2', 'p' + playerNumber + '3', 'p' + playerNumber + '4'];
    if (playerNumber == 1) {
        this.color = GREEN;
        this.path = [66, 63, 60, 57, 54, 47, 46, 45, 44, 43, 42, 30, 18, 19, 20, 21, 22, 23, 15, 12, 9, 6, 3, 0, 1, 2, 5, 8, 11, 14, 17, 24, 25, 26, 27, 28, 29, 41, 53, 52, 51, 50, 49, 48, 56, 59, 62, 65, 68, 71, 70, 67, 64, 61, 58, 55, 72];
    } else if (playerNumber == 2) {
        this.color = RED;
        this.path = [19, 20, 21, 22, 23, 15, 12, 9, 6, 3, 0, 1, 2, 5, 8, 11, 14, 17, 24, 25, 26, 27, 28, 29, 41, 53, 52, 51, 50, 49, 48, 56, 59, 62, 65, 68, 71, 70, 69, 66, 63, 60, 57, 54, 47, 46, 45, 44, 43, 42, 30, 31, 32, 33, 34, 35, 72];
    } else if (playerNumber == 3) {
        this.color = YELLOW;
        this.path = [5, 8, 11, 14, 17, 24, 25, 26, 27, 28, 29, 41, 53, 52, 51, 50, 49, 48, 56, 59, 62, 65, 68, 71, 70, 69, 66, 63, 60, 57, 54, 47, 46, 45, 44, 43, 42, 30, 18, 19, 20, 21, 22, 23, 15, 12, 9, 6, 3, 0, 1, 4, 7, 10, 13, 16, 72];
    } else if (playerNumber == 4) {
        this.color = BLUE;
        this.path = [52, 51, 50, 49, 48, 56, 59, 62, 65, 68, 71, 70, 69, 66, 63, 60, 57, 54, 47, 46, 45, 44, 43, 42, 30, 18, 19, 20, 21, 22, 23, 15, 12, 9, 6, 3, 0, 1, 2, 5, 8, 11, 14, 17, 24, 25, 26, 27, 28, 29, 41, 40, 39, 38, 37, 36, 72];
    }
}

if (numberOfPlayers == 2)
    players = [new Player(1), new Player(3)];
else if (numberOfPlayers == 3)
    players = [new Player(1), new Player(2), new Player(3)];
else if (numberOfPlayers == 4)
    players = [new Player(1), new Player(2), new Player(3), new Player(4)]
else console.log(" Allowed Number of players: 2 or 3 or 4");

let allPlayerTokens = players[0].tokens.concat(players[1].tokens.concat(players[2].tokens.concat(players[3].tokens)));

let isPlayStarted = -3;
let highestDiceValue = 0;
let firstPlayerTurn = 1;

document.getElementById('bg-player-1').classList.add("bg-active-player-1");

function rollDice(event) {
    diceValue = Math.floor(Math.random() * 6) + 1;
    event.target.src = 'images/dice_' + diceValue + '.png';
    event.target.classList.add('dice-disabled');
    event.target.removeEventListener('click', rollDice);
    let playerTokens = players[playerTurn - 1].tokens;
    if (isPlayStarted == 1) {
        let tokensMovable = playerTokens.filter(t=>{return t.cellIndex + diceValue <= 56});
        if (diceValue != 6){
            tokensMovable = tokensMovable.filter(t=>{return t.cellIndex != -1});
        }        
        if(tokensMovable.length == 0) incrementPlayerTurn();            
    }
    else if(isPlayStarted<=0)
    {
        if(highestDiceValue<diceValue) {
            highestDiceValue = diceValue;
            firstPlayerTurn = 4+isPlayStarted; //isPlayStarted has negative value
        }
        isPlayStarted++;
        incrementPlayerTurn();
        if(isPlayStarted==1){
            playerTurnIndex += firstPlayerTurn-1;
            playerTurn = playerTurns[playerTurnIndex];
            diceValue = 0;
            enableDice();
            document.getElementById('bg-player-1').classList.remove("bg-active-player-1");
            document.getElementById('bg-player-2').classList.remove("bg-active-player-2");
            document.getElementById('bg-player-3').classList.remove("bg-active-player-3");
            document.getElementById('bg-player-4').classList.remove("bg-active-player-4");
            document.getElementById('bg-player-'+playerTurn).classList.add("bg-active-player-"+playerTurn);
        }
    }
}

function enableDice() {
    for (let i = 0; i < dices.length; i++) {
        if (playerTurn - 1 == i) {
            dices[i].classList.remove('dice-disabled');
            dices[i].addEventListener('click', rollDice);
        } else {
            dices[i].classList.add('dice-disabled');
            dices[i].removeEventListener('click', rollDice);
        }
    }
}

function moveToken(cellEv) {
    if (diceValue == 0) return;
    let origionalDiceValue = diceValue;
    let cell = cellEv.target;
    let cellId = cell.id;
    let player = players[playerTurn - 1];
    let tokenPositionIndex = player.tokenPositions.indexOf(cellId);
    if (tokenPositionIndex == -1) return; //token of opponent player

    let token = player.tokens[tokenPositionIndex];

    if(token.cellIndex + diceValue > 56) return; //if token is near home

    if (token.cellIndex == -1) {
        if (diceValue == 6) diceValue = 1;
        else return; //if dice value is not equal to 6 and token is placed at initial position
    }

    token.cellIndex += diceValue;
    token.position = player.path[token.cellIndex].toString();
    player.tokenPositions[tokenPositionIndex] = token.position;

    let isTokenCaptured = false;
    let opponentTokens = allPlayerTokens.filter(t=>{
        if(t.playerNumber!=playerTurn && t.position == token.position) return t
    }); //opponent tokens on target cell

    if (opponentTokens.length == 1) {
        if (SAFE_ZONES.indexOf(parseInt(opponentTokens[0].position)) == -1){
            resetTokenPosition(opponentTokens[0])
            isTokenCaptured = true;
        }
    }

    dislocateToken(cell); //To dislocate token in clicked cell

    let tokens = allPlayerTokens.filter(t=>{
        if(t.position == cellId) return t;
    })

    for(let i = 0, j = 0; i<=tokens.length+1; i++)
    {
        let token = tokens.find(t => { return t.cellTokenIndex == i })
        if(token) {
            token.cellTokenIndex = j;
            j++;
        }
    }

    if(tokens.length == 2 && (tokens[0].playerNumber != tokens[1].playerNumber)) {
        let tokenIndex = tokens.findIndex(t => { return t.cellTokenIndex == 0 });
        if (SAFE_ZONES.indexOf(parseInt(tokens[tokenIndex].position)) == -1){
            resetTokenPosition(tokens[tokenIndex]);
            tokens.splice(tokenIndex,1);
        }
    }

    placeToken(cell, tokens); //tokens placed in clicked cell;

    let newCell = document.getElementById(token.position);    
    tokens = allPlayerTokens.filter(t=>{
        if(t.position == token.position) return t;
    })    
    token.cellTokenIndex = tokens.length-1;

    let isTokenPlacedInHome = false;
    if(token.cellIndex==56) 
    {
        placeTokenInHome(token);
        isTokenPlacedInHome = true;
    }
    else placeToken(newCell, tokens); //tokens placed in target cell;
    
    if (origionalDiceValue == 6 || isTokenCaptured || isTokenPlacedInHome) {
        diceValue = 0;
        enableDice();
    }else incrementPlayerTurn();
}



function incrementPlayerTurn() {
    playerTurnIndex += 1;
    if (playerTurnIndex == playerTurns.length) playerTurnIndex = 0;
    playerTurn = playerTurns[playerTurnIndex];
    diceValue = 0;
    enableDice();

    document.getElementById('bg-player-1').classList.remove("bg-active-player-1");
    document.getElementById('bg-player-2').classList.remove("bg-active-player-2");
    document.getElementById('bg-player-3').classList.remove("bg-active-player-3");
    document.getElementById('bg-player-4').classList.remove("bg-active-player-4");
    document.getElementById('bg-player-'+playerTurn).classList.add("bg-active-player-"+playerTurn);

}

//recieve html table cell element reference
function placeToken(cell, tokens) {
    if(tokens.length==0) return 
    let bgImgStr = ""
    for(let i = 0; i<tokens.length; i++){
        bgImgStr+="url('" + tokens[i].imageUrl + "')";
        if(i<tokens.length-1) bgImgStr+=",";
    }
    cell.style.backgroundImage = bgImgStr;
    cell.classList.remove('token-placed-'+tokens.length-1);
    cell.classList.add('token-placed-'+tokens.length);

    cell.classList.remove('token-dislocated');
    cell.addEventListener('click', moveToken);
}

function placeTokenInHome(token)
{
    let tokenIndex = players[playerTurn-1].tokens.indexOf(token);
    players[playerTurn-1].tokens.splice(tokenIndex,1);
    players[playerTurn-1].tokenPositions.splice(tokenIndex,1);
    let tokenImgsInHome = document.querySelectorAll(".bgHomeP"+playerTurn+" img");
    tokenImgsInHome[3-players[playerTurn-1].tokens.length].style.display = 'block';
    if(players[playerTurn-1].tokens.length==0) {
        let tmpPlayerTurnIndex = playerTurnIndex;
        incrementPlayerTurn();
        playerTurns.splice(tmpPlayerTurnIndex,1);
        playerTurnIndex--;
    }
}

function dislocateToken(cell) {
    for(let i = 1; i<=9; i++){
        cell.classList.remove('token-placed-'+i); 
    }
    cell.classList.add('token-dislocated');
    cell.removeEventListener('click', moveToken);
}

function resetTokenPosition(token) {
    token.cellIndex = -1;
    let posIndex = players[token.playerNumber-1].tokenPositions.indexOf(token.position); //correction
    players[token.playerNumber-1].tokenPositions[posIndex] = token.id; //correction
    token.position = token.id;
    let cell = document.getElementById(token.id);
    cell.addEventListener('click', moveToken);
    cell.classList.add('initial-cell-bg');
    cell.classList.remove('token-dislocated');
    cell.style.backgroundImage = 'url("' + token.imageUrl + '")';
}

