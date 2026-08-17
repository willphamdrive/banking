// Phân hệ Học tập Luật Ngân hàng Việt Nam (Library & Quiz)
class BaselLaws {
  constructor() {
    this.laws = BASEL_DATA.laws;
    this.quizzes = BASEL_DATA.lawQuizzes;
    
    // Trạng thái tìm kiếm/lọc
    this.currentCategory = "all";
    this.searchQuery = "";

    // Trạng thái bài trắc nghiệm luật
    this.quizIndex = 0;
    this.score = 0;
    this.isAnswered = false;

    this.initElements();
    this.bindEvents();
    this.renderLawsList();
  }

  initElements() {
    // Tìm kiếm & Lọc
    this.searchInput = document.getElementById("laws-search-input");
    this.catButtons = document.querySelectorAll(".law-cat-btn");
    this.listContainer = document.getElementById("laws-list-container");

    // Trắc nghiệm pháp luật
    this.quizStart = document.getElementById("law-quiz-start");
    this.quizActive = document.getElementById("law-quiz-active");
    this.quizResults = document.getElementById("law-quiz-results");

    this.btnStart = document.getElementById("btn-start-law-quiz");
    this.btnNext = document.getElementById("btn-next-law-question");
    this.btnRestart = document.getElementById("btn-restart-law-quiz");

    this.questionText = document.getElementById("law-question-text");
    this.optionsContainer = document.getElementById("law-options-container");
    this.explanationContainer = document.getElementById("law-explanation-container");
    this.explanationText = document.getElementById("law-explanation-text");

    this.progressFill = document.getElementById("law-quiz-progress-fill");
    this.progressText = document.getElementById("law-quiz-progress-text");

    this.scoreText = document.getElementById("law-score-text");
    this.scorePercent = document.getElementById("law-score-percent");
    this.scoreMsg = document.getElementById("law-score-message");
  }

  bindEvents() {
    // Gõ phím tìm kiếm văn bản
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.filterLaws();
      });
    }

    // Chọn danh mục văn bản
    this.catButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        this.catButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentCategory = btn.getAttribute("data-category");
        this.filterLaws();
      });
    });

    // Sự kiện trắc nghiệm luật
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

  filterLaws() {
    const filtered = this.laws.filter(law => {
      // Kiểm tra danh mục
      const matchCat = this.currentCategory === "all" || law.category === this.currentCategory;
      
      // Kiểm tra từ khóa tìm kiếm
      const matchSearch = 
        law.code.toLowerCase().includes(this.searchQuery) ||
        law.title.toLowerCase().includes(this.searchQuery) ||
        law.summary.toLowerCase().includes(this.searchQuery) ||
        law.highlights.some(hl => hl.toLowerCase().includes(this.searchQuery));

      return matchCat && matchSearch;
    });

    this.renderLawsList(filtered);
  }

  renderLawsList(data = this.laws) {
    if (!this.listContainer) return;

    if (data.length === 0) {
      this.listContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          🔍 Không tìm thấy văn bản pháp lý phù hợp với từ khóa của bạn.
        </div>
      `;
      return;
    }

    this.listContainer.innerHTML = data.map(law => {
      // Xác định badge class tương ứng với loại văn bản
      let badgeClass = "badge-law";
      if (law.type === "Thông tư") badgeClass = "badge-circular";
      if (law.type === "Nghị định") badgeClass = "badge-decree";

      const highlightsHtml = law.highlights.map(hl => `<li>${this.formatMarkdown(hl)}</li>`).join("");
      const sourceUrlHtml = law.sourceUrl ? `
        <a href="${law.sourceUrl}" target="_blank" class="source-link-btn">
          <i data-lucide="external-link" style="width: 12px; height: 12px;"></i> Tài liệu gốc
        </a>
      ` : "";

      return `
        <div class="law-card card" style="margin-bottom: 0;">
          <div class="law-card-header">
            <span class="law-code-badge ${badgeClass}">${law.type} ${law.code}</span>
            <span class="law-effect-date">Hiệu lực từ: ${law.effectDate}</span>
          </div>
          <h3 class="law-card-title">${law.title}</h3>
          <p class="law-card-summary">${law.summary}</p>
          <div class="law-card-highlights">
            <h4>Nội dung cốt lõi:</h4>
            <ul>${highlightsHtml}</ul>
          </div>
          ${sourceUrlHtml}
        </div>
      `;
    }).join("");

    // Khởi tạo lại icons cho nội dung sinh động
    lucide.createIcons();
  }

  // Quản lý Trắc nghiệm Pháp luật VN
  startQuiz() {
    this.quizIndex = 0;
    this.score = 0;
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

    const currentQ = this.quizzes[this.quizIndex];

    // Cập nhật câu hỏi
    this.questionText.innerText = `Câu hỏi tình huống ${this.quizIndex + 1}/${this.quizzes.length}: ${currentQ.question}`;

    // Cập nhật tiến trình
    const progressPercent = (this.quizIndex / this.quizzes.length) * 100;
    this.progressFill.style.width = `${progressPercent}%`;
    this.progressText.innerText = `Hoàn thành ${Math.round(progressPercent)}%`;

    // Cập nhật các phương án
    this.optionsContainer.innerHTML = "";
    currentQ.options.forEach((option, idx) => {
      const button = document.createElement("button");
      button.className = "quiz-option";
      button.innerHTML = `
        <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
        <span class="option-text">${option}</span>
      `;
      button.addEventListener("click", () => this.selectAnswer(idx));
      this.optionsContainer.appendChild(button);
    });
  }

  selectAnswer(selectedIndex) {
    if (this.isAnswered) return;
    this.isAnswered = true;

    const currentQ = this.quizzes[this.quizIndex];
    const options = this.optionsContainer.querySelectorAll(".quiz-option");

    const isCorrect = selectedIndex === currentQ.answer;
    if (isCorrect) {
      this.score++;
      options[selectedIndex].classList.add("correct");
    } else {
      options[selectedIndex].classList.add("incorrect");
      options[currentQ.answer].classList.add("correct");
    }

    // Disable all options
    options.forEach(opt => opt.classList.add("disabled"));

    // Hiển thị giải thích pháp lý
    this.explanationText.innerHTML = currentQ.explanation;
    this.explanationContainer.classList.remove("hidden");

    if (this.quizIndex === this.quizzes.length - 1) {
      this.btnNext.innerText = "Xem kết quả chung cuộc";
    } else {
      this.btnNext.innerText = "Câu tiếp theo";
    }
    this.btnNext.classList.remove("hidden");
  }

  nextQuestion() {
    if (this.quizIndex < this.quizzes.length - 1) {
      this.quizIndex++;
      this.renderQuestion();
    } else {
      this.showResults();
    }
  }

  showResults() {
    this.quizActive.classList.add("hidden");
    this.quizResults.classList.remove("hidden");

    this.progressFill.style.width = "100%";
    this.progressText.innerText = "Hoàn thành 100%";

    const total = this.quizzes.length;
    const pct = Math.round((this.score / total) * 100);

    this.scoreText.innerText = `${this.score} / ${total}`;
    this.scorePercent.innerText = `${pct}%`;

    let msg = "";
    if (pct >= 80) {
      msg = "🎉 Xuất sắc! Bạn nắm rất rõ các quy định cụ thể của Luật Các TCTD và hệ thống thông tư hướng dẫn của NHNN Việt Nam.";
    } else if (pct >= 50) {
      msg = "👍 Tốt! Bạn đã nắm vững các nguyên lý điều chỉnh nợ xấu và các giới hạn an toàn cốt lõi như LDR.";
    } else {
      msg = "📚 Bạn nên xem kỹ lại các tóm tắt luật ở danh mục bên trên, đặc biệt là giới hạn nợ nhóm 3-4-5 và giới hạn cho vay 10% vốn tự có của Luật 2024 mới.";
    }
    this.scoreMsg.innerText = msg;
  }

  restartQuiz() {
    this.startQuiz();
  }

  formatMarkdown(text) {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }
}

// Khởi tạo Phân hệ Luật khi DOM load xong
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("laws-section")) {
    window.baselLaws = new BaselLaws();
  }
});
