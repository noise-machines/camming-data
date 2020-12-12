const add = require('../../helpers/add')
const Page = require('../../models/Page')
const Database = require('../../models/Database')

async function getReport () {
  console.log('Loading the Chaturbate homepage.')

  const $firstPage = await Page.load({ pageNumber: 1 })
  console.log(
    'Got the Chaturbate homepage. Seeing how many other pages there are.'
  )

  const pageCount = Page.getNumberOfLastLinkedPage($firstPage)
  console.log(
    `Found ${pageCount} other pages. Let's go ahead and load some of them.`
  )

  const pages = await Page.loadMultiple($firstPage, pageCount)
  console.log(`Loaded ${pages.length} other pages. Counting viewers.`)

  const viewerCount = pages.map(Page.countViewers).reduce(add, 0)
  console.log(
    `I saw ${viewerCount} total viewers across ${pages.length} pages.`
  )

  const smallestViewerCountsPerPage = pages.map(Page.getSmallestViewerCount)

  const responseData = {
    viewerCount,
    smallestViewerCountsPerPage
  }
  console.log(
    `Figured out the lowest number of viewers on each page. For the first page it was ${smallestViewerCountsPerPage[0]}.`
  )

  return responseData
}

module.exports = async (request, response) => {
  const report = await getReport()
  console.log('Report complete. Saving it to our database.')
  await Database.createChaturbateReport(report)
  console.log('Done!')
  response.send(JSON.stringify(report))
}
