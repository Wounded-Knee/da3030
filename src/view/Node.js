import React from 'react';
import Exposure from './Exposure';
import {
  MODEL_TYPES,
  EVENT_TYPES,
  User
} from '../class/Models';
import Slider from "react-slick";
import Certifications from './Certifications';
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
    if (window.confirm('Delete it?')) this.getNode().delete();
  }

  manageCertificates() {}

  showTracks() {
    const { annuitCœptisII } = this.props;
    alert(
      this
        .getNode()
        .getEventsByType(EVENT_TYPES.TRACK)
        .map(
          event => {
            const user = annuitCœptisII.getById(event.userId);
            return `${user.represent()}\t${event.date}`;
          }
        )
        .join('\n')
    );
  }

  showCertificates() {
    const { annuitCœptisII } = this.props;
    const node = this.getNode();
    node.getActiveCertificates();
  }

  getControls() {
    const {
      asDescendant,
      asAncestor,
      annuitCœptisII,
      node,
      authorMode,
      author,
    } = this.getMetaData();

    return [
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
      },
      {
        name: 'Tracks',
        display: '👣',
        hint: 'Displays this node\'s tracks',
        action: this.showTracks.bind(this),
        visible: false,
      },
      {
        name: 'View Certificates',
        display: '🛡',
        hint: 'Displays this node\'s certificates',
        action: this.showCertificates.bind(this),
        visible: false,
      },
      {
        name: 'Certificates',
        display: '🛡',
        hint: 'Manage certificate requirements',
        action: () => <CertificatesII
          parentNode={ node } annuitCœptisII={ annuitCœptisII }/>,
        toggle: true,
        visible: false && authorMode && !asAncestor && !asDescendant,
      },
    ];
  }

  activateControl(name) {
    this.setState({
      activeControl: name === this.state.activeControl ? undefined : name
    });
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
      asAncestor,
      asDescendant,
      author,
      linkedText,
      annuitCœptisII,
      classNames,
    } = this.getMetaData();
    const instrument = this.state.activeControl
      ? this.getControls().filter(
          control => control.name === this.state.activeControl
        )[0]
      : undefined;
    if (instrument && !instrument.toggle) {
      this.setState({
        activeControl: undefined
      });
    }
    const certifications = annuitCœptisII.getByModelType(MODEL_TYPES.CERTIFICATE).map(
      certificate => {
        return {
          certificate,
          node: this.getNode(),
          for: [],
          against: [],
        };
      }
    );

    return (
      <article className={ classNames }>
        <div className="content">{ linkedText }</div>
        <div className="controls">
          <span className="buttons">
            {
              this.getControls().map(
                control => (
                  control.visible
                    ? <button
                        title={ control.hint }
                        onClick={ this.activateControl.bind(this, control.name) }>
                          { control.display }
                      </button>
                    : null
                )
              )
            }
          </span>
          <Certifications
            annuitCœptisII={ annuitCœptisII }
            node={ node }
          />
          { /*
          <Exposure level={ node.data.exposureLevel || 0 } onChange={ this.onChangeExposure.bind(this) } />
          */ }
        </div>
        { instrument ? (
          <div className="instrumentPanel">
            { instrument.action() }
          </div>
        ) : null}
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
    } = this.getMetaData();
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    if (asAncestor || asDescendant) return null;

    return (
      <Slider {...settings} className="clearfix">
        {
          children.map(
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
    const {
      annuitCœptisII,
      asAncestor,
      asDescendant,
      setDocumentTitle,
      noAncestors
    } = this.props;

    const node = this.getNode();
    var nodeText = node.getCardinalValue();
    const children = node.getChildren();
    const authorId = node.getMetaData('authorId') !== undefined
      ? node.getMetaData('authorId')
      : User.getAnonymous().getId();
    const author = authorId === User.getAnonymous().getId()
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
    }
  }

  track() {
    this.getNode().track();
  }

  render() {
    if (!this.getNode() || this.getNode().isDeleted()) {
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
