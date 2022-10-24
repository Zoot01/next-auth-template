import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  useColorModeValue,
  Text,
  Alert,
  AlertIcon,
  useDisclosure,
  CloseButton,
  Divider,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useState } from 'react'
import fetchJson, { FetchError } from '../lib/fetchJson'
import { FcGoogle, FcAndroidOs } from 'react-icons/fc'
import { useForm, SubmitHandler } from 'react-hook-form'
import useUser from '../lib/useUser'

type Inputs = {
  email: string
  password: string
}

export default function SignIn() {
  const { onClose, isOpen, onOpen } = useDisclosure({ defaultIsOpen: false })
  const [message, setMessage] = useState<null | string>(null)
  const { mutateUser } = useUser({
    redirectTo: '/profile',
    redirectIfFound: true,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data): Promise<void> => {
    try {
      mutateUser(
        await fetchJson('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      )
    } catch (error) {
      if (error instanceof FetchError) {
        console.error('An unexpected error happened:', error.data.message)
        setMessage(error.data.message)
        onOpen()
      }
    }
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('brand.background', 'gray.800')}
    >
      <Head>
        <title>Sign In</title>
        <meta name="description" content="Sign in to the application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack spacing={4} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} color="black">
            Sign in
          </Heading>
          <Text>Welcome back, please enter your details.</Text>
        </Stack>
        {isOpen && message && (
          <Alert status="error" borderRadius={'md'} maxW={'330px'}>
            <AlertIcon />
            <Text maxW={'80%'}>{message}</Text>
            <CloseButton
              position={'absolute'}
              top={2}
              right={2}
              onClick={onClose}
            />
          </Alert>
        )}
        boxShadow={'sm'}
        <Flex
          justifyContent={'center'}
          alignItems="center"
          borderRadius="md"
          border={'1px'}
          borderColor={'blackAlpha.400'}
          p={1}
        >
          <Button leftIcon={<FcGoogle />} variant="ghost" disabled>
            Google
          </Button>
          <Button leftIcon={<FcAndroidOs />} variant="ghost" disabled>
            Android
          </Button>
        </Flex>
        <Flex
          justifyContent={'center'}
          alignItems="center"
          gap={5}
          p={1}
          px={3}
        >
          <Divider borderColor={'blackAlpha.600'} />
          <Text color={'blackAlpha.600'}>OR</Text>
          <Divider borderColor={'blackAlpha.600'} />
        </Flex>
        <Box rounded={'md'}>
          <Stack spacing={4}>
            <form id="signin" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <FormControl id="email" isInvalid={errors.email && true}>
                  <FormLabel color={'blackAlpha.600'}>Email address</FormLabel>
                  <Input
                    type="email"
                    borderColor={'blackAlpha.500'}
                    {...register('email', {
                      required: { value: true, message: 'Field is required.' },
                    })}
                  />
                  {errors.email && (
                    <Text fontSize={'xs'} color="red" mt={1}>
                      {errors.email.message}
                    </Text>
                  )}
                </FormControl>
                <FormControl id="password" isInvalid={errors.password && true}>
                  <FormLabel color={'blackAlpha.600'}>Password</FormLabel>
                  <Input
                    type="password"
                    borderColor={'blackAlpha.500'}
                    {...register('password', {
                      required: { value: true, message: 'Field is required.' },
                    })}
                  />
                  {errors.password && (
                    <Text fontSize={'xs'} color="red" mt={1}>
                      {errors.password.message}
                    </Text>
                  )}
                </FormControl>
              </Stack>
            </form>
            <Stack spacing={5}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}
              >
                <Checkbox borderColor={'blackAlpha.500'}>Remember me</Checkbox>
                <Link color={'blue.400'} href="/forgot">
                  Forgot password?
                </Link>
              </Stack>
              <Button
                color={'white'}
                type="submit"
                form="signin"
                aria-label="sign in"
                fontFamily={'Plus Jakarta Sans'}
                variant="solid"
                bg={'#6B5747'}
                _hover={{
                  bg: '#58483b',
                }}
                _active={{
                  bg: '#776150',
                }}
              >
                Sign in
              </Button>
            </Stack>
            <Stack pt={1}>
              <Text align={'center'}>
                Don&apos;t have an account?{' '}
                <Link href="/signup" color={'blue.400'}>
                  Sign Up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}
