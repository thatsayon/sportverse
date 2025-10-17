import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqSection = () => {
  const faqData = [
    {
      id: "item-1",
      question: "What is Sportverse?",
      answer:
        "Sportverse is an online and in-person sports training platform where athletes can learn from expert trainers in football, basketball, and other sports. It connects trainees with trainers and also allows trainers to share and discover training methods.",
    },
    {
      id: "item-2",
      question: "What types of training does Sportverse offer?",
      answer:
        "Physical Training - fitness classes to build overall strength and stamina\n\n2. Virtual Training - These online with your coach for real-time\n\n3. Self-Guided Videos - search anything, anywhere through pre recorded videos.",
    },
    {
      id: "item-3",
      question: "Who can join Sportverse?",
      answer:
        "Anyone who loves sports can join, but we recommend age 10 or above. We strongly discourage that anyone consider whether they agree and comfort with activities.",
    },
    {
      id: "item-4",
      question: "Can I choose my trainer?",
      answer:
        "Yes, you can set the trainer through specific markers, check their profiles, and read how they worked in the past.",
    },
    {
      id: "item-5",
      question: "How does Sportverse help trainers?",
      answer:
        "Trainers can showcase their coaching, build, connect with athletes, and also share their expertise with others, helping them reach more clients.",
    },
    {
      id: "item-6",
      question: "What sports are available on Sportverse?",
      answer:
        "Currently, Sportverse offers training in football and basketball, with more sports to be added based on user feedback and demand.",
    },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Background with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.7)), url('https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760122916/faq2_kxh1av.jpg')`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-4 lg:mb-6">
            Frequently asked Question
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about Sportverse? Explore how the platform connects athletes and trainers, the different training methods offered, and the ways you can start your journey today
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-black/10 backdrop-blur-sm border border-black/20 rounded-lg px-6 py-2 hover:bg-black/15 transition-all duration-300"
              >
                <AccordionTrigger className="text-left text-lg sm:text-xl font-semibold text-black hover:text-gray-700 py-6 [&[data-state=open]>svg]:rotate-180">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-800 text-base sm:text-lg leading-relaxed pb-6 pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
