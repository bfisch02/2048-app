import React, { Component } from "react";
import "./tile.css";

class Tile extends Component {
  getGridCellClasses = value => {
    return "grid-cell grid-cell-" + value;
  };

  render() {
    return (
      <div className={this.getGridCellClasses(this.props.value)}>
        {this.props.value}
      </div>
    );
  }
}

export default Tile;
