import React from 'react';
import { MODEL_TYPES } from '../class/Models';

class Certificate extends React.Component {
  render() {
    const { annuitCœptisII, certificate } = this.props;

    return (
      <article class="certificate">
        { certificate.get('emoji') }
      </article>
    );
  }
};

export default Certificate;
