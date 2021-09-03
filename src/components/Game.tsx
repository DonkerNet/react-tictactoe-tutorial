import * as React from 'react';
import { Board } from './Board';

/*
 * Component property interfaces
 */

interface GameProps {
  readonly squaresPerRow: number
}

/*
 * Component state interfaces
 */

interface GameStateHistory {
  squares: (string | null)[],
  lastSquareIndex: number | null
}

interface GameState {
  history: GameStateHistory[],
  stepNumber: number,
  xIsNext: boolean,
  sortStepsAscending: boolean
}

/*
 * Class components
 */

export class Game extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);    
    this.state = this.loadDefaultState();
  }

  loadDefaultState() {
    const squareCount = Math.pow(this.props.squaresPerRow, 2);
    return {
      history: [{
        squares: Array(squareCount).fill(null),
        lastSquareIndex: null
      }],
      stepNumber: 0,
      xIsNext: true,
      sortStepsAscending: true
    };
  }
  
  handleClick(index: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (this.calculateWinner(squares) || squares[index]) {
      return;
    }
    
    squares[index] = this.state.xIsNext ? 'X' : 'O';
    
    this.setState({
      history: history.concat([{
        squares: squares,
        lastSquareIndex: index
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  calculateWinner(squares: (string | null)[]) {
    // Calculate the winner by checking the squares horizontally, vertically and diagonally
    // There's propably a better way to do this but whatever
  
    const squaresPerRow = Math.sqrt(squares.length);
  
    // Check horizontally
    for (let y = 0; y <= squaresPerRow; y++) {
      const rowStartSquare = squares[y * squaresPerRow];
  
      if (!rowStartSquare) {
        continue;
      }
  
      let filledSquareIndices = [];
  
      for (let x = 0; x < squaresPerRow; x++) {
        const squareIndex = x + y * squaresPerRow;
        const square = squares[squareIndex];
  
        if (square !== rowStartSquare) {
          break;
        }
  
        filledSquareIndices.push(squareIndex);
      }
  
      if (filledSquareIndices.length === squaresPerRow) {
        // We have a winner!
        return filledSquareIndices;
      }
    }
  
    // Check vertically
    for (let x = 0; x <= squaresPerRow; x++) {
      const columnStartSquare = squares[x];
  
      if (!columnStartSquare) {
        continue;
      }
  
      let filledSquareIndices = [];
  
      for (let y = 0; y < squaresPerRow; y++) {
        const squareIndex = x + y * squaresPerRow;
        const square = squares[squareIndex];
  
        if (square !== columnStartSquare) {
          break;
        }
  
        filledSquareIndices.push(squareIndex);
      }
  
      if (filledSquareIndices.length === squaresPerRow) {
        // We have a winner!
        return filledSquareIndices;
      }
    }
  
    // Check diagonally starting top-left
    const topLeftColumnStartIndex = 0;
    const topLeftColumnStartSquare = squares[topLeftColumnStartIndex];
    if (topLeftColumnStartSquare) {
      let filledSquareIndices = [];
  
      for (let i = topLeftColumnStartIndex; i < squares.length; i += squaresPerRow + 1) {
        if (squares[i] !== topLeftColumnStartSquare) {
          break;
        }
  
        filledSquareIndices.push(i);
      }
  
      if (filledSquareIndices.length === squaresPerRow) {
        // We have a winner!
        return filledSquareIndices;
      }
    }
  
    // Check diagonally starting top-right
    const topRightColumnStartIndex = squaresPerRow - 1;
    const topRightColumnStartSquare = squares[topRightColumnStartIndex];
    if (topRightColumnStartSquare) {  
      let filledSquareIndices = [];
  
      for (let i = topRightColumnStartIndex; i < squares.length; i += squaresPerRow - 1) {
        if (squares[i] !== topRightColumnStartSquare) {
          break;
        }
  
        filledSquareIndices.push(i);
      }
  
      if (filledSquareIndices.length === squaresPerRow) {
        // We have a winner!
        return filledSquareIndices;
      }
    }
  
    return null;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerIndices = this.calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      const rowNumber = Math.floor(step.lastSquareIndex ?? 0 / this.props.squaresPerRow) + 1;
      const columnNumber = step.lastSquareIndex ?? 0 % this.props.squaresPerRow + 1;

      const description = move
        ? `Move #${move} (row ${rowNumber}, col ${columnNumber})`
        : 'Game start';

      return (
        <li className={'move-button ' + (move === this.state.stepNumber ? 'current' : '')} key={'move-button-' + move}>
          <button onClick={() => this.jumpTo(move)}>{description}</button>
        </li>
      );
    });

    if (this.state.sortStepsAscending === false) {
      moves = moves.reverse();
    }

    let status: JSX.Element;

    if (winnerIndices) {
      status = <span className="winner">Winner: {current.squares[winnerIndices[0]]}</span>;
    } else if (this.state.stepNumber === current.squares.length) {
      status = <span className="draw">Draw</span>;
    } else {
      status = <span>Next player: {this.state.xIsNext ? 'X' : 'O'}</span>;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winnerIndices={winnerIndices}
            onClick={(i) => this.handleClick(i)} />
            <br />
          <button onClick={() => this.setState(this.loadDefaultState())}>Reset game</button>
        </div>
        <div className="game-info">
          <div className="game-status">{status}</div>
          <div>
            Moves:
            <ol>{moves}</ol>
            <button onClick={() => this.setState({ sortStepsAscending: !this.state.sortStepsAscending })}>
              Sort moves {this.state.sortStepsAscending ? 'descending' : 'ascending'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}