
import { useDispatch, useSelector } from "react-redux";
import lang from "../utils/languageConstant";
import { useRef } from "react";
import { API_OPTIONS } from "../utils/constant";
import { addGptMovieResult } from "../utils/gptSlice";
import { ROUTER_KEY } from "../utils/secretKeys";

const GptSearchBar = () =>{

    const dispatch = useDispatch();

    const langKey = useSelector(store => store.config.lang);

    const searchText = useRef(null);

    const searchMovieTMDB = async (movie) =>{
        const movieData = await fetch("https://api.themoviedb.org/3/search/movie?query="+movie+"&include_adult=false&language=en-US&page=1", API_OPTIONS)
        const json = await movieData.json()
        return json.results
    }
    const handleGptSearchClick = async () =>{
        console.log(searchText.current.value);
        const gptQuery = "Act as a movie recommendation system and suggest some movies for the query : " + searchText.current.value  + "Can you give me the resposne in a simple array of 5 values please do not give any other response" +
        ".Only give names of 5 movies , comma separated like the example results given ahead. Example Result: Gadar, Sholay, Don, Glomal, Jawan";
        const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer "+ ROUTER_KEY);

const raw = JSON.stringify({
  "model": "nvidia/nemotron-nano-12b-v2-vl:free",
  "messages": [
    {
      "role": "user",
      "content": gptQuery
    }
  ]
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

 fetch("https://openrouter.ai/api/v1/chat/completions", requestOptions)
  .then((response) => response.text())
  .then(async (result) => {
    const  cleanText = result.trim();
    const data = JSON.parse(cleanText);
    const gptMovies = data?.choices?.[0]?.message?.content.split(",");
    console.log(gptMovies);
    const promiseArray =  gptMovies.map((movie) => searchMovieTMDB(movie))

    const tmdbResults = await Promise.all(promiseArray);

    console.log(tmdbResults);
    dispatch(addGptMovieResult({movieNames :gptMovies, movieResults:tmdbResults}))

  })
  .catch((error) => console.error(error));

    }


    return(
        <div className="pt-[10%] flex justify-center">
            <form className= "w-1/2 bg-black grid grid-cols-12"onClick={(e)=> e.preventDefault()}>
                <input ref={searchText} type="text" className="p-4 m-4 col-span-9" placeholder={lang[langKey].gptSearchPlaceholder}></input>
                <button className="col-span-3 m-3 py-2 px-2  bg-red-700 text-white rounded-lg"
                onClick={handleGptSearchClick}
                >{lang[langKey].search}</button>
            </form>
        </div>
    )
}

export default GptSearchBar;