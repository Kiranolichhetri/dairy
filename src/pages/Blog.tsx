import { Layout } from "@/components/layout/Layout";
import BlogCard from "@/components/blog/BlogCard";
import { blogPosts } from "@/data/blogs";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const categories = ["All", "Health", "Recipes", "Education", "Sustainability"];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = activeCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Dairy Insights & Recipes
              </h1>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-primary mb-2">
                Latest Blog Posts & Tips
              </h2>
              <p className="text-lg text-muted-foreground">
                Explore health tips, delicious recipes, and stories from our farm. 
                Learn about the goodness of fresh dairy products.
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No posts found in this category.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Blog;
