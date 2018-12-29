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

  copyTiles = () => {
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
    let tiles = this.copyTiles();
    let deletedTiles = [];
    let moveOccurred = false;
    if (processTilesInReverse) {
      for (let row = tiles.length - 1; row >= 0; --row) {
        for (let column = tiles[row].length - 1; column >= 0; --column) {
          moveOccurred =
            this.moveInDirection(
              tiles,
              deletedTiles,
              row,
              column,
              rowOffset,
              colOffset
            ) || moveOccurred;
        }
      }
    } else {
      for (let row = 0; row < tiles.length; ++row) {
        for (let column = 0; column < tiles[row].length; ++column) {
          moveOccurred =
            this.moveInDirection(
              tiles,
              deletedTiles,
              row,
              column,
              rowOffset,
              colOffset
            ) || moveOccurred;
        }
      }
    }
    if (!moveOccurred) return;
    this.addRandomTile(tiles);
    this.setState({ tiles: tiles, deletedTiles: deletedTiles });
  };

  moveTile = (tiles, fromRow, fromCol, toRow, toCol) => {
    tiles[toRow][toCol] = tiles[fromRow][fromCol];
    tiles[fromRow][fromCol] = undefined;
  };

  outOfBounds(row, col) {
    return row < 0 || row > 3 || col < 0 || col > 3;
  }

  moveInDirection = (
    tiles,
    deletedTiles,
    row,
    column,
    adjacentRowOffset,
    adjacentColOffset
  ) => {
    const adjacentRow = row + adjacentRowOffset;
    const adjacentCol = column + adjacentColOffset;
    if (this.outOfBounds(adjacentRow, adjacentCol)) {
      return false;
    }

    const tile = tiles[row][column];
    if (!tile) {
      return false;
    }

    const adjacentTile = tiles[adjacentRow][adjacentCol];

    if (!adjacentTile) {
      this.moveTile(tiles, row, column, adjacentRow, adjacentCol);
      this.moveInDirection(
        tiles,
        deletedTiles,
        adjacentRow,
        adjacentCol,
        adjacentRowOffset,
        adjacentColOffset
      );
      return true;
    } else if (adjacentTile.canUpdate && adjacentTile.value === tile.value) {
      deletedTiles.push({
        index: tile.index,
        value: tile.value,
        startRow: tile.previousPosition[0],
        endRow: adjacentRow,
        startCol: tile.previousPosition[1],
        endCol: adjacentCol
      });
      deletedTiles.push({
        index: adjacentTile.index,
        value: adjacentTile.value,
        startRow: adjacentTile.previousPosition[0],
        endRow: adjacentRow,
        startCol: adjacentTile.previousPosition[1],
        endCol: adjacentCol
      });
      tiles[adjacentRow][adjacentCol] = this.createTile(tile.value * 2);
      tiles[adjacentRow][adjacentCol].canUpdate = false;
      tiles[row][column] = undefined;
      return true;
    }
    return false;
  };

  getTileHtml = (tile, row, col) => {
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
            return this.getTileHtml(tile, row, col);
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
