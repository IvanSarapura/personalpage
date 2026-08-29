import Image from "next/image";
import Link from "next/link";
import blogVisual from "@/assets/blog/legal-engineering-log.png";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { localePath, type Locale } from "@/data/locale";
import { getPosts, type LocalizedPost } from "@/data/posts";
import { getUi } from "@/data/ui";
import styles from "./BlogIndex.module.css";
import { Badge } from "@/components/ui/badge";

interface BlogIndexProps {
  locale: Locale;
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-AR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

function formatDayMonth(iso: string, locale: Locale): string {
  const parts = new Intl.DateTimeFormat(locale === "es" ? "es-AR" : "en-US", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).formatToParts(new Date(`${iso}T00:00:00Z`));

  return parts
    .filter(({ type }) => type === "day" || type === "month")
    .map(({ value }) => value)
    .join(" ");
}

function postHref(locale: Locale, post: LocalizedPost): string {
  return localePath(locale, `/blog/${post.slug}`);
}

export default function BlogIndex({ locale }: BlogIndexProps) {
  const ui = getUi(locale).blog;
  const posts = getPosts(locale);
  const latestPost = posts[0];
  const featuredPost = posts[0];

  if (!latestPost || !featuredPost) return null;

  const archivePosts = posts.filter((post) => post.slug !== featuredPost.slug);

  return (
    <>
      <Section variant="elevated" paddingY="none" as="div" className={styles.heroSection}>
        <Container>
          <header className={styles.hero}>
            <h1 className={styles.title}>{ui.heading}</h1>

            <div className={styles.heroFooter}>
              <dl className={styles.heroMetrics}>
                <div className={styles.metric}>
                  <dt className={styles.metricLabel}>{ui.publications}</dt>
                  <dd className={styles.metricValue}>{String(posts.length).padStart(2, "0")}</dd>
                </div>
                <div className={styles.metric}>
                  <dt className={styles.metricLabel}>{ui.latestPublication}</dt>
                  <dd className={styles.metricValue}>
                    <time dateTime={latestPost.date}>
                      {formatDayMonth(latestPost.date, locale)}
                    </time>
                  </dd>
                </div>
              </dl>
            </div>
          </header>
        </Container>
      </Section>

      <Section
        variant="brand"
        paddingY="lg"
        as="section"
        className={styles.featuredSection}
        ariaLabelledBy="blog-featured-heading"
      >
        <Container>
          <div className={styles.sectionHeading}>
            <h2 id="blog-featured-heading">{ui.featured}</h2>
            <span aria-hidden="true" />
          </div>

          <article
            lang={featuredPost.lang}
            className={styles.featuredArticle}
            aria-labelledby={`featured-title-${featuredPost.slug}`}
          >
            <div className={styles.featuredImage}>
              <Image
                src={blogVisual}
                alt={ui.featuredImageAlt}
                sizes={`(max-width: 47.99rem) calc(100vw - ${2 * 24}px), (max-width: 1200px) 58vw, 672px`}
                preload
              />
            </div>

            <div className={styles.featuredBody}>
              <p className={styles.featuredMeta}>
                <time dateTime={featuredPost.date}>{formatDate(featuredPost.date, locale)}</time>
                <span aria-hidden="true">·</span>
                <span>
                  {featuredPost.readingMinutes} {ui.readingTime}
                </span>
              </p>

              <h3 id={`featured-title-${featuredPost.slug}`} className={styles.featuredTitle}>
                <Link href={postHref(locale, featuredPost)}>{featuredPost.title}</Link>
              </h3>

              <p className={styles.featuredDescription}>{featuredPost.description}</p>

              {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
              <ul role="list" className={styles.featuredTags} aria-label={ui.tagsLabel}>
                {featuredPost.tags.map((tag) => (
                  <li key={tag}>
                    <Badge>{tag}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </Container>
      </Section>

      <Section variant="elevated" paddingY="lg" as="section" ariaLabelledBy="blog-archive-heading">
        <Container>
          <div className={styles.archiveHeading}>
            <h2 id="blog-archive-heading">{ui.archive}</h2>
            <span>{String(archivePosts.length).padStart(2, "0")}</span>
          </div>

          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <ol role="list" className={styles.archiveList}>
            {archivePosts.map((post, index) => (
              <li key={post.slug} className={styles.archiveItem}>
                <article
                  lang={post.lang}
                  className={styles.archiveArticle}
                  aria-labelledby={`post-title-${post.slug}`}
                >
                  <span className={styles.archiveIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className={styles.archiveMeta}>
                    <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                    <span aria-hidden="true">·</span>
                    <span>
                      {post.readingMinutes} {ui.readingTime}
                    </span>
                  </p>

                  <div className={styles.archiveCopy}>
                    <h3 id={`post-title-${post.slug}`}>
                      <Link href={postHref(locale, post)}>
                        <span>{post.title}</span>
                      </Link>
                    </h3>
                    <p>{post.description}</p>
                  </div>

                  {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
                  <ul role="list" className={styles.archiveTags} aria-label={ui.tagsLabel}>
                    {post.tags.map((tag) => (
                      <li key={tag}>
                        <Badge variant="emphasis">{tag}</Badge>
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </>
  );
}
