import React from 'react';
import { MODEL_TYPES } from '../class/Models';
import CloudView from './CloudView';

class Home extends React.Component {
  render() {
    const { annuitCœptisII } = this.props;
    const { User } = annuitCœptisII;

    return (
      <ul className="cloudList clearfix">
        {
          annuitCœptisII.getByModelType(MODEL_TYPES.CLOUD).map(
            cloud =>
              <CloudView
                cloud={ cloud }
                annuitCœptisII={ annuitCœptisII }
                asChip
              />
          )
        }
      </ul>
    );
  }
};

export default Home;
