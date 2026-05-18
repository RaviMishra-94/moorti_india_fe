import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Journal & Insights | Moorti India',
  description: 'Read stories, insights, and updates from the artisans of Moorti India.',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getPosts() {
  try {
    const res = await fetch(`${API_URL}/api/blog?published=true`, {
      next: { revalidate: 60 } // Revalidate every minute
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/images/hero_blog.png"
            alt="Artisan hands resting on Makrana marble with a journal"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <span className="label-sm section-label">Journal</span>
          <h1 className="display-lg" style={{ marginTop: 'var(--space-4)' }}>
            Insights from the <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>workshop</em>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-5)', maxWidth: '560px', lineHeight: '1.7' }}>
            Discover stories of our artisans, updates on our craftsmanship, and reflections on the spiritual journey of marble.
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <section className="texture-section section">
        <div className="texture-overlay texture-lotus" />
        <div className="texture-vignette" />

        <div className="container texture-content">
          {posts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No stories published yet. Check back soon.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {posts.map((post: any) => (
                <div key={post.id} style={{ position: 'relative' }}>
                  {/* Subtle column glow behind the card on hover */}
                  <div className={styles.cardGlow} />
                  <Link href={`/blog/${post.slug}`} className={styles.card}>
                    <div className={styles.cardImgWrap}>
                      {post.cover_image ? (
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          className={styles.cardImg}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'var(--border-subtle)' }} />
                      )}
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.cardMeta}>
                        <span>{post.author}</span>
                        {post.published_at && (
                          <>
                            <span>•</span>
                            <span>{formatDate(post.published_at)}</span>
                          </>
                        )}
                      </div>
                      <h2 className={styles.cardTitle}>{post.title}</h2>
                      {post.excerpt && <p className={styles.cardExcerpt}>{post.excerpt}</p>}
                      <div className={styles.cardFooter}>
                        Read Story <span aria-hidden="true">→</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
