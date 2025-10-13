import GoogleSignUp from '@/components/auth/Social/GoogleSignUp'
import Loading from '@/components/Element/Loading'
import { Suspense } from 'react'

function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loading/></div>}>
      <GoogleSignUp/>
    </Suspense>
  )
}

export default Page