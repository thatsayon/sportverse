import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Iva Ryan",
      role: "Athlete",
      image: "/api/placeholder/150/150",
      rating: 5,
      testimonial: "This website provides structured basketball and football training that really helps athletes develop their skills efficiently"
    },
    {
      id: 2,
      name: "James Hall",
      role: "Athlete", 
      image: "/api/placeholder/150/150",
      rating: 5,
      testimonial: "Every session feels purposeful, motivating, and designed to push players to improve their game consistently"
    },
    {
      id: 3,
      name: "Judith Rodriguez",
      role: "Athlete",
      image: "/api/placeholder/150/150", 
      rating: 5,
      testimonial: "I've noticed significant progress in my and football abilities since following the training programs here"
    }
  ]

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex justify-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="bg-gray-50 py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black">
            What our students say
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-black">
                    {testimonial.name}
                  </h3>
                  <p className="text-[#808080] text-sm">
                    {testimonial.role}
                  </p>
                </div>

                <StarRating rating={testimonial.rating} />
                
                <p className="text-[#808080] text-sm leading-relaxed">
                  {testimonial.testimonial}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional testimonials indicator for mobile */}
        <div className="text-center mt-12">
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#F15A24]" />
            <div className="w-2 h-2 rounded-full bg-[#808080]" />
            <div className="w-2 h-2 rounded-full bg-[#808080]" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection