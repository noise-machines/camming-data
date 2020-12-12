function parseViewers ($page, broadcasterElement) {
  const broadcastSummary = $page(broadcasterElement).text()
  // Broadcast summary is a string like "1.8 hrs, 9514 viewers".
  const viewerInfo = broadcastSummary.split(',')[1]
  const viewerCount = viewerInfo.replace(' viewers', '')
  return global.parseInt(viewerCount)
}

module.exports.getViewerCount = function (broadcaster) {
  return broadcaster.viewerCount
}

module.exports.get = function ($page, broadcasterElement) {
  return {
    viewerCount: parseViewers($page, broadcasterElement)
  }
}
