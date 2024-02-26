interface RegisterOptions<Data = any> {
  parentURL: string | URL
  data?: Data | undefined
  transferList?: any[] | undefined
}
interface Options {
  queryKey?: string | ((specifier?: string) => string)
  queryValue?: string | ((specifier?: string) => string)
  filter: string | RegExp | ((specifier: string) => boolean)
}
declare const ImportQueryHook: (
  options: Options,
) => (
  specifier: string | URL,
  context: RegisterOptions,
  nextResolve: (specifier: string | URL) => any,
) => any

export { ImportQueryHook, type Options }
