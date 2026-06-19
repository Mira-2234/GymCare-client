import Link from "next/link";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Classes", href: "/classes" },
  { label: "Community Forum", href: "/forum" },
  { label: "Login", href: "/login" },
];

// Official "X" mark (replaces the old Twitter bird) — required by spec.
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 1200 1227" fill="currentColor" aria-hidden="true">
      <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L466.756 681.821L0 1226.37H105.866L515.491 750.218L843.673 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1036.57 1146.78H873.96L569.165 687.854V687.828Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.5 9.95v-7.05H7.9v-2.9h2.6V9.8c0-2.57 1.53-3.99 3.87-3.99 1.12 0 2.3.2 2.3.2v2.53h-1.3c-1.28 0-1.68.8-1.68 1.62v1.94h2.86l-.46 2.9h-2.4v7.05A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "X", href: "https://x.com/ironpulse", Icon: XIcon },
  { label: "Instagram", href: "https://instagram.com/ironpulse", Icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com/ironpulse", Icon: FacebookIcon },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#14151A] px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Logo + tagline */}
        <div>
          <span className="text-lg font-extrabold uppercase tracking-tight text-[#F5F3EF]">
            Iron<span className="text-[#FF5B3C]">Pulse</span>
          </span>
          <p className="mt-3 max-w-[220px] text-xs text-[#9A9CA6]">
            Book classes, find trainers, and stay accountable to your training.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[#9A9CA6]">Quick Links</p>
          <ul className="flex flex-col gap-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-[#F5F3EF]/90 hover:text-[#FF5B3C]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info — replace with your real details */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[#9A9CA6]">Contact</p>
          <ul className="flex flex-col gap-2 text-sm text-[#F5F3EF]/90">
            <li>hello@ironpulse.com</li>
            <li>+880 1XXX-XXXXXX</li>
            <li>Dhaka, Bangladesh</li>
          </ul>
        </div>

        {/* Social links */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[#9A9CA6]">Follow</p>
          <div className="flex gap-3">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1C1E24] text-[#F5F3EF] transition-colors hover:bg-[#FF5B3C] hover:text-[#1A0703]"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-center text-xs text-[#9A9CA6]">
        © {year} IronPulse. All rights reserved.
      </div>
    </footer>
  );
}