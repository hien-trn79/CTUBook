<script setup>
import { ref, onMounted } from 'vue';
import { animate, spring, stagger } from 'motion';

// Refs cho các elements
const box1 = ref(null);
const box2 = ref(null);
const box3 = ref(null);
const listItems = ref([]);

// Animation functions
const animateBox1 = () => {
    animate(box1.value,
        { x: 200, rotate: 360 },
        { duration: 1, easing: spring() }
    );
};

const animateBox2 = () => {
    animate(box2.value,
        { scale: 1.5, backgroundColor: '#ff6b6b' },
        { duration: 0.5 }
    );
};

const animateBox3 = () => {
    animate(box3.value,
        { y: -50, opacity: [1, 0.5, 1] },
        { duration: 1, repeat: 2 }
    );
};

// Animate list với stagger effect
const animateList = () => {
    animate(listItems.value,
        { x: [0, 20, 0], opacity: [0.5, 1] },
        { duration: 0.3, delay: stagger(0.1) }
    );
};

// Sequence animation
const sequenceAnimation = () => {
    const sequence = async () => {
        await animate(box1.value, { x: 100 }, { duration: 0.5 });
        await animate(box2.value, { y: 100 }, { duration: 0.5 });
        await animate(box3.value, { rotate: 180 }, { duration: 0.5 });
    };
    sequence();
};

// Reset all animations
const resetAll = () => {
    animate(box1.value, { x: 0, rotate: 0 }, { duration: 0.5 });
    animate(box2.value, { scale: 1, backgroundColor: '#4CAF50', y: 0 }, { duration: 0.5 });
    animate(box3.value, { y: 0, rotate: 0, opacity: 1 }, { duration: 0.5 });
    animate(listItems.value, { x: 0, opacity: 1 }, { duration: 0.3 });
};

// Auto animation on mount
onMounted(() => {
    // Fade in animation when component mounts
    animate(box1.value, { opacity: [0, 1], y: [-20, 0] }, { duration: 0.5 });
    animate(box2.value, { opacity: [0, 1], y: [-20, 0] }, { duration: 0.5, delay: 0.1 });
    animate(box3.value, { opacity: [0, 1], y: [-20, 0] }, { duration: 0.5, delay: 0.2 });
});
</script>

<template>
    <div class="motion-container">
        <h1>🎨 Motion Demo cho Vue</h1>

        <!-- Control Buttons -->
        <div class="controls">
            <button @click="animateBox1" class="btn btn-primary">
                Animate Box 1 (Move & Rotate)
            </button>
            <button @click="animateBox2" class="btn btn-success">
                Animate Box 2 (Scale & Color)
            </button>
            <button @click="animateBox3" class="btn btn-info">
                Animate Box 3 (Bounce)
            </button>
            <button @click="animateList" class="btn btn-warning">
                Animate List (Stagger)
            </button>
            <button @click="sequenceAnimation" class="btn btn-purple">
                Sequence Animation
            </button>
            <button @click="resetAll" class="btn btn-danger">
                Reset All
            </button>
        </div>

        <!-- Animation Boxes -->
        <div class="boxes-container">
            <div ref="box1" class="box box1">
                <span>Box 1</span>
            </div>
            <div ref="box2" class="box box2">
                <span>Box 2</span>
            </div>
            <div ref="box3" class="box box3">
                <span>Box 3</span>
            </div>
        </div>

        <!-- List Animation Example -->
        <div class="list-container">
            <h3>List với Stagger Effect:</h3>
            <ul>
                <li ref="listItems" v-for="n in 5" :key="n">
                    Item {{ n }}
                </li>
            </ul>
        </div>

        <!-- Code Examples -->
        <div class="code-section">
            <h2>📝 Cách sử dụng Motion trong Vue:</h2>

            <div class="code-block">
                <h3>1. Import Motion:</h3>
                <pre><code>import { animate, spring, stagger } from 'motion';</code></pre>
            </div>

            <div class="code-block">
                <h3>2. Basic Animation:</h3>
                <pre><code>animate(element.value, 
  { x: 200, rotate: 360 },
  { duration: 1 }
);</code></pre>
            </div>

            <div class="code-block">
                <h3>3. Spring Animation:</h3>
                <pre><code>animate(element.value, 
  { scale: 1.5 },
  { easing: spring() }
);</code></pre>
            </div>

            <div class="code-block">
                <h3>4. Stagger (nhiều elements):</h3>
                <pre><code>animate(elements.value, 
  { x: 20 },
  { delay: stagger(0.1) }
);</code></pre>
            </div>

            <div class="code-block">
                <h3>5. Sequence (tuần tự):</h3>
                <pre><code>const sequence = async () => {
  await animate(box1.value, { x: 100 });
  await animate(box2.value, { y: 100 });
};</code></pre>
            </div>
        </div>
    </div>
</template>

<style scoped>
.motion-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
}

.controls {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 40px;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: opacity 0.2s;
}

.btn:hover {
    opacity: 0.8;
}

.btn-primary {
    background-color: #007bff;
}

.btn-success {
    background-color: #28a745;
}

.btn-info {
    background-color: #17a2b8;
}

.btn-warning {
    background-color: #ffc107;
    color: #333;
}

.btn-purple {
    background-color: #6f42c1;
}

.btn-danger {
    background-color: #dc3545;
}

.boxes-container {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-bottom: 50px;
    min-height: 200px;
}

.box {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    color: white;
    font-weight: bold;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.box1 {
    background-color: #007bff;
}

.box2 {
    background-color: #4CAF50;
}

.box3 {
    background-color: #ff9800;
}

.list-container {
    max-width: 400px;
    margin: 0 auto 50px;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 10px;
}

.list-container h3 {
    margin-bottom: 15px;
    color: #333;
}

.list-container ul {
    list-style: none;
    padding: 0;
}

.list-container li {
    padding: 12px 20px;
    margin-bottom: 10px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.code-section {
    margin-top: 50px;
    padding-top: 30px;
    border-top: 2px solid #ddd;
}

.code-section h2 {
    color: #333;
    margin-bottom: 20px;
}

.code-block {
    margin-bottom: 25px;
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #007bff;
}

.code-block h3 {
    color: #555;
    margin-bottom: 10px;
    font-size: 16px;
}

.code-block pre {
    margin: 0;
    background-color: #282c34;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
}

.code-block code {
    color: #abb2bf;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
}
</style>
