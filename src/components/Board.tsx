import * as React from 'react';

/*
 * Component property interfaces
 */

interface SquareProps {
  readonly isWinner: boolean,
  readonly onClick: () => any,
  readonly value: string | null
}

interface BoardProps {
  readonly squares: (string | null)[],
  readonly onClick: (i: number) => any,
  readonly winnerIndices: number[] | null
}

/*
 * Function components
 */

function Square(props: SquareProps) {
  return (
    <button
      className={'square ' + (props.isWinner ? 'winner' : '')}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

/*
 * Class components
 */

export class Board extends React.Component<BoardProps> {
  renderSquare(index: number) {
    return (
      <Square
        key={'square-' + index}
        value={this.props.squares[index]}
        isWinner={this.props.winnerIndices?.includes(index) ?? false}
        onClick={() => this.props.onClick(index)}
      />
    );
  }

  render() {
    const squaresPerRow = Math.sqrt(this.props.squares.length);
    let rows: JSX.Element[] = [];

    for (let y = 0; y < squaresPerRow; y++){
      let squares: JSX.Element[] = [];

      for (let x = 0; x < squaresPerRow; x++) {
        const squareIndex = x + y * squaresPerRow;
        squares.push(this.renderSquare(squareIndex));
      }

      rows.push(<div key={'board-row-' + y} className="board-row">{squares}</div>);
    }

    return <div>{rows}</div>;
  }
}