import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { InteractiveForceGraph,
         ForceGraphNode,
         ForceGraphLink } from 'react-vis-force';
import ForceGraph2D from 'react-force-graph-2d';
import queryString from 'query-string'

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
      actorCount: 0,
      selectActor: null,
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

  generateForceGraph(state=this.state) {
    const { actors, 
            selectedActor, 
            selectedActorConnections, 
            selectedActorDetail } = this.state;

    let actorNodes = [];
    let actorLinks = [];        

    if (selectedActor) {
      actorNodes.push(
        { 
          id: `${selectedActorDetail.name}`,
          name: selectedActorDetail.name, 
          group: 1
        }
      );
      for (let i = 0; i < selectedActorConnections.length; i++) {
        const { name } = selectedActorConnections[i];
        actorNodes.push({ 
          id: `${name}-${i}`,
          name: name, 
          group: 2
        })
        actorLinks.push({
          source: selectedActorDetail.name, 
          target: `${name}-${i}`, 
          value: 1
        })
      }
    } else {
      actorNodes = actors.map((actor, i) => {
        return { 
          id: `${actor.name}-${i}`,
          name: actor.name, 
          group: 1
        }
      });
    }


      return {
        nodes: actorNodes || [{ id: 0 }],
        links: actorLinks
      }
  }

  // generateForceGraph(state = this.state) {
  //   const { actors, 
  //           selectedActor, 
  //           selectedActorDetail, 
  //           selectedActorConnections } = this.state;

  //   if (selectedActor) {
  //     console.log(selectedActorConnections);
  //     console.log(selectedActorDetail);
  //     const nodeArray = [<ForceGraphNode key={`${selectedActorDetail.name}`} node={{ id: `${selectedActorDetail.name}`, radius: 7 }} fill="#47d3d9" />];
  //     for (let i = 0; i < selectedActorConnections.length; i++) {
  //       const { name } = selectedActorConnections[i];
  //       nodeArray.push(<ForceGraphNode key={`${name}-${i}`} node={{ id: `${name}-${i}`, radius: 7 }} fill="#47d3d9" />)
  //       nodeArray.push(<ForceGraphLink key={`${name}-${i}`} strokeWidth={1} link={{ source: selectedActorDetail.name, target:`${name}-${i}` }} />,)
  //     }
  //     return nodeArray;
  //   }

  //   return actors.map((actor, i) => {
  //     const { name, actorType } = actor;
  //     const { nodeColor } = forceGraphConfig[actorType].color 
  //     return (<ForceGraphNode key={`${name}-${i}`} node={{ id: `${name}-${i}`, radius: 7 }} fill={nodeColor} />);
  //   });
  // }

  generateActorsList(state = this.state) {
    const { actors } = this.state;
    return actors.map((actor, i) => {
      const { name, actorType, _id } = actor;
      const { nodeColor } = forceGraphConfig[actorType].color 
      return (<li onClick={(e) => this.onActorClick(e, _id)} key={`${name}-${i}`}>{name} ({actorType})</li>);
    });
  }
  componentDidUpdate() {
    this.fg.zoom(0.5);
  }

  render() {
    const {actorCount} = this.state;
    console.log(this.generateForceGraph());
    return (
      <div className="rb-force-graph-page rb-page">
        <h1 className="rb-page-title">Story Explorer</h1>
        <div className="rb-actor-list">
          <h2> Number of Actors: {actorCount}</h2>
          <ul>{this.generateActorsList()}</ul>
        </div>
        <Grid fluid>
          <ForceGraph2D 
            ref={el => { this.fg = el; }}
            graphData={this.generateForceGraph()}
            width={985}
            nodeAutoColorBy="group"
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.name;
              const fontSize = 14/globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
              ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
              ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = 'black';
              ctx.fillText(label, node.x, node.y);
            }} 
          />
        </Grid>
      </div>
    );
  }


  // render() {
  //   const {actorCount} = this.state;
  //   return (
  //     <div className="rb-force-graph-page rb-page">
  //       <h1 className="rb-page-title">Story Explorer</h1>
  //       <div className="rb-actor-list">
  //         <h2> Number of Actors: {actorCount}</h2>
  //         <ul>{this.generateActorsList()}</ul>
  //       </div>
  //       <Grid fluid>
  //         <InteractiveForceGraph simulationOptions={{ animate: true, alpha: 1 }}>
  //           {this.generateForceGraph()}
  //         </InteractiveForceGraph>
  //       </Grid>
  //     </div>
  //   );
  // }
}

ForceGraph.defaultProps = {
  assets: [],
  stories: []
};

export default ForceGraph;
