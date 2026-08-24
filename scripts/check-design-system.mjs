#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const SOURCE_EXTENSIONS = new Set([".css", ".js", ".jsx", ".mdx", ".mjs", ".ts", ".tsx"]);
const SCRIPT_EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const GLOBAL_TOKEN_FILES = new Set(["src/styles/tokens.css", "src/styles/base.css"]);
const COLOR_EXCEPTIONS = new Set(["src/app/global-error.tsx", "src/lib/contact-email.ts"]);
const PIXEL_FONT_EXCEPTIONS = new Set(["src/app/global-error.tsx", "src/lib/contact-email.ts"]);
const CONTENT_OPACITY_EXCEPTIONS = new Set(["src/components/Navbar/FullscreenMenu.module.css"]);
const EXTERNAL_LINK_OWNER = "src/components/SectionLink/SectionLink.tsx";
const ALLOWED_EXTERNAL_CUSTOM_PROPERTIES = new Set(["--font-inter"]);
const CLASS_HELPERS = new Set(["cn", "clsx", "cva", "twJoin", "twMerge"]);
const TEXT_ELEMENTS = new Set([
  "blockquote",
  "dd",
  "dt",
  "figcaption",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "label",
  "li",
  "p",
]);

const LEGACY_CUSTOM_PROPERTIES = [
  "--color-deep",
  "--color-deep-elevated",
  "--color-b-white",
  "--color-blue-screen",
  "--color-white-pure",
  "--color-border-subtle",
  "--color-border-muted",
  "--color-blue-screen-subtle",
  "--color-blue-screen-muted",
  "--color-blue-screen-moderate",
  "--color-b-white-moderate",
  "--color-white-subtle",
  "--color-white-muted",
  "--surface-primary",
  "--surface-secondary",
  "--surface-tertiary",
  "--surface-dark",
  "--text-primary",
  "--text-secondary",
  "--text-on-light",
  "--text-muted",
  "--border-default",
  "--border-subtle",
  "--navbar-toggle-width",
  "--navbar-toggle-height",
  "--navbar-toggle-border",
  "--navbar-toggle-gap",
  "--opacity-divider",
  "--opacity-dim",
  "--opacity-disabled",
  "--opacity-muted",
  "--opacity-deemphasized",
  "--opacity-subtle",
  "--opacity-moderate",
  "--opacity-emphasized",
  "--opacity-secondary",
  "--opacity-strong",
];

const NAMED_COLORS = new Set(
  `aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet
  brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue
  darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange
  darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise
  darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia
  gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory
  khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow
  lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray
  lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue
  mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred
  midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid
  palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple
  rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue
  slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white
  whitesmoke yellow yellowgreen`
    .split(/\s+/)
    .filter(Boolean)
);

const CONTENT_SELECTOR_HINT =
  /(?:^|[-_.#])(body|caption|content|copy|description|eyebrow|heading|intro|label|lead|meta|paragraph|subtitle|text|title)(?:$|[-_.:#\s])/i;
const FOUNDATION_UTILITY = new RegExp(
  `^(-?[a-z][\\w-]*)-(?:black|white|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))(?:/\\d{1,3})?$`
);
const SAFE_FOUNDATION_NAMESPACE = new Set(["font"]);
const SAFE_ARBITRARY_NAMESPACE =
  /^(?:aspect|basis|columns|content|gap|grid|grid-cols|grid-rows|h|max-h|max-w|min-h|min-w|object|order|origin|p|p[trblxyse]|size|space-[xy]|translate-[xy]|w|z)$/;
const COLOR_FUNCTION = /\b(?:color|hsl|hsla|hwb|lab|lch|oklab|oklch|rgb|rgba)\s*\(/gi;
const HEX_COLOR = /#[\da-f]{3,8}\b/gi;

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function maskComments(source, extension) {
  if (extension !== ".css" && extension !== ".mdx") return source;
  const mask = (part) => part.replace(/[^\n]/g, " ");
  let masked = source.replace(/\/\*[\s\S]*?\*\//g, mask);
  if (extension === ".mdx") {
    masked = masked
      .replace(/(```|~~~)[^\n]*\n[\s\S]*?\1/g, mask)
      .replace(/`[^`\n]+`/g, mask)
      .replace(/<!--[\s\S]*?-->/g, mask);
  }
  return masked;
}

function locationAt(source, index) {
  const before = source.slice(0, index);
  const line = before.split("\n").length;
  const lineStart = before.lastIndexOf("\n") + 1;
  const lineEnd = source.indexOf("\n", index);
  return {
    line,
    column: index - lineStart + 1,
    snippet: source.slice(lineStart, lineEnd === -1 ? source.length : lineEnd).trim(),
  };
}

function addViolation(violations, file, index, rule, message) {
  violations.push({ rule, file: file.relativePath, ...locationAt(file.content, index), message });
}

function findMatches(expression, source, callback) {
  expression.lastIndex = 0;
  let match;
  while ((match = expression.exec(source)) !== null) {
    callback(match);
    if (match[0].length === 0) expression.lastIndex += 1;
  }
}

async function listSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listSourceFiles(entryPath)));
    else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) files.push(entryPath);
  }
  return files;
}

function parseCssDeclarations(file) {
  const declarations = [];
  findMatches(/([\w-]+)\s*:\s*([^;{}]+)(?=;|})/g, file.masked, (match) => {
    const propertyOffset = match[0].indexOf(match[1]);
    const valueOffset = match[0].indexOf(match[2], propertyOffset + match[1].length);
    declarations.push({
      property: match[1].toLowerCase(),
      value: match[2].trim(),
      index: match.index + propertyOffset,
      valueIndex: match.index + valueOffset + (match[2].length - match[2].trimStart().length),
    });
  });
  return declarations;
}

function isColorProperty(property) {
  return (
    property.startsWith("--") ||
    property.endsWith("-color") ||
    /^(?:backdrop-filter|background|background-image|border|border-(?:block|block-end|block-start|bottom|image|image-source|inline|inline-end|inline-start|left|right|top)|box-shadow|color|fill|filter|stroke|text-shadow)$/.test(
      property
    ) ||
    /(?:^|-)(?:image|shadow)(?:-|$)/.test(property)
  );
}

function colorLiteralMatches(value) {
  const matches = [];
  const searchable = value.replace(/url\([^)]*\)/gi, (part) => " ".repeat(part.length));
  findMatches(HEX_COLOR, searchable, (match) =>
    matches.push({ index: match.index, value: match[0] })
  );
  findMatches(COLOR_FUNCTION, searchable, (match) =>
    matches.push({ index: match.index, value: match[0].trim().replace(/\($/, "()") })
  );
  const namedSearchable = searchable
    .replace(/var\(\s*--[\w-]+/gi, (part) => " ".repeat(part.length))
    .replace(/--[\w-]+/g, (part) => " ".repeat(part.length))
    .replace(/["'][^"']*["']/g, (part) => " ".repeat(part.length));
  findMatches(/\b[a-z]+\b/gi, namedSearchable, (match) => {
    if (NAMED_COLORS.has(match[0].toLowerCase()))
      matches.push({ index: match.index, value: match[0] });
  });
  return matches.sort((left, right) => left.index - right.index);
}

function addLiteralColorViolations(violations, file, value, valueIndex) {
  if (COLOR_EXCEPTIONS.has(file.relativePath)) return;
  for (const match of colorLiteralMatches(value)) {
    addViolation(
      violations,
      file,
      valueIndex + match.index,
      "literal-color",
      `Use a semantic token from src/styles/tokens.css instead of literal color ${match.value}.`
    );
  }
}

function classTokens(value) {
  return value.split(/\s+/).filter(Boolean);
}

function baseUtility(token) {
  let bracketDepth = 0;
  let variantEnd = -1;
  for (let index = 0; index < token.length; index += 1) {
    if (token[index] === "\\") {
      index += 1;
    } else if (token[index] === "[") {
      bracketDepth += 1;
    } else if (token[index] === "]") {
      bracketDepth = Math.max(0, bracketDepth - 1);
    } else if (token[index] === ":" && bracketDepth === 0) {
      variantEnd = index;
    }
  }
  return token.slice(variantEnd + 1).replace(/^!/, "");
}

function isTextOpacityUtility(token) {
  const utility = baseUtility(token);
  if (/^text-opacity-\d{1,3}$/.test(utility)) return true;
  if (/^opacity-(?:\d{1,3}|\[[^\]]+\])$/.test(utility)) return true;
  if (!/^text-.+\/\d{1,3}$/.test(utility)) return false;
  return !/^text-(?:xs|sm|base|lg|xl|[2-9]xl|\[length:[^\]]+\])\//.test(utility);
}

function inspectClassValue({ value, valueIndex, textContent }, file, violations, uses) {
  let searchFrom = 0;
  for (const token of classTokens(value)) {
    const tokenIndex = value.indexOf(token, searchFrom);
    searchFrom = tokenIndex + token.length;
    const utility = baseUtility(token);
    const foundation = FOUNDATION_UTILITY.exec(utility);
    if (foundation && !SAFE_FOUNDATION_NAMESPACE.has(foundation[1])) {
      addViolation(
        violations,
        file,
        valueIndex + tokenIndex,
        "foundation-color-utility",
        `Use a semantic Tailwind color or CSS token instead of ${token}.`
      );
    }
    const arbitrary = /^(-?[a-z][\w-]*)-\[(.+)\](?:\/\d{1,3})?$/.exec(utility);
    if (arbitrary) {
      const namespace = arbitrary[1];
      const hint = /^(color|length|position|url):/.exec(arbitrary[2])?.[1];
      const payload = arbitrary[2].replace(/^(?:color|length|position|url):/, "");
      const decoded = payload.replace(/\\_/g, "\0").replaceAll("_", " ").replaceAll("\0", "_");
      const payloadOffset = token.indexOf(payload);
      const safeColorPayload =
        hint === "length" ||
        hint === "position" ||
        hint === "url" ||
        SAFE_ARBITRARY_NAMESPACE.test(namespace) ||
        /^url\(/i.test(decoded);
      if (!safeColorPayload) {
        addLiteralColorViolations(
          violations,
          file,
          decoded,
          valueIndex + tokenIndex + payloadOffset
        );
      }
      if (namespace === "text" && /\b\d*\.?\d+px\b/i.test(decoded)) {
        addViolation(
          violations,
          file,
          valueIndex + tokenIndex + payloadOffset,
          "pixel-font-size",
          "Use the rem-based typography scale instead of a px Tailwind font size."
        );
      }
    }
    if (textContent && isTextOpacityUtility(token)) {
      addViolation(
        violations,
        file,
        valueIndex + tokenIndex,
        "content-opacity",
        "Use an accessible semantic text color instead of opacity on content text."
      );
    }
  }
  collectVarUses(value, valueIndex, file, uses);
  checkLegacyTokens(value, valueIndex, file, violations);
}

function checkLegacyTokens(value, valueIndex, file, violations) {
  for (const property of LEGACY_CUSTOM_PROPERTIES) {
    const expression = new RegExp(`${property.replaceAll("-", "\\-")}(?![\\w-])`, "g");
    findMatches(expression, value, (match) =>
      addViolation(
        violations,
        file,
        valueIndex + match.index,
        "legacy-token",
        `Replace legacy token ${property} with the current primitive or semantic vocabulary.`
      )
    );
  }
}

function collectVarUses(value, valueIndex, file, uses) {
  findMatches(/var\(\s*(--[\w-]+)/g, value, (match) =>
    uses.push({ property: match[1], file, index: valueIndex + match.index })
  );
}

function resolvesToPixelFont(value, definitions, seen = new Set()) {
  if (/\b\d*\.?\d+px\b/i.test(value)) return true;
  let resolves = false;
  findMatches(/var\(\s*(--[\w-]+)/g, value, (match) => {
    if (resolves || seen.has(match[1])) return;
    const candidates = definitions.get(match[1]) ?? [];
    const nextSeen = new Set(seen).add(match[1]);
    resolves = candidates.some((candidate) =>
      resolvesToPixelFont(candidate, definitions, nextSeen)
    );
  });
  return resolves;
}

function checkCssFile(file, globalDefinitions, violations, uses) {
  const localDefinitions = new Map();
  for (const declaration of file.declarations) {
    if (!declaration.property.startsWith("--")) continue;
    const values = localDefinitions.get(declaration.property) ?? [];
    values.push(declaration.value);
    localDefinitions.set(declaration.property, values);
  }
  file.localDefinitions = localDefinitions;
  const fontDefinitions = new Map([...globalDefinitions, ...localDefinitions]);
  const primitiveMarkers = [...file.content.matchAll(/\/\*\s*1\.\s*Primitives\b/gi)];
  const semanticMarkers = [...file.content.matchAll(/\/\*\s*2\.\s*Semantic\b/gi)];
  const primitiveStart = primitiveMarkers[0]?.index ?? -1;
  const semanticStart = semanticMarkers[0]?.index ?? -1;

  if (
    file.relativePath === "src/styles/tokens.css" &&
    (primitiveMarkers.length !== 1 ||
      semanticMarkers.length !== 1 ||
      semanticStart <= primitiveStart)
  ) {
    addViolation(
      violations,
      file,
      0,
      "token-layer-marker",
      "tokens.css must contain exactly one ordered primitive marker and one semantic marker."
    );
  }

  for (const declaration of file.declarations) {
    collectVarUses(declaration.value, declaration.valueIndex, file, uses);
    checkLegacyTokens(
      `${declaration.property}:${declaration.value}`,
      declaration.index,
      file,
      violations
    );

    if (isColorProperty(declaration.property)) {
      const colors = colorLiteralMatches(declaration.value);
      if (file.relativePath === "src/styles/tokens.css") {
        if (primitiveStart >= 0 && semanticStart > primitiveStart) {
          for (const match of colors) {
            const absoluteIndex = declaration.valueIndex + match.index;
            if (absoluteIndex < primitiveStart || absoluteIndex >= semanticStart) {
              addViolation(
                violations,
                file,
                absoluteIndex,
                "token-layer",
                "Literal colors in tokens.css belong only in the marked primitive block."
              );
            } else if (!/^--primitive-(?:alpha|color)-/.test(declaration.property)) {
              addViolation(
                violations,
                file,
                declaration.index,
                "token-layer",
                "Literal color declarations in the primitive block must use --primitive-color-* or --primitive-alpha-*."
              );
            }
          }
        }
      } else {
        addLiteralColorViolations(violations, file, declaration.value, declaration.valueIndex);
      }
    }

    if (
      declaration.property === "font-size" &&
      !PIXEL_FONT_EXCEPTIONS.has(file.relativePath) &&
      resolvesToPixelFont(declaration.value, fontDefinitions)
    ) {
      addViolation(
        violations,
        file,
        declaration.valueIndex,
        "pixel-font-size",
        "Use the rem-based typography scale instead of a px font size."
      );
    }

    if (
      declaration.property === "outline" &&
      /^(?:none|0(?:\s*!important)?)$/i.test(declaration.value)
    ) {
      addViolation(
        violations,
        file,
        declaration.valueIndex,
        "suppressed-outline",
        "Do not suppress the browser focus outline without an accessible replacement."
      );
    }
  }

  findMatches(/\b0\.01ms\b/g, file.masked, (match) =>
    addViolation(
      violations,
      file,
      match.index,
      "reduced-motion-hack",
      "Disable specific motion in reduced-motion media queries instead of using 0.01ms."
    )
  );

  findMatches(/([^{}]+)\{([^{}]*)\}/g, file.masked, (match) => {
    const selector = match[1].trim();
    const body = match[2];
    if (
      /::\-webkit-scrollbar\b/i.test(selector) &&
      /(?:display\s*:\s*none(?:\s*!important)?\b|(?:width|height)\s*:\s*0(?:\.0+)?(?:[a-z%]+)?(?:\s*!important)?\s*(?:;|$))/i.test(
        body
      )
    ) {
      addViolation(
        violations,
        file,
        match.index,
        "hidden-scrollbar",
        "Do not hide scrollbars on scrollable content."
      );
    }
    if (CONTENT_SELECTOR_HINT.test(selector) && !CONTENT_OPACITY_EXCEPTIONS.has(file.relative)) {
      const opacity = /\bopacity\s*:\s*(?:0(?:\.\d+)?|\.\d+)\b/i.exec(body);
      if (opacity) {
        addViolation(
          violations,
          file,
          match.index + match[0].indexOf(body) + opacity.index,
          "content-opacity",
          "Use an accessible semantic text color instead of opacity on content text."
        );
      }
    }
  });

  for (const declaration of file.declarations) {
    if (
      declaration.property === "scrollbar-width" &&
      /^none(?:\s*!important)?$/i.test(declaration.value)
    ) {
      addViolation(
        violations,
        file,
        declaration.valueIndex,
        "hidden-scrollbar",
        "Do not hide scrollbars on scrollable content."
      );
    }
  }
}

function scriptKind(extension) {
  if (extension === ".js" || extension === ".mjs") return ts.ScriptKind.JS;
  if (extension === ".jsx") return ts.ScriptKind.JSX;
  if (extension === ".ts") return ts.ScriptKind.TS;
  return ts.ScriptKind.TSX;
}

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text;
  return undefined;
}

function unwrapExpression(node) {
  let current = node;
  while (
    current &&
    (ts.isParenthesizedExpression(current) ||
      ts.isAsExpression(current) ||
      ts.isSatisfiesExpression(current) ||
      ts.isTypeAssertionExpression(current) ||
      ts.isNonNullExpression(current))
  ) {
    current = current.expression;
  }
  return current;
}

function staticValue(node) {
  const current = unwrapExpression(node);
  if (!current) return undefined;
  if (ts.isStringLiteral(current) || ts.isNoSubstitutionTemplateLiteral(current)) {
    return current.text;
  }
  if (ts.isNumericLiteral(current)) return Number(current.text);
  if (
    ts.isPrefixUnaryExpression(current) &&
    current.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(current.operand)
  ) {
    return -Number(current.operand.text);
  }
  return undefined;
}

function jsxAttributeValue(attribute) {
  if (!attribute.initializer) return true;
  if (ts.isStringLiteral(attribute.initializer)) return attribute.initializer.text;
  if (ts.isJsxExpression(attribute.initializer))
    return staticValue(attribute.initializer.expression);
  return undefined;
}

function jsxAttributeIndex(attribute) {
  if (!attribute.initializer) return attribute.getStart();
  if (ts.isStringLiteral(attribute.initializer)) return attribute.initializer.getStart() + 1;
  if (ts.isJsxExpression(attribute.initializer) && attribute.initializer.expression) {
    const expression = unwrapExpression(attribute.initializer.expression);
    return expression.getStart() + (ts.isStringLiteral(expression) ? 1 : 0);
  }
  return attribute.getStart();
}

function getJsxAttribute(attributes, name) {
  return attributes.properties.find(
    (attribute) => ts.isJsxAttribute(attribute) && attribute.name.text === name
  );
}

function isClassContext(node) {
  let current = node.parent;
  while (current && !ts.isSourceFile(current)) {
    if (ts.isJsxAttribute(current) && current.name.text === "className") return true;
    if (
      ts.isCallExpression(current) &&
      ts.isIdentifier(current.expression) &&
      CLASS_HELPERS.has(current.expression.text)
    ) {
      return true;
    }
    if (ts.isVariableDeclaration(current) && ts.isIdentifier(current.name)) {
      return /class(?:es|name)?$/i.test(current.name.text);
    }
    if (
      ts.isPropertyAssignment(current) &&
      /class(?:es|name)?$/i.test(propertyName(current.name) ?? "")
    ) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

function checkStyleProperty(name, value, valueIndex, file, violations, uses) {
  const cssName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).toLowerCase();
  if (typeof value === "string") {
    collectVarUses(value, valueIndex, file, uses);
    checkLegacyTokens(value, valueIndex, file, violations);
    if (isColorProperty(cssName)) addLiteralColorViolations(violations, file, value, valueIndex);
    if (
      cssName === "font-size" &&
      !PIXEL_FONT_EXCEPTIONS.has(file.relativePath) &&
      /\b\d*\.?\d+px\b/i.test(value)
    ) {
      addViolation(
        violations,
        file,
        valueIndex,
        "pixel-font-size",
        "Use the rem-based typography scale instead of a px font size."
      );
    }
    if (cssName === "outline" && /^none$/i.test(value.trim())) {
      addViolation(
        violations,
        file,
        valueIndex,
        "suppressed-outline",
        "Do not suppress the browser focus outline without an accessible replacement."
      );
    }
  } else if (typeof value === "number") {
    if (cssName === "font-size" && !PIXEL_FONT_EXCEPTIONS.has(file.relativePath)) {
      addViolation(
        violations,
        file,
        valueIndex,
        "pixel-font-size",
        "Numeric React fontSize values are CSS pixels; use the rem-based typography scale."
      );
    }
    if (cssName === "outline" && value === 0) {
      addViolation(
        violations,
        file,
        valueIndex,
        "suppressed-outline",
        "Do not suppress the browser focus outline without an accessible replacement."
      );
    }
  }
}

function checkScriptFile(file, violations, uses) {
  const sourceFile = ts.createSourceFile(
    file.relativePath,
    file.content,
    ts.ScriptTarget.Latest,
    true,
    scriptKind(file.extension)
  );
  const constBindings = new Map();

  function collectConstBindings(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.isVariableDeclarationList(node.parent) &&
      (node.parent.flags & ts.NodeFlags.Const) !== 0
    ) {
      constBindings.set(node.name.text, node.initializer);
    }
    ts.forEachChild(node, collectConstBindings);
  }

  function inspectStyleExpression(expression, seen = new Set()) {
    const current = unwrapExpression(expression);
    if (!current) return;
    let object = current;
    if (ts.isIdentifier(current)) {
      if (seen.has(current.text)) return;
      seen.add(current.text);
      object = unwrapExpression(constBindings.get(current.text));
    }
    if (!object || !ts.isObjectLiteralExpression(object)) return;
    for (const member of object.properties) {
      if (!ts.isPropertyAssignment(member)) continue;
      const name = propertyName(member.name);
      const value = staticValue(member.initializer);
      if (!name || value === undefined) continue;
      const valueNode = unwrapExpression(member.initializer);
      const valueIndex =
        valueNode.getStart(sourceFile) +
        (ts.isStringLiteral(valueNode) || ts.isNoSubstitutionTemplateLiteral(valueNode) ? 1 : 0);
      checkStyleProperty(name, value, valueIndex, file, violations, uses);
    }
  }

  function inspectClassExpression(expression, textContent, seen = new Set()) {
    const current = unwrapExpression(expression);
    if (!current) return;
    if (ts.isIdentifier(current)) {
      if (seen.has(current.text)) return;
      const binding = constBindings.get(current.text);
      if (!binding) return;
      inspectClassExpression(binding, textContent, new Set(seen).add(current.text));
      return;
    }
    if (ts.isStringLiteral(current) || ts.isNoSubstitutionTemplateLiteral(current)) {
      inspectClassValue(
        {
          value: current.text,
          valueIndex: current.getStart(sourceFile) + 1,
          textContent,
        },
        file,
        violations,
        uses
      );
      return;
    }
    if (ts.isTemplateExpression(current)) {
      inspectClassValue(
        {
          value: current.head.text,
          valueIndex: current.head.getStart(sourceFile) + 1,
          textContent,
        },
        file,
        violations,
        uses
      );
      for (const span of current.templateSpans) {
        inspectClassExpression(span.expression, textContent);
        inspectClassValue(
          {
            value: span.literal.text,
            valueIndex: span.literal.getStart(sourceFile) + 1,
            textContent,
          },
          file,
          violations,
          uses
        );
      }
      return;
    }
    if (ts.isCallExpression(current)) {
      for (const argument of current.arguments) inspectClassExpression(argument, textContent, seen);
      return;
    }
    if (ts.isConditionalExpression(current)) {
      inspectClassExpression(current.whenTrue, textContent, seen);
      inspectClassExpression(current.whenFalse, textContent, seen);
      return;
    }
    if (ts.isArrayLiteralExpression(current)) {
      for (const element of current.elements) inspectClassExpression(element, textContent, seen);
      return;
    }
    if (ts.isObjectLiteralExpression(current)) {
      for (const member of current.properties) {
        if (ts.isSpreadAssignment(member)) {
          inspectClassExpression(member.expression, textContent, seen);
          continue;
        }
        if (ts.isPropertyAssignment(member)) {
          if (ts.isStringLiteral(member.name)) {
            inspectClassValue(
              {
                value: member.name.text,
                valueIndex: member.name.getStart(sourceFile) + 1,
                textContent,
              },
              file,
              violations,
              uses
            );
          } else if (ts.isComputedPropertyName(member.name)) {
            inspectClassExpression(member.name.expression, textContent, seen);
          }
        }
      }
      return;
    }
    if (ts.isBinaryExpression(current)) {
      inspectClassExpression(current.left, textContent, seen);
      inspectClassExpression(current.right, textContent, seen);
    }
  }

  collectConstBindings(sourceFile);

  function visit(node) {
    if (
      (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) &&
      isClassContext(node)
    ) {
      inspectClassValue(
        { value: node.text, valueIndex: node.getStart(sourceFile) + 1, textContent: false },
        file,
        violations,
        uses
      );
    }

    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      ["getPropertyPriority", "getPropertyValue", "removeProperty", "setProperty"].includes(
        node.expression.name.text
      )
    ) {
      const argument = unwrapExpression(node.arguments[0]);
      if (
        argument &&
        (ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument))
      ) {
        checkLegacyTokens(argument.text, argument.getStart(sourceFile) + 1, file, violations);
      }
    }

    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tagName = node.tagName.getText(sourceFile);
      const target = getJsxAttribute(node.attributes, "target");
      if (
        target &&
        file.relativePath !== EXTERNAL_LINK_OWNER &&
        jsxAttributeValue(target) === "_blank"
      ) {
        addViolation(
          violations,
          file,
          jsxAttributeIndex(target),
          "external-link",
          "Route new-tab links through SectionLink so rel and accessible copy stay consistent."
        );
      }

      const variant = getJsxAttribute(node.attributes, "variant");
      const variantValue = variant && jsxAttributeValue(variant);
      if (tagName === "Section" && ["blue", "white", "dark"].includes(variantValue)) {
        addViolation(
          violations,
          file,
          jsxAttributeIndex(variant),
          "legacy-section-variant",
          'Section variants are "brand", "surface", "elevated", or "inverse".'
        );
      }

      if (tagName === "main") {
        const id = getJsxAttribute(node.attributes, "id");
        if (id && jsxAttributeValue(id) === "main-content") {
          const tabIndex = getJsxAttribute(node.attributes, "tabIndex");
          if (!tabIndex || jsxAttributeValue(tabIndex) !== -1) {
            addViolation(
              violations,
              file,
              jsxAttributeIndex(id),
              "skip-link-target",
              "The #main-content skip-link target must have tabIndex={-1} for programmatic focus."
            );
          }
        }
      }

      const className = getJsxAttribute(node.attributes, "className");
      const classNameValue = className && jsxAttributeValue(className);
      if (className && typeof classNameValue === "string") {
        inspectClassValue(
          {
            value: classNameValue,
            valueIndex: jsxAttributeIndex(className),
            textContent: TEXT_ELEMENTS.has(tagName),
          },
          file,
          violations,
          uses
        );
      } else if (
        className &&
        ts.isJsxExpression(className.initializer) &&
        className.initializer.expression
      ) {
        inspectClassExpression(className.initializer.expression, TEXT_ELEMENTS.has(tagName));
      }

      const style = getJsxAttribute(node.attributes, "style");
      if (style && ts.isJsxExpression(style.initializer) && style.initializer.expression) {
        inspectStyleExpression(style.initializer.expression);
      }

      for (const attributeName of [
        "color",
        "fill",
        "floodColor",
        "lightingColor",
        "stopColor",
        "stroke",
      ]) {
        const attribute = getJsxAttribute(node.attributes, attributeName);
        const value = attribute && jsxAttributeValue(attribute);
        if (attribute && typeof value === "string") {
          checkStyleProperty(
            attributeName,
            value,
            jsxAttributeIndex(attribute),
            file,
            violations,
            uses
          );
        }
      }
    }

    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
}

function mdxAttributeValue(attributeSource) {
  const match = /^(?:=\s*)?(?:\{\s*)?["']([^"']*)["'](?:\s*\})?$/.exec(attributeSource.trim());
  return match?.[1];
}

function checkMdxFile(file, violations, uses) {
  findMatches(/className\s*=\s*(?:\{\s*)?["']([^"']*)["'](?:\s*\})?/g, file.masked, (match) => {
    const valueIndex = match.index + match[0].indexOf(match[1]);
    const before = file.masked.slice(Math.max(0, match.index - 120), match.index);
    const tag = /<([\w-]+)\b[^<]*$/.exec(before)?.[1]?.toLowerCase();
    inspectClassValue(
      { value: match[1], valueIndex, textContent: tag ? TEXT_ELEMENTS.has(tag) : false },
      file,
      violations,
      uses
    );
  });

  findMatches(/<([\w.]+)\b([^>]*)>/g, file.masked, (match) => {
    const tagName = match[1];
    const attributes = match[2];
    const attributesIndex = match.index + match[0].indexOf(attributes);
    const target = /\btarget\s*(=\s*(?:\{\s*)?["'][^"']*["'](?:\s*\})?)/.exec(attributes);
    if (
      target &&
      file.relativePath !== EXTERNAL_LINK_OWNER &&
      mdxAttributeValue(target[1]) === "_blank"
    ) {
      addViolation(
        violations,
        file,
        attributesIndex + target.index,
        "external-link",
        "Route new-tab links through SectionLink so rel and accessible copy stay consistent."
      );
    }
    const variant = /\bvariant\s*(=\s*(?:\{\s*)?["'][^"']*["'](?:\s*\})?)/.exec(attributes);
    if (
      tagName === "Section" &&
      variant &&
      ["blue", "white", "dark"].includes(mdxAttributeValue(variant[1]))
    ) {
      addViolation(
        violations,
        file,
        attributesIndex + variant.index,
        "legacy-section-variant",
        'Section variants are "brand", "surface", "elevated", or "inverse".'
      );
    }
    for (const attributeName of [
      "color",
      "fill",
      "floodColor",
      "lightingColor",
      "stopColor",
      "stroke",
    ]) {
      const attribute = new RegExp(
        `\\b${attributeName}\\s*(=\\s*(?:\\{\\s*)?["'][^"']*["'](?:\\s*\\})?)`
      ).exec(attributes);
      const value = attribute && mdxAttributeValue(attribute[1]);
      if (attribute && typeof value === "string") {
        const quotedValueOffset = attribute[0].indexOf(value);
        checkStyleProperty(
          attributeName,
          value,
          attributesIndex + attribute.index + quotedValueOffset,
          file,
          violations,
          uses
        );
      }
    }
  });

  findMatches(/style\s*=\s*\{\{([\s\S]*?)\}\}/g, file.masked, (match) => {
    const body = match[1];
    const bodyIndex = match.index + match[0].indexOf(body);
    findMatches(/([\w-]+)\s*:\s*("[^"]*"|'[^']*'|-?\d+(?:\.\d+)?)/g, body, (property) => {
      const rawValue = property[2];
      const quoted = rawValue.startsWith('"') || rawValue.startsWith("'");
      const value = quoted ? rawValue.slice(1, -1) : Number(rawValue);
      const valueIndex =
        bodyIndex + property.index + property[0].indexOf(rawValue) + (quoted ? 1 : 0);
      checkStyleProperty(property[1], value, valueIndex, file, violations, uses);
    });
  });
}

export async function auditDesignSystem(options = {}) {
  const rootDir = path.resolve(options.rootDir ?? process.cwd());
  const sourceDir = path.resolve(rootDir, options.sourceDir ?? "src");
  const absoluteFiles = await listSourceFiles(sourceDir);
  const files = await Promise.all(
    absoluteFiles.map(async (absolutePath) => {
      const content = await readFile(absolutePath, "utf8");
      const extension = path.extname(absolutePath);
      const file = {
        absolutePath,
        relativePath: toPosix(path.relative(rootDir, absolutePath)),
        extension,
        content,
        masked: maskComments(content, extension),
        declarations: [],
        localDefinitions: new Map(),
      };
      if (extension === ".css") file.declarations = parseCssDeclarations(file);
      return file;
    })
  );

  const globalDefinitions = new Map();
  for (const file of files.filter(({ relativePath }) => GLOBAL_TOKEN_FILES.has(relativePath))) {
    for (const declaration of file.declarations) {
      if (!declaration.property.startsWith("--")) continue;
      const values = globalDefinitions.get(declaration.property) ?? [];
      values.push(declaration.value);
      globalDefinitions.set(declaration.property, values);
    }
  }

  const violations = [];
  const uses = [];
  for (const file of files) {
    if (file.extension === ".css") checkCssFile(file, globalDefinitions, violations, uses);
    else if (SCRIPT_EXTENSIONS.has(file.extension)) checkScriptFile(file, violations, uses);
    else if (file.extension === ".mdx") checkMdxFile(file, violations, uses);
  }

  for (const use of uses) {
    const locallyDefined = use.file.localDefinitions?.has(use.property);
    const selfContainedDefinition =
      use.file.relativePath === "src/app/global-error.tsx" &&
      new RegExp(`${use.property.replaceAll("-", "\\-")}\\s*:`).test(use.file.content);
    if (
      globalDefinitions.has(use.property) ||
      locallyDefined ||
      selfContainedDefinition ||
      ALLOWED_EXTERNAL_CUSTOM_PROPERTIES.has(use.property)
    ) {
      continue;
    }
    addViolation(
      violations,
      use.file,
      use.index,
      "undefined-custom-property",
      `Custom property ${use.property} has no global definition or same-file CSS definition.`
    );
  }

  const unique = new Map();
  for (const violation of violations) {
    unique.set(
      `${violation.file}:${violation.line}:${violation.column}:${violation.rule}`,
      violation
    );
  }
  return [...unique.values()].sort(
    (left, right) =>
      left.file.localeCompare(right.file) || left.line - right.line || left.column - right.column
  );
}

export function formatViolations(violations) {
  if (violations.length === 0) return "Design system check passed.";
  const lines = [`Design system check failed with ${violations.length} violation(s):`, ""];
  for (const violation of violations) {
    lines.push(
      `${violation.file}:${violation.line}:${violation.column} [${violation.rule}] ${violation.message}`,
      `  ${violation.snippet}`
    );
  }
  return lines.join("\n");
}

async function main() {
  try {
    const violations = await auditDesignSystem();
    const output = formatViolations(violations);
    const writer = violations.length === 0 ? console.log : console.error;
    writer(output);
    if (violations.length > 0) process.exitCode = 1;
  } catch (error) {
    console.error(
      `Design system check could not run: ${error instanceof Error ? error.message : error}`
    );
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (invokedPath === import.meta.url) await main();
