import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How is volumetric weight calculated?",
    answer: "Volumetric weight reflects the package density. We calculate it by multiplying Length x Width x Height (in cm) and dividing by 5000. You are charged based on whichever is greater: the actual weight or the volumetric weight."
  },
  {
    question: "What items are prohibited for international air freight?",
    answer: "Strictly prohibited items include explosives, flammable gases, toxic substances, lithium batteries (unless properly packed), and perishable goods without prior special arrangement. Please consult our full compliance guide before shipping."
  },
  {
    question: "Do you offer insurance for high-value shipments?",
    answer: "Yes. All standard shipments include basic liability coverage. For high-value items (over $500 USD), we recommend our 'Secure+' comprehensive insurance add-on, which covers full replacement value against loss or damage."
  },
  {
    question: "How accurate is the real-time tracking?",
    answer: "Our tracking system updates every time your package is scanned at a network node. In major hubs, this can be as frequent as every 15 minutes. For trans-oceanic freight, updates occur upon departure and arrival at port facilities."
  },
  {
    question: "Can I redirect a package while it is in transit?",
    answer: "Redirection is possible for 'Express' and 'Luxury' tier shipments, subject to a surcharge and customs regulations of the destination country. Please contact support immediately to request a route change."
  }
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-bgMain border-t border-borderColor transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-4">
            <iconify-icon icon="solar:question-circle-linear" width="16" class="text-red-600"></iconify-icon>
            <span className="metadata-label text-textMuted">Support Database</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold heading-font uppercase tracking-tighter text-textMain">
            Frequently Asked <span className="text-textMuted/60">Questions.</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border border-borderColor bg-bgSurface/20 rounded-sm overflow-hidden transition-colors hover:border-textMuted/50"
            >
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left group"
              >
                <span className={`text-xs md:text-sm font-bold uppercase tracking-widest transition-colors ${openIndex === index ? 'text-red-600' : 'text-textMain group-hover:text-red-600'}`}>
                  {faq.question}
                </span>
                <motion.div 
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  className={`transition-colors ${openIndex === index ? 'text-red-600' : 'text-textMuted group-hover:text-red-600'}`}
                >
                  <iconify-icon icon="solar:alt-arrow-down-linear" width="20"></iconify-icon>
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-6 pb-8 pt-0">
                      <p className="text-sm text-textMuted font-medium leading-relaxed border-t border-borderColor/50 pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;