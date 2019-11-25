import React from 'react';
import {
  Link,
} from 'react-router-dom';

class Home extends React.Component {
  deleteNode(node, e) {
    const { annuitCœptis } = this.props;
    e.preventDefault();
    if (window.confirm('Delete it?')) annuitCœptis.delete(node);
  }

  render() {
    const { annuitCœptis } = this.props;
    const nodes = annuitCœptis.getTree().data.filter(
      node => node.type === 'node'
    );

    return (
      <ul>
        {
          nodes.map(
            node =>
              <li key={ node.id } className="node">
                <Link to={`/node/${node._id}`} exact>{ node.data }</Link>
                <button onClick={ this.deleteNode.bind(this, node) }>❌</button>
              </li>
          )
        }
      </ul>
    );
  }
};

export default Home;
