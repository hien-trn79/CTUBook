# 🎨 Hướng Dẫn Sử Dụng Motion trong Vue

## 📦 Cài đặt (Đã cài)
```bash
npm install motion
```

## 🚀 Cách sử dụng trong Vue 3

### 1️⃣ **Import Motion**
```javascript
import { animate, spring, stagger, timeline, scroll } from 'motion';
```

### 2️⃣ **Basic Animation - Di chuyển & Xoay**
```vue
<script setup>
import { ref } from 'vue';
import { animate } from 'motion';

const box = ref(null);

const moveBox = () => {
  animate(box.value, 
    { x: 200, rotate: 360 },
    { duration: 1 }
  );
};
</script>

<template>
  <div ref="box" @click="moveBox" class="box">
    Click me!
  </div>
</template>
```

### 3️⃣ **Spring Animation - Hiệu ứng đàn hồi**
```javascript
import { spring } from 'motion';

animate(element.value, 
  { scale: 1.5, y: -50 },
  { 
    easing: spring({ 
      stiffness: 300,
      damping: 20 
    }) 
  }
);
```

### 4️⃣ **Stagger Effect - Animation theo thứ tự**
```vue
<script setup>
import { ref } from 'vue';
import { animate, stagger } from 'motion';

const items = ref([]);

const animateItems = () => {
  animate(items.value,
    { opacity: [0, 1], y: [20, 0] },
    { duration: 0.5, delay: stagger(0.1) }
  );
};
</script>

<template>
  <div v-for="n in 5" :key="n" ref="items">
    Item {{ n }}
  </div>
  <button @click="animateItems">Animate</button>
</template>
```

### 5️⃣ **Sequence Animation - Tuần tự**
```javascript
const sequence = async () => {
  await animate(box1.value, { x: 100 }, { duration: 0.5 });
  await animate(box2.value, { y: 100 }, { duration: 0.5 });
  await animate(box3.value, { scale: 1.5 }, { duration: 0.5 });
};
```

### 6️⃣ **Timeline - Nhiều animation cùng lúc**
```javascript
import { timeline } from 'motion';

timeline([
  [box1.value, { x: 100 }],
  [box2.value, { y: 100 }, { at: "-0.5" }], // Bắt đầu trước khi box1 kết thúc 0.5s
  [box3.value, { rotate: 180 }, { at: "<" }]  // Bắt đầu cùng lúc với box2
]);
```

### 7️⃣ **Scroll Animation - Animation khi scroll**
```javascript
import { scroll } from 'motion';

scroll(
  animate(element.value, { opacity: [0, 1], x: [-100, 0] }),
  {
    target: element.value,
    offset: ["start end", "end start"]
  }
);
```

### 8️⃣ **Hover & Interactive Animations**
```vue
<script setup>
import { ref } from 'vue';
import { animate } from 'motion';

const button = ref(null);

const onHover = () => {
  animate(button.value, 
    { scale: 1.1, backgroundColor: '#ff6b6b' },
    { duration: 0.2 }
  );
};

const onLeave = () => {
  animate(button.value,
    { scale: 1, backgroundColor: '#4CAF50' },
    { duration: 0.2 }
  );
};
</script>

<template>
  <button 
    ref="button" 
    @mouseenter="onHover" 
    @mouseleave="onLeave"
  >
    Hover Me
  </button>
</template>
```

### 9️⃣ **onMounted Animation - Tự động khi load**
```vue
<script setup>
import { ref, onMounted } from 'vue';
import { animate } from 'motion';

const container = ref(null);

onMounted(() => {
  animate(container.value,
    { opacity: [0, 1], y: [-50, 0] },
    { duration: 0.8 }
  );
});
</script>

<template>
  <div ref="container">
    Content sẽ fade in khi component mount
  </div>
</template>
```

### 🔟 **Ví dụ cho Book List - Stagger Cards**
```vue
<script setup>
import { ref, onMounted } from 'vue';
import { animate, stagger } from 'motion';

const books = ref([
  { id: 1, title: 'Sách 1' },
  { id: 2, title: 'Sách 2' },
  { id: 3, title: 'Sách 3' }
]);

const bookCards = ref([]);

onMounted(() => {
  animate(bookCards.value,
    { 
      opacity: [0, 1], 
      y: [30, 0],
      scale: [0.9, 1]
    },
    { 
      duration: 0.5, 
      delay: stagger(0.1),
      easing: 'ease-out'
    }
  );
});

const onCardHover = (index) => {
  animate(bookCards.value[index],
    { scale: 1.05, y: -10 },
    { duration: 0.3 }
  );
};

const onCardLeave = (index) => {
  animate(bookCards.value[index],
    { scale: 1, y: 0 },
    { duration: 0.3 }
  );
};
</script>

<template>
  <div class="book-grid">
    <div 
      v-for="(book, index) in books" 
      :key="book.id"
      ref="bookCards"
      @mouseenter="onCardHover(index)"
      @mouseleave="onCardLeave(index)"
      class="book-card"
    >
      <h3>{{ book.title }}</h3>
    </div>
  </div>
</template>

<style scoped>
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.book-card {
  padding: 20px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
}
</style>
```

## 📝 Các thuộc tính Animation

### Transform Properties:
- `x`, `y`, `z` - Di chuyển
- `rotate` - Xoay (độ)
- `scale` - Phóng to/nhỏ
- `skewX`, `skewY` - Nghiêng

### Visual Properties:
- `opacity` - Độ trong suốt (0-1)
- `backgroundColor` - Màu nền
- `color` - Màu chữ
- `width`, `height` - Kích thước

### Options:
- `duration` - Thời gian (giây)
- `delay` - Trễ (giây)
- `easing` - Kiểu chuyển động
- `repeat` - Số lần lặp
- `direction` - `"normal"` | `"reverse"` | `"alternate"`

## 🎯 Easing Functions
```javascript
// Built-in
"linear"
"ease-in"
"ease-out"
"ease-in-out"

// Custom cubic-bezier
[0.42, 0, 0.58, 1]

// Spring
spring({ stiffness: 300, damping: 20 })
```

## ⚡ Performance Tips

1. **Sử dụng transform thay vì position:**
   ```javascript
   // ✅ Good
   animate(el, { x: 100, y: 100 })
   
   // ❌ Bad
   animate(el, { left: '100px', top: '100px' })
   ```

2. **Cleanup animations:**
   ```javascript
   import { onUnmounted } from 'vue';
   
   let animation;
   
   onMounted(() => {
     animation = animate(el.value, { ... });
   });
   
   onUnmounted(() => {
     animation?.stop();
   });
   ```

## 🔗 Xem Demo
Truy cập: `http://localhost:3001/testMotion`

## 📚 Tài liệu chính thức
https://motion.dev/docs

---

✨ **Lưu ý:** Motion hoạt động tốt nhất với Vue 3 và Composition API (`<script setup>`)
