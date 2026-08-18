// Phân hệ quản lý logic màn hình Tuyển dụng (Job Board App Controller)
// Dữ liệu tuyển dụng (window.MOCK_JOBS_DATA) được lưu trữ riêng tại file js/jobs_data.js

class BaselJobs {
  constructor() {
    this.jobs = window.MOCK_JOBS_DATA || [];
    this.filteredJobs = [...this.jobs];
    
    this.searchQuery = "";
    this.selectedDept = "all";
    this.selectedExp = "all";
    this.selectedBank = "all";

    // Trạng thái sắp xếp (Sorting state)
    this.sortColumn = "title";
    this.sortDirection = "asc";

    this.initElements();
    this.bindEvents();
    this.renderStats();
    this.renderBankFilters();
    this.sortJobs(); // Sắp xếp ban đầu
    this.renderJobsList();
  }

  initElements() {
    this.searchInput = document.getElementById("job-search-input");
    this.deptSelect = document.getElementById("job-dept-select");
    this.expSelect = document.getElementById("job-exp-select");
    this.bankFiltersContainer = document.getElementById("job-bank-filters");
    this.tableBody = document.getElementById("jobs-table-body");

    // Thống kê thẻ
    this.statTotal = document.getElementById("job-stat-total");
    this.statRisk = document.getElementById("job-stat-risk");
    this.statIt = document.getElementById("job-stat-it");
    this.statBiz = document.getElementById("job-stat-biz");

    // Modal Chi tiết
    this.modal = document.getElementById("job-detail-modal");
    this.modalCloseBtn = document.getElementById("job-modal-close-btn");
    this.modalBankLogo = document.getElementById("modal-bank-logo");
    this.modalJobTitle = document.getElementById("modal-job-title");
    this.modalBankName = document.getElementById("modal-bank-name");
    this.modalLocation = document.getElementById("modal-job-location");
    this.modalSalary = document.getElementById("modal-job-salary");
    this.modalDept = document.getElementById("modal-job-department");
    this.modalDeadline = document.getElementById("modal-job-deadline");
    this.modalDesc = document.getElementById("modal-job-desc");
    this.modalReqs = document.getElementById("modal-job-reqs");
    this.modalBenefits = document.getElementById("modal-job-benefits");
    this.modalApplyBtn = document.getElementById("job-modal-apply-btn");
    this.modalOriginalLink = document.getElementById("job-modal-original-link");
  }

  bindEvents() {
    // Nhập từ khóa tìm kiếm
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.filterJobs();
      });
    }

    // Thay đổi bộ phận (Khối phòng ban)
    if (this.deptSelect) {
      this.deptSelect.addEventListener("change", (e) => {
        this.selectedDept = e.target.value;
        this.filterJobs();
      });
    }

    // Thay đổi cấp bậc
    if (this.expSelect) {
      this.expSelect.addEventListener("change", (e) => {
        this.selectedExp = e.target.value;
        this.filterJobs();
      });
    }

    // Thiết lập sự kiện click sắp xếp cho các cột header
    const headers = [
      { id: "sort-title", col: "title" },
      { id: "sort-bank", col: "bank" },
      { id: "sort-dept", col: "departmentName" },
      { id: "sort-level", col: "levelName" },
      { id: "sort-deadline", col: "deadline" }
    ];

    headers.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) {
        el.addEventListener("click", () => {
          if (this.sortColumn === h.col) {
            this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
          } else {
            this.sortColumn = h.col;
            this.sortDirection = "asc";
          }
          this.sortJobs();
          this.renderJobsList();
        });
      }
    });

    // Đóng modal chi tiết
    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener("click", () => this.closeModal());
    }

    // Đóng khi click ngoài hộp modal
    window.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Bấm nút ứng tuyển ngay
    if (this.modalApplyBtn) {
      this.modalApplyBtn.addEventListener("click", () => {
        const email = this.modalApplyBtn.getAttribute("data-email");
        const title = this.modalJobTitle.innerText;
        const bank = this.modalBankName.innerText;
        
        alert(`Cảm ơn bạn đã quan tâm đến vị trí "${title}" tại ${bank}.\n\nVui lòng gửi hồ sơ CV ứng tuyển của bạn về phòng Tuyển dụng qua email:\n📩 ${email}\n\nTiêu đề thư đề xuất: [Ứng tuyển] ${title} - [Họ tên của bạn]`);
      });
    }

    // Cơ chế Event Delegation lắng nghe sự kiện click mở chi tiết công việc
    if (this.tableBody) {
      this.tableBody.addEventListener("click", (e) => {
        const trigger = e.target.closest(".open-job-detail, .open-job-detail-link");
        if (trigger) {
          const jobId = trigger.getAttribute("data-id");
          this.openModal(jobId);
        }
      });
    }
  }

  renderStats() {
    if (!this.statTotal) return;

    const total = this.jobs.length;
    const risk = this.jobs.filter(j => j.department === "risk-legal").length;
    const it = this.jobs.filter(j => j.department === "it-data").length;
    const biz = this.jobs.filter(j => j.department === "business").length;

    this.statTotal.innerText = total;
    this.statRisk.innerText = risk;
    this.statIt.innerText = it;
    this.statBiz.innerText = biz;
  }

  renderBankFilters() {
    if (!this.bankFiltersContainer) return;

    const uniqueBanks = [...new Set(this.jobs.map(j => j.bank))];
    const banks = ["all", ...uniqueBanks];

    this.bankFiltersContainer.innerHTML = banks.map(bank => {
      const isActive = bank === this.selectedBank;
      const displayName = bank === "all" ? "Tất cả" : bank;
      return `
        <button class="bank-tag ${isActive ? 'active-tag' : ''}" data-bank="${bank}">
          ${displayName}
        </button>
      `;
    }).join("");

    // Click chọn tag lọc
    const buttons = this.bankFiltersContainer.querySelectorAll(".bank-tag");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active-tag"));
        btn.classList.add("active-tag");
        this.selectedBank = btn.getAttribute("data-bank");
        this.filterJobs();
      });
    });
  }

  filterJobs() {
    this.filteredJobs = this.jobs.filter(job => {
      const matchBank = this.selectedBank === "all" || job.bank === this.selectedBank;
      const matchDept = this.selectedDept === "all" || job.department === this.selectedDept;
      const matchExp = this.selectedExp === "all" || job.level === this.selectedExp;

      const matchSearch = 
        job.title.toLowerCase().includes(this.searchQuery) ||
        job.bank.toLowerCase().includes(this.searchQuery) ||
        job.bankCode.toLowerCase().includes(this.searchQuery) ||
        job.location.toLowerCase().includes(this.searchQuery) ||
        job.departmentName.toLowerCase().includes(this.searchQuery);

      return matchBank && matchDept && matchExp && matchSearch;
    });

    this.sortJobs(); // Sắp xếp lại sau khi lọc
    this.renderJobsList();
  }

  sortJobs() {
    const col = this.sortColumn;
    const dir = this.sortDirection === "asc" ? 1 : -1;

    this.filteredJobs.sort((a, b) => {
      let valA = a[col] || "";
      let valB = b[col] || "";

      if (typeof valA === "string") {
        return valA.localeCompare(valB, "vi") * dir;
      }
      return (valA < valB ? -1 : valA > valB ? 1 : 0) * dir;
    });

    // Cập nhật icon sort trong HTML header
    const headers = ["title", "bank", "departmentName", "levelName", "deadline"];
    const idMap = {
      title: "icon-title",
      bank: "icon-bank",
      departmentName: "icon-dept",
      levelName: "icon-level",
      deadline: "icon-deadline"
    };

    headers.forEach(h => {
      const iconEl = document.getElementById(idMap[h]);
      if (iconEl) {
        if (h === this.sortColumn) {
          iconEl.setAttribute("data-lucide", this.sortDirection === "asc" ? "arrow-up" : "arrow-down");
        } else {
          iconEl.setAttribute("data-lucide", "arrow-up-down");
        }
      }
    });

    lucide.createIcons();
  }

  renderJobsList() {
    if (!this.tableBody) return;

    if (this.filteredJobs.length === 0) {
      this.tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 3rem; color: var(--text-muted);">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem;">
              <i data-lucide="search-slash" style="width: 44px; height: 44px; opacity: 0.5;"></i>
              <p style="font-size: 0.95rem; font-weight: 600; margin: 0;">Không tìm thấy vị trí tuyển dụng phù hợp.</p>
              <span style="font-size: 0.8rem;">Vui lòng điều chỉnh từ khóa hoặc bộ lọc.</span>
            </div>
          </td>
        </tr>
      `;
      lucide.createIcons();
      return;
    }

    this.tableBody.innerHTML = this.filteredJobs.map((job) => {
      const tagsHtml = job.tags.map(t => {
        let tagClass = "job-tag-default";
        if (t.includes("gấp")) tagClass = "job-tag-urgent";
        else if (t.includes("Remote")) tagClass = "job-tag-remote";
        else if (t.includes("Lương")) tagClass = "job-tag-high-salary";
        return `<span class="job-tag ${tagClass}" style="font-size: 0.7rem; padding: 0.1rem 0.35rem; border-radius: 4px; display: inline-block; margin-right: 0.25rem; font-weight: 500;">${t}</span>`;
      }).join("");

      return `
        <tr style="border-bottom: 1px solid var(--border-color);">
          <td style="padding: 0.85rem 1.25rem;">
            <div style="font-weight: 600; color: var(--text-main); font-size: 0.9rem; margin-bottom: 0.3rem; cursor: pointer; transition: color 0.2s;" class="open-job-detail-link" data-id="${job.id}">
              ${job.title}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.25rem; align-items: center;">
              ${tagsHtml}
            </div>
          </td>
          <td style="padding: 0.85rem 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <div class="job-bank-logo" style="background: ${job.logoColor}; width: 26px; height: 26px; font-size: 0.65rem; font-weight: 700; border-radius: 5px; display: flex; align-items: center; justify-content: center; color: white;">
                ${job.bankCode}
              </div>
              <span style="font-weight: 600; font-size: 0.82rem;">${job.bank}</span>
            </div>
          </td>
          <td style="padding: 0.85rem 1.25rem; color: var(--text-muted); font-size: 0.82rem;">
            ${job.departmentName}
          </td>
          <td style="padding: 0.85rem 1.25rem; font-size: 0.82rem;">
            <span class="badge" style="background: rgba(255,255,255,0.03); color: var(--text-main); border: 1px solid var(--border-color); padding: 0.2rem 0.45rem; border-radius: 4px; font-weight: 500;">
              ${job.levelName}
            </span>
          </td>
          <td style="padding: 0.85rem 1.25rem; font-size: 0.82rem; color: var(--text-muted); font-weight: 500;">
            ${this.formatDate(job.deadline)}
          </td>
          <td style="padding: 0.85rem 1.25rem; text-align: right;">
            <button class="job-action-btn open-job-detail" data-id="${job.id}" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; display: inline-flex;">
              <span>Chi tiết</span> <i data-lucide="arrow-right" style="width: 12px; height: 12px;"></i>
            </button>
          </td>
        </tr>
      `;
    }).join("");

    lucide.createIcons();
  }

  openModal(jobId) {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) return;

    // Tính toán vị trí hiển thị popup giữa màn hình
    const width = 1200;
    const height = 850;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    window.open(
      job.originalUrl,
      `job_detail_${job.id.replace(/-/g, '_')}`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  formatDate(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }
}

// Khởi chạy khi DOM đã sẵn sàng (Đảm bảo an toàn readyState)
function initBaselJobs() {
  if (document.getElementById("jobs-section") && !window.baselJobs) {
    window.baselJobs = new BaselJobs();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBaselJobs);
} else {
  initBaselJobs();
}
