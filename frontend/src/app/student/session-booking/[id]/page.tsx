import BookingSection from '@/components/Student/BookingSection'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <BookingSection id={id} />
      </div>
    </div>
  )
}
