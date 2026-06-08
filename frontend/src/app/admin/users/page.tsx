'use client'

import { useState } from 'react'
import { Users, Loader2, Search, Shield, Ban, CheckCircle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api/admin'
import { cn } from '@/lib/utils/cn'
import type { AdminUser } from '@/types/admin'

const roleLabels: Record<string, string> = {
  CUSTOMER: 'Cliente',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
}

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'Activo', color: 'bg-green-50 text-green-600' },
  SUSPENDED: { label: 'Suspendido', color: 'bg-red-50 text-red-600' },
  DELETED: { label: 'Eliminado', color: 'bg-gray-100 text-gray-500' },
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminApi.getUsers,
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })

  const filtered = search
    ? (users ?? []).filter(
        (u) =>
          u.firstName.toLowerCase().includes(search.toLowerCase()) ||
          u.lastName.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      )
    : (users ?? [])

  const toggleStatus = (user: AdminUser) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    statusMutation.mutate({ id: user.id, status: newStatus })
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-serif text-[2.4rem] font-bold text-foreground">Usuarios</h1>
        <p className="text-[1.3rem] text-muted-foreground">Gestiona los usuarios registrados</p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field w-full pl-10 pr-4 py-2.5 text-[1.4rem]"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-[1.4rem] text-muted-foreground">No hay usuarios</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white boty-shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-[1.2rem] text-muted-foreground">
                <th className="px-5 py-3 font-medium">Usuario</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Rol</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium">Registro</th>
                <th className="px-5 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const statusCfg = statusConfig[user.status] ?? statusConfig.ACTIVE
                return (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-accent/10 text-[1.3rem] font-bold text-brand-accent">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.firstName} {user.lastName}
                          </p>
                          {user.phone && (
                            <p className="text-[1.2rem] text-muted-foreground">{user.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[1.3rem] text-foreground">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-accent/5 px-3 py-0.5 text-[1.1rem] font-medium text-brand-accent">
                        <Shield className="h-3 w-3" />
                        {roleLabels[user.role] ?? user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('inline-flex rounded-full px-3 py-0.5 text-[1.1rem] font-medium', statusCfg.color)}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[1.3rem] text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-5 py-4">
                      {user.role !== 'SUPER_ADMIN' && (
                        <button
                          type="button"
                          onClick={() => toggleStatus(user)}
                          disabled={statusMutation.isPending}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[1.1rem] font-medium transition-colors disabled:opacity-50',
                            user.status === 'ACTIVE'
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100',
                          )}
                        >
                          {user.status === 'ACTIVE' ? (
                            <><Ban className="h-3 w-3" /> Suspender</>
                          ) : (
                            <><CheckCircle className="h-3 w-3" /> Activar</>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
