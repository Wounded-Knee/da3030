import React from 'react';
import Cloud from './Cloud';
import Exposure from './Exposure';
import Slider from "react-slick";
import {
  BrowserRouter as Router,
  Link,
} from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const NODE_TYPES = {
  NODE_TYPE_USER: 'user',
  NODE_TYPE_RESPONSE_GROUP: 'responseGroup',
  NODE_TYPE_NODE: 'node',
};
const activeClassName = 'active';

class Node extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.updateNode = this.updateNode.bind(this);
    this.promptAddChildNode = this.promptAddChildNode.bind(this);
    this.state = this.getFreshState();

    window.da = {
      ...window.da,
      Node: [ ...(window.da.Node || []), this],
    };
  }

  getFreshState() {
    if (this.typeahead) this.typeahead.clear();
    return {
      data: this.getNode().data,
      id: this.getNode()._id,
      inputString: '',
      exposure: this.getNode().exposure,
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

  /**
   * For the moment, this only updates the data (aka "text") of the node.
   * The underlying taxonomy library does not permit update() to
   * modify any of the other attributes of the node. So, I will have to
   * hack a workaround into annuitCœptis to accomodate changes to a node's
   * other attributes such as Exposure Level, etc.
   **/
  updateNode(e) {
    this.props.annuitCœptis.update(this.getNode()._id, this.state.data);
  }

  setData(data) {
    if (this.state.data !== data) {
      this.setState({ data: data });
    }
  }

  getChildNodeList() {
    return this.getNode().children;
  }

  getResponseGroups() {
    //return this.annuitCœptis.
  }

  addChildNode(text) {
    if (text === undefined) return false;
    console.log('addChildNode ', text);
    const { annuitCœptis } = this.props;
    const newNode = annuitCœptis.addNewNode(
      text,
      this.getNode()
    );
    return newNode;
  }

  promptAddChildNode() {
    const { annuitCœptis } = this.props;
    const node = this.getNode();
    const fromUser = annuitCœptis.getCurrentUser();
    const toUser = annuitCœptis.getUserById(node.authorId);
    const subj = node.data.substring(node.data.length-20);
    const text = prompt(
      `From: ${ fromUser.name }\n`+
      `To: ${ toUser.name }\n`+
      `Subj: ... ${ subj }\n`, '');
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

  onChangeExposure(level) {
    this.setState({
      exposure: level,
    });
    console.log('Exposure level: ', level);
  }

  deleteNode() {
    const { annuitCœptis } = this.props;
    if (window.confirm('Delete it?')) annuitCœptis.delete(this.getNode());
  }

  getControls(node, authorMode, author) {
    const controls = [
      {
        name: 'Delete',
        display: '❌',
        hint: 'Delete this node',
        action: this.deleteNode.bind(this),
        visible: authorMode,
      },
      {
        name: 'Reply',
        display: '💭',
        hint: 'Reply to this node',
        action: this.promptAddChildNode.bind(this),
        visible: !authorMode,
      }
    ];

    return (
      <div class="controls">
        <span class="buttons">
          {
            controls.map(
              control => (
                control.visible ? <button title={ control.hint } onClick={ control.action }>{ control.display }</button> : null
              )
            )
          }
        </span>
        <span class="author">
          { author.name }
        </span>
        <Exposure level={ node.exposureLevel || 0 } onChange={ this.onChangeExposure.bind(this) } />
      </div>
    );
  }

  getCarousel() {
    const { annuitCœptis } = this.props;
    const node = this.getNode();
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <Slider {...settings} className="clearfix">
        {
          node.children.map(
            node => <Node
              match={{ params: { nodeId: node._id }}}
              annuitCœptis={ annuitCœptis }
              noAncestors
              asAncestor
            />
          )
        }
      </Slider>
    );
  }

  render() {
    if (this.state.data === undefined) {
      this.setState(this.getFreshState());
      return null;
    }

    const { annuitCœptis, asAncestor, setDocumentTitle, noAncestors } = this.props;
    const node = this.getNode();
    const author = annuitCœptis.getUserById(node.authorId);
    const spectator = annuitCœptis.getCurrentUser();
    const parentNode = annuitCœptis.getParentNode(node);
    const authorMode = spectator === author;
    const [authorClass] = author.name;
    const classNames = [
      "node",
      "speech-bubble",
      authorMode ? 'author' : '',
      "author_"+authorClass,
    ].join(' ');
    const linkedText = asAncestor
      ? <Link to={`/node/${node._id}`} exact>{ this.state.data }</Link>
      : this.state.data;

    if (setDocumentTitle) setDocumentTitle( author.name + ': ' + node.text );

    return (
      <>
        { parentNode && !noAncestors ? (
          <Node match={{ params: { nodeId: parentNode._id }}} annuitCœptis={ annuitCœptis } asAncestor />
        ) : null }

        {/* Speech Bubble */}
        <article className={ classNames }>
          { linkedText }
          { this.getControls( node, authorMode, author ) }
        </article>

        { !asAncestor ? this.getCarousel() : null }

        {/* Cloud 
        { !asAncestor ?
          <Cloud node={ node } annuitCœptis={ annuitCœptis } authorMode />
        : null }
        */}

      </>
    );
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.match.params.nodeId !== this.props.match.params.nodeId) {
      this.setState({ data: undefined, id: undefined });
    }
    return true;
  }
};

export {
  NODE_TYPES,
  Node as default
};