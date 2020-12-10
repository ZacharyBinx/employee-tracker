const connection = require("./assets/js/connection");
const inquirer = require("inquirer");
const questions = require("/assets/js/questions")

// Start our application
init();

async function init() {
  const { action } = await inquirer.prompt(questions);
  switch (action) {
    case "Edit Department":
      specificArtist();
      break;
    case "Edit Role":
      multiSearch();
      break;
    case "Edit Employee":
      rangeSearch();
      break;
    case "View All Employees":
      specificSong();
      break;
    case "Search Employees By Manager":
      songAndAlbumSearch();
      break;
    case "Update Employee Managers":
      songAndAlbumSearch();
      break;
    case "Total Budget By Department":
      songAndAlbumSearch();
      break;
    case "Exit":
      process.exit(0);
      break;
    default:
      break;
  }
}

// * A query which returns all data for songs sung by a specific artist
async function specificArtist() {
  const { artist } = await inquirer.prompt({
    name: "artist",
    type: "input",
    message: "What artist would you like to search for?",
  });

  const query = "SELECT position, song, year FROM top5000 WHERE ?";
  // SELECT position, song, year FROM top5000 WHERE artist = "Led Zeppelin"
  const data = await connection.query(query, { artist });
  console.table(data);
  init();
}

// * A query which returns all artists who appear within the top 5000 more than once
async function multiSearch() {
  const query =
    "SELECT artist, count(*) AS count FROM top5000 GROUP BY artist HAVING count(*) > 1 ORDER BY count DESC";
  const data = await connection.query(query);
  console.table(data);
  init();
}
// * A query which returns all data contained within a specific range
async function rangeSearch() {
  const { start, end } = await inquirer.prompt([
    {
      name: "start",
      type: "input",
      message: "Enter starting position: ",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      },
    },
    {
      name: "end",
      type: "input",
      message: "Enter ending position: ",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      },
    },
  ]);

  const query = `SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ${connection.escape(
    start
  )} AND ${connection.escape(end)}`;
  const data = await connection.query(query);
  console.table(data);
  init();
}

// * A query which searches for a specific song in the top 5000 and returns the data for it
async function specificSong() {
  const { song } = await inquirer.prompt({
    name: "song",
    type: "input",
    message: "What song would you like to look for?",
  });
  const data = await connection.query("SELECT * FROM top5000 WHERE ?", {
    song,
  });
  console.table(data);
  init();
}

async function songAndAlbumSearch() {
  const { artist } = await inquirer.prompt({
    name: "artist",
    type: "input",
    message: "What artist would you like to search for?",
  });
  const query = `
  SELECT top5000.artist, top5000.song, top_albums.year, top_albums.album, top_albums.position
  FROM top5000 INNER JOIN top_albums
  ON top_albums.artist = top5000.artist AND top_albums.year = top5000.year
  WHERE top_albums.artist = ? AND top5000.artist = ?
  ORDER BY top_albums.position`;

  const data = await connection.query(query, [artist, artist]);
  console.table(data);
  init();
}
