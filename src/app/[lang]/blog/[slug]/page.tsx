import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { getPost, getPosts } from "@/data/posts";
import { hasLocale, localePath, LOCALES, type Locale } from "@/data/locale";
import { getUi } from "@/data/ui";

type PostPageProps = PageProps<"/[lang]/blog/[slug]">;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => getPosts().map((post) => ({ lang, slug: post.slug })));
}

/** Solo los slugs del registro existen; cualquier otro slug es 404. */
export const dynamicParams = false;

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: localePath(lang, `/blog/${post.slug}`),
      languages: {
        en: `/blog/${post.slug}`,
        es: `/es/blog/${post.slug}`,
        "x-default": `/blog/${post.slug}`,
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

const linkClass =
  "text-[length:var(--body)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--text-on-light)] underline underline-offset-4 [transition:var(--transition-hover)] hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--color-blue-screen)]";

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

  const post = getPost(slug);
  if (!post) notFound();

  const ui = getUi(lang).blog;
  const { default: PostContent } = await import(`@/content/posts/${slug}.mdx`);

  return (
    <main id="main-content">
      <Section variant="white" paddingY="lg" ariaLabel={post.title}>
        <Container>
          <div className="mx-auto max-w-[var(--content-max-text)]">
            <Link href={localePath(lang, "/blog")} className={linkClass}>
              {ui.backToBlog}
            </Link>

            {/* El contenido del post es monolingüe: se declara su idioma real
                para lectores de pantalla cuando difiere del chrome. */}
            <article lang={post.lang}>
              <p className="mt-[var(--content-gap)] mb-[var(--space-2)] text-[length:var(--caption)] leading-[var(--caption-lh)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--text-on-light)] opacity-[var(--opacity-subtle)]">
                {formatDate(post.date, lang)} · {post.readingMinutes} {ui.readingTime}
              </p>

              <h1 className="mb-[var(--content-gap)] text-[length:var(--heading-1)] leading-[var(--heading-1-lh)] font-normal tracking-[var(--heading-1-tracking)] text-[var(--text-on-light)]">
                {post.title}
              </h1>

              <PostContent />
            </article>
          </div>
        </Container>
      </Section>
    </main>
  );
}
