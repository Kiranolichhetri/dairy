export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "health-benefits-farm-fresh-milk",
    title: "Unlock the Health Benefits of Farm-Fresh Milk: Nutrition, Digestion & Immunity Boost",
    excerpt: "Farm-fresh milk stands out for its rich nutrient profile, digestibility, and natural benefits. Discover why it outshines pasteurized milk and how to source it safely.",
    content: `
      <h1>Unlock the Health Benefits of Farm-Fresh Milk: Nutrition, Digestion & Immunity Boost</h1>
      <p>Farm-fresh milk stands out for its rich nutrient profile and natural benefits, preserved through minimal processing. It surpasses pasteurized alternatives in digestibility, enzyme content, and probiotic support, appealing to those seeking optimal health.</p>

      <h2>Why Farm-Fresh Milk Outshines Pasteurized Nutrition</h2>
      <p>Farm-fresh milk retains vital enzymes, probiotics, and bioavailable vitamins like B12, D, and calcium that high-heat pasteurization often diminishes. These elements enhance absorption, supporting bone density and energy levels more effectively than processed milk. In regions like Nepal's Bagmati Province, local sourcing ensures peak freshness and grass-fed quality for superior nutrition.</p>

      <h2>Top 5 Science-Backed Health Benefits of Raw Farm Milk</h2>
      <ul>
        <li><strong>Bone Health:</strong> High calcium and vitamin D content strengthens bones and lowers osteoporosis risk.</li>
        <li><strong>Gut Digestion:</strong> Natural probiotics and enzymes aid lactose breakdown, easing issues for sensitive stomachs.</li>
        <li><strong>Immunity Boost:</strong> Studies link raw milk consumption to reduced allergies, asthma, and infections via immune-modulating components.</li>
        <li><strong>Sustained Energy:</strong> Quality proteins and fats provide lasting fuel without blood sugar spikes.</li>
        <li><strong>Skin and Mood Glow:</strong> Essential fatty acids and nutrients promote radiant skin and better mood, as reported in health surveys.</li>
      </ul>
      <p>Regular intake showed 35% improvements in immunity and digestion among participants.</p>

      <h2>Farm-Fresh Milk Risks and Safe Sourcing Tips</h2>
      <p>Raw farm-fresh milk carries pathogen risks like <strong>E. coli</strong> or <strong>Salmonella</strong>, posing dangers especially to children, elderly, and immunocompromised individuals. Health authorities recommend pasteurization for safety, but hygienic farm practices mitigate issues. Test milk quality, choose vetted suppliers, and store chilled to balance benefits and risks.</p>

      <h2>Local Farm-Fresh Milk Near Me: Nepal Guide</h2>
      <p>In Patan, Bagmati Province, seek grass-fed milk from certified local dairies for unmatched freshness and nutrition. Subscriptions from hygienic farms ensure daily supply, prioritizing organic and tested sources. Start small to assess tolerance and enjoy enhanced taste with health perks.</p>
    `,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800",
    author: "Kiran Oli",
    date: "2025-12-24",
    category: "Health",
    readTime: "6 min read"
  },
  {
    id: "2",
    slug: "traditional-paneer-making-guide",
    title: "Traditional Paneer Making: A Step-by-Step Guide",
    excerpt: "Learn the art of making fresh, creamy paneer at home using traditional methods passed down through generations.",
    content: `
      <p>Paneer, the beloved Nepali cottage cheese, is surprisingly simple to make at home. With just two ingredients – fresh milk and an acidic agent – you can create the freshest, most delicious paneer you've ever tasted.</p>
      
      <h2>What You'll Need</h2>
      <p>Start with 2 liters of full-fat milk and 4 tablespoons of lemon juice or white vinegar. The quality of your milk directly affects the quality of your paneer, so choose the freshest milk available.</p>
      
      <h2>The Process</h2>
      <p>Heat the milk until it just begins to boil, then reduce heat and slowly add the acidic agent while stirring gently. Watch as the curds separate from the whey – a magical transformation that never gets old.</p>
      
      <h2>Tips for Perfect Paneer</h2>
      <p>Don't squeeze out all the moisture if you want soft, creamy paneer. For firmer paneer suitable for grilling, press it under a heavy weight for 2-3 hours.</p>
    `,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
    author: "Bipin Katuwal",
    date: "2024-01-10",
    category: "Recipes",
    readTime: "8 min read"
  },
  {
    id: "3",
    slug: "understanding-a2-milk-difference",
    title: "Understanding A2 Milk: What Makes It Different",
    excerpt: "Explore the science behind A2 milk and why many people are making the switch from conventional dairy.",
    content: `
      <p>A2 milk has gained significant attention in recent years, with many consumers seeking it out as a gentler alternative to conventional milk. But what exactly makes A2 milk different, and is it right for you?</p>
      
      <h2>The Science of Beta-Casein</h2>
      <p>The difference lies in a protein called beta-casein. Regular milk contains both A1 and A2 beta-casein, while A2 milk contains only the A2 type. This single difference can have significant implications for digestion.</p>
      
      <h2>Digestive Benefits</h2>
      <p>Many people who experience discomfort with regular milk report that A2 milk is easier on their digestive system. Research suggests this may be due to how the body processes these different protein types.</p>
      
      <h2>Our A2 Promise</h2>
      <p>At Khairawang Dairy, our indigenous cow breeds naturally produce A2 milk, giving you the benefits of this special milk straight from happy, healthy cows.</p>
    `,
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800",
    author: "Kiran Oli",
    date: "2024-01-05",
    category: "Education",
    readTime: "6 min read"
  },
  {
    id: "4",
    slug: "smoothie-recipes-fresh-curd",
    title: "5 Delicious Smoothie Recipes with Fresh Curd",
    excerpt: "Transform your breakfast routine with these nutritious and delicious curd-based smoothies.",
    content: `
      <p>Fresh curd isn't just for raita – it's the secret ingredient for creamy, protein-packed smoothies that will keep you energized all morning.</p>
      
      <h2>Mango Lassi Smoothie</h2>
      <p>Blend 1 cup fresh curd with 1 ripe mango, a drizzle of honey, and a pinch of cardamom for the classic taste of Nepal.</p>
      
      <h2>Berry Blast</h2>
      <p>Combine curd with mixed berries, a banana, and a tablespoon of honey for an antioxidant-rich treat.</p>
      
      <h2>Green Goddess</h2>
      <p>For a nutritious green smoothie, blend curd with spinach, banana, and a touch of mint. You won't even taste the greens!</p>
    `,
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800",
    author: "Anupam Shah",
    date: "2024-01-01",
    category: "Recipes",
    readTime: "4 min read"
  },
  {
    id: "5",
    slug: "sustainable-dairy-farming-commitment",
    title: "Sustainable Dairy Farming: Our Commitment to the Planet",
    excerpt: "Learn about our eco-friendly practices and how we're working to create a more sustainable dairy industry.",
    content: `
      <p>At Khairawang Dairy, sustainability isn't just a buzzword – it's at the core of everything we do. From cow care to packaging, we're committed to minimizing our environmental footprint.</p>
      
      <h2>Happy Cows, Healthy Planet</h2>
      <p>Our cows graze on organic pastures, which not only produces better milk but also helps sequester carbon in the soil. It's a win-win for nutrition and the environment.</p>
      
      <h2>Zero-Waste Initiatives</h2>
      <p>We've implemented comprehensive recycling programs and are transitioning to biodegradable packaging. Our goal is to achieve zero waste to landfill by 2025.</p>
      
      <h2>Community Impact</h2>
      <p>By supporting local farmers and investing in sustainable practices, we're helping build a more resilient food system for future generations.</p>
    `,
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800",
    author: "Shudamshu Bharati",
    date: "2023-12-28",
    category: "Sustainability",
    readTime: "7 min read"
  }
];
