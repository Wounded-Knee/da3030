import React from 'react';
import {
  Link,
} from 'react-router-dom';

class CloudView extends React.Component {
  render() {
    const {
      match: { params: { cloudId } },
      annuitCœptis,
      asChip,
    } = this.props;
    const { Cloud } = annuitCœptis;
    const { external, internal, id } = Cloud.getById(cloudId);
    const topProps = asChip ? {
      className: 'cloud'
    } : {
      id: 'cloud'
    }

    return (
      <div { ...topProps }>
        <Link to={`/cloud/${id}`}>{ external.name }</Link>
      </div>
    );
  }
};

export default CloudView;
