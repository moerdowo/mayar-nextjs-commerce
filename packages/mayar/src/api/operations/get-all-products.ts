import { Product } from '@vercel/commerce/types/product'
import { GetAllProductsOperation } from '@vercel/commerce/types/product'
import type { OperationContext } from '@vercel/commerce/api/operations'
import type { MayarConfig, Provider } from '../index'
import { ICover, IMultipleImage, IProductAPI } from '../../types/product'

export default function getAllProductsOperation({
  commerce,
}: OperationContext<any>) {
  async function getAllProducts<T extends GetAllProductsOperation>({
    query = '',
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<MayarConfig>
    preview?: boolean
  } = {}): Promise<{ products: Product[] }> {
    try {
      const res = await fetch(`https://api.mayar.id/hl/v1/product`, {
        headers: {
          Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
        },
      })

      console.log(`[operations/get-all-products]Status: ${res.statusText}`)
      if (!res.ok) {
        return {
          products: [],
        }
      }

      const result: IProductAPI = await res.json()

      let products: Product[] = result.data.map((item, _) => {
        const product: Product = {
          id: item.id,
          name: item.name,
          description: '',
          descriptionHtml: item.description,
          path: `/${item.id}`,
          slug: item.link,
          category: item.category,
          type: item.type,
          images: item.coverImage
            ? [
                {
                  url: item.coverImage.url,
                  alt: item.name,
                  width: 1000,
                  height: 1000,
                },
              ]
            : item.multipleImage && item.multipleImage.length > 0
            ? [
                {
                  url: item.multipleImage[0].url,
                  alt: item.name,
                  width: 1000,
                  height: 1000,
                },
              ]
            : [],
          variants: [],
          price: {
            value: item.amount ? item.amount : 0,
            currencyCode: 'IDR',
          },
          options: [],
          createdAt: item.createdAt, // Add the createdAt property to the product
        }
        return product
      })

      return {
        products,
      }
    } catch (err) {
      console.error(err)
      return {
        products: [],
      }
    }
  }
  return getAllProducts
}
