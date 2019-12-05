import React from 'react';
import Exposure from './Exposure';
import Slider from "react-slick";
import {
  Link,
} from 'react-router-dom';
import "react-tabs/style/react-tabs.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const NODE_TYPES = {
  NODE_TYPE_USER: 'user',
  NODE_TYPE_RESPONSE_GROUP: 'responseGroup',
  NODE_TYPE_NODE: 'node',
  NODE_TYPE_POLICY: 'policy',
  NODE_TYPE_CERTIFICATION: 'certification',
};

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
    const node = this.getNode();
    const fromUser = annuitCœptis.User.getCurrent();
    const toUser = annuitCœptis.User.getById(node.authorId);
    const subj = node.data.substring(node.data.length-20);
    const text = prompt(
      `From: ${ fromUser.name }\n`+
      `To: ${ toUser.name }\n`+
      `Subj: ... ${ subj }\n`, '');
    if (text) annuitCœptis.Node.create(text);
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
        <Exposure level={ node.exposureLevel || 0 } onChange={ this.onChangeExposure.bind(this) } />
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
      annuitCœptis,
      node,
    } = this.getMetaData();
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    if (asAncestor) return null;

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

  getMetaData() {
    const { annuitCœptis, asAncestor, setDocumentTitle, noAncestors } = this.props;
    const { User } = annuitCœptis;
    const node = this.getNode();
    const author = User.getById(node.authorId);
    const spectator = User.getCurrent();
    const parentNode = annuitCœptis.Node.getParentOf(node);
    const authorMode = spectator === author;
    const trailWardenMode = annuitCœptis.Node.getTrailhead(node).authorId === author.id;
    const [authorClass] = author.name;
    const classNames = [
      "node",
      "speech-bubble",
      trailWardenMode ? 'trailWarden' : 'noTW',
      authorMode ? 'author' : '',
      "author_"+authorClass,
    ].join(' ');
    const linkedText = asAncestor
      ? <Link to={`/node/${node._id}`} exact>{ node.text }</Link>
      : this.state.data;

    return {
      node: node,
      author: author,
      spectator: spectator,
      parentNode: parentNode,
      authorMode: authorMode,
      authorClass: authorClass,
      classNames: classNames,
      linkedText: linkedText,
      noAncestors: noAncestors,
      annuitCœptis: annuitCœptis,
      setDocumentTitle: setDocumentTitle,
      asAncestor: asAncestor,
    }
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
    } = this.getMetaData();

    if (setDocumentTitle) setDocumentTitle( node.text + ' - ' + author.name );

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

export {
  NODE_TYPES,
  Node as default
};