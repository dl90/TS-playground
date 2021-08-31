import { emailRgx, passwordRgx } from '../../util/regex'

export interface IEmail {
  email: string
}

export interface IPassword {
  password: string
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

export const emailSchema = {
  type: 'object',
  required: ['email'],
  properties: {
    email: {
      type: 'string',
      nullable: false,
      minLength: 3,
      maxLength: 254,
      pattern: emailRgx
    }
  }
}

export const passwordSchema = {
  type: 'object',
  required: ['password'],
  properties: {
    password: {
      type: 'string',
      nullable: false,
      minLength: 8,
      maxLength: 100,
      pattern: passwordRgx
    }
  }
}
