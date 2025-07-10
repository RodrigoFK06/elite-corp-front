"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type SortOptions =
  | "price_asc"
  | "price_desc"
  | "created_at"
  | "collection_hombre"
  | "collection_mujer" // ¡Importante! Usamos el `handle` sin slash

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Últimos agregados",
  },
  {
    value: "price_asc",
    label: "Precio de menor a mayor",
  },
  {
    value: "price_desc",
    label: "Precio de mayor a menor",
  },
  {
    value: "collection_hombre",
    label: "Productos Hombres",
  },
  {
    value: "collection_mujer",
    label: "Productos Mujer",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
  <div className="bg-transparent p-0 text-white">
      <FilterRadioGroup
        title="Ordenar por"
        items={sortOptions}
        value={sortBy}
        handleChange={handleChange}
        data-testid={dataTestId}
      />
    </div>
  )
}

export default SortProducts
