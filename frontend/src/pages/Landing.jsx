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
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-primary px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <FontAwesomeIcon icon={faBusSimple} className="text-accent" />
          SafariPass
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-white px-4 py-2 rounded-lg hover:bg-white/10 transition">
            Log In
          </Link>
          <Link to="/register" className="bg-accent text-primary font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80"
            alt="Nairobi commute"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Daily Commute, Simplified
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">
            Subscribe to weekly or monthly transport plans, pay with M-Pesa, and ride with a
            digital pass — no more counting coins every morning.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-accent text-primary font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white/10 text-white border border-white/40 font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-primary text-center mb-4">Why Choose SafariPass</h2>
        <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
          Built for how Nairobi actually moves — reliable, transparent, and always in your pocket.
        </p>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-secondary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faQrcode} className="text-secondary text-2xl" />
            </div>
            <h3 className="font-semibold text-textdark mb-2">Digital QR Pass</h3>
            <p className="text-sm text-gray-500">
              One scannable pass for your whole subscription — no paper, no fumbling for change.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-secondary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faShieldHalved} className="text-secondary text-2xl" />
            </div>
            <h3 className="font-semibold text-textdark mb-2">Secure M-Pesa Payments</h3>
            <p className="text-sm text-gray-500">
              Pay directly through M-Pesa — fast, familiar, and fully secure.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-secondary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faClock} className="text-secondary text-2xl" />
            </div>
            <h3 className="font-semibold text-textdark mb-2">Never Lose Unused Days</h3>
            <p className="text-sm text-gray-500">
              Didn't ride today? Your subscription automatically extends by a day.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-secondary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faRoute} className="text-secondary text-2xl" />
            </div>
            <h3 className="font-semibold text-textdark mb-2">Flexible Route Shifting</h3>
            <p className="text-sm text-gray-500">
              Need a different route for a few days? Switch temporarily, hassle-free.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Sign Up', desc: 'Create your free SafariPass account in seconds.' },
              { step: '2', title: 'Choose a Plan', desc: 'Pick your company, route, and subscription plan.' },
              { step: '3', title: 'Pay via M-Pesa', desc: 'Complete payment securely through M-Pesa.' },
              { step: '4', title: 'Ride with Your QR Pass', desc: 'Show your pass to the conductor and go.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-textdark mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Ready to skip the queue?</h2>
        <p className="text-gray-500 mb-8">Join SafariPass today and make your commute effortless.</p>
        <Link
          to="/register"
          className="bg-accent text-primary font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition inline-block"
        >
          Get Started for Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <FontAwesomeIcon icon={faBusSimple} className="text-accent" />
              SafariPass
            </div>
            <p className="text-sm">
              Digital commuter subscriptions and fare validation, built for Kenyan matatus.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-accent transition">Get Started</Link></li>
              <li><Link to="/login" className="hover:text-accent transition">Log In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-accent" />
                support@safaripass.co.ke
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="text-accent" />
                +254 700 000 000
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="text-accent" />
                Nairobi, Kenya
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Follow Us</h4>
            <div className="flex gap-4 text-xl">
              <a href="#" className="hover:text-accent transition"><FontAwesomeIcon icon={faFacebook} /></a>
              <a href="#" className="hover:text-accent transition"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="#" className="hover:text-accent transition"><FontAwesomeIcon icon={faInstagram} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} SafariPass. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Landing;