import BookingSection from '@/components/Student/BookingSection'
import { trainerAvailability } from '@/data/trainerAvailabilityData'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const trainer = trainerAvailability.find((item) => item.id === id)

  if(!trainer){
    return <div>Trainer not found</div>
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <BookingSection trainer={trainer} />
      </div>
    </div>
  )
}
