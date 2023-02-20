import { IProductAPI } from '../../types/product'

export type GetAllProductPathsResult = {
  products: Array<{ path: string }>
}

export default function getAllProductPathsOperation() {
  async function getAllProductPaths(): Promise<GetAllProductPathsResult> {
    try {
      const res = await fetch(`https://api.mayar.id/hl/v1/product`, {
        headers: {
          Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
        },
      })

      console.log(`[operations/get-all-product-paths]Status: ${res.statusText}`)
      if (!res.ok) {
        return {
          products: [],
        }
      }

      let paths: Array<{ path: string }> = []
      const result: IProductAPI = await res.json()

      result.data.map((product, _) => {
        paths.push({
          path: `/${product.id}`,
        })
      })

      return Promise.resolve({
        // products: data.products.map(({ path }) => ({ path })),
        products: paths,
      })
    } catch (err) {
      console.error(err)
      return {
        products: [],
      }
    }
  }

  return getAllProductPaths
}
