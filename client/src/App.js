import React, { Component } from 'react';
import RBHeader from './components/rb-header.js';
import RiskHome from './partials/risk-home.js';
import ForceGraph from './partials/force-graph.js';
import IncidentDetail from './partials/incident-detail.js';
import supplyChainData from './data/supply-chain-data.json';
import { SharedStoriesProvider } from './contexts/stories-context.js';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Grid, Row, Col } from 'react-flexbox-grid';
import 'normalize.css';
import './App.scss';


const {assets} = supplyChainData;
class App extends Component {
  render() {
    return (
      <Router basename="/RiskBoardDemo">
        <SharedStoriesProvider>
          <div className="RBApp rb-container">
            <RBHeader />
            <Grid fluid>
              <Row>
                <Col className="rb-no-margin-col" lg={2}>
                  <div className="rb-side-section">
                    <ul className="rb-sidebar-menu">
                      <li><a href="#"><span className="fa fa-home"/>Analytics</a></li>
                      <li><a href="#"><span className="fa fa-users"/>Profile</a></li>
                      <li><a href="#"><span className="fa fa-cog"/>Settings</a></li>
                      <li><a href="#">Response Records</a></li>
                    </ul>
                  </div>
                </Col>
                <Col className="rb-no-margin-col" lg={10}>
                  <div className="rb-main-section">
                    <Route exact path="/" render={(props)=> <RiskHome assets={assets} />} />
                    <Route path="/incidents" component={IncidentDetail} />
                    <Route path="/force-graph" component={ForceGraph} />
                  </div>
                </Col>
              </Row>
            </Grid>
          </div>
        </SharedStoriesProvider>
      </Router>
    );
  }
}

export default App;
