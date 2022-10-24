import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { Post } from '@prisma/client'
import { withIronSessionSsr } from 'iron-session/next'
import type { InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import fetchJson, { FetchError } from '../lib/fetchJson'
import prisma from '../lib/prisma'
import { sessionOptions } from '../lib/sessions'
import { User } from '../types/user'
import { useRouter } from 'next/router'

const Profile: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user, posts }) => {
  const router = useRouter()
  const handleSignout = async (): Promise<void> => {
    try {
      await fetchJson('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: null,
      })
      router.reload()
    } catch (error) {
      if (error instanceof FetchError) {
        console.error('An unexpected error happened:', error.data.message)
      }
    }
  }

  return (
    <div>
      <Head>
        <title>Profile</title>
        <meta name="description" content="A profile page." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Box
          minH={'100vh'}
          bg={useColorModeValue('brand.background', 'gray.800')}
        >
          <Flex
            py={3}
            borderBottom="1px"
            borderColor={'blackAlpha.300'}
            justifyContent={'flex-end'}
            px={10}
          >
            <Button
              color={'white'}
              type="submit"
              form="signup"
              aria-label="sign up"
              fontFamily={'Plus Jakarta Sans'}
              variant="solid"
              bg={'#6B5747'}
              _hover={{
                bg: '#58483b',
              }}
              _active={{
                bg: '#776150',
              }}
              onClick={handleSignout}
            >
              Sign out
            </Button>
          </Flex>
          <Center py={6}>
            <Box
              maxW={'320px'}
              w={'full'}
              rounded={'md'}
              p={6}
              textAlign={'center'}
              borderColor={'blackAlpha.300'}
              bg={'blackAlpha.50'}
              borderWidth="1px"
            >
              <Avatar
                size={'xl'}
                mb={4}
                pos={'relative'}
                borderWidth="2px"
                _after={{
                  content: '""',
                  w: 4,
                  h: 4,
                  bg: 'green.300',
                  border: '2px solid white',
                  rounded: 'full',
                  pos: 'absolute',
                  bottom: 0,
                  right: 3,
                }}
              />
              <Heading fontSize={'2xl'} fontFamily={'body'}>
                {user?.first_name} {user?.last_name}
              </Heading>
              <Text
                textAlign={'center'}
                color={useColorModeValue('gray.700', 'gray.400')}
                px={3}
              >
                Actress, musician, songwriter and artist. PM for work inquires
                or me in your posts
              </Text>

              <Stack
                align={'center'}
                justify={'center'}
                direction={'column'}
                mt={6}
              >
                {user?.admin && (
                  <Badge
                    px={2}
                    py={1}
                    colorScheme="messenger"
                    fontWeight={'400'}
                  >
                    Admin
                  </Badge>
                )}
                {posts && (
                  <Text textAlign={'center'}>
                    Number of posts: {posts.length}
                  </Text>
                )}
              </Stack>
            </Box>
          </Center>
        </Box>
      </div>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user: User | undefined = req.session.user

  if (user === undefined) {
    res.setHeader('location', '/signin')
    res.statusCode = 302
    res.end()
    return {
      props: {
        user: {
          isLoggedIn: false,
          email: '',
          id: '',
          first_name: '',
          last_name: '',
          admin: false,
        } as User,
        posts: [],
      },
    }
  }

  const data: Post[] | null = await prisma.post.findMany({
    where: {
      authorId: user.id,
    },
  })

  return {
    props: { user: req.session.user, posts: data },
  }
},
sessionOptions)

export default Profile
