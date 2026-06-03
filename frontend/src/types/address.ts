export interface Address {
  id: string
  alias: string | null
  fullName: string
  phone: string | null
  street: string
  city: string
  state: string | null
  postalCode: string
  country: string
  isDefault: boolean
}

export interface AddressRequest {
  alias?: string
  fullName: string
  phone?: string
  street: string
  city: string
  state?: string
  postalCode: string
  country: string
  isDefault: boolean
}
