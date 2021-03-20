import React, { useState, useEffect } from "react";
import defaultUser from "./mockData.js/defaultUser";
import defaultRepos from "./mockData.js/defaultRepos";
import defaultFollowers from "./mockData.js/defaultFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();
// gives access to provider and consumer

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(defaultUser);
  const [repos, setRepos] = useState(defaultRepos);
  const [followers, setFollowers] = useState(defaultFollowers);
  const [requests, setRequests] = useState(0);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });

  const searchGithubUser = async (user) => {
    toggleError();
    setIsLoading(true);

    const response = await axios(`${rootUrl}/users/${user}`).catch((error) =>
      console.log(error)
    );

    if (response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;
      // for repos
      axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((response) =>
        setRepos(response.data)
      );
      // for followers
      axios(`${followers_url}?per_page=100`).then((response) =>
        setFollowers(response.data)
      );
    } else {
      toggleError(true, "No user with that name");
    }
    checkRequests();
    setIsLoading(false);
  };

  // check requests left
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        setRequests(remaining);
        if (remaining === 0) {
          toggleError(true, "You've exceeded number of requests per hour");
        }
      })
      .catch((error) => console.log(error));
  };

  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }

  // error
  useEffect(checkRequests, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isloading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

// need to export both functions as we need access

export { GithubProvider, GithubContext };
