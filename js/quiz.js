// Logic quản lý bài trắc nghiệm tương tác
class BaselQuiz {
  constructor() {
    this.questions = BASEL_DATA.quizzes;
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = []; // Lưu các đáp án đã chọn
    this.isAnswered = false; // Đã trả lời câu hỏi hiện tại chưa

    this.initElements();
    this.bindEvents();
    this.render();
  }

  initElements() {
    this.quizStart = document.getElementById("quiz-start");
    this.quizActive = document.getElementById("quiz-active");
    this.quizResults = document.getElementById("quiz-results");

    this.btnStart = document.getElementById("btn-start-quiz");
    this.btnNext = document.getElementById("btn-next-question");
    this.btnRestart = document.getElementById("btn-restart-quiz");

    this.questionText = document.getElementById("question-text");
    this.optionsContainer = document.getElementById("options-container");
    this.explanationContainer = document.getElementById("explanation-container");
    this.explanationText = document.getElementById("explanation-text");

    this.progressFill = document.getElementById("quiz-progress-fill");
    this.progressText = document.getElementById("quiz-progress-text");

    this.scoreText = document.getElementById("quiz-score-text");
    this.scorePercent = document.getElementById("quiz-score-percent");
    this.scoreMsg = document.getElementById("quiz-score-message");
  }

  bindEvents() {
    if (this.btnStart) {
      this.btnStart.addEventListener("click", () => this.startQuiz());
    }
    if (this.btnNext) {
      this.btnNext.addEventListener("click", () => this.nextQuestion());
    }
    if (this.btnRestart) {
      this.btnRestart.addEventListener("click", () => this.restartQuiz());
    }
  }

  startQuiz() {
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.isAnswered = false;

    this.quizStart.classList.add("hidden");
    this.quizResults.classList.add("hidden");
    this.quizActive.classList.remove("hidden");

    this.renderQuestion();
  }

  renderQuestion() {
    this.isAnswered = false;
    this.btnNext.classList.add("hidden");
    this.explanationContainer.classList.add("hidden");

    const currentQ = this.questions[this.currentIndex];

    // Cập nhật câu hỏi
    this.questionText.innerText = `Câu hỏi ${this.currentIndex + 1}/${this.questions.length}: ${currentQ.question}`;

    // Cập nhật tiến trình (progress bar)
    const progressPercent = ((this.currentIndex) / this.questions.length) * 100;
    this.progressFill.style.width = `${progressPercent}%`;
    this.progressText.innerText = `Hoàn thành ${Math.round(progressPercent)}%`;

    // Cập nhật danh sách đáp án
    this.optionsContainer.innerHTML = "";
    currentQ.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.className = "quiz-option";
      button.innerHTML = `
        <span class="option-letter">${String.fromCharCode(65 + index)}</span>
        <span class="option-text">${option}</span>
      `;
      button.addEventListener("click", () => this.selectAnswer(index));
      this.optionsContainer.appendChild(button);
    });
  }

  selectAnswer(selectedIndex) {
    if (this.isAnswered) return; // Không cho phép chọn lại sau khi đã xác nhận đáp án

    this.isAnswered = true;
    const currentQ = this.questions[this.currentIndex];
    const options = this.optionsContainer.querySelectorAll(".quiz-option");

    this.userAnswers.push(selectedIndex);

    // Kiểm tra đúng hay sai
    const isCorrect = selectedIndex === currentQ.answer;
    if (isCorrect) {
      this.score++;
      options[selectedIndex].classList.add("correct");
    } else {
      options[selectedIndex].classList.add("incorrect");
      // Highlight câu đúng
      options[currentQ.answer].classList.add("correct");
    }

    // Hiệu ứng vô hiệu hóa tất cả các nút
    options.forEach(opt => opt.classList.add("disabled"));

    // Hiển thị giải thích
    this.explanationText.innerHTML = currentQ.explanation;
    this.explanationContainer.classList.remove("hidden");

    // Đổi nút Tiếp theo thành Xem kết quả ở câu cuối
    if (this.currentIndex === this.questions.length - 1) {
      this.btnNext.innerText = "Xem kết quả";
    } else {
      this.btnNext.innerText = "Câu tiếp theo";
    }
    this.btnNext.classList.remove("hidden");
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.renderQuestion();
    } else {
      this.showResults();
    }
  }

  showResults() {
    this.quizActive.classList.add("hidden");
    this.quizResults.classList.remove("hidden");

    // Cập nhật biểu đồ tiến trình đạt 100%
    this.progressFill.style.width = "100%";
    this.progressText.innerText = "Hoàn thành 100%";

    const totalQuestions = this.questions.length;
    const pct = Math.round((this.score / totalQuestions) * 100);

    this.scoreText.innerText = `${this.score} / ${totalQuestions}`;
    this.scorePercent.innerText = `${pct}%`;

    let msg = "";
    if (pct >= 80) {
      msg = "🎉 Xuất sắc! Bạn đã nắm rất vững kiến thức cốt lõi về các hiệp ước Basel I, II, III.";
    } else if (pct >= 50) {
      msg = "👍 Khá tốt! Bạn đã hiểu các nguyên lý căn bản, hãy đọc thêm dòng thời gian và các trụ cột để củng cố kiến thức.";
    } else {
      msg = "📚 Hãy dành thêm chút thời gian xem lại các trụ cột Basel và thử sức lại nhé. Quản trị rủi ro cần sự chính xác cao!";
    }
    this.scoreMsg.innerText = msg;
  }

  restartQuiz() {
    this.startQuiz();
  }

  render() {
    // Trạng thái ban đầu: Hiển thị màn hình Start
    this.quizStart.classList.remove("hidden");
    this.quizActive.classList.add("hidden");
    this.quizResults.classList.add("hidden");
  }
}

// Khởi tạo Quiz khi DOM load xong
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("quiz-section")) {
    window.baselQuiz = new BaselQuiz();
  }
});
