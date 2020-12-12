const got = require('got')
const cheerio = require('cheerio')
const Broadcaster = require('./Broadcaster')
const selectBiggest = require('../helpers/selectBiggest')
const mapSelect = require('../helpers/mapSelect')
const add = require('../helpers/add')
const sleep = require('../helpers/sleep')
const selectSmallest = require('../helpers/selectSmallest')

function getLinkedPageNumber (link) {
  // href looks like "/?page=2"
  const pageString = link.attribs.href.replace(/.*page=/g, '')
  return global.parseInt(pageString)
}

function getLinksToOtherPages ($page) {
  return $page('[href*="?page="]').toArray()
}

module.exports.getNumberOfLastLinkedPage = function ($page) {
  const linksToOtherPages = getLinksToOtherPages($page)

  const [lastPageNumber] = mapSelect({
    elements: linksToOtherPages,
    map: getLinkedPageNumber,
    select: selectBiggest
  })

  return lastPageNumber
}

module.exports.load = async function ({ pageNumber = 1 }) {
  const response = await got(`https://chaturbate.com/?page=${pageNumber}`)
  return cheerio.load(response.body)
}

module.exports.countViewers = function ($page) {
  // Each element in this list contains text like "1.8 hrs, 9514 viewers".
  const viewerCountOnPage = module.exports
    .getBroadcasters($page)
    .map(broadcaster => broadcaster.viewerCount)
    .reduce(add, 0)
  return viewerCountOnPage
}

module.exports.getBroadcasters = function ($page) {
  const broadcasterElements = $page('.cams').toArray()
  return broadcasterElements.map(element => Broadcaster.get($page, element))
}

module.exports.loadMultiple = async function ($firstPage, lastPageNumber) {
  const pages = [$firstPage]
  lastPageNumber = Math.min(lastPageNumber, 5)

  for (let pageNumber = 2; pageNumber <= lastPageNumber; pageNumber++) {
    pages[pageNumber - 1] = await module.exports.load({ pageNumber })
    await sleep(1000 + Math.random() * 1000)
  }

  return pages
}

module.exports.getSmallestViewerCount = function ($page) {
  const broadcasters = module.exports.getBroadcasters($page)
  const [smallestViewerCount] = mapSelect({
    elements: broadcasters,
    map: Broadcaster.getViewerCount,
    select: selectSmallest
  })
  return smallestViewerCount
}
