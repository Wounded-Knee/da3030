import React from 'react';
import CloudView from './CloudView';
import {
  Link,
} from 'react-router-dom';

class CloudDetail extends React.Component {
  render() {
    const {
      match: { params: { cloudId } },
      annuitCœptisII,
    } = this.props;
    const cloud = annuitCœptisII.getById(cloudId);

    return <CloudView
      annuitCœptisII={ annuitCœptisII }
      cloud={ cloud }
    />;
  }
};

export default CloudDetail;
