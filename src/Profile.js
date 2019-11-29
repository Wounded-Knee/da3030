import React from 'react';
import { default as Node, NODE_TYPES } from './Node';
import {
  Link,
} from 'react-router-dom';

class Profile extends React.Component {
  render() {
    const { annuitCœptis } = this.props;
    const userId = this.props.match.params.userId;
    const user = userId ? annuitCœptis.getUserById(userId) : annuitCœptis.getCurrentUser();
    if (!user) return null;

    const userNodes = annuitCœptis.filter(
      node =>
        node.type === NODE_TYPES.NODE_TYPE_NODE
        && node.authorId === user.id
    );
    window.da = {
      ...window.da,
      user: user,
    };

    return (
      <div id="profile" class="clearfix">

        <h2>Your Nodes</h2>
        <div class="nodeList clearfix">
          { userNodes.map( node => (
            <Node match={{ params: { nodeId: node._id }}} annuitCœptis={ annuitCœptis } asAncestor noAncestors />
          ))}
        </div>

        <h2>Your Cohorts</h2>
        <p>Unknown</p>

      </div>
    );
  }
};

export default Profile;
