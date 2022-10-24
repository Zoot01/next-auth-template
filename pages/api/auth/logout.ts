import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { sessionOptions } from '../../../lib/sessions'
import { User } from '../../../types/user'

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  req.session.destroy()
  res.status(200).json({
    isLoggedIn: false,
    email: '',
    id: '',
    first_name: '',
    last_name: '',
    admin: false,
  })
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions)
