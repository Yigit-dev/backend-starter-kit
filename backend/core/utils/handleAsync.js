const handleAsync = async promise => {
  try {
    const result = await promise
    return [result, null]
  } catch (error) {
    return [null, error]
  }
}

module.exports = handleAsync
