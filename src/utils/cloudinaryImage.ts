export function cloudinaryImageUrl(url: string, width: number): string {
  const marker = '/image/upload/';
  const uploadIndex = url.indexOf(marker);

  if (!url.includes('res.cloudinary.com/') || uploadIndex === -1) return url;

  const insertionIndex = uploadIndex + marker.length;
  return `${url.slice(0, insertionIndex)}f_auto,q_auto,w_${width},c_limit/${url.slice(insertionIndex)}`;
}
