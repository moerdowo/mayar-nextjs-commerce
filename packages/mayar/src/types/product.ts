import { ProductVariant } from '@vercel/commerce/types/cart'

export interface ICover {
  id: string
  fileType: string
  url: string
}

export interface IMultipleImage {
  id: string
  fileType: string
  createdAt: Date
  updatedAt: Date
  url: string
}

export interface IProduct {
  id: string
  amount: null | number
  category: string
  createdAt: number
  description: string
  link: string
  type: string
  status: string
  name: string
  limit: null | number
  redirectUrl: string
  event: any
  order: any
  path: string
  coverImageId: null | string
  multipleImageId: null | string
  multipleImage: null | IMultipleImage[]
  coverImage: null | ICover
}

export interface IProductAPI {
  statusCode: number
  messages: string
  hasMore: boolean
  pageCount: number
  pageSize: number
  page: number
  data: IProduct[]
}

export interface IGetProduct {
  statusCode: number
  messages: string
  data: IProduct
}
