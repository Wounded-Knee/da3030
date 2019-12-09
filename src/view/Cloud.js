import React from 'react';
import {
  Link,
} from 'react-router-dom';

class CloudView extends React.Component {
  getName() {
    return this.getStuff().cloud.data.external.name;
  }

  getId() {
    return this.getStuff().cloud.data.id;
  }

  getDescription() {
    return this.getStuff().cloud.data.external.description;
  }

  getStuff() {
    const {
      match: { params: { cloudId } },
      annuitCœptis,
      asChip,
    } = this.props;
    const { Cloud } = annuitCœptis;
    const cloud = Cloud.getById(cloudId);

    return {
      Cloud,
      annuitCœptis,
      cloud,
      asChip,
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
