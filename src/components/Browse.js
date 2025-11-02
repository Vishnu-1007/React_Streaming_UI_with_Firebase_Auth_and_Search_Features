//import { wait } from "@testing-library/user-event/dist/utils";
import Header from "./Header";
import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import MainContainer from "./MainContainer";
import SecondaryContainer from "./SecondaryContainer";
import usePopularMovies from "../hooks/usePopularMovies";
import GptSearch from "./GptSearch";
import { useSelector } from "react-redux";

const Browse = () =>{
 useNowPlayingMovies();
 usePopularMovies();

 const showGptSearch = useSelector(store =>store.gpt.showGptSearch);



    return(
    <div>
    <Header></Header>
{
    showGptSearch ? (<GptSearch></GptSearch>): (<> <MainContainer></MainContainer>
    <SecondaryContainer></SecondaryContainer></>)
}
   
    </div>
    )
}

export default Browse;