"use client";

import { useAuth } from "@/context/AuthContext";
import LoginScreen from "@/components/LoginScreen";
import { useEffect, useState } from "react";
import fallback from "@/data/fallback.json";
import SunlightBeams from "@/components/SunlightBeams";
import SideAnimations from "@/components/SideAnimations";

// Saved Article type definition
interface SavedArticle {
    id: string;
    emoji: string;
    title: string;
    subtitle: string;
    content: string;
}

// CSS-based high-fidelity browser frame mockup
const BrowserMockup = () => {
    return (
        <div className="w-full border border-cafe-border/85 rounded-xl bg-cafe-bg-sidebar overflow-hidden shadow-2xl aspect-video flex flex-col select-none relative z-10">
            {/* Top Bar */}
            <div className="h-6 bg-cafe-bg-secondary border-b border-cafe-border/50 flex items-center px-3 gap-1.5 shrink-0">
                <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                <div className="flex-1 mx-6 h-3.5 bg-cafe-bg-primary rounded border border-cafe-border/40 flex items-center justify-center">
                    <span className="text-[7.5px] text-cafe-text-secondary/70 font-sans tracking-wide">personal.cafe/digest</span>
                </div>
            </div>
            {/* Window Content */}
            <div className="flex-1 p-2 flex gap-2 bg-cafe-bg-primary overflow-hidden">
                {/* Mini Sidebar */}
                <div className="w-1/4 bg-cafe-bg-sidebar border border-cafe-border/40 rounded p-1.5 flex flex-col gap-1.5 shrink-0">
                    <div className="h-2 w-3/4 bg-cafe-text-secondary/50 rounded"></div>
                    <div className="h-1 w-1/2 bg-cafe-text-secondary/30 rounded"></div>
                    <div className="mt-2 flex flex-col gap-1">
                        <div className="h-1 w-full bg-cafe-text-secondary/20 rounded"></div>
                        <div className="h-1 w-full bg-cafe-text-secondary/20 rounded"></div>
                        <div className="h-1 w-full bg-cafe-text-secondary/20 rounded"></div>
                    </div>
                </div>
                {/* Mini Main Panel */}
                <div className="flex-1 flex flex-col gap-1.5 p-1 overflow-hidden">
                    <div className="h-2 w-1/2 bg-cafe-accent/40 rounded"></div>
                    <div className="h-1 w-3/4 bg-cafe-text-secondary/40 rounded"></div>
                    <div className="mt-1 flex flex-col gap-1 border border-cafe-border/40 rounded p-1 bg-cafe-bg-card">
                        <div className="h-1.5 w-1/3 bg-cafe-accent/60 rounded"></div>
                        <div className="h-1 w-full bg-cafe-text-secondary/30 rounded"></div>
                        <div className="h-1 w-5/6 bg-cafe-text-secondary/30 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// SVG Chemical Flask Beaker Icon
const BeakerIcon = () => (
    <svg
        className="absolute right-6 bottom-4 w-40 h-40 text-slate-800/[0.12] pointer-events-none select-none transition-all duration-500 group-hover:scale-105"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M6 3h12" />
        <path d="M8 3v4.5L4.5 17A2 2 0 0 0 6 20h12a2 2 0 0 0 1.5-3L16 7.5V3" />
        <path d="M6 14h12" />
    </svg>
);

// Mini sparkline SVG chart component
const MiniChart = ({ data }: { data: number[] }) => {
    const width = 80;
    const height = 24;
    const padding = 2;
    const points = data.map((val, idx) => {
        const x = padding + (idx * (width - padding * 2)) / (data.length - 1);
        const y = height - padding - (val * (height - padding * 2)) / 100;
        return `${x},${y}`;
    }).join(" ");
    
    return (
        <svg width={width} height={height} className="text-emerald-500 overflow-visible">
            <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    );
};

// Bar row popularity chart component
const BarRow = ({ label, percentage, colorClass }: { label: string; percentage: number; colorClass: string }) => (
    <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs text-slate-450 font-semibold tracking-wide font-sans">
            <span>{label}</span>
            <span>{percentage}%</span>
        </div>
        <div className="w-full h-2 bg-[#111622] rounded-full overflow-hidden border border-zinc-850">
            <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);

// Dashboard 1: Trending
const TrendingDashboard = () => {
    const stories = [
        { id: 1, title: "OpenAI releases GPT-4o with real-time audio and vision capabilities", count: "14.2k clicks", badge: "HOT", data: [30, 45, 62, 58, 92] },
        { id: 2, title: "Google Gemini 1.5 Pro expands context window to 2 million tokens", count: "9.8k clicks", badge: "TRENDING", data: [15, 30, 42, 60, 86] },
        { id: 3, title: "GitHub Copilot Workspace enters public preview for developers", count: "8.4k clicks", badge: "NEW", data: [10, 25, 45, 52, 78] },
        { id: 4, title: "Meta releases Llama 3 open-source weights and models", count: "11.1k clicks", badge: "HOT", data: [45, 50, 55, 65, 88] },
        { id: 5, title: "Apple announces AI-focused M4 chip in new iPad Pro models", count: "7.6k clicks", badge: "TRENDING", data: [5, 12, 35, 48, 74] }
    ];

    return (
        <div className="flex flex-col gap-8 animate-fadeIn">
            <div>
                <h2 className="text-3xl font-serif font-medium text-cafe-text-primary mb-2">Trending Stories</h2>
                <p className="text-cafe-text-secondary text-sm font-sans max-w-xl">Top 5 AI and engineering stories capturing the community's attention right now.</p>
            </div>
            <div className="flex flex-col gap-4">
                {stories.map(story => (
                    <div key={story.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-cafe-bg-card backdrop-blur-md border border-cafe-border rounded-2xl gap-4 hover:border-cafe-border-hover transition-all duration-300">
                        <div className="flex-1 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-sans font-bold tracking-widest px-2 py-0.5 rounded ${
                                    story.badge === "HOT" ? "bg-red-500/20 text-red-400 border border-red-500/30" : 
                                    story.badge === "NEW" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : 
                                    "bg-cafe-accent/20 text-cafe-accent border border-cafe-accent/30"
                                }`}>{story.badge}</span>
                                <span className="text-[12px] text-cafe-text-secondary/70 font-medium font-sans">{story.count}</span>
                            </div>
                            <h3 className="text-base sm:text-[17px] font-sans font-semibold text-cafe-text-primary leading-relaxed">{story.title}</h3>
                        </div>
                        <div className="shrink-0 flex items-center gap-4">
                            <MiniChart data={story.data} />
                            <a href="#" className="p-2 bg-cafe-bg-secondary border border-cafe-border rounded-xl hover:bg-cafe-bg-secondary/80 text-cafe-text-secondary hover:text-cafe-text-primary transition">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Dashboard 2: Saved Articles
const SavedArticlesDashboard = ({ savedArticles, toggleSave }: { savedArticles: SavedArticle[]; toggleSave: any }) => {
    return (
        <div className="flex flex-col gap-8 animate-fadeIn font-sans">
            <div>
                <h2 className="text-3xl font-serif font-medium text-cafe-text-primary mb-2">Saved Articles</h2>
                <p className="text-cafe-text-secondary text-sm font-sans max-w-xl">Browse all digests and sections you have saved for offline reading or future reference.</p>
            </div>

            {savedArticles.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 bg-cafe-bg-card/40 border border-cafe-border rounded-2xl gap-4 text-center">
                    <span className="text-4xl">⭐</span>
                    <h3 className="text-lg font-bold text-cafe-text-primary">Your Saved Library is Empty</h3>
                    <p className="text-cafe-text-secondary text-xs max-w-[280px]">Bookmark stories from the **Daily Roast** or **Archives** tabs by clicking the star icon to save them here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedArticles.map((article, idx) => (
                        <div key={idx} className="relative bg-cafe-bg-card backdrop-blur-md border border-cafe-border rounded-2xl p-6 hover:border-cafe-border-hover transition duration-200">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2.5">
                                    <span className="text-xl">{article.emoji}</span>
                                    <div className="flex flex-col">
                                        <h4 className="text-[15px] font-sans font-bold text-cafe-text-primary">{article.title}</h4>
                                        <span className="text-[11px] text-cafe-text-secondary/70 font-sans">{article.subtitle}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => toggleSave(article.id, article.emoji, article.title, article.subtitle, article.content)}
                                    className="text-cafe-accent p-1.5 rounded hover:bg-cafe-bg-secondary transition cursor-pointer"
                                    title="Unsave article"
                                >
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                    </svg>
                                </button>
                            </div>
                            <p className="text-cafe-text-secondary text-sm leading-relaxed">{article.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Dashboard 3: Archives
const ArchivesDashboard = ({ savedArticles, toggleSave, isSaved }: { savedArticles: SavedArticle[]; toggleSave: any; isSaved: any }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchDate, setSearchDate] = useState("");
    
    const pastDigests = [
        {
            date: "June 08, 2026",
            espresso: "OpenAI launches Sora for everyone. The model now supports real-time editing of generated video segments via text prompts. This represents a massive shift for creative workflows.",
            coldbrew: "Large Language Models as Optimizers (OPRO) is a new framework from Google DeepMind that uses LLMs to find better solutions for complex tasks by iterating on prompts.",
            pastry: "Lucide Icons - A beautiful, open-source icon set that has become the industry standard for modern web apps. Perfect for clean, minimalist UIs."
        },
        {
            date: "June 07, 2026",
            espresso: "Anthropic releases Claude 3.5 Sonnet setting new standards. It features significant updates in coding capabilities, math solving, and visual logic comprehension.",
            coldbrew: "Model Context Protocol (MCP) establishes a standardized way to connect AI systems to databases, files, and external APIs safely and easily.",
            pastry: "Tailwind CSS v4.0 is now in alpha. It features a complete rewrite from the ground up, utilizing a native Rust-based compiler engine for up to 10x faster build speeds."
        },
        {
            date: "June 06, 2026",
            espresso: "Next.js 16 updates feature improvements to Turbopack and server action cache pipelines. Rendering speeds are improved up to 30% for static paths.",
            coldbrew: "Multi-agent orchestration frameworks like LangGraph are seeing massive adoption as companies shift from single chat boxes to autonomous dev agents.",
            pastry: "Shadcn UI components are now customizable via CSS variables at runtime, allowing users to theme their entire design system from a single settings layout."
        }
    ];

    const filteredDigests = pastDigests.filter(digest => {
        const matchesText = searchTerm === "" || 
            digest.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
            digest.espresso.toLowerCase().includes(searchTerm.toLowerCase()) ||
            digest.coldbrew.toLowerCase().includes(searchTerm.toLowerCase()) ||
            digest.pastry.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesText;
    });

    return (
        <div className="flex flex-col gap-8 animate-fadeIn font-sans">
            <div>
                <h2 className="text-3xl font-serif font-medium text-cafe-text-primary mb-2">Digest Archives</h2>
                <p className="text-cafe-text-secondary text-sm font-sans max-w-xl">Browse, search, and retrieve previous daily digests and summaries.</p>
            </div>

            {/* Filter inputs */}
            <div className="flex flex-col sm:flex-row gap-4">
                <input 
                    type="text" 
                    placeholder="Search past digests by keyword..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-cafe-bg-card/70 border border-cafe-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cafe-border-hover text-cafe-text-primary placeholder-cafe-text-secondary/50"
                />
                <input 
                    type="date" 
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="bg-cafe-bg-card/70 border border-cafe-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cafe-border-hover text-cafe-text-primary cursor-pointer"
                />
            </div>

            {/* Timeline feed */}
            <div className="relative border-l border-cafe-border/60 pl-6 ml-3 flex flex-col gap-10">
                {filteredDigests.map((digest, index) => (
                    <div key={index} className="relative">
                        {/* Timeline dot */}
                        <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-cafe-accent border-4 border-cafe-bg-primary box-content"></div>
                        
                        <div className="flex flex-col gap-3">
                            <span className="text-xs font-bold text-cafe-text-secondary/60 font-sans tracking-wide uppercase">{digest.date}</span>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="bg-cafe-bg-card/45 backdrop-blur-sm border border-cafe-border hover:border-cafe-border-hover rounded-xl p-5 transition duration-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-cafe-text-primary font-serif">☕ Espresso Shot</span>
                                        <button 
                                            onClick={() => toggleSave("archive_espresso_" + index, "☕", "Espresso (" + digest.date + ")", "The 3-Sentence Brief", digest.espresso)}
                                            className="text-cafe-text-secondary/60 hover:text-cafe-accent transition cursor-pointer p-0.5 rounded"
                                        >
                                            {isSaved("archive_espresso_" + index) ? "★" : "☆"}
                                        </button>
                                    </div>
                                    <p className="text-cafe-text-secondary text-xs leading-relaxed">{digest.espresso}</p>
                                </div>
                                <div className="bg-cafe-bg-card/45 backdrop-blur-sm border border-cafe-border hover:border-cafe-border-hover rounded-xl p-5 transition duration-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-cafe-text-primary font-serif">🧊 Cold Brew</span>
                                        <button 
                                            onClick={() => toggleSave("archive_coldbrew_" + index, "🧊", "Cold Brew (" + digest.date + ")", "The Deep Dive", digest.coldbrew)}
                                            className="text-cafe-text-secondary/60 hover:text-cafe-accent transition cursor-pointer p-0.5 rounded"
                                        >
                                            {isSaved("archive_coldbrew_" + index) ? "★" : "☆"}
                                        </button>
                                    </div>
                                    <p className="text-cafe-text-secondary text-xs leading-relaxed">{digest.coldbrew}</p>
                                </div>
                                <div className="bg-cafe-bg-card/45 backdrop-blur-sm border border-cafe-border hover:border-cafe-border-hover rounded-xl p-5 transition duration-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-cafe-text-primary font-serif">🥐 Daily Pastry</span>
                                        <button 
                                            onClick={() => toggleSave("archive_pastry_" + index, "🥐", "Pastry (" + digest.date + ")", "Gem of the Day", digest.pastry)}
                                            className="text-cafe-text-secondary/60 hover:text-cafe-accent transition cursor-pointer p-0.5 rounded"
                                        >
                                            {isSaved("archive_pastry_" + index) ? "★" : "☆"}
                                        </button>
                                    </div>
                                    <p className="text-cafe-text-secondary text-xs leading-relaxed">{digest.pastry}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Dashboard 4: AI Trends
const AITrendsDashboard = () => {
    return (
        <div className="flex flex-col gap-8 animate-fadeIn">
            <div>
                <h2 className="text-3xl font-serif font-medium text-cafe-text-primary mb-2">AI & Research Trends</h2>
                <p className="text-cafe-text-secondary text-sm font-sans max-w-xl">Weekly popularity indexes of key open source technologies and paper counts.</p>
            </div>
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-cafe-bg-card backdrop-blur-md border border-cafe-border rounded-2xl p-6 flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-cafe-text-secondary/60 tracking-wider font-sans uppercase">GitHub Active Repos</span>
                    <span className="text-3xl font-serif text-cafe-text-primary font-medium">12.4k <span className="text-xs text-emerald-500 font-sans font-bold block mt-1">+18% this wk</span></span>
                </div>
                <div className="bg-cafe-bg-card backdrop-blur-md border border-cafe-border rounded-2xl p-6 flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-cafe-text-secondary/60 tracking-wider font-sans uppercase">ArXiv AI Papers</span>
                    <span className="text-3xl font-serif text-cafe-text-primary font-medium">2,384 <span className="text-xs text-emerald-500 font-sans font-bold block mt-1">+8% this wk</span></span>
                </div>
                <div className="bg-cafe-bg-card backdrop-blur-md border border-cafe-border rounded-2xl p-6 flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-cafe-text-secondary/60 tracking-wider font-sans uppercase">Preprint Citations</span>
                    <span className="text-3xl font-serif text-cafe-text-primary font-medium">45.2k <span className="text-xs text-emerald-500 font-sans font-bold block mt-1">+24% this wk</span></span>
                </div>
            </div>

            {/* Popularity bar chart card */}
            <div className="bg-cafe-bg-card backdrop-blur-md border border-cafe-border rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-sans font-bold text-cafe-text-primary mb-6">Technology Popularity Index</h3>
                <div className="flex flex-col gap-5">
                    <BarRow label="PyTorch / Deep Learning" percentage={92} colorClass="bg-red-500/80" />
                    <BarRow label="Transformers / LLMs" percentage={88} colorClass="bg-cafe-accent/80" />
                    <BarRow label="Next.js / Frontend Framework" percentage={86} colorClass="bg-sky-500/80" />
                    <BarRow label="Tailwind CSS / Styling" percentage={84} colorClass="bg-teal-500/80" />
                    <BarRow label="FastAPI / Python Services" percentage={78} colorClass="bg-emerald-500/80" />
                </div>
            </div>
        </div>
    );
};

// Dashboard 5: Statistics
const StatisticsDashboard = () => {
    const stats = [
        { label: "Articles collected", count: "1,482", icon: "📄", desc: "Total articles scraped across engineering websites." },
        { label: "GitHub repos scanned", count: "943", icon: "💻", desc: "Trending repositories analyzed for engineering news." },
        { label: "ArXiv papers analyzed", count: "624", icon: "📚", desc: "AI and machine learning preprints parsed." },
        { label: "AI summaries generated", count: "1,280", icon: "🤖", desc: "Unique daily roasts and brief summaries generated." },
        { label: "Daily active users", count: "312", icon: "👥", desc: "Active readers currently using personal.cafe." }
    ];

    return (
        <div className="flex flex-col gap-8 animate-fadeIn">
            <div>
                <h2 className="text-3xl font-serif font-medium text-cafe-text-primary mb-2">Platform Statistics</h2>
                <p className="text-cafe-text-secondary text-sm font-sans max-w-xl">A complete overview of personal.cafe processing metrics and active platform usage.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div 
                        key={idx} 
                        className="relative overflow-hidden bg-cafe-bg-card backdrop-blur-md border border-cafe-border rounded-2xl p-6 hover:border-cafe-border-hover transition-all duration-300 flex flex-col justify-between min-h-[160px]"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-cafe-text-secondary/70 text-xs font-bold font-sans tracking-wide uppercase max-w-[70%]">{stat.label}</span>
                            <span className="text-2xl p-2 bg-cafe-bg-secondary/60 border border-cafe-border/55 rounded-xl leading-none">{stat.icon}</span>
                        </div>
                        <div>
                            <span className="text-4xl font-serif text-cafe-text-primary font-medium block mb-2">{stat.count}</span>
                            <span className="text-[12px] text-cafe-text-secondary leading-relaxed font-sans">{stat.desc}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Dashboard 6: Pipeline Monitor
const PipelineDashboard = () => {
    const services = [
        { name: "GitHub Ingestion Fetcher", status: "ONLINE", icon: "💻", time: "Sync 5m ago" },
        { name: "ArXiv Preprint Scraper", status: "ONLINE", icon: "📚", time: "Sync 1h ago" },
        { name: "RSS Feed Digest Aggregator", status: "ONLINE", icon: "📰", time: "Sync 15m ago" },
        { name: "AI Summary Processing Pipeline", status: "ONLINE", icon: "🤖", time: "Idle" },
        { name: "FastAPI Backend Server Gateway", status: "ONLINE", icon: "⚡", time: "Uptime 12d" },
        { name: "PostgreSQL Database Cluster", status: "ONLINE", icon: "🗄️", time: "Load 8%" }
    ];

    return (
        <div className="flex flex-col gap-8 animate-fadeIn">
            <div>
                <h2 className="text-3xl font-serif font-medium text-cafe-text-primary mb-2">System Ingestion & Pipeline Monitor</h2>
                <p className="text-cafe-text-secondary text-sm font-sans max-w-xl">Real-time status check of active content parsers, databases, and summarization pipelines.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 bg-cafe-bg-card backdrop-blur-md border border-cafe-border rounded-2xl hover:border-cafe-border-hover transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl p-2.5 bg-cafe-bg-secondary border border-cafe-border/50 rounded-xl leading-none">{service.icon}</span>
                            <div className="flex flex-col gap-1">
                                <h4 className="text-[15px] font-sans font-bold text-cafe-text-primary">{service.name}</h4>
                                <span className="text-xs text-cafe-text-secondary/70 font-sans">{service.time}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
                            <span className="text-xs text-emerald-400 font-bold tracking-widest font-sans">{service.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Dashboard 7: User Profile
const UserProfileDashboard = ({ user, savedCount }: { user: any; savedCount: number }) => {
    const profileStats = [
        { label: "Reading Streak", value: "5 Days", sub: "Keep it up!" },
        { label: "Digests Read", value: "24", sub: "Since May 2026" },
        { label: "Saved Articles", value: savedCount.toString(), sub: "In your bookmarks" },
        { label: "Avg. Daily Roast time", value: "3m 45s", sub: "Avg. reading time" }
    ];

    return (
        <div className="flex flex-col gap-8 animate-fadeIn font-sans">
            <div>
                <h2 className="text-3xl font-serif font-medium text-cafe-text-primary mb-2">User Profile</h2>
                <p className="text-cafe-text-secondary text-sm font-sans max-w-xl">Track your personal reading activity and account credentials.</p>
            </div>

            {/* Profile cards stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {profileStats.map((stat, idx) => (
                    <div key={idx} className="bg-cafe-bg-card backdrop-blur-md border border-cafe-border rounded-2xl p-5 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-cafe-text-secondary/60 tracking-wider uppercase font-sans">{stat.label}</span>
                        <span className="text-2xl font-serif text-cafe-text-primary font-medium mt-1">{stat.value}</span>
                        <span className="text-[11px] text-cafe-text-secondary mt-1 font-sans">{stat.sub}</span>
                    </div>
                ))}
            </div>

            {/* Account Card details */}
            <div className="bg-cafe-bg-card backdrop-blur-md border border-cafe-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || "User"} className="w-16 h-16 rounded-full border border-cafe-border shadow-lg" />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-cafe-bg-secondary border border-cafe-border flex items-center justify-center text-2xl font-sans text-cafe-text-secondary">👤</div>
                    )}
                    <div className="flex flex-col gap-1">
                        <h4 className="text-lg font-bold text-cafe-text-primary font-sans">{user?.displayName || "Guest User"}</h4>
                        <span className="text-sm text-cafe-text-secondary font-sans">{user?.email || "guest@personal.cafe"}</span>
                        <span className="text-[10px] font-semibold text-cafe-text-secondary/60 uppercase tracking-widest font-sans mt-1">
                            Account Level: {user ? "Google Verified" : "Guest Mode"}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                    <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                        <span className="bg-cafe-bg-secondary border border-cafe-border px-3.5 py-1.5 rounded-full text-xs text-cafe-text-secondary font-sans tracking-wide">
                            ML & AI News
                        </span>
                        <span className="bg-cafe-bg-secondary border border-cafe-border px-3.5 py-1.5 rounded-full text-xs text-cafe-text-secondary font-sans tracking-wide">
                            Web Tools
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Dashboard 8: Settings
const SettingsDashboard = ({ preferences, setPreferences }: { preferences: any; setPreferences: any }) => {
    const togglePref = (key: string) => {
        setPreferences((prev: any) => ({
            ...prev,
            [key]: !prev[key as keyof typeof prev]
        }));
    };

    return (
        <div className="flex flex-col gap-8 animate-fadeIn font-sans">
            <div>
                <h2 className="text-3xl font-serif font-medium text-cafe-text-primary mb-2">Application Settings</h2>
                <p className="text-cafe-text-secondary text-sm font-sans max-w-xl">Manage display modes, delivery schedules, and notifications preferences.</p>
            </div>

            <div className="bg-cafe-bg-card backdrop-blur-md border border-cafe-border rounded-2xl p-6 md:p-8 flex flex-col gap-6">
                
                {/* Dark Mode toggle */}
                <div className="flex items-center justify-between pb-6 border-b border-cafe-border/40">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-bold text-cafe-text-primary">Dark Mode Theme</h4>
                        <span className="text-xs text-cafe-text-secondary">Manage global dark-mode coffeehouse theme display.</span>
                    </div>
                    <button 
                        onClick={() => togglePref("darkMode")}
                        className={`w-11 h-6 rounded-full transition-colors relative duration-200 cursor-pointer ${
                            preferences.darkMode ? "bg-cafe-accent" : "bg-cafe-bg-secondary border border-cafe-border"
                        }`}
                    >
                        <span className={`w-4 h-4 rounded-full bg-cafe-bg-primary absolute top-1 transition-all duration-200 ${
                            preferences.darkMode ? "left-6" : "left-1"
                        }`}></span>
                    </button>
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between pb-6 border-b border-cafe-border/40">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-bold text-cafe-text-primary">Daily Email Digest</h4>
                        <span className="text-xs text-cafe-text-secondary">Receive a copy of your daily engineering roast in your inbox.</span>
                    </div>
                    <button 
                        onClick={() => togglePref("emailNotifications")}
                        className={`w-11 h-6 rounded-full transition-colors relative duration-200 cursor-pointer ${
                            preferences.emailNotifications ? "bg-cafe-accent" : "bg-cafe-bg-secondary border border-cafe-border"
                        }`}
                    >
                        <span className={`w-4 h-4 rounded-full bg-cafe-bg-primary absolute top-1 transition-all duration-200 ${
                            preferences.emailNotifications ? "left-6" : "left-1"
                        }`}></span>
                    </button>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between pb-6 border-b border-cafe-border/40">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-bold text-cafe-text-primary">Desktop Push Notifications</h4>
                        <span className="text-xs text-cafe-text-secondary">Receive immediate notifications on browser active syncs.</span>
                    </div>
                    <button 
                        onClick={() => togglePref("pushNotifications")}
                        className={`w-11 h-6 rounded-full transition-colors relative duration-200 cursor-pointer ${
                            preferences.pushNotifications ? "bg-cafe-accent" : "bg-cafe-bg-secondary border border-cafe-border"
                        }`}
                    >
                        <span className={`w-4 h-4 rounded-full bg-cafe-bg-primary absolute top-1 transition-all duration-200 ${
                            preferences.pushNotifications ? "left-6" : "left-1"
                        }`}></span>
                    </button>
                </div>

                {/* Digest Time Delivery */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-cafe-border/40 gap-4">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-bold text-cafe-text-primary">Daily Delivery Schedule</h4>
                        <span className="text-xs text-cafe-text-secondary">Configure what time of day your fresh roast is brewed.</span>
                    </div>
                    <select 
                        value={preferences.deliveryTime}
                        onChange={(e) => setPreferences((prev: any) => ({ ...prev, deliveryTime: e.target.value }))}
                        className="bg-cafe-bg-secondary border border-cafe-border rounded-lg px-4 py-2.5 text-xs text-cafe-text-secondary outline-none focus:border-cafe-accent cursor-pointer w-full sm:w-auto"
                    >
                        <option value="06:00 AM">06:00 AM</option>
                        <option value="08:00 AM">08:00 AM (Recommended)</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                    </select>
                </div>

                {/* Language Select */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-bold text-cafe-text-primary">Language Selection</h4>
                        <span className="text-xs text-cafe-text-secondary">Set primary language translation for preprints and summaries.</span>
                    </div>
                    <select 
                        value={preferences.language}
                        onChange={(e) => setPreferences((prev: any) => ({ ...prev, language: e.target.value }))}
                        className="bg-cafe-bg-secondary border border-cafe-border rounded-lg px-4 py-2.5 text-xs text-cafe-text-secondary outline-none focus:border-cafe-accent cursor-pointer w-full sm:w-auto"
                    >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Japanese">Japanese</option>
                        <option value="German">German</option>
                    </select>
                </div>

            </div>
        </div>
    );
};

export default function Home() {
    const { user, isGuest, loading, logout } = useAuth();
    const [digest, setDigest] = useState(fallback);
    const [isBrewing, setIsBrewing] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Extended states for premium dashboards
    const [activeDashboard, setActiveDashboard] = useState("roast");
    const [scrollTarget, setScrollTarget] = useState<string | null>("espresso");
    const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);

    // Lifted preferences state with local storage persistence
    const [preferences, setPreferences] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("personal-cafe-prefs");
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {}
            }
        }
        return {
            darkMode: false,
            emailNotifications: true,
            pushNotifications: false,
            deliveryTime: "08:00 AM",
            language: "English"
        };
    });

    useEffect(() => {
        localStorage.setItem("personal-cafe-prefs", JSON.stringify(preferences));
    }, [preferences]);

    useEffect(() => {
        async function loadDigest() {
            try {
                const res = await fetch("https://your-api.com/digest", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    setDigest(data);
                }
            } catch (err) {
            }
        }
        if (user || isGuest) {
            loadDigest();
        }
    }, [user, isGuest]);

    useEffect(() => {
        if (scrollTarget && activeDashboard === "roast") {
            const timer = setTimeout(() => {
                const element = document.getElementById(scrollTarget);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [activeDashboard, scrollTarget]);

    const handleBrewNew = () => {
        setIsBrewing(true);
        setTimeout(() => {
            setIsBrewing(false);
            setDigest({
                espresso: "Anthropic has released Claude 3.5 Sonnet, establishing a new industry benchmark for coding and reasoning tasks. Dev tools are integrating it dynamically into agent workspaces. Teams report up to 2x speedups in code generation.",
                coldbrew: "We are observing a massive trend where software engineering shifts from manual syntax composition to high-level orchestration of AI systems. Understanding Model Context Protocol (MCP) is key to building context-aware applications.",
                pastry: "Lucide Icons - A beautiful, open-source icon set that has become the industry standard for modern web apps. Perfect for clean, minimalist UIs like the one you're looking at right now."
            });
        }, 1500);
    };

    const handleNav = (dashboard: string, targetId?: string) => {
        setActiveDashboard(dashboard);
        setMobileMenuOpen(false);
        if (targetId) {
            setScrollTarget(targetId);
            if (dashboard === "roast" && activeDashboard === "roast") {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
        } else {
            setScrollTarget(null);
        }
    };

    const toggleSave = (id: string, emoji: string, title: string, subtitle: string, content: string) => {
        setSavedArticles(prev => {
            const exists = prev.find(item => item.id === id);
            if (exists) {
                return prev.filter(item => item.id !== id);
            } else {
                return [...prev, { id, emoji, title, subtitle, content }];
            }
        });
    };

    const isSaved = (id: string) => savedArticles.some(item => item.id === id);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-cafe-bg-primary text-cafe-text-primary">
                <svg className="animate-spin h-8 w-8 text-cafe-accent" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="mt-4 text-cafe-text-secondary text-sm font-sans animate-pulse">Brewing your digest...</p>
            </div>
        );
    }

    if (!user && !isGuest) {
        return <LoginScreen />;
    }

    return (
        <div 
            data-theme={preferences.darkMode ? "espresso" : "latte"}
            className="min-h-screen bg-cafe-bg-primary text-cafe-text-primary flex flex-col md:flex-row font-sans relative overflow-hidden noise-bg"
        >
            <SunlightBeams />
            <SideAnimations />
            
            <header className="md:hidden flex justify-between items-center bg-cafe-bg-sidebar/80 backdrop-blur-md border-b border-cafe-border/50 px-6 py-4 sticky top-0 z-40 relative">
                <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-cafe-text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
                    </svg>
                    <span className="font-serif text-lg text-cafe-text-primary">personal.cafe</span>
                </div>
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-1.5 bg-cafe-bg-secondary border border-cafe-border rounded-lg text-cafe-text-secondary"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </header>

            <aside className={`
                ${mobileMenuOpen ? "flex" : "hidden"} 
                md:flex flex-col justify-between 
                w-full md:w-64 bg-cafe-bg-sidebar/80 backdrop-blur-md border-r border-cafe-border/60 
                fixed md:sticky top-[61px] md:top-0 h-[calc(100vh-61px)] md:h-screen 
                z-30 p-6 shrink-0 transition-all duration-300 relative
            `}>
                <div className="flex flex-col h-[calc(100%-80px)] overflow-hidden">
                    <div className="mb-6 hidden md:block shrink-0">
                        <h2 className="text-xl font-serif font-medium text-cafe-text-primary mb-1">The Daily Roast</h2>
                        <span className="text-[11px] text-cafe-text-secondary/70 uppercase tracking-widest font-sans font-semibold">AI Digest for Engineers</span>
                    </div>

                    <nav className="flex flex-col gap-1 overflow-y-auto pr-1 shrink-1 scrollbar-thin">
                        <button
                            onClick={() => handleNav("roast", "espresso")}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[13px] font-medium transition duration-200 cursor-pointer shrink-0 ${
                                activeDashboard === "roast" && scrollTarget === "espresso"
                                    ? "bg-cafe-bg-secondary text-cafe-text-primary border border-cafe-border" 
                                    : "text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-secondary/40"
                            }`}
                        >
                            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
                                <line x1="6" y1="2" x2="6" y2="4" />
                                <line x1="10" y1="2" x2="10" y2="4" />
                                <line x1="14" y1="2" x2="14" y2="4" />
                            </svg>
                            Daily Roast
                        </button>

                        <button
                            onClick={() => handleNav("roast", "coldbrew")}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[13px] font-medium transition duration-200 cursor-pointer shrink-0 ${
                                activeDashboard === "roast" && scrollTarget === "coldbrew"
                                    ? "bg-cafe-bg-secondary text-cafe-text-primary border border-cafe-border" 
                                    : "text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-secondary/40"
                            }`}
                        >
                            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 3h12" />
                                <path d="M8 3v4.5L4.5 17A2 2 0 0 0 6 20h12a2 2 0 0 0 1.5-3L16 7.5V3" />
                                <path d="M6 14h12" />
                            </svg>
                            Cold Brews
                        </button>

                        <button
                            onClick={() => handleNav("roast", "pastry")}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[13px] font-medium transition duration-200 cursor-pointer shrink-0 ${
                                activeDashboard === "roast" && scrollTarget === "pastry"
                                    ? "bg-cafe-bg-secondary text-cafe-text-primary border border-cafe-border" 
                                    : "text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-secondary/40"
                            }`}
                        >
                            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                            Daily Pastries
                        </button>

                        <button
                            onClick={() => handleNav("trending")}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[13px] font-medium transition duration-200 cursor-pointer shrink-0 ${
                                activeDashboard === "trending" 
                                    ? "bg-cafe-bg-secondary text-cafe-text-primary border border-cafe-border" 
                                    : "text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-secondary/40"
                            }`}
                        >
                            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                            </svg>
                            Trending
                        </button>

                        <button
                            onClick={() => handleNav("saved")}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[13px] font-medium transition duration-200 cursor-pointer shrink-0 ${
                                activeDashboard === "saved" 
                                    ? "bg-cafe-bg-secondary text-cafe-text-primary border border-cafe-border" 
                                    : "text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-secondary/40"
                            }`}
                        >
                            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            Saved
                        </button>

                        <button
                            onClick={() => handleNav("archives")}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[13px] font-medium transition duration-200 cursor-pointer shrink-0 ${
                                activeDashboard === "archives" 
                                    ? "bg-cafe-bg-secondary text-cafe-text-primary border border-cafe-border" 
                                    : "text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-secondary/40"
                            }`}
                        >
                            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="21 8 21 21 3 21 3 8" />
                                <rect x="1" y="3" width="22" height="5" />
                                <line x1="10" y1="12" x2="14" y2="12" />
                            </svg>
                            Archives
                        </button>

                        <button
                            onClick={() => handleNav("trends")}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[13px] font-medium transition duration-200 cursor-pointer shrink-0 ${
                                activeDashboard === "trends" 
                                    ? "bg-cafe-bg-secondary text-cafe-text-primary border border-cafe-border" 
                                    : "text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-secondary/40"
                            }`}
                        >
                            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                <polyline points="16 7 22 7 22 13" />
                            </svg>
                            AI Trends
                        </button>

                        <button
                            onClick={() => handleNav("stats")}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[13px] font-medium transition duration-200 cursor-pointer shrink-0 ${
                                activeDashboard === "stats" 
                                    ? "bg-cafe-bg-secondary text-cafe-text-primary border border-cafe-border" 
                                    : "text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-secondary/40"
                            }`}
                        >
                            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10" />
                                <line x1="12" y1="20" x2="12" y2="4" />
                                <line x1="6" y1="20" x2="6" y2="14" />
                            </svg>
                            Statistics
                        </button>

                        <button
                            onClick={() => handleNav("pipeline")}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[13px] font-medium transition duration-200 cursor-pointer shrink-0 ${
                                activeDashboard === "pipeline" 
                                    ? "bg-cafe-bg-secondary text-cafe-text-primary border border-cafe-border" 
                                    : "text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-secondary/40"
                            }`}
                        >
                            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M14 2s-3 3-3 8c0 2.5 1.5 4.5 3.5 5.5.5.5.5 1.5 0 2l-3 3h8l-3-3c-.5-.5-.5-1.5 0-2 2-1 3.5-3 3.5-5.5 0-5-3-8-3-8z" />
                                <path d="M9 15l-3-3" />
                                <path d="M15 9l3-3" />
                            </svg>
                            Pipeline
                        </button>

                        <button
                            onClick={() => handleNav("profile")}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[13px] font-medium transition duration-200 cursor-pointer shrink-0 ${
                                activeDashboard === "profile" 
                                    ? "bg-cafe-bg-secondary text-cafe-text-primary border border-cafe-border" 
                                    : "text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-secondary/40"
                            }`}
                        >
                            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Profile
                        </button>

                        <button
                            onClick={() => handleNav("settings")}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[13px] font-medium transition duration-200 cursor-pointer shrink-0 ${
                                activeDashboard === "settings" 
                                    ? "bg-cafe-bg-secondary text-cafe-text-primary border border-cafe-border" 
                                    : "text-cafe-text-secondary hover:text-cafe-text-primary hover:bg-cafe-bg-secondary/40"
                            }`}
                        >
                            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                            Settings
                        </button>
                    </nav>
                </div>
 
                <div className="flex flex-col gap-4 mt-4 shrink-0 relative z-10">
                    <button
                        onClick={handleBrewNew}
                        disabled={isBrewing}
                        className="w-full bg-cafe-accent hover:bg-cafe-accent-hover text-cafe-bg-sidebar font-sans font-bold text-[13px] py-3.5 px-4 rounded-xl tracking-wider uppercase transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow shrink-0"
                    >
                        {isBrewing ? "BREWING..." : "BREW NEW DIGEST"}
                    </button>
                </div>
            </aside>

            <div className="flex-1 p-6 md:p-12 max-w-6xl mx-auto overflow-y-auto relative z-10">
                <header className="flex justify-between items-center border-b border-cafe-border/50 pb-6 mb-10 text-sans shrink-0">
                    <div className="flex items-center gap-2.5">
                        <svg className="w-5 h-5 text-cafe-text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
                        </svg>
                        <span className="font-serif text-[22px] tracking-tight text-cafe-text-primary">personal.cafe</span>
                    </div>

                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex gap-6 text-[14px]">
                            <button onClick={() => handleNav("roast", "espresso")} className="text-cafe-text-primary hover:text-cafe-accent transition cursor-pointer">Daily Roast</button>
                            <button onClick={() => handleNav("archives")} className="text-cafe-text-secondary hover:text-cafe-text-primary transition cursor-pointer">Archives</button>
                        </nav>
                        
                        <div className="flex items-center gap-4">
                            {user?.photoURL ? (
                                <img 
                                    src={user.photoURL} 
                                    alt={user.displayName || "User"} 
                                    className="w-8 h-8 rounded-full border border-cafe-border shadow"
                                />
                            ) : isGuest ? (
                                <span className="text-[11px] text-cafe-text-secondary bg-cafe-bg-secondary border border-cafe-border px-3 py-1.5 rounded-lg font-sans">
                                    Guest Mode
                                </span>
                            ) : null}
                            <button 
                                onClick={logout}
                                className="bg-cafe-bg-secondary border border-cafe-border hover:bg-cafe-bg-secondary/75 hover:border-cafe-border-hover px-4 py-2 rounded-xl text-xs text-cafe-text-secondary hover:text-cafe-text-primary font-medium transition duration-200 cursor-pointer"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </header>

                {activeDashboard === "roast" && (
                    <div className="animate-fadeIn">
                        <div className="mb-12">
                            <div className="flex items-center gap-2 text-cafe-accent text-xs font-semibold tracking-wider uppercase mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-cafe-accent animate-pulse"></span>
                                BREWING NOW
                            </div>
                            <h2 className="text-4.5xl md:text-5.5xl font-serif font-medium text-cafe-text-primary leading-tight mb-4">
                                Engineering news, served <span className="italic underline decoration-cafe-accent decoration-1 underline-offset-8">fresh.</span>
                            </h2>
                            <p className="text-cafe-text-secondary text-base md:text-lg max-w-2xl font-sans leading-relaxed">
                                Your personal AI barista brewing the internet's most important engineering news.
                            </p>
                        </div>

                        <div className="flex flex-col gap-8">
                            <div 
                                id="espresso" 
                                className="group relative bg-cafe-bg-card backdrop-blur-md border border-cafe-border rounded-2xl p-6 md:p-8 hover:border-cafe-border-hover transition-all duration-300"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-cafe-accent rounded-l-2xl"></div>
                                
                                <div className="flex-1 pl-2">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-xl">☕</span>
                                            <h3 className="text-[17px] font-bold font-sans text-cafe-text-primary">Espresso Shot: The 3-Sentence Brief</h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-sans font-bold tracking-wider text-cafe-text-secondary border border-cafe-border px-2 py-0.5 rounded bg-cafe-bg-secondary/50">
                                                2 MIN READ
                                            </span>
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleSave("espresso", "☕", "Espresso Shot", "The 3-Sentence Brief", digest.espresso);
                                                }}
                                                className="text-cafe-text-secondary/75 hover:text-cafe-accent transition cursor-pointer p-1 rounded hover:bg-cafe-bg-secondary/40"
                                                title="Save article"
                                            >
                                                {isSaved("espresso") ? (
                                                    <svg className="w-4.5 h-4.5 text-cafe-accent fill-current" viewBox="0 0 24 24">
                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <p className="text-cafe-text-secondary leading-relaxed font-sans mb-4 text-[15px]">
                                        {digest.espresso}
                                    </p>
                                    
                                    <a href="#" className="inline-flex items-center gap-1.5 text-xs font-bold text-cafe-text-secondary/80 hover:text-cafe-accent transition-colors tracking-wider">
                                        DEEPEN THE SHOT <span className="text-sm">→</span>
                                    </a>
                                </div>
                            </div>

                            <div 
                                id="coldbrew" 
                                className="group relative overflow-hidden bg-cafe-bg-card backdrop-blur-md border border-cafe-border rounded-2xl p-6 md:p-8 hover:border-cafe-border-hover transition-all duration-300"
                            >
                                <BeakerIcon />
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-lg">❄️</span>
                                            <span className="text-lg">🧊</span>
                                            <h3 className="text-[15px] font-semibold font-sans text-cafe-accent uppercase tracking-wider">Cold Brew: The Deep Dive</h3>
                                        </div>
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleSave("coldbrew", "🧊", "Cold Brew: Large Language Models as Optimizers", "The Deep Dive", digest.coldbrew);
                                            }}
                                            className="text-cafe-text-secondary/75 hover:text-cafe-accent transition cursor-pointer p-1 rounded hover:bg-cafe-bg-secondary/45"
                                            title="Save article"
                                        >
                                            {isSaved("coldbrew") ? (
                                                <svg className="w-4.5 h-4.5 text-cafe-accent fill-current" viewBox="0 0 24 24">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                                </svg>
                                            ) : (
                                                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    
                                    <h4 className="text-2xl font-serif text-cafe-text-primary font-medium mb-3">
                                        Large Language Models as Optimizers (OPRO)
                                    </h4>
                                    
                                    <p className="text-cafe-text-secondary leading-relaxed font-sans mb-6 max-w-3xl text-[15px]">
                                        {digest.coldbrew}
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-cafe-border/40">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[10px] font-sans font-bold tracking-widest text-cafe-text-secondary/50">OBSERVATION</span>
                                            <span className="text-[14px] font-sans text-cafe-text-secondary">Iteration cycles reduced by 80%.</span>
                                        </div>
                                        <div className="flex md:border-l md:border-cafe-border/50 md:pl-6 flex flex-col gap-1.5">
                                            <span className="text-[10px] font-sans font-bold tracking-widest text-cafe-text-secondary/50">POTENTIAL</span>
                                            <span className="text-[14px] font-sans text-cafe-text-secondary">Self-improving prompt pipelines.</span>
                                        </div>
                                    </div>

                                    <button className="mt-6 bg-cafe-accent hover:bg-cafe-accent-hover text-cafe-bg-sidebar font-sans font-semibold text-[11px] tracking-wider py-2.5 px-4 rounded-lg uppercase transition-all duration-200 active:scale-[0.98] cursor-pointer">
                                        VIEW FULL RESEARCH
                                    </button>
                                </div>
                            </div>

                            <div 
                                id="pastry" 
                                className="group bg-cafe-bg-card backdrop-blur-md border border-cafe-border rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 hover:border-cafe-border-hover transition-all duration-300"
                            >
                                <div className="w-full lg:w-[42%] shrink-0">
                                    <BrowserMockup />
                                </div>
                                
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-lg">🍽️</span>
                                                <span className="text-lg">🥐</span>
                                                <h3 className="text-[15px] font-semibold font-sans text-cafe-accent uppercase tracking-wider">Daily Pastry: The Gem of the Day</h3>
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleSave("pastry", "🥐", "Daily Pastry: Lucide Icons", "Gem of the Day", digest.pastry);
                                                }}
                                                className="text-cafe-text-secondary/75 hover:text-cafe-accent transition cursor-pointer p-1 rounded hover:bg-cafe-bg-secondary/40"
                                                title="Save article"
                                            >
                                                {isSaved("pastry") ? (
                                                    <svg className="w-4.5 h-4.5 text-cafe-accent fill-current" viewBox="0 0 24 24">
                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        
                                        <h4 className="text-2xl font-serif text-cafe-text-primary font-medium mb-3">
                                            Lucide Icons
                                        </h4>
                                        
                                        <p className="text-cafe-text-secondary leading-relaxed font-sans mb-6 text-[15px]">
                                            {digest.pastry}
                                        </p>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 animate-fadeIn">
                                        <span className="bg-cafe-bg-secondary border border-cafe-border px-3.5 py-1.5 rounded-full text-[11px] text-cafe-text-secondary font-sans tracking-wide font-medium">
                                            Open Source
                                        </span>
                                        <span className="bg-cafe-bg-secondary border border-cafe-border px-3.5 py-1.5 rounded-full text-[11px] text-cafe-text-secondary font-sans tracking-wide font-medium">
                                            UI/UX
                                        </span>
                                        <span className="bg-cafe-bg-secondary border border-cafe-border px-3.5 py-1.5 rounded-full text-[11px] text-cafe-text-secondary font-sans tracking-wide font-medium">
                                            Web Tools
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-[13px] italic text-cafe-text-secondary/60 font-serif my-12">
                            Brewed fresh every 24 hours.
                        </p>
                    </div>
                )}

                {activeDashboard === "trending" && <TrendingDashboard />}
                {activeDashboard === "saved" && <SavedArticlesDashboard savedArticles={savedArticles} toggleSave={toggleSave} />}
                {activeDashboard === "archives" && <ArchivesDashboard savedArticles={savedArticles} toggleSave={toggleSave} isSaved={isSaved} />}
                {activeDashboard === "trends" && <AITrendsDashboard />}
                {activeDashboard === "stats" && <StatisticsDashboard />}
                {activeDashboard === "pipeline" && <PipelineDashboard />}
                {activeDashboard === "profile" && <UserProfileDashboard user={user} savedCount={savedArticles.length} />}
                {activeDashboard === "settings" && <SettingsDashboard preferences={preferences} setPreferences={setPreferences} />}

                <footer className="border-t border-cafe-border/50 pt-6 mt-12 flex flex-col sm:flex-row justify-between items-center text-[12px] text-cafe-text-secondary/70 gap-4 font-sans relative z-10">
                    <div>
                        <span className="font-bold tracking-wider mr-1 text-cafe-text-secondary">PERSONAL.CAFE</span>
                        <span>© 2026 personal.cafe • Automated Ingestion • Brewed with precision</span>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-cafe-text-primary transition">GitHub</a>
                        <a href="#" className="hover:text-cafe-text-primary transition">Documentation</a>
                    </div>
                </footer>
            </div>
        </div>
    );
}