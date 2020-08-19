
## v0.4.4
- Fix create command issue.
- Move tests to use .gitignore instead of submodules. 

## v0.3.8 - Alpha 
This is a complete rewrite from the current version currently under development.
- Moved to lerna monorepo.
- Using oclif for CLI.
- Webpack plugin moved to its own package.
- fix: serve test leaving process open.
- feat: prompt unit test mocking.
- feat: create command
- feat: print:auto
- test: intercept and setup testing for CLI output
- fix: print:auto double printing.
- task: Cleaned up paths
- task: standardize param name to projectDir.
- add: warning message for user if they try to print when docs has been edited manually.
- fix: mockCLIAnswers not working properly.
- refactor: consolidated template generation code.
- feat: style chooser on create.

0.0.2 
- fix: git save/publish commands not cleaning up.
- fix: global cli not loading dependancies.
- fix: templates not compiling properly with webpack called as a module.

0.0.1
- Abstract core htmlgoddess bin from CLI commands.
