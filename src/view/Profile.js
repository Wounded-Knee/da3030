import React from 'react';
import Cloud from './Cloud';
import Node from './Node';

class Profile extends React.Component {
  render() {
    const { annuitCœptis, match } = this.props;
    const userId = parseInt(match.params.userId);
    const mirrorMode = Number.isNaN(userId);
    const user = userId ? annuitCœptis.User.getById(userId) : annuitCœptis.User.getCurrent();
    if (!user) {
      console.error('No user found for ID#'+userId+'. Cant render profile.');
      return null;
    }
    const userNodes = annuitCœptis.Node.getByAuthorId(user.id);
    const userClouds = annuitCœptis.Cloud.getByContributorId(user.id);
    const ownerLanguage = mirrorMode ? 'Your' : user.name+"'s";
    window.da = {
      ...window.da,
      user: user,
    };

    return (
      <div id="profile" className="clearfix">

        <h2>{ ownerLanguage } Nodes</h2>
        <div className="nodeList clearfix">
          { userNodes.map( node => (
            <Node match={{ params: { nodeId: node.getId() }}} annuitCœptis={ annuitCœptis } asAncestor noAncestors />
          ))}
        </div>

        <h2>Clouds { ownerLanguage } Has Contributed</h2>
        <div className="cloudList clearfix">
          { userClouds.map( cloud => (
            <Cloud match={{ params: { cloudId: cloud.id }}} annuitCœptis={ annuitCœptis } asChip />
          ))}
        </div>
      </div>
    );
  }
};

export default Profile;
