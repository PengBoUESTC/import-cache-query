# import-cache-query

- import file without cache

```javascript
// plugin.mjs
import { ImportQueryHook } from './hook.mjs'

export const resolve = ImportQueryHook({
  filter: 'postcss.config'
})

// vite.config.ts
import { register } from 'node:module'
register('./plugin.mjs', import.meta.url)

```
