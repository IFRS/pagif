import process from 'node:process'
import http from 'node:http'

const options = {
  host: 'localhost',
  port: process.env.NITRO_PORT || '3000',
  timeout: 5000,
}

let request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`)
  if (res.statusCode !== 200) {
    process.exitCode = 1
  }
})

request.on('error', function (err) {
  console.error(`ERROR: ${err}`)
  process.exitCode = 1
})

request.end()
