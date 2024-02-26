interface RegisterOptions<Data = any> {
  parentURL: string | URL
  data?: Data | undefined
  transferList?: any[] | undefined
}

export interface Options {
  queryKey?: string | ((specifier?: string) => string)
  queryValue?: string | ((specifier?: string) => string)
  filter: string | RegExp | ((specifier: string) => boolean)
}

const formatItem = (
  optionValue: string | ((specifier?: string) => string),
  convert: { key: string },
): ((specifier?: string) => string) => {
  const { key } = convert
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let fn: (specifier?: string) => string = optionValue
  if (typeof optionValue === 'string') {
    fn = () => optionValue as string
  } else if (typeof optionValue !== 'function') {
    throw new Error(`${key} can only be string | undefined | function`)
  }

  return fn
}

const formatOptions = (
  options: Options,
): Options & {
  filter: (specifier: string) => boolean
  queryKey: (specifier?: string) => string
  queryValue: (specifier?: string) => string
} => {
  let { queryKey = 't', queryValue = () => `${Date.now()}` } = options
  const { filter } = options

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let filterFn: (specifier: string) => boolean = filter
  if (typeof filter === 'string') {
    filterFn = (specifier: string) => specifier.includes(filter as string)
  } else if (filter instanceof RegExp) {
    filterFn = (specifier: string) => (filter as RegExp).test(specifier)
  } else if (typeof filter !== 'function') {
    throw new Error('options.filter can only be string | RegExp | function')
  }

  queryValue = formatItem(queryValue, { key: 'queryValue' })
  queryKey = formatItem(queryKey, { key: 'queryKey' })
  return {
    ...options,
    filter: filterFn,
    queryKey,
    queryValue,
  }
}

export const ImportQueryHook = (options: Options) => {
  const { queryKey, filter, queryValue } = formatOptions(options)
  function resolve(
    specifier: string | URL,
    context: RegisterOptions,
    nextResolve: (specifier: string | URL) => any,
  ) {
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
