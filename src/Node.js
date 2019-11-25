import React from 'react';
import {
  BrowserRouter as Router,
  NavLink,
} from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
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
    if (this.typeahead) this.typeahead.clear();
    return {
      data: this.getNode().data,
      id: this.getNode()._id,
      inputString: '',
    };
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
    if (text === undefined) return false;
    console.log('addChildNode ', text);
    const { annuitCœptis } = this.props;
    const newNode = annuitCœptis.add(
      text,
      this.getNode()
    );
    return newNode;
  }

  promptAddChildNode() {
    const text = prompt('Say what?', '');
    if (text) this.addChildNode(text);
  }

  submitForm() {
    const { annuitCœptis, redirect } = this.props;
    const { inputString } = this.state;
    const selectedOption = annuitCœptis.filter( node => node.type === 'node' && node.text === inputString );
    var _id;

    if (!selectedOption.length) {
      _id = this.addChildNode(inputString)._id;
    } else {
      [{ _id }] = selectedOption;
    }
    redirect(_id);
  }

  onChange(selected) {
    var inputString;
    switch(typeof selected) {
      case 'object':
        if (selected.length) {
          [ inputString ] = selected;
        }
      break;
      case 'string':
        inputString = selected;
      break;
    }
    this.setState({inputString: inputString});
  }

  render() {
    if (this.state.data === undefined) {
      this.setState(this.getFreshState());
    }

    var content = null;
    const { annuitCœptis, asAncestor } = this.props;
    const node = this.getNode();
    const author = annuitCœptis.getUserById(node.authorId);
    const spectator = annuitCœptis.getCurrentUser();
    const parentNode = annuitCœptis.getParentNode(node);
    const authorMode = spectator === author;

    switch (this.props.viewMode) {
      case 0:
      break;
      default:
        content = (
          <>
            { parentNode ? (
              <NavLink to={`/node/${parentNode._id}`} exact activeClassName={ activeClassName }>
                <Node match={{ params: { nodeId: parentNode._id }}} annuitCœptis={ annuitCœptis } asAncestor />
              </NavLink>
            ) : null }
            <article>
                <p>
                  <span title={ node._id }>
                    { author.name }:&nbsp;
                  </span>
                  { this.state.data }
                </p>

                { !asAncestor ?
                  <>
                    <Typeahead
                      id="nope"
                      multiple={ author === spectator }
                      emptyLabel={ false }
                      onKeyDown={ e => {
                        if ( author !== spectator && e.keyCode === 13 ) {
                          console.log('keyDown && submit ', e.keyCode);
                          this.submitForm();
                        }
                      } }
                      labelKey="text"
                      ref={(typeahead) => this.typeahead = typeahead}
                      options={ this.getChildNodeList().map( node => node.text ) }
                      onInputChange={ this.onChange.bind(this) }
                      onChange={ this.onChange.bind(this) }
                    />

                    { authorMode ?
                      <ul>
                        {
                          this.getChildNodeList().map(
                            (node, index) => <NavLink to={`/node/${node._id}`} exact activeClassName={ activeClassName }>
                              <li key={ index }>{ annuitCœptis.getUserById(node.authorId).name }: { node.data }</li>
                            </NavLink>
                          )
                        }
                      </ul>
                    : null }
                  </>
                : null }
            </article>
          </>
        );
      break;
    }

    return content;
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.match.params.nodeId !== this.props.match.params.nodeId) {
      this.setState({ data: undefined, id: undefined });
    }
    return true;
  }
};

export default Node;
