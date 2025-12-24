import { motion } from 'framer-motion';
import { Leaf, Award, Users, Heart } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1920&h=800&fit=crop"
            alt="Farm landscape"
            title="Khairawang Dairy farm landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-primary-foreground"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our Story
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90">
              From the pristine hills of Uttarakhand to your table, 
              we bring you the purest dairy products with love and tradition.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Legacy of Purity Since 1985
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Nestled in the serene village of Khairawang in Banke district, 
                  our dairy farm began as a small family venture with just five cows 
                  and a dream to provide pure, unadulterated dairy products.
                </p>
                <p>
                  Today, after three decades of dedication, we've grown into one of 
                  the most trusted dairy brands in the region, serving over 10,000 
                  happy customers while maintaining the same commitment to quality 
                  that our founders instilled.
                </p>
                <p>
                  Our cows graze freely on the lush, chemical-free pastures of the 
                  Himalayan foothills, producing milk that's rich in nutrients and 
                  bursting with natural goodness.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-large">
                <img
                  src="https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=800&h=600&fit=crop"
                  alt="Our farm"
                  title="Traditional dairy process"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-accent/20 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Leaf,
                title: 'Sustainability',
                description: 'Eco-friendly practices that protect our environment for future generations.',
              },
              {
                icon: Award,
                title: 'Quality',
                description: 'Uncompromising standards in every product we create and deliver.',
              },
              {
                icon: Users,
                title: 'Community',
                description: 'Supporting local farmers and creating opportunities in rural areas.',
              },
              {
                icon: Heart,
                title: 'Care',
                description: 'Treating our animals with love and respect, ensuring their wellbeing.',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '38+', label: 'Years of Excellence' },
              { value: '10K+', label: 'Happy Customers' },
              { value: '50+', label: 'Dairy Products' },
              { value: '100%', label: 'Natural & Pure' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="font-display text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </p>
                <p className="text-primary-foreground/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
