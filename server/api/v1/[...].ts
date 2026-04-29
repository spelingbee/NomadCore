export default defineEventHandler(async (event) => {
  const target = 'https://unlearned-regally-shove.ngrok-free.dev'
  const url = `${target}${event.path}`

  const query = getQuery(event)
  const method = event.method
  
  // Read body if it's a mutation request
  let body = undefined
  const contentType = getRequestHeader(event, 'Content-Type')
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && contentType) {
    try {
      body = await readBody(event)
    } catch (e) {
      // In case body is empty or not JSON
    }
  }

  // Extract Authorization header
  const auth = getRequestHeader(event, 'Authorization')

  const response = await $fetch.raw(url, {
    method,
    query,
    body,
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'User-Agent': 'NomadCore/1.0',
      'Content-Type': getRequestHeader(event, 'Content-Type') || 'application/json',
      ...(auth ? { Authorization: auth } : {})
    },
    ignoreResponseError: true,
  })

  setResponseStatus(event, response.status)

  // Forward response headers
  const ct = response.headers.get('content-type')
  if (ct) setResponseHeader(event, 'content-type', ct)

  return response._data
})
