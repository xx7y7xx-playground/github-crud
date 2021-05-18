import React from "react";

import makeOctokitHelpers from "./octokitHelpers";
import makeGithubHelpers from "./githubHelpers";

export default class PlayGround extends React.Component {
  state = {
    value: "",
  };

  octokitHelpers = makeOctokitHelpers();
  githubHelpers = makeGithubHelpers();

  handleChange = (event) => {
    this.state({ value: event.target.value });
  };

  render() {
    return (
      <div>
        <input value={this.state.value} onChange={this.handleChange}></input>
        <div>
          <button onClick={this.octokitHelpers.createOrUpdateFileContents}>
            createOrUpdateFileContents
          </button>
        </div>
        <div>
          <button onClick={this.octokitHelpers.getContent}>
            list files in dir
          </button>
        </div>
        <div>
          <button onClick={this.githubHelpers.getContent}>
            GitHub_REST_API.getContent
          </button>
        </div>
        <div>
          <button onClick={this.githubHelpers.createOrUpdateFileContents}>
            GitHub_REST_API.createOrUpdateFileContents
          </button>
        </div>
      </div>
    );
  }
}
