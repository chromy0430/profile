// 다크모드, 타자 인사말, 관심 분야 카드 토글 및 목표 체크리스트 제어 스크립트

const THEME_STORAGE_KEY = "profile-theme";
const GOALS_STORAGE_KEY = "profile-goals";
const GREETING_TEXT = "안녕하세요! 저의 자기소개 페이지에 오신 것을 환영합니다.";

const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");
const typingGreeting = document.getElementById("typingGreeting");
const interestCards = document.querySelectorAll(".card");
const goalCheckboxes = document.querySelectorAll(".goal-checkbox");
const goalProgress = document.getElementById("goalProgress");

/**
 * 현재 테마를 화면에 적용하고 버튼 문구를 업데이트합니다.
 * @param {"light" | "dark"} theme
 */
function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeIcon.textContent = "☀️";
    themeLabel.textContent = "라이트 모드";
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeIcon.textContent = "🌙";
    themeLabel.textContent = "다크 모드";
  }
}

/**
 * 저장된 테마 설정을 불러와 초기 화면에 반영합니다.
 */
function initTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme = savedTheme === "dark" ? "dark" : "light";
    applyTheme(initialTheme);
  } catch {
    applyTheme("light");
  }
}

/**
 * 다크모드 전환 버튼을 클릭했을 때 테마를 반전시키고 저장합니다.
 */
function toggleTheme() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const nextTheme = isDark ? "light" : "dark";
  applyTheme(nextTheme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch {
    // 저장소 접근이 제한된 환경에서는 화면 전환만 유지
  }
}

/**
 * 상단 인사말을 타자 치듯 한 글자씩 화면에 출력합니다.
 */
function startTypingGreeting() {
  let charIndex = 0;
  typingGreeting.textContent = "";

  const typingTimer = setInterval(() => {
    typingGreeting.textContent += GREETING_TEXT[charIndex];
    charIndex += 1;

    if (charIndex >= GREETING_TEXT.length) {
      clearInterval(typingTimer);
    }
  }, 65);
}

/**
 * 관심 분야 카드 클릭 또는 키보드 입력 시 설명 영역을 펼치거나 접습니다.
 * @param {HTMLElement} card
 */
function toggleCard(card) {
  const isOpen = card.classList.toggle("is-open");
  card.setAttribute("aria-expanded", String(isOpen));
}

/**
 * 체크된 목표 개수를 세어 진행률 텍스트를 갱신합니다.
 */
function updateGoalProgress() {
  const checkedCount = Array.from(goalCheckboxes).filter(
    (checkbox) => checkbox.checked
  ).length;
  goalProgress.textContent = `${checkedCount} / ${goalCheckboxes.length} 달성`;
}

/**
 * 체크리스트 상태를 브라우저 저장소(localStorage)에 저장합니다.
 */
function saveGoalsState() {
  const goalsState = {};
  goalCheckboxes.forEach((checkbox) => {
    const goalId = checkbox.dataset.goalId;
    goalsState[goalId] = checkbox.checked;
  });
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goalsState));
  } catch {
    // 저장소 접근이 제한된 환경에서는 무시
  }
}

/**
 * 저장된 목표 체크 상태를 불러와 화면에 복원합니다.
 */
function initGoals() {
  try {
    const savedData = localStorage.getItem(GOALS_STORAGE_KEY);
    if (savedData) {
      const goalsState = JSON.parse(savedData);
      goalCheckboxes.forEach((checkbox) => {
        const goalId = checkbox.dataset.goalId;
        if (typeof goalsState[goalId] === "boolean") {
          checkbox.checked = goalsState[goalId];
        }
      });
    }
  } catch {
    // 저장된 값이 손상되었거나 접근 불가한 경우 기본 상태로 유지
  }
  updateGoalProgress();
}

// 이벤트 연결
themeToggleBtn.addEventListener("click", toggleTheme);

interestCards.forEach((card) => {
  card.addEventListener("click", () => toggleCard(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleCard(card);
    }
  });
});

goalCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    updateGoalProgress();
    saveGoalsState();
  });
});

// 페이지 로드 시 초기 상태 설정
initTheme();
initGoals();
startTypingGreeting();
