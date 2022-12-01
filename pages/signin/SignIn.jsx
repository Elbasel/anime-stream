import React from 'react'
import {signInWithPopup} from 'firebase/auth'
import {auth, googleProvider} from '@firebaseUtil/auth'
import { useRouter } from 'next/router'

export default function SignIn() {
const router = useRouter()

const signInUsingGoogle = async () => {
try {
    const result = await signInWithPopup(auth, googleProvider)
    router.push('profile')
} catch (error) {
    console.log(error)
}
}

  return (
    <div>
        <button onClick={() => signInUsingGoogle()}>Sign In With Google</button>
    </div>
  )
}
