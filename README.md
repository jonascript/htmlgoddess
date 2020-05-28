# htmlgoddess

## This is Alpha. Use at your own risk. Feedback Welcome 

This is a minimalist framework for creating a website like it's 1999. 

## Requirements
1. A computer with the internet, a text editor, and a web browser
1. npm

## Getting Started
1. Open terminal
1. ``` git clone https://github.com/jonascript/htmlgoddess path/to/site ```
1. ``` cd path/to/site ```
1. ``` npm install ```
1. ``` npm start ```
1. The menu will give you options which should be self explanatory

## Menu Options
1. start - loads the command menu
1. print - prints out your static site to docs folder
1. save - Saves and commits files
1. publish - pushes commits to origin in git
1. format - formats files in source
1. test - for unit tests

## How it works
1. The src file contains all the source files and content for the site.
1. These get compiled into the "docs" folder which will be 
where your website is served from
1. src/templates folder has templates.
1. src/content folder has content, which gets populated with the templates.
1. The ```<content/>``` tag is special and will either pull in a template as the same name of the file (with dir) or the main template.
1. Templates are self organizing via folders. 
1. Create the pages you want in the content dir. Directories relative to there will show up in your site with the same path
1. When you are done editing your content, run ```npm run print``` (or via command menu) which will reprint out your site to the "docs" folder. (NOTE: Everything in docs gets overwritten!)
1. When you are ready to deploy your site, just do 
``` npm run save && npm run publish```
1. You can then point your webserver to "docs" whether it be apache, gitpages, nginx, or anything.
1. You can add any stylesheet that targets plain HTML elements and it should work :)

## Constraints
1. No JS
1. No attributes except basic href etc.
1. No classes. This is what allows you to add any stylesheet that targets vanilla css
1. No SASS/SCSS/LESS. This should not be necessary with simple HTML elements
1. No React, Angular, or anything else.
1. Or not, you can hack anything you want.




