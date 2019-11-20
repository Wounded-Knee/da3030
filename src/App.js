import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink,
} from 'react-router-dom';
import './App.css';

const activeClassName = 'active';
const HomeComponent = () => {
  return (
    <h1>Home</h1>
  );
};

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <header className="App-header">
            <ul>
              <li><NavLink to="/" exact activeClassName={ activeClassName }>Home</NavLink></li>
            </ul>
          </header>
          <main>
            <Switch>
              <Route path="/" exact component={ HomeComponent } />
              <Redirect to="/" />
            </Switch>
          </main>
        </Router>
      </div>
    );
  }
}

export default App;
