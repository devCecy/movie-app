import styled from "styled-components";
import MovieSlider from "../Components/MovieSlider";

function Home() {
  return (
    <Wrapper>
      <MovieSlider />
    </Wrapper>
  );
}

export default Home;

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;
