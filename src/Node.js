import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink,
} from 'react-router-dom';

class Node extends React.Component {
  constructor(props) {
    super(props);

    const {match: { params: { nodeId }, url }, annuitCœptis } = props;
    this.node = annuitCœptis.find(nodeId);
    this.state = {data: this.node.data};

    this.handleChange = this.handleChange.bind(this);
    this.updateNode = this.updateNode.bind(this);
  }

  handleChange(e) {
    this.setState({ data: e.target.value });
  }

  updateNode(e) {
    this.props.annuitCœptis.update(this.node._id, this.state.data);
  }

  render() {
    const {match: { params: { nodeId }, url }, annuitCœptis } = this.props;

    return (
      <Router>
        <article>
          <h1>[ { nodeId } ]</h1>
          <input type="text" onChange={ this.handleChange } onBlur={ this.updateNode } value={ this.state.data } />

          <Switch>
            <Route
              path={`${url}/:nodeId`}
              render={
                props => <Node
                  { ...props }
                  annuitCœptis={ annuitCœptis }
                />
              }
            />
          </Switch>
        </article>
      </Router>
    );
  }
};

export default Node;
