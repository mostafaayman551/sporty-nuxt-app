import { logoutUser } from '../../controllers/auth.controller'

export default defineEventHandler(async (event) => {
  return await logoutUser(event)
})
