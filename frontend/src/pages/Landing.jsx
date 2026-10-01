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
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';

function Landing() {
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
    <div className="min-h-screen bg-background text-textdark">

      {/* Public Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="bg-white/95 backdrop-blur-md shadow-lg rounded-2xl px-5 py-3 flex items-center justify-between">
            
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-primary text-xl"
            >
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faBusSimple}
                  className="text-accent"
                />
              </div>
              SafariPass
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden sm:block px-4 py-2 text-sm font-medium text-primary hover:text-secondary transition"
              >
                Log In
              </Link>

              <Link
                to="/register"
                className="bg-accent text-primary font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[720px] flex items-center overflow-hidden">

        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1800&q=85"
            alt="City bus transportation"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-primary/85"></div>

          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/50"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left */}
            <div className="text-center lg:text-left">

              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                <span className="text-sm text-white/90">
                  Smarter commuting starts here
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Your Daily Commute,
                <span className="block text-accent">
                  Simplified.
                </span>
              </h1>

              <p className="text-lg text-gray-200 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                Subscribe to your preferred transport plan, pay with M-Pesa,
                and ride with a digital pass. SafariPass makes everyday
                commuting simpler, faster, and more convenient.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-accent text-primary font-bold px-7 py-3.5 rounded-lg hover:opacity-90 transition shadow-lg"
                >
                  Get Started
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center bg-white/10 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white/20 transition"
                >
                  Log In
                </Link>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-8 text-sm text-gray-200">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheck} className="text-accent" />
                  M-Pesa payments
                </div>

                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheck} className="text-accent" />
                  Digital QR pass
                </div>

                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheck} className="text-accent" />
                  Flexible plans
                </div>
              </div>
            </div>

            {/* QR Pass Visual */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">

                {/* Decorative Circle */}
                <div className="absolute -inset-8 bg-accent/10 rounded-full blur-2xl"></div>

                {/* Pass Card */}
                <div className="relative w-[350px] bg-white rounded-3xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition duration-500">

                  <div className="bg-primary px-6 py-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-300 uppercase tracking-wider">
                        Digital Transport Pass
                      </p>
                      <p className="text-white font-bold text-lg mt-1">
                        SafariPass
                      </p>
                    </div>

                    <FontAwesomeIcon
                      icon={faBusSimple}
                      className="text-accent text-2xl"
                    />
                  </div>

                  <div className="p-7">

                    <div className="flex justify-between mb-6">
                      <div>
                        <p className="text-xs text-gray-400">
                          PASSENGER
                        </p>
                        <p className="font-semibold text-primary mt-1">
                          Active Pass
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          STATUS
                        </p>
                        <p className="text-sm font-semibold text-secondary mt-1">
                          Active
                        </p>
                      </div>
                    </div>

                    {/* QR-style visual */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex justify-center">
                      <div className="w-40 h-40 grid grid-cols-8 gap-1">

                        {[
                          1, 1, 1, 0, 1, 1, 1, 1,
                          1, 0, 1, 1, 0, 1, 0, 1,
                          1, 1, 1, 0, 1, 0, 1, 1,
                          0, 1, 0, 1, 1, 1, 0, 0,
                          1, 1, 1, 0, 0, 1, 1, 1,
                          1, 0, 1, 1, 1, 0, 1, 0,
                          1, 1, 0, 1, 0, 1, 1, 1,
                          1, 0, 1, 1, 1, 0, 1, 1,
                        ].map((cell, index) => (
                          <div
                            key={index}
                            className={
                              cell
                                ? 'bg-primary rounded-[1px]'
                                : 'bg-white'
                            }
                          ></div>
                        ))}

                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                      <div>
                        <p className="text-xs text-gray-400">
                          PLAN
                        </p>
                        <p className="font-semibold text-textdark">
                          Monthly
                        </p>
                      </div>

                      <div className="bg-accent/15 text-primary px-3 py-1.5 rounded-full text-xs font-semibold">
                        VALID
                      </div>
                    </div>

                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -right-8 bottom-8 bg-white rounded-xl shadow-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faShieldHalved}
                      className="text-secondary"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">
                      Secure
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      Digital Payment
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Intro Strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid sm:grid-cols-3 gap-6 text-center sm:divide-x divide-gray-200">

            <div>
              <p className="text-2xl font-bold text-primary">
                Digital
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Transport subscriptions
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-primary">
                M-Pesa
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Convenient payments
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-primary">
                QR
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Simple fare validation
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose SafariPass */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3">
            Why SafariPass
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Built for the way you commute
          </h2>

          <p className="text-gray-500 leading-relaxed">
            Everything you need to make your everyday transport experience
            easier, more flexible, and more convenient.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >

              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary transition duration-300">
                <FontAwesomeIcon
                  icon={feature.icon}
                  className="text-secondary text-2xl group-hover:text-white transition duration-300"
                />
              </div>

              <h3 className="font-bold text-lg text-primary mb-3">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>

            </div>
          ))}

        </div>
      </section>

      {/* Transport Operators */}
      <section className="bg-primary py-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="max-w-2xl mb-14">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">
              Transport Partners
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose the transport that fits your journey
            </h2>

            <p className="text-gray-300 leading-relaxed">
              SafariPass brings your transport subscription experience into
              one convenient digital platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-7">

            {operators.map((operator) => (
              <div
                key={operator.name}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition duration-300"
              >

                <div className="h-56 overflow-hidden">
                  <img
                    src={operator.image}
                    alt={operator.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faBusSimple}
                        className="text-primary text-sm"
                      />
                    </div>

                    <h3 className="font-bold text-lg text-primary">
                      {operator.name}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    {operator.description}
                  </p>
                </div>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3">
              Simple Process
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              How SafariPass works
            </h2>

            <p className="text-gray-500">
              Get your digital transport pass and start your journey in four
              simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">

            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative text-center"
              >

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[65%] w-[70%] border-t-2 border-dashed border-gray-200"></div>
                )}

                <div className="relative z-10 w-20 h-20 mx-auto bg-background border border-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <FontAwesomeIcon
                    icon={step.icon}
                    className="text-secondary text-2xl"
                  />

                  <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-primary mb-3">
                  {step.title}
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 bg-background">

        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl bg-secondary px-8 py-16 md:px-16 text-center shadow-xl">

          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-32 -left-20 w-72 h-72 bg-primary/20 rounded-full"></div>

          <div className="relative z-10">

            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon
                icon={faBusSimple}
                className="text-accent text-2xl"
              />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to simplify your commute?
            </h2>

            <p className="text-gray-200 max-w-xl mx-auto mb-8">
              Create your SafariPass account today and experience a smarter
              way to manage your daily transport.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-accent text-primary font-bold px-8 py-3.5 rounded-lg hover:opacity-90 transition shadow-lg"
            >
              Get Started for Free
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-gray-300">

        <div className="max-w-7xl mx-auto px-6 py-14">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand */}
            <div>

              <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faBusSimple}
                    className="text-accent"
                  />
                </div>
                SafariPass
              </div>

              <p className="text-sm leading-relaxed max-w-xs">
                Digital commuter subscriptions and fare validation designed
                to make everyday transport simpler.
              </p>

            </div>

            {/* Quick Links */}
            <div>

              <h4 className="text-white font-semibold mb-4">
                Quick Links
              </h4>

              <ul className="space-y-3 text-sm">

                <li>
                  <Link
                    to="/"
                    className="hover:text-accent transition"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    to="/register"
                    className="hover:text-accent transition"
                  >
                    Get Started
                  </Link>
                </li>

                <li>
                  <Link
                    to="/login"
                    className="hover:text-accent transition"
                  >
                    Log In
                  </Link>
                </li>

              </ul>

            </div>

            {/* Contact */}
            <div>

              <h4 className="text-white font-semibold mb-4">
                Contact
              </h4>

              <ul className="space-y-4 text-sm">

                <li className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-accent mt-1"
                  />

                  <a
                    href="mailto:abigaelmwangi534@gmail.com"
                    className="hover:text-accent transition"
                  >
                    abigaelmwangi534@gmail.com
                  </a>
                </li>

                <li className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="text-accent mt-1"
                  />

                  <a
                    href="tel:+254720912466"
                    className="hover:text-accent transition"
                  >
                    +254 720 912 466
                  </a>
                </li>

                <li className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-accent mt-1"
                  />

                  <span>
                    Nairobi, Kenya
                  </span>
                </li>

              </ul>

            </div>

            {/* Social */}
            <div>

              <h4 className="text-white font-semibold mb-4">
                Follow Us
              </h4>

              <p className="text-sm mb-5">
                Stay connected with SafariPass.
              </p>

              <div className="flex gap-3">

                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition"
                >
                  <FontAwesomeIcon icon={faFacebook} />
                </a>

                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>

                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>

              </div>

            </div>

          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-400">

            <p>
             &copy; {new Date().getFullYear()} SafariPass. All rights reserved.
            </p>

            <p>
              Smart transport. Simple journeys.
            </p>

          </div>

        </div>
      </footer>

    </div>
  );
}

export default Landing;