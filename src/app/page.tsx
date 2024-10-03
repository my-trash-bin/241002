"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DotIcon,
  HomeIcon,
} from "lucide-react";
import Link from "next/link";
import { KeyboardEvent, useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
}

interface Category {
  name: string;
  subCategories: Category[];
  posts: Post[];
}

const tocItems = [
  { id: "section-1", title: "Section 1" },
  { id: "section-2", title: "Section 2" },
  { id: "section-3", title: "Section 3" },
];

const categories: Category[] = [
  {
    name: "Default",
    subCategories: [
      {
        name: "programming",
        subCategories: [],
        posts: [{ id: "programming-post-1", title: "Programming" }],
      },
      {
        name: "AI",
        subCategories: [
          {
            name: "deeper one",
            subCategories: [],
            posts: [{ id: "deep-post-1", title: "Deep" }],
          },
        ],
        posts: [{ id: "ai-post-1", title: "AI" }],
      },
    ],
    posts: [
      { id: "post-1", title: "Root Post 1" },
      { id: "post-2", title: "Root Post 2" },
      { id: "post-3", title: "Root Post 3" },
      { id: "post-4", title: "Root Post 4" },
      { id: "post-5", title: "Root Post 5" },
    ],
  },
  {
    name: "Date",
    subCategories: [],
    posts: [
      { id: "post-1", title: "Root Post 1" },
      { id: "post-2", title: "Root Post 2" },
      { id: "post-3", title: "Root Post 3" },
      { id: "post-4", title: "Root Post 4" },
      { id: "post-5", title: "Root Post 5" },
      { id: "programming-post-1", title: "Programming" },
      { id: "ai-post-1", title: "AI" },
      { id: "deep-post-1", title: "Deep" },
    ],
  },
  {
    name: "Test",
    subCategories: [],
    posts: [],
  },
];

const PostTree = ({
  category,
  isRoot,
}: {
  category: Category;
  isRoot?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(isRoot);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleExpanded();
    }
  };

  const handleCategoryClick = () => {
    // Here you can add logic to navigate to the category page
    console.log(`Navigating to category: ${category.name}`);
  };

  return (
    <div>
      {!isRoot && (
        <div className="flex py-1 items-center">
          <div
            className="cursor-pointer p-1"
            onClick={toggleExpanded}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            aria-label={`Expand ${category.name} category`}
          >
            <ChevronRightIcon
              className={`h-4 w-4 transition-transform ${
                isExpanded ? "transform rotate-90" : ""
              }`}
              aria-hidden="true"
            />
          </div>
          <div
            className="ml-1 cursor-pointer flex-grow"
            onClick={handleCategoryClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCategoryClick();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Go to ${category.name} category`}
          >
            {category.name}
          </div>
        </div>
      )}
      {(isExpanded || isRoot) && (
        <div
          className={isRoot ? "" : "ml-4"}
          role="group"
          aria-label={`${category.name} subcategories and posts`}
        >
          {category.subCategories.map((subCategory) => (
            <PostTree key={subCategory.name} category={subCategory} />
          ))}
          {category.posts.map((post) => (
            <Link
              key={post.id}
              href={`/${post.id}`}
              className="flex py-1 text-muted-foreground hover:text-foreground items-center"
            >
              <DotIcon />
              {post.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default function BlogPost() {
  const [activeSection, setActiveSection] = useState("section-1");
  const [expanded, setExpanded] = useState<undefined | "postList" | "toc">();

  useEffect(() => {
    const map: Record<string, boolean> = {};
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          map[entry.target.id] = entry.isIntersecting;
        });

        const first = tocItems.findIndex(({ id }) => map[id]);
        if (first !== -1) {
          setActiveSection(tocItems[Math.max(first - 1, 0)].id);
        } else {
          setActiveSection(tocItems[tocItems.length - 1].id);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "-100px 0px -30%",
      }
    );

    document.querySelectorAll("h2[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [expanded]);

  const togglePostList = () => {
    setExpanded((expanded) =>
      expanded === "postList" ? undefined : "postList"
    );
  };

  const toggleToc = () => {
    setExpanded((expanded) => (expanded === "toc" ? undefined : "toc"));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <HomeIcon className="h-6 w-6" />
            <span className="font-bold">Blog</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/about">About</Link>
            <Link href="/posts">Posts</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Sticky Mobile and Tablet Post List and TOC Container */}
      <div
        className={cn(
          "lg:hidden sticky flex flex-col top-14 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          expanded && "h-[calc(100vh-3.5rem)]"
        )}
      >
        {/* Mobile Post List collapsed */}
        <div className="md:hidden border-b h-10">
          <div className="container mx-auto px-4">
            <div
              className="py-2 flex items-center justify-between cursor-pointer"
              onClick={togglePostList}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  togglePostList();
                }
              }}
              aria-expanded={expanded === "postList"}
              aria-controls="mobile-post-list"
            >
              <span className="font-medium">Posts</span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  expanded === "postList" ? "transform rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Mobile Post List expanded */}
        {expanded === "postList" && (
          <div
            id="mobile-post-list"
            className="md:hidden border-b flex-1 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-2">
              <Tabs defaultValue={categories[0].name}>
                <TabsList>
                  {categories.map((category) => (
                    <TabsTrigger key={category.name} value={category.name}>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {categories.map((category) => (
                  <TabsContent key={category.name} value={category.name}>
                    <PostTree category={category} isRoot />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        )}

        {/* Mobile and Tablet TOC collapsed */}
        <div className="border-b h-10">
          <div className="container mx-auto px-4">
            <div
              className="py-2 flex items-center justify-between cursor-pointer"
              onClick={toggleToc}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleToc();
                }
              }}
              aria-expanded={expanded === "toc"}
              aria-controls="mobile-toc"
            >
              <span className="font-medium">
                {tocItems.find((item) => item.id === activeSection)?.title}
              </span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  expanded === "toc" ? "transform rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Mobile and Tablet TOC expanded */}
        {expanded === "toc" && (
          <div
            id="mobile-toc"
            className="lg:hidden flex-1 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-2">
                {tocItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block py-2 ${
                      activeSection === item.id ? "font-semibold" : ""
                    }`}
                    onClick={toggleToc}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)_200px] lg:gap-10">
        {/* Sidebar for larger screens */}
        <aside className="hidden md:block sticky top-14 z-30 h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r">
          <div className="py-6 pr-6 lg:py-8">
            <h2 className="mb-4 text-lg font-semibold">Posts</h2>
            <Tabs defaultValue={categories[0].name}>
              <TabsList>
                {categories.map((category) => (
                  <TabsTrigger key={category.name} value={category.name}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {categories.map((category) => (
                <TabsContent key={category.name} value={category.name}>
                  <PostTree category={category} isRoot />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex w-full flex-col overflow-hidden py-6">
          <article className="prose dark:prose-invert max-w-none">
            <h1 className="text-3xl font-bold mb-4">Blog Post Title</h1>
            <p>
              This is the content of the blog post. It can be as long as needed
              and will scroll independently of the sidebar and table of
              contents.
            </p>
            <h2 id="section-1" className="text-2xl font-semibold mt-6 mb-4">
              Section 1
            </h2>
            <p>
              Content for section 1 goes here. You can add as much text as
              needed to demonstrate the layout and scrolling behavior.
            </p>
            <h2 id="section-2" className="text-2xl font-semibold mt-6 mb-4">
              Section 2
            </h2>
            <p>
              Content for section 2 is placed here. This section can include
              various elements such as text, images, or code snippets.
            </p>
            <h2 id="section-3" className="text-2xl font-semibold mt-6 mb-4">
              Section 3
            </h2>
            <p>
              Section 3 content is written here. You can continue adding more
              sections and content as needed for your blog post.
            </p>
          </article>

          {/* Comments Section */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="font-semibold">User123</p>
              <p>Great post! Thanks for sharing.</p>
            </div>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="font-semibold">BlogEnthusiast</p>
              <p>
                I found this article very informative. Looking forward to more
                content like this!
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="font-semibold">TechLover42</p>
              <p>
                Interesting perspective on the topic. Have you considered
                exploring the impact of recent developments in this area?
              </p>
            </div>
          </section>
        </main>

        {/* Table of Contents for larger screens */}
        <aside className="hidden lg:block sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="py-6 pl-6">
            <h2 className="mb-4 text-lg font-semibold">Table of Contents</h2>
            <nav className="space-y-2">
              {tocItems.map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block hover:underline ${
                    activeSection === item.id ? "font-semibold" : ""
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2023 Your Blog Name. All rights reserved.
          </p>
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
