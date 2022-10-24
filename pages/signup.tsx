import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
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
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useState, useRef } from 'react'
import fetchJson, { FetchError } from '../lib/fetchJson'
import { FcGoogle, FcAndroidOs } from 'react-icons/fc'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useForm, SubmitHandler } from 'react-hook-form'
import useUser from '../lib/useUser'

type Inputs = {
  first_name: string
  last_name: string
  email: string
  password: string
  confirm_password: string
}

export default function SignUp() {
  const { onClose, isOpen, onOpen } = useDisclosure({ defaultIsOpen: false })
  const [message, setMessage] = useState<null | string>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const password = useRef({})
  const { mutateUser } = useUser({
    redirectTo: '/profile',
    redirectIfFound: true,
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  password.current = watch('password', '')

  const onSubmit: SubmitHandler<Inputs> = async (data): Promise<void> => {
    try {
      mutateUser(
        await fetchJson('/api/auth/signup', {
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
        <title>Sign Up</title>
        <meta
          name="description"
          content="Sign up for use of the application."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack spacing={4} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} color="black">
            Sign up
          </Heading>
          <Text>Sign up now to get started with an account.</Text>
        </Stack>
        {isOpen && message && (
          <Alert status="error" borderRadius={'md'} maxW={'330px'}>
            <AlertIcon />
            <Text w={'80%'} maxW={'80%'}>
              {message}
            </Text>
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
          <Button
            leftIcon={<FcGoogle />}
            variant="ghost"
            disabled
            aria-label="google sign in"
          >
            Google
          </Button>
          <Button
            leftIcon={<FcAndroidOs />}
            variant="ghost"
            disabled
            aria-label="android sign in"
          >
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
            <form id="signup" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <FormControl isInvalid={errors.first_name && true}>
                  <FormLabel color={'blackAlpha.600'}>First name</FormLabel>
                  <Input
                    type="text"
                    borderColor={'blackAlpha.500'}
                    {...register('first_name', {
                      required: { value: true, message: 'Field is required.' },
                    })}
                  />
                  {errors.first_name && (
                    <Text fontSize={'xs'} color="red" mt={1}>
                      {errors.first_name.message}
                    </Text>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.last_name && true}>
                  <FormLabel color={'blackAlpha.600'}>Last name</FormLabel>
                  <Input
                    type="text"
                    borderColor={'blackAlpha.500'}
                    {...register('last_name', {
                      required: { value: true, message: 'Field is required.' },
                    })}
                  />
                  {errors.last_name && (
                    <Text fontSize={'xs'} color="red" mt={1}>
                      {errors.last_name.message}
                    </Text>
                  )}
                </FormControl>
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
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      borderColor={'blackAlpha.500'}
                      {...register('password', {
                        required: 'You must specify a password',
                        minLength: {
                          value: 8,
                          message: 'Password must have at least 8 characters',
                        },
                      })}
                    />
                    <InputRightElement h={'full'}>
                      <Button
                        aria-label="toggle password visable"
                        variant={'unstyled'}
                        justifyContent="center"
                        display={'flex'}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }
                      >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {errors.password && (
                    <Text fontSize={'xs'} color="red" mt={1}>
                      {errors.password.message}
                    </Text>
                  )}
                </FormControl>
                <FormControl
                  id="confirm_password"
                  isInvalid={errors.confirm_password && true}
                >
                  <FormLabel color={'blackAlpha.600'}>
                    Confirm password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      borderColor={'blackAlpha.500'}
                      {...register('confirm_password', {
                        required: {
                          value: true,
                          message: 'Feild is required.',
                        },
                        validate: (value) =>
                          value === password.current ||
                          'The passwords do not match',
                      })}
                    />
                    <InputRightElement h={'full'}>
                      <Button
                        aria-label="toggle password visable"
                        variant={'unstyled'}
                        justifyContent="center"
                        display={'flex'}
                        onClick={() =>
                          setShowConfirmPassword(
                            (showConfirmPassword) => !showConfirmPassword
                          )
                        }
                      >
                        {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {errors.confirm_password && (
                    <Text fontSize={'xs'} color="red" mt={1}>
                      {errors.confirm_password.message}
                    </Text>
                  )}
                </FormControl>
              </Stack>
            </form>
            <Stack spacing={5}>
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
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={1}>
              <Text align={'center'}>
                Already have an account?{' '}
                <Link href="/signin" color={'blue.400'}>
                  Sign In
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}
