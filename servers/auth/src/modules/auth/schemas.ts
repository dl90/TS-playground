
export const credSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      nullable: false,
      minLength: 3,
      maxLength: 254,
      format: "email"
    },
    password: {
      type: 'string',
      nullable: false,
      minLength: 6,
      maxLength: 80,
      pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
    }
  }
}

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

export interface ILoginBody {
  email: string
  password: string
}
