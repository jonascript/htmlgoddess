import {Command, flags} from '@oclif/command'

import HTMLGoddess, {print} from "../../../htmlgoddess";


export default class Print extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ htmlgoddess-cli hello
hello world wide web from ./src/hello.ts!
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Print)
  
    console.log(print());
    const name = flags.name ?? 'world'
    this.log(`heldlo ${name} from ./src/commands/hello.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
