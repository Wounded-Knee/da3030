import React from 'react';
import initialize from './initialize';
import UserSelector from './view/UserSelector';
import Profile from './view/Profile';
import CheatMenu from './view/CheatMenu';
import Node from './view/Node';
import {
  User,
  MODEL_TYPES,
} from './class/Models';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink,
} from 'react-router-dom';
import AnnuitCœptisII from './class/AnnuitCœptisII';
import Home from './view/Home';
import './App.css';

const activeClassName = 'active';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      renderAgain: 0,
    };

    this.annuitCœptisII = new AnnuitCœptisII({
      onChange: this.triggerRender.bind(this),
    });

    window.da = {
      ...window.da,
      app: this,
      ac2: this.annuitCœptisII,
      refresh: this.triggerRender.bind(this),
      initialize: initialize.bind(this, this.annuitCœptisII),
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

  addNodePrompt(e) {
    const text = prompt('Node name?','');

    e.preventDefault();

    if (text) {
      this.annuitCœptisII.create({
        text
      }, MODEL_TYPES.TEXT_NODE);
    }
  }

  setDocumentTitle(title) {
    document.title = title;
  }

  renderNotifications(notificationType) {
    const notifications = this.annuitCœptisII.getByModelType(notificationType);
    const qty = notifications.length;
    return qty ? <span className="count">{ qty }</span> : null;
  }

  render() {
    const currentUser = this.annuitCœptisII.getCurrentUser();
    const [ currentUserEmoji ] = currentUser.data.name;
    const currentUserName = currentUser.data.name.substring(2);
    const css = [
      ...this.annuitCœptisII.filter(user => user.getModelType() === MODEL_TYPES.USER),
      User.getAnonymous(),
    ].map(
      user => {
        const [ emoji ] = user.data.name;
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
            <CheatMenu da={ window.da } redirect={ this.redirect.bind(this) } annuitCœptisII={ this.annuitCœptisII } />
            <UserSelector annuitCœptisII={ this.annuitCœptisII } />
            <ul>
              <li title="Home" className="home">
                {/*
                  Home is where you see all the recent stuff contributed by your friends into
                  their own Home zone. We skim from your friends, and your followed entities,
                  the stuff they are posting for followers, it is all aggregated in HOME.
                */}
                { this.renderNotifications(MODEL_TYPES.HOME_NOTIFICATION) }
                <NavLink to="/" exact activeClassName={ activeClassName }>🏠</NavLink>
              </li>
              <li title="Clouds" className="clouds">
                {/*
                  Cloud is where you see a CLOUD of entities. These are your friends and your
                  followed entities, themselves. Here you can see the list of them, organized
                  geometrically. Your mom, your pastor, your buddy, your friend's dog.

                  Upon selecting an entity, you see only the stuff contributed by that entity,
                  but unlike with Home, you see ALL of it, and it's concentrated.
                */}
                { this.renderNotifications(MODEL_TYPES.CLOUD_NOTIFICATION) }
                <NavLink to="/clouds" exact activeClassName={ activeClassName }>☁️</NavLink>
              </li>
              <li title={ currentUserName } className="profile">
                {/*
                  Profile? Depends. Who's viewing it?
                    The owner of it
                      The owner sees everything he's ever posted.

                    Someone else
                      This is where your followed entities, and friends, see what you have posted
                      UP TO the boundary of the realm of privacy to which that friend / entity is party, according
                      to your own designation.
                */}
                { this.renderNotifications(MODEL_TYPES.USER_NOTIFICATION) }
                <NavLink to="/profile" exact activeClassName={ activeClassName }>{ currentUserEmoji }</NavLink>
              </li>
              <li title="Speak">
                <NavLink onClick={ this.addNodePrompt.bind(this) } to="/speak" exact activeClassName={ activeClassName }>💬</NavLink>
              </li>
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
                    annuitCœptisII={ this.annuitCœptisII }
                  />
                }
              />

{/*              <Route
                path="/clouds"
                exact
                render={
                  props => <Clouds
                    {...props}
                    annuitCœptisII={ this.annuitCœptisII }
                  />
                }
              />
              <Route
                path="/cloud/:cloudId"
                render={
                  props => <Cloud
                    {...props}
                    annuitCœptisII={ this.annuitCœptisII }
                  />
                }
              />
*/}

              <Route
                path="/profile"
                exact
                render={
                  props => <Profile
                    {...props}
                    annuitCœptisII={ this.annuitCœptisII }
                  />
                }
              />

              <Route
                path="/profile/:userId"
                render={
                  props => <Profile
                    {...props}
                    annuitCœptisII={ this.annuitCœptisII }
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
                        annuitCœptisII={ this.annuitCœptisII }
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
