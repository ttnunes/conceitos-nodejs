const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid, v4 } = require('uuid');

const app = express();

app.use(express.json()); 
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  
  const repository = {
    id: v4(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

  repositories.push(repository)

  return response.status(201).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositorieIndex = repositories.findIndex(repository => repository.id === id)

  if (repositorieIndex < 0){
    return response.status(400).json({ error: "Repositorie not found." })
  }

  const { likes } = repositories.find(repository => repository.id === id)

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositorieIndex] = repository

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositorieIndex = repositories.findIndex(repository => repository.id === id)
  
  if (repositorieIndex < 0){
    return response.status(400).json({ error: "Repositorie not found." })
  }

  repositories.splice(repositorieIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  
  const repositorieIndex = repositories.findIndex(repository => repository.id === id)

  if (repositorieIndex < 0){
    return response.status(400).json({ error: "Repositorie not found." })
  }

  const repository = repositories.find(repository => repository.id === id)
  repository.likes = repository.likes + 1;

  repositories[repositorieIndex] = repository
  
  return response.json(repository)
});

module.exports = app;
