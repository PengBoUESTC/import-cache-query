const formatItem = (optionValue, convert) => {
  const { key } = convert
  let fn = optionValue
  if (typeof optionValue === 'string') {
    fn = () => optionValue
  } else if (typeof optionValue !== 'function') {
    throw new Error(`${key} can only be string | undefined | function`)
  }
  return fn
}
const formatOptions = (options) => {
  let { queryKey = 't', queryValue = () => `${Date.now()}` } = options
  const { filter } = options
  let filterFn = filter
  if (typeof filter === 'string') {
    filterFn = (specifier) => specifier.includes(filter)
  } else if (filter instanceof RegExp) {
    filterFn = (specifier) => filter.test(specifier)
  } else if (typeof filter !== 'function') {
    throw new Error('options.filter can only be string | RegExp | function')
  }
  queryValue = formatItem(queryValue, { key: 'queryValue' })
  queryKey = formatItem(queryKey, { key: 'queryKey' })
  return Object.assign(Object.assign({}, options), {
    filter: filterFn,
    queryKey,
    queryValue,
  })
}
const ImportQueryHook = (options) => {
  const { queryKey, filter, queryValue } = formatOptions(options)
  function resolve(specifier, context, nextResolve) {
    const { parentURL } = context
    const urlIns = parentURL
      ? new URL(specifier, parentURL)
      : new URL(specifier)
    const preUrl = urlIns.href
    urlIns.searchParams.set(queryKey(preUrl), queryValue(preUrl))
    const url = urlIns.href
    if (filter(url)) {
      return {
        shortCircuit: true,
        url,
      }
    }
    return nextResolve(specifier)
  }
  return resolve
}

export { ImportQueryHook }
