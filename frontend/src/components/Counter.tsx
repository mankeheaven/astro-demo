import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-xl mb-4">当前计数: <span className="font-bold">{count}</span></p>
      
      <div className="flex space-x-4">
        <button 
          onClick={() => setCount(count - 1)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          减少
        </button>
        
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          增加
        </button>
        
        <button 
          onClick={() => setCount(0)}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          重置
        </button>
      </div>
    </div>
  );
} 