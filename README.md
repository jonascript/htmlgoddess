# htmlgoddess
A minimalist framework for creating a website like it's 1999. 

## v0.1.1 - Alpha 
This is a complete rewrite from the current version currently under development.
- Moved to lerna monorepo.
- Using oclif for CLI.
- Webpack plugin moved to its own package.
- fix: serve test leaving process open.


## Requirements
- A computer with the internet, a text editor, and a web browser
- npm

## To Do
- Setup prompt unit test mocking.
- add: auto commitizen hook to trigger when commiting.
- Do cleanup pass to ensure paths are being constructed properly
- Create print:auto, publish, a11y, proofread commands.
- Find good spell checker.
- Create executable
- Swap CNAME for yaml config for hosting 
- Coverage
- GUI
- Check if user has edited files in output folder and show a warning.
- convert "docs" to configurable variables

## Getting Started
- Open terminal
- ``` git clone https://github.com/jonascript/htmlgoddess path/to/site ```
- ``` cd path/to/site ```
- ``` npm install ```
- ``` npm start ```
- The menu will give you options which should be self explanatory

# I don't know any HTML
That's ok. Check out [this video](https://www.youtube.com/watch?v=3RXlQPkJzCM) to get started.

## Command Line Menu
When you run ``` npm start ``` and it will give you the following options.

## How it works
- Files in "src" folder are compiled (printed) to static HTML files in the "docs" folder. 
- ``` src/templates ``` folder contains the templates. These are compiled with the content folder to generate your static HTML pages.
- ``` src/content ``` folder contains your site content, which is kept in html files that are chunks of HTML code. 
- When you run ``` npm run print ``` (or select print from terminal menu), it will compile your content and templates into static HTML files and recreate the docs folder. (NOTE: Everything in docs gets overwritten so only save content in your src directory!)
- You can test your site locally by running the "serve" command from the menu.
- When you are ready to deploy your site, just do 
``` npm run save && npm run publish```
- You can then point your webserver to "docs" whether it be apache, gitpages, nginx, or anything.
- You can add any stylesheet that targets plain HTML elements and it should work :)

## Templates
- Tags in the template that are self closing like `<head />` or `<main />` will search for template files matching that same name; either a directory with an index html like ```main/index.html``` or simply a file ```main.html```
    - Tags do not have to be standard HTML. If you make a template foo.html in the templates folder, you can include a `` <foo /> `` tag and it will replace with the contents of foo.
    - The template compiling is recursive so you can use templates within templates, however, the nested templates need to be files contained within or adjacent to the parent template. Otherwise it will just be ignored.
- The ```<content/>```tag is special and will either pull in a template as the same name of the file (with dir) or the main template ('templates/index.html).
- When you create the pages you want in the content dir. Directories relative to there will show up in your site with the same path. This structure allows for self organizing folders and urls.

## Constraints
- No JS
- No attributes except basic href etc.
- No classes. This is what allows you to add any stylesheet that targets vanilla css
- No SASS/SCSS/LESS. This should not be necessary with simple HTML elements
- No React, Angular, or anything else.
- Or not, you can hack anything you want.

## Philosophy
HTML was designed to be simple, and for ordinary people to create and consume things on the internet. The web is pretty awesome today but also has gotten pretty complex and it's leaving a lot of people behind. This CMS gets back to basics to give people a way to express themselves freely and easily.

- The framework tries to leverage as much existing technology and standards as it can.
- HTML is used for everything (as the HTML Goddess has commanded) instead of proprietary template tags and other special syntax. The templating system searches for self closing HTML tags are replaces them with associated templates or content.
- The file system is leveraged for both finding/naming templates and url routing.
- Git serves as the actual database for the CMS along with the HTML files in content and templates.
- The site "prints" to the "docs" folder, and then you "publish" to git, where you can setup [github pages](https://pages.github.com/). It's agnostic of the webserver so you can actually take the files in the docs folder and plunk them anywhere you want and point a web server at them.
- Tags are intended not to need classes or attributes. This allows new themes to be seamless dropped in. You can think of vanilla HTML as the interface for applying styling. 
- Using JavaScript is discouraged as it shouldn't be unnecessary, though there's nothing in the framework that prevents you using it. 
- You can ignore everything I just wrote and do whatever you want. It's the internet!


## Frequent issues
- Dependancies acting weird:  
  Lerna does somethings under the hood to cross-link Dependancies. If you install a new module and things stop working try ```lerna boostrap``` from the root.