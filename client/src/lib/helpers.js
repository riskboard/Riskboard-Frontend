function flatten(input) {
  const stack = [...input];
  const res = [];
  while (stack.length) {
    // pop value from stack
    const next = stack.pop();
    if (Array.isArray(next)) {
      // push back array items, won't modify the original input
      stack.push(...next);
    } else {
      res.push(next);
    }
  }
  //reverse to restore input order
  return res.reverse();
}

// Return flat array of stories and include the location as a key on each story
// order by score, ascending (most negative stories first)
export function transformStoryData(storyData) {
  const {stories} = storyData;
  const flatStories = [];
  const storyUrls = [];
  Object.keys(stories).forEach((k, i) => {
    flatten(stories[k]).forEach((story, j) => {
      const shortSummary = `${story.text.slice(0,300)}...`;
      const modifiedStory = Object.assign({}, story, {location: k, id: `${i}${j+1}`, shortSummary });
      if (!storyUrls.includes(story.url)) {
        flatStories.push(modifiedStory);
        storyUrls.push(story.url);
      }
    })
  })
  const sortedFlatStories =
    flatStories.sort((a, b) => {
      if (a.score < b.score) {
        return -1;
      }
      if (a.score > b.score) {
        return 1;
      }
      return 0;
    })
  return sortedFlatStories;
}

export function groupDataByWeekNoise(data) {
  let i = 0;
  let groupedData = [];
  data.forEach((datum) => {
    if (i === 0) {
      groupedData.push([datum[0], +datum[1]+50]);
      i++;
    } else if (i === 6) {
      groupedData[groupedData.length-1][1] = groupedData[groupedData.length-1][1] + datum[1];
      i = 0;
    } else {
      groupedData[groupedData.length-1][1] = groupedData[groupedData.length-1][1] + datum[1];
      i++;
    }
  })
  return groupedData;
}

export function groupDataByWeek(data) {
  let i = 0;
  let groupedData = [];
  data.forEach((datum) => {
    if (i === 0) {
      groupedData.push([datum[0], +datum[1]]);
      i++;
    } else if (i === 6) {
      groupedData[groupedData.length-1][1] = groupedData[groupedData.length-1][1] + datum[1];
      i = 0;
    } else {
      groupedData[groupedData.length-1][1] = groupedData[groupedData.length-1][1] + datum[1];
      i++;
    }
  })
  return groupedData;
}