import React from 'react'
import { Button } from './ui/button'
import { ArrowRight, BadgeCheck, Sparkles } from 'lucide-react'

const Hero = () => {
  return (
     <section className='relative overflow-hidden bg-[#f7f7f5] pt-24 text-slate-950 dark:bg-background dark:text-white'>
       <div className='container-page pb-14 pt-10 sm:pb-20 lg:pt-14'>
        <div className='grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]'>
          <div className='max-w-2xl'>
            <div className='mb-5 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:bg-card dark:text-slate-200'>
              <Sparkles className='h-4 w-4 text-pink-600' />
              New season tech, curated for everyday performance
            </div>
            <h1 className='text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-7xl'>Latest Electronics At Best Prices</h1>
            <p className='mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300'>Discover phones, laptops, accessories and essentials with polished deals, secure checkout, and fast delivery across India.</p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                <Button size='lg' className='rounded-full bg-slate-950 px-7 text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800' onClick={() => window.location.href='/products'}>
                    Shop Now <ArrowRight className='h-4 w-4' />
                </Button>
                <Button size='lg' variant='outline' className='rounded-full border-slate-300 bg-white/70 px-7 text-slate-950 hover:bg-white dark:bg-card dark:text-white' onClick={() => window.location.href='/products'}>
                    View Deals</Button>
            </div>
            <div className='mt-8 grid max-w-lg grid-cols-3 gap-3 text-sm text-slate-600 dark:text-slate-300'>
              {['Genuine products', 'Easy returns', 'Secure payments'].map((item) => (
                <span key={item} className='flex items-center gap-2'><BadgeCheck className='h-4 w-4 text-emerald-600' />{item}</span>
              ))}
            </div>
          </div>
          <div className='relative min-h-[360px] lg:min-h-[520px]'>
            <div className='absolute inset-8 rounded-[2rem] bg-white shadow-[0_30px_100px_rgba(15,23,42,0.16)] dark:bg-card' />
            <img src="https://d13rpl5inwerx1.cloudfront.net/filters:format(webp)/filters:quality(90)/fit-in/370x370/images/images/300826_0_ujhvyj.webp" alt="Featured electronics collection" width={560} height={520} className='relative mx-auto h-[340px] w-full max-w-[520px] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.03] sm:h-[440px] lg:h-[520px]'/>
            <div className='absolute bottom-4 left-0 rounded-2xl bg-slate-950 px-5 py-4 text-white shadow-2xl sm:left-6'>
              <p className='text-xs uppercase tracking-[0.2em] text-white/60'>Deal drop</p>
              <p className='text-2xl font-bold'>Up to 40% off</p>
            </div>
          </div>
        </div>
       </div>
     </section>
  )
}

export default Hero
