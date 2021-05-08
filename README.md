# file-walker

I wanted to write a program to index my library of media using a Mongo database and I needed to be able to gather all my files and put them with their full path into the database so I wrote a script to do that for me :smiley-face:

## usage
1. clone this repo
2. `npm install`
3. `sudo chmod u+x index.js`
4. `./index.js -f [starting folder] >> file.json` to write out to a file.
  - *it is preferred to use a full path like `/home/username/files_i_want/`*
5. done import data like a boss

## usage part 2
I wrote this for use with a file structure that Plex uses, specifically for Movies. [Click here to learn more](https://support.plex.tv/articles/aming-and-organizing-your-movie-media-files/) about the kind of file structure im talking about.

The script will OMIT folders named `Featurettes` and `Subs`, as well as files ending with `.sfv` and `.srt` as i dont want those files in my database.

## other

feel free to check out my code and change it around, its pretty small.