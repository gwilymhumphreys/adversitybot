import { adversity, adversityLong, adversityShort } from './adversity'


async function run() {
  const team = 'last century gender norms'
  console.log(await adversity(team, 34, {colour: true}))
  console.log()
  console.log(await adversityLong(team, 34, {colour: true}))
  console.log()
  console.log(await adversityShort(team, 34, {colour: true}))
  console.log()
}

run()
