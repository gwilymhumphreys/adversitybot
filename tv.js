import { adversity, adversityLong, adversityShort } from './adversity'


async function run() {
  const team = 'last century gender norms'
  const a = await adversity(team, 34, {colour: true})
  console.log(a.summary)
  console.log(a.resultsTable)

  const al = await adversityLong(team, 34, {colour: true})
  console.log(al.summary)
  console.log(al.resultsTable)

  const as = await adversityShort(team, 34, {colour: true})
  console.log(as.summary)
  console.log(as.resultsTable)
}

run()
