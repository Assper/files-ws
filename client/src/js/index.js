import io from 'socket.io-client'
import { chunksAmount, sliceFile } from './file-slicer'

localStorage.debug = '*'
console.log('INIT')

const URL = 'http://localhost:3000'
const socket = io(URL, { transports: ['websocket'] })

console.log(socket.connected)

socket.on('connect_error', (err) => {
  console.log(JSON.stringify(err, null, '\t'))
  console.error(err)
})

socket.on('connect_failed', (err) => {
  console.error(err)
})

socket.on('file-transfer', (data) => {
  console.log('EMITED')
  console.log(data)
})

const form = document.getElementById('file-form')
const input = document.getElementById('file')

const sendFile = (blobChunksArray, file) => {
  return new Promise((resolve) => {
    if (!blobChunksArray.length) return resolve({ status: 'done' })
    socket.emit(
      'file-transfer',
      { chunk: blobChunksArray[0], filePath: file.name, total: file.size },
      ({ status }) => {
        if (status !== 'failed') {
          sendFile(blobChunksArray.slice(1), file).then(resolve)
        } else {
          resolve({ status })
        }
      }
    )
    // blobChunksArray[0].arrayBuffer().then((buffer) => {
    //   console.log('BUFFER', buffer)
    //   socket.emit('file-transfer', { chunk: buffer }, ({ isSuccess }) => {
    //     console.log('STATUS', isSuccess)
    //     if (isSuccess) {
    //       sendFile(blobChunksArray.slice(1)).then(resolve)
    //     } else {
    //       resolve({ status: 'failed' })
    //     }
    //   })
    // })
  })
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const file = input.files[0]
  const chunks = chunksAmount(file.size)
  const blobChunksArray = sliceFile(file, chunks, file.type)
  // socket.emit('file-transfer', { chunk: 'Hello' }, console.log)
  console.log('START', new Date())
  sendFile(blobChunksArray, file).then((result) => {
    console.log('SUBMIT', result)
    console.log('END', new Date())
  })
})
