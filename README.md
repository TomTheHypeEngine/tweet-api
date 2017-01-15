# tweet-api
API Part for the DMAS Assignment - in use [here](https://tomthehypeengine.github.io/critter-client/)

## Development tools
This project uses the [NodeJS](www.nodejs.org) Java Script Runtime.

Development was done with [JetBrains Webstorm](https://www.jetbrains.com/webstorm/)

## Requrements
NodeJs and npm must be installed on your PC.

Clone this repository and 

```npm install```

from the project root directory.

MongoDB has to run on your PC. This api will try to find it on the localhost with the default mongo port 27017.
`localhost:27017` 

You can change this @ `app/models/db.js` by editing var dbUri.

The github.io site uses the latest version of this api deployed on [Heroku](https://www.heroku.com/)

Start and run the api with

`node index`

This api was created alongside my critter-client website which uses this api found 
[here](https://github.com/TomTheHypeEngine/critter-client).

## Developer
Thomas Hettrich aka [TomTheHypeEngine](https://github.com/TomTheHypeEngine)

## Acknowledgment
This project was created as an assignment for the course Building Modern Web Applications 
using Node JS at the OTH Regensburg.

Special thanks to Professor [Eamonn de Leastar](https://github.com/edeleastar/) for creating and leading the course.
