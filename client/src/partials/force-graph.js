import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { InteractiveForceGraph,
         ForceGraphNode,
         ForceGraphLink } from 'react-vis-force';
import '../styles/force-graph.scss';
// const tenChildren = [
//   <ForceGraphNode node={{ id: 'first-node', radius: 5 }} fill="#11939A" />,
//   <ForceGraphNode node={{ id: 'second-node', radius: 10 }} fill="#47d3d9" />,
//   <ForceGraphNode node={{ id: 'third-node', radius: 15 }} fill="#11939A" />,
//   <ForceGraphNode node={{ id: 'fourth-node', radius: 15 }} fill="#47d3d9" />,
//   <ForceGraphNode node={{ id: 'fifth-node', radius: 5 }} fill="#11939A" />,
//   <ForceGraphNode node={{ id: 'sixth-node', radius: 15 }} fill="#47d3d9" />,
//   <ForceGraphNode node={{ id: 'seventh-node', radius: 10 }} fill="#11939A" />,
//   <ForceGraphNode node={{ id: 'eighth-node', radius: 5 }} fill="#47d3d9" />,
//   <ForceGraphNode node={{ id: 'ninth-node', radius: 5 }} fill="#11939A" />,
//   <ForceGraphNode node={{ id: 'tenth-node', radius: 5 }} fill="#47d3d9" />,
//   <ForceGraphLink link={{ source: 'first-node', target: 'second-node' }} />,
//   <ForceGraphLink link={{ source: 'third-node', target: 'second-node' }} />,
//   <ForceGraphLink link={{ source: 'third-node', target: 'fourth-node' }} />,
//   <ForceGraphLink link={{ source: 'fifth-node', target: 'fourth-node' }} />,
//   <ForceGraphLink link={{ source: 'fifth-node', target: 'fourth-node' }} />,
//   <ForceGraphLink link={{ source: 'sixth-node', target: 'fourth-node' }} />,
//   <ForceGraphLink link={{ source: 'seventh-node', target: 'fourth-node' }} />,
//   <ForceGraphLink link={{ source: 'eighth-node', target: 'fourth-node' }} />,
//   <ForceGraphLink link={{ source: 'ninth-node', target: 'tenth-node' }} />,
//   <ForceGraphLink link={{ source: 'tenth-node', target: 'fifth-node' }} />,
// ];

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
      actorCount: 0
    };
  }

  componentDidMount() {
    fetch('http://localhost:3001/api/actors')
      .then(res => res.json())
      .then(res => res.data)
      .then((data) => this.setState({ ...data }))
  }

  generateForceGraph(state = this.state) {
    const { actors } = this.state;

    return actors.map((actor, i) => {
      const { name, actorType } = actor;
      const { nodeColor } = forceGraphConfig[actorType].color 
      return (<ForceGraphNode key={`${name}-${i}`} node={{ id: `${name}-${i}`, radius: 7 }} fill={nodeColor} />);
    });
  }

  generateActorsList(state = this.state) {
    const { actors } = this.state;
    return actors.map((actor, i) => {
      const { name, actorType } = actor;
      const { nodeColor } = forceGraphConfig[actorType].color 
      return (<li key={`${name}-${i}`}>{name} ({actorType})</li>);
    });
  }

  render() {
    const {actorCount} = this.state;
    return (
      <div className="rb-force-graph-page rb-page">
        <h1 className="rb-page-title">Story Explorer</h1>
        <div className="rb-actor-list">
          <h2> Number of Actors: {actorCount}</h2>
          <ul>{this.generateActorsList()}</ul>
        </div>
        <Grid fluid>
          <InteractiveForceGraph simulationOptions={{ animate: true }}>
            {this.generateForceGraph()}
          </InteractiveForceGraph>
        </Grid>
      </div>
    );
  }
}

ForceGraph.defaultProps = {
  assets: [],
  stories: []
};

export default ForceGraph;
