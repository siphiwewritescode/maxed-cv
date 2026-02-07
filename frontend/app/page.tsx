export default function Home() {
  return (
    <main style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
    }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '4rem 0',
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 700,
          marginBottom: '1rem',
          color: '#0070f3',
        }}>
          Maxed-CV
        </h1>
        <p style={{
          fontSize: '1.5rem',
          color: '#666',
          marginBottom: '2rem',
        }}>
          AI-Powered CV Tailoring for the South African Job Market
        </p>
        <p style={{
          fontSize: '1.125rem',
          maxWidth: '700px',
          margin: '0 auto 2rem',
          lineHeight: '1.8',
        }}>
          Stop losing opportunities to generic CVs. Tailor your CV to match any job
          description in seconds, pass ATS filters, and land more interviews.
        </p>
      </section>

      {/* Value Proposition */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '3rem 0',
      }}>
        <div style={{
          padding: '2rem',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: '#0070f3',
          }}>
            1. Paste Job URL
          </h2>
          <p>
            Simply paste the URL of any South African job posting. Our AI analyzes
            the requirements, skills, and keywords employers are looking for.
          </p>
        </div>

        <div style={{
          padding: '2rem',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: '#0070f3',
          }}>
            2. AI Tailors Your CV
          </h2>
          <p>
            Advanced AI rewrites your CV to highlight relevant experience, match
            job keywords, and optimize for both ATS systems and human recruiters.
          </p>
        </div>

        <div style={{
          padding: '2rem',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: '#0070f3',
          }}>
            3. Download & Apply
          </h2>
          <p>
            Get your professionally formatted, ATS-optimized CV in seconds.
            Download as PDF and submit with confidence.
          </p>
        </div>
      </section>

      {/* SA-Specific Messaging */}
      <section style={{
        textAlign: 'center',
        background: '#f5f5f5',
        margin: '2rem -2rem',
        padding: '3rem 2rem',
      }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
        }}>
          Built for the South African Job Market
        </h2>
        <p style={{
          fontSize: '1.125rem',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.8',
        }}>
          We understand the unique challenges of the SA job market. Our AI is trained
          on South African English conventions, includes notice period fields standard
          in SA applications, and respects local privacy regulations.
        </p>
      </section>

      {/* Call to Action */}
      <section style={{
        textAlign: 'center',
        padding: '4rem 0',
      }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '1.5rem',
        }}>
          Ready to maximize your CV?
        </h2>
        <div style={{
          padding: '1rem 2rem',
          fontSize: '1.125rem',
          background: '#e0e0e0',
          border: '2px dashed #999',
          borderRadius: '8px',
          display: 'inline-block',
          color: '#666',
        }}>
          Get Started (Authentication coming in Phase 2)
        </div>
        <p style={{
          marginTop: '1rem',
          fontSize: '0.875rem',
          color: '#999',
        }}>
          Free during beta. No credit card required.
        </p>
      </section>
    </main>
  );
}
