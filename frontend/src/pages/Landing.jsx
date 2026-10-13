
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQrcode,
  faShieldHalved,
  faClock,
  faRoute,
  faBusSimple,
  faEnvelope,
  faPhone,
  faLocationDot,
  faMobileScreenButton,
  faCheck,
  faArrowRight,
  faUserPlus,
  faCircleCheck,
  faWallet,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';

const qrPattern = [
  1, 1, 1, 0, 1, 1, 1, 1,
  1, 0, 1, 1, 0, 1, 0, 1,
  1, 1, 1, 0, 1, 0, 1, 1,
  0, 1, 0, 1, 1, 1, 0, 0,
  1, 1, 1, 0, 0, 1, 1, 1,
  1, 0, 1, 1, 1, 0, 1, 0,
  1, 1, 0, 1, 0, 1, 1, 1,
  1, 0, 1, 1, 1, 0, 1, 1,
];

const journeyStages = [
  {
    label: 'CREATE ACCOUNT',
    title: 'Your journey starts here',
    description: 'Create your passenger account in a few simple steps.',
    icon: faUserPlus,
    status: 'Account ready',
  },
  {
    label: 'BROWSE ROUTES',
    title: 'Find your daily route',
    description: 'Explore transport options and choose a plan that suits you.',
    icon: faRoute,
    status: 'Route selected',
  },
  {
    label: 'M-PESA PAYMENT',
    title: 'Pay the convenient way',
    description: 'Complete your transport subscription using M-Pesa.',
    icon: faWallet,
    status: 'Payment confirmed',
  },
  {
    label: 'DIGITAL PASS',
    title: 'Your pass is ready',
    description: 'Your subscription gives you a digital pass for your journey.',
    icon: faQrcode,
    status: 'Pass activated',
  },
  {
    label: 'BOARD & RIDE',
    title: 'Scan, board and go',
    description: 'Present your QR pass to the conductor for validation.',
    icon: faBusSimple,
    status: 'Access granted',
  },
];

function Landing() {
  const [journeyStep, setJourneyStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setJourneyStep((current) => (current + 1) % journeyStages.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  const currentStage = journeyStages[journeyStep];

  const features = [
    {
      icon: faQrcode,
      title: 'Digital QR Pass',
      description:
        'One scannable pass for your subscription. No paper tickets and no need to carry coins every morning.',
    },
    {
      icon: faShieldHalved,
      title: 'Secure M-Pesa Payments',
      description:
        'Pay for your transport plan through M-Pesa with a familiar, fast, and convenient payment experience.',
    },
    {
      icon: faClock,
      title: 'Never Lose Unused Days',
      description:
        "Didn't ride today? Your unused subscription day is preserved so you get the value you paid for.",
    },
    {
      icon: faRoute,
      title: 'Flexible Route Shifting',
      description:
        'Need to use another route temporarily? Shift your route when your travel needs change.',
    },
  ];

  const operators = [
    {
      name: 'Super Metro',
      description:
        'Reliable and convenient transport for everyday commuters across Nairobi.',
      image: '/images/super-metro.jpg',
    },
    {
      name: 'Enabled',
      description:
        'A modern transport experience designed to make your daily journey easier.',
      image:
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=85',
    },
    {
      name: 'Latema',
      description:
        'A convenient way to move around Nairobi and connect to your destination.',
      image: '/images/latema.jpg',
    },
  ];

  const steps = [
    {
      number: '01',
      icon: faMobileScreenButton,
      title: 'Create Your Account',
      description:
        'Sign up for your free SafariPass account and get started in just a few steps.',
    },
    {
      number: '02',
      icon: faRoute,
      title: 'Choose Your Plan',
      description:
        'Select your transport company, route, and weekly or monthly subscription plan.',
    },
    {
      number: '03',
      icon: faShieldHalved,
      title: 'Pay with M-Pesa',
      description:
        'Complete your subscription payment securely through M-Pesa.',
    },
    {
      number: '04',
      icon: faQrcode,
      title: 'Scan & Ride',
      description:
        'Show your digital QR pass to the conductor and enjoy a smoother commute.',
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-textdark">
      {/* Public Navbar */}
      <nav className="absolute left-0 right-0 top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md sm:px-5">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-bold text-primary sm:text-xl"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary sm:h-9 sm:w-9">
                <FontAwesomeIcon
                  icon={faBusSimple}
                  className="text-sm text-accent sm:text-base"
                />
              </span>
              SafariPass
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-primary transition hover:text-secondary sm:px-4"
              >
                Log In
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-primary shadow-sm transition hover:opacity-90 sm:px-5 sm:py-2.5 sm:text-base"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden lg:min-h-[720px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1800&q=85"
            alt="City bus transportation"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/50" />
          <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Hero Text */}
            <div className="text-center lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 sm:mb-6 sm:px-4">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-xs text-white/90 sm:text-sm">
                  Smarter commuting starts here
                </span>
              </div>

              <h1 className="mb-5 text-4xl font-bold leading-tight text-white sm:mb-6 sm:text-5xl lg:text-6xl">
                Your Daily Commute,
                <span className="block text-accent">Simplified.</span>
              </h1>

              <p className="mx-auto mb-7 max-w-xl text-base leading-relaxed text-gray-200 sm:mb-8 sm:text-lg lg:mx-0">
                Subscribe to your preferred transport plan, pay with M-Pesa,
                and ride with a digital pass. SafariPass makes everyday
                commuting simpler, faster, and more convenient.
              </p>

              <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-7 py-3.5 font-bold text-primary shadow-lg transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  Get Started
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white transition hover:bg-white/20"
                >
                  Log In
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap justify-center gap-4 text-sm text-gray-200 sm:mt-8 sm:gap-6 lg:justify-start">
                {['M-Pesa payments', 'Digital QR pass', 'Flexible plans'].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-accent"
                      />
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Animated SafariPass Journey Card */}
            <div className="flex justify-center px-1 sm:px-2">
              <div className="relative mx-auto w-full max-w-[340px]">
                <div className="absolute -inset-5 rounded-full bg-accent/10 blur-3xl" />
                <div className="absolute -right-2 top-12 h-20 w-20 rounded-full bg-secondary/30 blur-2xl" />

                <div className="relative rounded-[24px] border border-white/50 bg-white/95 p-2.5 shadow-2xl backdrop-blur-xl sm:p-3">
                  {/* Journey Header */}
                  <div className="flex items-center justify-between rounded-xl bg-primary px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                        <FontAwesomeIcon
                          icon={faBusSimple}
                          className="text-base text-accent"
                        />
                      </div>
                      <div>
                        <p className="text-base font-bold text-white">
                          SafariPass
                        </p>
                        <p className="text-[9px] uppercase tracking-[0.14em] text-gray-300">
                          Your journey, simplified
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-1 text-[9px] font-bold text-accent">
                      LIVE DEMO
                    </span>
                  </div>

                  {/* Journey Progress */}
                  <div className="px-2 pb-1 pt-4 sm:px-3">
                    <div className="mb-2.5 flex items-center justify-between">
                      <p className="text-[10px] font-semibold text-primary">
                        YOUR PASSENGER JOURNEY
                      </p>
                      <p className="text-[10px] font-semibold text-secondary">
                        {String(journeyStep + 1).padStart(2, '0')} / 05
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {journeyStages.map((stage, index) => (
                        <div
                          key={stage.label}
                          className={`h-1.5 flex-1 overflow-hidden rounded-full transition-colors duration-500 ${
                            index <= journeyStep
                              ? 'bg-secondary'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="mt-3 flex justify-between gap-1">
                      {journeyStages.map((stage, index) => (
                        <div
                          key={stage.label}
                          className={`flex min-w-0 flex-1 flex-col items-center gap-1 text-center ${
                            index === journeyStep
                              ? 'text-secondary'
                              : index < journeyStep
                                ? 'text-primary'
                                : 'text-gray-400'
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] transition-all duration-300 ${
                              index === journeyStep
                                ? 'scale-110 bg-secondary text-white shadow-md shadow-secondary/20'
                                : index < journeyStep
                                  ? 'bg-secondary/10 text-secondary'
                                  : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {index < journeyStep ? (
                              <FontAwesomeIcon icon={faCheck} />
                            ) : (
                              index + 1
                            )}
                          </span>
                          <span className="hidden text-[8px] font-semibold leading-tight sm:block">
                            {['Account', 'Routes', 'Payment', 'Pass', 'Ride'][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Animated Stage Content */}
                  <div
                    key={journeyStep}
                    className="animate-card-enter px-1.5 pb-1.5 pt-2 sm:px-2"
                  >
                    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-3.5">
                      <div className="mb-3 flex items-start gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                          <FontAwesomeIcon
                            icon={currentStage.icon}
                            className="text-base"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.14em] text-secondary">
                            {currentStage.label}
                          </p>
                          <h3 className="text-sm font-bold leading-snug text-primary sm:text-base">
                            {currentStage.title}
                          </h3>
                          <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                            {currentStage.description}
                          </p>
                        </div>
                      </div>

                      {/* Stage 1: Account Creation */}
                      {journeyStep === 0 && (
                        <div className="space-y-2.5 rounded-lg bg-gray-50 p-2.5">
                          <div className="flex items-center gap-2.5 rounded-lg border border-gray-100 bg-white p-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/5 text-primary">
                              <FontAwesomeIcon
                                icon={faUserPlus}
                                className="text-sm"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="mb-1.5 h-2 w-20 rounded-full bg-gray-200" />
                              <div className="h-1.5 w-14 rounded-full bg-gray-100" />
                            </div>
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              className="text-sm text-secondary"
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-gray-500">
                              Passenger account
                            </span>
                            <span className="font-semibold text-secondary">
                              Ready to go
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Stage 2: Route Selection */}
                      {journeyStep === 1 && (
                        <div className="space-y-2 rounded-lg bg-gray-50 p-2.5">
                          <div className="flex items-center gap-2.5 rounded-lg border border-secondary/30 bg-secondary/5 p-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-accent">
                              <FontAwesomeIcon
                                icon={faBusSimple}
                                className="text-sm"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold text-primary">
                                Nairobi commute
                              </p>
                              <p className="mt-1 text-[9px] text-gray-500">
                                Choose your preferred route
                              </p>
                            </div>
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              className="text-sm text-secondary"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-lg border border-gray-100 bg-white p-2.5">
                              <p className="text-[9px] text-gray-400">PLAN</p>
                              <p className="mt-1 text-[11px] font-bold text-primary">
                                Weekly
                              </p>
                            </div>
                            <div className="rounded-lg border border-secondary/20 bg-white p-2.5">
                              <p className="text-[9px] text-gray-400">PLAN</p>
                              <p className="mt-1 text-[11px] font-bold text-primary">
                                Monthly
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Stage 3: M-Pesa Payment */}
                      {journeyStep === 2 && (
                        <div className="rounded-lg bg-gray-50 p-2.5">
                          <div className="rounded-lg border border-gray-100 bg-white p-3">
                            <div className="mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                                  <FontAwesomeIcon
                                    icon={faMobileScreenButton}
                                    className="text-sm"
                                  />
                                </div>
                                <div>
                                  <p className="text-[11px] font-bold text-primary">
                                    M-Pesa
                                  </p>
                                  <p className="text-[9px] text-gray-500">
                                    Secure payment
                                  </p>
                                </div>
                              </div>
                              <FontAwesomeIcon
                                icon={faShieldHalved}
                                className="text-sm text-secondary"
                              />
                            </div>

                            <p className="text-[9px] uppercase tracking-wider text-gray-400">
                              Subscription payment
                            </p>
                            <p className="my-1 text-xl font-bold text-primary">
                              Transport plan
                            </p>

                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                              <div className="animate-progress h-full w-full rounded-full bg-secondary" />
                            </div>

                            <div className="mt-2 flex items-center justify-between text-[9px]">
                              <span className="text-gray-500">
                                Processing payment
                              </span>
                              <span className="font-semibold text-secondary">
                                Confirmed
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Stage 4: Digital QR Pass */}
                      {journeyStep === 3 && (
                        <div className="rounded-lg bg-gray-50 p-2.5">
                          <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
                            <div className="flex items-center justify-between bg-primary px-2.5 py-2.5">
                              <div>
                                <p className="text-[8px] uppercase tracking-wider text-gray-300">
                                  Digital transport pass
                                </p>
                                <p className="mt-1 text-xs font-bold text-white">
                                  SafariPass
                                </p>
                              </div>
                              <FontAwesomeIcon
                                icon={faBusSimple}
                                className="text-base text-accent"
                              />
                            </div>

                            <div className="flex items-center gap-3 p-2.5">
                              <div className="flex h-[82px] w-[82px] shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white p-1.5">
                                <div className="grid h-full w-full grid-cols-8 gap-[2px]">
                                  {qrPattern.map((cell, index) => (
                                    <div
                                      key={index}
                                      className={
                                        cell
                                          ? 'rounded-[1px] bg-primary'
                                          : 'bg-white'
                                      }
                                    />
                                  ))}
                                </div>
                              </div>

                              <div className="min-w-0">
                                <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-1.5 py-1 text-[8px] font-bold text-secondary">
                                  <FontAwesomeIcon icon={faCheck} />
                                  ACTIVE PASS
                                </span>
                                <p className="mt-2.5 text-[11px] font-bold text-primary">
                                  Monthly plan
                                </p>
                                <p className="mt-1 text-[9px] leading-relaxed text-gray-500">
                                  Your digital pass is ready for your next ride.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Stage 5: QR Scan and Boarding */}
                      {journeyStep === 4 && (
                        <div className="rounded-lg bg-gray-50 p-2.5">
                          <div className="relative overflow-hidden rounded-lg border border-gray-100 bg-white p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[9px] uppercase tracking-wider text-gray-400">
                                  Conductor scanner
                                </p>
                                <p className="mt-1 text-xs font-bold text-primary">
                                  Scan passenger pass
                                </p>
                              </div>
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                                <FontAwesomeIcon
                                  icon={faQrcode}
                                  className="text-sm"
                                />
                              </div>
                            </div>

                            <div className="relative mx-auto my-3 flex h-24 w-24 items-center justify-center">
                              <div className="absolute inset-0 rounded-xl border-2 border-secondary/30" />
                              <div className="absolute left-0 top-0 h-4 w-4 rounded-tl-lg border-l-[3px] border-t-[3px] border-secondary" />
                              <div className="absolute right-0 top-0 h-4 w-4 rounded-tr-lg border-r-[3px] border-t-[3px] border-secondary" />
                              <div className="absolute bottom-0 left-0 h-4 w-4 rounded-bl-lg border-b-[3px] border-l-[3px] border-secondary" />
                              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-br-lg border-b-[3px] border-r-[3px] border-secondary" />

                              <div className="grid h-[66px] w-[66px] grid-cols-8 gap-[2px]">
                                {qrPattern.map((cell, index) => (
                                  <div
                                    key={index}
                                    className={
                                      cell
                                        ? 'rounded-[1px] bg-primary'
                                        : 'bg-white'
                                    }
                                  />
                                ))}
                              </div>

                              <div className="animate-scan absolute left-2 right-2 top-1 h-0.5 bg-secondary shadow-[0_0_8px_rgba(15,118,110,0.7)]" />
                            </div>

                            <div className="flex items-center justify-center gap-1.5 rounded-lg bg-secondary/10 px-2 py-2 text-[10px] font-bold text-secondary">
                              <FontAwesomeIcon icon={faCircleCheck} />
                              Access granted — enjoy your ride
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Stage Status */}
                      <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-2.5">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary/40" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
                          </span>
                          <span className="truncate text-[10px] font-semibold text-primary">
                            {currentStage.status}
                          </span>
                        </div>
                        <span className="shrink-0 text-[9px] text-gray-400">
                          SafariPass demo
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Journey Navigation */}
                  <div className="flex items-center justify-between px-2 pb-2 pt-1 sm:px-3">
                    <p className="text-[9px] text-gray-400">
                      A simpler way to commute
                    </p>
                    <div className="flex items-center gap-1.5">
                      {journeyStages.map((stage, index) => (
                        <button
                          key={stage.label}
                          type="button"
                          aria-label={`Show ${stage.label.toLowerCase()} stage`}
                          aria-pressed={journeyStep === index}
                          onClick={() => setJourneyStep(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            journeyStep === index
                              ? 'w-5 bg-secondary'
                              : 'w-2 bg-gray-300 hover:bg-secondary/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Floating status cards removed */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Strip */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:divide-x sm:divide-gray-200">
            <div>
              <p className="text-2xl font-bold text-primary">Digital</p>
              <p className="mt-1 text-sm text-gray-500">
                Transport subscriptions
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">M-Pesa</p>
              <p className="mt-1 text-sm text-gray-500">
                Convenient payments
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">QR</p>
              <p className="mt-1 text-sm text-gray-500">
                Simple fare validation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose SafariPass */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">
            Why SafariPass
          </p>
          <h2 className="mb-4 text-3xl font-bold text-primary md:text-4xl">
            Built for the way you commute
          </h2>
          <p className="leading-relaxed text-gray-500">
            Everything you need to make your everyday transport experience
            easier, more flexible, and more convenient.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 transition duration-300 group-hover:bg-secondary">
                <FontAwesomeIcon
                  icon={feature.icon}
                  className="text-2xl text-secondary transition duration-300 group-hover:text-white"
                />
              </div>
              <h3 className="mb-3 text-lg font-bold text-primary">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Transport Operators - Informational Cards */}
      <section className="bg-primary py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 max-w-2xl sm:mb-14">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
              Transport Partners
            </p>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Choose the transport that fits your journey
            </h2>
            <p className="leading-relaxed text-gray-300">
              SafariPass brings your transport subscription experience into
              one convenient digital platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {operators.map((operator) => (
              <div
                key={operator.name}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:-translate-y-2"
              >
                <div className="h-52 overflow-hidden sm:h-56">
                  <img
                    src={operator.image}
                    alt={`${operator.name} transport`}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                      <FontAwesomeIcon icon={faBusSimple} />
                    </span>
                    <h3 className="text-lg font-bold text-primary">
                      {operator.name}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {operator.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary">
            How It Works
          </p>
          <h2 className="mb-4 text-3xl font-bold text-primary md:text-4xl">
            Four simple steps to ride
          </h2>
          <p className="leading-relaxed text-gray-500">
            From setting up your account to boarding your vehicle, your
            transport journey is designed to be straightforward.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <FontAwesomeIcon icon={step.icon} className="text-xl" />
                </div>
                <span className="text-3xl font-bold text-gray-100">
                  {step.number}
                </span>
              </div>
              <h3 className="mb-3 text-lg font-bold text-primary">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative overflow-hidden bg-primary py-16 sm:py-20">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
            <FontAwesomeIcon
              icon={faTicket}
              className="text-2xl text-accent"
            />
          </div>
          <h2 className="mb-5 text-3xl font-bold text-white sm:text-4xl">
            Ready to simplify your daily commute?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl leading-relaxed text-gray-300">
            Get started with SafariPass and experience a more convenient way
            to manage your transport subscription.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-7 py-3.5 font-bold text-primary shadow-lg transition hover:-translate-y-0.5 hover:opacity-90"
          >
            Create Your Account
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#091D2D] text-gray-300">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link
                to="/"
                className="mb-4 inline-flex items-center gap-2 text-xl font-bold text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <FontAwesomeIcon
                    icon={faBusSimple}
                    className="text-accent"
                  />
                </span>
                SafariPass
              </Link>
              <p className="max-w-xs text-sm leading-relaxed text-gray-400">
                Making everyday commuting simpler through digital transport
                subscriptions, convenient payments, and QR passes.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 transition hover:bg-secondary"
                >
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a
                  href="https://www.x.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 transition hover:bg-secondary"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 transition hover:bg-secondary"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-bold text-white">Quick Links</h3>
              <div className="flex flex-col items-start gap-3 text-sm text-gray-400">
                <Link to="/" className="transition hover:text-accent">
                  Home
                </Link>
                <Link to="/login" className="transition hover:text-accent">
                  Log In
                </Link>
                <Link to="/register" className="transition hover:text-accent">
                  Create Account
                </Link>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-bold text-white">Our Features</h3>
              <div className="flex flex-col gap-3 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faQrcode}
                    className="text-accent"
                  />
                  Digital QR passes
                </p>
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faShieldHalved}
                    className="text-accent"
                  />
                  M-Pesa payments
                </p>
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faRoute}
                    className="text-accent"
                  />
                  Flexible routes
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-bold text-white">Contact</h3>
              <div className="flex flex-col gap-4 text-sm text-gray-400">
                <p className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="mt-1 text-accent"
                  />
                  <span>Nairobi, Kenya</span>
                </p>
                <p className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="mt-1 text-accent"
                  />
                  <a
                    href="mailto:safaripass@example.com"
                    className="transition hover:text-accent"
                  >
                    safaripass@example.com
                  </a>
                </p>
                <p className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="mt-1 text-accent"
                  />
                  <span>Contact us for assistance</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              &copy; {new Date().getFullYear()} SafariPass. All rights reserved.
            </p>
            <p>Smarter journeys start with SafariPass.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
