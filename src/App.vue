<template>
  <div class="app-container">
    <!-- 头部 -->
    <header class="header">
      <h1>📜 古韵今释</h1>
      <p>古籍智能解读平台</p>
    </header>

    <!-- 主体内容 -->
    <main class="main-content">
      <el-row :gutter="20">
        <!-- 左侧：输入区 -->
        <el-col :span="12">
          <el-card class="input-card">
            <template #header>
              <div class="card-header">
                <span>📖 输入古文</span>
                <el-button type="primary" size="small" @click="loadExample">
                  加载示例
                </el-button>
              </div>
            </template>
            
            <el-input
              v-model="inputText"
              type="textarea"
              :rows="10"
              placeholder="请输入古文内容，或点击右上角加载示例..."
              @select="handleTextSelect"
            />
            
            <!-- 划词注释弹窗 -->
            <el-popover
              v-if="selectedWord"
              :visible="showPopover"
              placement="top"
              :width="400"
            >
              <template #reference>
                <span></span>
              </template>
              <div class="annotation-popover">
                <h4>📝 "{{ selectedWord }}" 的注释</h4>
                <el-button 
                  type="primary" 
                  size="small" 
                  @click="getAnnotation"
                  :loading="annotating"
                >
                  获取注释
                </el-button>
                <div v-if="annotation" class="annotation-content">
                  {{ annotation }}
                </div>
              </div>
            </el-popover>
            
            <div class="button-group">
              <el-button 
                type="primary" 
                @click="translate"
                :loading="translating"
              >
                🔄 翻译
              </el-button>
              <el-button @click="clearAll">
                🗑️ 清空
              </el-button>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧：结果区 -->
        <el-col :span="12">
          <el-card class="result-card">
            <template #header>
              <span>📝 解读结果</span>
            </template>
            
            <el-tabs v-model="activeTab">
              <!-- 翻译结果 -->
              <el-tab-pane label="翻译" name="translate">
                <div v-if="translation" class="result-text">
                  {{ translation }}
                </div>
                <el-empty v-else description="暂无翻译结果" />
              </el-tab-pane>
              
              <!-- AI问答 -->
              <el-tab-pane label="深度解读" name="qa">
                <div class="qa-section">
                  <el-input
                    v-model="question"
                    placeholder="输入问题，如：这段话的深层含义是什么？"
                    @keyup.enter="askQuestion"
                  >
                    <template #append>
                      <el-button 
                        @click="askQuestion"
                        :loading="answering"
                      >
                        提问
                      </el-button>
                    </template>
                  </el-input>
                  
                  <div v-if="answer" class="answer-box">
                    <div class="answer-label">💡 AI解读：</div>
                    <div class="answer-content">{{ answer }}</div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </main>

    <!-- 底部 -->
    <footer class="footer">
      <p>基于AI大模型的古籍智能解读平台 | 2026</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 状态
const inputText = ref('')
const translation = ref('')
const selectedWord = ref('')
const showPopover = ref(false)
const annotation = ref('')
const question = ref('')
const answer = ref('')
const activeTab = ref('translate')

// 加载状态
const translating = ref(false)
const annotating = ref(false)
const answering = ref(false)

// API基础地址
const API_BASE = import.meta.env.VITE_API_BASE || ''

// 示例古文
const examples = [
  `先天下之忧而忧，后天下之乐而乐。
——范仲淹《岳阳楼记》`,
  `落霞与孤鹜齐飞，秋水共长天一色。
——王勃《滕王阁序》`,
  `路漫漫其修远兮，吾将上下而求索。
——屈原《离骚》`
]

// 加载示例
const loadExample = () => {
  const randomIndex = Math.floor(Math.random() * examples.length)
  inputText.value = examples[randomIndex]
  ElMessage.success('已加载示例古文')
}

// 翻译
const translate = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入古文内容')
    return
  }
  
  translating.value = true
  try {
    const response = await axios.post(`${API_BASE}/api/translate`, {
      text: inputText.value
    })
    
    if (response.data.success) {
      translation.value = response.data.translation
      activeTab.value = 'translate'
      ElMessage.success('翻译完成')
    }
  } catch (error) {
    ElMessage.error('翻译失败：' + (error.response?.data?.error || error.message))
  } finally {
    translating.value = false
  }
}

// 处理文本选择
const handleTextSelect = (e) => {
  const selection = window.getSelection()
  const text = selection.toString().trim()
  
  if (text && text.length <= 20) {
    selectedWord.value = text
    showPopover.value = true
    annotation.value = ''
  }
}

// 获取注释
const getAnnotation = async () => {
  if (!selectedWord.value) return
  
  annotating.value = true
  try {
    const response = await axios.post(`${API_BASE}/api/annotate`, {
      word: selectedWord.value,
      context: inputText.value
    })
    
    if (response.data.success) {
      annotation.value = response.data.annotation
    }
  } catch (error) {
    ElMessage.error('获取注释失败')
  } finally {
    annotating.value = false
  }
}

// AI问答
const askQuestion = async () => {
  if (!question.value.trim()) {
    ElMessage.warning('请输入问题')
    return
  }
  
  if (!inputText.value.trim()) {
    ElMessage.warning('请先输入古文内容')
    return
  }
  
  answering.value = true
  try {
    const response = await axios.post(`${API_BASE}/api/qa`, {
      question: question.value,
      context: inputText.value
    })
    
    if (response.data.success) {
      answer.value = response.data.answer
    }
  } catch (error) {
    ElMessage.error('提问失败：' + (error.response?.data?.error || error.message))
  } finally {
    answering.value = false
  }
}

// 清空
const clearAll = () => {
  inputText.value = ''
  translation.value = ''
  annotation.value = ''
  question.value = ''
  answer.value = ''
  selectedWord.value = ''
  ElMessage.success('已清空')
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
}

.input-card, .result-card {
  height: 600px;
  overflow: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.result-text {
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: 1.1rem;
  color: #333;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.annotation-popover {
  padding: 10px;
}

.annotation-popover h4 {
  margin-bottom: 10px;
  color: #333;
}

.annotation-content {
  margin-top: 15px;
  padding: 10px;
  background: #f0f7ff;
  border-radius: 6px;
  line-height: 1.6;
}

.qa-section {
  padding: 10px 0;
}

.answer-box {
  margin-top: 20px;
  padding: 15px;
  background: #fff8e6;
  border-radius: 8px;
  border-left: 4px solid #e6a23c;
}

.answer-label {
  font-weight: bold;
  margin-bottom: 10px;
  color: #e6a23c;
}

.answer-content {
  line-height: 1.8;
  white-space: pre-wrap;
}

.footer {
  text-align: center;
  color: white;
  margin-top: 30px;
  padding: 20px;
  opacity: 0.8;
}
</style>
