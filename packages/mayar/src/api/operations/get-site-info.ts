import { OperationContext } from '@vercel/commerce/api/operations'
import { Category, GetSiteInfoOperation } from '@vercel/commerce/types/site'
import { MayarConfig } from '../index'
import { IProductAPI } from '../../types/product'

export type GetSiteInfoResult<
  T extends { categories: any[]; brands: any[] } = {
    categories: Category[]
    brands: any[]
  }
> = T

export default function getSiteInfoOperation({}: OperationContext<any>) {
  async function getSiteInfo({
    query,
    variables,
    config: cfg,
  }: {
    query?: string
    variables?: string
    config?: Partial<MayarConfig>
    preview?: boolean
  } = {}): Promise<GetSiteInfoResult> {
    try {
      const res = await fetch(`https://api.mayar.id/hl/v1/product`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
        },
      })

      console.log(`[operations/get-site-info]Status: ${res.statusText}`)
      if (!res.ok) {
        return {
          categories: [],
          brands: [],
        }
      }

      let categories: Category[] = []
      let prevType: string = ''
      const result: IProductAPI = await res.json()

      result.data.map((product, _) => {
        if (prevType !== product.type) {
          let name = product.type
            .split('_')
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join(' ')

          categories.push({
            id: product.type,
            name,
            slug: product.type,
            path: `/${product.type}`,
          })

          prevType = product.type
          return
        }

        return
      })

      return Promise.resolve({
        categories,
        brands: [],
      })
    } catch (err) {
      console.error(err)
      return {
        categories: [],
        brands: [],
      }
    }
  }

  return getSiteInfo
}
