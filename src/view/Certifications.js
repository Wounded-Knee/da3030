import React from 'react';

class Certifications extends React.Component {
  render() {
    const {
      annuitCœptisII,
      node
    } = this.props;
    const certifications = node.getCertifications();

    return (
      <div className="clearfix">
        {
          certificates.map(
            certificate => <Certificate
              annuitCœptisII={ annuitCœptisII }
              certificate={ certificate }
            />
          )
        }
      </div>
    );
  }
};

export default CertificatesII;
