#!/usr/bin/node
/**
 * This program goes through a folder given and creates a list of
 * json objects for use in Mongodb.
 * 
 * This is meant to be used in a plex media directory such as
 *  Movies
 *    - Movie (2019) => used for the name of the movie
 *      - Movie.mkv  => used for the fullpath of the media file (/Movies/Movie(2019)/Movie.mkv)
 */
const args = require('yargs');
const fs = require('fs');
const path = require('path');

//set up arguments
const options = args.usage("Usage: -f <starting folder>")
                    .option("f", 
                      {alias: "folder", describe: "Starting folder", type: "string", demandOption: true})
                    .argv;

/**
 * Walks through all files in a given directory, and files in subdirectories of the directory/
 * @param {*} dir starting directory
 */
function walk(dir) {
  var array = [];
  fs.readdirSync(dir).forEach(file => {
    let fullpath = path.join(dir, file);
    if (fs.lstatSync(fullpath).isDirectory() && !fullpath.match(/(Featurettes)/g) && !fullpath.match(/(Subs)/g)){
      //If file is a directory, check that directory (and ignore Featurettes/Subs folders)
      walk(fullpath);
    } else {
      if (!fullpath.endsWith(".srt") && !fullpath.endsWith(".sfv") && !fullpath.match(/(Featurettes)/g) && !fullpath.match(/(Subs)/g)){
        //Ignore .srt/.sfv/Featurettes/Subs
        const template = {"name": path.basename(path.dirname(fullpath)), "path": fullpath};
        array.push(template);
      }
    }
  });
  
  //stdout print the results.
  array.forEach(n => console.log(n));
}

walk(options.folder);