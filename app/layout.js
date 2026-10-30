import "./globals.css";
import Script from "next/script";
import { SITE_URL, CLARITY_ID } from "./site";

const TITLE = "Aquib Israr: SEO, GEO & AEO Manager | The SEO ER";
const DESC = "Hire Aquib Israr, SEO manager & GEO/AEO specialist (Delhi NCR). ~5,000 leads a year from organic. Run a free live SEO checkup on your site.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  authors: [{ name: "Aquib Israr", url: "https://www.linkedin.com/in/aquibisrar/" }],
  openGraph: {
    type: "profile",
    url: "/",
    siteName: "Aquib's SEO Emergency Room",
    title: "Your rankings called. They want Aquib.",
    description: "SEO, GEO & AEO manager. Bring your website to the ER for a free live checkup (it's slightly rude). Then hire him.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Aquib's SEO Emergency Room: Your rankings called. They want Aquib." }],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your rankings called. They want Aquib.",
    description: "SEO, GEO & AEO manager. Free live SEO checkup inside.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23ffe500'/><text x='50' y='72' font-size='64' text-anchor='middle' font-family='Arial Black'>+</text></svg>",
  },
};

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: `${SITE_URL}/`,
      name: TITLE,
      inLanguage: "en-IN",
      mainEntity: { "@id": `${SITE_URL}/#person` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Aquib Israr",
      jobTitle: "SEO Manager | GEO & AEO Specialist",
      description: "SEO manager with 6+ years turning organic search into leads and revenue, specialising in GEO, AEO, technical and semantic SEO.",
      url: `${SITE_URL}/`,
      email: "mailto:aquibisrar1@gmail.com",
      image: `${SITE_URL}/og.jpg`,
      sameAs: ["https://www.linkedin.com/in/aquibisrar/"],
      address: { "@type": "PostalAddress", addressLocality: "Delhi", addressRegion: "Delhi NCR", addressCountry: "IN" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Jamia Millia Islamia" },
      knowsAbout: ["Search Engine Optimization", "Generative Engine Optimization", "Answer Engine Optimization", "Technical SEO", "Structured Data", "Google AI Overviews", "Google Search Console"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Aquib's SEO Emergency Room",
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <head>
        {/* Fallbacks only, for phones without Comic Sans / Impact (Android). Real 90s fonts come first. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Comic+Neue:wght@400;700&display=swap" rel="stylesheet" />
        {/* Practising what I preach: the SEO guy's site has schema. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </head>
      <body>
        {children}
        {CLARITY_ID && (
          <Script id="clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(CLARITY_ID)});`}
          </Script>
        )}
      </body>
    </html>
  );
}
