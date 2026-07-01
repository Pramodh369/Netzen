import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  ArrowRight,
  Bookmark,
  LockKeyhole,
  MessageCircle,
  MoreHorizontal,
  Search,
  UploadCloud,
  Users,
  Zap,
} from "lucide-react";
import dashboardImg from "../assets/screenshots/dashboard.png";
import messagesImg from "../assets/screenshots/messages.png";
import profileImg   from "../assets/screenshots/profile.png";

gsap.registerPlugin(ScrollTrigger);

/* ─── data ─────────────────────────────────────────────────────────── */

const features = [
  {
    icon: LockKeyhole,
    title: "Secure authentication",
    description:
      "JWT-based sign in, protected routes, and account flows that don't feel bolted on.",
  },
  {
    icon: Bookmark,
    title: "Developer posts",
    description:
      "Share ideas, project notes, and technical learnings in a feed built for builders.",
  },
  {
    icon: MessageCircle,
    title: "Real-time chat",
    description:
      "Messaging architecture designed around Socket.io for live, low-latency collaboration.",
  },
  {
    icon: Users,
    title: "Developer community",
    description:
      "Discover builders, follow profiles, and grow a technical circle worth keeping.",
  },
  {
    icon: UploadCloud,
    title: "Image uploads",
    description:
      "Cloud-ready media pipeline for posts, avatars, and profile covers via Cloudinary.",
  },
  {
    icon: Search,
    title: "User search",
    description:
      "Find developers by name or username through a fast, focused discover flow.",
  },
];

const stack = [
  {
    title: "Frontend",
    items: ["React", "Redux Toolkit", "Tailwind CSS", "Vite", "Lucide Icons"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express", "MongoDB", "Mongoose", "JWT"],
  },
  {
    title: "DevOps",
    items: ["Cloudinary", "Socket.io", "REST APIs", "Env Config", "Git"],
  },
];

const showcases = [
  {
    label: "Dashboard feed",
    url: "netzen.app/feed",
    desc: "The home timeline where posts, replies, and saves live.",
    image: dashboardImg,
  },
  {
    label: "Real-time messages",
    url: "netzen.app/messages",
    desc: "Live developer chat powered by Socket.io.",
    image: messagesImg,
  },
  {
    label: "Developer profile",
    url: "netzen.app/u/pramodh_dev",
    desc: "A profile surface built around real project history.",
    image: profileImg,
  },
];

/* ─── component ─────────────────────────────────────────────────────── */

export default function Landing() {
  const heroRef      = useRef(null);
  const cursorGlow   = useRef(null);
  const progressBar  = useRef(null);
  const [loaded, setLoaded] = useState(false);

  /* loader */
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(t);
  }, []);

  /* cursor glow */
  useEffect(() => {
    const move = (e) => {
      if (!cursorGlow.current) return;
      gsap.to(cursorGlow.current, {
        x: e.clientX - 200,
        y: e.clientY - 200,
        duration: 0.6,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* scroll progress bar */
  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const pct = (scrollTop / (scrollHeight - clientHeight)) * 100;
      if (progressBar.current) progressBar.current.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  /* GSAP + AOS */
  useEffect(() => {
    if (!loaded) return;

    AOS.init({ duration: 750, easing: "ease-out-cubic", once: true, offset: 50 });

    const ctx = gsap.context(() => {
      /* hero entrance */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-title-line", { opacity: 0, y: 32, duration: 0.85, stagger: 0.13 })
        .from(".hero-sub",  { opacity: 0, y: 20, duration: 0.7 }, "-=0.5")
        .from(".hero-cta",  { opacity: 0, y: 20, duration: 0.7 }, "-=0.45")
        .from(".hero-panel",{ opacity: 0, x: 40, duration: 0.9  }, "-=0.6");

      /* float chips */
      gsap.to(".float-card", {
        y: -10,
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.35,
      });

      /* features grid — stagger reveal */
      gsap.from(".feature-card", {
        opacity: 0,
        y: 36,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#features",
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      /* stack badges slide-in */
      gsap.from(".stack-group", {
        opacity: 0,
        y: 28,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#stack",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      /* CTA scale */
      gsap.from(".cta-panel", {
        opacity: 0,
        scale: 0.96,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cta-panel",
          start: "top 86%",
          toggleActions: "play none none reverse",
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [loaded]);

  return (
    <>
      {/* ── page loader ── */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-indigo-200">
                <Zap className="h-5 w-5 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-2xl font-black tracking-tight text-slate-800">
                net<span className="text-indigo-600">zen</span>
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── scroll progress bar ── */}
      <div className="fixed top-0 left-0 z-[60] h-[2px] w-full bg-transparent">
        <div
          ref={progressBar}
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-[width] duration-75"
          style={{ width: "0%" }}
        />
      </div>

      {/* ── cursor glow (desktop only) ── */}
      <div
        ref={cursorGlow}
        aria-hidden
        className="pointer-events-none fixed z-0 hidden h-[400px] w-[400px] rounded-full bg-indigo-400/10 blur-3xl lg:block"
      />

      <div ref={heroRef} className="relative min-h-screen scroll-smooth bg-slate-50 text-slate-800">

        {/* ── NAV ── */}
        <header className="sticky top-[2px] z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-indigo-200">
                <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-xl font-black tracking-tight text-slate-800">
                net<span className="text-indigo-600">zen</span>
              </span>
            </a>

            <div className="hidden items-center gap-6 text-sm font-semibold text-slate-500 md:flex">
              <a href="#features"    className="transition-colors hover:text-indigo-600">Features</a>
              <a href="#stack"       className="transition-colors hover:text-indigo-600">Stack</a>
              <a href="#screenshots" className="transition-colors hover:text-indigo-600">Product</a>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Sign In
              </Link>
              <motion.div whileTap={{ scale: 0.96 }}>
                <Link
                  to="/register"
                  className="rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-indigo-300"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </nav>
        </header>

        <main id="top">

          {/* ── HERO ── */}
          <section className="relative overflow-hidden bg-white">
            <div
              aria-hidden
              className="hero-glow pointer-events-none absolute -top-32 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/55 via-blue-200/35 to-transparent blur-3xl"
            />

            <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">

              {/* left */}
              <div>
                <h1 className="max-w-3xl text-4xl font-black leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  <span className="hero-title-line block">Connect, share, and build</span>
                  <span className="hero-title-line block">
                    with developers who are{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      shipping.
                    </span>
                  </span>
                </h1>

                <p className="hero-sub mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
                  Netzen is a focused social platform for developers — profiles, posts,
                  discovery, and media uploads today, with real-time collaboration built
                  into the architecture from day one.
                </p>

                <div className="hero-cta mt-9 flex flex-col gap-3 sm:flex-row">
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/register"
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200/60 transition hover:-translate-y-0.5 hover:from-blue-400 hover:to-indigo-500 hover:shadow-xl hover:shadow-indigo-200/80"
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                    </Link>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-700 hover:shadow-md"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* right — hero browser panel */}
              <div className="hero-panel relative">
                {/* floating chip 1 */}
                <div className="float-card absolute -left-6 top-6 z-10 hidden rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-xl shadow-indigo-100/60 lg:block">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">@arjun.codes</p>
                      <p className="text-[11px] text-slate-400">followed you</p>
                    </div>
                  </div>
                </div>

                {/* floating chip 2 */}
                <div className="float-card absolute -right-5 bottom-10 z-10 hidden rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-xl shadow-indigo-100/60 lg:block">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <MessageCircle className="h-3.5 w-3.5 text-indigo-500" strokeWidth={2} />
                    New message
                  </div>
                </div>

                {/* browser chrome */}
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-900 shadow-2xl shadow-indigo-200/60">
                  <div className="flex items-center gap-1.5 border-b border-slate-800 bg-slate-900 px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                    <span className="ml-3 truncate rounded-md bg-slate-800 px-3 py-1 text-[11px] font-medium text-slate-400">
                      netzen.app/feed
                    </span>
                  </div>
                  <div className="bg-white p-4">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500" />
                          <div>
                            <p className="text-sm font-bold text-slate-800">Pramodh</p>
                            <p className="text-xs text-slate-400">@pramodh_dev · 2h</p>
                          </div>
                        </div>
                        <MoreHorizontal className="h-4 w-4 text-slate-300" />
                      </div>
                      <p className="text-sm leading-6 text-slate-600">
                        Shipped JWT refresh tokens on Netzen's auth flow today —
                        sessions finally survive a hard reload. 🔐
                      </p>
                      <div className="mt-4 flex items-center gap-5 text-xs font-semibold text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Bookmark className="h-3.5 w-3.5" strokeWidth={2} /> Save
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} /> Reply
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-indigo-600 p-4 text-white">
                        <p className="text-xs font-semibold text-indigo-100">Stack</p>
                        <p className="mt-1 text-lg font-black">MERN</p>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-white p-4">
                        <p className="text-xs font-semibold text-slate-400">Realtime</p>
                        <p className="mt-1 text-lg font-black text-slate-800">Socket.io</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── FEATURES ── */}
          <section id="features" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <SectionHeading
              eyebrow="Features"
              title="Everything a developer network actually needs"
              subtitle="No filler modules — every feature ships because the product needs it."
            />
            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <motion.article
                  key={title}
                  className="feature-card group relative bg-white p-6"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all duration-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-200">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-black text-slate-800">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                </motion.article>
              ))}
            </div>
          </section>

          {/* ── STACK ── */}
          <section id="stack" className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <SectionHeading
                eyebrow="Tech stack"
                title="Built on a modern JavaScript foundation"
                subtitle="Clear boundaries across client, API, database, media, and deployment."
              />
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {stack.map((group) => (
                  <article
                    key={group.title}
                    className="stack-group rounded-2xl border border-slate-100 bg-slate-50 p-6"
                  >
                    <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">
                      {group.title}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <motion.span
                          key={item}
                          whileHover={{ y: -2, scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400, damping: 18 }}
                          className="cursor-default rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md hover:ring-indigo-200"
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ── SCREENSHOTS ── */}
          <section id="screenshots" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <SectionHeading
              eyebrow="Product"
              title="A closer look at the product"
              subtitle="Real screens from the live application."
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {showcases.map((s) => (
                <div
                  key={s.label}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/60"
                >
                  {/* browser chrome */}
                  <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                    <span className="h-2 w-2 rounded-full bg-red-300" />
                    <span className="h-2 w-2 rounded-full bg-amber-300" />
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    <span className="ml-2 truncate rounded-md bg-white px-2.5 py-1 text-[11px] font-medium text-slate-400 ring-1 ring-slate-100">
                      {s.url}
                    </span>
                  </div>

                  {/* screenshot */}
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={s.image}
                      alt={s.label}
                      loading="lazy"
                      className="h-full w-full object-contain bg-white p-2 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  </div>

                  {/* caption */}
                  <div className="px-4 py-3.5">
                    <p className="text-[13px] font-bold text-slate-700">{s.label}</p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
            <div className="cta-panel relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-8 py-16 text-center sm:px-16">
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/30 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 right-12 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"
              />
              <h2 className="relative text-3xl font-black tracking-tight text-white sm:text-4xl">
                Start building your developer profile
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-base leading-7 text-slate-300">
                Create an account, share your first post, and find developers
                working on the same problems as you.
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Create your account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                  </Link>
                </motion.div>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3 text-sm font-bold text-slate-200 transition hover:-translate-y-0.5 hover:border-slate-500 hover:text-white"
                  >
                    Sign in
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        {/* ── FOOTER ── */}
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-xs">
                <a href="#top" className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                    <Zap className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                  </span>
                  <span className="text-lg font-black tracking-tight text-slate-800">
                    net<span className="text-indigo-600">zen</span>
                  </span>
                </a>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  A modern developer social platform built for collaboration, learning, and showcasing projects.
                </p>
              </div>

              <div className="flex gap-12">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Product</p>
                  <div className="mt-3 flex flex-col gap-2 text-sm font-medium text-slate-600">
                    <a href="#features"    className="transition hover:text-indigo-600">Features</a>
                    <a href="#stack"       className="transition hover:text-indigo-600">Stack</a>
                    <a href="#screenshots" className="transition hover:text-indigo-600">Product</a>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Account</p>
                  <div className="mt-3 flex flex-col gap-2 text-sm font-medium text-slate-600">
                    <Link to="/login"    className="transition hover:text-indigo-600">Sign in</Link>
                    <Link to="/register" className="transition hover:text-indigo-600">Get started</Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} Netzen. Built with the MERN stack.
              </p>
              <a
                href="https://github.com/Pramodh369"
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
              >

                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

/* ─── helper ─────────────────────────────────────────────────────────── */

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div data-aos="fade-up" className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-slate-500">{subtitle}</p>
    </div>
  );
}