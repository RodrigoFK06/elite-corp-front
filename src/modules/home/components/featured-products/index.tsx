import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  // Solo visual: orden personalizado de secciones
  const ordenVisual = [
    "Productos Destacados",
    "Perfume",
    "Perfumes Hombre",
    "Perfumes Mujer",
  ]

  const coleccionesOrdenadas = ordenVisual
    .map((nombre) => collections.find((c) => c.title === nombre))
    .filter((col): col is HttpTypes.StoreCollection => col !== undefined)

  return (
    <ul className="flex flex-col gap-y-12">
      {coleccionesOrdenadas.map((collection) => (
        <li key={collection.id}>
          <ProductRail collection={collection} region={region} />
        </li>
      ))}
    </ul>
  )
}
