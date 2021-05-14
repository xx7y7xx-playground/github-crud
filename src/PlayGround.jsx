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
  handleChange = (event) => {
    this.state({ value: event.target.value });
  };
  handleClick = async () => {
    const octokit = new Octokit({
      auth: localStorage.getItem("github_personal_token"),
    });

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
    if (fileExist(octokit, path)) {
      const sha = await getSHA(octokit, path);
      console.log("sha", sha);
      config.sha = sha;
    }
    const { data } = await octokit.repos.createOrUpdateFileContents(config);

    console.log(data);
  };
  render() {
    return (
      <div>
        <input value={this.state.value} onChange={this.handleChange}></input>
        <button onClick={this.handleClick}>Save</button>
      </div>
    );
  }
}
