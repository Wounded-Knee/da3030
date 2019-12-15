import React from 'react';
import Exposure from './Exposure';
import { MODEL_TYPES, User } from '../class/Models';
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
    const node = this.getNode();
    return node ? {
      data: node.get('text'),
      id: node.getId(),
      inputString: '',
      exposure: node.exposure,
    } : {};
  }

  getNode() {
    const { match: { params: { nodeId } }, annuitCœptisII } = this.props;
    return annuitCœptisII.getById(nodeId);
  }

  promptAddChildNode() {
    const { annuitCœptisII } = this.props;
    const parentNode = this.getNode();
    const fromUser = annuitCœptisII.getCurrentUser();
    const toUser = annuitCœptisII.getById(parentNode.getMetaData('authorId'));
    const subj = parentNode.getCardinalValue().substring(parentNode.getCardinalValue().length - 20);
    const text = prompt(
      `From: ${ fromUser.getCardinalValue() }\n`+
      `To: ${ toUser.getCardinalValue() }\n`+
      `Subj: ... ${ subj }\n`, '');
    if (text) annuitCœptisII.create({text}, MODEL_TYPES.TEXT_NODE).setParent(parentNode);
  }

  onChangeExposure(level) {
    this.setState({
      exposure: level,
    });
    console.log('Exposure level: ', level);
  }

  deleteNode() {
    const { annuitCœptisII } = this.props;
    if (window.confirm('Delete it?')) annuitCœptisII.Node.delete(this.getNode());
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
      annuitCœptisII,
    } = this.getMetaData();

    return parentNode && !noAncestors ? (
      <Node
        match={{ params: { nodeId: parentNode.getId() }}}
        annuitCœptisII={ annuitCœptisII }
        asAncestor
      />
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
      annuitCœptisII,
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

    console.log('Children: ', finalChildren);
    return (
      <Slider {...settings} className="clearfix">
        {
          finalChildren.map(
            node => <Node
              match={{ params: { nodeId: node.getId() }}}
              annuitCœptisII={ annuitCœptisII }
              noAncestors
              asDescendant
            />
          )
        }
      </Slider>
    );
  }

  getMetaData() {
    const { annuitCœptisII, asAncestor, asDescendant, setDocumentTitle, noAncestors } = this.props;
    const { Node, ShadowNode } = annuitCœptisII;
    const trueNode = this.getNode();

    const shadowNodeFills = {
      'catchall': {
        text: '...'
      },
      'skip': {
        text: '[skip]'
      }
    };

    switch (trueNode.data.type) {
      case 'shadowNode':
        const shadowNodeType = trueNode.data.shadowNodeType;
        const nodeText = shadowNodeFills[shadowNodeType];
        console.log('Backfilling ShadowNode.'+shadowNodeType+' with text: ', nodeText);
        var node = {
          ...trueNode,
          data: {
            ...trueNode.data,
            authorId: User.getAnonymous().id,
            ...nodeText,
          }
        };
      break;
      default:
        var node = trueNode;
      break;
    }

    var nodeText = node.getCardinalValue();
    const children = node.getChildren();
    const shadowChildren = [];
    const authorId = node.getMetaData('authorId') || -1;
    const author = authorId === -1
      ? User.getAnonymous()
      : annuitCœptisII.getById(authorId);
    const spectator = annuitCœptisII.getCurrentUser();
    const parentNode = node.getParent();
    const authorMode = spectator === author;
    const trailWardenMode = false; //annuitCœptisII.Node.getTrailhead(node).data.authorId === author.data.id;
    const authorClass = author.getCardinalValue().substring(0,2);
    const classNames = [
      "node",
      "speech-bubble",
      trailWardenMode ? 'trailWarden' : '',
      authorMode ? 'author' : '',
      "author_"+authorClass,
    ].join(' ');
    const linkedText = asAncestor || asDescendant
      ? <Link to={`/node/${node.getId()}`} exact>{ nodeText }</Link>
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
      annuitCœptisII,
      setDocumentTitle,
      asAncestor,
      asDescendant,
      children,
      shadowChildren,
    }
  }

  track() {
    this.getNode().track();
  }

  render() {
    if (!this.getNode()) {
      return <b>No Node</b>;
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
