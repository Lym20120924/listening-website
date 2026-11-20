// ========== 音乐听力小站 🎧 ==========
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('audioFile');
const audioList = document.getElementById('audioList');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const mainAudio = document.getElementById('mainAudio');
const currentTitle = document.getElementById('currentTitle');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

let audios = JSON.parse(localStorage.getItem('listenAudios')) || [];

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}
function save() {
    localStorage.setItem('listenAudios', JSON.stringify(audios));
    render();
}
function render() {
    const keyword = searchInput.value.toLowerCase();
    const filtered = audios.filter(a => a.name.toLowerCase().includes(keyword));
    audioList.innerHTML = '';
    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        audioList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        audioList.style.display = 'grid';
        filtered.forEach((audio) => {
            const originalIndex = audios.indexOf(audio);
            const item = document.createElement('div');
            item.className = 'audio-item';
            item.innerHTML = `
                <h3>🎵 ${escapeHtml(audio.name)}</h3>
                <p>📦 大小：${formatSize(audio.size)}</p>
                <audio controls preload="none" src="${audio.url}"></audio>
                <div style="margin-top:10px;">
                    <button class="play-btn" onclick="playAudio(${originalIndex})" style="background:#4CAF50;color:white;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;margin-right:5px;">▶️ 播放</button>
                    <button class="delete-btn" onclick="deleteAudio(${originalIndex})">🗑️ 删除</button>
                </div>
            `;
            audioList.appendChild(item);
        });
    }
}
window.playAudio = function(index) {
    const audio = audios[index];
    mainAudio.src = audio.url;
    currentTitle.textContent = `🎵 正在播放：${audio.name}`;
    mainAudio.play().catch(e => console.log('播放失败:', e));
};
window.deleteAudio = function(index) {
    if (confirm('🗑️ 确定要删除这个音频吗？')) {
        audios.splice(index, 1);
        save();
        if (mainAudio.src && mainAudio.src.includes(audios[index]?.url || '')) {
            mainAudio.pause();
            currentTitle.textContent = '🎵 选择一个音频开始聆听～';
        }
    }
};
uploadBox.addEventListener('click', () => fileInput.click());
uploadBox.addEventListener('dragover', (e) => { e.preventDefault(); uploadBox.classList.add('drag-over'); });
uploadBox.addEventListener('dragleave', () => { uploadBox.classList.remove('drag-over'); });
uploadBox.addEventListener('drop', (e) => {
    e.preventDefault(); uploadBox.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
});
fileInput.addEventListener('change', (e) => { handleFiles(e.target.files); });
function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('audio/')) { alert('⚠️ 只能上传音频文件哦～'); return; }
        const url = URL.createObjectURL(file);
        audios.push({ name: file.name, size: file.size, url: url, type: file.type });
    });
    save(); alert(`✅ 已添加 ${files.length} 个音频！`);
}
searchInput.addEventListener('input', render);
mainAudio.addEventListener('loadedmetadata', () => { durationEl.textContent = formatTime(mainAudio.duration); });
mainAudio.addEventListener('timeupdate', () => {
    const percent = (mainAudio.currentTime / mainAudio.duration) * 100 || 0;
    progressBar.style.width = percent + '%';
    currentTimeEl.textContent = formatTime(mainAudio.currentTime);
});
progressBar.parentElement.addEventListener('click', (e) => {
    const rect = progressBar.parentElement.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    mainAudio.currentTime = percent * mainAudio.duration;
});
function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}
render();
