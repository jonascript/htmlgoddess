# htmlgoddess

## This is Alpha. Use at your own risk.##

This is a minimalist framework for creating a website like it's 1999. 

## Requirements
1. npm

## How to use

1. Download to your directory
1. npm install
1. The src file contains all the source files and content for the site
1. src/templates folder has templates
1. src/content folder has content, which gets populated with the templates.
1. <content/> tag is special and will either pull in a template as the same name of the file (with dir) or the main template.
1. Templates are self organizing.
1. Create the pages you want in the content dir. Directories relative to there will show up in your site.

## Constraints
1. No JS
1. No attributes except basic href etc.
1. No classes. This is what allows you to add any stylesheet that targets vanilla css
1. No SASS/SCSS/LESS. This should not be necessary with simple HTML elements
1. No React, Angular, or anything else.





