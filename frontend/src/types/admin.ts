export interface DashboardStats {
  totalOrders: number
  totalProducts: number
  totalUsers: number
  totalRevenue: number
  pendingOrders: number
  lowStockProducts: number
}

export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN'
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED'
  emailVerified: boolean
  provider: 'LOCAL' | 'GOOGLE' | 'FACEBOOK'
  createdAt: string
  lastLoginAt: string | null
}
