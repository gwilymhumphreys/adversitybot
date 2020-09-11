import { adversity, adversityLong, adversityShort, compFromSeason } from './adversity'
import readme from './readme'


async function run() {
  // const team = 'last century gender norms'
  const helpText = await readme()
  console.log(helpText)

  const argsString = '-s 35 leave roxy alone'
  let season = 35
  let teamName = argsString

  const matches = argsString.match(/-s (\d\d)\s(.*)/)
  if (matches && matches[1]) {
    season = matches[1]
    teamName = matches[2]
  }
  const compName = compFromSeason(season)

  console.log('teamName, compName', teamName, compName)

  const a = await adversity(teamName, compName, {colour: true})
  console.log(a.summary)
  console.log(a.resultsTable)

  const al = await adversityLong(teamName, compName, {colour: true})
  console.log(al.summary)
  console.log(al.resultsTable)

  const as = await adversityShort(teamName, compName, {colour: true})
  console.log(as.summary)
  console.log(as.resultsTable)
}

run()
