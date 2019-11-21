import React from 'react';
import {
  BrowserRouter as Router,
  NavLink,
} from 'react-router-dom';
const activeClassName = 'active';

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

  getChildNodes() {
    return this.getNode().children;
  }

  getChildNodeList() {

  }

  render() {
    if (this.state.data === undefined) {
      this.setState(this.getFreshState());
    }

    var content = null;
    const node = this.getNode();
    const author = this.props.annuitCœptis.getUserById(node.authorId);

    switch (this.props.viewMode) {
      case 0:
      break;
      default:
        content = (
          <article>
            <h1 className={ "node_type_" + node.type }>[ { node._id } ]</h1>
            <p>By: { author.name }</p>
            <input
              type="text"
              onChange={ this.handleChange }
              onBlur={ this.updateNode }
              value={ this.state.data }
            />
          </article>
        );
      break;
    }

    return (
      <Router>
        { content }
      </Router>
    );
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.match.params.nodeId !== this.props.match.params.nodeId) {
      this.setState({ data: undefined, id: undefined });
    }
    return true;
  }
};

export default Node;
