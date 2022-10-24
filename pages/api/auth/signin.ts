import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { sessionOptions } from '../../../lib/sessions'
import { User } from '../../../types/user'
import bcrypt from 'bcrypt'

async function signInRoute(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = await req.body

  try {
    if (!email) res.status(404).json({ message: 'User not found.' })

    const data = await prisma.user.findFirst({ where: { email: email } })

    if (!data)
      return res
        .status(404)
        .json({ message: 'User with this email does not exist.' })

    //TODO add password match

    const passwordsMatch = await bcrypt.compare(password, data?.password)

    if (!passwordsMatch)
      return res.status(404).json({ message: 'Password is not correct.' })

    const user = {
      isLoggedIn: true,
      email: data?.email,
      id: data?.id,
      first_name: data?.first_name,
      last_name: data?.last_name,
      admin: data?.admin,
    } as User

    req.session.user = user
    await req.session.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export default withIronSessionApiRoute(signInRoute, sessionOptions)
