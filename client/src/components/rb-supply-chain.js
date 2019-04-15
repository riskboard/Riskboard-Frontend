import React, { Component } from 'react';
import '../styles/rb-supply-chain.scss';

/**
supplyChainData = [
  {
    location:[{
        locationName: "Location",
        coordinates: { lat: 0, long: 0 }
      },..
    ]
    assets: "Asset Name",
    value: "int",
    description: "description text",
  } ...
];
**/

class RBSupplyChain extends Component {
  render() {
    const {assets} = this.props;
    return (
      <div className="rb-supply-chain-wrapper">
        <div className="rb-supply-list">
          <h2 className="rb-section-title">Supply Chain</h2>
          <ul>
            {assets.map((asset, i) => {
              const assetName = asset.assetName;
              const locationName = asset.location[0].locationName;
              return (
                <li key={i}>
                  <i className="fas fa-caret-right rb-list-icon"></i>
                  {`${locationName} - ${assetName}`}
                </li>);
            })}
          </ul>
        </div>
      </div>
    );
  }
}

RBSupplyChain.defaultProps = {
  assets: []
};

export default RBSupplyChain;
