import { Base64 } from "js-base64";

const makeHelpers = () => {
  const owner = "d3vinc-playground";
  const repo = "tmp";
  const path = "test2.md";

  const token = localStorage.getItem("github_personal_token");

  const option = {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  };

  const test = () => {
    fetch("https://api.github.com/user", option)
      .then((res) => res.json())
      .then((json) => console.log(json));
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

  return {
    test,
    getContent,
  };
};

export default makeHelpers;
