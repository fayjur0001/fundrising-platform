import { CorsOptions } from 'cors'
import { env } from './env'

const allowedOrigins = [env.CLIENT_URL, 'http://localhost:3000']

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server requests (SSLCommerz callbacks have no origin)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}