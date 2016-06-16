const express = require("express");
const fs = require("fs");
const logger = require("morgan");
const bodyParser = require("body-parser");

//set port
let port;
try {
  port = JSON.parse(fs.readFileSync("port.json")).port;
} catch (e) {
  console.log("failed to get port from port.json");
  port = 8080;
}

//initialize app
const app = express();

//define public route
app.use(express.static("public"));

//middleware
app.use(bodyParser.json());
app.use(logger("dev"));

//routes
app.get("/list", (request,response) => {
  getList()
    .then(list => {
      response.send(list);
    })
    .catch(e => {
      response.sendStatus(500);
    });
});

app.post("/list",(request,response) => {
  addListItem(request.body.item)
    .then(() => {
      response.sendStatus(200);
    })
    .catch(e => {
      response.sendStatus(500);
      console.error(e);
    });
});

app.delete("/list/:id",(request,response) => {
  deleteListItem(request.params.id)
    .then(() => {
      response.sendStatus(200);
    })
    .catch(e => {
      console.error(e);
      response.sendStatus(500);
    });
});

//start server
app.listen(port, () => {
  console.log("started listening on port " + port);
});

//util
function getList() {return new Promise(function(resolve, reject) {
  fs.readFile("list.json",(err,data) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(data.toString("utf-8"));
  });
});}

function deleteListItem(index) {return new Promise(function(resolve, reject) {
  getList()
    .then(list => {
      list = JSON.parse(list);
      list.splice(index,1);
      let listString = JSON.stringify(list);
      fs.writeFile("list.json", listString,"utf-8", err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
    .catch(e => {
      reject(e);
    });
});}

function addListItem(item) {return new Promise(function(resolve, reject) {
  getList()
    .then(list => {
      list = JSON.parse(list);
      list.push(item);
      let listString = JSON.stringify(list);
      fs.writeFile("list.json", listString,"utf-8", err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
    .catch(e => {
      reject(e);
    })
});}
