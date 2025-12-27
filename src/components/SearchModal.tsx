import React, { useState, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { products } from "@/data/products";
import { blogPosts } from "@/data/blogs";
import { Link } from "react-router-dom";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    const productResults = products.filter(p => p.name.toLowerCase().includes(q));
    const blogResults = blogPosts.filter(b => b.title.toLowerCase().includes(q));
    return [
      ...productResults.map(p => ({
        type: "product" as const,
        id: p.id,
        name: p.name,
        image: p.image,
        link: `/products/${p.slug}`,
      })),
      ...blogResults.map(b => ({
        type: "blog" as const,
        id: b.id,
        name: b.title,
        image: b.image,
        link: `/blog/${b.slug}`,
      })),
    ];
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Search products, blogs, ..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1"
          />
        </div>
        {query.trim() === "" ? (
          <div className="text-sm text-muted-foreground text-center mt-8">
            Start typing to search...
          </div>
        ) : results.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center mt-8">
            No results found.
          </div>
        ) : (
          <div className="space-y-2 mt-4">
            {results.map((item) => (
              <Link
                to={item.link}
                key={item.type + '-' + item.id}
                className="flex items-center gap-3 p-2 rounded hover:bg-accent transition-colors"
                onClick={() => onOpenChange(false)}
              >
                <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                <div>
                  <div className="font-medium text-foreground">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.type === 'product' ? 'Product' : 'Blog'}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
