// Logic hiển thị và xử lý dữ liệu Phân tích Hedge Posts với phân trang (Pagination) và Lọc theo chủ đề
class HedgeInsights {
  constructor() {
    this.posts = typeof HEDGE_POSTS_DATA !== "undefined" ? HEDGE_POSTS_DATA : [];
    this.selectedBank = null;
    this.searchQuery = "";
    this.filterMode = "all"; // 'all' hoặc 'has_bank'
    this.filterTopic = "all"; // 'all', 'basel_tt22', 'interest_macro', 'exchange_fx', 'deals_corp', 'other'
    this.sortOrder = "newest"; // 'newest' hoặc 'oldest'
    
    // Pagination parameters
    this.currentPage = 1;
    this.postsPerPage = 10; // Hiển thị 10 bài viết mỗi trang
    
    this.initElements();
    this.bindEvents();
    this.render();
  }

  initElements() {
    this.postsListContainer = document.getElementById("hedge-posts-list");
    this.detailsContainer = document.getElementById("hedge-bank-details");
    this.searchInput = document.getElementById("hedge-search-input");
    this.filterBtns = document.querySelectorAll(".hedge-filter-btn");
    this.topicBtns = document.querySelectorAll(".hedge-topic-btn");
    this.sortSelect = document.getElementById("hedge-sort-select");
    this.paginationContainer = document.getElementById("hedge-pagination");
  }

  bindEvents() {
    // Sự kiện tìm kiếm bài viết
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.currentPage = 1; // Reset về trang 1
        this.render();
      });
    }

    // Sự kiện lọc bài viết (Tất cả / Có nhắc đến Ngân hàng)
    this.filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.filterMode = btn.getAttribute("data-filter");
        this.currentPage = 1; // Reset về trang 1
        this.render();
      });
    });

    // Sự kiện lọc bài viết theo Chủ đề (Topic)
    this.topicBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.topicBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.filterTopic = btn.getAttribute("data-topic");
        this.currentPage = 1; // Reset về trang 1
        this.render();
      });
    });

    // Sự kiện sắp xếp bài viết
    if (this.sortSelect) {
      this.sortSelect.addEventListener("change", (e) => {
        this.sortOrder = e.target.value;
        this.currentPage = 1; // Reset về trang 1
        this.render();
      });
    }
  }

  // Nhấn vào một ngân hàng để xem chi tiết bên pane phải
  selectBank(bankCode) {
    this.selectedBank = bankCode;
    this.renderDetails();
    
    // Highlight tất cả các tag cùng ngân hàng trong danh sách bài viết
    document.querySelectorAll(".bank-tag").forEach(tag => {
      if (tag.getAttribute("data-bank") === bankCode) {
        tag.classList.add("active-tag");
      } else {
        tag.classList.remove("active-tag");
      }
    });
  }

  // Khôi phục phân tích số liệu trên biểu đồ chính
  viewBankAnalysis(bankCode) {
    if (window.baselAnalysis) {
      window.baselAnalysis.indBank = bankCode;
      const select = document.getElementById("analysis-bank-select");
      if (select) select.value = bankCode;
      window.baselAnalysis.renderIndividualAnalysis();
    }
    if (window.baselApp) {
      window.baselApp.switchTab("bank-analysis");
    }
  }

  // Mở tài liệu PDF gốc tương ứng với báo cáo gần nhất của ngân hàng đó
  viewOriginalPdf(bankCode, year = 2025) {
    if (typeof BANK_CAR_DATABASE !== "undefined" && BANK_CAR_DATABASE[bankCode]) {
      const yearData = BANK_CAR_DATABASE[bankCode][year];
      if (yearData && yearData.pdf) {
        const path = `docs/banks/${yearData.pdf}`;
        const name = `[Năm - ${year}] ${bankCode} Báo cáo CAR`;
        if (window.documentFinder) {
          window.documentFinder.openPdfViewer(path, name);
        }
      }
    }
  }

  // Render danh sách bài viết bên trái
  render() {
    if (!this.postsListContainer) return;

    // Lọc bài viết theo ô tìm kiếm, chế độ lọc ngân hàng và chủ đề
    const filtered = this.posts.filter(post => {
      const matchesSearch = post.text.toLowerCase().includes(this.searchQuery);
      const matchesFilter = this.filterMode === "all" || (this.filterMode === "has_bank" && post.banks.length > 0);
      const matchesTopic = this.filterTopic === "all" || post.topic === this.filterTopic;
      return matchesSearch && matchesFilter && matchesTopic;
    });

    // Sắp xếp bài viết theo thời gian
    if (this.sortOrder === "newest") {
      filtered.sort((a, b) => b.timestamp - a.timestamp);
    } else if (this.sortOrder === "oldest") {
      filtered.sort((a, b) => a.timestamp - b.timestamp);
    }

    if (filtered.length === 0) {
      this.postsListContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
          <i data-lucide="info" style="width: 32px; height: 32px; margin-bottom: 0.5rem; color: var(--text-muted);"></i>
          <p style="font-size: 0.88rem;">Không tìm thấy bài viết nào phù hợp.</p>
        </div>
      `;
      if (this.paginationContainer) this.paginationContainer.innerHTML = "";
      lucide.createIcons();
      return;
    }

    // Tính toán phân trang
    const totalPages = Math.ceil(filtered.length / this.postsPerPage);
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);

    this.postsListContainer.innerHTML = paginated.map(post => {
      // Định dạng ngày đăng
      const postDate = new Date(post.time).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      // Tạo text highlight các từ khóa ngân hàng
      let textHtml = post.text
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

      // Thay thế các bank code thành các button/tag nhấp chuột được
      post.banks.forEach(bankCode => {
        const bankName = typeof BANK_NAMES !== "undefined" ? BANK_NAMES[bankCode] : bankCode;
        const reg = new RegExp(`\\b(${bankCode}|${bankName})\\b`, "gi");
        textHtml = textHtml.replace(reg, `<span class="bank-tag" data-bank="${bankCode}">$1</span>`);
      });

      // Các tag ngân hàng ở chân bài viết
      const tagsHtml = post.banks.map(bankCode => {
        const activeClass = this.selectedBank === bankCode ? "active-tag" : "";
        return `<button class="post-card-tag ${activeClass}" data-bank="${bankCode}">${bankCode}</button>`;
      }).join(" ");

      return `
        <div class="card post-card" style="padding: 1.25rem; margin-bottom: 1rem; border-left: 4px solid ${post.banks.length > 0 ? 'var(--primary)' : 'var(--border-color)'};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.8rem;">
              <i data-lucide="clock" style="width: 13px; height: 13px;"></i>
              <span>${postDate}</span>
            </div>
            <a href="${post.url}" target="_blank" style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.8rem; color: var(--primary); text-decoration: none; font-weight: 500;">
              <i data-lucide="facebook" style="width: 14px; height: 14px;"></i>
              <span>Xem bài gốc</span>
            </a>
          </div>
          
          <div class="post-text-content" style="font-size: 0.88rem; line-height: 1.6; color: var(--text-main); margin-bottom: 1rem; word-break: break-word;">
            ${textHtml}
          </div>

          ${post.banks.length > 0 ? `
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; border-top: 1px solid var(--border-color); padding-top: 0.75rem; margin-top: 0.5rem;">
              <span style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Liên quan:</span>
              <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                ${tagsHtml}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join("");

    // Đăng ký sự kiện click vào các tag ngân hàng trong post
    this.postsListContainer.querySelectorAll(".bank-tag, .post-card-tag").forEach(tag => {
      tag.addEventListener("click", (e) => {
        e.preventDefault();
        const bankCode = tag.getAttribute("data-bank");
        this.selectBank(bankCode);
      });
    });

    // Render thanh phân trang
    this.renderPagination(filtered.length, totalPages);

    lucide.createIcons();
  }

  // Sinh thanh phân trang (Pagination Bar)
  renderPagination(totalCount, totalPages) {
    if (!this.paginationContainer) return;

    if (totalPages <= 1) {
      this.paginationContainer.innerHTML = "";
      return;
    }

    const pages = [];
    const delta = 2; // Số trang hiển thị xung quanh trang hiện tại

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= this.currentPage - delta && i <= this.currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    let html = `
      <div style="font-size: 0.8rem; color: var(--text-muted); width: 100%; text-align: center; margin-bottom: 0.5rem;">
        Hiển thị ${(this.currentPage - 1) * this.postsPerPage + 1} - ${Math.min(this.currentPage * this.postsPerPage, totalCount)} trên tổng số ${totalCount} bài viết
      </div>
      <div style="display: flex; align-items: center; gap: 0.25rem;">
    `;

    // Nút Trang trước (Prev)
    html += `
      <button class="year-btn prev-page-btn" ${this.currentPage === 1 ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ''} style="padding: 0.4rem 0.6rem;">
        <i data-lucide="chevron-left" style="width: 14px; height: 14px;"></i>
      </button>
    `;

    // Các nút trang số
    pages.forEach(p => {
      if (p === "...") {
        html += `<span style="color: var(--text-muted); padding: 0.25rem 0.5rem; font-size: 0.85rem;">...</span>`;
      } else {
        const isActive = this.currentPage === p;
        html += `
          <button class="year-btn page-num-btn ${isActive ? 'active' : ''}" data-page="${p}" style="padding: 0.4rem 0.75rem; font-size: 0.8rem; min-width: 32px; justify-content: center;">
            ${p}
          </button>
        `;
      }
    });

    // Nút Trang sau (Next)
    html += `
      <button class="year-btn next-page-btn" ${this.currentPage === totalPages ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ''} style="padding: 0.4rem 0.6rem;">
        <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
      </button>
    </div>
    `;

    this.paginationContainer.innerHTML = html;

    // Gắn sự kiện chuyển trang
    this.paginationContainer.querySelectorAll(".page-num-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.currentPage = parseInt(btn.getAttribute("data-page"));
        this.render();
        // Cuộn nhẹ lên đầu danh sách bài viết để dễ đọc
        const mainHeader = document.querySelector("#hedge-posts-section .section-header");
        if (mainHeader) {
          mainHeader.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    const prevBtn = this.paginationContainer.querySelector(".prev-page-btn");
    if (prevBtn && this.currentPage > 1) {
      prevBtn.addEventListener("click", () => {
        this.currentPage--;
        this.render();
      });
    }

    const nextBtn = this.paginationContainer.querySelector(".next-page-btn");
    if (nextBtn && this.currentPage < totalPages) {
      nextBtn.addEventListener("click", () => {
        this.currentPage++;
        this.render();
      });
    }
  }

  // Render thông tin chi tiết số liệu ngân hàng được chọn bên phải
  renderDetails() {
    if (!this.detailsContainer) return;

    if (!this.selectedBank) {
      this.detailsContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 4rem 1.5rem;">
          <i data-lucide="arrow-left-right" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5; color: var(--text-muted);"></i>
          <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-main);">Chưa chọn Ngân hàng</h4>
          <p style="font-size: 0.82rem; line-height: 1.5;">Nhấp chọn bất kỳ thẻ ngân hàng nào được tô sáng trong danh sách bài viết bên trái để tra cứu số liệu an toàn vốn chi tiết.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    const bankCode = this.selectedBank;
    const bankName = typeof BANK_NAMES !== "undefined" ? BANK_NAMES[bankCode] : bankCode;
    const bankColor = typeof BANK_COLORS !== "undefined" ? BANK_COLORS[bankCode] : "var(--primary)";
    const bankDb = typeof BANK_CAR_DATABASE !== "undefined" ? BANK_CAR_DATABASE[bankCode] : null;

    if (!bankDb) {
      this.detailsContainer.innerHTML = `
        <div class="card" style="padding: 1.5rem; text-align: center;">
          <h3 style="color: ${bankColor}; margin-bottom: 0.5rem;">${bankCode} - ${bankName}</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Không tìm thấy dữ liệu số liệu CAR chi tiết cho ngân hàng này.</p>
        </div>
      `;
      return;
    }

    // Render bảng số liệu các năm
    const years = Object.keys(bankDb).sort((a, b) => b - a); // Sắp xếp năm giảm dần
    const tableRows = years.map(yr => {
      const data = bankDb[yr];
      return `
        <tr>
          <td style="font-weight: 600; text-align: center;">${yr}</td>
          <td style="font-weight: 700; color: ${data.car >= 8 ? 'var(--success)' : 'var(--danger)'}; text-align: right;">${data.car.toFixed(2)}%</td>
          <td style="text-align: right;">${data.capital.toLocaleString()}</td>
          <td style="text-align: right;">${data.rwa.toLocaleString()}</td>
        </tr>
      `;
    }).join("");

    const latestYear = years[0];
    const latestData = bankDb[latestYear];

    this.detailsContainer.innerHTML = `
      <div class="card" style="padding: 1.5rem; border-top: 4px solid ${bankColor};">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <h3 style="margin: 0; color: var(--text-main); font-size: 1.2rem;">${bankCode} - ${bankName}</h3>
          <span style="font-size: 0.75rem; background: ${bankColor}33; color: ${bankColor}; padding: 0.2rem 0.6rem; border-radius: 12px; font-weight: 600;">Active</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem;">
          <div style="background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: 6px; border: 1px solid var(--border-color);">
            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">CAR Mới Nhất (${latestYear})</div>
            <div style="font-size: 1.35rem; font-weight: 800; color: var(--success); margin-top: 0.25rem;">${latestData.car.toFixed(2)}%</div>
          </div>
          <div style="background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: 6px; border: 1px solid var(--border-color);">
            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Vốn Tự Có (${latestYear})</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-top: 0.25rem;">${latestData.capital.toLocaleString()} <span style="font-size: 0.75rem; font-weight: 500;">Tỷ</span></div>
          </div>
        </div>

        <h4 style="margin-bottom: 0.75rem; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
          <i data-lucide="table" style="width: 14px; height: 14px;"></i>
          Bảng số liệu lịch sử CAR & Vốn
        </h4>
        <div style="overflow-x: auto; margin-bottom: 1.5rem; border: 1px solid var(--border-color); border-radius: 6px;">
          <table class="financial-table" style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">
            <thead>
              <tr style="background: rgba(255,255,255,0.03);">
                <th style="padding: 0.6rem; border-bottom: 1px solid var(--border-color); text-align: center;">Năm</th>
                <th style="padding: 0.6rem; border-bottom: 1px solid var(--border-color); text-align: right;">CAR</th>
                <th style="padding: 0.6rem; border-bottom: 1px solid var(--border-color); text-align: right;">Vốn tự có (Tỷ)</th>
                <th style="padding: 0.6rem; border-bottom: 1px solid var(--border-color); text-align: right;">RWA (Tỷ)</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.65rem;">
          <button id="btn-goto-analysis" class="btn btn-primary" style="width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 0.6rem;">
            <i data-lucide="trending-up" style="width: 15px; height: 15px;"></i>
            <span>Xem Phân tích Biểu đồ CAR</span>
          </button>
          
          <button id="btn-goto-pdf" class="btn btn-outline" style="width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 0.6rem;">
            <i data-lucide="file-text" style="width: 15px; height: 15px;"></i>
            <span>Xem Báo cáo CAR Gốc (${latestYear})</span>
          </button>
        </div>
      </div>
    `;

    // Click chuyển sang tab phân tích biểu đồ CAR
    const analysisBtn = document.getElementById("btn-goto-analysis");
    if (analysisBtn) {
      analysisBtn.addEventListener("click", () => {
        this.viewBankAnalysis(bankCode);
      });
    }

    // Click xem báo cáo gốc PDF
    const pdfBtn = document.getElementById("btn-goto-pdf");
    if (pdfBtn) {
      pdfBtn.addEventListener("click", () => {
        this.viewOriginalPdf(bankCode, latestYear);
      });
    }

    lucide.createIcons();
  }
}

// Tự động khởi tạo khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  window.hedgeInsights = new HedgeInsights();
});
