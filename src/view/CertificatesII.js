/**
 * Refactor Notes
 This component lists every certificate given to it.
 They go in a carousel.
 Parameters
    Obj certificates
      All
      +selected
      -selected
 Selection options:
    Selected Positive
    Selected Negative
    Unselected
 Events
    onChange
      Provides list of all selected
 UI
    Each certificate gets a single page in the carousel.
    Each page allows selection
 Applications
    Node View
      Displays which certs are enforced on this node
        For each cert, also displays +/- enforcement mode
    Node Certificate Chooser (node admin only)
      Displays all certs which can be enforced on this node
        Allows certs to be chosen to be added to enforced certs list

  We need to be able to inquire of various things from a node.
    What certificates do you have, give me the complete list of every single one?
    What certificates that you have are fully ratified by the crowd, just these ones?

 **/
import React from 'react';
import { MODEL_TYPES } from '../class/Models';
import Certificate from './Certificate';
import Slider from "react-slick";
import "react-tabs/style/react-tabs.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};

// Props: annuitCoeptisII, certificates
class CertificatesII extends React.Component {
  render() {
    const {
      annuitCoeptisII,
      certificates
    } = this.props;

    return (
      <div className="clearfix">
        {
          certificates.map(
            certificate => <Certificate
              annuitCoeptisII={ annuitCoeptisII }
              certificate={ certificate }
            />
          )
        }
      </div>
    );
  }
};

export default CertificatesII;
