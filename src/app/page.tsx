"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRightIcon,
  BookOpenIcon,
  HomeIcon,
  RssIcon,
  TagIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  author: string;
}

const recentPosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with React Hooks",
    excerpt:
      "Learn how to use React Hooks to manage state and side effects in your functional components.",
    date: "2023-06-01",
    category: "React",
    author: "Jane Doe",
  },
  {
    id: "2",
    title: "Building Scalable APIs with GraphQL",
    excerpt:
      "Discover the benefits of GraphQL and how to implement it in your next project.",
    date: "2023-05-28",
    category: "Backend",
    author: "John Smith",
  },
  {
    id: "3",
    title: "CSS Grid: A Complete Guide",
    excerpt:
      "Master CSS Grid layout with this comprehensive guide and practical examples.",
    date: "2023-05-25",
    category: "CSS",
    author: "Emily Johnson",
  },
  {
    id: "4",
    title: "Introduction to TypeScript",
    excerpt:
      "Learn the basics of TypeScript and how it can improve your JavaScript development.",
    date: "2023-05-22",
    category: "TypeScript",
    author: "Michael Brown",
  },
];

const featuredCategories = [
  "React",
  "Node.js",
  "CSS",
  "JavaScript",
  "TypeScript",
  "GraphQL",
];
const trendingTags = [
  "WebDev",
  "FrontEnd",
  "BackEnd",
  "FullStack",
  "CodingTips",
  "WebPerformance",
];

export default function MainPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <HomeIcon className="h-6 w-6" />
            <span className="font-bold text-xl">TechBlog</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/posts">Posts</Link>
            <Link href="/categories">Categories</Link>
            <Link href="/about">About</Link>
            <ThemeSwitcher />
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src="/placeholder.svg?height=400&width=800"
              alt="Featured post"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-end p-6">
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome to TechBlog
              </h1>
              <p className="text-xl text-gray-200 mb-4">
                Explore the latest in web development, programming, and
                technology.
              </p>
              <Button asChild>
                <Link href="/posts">
                  Explore Posts <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Recent Posts */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <BookOpenIcon className="mr-2 h-8 w-8" />
            Recent Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Badge>{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {post.date}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Categories */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <TagIcon className="mr-2 h-8 w-8" />
            Featured Categories
          </h2>
          <div className="flex flex-wrap gap-4">
            {featuredCategories.map((category) => (
              <Button key={category} variant="outline" asChild>
                <Link href={`/categories/${category.toLowerCase()}`}>
                  {category}
                </Link>
              </Button>
            ))}
          </div>
        </section>

        {/* RSS */}
        <section className="mb-12 bg-muted p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 flex items-center">
            <RssIcon className="mr-2 h-8 w-8" />
            Stay Updated with Our RSS Feed
          </h2>
          <p className="mb-4">
            Get instant updates on our latest articles and tech news directly in
            your favorite RSS reader.
          </p>
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/rss.xml" className="flex items-center">
                <RssIcon className="mr-2 h-4 w-4" />
                Subscribe to RSS Feed
              </Link>
            </Button>
          </div>
        </section>

        {/* Trending Tags */}
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <TrendingUpIcon className="mr-2 h-8 w-8" />
            Trending Tags
          </h2>
          <div className="flex flex-wrap gap-4">
            {trendingTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-lg py-1 px-3"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2023 TechBlog. All rights reserved.
          </p>
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
