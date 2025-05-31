import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
  size = "default",
  variant = "vertical",
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
  size?: "default" | "compact"
  variant?: "vertical" | "horizontal" | "launch"
}) {
  const {
    response: { products: allProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      fields:
        "id,title,handle,thumbnail,images,collection.id,collection.title,variants.calculated_price",
      limit: 100,
    },
  })

  const filteredProducts = allProducts.filter(
    (p) => p.collection?.id === collection.id
  )

  if (!filteredProducts || filteredProducts.length === 0) return null

  return (
    <section
      className={`w-full ${
        variant === "launch" ? "pt-4 pb-10" : "py-6"
      } bg-transparent`}
    >
      <div className="content-container">
        {/* Título para sección de lanzamiento */}
        {variant === "launch" && (
          <h2 className="text-2xl font-semibold text-[var(--color-text-accent)] mb-6">
            {collection.title}
          </h2>
        )}

        {/* Lista de productos */}
        <ul
          className={`${
            variant === "horizontal"
              ? "flex gap-4 overflow-x-auto px-1 -mx-1 scroll-smooth snap-x snap-mandatory"
              : variant === "launch"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12"
          }`}
        >
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              className={`${
                variant === "horizontal"
                  ? "min-w-[300px] max-w-[350px]"
                  : variant === "launch"
                  ? "w-full"
                  : size === "compact"
                  ? "max-w-[180px]"
                  : "p-3"
              } bg-[var(--color-card-bg)] text-[var(--color-text-primary)] rounded-md shadow-sm border border-[var(--color-border)] hover:shadow-lg transition-transform transform hover:-translate-y-1 duration-200 snap-center`}
            >
              <ProductPreview
                product={product}
                region={region}
                isFeatured
                variant={variant}
              />
            </li>
          ))}
        </ul>

        {/* Botón inferior en lanzamientos */}
        {variant === "launch" && (
          <div className="w-full flex justify-center mt-10">
            <a
              href="/store"
              className="contrast-btn text-sm font-semibold py-2 px-6"
            >
              Ver Todos
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
