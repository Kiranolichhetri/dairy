import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Bipin Katuwal',
    location: 'Khajura',
    image: 'https://i.ibb.co/mjvkg5k/bipin-katuwal.webp',
    rating: 5,
    text: 'The best ghee I\'ve ever tasted! The aroma reminds me of my grandmother\'s kitchen. Will definitely order again.',
  },
  {
    name: 'Shudamshu Bharati',
    location: 'Tejnagar',
    image: 'https://i.ibb.co/r2Cqkdbx/shudamshu-bharati.webp',
    rating: 5,
    text: 'Finally found authentic dairy products that taste like they used to. The paneer is incredibly fresh and soft.',
  },
  {
    name: 'Anupam Shah',
    location: 'Dhambhoji',
    image: 'https://i.ibb.co/8gcZbcpr/anupam-shah.jpg',
    rating: 5,
    text: 'My kids love the fresh milk! It\'s so much better than the packaged alternatives. Thank you Khairawang!',
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our happy customers 
            have to say about their Khairawang Dairy experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-soft relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-muted-foreground mb-6 italic">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  title={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
