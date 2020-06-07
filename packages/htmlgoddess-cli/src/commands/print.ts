import {Command, flags} from '@oclif/command'

import HTMLGoddess, {print as printSite } from "../../../htmlgoddess";

export default class Print extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ htmlgoddess print
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
  
    console.log(printSite());
    this.log(`Printing your website from ./src to ./docs`)

  }
}
