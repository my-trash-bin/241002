"use client";

import { ChevronDownIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BlogPost() {
  const [activeSection, setActiveSection] = useState("section-1");
  const [isTocExpanded, setIsTocExpanded] = useState(false);
  const [isPostListOpen, setIsPostListOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("h2[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const tocItems = [
    { id: "section-1", title: "Section 1" },
    { id: "section-2", title: "Section 2" },
    { id: "section-3", title: "Section 3" },
  ];

  const recentPosts = [
    { id: "post-1", title: "Post 1" },
    { id: "post-2", title: "Post 2" },
    { id: "post-3", title: "Post 3" },
    { id: "post-4", title: "Post 4" },
    { id: "post-5", title: "Post 5" },
  ];

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
      <div className="lg:hidden sticky top-14 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Mobile Post List */}
        <div className="md:hidden border-b">
          <div className="container mx-auto px-4">
            <div
              className="py-2 flex items-center justify-between cursor-pointer"
              onClick={() => setIsPostListOpen(!isPostListOpen)}
            >
              <span className="font-medium">Recent Posts</span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  isPostListOpen ? "transform rotate-180" : ""
                }`}
              />
            </div>
            {isPostListOpen && (
              <nav className="py-2 space-y-1">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/${post.id}`}
                    className="block py-1 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsPostListOpen(false)}
                  >
                    {post.title}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>

        {/* Mobile and Tablet TOC */}
        <div className="border-b">
          <div className="container mx-auto px-4">
            <div
              className="py-2 flex items-center justify-between cursor-pointer"
              onClick={() => setIsTocExpanded(!isTocExpanded)}
            >
              <span className="font-medium">
                {tocItems.find((item) => item.id === activeSection)?.title}
              </span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  isTocExpanded ? "transform rotate-180" : ""
                }`}
              />
            </div>
            {isTocExpanded && (
              <nav className="py-2 space-y-1">
                {tocItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block py-1 ${
                      activeSection === item.id
                        ? "font-semibold"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setIsTocExpanded(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)_200px] lg:gap-10">
        {/* Sidebar for larger screens */}
        <aside className="hidden md:block sticky top-14 z-30 h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r">
          <div className="py-6 pr-6 lg:py-8">
            <h2 className="mb-4 text-lg font-semibold">Recent Posts</h2>
            <nav className="flex flex-col space-y-2">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${post.id}`}
                  className="hover:underline"
                >
                  {post.title}
                </Link>
              ))}
            </nav>
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
        <aside className="hidden text-sm lg:block">
          <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
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
