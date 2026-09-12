/* Read-only Teachable Machine image guide. */
(()=>{'use strict';const $=id=>document.getElementById(id);const support=$('support-card');support.innerHTML="<summary><span><strong>사용 가이드 및 지원</strong><small>사용법 · 예제 코드 · 문제 해결</small></span><span class=\"support-chevron\" aria-hidden=\"true\">⌄</span></summary><div class=\"support-content\"><p class=\"support-intro\">학습한 포즈 모델을 마이크로비트 프로젝트에 연결해보세요.</p><div class=\"support-actions\"><button type=\"button\" data-tour=\"all\" class=\"support-primary\">사용법 둘러보기 <span aria-hidden=\"true\">→</span></button></div><details class=\"support-section\"><summary>포즈 모델 학습하기</summary><div class=\"support-answer\"><p><a href=\"https://teachablemachine.withgoogle.com/train/pose\" target=\"_blank\" rel=\"noopener noreferrer\">Teachable Machine 포즈 프로젝트 열기 ↗</a></p><p>포즈 수집 → 클래스 이름 설정 → 모델 학습 → 모델 내보내기·업로드 → 공유 주소 복사 순서로 준비하세요. 클래스 이름은 영문·숫자로 공백 없이 입력하세요.</p></div></details><details class=\"support-section\" id=\"help-examples\"><summary>마이크로비트 예제 코드</summary><div class=\"support-answer example-codes\"><div class=\"example-code\"><a  href=\"https://makecode.microbit.org/S49771-77509-50114-72682\" target=\"_blank\" rel=\"noopener noreferrer\">블루투스 이름 확인 코드 ↗</a><p>LED 매트릭스에 출력되는 이름(알파벳 소문자 5자리)을 확인한 뒤 아래 프로젝트 코드를 다운로드하세요.</p></div><div class=\"example-code\"><a id=\"project-example-link\" href=\"https://makecode.microbit.org/S74877-09670-51254-25396\" target=\"_blank\" rel=\"noopener noreferrer\">마이크로비트 기본 예제 ↗</a><p>Teachable Machine의 클래스 이름을 받아 동작하도록 조건문을 구성하세요.</p></div><div class=\"example-code\"><a  href=\"https://makecode.microbit.org/#pub:20950-85108-81818-21362\" target=\"_blank\" rel=\"noopener noreferrer\">AI 포니봇 · AI 모션제어로봇 ↗</a><p>클래스 이름과 예제 코드의 수신 문자열을 맞춰 포즈로 로봇을 조종합니다.</p></div><div class=\"example-code\"><a  href=\"https://makecode.microbit.org/#pub:32314-20211-19941-07832\" target=\"_blank\" rel=\"noopener noreferrer\">비트런 · AI 헬스케어 로봇 ↗</a><p>앉기·일어서기 분류 결과로 함께 운동하는 로봇을 만듭니다.</p></div><p>이름 확인 후 사용할 프로젝트 예제를 다운로드하세요. 기존 마이크로비트 코드가 교체됩니다.</p></div></details><details class=\"support-section\" id=\"help-troubleshooting\"><summary>문제 해결</summary><div class=\"support-answer support-faq\"><details ><summary>어떤 모델을 사용할 수 있나요?</summary><p>Teachable Machine의 포즈 프로젝트로 만든 모델을 사용하세요. 이미지·소리 모델은 사용할 수 없습니다. 포즈 샘플을 모아 학습한 뒤 모델 내보내기에서 업로드하고 공유 주소를 복사하세요.</p></details><details ><summary>클래스 이름은 어떻게 정하나요?</summary><p>클래스 이름이 그대로 전송 데이터가 됩니다. 영문 또는 숫자로 공백 없이 정하고 마이크로비트 조건문과 대소문자까지 맞추세요. 한글 클래스는 모델 로드 시 차단되며 전송되지 않습니다.</p></details><details ><summary>카메라가 보이지 않아요</summary><p>카메라 권한을 허용하고 다른 앱이 카메라를 사용 중인지 확인하세요. 몸과 관절이 정사각형 화면 안에 보이도록 거리를 조절하세요. 영상은 거울처럼 표시됩니다.</p></details><details id=\"help-connection\"><summary>연결이 안 되거나 모델 로드 버튼을 누를 수 없어요</summary><p>마이크로비트 전원과 UART 예제 코드, 다른 앱과 연결되어 있는지 확인하세요. MakeCode 프로젝트 설정에서 블루투스 페어링을 필요하지 않음으로 설정하세요. 아이폰에서는 Bluefy를 사용하세요. 이 앱은 블루투스가 연결돼야 모델 로드 버튼이 활성화됩니다.</p></details><details ><summary>모델 주소가 올바르지 않다고 나와요</summary><p>공유 주소 또는 짧은 모델 ID를 대소문자까지 정확히 입력하세요. Teachable Machine에서 모델 업로드가 끝났는지, 인터넷 연결이 되는지 확인하세요. 포즈 모델인지도 확인하세요.</p></details><details ><summary>학습 결과가 잘 맞지 않아요</summary><p>몸과 관절이 잘 보이도록 조명과 거리를 조절하고 다양한 자세 샘플을 추가해보세요. 수정 후 다시 학습·업로드하고 모델을 로드하세요. 이 앱 안에서 학습 데이터를 추가하거나 KNN 파일을 가져오는 방식은 아닙니다.</p></details><details ><summary>분류 결과와 기기 동작이 달라요</summary><p>화면 아래 라벨은 분류 결과이며 기기 수신 확인은 아닙니다. 클래스 이름과 조건문을 확인하세요. 모델 로드 후 분류를 시작하며, 신뢰도 85% 초과 결과가 안정화 조건을 만족해야 전송합니다. 낮은 신뢰도에서는 이전 라벨이 남을 수 있고 자동으로 stop을 보내지는 않습니다.</p></details><details ><summary>중지하거나 연결이 끊기면 어떻게 되나요?</summary><p>분류 중지를 누르면 stop과 줄바꿈 전송을 시도합니다. 연결이 끊기면 분류도 중지되지만 끊어진 연결로 stop을 보낼 수는 없습니다. 다시 연결하고 모델 로드 시작을 눌러 재개하세요.</p></details></div></details><details class=\"support-section\" id=\"help-materials\"><summary>수업 자료</summary><div class=\"support-answer\"><p><a href=\"https://1drv.ms/p/c/fae158da74b76feb/IQBiLijIneC4Q6DX9tMK39RwAZUVJPYo6laCLGwGycYnrCU?e=bQ9BB9\" target=\"_blank\" rel=\"noopener noreferrer\">스쿼트를 인식하는 AI 헬스 트레이너 로봇 (with 비트런) ↗</a></p><p><a href=\"https://1drv.ms/p/c/fae158da74b76feb/IQAvmnhAu9x_Rox3ro5WF1w7AQlN5jG6gIoNsr6PhWZO0t8?e=NHbf6R\" target=\"_blank\" rel=\"noopener noreferrer\">제스처를 따라 움직이는 AI 원격 조종 로봇 (with 포니봇) ↗</a></p><p class=\"support-caption\">소개 페이지의 교안입니다. 화면과 조작법은 현재 앱의 사용 가이드를 참고하세요.</p></div></details><details class=\"support-section\" id=\"help-updates\"><summary>업데이트 노트</summary><div class=\"support-answer\"><p class=\"support-release\">사용 가이드 및 지원 추가</p><ul><li>포즈 모델 준비부터 연결·분류·중지까지 화면 안내</li><li>마이크로비트 예제와 수업 자료 연결</li><li>모델 주소·클래스 이름·연결 문제 해결 안내</li></ul></div></details><a class=\"support-original\" href=\"https://boundaryx.io/ai/?bmode=view&idx=163120220\" target=\"_blank\" rel=\"noopener noreferrer\">개념 설명 · 프로젝트 아이디어 보기 ↗</a></div>";const allSteps=[["#model-select-and-link","포즈 모델을 준비하세요","Teachable Machine 포즈 프로젝트에서 학습·업로드한 모델을 사용하세요. 빠르게 시험하려면 앉기·일어서기, O·X, 팔모양 샘플을 선택할 수 있습니다."],["#model-key-container","클래스 이름이 전송 데이터입니다","클래스는 영문·숫자로 공백 없이 이름을 정하세요. 한글은 사용할 수 없습니다. 마이크로비트 조건문과 클래스 이름을 맞추세요."],["#project-example-link","마이크로비트 예제를 준비하세요","장치 이름 확인 코드로 LED의 소문자 5자리를 확인한 뒤 사용할 예제를 다운로드하세요."],["#bluetooth-control-buttons","기기를 연결하세요","기기 연결에서 해당 마이크로비트를 선택하세요. 아이폰에서는 Bluefy를 사용하세요. 연결돼야 모델 로드 버튼을 사용할 수 있습니다."],["#p5-container","몸 전체가 보이도록 서세요","카메라 권한을 허용하세요. 학습한 포즈에 필요한 팔·다리와 관절이 화면 안에 들어오도록 거리를 조절하세요. 영상은 거울처럼 표시됩니다."],["#model-key-container","모델 주소 또는 ID를 입력하세요","Teachable Machine 공유 주소 전체 또는 짧은 ID를 입력하세요. 샘플 모델을 선택하면 주소가 자동 입력됩니다."],["#model-action-buttons","로드하면 분류가 시작됩니다","모델 로드 시작을 누르세요. 모델이 준비되면 자동으로 분류합니다. 신뢰도 85% 초과 결과가 안정화 조건을 만족하면 클래스 이름과 줄바꿈을 반복 전송합니다."],["#p5-container","분류 결과를 확인하세요","포즈의 관절과 뼈대가 영상에 표시되고, 안정화 조건을 만족한 결과 라벨이 화면 아래에 표시됩니다. 화면 라벨과 실제 기기 동작을 함께 확인하세요."],["#model-action-buttons","작업을 마치면 분류를 중지하세요","분류 중지를 누르면 stop 전송을 시도합니다. 연결이 끊기면 분류도 중지됩니다. 재개하려면 연결 후 모델 로드 시작을 누르세요."]];const chapters=[{label:'모델 준비',start:0},{label:'기기 연결',start:2},{label:'분류·중지',start:4}];
const dialog = document.createElement('dialog');
  dialog.id = 'guide-dialog';
  dialog.setAttribute('aria-labelledby', 'guide-title');
  dialog.setAttribute('aria-describedby', 'guide-description');
  dialog.innerHTML = `<div id="guide-spotlight" aria-hidden="true"></div><section id="guide-panel"><div class="guide-topline"><span id="guide-progress"></span><button id="guide-close" type="button" aria-label="화면 안내 종료">닫기 ×</button></div><nav class="guide-chapters" aria-label="안내 구간">${chapters.map((chapter, i) => `<button type="button" data-chapter="${i}" aria-pressed="false">${chapter.label}</button>`).join('')}</nav><div aria-live="polite" aria-atomic="true"><h2 id="guide-title"></h2><p id="guide-description"></p></div><p class="guide-caption">화면 안내입니다. 닫은 뒤 직접 눌러보세요.</p><button id="guide-skip-device" type="button" hidden>기기 연결 건너뛰기 →</button><div class="guide-navigation"><button id="guide-prev" type="button">이전</button><button id="guide-next" type="button">다음</button></div></section>`;
  document.body.appendChild(dialog);
  let steps = [], index = 0, target = null, opener = null, originalScroll = 0, pendingFrame = 0;

  let examplesWereOpen = false;

  function openHelp(section) {
    support.open = true;
    if (section) {
      $('help-troubleshooting').open = true;
      $(section).open = true;
    }
    const heading = (section ? $(section) : support).querySelector('summary');
    heading.scrollIntoView({block: 'center', behavior: 'instant'});
    heading.focus({preventScroll: true});
  }
  document.querySelectorAll('[data-help]').forEach(button => button.addEventListener('click', () => openHelp(button.dataset.help || null)));

  function renderStep() {
    const [selector, title, description] = steps[index];
    if (selector === '#project-example-link') $('help-examples').open = true;
    target = document.querySelector(selector);
    const chapterIndex = index < chapters[1].start ? 0 : index < chapters[2].start ? 1 : 2;
    dialog.querySelectorAll('[data-chapter]').forEach((button, i) => button.setAttribute('aria-pressed', String(i === chapterIndex)));
    $('guide-skip-device').hidden = chapterIndex !== 1;
    $('guide-progress').textContent = `${chapters[chapterIndex].label}${chapterIndex === 1 ? ' · 선택' : ''} · ${index + 1} / ${steps.length}`;
    $('guide-title').textContent = title;
    $('guide-description').textContent = description;
    $('guide-prev').disabled = index === 0;
    $('guide-next').textContent = index === steps.length - 1 ? '안내 마치기' : '다음';
    if (target) target.scrollIntoView({block: 'center', behavior: 'instant'});
    positionGuide(true);
  }

  function positionGuide(reveal = false) {
    if (!dialog.open) return;
    const panel = $('guide-panel'), spot = $('guide-spotlight');
    const width = window.innerWidth, height = window.innerHeight, gap = 16;
    panel.style.width = Math.min(360, width - 24) + 'px';
    const ph = panel.getBoundingClientRect().height, pw = panel.getBoundingClientRect().width;
    const headerBottom = document.querySelector('header').getBoundingClientRect().bottom;
    let r = target ? target.getBoundingClientRect() : null;
    // Narrow screens reserve the lower area for the explanation. A temporary bottom
    // spacer allows the last control to scroll above it without altering saved data.
    const narrow = width < 700;
    if (reveal && r && narrow) {
      const top = Math.max(12, headerBottom + 16);
      window.scrollBy({top: r.top - top, behavior: 'instant'});
      r = target.getBoundingClientRect();
    }
    let x = width - pw - 12, y = height - ph - 12;
    if (r && !narrow) {
      const candidates = [
        [r.left - pw - gap, Math.max(12, Math.min(r.top, height - ph - 12))],
        [r.right + gap, Math.max(12, Math.min(r.top, height - ph - 12))],
        [Math.max(12, Math.min(r.left, width - pw - 12)), r.bottom + gap],
        [Math.max(12, Math.min(r.left, width - pw - 12)), r.top - ph - gap]
      ];
      const fit = candidates.find(([cx, cy]) => cx >= 12 && cy >= 12 && cx + pw <= width - 12 && cy + ph <= height - 12);
      if (fit) [x,y] = fit;
      else if (r.left < x - 28) r = {left:r.left,top:r.top,right:Math.min(r.right,x-16),bottom:r.bottom};
    }
    panel.style.left = x + 'px'; panel.style.top = Math.max(12, y) + 'px';
    if (r) {
      const top = Math.max(4, r.top - 5), left = Math.max(4, r.left - 5);
      const bottom = Math.min(height - 4, narrow ? y - 12 : height - 4, r.bottom + 5);
      spot.hidden = bottom <= top || r.right <= 0 || r.left >= width;
      Object.assign(spot.style, {left: left + 'px', top: top + 'px', width: Math.max(0, Math.min(width - 4, r.right + 5) - left) + 'px', height: Math.max(0, bottom - top) + 'px'});
    } else spot.hidden = true;
  }
  function startTour(kind, button) {
    if (kind !== 'all') return;
    opener = button; originalScroll = window.scrollY;
    steps = allSteps; index = 0;
    examplesWereOpen = $('help-examples').open;
    document.body.classList.add('guide-active');
    dialog.showModal();
    renderStep();
    $('guide-next').focus({preventScroll:true});
  }
  support.querySelectorAll('[data-tour]').forEach(button => button.addEventListener('click', () => startTour(button.dataset.tour, button)));
  $('guide-prev').addEventListener('click', () => { if (index > 0) { index--; renderStep(); } });
  $('guide-next').addEventListener('click', () => { if (index === steps.length - 1) dialog.close(); else { index++; renderStep(); } });
  dialog.querySelectorAll('[data-chapter]').forEach(button => button.addEventListener('click', () => { index = chapters[Number(button.dataset.chapter)].start; renderStep(); }));
  $('guide-skip-device').addEventListener('click', () => { index = chapters[2].start; renderStep(); $('guide-next').focus({preventScroll:true}); });
  $('guide-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('guide-active');
    $('help-examples').open = examplesWereOpen;
    window.scrollTo({top:originalScroll, behavior:'instant'});
    if (opener) opener.focus({preventScroll:true});
  });
  const reposition = () => {
    if (!dialog.open || pendingFrame) return;
    pendingFrame = requestAnimationFrame(() => { pendingFrame = 0; positionGuide(); });
  };
  window.addEventListener('resize', () => { if (dialog.open) renderStep(); });
  window.addEventListener('scroll', reposition, {passive:true});
  if (location.hash === '#support-card') requestAnimationFrame(() => openHelp());
})();


