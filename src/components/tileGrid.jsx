import React, { Component } from "react";
import "./tileGrid.css";

class TileGrid extends Component {
  state = {
    tiles: []
  };

  constructor(props) {
    super();
    this.state.tiles = this.createInitialTileGrid();
  }

  createTile = value => {
    return {
      value: value,
      canUpdate: true
    };
  };

  createInitialTileGrid = () => {
    let tiles = [];
    for (let i = 0; i < 4; ++i) {
      tiles.push([]);
      for (let j = 0; j < 4; ++j) {
        tiles[i].push(this.createTile(0));
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
        tilesCopy[row].push(this.createTile(this.state.tiles[row][col].value));
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
        tiles[row][column].value = value;
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

  moveLeft = (tiles, row, column) => {
    if (column === 0) return;
    const value = tiles[row][column].value;
    if (tiles[row][column - 1].value === 0) {
      tiles[row][column - 1].value = value;
      tiles[row][column].value = 0;
      this.moveLeft(tiles, row, column - 1);
    } else if (
      tiles[row][column - 1].canUpdate &&
      tiles[row][column - 1].value === value
    ) {
      tiles[row][column - 1].value *= 2;
      tiles[row][column - 1].canUpdate = false;
      tiles[row][column].value = 0;
    }
  };

  moveRight = (tiles, row, column) => {
    if (column === tiles[row].length - 1) return;
    const value = tiles[row][column].value;
    if (tiles[row][column + 1].value === 0) {
      tiles[row][column + 1].value = value;
      tiles[row][column].value = 0;
      this.moveRight(tiles, row, column + 1);
    } else if (
      tiles[row][column + 1].canUpdate &&
      tiles[row][column + 1].value === value
    ) {
      tiles[row][column + 1].value *= 2;
      tiles[row][column + 1].canUpdate = false;
      tiles[row][column].value = 0;
    }
  };

  moveUp = (tiles, row, column) => {
    if (row === 0) return;
    const value = tiles[row][column].value;
    if (tiles[row - 1][column].value === 0) {
      tiles[row - 1][column].value = value;
      tiles[row][column].value = 0;
      this.moveUp(tiles, row - 1, column);
    } else if (
      tiles[row - 1][column].canUpdate &&
      tiles[row - 1][column].value === value
    ) {
      tiles[row - 1][column].value *= 2;
      tiles[row - 1][column].canUpdate = false;
      tiles[row][column].value = 0;
    }
  };

  moveDown = (tiles, row, column) => {
    if (row === tiles.length - 1) return;
    const value = tiles[row][column].value;
    if (tiles[row + 1][column].value === 0) {
      tiles[row + 1][column].value = value;
      tiles[row][column].value = 0;
      this.moveDown(tiles, row + 1, column);
    } else if (
      tiles[row + 1][column].canUpdate &&
      tiles[row + 1][column].value === value
    ) {
      tiles[row + 1][column].value *= 2;
      tiles[row + 1][column].canUpdate = false;
      tiles[row][column].value = 0;
    }
  };

  getGridCellClasses = (row, col) => {
    return "grid-cell grid-cell-" + this.state.tiles[row][col].value;
  };

  render() {
    return (
      <div className="grid-container">
        <div className="grid-row">
          <div className={this.getGridCellClasses(0, 0)}>
            {this.state.tiles[0][0].value}
          </div>
          <div className={this.getGridCellClasses(0, 1)}>
            {this.state.tiles[0][1].value}
          </div>
          <div className={this.getGridCellClasses(0, 2)}>
            {this.state.tiles[0][2].value}
          </div>
          <div className={this.getGridCellClasses(0, 3)}>
            {this.state.tiles[0][3].value}
          </div>
        </div>
        <div className="grid-row">
          <div className={this.getGridCellClasses(1, 0)}>
            {this.state.tiles[1][0].value}
          </div>
          <div className={this.getGridCellClasses(1, 1)}>
            {this.state.tiles[1][1].value}
          </div>
          <div className={this.getGridCellClasses(1, 2)}>
            {this.state.tiles[1][2].value}
          </div>
          <div className={this.getGridCellClasses(1, 3)}>
            {this.state.tiles[1][3].value}
          </div>
        </div>
        <div className="grid-row">
          <div className={this.getGridCellClasses(2, 0)}>
            {this.state.tiles[2][0].value}
          </div>
          <div className={this.getGridCellClasses(2, 1)}>
            {this.state.tiles[2][1].value}
          </div>
          <div className={this.getGridCellClasses(2, 2)}>
            {this.state.tiles[2][2].value}
          </div>
          <div className={this.getGridCellClasses(2, 3)}>
            {this.state.tiles[2][3].value}
          </div>
        </div>
        <div className="grid-row">
          <div className={this.getGridCellClasses(3, 0)}>
            {this.state.tiles[3][0].value}
          </div>
          <div className={this.getGridCellClasses(3, 1)}>
            {this.state.tiles[3][1].value}
          </div>
          <div className={this.getGridCellClasses(3, 2)}>
            {this.state.tiles[3][2].value}
          </div>
          <div className={this.getGridCellClasses(3, 3)}>
            {this.state.tiles[3][3].value}
          </div>
        </div>
      </div>
    );
  }
}

export default TileGrid;
