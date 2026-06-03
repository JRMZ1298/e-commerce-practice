import api from './client'
import type { Address, AddressRequest } from '@/types/address'

export const usersApi = {
  getAddresses: () =>
    api.get<Address[]>('/users/me/addresses').then((r) => r.data),

  createAddress: (data: AddressRequest) =>
    api.post<Address>('/users/me/addresses', data).then((r) => r.data),

  updateAddress: (id: string, data: AddressRequest) =>
    api.put<Address>(`/users/me/addresses/${id}`, data).then((r) => r.data),

  deleteAddress: (id: string) =>
    api.delete(`/users/me/addresses/${id}`).then((r) => r.data),
}
