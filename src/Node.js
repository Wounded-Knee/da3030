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

    this.handleChange = this.handleChange.bind(this);
    this.updateNode = this.updateNode.bind(this);
    this.state = this.getFreshState();
  }

  getFreshState() {
    return { data: this.getNode().data, id: this.getNode()._id };
  }

  getUrl() {
    return this.props.match.url;
  }

  getNode() {
    const { match: { params: { nodeId } }, annuitCœptis } = this.props;
    return annuitCœptis.find(nodeId);
  }

  handleChange(e) {
    console.log('handleChange');
    this.setData(e.target.value);
  }

  updateNode(e) {
    this.props.annuitCœptis.update(this.getNode()._id, this.state.data);
  }

  setData(data) {
    if (this.state.data !== data) {
      this.setState({ data: data });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.match.params.nodeId !== this.props.match.params.nodeId) {
      this.setState({ data: undefined, id: undefined });
    }
    return true;
  }

  render() {
    if (this.state.data === undefined) {
      this.setState(this.getFreshState());
    }

    return (
      <Router>
        <article>
          <h1>[ { this.getNode()._id } ]</h1>
          <input
            type="text"
            onChange={ this.handleChange }
            onBlur={ this.updateNode }
            value={ this.state.data }
          />

          <Switch>
            <Route
              path={`${this.getUrl()}/:nodeId`}
              render={
                props => <Node
                  { ...props }
                  annuitCœptis={ this.props.annuitCœptis }
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
