import React from 'react';
import { NODE_TYPES } from '../class/Node';
import Node from './Node';
import Cloud from './Cloud';

class Home extends React.Component {
  getUserClouds() {
    const { annuitCœptis } = this.props;
    const { Cloud: CloudManager, User } = annuitCœptis;
    const { getByUserEligibility } = CloudManager;
    const currentUser = User.getCurrent();

    return (
      <>
        {
          CloudManager.getByUserEligibility(currentUser).map(
            cloud => <Cloud match={{ params: { cloudId: cloud.id }}} annuitCœptis={ annuitCœptis } asChip />
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
