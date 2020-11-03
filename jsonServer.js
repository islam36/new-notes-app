const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router(__dirname + '/db.json')
const middlewares = jsonServer.defaults()
 
server.use(middlewares)
server.use(router)
server.listen(8001, () => {
  console.log('JSON Server is running')
})