import React, { Component } from "react";
import "./tileGrid.css";
import Tile from "./tile.jsx";

class TileGrid extends Component {
  tileCount = 0;

  state = {
    tiles: [],
    deletedTiles: []
  };

  constructor(props) {
    super();
    this.state.tiles = this.createInitialTileGrid();
  }

  createEmptyTileGrid = () => {
    return [new Array(4), new Array(4), new Array(4), new Array(4)];
  };

  createInitialTileGrid = () => {
    let tiles = this.createEmptyTileGrid();
    this.addRandomTile(tiles);
    this.addRandomTile(tiles);
    return tiles;
  };

  addRandomTile = tiles => {
    while (true) {
      const row = Math.floor(Math.random() * 4);
      const column = Math.floor(Math.random() * 4);
      if (tiles[row][column] === undefined) {
        const value = Math.random() < 0.8 ? 2 : 4;
        tiles[row][column] = this.createTile(value);
        return;
      }
    }
  };

  createTile = value => {
    const index = this.tileCount++;
    return {
      index: index,
      value: value,
      canUpdate: true,
      previousPosition: undefined
    };
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeydown, false);
  }

  handleKeydown = event => {
    if (event.code === "ArrowLeft") {
      this.handleLeftClick();
    } else if (event.code === "ArrowRight") {
      this.handleRightClick();
    } else if (event.code === "ArrowUp") {
      this.handleUpClick();
    } else if (event.code === "ArrowDown") {
      this.handleDownClick();
    }
  };

  handleLeftClick = () => {
    const rowOffset = 0;
    const colOffset = -1;
    this.moveTiles(rowOffset, colOffset);
  };

  handleRightClick = () => {
    const rowOffset = 0;
    const colOffset = 1;
    const processTilesInReverse = true;
    this.moveTiles(rowOffset, colOffset, processTilesInReverse);
  };

  handleUpClick = () => {
    const rowOffset = -1;
    const colOffset = 0;
    this.moveTiles(rowOffset, colOffset);
  };

  handleDownClick = () => {
    const rowOffset = 1;
    const colOffset = 0;
    const processTilesInReverse = true;
    this.moveTiles(rowOffset, colOffset, processTilesInReverse);
  };

  moveTiles = (rowOffset, colOffset, processTilesInReverse = false) => {
    let tiles = this.copyTilesForMove();
    let deletedTiles = [];
    let scoreIncrease = 0;
    if (processTilesInReverse) {
      for (let row = tiles.length - 1; row >= 0; --row) {
        for (let column = tiles[row].length - 1; column >= 0; --column) {
          scoreIncrease += this.moveTileInDirection(
            tiles,
            deletedTiles,
            row,
            column,
            rowOffset,
            colOffset
          );
        }
      }
    } else {
      for (let row = 0; row < tiles.length; ++row) {
        for (let column = 0; column < tiles[row].length; ++column) {
          scoreIncrease += this.moveTileInDirection(
            tiles,
            deletedTiles,
            row,
            column,
            rowOffset,
            colOffset
          );
        }
      }
    }
    if (!this.moveOccurred(tiles)) return;
    this.addRandomTile(tiles);
    this.setState({ tiles: tiles, deletedTiles: deletedTiles });
    this.props.onIncrementScore(scoreIncrease);
  };

  copyTilesForMove = () => {
    let tilesCopy = this.createEmptyTileGrid();
    for (let row = 0; row < this.state.tiles.length; ++row) {
      for (let col = 0; col < this.state.tiles[row].length; ++col) {
        const tile = this.state.tiles[row][col];
        if (tile) {
          tilesCopy[row][col] = { ...tile };
          tilesCopy[row][col].previousPosition = [row, col];
          tilesCopy[row][col].canUpdate = true;
        }
      }
    }
    return tilesCopy;
  };

  moveTile = (tiles, fromRow, fromCol, toRow, toCol) => {
    tiles[toRow][toCol] = tiles[fromRow][fromCol];
    tiles[fromRow][fromCol] = undefined;
  };

  moveTileInDirection = (
    tiles,
    deletedTiles,
    row,
    column,
    adjacentRowOffset,
    adjacentColOffset
  ) => {
    const tile = tiles[row][column];
    if (!tile) {
      return 0;
    }

    const adjacentRow = row + adjacentRowOffset;
    const adjacentCol = column + adjacentColOffset;
    if (this.outOfBounds(adjacentRow, adjacentCol)) {
      return 0;
    }

    const adjacentTile = tiles[adjacentRow][adjacentCol];
    if (!adjacentTile) {
      this.moveTile(tiles, row, column, adjacentRow, adjacentCol);
      return this.moveTileInDirection(
        tiles,
        deletedTiles,
        adjacentRow,
        adjacentCol,
        adjacentRowOffset,
        adjacentColOffset
      );
    } else if (this.canMergeTiles(tile, adjacentTile)) {
      deletedTiles.push(this.createDeletedTile(tile, adjacentRow, adjacentCol));
      deletedTiles.push(
        this.createDeletedTile(adjacentTile, adjacentRow, adjacentCol)
      );
      const newTileValue = tile.value * 2;
      tiles[adjacentRow][adjacentCol] = this.createTile(newTileValue);
      tiles[adjacentRow][adjacentCol].canUpdate = false;
      tiles[row][column] = undefined;
      return newTileValue;
    }
    return 0;
  };

  moveOccurred = newTiles => {
    for (let row = 0; row < newTiles.length; ++row) {
      for (let col = 0; col < newTiles[row].length; ++col) {
        const oldTile = this.state.tiles[row][col];
        const newTile = newTiles[row][col];
        const oldTileValue = oldTile === undefined ? 0 : oldTile.value;
        const newTileValue = newTile === undefined ? 0 : newTile.value;
        if (oldTileValue !== newTileValue) {
          return true;
        }
      }
    }
    return false;
  };

  outOfBounds = (row, col) => {
    return row < 0 || row > 3 || col < 0 || col > 3;
  };

  canMergeTiles = (tile, adjacentTile) => {
    return adjacentTile.canUpdate && tile.value === adjacentTile.value;
  };

  createDeletedTile = (tile, endRow, endCol) => {
    return {
      index: tile.index,
      value: tile.value,
      startRow: tile.previousPosition[0],
      startCol: tile.previousPosition[1],
      endRow: endRow,
      endCol: endCol
    };
  };

  renderTile = (tile, row, col) => {
    if (!tile) return;
    return (
      <Tile
        key={tile.index}
        value={tile.value}
        row={row}
        col={col}
        previousPosition={tile.previousPosition}
      />
    );
  };

  render() {
    return (
      <div className="grid-container">
        <div className="grid-row grid-row-0">
          <div className="grid-cell grid-cell-0" />
          <div className="grid-cell grid-cell-1" />
          <div className="grid-cell grid-cell-2" />
          <div className="grid-cell grid-cell-3" />
        </div>
        <div className="grid-row grid-row-1">
          <div className="grid-cell grid-cell-0" />
          <div className="grid-cell grid-cell-1" />
          <div className="grid-cell grid-cell-2" />
          <div className="grid-cell grid-cell-3" />
        </div>
        <div className="grid-row grid-row-2">
          <div className="grid-cell grid-cell-0" />
          <div className="grid-cell grid-cell-1" />
          <div className="grid-cell grid-cell-2" />
          <div className="grid-cell grid-cell-3" />
        </div>
        <div className="grid-row grid-row-3">
          <div className="grid-cell grid-cell-0" />
          <div className="grid-cell grid-cell-1" />
          <div className="grid-cell grid-cell-2" />
          <div className="grid-cell grid-cell-3" />
        </div>

        {this.state.tiles.map((tileRow, row) =>
          tileRow.map((tile, col) => {
            return this.renderTile(tile, row, col);
          })
        )}

        {this.state.deletedTiles.map(tile => (
          <Tile
            key={tile.index}
            value={tile.value}
            row={tile.endRow}
            col={tile.endCol}
            previousPosition={[tile.startRow, tile.startCol]}
          />
        ))}
      </div>
    );
  }
}

export default TileGrid;
