import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getSearchResults, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utiles";

// TODO: 클릭 -> /tv/:tvId 카드 만들기
// TODO: 슬라이더 두개 하나로 재사용!!!
// TODO: leaving의 정체 밝히기

const offset = 6;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const [movieIndex, setMovieIndex] = useState(0);
  const [tvIndex, setTvIndex] = useState(0);
  const [isPrev, setIsPrev] = useState(false);

  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["results", keyword],
    () => getSearchResults(keyword || "")
  );

  const movieResults = data?.results.filter(
    (result) => result.media_type === "movie" && result.backdrop_path
  );
  const tvResults = data?.results.filter(
    (result) => result.media_type === "tv" && result.backdrop_path
  );

  const [tvLength, setTvLength] = useState<number>(0);
  const [movieLength, setMovieLength] = useState<number>(0);
  useEffect(() => {
    if (tvResults) {
      setTvLength(tvResults?.length);
    }
    if (movieResults) {
      setMovieLength(movieResults?.length);
    }
  }, [movieResults, tvResults]);

  const increaseIndex = (e: any) => {
    if (e.target.id === "movie") {
      if (movieResults) {
        // if (leaving) return;
        // toggleLeaving();
        const totalMovies = movieResults?.length - 1;
        const maxIndex = Math.floor(totalMovies / offset);
        setMovieIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    } else {
      if (tvResults) {
        // if (leaving) return;
        // toggleLeaving();
        const totalMovies = tvResults?.length - 1;
        const maxIndex = Math.floor(totalMovies / offset);
        setTvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
    setIsPrev(false);
  };

  const decreaseIndex = (e: any) => {
    if (e.target.id === "movie") {
      if (movieResults) {
        // if (leaving) return;
        // toggleLeaving();
        const totalMovies = movieResults?.length - 1;
        const maxIndex = Math.floor(totalMovies / offset);
        setMovieIndex((prev) => (prev === maxIndex ? 0 : prev - 1));
      }
    } else {
      if (tvResults) {
        // if (leaving) return;
        // toggleLeaving();
        const totalMovies = tvResults?.length - 1;
        const maxIndex = Math.floor(totalMovies / offset);
        setTvIndex((prev) => (prev === maxIndex ? 0 : prev - 1));
      }
    }
    setIsPrev(true);
  };

  const sliderVar = {
    hidden: (isPrev: boolean) => ({
      x: isPrev ? -window.outerWidth - 5 : window.outerWidth + 5,
    }),
    visible: { x: 0 },
    exit: (isPrev: boolean) => ({
      x: isPrev ? window.outerWidth + 5 : -window.outerWidth - 5,
    }),
  };

  const boxVar = {
    normal: { scale: 1 },
    hover: {
      scale: 1.3,
      transition: { delay: 0.2, duration: 0.3, type: "tween" },
      y: -50,
    },
  };

  const arrowVar = {
    normal: { opacity: 0, ease: "easeOut", duration: 0.2, type: "tween" },
    hover: {
      opacity: 1,
      transition: { delay: 0.2, duration: 0.3, type: "tween" },
    },
  };

  return (
    <Wrapper>
      <SliderWrapper whileHover="hover">
        <SubTitle>"영화"에서 검색 한 결과</SubTitle>
        {movieIndex !== 0 && (
          <Prev id="movie" variants={arrowVar} onClick={decreaseIndex} />
        )}
        {movieLength > 6 && (
          <Next id="movie" variants={arrowVar} onClick={increaseIndex} />
        )}
        <Slider>
          <AnimatePresence initial={false} custom={isPrev}>
            <Row
              key={movieIndex}
              variants={sliderVar}
              initial="hidden"
              animate="visible"
              transition={{ type: "tween", duration: 1 }}
              exit="exit"
              custom={isPrev}
            >
              {movieResults
                ?.slice(offset * movieIndex, offset * movieIndex + offset)
                ?.map((movie) => (
                  <Box
                    key={movie.id}
                    layoutId={String(movie.id)}
                    variants={boxVar}
                    initial="normal"
                    whileHover="hover"
                    poster={makeImagePath(movie.backdrop_path, "w500")}
                  />
                ))}
            </Row>
          </AnimatePresence>
        </Slider>
      </SliderWrapper>
      <SliderWrapper whileHover="hover" style={{ marginTop: "150px" }}>
        <SubTitle>"TV"에서 검색 한 결과</SubTitle>
        {tvIndex !== 0 && (
          <Prev id="tv" variants={arrowVar} onClick={decreaseIndex} />
        )}
        {tvLength > 6 && (
          <Next id="tv" variants={arrowVar} onClick={increaseIndex} />
        )}
        <Slider>
          <AnimatePresence initial={false} custom={isPrev}>
            <Row
              custom={isPrev}
              key={tvIndex}
              variants={sliderVar}
              initial="hidden"
              animate="visible"
              transition={{ type: "tween", duration: 1 }}
              exit="exit"
            >
              {tvResults
                ?.slice(offset * tvIndex, offset * tvIndex + offset)
                ?.map((tv) => (
                  <Box
                    key={tv.id}
                    layoutId={String(tv.id)}
                    variants={boxVar}
                    initial="normal"
                    whileHover="hover"
                    poster={makeImagePath(tv.backdrop_path, "w500")}
                  />
                ))}
            </Row>
          </AnimatePresence>
        </Slider>
      </SliderWrapper>
    </Wrapper>
  );
}

export default Search;

const Wrapper = styled.div`
  padding: 100px 0;
`;

const SliderWrapper = styled(motion.div)`
  position: relative;
  padding: 0 60px 60px;
`;

const SubTitle = styled.h3`
  margin-bottom: 10px;
`;

const Slider = styled.div`
  position: relative;
`;

// TODO: 재사용할것
const Prev = styled(motion.span)`
  position: absolute;
  top: 100px;
  left: 20px;
  font-size: 30px;
  &::before {
    content: "<";
  }
  z-index: 99;
  cursor: pointer;
  opacity: 0;
`;
const Next = styled(motion.span)`
  position: absolute;
  top: 100px;
  right: 20px;
  font-size: 30px;
  &::after {
    content: ">";
  }
  z-index: 99;
  cursor: pointer;
  opacity: 0;
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
  cursor: pointer;
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
  height: 20%;
  background-color: ${(props) => props.theme.black.lighter};
  padding: 5px;
  display: none;
  /* opacity: 0; */
  border: none;

  h4 {
    font-size: 15px;
    text-align: center;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const MovieModal = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  top: 50px;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;
