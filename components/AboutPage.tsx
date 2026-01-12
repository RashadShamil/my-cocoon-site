'use client'
import { motion } from "motion/react";
import { Heart, Sparkles, Award, Users } from "lucide-react";


const features = [
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Every stitch is crafted with care and attention to detail, ensuring comfort and beauty for your little one.",
  },
  {
    icon: Sparkles,
    title: "Unique Designs",
    description:
      "Our exclusive designs are created to make every girl feel special and stand out on any occasion.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "We use only the finest fabrics and materials that are gentle on delicate skin and built to last.",
  },
  {
    icon: Users,
    title: "Happy Families",
    description:
      "Join hundreds of satisfied families who trust Cocoon for their children's special moments.",
  },
];

const values = [
  {
    title: "Quality First",
    description: "Premium fabrics and meticulous craftsmanship in every piece",
  },
  {
    title: "Comfort Matters",
    description: "Designed for active little girls who love to move and play",
  },
  {
    title: "Sustainable Choice",
    description: "Eco-friendly materials and ethical production practices",
  },
];

export function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6"
            >
              <img src="/logo.png" alt="Cocoon Logo" className="w-24 h-24" />
            </motion.div>

            <h1 className="text-5xl font-bold mb-6">
              About <span className="text-primary">Cocoon</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              At Cocoon, we believe every little girl deserves to feel like a
              princess. Our journey began with a simple dream: to create beautiful,
              comfortable frocks that make childhood moments truly magical.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Just like a butterfly emerges from its cocoon, we help your little
              ones blossom with confidence and grace through our carefully designed
              collections.
            </p>
            <p className="text-lg text-muted-foreground">
              Each dress tells a story of love, craftsmanship, and the joy of
              childhood. We're not just selling clothes; we're creating memories
              that last a lifetime.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"
            />

            <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto">
              <img
                src="/8.jpeg"
                alt="Cocoon Story"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-card py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Why Choose <span className="text-primary">Cocoon</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover what makes us special and loved by families everywhere
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="text-center p-6 rounded-2xl bg-background hover:shadow-xl transition-all"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
                >
                  <feature.icon className="w-8 h-8 text-primary" />
                </motion.div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border hover:border-primary transition-all"
              >
                <motion.div
                  className="absolute top-4 right-4"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                >
                  <Sparkles className="w-6 h-6 text-primary/30" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-primary">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "2020", label: "Established" },
              { number: "500+", label: "Happy Customers" },
              { number: "50+", label: "Unique Designs" },
              { number: "100%", label: "Satisfaction" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.p
                  className="text-5xl font-bold text-primary mb-2"
                  whileInView={{
                    scale: [0.8, 1.1, 1],
                  }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {stat.number}
                </motion.p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
