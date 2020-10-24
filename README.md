# htmlgoddess
A minimalist framework for creating a website like it's 1999. 

## Requirements
- A computer with the internet, a text editor, and a web browser
- npm

## Getting Started
1. Open terminal
1. ``` npm install -g @htmlgoddess/cli ```  
This will install the command line utility. 
1. ``` htmlgoddess create path/to/your/new/site ``` 
1. follow the prompts and you should be up and running in no time.

## To Do
- refactor: isolate tests.
- add: "host" command.
- add: style choose command to allow the user to change theme after creation.
- feat: Spell checker.
- feat: auto commitizen hook to trigger when committing.
- feat: proofread commands.
- feat: "domain" command.
- feat: downloadable executable.
- refactor: Swap CNAME for yaml config for hosting.
- task: coverage
- convert "docs" to configurable variables
- task: make sure the watcher doesn't leak memory.
- bug: cli.action still outputting to console during tests.
- feat: GUI

# I don't know any HTML
That's ok. Check out [this video](https://www.youtube.com/watch?v=3RXlQPkJzCM) to get started.

## Command Line Menu
When you run ``` npm start ``` and it will give you the following options.

## How it works
- Files in the "src" folder are compiled (printed) to static HTML files in the "docs" folder. 
- ``` src/templates ``` folder contains the templates. These are compiled with the content folder to generate your static HTML pages.
- ``` src/content ``` folder contains your site content, which is kept in html files that are chunks of HTML code. 
- When you run ``` npm run print ``` (or select print from terminal menu), it will compile your content and templates into static HTML files and recreate the docs folder. (NOTE: Everything in docs gets overwritten so only save content in your src directory!)
- You can test your site locally by running the "serve" command from the menu.
- When you are ready to deploy your site, just do 
``` npm run save && npm run publish```
- You can then point your web server to "docs" whether it be apache, git pages, nginx, or anything.
- You can add any stylesheet that targets plain HTML elements and it should work :)

## Templates
- Tags in the template that are self closing like `<head />` or `<main />` will search for template files matching that same name; either a directory with an index html like ```main/index.html``` or simply a file ```main.html```
    - Tags do not have to be standard HTML. If you make a template foo.html in the templates folder, you can include a `` <foo /> `` tag and it will replace the contents of foo.
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
- HTML is used for everything (as the HTML Goddess has commanded) instead of proprietary template tags and other special syntax. The templating system searches for self closing HTML tags and replaces them with associated templates or content.
- The file system is leveraged for both finding/naming templates and url routing.
- Git serves as the actual database for the CMS along with the HTML files in content and templates.
- The site "prints' ' to the "docs' ' folder, and then you "publish" to git, where you can set up [github pages](https://pages.github.com/). It's agnostic of the web server so you can actually take the files in the docs folder and plunk them anywhere you want and point a web server at them.
- Tags are intended not to need classes or attributes. This allows new themes to be seamlessly dropped in. You can think of vanilla HTML as the interface for applying styling. 
- Using JavaScript is discouraged as it shouldn't be unnecessary, though there's nothing in the framework that prevents you using it. 
- You can ignore everything I just wrote and do whatever you want. It's the internet!


## Frequent issues
- Dependencies acting weird:  
  Lerna does some things under the hood to cross-link Dependencies. If you install a new module and things stop working try ```lerna bootstrap``` from the root.
- Test directory not cleaning up. If a test fails it might prevent the test directory from cleaning up. In that case run ``` npm run clean-test-dir ``` which will remove it manually.

## Contributing
1. run tests in packages/cli to make sure everything's up to snuff
```npm run test``` 
1. Commit changes to the mono repo
``` npm run commit ``` and follow the prompts
1. lerna publish --force-publish
This will publish to NPM as well as push a tag to git



