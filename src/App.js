import React from 'react';
import initialize from './initialize';
import UserSelector from './view/UserSelector';
import Profile from './view/Profile';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink,
} from 'react-router-dom';
import Node from './view/Node';
import AnnuitCœptis from './class/AnnuitCœptis';
import CheatMenu from './view/CheatMenu';
import Cloud from './view/Cloud';
import Home from './view/Home';
import './App.css';

const activeClassName = 'active';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      renderAgain: 0,
    };

    this.annuitCœptis = new AnnuitCœptis({
      onChange: this.triggerRender.bind(this),
    });

    window.da = {
      ...window.da,
      app: this,
      annuitCœptis: this.annuitCœptis,
      initialize: initialize.bind(this, this.annuitCœptis),
    };
  }

  redirect(id) {
    this.setState({
      ...this.state,
      redirectId: id
    });
  }

  triggerRender() {
    this.setState({
      ...this.state,
      renderAgain: this.state.renderAgain + 1,
    });
  }

  addNodePrompt() {
    const data = prompt('Node name?','');
    if (data) {
      this.annuitCœptis.Node.create(data);
    }
  }

  setDocumentTitle(title) {
    document.title = title;
  }

  render() {
    const currentUser = this.annuitCœptis.User.getCurrent() || { name: 'Anonymous' };
    const [ currentUserEmoji ] = currentUser.name;
    const currentUserName = currentUser.name.substring(2);
    const css = this.annuitCœptis.User.getAll().map(
      user => {
        const [ emoji ] = user.name;
        return (`
          article.node.author_${emoji}:before {
            content: '${emoji}';
          }
        `)
      }
    ).join('\n');

    return (
      <div className="App">
        <style>{ css }</style>
        <Router>

          { this.state.redirectId ? <Redirect to={ `/node/${this.state.redirectId}` } /> : null }

          <header className="App-header">
            <CheatMenu da={ window.da } redirect={ this.redirect.bind(this) } annuitCœptis={ this.annuitCœptis } />
            <UserSelector annuitCœptis={ this.annuitCœptis } />
            <ul>
              <li title="Home"><NavLink to="/" exact activeClassName={ activeClassName }>🏠</NavLink></li>
              <li title={ currentUserName }><NavLink to="/profile" exact activeClassName={ activeClassName }>{ currentUserEmoji }</NavLink></li>
              <li title="Speak"><button onClick={ this.addNodePrompt.bind(this) }>💬</button></li>
            </ul>
          </header>

          <main>
            <Switch>

              <Route
                path="/"
                exact
                render={
                  props => <Home
                    {...props}
                    redirect={ this.redirect.bind(this) }
                    annuitCœptis={ this.annuitCœptis }
                  />
                }
              />

              <Route
                path="/cloud/:cloudId"
                render={
                  props => <Cloud
                    {...props}
                    annuitCœptis={ this.annuitCœptis }
                  />
                }
              />

              <Route
                path="/profile"
                exact
                render={
                  props => <Profile
                    {...props}
                    annuitCœptis={ this.annuitCœptis }
                  />
                }
              />

              <Route
                path="/profile/:userId"
                render={
                  props => <Profile
                    {...props}
                    annuitCœptis={ this.annuitCœptis }
                  />
                }
              />

              <Route
                path="/node/:nodeId"
                render={
                  props => <ul className="nodeList">
                    <li>
                      <Node
                        {...props}
                        setDocumentTitle={ this.setDocumentTitle.bind(this) }
                        redirect={ this.redirect.bind(this) }
                        annuitCœptis={ this.annuitCœptis }
                      />
                    </li>
                  </ul>
                }
              />

              <Redirect to="/" />

            </Switch>
          </main>

          <footer>
            <small>
              render #{ this.state.renderAgain }
            </small>
          </footer>
        </Router>
      </div>
    );
  }
}

export default App;
