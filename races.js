import _ from 'lodash'
import fetch from 'node-fetch'
import gradient from 'gradient-string'


const compName = season => `Ranked%20${season}-5%20conc.%20limit`

const run = async () => {
  const season = 34
  const url =
    `http://www.mordrek.com:8888/goblinSpy/web/Query?query=%7B%22selects%22%3A%5B%22leaguestandings%22%5D%2C%22wheres%22%3A%7B%22id%22%3A%22r%22%2C%22type%22%3A%22AND%22%2C%22left%22%3A%7B%22type%22%3A%22single%22%2C%22col%22%3A%22competitionname%22%2C%22op%22%3A%22%3D%22%2C%22value%22%3A%22`
    + compName(season)
    + `%22%7D%2C%22right%22%3A%7B%22id%22%3A%22pand%22%2C%22type%22%3A%22AND%22%2C%22left%22%3A%7B%22id%22%3A%22plid%22%2C%22type%22%3A%22single%22%2C%22col%22%3A%22leaguename%22%2C%22value%22%3A%22Cabalvision%20Official%20League%22%2C%22op%22%3A%22%3D%22%7D%2C%22right%22%3A%7B%22id%22%3A%22plat%22%2C%22type%22%3A%22single%22%2C%22col%22%3A%22platform%22%2C%22value%22%3A%22pc%22%2C%22op%22%3A%22%3D%22%7D%7D%7D%2C%22groups%22%3A%5B%7B%22col%22%3A%22idraces%22%7D%5D%2C%22orders%22%3A%5B%5D%2C%22filters%22%3A%5B%5D%2C%22presentation%22%3A%7B%22from%22%3A%221%22%2C%22max%22%3A%222000%22%2C%22show%22%3A%22%3Caliased%3E%22%2C%22alias%22%3A%5B%7B%22op%22%3A%22%3Cshow%3E%22%2C%22target%22%3A%22idracesimg%22%7D%2C%7B%22op%22%3A%22%3Cshow%3E%22%2C%22target%22%3A%22idraces%22%7D%5D%2C%22gui%22%3A%22barchart%22%2C%22guiData%22%3A%7B%22x%22%3A%22idraces%22%2C%22y%22%3A%5B%22groupcount%22%5D%7D%2C%22readOnly%22%3Atrue%7D%7D`
  const res = await fetch(url)
  const json = await res.json()

  const sorted = _.sortBy(json.Data.rows, j => -j[2])
  let str = ''

  _.forEach(sorted, s => {
    str += (`${s[0].padStart(12)}:   ${s[2].padEnd(3)} ${'|'.repeat(s[2])}`)
    str += '\n'
  })

  console.log(gradient('cyan', 'magenta', 'pink')(str))
}

run()
