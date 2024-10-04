"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DotIcon,
  HomeIcon,
  MenuIcon,
  RssIcon,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { KeyboardEvent, ReactElement, useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
}

interface Category {
  name: string;
  subCategories: Category[];
  posts: Post[];
}

interface RelatedTag {
  similarity: number; // 0 to 1
  name: string;
}

interface TagData {
  name: string;
  parentTag?: string;
  childTags: string[];
  relatedTags: RelatedTag[];
}

interface Banner {
  content: ReactElement;
  backgroundColorOnDarkTheme: string;
  backgroundColorOnLightTheme: string;
}

const tocItems = [
  { id: "parent-tag", title: "Parent Tag" },
  { id: "child-tags", title: "Child Tags" },
  { id: "related-tags", title: "Related Tags" },
  { id: "comments", title: "Comments" },
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

// Sample tag data
const tagData: TagData = {
  name: "React",
  parentTag: "JavaScript",
  childTags: ["Hooks", "Components", "State Management"],
  relatedTags: [
    { similarity: 0.9, name: "Vue" },
    { similarity: 0.8, name: "Angular" },
    { similarity: 0.7, name: "Svelte" },
    { similarity: 0.6, name: "Frontend" },
  ],
};

const banners: Banner[] = [
  {
    content: (
      <div className="text-white font-semibold">
        This tag is trending! Explore more React content.
      </div>
    ),
    backgroundColorOnDarkTheme: "#440088",
    backgroundColorOnLightTheme: "#440088",
  },
];

function PostTree({
  category,
  isRoot,
}: {
  category: Category;
  isRoot?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(isRoot);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleExpanded();
    }
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
          <Link
            href={`/categories/${category.name}`}
            className="ml-1 cursor-pointer flex-grow"
          >
            {category.name}
          </Link>
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
}

export default function TagPage() {
  const [activeSection, setActiveSection] = useState("parent-tag");
  const [expanded, setExpanded] = useState<undefined | "postList" | "toc">();
  const [leftAsideExpanded, setLeftAsideExpanded] = useState(true);
  const [rightAsideExpanded, setRightAsideExpanded] = useState(true);
  const { theme } = useTheme();
  const [visibleBanners, setVisibleBanners] = useState(banners);

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

  const closeBanner = (index: number) => {
    setVisibleBanners((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleLeftAside = () => {
    setLeftAsideExpanded(!leftAsideExpanded);
  };

  const toggleRightAside = () => {
    setRightAsideExpanded(!rightAsideExpanded);
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
            <ThemeSwitcher />
          </nav>
        </div>
      </header>

      {/* Banner */}
      {visibleBanners.map((banner, index) => (
        <div
          key={index}
          className="w-full py-2"
          style={{
            backgroundColor:
              theme === "dark"
                ? banner.backgroundColorOnDarkTheme
                : banner.backgroundColorOnLightTheme,
          }}
        >
          <div className="container mx-auto px-4 flex justify-between items-center">
            {banner.content}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => closeBanner(index)}
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

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
      </div>

      <div className="container mx-auto px-4 flex-1 items-start md:grid md:grid-cols-[auto_minmax(0,1fr)] md:gap-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-10">
        {/* Left Sidebar for larger screens */}
        <aside
          className={cn(
            "hidden md:block sticky top-14 z-30 h-[calc(100vh-3.5rem)] shrink-0 transition-all duration-300",
            leftAsideExpanded
              ? "w-[280px] overflow-y-auto"
              : "w-[40px] overflow-hidden"
          )}
        >
          <div className="py-6 pr-6 lg:py-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2
                className={cn(
                  "text-lg font-semibold",
                  !leftAsideExpanded && "sr-only"
                )}
              >
                Posts
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLeftAside}
                aria-label={
                  leftAsideExpanded
                    ? "Collapse left sidebar"
                    : "Expand left sidebar"
                }
              >
                {leftAsideExpanded ? (
                  <ChevronLeftIcon className="h-4 w-4" />
                ) : (
                  <MenuIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            {leftAsideExpanded && (
              <Tabs defaultValue={categories[0].name} className="flex-grow">
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
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex w-full flex-col overflow-hidden py-6">
          <article className="prose dark:prose-invert max-w-none">
            <h1 className="text-3xl font-bold mb-4">Tag: {tagData.name}</h1>

            <h2 id="parent-tag" className="text-2xl font-semibold mt-6 mb-4">
              Parent Tag
            </h2>
            {tagData.parentTag ? (
              <Link
                href={`/tags/${tagData.parentTag}`}
                className="text-primary hover:underline"
              >
                {tagData.parentTag}
              </Link>
            ) : (
              <p>This tag has no parent tag.</p>
            )}

            <h2 id="child-tags" className="text-2xl font-semibold mt-6 mb-4">
              Child Tags
            </h2>
            {tagData.childTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tagData.childTags.map((tag) => (
                  <Link key={tag} href={`/tags/${tag}`}>
                    <Badge variant="secondary">{tag}</Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <p>This tag has no child tags.</p>
            )}

            <h2 id="related-tags" className="text-2xl font-semibold mt-6 mb-4">
              Related Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {tagData.relatedTags.map((tag) => (
                <Link key={tag.name} href={`/tags/${tag.name}`}>
                  <Badge variant="outline">
                    {tag.name} ({(tag.similarity * 100).toFixed(0)}%)
                  </Badge>
                </Link>
              ))}
            </div>
          </article>

          {/* Comments Section */}
          <section className="mt-8">
            <h2 id="comments" className="text-2xl font-bold mb-4">
              Comments
            </h2>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="font-semibold">User123</p>
              <p>Great tag! I've learned a lot about {tagData.name}.</p>
            </div>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="font-semibold">TagEnthusiast</p>
              <p>
                This tag has been incredibly helpful for my projects. Thanks for
                curating such great content!
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="font-semibold">TechExplorer42</p>
              <p>
                I'm curious about the relationship between {tagData.name} and
                its parent tag. Could you elaborate on that?
              </p>
            </div>
          </section>
        </main>

        {/* Right Sidebar for larger screens */}
        <aside
          className={cn(
            "hidden lg:block sticky top-14 self-start h-[calc(100vh-3.5rem)] transition-all duration-300",
            rightAsideExpanded
              ? "w-[250px] overflow-y-auto"
              : "w-[40px] overflow-hidden"
          )}
        >
          <div className="py-6 pl-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2
                className={cn(
                  "text-lg font-semibold",
                  !rightAsideExpanded && "sr-only"
                )}
              >
                Tag Information
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRightAside}
                aria-label={
                  rightAsideExpanded
                    ? "Collapse right sidebar"
                    : "Expand right sidebar"
                }
              >
                {rightAsideExpanded ? (
                  <ChevronRightIcon className="h-4 w-4" />
                ) : (
                  <MenuIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            {rightAsideExpanded && (
              <>
                <nav className="space-y-2">
                  <Link
                    href={`/tags/${tagData.name}/rss`}
                    className="flex items-center space-x-2 text-primary hover:underline"
                  >
                    <RssIcon className="h-4 w-4" />
                    <span>RSS Feed</span>
                  </Link>
                </nav>
              </>
            )}
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
