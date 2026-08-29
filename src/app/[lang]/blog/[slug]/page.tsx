import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import SectionLink from "@/components/SectionLink/SectionLink";
import { getPost, getPosts } from "@/data/posts";
import { hasLocale, localePath, LOCALES, type Locale } from "@/data/locale";
import { getUi } from "@/data/ui";
import styles from "./PostPage.module.css";

type PostPageProps = PageProps<"/[lang]/blog/[slug]">;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => getPosts().map((post) => ({ lang, slug: post.slug })));
}

/** Solo los slugs del registro existen; cualquier otro slug es 404. */
export const dynamicParams = false;

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const post = getPost(slug, lang);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: localePath(lang, `/blog/${post.slug}`),
      languages: {
        en: localePath("en", `/blog/${post.slug}`),
        es: localePath("es", `/blog/${post.slug}`),
        "x-default": localePath("en", `/blog/${post.slug}`),
      },
    },
    openGraph: {
      type: "article",
      publishedTime: post.date,
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-AR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export default async function PostPage({ params }: PostPageProps) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const post = getPost(slug, lang);
  if (!post) notFound();

  const ui = getUi(lang).blog;
  const { default: PostContent } = await import(`@/content/posts/${post.contentFile}.mdx`);

  return (
    <main id="main-content" tabIndex={-1}>
      <Section variant="surface" paddingY="lg" ariaLabel={post.title}>
        <Container>
          <div className="mx-auto max-w-[var(--content-max-text)]">
            <SectionLink
              href={localePath(lang, "/blog")}
              icon="arrowLeft"
              ariaLabel={ui.backToBlog}
            >
              {ui.backToBlog}
            </SectionLink>

            {/* El contenido se resuelve según la locale activa de la ruta. */}
            <article lang={lang}>
              <p className="mt-[var(--space-2)] mb-[var(--space-2)] text-[length:var(--caption)] leading-[var(--caption-lh)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--section-text-secondary)]">
                {formatDate(post.date, lang)} · {post.readingMinutes} {ui.readingTime}
              </p>

              <h1 className={styles.articleTitle}>{post.title}</h1>

              <PostContent />
            </article>
          </div>
        </Container>
      </Section>
    </main>
  );
}
