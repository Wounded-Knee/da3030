import React from 'react';

/**
 * Provides UI for user to choose an exposure level
 **/
class Exposure extends React.Component {
  constructor(props) {
    super(props);
    const { level } = this.props;

    this.state = {
      level: level,
    };
  }

  onChange(e) {
    const { onChange } = this.props;
    const level = e.target.value;

    onChange(level);

    this.setState({
      level: level,
    });
  }

  render() {
    return <input
      className="exposure"
      onChange={ this.onChange.bind(this) }
      size="1"
      maxlength="1"
      type="text"
      placeholder="Exposure Level"
      value={ this.state.level }
    />;
  }
};

export default Exposure;
