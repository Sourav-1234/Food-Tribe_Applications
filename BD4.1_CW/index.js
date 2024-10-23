const express = require('express');
const { resolve } = require('path');
let cors = require("cors");
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");

const app = express();
let PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('static'));

let db;
(async () => {
  try {
    db = await open({
      filename: "./BD4.1_CW/database.sqlite",
      driver: sqlite3.Database,
    });
    console.log("Database connection established.");
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
  }
})();

// Function to fetch all movies
async function fetchAllMovies() {
  try {
    let query = "SELECT * FROM movies";
    let response = await db.all(query, []);
    return { movies: response };
  } catch (error) {
    throw new Error("Error fetching movies: " + error.message);
  }
}

// Route to get all movies
app.get("/movies", async (req, res) => {
  try {
    let results = await fetchAllMovies();

    if (results.movies.length === 0) {
      return res.status(404).json({ message: "No Movies Found!" });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Function to fetch movies by genre
async function fetchMoviesByGenre(genre) {
  try {
    let query = "SELECT * FROM movies WHERE genre = ?";
    let response = await db.all(query, [genre]);
    return { movies: response };
  } catch (error) {
    throw new Error("Error fetching movies by genre: " + error.message);
  }
}

// Route to get movies by genre
app.get("/movies/genre/:genre", async (req, res) => {
  try {
    let genre = req.params.genre;
    let results = await fetchMoviesByGenre(genre);

    if (results.movies.length === 0) {
      return res.status(404).json({ message: "No Movies Found for this Genre!" });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Function to fetch movie by ID
async function fetchMovieById(id) {
  try {
    let query = "SELECT * FROM movies WHERE id = ?";
    let response = await db.get(query, [id]);
    return { movie: response };
  } catch (error) {
    throw new Error("Error fetching movie by ID: " + error.message);
  }
}

// Route to get movie details by ID
app.get("/movies/details/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let results = await fetchMovieById(id);

    if (!results.movie) {
      return res.status(404).json({ message: "Movie not found!" });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Function to fetch movies by release year
async function fetchMoviesByReleaseYear(releaseYear) {
  try {
    let query = "SELECT * FROM movies WHERE release_year = ?";
    let response = await db.all(query, [releaseYear]);
    return { movies: response };
  } catch (error) {
    throw new Error("Error fetching movies by release year: " + error.message);
  }
}

// Route to get movies by release year
app.get("/movies/release-year/:year", async (req, res) => {
  try {
    let releaseYear = req.params.year;
    let results = await fetchMoviesByReleaseYear(releaseYear);

    if (results.movies.length === 0) {
      return res.status(404).json({ message: "No Movies Found for this Year!" });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


async function filterByActor(actor){
  let query = "SELECT *FROM movies where actor =?";
  let response = await db.all(query,[actor]);
  return {movies: response};

}


app.get("/movies/actor/:actor" ,async(req,res) =>{
  let actor = req.params.actor ;

  try{
     const results = await filterByActor(actor);

      if(results.movies.length === 0){
        return res.status(404).json({message: "No Movies Found ! for the actor "})
      }
      return res.status(200).json(results);

  }
  catch(error){
    return res.status(500).json({error :error.message});

  }
})


async function filterByDirector(director ){
   let query = "SELECT * FROM movies where director =?";
   let response = await db.all(query,[director]);
   return { movies : response};
   
}




app.get("/movies/director/:director" , async (req,res)=>{
  let director = req.params.director;

  try{
      let results = await filterByDirector(director);


      if(results.movies.length === 0){
        res.status(404).json({message: "No movies found for the director !" + director });
      }
      res.status(200).json(results);

  }
   catch(error){
      res.status(500).json({ error: error.message});

   }


})

// Starting the server
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
