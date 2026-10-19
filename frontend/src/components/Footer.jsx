import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-300">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">

            <Link
              to="/"
              className="flex items-center gap-2"
            >
              <span className="text-2xl">
                ⚡
              </span>

              <span className="text-xl font-bold text-white">
                Xaaji Electronics
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              Reliable electrical services built around quality,
              safety, communication, and customer trust.
            </p>

            <Link
              to="/request-service"
              className="mt-6 inline-block rounded-lg bg-yellow-500 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-yellow-400"
            >
              Request a Service
            </Link>

          </div>

          {/* Quick Links */}
          <div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <Link
                  to="/"
                  className="text-sm transition hover:text-yellow-400"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/services"
                  className="text-sm transition hover:text-yellow-400"
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  to="/electricians"
                  className="text-sm transition hover:text-yellow-400"
                >
                  Find an Electrician
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="text-sm transition hover:text-yellow-400"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-sm transition hover:text-yellow-400"
                >
                  Contact
                </Link>
              </li>

            </ul>

          </div>

          {/* Services */}
          <div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Our Services
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <Link
                  to="/services"
                  className="text-sm transition hover:text-yellow-400"
                >
                  Electrical Wiring
                </Link>
              </li>

              <li>
                <Link
                  to="/services"
                  className="text-sm transition hover:text-yellow-400"
                >
                  Electrical Repairs
                </Link>
              </li>

              <li>
                <Link
                  to="/services"
                  className="text-sm transition hover:text-yellow-400"
                >
                  Lighting Installation
                </Link>
              </li>

              <li>
                <Link
                  to="/services"
                  className="text-sm transition hover:text-yellow-400"
                >
                  Electrical Installation
                </Link>
              </li>

              <li>
                <Link
                  to="/services"
                  className="text-sm transition hover:text-yellow-400"
                >
                  Maintenance
                </Link>
              </li>

            </ul>

          </div>

          {/* Contact */}
          <div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h3>

            <div className="mt-5 space-y-4">

              <div className="flex items-start gap-3">
                <span className="text-yellow-500">
                  📍
                </span>

                <p className="text-sm leading-6">
                  Nairobi, Kenya
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-yellow-500">
                  📞
                </span>

                <p className="text-sm leading-6">
                  +254 XXX XXX XXX
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-yellow-500">
                  ✉️
                </span>

                <p className="break-all text-sm leading-6">
                  info@xaajielectronics.com
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-yellow-500">
                  🕒
                </span>

                <p className="text-sm leading-6">
                  Mon - Sat: 8:00 AM - 6:00 PM
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

          <p className="text-center text-sm text-gray-500 md:text-left">
            © {currentYear} Xaaji Electronics. All rights reserved.
          </p>

          <div className="flex justify-center gap-5">

            <a
              href="#"
              className="text-sm text-gray-500 transition hover:text-yellow-400"
            >
              Facebook
            </a>

            <a
              href="#"
              className="text-sm text-gray-500 transition hover:text-yellow-400"
            >
              Instagram
            </a>

            <a
              href="#"
              className="text-sm text-gray-500 transition hover:text-yellow-400"
            >
              WhatsApp
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;