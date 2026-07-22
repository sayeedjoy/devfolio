/**
 * Rehype plugin: lift ```mermaid fenced code blocks out of the normal code
 * pipeline and into a custom <mermaid> element carrying the raw diagram source.
 *
 * It must run BEFORE rehype-pretty-code so those blocks are never syntax
 * highlighted (which would mangle the diagram text and wrap it in Shiki spans).
 * The MDX component map renders <mermaid> with the client-side renderer.
 */
import type { Element, Root } from "hast"
import { visit } from "unist-util-visit"

export function rehypeMermaid() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "pre" || !parent || typeof index !== "number") return

      const code = node.children[0]
      if (!code || code.type !== "element" || code.tagName !== "code") return

      const classes = code.properties?.className
      const isMermaid =
        Array.isArray(classes) && classes.includes("language-mermaid")
      if (!isMermaid) return

      const text = code.children[0]
      const chart = text && text.type === "text" ? text.value : ""

      // Replace the whole <pre> with <mermaid chart="...">.
      parent.children[index] = {
        type: "element",
        tagName: "mermaid",
        properties: { chart },
        children: [],
      }
    })
  }
}
