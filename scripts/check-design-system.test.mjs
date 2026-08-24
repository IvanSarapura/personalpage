import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { auditDesignSystem, formatViolations } from "./check-design-system.mjs";

const fixtureRoots = [];

async function makeFixture(files) {
  const rootDir = await mkdtemp(path.join(tmpdir(), "personalpage-design-system-"));
  fixtureRoots.push(rootDir);
  for (const [relativePath, content] of Object.entries(files)) {
    const absolutePath = path.join(rootDir, relativePath);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, content, "utf8");
  }
  return rootDir;
}

function baseFiles(extra = {}) {
  return {
    "src/styles/tokens.css": `
      /* 1. Primitives: raw values. */
      :root {
        --primitive-color-brand: #0051e9;
        --space-copy: 1rem;
        --font-body: 1rem;
      }
      /* 2. Semantic roles. */
      :root {
        --surface-brand: var(--primitive-color-brand);
        --text-on-brand: var(--primitive-color-brand);
        --font-family: var(--font-inter), sans-serif;
      }
    `,
    "src/styles/base.css": `body { color: var(--text-on-brand); }`,
    ...extra,
  };
}

function rulesFor(violations) {
  return violations.map(({ rule }) => rule);
}

describe("design system checker", () => {
  afterEach(async () => {
    await Promise.all(fixtureRoots.splice(0).map((rootDir) => rm(rootDir, { recursive: true })));
  });

  it("accepts multiline token composition and conservative non-color/non-content cases", async () => {
    const rootDir = await makeFixture(
      baseFiles({
        "src/components/Safe.module.css": `
          .component {
            --local-copy-size:
              var(--font-body);
            color: var(--text-on-brand, currentColor);
            font-size: var(--local-copy-size);
            background: url(#feed);
          }
          .overlay { opacity: 0; }
          .scroller::-webkit-scrollbar { width: 0.5rem; }
          .thinScroller { scrollbar-width: thin; }
        `,
        "src/components/Safe.tsx": `
          const color = () => "#feed is documentation, not a style";
          // style={{ color: "red", fontSize: 12 }}
          export const Safe = () => (
            <main id="main-content" tabIndex={-1}>
              <a href="#feed" id="feed" className="text-sm/6 text-foreground">Feed</a>
              <Button variant="dark">A non-Section dark variant</Button>
            </main>
          );
        `,
        "src/components/SectionLink/SectionLink.tsx": `
          export const SafeExternal = () => <a target={"_blank"}>External</a>;
        `,
        "src/app/global-error.tsx": `export const colors = { color: "#fff", fontSize: 13 };`,
        "src/lib/contact-email.ts": `export const html = '<p style="color:red;font-size:13px">Mail</p>';`,
      })
    );

    await expect(auditDesignSystem({ rootDir })).resolves.toEqual([]);
  });

  it("reports CSS literals, named colors, indirect px fonts, focus, scrollbar and content opacity", async () => {
    const rootDir = await makeFixture(
      baseFiles({
        "src/components/Broken.module.css": `
          .description {
            --fake-size: 14px;
            color: rebeccapurple;
            background-color: rgb(1 2 3);
            border-color: #abcdef;
            font-size: var(--fake-size);
            opacity: .6;
            outline: none;
            scrollbar-width: none !important;
            color: var(--missing-color, red);
          }
          .scroller::-webkit-scrollbar { width: 0rem !important; }
        `,
      })
    );

    const violations = await auditDesignSystem({ rootDir });
    expect(rulesFor(violations)).toEqual([
      "literal-color",
      "literal-color",
      "literal-color",
      "pixel-font-size",
      "content-opacity",
      "suppressed-outline",
      "hidden-scrollbar",
      "undefined-custom-property",
      "literal-color",
      "hidden-scrollbar",
    ]);
    expect(violations[0]).toMatchObject({
      file: "src/components/Broken.module.css",
      line: 4,
      column: 20,
      rule: "literal-color",
      message:
        "Use a semantic token from src/styles/tokens.css instead of literal color rebeccapurple.",
    });
  });

  it("uses the TypeScript AST for JSX expressions, inline styles, Section and skip-link semantics", async () => {
    const rootDir = await makeFixture(
      baseFiles({
        "src/components/Broken.tsx": `
          const inline = ({ color: "#fff", fontSize: 12 } satisfies React.CSSProperties);
          const active = true;
          export const Broken = () => (
            <main id="main-content">
              <p className="opacity-60 text-white">Muted</p>
              <p className={cn(active ? "opacity-60" : "text-primary/70", ["text-[#fff]", "bg-[rgb(1_2_3)]", "border-[red]", "text-[14px]"])}>Composed</p>
              <p className={cn(\`opacity-60 \${active ? "text-primary" : ""}\`)}>Template</p>
              <div className={cn("opacity-60")}>Decorative wrapper</div>
              <a target={("_blank")}>External</a>
              <Section variant={("blue")} />
              <Button variant={"dark"}>Allowed</Button>
              <span style={{ color: "red", backgroundColor: "oklch(50% .2 20)", fontSize: 14, outline: 0 }} />
              <span style={{ borderColor: "#fff", fontSize: "13px", outline: "none" }} />
              <span style={inline}>Bound style</span>
              <span>{getComputedStyle(document.body).getPropertyValue(("--surface-primary" as string))}</span>
            </main>
          );
        `,
      })
    );

    const violations = await auditDesignSystem({ rootDir });
    expect(new Set(rulesFor(violations))).toEqual(
      new Set([
        "content-opacity",
        "external-link",
        "foundation-color-utility",
        "legacy-section-variant",
        "legacy-token",
        "literal-color",
        "pixel-font-size",
        "skip-link-target",
        "suppressed-outline",
      ])
    );
    expect(violations.filter(({ rule }) => rule === "legacy-section-variant")).toHaveLength(1);
    expect(violations.filter(({ rule }) => rule === "pixel-font-size")).toHaveLength(4);
    expect(violations.filter(({ rule }) => rule === "suppressed-outline")).toHaveLength(2);
    expect(violations.filter(({ rule }) => rule === "content-opacity")).toHaveLength(4);
  });

  it("audits MDX class utilities, expressions and inline style values", async () => {
    const rootDir = await makeFixture(
      baseFiles({
        "src/content/post.mdx": `
          # Article

          <!-- <p className="text-red-500">Comment example</p> -->
          \`\`\`tsx
          <p className="text-white">Code example</p>
          \`\`\`

          ~~~tsx
          <p className="bg-red-500">Tilde code example</p>
          ~~~

          Inline \`<span className="border-red-500" />\` example.

          <p className="text-blue-600 opacity-50">Copy</p>
          <a target={'_blank'}>External</a>
          <Section variant={'white'} />
          <span style={{ color: 'navy', fontSize: 12, outline: 'none' }}>Styled</span>
        `,
      })
    );

    const violations = await auditDesignSystem({ rootDir });
    expect(new Set(rulesFor(violations))).toEqual(
      new Set([
        "content-opacity",
        "external-link",
        "foundation-color-utility",
        "legacy-section-variant",
        "literal-color",
        "pixel-font-size",
        "suppressed-outline",
      ])
    );
  });

  it("detects literal colors in arbitrary Tailwind values and color-bearing gradients", async () => {
    const rootDir = await makeFixture(
      baseFiles({
        "src/components/Palette.tsx": `
          const cardClass = "text-[#fff] bg-[rgb(1_2_3)] border-[red] ring-[hsl(0_100%_50%)] fill-[navy] stroke-[oklch(50%_.2_20)] text-[14px] text-[length:14px] text-[color:red] bg-[color:rgb(1_2_3)]";
          export const Palette = () => <div className={cardClass} />;
        `,
        "src/components/Gradient.module.css": `
          .gradient {
            background-image: linear-gradient(red, rgb(1 2 3));
            border-image: linear-gradient(#fff, navy) 1;
            accent-color: rebeccapurple;
            stop-color: hsl(0 100% 50%);
          }
        `,
      })
    );

    const violations = await auditDesignSystem({ rootDir });
    expect(violations.filter(({ rule }) => rule === "literal-color")).toHaveLength(14);
    expect(violations.filter(({ rule }) => rule === "pixel-font-size")).toHaveLength(2);
  });

  it("closes the anti-audit fixture across Tailwind namespaces, SVG attributes, CSS properties and class bindings", async () => {
    const rootDir = await makeFixture(
      baseFiles({
        "src/components/AntiAudit.tsx": `
          const active = true;
          const objectClasses = { "opacity-60": active };
          const copyClass = active ? "opacity-60" : "text-foreground";
          const paletteClass = "outline-[#001122] shadow-[0_0_1rem_rgb(1_2_3)] decoration-[red] from-[hsl(0_100%_50%)] via-[navy] to-[oklch(50%_.2_20)] caret-[white] accent-[blue] border-t-[red] border-r-[red] border-b-[red] border-l-[red] border-x-[red] border-y-[red] border-s-[red] border-e-[red] divide-[#fff] divide-x-[rgb(1_2_3)]";
          const safeClass = "text-foreground bg-background border-border ring-ring outline-[length:2px] shadow-[0_1px_2px_var(--text-on-brand)] border-t-[length:2px] from-[position:10%]";

          export const AntiAudit = () => (
            <>
              <p className={cn({ "opacity-60": active }, { ...objectClasses })}>Object copy</p>
              <p className={copyClass}>Bound copy</p>
              <div className={cn({ "opacity-60": active })}>Decorative wrapper</div>
              <div className={paletteClass + " " + safeClass} />
              <svg
                color="currentColor"
                fill="#fff"
                stroke={"rgb(1 2 3)"}
                stopColor="red"
                floodColor={"navy"}
                lightingColor="hsl(0 100% 50%)"
              >
                <path fill="var(--text-on-brand)" stroke="oklch(50% .2 20)" />
              </svg>
            </>
          );
        `,
        "src/components/AntiAudit.module.css": `
          .antiAudit {
            scrollbar-color: red blue;
            -webkit-text-fill-color: #fff;
            -webkit-text-stroke-color: rgb(1 2 3);
            text-emphasis-color: hsl(0 100% 50%);
            filter: drop-shadow(0 0 0.25rem black);
            background-image: linear-gradient(red, navy);
            border-image: linear-gradient(#fff, white) 1;
            box-shadow: 0 0 1rem purple;
          }
          .safe {
            scrollbar-color: var(--text-on-brand) transparent;
            background-image: none;
            filter: none;
          }
        `,
      })
    );

    const violations = await auditDesignSystem({ rootDir });
    expect(violations.filter(({ rule }) => rule === "literal-color")).toHaveLength(35);
    expect(violations.filter(({ rule }) => rule === "content-opacity")).toHaveLength(3);
    expect(new Set(rulesFor(violations))).toEqual(new Set(["content-opacity", "literal-color"]));
  });

  it("generalizes Tailwind palette suffixes and arbitrary color payloads without flagging layout controls", async () => {
    const rootDir = await makeFixture(
      baseFiles({
        "src/components/TailwindAntiAudit.tsx": `
          const brokenClass = "accent-red-500 caret-blue-500 placeholder-red-500 drop-shadow-[0_0_#fff] text-shadow-[0_0_#fff] inset-shadow-[0_0_#fff] inset-ring-[#fff]";
          const safeClass = "font-black accent-accent caret-[var(--text-on-brand)] content-['#fff'] bg-[url(#feed)] object-[position:top] w-[14rem] outline-[length:2px] drop-shadow-[0_0_var(--text-on-brand)]";
          export const TailwindAntiAudit = () => <div className={brokenClass + " " + safeClass} />;
        `,
      })
    );

    const violations = await auditDesignSystem({ rootDir });
    expect(violations.filter(({ rule }) => rule === "foundation-color-utility")).toHaveLength(3);
    expect(violations.filter(({ rule }) => rule === "literal-color")).toHaveLength(4);
    expect(new Set(rulesFor(violations))).toEqual(
      new Set(["foundation-color-utility", "literal-color"])
    );
  });

  it("does not let scoped CSS or test strings define a custom property for another file", async () => {
    const rootDir = await makeFixture(
      baseFiles({
        "src/components/Owner.module.css": `.owner { --only-here: var(--space-copy); color: var(--only-here); }`,
        "src/components/Consumer.module.css": `.consumer { color: var(--only-here); }`,
        "src/components/__tests__/tokens.test.ts": `const fixture = ":root { --from-test: red; }";`,
        "src/components/Consumer.tsx": `export const Consumer = () => <div className="text-[var(--from-test)]" />;`,
      })
    );

    const violations = await auditDesignSystem({ rootDir });
    expect(violations).toHaveLength(2);
    expect(violations.map(({ message }) => message)).toEqual([
      "Custom property --only-here has no global definition or same-file CSS definition.",
      "Custom property --from-test has no global definition or same-file CSS definition.",
    ]);
  });

  it("requires literal colors in tokens.css to stay inside the primitive marker", async () => {
    const rootDir = await makeFixture({
      "src/styles/tokens.css": `
        /* 1. Primitives */
        :root { --primitive-color-brand: #0051e9; }
        /* 2. Semantic */
        :root { --surface-brand: #ffffff; }
      `,
      "src/styles/base.css": `body { color: var(--surface-brand); }`,
    });

    const violations = await auditDesignSystem({ rootDir });
    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({ rule: "token-layer", line: 5 });
  });

  it("requires primitive literal color declarations to use the primitive naming contract", async () => {
    const rootDir = await makeFixture({
      "src/styles/tokens.css": `
        /* 1. Primitives */
        :root { --brand: #0051e9; }
        /* 2. Semantic */
        :root { --surface-brand: var(--brand); }
      `,
      "src/styles/base.css": "",
    });

    const violations = await auditDesignSystem({ rootDir });
    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      rule: "token-layer",
      message:
        "Literal color declarations in the primitive block must use --primitive-color-* or --primitive-alpha-*.",
    });
  });

  it.each([
    ["missing", `:root { --primitive-color-brand: #0051e9; }`],
    [
      "duplicated",
      `/* 1. Primitives */\n/* 1. Primitives */\n:root { --primitive-color-brand: #0051e9; }\n/* 2. Semantic */`,
    ],
    [
      "reversed",
      `/* 2. Semantic */\n:root { --primitive-color-brand: #0051e9; }\n/* 1. Primitives */`,
    ],
  ])("fails closed when token layer markers are %s", async (_case, tokens) => {
    const rootDir = await makeFixture({
      "src/styles/tokens.css": tokens,
      "src/styles/base.css": "",
    });

    const violations = await auditDesignSystem({ rootDir });
    expect(violations.some(({ rule }) => rule === "token-layer-marker")).toBe(true);
  });

  it("formats deterministic actionable diagnostics", async () => {
    const rootDir = await makeFixture(
      baseFiles({
        "src/components/Broken.tsx": `<Section variant={"blue"} />;`,
      })
    );
    const violations = await auditDesignSystem({ rootDir });

    expect(formatViolations(violations)).toBe(
      `Design system check failed with 1 violation(s):\n\nsrc/components/Broken.tsx:1:20 [legacy-section-variant] Section variants are "brand", "surface", "elevated", or "inverse".\n  <Section variant={"blue"} />;`
    );
    expect(formatViolations([])).toBe("Design system check passed.");
  });
});
