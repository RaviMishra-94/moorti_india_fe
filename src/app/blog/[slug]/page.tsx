import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getPost(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/blog/${slug}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  
  if (!post) {
    return { title: 'Post Not Found | Moorti India' };
  }

  const title = `${post.title} | Moorti India Journal`;
  const description = post.excerpt || 'Read the full story on Moorti India.';
  const baseUrl = 'https://moortiindia.com.au';
  
  // Construct absolute image URL if a cover image exists
  let imageUrl = `${baseUrl}/images/og-image.jpg`; // Fallback image
  if (post.cover_image) {
    imageUrl = post.cover_image.startsWith('http') 
      ? post.cover_image 
      : `${baseUrl}${post.cover_image}`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/blog/${post.slug}`,
      siteName: 'Moorti India',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      authors: [post.author || 'Moorti India'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        {post.cover_image && (
          <div className={styles.heroImgWrap}>
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              className={styles.heroImg}
            />
            <div className={styles.heroOverlay} />
          </div>
        )}
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <span>{post.author}</span>
            {post.published_at && (
              <>
                <span className={styles.metaDot}>◆</span>
                <span>{formatDate(post.published_at)}</span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className={`texture-section relative ${styles.contentWrapper}`}>
        <div className="texture-overlay texture-lotus" />
        <div className="texture-vignette" />

        <div 
          className={`texture-content ${styles.content}`}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {post.tags && post.tags.length > 0 && (
          <div className={`relative z-10 ${styles.tags}`}>
            {post.tags.map((tag: string) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
