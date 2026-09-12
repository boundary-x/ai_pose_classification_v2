# 🧘 Boundary X - AI Pose Recognition

**Boundary X AI Pose Recognition** is a web-based application that utilizes **Google Teachable Machine (Pose)** to classify human body postures in real-time. It transmits the recognition results to external hardware (e.g., **BBC Micro:bit**) via **Bluetooth Low Energy (BLE)** for interactive control.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Platform](https://img.shields.io/badge/Platform-Web-blue)
![Tech](https://img.shields.io/badge/Stack-p5.js%20%7C%20Teachable%20Machine-orange)

## ✨ Key Features

### 1. 🤸 Real-time Pose Classification
- **Teachable Machine Integration:** Supports pose models trained via [Teachable Machine](https://teachablemachine.withgoogle.com/).
- **Dynamic Loading:** Users can load models by simply pasting the **Model URL** or **ID**.
- **Optimization:** Includes a logic stability algorithm (Confidence > 85%, label stability check) to prevent jittery data transmission.

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

Results above 85% confidence pass through a label stability counter before the **Class Label** is sent repeatedly via Bluetooth UART. A new qualifying label resets the counter to zero; three further qualifying matches allow transmission. Lower-confidence frames do not reset this counter or automatically send stop.

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


## Help and Classroom Resources

Open **도움말** in the header or expand **사용 가이드 및 지원** to access a nine-step screen guide, pose model training, four micro:bit code links, two lesson resources, troubleshooting and update notes. The guide highlights controls without loading a model or sending commands.

Train a **Pose** project in Teachable Machine, use English letters or numbers without spaces for class names, upload it, and copy its share URL or ID. Connect micro:bit first to enable model loading. Loading starts classification automatically; the displayed label is not a device receipt confirmation.

The introduction and lesson sources are linked in the support card. Node.js is not required to use the deployed web app.

### Guide verification

With Node.js, Playwright and Microsoft Edge installed, run `node tests/support.cjs`. This checks seven viewport sizes, all guide steps, focus restoration and unchanged app state using a simulated camera. Physical Bluetooth and pose accuracy require device testing.
