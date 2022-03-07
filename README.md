# House of Games API

## Hosted Version

https://jv-games-app.herokuapp.com/api/

## Description

be-nc-games is an API for storing, submitting, and editting a database of game reviews. Anyone can interact with the API using HTTP requests with methods such as axios/insomnia. The API was built as a portfolio piece for the owner to demonstrate their backend skillset.

## Github Repository

https://github.com/jvalentine94/be-nc-games

## Version Requirements

NodeJS: v16.10.0
Postgres: v14.2

## Repository Instructions

1. Open GitHub repopsitory on your web browser and obtain the github code link.
2. Open your terminal and navigate to the desired directory for the project using 'cd' command.
3. Run the 'git clone' command with the link from step at the end.
4. Open the cloned repository and run the 'npm i' command to install all the project dependancies.
5. Install postgres, if not already installed, and open.
6. Create .env.test and .env.development files in the root directory and include chosen names for the test and development databases within each.
7. Run the 'npm run setup-dbs' and 'npm run seed' in that order to create the database and seed the development data respectively.
8. Use Insomnia or alternative API client to make requests locally, using the port number held within listen.js.
