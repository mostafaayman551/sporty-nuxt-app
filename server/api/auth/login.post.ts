import { loginUser } from '../../controllers/auth.controller'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await loginUser(event, body)
})
