import VideoUploadForm from '@/components/Admin/visitors/VideoUploadForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div>
      <div className='flex items-center gap-3'>
        <Link href={"/dashboard/media"}>
      <Button size={"icon"} className='rounded-full'>
        <ArrowLeft stroke='white'/>
      </Button>
      </Link>
        <p className='font-semibold'>Back to Video Library</p>
      </div>
      <VideoUploadForm/>
    </div>
  )
}

export default page
