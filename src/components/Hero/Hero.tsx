import Image from "next/image";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import ModuleList from "../ModuleList/ModuleList";

export default function Hero() {
  return (
    <Section variant="blue" paddingY="lg" ariaLabel="Product modules" id="modules">
      <Container>
        <h2 className="mb-[var(--section-gap)] text-[length:var(--display-2)] leading-[var(--display-2-lh)] font-normal tracking-[var(--display-2-tracking)] text-[var(--text-primary)] max-[768px]:mb-[var(--space-6)] max-[768px]:text-[length:var(--heading-1)] max-[768px]:leading-[var(--heading-1-lh)] max-[768px]:tracking-[var(--heading-1-tracking)]">
          Sira doesn&apos;t just show what&apos;s wrong, It fixes it
        </h2>

        <div className="grid grid-cols-2 items-start gap-[var(--content-gap)] max-[1024px]:gap-[var(--content-gap-mobile)] max-[768px]:grid-cols-1 max-[768px]:gap-[var(--space-6)]">
          <div className="relative aspect-[4/5] w-full overflow-hidden max-[768px]:aspect-[16/10]">
            <Image
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=750&fit=crop"
              alt="Coffee shop interior with barista at work"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              quality={80}
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiM4YzY1NDUiLz48cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjYTA3NTUwIiBvcGFjaXR5PSIwLjUiLz48cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjN2E1NTM1IiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4="
            />
          </div>

          <div className="flex flex-col">
            <ModuleList />
          </div>
        </div>
      </Container>
    </Section>
  );
}
