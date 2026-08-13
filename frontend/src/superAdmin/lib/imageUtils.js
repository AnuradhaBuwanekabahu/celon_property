// Utility: convert raw image data to a displayable src string
export function getDisplayImage(img) {
  if (!img) return null;
  if (typeof img === 'string') {
    if (img.startsWith('http') || img.startsWith('data:image')) return img;
    return `data:image/jpeg;base64,${img}`;
  }
  if (img.data && Array.isArray(img.data)) {
    try {
      const bytes = new Uint8Array(img.data);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return `data:image/jpeg;base64,${btoa(binary)}`;
    } catch {
      return null;
    }
  }
  return null;
}
