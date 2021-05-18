import { Base64 } from "js-base64";

const makeHelpers = () => {
  const owner = "d3vinc-playground";
  const repo = "tmp";
  const path = "test3.md";

  const token = localStorage.getItem("github_personal_token");

  const option = {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  };

  const fileExist = async () => {
    try {
      await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          method: "HEAD",
          ...option,
        }
      );
      // file exists
      return true;
    } catch (error) {
      console.error("fileExist() error:", error);
      if (error.status === 404) {
        // file does not exist
        return false;
      } else {
        // handle connection errors
      }
    }
  };

  // https://swizec.com/blog/using-javascript-to-commit-to-github-codewithswiz-7/
  const getSHA = async () => {
    const result = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      option
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        return json;
      });

    const sha = result?.sha;

    return sha;
  };

  const getContent = () =>
    fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      option
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        const content = Base64.decode(json.content);
        console.log(content);
        return content;
      });

  const _createOrUpdateFileContents = async (sha) => {
    const contentEncoded = Base64.encode("test3");
    await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        ...option,
        method: "PUT",
        headers: {
          ...option.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "update file",
          content: contentEncoded,
          sha,
        }),
      }
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });
  };

  const createOrUpdateFileContents = async () => {
    let sha;
    if (await fileExist()) {
      sha = await getSHA();
      console.log("sha", sha);
    }

    await _createOrUpdateFileContents(sha);
  };

  return {
    getContent,
    createOrUpdateFileContents,
  };
};

export default makeHelpers;
