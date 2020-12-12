module.exports = function mapSelect ({ elements, map, select }) {
  let desiredElement = elements[0]
  let desiredElementValue = map(desiredElement)

  for (let i = 1; i < elements.length; i++) {
    const currentElement = elements[i]
    const currentElementValue = map(currentElement)

    desiredElementValue = select(currentElementValue, desiredElementValue)
    if (desiredElementValue === currentElementValue) {
      desiredElement = currentElement
    }
  }

  return [desiredElementValue, desiredElement]
}
