import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const editorDataPath = fileURLToPath(new URL('./src/editorData.json', import.meta.url))

function editorDataPlugin() {
  return {
    name: 'job-quest-project-editor-data',
    configureServer(server) {
      server.middlewares.use('/__job-quest/editor-data', async (request, response, next) => {
        if (request.method === 'GET') {
          try {
            const contents = await readFile(editorDataPath, 'utf8')
            response.statusCode = 200
            response.setHeader('Content-Type', 'application/json')
            response.end(contents)
          } catch (error) {
            server.config.logger.error(`Could not read editor data: ${error.message}`)
            response.statusCode = 500
            response.end('Could not read project editor data.')
          }
          return
        }

        if (request.method !== 'PUT') {
          next()
          return
        }

        try {
          let body = ''
          for await (const chunk of request) {
            body += chunk
            if (body.length > 1_000_000) {
              response.statusCode = 413
              response.end('Editor data is too large.')
              return
            }
          }

          const data = JSON.parse(body)
          const levels = data?.levels
          if (!levels || typeof levels !== 'object' || Array.isArray(levels)) {
            response.statusCode = 400
            response.end('Invalid editor data: expected a levels object.')
            return
          }

          for (const [levelId, level] of Object.entries(levels)) {
            if (!/^[a-z0-9_-]+$/i.test(levelId) || !Array.isArray(level.walls) || !level.content) {
              response.statusCode = 400
              response.end(`Invalid editor data for level "${levelId}".`)
              return
            }
            if (level.walls.length > 2000 || level.walls.some((wall) =>
              !['x', 'y', 'w', 'h'].every((key) => Number.isFinite(wall[key])) ||
              wall.w <= 0 || wall.h <= 0
            )) {
              response.statusCode = 400
              response.end(`Invalid wall data for level "${levelId}".`)
              return
            }
          }

          await writeFile(editorDataPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
          response.statusCode = 200
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify({ saved: true }))
        } catch (error) {
          server.config.logger.error(`Could not save editor data: ${error.message}`)
          response.statusCode = 400
          response.end('Could not save project editor data.')
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), editorDataPlugin()],
  base: '/juego_ITS_Anticonceptivos/',
  server: {
    watch: {
      usePolling: true,
    },
  },
})