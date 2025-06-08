import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { API_OPTIONS } from '../utils/constant';
import { addGptMovies } from '../Components/gptSlice';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // ❗️Frontend only – use a backend in production
});

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const gptSearchText = useRef(null);

  const searchMovie = async (movie) => {
    const data = await fetch(
      'https://api.themoviedb.org/3/search/movie?query=' +
        movie +
        '&include_adult=false&language=en-US&page=1',
      API_OPTIONS
    );
    const json = await data.json();
    return json.results;
  };

  const handleGptSearchClick = async () => {
    const prompt =
      'Suggest 5 popular movies based on this user input: "' +
      gptSearchText.current.value +
      '". Return only the result in a strict array format like ["Movie1", "Movie2", "Movie3"].';

    try {
      const gptResult = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });

      const gptText = gptResult.choices[0]?.message?.content;
      let movieArray = [];

      try {
        movieArray = JSON.parse(gptText);
      } catch (error) {
        console.error('Error parsing GPT response:', gptText, error);
      }

      const tmdbPromiseArray = movieArray.map((movie) => searchMovie(movie));
      const tmdbResults = await Promise.all(tmdbPromiseArray);

      dispatch(addGptMovies({ movieNames: movieArray, movieResults: tmdbResults }));
    } catch (err) {
      console.error('Error calling OpenAI:', err);
    }
  };

  return (
    <div className="pt-[40%] md:pt-[10%] flex justify-center">
      <form
        className="w-full md:w-1/2 bg-black grid grid-cols-12 rounded-lg"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={gptSearchText}
          type="text"
          className="p-4 m-4 col-span-9 rounded-lg"
          placeholder="What would you like to watch today?"
        />
        <button
          className="col-span-3 m-4 py-2 px-4 bg-red-700 text-white rounded-lg hover:bg-red-800"
          onClick={handleGptSearchClick}
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
