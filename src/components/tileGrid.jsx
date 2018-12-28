import React, { Component } from "react";
import "./tileGrid.css";
import Tile from "./tile.jsx";

class TileGrid extends Component {
  tileCount = 0;

  state = {
    tiles: []
  };

  constructor(props) {
    super();
    this.state.tiles = this.createInitialTileGrid();
  }

  createTile = (value, tileIndex = undefined, previousPosition = undefined) => {
    const index = tileIndex !== undefined ? tileIndex : this.tileCount++;
    return {
      index: index,
      value: value,
      canUpdate: true,
      previousPosition: previousPosition
    };
  };

  createInitialTileGrid = () => {
    let tiles = [];
    for (let row = 0; row < 4; ++row) {
      tiles.push([]);
      for (let col = 0; col < 4; ++col) {
        tiles[row].push(this.createTile(0));
      }
    }
    this.addRandomTile(tiles);
    this.addRandomTile(tiles);
    return tiles;
  };

  copyTiles = () => {
    let tilesCopy = [];
    for (let row = 0; row < this.state.tiles.length; ++row) {
      tilesCopy.push([]);
      for (let col = 0; col < this.state.tiles[row].length; ++col) {
        const tile = this.state.tiles[row][col];
        const previousPosition = [row, col];
        tilesCopy[row].push(
          this.createTile(tile.value, tile.index, previousPosition)
        );
      }
    }
    return tilesCopy;
  };

  gridsEqual = (grid1, grid2) => {
    for (let row = 0; row < grid1.length; ++row) {
      for (let col = 0; col < grid1[row].length; ++col) {
        if (grid1[row][col].value !== grid2[row][col].value) {
          return false;
        }
      }
    }
    return true;
  };

  addRandomTile = tiles => {
    while (true) {
      const row = Math.floor(Math.random() * 4);
      const column = Math.floor(Math.random() * 4);
      if (tiles[row][column].value === 0) {
        const value = Math.random() < 0.8 ? 2 : 4;
        tiles[row][column] = this.createTile(value);
        return;
      }
    }
  };

  checkLoss = () => {
    const tiles = this.state.tiles;
    for (let row = 0; row < tiles.length; ++row) {
      for (let col = 0; col < tiles[row].length; ++col) {
        if (tiles[row][col].value === 0) {
          return true;
        }
        const value = tiles[row][col];
        if (row !== 0 && tiles[row - 1][col].value === value) {
          return true;
        } else if (
          row !== tiles.length - 1 &&
          tiles[row + 1][col].value === value
        ) {
          return true;
        } else if (col !== 0 && tiles[row][col - 1] === value) {
          return true;
        } else if (
          col !== tiles[row].length - 1 &&
          tiles[row][col + 1] === value
        ) {
          return true;
        }
      }
    }
    return false;
  };

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

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeydown, false);
  }

  handleLeftClick = () => {
    let tiles = this.copyTiles();
    for (let row = 0; row < tiles.length; ++row) {
      for (let column = 0; column < tiles[row].length; ++column) {
        this.moveLeft(tiles, row, column);
      }
    }
    if (this.gridsEqual(tiles, this.state.tiles)) return;
    this.addRandomTile(tiles);
    this.setState({ tiles: tiles });
  };

  handleRightClick = () => {
    let tiles = this.copyTiles();
    for (let row = 0; row < tiles.length; ++row) {
      for (let column = tiles[row].length - 1; column >= 0; --column) {
        this.moveRight(tiles, row, column);
      }
    }
    if (this.gridsEqual(tiles, this.state.tiles)) return;
    this.addRandomTile(tiles);
    this.setState({ tiles: tiles });
  };

  handleUpClick = () => {
    let tiles = this.copyTiles();
    for (let row = 0; row < tiles.length; ++row) {
      for (let column = 0; column < tiles[row].length; ++column) {
        this.moveUp(tiles, row, column);
      }
    }
    if (this.gridsEqual(tiles, this.state.tiles)) return;
    this.addRandomTile(tiles);
    this.setState({ tiles: tiles });
  };

  handleDownClick = () => {
    let tiles = this.copyTiles();
    for (let row = tiles.length - 1; row >= 0; --row) {
      for (let column = 0; column < tiles[row].length; ++column) {
        this.moveDown(tiles, row, column);
      }
    }
    if (this.gridsEqual(tiles, this.state.tiles)) return;
    this.addRandomTile(tiles);
    this.setState({ tiles: tiles });
  };

  moveTile = (tiles, rowPrev, colPrev, rowNext, colNext) => {
    const tile = tiles[rowPrev][colPrev];
    const previousPosition =
      tile.previousPosition !== undefined
        ? tile.previousPosition
        : [rowPrev, colPrev];
    console.log("MOVING TILE! PREVIOUS POSITION:", previousPosition);
    const tileCopy = this.createTile(tile.value, tile.index, previousPosition);
    tiles[rowNext][colNext] = tileCopy;
    tiles[rowPrev][colPrev] = this.createTile(0);
  };

  moveLeft = (tiles, row, column) => {
    const adjacentRowOffset = 0;
    const adjacentColOffset = -1;
    this.moveInDirection(
      tiles,
      row,
      column,
      adjacentRowOffset,
      adjacentColOffset
    );
  };

  moveRight = (tiles, row, column) => {
    const adjacentRowOffset = 0;
    const adjacentColOffset = 1;
    this.moveInDirection(
      tiles,
      row,
      column,
      adjacentRowOffset,
      adjacentColOffset
    );
  };

  moveUp = (tiles, row, column) => {
    const adjacentRowOffset = -1;
    const adjacentColOffset = 0;
    this.moveInDirection(
      tiles,
      row,
      column,
      adjacentRowOffset,
      adjacentColOffset
    );
  };

  moveDown = (tiles, row, column) => {
    const adjacentRowOffset = 1;
    const adjacentColOffset = 0;
    this.moveInDirection(
      tiles,
      row,
      column,
      adjacentRowOffset,
      adjacentColOffset
    );
  };

  moveInDirection = (
    tiles,
    row,
    column,
    adjacentRowOffset,
    adjacentColOffset
  ) => {
    const adjacentRow = row + adjacentRowOffset;
    const adjacentCol = column + adjacentColOffset;
    if (
      adjacentRow < 0 ||
      adjacentRow > 3 ||
      adjacentCol < 0 ||
      adjacentCol > 3
    ) {
      return;
    }

    const tile = tiles[row][column];
    if (tile.value === 0) {
      return;
    }

    const adjacentTile = tiles[adjacentRow][adjacentCol];

    if (adjacentTile.value === 0) {
      this.moveTile(tiles, row, column, adjacentRow, adjacentCol);
      this.moveInDirection(
        tiles,
        adjacentRow,
        adjacentCol,
        adjacentRowOffset,
        adjacentColOffset
      );
    } else if (adjacentTile.canUpdate && adjacentTile.value === tile.value) {
      tiles[adjacentRow][adjacentCol] = this.createTile(
        tile.value * 2,
        undefined,
        tile.previousPosition
      );
      tiles[adjacentRow][adjacentCol].canUpdate = false;
      tiles[row][column] = this.createTile(0);
    }
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
          tileRow.map((tile, col) => (
            <Tile
              key={tile.index}
              value={tile.value}
              row={row}
              col={col}
              previousPosition={tile.previousPosition}
            />
          ))
        )}
      </div>
    );
  }
}

export default TileGrid;
