const http = require("http");
const url = require("url");

const PORT = process.env.PORT || 4050;

// list of jokes in database
let db = [
  {
    id: 1,
    title: "Why did the scarecrow win an award?",
    comedian: "Because he was outstanding in his field!",
    year: 2020,
  },
  {
    id: 2,
    title: "Why don't skeletons fight each other?",
    comedian: "They don't have the guts.",
    year: 2019,
  },
  {
    id: 3,
    title: "What do you call fake spaghetti?",
    comedian: "An impasta!",
    year: 2018,
  },
  {
    id: 4,
    title: "What do you call an alligator in a vest?",
    comedian: "An investigator!",
    year: 2016,
  },
  {
    id: 5,
    title: "Why did the bicycle fall over?",
    comedian: "Because it was two-tired!",
    year: 2021,
  },
  {
    id: 6,
    title: "What's orange and sounds like a parrot?",
    comedian: "A carrot!",
    year: 2020,
  },
  {
    id: 7,
    title: "What do you call a pile of cats?",
    comedian: "A meowtain!",
    year: 2022,
  },
  {
    id: 8,
    title: "Why did the golfer bring two pairs of pants?",
    comedian: "In case he got a hole in one!",
    year: 2019,
  },
  {
    id: 9,
    title: "What do you call a dinosaur with an extensive vocabulary?",
    comedian: "A thesaurus!",
    year: 2022,
  },
  {
    id: 10,
    title: "What's brown and sticky?",
    comedian: "A stick!",
    year: 2020,
  },
];


const server = http.createServer((req, res) => {
    const {pathname} = url.parse(req.url, true);

    const id = parseInt(pathname.split("/")[2]);

    const sendJsonResponse = (statusCode, data, message) => {
        res.writeHead(statusCode, {
            "Content-Type": "application/json"
        });
        res.end(
          JSON.stringify({
            message,
            data
          })
        );
    }

    const notFoundRoute = () => {
        res.writeHead(404, {
            "Content-Type": "application/json"
        })
        res.end(JSON.stringify({
            error: true,
            message: "Not Found"
        }))
    }

    if (req.method === "GET") {
        if (pathname === '/') {
            sendJsonResponse(200, "Welcome to the Joke API");
        } else if (pathname === "/joke") {
            sendJsonResponse(200, db, "Jokes retrieved successfully");
        } else {
            notFoundRoute();
        }
    } else if (req.method === "POST" && pathname === "/joke") {
        let data = '';

        req.on("data", chunk => data += chunk);
        req.on("end", () => {
            const eachJoke = JSON.parse(data);

            eachJoke.id = db.length + 1;
            db.push(eachJoke);

            sendJsonResponse(200, db, "Joke added successfully");
        });
    } else if (req.method === "PATCH" && pathname === `/joke/${id}`) {
        let data = '';

        req.on("data", chunk => data += chunk);
        req.on("end", () => {
            const updatedJokeInfo = JSON.parse(data);

            const index = db.findIndex(joke => joke.id === id);

            if (index !== -1) {
                db[index] = {...db[index], ...updatedJokeInfo};
                sendJsonResponse(200, db[index], "Joke updated successfully");
            } else {
                notFoundRoute()
            }
        })
    } else if (req.method === "DELETE" && pathname === `/joke/${id}`) {
        const index = db.findIndex(joke => joke.id === id);

        if (index !== -1) {
            const [jokeDataToDelete] = db.splice(index, 1);

            sendJsonResponse(200, jokeDataToDelete, "Joke deleted successfully");
        } else {
            notFoundRoute()
        }
    } else {
        notFoundRoute()
    }
})


server.listen(PORT, () => {
  console.log(`server started running at: http://localhost:${PORT}`);
});