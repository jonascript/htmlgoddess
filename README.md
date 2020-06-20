# HTML Goddess Mono Repo

## To Do
- add: auto commitizen hook to trigger when commiting.
- Migrate this to new branch on existing repo.
- Do cleanup pass to ensure paths are being constructed properly
- Create print:auto, publish, a11y, proofread commands.
- Figure out a best practice way to safely call htmlgoddess npm if possible, or good way to expose API interface.
- Find good spell checker.
- bug: serve test leaving process open.

## Frequent issues
- Dependancies acting weird:  
  Lerna does somethings under the hood to cross-link Dependancies. If you install a new module and things stop working try ```lerna boostrap``` from the root.