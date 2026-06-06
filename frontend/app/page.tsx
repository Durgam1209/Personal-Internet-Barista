// frontend/app/page.tsx

interface Digest {
  generated_at: string
  espresso: {
    headline: string
    body: string
    source_url: string
  }
  cold_brew: {
    title: string
    summary: string
    takeaways: string[]
    source_url: string
  }
  pastry: {
    title: string
    why_it_matters: string
    link: string
  }
}

async function getDigest(): Promise<Digest> {
  try {
    const res = await fetch("http://localhost:8000/digest", {
      cache: "no-store",
      signal: AbortSignal.timeout(5000)
    })
    if (!res.ok) throw new Error("API failed")
    return res.json()
  } catch {
    // fallback mock data if API not running
    return {
      generated_at: new Date().toISOString(),
      espresso: {
        headline: "DigitalPlat launches FreeDomain to give everyone a free custom domain",
        body: "DigitalPlat's FreeDomain project aims to provide free custom domains to anyone, lowering the barrier to web presence. The initiative aggregates domain registration APIs and offers a unified interface for developers. Its impact could accelerate adoption of personal websites and democratize online identity.",
        source_url: "https://github.com/DigitalPlatDev/FreeDomain"
      },
      cold_brew: {
        title: "Crawl4AI: Open-source LLM Friendly Web Crawler & Scraper",
        summary: "Crawl4AI is an open-source web crawler designed specifically for large language models, enabling them to retrieve and parse web content efficiently while respecting site policies. It provides a simple API, handles pagination, and extracts structured data suitable for LLM ingestion.",
        takeaways: [
          "Abstracts away site-specific scraping so LLMs focus on content not parsing",
          "Built-in politeness mechanisms reduce the risk of being blocked",
          "Modular design encourages community contributions for new crawling patterns"
        ],
        source_url: "https://github.com/unclecode/crawl4ai"
      },
      pastry: {
        title: "gstack — 23 opinionated Claude Code tools",
        why_it_matters: "gstack bundles tools that automate the full software lifecycle from design to QA, reducing context switching for developers. It provides a ready-made end-to-end workflow that streamlines deployment and maintenance.",
        link: "https://github.com/garrytan/gstack"
      }
    }
  }
}

export default async function Home() {
  const digest = await getDigest()
  const date = new Date(digest.generated_at).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  })

  return (
    <main>

      {/* FLOATING LEAVES */}
      <div className="floaties" aria-hidden="true">
        {["🍃","🌿","🍃","🌿","🍃","🌿","🍃","🍃"].map((l, i) => (
          <span key={i} className={`leaf leaf-${i+1}`}>{l}</span>
        ))}
      </div>

      {/* SIDE DECORATIONS */}
      <div className="side-deco side-left" aria-hidden="true">
        {["🌿","🍃","🌱","🍃","🌿"].map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
      <div className="side-deco side-right" aria-hidden="true">
        {["🌿","🍃","🌱","🍃","🌿"].map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>

      {/* WRAPPER */}
      <div className="wrapper">

        {/* HEADER */}
        <header>
          <div className="cafe-sign">
            <div className="logo-text">
              <em>personal</em>.cafe
            </div>
            <div className="logo-tagline">your daily engineering digest ✨</div>
          </div>

          {/* CUPS */}
          <div className="cup-row" aria-hidden="true">
            <div className="cup"><span className="steam">〰</span>☕</div>
            <div className="cup"><span className="steam">〰</span>🧋</div>
            <div className="cup"><span className="steam">〰</span>🍵</div>
          </div>

          <div className="date-badge">
            🌿 Today&apos;s Brew · {date}
          </div>
        </header>

        {/* TOP ANIMALS */}
        <div className="animals-row" aria-hidden="true">
          {[
            { e: "🦔", l: "hedgehog barista" },
            { e: "🐇", l: "bunny reader" },
            { e: "🦊", l: "fox developer" },
            { e: "🐻", l: "bear engineer" },
            { e: "🐱", l: "cat designer" },
          ].map((a, i) => (
            <span key={i} className="animal" title={a.l}>{a.e}</span>
          ))}
        </div>

        {/* WELCOME */}
        <div className="welcome">
          <p className="welcome-text">
            Good morning! Your AI barista has been up since 2am<br />
            brewing today&apos;s most important engineering stories. ☀️
          </p>
        </div>

        {/* CARDS */}
        <div className="cards">

          {/* ESPRESSO */}
          <article className="card card-espresso">
            <div className="card-head">
              <div className="card-icon-wrap">
                <span className="icon-emoji">☕</span>
              </div>
              <div className="card-meta">
                <div className="card-type">☕ Espresso Shot</div>
                <div className="card-subtitle">3-sentence brief · biggest story today</div>
              </div>
            </div>
            <h2 className="card-title">{digest.espresso.headline}</h2>
            <p className="card-body">{digest.espresso.body}</p>
            <div className="card-divider" />
            <a href={digest.espresso.source_url} target="_blank" rel="noopener noreferrer" className="card-link">
              Read source 🍃
            </a>
          </article>

          {/* COLD BREW */}
          <article className="card card-coldbrew">
            <div className="card-head">
              <div className="card-icon-wrap">
                <span className="icon-emoji">🧊</span>
              </div>
              <div className="card-meta">
                <div className="card-type">🧊 Cold Brew</div>
                <div className="card-subtitle">deep dive · learn something today</div>
              </div>
            </div>
            <h2 className="card-title">{digest.cold_brew.title}</h2>
            <p className="card-body">{digest.cold_brew.summary}</p>
            <ul className="takeaways">
              {digest.cold_brew.takeaways.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
            <div className="card-divider" />
            <a href={digest.cold_brew.source_url} target="_blank" rel="noopener noreferrer" className="card-link">
              Read source 🌿
            </a>
          </article>

          {/* PASTRY */}
          <article className="card card-pastry">
            <div className="card-head">
              <div className="card-icon-wrap">
                <span className="icon-emoji">🥐</span>
              </div>
              <div className="card-meta">
                <div className="card-type">🥐 Daily Pastry</div>
                <div className="card-subtitle">gem of the day · bookmark this</div>
              </div>
            </div>
            <h2 className="card-title">{digest.pastry.title}</h2>
            <p className="card-body">{digest.pastry.why_it_matters}</p>
            <div className="card-divider" />
            <a href={digest.pastry.link} target="_blank" rel="noopener noreferrer" className="card-link">
              View repo 🍃
            </a>
          </article>

        </div>

        {/* BOTTOM ANIMALS */}
        <div className="animals-row" aria-hidden="true">
          {["🐝","🦋","🐛","🦋","🐝"].map((a, i) => (
            <span key={i} className="animal">{a}</span>
          ))}
        </div>

      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-fence" aria-hidden="true">🌿 🍃 🌱 🍃 🌿 🍃 🌱 🍃 🌿</div>
        <p className="footer-text">
          <em>personal.cafe</em> · brewed fresh every morning by AI · no noise, only signal
        </p>
      </footer>

    </main>
  )
}