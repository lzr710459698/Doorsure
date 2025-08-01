# 📷 DoorSure Web Dashboard

This is a mobile-friendly web dashboard for the **DoorSure** project, powered by **Firebase Realtime Database** and **Firebase Storage**. It enables live camera streaming, remote snapshot capture, and AI-based object detection using data from an ESP32-S3 CAM module.

---

## 🌟 Features

- ✅ Live image stream (auto-refreshing)
- 📸 Trigger snapshot and upload to Firebase
- 🧠 Display AI detection result from Gemini API
- 🚪 Obstruction detection using `ultrasonic` + `g_length` comparison
- 🔴 Streaming control (Start/Stop)
- 🔒 Auto-stops streaming on tab close, reload, or switch
- 🔁 Firebase Realtime Database for sync
- 🖼️ UI optimized for both desktop and mobile

---

## 📁 Folder Structure

```
📁 web-dashboard/
├── index.html         # Main dashboard (this file)
├── logo.png           # Project logo used in UI
```

---

## 🧱 Firebase Integration

This dashboard connects to **two Firebase projects**:

| Project | Purpose |
|--------|---------|
| `esp32-object-detection-d863a` | ESP32 image upload, streaming control, trigger |
| `doorsure-sd25` | Gemini AI result processing, obstruction logic |

### 🔌 Firebase Paths Used

#### From `esp32-object-detection-d863a`:
- `/trigger/takePhoto` → Snapshot trigger
- `/trigger/streaming` → Stream control
- `/images/latest/url` → Snapshot image URL
- `/images/latest/result` → AI detection result (Gemini)
- `/ultrasonic/distance_inch` → Measured object distance
- `/g_length` → Threshold distance for obstruction check

#### From `doorsure-sd25`:
- `/obj_obstruction` → Result of comparing ultrasonic and `g_length`

---

## 🧪 How It Works

### 1. **Live Streaming**
- When **"Start Streaming"** is pressed, it sets `/trigger/streaming = true`.
- ESP32 uploads a new image (`stream.jpg`) to Firebase every second.
- The web app displays this image with a 200ms refresh rate.
- Auto-stops streaming if tab is closed, refreshed, or user presses **"Close"**.

### 2. **AI Detection**
- Press **"Start Identification"** to trigger ESP32 to take a snapshot (`takePhoto = 1`).
- ESP32 uploads snapshot to `/images/latest.jpg`.
- Gemini AI analyzes the image and updates `/images/latest/result`.

### 3. **Obstruction Detection**
- If `ultrasonic/distance_inch < g_length`, then `/obj_obstruction = 1`.
- Otherwise, `/obj_obstruction = 0`.

---

## 🖥️ Hosting Options

This HTML can be hosted:
- On Firebase Hosting (recommended for HTTPS)
- Locally on your computer
- On ESP32-CAM itself (via SPIFFS if simplified)

---

## 🔒 Safety & UX Features

- `no-store` meta tag to avoid caching images
- Streaming stops automatically when:
  - Page/tab is closed or reloaded
  - Window is hidden (minimized or backgrounded)
- Button click disables streaming and clears preview

---

## 📋 TODO

- [ ] Replace image refresh with MJPEG or WebRTC for true live streaming
- [ ] Add animated spinner while waiting for AI response
- [ ] Display real-time logs or alert history

---

## 🛡️ License

MIT License © 2025 Felix Liu
