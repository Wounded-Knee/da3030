import React from 'react';
import {
  Link,
} from 'react-router-dom';

class CloudView extends React.Component {
  getGuts() {
    const { asChip, cloud } = this.props;
    const userIsEligible = (Math.floor(Math.random() * 2) == 0);
    const userIsEnrolled = userIsEligible && (Math.floor(Math.random() * 2) == 0);

    return (
      <>
        <Link to={`/cloud/${ cloud.getId() }`}>{ cloud.get('name') }</Link>
        { !asChip ? (
            <>
              <p>{ cloud.get('description') }</p>
              <p>You are{ userIsEnrolled ? '' : ' not' } enrolled.</p>
              <p>You are{ userIsEligible ? '' : ' not' } eligible.</p>
            </>
          ) : (
            null
        )}
      </>
    );
  }

  render() {
    const { asChip } = this.props;
    const topProps = asChip ? {
      className: 'cloud'
    } : {
      id: 'cloud'
    }

    return (
      <li { ...topProps }>
        { this.getGuts() }
      </li>
    );
  }
};

export default CloudView;
