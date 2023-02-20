import { MutationHook } from '@vercel/commerce/utils/types'
import useUpdateItem, {
  UseUpdateItem,
} from '@vercel/commerce/cart/use-update-item'

export default useUpdateItem as UseUpdateItem<any>

export const handler: MutationHook<any> = {
  fetchOptions: {
    url: '/api/commerce/cart',
    method: 'PUT',
  },
  async fetcher({ input, options, fetch }) {
    console.log(`Update:`, input)
  },
  useHook:
    ({ fetch }) =>
    () => {
      return async function addItem() {
        return {}
      }
    },
}
