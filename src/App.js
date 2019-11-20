import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

const HomeComponent = () => {
  return (
    <h1>Home</h1>
  );
};

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <main>
          <Router>
            <Switch>
              <Route path="/" exact component={ HomeComponent } />
            </Switch>
          </Router>
        </main>
      </div>
    );
  }
}

export default App;
