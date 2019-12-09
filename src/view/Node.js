import React from 'react';
import Exposure from './Exposure';
import { NODE_TYPES } from '../class/AbstractNode';
import Slider from "react-slick";
import {
  Link,
} from 'react-router-dom';
import "react-tabs/style/react-tabs.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class Node extends React.Component {
  constructor(props) {
    super(props);

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

  getNode() {
    const { match: { params: { nodeId } }, annuitCœptis } = this.props;
    return annuitCœptis.Node.find(nodeId);
  }

  promptAddChildNode() {
    const { annuitCœptis } = this.props;
    const parentNode = this.getNode();
    const fromUser = annuitCœptis.User.getCurrent();
    const toUser = annuitCœptis.User.getById(parentNode.data.authorId);
    const subj = parentNode.data.text.substring(parentNode.data.text.length - 20);
    const text = prompt(
      `From: ${ fromUser.data.name }\n`+
      `To: ${ toUser.data.name }\n`+
      `Subj: ... ${ subj }\n`, '');
    if (text) annuitCœptis.Node.create(text, parentNode);
  }

  onChangeExposure(level) {
    this.setState({
      exposure: level,
    });
    console.log('Exposure level: ', level);
  }

  deleteNode() {
    const { annuitCœptis } = this.props;
    if (window.confirm('Delete it?')) annuitCœptis.Node.delete(this.getNode());
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
        display: '💬',
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
        <Exposure level={ node.data.exposureLevel || 0 } onChange={ this.onChangeExposure.bind(this) } />
      </div>
    );
  }

  renderAncestralNodes() {
    const {
      parentNode,
      noAncestors,
      annuitCœptis,
    } = this.getMetaData();

    return parentNode && !noAncestors ? (
      <Node match={{ params: { nodeId: parentNode._id }}} annuitCœptis={ annuitCœptis } asAncestor />
    ) : null;
  }

  renderCurrentNode() {
    const {
      node,
      authorMode,
      author,
      linkedText,
      classNames,
    } = this.getMetaData();

    return (
      <article className={ classNames }>
        { linkedText }
        { this.getControls( node, authorMode, author ) }
      </article>
    );
  }

  renderDescendantNodes() {
    const {
      asAncestor,
      asDescendant,
      annuitCœptis,
      node,
      children,
      authorMode,
      shadowChildren,
    } = this.getMetaData();
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    const finalChildren = authorMode ? [ ...shadowChildren, ...children ] : children;

    if (asAncestor || asDescendant) return null;

    return (
      <Slider {...settings} className="clearfix">
        {
          finalChildren.map(
            node => <Node
              match={{ params: { nodeId: node._id }}}
              annuitCœptis={ annuitCœptis }
              noAncestors
              asDescendant
            />
          )
        }
      </Slider>
    );
  }

  getMetaData() {
    const { annuitCœptis, asAncestor, asDescendant, setDocumentTitle, noAncestors } = this.props;
    const { User, Node, ShadowNode } = annuitCœptis;
    const trueNode = this.getNode();
    const anonymousUser = {
      data: {
        id: -1,
        name: '👤 Anonymous',
      }
    };

    switch (trueNode.data.type) {
      case 'shadowNode':
        var node = {
          ...trueNode,
          data: {
            ...trueNode.data,
            authorId: anonymousUser.id,
            text: '...',
          }
        };
      break;
      default:
        var node = trueNode;
      break;
    }

    var nodeText = node.data.text;
    const children = Node.getChildrenOf(node);
    const shadowChildren = ShadowNode.getChildrenOf(node);
    const author = node.data.authorId === anonymousUser.id
      ? anonymousUser
      : User.getById(node.data.authorId);
    const spectator = User.getCurrent();
    const parentNode = annuitCœptis.Node.getParentOf(node);
    const authorMode = spectator === author;
    const trailWardenMode = annuitCœptis.Node.getTrailhead(node).data.authorId === author.data.id;
    const regularNodeType = node.data.type === NODE_TYPES.NODE_TYPE_NODE;
    const authorClass = author.data.name.substring(0,2);
    const classNames = [
      "node",
      "speech-bubble",
      trailWardenMode ? 'trailWarden' : 'noTW',
      authorMode ? 'author' : '',
      "author_"+authorClass,
    ].join(' ');
    const linkedText = asAncestor || asDescendant
      ? <Link to={`/node/${node._id}`} exact>{ nodeText }</Link>
      : nodeText;

    return {
      node,
      author,
      spectator,
      parentNode,
      authorMode,
      authorClass,
      classNames,
      linkedText,
      noAncestors,
      annuitCœptis,
      setDocumentTitle,
      asAncestor,
      asDescendant,
      children,
      shadowChildren,
    }
  }

  track() {
    const { annuitCœptis } = this.props;

    annuitCœptis.Track.userAddTrack(this.getNode(), annuitCœptis.User.getCurrent());
  }

  render() {
    if (this.state.data === undefined) {
      this.setState(this.getFreshState());
      return null;
    }

    const {
      node,
      author,
      setDocumentTitle,
      asAncestor,
      asDescendant,
    } = this.getMetaData();

    if (!asAncestor && !asDescendant) this.track();
    if (setDocumentTitle) setDocumentTitle( node.data.text + ' - ' + author.data.name );


    return (
      <>
        { this.renderAncestralNodes() }
        { this.renderCurrentNode() }
        { this.renderDescendantNodes() }
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

export default Node;
