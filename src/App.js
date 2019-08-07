import React, { Component } from 'react';
import './App.css';
import SampleComponent from "./components/SampleComponent";

class App extends Component {
  render() {
    return (
      <div className="App">
          <h2>Chat bot</h2>
           <SampleComponent />
      </div>
    );
  }
}

export default App;
