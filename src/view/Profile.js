import React from 'react';
import Node from './Node';
import { MODEL_TYPES } from '../class/Models';

class Profile extends React.Component {
  render() {
    const { annuitCœptisII, match } = this.props;
    const userId = parseInt(match.params.userId);
    const mirrorMode = Number.isNaN(userId);
    const user = userId
      ? annuitCœptisII.getById(userId)
      : annuitCœptisII.getCurrentUser();
    if (!user) throw new Error(`No user found for ID #${userId}. Can't render profile.`);
    const userNodes = user.getModels(node => node.getModelType() === MODEL_TYPES.TEXT_NODE);
    window.da = {
      ...window.da,
      user: user,
    };

    return (
      <div id="profile" className="clearfix">
        <div className="nodeList clearfix">
          { userNodes.map( node => (
            <Node match={{ params: { nodeId: node.getId() }}} annuitCœptisII={ annuitCœptisII } asAncestor noAncestors />
          ))}
        </div>
      </div>
    );
  }
};

export default Profile;
