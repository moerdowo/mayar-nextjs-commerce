import { SWRHook } from '@vercel/commerce/utils/types'
import useSearch, { UseSearch } from '@vercel/commerce/product/use-search'
import type { SearchProductsHook } from '@vercel/commerce/types/product'
import { useMemo } from 'react'
export default useSearch as UseSearch<typeof handler>

export type SearchProductsInput = {
  search?: string
  categoryId?: string
  brandId?: string
  sort?: string
  locale?: string
}

export const handler: SWRHook<any> = {
  fetchOptions: {
    url: '/api/commerce/catalog/products',
    method: 'GET',
  },
  async fetcher({
    input: { search, categoryId, brandId, sort },
    options,
    fetch,
  }) {
    let url = '/api/commerce/catalog/products'

    if (categoryId) {
      url += `?categoryId=${categoryId}`
    }

    if (sort) {
      url += `?sort=${sort}`
    }

    return fetch({
      ...options,
      url,
    })
  },
  useHook:
    ({ useData }) =>
    (input = {}) => {
      const response = useData({
        input: [
          ['search', input.search],
          ['categoryId', input.categoryId],
          ['brandId', input.brandId],
          ['sort', input.sort],
        ],
        swrOptions: { revalidateOnFocus: false, ...input?.swrOptions },
      })

      return useMemo(
        () =>
          Object.create(response, {
            isEmpty: {
              get() {
                return (response.data?.lineItems.length ?? 0) <= 0
              },
              enumerable: true,
            },
          }),
        [response]
      )
    },
}
