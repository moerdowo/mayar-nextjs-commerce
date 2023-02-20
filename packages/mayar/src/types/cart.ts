import {
  Cart as CartOriginal,
  LineItem,
  RemoveItemHook,
  UpdateItemHook,
} from '@vercel/commerce/types/cart'
import type { IProduct } from './product'

export type MayarProduct = {
  qty: number
  amount: number
  product: IProduct
}

export type MayarCart = {
  typeCart: string
  userId: string
  sessionId: string
  items: number
  amountTotal: number
  productItems: MayarProduct[]
}

export type MayarCartAPI = {
  statusCode: number
  messages: string
  data: MayarCart
}

export interface Cart extends CartOriginal {}
