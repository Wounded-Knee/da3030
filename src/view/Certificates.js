import React from 'react';
import { MODEL_TYPES } from '../class/Models';
import Certificate from './Certificate';

class Certificates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfo: false,
      showCertificates: !this.props.parentNode,
      showToggle: false,
      nodeCertificates: this.props.parentNode ? this.props.parentNode.getCertificates() : [],
      selectedCert: undefined,
    };
  }

  certifyNode(certificate) {
    const { parentNode } = this.props;
    if (!parentNode) return false;
    const hasCert = parentNode.hasCertificate(certificate);
    return this.setState({
      nodeCertificates: hasCert
        ? parentNode.decertifyWith(certificate)
        : parentNode.certifyWith(certificate)
    });
  }

  onSelectCertificate(certificate, e) {
    const secondClick = certificate === this.state.selectedCert;

    if (secondClick) {
      this.certifyNode(certificate);
    }
    return this.setState({
      selectedCert: secondClick ? undefined : certificate      
    });
  }

  toggleShowCertificates() {
    this.setState({
      showCertificates: !this.state.showCertificates
    });
  }

  render() {
    const { annuitCœptisII } = this.props;
    const { showCertificates, selectedCert, showInfo, showToggle } = this.state;
    const certificates = annuitCœptisII.getByModelType(
      MODEL_TYPES.CERTIFICATE
    );
    const nodeIsCertifiedWith = certificate => {
      const { parentNode } = this.props;
      return parentNode ? parentNode.hasCertificate(certificate) : false;
    };

    return (
      <div className={ 'certificates ' + (showInfo ? 'showInfo' : '') }>
        <ul>
          { showCertificates || !showToggle ? (
            certificates
              .map(
                certificate =>
                  <li
                    key={ certificate.getId() }
                    className={
                      (selectedCert === certificate ? 'selected ' : '') +
                      (nodeIsCertifiedWith(certificate) ? 'certified' : '')
                    }
                    onClick={ this.onSelectCertificate.bind(this, certificate) }
                    title={
                      selectedCert === certificate
                        ? 'Click again to select'
                        : certificate.get('name')
                    }
                  >
                    <Certificate certificate={ certificate } annuitCœptisII={ annuitCœptisII } />
                  </li>
              )
          ) : null }
          { showToggle ? (
            <li
              onClick={ this.toggleShowCertificates.bind(this) }
              title="Certificates"
            >🛡</li>
          ) : null }
        </ul>

        { (showCertificates || !showToggle) && selectedCert ? (
          <article>
            <h1>{ selectedCert.get('name') }</h1>
            <h2>{ selectedCert.get('title') }</h2>
            <h3>{ selectedCert.get('subtitle') }</h3>
            <p>{ selectedCert.get('redux') }</p>
          </article>
        ) : null }
      </div>
    );
  }
};

export default Certificates;
