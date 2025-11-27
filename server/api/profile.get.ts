import { getCurrentUser } from '../controllers/auth.controller'

export default defineEventHandler(async (event) => {
  return await getCurrentUser(event)
})


