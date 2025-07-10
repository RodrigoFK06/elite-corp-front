"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: string // <--- lo tratamos primero como string crudo
  search?: boolean
  "data-testid"?: string
}

// Declaramos todos los valores válidos de SortOptions
const validSortOptions: SortOptions[] = [
  "created_at",
  "price_asc",
  "price_desc",
  "collection_hombre",
  "collection_mujer",
]

const RefinementList = ({ sortBy, "data-testid": dataTestId }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const decodedSortBy = decodeURIComponent(sortBy)

  // Validamos que sea uno de los permitidos
  const safeSortBy: SortOptions = validSortOptions.includes(decodedSortBy as SortOptions)
    ? (decodedSortBy as SortOptions)
    : "created_at"

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      <SortProducts sortBy={safeSortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
    </div>
  )
}

export default RefinementList
