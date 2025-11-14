import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 历史记录配置
const HISTORY_CONFIG = {
  maxRecordsPerFile: 100,
  historyDir: path.join(__dirname, '..', 'data', 'history'),
  filePrefix: 'history_',
  fileExtension: '.json'
}

/**
 * 历史记录管理器
 */
class HistoryManager {
  constructor() {
    this.ensureHistoryDir()
  }

  /**
   * 确保历史记录目录存在
   */
  ensureHistoryDir() {
    if (!fs.existsSync(HISTORY_CONFIG.historyDir)) {
      fs.mkdirSync(HISTORY_CONFIG.historyDir, { recursive: true })
      console.log('📁 创建历史记录目录:', HISTORY_CONFIG.historyDir)
    }
  }

  /**
   * 获取历史记录文件列表（按文件名排序）
   */
  getHistoryFiles() {
    const files = fs.readdirSync(HISTORY_CONFIG.historyDir)
      .filter(file => file.startsWith(HISTORY_CONFIG.filePrefix) && file.endsWith(HISTORY_CONFIG.fileExtension))
      .sort((a, b) => {
        // 按文件名数字排序 (history_001.json, history_002.json...)
        const getNumber = (filename) => {
          const match = filename.match(/history_(\d+)\.json/)
          return match ? parseInt(match[1]) : 0
        }
        return getNumber(b) - getNumber(a) // 降序，最新的在前
      })
    
    return files.map(file => path.join(HISTORY_CONFIG.historyDir, file))
  }

  /**
   * 获取最新的历史记录文件路径
   */
  getLatestHistoryFile() {
    const files = this.getHistoryFiles()
    return files.length > 0 ? files[0] : null
  }

  /**
   * 创建新的历史记录文件
   */
  createNewHistoryFile() {
    const files = this.getHistoryFiles()
    let maxNumber = 0

    // 找到当前最大的文件编号
    files.forEach(file => {
      const filename = path.basename(file)
      const match = filename.match(/history_(\d+)\.json/)
      if (match) {
        maxNumber = Math.max(maxNumber, parseInt(match[1]))
      }
    })

    const newNumber = maxNumber + 1
    const newFilename = `${HISTORY_CONFIG.filePrefix}${String(newNumber).padStart(3, '0')}${HISTORY_CONFIG.fileExtension}`
    const newFilePath = path.join(HISTORY_CONFIG.historyDir, newFilename)

    // 创建空的历史记录文件
    fs.writeFileSync(newFilePath, JSON.stringify([], null, 2), 'utf-8')
    
    console.log(`📄 创建新历史记录文件: ${newFilename}`)
    return newFilePath
  }

  /**
   * 读取历史记录文件内容
   */
  readHistoryFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        return []
      }
      const content = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(content) || []
    } catch (error) {
      console.error('❌ 读取历史记录文件失败:', error)
      return []
    }
  }

  /**
   * 写入历史记录文件
   */
  writeHistoryFile(filePath, records) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(records, null, 2), 'utf-8')
      return true
    } catch (error) {
      console.error('❌ 写入历史记录文件失败:', error)
      return false
    }
  }

  /**
   * 生成唯一ID
   */
  generateId() {
    return `hist_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  /**
   * 添加历史记录
   */
  addRecord(recordData) {
    try {
      console.log('📝 开始添加历史记录')

      // 创建完整的历史记录对象
      const historyRecord = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        productInfo: {
          id: recordData.productId,
          name: recordData.productName
        },
        generationParams: {
          style: recordData.style,
          keywords: recordData.keywords,
          personality: recordData.personality,
          warmth: recordData.warmth,
          vulnerability: recordData.vulnerability,
          excitement: recordData.excitement,
          audienceAge: recordData.audienceAge,
          contentGoal: recordData.contentGoal
        },
        result: {
          title: recordData.result.title,
          bodyPlain: recordData.result.bodyPlain,
          bodyXHS: recordData.result.bodyXHS,
          tags: recordData.result.tags || []
        },
        metadata: {
          ai_model: recordData.result.ai_model,
          generation_time: recordData.result.generation_time
        }
      }

      // 获取最新的历史记录文件
      let latestFile = this.getLatestHistoryFile()
      let records = []

      if (latestFile) {
        records = this.readHistoryFile(latestFile)
      }

      // 检查是否需要新建文件
      if (!latestFile || records.length >= HISTORY_CONFIG.maxRecordsPerFile) {
        latestFile = this.createNewHistoryFile()
        records = []
      }

      // 添加新记录（插入到数组开头，保持时间倒序）
      records.unshift(historyRecord)

      // 保存文件
      const success = this.writeHistoryFile(latestFile, records)
      
      if (success) {
        console.log(`✅ 历史记录添加成功: ${historyRecord.id}`)
        console.log(`📊 当前文件记录数: ${records.length}/${HISTORY_CONFIG.maxRecordsPerFile}`)
        return {
          success: true,
          id: historyRecord.id,
          recordCount: records.length,
          filePath: path.basename(latestFile)
        }
      } else {
        throw new Error('写入历史记录文件失败')
      }

    } catch (error) {
      console.error('❌ 添加历史记录失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 获取历史记录列表（支持分页）
   */
  getHistoryList(page = 1, pageSize = 20) {
    try {
      console.log(`📋 获取历史记录列表: 第${page}页, ${pageSize}条/页`)

      const allFiles = this.getHistoryFiles()
      const allRecords = []

      // 读取所有历史记录文件
      allFiles.forEach(file => {
        const records = this.readHistoryFile(file)
        allRecords.push(...records)
      })

      // 计算分页
      const total = allRecords.length
      const totalPages = Math.ceil(total / pageSize)
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize

      const pageRecords = allRecords.slice(startIndex, endIndex)

      console.log(`📊 历史记录统计: 总${total}条, 共${totalPages}页, 当前返回${pageRecords.length}条`)

      return {
        success: true,
        data: {
          records: pageRecords,
          pagination: {
            page,
            pageSize,
            total,
            totalPages,
            hasMore: page < totalPages
          }
        }
      }

    } catch (error) {
      console.error('❌ 获取历史记录失败:', error)
      return {
        success: false,
        error: error.message,
        data: {
          records: [],
          pagination: {
            page: 1,
            pageSize,
            total: 0,
            totalPages: 0,
            hasMore: false
          }
        }
      }
    }
  }

  /**
   * 根据ID获取特定历史记录
   */
  getRecordById(id) {
    try {
      const allFiles = this.getHistoryFiles()
      
      for (const file of allFiles) {
        const records = this.readHistoryFile(file)
        const record = records.find(r => r.id === id)
        if (record) {
          return { success: true, record }
        }
      }

      return { success: false, error: '记录不存在' }
    } catch (error) {
      console.error('❌ 获取历史记录失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 删除历史记录
   */
  deleteRecord(id) {
    try {
      const allFiles = this.getHistoryFiles()
      
      for (const file of allFiles) {
        const records = this.readHistoryFile(file)
        const index = records.findIndex(r => r.id === id)
        
        if (index !== -1) {
          records.splice(index, 1)
          this.writeHistoryFile(file, records)
          console.log(`🗑️ 删除历史记录成功: ${id}`)
          return { success: true, message: '删除成功' }
        }
      }

      return { success: false, error: '记录不存在' }
    } catch (error) {
      console.error('❌ 删除历史记录失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 获取历史记录统计信息
   */
  getHistoryStats() {
    try {
      const allFiles = this.getHistoryFiles()
      let totalRecords = 0
      const fileStats = []

      allFiles.forEach(file => {
        const records = this.readHistoryFile(file)
        const filename = path.basename(file)
        totalRecords += records.length
        
        fileStats.push({
          filename,
          recordCount: records.length,
          maxCapacity: HISTORY_CONFIG.maxRecordsPerFile,
          usage: `${records.length}/${HISTORY_CONFIG.maxRecordsPerFile}`
        })
      })

      return {
        success: true,
        stats: {
          totalRecords,
          totalFiles: allFiles.length,
          maxRecordsPerFile: HISTORY_CONFIG.maxRecordsPerFile,
          files: fileStats
        }
      }
    } catch (error) {
      console.error('❌ 获取历史记录统计失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// 导出单例实例
export const historyManager = new HistoryManager()
export default historyManager
