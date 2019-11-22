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
    this.promptAddChildNode = this.promptAddChildNode.bind(this);
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
    return this.getNode().children;
  }

  addChildNode(text) {
    const { annuitCœptis } = this.props;
    const newNode = annuitCœptis.add(
      text,
      this.getNode()
    );
  }

  promptAddChildNode() {
    const text = prompt('Say what?', '');
    if (text) this.addChildNode(text);
  }

  render() {
    if (this.state.data === undefined) {
      this.setState(this.getFreshState());
    }

    var content = null;
    const { annuitCœptis } = this.props;
    const node = this.getNode();
    const author = annuitCœptis.getUserById(node.authorId);
    const spectator = annuitCœptis.getCurrentUser();
    const parentNode = annuitCœptis.getParentNode(node);

    switch (this.props.viewMode) {
      case 0:
      break;
      default:
        content = (
          <>
            { parentNode ? <Node match={{ params: { nodeId: parentNode._id }}} annuitCœptis={ annuitCœptis } suppressReply /> : null }
            <article>
              { author === spectator && false ? (
                <input
                  type="text"
                  onChange={ this.handleChange }
                  onBlur={ this.updateNode }
                  value={ this.state.data }
                />
              ) : (
                <>
                  <p>
                    <span title={ node._id }>
                      { author.name }:&nbsp;
                    </span>
                    { this.state.data }
                  </p>

                  { this.props.suppressReply ? null :
                    <p>
                      { spectator.name }:&nbsp;
                      <button onClick={ this.promptAddChildNode }>💬</button>
                    </p>
                  }

                  { this.props.suppressReply ? null :
                    <ul>
                      {
                        this.getChildNodeList().map(
                          (node, index) => <NavLink to={`/node/${node._id}`} exact activeClassName={ activeClassName }>
                            <li key={ index }>{ annuitCœptis.getUserById(node.authorId).name }: { node.data }</li>
                          </NavLink>
                        )
                      }
                    </ul>
                  }
                </>
              )}
            </article>
          </>
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
