import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { InteractiveForceGraph,
         ForceGraphNode,
         ForceGraphLink } from 'react-vis-force';
import ForceGraph2D from 'react-force-graph-2d';
import queryString from 'query-string'

class RBForceGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 600
    }
  }

  generateForceGraphActors(props=this.props) {
    const { actors, 
            selectedActor, 
            selectedActorConnections, 
            selectedActorDetail } = props;

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

  generateForceGraph(state=this.state) {
    const { width } = state;
    console.log(width);
    return (
        <ForceGraph2D 
          ref={el => { this.fg = el; }}
          width={width || 800}
          graphData={this.generateForceGraphActors()}
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
    );  
  }

  // componentDidMount() {
  //   const { width } = this.fgContainer.getBoundingClientRect();
  //   console.log(width);
  //   this.setState({ width });
  // }

  componentDidUpdate(prevProps, prevState) {
    const { width } = this.fgContainer.getBoundingClientRect();
    if (prevState && prevState.width !== width) {
      this.setState({ width })
    }
    this.fg.zoom(1);
    this.fg.centerAt(0,0);
  }

  render() {
    return (
      <div className="rb-force-graph-container" 
        ref={el => { this.fgContainer = el; }
      }>
        { this.generateForceGraph() }
      </div>
    );
  }
}

RBForceGraph.defaultProps = {
  actors: [],
  actorCount: 0,
  selectActor: null,
  selectedActorDetail: null,
  selectedActorConnections: [],
};

export default RBForceGraph;
