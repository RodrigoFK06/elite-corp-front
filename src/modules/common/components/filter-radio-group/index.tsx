import { EllipseMiniSolid } from "@medusajs/icons"
import { Label, RadioGroup, Text, clx } from "@medusajs/ui"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex gap-x-3 flex-col gap-y-3">
      <Text className="txt-compact-small-plus text-white">{title}</Text>
      <RadioGroup data-testid={dataTestId} onValueChange={handleChange}>
        {items?.map((i) => {
          const isSelected =
            decodeURIComponent(i.value) === decodeURIComponent(value)

          return (
            <div key={i.value} className="flex gap-x-2 items-center">
              {isSelected && <EllipseMiniSolid />}
              <RadioGroup.Item
                checked={isSelected}
                className="hidden peer"
                id={i.value}
                value={i.value}
              />
              <Label
                htmlFor={i.value}
                className={clx(
                  "!txt-compact-small !transform-none text-white hover:text-[#FFD700] hover:cursor-pointer transition-colors",
                  {
                    "text-[#FFD700]": isSelected,
                  }
                )}
                data-testid="radio-label"
                data-active={isSelected}
              >
                {i.label}
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
