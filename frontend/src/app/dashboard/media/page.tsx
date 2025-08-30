import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div>
      <Link href={"/dashboard/media/video-upload"}>
      <Button>
        <Plus /> Add Video
      </Button>
      </Link>
    </div>
  )
}

export default page
