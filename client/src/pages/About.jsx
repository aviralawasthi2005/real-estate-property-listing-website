import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Building2,
  Users,
  TrendingUp,
  Globe,
  ArrowRight,
  Target,
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function About() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);

  const values = [
    { id: 1, title: 'Preservation', desc: 'Safeguarding architectural heritage.', icon: ShieldCheck },
    { id: 2, title: 'Innovation', desc: 'Pioneering AI-driven valuation.', icon: TrendingUp },
    { id: 3, title: 'Community', desc: 'Connecting the global elite.', icon: Users },
    { id: 4, title: 'Transparency', desc: 'Radical honesty in acquisitions.', icon: Target },
    { id: 5, title: 'Global', desc: 'Access to 120+ territories.', icon: Globe },
  ];

  return (
    <div className='bg-white dark:bg-[#020617] min-h-screen text-slate-900 dark:text-white overflow-x-hidden font-sans selection:bg-indigo-500/30'>

      {/* Hero */}
      <section className='relative h-[90vh] flex items-center justify-center p-6 lg:p-20'>
        <div className='absolute inset-0 bg-[url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop")] bg-cover bg-center grayscale opacity-[0.03] dark:invert' />
        <div className='max-w-7xl mx-auto space-y-12 relative z-10'>
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='text-7xl lg:text-[140px] font-black leading-[0.85] tracking-tighter'
          >
            The Art <br /> of <span className='text-indigo-600'>Living.</span>
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-2xl lg:text-3xl font-medium max-w-3xl leading-relaxed text-slate-500 dark:text-slate-400'
          >
            AwasMitra is not a brokerage. It is a philosophy of space, form, and function.
            We curate environments that elevate the human experience.
          </motion.p>
        </div>
        <div className='absolute bottom-10 right-10 lg:right-20 animate-bounce'>
          <ArrowRight className='h-12 w-12 rotate-90 text-slate-400' />
        </div>
      </section>

      {/* Founder's Letter */}
      <section className='py-32 px-6 lg:px-20'>
        <div className='grid lg:grid-cols-2 gap-20 items-end'>
          <div className='relative'>
            <img
              src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop'
              alt='Aviral Awasthi'
              className='rounded-[60px] grayscale contrast-125'
            />
            <div className='absolute -bottom-10 -right-10 bg-indigo-600 text-white p-10 rounded-[40px] space-y-2 hidden lg:block'>
              <p className='text-xs font-bold uppercase tracking-widest opacity-70'>Founder & CEO</p>
              <p className='text-3xl font-serif italic'>Aviral Awasthi</p>
            </div>
          </div>
          <div className='space-y-10'>
            <div className='h-1 w-20 bg-indigo-600' />
            <h2 className='text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9]'>
              Redefining <br /> Stewardship.
            </h2>
            <div className='prose dark:prose-invert prose-lg text-slate-500 dark:text-slate-400 font-medium'>
              <p>In 2026, we noticed a fracture in the market. Luxury real estate had become transactional, cold, volume-obsessed.</p>
              <p>AwasMitra was born to restore the 'soul' to the acquisition process. We believe a home is a guardian of your legacy, not just a line item on a balance sheet.</p>
              <p>Today, we manage over ₹2.4B in global assets, serving a private network of visionaries who demand more.</p>
            </div>
            <div className='grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 dark:border-white/10'>
              <div>
                <div className='text-4xl font-black'>120+</div>
                <div className='text-xs font-bold uppercase tracking-widest text-slate-400'>Global Cities</div>
              </div>
              <div>
                <div className='text-4xl font-black'>₹2.4B</div>
                <div className='text-xs font-bold uppercase tracking-widest text-slate-400'>Asset Value</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Values */}
      <section ref={targetRef} className='relative h-[300vh] bg-slate-900 text-white'>
        <div className='sticky top-0 flex h-screen items-center overflow-hidden'>
          <motion.div style={{ x }} className='flex gap-20 px-20'>
            <div className='shrink-0 w-[500px]'>
              <h2 className='text-8xl font-black tracking-tighter leading-[0.8] mb-8'>Core <br /> Pillars</h2>
              <p className='text-xl text-slate-400'>The immutable laws that govern our operations.</p>
            </div>
            {values.map((v) => (
              <div key={v.id} className='shrink-0 w-[400px] h-[500px] bg-white/5 rounded-[60px] border border-white/10 p-12 flex flex-col justify-between hover:bg-white/10 transition-colors'>
                <v.icon className='h-20 w-20 text-indigo-500' />
                <div className='space-y-4'>
                  <h3 className='text-5xl font-black tracking-tight'>{v.title}</h3>
                  <p className='text-lg text-slate-400'>{v.desc}</p>
                </div>
                <div className='text-9xl font-black text-white/5 select-none'>0{v.id}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Office Locations */}
      <section className='py-40 px-6 lg:px-20 bg-slate-50 dark:bg-black'>
        <div className='max-w-7xl mx-auto space-y-20'>
          <div className='space-y-6 text-center'>
            <h2 className='text-5xl lg:text-7xl font-black tracking-tighter'>Global Headquarters</h2>
            <p className='text-xl text-slate-500'>Where the future is built.</p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {['Mumbai, India', 'New York, USA', 'London, UK'].map((city, i) => (
              <div key={i} className='aspect-square rounded-[40px] bg-slate-200 dark:bg-white/5 p-10 flex flex-col justify-between group hover:bg-indigo-600 transition-colors duration-500'>
                <Building2 className='h-12 w-12 text-slate-400 group-hover:text-white' />
                <div>
                  <h3 className='text-3xl font-black group-hover:text-white'>{city}</h3>
                  <p className='text-slate-500 font-bold uppercase tracking-widest text-xs group-hover:text-indigo-200 mt-2'>Operational Hub</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className='noise-bg z-50 pointer-events-none opacity-50' />
    </div>
  );
}
