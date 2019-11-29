import React from 'react';
import { NODE_TYPES } from './Node';
import Node from './Node';
import {
  Link,
} from 'react-router-dom';

class Home extends React.Component {
  render() {
    const { annuitCœptis } = this.props;
    const nodes = annuitCœptis.getTree().data.filter(
      node => node.type === NODE_TYPES.NODE_TYPE_NODE
    );
    window.da = {
      ...window.da,
      homeNodes: nodes,
    };

    return (
      <>
        <input type="text" placeholder="Speak" />
        <ul className="nodeList clearfix">
          {
            nodes.map(
              node =>
                <li key={ node.id } className="node">
                  <Node match={{ params: { nodeId: node._id }}} annuitCœptis={ annuitCœptis } asAncestor />
                  { /*
                  <button onClick={ this.deleteNode.bind(this, node) }>❌</button>
                  */ }
                </li>
            )
          }
        </ul>
      </>
    );
  }
};

export default Home;
