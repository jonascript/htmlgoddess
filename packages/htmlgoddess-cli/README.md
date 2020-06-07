htmlgoddess-cli
===============

&gt; TODO: description

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
$ npm install -g htmlgoddess-cli
$ htmlgoddess-cli COMMAND
running command...
$ htmlgoddess-cli (-v|--version|version)
htmlgoddess-cli/0.0.0 darwin-x64 node-v12.16.3
$ htmlgoddess-cli --help [COMMAND]
USAGE
  $ htmlgoddess-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`htmlgoddess-cli format [FILE]`](#htmlgoddess-cli-format-file)
* [`htmlgoddess-cli hello [FILE]`](#htmlgoddess-cli-hello-file)
* [`htmlgoddess-cli help [COMMAND]`](#htmlgoddess-cli-help-command)
* [`htmlgoddess-cli print [FILE]`](#htmlgoddess-cli-print-file)
* [`htmlgoddess-cli serve [FILE]`](#htmlgoddess-cli-serve-file)

## `htmlgoddess-cli format [FILE]`

formats your HTML.

```
USAGE
  $ htmlgoddess-cli format [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ htmlgoddess format
```

_See code: [src/commands/format.ts](https://github.com/jonascript/htmlgoddess-cli/blob/v0.0.0/src/commands/format.ts)_

## `htmlgoddess-cli hello [FILE]`

describe the command here

```
USAGE
  $ htmlgoddess-cli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ htmlgoddess hello
  hello world wide web from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/jonascript/htmlgoddess-cli/blob/v0.0.0/src/commands/hello.ts)_

## `htmlgoddess-cli help [COMMAND]`

display help for htmlgoddess-cli

```
USAGE
  $ htmlgoddess-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src/commands/help.ts)_

## `htmlgoddess-cli print [FILE]`

describe the command here

```
USAGE
  $ htmlgoddess-cli print [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ htmlgoddess print
  hello world wide web from ./src/hello.ts!
```

_See code: [src/commands/print.ts](https://github.com/jonascript/htmlgoddess-cli/blob/v0.0.0/src/commands/print.ts)_

## `htmlgoddess-cli serve [FILE]`

serves your website and auto-reloads when changed.

```
USAGE
  $ htmlgoddess-cli serve [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ htmlgoddess serve
```

_See code: [src/commands/serve.ts](https://github.com/jonascript/htmlgoddess-cli/blob/v0.0.0/src/commands/serve.ts)_
<!-- commandsstop -->
