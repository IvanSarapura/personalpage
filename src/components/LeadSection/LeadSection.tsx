import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";

const btnBase =
  "inline-flex items-center justify-center rounded-[var(--btn-radius)] border-[length:var(--border-width-thin)] border-solid border-[color:var(--text-on-light)] px-[var(--btn-padding-x-sm)] py-[var(--btn-padding-y-sm)] text-[length:var(--label)] font-normal tracking-[var(--letter-spacing-wide)] no-underline cursor-pointer [transition:var(--transition-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-blue-screen)] max-[768px]:w-full max-[768px]:text-center";

const btnWhite =
  "bg-transparent text-[var(--text-on-light)] hover:bg-[var(--text-on-light)] hover:text-[var(--color-white-pure)] dark:hover:text-[var(--color-deep)]";

const btnBlue =
  "bg-[var(--text-on-light)] text-[var(--color-white-pure)] dark:text-[var(--color-deep)] hover:bg-transparent hover:text-[var(--text-on-light)] dark:hover:text-[var(--color-white-pure)]";

export default function LeadSection() {
  return (
    <Section variant="white" paddingY="none" ariaLabel="Introduction" id="home">
      <div className="py-[var(--section-padding-y)] max-[768px]:py-[var(--section-padding-y-mobile)]">
        <Container>
          <h1 className="mb-[var(--element-gap)] text-[length:var(--display-2)] leading-[var(--display-2-lh)] font-normal tracking-[var(--display-2-tracking)] text-[var(--text-on-light)] max-[768px]:mb-[var(--element-gap-sm)] max-[768px]:text-[length:var(--heading-1)] max-[768px]:leading-[var(--heading-1-lh)] max-[768px]:tracking-[var(--heading-1-tracking)]">
            Find why your restaurant guests leave and win them back.
          </h1>

          <p className="mb-[var(--content-gap)] max-w-[var(--content-max-text)] text-[length:var(--body-large)] leading-[var(--body-large-lh)] font-normal tracking-[var(--letter-spacing-snug)] text-[var(--text-on-light)] opacity-[var(--opacity-strong)] max-[768px]:mb-[var(--content-gap-mobile)] max-[768px]:text-[length:var(--body)]">
            AI Customer Intelligence for restaurants that pinpoints where you&apos;re
            losing&nbsp;money in the customer experience journey, reveals revenue risk, and drives
            growth across every branch and location.
          </p>

          <div className="flex items-center gap-[var(--element-gap)] max-[768px]:flex-col max-[768px]:items-start">
            <Link href="/demo" className={`${btnBase} ${btnWhite}`}>
              Book a Demo
            </Link>
            <Link href="/demo" className={`${btnBase} ${btnBlue}`}>
              Free CX Health Check
            </Link>
          </div>
        </Container>
      </div>

      <div className="relative aspect-[21/9] w-full overflow-hidden max-[768px]:aspect-[16/9]">
        <Image
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&h=700&fit=crop"
          alt="Modern restaurant interior with warm lighting"
          fill
          sizes="100vw"
          priority
          quality={85}
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNiODdhNWMiLz48cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjYzQ4YTZhIiBvcGFjaXR5PSIwLjUiLz48cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjYTA2ODQ4IiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4="
        />
      </div>
    </Section>
  );
}
