export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string
      HTTPS?: string
      NODE_ENV?: string
      DOMAIN?: string
      CLIENT_URLS: string
    }
  }
}
