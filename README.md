# 🧘 Boundary X - AI Pose Recognition

**Boundary X AI Pose Recognition** is a web-based application that utilizes **Google Teachable Machine (Pose)** to classify human body postures in real-time. It transmits the recognition results to external hardware (e.g., **BBC Micro:bit**) via **Bluetooth Low Energy (BLE)** for interactive control.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Platform](https://img.shields.io/badge/Platform-Web-blue)
![Tech](https://img.shields.io/badge/Stack-p5.js%20%7C%20Teachable%20Machine-orange)

## ✨ Key Features

### 1. 🤸 Real-time Pose Classification
- **Teachable Machine Integration:** Supports pose models trained via [Teachable Machine](https://teachablemachine.withgoogle.com/).
- **Dynamic Loading:** Users can load models by simply pasting the **Model URL** or **ID**.
- **Optimization:** Includes a logic stability algorithm (Confidence > 85%, Consistency Check x3 frames) to prevent jittery data transmission.

### 2. 🔗 Wireless Control (Web Bluetooth API)
- Connects directly to **BBC Micro:bit** using the **Nordic UART Service**.
- Sends the classified **Class Name (Label)** as text data to the hardware.

### 3. 📱 Responsive & Sticky UI
- **Cross-Platform:** Optimized for Desktop, Tablet, and Mobile.
- **Sticky Canvas:**
    - **Mobile Portrait:** The camera view sticks to the top (`70px`) while scrolling controls.
    - **Mobile Landscape:** The camera view sticks to the left side, optimizing screen real estate.
- **Visual Feedback:** Displays the skeletal structure (Keypoints & Skeleton) overlaid on the video feed.

---

## 📡 Communication Protocol

When a pose is recognized with high confidence (over 85%) for 3 consecutive frames, the **Class Label** is sent via Bluetooth UART.

**Data Format:**
```text
{Class Name}\n
```

**Examples:**
- **If the trained class is named "Jump":** `Jump\n`
- **If the trained class is named "Sit":** `Sit\n`
- **When classification stops:** `stop\n`


**Tech Stack:**
- **Frontend:** HTML5, CSS3
- **Creative Coding:** p5.js (Canvas, Video handling)
- **AI Engine:** Teachable Machine Pose (TensorFlow.js)
- **Connectivity:** Web Bluetooth API (Nordic UART Service)

**License:**
- Copyright © 2024 Boundary X Co. All rights reserved.
- All rights to the source code and design of this project belong to BoundaryX.
- Web: boundaryx.io
- Contact: https://boundaryx.io/contact
