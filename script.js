// 다크모드 및 목표 체크리스트 기능을 제어하는 스크립트

const THEME_STORAGE_KEY = "profile-theme";
const GOALS_STORAGE_KEY = "profile-goals";

const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");
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
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const initialTheme = savedTheme === "dark" ? "dark" : "light";
  applyTheme(initialTheme);
}

/**
 * 다크모드 전환 버튼을 클릭했을 때 테마를 반전시키고 저장합니다.
 */
function toggleTheme() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const nextTheme = isDark ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
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
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goalsState));
}

/**
 * 저장된 목표 체크 상태를 불러와 화면에 복원합니다.
 */
function initGoals() {
  const savedData = localStorage.getItem(GOALS_STORAGE_KEY);
  if (savedData) {
    try {
      const goalsState = JSON.parse(savedData);
      goalCheckboxes.forEach((checkbox) => {
        const goalId = checkbox.dataset.goalId;
        if (typeof goalsState[goalId] === "boolean") {
          checkbox.checked = goalsState[goalId];
        }
      });
    } catch {
      // 저장된 값이 손상된 경우 기본 상태(모두 미체크)로 유지
    }
  }
  updateGoalProgress();
}

// 이벤트 연결
themeToggleBtn.addEventListener("click", toggleTheme);

goalCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    updateGoalProgress();
    saveGoalsState();
  });
});

// 페이지 로드 시 초기 상태 설정
initTheme();
initGoals();
