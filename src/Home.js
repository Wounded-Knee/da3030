import React from 'react';
import { NODE_TYPES } from './Node';
import Node from './Node';
import CloudView from './CloudView';

class Home extends React.Component {
  getUserClouds() {
    const { annuitCœptis } = this.props;
    const { Cloud, User } = annuitCœptis;
    const { getByUserEligibility } = Cloud;
    const currentUser = User.getCurrent();

    return (
      <>
        {
          Cloud.getByUserEligibility(currentUser).map(
            cloud => <CloudView match={{ params: { cloudId: cloud.id }}} annuitCœptis={ annuitCœptis } asChip />
          )
        }
      </>
    );
  }

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
                </li>
            )
          }

          { this.getUserClouds() }
        </ul>
      </>
    );
  }
};

export default Home;
