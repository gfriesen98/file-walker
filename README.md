# file-walker

I wanted to write a program to index my library of media using a Mongo database and I needed to be able to gather all my files and put them with their full path into the database so I wrote a script to do that for me :smiley-face:

## usage

1. clone this repo
2. `npm install`
3. `sudo chmod u+x index.js` or use with `node` instead
4. `./index.js -t [movie|rom] -f [starting folder] >> file.json` to write out to a file
5. done, import data like a boss

## movies

I wrote this for use with a file structure that Plex uses, specifically for Movies. [Click here to learn more](https://support.plex.tv/articles/naming-and-organizing-your-tv-show-files/) about the kind of file structure im talking about.

Expected output: `{"name": 'The Room', path: "/user/path/to/The Room", "fileSize": "1kb"}`

The script (when `-t movie` is run) will OMIT folders named `Featurettes` and `Subs`, as well as files ending with `.sfv` and `.srt` because I dont really want those in my database.

## roms

Like for getting movie names, running `-t rom` searches a directory for files but grabs more relevant information like filesize and category of rom.

The script will assume your folder structure is something like:
```
/
  /SNES
    rom
  /NES
    rom
  /Neogeo
    /BIOS
      bios
    rom
    rom
  ...etc
```

Expected output: `{"category": "SNES", "name": "rom", "fileSize": "1kb"}`

If there are subdirectory, the category for those files in the subdirectory will be the name of that subdir: `{"category": "BIOS", "name": "bios", "fileSize": "1kb"}`

## other

if there is something missing just clone and add it urself :)