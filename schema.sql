-- ============================================
# 初中英语听力小站 - 数据库初始化脚本
-- 适用于 SQLite / MySQL
-- 用于存储音频元数据、上传记录等
-- ============================================

-- 音频表
CREATE TABLE IF NOT EXISTS audios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER DEFAULT 0,
    file_type TEXT DEFAULT 'audio/mpeg',
    duration INTEGER DEFAULT 0,
    uploader TEXT DEFAULT '匿名',
    upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_public INTEGER DEFAULT 1,
    play_count INTEGER DEFAULT 0
);

-- 上传记录表
CREATE TABLE IF NOT EXISTS upload_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    audio_id INTEGER,
    ip_address TEXT,
    user_agent TEXT,
    upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audio_id) REFERENCES audios(id)
);

-- 播放记录表
CREATE TABLE IF NOT EXISTS play_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    audio_id INTEGER,
    play_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    duration_played INTEGER DEFAULT 0,
    FOREIGN KEY (audio_id) REFERENCES audios(id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_audios_name ON audios(name);
CREATE INDEX IF NOT EXISTS idx_audios_upload_time ON audios(upload_time);
CREATE INDEX IF NOT EXISTS idx_play_logs_audio_id ON play_logs(audio_id);

-- 插入示例数据
INSERT OR IGNORE INTO audios (name, original_name, file_path, file_size, file_type, duration, uploader)
VALUES 
    ('11月22~23英语试1听力', 'full_listening.mp3', 'audio/full_listening.mp3', 3902592, 'audio/mpeg', 666, '系统'),
    ('瓦妮莎的微笑-试音', '瓦妮莎的微笑.mp3', 'audio/瓦妮莎的微笑.mp3', 461000, 'audio/mpeg', 29, '系统');

