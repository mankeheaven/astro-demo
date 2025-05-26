<template>
  <div 
    :class="[
      'p-6 rounded-lg shadow-lg border-2 border-green-200',
      state.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-green-50 text-gray-800'
    ]"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-green-600">
        🟢 Vue 组件
      </h2>
      <span class="text-sm opacity-75">
        最后更新: {{ new Date(state.lastUpdated).toLocaleTimeString() }}
      </span>
    </div>
    
    <!-- 用户信息 -->
    <div class="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg">
      <h3 class="font-semibold mb-2">当前用户信息</h3>
      <p>姓名: <span class="font-mono">{{ state.currentUser.name }}</span></p>
      <p>框架: <span class="font-mono">{{ state.currentUser.framework }}</span></p>
      
      <div class="mt-3 flex gap-2">
        <input
          v-model="userName"
          type="text"
          placeholder="输入新用户名"
          class="flex-1 px-3 py-1 border rounded text-black"
          @keypress.enter="handleSetUser"
        />
        <button
          @click="handleSetUser"
          class="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          设置
        </button>
      </div>
    </div>
    
    <!-- 共享计数器 -->
    <div class="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg">
      <h3 class="font-semibold mb-3">共享计数器</h3>
      <div class="text-center">
        <div class="text-4xl font-bold mb-4 text-green-600">
          {{ state.sharedCounter }}
        </div>
        <div class="flex justify-center gap-2">
          <button
            @click="decrementCounter"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            -1
          </button>
          <button
            @click="resetCounter"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            重置
          </button>
          <button
            @click="incrementCounter"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            +1
          </button>
        </div>
      </div>
    </div>
    
    <!-- 消息系统 -->
    <div class="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-semibold">共享消息</h3>
        <button
          @click="clearMessages"
          class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
        >
          清除
        </button>
      </div>
      
      <div class="mb-3 flex gap-2">
        <input
          v-model="customMessage"
          type="text"
          placeholder="输入消息"
          class="flex-1 px-3 py-1 border rounded text-black"
          @keypress.enter="handleAddMessage"
        />
        <button
          @click="handleAddMessage"
          class="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          发送
        </button>
      </div>
      
      <div class="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-600">
        <ul v-if="state.sharedMessages.length > 0" class="space-y-1">
          <li v-for="msg in state.sharedMessages" :key="msg.id" class="text-sm">
            <span class="text-gray-500">[{{ msg.timestamp }}]</span>
            <span 
              :class="[
                'ml-1 px-1 rounded text-xs',
                msg.framework === 'React' ? 'bg-blue-200 text-blue-800' :
                msg.framework === 'Vue' ? 'bg-green-200 text-green-800' :
                msg.framework === 'Vanilla' ? 'bg-yellow-200 text-yellow-800' :
                'bg-gray-200 text-gray-800'
              ]"
            >
              {{ msg.framework }}
            </span>
            <span class="ml-2">{{ msg.text }}</span>
          </li>
        </ul>
        <p v-else class="text-gray-500 text-center italic">暂无消息</p>
      </div>
    </div>
    
    <!-- 主题切换 -->
    <div class="p-4 bg-white dark:bg-gray-700 rounded-lg">
      <div class="flex justify-between items-center">
        <span class="font-semibold">当前主题: {{ state.theme }}</span>
        <button
          @click="toggleTheme"
          class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          切换主题
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import universalStore from '../stores/universalStore.js';

// 响应式状态
const state = reactive({
  sharedCounter: 0,
  sharedMessages: [],
  currentUser: { name: '匿名用户', framework: 'unknown' },
  theme: 'light',
  lastUpdated: new Date().toISOString()
});

// 本地状态
const userName = ref('');
const customMessage = ref('');

// 更新状态的函数
const updateState = (newState) => {
  Object.assign(state, newState);
};

// 订阅状态变化
let unsubscribe = null;

onMounted(() => {
  // 初始化状态
  updateState(universalStore.getState());
  
  // 设置用户
  universalStore.setUser('Vue用户', 'Vue');
  
  // 订阅状态变化
  unsubscribe = universalStore.subscribe(updateState);
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

// 操作方法
const incrementCounter = () => universalStore.incrementCounter();
const decrementCounter = () => universalStore.decrementCounter();
const resetCounter = () => universalStore.resetCounter();
const clearMessages = () => universalStore.clearMessages();
const toggleTheme = () => universalStore.toggleTheme();

const handleSetUser = () => {
  if (userName.value.trim()) {
    universalStore.setUser(userName.value.trim(), 'Vue');
    userName.value = '';
  }
};

const handleAddMessage = () => {
  if (customMessage.value.trim()) {
    universalStore.addMessage(customMessage.value.trim(), 'Vue');
    customMessage.value = '';
  }
};
</script> 