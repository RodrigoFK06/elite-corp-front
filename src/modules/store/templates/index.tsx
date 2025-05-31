import { Suspense } from "react" 
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  collectionHandle,
}: {
  sortBy?: SortOptions
  page?: number | string
  countryCode: string
  collectionHandle?: string
}) => {
  const pageNumber = typeof page === "string" ? parseInt(page) : page ?? 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container text-[var(--color-text-primary)]"
      data-testid="category-container"
    >
      {/* Lado izquierdo: filtros */}
      <RefinementList sortBy={sort} />

      {/* Lado derecho: productos */}
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1
            data-testid="store-page-title"
            className="text-[var(--color-accent)] font-semibold uppercase"
          >
            {collectionHandle
              ? `Colección: ${collectionHandle.replace(/-/g, " ").toUpperCase()}`
              : "Todos los productos"}
          </h1>
        </div>

        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            collectionHandle={collectionHandle}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
