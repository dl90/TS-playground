import fastJson from 'fast-json-stringify'


const parse = fastJson({
  type: 'object',
  properties: {
    email: { type: 'string' },
    iat: { type: 'number' },
    exp: { type: 'number' },
    iss: { type: 'string' }
  }
})

console.log(parse({
  email: 'test@test.com',
  iat: 1435682800,
  exp: 1435682800,
  iss: 'test'
}))
