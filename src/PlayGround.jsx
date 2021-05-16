import React from "react";
import { Octokit } from "@octokit/rest";
import { Base64 } from "js-base64";

const owner = "d3vinc-playground";
const repo = "tmp";
const path = "test2.md";

async function fileExist(octokit, path) {
  try {
    await octokit.repos.getContents({
      method: "HEAD",
      owner,
      repo,
      path,
    });
    // file exists
    return true;
  } catch (error) {
    if (error.status === 404) {
      // file does not exist
      return false;
    } else {
      // handle connection errors
    }
  }
}

// https://swizec.com/blog/using-javascript-to-commit-to-github-codewithswiz-7/
async function getSHA(octokit, path) {
  const result = await octokit.repos.getContent({
    owner,
    repo,
    path,
  });

  const sha = result?.data?.sha;

  return sha;
}

export default class PlayGround extends React.Component {
  state = {
    value: "",
  };
  octokit = new Octokit({
    auth: localStorage.getItem("github_personal_token"),
  });
  handleChange = (event) => {
    this.state({ value: event.target.value });
  };
  handleClick = async () => {
    const contentEncoded = Base64.encode("test2");

    const config = {
      // replace the owner and email with your own details
      owner,
      repo,
      path,
      message: "feat: Added test.md programatically",
      content: contentEncoded,
      committer: {
        name: `Octokit Bot`,
        email: "your-email",
      },
      author: {
        name: "Octokit Bot",
        email: "your-email",
      },
    };
    if (fileExist(this.octokit, path)) {
      const sha = await getSHA(this.octokit, path);
      console.log("sha", sha);
      config.sha = sha;
    }
    const { data } = await this.octokit.repos.createOrUpdateFileContents(
      config
    );

    console.log("data:", data);
  };
  getContent = async () => {
    const { data } = await this.octokit.repos.getContent({
      owner,
      repo,
      path: "dir",
    });
    console.log("data:", data);
  };
  render() {
    return (
      <div>
        <input value={this.state.value} onChange={this.handleChange}></input>
        <div>
          <button onClick={this.handleClick}>createOrUpdateFileContents</button>
        </div>
        <div>
          <button onClick={this.getContent}>list files in dir</button>
        </div>
      </div>
    );
  }
}
