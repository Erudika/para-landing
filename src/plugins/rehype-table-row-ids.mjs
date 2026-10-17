import { visit } from 'unist-util-visit';

/**
 * Rehype plugin that adds `id` attributes to table rows based on the first
 * <code> element found in the first <td> of each row, and wraps that <code>
 * in an <a href="#id"> so the property key is a clickable anchor link.
 *
 * Example: `scoold.app_name` → <tr id="scoold_app_name"><td><a href="#scoold_app_name"><code>…</code></a>
 */
export default function rehypeTableRowIds() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'tbody') return;

      for (const row of node.children) {
        if (row.type !== 'element' || row.tagName !== 'tr') continue;

        if (row.properties?.id) continue;

        const firstTd = row.children?.find(
          (n) => n.type === 'element' && n.tagName === 'td'
        );
        if (!firstTd) continue;

        const codeResult = findFirstCode(firstTd);
        if (!codeResult) continue;

        const { node: codeEl, parent: codeParent, index: codeIndex } = codeResult;
        const text = extractText(codeEl).trim();
        if (!text) continue;

        const id = text.replace(/\./g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
        row.properties = { ...row.properties, id };

        // Wrap the code element in a self-referencing anchor
        codeParent.children[codeIndex] = {
          type: 'element',
          tagName: 'a',
          properties: { href: `#${id}`, class: ['prop-anchor'] },
          children: [codeEl],
        };
      }
    });
  };
}

function findFirstCode(node, parent = null, index = 0) {
  if (node.type === 'element' && node.tagName === 'code') return { node, parent, index };
  for (let i = 0; i < (node.children ?? []).length; i++) {
    const found = findFirstCode(node.children[i], node, i);
    if (found) return found;
  }
  return null;
}

function extractText(node) {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(extractText).join('');
}
