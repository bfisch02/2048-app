import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import TileGrid from "./components/tileGrid.jsx";
import Score from "./components/score.jsx";

class App extends Component {
  state = {
    score: 0,
    lastIncrement: 0
  };

  handleIncrementScore = value => {
    console.log(value);
    const score = this.state.score + value;
    this.setState({ score: score, lastIncrement: value });
  };

  render() {
    return (
      <div className="app">
        <div className="header">
          <h1 className="title">2048</h1>
          <div className="score">
            <Score
              score={this.state.score}
              increment={this.state.lastIncrement}
            />
          </div>
        </div>
        <div className="grid">
          <TileGrid onIncrementScore={this.handleIncrementScore} />
        </div>
      </div>
    );
  }
}

export default App;
