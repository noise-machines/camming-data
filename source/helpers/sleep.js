module.exports = async function sleep (ms) {
  return new Promise((resolve, reject) => global.setTimeout(resolve, ms))
}
