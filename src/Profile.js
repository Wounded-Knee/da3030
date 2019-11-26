import React from 'react';
import { default as Node, NODE_TYPES } from './Node';
import {
  Link,
} from 'react-router-dom';

class Profile extends React.Component {
  render() {
    const { annuitCœptis } = this.props;
    const user = annuitCœptis.getCurrentUser();
    const userNodes = annuitCœptis.filter( node => node.type === NODE_TYPES.NODE_TYPE_NODE && node.authorId === user.id );
    window.da = {
      ...window.da,
      user: user,
    };

    return (
      <div id="profile" class="clearfix">
        <h2>{ user.name }</h2>
        <h3>Nodes</h3>
        { userNodes.map( node => (
          <Node match={{ params: { nodeId: node._id }}} annuitCœptis={ annuitCœptis } asAncestor noAncestors />
        ))}
      </div>
    );
  }
};

export default Profile;
