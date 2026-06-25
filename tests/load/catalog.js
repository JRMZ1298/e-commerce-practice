import http from 'k6/http'
import { check, sleep, group } from 'k6'
import { Rate, Trend } from 'k6/metrics'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/v1'

const errorRate = new Rate('errors')
const productLoad = new Trend('product_detail_load')

export const options = {
  stages: [
    { duration: '1m', target: 20 },
    { duration: '2m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '2m', target: 100 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    errors: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
    product_detail_load: ['p(95)<1000'],
  },
}

export default function () {
  group('catalog browsing', () => {
    const productsRes = http.get(`${BASE_URL}/products?page=0&size=20`)
    check(productsRes, {
      'products status 200': (r) => r.status === 200,
      'products response time < 500ms': (r) => r.timings.duration < 500,
    })
    errorRate.add(productsRes.status !== 200)
    sleep(1)

    const searchRes = http.get(`${BASE_URL}/search?q=ropa&page=0&size=20`)
    check(searchRes, {
      'search status 200': (r) => r.status === 200,
    })
    errorRate.add(searchRes.status !== 200)
    sleep(1)

    const categoriesRes = http.get(`${BASE_URL}/categories`)
    check(categoriesRes, {
      'categories status 200': (r) => r.status === 200,
    })
    sleep(1)
  })
}
