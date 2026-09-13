// LocalStorage
const SETTINGS_KEY = "monthlySettings";
const RECORDS_KEY = "calendarRecords";

// LocalStorage에서 월별 설정 불러오기
let monthlySettings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
// LocalStorage에서 날짜별 기록 불러오기
let calendarRecords = JSON.parse(localStorage.getItem(RECORDS_KEY)) || {};
// 기본값
const DEFAULT_THEME = "blue";
const DEFAULT_TARGET_TIME = null;

// 테마 - 하늘 배경화면
const backgrounds = {
  pink: "url('images/pink-sky.png')",
  orange: "url('images/orange-sky.png')",
  yellow: "url('images/yellow-sky.png')",
  green: "url('images/green-sky.png')",
  blue: "url('images/blue-sky.png')",
  purple: "url('images/purple-sky.png')"
};

// 테마별 공부 시간 색상
const cloudColors = {
  pink: [
    "#eebab7",
    "#e68a8d",
    "#c96068",
    "#ab4543",
    "#9b4443"
  ],
  orange: [
    "#eed3b7",
    "#e6b58a",
    "#c98860",
    "#ab7543",
    "#9b6b43"
  ],
  yellow: [
    "#eee1b7",
    "#e6cb8a",
    "#c9af60",
    "#ab9943",
    "#9b8943"
  ],
  green: [
    "#e1e9b7",
    "#bdd299",
    "#7a9b57",
    "#5e7f19",
    "#466d1d"
  ],
  blue: [
    "#a8c7d6",
    "#84aabc",
    "#5c93aa",
    "#4b7a90",
    "#355c7d"
  ],
  purple: [
    "#baa8d6",
    "#9b84bc",
    "#795caa",
    "#6b4b90",
    "#57357d"
  ]
};

// 헤더 부분 요소
const currentMonthElement = document.getElementById("current-month");  // 월표시 요소 가져오기
const currentYearElement = document.getElementById("current-year");  // 연도표시 요소 가져오기
const prevButton = document.getElementById("prev-month");  // 월 이전버튼 요소 가져오기
const nextButton = document.getElementById("next-month");  // 월 다음버튼 요소 가져오기
const calendar = document.querySelector(".calendar");  // 달력 날짜 표시 부분 가져오기

// 테마 + 목표시간 설정 요소 가져오기
const themeButton = document.getElementById("theme-button");  // 현재 선택된 테마
const targetTimeSelect = document.getElementById("target-time-select");  // 현재 선택된 목표 시간
const themeList = document.getElementById("theme-list");  // 테마 선택 목록
const themeOptions = document.querySelectorAll(".theme-option");  // 테마 선택 목록 개별 버튼들

// 시간 입력 모달 부분 관련
const timeModal = document.getElementById("time-modal");  // 시간 모달 박스 배경
const hourPickerList = document.getElementById("hour-picker");  // 시간 숫자 목록들
const minutePickerList = document.getElementById("minute-picker");  // 분 숫자 목록들
const hourPicker = hourPickerList.parentElement;  // 시간 숫자 목록들의 부모로 스크롤되는 영역
const minutePicker = minutePickerList.parentElement;  // 분 숫자 목록들의 부모로 스크롤되는 영역

// 시간 입력 모달 드래그 관련
const timeModalBox = document.querySelector(".time-modal-box");  // 시간 입력 모달 박스
const modalDragHandle = document.querySelector(".modal-drag-handle");  // 모달을 움직이는 영역
// 드래그 관련 변수
let isDraggingModal = false;
let modalOffsetX = 0;
let modalOffsetY = 0;

// 시간 입력 모달 버튼들 관련
const saveButton = document.getElementById("save-time");  // 저장
const deleteButton = document.getElementById("delete-time");  // 삭제
const iconButton = document.getElementById("icon-button");  // 아이콘
const memoButton = document.getElementById("memo-button");  // 메모

// 아이콘 입력 모달 부분 관련
const iconModal = document.getElementById("icon-modal");  // 아이콘 모달 검은 화면 부분
const iconList = document.getElementById("icon-list");  // 아이콘 목록들
const iconButtons = document.querySelectorAll("#icon-list button");  // 아이콘 목록들의 개별 아이콘들

// 아이콘 삭제 모달 부분 관련
const deleteModal = document.getElementById("delete-modal");  // 아이콘 삭제 모달 검은 화면 부분
const confirmDelete = document.getElementById("confirm-delete");  // 아이콘 삭제 확인 버튼
const cancelDelete = document.getElementById("cancel-delete");  // 아이콘 삭제 취소 버튼

// 알림 모달 부분 관련
const alertModal = document.getElementById("alert-modal");  // 알림 모달 검은 화면 부분
const alertMessage = document.getElementById("alert-message");  // 알림 메시지 영역
const confirmAlert = document.getElementById("confirm-alert");  // 알림 확인 버튼

// 메모 모달 부분 관련
const memoModal = document.getElementById("memo-modal");  // 메모 모달 검은 화면 부분
const memoInput = document.getElementById("memo");  // 메모에 내용을 입력하는 부분
const inputMemoButton = document.getElementById("input-memo");  // 메모에 내용 입력 버튼
const deleteMemoButton = document.getElementById("delete-memo");  // 메모에 내용 삭제 버튼

// 날짜 관련 변수
const today = new Date();  // 현재 날짜
let currentYear = today.getFullYear();  // 현재 연도
let currentMonth = today.getMonth();  // 현재 월

// 월의 종류를 담고 있는 배열
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

// 선택된 날의 요소들을 저장하는 변수
let selectedDateKey = null;  // 선택한 날짜를 기억할 변수
let selectedIconContainer = null;  // 선택된 아이콘 그릇 요소
let selectedIconElement = null;  // 선택된 아이콘 요소
let selectedTimeElement = null;  // 선택된 시간 요소

// 시간
let selectedHour = 0;  // 선택된 시간
let selectedMinute = 0;  // 선택된 분

// 현재 달을 Key로 만들기
function getMonthKey() {
  return `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;  // ex) "2026-09"
}

// 현재 날짜를 Key로 만들기
function getDateKey(date) {
  return `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;  // ex) "2026-09-12"
}

// 현재 월 설정 가져오기(테마 + 목표시간)
function getCurrentMonthSettings() {
  const monthKey = getMonthKey();
  // 해당 월 설정이 없다면 기본값 생성
  if(!monthlySettings[monthKey]) {
    monthlySettings[monthKey] = {
      theme: DEFAULT_THEME,
      targetTime: DEFAULT_TARGET_TIME
    };
    saveSettings();
  }
  // 현재 달 설정 값 반환
  return monthlySettings[monthKey];
}

// LocalStorage에 테마 + 목표시간 저장
function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(monthlySettings));
}
// LocalStorage에 시간 기록들 저장
function saveRecords() {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(calendarRecords));
}

// 알림 모달 열기
function showAlert(message) {
  alertMessage.textContent = message;
  alertModal.style.display = "flex";
}

// 현재 테마와 목표시간 적용
function applyCurrentTheme() {
  const settings = getCurrentMonthSettings();
  const theme = settings.theme;
  // 배경 변경
  document.body.style.backgroundImage = backgrounds[theme];
  // 테마 동그라미 변경
  const themeColor = cloudColors[theme][1];  // 테마 동그라미 색이 각 색의 2번째
  themeButton.style.backgroundColor = themeColor;
  // 목표시간 드롭다운 변경
  if (settings.targetTime === null) {
    targetTimeSelect.value = "";
  } else {
    targetTimeSelect.value = settings.targetTime;
  }
  // 현재 달의 구름 색상 다시 계산
  updateAllCloudColors();
}

// 목표 시간을 기준으로 구름 색을 정함
function getCloudColorIndex(minutes) {
  // 현재 달의 세팅값 얻어내기
  const settings = getCurrentMonthSettings();
  if(settings.targetTime === null) {
    return 0;
  }
  // 목표시간 얻어내기
  const targetMinutes = Number(settings.targetTime);
  // 목표시간을 5등분 하여 색깔 나누기
  const oneLevel = targetMinutes / 5;
  // 기록된 시간과 목표시간을 비교하여 색깔 인덱스 결정
  if (minutes < oneLevel) {
    return 0;
  } else if (minutes < oneLevel * 2) {
    return 1;
  } else if (minutes < oneLevel * 3) {
    return 2;
  } else if (minutes < oneLevel * 4) {
    return 3;
  } else {
    return 4;
  }
}

// 달력의 크기를 현재 화면에 맞게 계산함
function updateCalendarSize(weeks) {
  // CSS에서 현재 화면 크기에 맞게 설정된 변수 가져오기
  const calendarStyle = getComputedStyle(calendar);
  // 요일 헤더 높이 가져오기
  const headerHeight = parseInt(calendarStyle.getPropertyValue("--header-height")) || 50;
  // 날짜 한 줄의 높이 가져오기
  const dayRowHeight = parseInt(calendarStyle.getPropertyValue("--day-row-height")) || 110;
  // JS가 계산한 weeks는 그대로 사용
  calendar.style.gridTemplateRows = `${headerHeight}px repeat(${weeks}, ${dayRowHeight}px)`;  // 요일은 50px, 날짜는 일정한 비율로
  // 전체 달력 높이 계산
  calendar.style.height = `${headerHeight + weeks * dayRowHeight}px`;  // 가로줄 개수만큼 높이 책정
}

// 달력의 날짜 셀을 만들고, 그 셀이 어떻게 동작할지도 설정하는 함수
// (처음 로드했을 때, 월을 바꿨을 때 동작)
function renderCalendar() {

  // 1) 기존 날짜 삭제
  const days = document.querySelectorAll(".day");
  days.forEach(day => {
    day.remove();  // 각각의 날을 모두 삭제한다.(달마다 해당 요일에 대응되는 일이 다르므로)
  });

  // 2) 현재 월 표시
  currentMonthElement.textContent = monthNames[currentMonth];  // 월 표시는 배열에서 가져오기

  // 3) 현재 연도 표시
  currentYearElement.textContent = currentYear;

  // 4) 현재 달의 설정 가져오기(테마와 목표시간)
  getCurrentMonthSettings();

  // 5) 이번 달의 1일이 무슨 요일인지 조사
  const firstDay = new Date(currentYear, currentMonth, 1);
  const startDay = firstDay.getDay();  // 요일 가져오기

  // 6) 이번 달의 마지막 일이 몇일인지 조사
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();  // 마지막 날짜 가져오기

  // 7) 필요한 줄 수 계산
  const totalDays = startDay + daysInMonth;  // 시작 전 빈칸 + 이번 달 날짜 수
  const weeks = Math.ceil(totalDays / 7);  // 달력에 표시될 가로줄 개수 
  const totalCells = weeks * 7;  // 달력에 표시될 총 셀 개수

  // 8) 달력 크기 계산
  updateCalendarSize(weeks);

  // 9) 실제 일 수 표시
  for(let i=0; i < totalCells; i++) {  // 달력에 표시될 총 셀 개수 만큼 반복한다.
    const day = document.createElement("div");  // div 요소 만들기
    day.classList.add("day");  // class="day" 추가

    // 마지막 행이면 줄 겹치지 않도록 스타일 조정
    if(i >= (weeks - 1) * 7) {
      day.classList.add("last-row");
    }

    // 날짜가 표시되는 부분의 조건문 
    if(i >= startDay && i < totalDays) {
      const date = i - startDay + 1;  // 날짜 구하기

      // 날짜 Key
      const dateKey = getDateKey(date);

      // 날짜 요소 제작
      const dateElement = document.createElement("span");  // span 요소 만들기
      dateElement.classList.add("date");  // class="date" 추가
      dateElement.textContent = date;  // 날짜 텍스트 추가

      // 아이콘 요소 제작
      const iconContainer = document.createElement("div");  // icon들을 담을 그릇 div 제작
      iconContainer.classList.add("icons");  // class="icons" 추가

      // 셀 안에 있는 아이콘 영역 클릭 이벤트
      iconContainer.addEventListener("click", event => {
        event.stopPropagation();  // 셀 클릭 이벤트가 실행되는 것을 방지

        // 실제로 클릭한 요소가 아이콘인지 확인
        const clickedIcon = event.target.closest("i");
        if(!clickedIcon) {
          return;
        }
        
        // 클릭된 아이콘 그릇을 담고 있는 날짜 기억
        selectedDateKey = dateKey;
        // 클릭한 아이콘 요소 기억
        selectedIconElement = clickedIcon;
        // 시간 입력 모달 닫기
        timeModal.style.display = "none";
        // 아이콘 삭제 모달 열기
        deleteModal.style.display = "flex";
      });

      // 시간 요소 제작
      const timeElement = document.createElement("span");  // span 요소 만들기
      timeElement.classList.add("study-time");  // class="study-time" 추가

      // day(부모)에 자식 요소들 붙여주기
      day.appendChild(dateElement);
      day.appendChild(iconContainer);
      day.appendChild(timeElement);

      // 기존 기록 불러오기
      // 화면에 표시되는 내용은 아이콘과 공부시간으로 메모는 메모 버튼을 눌렀을 때 내용이 표시된다.
      const record = calendarRecords[dateKey];

      // 기존 아이콘 표시
      if(record && record.icons) {
        record.icons.forEach(iconClass => {
          createIcon(iconClass, iconContainer);
        });
      }

      // 기존 시간 표시
      if(record && record.minutes !== undefined) {
        displayStudyTime(timeElement, record.minutes);
      }

      // 날짜 셀을 클릭했을 때의 이벤트
      day.addEventListener("click", (event) => {
        selectedDateKey = dateKey;  // 현재 클릭한 날짜 정보 기억
        selectedIconContainer = iconContainer;  // 현재 클릭한 날짜의 아이콘 영역 기억
        selectedTimeElement = timeElement;  // 현재 클릭한 날짜의 시간 영역 기억

        // 시간 입력 모달 열기
        timeModal.style.display = "flex";

        // 모달이 열린 다음 Picker를 0H 0M으로 초기화
        requestAnimationFrame(() => {
          resetPickers();
        });
      });
    }
    calendar.appendChild(day);  // 달력(부모)에 날짜 요소들 붙여주기
  }
  // 테마 적용
  applyCurrentTheme();
};

// timeElement에 시간 표시
function displayStudyTime(timeElement, minutes) {
  timeElement.innerHTML = "";  // 처음 공백으로 설정
  const hour = Math.floor(minutes / 60);  // 시간 구하기
  const minute = minutes % 60;  // 분 구하기
  const cloudElement = document.createElement("div");  // 구름 요소 div 제작
  cloudElement.classList.add("time-cloud");  // class="time-cloud" 추가
  cloudElement.textContent = `${hour}H ${minute}M`;  // 구름 요소에 시간 삽입
  const settings = getCurrentMonthSettings();  // 현재 월의 테마와 목표시간 가져오기
  const colors = cloudColors[settings.theme];  // 테마에 맞는 색깔 배열 가져오기
  const colorIndex = getCloudColorIndex(minutes);  // 목표시간에 맞는 색깔 인덱스 가져오기
  cloudElement.style.backgroundColor = colors[colorIndex];  // 구름 색깔 알맞게 변경하기
  timeElement.appendChild(cloudElement);  // 자식 요소 추가
};

// 모든 구름 색상 업데이트
function updateAllCloudColors() {
  const days = document.querySelectorAll(".day");  // 셀 요소 모두 가져오기
  days.forEach(day => {  // 셀에 대해 반복
    const cloud = day.querySelector(".time-cloud");  // 각 날짜마다 구름 요소 가져오기
    if(!cloud) {  // 구름이 없으면 return
      return;
    }
    const dateElement = day.querySelector(".date");  // 셀에서 날짜 요소 가져오기
    const date = dateElement.textContent;  // 날짜 요소에서 날짜를 가져오기
    const dateKey = getDateKey(Number(date));  // 날짜를 사용해 날짜 Key 얻어내기
    const record = calendarRecords[dateKey];  // 날짜 Key를 사용해 기록 얻어내기

    // 기록이 없다면 구름 색상 업데이트할 필요 없음
    if(!record) {
      return;
    }
    const settings = getCurrentMonthSettings();  // 현재 월의 테마와 목표시간 가져오기
    const colors = cloudColors[settings.theme];  // 현재 테마에 해당하는 색깔 배열 가져오기
    const colorIndex = getCloudColorIndex(record.minutes);  // 기록 시간을 가지고 컬러 인덱스 가져오기
    cloud.style.backgroundColor = colors[colorIndex];  // 기록 시간의 인덱스에 맞는 구름색깔 설정
  });
};

// 월변경 이전버튼을 누르는 경우의 이벤트
prevButton.addEventListener("click", () => {
  currentMonth--;  // 월 -1
  // 1월에서 이전버튼을 누르는 경우
  if(currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();  // 달력 다시 그리기
});

// 월변경 다음버튼을 누르는 경우의 이벤트
nextButton.addEventListener("click", () => {
  currentMonth++;  // 월 +1
  // 12월에서 다음버튼을 누르는 경우
  if(currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();  // 달력 다시 그리기
});

// 테마 버튼을 누르면 6개의 테마 원이 나타남
themeButton.addEventListener("click", () => {
  if(themeList.style.display === "flex") {
    themeList.style.display = "none";
  } else {
    themeList.style.display = "flex";
  }
});

// 테마를 누르면 그 테마로 적용됨
themeOptions.forEach(button => {
  button.addEventListener("click", () => {
    const selectedTheme = button.dataset.theme;  // 테마 데이터값 가져오기
    const settings = getCurrentMonthSettings();  // 현재 월 설정 가져오기
    settings.theme = selectedTheme;  // 선택한 테마로 값 변경
    // LocalStorage 저장
    saveSettings(); 
    // 화면에 바로 적용
    applyCurrentTheme();
    // 테마 목록 닫기
    themeList.style.display = "none";
  });
});

// 목표시간 드롭다운 변경
targetTimeSelect.addEventListener("change", () => {
  const monthKey = getMonthKey();  // 현재 월 Key 가져오기
  const selectedValue = targetTimeSelect.value;  // 선택한 목표시간 값 가져오기
  // 선택한 목표시간이 있다면 배열에 목표시간값 저장하기
  monthlySettings[monthKey].targetTime = selectedValue === "" ? null : Number(selectedValue);
  // LocalStorage에 저장
  saveSettings();
  // 목표시간이 변경되었으므로 기존 구름 색상도 다시 계산
  updateAllCloudColors();
});

// picker-list 안에 picker-number 생성
function createPicker(pickerList, max) {
  for(let i=0; i<=max; i++) {
    const number = document.createElement("div");  // 숫자 div 요소 만들기
    number.classList.add("picker-number");  // class="picker-number" 추가
    number.textContent = i;  // 숫자 텍스트로 넣기
    pickerList.appendChild(number);  // picker-list의 자식요소로 추가
  }
}

// 숫자 만들기 함수 실행
createPicker(hourPickerList, 23);  // 시간
createPicker(minutePickerList, 59);  // 분

// 시간 선택 Picker 안에서 현재 선택된 숫자가 몇번째 숫자인지 찾아줌(회색 동그라미 안의 숫자)
function getSelectedPickerIndex(picker) {
  const pickerRect = picker.getBoundingClientRect();  // picker의 위치와 크기 가져오기
  const pickerCenter = pickerRect.top + pickerRect.height / 2;  // picker의 세로 방향 중앙 위치 계신
  const numbers = picker.querySelectorAll(".picker-number");  // picker 안의 숫자들 전부 찾기

  let closestIndex = 0;  // 가장 가까운 숫자의 위치를 저장할 변수
  let closestDistance = Infinity;  // 가장 가까운 거리 저장 변수

  // 모든 숫자를 하나씩 검사하기
  numbers.forEach((number, index) => {
    const numberRect = number.getBoundingClientRect();  // 현재 숫자의 위치와 크기 가져오기
    const numberCenter = numberRect.top + numberRect.height / 2;  // 현재 숫자 요소의 중앙 위치 구하기
    const distance = Math.abs(pickerCenter - numberCenter);  // picker 중앙과 숫자 중앙의 거리 계산

    if(distance < closestDistance) {  // 현재 숫자의 거리가 지금까지 저장된 가장 가까운 거리보다 가깝다면
      closestDistance = distance;  // 가장 가까운 거리 갱신
      closestIndex = index;  // 가장 가까운 숫자의 index 갱신
    }
  });

  return closestIndex;  // 반복이 끝나면 index 반환
}

// 시간 Picker를 매번 0H 0M으로 초기화
function resetPickers() {
  selectedHour = 0;
  selectedMinute = 0;

  hourPicker.scrollTop = 0;
  minutePicker.scrollTop = 0;

  updateSelectedNumber(hourPicker, 0);
  updateSelectedNumber(minutePicker, 0);
}

// 현재 선택된 숫자에만 selected 클래스 적용
function updateSelectedNumber(picker, index) {
  const numbers = picker.querySelectorAll(".picker-number");

  // 모든 숫자에서 selected 제거
  numbers.forEach((number, i) => {
    number.classList.remove("selected");
  });

  // 현재 선택된 숫자에만 selected 추가
  if (numbers[index]) {
    numbers[index].classList.add("selected");
  }
}

// 시간 설정 이벤트
hourPicker.addEventListener("scroll", () => {
  const index = getSelectedPickerIndex(hourPicker);
  selectedHour = Math.max(0, Math.min(23, index));
  // 현재 선택된 시간 숫자에 selected 클래스 추가
  updateSelectedNumber(hourPicker, selectedHour);
});

// 분 설정 이벤트
minutePicker.addEventListener("scroll", () => {
  const index = getSelectedPickerIndex(minutePicker);
  selectedMinute = Math.max(0, Math.min(59, index));
  // 현재 선택된 분 숫자에 selected 클래스 추가
  updateSelectedNumber(minutePicker, selectedMinute);
});

// 시간 입력 모달 드래그 시작 (마우스를 눌렀을 때)
modalDragHandle.addEventListener("pointerdown", event => {
  isDraggingModal = true;
  const rect = timeModalBox.getBoundingClientRect();

  // 현재 마우스 위치와 모달 안쪽 위 위치의 차이
  modalOffsetX = event.clientX - rect.left;  // 마우스가 모달의 왼쪽 끝에서 얼마나 떨어진 지점에 있는가?
  modalOffsetY = event.clientY - rect.top;  // 마우스가 모달의 위쪽 끝에서 얼마나 아래에 있는가?

  // 기존 flex 중앙 정렬의 영향을 받지 않도록 위치를 고정
  timeModalBox.style.position = "absolute";  // 요소를 일반적인 문서 배치 흐름에서 분리하고, 위치를 직접 지정할 수 있음
  timeModalBox.style.left = `${rect.left}px`;  // 모달의 현재 왼쪽 위치
  timeModalBox.style.top = `${rect.top}px`;  // 모달의 현재 위쪽 위치
  timeModalBox.style.transform = "none";  // 모달에 적용되어 있던 transform 효과 제거

  // 드래그 중 포인터를 계속 추적
  modalDragHandle.setPointerCapture(event.pointerId);
});

// 모달 이동 (마우스를 누른 상태로 모달을 이동시킬 때)
modalDragHandle.addEventListener("pointermove", event => {
  if(!isDraggingModal) {
    return;
  }
  const newLeft = event.clientX - modalOffsetX;
  const newTop = event.clientY - modalOffsetY;

  timeModalBox.style.left = `${newLeft}px`;
  timeModalBox.style.top = `${newTop}px`;
});

// 드래그 종료 (마우스를 떼었을 때)
modalDragHandle.addEventListener("pointerup", event => {
  isDraggingModal = false;
  modalDragHandle.releasePointerCapture(event.pointerId);
});

// 마우스가 영역 밖으로 나가도 드래그 종료
modalDragHandle.addEventListener("pointercancel", () => {
  isDraggingModal = false;
});

// 시간 입력 버튼 누르는 경우의 이벤트
saveButton.addEventListener("click", () => {

  // 목표시간이 설정되어 있는지 확인
  const settings = getCurrentMonthSettings();
  // 목표시간이 설정되어 있지 않다면
  if(settings.targetTime === null) {
    showAlert("You have to set the target time!");
    return;
  }

  // 총 공부 시간을 분으로 계산
  const totalMinutes = selectedHour * 60 + selectedMinute;
  // 해당 날짜의 기록이 없으면 생성
  if(!calendarRecords[selectedDateKey]) {
    calendarRecords[selectedDateKey] = {
      minutes: 0,
      icons: [],
      memo: ""
    };
  }

  // 시간 저장
  calendarRecords[selectedDateKey].minutes = totalMinutes;
  // LocalStorage에 시간 저장
  saveRecords();
  // 화면 표시
  displayStudyTime(selectedTimeElement, totalMinutes);
  timeModal.style.display = "none";
});

// 시간 삭제 버튼 누르는 경우의 이벤트
deleteButton.addEventListener("click",() => {
  // 날짜 Key가 저장되어 있지 않다면
  if(!selectedDateKey) {
    return;
  }
  // 시간 기록이 있다면
  if(calendarRecords[selectedDateKey]) {
    calendarRecords[selectedDateKey].minutes = 0;  // 시간 기록을 0으로 만듦
    // 시간 외에 아무 기록도 없다면 날짜 데이터 자체 삭제
    const record = calendarRecords[selectedDateKey];
    if(!record.icons || record.icons.length === 0 && !record.memo) {
      delete calendarRecords[selectedDateKey];
    }
  }

  // LocalStorage 시간 기록 저장
  saveRecords();

  // 시간 요소에 값이 있다면 공백 처리
  if(selectedTimeElement) {
    selectedTimeElement.textContent = "";
  }
  timeModal.style.display = "none";
});

// 아이콘 버튼을 눌렀을 때 아이콘 영역 나오게 하기
iconButton.addEventListener("click", () => {
  iconModal.style.display = "flex";
});

// 셀 아이콘 영역에 아이콘을 제작해서 넣기
function createIcon(iconClass, container) {
  const newIcon = document.createElement("i");  // i 요소 만들기
  newIcon.className = iconClass;  // 각 아이콘의 개별 특성 클래스를 추가
  container.appendChild(newIcon);  // 자식 요소로 붙이기
};

// 아이콘 목록에서 아이콘 자체를 눌렀을 때 각각의 클릭 이벤트
iconButtons.forEach(button => {
  button.addEventListener("click", () => {
    // 현재 선택된 날짜의 기록 가져오기
    const record = calendarRecords[selectedDateKey];

    // 현재 아이콘 개수 확인
    const iconCount = record?.icons?.length || 0;

    // 아이콘이 이미 4개라면 추가하지 않음
    if(iconCount >= 4) {
      // 아이콘 선택 모달 닫기
      iconModal.style.display = "none";
      showAlert("You can add up to 4 icons!");
      return;
    }

    // 선택한 버튼 안의 i 태그 가져오기
    const iconElement = button.querySelector("i");  
    const iconClass = iconElement.className;  // 클래스 이름을 iconClass로 복사

    // 아이콘 그릇에 아이콘 제작해서 넣기 (즉, 화면에 표시)
    createIcon(iconClass, selectedIconContainer);

    // 날짜 기록이 없으면 생성 (셀에 표시된 아이콘을 기억해야하니까)
    if(!calendarRecords[selectedDateKey]) {
      calendarRecords[selectedDateKey] = {
        minutes: 0,
        icons: [],
        memo: ""
      };
    }

    // 아이콘을 데이터 구조에 저장
    calendarRecords[selectedDateKey].icons.push(iconClass);

    // LocalStorage 저장
    saveRecords();

    // 아이콘 모달 닫기
    iconModal.style.display = "none";
  });
});

// 아이콘 삭제 모달에서 확인 버튼을 눌렀을 때
confirmDelete.addEventListener("click", () => {
  // 아이콘 요소가 선택되었고 그 날짜가 있을 때
  if(selectedIconElement && selectedDateKey) {
    const iconClass = selectedIconElement.className;  // 클래스 이름 얻어오기
    // 화면에서 아이콘 요소 삭제
    selectedIconElement.remove();

    // LocalStorage에서도 삭제
    const record = calendarRecords[selectedDateKey];
    if(record && record.icons) {
      // 선택된 날짜의 아이콘 클래스로 인덱스를 가져와서
      const index = record.icons.indexOf(iconClass);
      if(index !== -1) {
        record.icons.splice(index, 1);  // 아이콘 1개를 잘라낸다
      }
      // 시간, 아이콘, 메모가 모두 없을 때 날짜 데이터 아예 삭제
      if(record.minutes === 0 && record.icons.length === 0 && !record.memo) {
        delete calendarRecords[selectedDateKey];
      }
    }
    // LocalStorage에 저장
    saveRecords();
    selectedIconElement = null;
  }
  deleteModal.style.display = "none";
});

// 아이콘 삭제 모달에서 취소 버튼을 눌렀을 때
cancelDelete.addEventListener("click", () =>{
  deleteModal.style.display = "none";
});

// 메모 버튼을 눌렀을 때 메모 영역 나오게 하기
memoButton.addEventListener("click", () => {
  // 날짜 기록 읽어오기
  const record = calendarRecords[selectedDateKey];
  // 이전에 작성한 메모가 있다면 textarea에 표시
  memoInput.value = record?.memo || "";
  memoModal.style.display = "flex";
});

// 메모 모달에서 입력 버튼을 눌렀을 때
inputMemoButton.addEventListener("click", () => {
  // 날짜 기록 없다면 만들기
  if(!calendarRecords[selectedDateKey]) {
    calendarRecords[selectedDateKey] = {
      minutes: 0,
      icons: [],
      memo: ""
    };
  }

  // 날짜 데이터 구조에 메모 내용 넣기
  calendarRecords[selectedDateKey].memo = memoInput.value;
  // LocalStorage에 저장하기
  saveRecords();
  memoModal.style.display = "none";
});

// 메모 모달에서 지우기 버튼을 눌렀을 때
deleteMemoButton.addEventListener("click", () =>{
  // 날짜 기록이 있다면 공백으로 만들기
  if(calendarRecords[selectedDateKey]) {
    calendarRecords[selectedDateKey].memo = "";
  }
  // 메모 영역 부분 공백
  memoInput.value = "";
  // LocalStorage에 저장하기
  saveRecords();
});

// 라이트박스 바깥부분 눌렀을 때 화면 닫히게 만들기
// 시간 모달 닫기
timeModal.addEventListener("click", event => {
  if(event.target === timeModal) {
    timeModal.style.display = "none";
  }
});

// 아이콘 모달 닫기
iconModal.addEventListener("click", event => {
  if(event.target === iconModal) {
    iconModal.style.display = "none";
  }
});

// 메모 모달 닫기
memoModal.addEventListener("click", event => {
  if(event.target === memoModal) {
    memoModal.style.display = "none";
  }
});

// 삭제 모달 닫기
deleteModal.addEventListener("click", event => {
  if(event.target === deleteModal) {
    deleteModal.style.display = "none";
  }
});

// 알림 모달 확인 버튼을 눌렀을 때
confirmAlert.addEventListener("click", () => {
  alertModal.style.display = "none";
});

// 알람 모달 바깥쪽 클릭 시 닫기
alertModal.addEventListener("click", event => {
  if(event.target === alertModal) {
    alertModal.style.display = "none";
  }
});

// 처음 실행
renderCalendar();

let resizeTimer;

// 브라우저 화면 크기가 변경되면 달력 크기 다시 계산
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    // 현재 달의 1일이 무슨 요일인지 조사
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDay = firstDay.getDay();

    // 현재 달의 마지막 날짜 조사
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    // 필요한 행 수 계산
    const totalDays = startDay + daysInMonth;
    const weeks = Math.ceil(totalDays / 7);

    // 달력 크기만 다시 계산
    updateCalendarSize(weeks);
    }, 100);
});