export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string
      HTTPS?: string
      NODE_ENV?: string
      DOMAIN?: string
      CLIENT_URLS: string
      SERVICE_URL: string
      REDIS_URL: string
      MONGO_URL: string
      JWT_ACCESS_TOKEN_SECRET: string 
      JWT_REFRESH_TOKEN_SECRET: string
      JWT_RESET_TOKEN_SECRET: string
    }
  }
}
