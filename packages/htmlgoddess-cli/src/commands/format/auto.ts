import {Command, flags} from '@oclif/command'
import HTMLGoddess, { format } from "htmlgoddess";
import execa from 'execa';

export default class FormatAuto extends Command {
  static description = 'formats your HTML.'

  static examples = [
    `$ htmlgoddess format:auto
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
    const {args, flags} = this.parse(FormatAuto)
    execa('onchange', [`${process.cwd()}/src/**/*.html`, `${process.cwd()}/src/**/*.css`, '--', 'prettier', '{{changed}}','--write']).stdout.pipe(process.stdout);
  }
}
