
'use client';

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'

export const NotConnected = () => {
    return (
      <Alert status='warning'>
        <AlertIcon />
        <AlertTitle>not connected</AlertTitle>
        <AlertDescription>Your  experience may be degraded.</AlertDescription>
      </Alert>
    )
  }

export default NotConnected