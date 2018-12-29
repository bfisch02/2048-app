import React, { Component } from "react";
import "./tile.css";

class Tile extends Component {
  getGridTileClasses = (value, row, col, previousPosition = undefined) => {
    const gridTileClass = "grid-tile";
    const gridTileValueClass = "grid-tile-" + value;
    const gridTileRowClass = "grid-tile-row-" + row;
    const gridTileColClass = "grid-tile-col-" + col;

    let classString =
      gridTileClass +
      " " +
      gridTileValueClass +
      " " +
      gridTileRowClass +
      " " +
      gridTileColClass;

    if (previousPosition !== undefined) {
      const gridTilePrevRowClass = "grid-tile-from-row-" + previousPosition[0];
      const gridTilePrevColClass = "grid-tile-from-col-" + previousPosition[1];
      if (row !== previousPosition[0]) {
        classString += " " + gridTilePrevRowClass;
      } else if (col !== previousPosition[1]) {
        classString += " " + gridTilePrevColClass;
      }
    } else {
      classString += " grid-tile-new";
    }
    return classString;
  };

  render() {
    return (
      <div
        className={this.getGridTileClasses(
          this.props.value,
          this.props.row,
          this.props.col,
          this.props.previousPosition
        )}
      >
        {this.props.value}
      </div>
    );
  }
}

export default Tile;
