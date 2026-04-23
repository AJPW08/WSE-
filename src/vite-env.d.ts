/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUITE_ORIGIN?: string;
  readonly VITE_SUITE_EMBED_PARAMS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
