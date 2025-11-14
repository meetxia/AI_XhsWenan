import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 多轮优化历史记录配置
const MULTI_ROUND_CONFIG = {
  maxRecordsPerFile: 100,
  historyDir: path.join(__dirname, '..', 'data', 'multi-round-history'),
  filePrefix: 'multi_round_',
  fileExtension: '.json'
}

/**
 * 多轮AI优化历史记录管理器
 */
class MultiRoundHistoryManager {
  constructor() {
    this.ensureHistoryDir()
  }

  /**
   * 确保多轮优化历史记录目录存在
   */
  ensureHistoryDir() {
    if (!fs.existsSync(MULTI_ROUND_CONFIG.historyDir)) {
      fs.mkdirSync(MULTI_ROUND_CONFIG.historyDir, { recursive: true })
      console.log('📁 创建多轮优化历史记录目录:', MULTI_ROUND_CONFIG.historyDir)
    }
  }

  /**
   * 获取历史记录文件列表（按文件名排序）
   */
  getHistoryFiles() {
    const files = fs.readdirSync(MULTI_ROUND_CONFIG.historyDir)
      .filter(file => file.startsWith(MULTI_ROUND_CONFIG.filePrefix) && file.endsWith(MULTI_ROUND_CONFIG.fileExtension))
      .sort((a, b) => {
        const getNumber = (filename) => {
          const match = filename.match(/multi_round_(\d+)\.json/)
          return match ? parseInt(match[1]) : 0
        }
        return getNumber(b) - getNumber(a) // 降序，最新的在前
      })
    
    return files.map(file => path.join(MULTI_ROUND_CONFIG.historyDir, file))
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

    files.forEach(file => {
      const filename = path.basename(file)
      const match = filename.match(/multi_round_(\d+)\.json/)
      if (match) {
        maxNumber = Math.max(maxNumber, parseInt(match[1]))
      }
    })

    const newNumber = maxNumber + 1
    const newFilename = `${MULTI_ROUND_CONFIG.filePrefix}${String(newNumber).padStart(3, '0')}${MULTI_ROUND_CONFIG.fileExtension}`
    const newFilePath = path.join(MULTI_ROUND_CONFIG.historyDir, newFilename)

    fs.writeFileSync(newFilePath, JSON.stringify([], null, 2), 'utf-8')
    
    console.log(`📄 创建新多轮优化历史记录文件: ${newFilename}`)
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
      console.error('❌ 读取多轮优化历史记录文件失败:', error)
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
      console.error('❌ 写入多轮优化历史记录文件失败:', error)
      return false
    }
  }

  /**
   * 生成唯一ID
   */
  generateId() {
    return `multi_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  /**
   * 添加多轮优化历史记录
   */
  addMultiRoundRecord(recordData) {
    try {
      console.log('📝 开始添加多轮优化历史记录')

      // 创建完整的多轮优化历史记录对象
      const multiRoundRecord = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        
        // 基础信息
        productInfo: {
          id: recordData.productId,
          name: recordData.productName
        },
        
        // 生成参数
        generationParams: {
          productId: recordData.productId,
          productName: recordData.productName,
          style: recordData.style,
          keywords: recordData.keywords,
          personality: recordData.personality,
          warmth: recordData.warmth,
          vulnerability: recordData.vulnerability,
          excitement: recordData.excitement,
          audienceAge: recordData.audienceAge,
          contentGoal: recordData.contentGoal
        },

        // 多轮对话记录（直接保存rounds对象格式）
        rounds: recordData.rounds || {},
        
        // 原始内容
        originalContent: recordData.originalContent || {},
        
        // 优化后内容
        optimizedContent: recordData.finalResult || {},
        
        // 质量分析
        qualityAnalysis: recordData.analysis || {},
        
        // 改进信息
        improvement: recordData.improvement || {},

        // 对比数据
        comparison: {
          originalContent: recordData.originalContent,
          optimizedContent: recordData.finalResult,
          qualityAnalysis: recordData.analysis,
          improvement: {
            scoreImprovement: this.calculateScoreImprovement(recordData.analysis),
            keyChanges: this.extractKeyChanges(recordData.originalContent, recordData.finalResult)
          }
        },

        // 元数据
        metadata: {
          ai_model: recordData.ai_model || 'deepseek-v3.1',
          total_generation_time: recordData.totalTime || 0,
          multiRound: true,
          processSteps: recordData.processSteps || ['生成', '分析', '优化'],
          success: true
        }
      }

      // 获取最新的历史记录文件
      let latestFile = this.getLatestHistoryFile()
      let records = []

      if (latestFile) {
        records = this.readHistoryFile(latestFile)
      }

      // 检查是否需要新建文件
      if (!latestFile || records.length >= MULTI_ROUND_CONFIG.maxRecordsPerFile) {
        latestFile = this.createNewHistoryFile()
        records = []
      }

      // 添加新记录（插入到数组开头，保持时间倒序）
      records.unshift(multiRoundRecord)

      // 保存文件
      const success = this.writeHistoryFile(latestFile, records)
      
      if (success) {
        console.log(`✅ 多轮优化历史记录添加成功: ${multiRoundRecord.id}`)
        console.log(`📊 当前文件记录数: ${records.length}/${MULTI_ROUND_CONFIG.maxRecordsPerFile}`)
        return {
          success: true,
          id: multiRoundRecord.id,
          recordCount: records.length,
          filePath: path.basename(latestFile)
        }
      } else {
        throw new Error('写入多轮优化历史记录文件失败')
      }

    } catch (error) {
      console.error('❌ 添加多轮优化历史记录失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 计算评分改进情况
   */
  calculateScoreImprovement(analysis) {
    if (!analysis?.analysis) return null
    
    const { authenticity, viralPotential, platformFit } = analysis.analysis
    return {
      authenticity: authenticity?.score || 0,
      viralPotential: viralPotential?.score || 0,
      platformFit: platformFit?.score || 0,
      overall: analysis.overallScore || 0
    }
  }

  /**
   * 提取关键变化
   */
  extractKeyChanges(original, optimized) {
    if (!original || !optimized) return []
    
    const changes = []
    
    if (original.title !== optimized.title) {
      changes.push({
        type: 'title',
        description: '标题优化',
        from: original.title,
        to: optimized.title
      })
    }
    
    if (original.bodyPlain !== optimized.bodyPlain) {
      changes.push({
        type: 'content',
        description: '正文内容优化',
        lengthChange: optimized.bodyPlain.length - original.bodyPlain.length
      })
    }

    return changes
  }

  /**
   * 获取多轮优化历史记录列表（支持分页）
   */
  getMultiRoundHistory(page = 1, pageSize = 20) {
    try {
      console.log(`📋 获取多轮优化历史记录列表: 第${page}页, ${pageSize}条/页`)

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

      console.log(`📊 多轮优化历史记录统计: 总${total}条, 共${totalPages}页, 当前返回${pageRecords.length}条`)

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
      console.error('❌ 获取多轮优化历史记录失败:', error)
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
   * 根据ID获取特定多轮优化记录
   */
  getMultiRoundRecordById(id) {
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
      console.error('❌ 获取多轮优化记录失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 删除多轮优化记录
   */
  deleteMultiRoundRecord(id) {
    try {
      const allFiles = this.getHistoryFiles()
      
      for (const file of allFiles) {
        const records = this.readHistoryFile(file)
        const index = records.findIndex(r => r.id === id)
        
        if (index !== -1) {
          records.splice(index, 1)
          this.writeHistoryFile(file, records)
          console.log(`🗑️ 删除多轮优化记录成功: ${id}`)
          return { success: true, message: '删除成功' }
        }
      }

      return { success: false, error: '记录不存在' }
    } catch (error) {
      console.error('❌ 删除多轮优化记录失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 获取多轮优化历史记录统计信息
   */
  getMultiRoundStats() {
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
          maxCapacity: MULTI_ROUND_CONFIG.maxRecordsPerFile,
          usage: `${records.length}/${MULTI_ROUND_CONFIG.maxRecordsPerFile}`
        })
      })

      return {
        success: true,
        stats: {
          totalRecords,
          totalFiles: allFiles.length,
          maxRecordsPerFile: MULTI_ROUND_CONFIG.maxRecordsPerFile,
          files: fileStats
        }
      }
    } catch (error) {
      console.error('❌ 获取多轮优化统计失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// 导出单例实例
export const multiRoundHistoryManager = new MultiRoundHistoryManager()
export default multiRoundHistoryManager
