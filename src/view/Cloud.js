import React from 'react';
import {
  Link,
} from 'react-router-dom';

class CloudView extends React.Component {
  getName() {
    return this.getStuff().dataNode.external.name;
  }

  getId() {
    return this.getStuff().dataNode.id;
  }

  getDescription() {
    return this.getStuff().dataNode.external.description;
  }

  getStuff() {
    const {
      match: { params: { cloudId } },
      annuitCœptis,
      asChip,
    } = this.props;
    const { Cloud } = annuitCœptis;
    const dataNode = Cloud.getById(cloudId);

    return {
      Cloud: Cloud,
      annuitCœptis: annuitCœptis,
      dataNode: dataNode,
      asChip: asChip,
    }
  }

  render() {
    const topProps = this.getStuff().asChip ? {
      className: 'cloud'
    } : {
      id: 'cloud'
    }

    return (
      <div { ...topProps }>
        <Link to={`/cloud/${ this.getId() }`}>{ this.getName() }</Link>
        { !this.getStuff().asChip ? (
            this.getDescription()
          ) : (
            null
        )}
      </div>
    );
  }
};

export default CloudView;
