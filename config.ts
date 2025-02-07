
// config.ts
export const API_CONFIG = {
    baseUrl: import.meta.env.VITE_DIRECTUS_URL || 'https://directus.fcpro-school.com',
    apiToken: import.meta.env.VITE_DIRECTUS_TOKEN
  };