htmlgoddess-cli
===============

&gt; TODO: description
## - Figure out safe way to run npm modules from adjacent pacakges


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/htmlgoddess-cli.svg)](https://npmjs.org/package/htmlgoddess-cli)
[![Downloads/week](https://img.shields.io/npm/dw/htmlgoddess-cli.svg)](https://npmjs.org/package/htmlgoddess-cli)
[![License](https://img.shields.io/npm/l/htmlgoddess-cli.svg)](https://github.com/jonascript/htmlgoddess-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @htmlgoddess/cli
$ htmlgoddess COMMAND
running command...
$ htmlgoddess (-v|--version|version)
@htmlgoddess/cli/0.3.9-alpha.0 darwin-x64 node-v12.18.1
$ htmlgoddess --help [COMMAND]
USAGE
  $ htmlgoddess COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`htmlgoddess a11y [PROJECTDIR]`](#htmlgoddess-a11y-projectdir)
* [`htmlgoddess create [PROJECTDIR]`](#htmlgoddess-create-projectdir)
* [`htmlgoddess format [PROJECTDIR]`](#htmlgoddess-format-projectdir)
* [`htmlgoddess format:auto [FILE]`](#htmlgoddess-formatauto-file)
* [`htmlgoddess hello [FILE]`](#htmlgoddess-hello-file)
* [`htmlgoddess help [COMMAND]`](#htmlgoddess-help-command)
* [`htmlgoddess print [PROJECTDIR]`](#htmlgoddess-print-projectdir)
* [`htmlgoddess print:auto [PROJECTDIR]`](#htmlgoddess-printauto-projectdir)
* [`htmlgoddess publish [FILE]`](#htmlgoddess-publish-file)
* [`htmlgoddess save [PROJECTDIR]`](#htmlgoddess-save-projectdir)
* [`htmlgoddess serve [BASEPATH]`](#htmlgoddess-serve-basepath)
* [`htmlgoddess serve:auto [FILE]`](#htmlgoddess-serveauto-file)

## `htmlgoddess a11y [PROJECTDIR]`

runs accessibility validation

```
USAGE
  $ htmlgoddess a11y [PROJECTDIR]

OPTIONS
  -h, --help                                         show CLI help
  -s, --standard=Section508|WCAG2A|WCAG2AA|WCAG2AAA  [default: WCAG2AA] Web Accessibility Guideline standard
  -u, --url=url                                      Run on individual URL

EXAMPLES
  $ htmlgoddess a11y
  $ htmlgoddess a11y http://localhost:3000/index.html
  $ htmlgoddess a11y ./path/to/your/file.html
```

_See code: [lib/commands/a11y/index.js](https://github.com/jonascript/htmlgoddess/blob/v0.3.9-alpha.0/lib/commands/a11y/index.js)_

## `htmlgoddess create [PROJECTDIR]`

creates a new website project under the grace of the HTML Goddess

```
USAGE
  $ htmlgoddess create [PROJECTDIR]

OPTIONS
  -f, --force
  -h, --help   show CLI help

EXAMPLES
  $ htmlgoddess create ./path/to/directory
  $ htmlgoddess create
```

_See code: [lib/commands/create/index.js](https://github.com/jonascript/htmlgoddess/blob/v0.3.9-alpha.0/lib/commands/create/index.js)_

## `htmlgoddess format [PROJECTDIR]`

formats your HTML.

```
USAGE
  $ htmlgoddess format [PROJECTDIR]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ htmlgoddess format
```

_See code: [lib/commands/format/index.js](https://github.com/jonascript/htmlgoddess/blob/v0.3.9-alpha.0/lib/commands/format/index.js)_

## `htmlgoddess format:auto [FILE]`

formats your HTML.

```
USAGE
  $ htmlgoddess format:auto [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ htmlgoddess format:auto
```

_See code: [lib/commands/format/auto.js](https://github.com/jonascript/htmlgoddess/blob/v0.3.9-alpha.0/lib/commands/format/auto.js)_

## `htmlgoddess hello [FILE]`

describe the command here

```
USAGE
  $ htmlgoddess hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ htmlgoddess hello
  hello world wide web from ./src/hello.ts!
```

_See code: [lib/commands/hello.js](https://github.com/jonascript/htmlgoddess/blob/v0.3.9-alpha.0/lib/commands/hello.js)_

## `htmlgoddess help [COMMAND]`

display help for htmlgoddess

```
USAGE
  $ htmlgoddess help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src/commands/help.ts)_

## `htmlgoddess print [PROJECTDIR]`

describe the command here

```
USAGE
  $ htmlgoddess print [PROJECTDIR]

OPTIONS
  -a, --[no-]a11y
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ htmlgoddess print
  hello world wide web from ./src/hello.ts!
```

_See code: [lib/commands/print/index.js](https://github.com/jonascript/htmlgoddess/blob/v0.3.9-alpha.0/lib/commands/print/index.js)_

## `htmlgoddess print:auto [PROJECTDIR]`

describe the command here

```
USAGE
  $ htmlgoddess print:auto [PROJECTDIR]

OPTIONS
  -d, --debounce=debounce  [default: 500]
  -f, --force
  -h, --help               show CLI help
  -n, --name=name          name to print

EXAMPLE
  $ htmlgoddess print
  hello world wide web from ./src/hello.ts!
```

_See code: [lib/commands/print/auto.js](https://github.com/jonascript/htmlgoddess/blob/v0.3.9-alpha.0/lib/commands/print/auto.js)_

## `htmlgoddess publish [FILE]`

formats your HTML.

```
USAGE
  $ htmlgoddess publish [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ htmlgoddess format
```

_See code: [lib/commands/publish/index.js](https://github.com/jonascript/htmlgoddess/blob/v0.3.9-alpha.0/lib/commands/publish/index.js)_

## `htmlgoddess save [PROJECTDIR]`

formats your HTML.

```
USAGE
  $ htmlgoddess save [PROJECTDIR]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ htmlgoddess format
```

_See code: [lib/commands/save/index.js](https://github.com/jonascript/htmlgoddess/blob/v0.3.9-alpha.0/lib/commands/save/index.js)_

## `htmlgoddess serve [BASEPATH]`

serves your website and auto-reloads when changed.

```
USAGE
  $ htmlgoddess serve [BASEPATH]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ htmlgoddess serve
```

_See code: [lib/commands/serve/index.js](https://github.com/jonascript/htmlgoddess/blob/v0.3.9-alpha.0/lib/commands/serve/index.js)_

## `htmlgoddess serve:auto [FILE]`

serves your website and auto-reloads when changed.

```
USAGE
  $ htmlgoddess serve:auto [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ htmlgoddess serve
```

_See code: [lib/commands/serve/auto.js](https://github.com/jonascript/htmlgoddess/blob/v0.3.9-alpha.0/lib/commands/serve/auto.js)_
<!-- commandsstop -->
