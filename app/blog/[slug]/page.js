import { BLOG_POSTS } from "@/lib/blogData";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, BookOpen } from "lucide-react";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  
  return {
    title: `${post.title} | APEX ALPHA Blog`,
    description: post.summary,
    alternates: {
      canonical: `https://apexalpha.fun/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // A very basic markdown-to-HTML parser for safety and server component purity
  const renderContent = (text) => {
    return text.split('\n\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;

      // Handle main headings (###)
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg md:text-xl font-header font-black text-white uppercase tracking-wider mt-8 mb-4 border-l-2 border-[#f0c040] pl-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // Handle subheadings (####)
      if (trimmed.startsWith('#### ')) {
        return (
          <h4 key={index} className="text-sm md:text-md font-header font-black text-[#f0c040] uppercase tracking-wide mt-6 mb-3">
            {trimmed.replace('#### ', '')}
          </h4>
        );
      }

      // Handle bullet points
      if (trimmed.startsWith('* ')) {
        const items = trimmed.split('\n');
        return (
          <ul key={index} className="list-disc pl-6 my-4 space-y-2 text-xs md:text-sm font-mono text-gray-400 leading-relaxed">
            {items.map((item, itemIdx) => {
              const cleanedItem = item.replace('* ', '');
              // Check if contains bold text (e.g. **Text:**)
              if (cleanedItem.includes('**')) {
                const parts = cleanedItem.split('**');
                return (
                  <li key={itemIdx}>
                    {parts.map((part, partIdx) => partIdx % 2 === 1 ? <strong key={partIdx} className="text-white">{part}</strong> : part)}
                  </li>
                );
              }
              return <li key={itemIdx}>{cleanedItem}</li>;
            })}
          </ul>
        );
      }

      // Handle dividers
      if (trimmed === '---') {
        return <div key={index} className="h-px bg-white/5 my-8" />;
      }

      // Handle normal paragraphs (with support for inline bolding and LaTeX symbols)
      let renderedParagraph = [trimmed];
      
      // Basic bold formatting support **text**
      if (trimmed.includes('**')) {
        const parts = trimmed.split('**');
        renderedParagraph = parts.map((part, idx) => {
          if (idx % 2 === 1) {
            return <strong key={idx} className="text-white font-bold">{part}</strong>;
          }
          return part;
        });
      }

      return (
        <p key={index} className="text-xs md:text-sm text-gray-400 font-mono leading-relaxed mb-4">
          {renderedParagraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col font-body selection:bg-[#f0c040]/30 overflow-y-auto relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] scanlines z-0" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#f0c040]/2 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Navbar */}
      <div className="px-8 py-4 border-b border-white/5 bg-black/60 backdrop-blur-2xl z-50">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[850px] w-full mx-auto p-6 md:p-12 z-10">
        
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-[10px] font-mono text-[#f0c040] uppercase tracking-widest hover:underline mb-8 cursor-pointer">
          <ArrowLeft size={10} /> Back to intelligence feed
        </Link>

        {/* Article Header */}
        <header className="border-b border-white/5 pb-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#f0c040]/30 bg-[#f0c040]/5 text-[#f0c040] text-[10px] font-mono tracking-[0.3em] uppercase mb-4 rounded-sm">
            <BookOpen size={10} /> {post.category}
          </div>
          
          <h1 className="text-2xl md:text-4xl font-header font-black tracking-tight uppercase leading-tight text-white mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-[10px] font-mono text-gray-500 uppercase">
            <span className="flex items-center gap-1">
              <Calendar size={10} className="text-[#f0c040]" /> {post.date}
            </span>
            <span className="flex items-center gap-1">
              <User size={10} className="text-[#f0c040]" /> By {post.author}
            </span>
          </div>
        </header>

        {/* Article Summary */}
        <div className="border border-[#f0c040]/20 bg-[#f0c040]/2 p-6 mb-8 rounded-sm text-xs font-mono text-gray-300 leading-relaxed italic">
          <strong>Summary:</strong> {post.summary}
        </div>

        {/* Article Content */}
        <div className="article-body space-y-6">
          {renderContent(post.content)}
        </div>

      </div>

      {/* Footer Disclaimer */}
      <footer className="border-t border-white/5 bg-black/40 py-8 px-6 mt-16 text-center z-10">
        <div className="max-w-[900px] mx-auto space-y-4">
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex justify-center gap-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>•</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog Feed</Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
          <p className="text-[9px] font-mono text-gray-600 max-w-[700px] mx-auto leading-relaxed uppercase">
            Disclaimer: APEX ALPHA is a virtual simulation terminal and educational suite. All strategies, calculations, and simulations are mock coordinates running locally inside your browser and do not constitute investment advice, financial planning, or real brokerage activity.
          </p>
          <div className="text-[8px] font-mono text-gray-800 uppercase tracking-[0.4em] select-none">
            © 2026 APEX ALPHA. ALL RIGHTS PRESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
