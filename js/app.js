// Trình quản trị giao diện chính (Main App Controller)
class BaselApp {
  constructor() {
    this.currentTab = "dashboard";
    this.theme = localStorage.getItem("theme") || "dark";
    
    this.initElements();
    this.bindEvents();
    this.applyTheme();
    this.renderTimeline();
    this.renderComparisonTable();
  }

  initElements() {
    this.themeToggle = document.getElementById("theme-toggle");
    this.navItems = document.querySelectorAll(".nav-item");
    this.sections = document.querySelectorAll(".content-section");
    
    // Nút điều hướng từ Dashboard sang các phần khác
    this.dashLinks = document.querySelectorAll("[data-target]");
  }

  bindEvents() {
    // Sự kiện chuyển theme
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => this.toggleTheme());
    }

    // Sự kiện click chuyển Tab trong Sidebar
    this.navItems.forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const tabId = item.getAttribute("href").substring(1);
        this.switchTab(tabId);
      });
    });

    // Sự kiện click liên kết từ màn hình Dashboard
    this.dashLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const tabId = link.getAttribute("data-target");
        this.switchTab(tabId);
      });
    });
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.theme);
    const icon = this.themeToggle.querySelector("i");
    if (icon) {
      if (this.theme === "dark") {
        icon.className = "lucide-sun";
        // Re-init lucide icons to display correctly if using class
        this.themeToggle.innerHTML = '<i data-lucide="sun"></i>';
      } else {
        icon.className = "lucide-moon";
        this.themeToggle.innerHTML = '<i data-lucide="moon"></i>';
      }
      lucide.createIcons();
    }
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", this.theme);
    this.applyTheme();
  }

  switchTab(tabId) {
    if (!tabId) return;
    this.currentTab = tabId;

    // Cập nhật trạng thái active trên sidebar
    this.navItems.forEach(item => {
      const href = item.getAttribute("href").substring(1);
      if (href === tabId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Ẩn/hiện các panel tương ứng
    this.sections.forEach(section => {
      if (section.id === `${tabId}-section`) {
        section.classList.remove("hidden");
      } else {
        section.classList.add("hidden");
      }
    });

    // Cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Trình kích hoạt vẽ biểu đồ trong máy tính nếu nhảy vào tab máy tính
    if (tabId === "calculator" && window.baselCalculator) {
      window.baselCalculator.calculate();
    }
  }

  renderTimeline() {
    const container = document.getElementById("timeline-container");
    if (!container) return;

    container.innerHTML = BASEL_DATA.timeline.map((item, idx) => {
      const isEven = idx % 2 === 0;
      const keyRulesHtml = item.keyRules.map(rule => `<li>${this.formatMarkdown(rule)}</li>`).join("");
      const limitationsHtml = item.limitations.map(lim => `<li>${this.formatMarkdown(lim)}</li>`).join("");

      return `
        <div class="timeline-item ${isEven ? 'left' : 'right'}">
          <div class="timeline-badge">${item.year}</div>
          <div class="timeline-card card">
            <div class="timeline-header">
              <span class="timeline-year-label">${item.year}</span>
              <h3>${item.title}</h3>
            </div>
            <div class="timeline-body">
              <p class="timeline-context"><strong>Bối cảnh:</strong> ${item.context}</p>
              <p class="timeline-objective"><strong>Mục tiêu chính:</strong> ${item.objective}</p>
              
              <div class="timeline-detail-box">
                <h4>Quy định then chốt:</h4>
                <ul>${keyRulesHtml}</ul>
              </div>

              <div class="timeline-detail-box limit">
                <h4>Hạn chế & Điểm yếu:</h4>
                <ul>${limitationsHtml}</ul>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  renderComparisonTable() {
    const container = document.getElementById("comparison-table-container");
    if (!container) return;

    const data = BASEL_DATA.comparison;
    
    const headersHtml = data.headers.map(h => `<th>${h}</th>`).join("");
    
    const rowsHtml = data.rows.map(row => {
      return `
        <tr>
          <td class="criterion-col"><strong>${row.criterion}</strong></td>
          <td>${this.formatMarkdown(row.basel1)}</td>
          <td>${this.formatMarkdown(row.basel2)}</td>
          <td class="highlight-basel3">${this.formatMarkdown(row.basel3)}</td>
          <td>${this.formatMarkdown(row.basel4)}</td>
        </tr>
      `;
    }).join("");

    container.innerHTML = `
      <div class="table-responsive">
        <table class="comparison-table">
          <thead>
            <tr>${headersHtml}</tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  // Tiện ích format markdown cơ bản (in đậm **, code ``, màu sắc)
  formatMarkdown(text) {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }
}

// Khởi chạy ứng dụng
document.addEventListener("DOMContentLoaded", () => {
  window.baselApp = new BaselApp();
  // Khởi tạo icons Lucide
  lucide.createIcons();
});
