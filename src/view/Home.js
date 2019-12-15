import React from 'react';
import Node from './Node';
import Cloud from './Cloud';

class Home extends React.Component {
  render() {
    const { annuitCœptisII } = this.props;
    const nodes = annuitCœptisII.getTrailheads();
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
                <li key={ node.getId() } className="node">
                  <Node match={{ params: { nodeId: node.getId() }}} annuitCœptisII={ annuitCœptisII } asAncestor />
                </li>
            )
          }
        </ul>
      </>
    );
  }
};

export default Home;
