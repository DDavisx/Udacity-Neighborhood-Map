## Neighborhood Map project submission

This project is the local Neighborhood Map. The contents are an attempt to show comprehension and understanding of organizational Frameworks that have been used and learned throughout the course. This project also will show an understanding and implementation of the google map api as well as a third party api of the students choice.

### Getting started

1. Install Node.js and Grunt.
2. Open the project Directory in a terminal or Command Prompt.
3. $> cd /path/to/your-project-folder
4. install NPM Modules
5. $> npm install
6. Run grunt connect
7. $> grunt connect
8. open a browser and go to http://localhost:3030

..or if your using Atom IDE

9.  Try the Atom-live-server package
  - this sets up a local server pointing at the project directory using port 3000.(<http://localhost:3000>)

..or try

10. The GitHub Page : https://ddavisx.github.io/Udacity-Neighborhood-Map/


### Frameworks used in this Application
- Jquery
- knockoutjs
- Handlebars

### APIs used in this Application
- google maps API
- Brewery DB API

### Notes
- Brewery DB uses a developer Api Key and Is Subject to a limit of 400 requests per day.
- Brewery DB does not support CORS and therefore a CORS proxy has been used.
- Handlebars was used to build and compile the Brewery DB json for display in the Google Info Window.
