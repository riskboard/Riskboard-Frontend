import React, {PureComponent} from 'react';

export default class RBPin extends PureComponent {

  render() {
    const { text, 
            value } = this.props;
    return (
      <div>
        <div className="rb-popup-title">{text}</div>
        <div className="rb-popup-value">{value}</div>
      </div>
    );
  }
}