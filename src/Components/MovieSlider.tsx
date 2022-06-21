import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getMovies,
  getTopRatedMovie,
  getUpcommingMovie,
  IGetMoviesResult,
} from "../api";
import { makeImagePath } from "../utiles";

const offset = 6;

function Home() {
  const navigate = useNavigate();
  const movieMatch = useMatch("/movie/:movieId");

  // TODO: 데이터 한번에 불러 오는 방법이 있는지 ?
  const { data: nowPlayingData, isLoading: nowPlayingLoading } =
    useQuery<IGetMoviesResult>("nowPlaying", getMovies);

  const { data: topRatedMovieData } = useQuery<IGetMoviesResult>(
    "topRatedMovie",
    getTopRatedMovie
  );

  const { data: upCommingMovieData } = useQuery<IGetMoviesResult>(
    "upCommingMovie",
    getUpcommingMovie
  );

  const [sliderList, setSliderList] = useState([
    {
      id: 0,
      index: 0,
      data: nowPlayingData,
      title: "지금 극장에서 상영중인 콘텐츠",
    },
    {
      id: 1,
      index: 0,
      data: topRatedMovieData,
      title: "지금 사람들이 가장 많이 보고있는 콘텐츠",
    },
    { id: 2, index: 0, data: upCommingMovieData, title: "곧 개봉해요!" },
  ]);

  useEffect(() => {
    setSliderList([
      {
        id: 0,
        index: 0,
        data: nowPlayingData,
        title: "지금 극장에서 상영중인 콘텐츠",
      },
      {
        id: 1,
        index: 0,
        data: topRatedMovieData,
        title: "지금 사람들이 가장 많이 보고있는 콘텐츠",
      },
      { id: 2, index: 0, data: upCommingMovieData, title: "곧 개봉해요!" },
    ]);
  }, [nowPlayingData, topRatedMovieData, upCommingMovieData]);

  const [isPrev, setIsPrev] = useState(false);

  const increaseIndex = (e: any) => {
    const targetSlider = sliderList.find(
      (slider) => slider.id === Number(e.target.id)
    );

    const targetIndex = sliderList.findIndex(
      (slider) => slider.id === Number(e.target.id)
    );

    if (!targetSlider) return;

    if (targetSlider?.data) {
      const totalMovies = targetSlider?.data?.results?.length;
      const maxIndex = Math.floor(totalMovies / offset);
      const newIndexList = {
        ...targetSlider,
        index:
          targetSlider.index === maxIndex ? 0 : Number(targetSlider?.index) + 1,
      };

      setSliderList([
        ...sliderList.slice(0, targetIndex),
        newIndexList,
        ...sliderList.slice(targetIndex + 1),
      ]);
    }
    setIsPrev(false);
  };

  const decreaseIndex = (e: any) => {
    const targetSlider = sliderList.find(
      (slider) => slider.id === Number(e.target.id)
    );

    const targetIndex = sliderList.findIndex(
      (slider) => slider.id === Number(e.target.id)
    );

    if (!targetSlider) return;

    if (targetSlider?.data) {
      const totalMovies = targetSlider?.data?.results?.length;
      const maxIndex = Math.floor(totalMovies / offset);
      const newIndexList = {
        ...targetSlider,
        index:
          targetSlider.index === maxIndex ? 0 : Number(targetSlider?.index) - 1,
      };

      setSliderList([
        ...sliderList.slice(0, targetIndex),
        newIndexList,
        ...sliderList.slice(targetIndex + 1),
      ]);
    }
    setIsPrev(true);
  };

  const [clickedData, setClickedData] = useState<IGetMoviesResult>();
  const onBoxClicked = (movieId: number, category: number) => {
    setClickedData(
      category === 0
        ? nowPlayingData
        : category === 1
        ? topRatedMovieData
        : upCommingMovieData
    );
    navigate(`movie/${movieId}`);
  };

  const clickedMovie =
    movieMatch?.params?.movieId &&
    clickedData?.results?.find(
      (movie) => String(movie.id) === movieMatch.params.movieId
    );

  const onOverlayClick = () => {
    navigate("/");
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

  const infoVar = {
    hover: {
      opacity: 1,
      transition: { delay: 0.2, duration: 0.3, type: "tween" },
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
    <>
      {nowPlayingLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              nowPlayingData?.results[0]?.backdrop_path || ""
            )}
          >
            <Title>{nowPlayingData?.results[0].title}</Title>
            <Overview>{nowPlayingData?.results[0].overview}</Overview>
          </Banner>
          {sliderList.map((slider) => (
            <SliderWrapper key={slider.id} animate="normal" whileHover="hover">
              <SubTitle>{slider.title}</SubTitle>
              {slider.index !== 0 && (
                <Prev
                  variants={arrowVar}
                  id={String(slider.id)}
                  onClick={decreaseIndex}
                />
              )}
              {/* TODO: next, prev 버튼 넷플처럼 처리하기 */}
              <Next
                variants={arrowVar}
                id={String(slider.id)}
                onClick={increaseIndex}
              />
              <Slider>
                <AnimatePresence
                  initial={false}
                  //TODO:onExitComplete 정확히알기
                  // onExitComplete={toggleLeaving}
                  custom={isPrev}
                >
                  <Row
                    //FIXME:key값이 중복되서 이상하게 보임
                    // id={`${slider.id}_${slider.index}`}
                    key={slider.index}
                    variants={sliderVar}
                    initial="hidden"
                    animate="visible"
                    transition={{ type: "tween", duration: 1 }}
                    exit="exit"
                    custom={isPrev}
                  >
                    {slider?.data?.results
                      ?.slice(
                        offset * sliderList[slider.id].index,
                        offset * sliderList[slider.id].index + offset
                      )
                      .map((movie) => (
                        <Box
                          // layoutId={String(movie.id)}
                          // id={`${slider.id}.${movie.id}`}
                          key={movie.id}
                          variants={boxVar}
                          initial="normal"
                          whileHover="hover"
                          onClick={() => onBoxClicked(movie.id, slider.id)}
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
              <AnimatePresence>
                {movieMatch && (
                  <Overlay
                    onClick={onOverlayClick}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <MovieModal
                      id={movieMatch.params.movieId}
                      // layoutId={movieMatch.params.movieId}
                      // layoutId={`${slider.id}.${movieMatch.params.movieId}`}
                    >
                      {clickedMovie && (
                        <>
                          <BigCover
                            style={{
                              backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                clickedMovie?.backdrop_path || "",
                                "w500"
                              )})`,
                            }}
                          />
                          <BigTitle>{clickedMovie?.title}</BigTitle>
                          <BigOverview>{clickedMovie?.overview}</BigOverview>
                        </>
                      )}
                    </MovieModal>
                  </Overlay>
                )}
              </AnimatePresence>
            </SliderWrapper>
          ))}
        </>
      )}
    </>
  );
}

export default Home;

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
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SliderWrapper = styled(motion.div)`
  position: relative;
  top: -100px;
  padding: 0 60px;
  margin-bottom: 200px;
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
