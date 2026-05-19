'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/api';
import type { Product } from '@/lib/types';
import styles from './Navbar.module.css';

export default function Navbar({ categories }: { categories: { slug: string; name: string }[] }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileSearchFocused, setMobileSearchFocused] = useState(false);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    if (searchOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() || searchCategory) {
      setSearchOpen(false);
      const q = new URLSearchParams();
      if (searchQuery.trim()) q.set('q', searchQuery.trim());
      if (searchCategory) q.set('category', searchCategory);
      router.push(`/search?${q.toString()}`);
      setSearchQuery('');
      setSearchCategory(null);
    }
  };

  useEffect(() => {
    const debounceId = setTimeout(async () => {
      if (!searchQuery.trim() && !searchCategory) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      const results = await getProducts({
        searchQuery: searchQuery.trim(),
        categorySlug: searchCategory || undefined,
      });
      setSearchResults(results.slice(0, 5));
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(debounceId);
  }, [searchQuery, searchCategory]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        setMobileSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen || searchOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, searchOpen]);

  return (
    <>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <span className="label-sm" style={{ color: 'var(--gold)', letterSpacing: '0.15em' }}>
          ✦ &nbsp;Handcrafted in Jaipur since 1985 &nbsp;·&nbsp; Worldwide Shipping &nbsp;·&nbsp; Custom Orders Welcome &nbsp;✦
        </span>
      </div>

      {/* Main Navbar */}
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navInner}>

          {/* Logo */}
          <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
            <Image
              src="/images/logo.webp"
              alt="Moorti India Logo"
              width={140}
              height={36}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>Home</Link>

            {/* Collections Dropdown */}
            <div
              className={styles.dropdown}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className={`${styles.navLink} ${styles.dropdownTrigger}`}>
                Collections
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className={`${styles.dropdownMenu} ${dropdownOpen ? styles.dropdownMenuOpen : ''}`}>
                <div className={styles.dropdownGrid}>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/collections/${cat.slug}`}
                      className={styles.dropdownItem}
                      onClick={() => setDropdownOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <div className={styles.dropdownFooter}>
                  <Link href="/collections" className="btn btn-outline" style={{ fontSize: '0.7rem' }}>
                    View All Collections →
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/about" className={styles.navLink}>Our Story</Link>
            <Link href="/process" className={styles.navLink}>Craftsmanship</Link>
          </div>

          {/* Right CTAs */}
          <div className={styles.navRight}>
            <button aria-label="Search" className={styles.searchBtn} onClick={() => setSearchOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            <Link href="/contact" className={`btn btn-outline ${styles.enquireBtn}`}>
              Enquire Now
            </Link>
            <a href="https://wa.me/919958476169" target="_blank" rel="noopener noreferrer" className={styles.phoneLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              +91 99584 76169
            </a>

            {/* Mobile Hamburger */}
            <button
              className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              id="nav-hamburger"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayOpen : ''}`} onClick={() => setMenuOpen(false)} />
      <div className={`${styles.mobileDrawer} ${menuOpen ? styles.mobileDrawerOpen : ''}`}>
        <div className={styles.mobileHeader}>
          <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
            <Image
              src="/images/logo.webp"
              alt="Moorti India Logo"
              width={140}
              height={36}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>
          <button className={styles.closeBtn} onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
        </div>

        <nav className={styles.mobileNav}>
          {/* Mobile Search */}
          <div className={styles.mobileSearchWrap} ref={mobileSearchRef}>
            <form onSubmit={handleSearch} className={styles.mobileSearchForm}>
              <input
                type="text"
                placeholder="Search..."
                className={styles.mobileSearchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setMobileSearchFocused(true)}
              />
              {searchQuery && (
                <button type="button" className={styles.mobileSearchClearBtn} onClick={() => setSearchQuery('')} aria-label="Clear search">
                  ✕
                </button>
              )}
              <button type="submit" aria-label="Search" className={styles.mobileSearchSubmit}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </form>
            {searchQuery && mobileSearchFocused && (
              <div className={styles.mobileSearchResults}>
                {isSearching ? (
                  <div className={styles.searchLoading}>Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className={styles.searchResultItem}
                      onClick={() => { setMenuOpen(false); setSearchQuery(''); }}
                    >
                      <div className={styles.searchResultImageWrap}>
                        <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div className={styles.searchResultInfo}>
                        <h4>{product.name}</h4>
                        <span className="label-sm" style={{ color: 'var(--gold-dim)' }}>{product.material}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className={styles.searchNoResults}>No sculptures found.</div>
                )}
              </div>
            )}
          </div>
          
          <Link href="/" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Home</Link>
          <div className={styles.mobileSection}>
            <button 
              className={styles.mobileNavLink} 
              onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                width: '100%', 
                textAlign: 'left', 
                borderBottom: 'none', 
                padding: 0 
              }}
            >
              Collections
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 12 12" 
                fill="none" 
                style={{ 
                  transform: mobileCollectionsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                  color: 'var(--gold)'
                }}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {mobileCollectionsOpen && (
              <div style={{ paddingTop: '0.8rem', paddingBottom: '0.2rem' }}>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/collections/${cat.slug}`}
                    className={styles.mobileCatLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/about" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Our Story</Link>
          <Link href="/process" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Craftsmanship</Link>
          <Link href="/contact" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Contact</Link>
        </nav>

        <div className={styles.mobileFooter}>
          <Link href="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Request Custom Order
          </Link>
          <a href="https://wa.me/919958476169" target="_blank" rel="noopener noreferrer" className={styles.mobilePhone}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            +91 99584 76169
          </a>
        </div>
      </div>

      {/* Search Overlay */}
      <div className={`${styles.searchOverlay} ${searchOpen ? styles.searchOverlayOpen : ''}`}>
        <button className={styles.searchOverlayClose} onClick={() => setSearchOpen(false)} aria-label="Close search" />
        <div className={styles.searchModal}>
          
          <div className={styles.searchContainer}>
            {/* Search Input Bar */}
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <div className={styles.searchIconWrap}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="What are you looking for?"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={(input) => {
                  if (input && searchOpen) input.focus();
                }}
              />
              {searchQuery && (
                <button type="button" className={styles.searchClearBtn} onClick={() => setSearchQuery('')} aria-label="Clear search">
                  ✕
                </button>
              )}
              <button type="submit" className={styles.searchSubmit} aria-label="Submit search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </form>

            {/* Category Chips */}
            <div className={styles.searchChips}>
              <button 
                type="button"
                className={`${styles.searchChip} ${!searchCategory ? styles.searchChipActive : ''}`}
                onClick={() => setSearchCategory(null)}
              >
                ALL SCULPTURES
              </button>
              {categories.slice(0, 4).map(cat => (
                <button 
                  type="button"
                  key={cat.slug}
                  className={`${styles.searchChip} ${searchCategory === cat.slug ? styles.searchChipActive : ''}`}
                  onClick={() => setSearchCategory(cat.slug)}
                >
                  {cat.name.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Live Results Dropdown */}
            {(searchQuery || searchCategory) && (
              <div className={styles.searchResultsDropdown}>
                {isSearching ? (
                  <div className={styles.searchLoading}>Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className={styles.searchResultItem}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchCategory(null); }}
                    >
                      <div className={styles.searchResultImageWrap}>
                        <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div className={styles.searchResultInfo}>
                        <h4>{product.name}</h4>
                        <span className="label-sm" style={{ color: 'var(--gold-dim)' }}>{product.material}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className={styles.searchNoResults}>No sculptures found.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
