export const hexToRGBA = (hex, alpha = 1) => {
  // Menghilangkan karakter '#' jika ada
  hex = hex.replace("#", "");

  // Konversi nilai hex ke R, G, B
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Mengembalikan string format RGBA
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const rgbToHex = (color) => {
  // Convert each component to a hexadecimal string
  const toHex = (c) => {
    // Clamp value between 0 and 255
    const hex = Math.max(0, Math.min(255, c)).toString(16);
    return hex.length === 1 ? "0" + hex : hex; // Pad with a 0 if needed
  };

  // Combine the components into a hex string
  return "#" + toHex(color.r) + toHex(color.g) + toHex(color.b);
};
