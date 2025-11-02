import GptMovieSuggestions from "./GptMovieSuggestions";
import GptSearchBar from "./GptSearchBar";
import { BG_URL } from "../utils/constant";

const GptSearch = () =>{
    return(<div>
        <div className="fixed -z-10">
        <img
          src={BG_URL}
          alt="logo"
        ></img>
      </div>
        <GptSearchBar></GptSearchBar>
        <GptMovieSuggestions></GptMovieSuggestions>
    </div>)
}

export default GptSearch;