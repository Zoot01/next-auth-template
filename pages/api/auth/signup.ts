import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { sessionOptions } from '../../../lib/sessions'
import { User } from '../../../types/user'
import bcrypt from 'bcrypt'

async function signInRoute(req: NextApiRequest, res: NextApiResponse) {
  const { email, first_name, last_name, password, confirm_password } =
    await req.body

  try {
    const userExist = await prisma.user.findFirst({ where: { email: email } })

    if (userExist)
      return res.status(400).json({
        message: 'User with this email already exist, please sign in.',
      })

    if (password !== confirm_password)
      return res.status(400).json({
        message: 'Please make sure both passwords match.',
      })

    const hasedPass = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hasedPass,
      },
    })

    const user = {
      isLoggedIn: true,
      email: newUser.email,
      id: newUser.id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      admin: newUser.admin,
    } as User

    req.session.user = user
    await req.session.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export default withIronSessionApiRoute(signInRoute, sessionOptions)
