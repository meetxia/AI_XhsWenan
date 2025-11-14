import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function parse(input) {
  const text = fs.readFileSync(input, 'utf-8')
  const items = []
  const blocks = text.split(/\n\s*产品\d+：/).filter(Boolean)
  for (const b of blocks) {
    const nameMatch = b.match(/^(.*?)(\n|$)/)
    const name = nameMatch ? nameMatch[1].trim() : ''
    const sp = []
    const lines = b.split('\n')
    for (const ln of lines) {
      const t = ln.trim()
      if (!t) continue
      if (/\d+套|级|音频|视频|答案|模板|测试|合集|PPT|课件|TPO|更新/.test(t)) sp.push(t)
    }
    items.push({ id: 'auto', name, sellingPoints: sp })
  }
  return items
}

if (process.argv.length >= 3) {
  const input = process.argv[2]
  const out = parse(input)
  const outPath = path.join(__dirname, '..', 'data', 'products.auto.json')
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2))
}

