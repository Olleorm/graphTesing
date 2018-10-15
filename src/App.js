import React, { Component } from "react";
import Graph from "./components/Graph";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Graph canvasId="1" />
        <Graph canvasId="2" />
        <Graph canvasId="3" />
        <Graph canvasId="4" />
        <Graph canvasId="5" />
        <Graph canvasId="6" />
        <Graph canvasId="7" />
        <Graph canvasId="8" />
        <Graph canvasId="9" />
      </div>
    );
  }
}

export default App;
