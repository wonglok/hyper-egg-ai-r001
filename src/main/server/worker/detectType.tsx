export const isImageType = (path: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  return imageExtensions.some((ext) => path.toLowerCase().endsWith(ext))
}

export const isTextType = (path: string): boolean => {
  const imageExtensions = ['.txt', '.md']
  return imageExtensions.some((ext) => path.toLowerCase().endsWith(ext))
}

export const isCSVType = (path: string): boolean => {
  const imageExtensions = ['.csv']
  return imageExtensions.some((ext) => path.toLowerCase().endsWith(ext))
}

export const isPDFType = (path: string): boolean => {
  const imageExtensions = ['.pdf']
  return imageExtensions.some((ext) => path.toLowerCase().endsWith(ext))
}
