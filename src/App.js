import React from 'react';
import UserSelector from './UserSelector';
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
import './App.css';

const activeClassName = 'active';
const HomeComponent = () => {
  return (
    <h1>Home</h1>
  );
};

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
          const lastWordsSpoken = conversation[conversation.length-1];
          this.annuitCœptis.setCurrentUser(author.id);
          conversation.push(
            this.annuitCœptis.add(words, lastWordsSpoken)
          );
        }

        // Setup users
        const userCharlie = addUser('💀 Charlie');
        const userBow = addUser('🌈 Magical Rainbow');
        const userHeyoka = addUser('🙃 ɐʞoʎǝH');

        // Set up conversations
        const charlie = [], bow = [], heyoka = [];

        // Populate nodes
        speak("Hi", charlie, userCharlie);
        speak("Hello, Charlie!", charlie, userBow);
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
      this.annuitCœptis.add(data);
    }
  }

  deleteNode(node, e) {
    e.preventDefault();
    this.annuitCœptis.delete(node);
  }

  getNodes() {
    return this.annuitCœptis.getTree().data.filter(
      node => node.type === 'node'
    );
  }

  render() {
    const nodes = this.getNodes();
    const currentUser = this.annuitCœptis.getCurrentUser() || { name: 'Anonymous' };

    return (
      <div className="App">
        <Router>
          { this.state.redirectId ? <Redirect to={ `/node/${this.state.redirectId}` } /> : null }
          <header className="App-header">
            <CheatMenu da={ window.da } annuitCœptis={ this.annuitCœptis } />
            <UserSelector annuitCœptis={ this.annuitCœptis } />
            <ul>
              <li><NavLink to="/" exact activeClassName={ activeClassName }>Home</NavLink></li>
              { nodes.map( node => <li key={ node.id } className="node">
                <NavLink to={`/node/${node._id}`} exact activeClassName={ activeClassName }>{ node.data }</NavLink>
                <button onClick={ this.deleteNode.bind(this, node) }>❌</button>
              </li> ) }
              <li><button onClick={ this.addNodePrompt.bind(this) }>💬</button></li>
            </ul>
            <span>
              { currentUser.name }
              &nbsp;
              render #{ this.state.renderAgain }
            </span>
          </header>
          <main>
            <Switch>
              <Route path="/" exact component={ HomeComponent } />
              <Route
                path="/node/:nodeId"
                render={
                  props => <Node
                    {...props}
                    redirect={ this.redirect.bind(this) }
                    annuitCœptis={ this.annuitCœptis }
                  />
                }
              />
              <Redirect to="/" />
            </Switch>
          </main>
        </Router>
      </div>
    );
  }
}

export default App;
