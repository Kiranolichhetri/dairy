import { motion } from 'framer-motion';
import { Leaf, Truck, Shield, Award, Clock, Heart } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: '100% Natural',
    description: 'No preservatives or artificial additives. Just pure, natural dairy goodness.',
  },
  {
    icon: Truck,
    title: 'Same Day Delivery',
    description: 'Fresh products delivered to your doorstep within hours of production.',
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Rigorous quality checks at every stage to ensure premium products.',
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Recognized for excellence in dairy farming and product quality.',
  },
  {
    icon: Clock,
    title: 'Farm Fresh Daily',
    description: 'Products made fresh every day from milk collected in the morning.',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Traditional recipes passed down through generations of dairy farmers.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Khairawang Dairy?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            For over three decades, we've been committed to bringing you the finest 
            dairy products from the pristine Himalayan region.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-medium transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
