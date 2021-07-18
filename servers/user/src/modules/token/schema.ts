
export const messageSchema = {
  type: 'object',
  properties: {
    time: { type: 'number' },
    message: { type: 'string' }
  }
}

export const tokenSchema = {
  type: 'object',
  properties: {
    time: { type: 'number' },
    accessToken: { type: 'string' },
    expires: { type: 'number' },
    tokenType: { type: 'string' }
  }
}
