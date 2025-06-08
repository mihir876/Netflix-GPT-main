import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNowPlayingMovies } from "../Components/movieSlice";
import { API_OPTIONS } from "../utils/constant";

const useNowPlayingMovies = () => {
  const dispatch = useDispatch();
  
  const nowPlayingMovies = useSelector(store => store.movies.nowPlayingMovies);

  const getNowPlayingMovies = async () => {
    // Using the environment variable for TMDB API Key
   const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;


    const data = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?page=1&api_key=${TMDB_API_KEY}`, 
      API_OPTIONS
    );
    const json = await data.json();
    dispatch(addNowPlayingMovies(json.results));
  };

  useEffect(() => {
    !nowPlayingMovies && getNowPlayingMovies();
  });
};

export default useNowPlayingMovies;
