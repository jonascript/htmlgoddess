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
@htmlgoddess/cli/0.1.1 darwin-x64 node-v12.18.1
$ htmlgoddess --help [COMMAND]
USAGE
  $ htmlgoddess COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`htmlgoddess a11y [URL] [STANDARD]`](#htmlgoddess-a11y-url-standard)
* [`htmlgoddess create [PROJECTDIR]`](#htmlgoddess-create-projectdir)
* [`htmlgoddess format [PROJECTDIR]`](#htmlgoddess-format-projectdir)
* [`htmlgoddess format:auto [FILE]`](#htmlgoddess-formatauto-file)
* [`htmlgoddess hello [FILE]`](#htmlgoddess-hello-file)
* [`htmlgoddess help [COMMAND]`](#htmlgoddess-help-command)
* [`htmlgoddess print`](#htmlgoddess-print)
* [`htmlgoddess print:auto [PROJECTSRCDIR]`](#htmlgoddess-printauto-projectsrcdir)
* [`htmlgoddess publish [FILE]`](#htmlgoddess-publish-file)
* [`htmlgoddess save [BASEPATH]`](#htmlgoddess-save-basepath)
* [`htmlgoddess serve [BASEPATH]`](#htmlgoddess-serve-basepath)
* [`htmlgoddess serve:auto [FILE]`](#htmlgoddess-serveauto-file)

## `htmlgoddess a11y [URL] [STANDARD]`

describe the command here

```
USAGE
  $ htmlgoddess a11y [URL] [STANDARD]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ htmlgoddess a11y
```

_See code: [lib/commands/a11y/index.js](https://github.com/jonascript/htmlgoddess-cli/blob/v0.1.1/lib/commands/a11y/index.js)_

## `htmlgoddess create [PROJECTDIR]`

describe the command here

```
USAGE
  $ htmlgoddess create [PROJECTDIR]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ htmlgoddess create
  hello world wide web from ./src/hello.ts!
```

_See code: [lib/commands/create/index.js](https://github.com/jonascript/htmlgoddess-cli/blob/v0.1.1/lib/commands/create/index.js)_

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

_See code: [lib/commands/format/index.js](https://github.com/jonascript/htmlgoddess-cli/blob/v0.1.1/lib/commands/format/index.js)_

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

_See code: [lib/commands/format/auto.js](https://github.com/jonascript/htmlgoddess-cli/blob/v0.1.1/lib/commands/format/auto.js)_

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

_See code: [lib/commands/hello.js](https://github.com/jonascript/htmlgoddess-cli/blob/v0.1.1/lib/commands/hello.js)_

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

## `htmlgoddess print`

describe the command here

```
USAGE
  $ htmlgoddess print

OPTIONS
  -a, --[no-]a11y
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ htmlgoddess print
  hello world wide web from ./src/hello.ts!
```

_See code: [lib/commands/print/index.js](https://github.com/jonascript/htmlgoddess-cli/blob/v0.1.1/lib/commands/print/index.js)_

## `htmlgoddess print:auto [PROJECTSRCDIR]`

describe the command here

```
USAGE
  $ htmlgoddess print:auto [PROJECTSRCDIR]

OPTIONS
  -d, --debounce=debounce  [default: 500]
  -f, --force
  -h, --help               show CLI help
  -n, --name=name          name to print

EXAMPLE
  $ htmlgoddess print
  hello world wide web from ./src/hello.ts!
```

_See code: [lib/commands/print/auto.js](https://github.com/jonascript/htmlgoddess-cli/blob/v0.1.1/lib/commands/print/auto.js)_

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

_See code: [lib/commands/publish/index.js](https://github.com/jonascript/htmlgoddess-cli/blob/v0.1.1/lib/commands/publish/index.js)_

## `htmlgoddess save [BASEPATH]`

formats your HTML.

```
USAGE
  $ htmlgoddess save [BASEPATH]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ htmlgoddess format
```

_See code: [lib/commands/save/index.js](https://github.com/jonascript/htmlgoddess-cli/blob/v0.1.1/lib/commands/save/index.js)_

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

_See code: [lib/commands/serve/index.js](https://github.com/jonascript/htmlgoddess-cli/blob/v0.1.1/lib/commands/serve/index.js)_

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

_See code: [lib/commands/serve/auto.js](https://github.com/jonascript/htmlgoddess-cli/blob/v0.1.1/lib/commands/serve/auto.js)_
<!-- commandsstop -->
