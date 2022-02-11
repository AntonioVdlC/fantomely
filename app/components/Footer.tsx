import FooterSocial, { SocialPlatform } from "~/components/FooterSocial";

export default function Footer() {
  const navigation = [
    { name: "About", href: "/about" },
    { name: "Docs", href: "/docs" },
    { name: "Pricing", href: "/pricing" },
    { name: "Terms", href: "/terms" },
    { name: "Licence", href: "/licence" },
  ];
  const social: Array<{ name: SocialPlatform; href: string }> = [
    {
      name: "twitter",
      href: "https://twitter.com/fantome_ly",
    },
    {
      name: "github",
      href: "https://github.com/AntonioVdlC/analytics-service",
    },
  ];

  return (
    <footer className="mt-24 bg-slate-900 sm:mt-12">
      <div className="mx-auto max-w-md py-12 px-4 overflow-hidden sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <nav
          className="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          {navigation.map((item) => (
            <div key={item.name} className="px-5 py-2">
              <a
                href={item.href}
                className="text-base text-slate-400 hover:text-slate-300"
              >
                {item.name}
              </a>
            </div>
          ))}
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
          {social.map((item) => (
            <span key={item.name}>
              <FooterSocial {...item} />
            </span>
          ))}
        </div>
        <p className="mt-8 text-center text-base text-slate-400">
          Made with <span className="text-slate-300">&hearts;</span> by{" "}
          <a
            className="hover:underline "
            href="https://antoniovdlc.me"
            target="_blank"
            rel="noopener noreferrer"
          >
            Antonio Villagra De La Cruz
          </a>
        </p>
      </div>
    </footer>
  );
}
