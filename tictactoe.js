const prompt = require('prompt');


prompt.start();

var schema = {
  properties: {
    player1: {
      pattern: /^[a-zA-Z\s\-]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      required: true
    }, 
    player2: {
      pattern: /^[a-zA-Z\s\-]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      required: true
    }, 
    rotate: {
      type: 'boolean',
      default: false
    }
  }
};

var turn = {
  properties: {
    x: {
      type: 'number'
    },
    y: {
      type: 'number'
    },
  }
}

const playTurn = (board, {player1, player2, toPlay, rotate}) => {
  // see if a winner exists 
  if (detectWinner(board)) {
    // backwards
    console.log(`player ${toPlay === 1 ? player2 : player1} wins!`);
  } else {
    console.log(printBoard(board, toPlay === 1 ? player1 : player2));
    if (rotate) {
      board = rotate(board);
    }
    prompt.get(turn, (err, {x, y}) => {
      if (x < 3 && y < 3 && board[y][x] === 0) {
        board[y][x] = toPlay;
        toPlay = toPlay === 1 ? 2 : 1;
      } else {
        console.log('cant play there!');
      }
      playTurn(board, {player1, player2, toPlay});
    });
  }
};

const detectWinner = board => {
  for (var i = 0; i < 3; i++) {
    if (board[i][0] === board[i][1] && 
      board[i][1] === board[i][2]) {
        return board[i][0];
      }
    if (board[0][i] === board[1][i] && 
      board[1][i] === board[2][i]) {
        return board[0][i];
      }
  }
  // diags
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    return board[0][0];
  }
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    return board[0][2];
  }
  return 0;
};

const printBoard = (board, name) => {
  let str = 'to play: ' + name + '\n';
  board.forEach(r => {
    str += r.join(' ');
    str += '\n';
  });
  return str;
};

const rotate = board => {
  return board;
};

const makeBoard = function(l = 3) {
  var cols = [];
  for (var i = 0; i < l; i++) {
    var row = [];
    for (var j = 0; j < l; j++) {
      row.push(0);
    } 
    cols.push(row);
  }
  return cols;
}


prompt.get(schema, (err, result) => {
  result.toPlay = 1;
  console.log(result);
  playTurn(makeBoard(), result)
});