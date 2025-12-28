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

function stopClassification() {
  isClassifying = false;
  label = "중지됨";
  pose = null;
  sendBluetoothData("stop");
  
  if (modelStatusDiv) {
    modelStatusDiv.html("모델 분류가 중지되었습니다.");
    modelStatusDiv.style("color", "#333");
    modelStatusDiv.style("background-color", "#F1F3F4");
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

    isConnected = true;
    bluetoothStatus = "연결됨: " + bluetoothDevice.name;
    updateBluetoothStatusUI(true);
    
  } catch (error) {
    console.error("Connection failed", error);
    bluetoothStatus = "연결 실패";
    updateBluetoothStatusUI(false, true);
  }
}

function disconnectBluetooth() {
  if (bluetoothDevice && bluetoothDevice.gatt.connected) {
    bluetoothDevice.gatt.disconnect();
  }
  isConnected = false;
  bluetoothStatus = "연결 해제됨";
  rxCharacteristic = null;
  txCharacteristic = null;
  bluetoothDevice = null;
  updateBluetoothStatusUI(false);
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

async function sendBluetoothData(data) {
  if (!rxCharacteristic || !isConnected) return;
  if (isSendingData) return;

  try {
    isSendingData = true;
    const encoder = new TextEncoder();
    await rxCharacteristic.writeValue(encoder.encode(data + "\n"));
  } catch (error) {
    console.error("Error sending data:", error);
  } finally {
    isSendingData = false;
  }
}
