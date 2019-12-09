import React from 'react';
import { NODE_TYPES } from '../class/AbstractNode';
import Node from './Node';
import Cloud from './Cloud';

class Home extends React.Component {
  render() {
    const { annuitCœptis } = this.props;
    const nodes = annuitCœptis.Node.getTrailheads();
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
                <li key={ node.data.id } className="node">
                  <Node match={{ params: { nodeId: node._id }}} annuitCœptis={ annuitCœptis } asAncestor />
                </li>
            )
          }
        </ul>
      </>
    );
  }
};

export default Home;
