import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink,
} from 'react-router-dom';
import Node from './Node';
import AnnuitCœptis from './AnnuitCœptis';
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
    };
  }

  triggerRender() {
    console.log('triggerRender');
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

  render() {
    const nodes = this.annuitCœptis.getTree().data;
    console.log('Rendering '+nodes.length+' nodes');

    return (
      <div className="App">
        <Router>
          <header className="App-header">
            <ul>
              <li><NavLink to="/" exact activeClassName={ activeClassName }>Home</NavLink></li>
              { nodes.map( node => <li key={ node.id } className="node">
                <NavLink to={`/node/${node._id}`} exact activeClassName={ activeClassName }>{ node.data }</NavLink>
                <button onClick={ this.deleteNode.bind(this, node) }>❌</button>
              </li> ) }
              <li><button onClick={ this.addNodePrompt.bind(this) }>+</button></li>
            </ul>
            <span>Render #{ this.state.renderAgain }</span>
          </header>
          <main>
            <Switch>
              <Route path="/" exact component={ HomeComponent } />
              <Route
                path="/node/:nodeId"
                render={
                  props => <Node
                    {...props}
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
