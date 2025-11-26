/// <reference types="vite/client" />

interface Window {
  gtag: (
    command: 'event',
    action: string,
    params?: Record<string, string | number>
  ) => void;
  dataLayer: unknown[];
}
