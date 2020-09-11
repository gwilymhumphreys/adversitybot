import fetch from 'node-fetch'
import FormData from 'form-data'


const url = 'http://www.mordrek.com:8888/Query'

export async function fetchTeamMatches(teamName, compName) {
  if (!teamName) throw new Error('Enter a team name to check after the command, e.g. ```!a My lovely team name```')

  const query = {
    selects: ['teammatches'],
    wheres: {
      id: 'r',
      type: 'AND',
      left: {
        type: 'single',
        col: 'competitionname',
        op: '=',
        value: compName,
      },
      right: {
        id: 'pand',
        type: 'AND',
        left: {
          id: 'plid',
          type: 'single',
          col: 'leaguename',
          value: 'Cabalvision Official League',
          op: '=',
        },
        right: {
          id: 'plat',
          type: 'single',
          col: 'platform',
          value: 'pc',
          op: '=',
        },
      },
    },
    groups: [{ col: '<none>' }],
    orders: [{ col: 'finished' }],
    filters: [{
      id: 0,
      col: 'teamname',
      op: '=',
      value: teamName,
    }],
    presentation: {
      from: '1',
      max: '200',
      show: '<standard>',
      alias: [],
      gui: 'table',
      dbClickHandler: true,
    },
  }

  const form = new FormData()
  form.append('query', JSON.stringify(query))
  const res = await fetch(url, {
    method: 'POST',
    body: form,
  })
  const json = await res.json()

  if (!json.IsSuccess) throw new Error('Beeep boop bummer, GoblinSpy says IsSuccess is false, so that was not a success.')
  if (!json.Data.rows.length) throw new Error(`No games found for team ${teamName} in competition ${compName} 🤷‍♂️. Remember it's case sensitive.`)

  return json
}
