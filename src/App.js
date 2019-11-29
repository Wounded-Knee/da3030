import React from 'react';
import UserSelector from './UserSelector';
import Profile from './Profile';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink,
} from 'react-router-dom';
import Node from './Node';
import AnnuitCœptis from './AnnuitCœptis';
import CheatMenu from './CheatMenu';
import Home from './Home';
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
      initialize: function() {
        this.annuitCœptis.setTree({ data: [] }); // Erase everything

        const addUser = username => {
          const newUser = this.annuitCœptis.addUser(username);
          console.log('Added user: ', newUser);
          return newUser;
        }

        const speak = (words, conversation, author) => {
          var newWordsSpoken;
          const lastWordsSpoken = conversation[conversation.length-1];
          this.annuitCœptis.setCurrentUser(author.id);
          newWordsSpoken = this.annuitCœptis.addNewNode(words);
          if (lastWordsSpoken) newWordsSpoken = this.annuitCœptis.move(newWordsSpoken, lastWordsSpoken);
          conversation.push(
            newWordsSpoken
          );
        }

        // Setup users
        const userCharlie = addUser('💀 Charlie');
        const userBow = addUser('🌈 Magical Rainbow');
        const userHeyoka = addUser('🙃 ɐʞoʎǝH');
        const userNorNor = addUser('🦄 Nor Nor');
        const userBodhi = addUser('💩 Donald Trump');
        const userInigo = addUser('💸 Money Man');

        // Set up conversations
        const charlie = [], bow = [], heyoka = [];

        // Populate nodes
        speak("Hi", charlie, userCharlie);
        speak("Hello, Charlie!", charlie, userBow);

        speak("Crazy Things in Bed Tonight", heyoka, userHeyoka);
        speak("yeah... I am excited for that, and I'm sorry but I told Charlie that you were rambling during poker game tonight he might have a worse opinion of you now, you better tell him your version of what happend", heyoka, userBow);
      }.bind(this),
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
      this.annuitCœptis.addNewNode(data);
    }
  }

  setDocumentTitle(title) {
    document.title = title;
  }

  render() {
    const currentUser = this.annuitCœptis.getCurrentUser() || { name: 'Anonymous' };
    const css = this.annuitCœptis.getUsers().map(
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
              <li><NavLink to="/" exact activeClassName={ activeClassName }>Home</NavLink></li>
              <li><NavLink to="/profile" exact activeClassName={ activeClassName }>{ currentUser.name }</NavLink></li>
              <li><button onClick={ this.addNodePrompt.bind(this) }>💬</button></li>
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
                  props => <Node
                    {...props}
                    setDocumentTitle={ this.setDocumentTitle.bind(this) }
                    redirect={ this.redirect.bind(this) }
                    annuitCœptis={ this.annuitCœptis }
                  />
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
