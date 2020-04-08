const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// Validates 
function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({ error: "Invalid repository ID."});
  }
  
  const repositoryIndex = repositories.findIndex(repos => repos.id === id);
  if (repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found.'});
  }

  request.repositoryIndex = request.params.repositoryIndex;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id",validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repos => repos.id === id);

  const repository = repositories[repositoryIndex];
  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateRepositoryId, (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repos => repos.id === id);
  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repos => repos.id === id);
  const repository = repositories[repositoryIndex];
  repository.likes += 1;

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
