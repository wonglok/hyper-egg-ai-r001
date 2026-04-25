import sharp from 'sharp'

/**
 * 將圖片縮放至長邊最大 1024px，並轉為 PNG
 * @param inputBuffer 原始圖片 Buffer 或路徑
 * @returns 處理後的 Buffer
 */
async function resizeToMax1024(input: string | Buffer): Promise<Buffer> {
  try {
    return await sharp(input)
      .rotate() // 自動根據 EXIF 資訊修正照片方向
      .resize({
        width: 1024,
        height: 1024,
        fit: 'inside', // 長邊最大 1024px，維持比例
        withoutEnlargement: true // 不放大原圖
      })
      .jpeg({
        quality: 80, // 品質 80 是視覺模型分析的最佳平衡點
        progressive: true, // 漸進式編碼
        mozjpeg: true // 使用更高級的壓縮演算法（若 Sharp 支援）
      })
      .toBuffer()
  } catch (error) {
    console.error('❌ 圖片縮放失敗:', error)
    throw error
  }
}

// --- 結合 OpenAI API 的使用範例 ---
export async function processImageItem(filePath: string) {
  // 1. 縮放圖片
  const resizedBuffer = await resizeToMax1024(filePath)
  const base64Image = resizedBuffer.toString('base64')
  const dataUrl = `data:image/jpg;base64,${base64Image}`

  //   // 2. 傳送給 Qwen (OpenAI SDK)
  //   // ... 此處接續你之前的 openai.chat.completions.create 代碼 ...
  //   console.log('✅ 圖片已成功縮放並準備上傳')

  return dataUrl
}
