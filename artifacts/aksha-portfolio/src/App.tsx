import { useState, type FormEvent, type ReactNode } from 'react';
import { ArrowDown, ArrowUpRight, BrainCircuit, CheckCircle2, Code2, Database, ExternalLink, Github, Layers3, Linkedin, MapPin, Menu, Send, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { sendContactMessage } from '@/lib/emailjs';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const githubUrl = 'https://github.com/Aksha2886';
const linkedinUrl = 'https://www.linkedin.com/in/aksha-mirza';
const emailAddress = 'aksha.official28@gmail.com';

const navItems = [
  ['home', 'Home'],
  ['about', 'About'],
  ['skills', 'Skills'],
  ['learning', 'Certifications'],
  ['education', 'Education'],
  ['contact', 'Contact'],
];

const skills = [
  { icon: Code2, label: 'Python', note: 'Foundations & problem solving' },
  { icon: Layers3, label: 'Web technologies', note: 'Learning modern interfaces' },
  { icon: BrainCircuit, label: 'AI-assisted development', note: 'Curious, careful experimentation' },
  { icon: Database, label: 'Data science', note: 'A growing analytical practice' },
];

const certifications = [
  { title: 'Introduction to Python Programming', date: '1-Feb-2025', file: '/certificates/introduction-to-python-programming.pdf', preview: '/certificates/introduction-to-python-programming.png', mark: '01' },
  { title: 'Data Structures using Python', date: '16/07/25', file: '/certificates/data-structures-using-python.pdf', preview: '/certificates/data-structures-using-python.png', mark: '02' },
  { title: 'Data Science', date: '03/01/26', file: '/certificates/data-science.pdf', preview: '/certificates/data-science.png', mark: '03' },
  { title: 'Machine Learning', date: '25/06/26', file: '/certificates/machine-learning.pdf', preview: '/certificates/machine-learning.png', mark: '04' },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Header() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-[hsl(var(--border)/.8)] bg-[hsl(var(--background)/.9)] backdrop-blur-md">
      <div className="section-wrap flex h-[72px] items-center justify-between">
        <a href="#home" onClick={closeMenu} className="group flex items-center gap-3" aria-label="Aksha Mirza home" data-testid="link-brand">
          <span className="flex h-9 w-9 items-center justify-center rounded-[3px] bg-[hsl(var(--foreground))] font-display text-xl italic text-[hsl(var(--background))]">A</span>
          <span className="text-sm font-extrabold tracking-[-.02em]">Aksha Mirza</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {navItems.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="nav-link text-[11px] font-bold uppercase tracking-[.12em]" data-testid={`link-nav-${id}`}>{label}</a>
          ))}
        </nav>
        <a href="#contact" className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[.12em] text-[hsl(var(--secondary))] md:flex" data-testid="link-header-contact">
           Let&apos;s Talk <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <button type="button" onClick={() => setOpen(!open)} className="inline-flex rounded-sm p-2 md:hidden" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} data-testid="button-mobile-menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="section-wrap flex flex-col border-t border-[hsl(var(--border))] py-5 md:hidden" aria-label="Mobile navigation">
          {navItems.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={closeMenu} className="border-b border-[hsl(var(--border)/.65)] py-3 text-sm font-bold" data-testid={`link-mobile-nav-${id}`}>{label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}

function SectionKicker({ number, children }: { number: string; children: ReactNode }) {
  return (
    <div className="mb-10 flex items-center gap-3">
      <span className="font-mono-custom text-[11px] text-[hsl(var(--accent))]">{number}</span>
      <span className="h-px w-9 bg-[hsl(var(--accent))]" />
      <span className="eyebrow">{children}</span>
    </div>
  );
}

function Home() {
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [contactError, setContactError] = useState('');
  const handleContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get('name') ?? '').trim();
    const email = String(values.get('email') ?? '').trim();
    const subject = String(values.get('subject') ?? '').trim();
    const message = String(values.get('message') ?? '').trim();
    if (name.length < 2) {
      setContactError('Please add your name so I know who I am replying to.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setContactError('Please enter a valid email address.');
      return;
    }
    if (subject.length < 2) {
      setContactError('Please add a short subject for your note.');
      return;
    }
    if (message.length < 10) {
      setContactError('A little more context would make this note useful (10 characters minimum).');
      return;
    }

    setContactError('');
    setContactStatus('sending');

    try {
      await sendContactMessage({ name, email, subject, message });
      setContactStatus('success');
      form.reset();
    } catch (error) {
      setContactStatus('idle');
      setContactError(error instanceof Error ? error.message : 'The message could not be sent. Please try again.');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background">
      <Header />
      <main>
        <section id="home" className="relative flex min-h-[100dvh] items-end overflow-hidden pb-16 pt-32 md:pb-20">
          <div className="pointer-events-none absolute right-[-12%] top-[10%] h-[570px] w-[570px] rounded-full border border-[hsl(var(--secondary)/.22)] md:right-[-4%]" />
          <div className="pointer-events-none absolute right-[7%] top-[20%] h-[380px] w-[380px] rounded-full border border-[hsl(var(--accent)/.28)]" />
          <div className="pointer-events-none absolute right-[21%] top-[34%] h-[130px] w-[130px] rounded-full bg-[hsl(var(--accent)/.12)] blur-2xl" />
          <div className="pointer-events-none absolute right-[14%] top-[22%] z-0 hidden h-[250px] w-[250px] rotate-[-5deg] border border-[hsl(var(--border))] bg-[hsl(var(--background)/.45)] shadow-[12px_16px_0_hsl(var(--secondary)/.08)] md:block" aria-hidden="true">
            <div className="absolute inset-[18%] rotate-45 border border-[hsl(var(--secondary)/.45)]">
              <div className="absolute inset-[18%] -rotate-45 border border-[hsl(var(--accent)/.55)]" />
              <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-[hsl(var(--secondary))]" />
              <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full bg-[hsl(var(--accent))]" />
            </div>
            <span className="absolute left-[20%] top-[31%] h-2 w-2 rounded-full bg-[hsl(var(--accent)/.8)]" />
            <span className="absolute right-[19%] top-[27%] h-2 w-2 rounded-full bg-[hsl(var(--secondary)/.75)]" />
            <span className="absolute bottom-[23%] left-[29%] h-2 w-2 rounded-full bg-[hsl(var(--foreground)/.35)]" />
            <span className="absolute bottom-[19%] right-[27%] h-2 w-2 rounded-full bg-[hsl(var(--secondary)/.45)]" />
          </div>
          <div className="section-wrap relative grid w-full gap-12 md:grid-cols-[1.2fr_.8fr] md:items-end">
            <div>
              <p className="eyebrow reveal" data-testid="text-hero-kicker">Computer Science &amp; Engineering · Ahmedabad, India</p>
              <h1 className="reveal reveal-delay-1 mt-7 max-w-4xl text-balance font-display text-[clamp(4rem,12vw,9.5rem)] leading-[.87] tracking-[-.07em]">
                Building<br /><em className="text-[hsl(var(--secondary))]">toward</em><br />what&apos;s next.
              </h1>
              <p className="reveal reveal-delay-2 mt-8 max-w-xl text-base leading-7 text-[hsl(var(--muted-foreground))] md:text-lg">
                I&apos;m Aksha — a Computer Science &amp; Engineering student learning to turn curiosity into useful software, one deliberate step at a time.
              </p>
              <div className="reveal reveal-delay-3 mt-9 flex flex-wrap items-center gap-4">
                <a href="#about" className="inline-flex items-center gap-3 bg-[hsl(var(--foreground))] px-5 py-3 text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--background))] transition-transform hover:-translate-y-1" data-testid="link-hero-about">
                  Explore the journey <ArrowDown size={15} aria-hidden="true" />
                </a>
                <a href="#contact" className="inline-flex items-center gap-2 px-2 py-3 text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] underline decoration-[hsl(var(--accent))] decoration-2 underline-offset-4" data-testid="link-hero-contact">
                  Let&apos;s Connect <ArrowUpRight size={15} className="magnetic-arrow" aria-hidden="true" />
                </a>
                <div className="flex items-center gap-4 pl-2">
                  <a href={githubUrl} target="_blank" rel="noreferrer" className="text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]" aria-label="View Aksha Mirza's GitHub profile" data-testid="link-hero-github">
                    <Github size={17} aria-hidden="true" />
                  </a>
                  <a href={linkedinUrl} target="_blank" rel="noreferrer" className="text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]" aria-label="Connect with Aksha Mirza on LinkedIn" data-testid="link-hero-linkedin">
                    <Linkedin size={17} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
            <div className="reveal reveal-delay-3 flex flex-col justify-end md:pb-2">
              <div className="mb-10 ml-auto max-w-[245px] border-l-2 border-[hsl(var(--accent))] pl-5 md:mb-28">
                <p className="font-display text-2xl leading-tight">A work in progress, with a point of view.</p>
                <p className="mt-3 text-xs leading-5 text-[hsl(var(--muted-foreground))]">Early-career. Serious about the craft. Honest about the distance still to travel.</p>
              </div>
              <div className="grid max-w-[340px] grid-cols-2 gap-px border border-[hsl(var(--border))] bg-[hsl(var(--border))]">
                <div className="bg-[hsl(var(--background))] p-4"><span className="font-display text-3xl text-[hsl(var(--secondary))]">9.78</span><p className="mt-1 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Verified CGPA · Sem 4</p></div>
                <div className="bg-[hsl(var(--background))] p-4"><span className="font-display text-3xl text-[hsl(var(--accent))]">05</span><p className="mt-1 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Current semester</p></div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-24 border-t border-[hsl(var(--border))] py-24 md:py-32">
          <div className="section-wrap">
            <SectionKicker number="01">About</SectionKicker>
            <div className="grid gap-10 md:grid-cols-[.8fr_1.2fr] md:gap-20">
              <h2 className="max-w-md font-display text-4xl leading-[1.05] tracking-[-.04em] md:text-6xl">Learning with intent, not just speed.</h2>
              <div className="max-w-2xl text-[15px] leading-8 text-[hsl(var(--muted-foreground))]">
                <p>My starting point is simple: understand the fundamentals, make things carefully, and keep asking better questions. I&apos;m currently pursuing Computer Science &amp; Engineering at New LJ Institute of Engineering and Technology under GTU, Ahmedabad.</p>
                <p className="mt-5">Python is where my technical foundation has taken shape so far. From there, I&apos;m exploring data structures, data science, machine learning, AI-assisted development, and the web — not as a list of labels, but as connected ways to solve problems.</p>
                <p className="mt-5 text-[hsl(var(--foreground))]">I’m building toward a portfolio of work that can be explained clearly, shared openly, and stood behind.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="scroll-mt-24 border-t border-[hsl(var(--border))] py-24 text-[hsl(var(--foreground))] md:py-32">
          <div className="section-wrap">
            <SectionKicker number="02">Skills &amp; competencies</SectionKicker>
            <div className="grid gap-12 md:grid-cols-[.7fr_1.3fr] md:gap-20">
              <div>
                <h2 className="font-display text-4xl leading-[1.05] tracking-[-.04em] md:text-6xl">The toolkit is growing.</h2>
                <p className="mt-6 max-w-sm text-sm leading-7 text-[hsl(var(--muted-foreground))]">A current snapshot of what I&apos;m practicing, and the kind of work I want to grow into.</p>
              </div>
              <div className="divide-y divide-[hsl(var(--border))]">
                {skills.map(({ icon: Icon, label, note }, index) => (
                  <div key={label} className="group flex items-center justify-between gap-5 py-6" data-testid={`skill-row-${index}`}>
                    <div className="flex items-center gap-5"><span className="font-mono-custom text-[10px] text-[hsl(var(--accent))]">0{index + 1}</span><Icon size={20} strokeWidth={1.4} className="text-[hsl(var(--secondary))]" aria-hidden="true" /><div><h3 className="text-base font-bold">{label}</h3><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{note}</p></div></div>
                    <ArrowUpRight size={17} className="magnetic-arrow text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-16 flex flex-wrap gap-2 border-t border-[hsl(var(--border))] pt-8" aria-label="Competency tags">
              {['Problem solving', 'Curiosity', 'Consistency', 'Clear communication', 'Learning in public'].map((item) => <span key={item} className="skill-chip border border-[hsl(var(--border))] px-3 py-2 font-mono-custom text-[10px] uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))]">{item}</span>)}
            </div>
          </div>
        </section>

        <section id="beyond" className="scroll-mt-24 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] py-24 md:py-32">
          <div className="section-wrap">
            <SectionKicker number="03">Beyond the classroom</SectionKicker>
            <div className="grid gap-10 md:grid-cols-[1.1fr_.9fr] md:gap-24">
              <div>
                <h2 className="max-w-xl font-display text-4xl leading-[1.05] tracking-[-.04em] md:text-6xl">The real curriculum is what keeps your attention.</h2>
                <p className="mt-7 max-w-lg text-sm leading-7 text-[hsl(var(--muted-foreground))]">Outside formal coursework, I&apos;m building the habits that make technical growth durable: reading closely, practicing fundamentals, using tools with judgment, and staying open to feedback.</p>
              </div>
              <div className="grid gap-3">
                {[
                  ['01', 'Follow the question', 'Move from “how” to “why” before reaching for a shortcut.'],
                  ['02', 'Make the invisible clear', 'Prefer documentation, simple language, and work others can pick up.'],
                  ['03', 'Keep the bar honest', 'Treat learning as a process, not a performance of expertise.'],
                ].map(([no, title, copy]) => <div key={no} className="border-l border-[hsl(var(--secondary))] py-2 pl-5" data-testid={`beyond-item-${no}`}><span className="font-mono-custom text-[10px] text-[hsl(var(--accent))]">{no}</span><h3 className="mt-2 text-sm font-bold">{title}</h3><p className="mt-1 text-xs leading-5 text-[hsl(var(--muted-foreground))]">{copy}</p></div>)}
              </div>
            </div>
          </div>
        </section>

        <section id="learning" className="scroll-mt-24 py-24 md:py-32">
          <div className="section-wrap">
            <SectionKicker number="04">Certifications &amp; learning</SectionKicker>
            <div className="grid gap-10 md:grid-cols-[.72fr_1.28fr] md:gap-24">
              <div>
                <h2 className="font-display text-4xl leading-[1.05] tracking-[-.04em] md:text-6xl">Proof of practice.</h2>
                <p className="mt-6 text-sm leading-7 text-[hsl(var(--muted-foreground))]">A small, verified trail from Python fundamentals into data and machine learning.</p>
              </div>
              <div className="divide-y divide-[hsl(var(--border))] border-y border-[hsl(var(--border))]">
                {certifications.map(({ title, date, file, preview, mark }) => (
                  <a key={title} href={file} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-5 py-6 transition-colors hover:bg-[hsl(var(--muted)/.55)] md:px-4" data-testid={`link-certificate-${mark}`}>
                    <div className="flex min-w-0 items-center gap-5">
                      <span className="font-mono-custom text-[10px] text-[hsl(var(--accent))]">{mark}</span>
                      <img src={preview} alt={`${title} certificate preview`} loading="lazy" className="hidden h-14 w-20 shrink-0 rounded-[2px] border border-[hsl(var(--border))] object-cover object-top grayscale transition-all group-hover:grayscale-0 sm:block" />
                      <div className="min-w-0">
                        <h3 className="max-w-md text-sm font-bold leading-5">{title}</h3>
                        <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">New LJ Institute of Engineering and Technology</p>
                        <p className="mt-2 font-mono-custom text-[10px] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">{date}</p>
                      </div>
                    </div>
                    <span className="flex shrink-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-[hsl(var(--secondary))]">
                      <span className="hidden sm:inline">View Certificate</span>
                      <ExternalLink size={16} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="education" className="scroll-mt-24 border-t border-[hsl(var(--border))] py-24 md:py-32">
          <div className="section-wrap">
            <SectionKicker number="05">Education</SectionKicker>
            <div className="grid gap-10 md:grid-cols-[.7fr_1.3fr] md:items-start md:gap-20">
              <div><span className="font-mono-custom text-xs text-[hsl(var(--accent))]">2024 — 2028</span><p className="mt-3 text-xs uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">GTU · Ahmedabad, India</p></div>
              <div><h2 className="max-w-2xl font-display text-4xl leading-[1.05] tracking-[-.04em] md:text-6xl">New LJ Institute of Engineering and Technology</h2><p className="mt-5 text-sm font-bold text-[hsl(var(--secondary))]">B.Tech · Computer Science &amp; Engineering</p><div className="mt-10 grid max-w-xl grid-cols-2 border border-[hsl(var(--border))]"><div className="border-r border-[hsl(var(--border))] p-5"><p className="font-display text-4xl">5th</p><p className="mt-2 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Semester now</p></div><div className="p-5"><p className="font-display text-4xl text-[hsl(var(--secondary))]">9.78</p><p className="mt-2 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Verified CGPA to Sem 4</p></div></div></div>
            </div>
          </div>
        </section>

        <section id="languages" className="scroll-mt-24 border-t border-[hsl(var(--border))] py-20 md:py-24">
          <div className="section-wrap flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div><SectionKicker number="05b">Languages</SectionKicker><h2 className="font-display text-4xl leading-[1.05] tracking-[-.04em] md:text-5xl">The languages I use to connect.</h2></div>
            <div className="flex flex-wrap gap-3" aria-label="Languages">
              {['English', 'Hindi', 'Gujarati'].map((language) => (
                <span key={language} className="border border-[hsl(var(--border))] px-5 py-3 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[hsl(var(--foreground))]" data-testid={`language-${language.toLowerCase()}`}>
                  {language}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="career" className="scroll-mt-24 border-t border-[hsl(var(--border))] py-24 md:py-32">
          <div className="section-wrap">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <div><p className="eyebrow">Career direction</p><h2 className="mt-6 max-w-4xl font-display text-5xl leading-[.98] tracking-[-.05em] md:text-8xl">Learning today.<br />Building tomorrow.</h2></div>
              <p className="max-w-xs text-sm leading-6 text-[hsl(var(--muted-foreground))]">I&apos;m moving toward software development roles where strong fundamentals meet useful, human-centred technology.</p>
            </div>
            <div className="mt-16 grid gap-px border border-[hsl(var(--border))] bg-[hsl(var(--border))] md:grid-cols-3">
              {['Software development', 'Python & data', 'AI-assisted product building'].map((item, index) => <div key={item} className="bg-[hsl(var(--background))] p-6"><span className="font-mono-custom text-[10px] text-[hsl(var(--accent))]">0{index + 1}</span><p className="mt-7 font-display text-2xl">{item}</p></div>)}
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 py-24 md:py-32">
          <div className="section-wrap">
            <SectionKicker number="06">Contact</SectionKicker>
            <div className="grid gap-14 md:grid-cols-[.82fr_1.18fr] md:gap-24">
              <div>
                <h2 className="font-display text-5xl leading-[.98] tracking-[-.05em] md:text-7xl">Have a good question?</h2>
                <p className="mt-7 max-w-sm text-sm leading-7 text-[hsl(var(--muted-foreground))]">I&apos;d be glad to hear from recruiters, collaborators, mentors, and fellow learners. Use the form or reach me directly by email.</p>
                <div className="mt-9 space-y-4 text-sm">
                  <a href={githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 font-bold hover:text-[hsl(var(--secondary))]" aria-label="View Aksha Mirza's GitHub profile" data-testid="link-contact-github"><Github size={17} aria-hidden="true" /> View GitHub <ArrowUpRight size={14} className="magnetic-arrow" aria-hidden="true" /></a>
                   <a href={linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 font-bold hover:text-[hsl(var(--secondary))]" aria-label="Connect with Aksha Mirza on LinkedIn" data-testid="link-contact-linkedin"><Linkedin size={17} aria-hidden="true" /> Connect on LinkedIn <ArrowUpRight size={14} className="magnetic-arrow" aria-hidden="true" /></a>
                    <a href={`mailto:${emailAddress}`} className="flex items-center gap-3 font-bold hover:text-[hsl(var(--secondary))]" aria-label={`Email Aksha Mirza at ${emailAddress}`} data-testid="link-contact-email"><Send size={17} aria-hidden="true" /> {emailAddress} <ArrowUpRight size={14} className="magnetic-arrow" aria-hidden="true" /></a>
                  <div className="flex items-center gap-3 text-[hsl(var(--muted-foreground))]"><MapPin size={17} aria-hidden="true" /> Ahmedabad, India</div>
                </div>
              </div>
              <div>
                {contactStatus === 'success' ? (
                  <div className="border border-[hsl(var(--secondary)/.45)] bg-[hsl(var(--secondary)/.08)] p-8 md:p-12" role="status" data-testid="status-contact-success"><CheckCircle2 size={24} className="text-[hsl(var(--secondary))]" aria-hidden="true" /><h3 className="mt-5 font-display text-3xl">that message is sent</h3><p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Thanks for reaching out. I&apos;ll get back to you soon.</p><button type="button" onClick={() => setContactStatus('idle')} className="mt-7 text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--secondary))] underline underline-offset-4" data-testid="button-contact-reset">Write another note</button></div>
                ) : (
                  <form onSubmit={handleContact} className="space-y-5" noValidate>
                    <div><label htmlFor="contact-name" className="mb-2 block font-mono-custom text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Your name</label><input id="contact-name" name="name" required minLength={2} className="w-full border-b border-[hsl(var(--border))] bg-transparent px-0 py-3 text-sm placeholder:text-[hsl(var(--muted-foreground)/.65)] focus:border-[hsl(var(--secondary))] focus:outline-none" placeholder="What should I call you?" data-testid="input-contact-name" /></div>
                    <div><label htmlFor="contact-email" className="mb-2 block font-mono-custom text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Email</label><input id="contact-email" name="email" type="email" required className="w-full border-b border-[hsl(var(--border))] bg-transparent px-0 py-3 text-sm placeholder:text-[hsl(var(--muted-foreground)/.65)] focus:border-[hsl(var(--secondary))] focus:outline-none" placeholder="you@example.com" data-testid="input-contact-email" /></div>
                     <div><label htmlFor="contact-subject" className="mb-2 block font-mono-custom text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Subject</label><input id="contact-subject" name="subject" required minLength={2} className="w-full border-b border-[hsl(var(--border))] bg-transparent px-0 py-3 text-sm placeholder:text-[hsl(var(--muted-foreground)/.65)] focus:border-[hsl(var(--secondary))] focus:outline-none" placeholder="Internship, collaboration, or a question" data-testid="input-contact-subject" /></div>
                     <div><label htmlFor="contact-message" className="mb-2 block font-mono-custom text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Message</label><textarea id="contact-message" name="message" required minLength={10} rows={4} className="w-full resize-none border-b border-[hsl(var(--border))] bg-transparent px-0 py-3 text-sm placeholder:text-[hsl(var(--muted-foreground)/.65)] focus:border-[hsl(var(--secondary))] focus:outline-none" placeholder="A little context goes a long way." data-testid="textarea-contact-message" /></div>
                    {contactError && <p className="text-xs leading-5 text-[hsl(var(--destructive))]" role="alert" data-testid="status-contact-error">{contactError}</p>}
                    <button type="submit" disabled={contactStatus === 'sending'} className="inline-flex items-center gap-3 bg-[hsl(var(--foreground))] px-5 py-3 text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--background))] transition-transform hover:-translate-y-1 disabled:cursor-wait disabled:opacity-60" data-testid="button-contact-submit">{contactStatus === 'sending' ? 'Sending…' : 'Send'} <Send size={14} aria-hidden="true" /></button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-[hsl(var(--border))] py-8">
        <div className="section-wrap flex flex-col gap-5 text-xs text-[hsl(var(--muted-foreground))] md:flex-row md:items-center md:justify-between">
          <p>© 2026 Aksha Mirza. Still learning, still building.</p>
          <div className="flex items-center gap-5"><a href={githubUrl} target="_blank" rel="noreferrer" className="font-bold hover:text-[hsl(var(--foreground))]" data-testid="link-footer-github">GitHub</a><a href={linkedinUrl} target="_blank" rel="noreferrer" className="font-bold hover:text-[hsl(var(--foreground))]" data-testid="link-footer-linkedin">LinkedIn</a><button type="button" onClick={() => scrollToSection('home')} className="inline-flex items-center gap-2 font-bold hover:text-[hsl(var(--foreground))]" data-testid="button-back-to-top">Back to top <ArrowUpRight size={13} aria-hidden="true" /></button></div>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;