import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import RBForceGraph from '../components/rb-force-graph.js';
import queryString from 'query-string'

import '../styles/force-graph.scss';

const forceGraphConfig = {
  person: {
    color: '#11939A'
  },
  organization: {
    color: '#11939A'
  }
}

class ForceGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actors: [],
      actorCount: 0,
      selectedActor: null,
      selectedActorDetail: null,
      selectedActorConnections: []
    };
  }

  componentDidMount() {
    const queryParams = queryString.parse(this.props.location.search);
    let actorUrl = 'http://localhost:3001/api/actors';
    actorUrl = queryParams.limit ? `${actorUrl}?limit=${queryParams.limit}`: actorUrl
    fetch(actorUrl)
      .then(res => res.json())
      .then(res => res.data)
      .then(res => { console.log(res); return res; })
      .then((data) => this.setState({ ...data }))
  }

  onActorClick = (e, actorId) => {
    e.preventDefault();
    fetch(`http://localhost:3001/api/actors/${actorId}`)
      .then(res => res.json())
      .then(res => res.data)
      .then((data) => {
        const { actor, connectedActors } = data;
        this.setState({
          selectedActor: actorId,
          selectedActorDetail: actor,
          selectedActorConnections: connectedActors 
        });
      })
  }

  onNodeClick = (e, actorId) => {
    e.preventDefault();
    fetch(`http://localhost:3001/api/actors/${actorId}`)
  }

  generateActorsList(state = this.state) {
    const { actors } = this.state;
    return actors.map((actor, i) => {
      const { name, actorType, _id } = actor;
      const { nodeColor } = forceGraphConfig[actorType].color 
      return (<li onClick={(e) => this.onActorClick(e, _id)} key={`${name}-${i}`}>{name} ({actorType})</li>);
    });
  }

  generateArticleList(state=this.state) {
    const {selectedActorDetail} = this.state;
    const selectedActorName = selectedActorDetail ? selectedActorDetail.name : "No Actor Selected";
    const selectedActorArticles = selectedActorDetail ? selectedActorDetail.articleIDs : [];
    return (
      <div className="rb-force-graph-article-list">
        <h2 className="rb-section-title">Actor Incidents: {selectedActorName}</h2>
        <ul>
          {
            selectedActorArticles.map((article, i) => {
              return (
                <li key={i} className="rb-force-graph-article">
                  <a target="_blank" href={article.url}>{article.url}</a>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }

  render() {
    const { actorCount, 
            actors,
            selectedActor, 
            selectedActorDetail, 
            selectedActorConnections} = this.state;

    return (
      <div className="rb-force-graph-page rb-page">
        <h1 className="rb-page-title">Story Explorer</h1>
        <div className="rb-actor-list">
          <h2> Number of Actors: {actorCount}</h2>
          <ul>{this.generateActorsList()}</ul>
        </div>
        <Grid fluid>
          <Row>
            <Col lg={8}>
              <div className="rb-section">
                <RBForceGraph 
                  actors={actors}
                  onActorClick={this.onActorClick}
                  selectedActor={selectedActor}
                  selectedActorDetail={selectedActorDetail}
                  selectedActorConnections={selectedActorConnections}
                />
              </div>
            </Col>
            <Col lg={4} className="rb-force-graph-article-list-column">
              {this.generateArticleList()}
            </Col>
          </Row>
        </Grid>
    </div>
  );
}

}

export default ForceGraph;
