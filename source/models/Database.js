const Airtable = require('airtable')

const baseId = 'appkPHne3XZT5HzqQ'
const tableName = 'Chaturbate Reports'
const base = new Airtable({ apiKey: 'key0zV5moFSdVW8vN' }).base(baseId)
const table = base(tableName)

module.exports.createChaturbateReport = async function (report) {
  return new Promise((resolve, reject) => {
    const smallestViewerCounts = report.smallestViewerCountsPerPage.join(', ')

    const fields = {
      Date: new Date().toISOString(),
      'Total viewer count': report.viewerCount,
      'Smallest amount of viewers per page': smallestViewerCounts
    }

    function callback (err, records) {
      if (err) {
        console.error(err)
        reject(err)
        return
      }

      resolve(records)
    }

    table.create([{ fields }], callback)
  })
}
