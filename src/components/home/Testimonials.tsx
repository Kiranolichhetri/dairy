import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Bipin Katuwal',
    location: 'Khajura',
    image: 'https://scontent.fbwa1-1.fna.fbcdn.net/v/t39.30808-6/476834468_1292736975273963_1819288474068643988_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=7WbH1XUol24Q7kNvwGvNDgA&_nc_oc=AdkAI4LtBV5YvUBciclUEM7fctdK7Wl7_fI17aosm2LkdoLE_jS4vAhRWS_BXifpEEELcrFhytiiFL2F9drSa40I&_nc_zt=23&_nc_ht=scontent.fbwa1-1.fna&_nc_gid=0zQ3-otRjfOXn73JhgViDQ&oh=00_AfnRSD_pXQ8rrUYS2Sqr44nB-TwKaM9RvIwAMGaSS9Ocow&oe=69501B32',
    rating: 5,
    text: 'The best ghee I\'ve ever tasted! The aroma reminds me of my grandmother\'s kitchen. Will definitely order again.',
  },
  {
    name: 'Shudamshu Bharati',
    location: 'Tejnagar',
    image: 'https://scontent.fbwa1-1.fna.fbcdn.net/v/t39.30808-6/475389580_1286865249194469_398965881967206022_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_ohc=p139kW6oUyYQ7kNvwG3xxV4&_nc_oc=Adk6epu7L-Ek79SCxXchIHXn5TaQHekA7B9R5rzgMP_nqjC7MwlyfUQHvSCesC_Rx0rvFaQ4nQrW36LttNeiJk58&_nc_zt=23&_nc_ht=scontent.fbwa1-1.fna&_nc_gid=JdwdilZKjmZXKjCfnW1ymw&oh=00_AfmUjXUPwvdfx4k6ciPfznrTeXDqzHXFaXoQDruKha46-g&oe=695007CC',
    rating: 5,
    text: 'Finally found authentic dairy products that taste like they used to. The paneer is incredibly fresh and soft.',
  },
  {
    name: 'Anupam Shah',
    location: 'Dhambhoji',
    image: 'https://scontent.fbwa1-1.fna.fbcdn.net/v/t39.30808-6/523196801_1960044661410552_5426446953825993013_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_ohc=XVVURAcw72kQ7kNvwHGpA4e&_nc_oc=AdnMR6OCtSwKO0WFTB4f2QLrHZT9waHrn4jURXwwfNrUPnhBl7gKFp6AiB-i9WXC5rDafcLc1IZ9sB-UrXwvMGGE&_nc_zt=23&_nc_ht=scontent.fbwa1-1.fna&_nc_gid=t9GBrATjhFtI_-37q-36Uw&oh=00_AfmR8txS4_xwpjfKmu_UifOiuv8C76l28gNlLDRGbjYtaQ&oe=69500781',
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
