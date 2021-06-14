import fs from 'fs'
import { saferesolve } from './lib/fs.js'
import dotenv from 'dotenv'

import { createServer } from 'http'
import { Server } from 'socket.io'

// Ugh...
dotenv.config({ path: '../.env' })
dotenv.config({ path: './.env' })

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: `http://${process.env['WEB_HOST']}`,
    methods: ['GET', 'POST'],
  },
})

let socketStore = {}

io.on('connection', (socket) => {
  const username = socket.handshake.query.username

  socketStore[username] = socketStore[username] || []

  // TODO: replace index to session ID
  const index = socketStore[username].push(socket)

  console.log(`user connected to ${username} channel`)

  socket.on('save', (msg) => {
    if (msg.filename !== '') {
      fs.writeFileSync(saferesolve(vmPath, msg.filename), msg.body)
    }
  })

  socket.on('disconnect', () => {
    socketStore[username][index] = null

    console.log(`user disconnected from ${username} channel`)
  })
})

const port = 5000
const host = process.env['HOST'] || '127.0.0.1'

httpServer.listen(port, host, () => {
  console.log(`listening on ${host}:${port}`)
})

// file system monitor

import chokidar from 'chokidar'

const vmPath = saferesolve(process.env['VM_PATH'], '.')

const watcher = chokidar.watch(vmPath, {
  persistent: true,
})

const log = console.log.bind(console)

function pathToUsername(fullpath) {
  return fullpath.split(vmPath)[1].split('/')[1]
}

function broadcast(username, message) {
  if (socketStore[username]) {
    for (let i = 0; i < socketStore[username].length; i++) {
      const channel = socketStore[username][i]
      channel && channel.emit('message', message)
    }
  }
}

// Add event listeners
watcher
  .on('add', (path) => {
    const username = pathToUsername(path)
    broadcast(username, path)
    log(`File ${path} has been added`)
  })
  .on('change', (path) => {
    const username = pathToUsername(path)
    broadcast(username, path)
    log(`File ${path} has been changed`)
  })
  .on('unlink', (path) => {
    const username = pathToUsername(path)
    broadcast(username, path)
    log(`File ${path} has been removed`)
  })

// More possible events
watcher
  .on('addDir', (path) => {
    const username = pathToUsername(path)
    broadcast(username, path)
    log(`Directory ${path} has been added`)
  })
  .on('unlinkDir', (path) => {
    const username = pathToUsername(path)
    broadcast(username, path)
    log(`Directory ${path} has been removed`)
  })
  .on('error', (error) => log(`Watcher error: ${error}`))
  .on('ready', () => log('Initial scan complete. Ready for changes'))
