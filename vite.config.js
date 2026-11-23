import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Serves /api/chat in dev using the same handler as the Vercel function.
function devApi(env) {
  return {
    name: 'dev-api-chat',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
        let raw = '';
        for await (const chunk of req) raw += chunk;
        if (env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
        const { handleChat } = await server.ssrLoadModule('/server/chat.js');
        let body = {};
        try { body = JSON.parse(raw); } catch { /* bad json */ }
        const { status, json } = await handleChat(body, 'dev');
        res.statusCode = status;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify(json));
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), devApi(loadEnv(mode, process.cwd(), ''))],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
}));
