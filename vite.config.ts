/* Configuração do Vite — sem imports para funcionar em qualquer instalação. */
export default {
  server: { port: 5173, strictPort: true, watch: { ignored: ['**/*.rar'] } },
  build: { target: 'es2022', outDir: 'dist' },
};
