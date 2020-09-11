import _ from 'lodash'
import table from 'markdown-table'
import stringWidth from 'string-width'
import chalk from 'chalk'
import { fetchTeamMatches } from './fetch'
import gradient from './gradientString'


export const compFromSeason = season =>  `Ranked ${season}-5 conc. limit`

const tvCountFromDiff = tvDiff => Math.abs(Math.floor(tvDiff / 50))
const rankCountFromRank = rank => Math.abs(Math.floor(rank / 10))

const resultColour = (result, string) => {
  if (result === 'win') return chalk.hex('#00f827')(string)
  if (result === 'draw') return chalk.hex('#FFA85B')(string)
  return chalk.keyword('magenta')(string)
}

const formatResults = (data, useColour) => {
  const results = []

  for (const row of data.Data.rows) {
    results.unshift({
      date: new Date(row[data.Data.cols.indexOf('date')]),
      opponent: row[data.Data.cols.indexOf('coachopp')],
      opponentTeam: row[data.Data.cols.indexOf('teamnameopp')],
      result: +row[data.Data.cols.indexOf('win')] ? 'win' : (+row[data.Data.cols.indexOf('draw')] ? 'draw' : 'loss'),
      score: row[data.Data.cols.indexOf('score')] + '-' + row[data.Data.cols.indexOf('scoreopp')],
      tvDiff: +row[data.Data.cols.indexOf('tvdiff')],
      tv: +row[data.Data.cols.indexOf('value')],
      opponentTv: (+row[data.Data.cols.indexOf('value')]) - (+row[data.Data.cols.indexOf('tvdiff')]),
      opponentRank: (row[data.Data.cols.indexOf('rankopp')] || '0').replace(',', '.'),
    })
  }

  const maxTvCount = _.max(_.map(results, r => tvCountFromDiff(r.tvDiff)))
  const maxRankCount = _.max(_.map(results, r => rankCountFromRank(r.opponentRank)))

  const formattedResults = _.map(results, r => {
    const tvCount = tvCountFromDiff(r.tvDiff)
    const tvBars = '■'.repeat(tvCount)
    const tvPad = ' '.repeat(maxTvCount-tvCount)
    const rankCount = rankCountFromRank(r.opponentRank)
    const rankBars = '■'.repeat(rankCount)
    const rankPad = ' '.repeat(maxRankCount-rankCount)

    return {
      tvBarsNegative: r.tvDiff < 0 ? (useColour ? gradient('magenta', 'cyan')(tvPad+tvBars) : tvPad+tvBars) : '',
      tvDiff: r.tvDiff,
      tvBarsPositive: r.tvDiff > 0 ? (useColour ? gradient('#dfff00', '#00f827')(tvBars+tvPad) : tvBars+tvPad) : '',
      tv: r.tv,
      opponentRank: r.opponentRank,
      rankBars: useColour ? gradient('cyan', 'magenta')(rankBars+rankPad) : rankBars+rankPad,
      result: useColour ? resultColour(r.result, r.result) : r.result,
      score: useColour ? resultColour(r.result, r.score) : r.score,
      opponent: r.opponent,
      opponentTeam: r.opponentTeam,
    }
  })

  return formattedResults
}

const getResults = async (teamName, compName, useColour) => {
  const data = await fetchTeamMatches(teamName, compName)
  // console.dir(data, {depth: null, colors: true})

  const results = formatResults(data, useColour)
  const res = {
    results,
    count: results.length,
    maxTvDiff: +_.min(_.map(results, r => +r.tvDiff)).toFixed(2),
    avgTvDiff: +_.meanBy(results, r => +r.tvDiff).toFixed(2),
    maxRank: +_.max(_.map(results, r => +r.opponentRank)).toFixed(2),
    avgRank: +_.meanBy(results, r => +r.opponentRank).toFixed(2),
  }

  return res
}


const resultsToTable = (results, headings) => {
  const mdTable = table(
    [
      _.map(headings, 'label'),
      ..._.map(results, r => _.map(headings, h => r[h.field])),
    ],
    {
      align: ['r', 'r'],
      stringLength: stringWidth,
    },
  )

  return mdTable
}

export async function _adversity(headings, teamName, compName, options={}) {
  const res = await getResults(teamName, compName, options.colour)

  const {
    results,
    count,
    maxTvDiff,
    avgTvDiff,
    maxRank,
    avgRank,
  } = res

  const resultsTable = resultsToTable(results, headings)

  const summary = table(
    [
      ['', ''],
      ['Total games', count],
      ['Average tv difference', avgTvDiff],
      ['Worst tv difference', maxTvDiff],
      ['Average opponent rank', avgRank],
      ['Highest opponent rank', maxRank],
    ],
    {
      align: ['l', 'r'],
      delimiterStart: false,
      delimiterEnd: false,
    },
  ).split('\n').slice(2).join('\n')

  return {
    resultsTable,
    summary,
    ...res,
  }
}

export async function adversity(...args) {
  const headings = [
    {label: '-Diff', field: 'tvBarsNegative'},
    {label: 'Diff', field: 'tvDiff'},
    {label: '+Diff', field: 'tvBarsPositive'},
    {label: 'Rank', field: 'opponentRank'},
    {label: 'Rank', field: 'rankBars'},
    {label: 'TV', field: 'tv'},
    {label: 'Scr', field: 'score'},
    {label: 'Opponent', field: 'opponent'},
  ]
  return _adversity(headings, ...args)
}

export async function adversityShort(...args) {
  const headings = [
    {label: 'Diff', field: 'tvDiff'},
    {label: 'Rank', field: 'opponentRank'},
    {label: 'Scr', field: 'score'},
    {label: 'Opponent', field: 'opponent'},
  ]
  return _adversity(headings, ...args)
}

export async function adversityLong(...args) {
  const headings = [
    {label: '', field: 'tvBarsNegative'},
    {label: 'Diff', field: 'tvDiff'},
    {label: '', field: 'tvBarsPositive'},
    {label: 'Rank', field: 'opponentRank'},
    {label: '', field: 'rankBars'},
    {label: 'TV', field: 'tv'},
    {label: 'Res', field: 'result'},
    {label: 'Scr', field: 'score'},
    {label: 'Opponent', field: 'opponent'},
    {label: 'Team', field: 'opponentTeam'},
  ]
  return _adversity(headings, ...args)
}
