interface ImportMetaEnv {
    readonly VITE_DIRECTUS_URL: string
    readonly VITE_DIRECTUS_TOKEN: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }