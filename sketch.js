/**
 * sketch.js
 * Boundary X Pose Classification Logic (265x265 Teachable Machine Default)
 * Fixed: Skeleton Mirroring Issue
 */

// Bluetooth UUIDs
const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

let bluetoothDevice = null;
let rxCharacteristic = null;
let txCharacteristic = null;
let isConnected = false;
let bluetoothStatus = "연결 대기 중";

// Pose & ML Variables
let video;
let model = null;
let pose = null;
let prediction = [];
let label = "대기 중";
let isClassifying = false;

// UI Elements
let connectBluetoothButton, disconnectBluetoothButton;
let modelSelect, modelInput, initializeModelButton, stopClassifyButton;
let modelStatusDiv;

// Optimization Variables
let tempCanvas; 
let tempCtx;
let lastLabel = "";
let consecutiveCount = 0;
const CONSISTENCY_THRESHOLD = 3; 

// 265px Resolution (Teachable Machine Default)
const CAM_WIDTH = 265;
const CAM_HEIGHT = 265;

const modelList = {
  "🧘앉기 |🧍일어서기": "r8wsgg5mm",
  "🙆O |🙅X": "YKdY8lyAQ",
  "🙋 팔모양": "Q5Ur108ke"
};

let isSendingData = false;

// 문자열에 한글(자모/완성형)이 포함되어 있는지 검사
function containsKorean(text) {
  return /[\uAC00-\uD7A3\u3131-\u318E]/.test(text);
}

// 주어진 프로미스가 정해진 시간 안에 끝나지 않으면 강제로 실패 처리 (BLE 응답이 영영 안 올 때 대비)
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('BLE write timeout')), ms))
  ]);
}

function setup() {
  let canvas = createCanvas(CAM_WIDTH, CAM_HEIGHT); 
  canvas.parent('p5-container');
  canvas.style('width', '100%'); 
  canvas.style('height', '100%');

  // [최적화] 임시 캔버스 전역 생성 (265px)
  tempCanvas = document.createElement('canvas');
  tempCanvas.width = CAM_WIDTH;
  tempCanvas.height = CAM_HEIGHT;
  tempCtx = tempCanvas.getContext('2d');

  setupCamera();
  createUI();
}

function setupCamera() {
  video = createCapture({
    video: {
      width: CAM_WIDTH,
      height: CAM_HEIGHT
    }
  });
  video.size(CAM_WIDTH, CAM_HEIGHT); 
  video.hide();
}

function createUI() {
  // 1. 블루투스 버튼
  connectBluetoothButton = createButton("기기 연결");
  connectBluetoothButton.parent('bluetooth-control-buttons');
  connectBluetoothButton.addClass('start-button');
  connectBluetoothButton.mousePressed(connectBluetooth);

  disconnectBluetoothButton = createButton("연결 해제");
  disconnectBluetoothButton.parent('bluetooth-control-buttons');
  disconnectBluetoothButton.addClass('stop-button');
  disconnectBluetoothButton.mousePressed(disconnectBluetooth);

  // 2. 모델 선택 및 입력
  modelSelect = createSelect();
  modelSelect.parent('model-select-and-link');
  modelSelect.option("샘플 모델 선택 또는 직접 입력", "");
  for (const modelName in modelList) {
    modelSelect.option(modelName, modelList[modelName]);
  }
  modelSelect.changed(updateModelInput);

  createA("https://boundaryx.io", "모델 분류 데이터 보기", "_blank")
    .parent('model-select-and-link')
    .style("color", "#666").style("font-size", "0.9rem").style("display", "block").style("margin-top", "5px");

  modelInput = createInput('');
  modelInput.parent('model-key-container');
  modelInput.attribute('placeholder', '모델 키(ID) 또는 전체 주소 입력');

  // 로딩 피드백창
  modelStatusDiv = createDiv('모델을 로드해주세요.');
  modelStatusDiv.parent('model-key-container');
  modelStatusDiv.id('modelStatus');

  // 3. 제어 버튼
  initializeModelButton = createButton('모델 로드 시작');
  initializeModelButton.parent('model-action-buttons');
  initializeModelButton.addClass('start-button');
  initializeModelButton.mousePressed(initializeModel);

  stopClassifyButton = createButton('분류 중지');
  stopClassifyButton.parent('model-action-buttons');
  stopClassifyButton.addClass('stop-button');
  stopClassifyButton.mousePressed(stopClassification);

  updateBluetoothStatusUI();
}

function updateModelInput() {
  const val = modelSelect.value();
  modelInput.value(val || "");
}

function initializeModel() {
  let inputVal = modelInput.value().trim();
  let modelURL = "";
  let metadataURL = "";

  if (!inputVal) {
    alert('모델 키 또는 주소를 입력하세요!');
    return;
  }

  // 하이브리드 입력 처리
  if (inputVal.startsWith('http')) {
      let baseURL = inputVal;
      if (!baseURL.endsWith('/')) baseURL += '/';
      modelURL = baseURL + "model.json";
      metadataURL = baseURL + "metadata.json";
  } else {
      modelURL = `https://teachablemachine.withgoogle.com/models/${inputVal}/model.json`;
      metadataURL = `https://teachablemachine.withgoogle.com/models/${inputVal}/metadata.json`;
  }

  // 로딩 중 피드백
  if (modelStatusDiv) {
    modelStatusDiv.html("⏳ 모델을 불러오는 중입니다...");
    modelStatusDiv.style("color", "#666");
    modelStatusDiv.style("background-color", "#F1F3F4");
  }

  tmPose.load(modelURL, metadataURL).then(loadedModel => {
    model = loadedModel;

    // 클래스 이름에 한글이 포함되어 있으면 분류를 시작하지 않고 안내
    const classLabels = model.getClassLabels();
    const koreanLabels = classLabels.filter(containsKorean);
    if (koreanLabels.length > 0) {
      if (modelStatusDiv) {
        modelStatusDiv.html(`⚠️ 클래스 이름은 영어로만 지정해야 합니다. (한글 클래스: ${koreanLabels.join(', ')})`);
        modelStatusDiv.style("color", "#EA4335");
        modelStatusDiv.style("background-color", "#FCE8E6");
      }
      return;
    }

    // 로딩 완료 피드백
    if (modelStatusDiv) {
      modelStatusDiv.html("✅ 모델 로드 완료! 분류를 시작합니다.");
      modelStatusDiv.style("color", "#137333");
      modelStatusDiv.style("background-color", "#E6F4EA");
    }
    
    label = "준비됨";
    startClassification();
  }).catch(error => {
    console.error('모델 로드 실패:', error);
    if (modelStatusDiv) {
      modelStatusDiv.html("❌ 모델 로드 실패. 키 값을 확인해주세요.");
      modelStatusDiv.style("color", "#EA4335");
      modelStatusDiv.style("background-color", "#FCE8E6");
    }
  });
}

function startClassification() {
  if (!model) return;
  isClassifying = true;
  classifyPose();
}

async function classifyPose() {
  if (!isClassifying) return;

  // 265px 캔버스 재사용 및 미러링 (AI 입력용)
  tempCtx.save();
  tempCtx.translate(CAM_WIDTH, 0); 
  tempCtx.scale(-1, 1);    
  tempCtx.drawImage(video.elt, 0, 0, CAM_WIDTH, CAM_HEIGHT);
  tempCtx.restore();

  // 포즈 추정 (이미 반전된 이미지가 들어감 -> 좌표도 반전된 상태로 나옴)
  const { pose: detectedPose, posenetOutput } = await model.estimatePose(tempCanvas);
  pose = detectedPose;
  prediction = await model.predict(posenetOutput);

  if (prediction.length > 0) {
    const bestResult = prediction.reduce((prev, current) => {
      return (prev.probability > current.probability) ? prev : current;
    });

    // 신뢰도 85% 이상만 처리
    if (bestResult.probability > 0.85) {
      
      // 연속성 체크
      if (bestResult.className === lastLabel) {
        consecutiveCount++;
      } else {
        lastLabel = bestResult.className;
        consecutiveCount = 0;
      }

      if (consecutiveCount >= CONSISTENCY_THRESHOLD) {
        label = bestResult.className;
        // 딜레이 없이 즉시 전송
        sendBluetoothData(label);
      }
    }
  }
  
  requestAnimationFrame(classifyPose);
}

async function stopClassification() {
  isClassifying = false;
  label = "중지됨";
  pose = null;
  const sent = await sendBluetoothDataReliable("stop");

  if (modelStatusDiv) {
    if (sent) {
      modelStatusDiv.html("모델 분류가 중지되었습니다.");
      modelStatusDiv.style("color", "#333");
      modelStatusDiv.style("background-color", "#F1F3F4");
    } else {
      modelStatusDiv.html("⚠️ 정지 신호 전송에 실패했어요. 블루투스 연결을 확인해주세요.");
      modelStatusDiv.style("color", "#EA4335");
      modelStatusDiv.style("background-color", "#FCE8E6");
    }
  }
}

function draw() {
  // 캔버스 그리기 (거울 모드로 보여주기 위해 반전)
  push();
  translate(width, 0);
  scale(-1, 1);
  if (video) image(video, 0, 0, width, height);
  pop();

  // [수정됨] 스켈레톤 시각화 (이미 반전된 좌표이므로 변환 없이 그대로 그림)
  if (pose) {
    const minPartConfidence = 0.5;
    // push, translate, scale 삭제함
    tmPose.drawKeypoints(pose.keypoints, minPartConfidence, drawingContext);
    tmPose.drawSkeleton(pose.keypoints, minPartConfidence, drawingContext);
    // pop 삭제함
  }

  // 결과 박스
  const boxHeight = 40;
  fill(0, 0, 0, 180);
  noStroke();
  rect(0, height - boxHeight, width, boxHeight);
  
  textSize(20);
  textAlign(CENTER, CENTER);
  fill(255);
  text(label, width / 2, height - (boxHeight/2));
}

/* --- Bluetooth Logic --- */

async function connectBluetooth() {
  try {
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "BBC micro:bit" }],
      optionalServices: [UART_SERVICE_UUID]
    });

    const server = await bluetoothDevice.gatt.connect();
    const service = await server.getPrimaryService(UART_SERVICE_UUID);
    rxCharacteristic = await service.getCharacteristic(UART_RX_CHARACTERISTIC_UUID);
    txCharacteristic = await service.getCharacteristic(UART_TX_CHARACTERISTIC_UUID);

    // 마이크로비트가 범위를 벗어나거나 전원이 꺼지는 등 예기치 않게 끊겼을 때도 상태를 동기화
    bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);

    isConnected = true;
    bluetoothStatus = "연결됨: " + bluetoothDevice.name;
    updateBluetoothStatusUI(true);
    
  } catch (error) {
    console.error("Connection failed", error);
    bluetoothStatus = "연결 실패";
    updateBluetoothStatusUI(false, true);
  }
}

// 사용자가 직접 '연결 해제' 버튼을 눌렀는지 구분하기 위한 플래그
let isManualDisconnect = false;

// 수동 해제든 예기치 않은 끊김이든 이 함수 하나로 상태를 정리
function onDisconnected() {
  isConnected = false;
  rxCharacteristic = null;
  txCharacteristic = null;
  bluetoothDevice = null;

  // 연결이 끊기면 인식(분류)도 함께 자동 중지 — 끊긴 채로 계속 돌아가는 것 방지
  const wasClassifying = isClassifying;
  if (isClassifying) {
    isClassifying = false;
    pose = null;
    label = "중지됨";
  }

  if (isManualDisconnect) {
    bluetoothStatus = "연결 해제됨";
    updateBluetoothStatusUI(false);
    if (modelStatusDiv && wasClassifying) {
      modelStatusDiv.html("블루투스 연결이 해제되어 인식이 중지되었습니다.");
      modelStatusDiv.style("color", "#333");
      modelStatusDiv.style("background-color", "#F1F3F4");
    }
  } else {
    bluetoothStatus = "연결이 끊어졌습니다. 다시 연결해주세요.";
    updateBluetoothStatusUI(false, true);
    if (modelStatusDiv && wasClassifying) {
      modelStatusDiv.html("⚠️ 블루투스 연결이 끊어져 인식이 자동으로 중지되었습니다.");
      modelStatusDiv.style("color", "#EA4335");
      modelStatusDiv.style("background-color", "#FCE8E6");
    }
  }
  isManualDisconnect = false;
}

function disconnectBluetooth() {
  if (bluetoothDevice && bluetoothDevice.gatt.connected) {
    // 실제 상태 정리는 'gattserverdisconnected' 이벤트를 받는 onDisconnected()가 담당
    isManualDisconnect = true;
    bluetoothDevice.gatt.disconnect();
  } else {
    isConnected = false;
    bluetoothStatus = "연결 해제됨";
    rxCharacteristic = null;
    txCharacteristic = null;
    bluetoothDevice = null;
    updateBluetoothStatusUI(false);
  }
}

function updateBluetoothStatusUI(connected = false, error = false) {
  const statusElement = select('#bluetoothStatus');
  if(statusElement) {
      statusElement.html(`상태: ${bluetoothStatus}`);
      statusElement.removeClass('status-connected');
      statusElement.removeClass('status-error');
      
      if (connected) {
        statusElement.addClass('status-connected');
      } else if (error) {
        statusElement.addClass('status-error');
      }
  }
}

// 반복 실패 시 안내 메시지가 매 프레임 깜빡이지 않도록 최소 간격을 둠
let lastSendErrorTime = 0;

// 성공하면 true, 스킵되거나 실패하면 false를 반환
async function sendBluetoothData(data) {
  if (!rxCharacteristic || !isConnected) return false;
  // 방어적 안전망: 어떤 경로로든 한글 라벨이 들어오면 전송하지 않음
  if (containsKorean(data)) {
    console.warn("한글 라벨은 전송하지 않습니다:", data);
    return false;
  }
  if (isSendingData) return false;

  try {
    isSendingData = true;
    const encoder = new TextEncoder();
    // writeValue가 끝내 응답하지 않는 경우를 대비해 2초 타임아웃을 둠 (전송 영구 정지 방지)
    await withTimeout(rxCharacteristic.writeValue(encoder.encode(data + "\n")), 2000);
    return true;
  } catch (error) {
    console.error("Error sending data:", error);
    const now = Date.now();
    if (modelStatusDiv && now - lastSendErrorTime > 3000) {
      lastSendErrorTime = now;
      modelStatusDiv.html("⚠️ 데이터 전송에 실패했어요. 연결 상태를 확인해주세요.");
      modelStatusDiv.style("color", "#EA4335");
      modelStatusDiv.style("background-color", "#FCE8E6");
    }
    return false;
  } finally {
    isSendingData = false;
  }
}

// 'stop'처럼 반드시 전달되어야 하는 명령을 위한 재시도 버전
async function sendBluetoothDataReliable(data, maxRetries = 5, retryDelayMs = 80) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const sent = await sendBluetoothData(data);
    if (sent) return true;
    await new Promise(resolve => setTimeout(resolve, retryDelayMs));
  }
  console.error(`전송 재시도 실패: ${data}`);
  return false;
}
