import "./globals.css";

export const metadata = {
  title: "Aquib's SEO Emergency Room™®!!! | Hire Aquib Israr (SEO, GEO, AEO)",
  description:
    "Aquib Israr: SEO Manager and GEO/AEO specialist. Bring your website to the ER for a live checkup, watch him fight the Core Update, catch the AI Overview raccoon, then hire him.",
  openGraph: {
    title: "Aquib's SEO Emergency Room™®!!!",
    description: "Your rankings called. They want Aquib. Free live site checkup inside.",
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23ffe500'/><text x='50' y='72' font-size='64' text-anchor='middle' font-family='Arial Black'>+</text></svg>",
  },
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aquib Israr",
  jobTitle: "SEO Manager | GEO & AEO Specialist",
  email: "mailto:aquibisrar1@gmail.com",
  sameAs: ["https://www.linkedin.com/in/aquibisrar/"],
  address: { "@type": "PostalAddress", addressLocality: "Delhi", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Jamia Millia Islamia" },
  knowsAbout: ["Search Engine Optimization", "Generative Engine Optimization", "Answer Engine Optimization", "Technical SEO", "Structured Data", "Google AI Overviews"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Fallbacks only, for phones without Comic Sans / Impact (Android). Real 90s fonts come first. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Comic+Neue:wght@400;700&display=swap" rel="stylesheet" />
        {/* Practising what I preach: the SEO guy's site has schema. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
