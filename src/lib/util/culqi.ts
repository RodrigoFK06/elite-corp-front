import Culqi from "culqi-node"

const culqi = new Culqi({ privateKey: process.env.CULQI_PRIVATE_KEY })

export async function createCulqiCharge({
  amount,
  currency_code,
  email,
  source_id,
}: {
  amount: string // debe estar en string, en céntimos
  currency_code: "PEN" | "USD"
  email: string
  source_id: string
}) {
  return await culqi.charges.createCharge({
    amount,
    currency_code,
    email,
    source_id,
  })
}
