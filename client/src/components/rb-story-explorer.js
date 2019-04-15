import React, { Component } from 'react';
import {Link} from "react-router-dom";
import '../styles/rb-story-explorer.scss';

class RBStoryExplorer extends Component {
  getStorySelection(stories, selectedLocation) {
    return selectedLocation ?
      stories
        .filter((story) => { return story.locationName.toLowerCase() === selectedLocation; }) 
        .slice(0, 10) :
      stories.slice(0, 5);

  }

  renderFilteredStories(props=this.props) {
    const {stories, selectedLocation} = props;
    const filteredStories = this.getStorySelection(stories, selectedLocation)
    return filteredStories.map((story, i) => {
      return (
        <li key={i}><Link to={`/incidents?incident=${story.id}`}><span className="rb-capitalize">{story.location}</span> Story {i + 1}</Link>: {story.shortSummary}</li>
      );
    })
  }

  render() {
    const {stories, selectedLocation} = this.props;
    return (
      <div className="rb-story-explorer-wrapper">
        <div className="rb-story-list">
          <h2 className="rb-section-title">Story List</h2>
          <ul>
            {this.renderFilteredStories()}
          </ul>
        </div>
      </div>
    );
  }
}

RBStoryExplorer.defaultProps = {
  stories: [],
  selectedLocation: ''
};

export default RBStoryExplorer;
