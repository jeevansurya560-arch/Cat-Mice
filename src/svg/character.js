/**
 * @file Pure vector SVG standalone character renderer.
 * Converts 2D pixel-art sprite matrices into resolution-independent SVG assets.
 */

/**
 * Converts a pixel-art character matrix and color map into a valid standalone SVG string.
 *
 * @param {string[]} matrix - 2D ASCII sprite rows.
 * @param {Record<string, [number, number, number, number]>} colorMap - Color definitions.
 * @param {object} [options]
 * @param {number} [options.viewBoxSize=128] - ViewBox dimension (square).
 * @param {string} [options.title="CAT-MICE Character"]
 * @param {boolean} [options.flipX=false]
 * @returns {string} XML SVG string.
 */
export function spriteToSvg(matrix, colorMap, options = {}) {
  const viewBoxSize = options.viewBoxSize || 128;
  const title = options.title || "CAT-MICE Character";
  const flipX = Boolean(options.flipX);

  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;
  if (rows === 0 || cols === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}"></svg>`;
  }

  // Calculate integer scale factor so character occupies ~75-80% of viewBox
  const scale = Math.max(1, Math.floor((viewBoxSize * 0.78) / Math.max(rows, cols)));
  const charWidth = cols * scale;
  const charHeight = rows * scale;
  const offsetX = Math.floor((viewBoxSize - charWidth) / 2);
  const offsetY = Math.floor((viewBoxSize - charHeight) / 2);

  // Group pixels by color hex to minimize SVG element count
  const colorBuckets = new Map();

  for (let r = 0; r < rows; r++) {
    const row = matrix[r];
    for (let c = 0; c < cols; c++) {
      const sourceCol = flipX ? cols - 1 - c : c;
      const char = row[sourceCol];
      const rgba = colorMap[char];
      if (!rgba || rgba[3] === 0) continue; // Skip transparency

      const hex = `#${rgba[0].toString(16).padStart(2, "0")}${rgba[1].toString(16).padStart(2, "0")}${rgba[2].toString(16).padStart(2, "0")}`;
      if (!colorBuckets.has(hex)) {
        colorBuckets.set(hex, []);
      }

      const x = offsetX + c * scale;
      const y = offsetY + r * scale;
      colorBuckets.get(hex).push({ x, y, w: scale, h: scale });
    }
  }

  // Build SVG XML markup
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${viewBoxSize}" height="${viewBoxSize}" shape-rendering="crispEdges">`,
    `  <title>${escapeXml(title)}</title>`
  ];

  for (const [hex, rects] of colorBuckets.entries()) {
    parts.push(`  <g fill="${hex}">`);
    for (const rect of rects) {
      parts.push(`    <rect x="${rect.x}" y="${rect.y}" width="${rect.w}" height="${rect.h}" />`);
    }
    parts.push(`  </g>`);
  }

  parts.push(`</svg>\n`);
  return parts.join("\n");
}

function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
    }
  });
}
