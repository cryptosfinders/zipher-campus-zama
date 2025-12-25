'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { useMutation } from 'convex/react'
import {
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Shield,
  Rocket,
  Users,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  Star,
  Play
} from 'lucide-react'

import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/lib/web3/WalletProvider'

/**
 * Zipher-Campus-Zama homepage — copy rewritten for privacy-preserving learning
 * powered by Zama (FHE) on FH-EVM
 */

const stats = [
  {
    icon: Globe,
    label: 'Private Compute Nodes',
    value: 'Zama-enabled',
    description: 'Confidential ML & compute with full data privacy'
  },
  {
    icon: Users,
    label: 'Active Learners',
    value: '12K+',
    description: 'Students learning with private, encrypted content'
  },
  {
    icon: TrendingUp,
    label: 'Encrypted Credentials Issued',
    value: '34K+',
    description: 'Verifiable credentials without exposing user data'
  }
]

const features = [
  {
    icon: Shield,
    title: 'Privacy-by-Design (FHE + Zama)',
    description:
      "All course data, student answers and analytics can be computed on while remaining encrypted — thanks to Zama's FHE integration and FH-EVM-native flows.",
    highlight: 'Compute on encrypted data'
  },
  {
    icon: Rocket,
    title: 'FH-EVM Native Architecture',
    description:
      'Run membership logic and verifiable access control on FH-EVM while offloading heavy private compute to Zama gateways.',
    highlight: 'Blockchain + private compute'
  },
  {
    icon: GraduationCap,
    title: 'Private Progress & Credentials',
    description:
      'Issue encrypted certificates and privately verifiable credentials — students reveal only what they choose to share.',
    highlight: 'Selective disclosure'
  },
  {
    icon: Zap,
    title: 'Seamless Instructor UX',
    description:
      'Create encrypted courses, private assignments, and encrypted discussion groups using a simple dashboard — no cryptography expertise required.',
    highlight: 'Creator-friendly'
  }
]

const testimonials = [
  {
    name: 'Dr. S. Okafor',
    role: 'Research Lead — Privacy Labs',
    avatar: 'SO',
    quote:
      "We needed private analytics on student submissions. Zipher-Campus-Zama let us compute models on encrypted inputs and still verify outcomes on-chain.",
    students: '1.8K',
    courses: 9
  },
  {
    name: 'Maya Patel',
    role: 'Course Creator',
    avatar: 'MP',
    quote:
      "My learners keep their data private while I can still run performance metrics. That's the future of ethical edtech.",
    students: '4.2K',
    courses: 16
  },
  {
    name: 'Chief, Dev',
    role: 'FH-EVM Integrations',
    avatar: 'CD',
    quote:
      "Zama + FH-EVM made it straightforward to add privacy guarantees without sacrificing UX or scale.",
    students: '5.9K',
    courses: 21
  }
]

const howItWorks = [
  {
    step: '01',
    title: 'Create an Encrypted Community',
    description:
      'Create groups and courses where all content is encrypted by default. Invite students with private access tokens.',
    details: ['Encrypted content', 'Role-based access', 'Zero knowledge friendly']
  },
  {
    step: '02',
    title: 'Compute Privately with Zama',
    description:
      'Offload ML, grading, and analytics to Zama-powered private compute while keeping inputs encrypted end-to-end.',
    details: ['FHE-backed compute', 'No plaintext leaks', 'Audit-friendly']
  },
  {
    step: '03',
    title: 'Issue Verifiable, Private Credentials',
    description:
      'Issue encrypted certificates and selective-disclosure proofs that learners can share when they choose.',
    details: ['Encrypted credentials', 'Selective disclosure', 'On-chain verification']
  }
]

export default function HomePage() {
  const { address } = useWallet()
  const storeUser = useMutation(api.users.store)

  useEffect(() => {
    if (!address) return
    storeUser({ address }).catch(() => {
      /* ignore duplicate upsert errors */
    })
  }, [address, storeUser])

  return (
    <main className='relative overflow-hidden bg-gradient-to-b from-[#050508] via-[#070708] to-[#0b0b0b]'>
      {/* Subtle decorative gold glows */}
      <div className='pointer-events-none absolute inset-0' aria-hidden='true'>
        <div className='absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_right,rgba(245,183,0,0.12),transparent_50%)]' />
        <div className='absolute right-0 top-[760px] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(245,183,0,0.06),transparent_70%)] blur-3xl' />
        <div className='absolute left-0 top-[1280px] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(184,134,11,0.06),transparent_70%)] blur-3xl' />
      </div>

      {/* Hero Section */}
      <section className='relative'>
        <div className='mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pb-32 sm:pt-28 lg:px-8'>
          <div className='grid gap-12 lg:grid-cols-2 lg:gap-16'>
            {/* Left Column */}
            <div className='flex flex-col justify-center space-y-8'>
              <div className='inline-flex items-center gap-2 rounded-full border border-[#F5B700]/30 bg-[#F5B700]/8 px-4 py-2 text-sm font-medium text-[#F5B700]/90 w-fit'>
                <Sparkles className='h-4 w-4 text-[#F5B700]' />
                <span>Privacy-First Learning</span>
              </div>

              <div className='space-y-6'>
                <h1 className='text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl'>
                  <span className='text-foreground'>Build Private</span>
                  <br />
                  <span
  className="bg-clip-text text-transparent"
  style={{ backgroundImage: "linear-gradient(90deg,#F5B700,#FF6A00 40%,#D4AF37 100%)" }}
>
  Learning Experiences
</span>
                </h1>

                <p className='text-xl leading-relaxed text-muted-foreground lg:text-2xl'>
                  Zipher-Campus-Zama combines FH-EVM access control with Zama's FHE compute so your courses, quizzes and analytics remain private by default.
                </p>
              </div>

              <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                <Button
                  size='lg'
                  className='bg-gradient-to-r from-[#F5B700] to-[#FF6A00] text-black text-base hover:opacity-95 shadow-lg shadow-[#F5B700]/20'
                  asChild
                >
                  <Link href='/create' className='inline-flex items-center'>
                    Create Encrypted Course
                    <Rocket className='ml-2 h-5 w-5' />
                  </Link>
                </Button>

                <Button
                  size='lg'
                  variant='outline'
                  className='border-[#F5B700]/30 text-base hover:bg-[#F5B700]/6'
                  asChild
                >
                  <Link href='/groups' className='inline-flex items-center'>
                    Explore Private Communities
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Link>
                </Button>
              </div>

              <div className='flex flex-wrap gap-4 pt-4'>
                {['FHE-powered', 'Selective Disclosure', 'No Plaintext Leaks'].map(benefit => (
                  <div
                    key={benefit}
                    className='flex items-center gap-2 rounded-full bg-[#F5B700]/6 px-4 py-2 text-sm font-medium text-foreground border border-[#F5B700]/10'
                  >
                    <CheckCircle2 className='h-4 w-4 text-[#F5B700]' />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className='relative'>
              <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-[#F5B700]/8 via-[#FF6A00]/6 to-transparent blur-3xl' />
              <div className='relative space-y-6'>
                <div className='grid gap-4'>
                  <div className='group rounded-2xl border border-[#F5B700]/20 bg-card/90 p-6 backdrop-blur-xl transition-all hover:scale-105 hover:border-[#F5B700]/40 hover:shadow-xl hover:shadow-[#F5B700]/10'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-muted-foreground'>Private Compute</p>
                        <p
  className='mt-1 text-3xl font-bold'
  style={{ background: "linear-gradient(90deg,#F5B700,#FF6A00)", WebkitBackgroundClip: "text", color: "transparent" }}
>
  Zama FHE
</p>
                      </div>
                      <div className='rounded-xl bg-[#F5B700]/10 p-3'>
                        <Shield className='h-6 w-6 text-[#FF6A00]' />
                      </div>
                    </div>
                    <p className='mt-3 text-xs text-muted-foreground'>Run ML and grading without exposing learner data</p>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='group rounded-2xl border border-[#F5B700]/20 bg-card/90 p-4 backdrop-blur-xl transition-all hover:scale-105 hover:border-[#F5B700]/40'>
                      <Globe className='h-5 w-5 text-[#FF6A00] mb-2' />
                      <p className='text-2xl font-bold text-foreground'>FH-EVM</p>
                      <p className='text-xs text-muted-foreground'>On-chain access control</p>
                    </div>
                    <div className='group rounded-2xl border border-[#F5B700]/20 bg-card/90 p-4 backdrop-blur-xl transition-all hover:scale-105 hover:border-[#F5B700]/40'>
                      <Users className='h-5 w-5 text-[#FF6A00] mb-2' />
                      <p className='text-2xl font-bold text-foreground'>12K+</p>
                      <p className='text-xs text-muted-foreground'>Learners</p>
                    </div>
                  </div>

                  <div className='rounded-2xl border border-[#F5B700]/20 bg-card/90 p-4 backdrop-blur-xl'>
                    <div className='flex items-center gap-2 mb-3'>
                      <Star className='h-4 w-4 text-[#F5B700] fill-[#F5B700]' />
                      <span className='text-sm font-medium text-foreground'>Featured Course</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F5B700]/20 to-[#FF6A00]/20 border border-[#F5B700]/30 text-sm font-bold text-[#FF6A00]'>
                        MP
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm font-medium text-foreground'>Privacy Engineering 101</p>
                        <p className='text-xs text-muted-foreground'>4.2K students • 16 courses</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='relative py-16'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='grid gap-8 md:grid-cols-3'>
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className='group relative overflow-hidden rounded-3xl border border-[#F5B700]/20 bg-gradient-to-br from-card/95 via-card/90 to-card/85 p-8 backdrop-blur-xl transition-all hover:scale-105 hover:border-[#F5B700]/40 hover:shadow-2xl hover:shadow-[#F5B700]/10'
                >
                  <div className='pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#F5B700]/10 to-transparent blur-2xl transition-all group-hover:scale-150' />
                  <div className='relative'>
                    <div className='mb-4 inline-flex rounded-2xl bg-[#F5B700]/10 p-3 ring-1 ring-[#F5B700]/20'>
                      <Icon className='h-6 w-6 text-[#FF6A00]' />
                    </div>
                    <p
  className='text-5xl font-bold'
  style={{ background: "linear-gradient(90deg,#F5B700,#FF6A00)", WebkitBackgroundClip: "text", color: "transparent" }}
>
  {stat.value}
</p>
                    <p className='mt-2 text-lg font-semibold text-foreground'>{stat.label}</p>
                    <p className='mt-1 text-sm text-muted-foreground'>{stat.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Video Demo */}
      <section className='relative py-24'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-4xl'>
            <div className='text-center mb-12'>
              <div className='inline-flex items-center gap-2 rounded-full border border-[#F5B700]/30 bg-[#F5B700]/10 px-4 py-2 text-sm font-medium text-[#FF6A00] backdrop-blur-sm mb-6'>
                <Play className='h-4 w-4' />
                <span>See Private Compute</span>
              </div>
              <h2 className='text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4'>
                Watch{' '}
                <span
  style={{ background: "linear-gradient(90deg,#F5B700,#FF6A00)", WebkitBackgroundClip: "text", color: "transparent" }}
>
  Zipher-Campus-Zama
</span>{' '}
                in Action
              </h2>
              <p className='text-lg leading-relaxed text-muted-foreground'>
                A short demo of encrypted coursework and FHE-backed analytics.
              </p>
            </div>

            <div className='group relative'>
              <div className='pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#F5B700]/20 via-[#FF6A00]/20 to-[#F5B700]/20 blur-3xl opacity-50 transition-opacity group-hover:opacity-75' />

              <div className='relative overflow-hidden rounded-3xl border-2 border-[#F5B700]/30 bg-gradient-to-br from-card/95 via-card/90 to-card/85 p-2 backdrop-blur-xl shadow-2xl shadow-[#F5B700]/20 transition-all group-hover:border-[#F5B700]/50 group-hover:shadow-3xl group-hover:shadow-[#F5B700]/30'>
                <div className='relative aspect-video overflow-hidden rounded-2xl bg-black/80'>
                  <iframe
                    className='absolute inset-0 h-full w-full'
                    src='https://youtu.be/R8C8hS8hAu8?si=TP8LKvUzilXFeNal'
                    title='Zipher Campus Zama Demo'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowFullScreen
                  />
                </div>
              </div>

              <div className='pointer-events-none absolute -top-2 -right-2 h-20 w-20 rounded-full bg-gradient-to-br from-[#FF6A00]/30 to-transparent blur-2xl' />
              <div className='pointer-events-none absolute -bottom-2 -left-2 h-20 w-20 rounded-full bg-gradient-to-br from-[#F5B700]/30 to-transparent blur-2xl' />
            </div>

            <div className='mt-8 text-center'>
              <p className='text-sm text-muted-foreground'>
                Learn how private compute, encrypted credentials and FH-EVM combine for safe, trust-minimized education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className='relative py-24'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center mb-16'>
            <div className='inline-flex items-center gap-2 rounded-full border border-[#F5B700]/30 bg-[#F5B700]/10 px-4 py-2 text-sm font-medium text-[#FF6A00] backdrop-blur-sm mb-6'>
              <Zap className='h-4 w-4' />
              <span>Private-first by default</span>
            </div>
            <h2 className='text-4xl font-bold tracking-tight text-foreground sm:text-5xl'>
              Everything You Need to Teach Privately
            </h2>
            <p className='mt-6 text-lg leading-relaxed text-muted-foreground'>
              From encrypted content hosting to private analytics — built to meet real privacy use-cases in education.
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2'>
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className='group relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card/95 via-card/90 to-card/85 p-8 backdrop-blur-sm transition-all hover:border-[#F5B700]/40 hover:shadow-xl hover:shadow-[#F5B700]/5'
                >
                  <div className='pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-[#F5B700]/5 to-transparent blur-3xl transition-all group-hover:scale-150' />
                  <div className='relative'>
                    <div className='mb-5 inline-flex rounded-2xl bg-gradient-to-br from-[#F5B700]/15 to-[#FF6A00]/10 p-4 ring-1 ring-[#F5B700]/20 transition-all group-hover:scale-110'>
                      <Icon className='h-8 w-8 text-[#FF6A00]' />
                    </div>
                    <h3 className='text-2xl font-bold text-foreground mb-3 group-hover:text-[#FF6A00] transition-colors'>
                      {feature.title}
                    </h3>
                    <p className='text-base leading-relaxed text-muted-foreground mb-4'>
                      {feature.description}
                    </p>
                    <div className='inline-flex items-center gap-2 rounded-full bg-[#F5B700]/10 px-3 py-1 text-xs font-medium text-[#FF6A00] border border-[#F5B700]/20'>
                      <Sparkles className='h-3 w-3' />
                      <span>{feature.highlight}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='relative py-24 bg-[#0b0b0b]'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center mb-16'>
            <h2 className='text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6'>
              Launch Private Courses in{' '}
              <span
  style={{ background: "linear-gradient(90deg,#F5B700,#FF6A00)", WebkitBackgroundClip: "text", color: "transparent" }}
>
  Minutes
</span>

            </h2>
            <p className='text-lg leading-relaxed text-muted-foreground'>
              A simple workflow for creators to deploy encrypted learning experiences backed by Zama.
            </p>
          </div>

          <div className='relative mx-auto max-w-5xl'>
            <div className='absolute left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-[#F5B700] via-[#FF6A00]/60 to-[#F5B700]/20 hidden md:block' />

            <div className='space-y-12'>
              {howItWorks.map((item, index) => (
                <div key={index} className='relative flex gap-8 items-start group'>
                  <div className='relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F5B700] to-[#FF6A00] text-2xl font-bold text-black shadow-lg shadow-[#F5B700]/20 ring-4 ring-background transition-all group-hover:scale-110'>
                    {item.step}
                  </div>

                  <div className='flex-1 rounded-3xl border border-[#F5B700]/20 bg-card/90 p-8 backdrop-blur-xl transition-all group-hover:border-[#F5B700]/40 group-hover:shadow-xl group-hover:shadow-[#F5B700]/10'>
                    <h3 className='text-2xl font-bold text-foreground mb-3'>{item.title}</h3>
                    <p className='text-base leading-relaxed text-muted-foreground mb-4'>
                      {item.description}
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {item.details.map((detail, i) => (
                        <div key={i} className='flex items-center gap-2 rounded-full bg-[#F5B700]/5 px-3 py-1 text-xs font-medium text-foreground border border-[#F5B700]/10'>
                          <CheckCircle2 className='h-3 w-3 text-[#F5B700]' />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='relative py-24'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center mb-16'>
            <h2 className='text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6'>
              Trusted by Privacy-First Educators
            </h2>
            <p className='text-lg leading-relaxed text-muted-foreground'>
              Organizations and instructors protecting student data while scaling learning experiences.
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-3'>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className='group relative overflow-hidden rounded-3xl border border-[#F5B700]/20 bg-gradient-to-br from-card/95 via-card/90 to-card/85 p-8 backdrop-blur-xl transition-all hover:border-[#F5B700]/40 hover:shadow-xl hover:shadow-[#F5B700]/10'
              >
                <div className='pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#F5B700]/5 to-transparent blur-2xl' />
                <div className='relative'>
                  <div className='flex gap-1 mb-4'>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className='h-4 w-4 text-[#F5B700] fill-[#F5B700]' />
                    ))}
                  </div>

                  <blockquote className='text-base leading-relaxed text-muted-foreground mb-6'>
                    {testimonial.quote}
                  </blockquote>

                  <div className='flex items-center gap-3 mb-4'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#F5B700]/20 to-[#FF6A00]/20 border border-[#F5B700]/30 text-base font-bold text-[#FF6A00]'>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className='font-semibold text-foreground'>{testimonial.name}</p>
                      <p className='text-sm text-muted-foreground'>{testimonial.role}</p>
                    </div>
                  </div>

                  <div className='flex gap-4 pt-4 border-t border-border/50'>
  <div>
    <p className='text-lg font-bold text-[#FF6A00]'>
      {testimonial.students}
    </p>
    <p className='text-xs text-muted-foreground'>Students</p>
  </div>
  <div>
    <p className='text-lg font-bold text-[#FF6A00]'>
      {testimonial.courses}
    </p>
    <p className='text-xs text-muted-foreground'>Courses</p>
  </div>
</div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className='relative py-24'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='relative overflow-hidden rounded-3xl border border-[#F5B700]/30 bg-gradient-to-br from-[#F5B700]/10 via-[#FF6A00]/6 to-transparent p-12 md:p-16 backdrop-blur-xl'>
            <div className='pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gradient-to-br from-[#F5B700]/20 to-transparent blur-3xl' />
            <div className='pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-gradient-to-br from-[#FF6A00]/15 to-transparent blur-3xl' />

            <div className='relative mx-auto max-w-3xl text-center'>
              <h2 className='text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-6'>
                Ready to Protect Learner Data?
              </h2>
              <p className='text-xl leading-relaxed text-muted-foreground mb-8'>
                Launch encrypted classrooms powered by Zama and FH-EVM — privacy guarantees with a familiar UX.
              </p>

              <div className='flex flex-col gap-4 sm:flex-row sm:justify-center mb-8'>
                <Button size='lg' className='bg-gradient-to-r from-[#F5B700] to-[#FF6A00] text-lg px-8 hover:opacity-90 shadow-xl shadow-[#F5B700]/30' asChild>
                  <Link href='/create' className='inline-flex items-center'>
                    Create Encrypted Course
                    <Rocket className='ml-2 h-5 w-5' />
                  </Link>
                </Button>
                <Button size='lg' variant='outline' className='border-[#F5B700]/30 text-lg px-8 hover:bg-[#F5B700]/6' asChild>
                  <Link href='/groups' className='inline-flex items-center'>
                    Explore Communities
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Link>
                </Button>
              </div>

              <div className='flex flex-wrap justify-center gap-6 text-sm text-muted-foreground'>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-[#F5B700]' />
                  <span>No plaintext storage</span>
                </div>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-[#F5B700]' />
                  <span>FHE-backed analytics</span>
                </div>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-[#F5B700]' />
                  <span>FH-EVM access control</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
