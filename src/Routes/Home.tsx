import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utiles";

const offset = 6;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const slider = {
    hidden: { x: window.outerWidth + 5 },
    visible: { x: 0 },
    exit: { x: -window.outerWidth - 5 },
  };
  const boxVar = {
    normal: { scale: 1 },
    hover: {
      scale: 1.3,
      transition: { delay: 0.3, type: "tween" },
      y: -50,
    },
  };

  const infoVar = {
    hover: {
      opacity: 1,
      transition: { delay: 0.3, type: "tween" },
    },
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0]?.backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                key={index}
                variants={slider}
                initial="hidden"
                animate="visible"
                transition={{ type: "tween", duration: 1 }}
                exit="exit"
              >
                {data?.results
                  ?.slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      variants={boxVar}
                      initial="normal"
                      whileHover="hover"
                      poster={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVar}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  // 배경이미지에 그래디언트를 덮어서 텍스트가 선명하게 보이도록 해줌, 대박
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  padding: 60px;
`;

const Title = styled.h2`
  font-size: 50px;
  margin-bottom: 20px;
`;

const Overview = styled.div`
  width: 60%;
  font-size: 23px;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ poster: string }>`
  background-image: url(${(props) => props.poster});
  background-size: cover;
  background-position: center center;
  height: 150px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: ${(props) => props.theme.black.lighter};
  padding: 10px;
  opacity: 0;

  h4 {
    font-size: 15px;
    text-align: center;
  }
`;
