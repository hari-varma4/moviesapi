const express = require("express");
const path = require("path");
const dbpath = path.join(__dirname, "moviesData.db");
const app = express();
app.use(express.json());
let db = null;
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbObjecttoResponse = (dbobj) => {
  return {
    moviename: dbobj.movie_name,
  };
};

const intiser = async () => {
  db = await open({
    filename: dbpath,
    driver: sqlite3.Database,
  });
  app.listen(3000, () => {
    console.log("server running");
  });
};
intiser();
app.get("/movies/", async (request, response) => {
  const qu = `
       select movie_name from movie 
    `;
  const re = await db.all(qu);
  response.send(re.map((pla) => dbObjecttoResponse(pla)));
});
app.post("/movies/", async (request, response) => {
  const detailstopost = request.body;
  const { directorId, movieName, leadActor } = detailstopost;
  const query = `
    insert into movie (director_id,movie_name,lead_actor)
    values (${directorId},"${movieName}",'${leadActor}')
    `;
  const re = await db.run(query);
  response.send("Movie Successfully Adedd");
});
const objtore = (ob) => {
  return {
    movieId: ob.movie_id,
    directorId: ob.director_id,
    movieName: ob.movie_name,
    leadActor: ob.lead_actor,
  };
};

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  const query = ` select * from movie
    where movie_id=${movieId}`;
  const re = await db.get(query);
  response.send(objtore(re));
});
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const details = request.body;
  const { directorId, movieName, leadActor } = details;
  const quer = `
    update movie 
    set
      director_id=${directorId}, movie_name="${movieName}", lead_actor="${leadActor}"
    WHERE movie_id=${movieId}
    `;
  const res = await db.run(quer);
  response.send("Movie Details Updated");
});
app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const qurr = `
  delete  from movie where movie_id=${movieId}

  `;
  const ree = await db.run(qurr);
  response.send("Movie Removed");
});
function obb(obb) {
  return {
    directorid: obb.director_id,
    directorName: obb.director_name,
  };
}

app.get("/directors/", async (request, response) => {
  const qu = `
       select * from director
    `;
  const re = await db.all(qu);
  response.send(re.map((pla) => obb(pla)));
});
function obbj(ob) {
  return {
    movieName: ob.movie_name,
  };
}
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const qu = `
       select movie_name from movie inner join director on director.director_id = movie.director_id
        where director.director_id=${directorId}
    `;
  const re = await db.all(qu);
  response.send(re.map((pla) => obbj(pla)));
});
module.exports=app;