function slice(file, start, end) {
  const slice = file.mozSlice
    ? file.mozSlice
    : file.webkitSlice
    ? file.webkitSlice
    : file.slice

  return slice.bind(file)(start, end)
}

export function sliceFile(file, chunksAmount, mimetype) {
  let byteIndex = 0
  const chunks = []

  for (let i = 0; i < chunksAmount; i += 1) {
    const byteEnd = Math.ceil((file.size / chunksAmount) * (i + 1))
    chunks.push(
      new Blob([slice(file, byteIndex, byteEnd)], {
        type: mimetype
      })
    )

    byteIndex += byteEnd - byteIndex
  }

  return chunks
}

export function chunksAmount(size) {
  const BYTES_PER_CHUNK = 1024 * 1024 * 5 //5MB chunk sizes.
  return Math.ceil(size / BYTES_PER_CHUNK)
}
