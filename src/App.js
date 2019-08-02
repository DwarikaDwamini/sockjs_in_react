import React, { Component } from 'react';
import './App.css';
import SampleComponent from "./components/SampleComponent";

class App extends Component {

    constructor(props){
        super(props);
    }

  render() {
    return (
      <div className="App">
          <h2>Welcome to Chat Mate</h2>
           <SampleComponent />
      </div>
    );
  }
}

export default App;
