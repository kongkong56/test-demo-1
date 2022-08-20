import app from './app'
import http from 'http'

const port = Number(process.env.PORT || 8080)

app.listen(port, () => {
  console.info('Server is running on port 8080 ...')
})
