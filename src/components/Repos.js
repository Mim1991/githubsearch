import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";

const Repos = () => {
  const { repos } = React.useContext(GithubContext);
  // console.log(repos);
  let languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item;
    if (!language) return total;
    // if the language doesn't exist in the count create a new one and set count to 1
    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      // Otherwie add 1 to value of language and add new stargazers count to exisitng total
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
    }
    // console.log(total);
    // language as keys with lavel, value, stargazer
    return total;
  }, {});

  // Turn to array and sort by highest. Only take top 5 languages
  const mostUsed = Object.values(languages)
    .sort((a, b) => {
      // Returns an object with hash and value key inside
      return b.value - a.value;
    })
    .slice(0, 5);

  // create array, sort, take star count and top 5
  const mostPopular = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars;
    })
    .map((item) => {
      // console.log(item);
      // set value to starcount
      return { ...item, value: item.stars };
    })
    .slice(0, 5);
  // console.log(mostPopular);

  //
  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { stargazers_count, name, forks } = item;
      total.stars[stargazers_count] = { label: name, value: stargazers_count };
      total.forks[forks] = { label: name, value: forks };
      // console.log(total);
      return total;
    },
    {
      stars: {},
      forks: {},
    }
  );

  // take top 5, need to reverse
  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={mostUsed} />
        <Doughnut2D data={mostPopular} />
        <Column3D data={stars} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
