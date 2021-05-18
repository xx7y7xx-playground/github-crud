import { Octokit } from "@octokit/rest";
import { Base64 } from "js-base64";

/**
 * https://octokit.github.io/rest.js/v18/
 */

const makeHelpers = () => {
  const owner = "d3vinc-playground";
  const repo = "tmp";
  const path = "test2.md";

  const octokit = new Octokit({
    auth: localStorage.getItem("github_personal_token"),
  });

  const fileExist = async (octokit, path) => {
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
  };

  // https://swizec.com/blog/using-javascript-to-commit-to-github-codewithswiz-7/
  const getSHA = async (octokit, path) => {
    const result = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    const sha = result?.data?.sha;

    return sha;
  };

  const createOrUpdateFileContents = async () => {
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

    console.log("data:", data);
  };

  const getContent = async () => {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: "dir",
    });
    console.log("data:", data);
  };

  return {
    createOrUpdateFileContents,
    getContent,
  };
};

export default makeHelpers;
