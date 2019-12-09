import React from 'react';
import Cloud from './Cloud';

class Home extends React.Component {
  render() {
    const { annuitCœptis } = this.props;
    const { Cloud: CloudManager, User } = annuitCœptis;
    const { getByUserEligibility } = CloudManager;
    const currentUser = User.getCurrent();

    return (
      <ul className="cloudList clearfix">
        {
          CloudManager.getByUserEligibility(currentUser).map(
            cloud =>
              <Cloud
                match={{ params: { cloudId: cloud.data.id }}}
                annuitCœptis={ annuitCœptis }
                asChip
              />
          )
        }
      </ul>
    );
  }
};

export default Home;
