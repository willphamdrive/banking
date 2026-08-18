// Trình quản trị giao diện chính (Main App Controller)
class BaselApp {
  constructor() {
    this.currentTab = "bank-analysis";
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

    // Sự kiện click liên kết từ màn hình Dashboard (hỗ trợ chuyển hướng sub-tabs của Basel)
    this.dashLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.getAttribute("data-target");
        const baselSubTabs = ["timeline", "pillars", "comparison", "calculator", "quiz"];
        
        if (baselSubTabs.includes(target)) {
          this.switchTab("basel");
          // Kích hoạt sub-tab tương ứng
          const subTabBtn = document.querySelector(`.sub-tab-btn[data-baseltab="${target}"]`);
          if (subTabBtn) {
            subTabBtn.click();
          }
        } else {
          this.switchTab(target);
        }
      });
    });

    // Sự kiện đóng mở (toggle) sidebar
    const collapseBtn = document.getElementById("sidebar-collapse-btn");
    const expandBtn = document.getElementById("sidebar-expand-btn");
    const appContainer = document.querySelector(".app-container");
    
    if (collapseBtn && expandBtn && appContainer) {
      collapseBtn.addEventListener("click", () => {
        appContainer.classList.add("sidebar-collapsed");
        appContainer.classList.remove("mobile-sidebar-active");
        expandBtn.classList.remove("hidden");
      });
      expandBtn.addEventListener("click", () => {
        appContainer.classList.remove("sidebar-collapsed");
        appContainer.classList.add("mobile-sidebar-active");
        expandBtn.classList.add("hidden");
      });
    }

    // Sự kiện đóng sidebar trên mobile khi nhấp ra ngoài
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 768 && appContainer) {
        const sidebar = document.querySelector(".sidebar");
        if (sidebar && !sidebar.contains(e.target) && expandBtn && !expandBtn.contains(e.target)) {
          if (appContainer.classList.contains("mobile-sidebar-active")) {
            appContainer.classList.add("sidebar-collapsed");
            appContainer.classList.remove("mobile-sidebar-active");
            expandBtn.classList.remove("hidden");
          }
        }
      }
    });

    // Sự kiện chuyển sub-tab trong phân hệ Basel
    const baselSubTabBtns = document.querySelectorAll(".sub-tab-btn[data-baseltab]");
    const baselTabPanels = document.querySelectorAll(".basel-tab-panel");
    
    baselSubTabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        baselSubTabBtns.forEach(b => {
          b.classList.remove("active");
          b.style.borderBottomColor = "transparent";
          b.style.color = "var(--text-muted)";
        });
        btn.classList.add("active");
        btn.style.borderBottomColor = "var(--primary)";
        btn.style.color = "var(--text-main)";

        const subTabId = btn.getAttribute("data-baseltab");
        baselTabPanels.forEach(panel => {
          if (panel.id === `${subTabId}-section`) {
            panel.classList.remove("hidden");
          } else {
            panel.classList.add("hidden");
          }
        });

        // Kích hoạt tính toán nếu nhảy vào tab calculator
        if (subTabId === "calculator" && window.baselCalculator) {
          window.baselCalculator.calculate();
        }

        lucide.createIcons();
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

    // Tự động đóng sidebar trên mobile khi chuyển tab
    const appContainer = document.querySelector(".app-container");
    const expandBtn = document.getElementById("sidebar-expand-btn");
    if (appContainer && window.innerWidth <= 768) {
      appContainer.classList.add("sidebar-collapsed");
      appContainer.classList.remove("mobile-sidebar-active");
      if (expandBtn) expandBtn.classList.remove("hidden");
    }

    // Cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Kích hoạt biểu đồ nếu vào tab máy tính (hoặc qua tab basel đang mở máy tính)
    if (tabId === "basel") {
      const activeSub = document.querySelector(".sub-tab-btn[data-baseltab].active");
      if (activeSub && activeSub.getAttribute("data-baseltab") === "calculator" && window.baselCalculator) {
        window.baselCalculator.calculate();
      }
    }
  }

  renderTimeline() {
    const container = document.getElementById("timeline-container");
    if (!container) return;

    container.innerHTML = BASEL_DATA.timeline.map((item, idx) => {
      const isEven = idx % 2 === 0;
      const keyRulesHtml = item.keyRules.map(rule => `<li>${this.formatMarkdown(rule)}</li>`).join("");
      const limitationsHtml = item.limitations.map(lim => `<li>${this.formatMarkdown(lim)}</li>`).join("");
      const sourceUrlHtml = item.sourceUrl ? `
        <button class="source-link-btn open-pdf-timeline-btn" data-docpath="${item.sourceUrl}" data-docname="${item.title}" style="cursor: pointer; border: none; outline: none; display: inline-flex; align-items: center; gap: 6px;">
          <i data-lucide="book-open" style="width: 12px; height: 12px;"></i> Đọc trực tiếp (PDF)
        </button>
      ` : "";

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

              ${sourceUrlHtml}
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Đăng ký sự kiện click mở xem PDF trực tiếp cho Timeline
    const timelinePdfBtns = container.querySelectorAll(".open-pdf-timeline-btn");
    timelinePdfBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const path = btn.getAttribute("data-docpath");
        const name = btn.getAttribute("data-docname");
        if (window.documentFinder) {
          window.documentFinder.openPdfViewer(path, name);
        }
      });
    });

    // Khởi tạo lại icons cho nội dung sinh động
    lucide.createIcons();
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

    // Thiết lập tính năng tương tác làm nổi bật (highlight) cột khi hover và click
    const table = container.querySelector(".comparison-table");
    if (table) {
      const cells = table.querySelectorAll("th, td");
      cells.forEach(cell => {
        // Chỉ xử lý các cột chỉ số (cột 1 đến cột 4), bỏ qua cột tiêu chí đầu tiên (cột 0)
        cell.addEventListener("mouseenter", () => {
          const colIdx = cell.cellIndex;
          if (colIdx === 0) return;
          const rows = table.querySelectorAll("tr");
          rows.forEach(row => {
            const targetCell = row.cells[colIdx];
            if (targetCell) {
              targetCell.classList.add("col-highlight");
            }
          });
        });

        cell.addEventListener("mouseleave", () => {
          const colIdx = cell.cellIndex;
          const rows = table.querySelectorAll("tr");
          rows.forEach(row => {
            const targetCell = row.cells[colIdx];
            if (targetCell) {
              targetCell.classList.remove("col-highlight");
            }
          });
        });

        // Click để ghim highlight cố định cho cột đó
        cell.addEventListener("click", () => {
          const colIdx = cell.cellIndex;
          if (colIdx === 0) return;
          
          // Xóa tất cả các ghim cũ
          table.querySelectorAll("th, td").forEach(c => c.classList.remove("col-active"));

          // Thêm ghim mới cho cột được click
          const rows = table.querySelectorAll("tr");
          rows.forEach(row => {
            const targetCell = row.cells[colIdx];
            if (targetCell) {
              targetCell.classList.add("col-active");
            }
          });
        });
      });
    }
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
