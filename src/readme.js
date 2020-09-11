import { promises as fs } from 'fs'

let text

export default async function readme() {
  if (!text) {
    text = await fs.readFile('readme.md', 'utf8')
  }
  return text
}
