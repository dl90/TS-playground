import { FastifyError, FastifyRequest, FastifyReply } from "fastify"

export default (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  if (error.validation) {
    const { keyword, params, dataPath } = error.validation[0]
    let message

    switch (keyword) {
      case 'format':
        message = `Invalid ${params.format}`
        break
      case 'required':
        message = `Missing ${params.missingProperty}`
        break
      case 'pattern':
      case 'minLength':
      case 'maxLength':
        message = `Invalid ${dataPath.slice(1)}`
        break
      default:
        message = 'Invalid body'
        break
    }

    return reply
      .status(422)
      .send({ time: reply.getResponseTime(), message })
  }
}