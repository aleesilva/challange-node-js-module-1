const express = require("express");

const cors = require("cors");
const { uuid,isUuid } = require("uuidv4");

function logApplication(request,response,next) {
  const {method, url} = request;
  let log = ` ${method} => ${url}`;

  console.time(log);  

  next();

  console.timeEnd(log);
}


function validationId(request,response,next){
  const {id}  = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error:'Is not valid id.'});
  }
  return next();  
}

const app = express();

app.use(express.json());
app.use(logApplication);
app.use("/repositories/:id",validationId);
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title,url,techs}  = request.body;
  
  const repository = {id:uuid(),title,url,techs,likes:0};

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found.'});
  }

  repositories[repositoryIndex].title = title;
  repositories[repositoryIndex].url = url;
  repositories[repositoryIndex].techs = techs;


  return response.status(200).json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  
  const repositoryIndex = repositories.findIndex(repos => repos.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found.'});
  }

  repositories.splice(repositoryIndex);

  return response.status(204).json(repositories[repositoryIndex]);
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repos => repos.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found.'});
  }

  repositories[repositoryIndex].likes += 1;

  return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
