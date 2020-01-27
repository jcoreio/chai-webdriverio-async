const doesOneElementSatisfy = predicate => async (client, selector) => {
  const elements = await client.$$(selector)
  const filteredList = (await Promise.all(elements.map(predicate))).filter(
    Boolean
  )
  return filteredList.length > 0
}

export default doesOneElementSatisfy
