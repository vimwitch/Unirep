oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @unirep/cli
$ unirep COMMAND
running command...
$ unirep (--version)
@unirep/cli/0.0.0 linux-x64 node-v16.14.0
$ unirep --help [COMMAND]
USAGE
  $ unirep COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`unirep hello PERSON`](#unirep-hello-person)
* [`unirep hello world`](#unirep-hello-world)
* [`unirep help [COMMAND]`](#unirep-help-command)
* [`unirep plugins`](#unirep-plugins)
* [`unirep plugins:install PLUGIN...`](#unirep-pluginsinstall-plugin)
* [`unirep plugins:inspect PLUGIN...`](#unirep-pluginsinspect-plugin)
* [`unirep plugins:install PLUGIN...`](#unirep-pluginsinstall-plugin-1)
* [`unirep plugins:link PLUGIN`](#unirep-pluginslink-plugin)
* [`unirep plugins:uninstall PLUGIN...`](#unirep-pluginsuninstall-plugin)
* [`unirep plugins:uninstall PLUGIN...`](#unirep-pluginsuninstall-plugin-1)
* [`unirep plugins:uninstall PLUGIN...`](#unirep-pluginsuninstall-plugin-2)
* [`unirep plugins update`](#unirep-plugins-update)

## `unirep hello PERSON`

Say hello

```
USAGE
  $ unirep hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/unirep/unirep/blob/v0.0.0/dist/commands/hello/index.ts)_

## `unirep hello world`

Say hello world

```
USAGE
  $ unirep hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `unirep help [COMMAND]`

Display help for unirep.

```
USAGE
  $ unirep help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for unirep.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `unirep plugins`

List installed plugins.

```
USAGE
  $ unirep plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ unirep plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.0/src/commands/plugins/index.ts)_

## `unirep plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ unirep plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ unirep plugins add

EXAMPLES
  $ unirep plugins:install myplugin 

  $ unirep plugins:install https://github.com/someuser/someplugin

  $ unirep plugins:install someuser/someplugin
```

## `unirep plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ unirep plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ unirep plugins:inspect myplugin
```

## `unirep plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ unirep plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ unirep plugins add

EXAMPLES
  $ unirep plugins:install myplugin 

  $ unirep plugins:install https://github.com/someuser/someplugin

  $ unirep plugins:install someuser/someplugin
```

## `unirep plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ unirep plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ unirep plugins:link myplugin
```

## `unirep plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ unirep plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ unirep plugins unlink
  $ unirep plugins remove
```

## `unirep plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ unirep plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ unirep plugins unlink
  $ unirep plugins remove
```

## `unirep plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ unirep plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ unirep plugins unlink
  $ unirep plugins remove
```

## `unirep plugins update`

Update installed plugins.

```
USAGE
  $ unirep plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
