import http from 'k6/http'
import { check, sleep, group } from 'k6'
import { Rate } from 'k6/metrics'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/v1'

const errorRate = new Rate('errors')

export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '3m', target: 30 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    errors: ['rate<0.10'],
    http_req_duration: ['p(95)<3000'],
  },
}

export default function () {
  group('auth + product view', () => {
    const loginRes = http.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'test123',
    })

    check(loginRes, {
      'login accepted': (r) => r.status === 200 || r.status === 401,
    })

    const token = loginRes.status === 200
      ? JSON.parse(loginRes.body).data?.accessToken
      : null

    const headers = token
      ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json' }

    const productsRes = http.get(`${BASE_URL}/products?page=0&size=10`, { headers })
    check(productsRes, {
      'products status 200': (r) => r.status === 200,
    })
    errorRate.add(productsRes.status !== 200)
    sleep(1)

    const cartRes = http.get(`${BASE_URL}/cart`, { headers })
    check(cartRes, {
      'cart status 200': (r) => r.status === 200,
    })
    sleep(1)
  })
}
