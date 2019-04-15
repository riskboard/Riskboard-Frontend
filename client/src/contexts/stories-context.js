import React, { Component } from 'react';
import storiesData from '../data/stories.json';
import { transformStoryData } from '../lib/helpers.js';

const SharedStoriesContext = React.createContext();

export class SharedStoriesProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: transformStoryData(storiesData),
    };
  }

  getStoryDetail = id => {
    console.log(id);
    return this.state.stories.filter((story) => { return story.id === id; })[0];
  }

  getStoriesForSameLocation = location => {
    return this.state.stories.filter((story) => {return story.location === location; })
  }


  render() {
    const { children } = this.props;
    const { stories } = this.state;

    return (
      <SharedStoriesContext.Provider
        value={{
          stories,
          getStoryDetail: this.getStoryDetail,
          getStoriesForSameLocation: this.getStoriesForSameLocation
        }}
      >
        {children}
      </SharedStoriesContext.Provider>
    );
  }
}

export const SharedStoriesConsumer = SharedStoriesContext.Consumer;
