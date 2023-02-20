import {
  getCommerceProvider,
  useCommerce as useCoreCommerce,
} from '@vercel/commerce'
import { mayarProvider, MayarProvider } from './provider'

export { mayarProvider }
export type { MayarProvider }

export const CommerceProvider = getCommerceProvider(mayarProvider)

export const useCommerce = () => useCoreCommerce<MayarProvider>()
