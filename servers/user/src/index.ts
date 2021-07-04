import fastify from 'fastify'
import 'reflect-metadata'
import argon2 from 'argon2'

const server = fastify()

async function hash () {
  const hash = await argon2.hash('test', {
    type: argon2.argon2id,
    timeCost: 2,
    memoryCost: 1 << 14, // 16 MiB
    hashLength: 32, // 97 chars
  })

  const result = await argon2.verify(hash, 'test')
  console.log(hash, result)
}

hash()

// $argon2id$v=19$m=16384,t=2,p=1$GlbWk5iv2uI6hzXNodFlSw$N5wSHzQcWmFbBYXAdgf78hqxkGCkat5lm/ZY7KOsQv0
// $argon2id$v=19$m=16384,t=2,p=1$f+SvG1RmKuv8u38bCI64HQ$8jO8NXfJCNnBI6XdO2WWSqFRarfAn8rs+rEzOvW2HlA
// $argon2id$v=19$m=16384,t=2,p=1$rXszTxkhjTd01Hei6jQu7A$/UF3nEQqwTlClzOjpVsKoMpFyIY2VUxqpCxwc0qPA1Q

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
