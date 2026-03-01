export const generateFormat = (colors, format, name = "Ranga-Palette") => {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const hexArray = colors.map(c => c.hex || c);

  switch (format) {
    case 'hex':
      return hexArray.join('\n');

    case 'tailwind':
      return `'${slug}': {\n${hexArray.map((c, i) => `  ${(i + 1) * 100}: '${c}',`).join('\n')}\n}`;

    case 'css':
      return `:root {\n${hexArray.map((c, i) => `  --${slug}-${(i + 1) * 100}: ${c};`).join('\n')}\n}`;

    case 'scss':
      return `${hexArray.map((c, i) => `$${slug}-${(i + 1) * 100}: ${c};`).join('\n')}`;

    case 'json':
      const jsonObj = {};
      hexArray.forEach((c, i) => jsonObj[`${slug}-${(i + 1) * 100}`] = c);
      return JSON.stringify(jsonObj, null, 2);

    case 'swiftui':
      return hexArray.map((c, i) => `static let ${slug}${i + 1} = Color(hex: "${c}")`).join('\n');

    case 'android':
      return `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n${hexArray.map((c, i) => `    <color name="${slug}_${(i + 1) * 100}">${c}</color>`).join('\n')}\n</resources>`;

    default:
      return hexArray.join(', ');
  }
};