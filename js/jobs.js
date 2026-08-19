// Phân hệ quản lý logic màn hình Tuyển dụng (Job Board App Controller)
// Dữ liệu được tải trực tiếp từ cổng tuyển dụng VPBank & MB Bank sau khi người dùng nhấn Tìm kiếm.

function matchKeyword(str, kw) {
  if (!str) return false;
  if (kw === "it") {
    return str.split(/[^a-z0-9]/).includes("it");
  }
  return str.includes(kw);
}

class BaselJobs {
  constructor() {
    this.jobs = [];
    this.filteredJobs = [];
    
    this.searchQuery = "";
    this.selectedDept = "all";
    this.selectedExp = "all";
    this.selectedBank = "all";

    this.sortColumn = "title";
    this.sortDirection = "asc";

    this.currentPage = 1;
    this.pageSize = 25;
    this.isLoading = false;

    // Bộ lọc theo cột (live)
    this.colFilter = { title: "", bank: [], dept: [], level: [], deadline: "" };

    // Khởi tạo danh sách trống và tải từ server/localStorage
    this.savedJobs = [];
    this.loadSavedJobsFromServer();

    this.searchSessionId = 0;

    this.initElements();
    this.bindEvents();
    // Không tự động load — chờ người dùng nhấn Tìm kiếm
  }

  resolveApiUrl(relativeUrl, originalUrl) {
    const hn = window.location.hostname;
    const isLocal = hn === "localhost" || 
                    hn === "127.0.0.1" || 
                    /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hn) || 
                    hn.endsWith(".local");

    if (isLocal && window.location.protocol.startsWith("http")) {
      return relativeUrl;
    }
    
    // If the origin is HTTPS (such as willphamdrive.github.io), we MUST use an HTTPS CORS proxy.
    // Otherwise, browser Mixed Content policy will block calls to http://localhost:8000.
    if (window.location.protocol === "https:" && originalUrl) {
      return "https://corsproxy.io/?" + encodeURIComponent(originalUrl);
    }
    
    const proxyHost = (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hn)) ? `http://${window.location.host}` : "http://localhost:8000";
    return proxyHost + relativeUrl;
  }

  initElements() {
    this.searchInput    = document.getElementById("job-search-input");
    this.deptSelect     = document.getElementById("job-dept-select");
    this.expSelect      = document.getElementById("job-exp-select");
    this.bankFilterBtns = document.querySelectorAll(".bank-filter-btn");
    this.searchBtn      = document.getElementById("job-search-btn");
    
    this.tableBody          = document.getElementById("jobs-table-body");
    this.paginationInfo     = document.getElementById("pagination-info");
    this.paginationControls = document.getElementById("job-pagination-controls");
    this.limitSelect        = document.getElementById("job-limit-select");

    this.statTotal = document.getElementById("job-stat-total");
    this.statRisk  = document.getElementById("job-stat-risk");
    this.statIt    = document.getElementById("job-stat-it");
    this.statBiz   = document.getElementById("job-stat-biz");

    this.modal           = document.getElementById("job-detail-modal");
    this.modalCloseBtn   = document.getElementById("job-modal-close-btn");
    this.modalJobTitle   = document.getElementById("modal-job-title");
    this.modalBankName   = document.getElementById("modal-bank-name");
    this.modalApplyBtn   = document.getElementById("job-modal-apply-btn");

    // Column filter inputs / custom multiselect elements
    this.cfTitle    = document.getElementById("col-filter-title");
    this.cfBank     = document.getElementById("multiselect-bank");
    this.cfDept     = document.getElementById("multiselect-dept");
    this.cfLevel    = document.getElementById("multiselect-level");
    this.cfDeadline = document.getElementById("col-filter-deadline");
    this.cfClear    = document.getElementById("col-filter-clear");
  }

  bindEvents() {
    // Nút Tìm kiếm — điểm khởi động duy nhất để tải dữ liệu
    if (this.searchBtn) {
      this.searchBtn.addEventListener("click", () => {
        this.searchQuery  = this.searchInput ? this.searchInput.value.toLowerCase().trim() : "";
        this.selectedDept = this.deptSelect  ? this.deptSelect.value  : "all";
        this.selectedExp  = this.expSelect   ? this.expSelect.value   : "all";
        this.currentPage  = 1;
        // Nếu đang chọn "saved", tự động reset về "all" khi tìm kiếm live mới
        if (this.selectedBank === "saved") {
          this.selectedBank = "all";
          const allBtn = document.getElementById("bank-filter-all");
          if (allBtn) allBtn.click();
          return;
        }
        this.searchSessionId++;
        this.jobs = [];
        this.filteredJobs = [];
        this.loadJobs(this.searchSessionId);
      });
    }

    // Bank tag buttons — click chọn ngân hàng + highlight
    this.bankFilterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        // Bỏ active tất cả
        this.bankFilterBtns.forEach(b => {
          const bk = b.getAttribute("data-bank");
          b.style.background = "transparent";
          if (bk === "all")       { b.style.borderColor = "var(--primary)"; b.style.color = "var(--primary)"; }
          else if (bk === "VPBank") { b.style.borderColor = "#10b981"; b.style.color = "#10b981"; }
          else if (bk === "MB Bank") { b.style.borderColor = "#60a5fa"; b.style.color = "#60a5fa"; }
          else if (bk === "ACB")     { b.style.borderColor = "#fb923c"; b.style.color = "#fb923c"; }
          else if (bk === "LPBank")  { b.style.borderColor = "#dc2626"; b.style.color = "#dc2626"; }
          else if (bk === "saved")  { b.style.borderColor = "#f59e0b"; b.style.color = "#f59e0b"; }
        });
        // Active nút được chọn
        const bank = btn.getAttribute("data-bank");
        this.selectedBank = bank;
        if (bank === "all")       { btn.style.background = "var(--primary)"; btn.style.borderColor = "var(--primary)"; btn.style.color = "white"; }
        else if (bank === "VPBank") { btn.style.background = "#10b981"; btn.style.color = "white"; }
        else if (bank === "MB Bank") { btn.style.background = "#60a5fa"; btn.style.color = "white"; }
        else if (bank === "ACB")     { btn.style.background = "#fb923c"; btn.style.borderColor = "#fb923c"; btn.style.color = "white"; }
        else if (bank === "LPBank")  { btn.style.background = "#dc2626"; btn.style.borderColor = "#dc2626"; btn.style.color = "white"; }
        else if (bank === "saved")  { btn.style.background = "#f59e0b"; btn.style.borderColor = "#f59e0b"; btn.style.color = "white"; }
        
        // Lọc ngay lập tức
        this.currentPage = 1;
        this.applyClientFilters();
      });
    });

    // Enter trên ô tìm kiếm cũng kích hoạt
    if (this.searchInput) {
      this.searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.searchBtn && this.searchBtn.click();
      });
    }

    // Thay đổi số dòng/trang
    if (this.limitSelect) {
      this.limitSelect.addEventListener("change", (e) => {
        this.pageSize = parseInt(e.target.value, 10);
        this.currentPage = 1;
        this.renderJobsList();
      });
    }

    // Sắp xếp cột
    const headers = [
      { id: "sort-title",    col: "title" },
      { id: "sort-bank",     col: "bank" },
      { id: "sort-dept",     col: "departmentName" },
      { id: "sort-level",    col: "levelName" },
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

    // Đóng modal
    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener("click", () => this.closeModal());
    }
    window.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    // Event delegation cho nút Chi tiết và Lưu công việc
    if (this.tableBody) {
      this.tableBody.addEventListener("click", (e) => {
        const trigger = e.target.closest(".open-job-detail, .open-job-detail-link");
        if (trigger) {
          this.openModal(trigger.getAttribute("data-id"));
          return;
        }

        const saveBtn = e.target.closest(".save-job-btn");
        if (saveBtn) {
          const jobId = saveBtn.getAttribute("data-id");
          this.toggleSaveJob(jobId);
        }
      });
    }

    // Toggle custom multiselect dropdowns
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest(".multiselect-trigger");
      if (trigger) {
        const parent = trigger.parentElement;
        const dropdown = parent.querySelector(".multiselect-dropdown");
        const isOpen = dropdown.style.display === "block";
        // Đóng các dropdown khác
        document.querySelectorAll(".multiselect-dropdown").forEach(d => d.style.display = "none");
        // Bật/tắt dropdown hiện tại
        dropdown.style.display = isOpen ? "none" : "block";
        e.stopPropagation();
        return;
      }
      
      // Đóng dropdown khi click ra ngoài
      if (!e.target.closest(".custom-multiselect")) {
        document.querySelectorAll(".multiselect-dropdown").forEach(d => d.style.display = "none");
      }
    });

    // Lắng nghe sự kiện thay đổi trên các ô input thường
    if (this.cfTitle) {
      this.cfTitle.addEventListener("input", () => {
        this.colFilter.title = this.cfTitle.value.trim().toLowerCase();
        this.currentPage = 1;
        this.applyClientFilters();
      });
    }
    if (this.cfDeadline) {
      this.cfDeadline.addEventListener("change", () => {
        this.colFilter.deadline = this.cfDeadline.value.trim().toLowerCase();
        this.currentPage = 1;
        this.applyClientFilters();
      });
    }

    // Lắng nghe sự kiện thay đổi của các custom multiselect (sử dụng Event Delegation)
    const multiselects = [
      { el: this.cfBank,  key: "bank" },
      { el: this.cfDept,  key: "dept" },
      { el: this.cfLevel, key: "level" }
    ];
    multiselects.forEach(({ el, key }) => {
      if (!el) return;
      el.addEventListener("change", (e) => {
        if (e.target.type === "checkbox") {
          const checkedCheckboxes = el.querySelectorAll(".multiselect-dropdown input[type='checkbox']:checked");
          this.colFilter[key] = Array.from(checkedCheckboxes).map(cb => cb.value.toLowerCase());
          this.currentPage = 1;
          this.applyClientFilters();
        }
      });
    });

    // Nút Xóa lọc cột
    if (this.cfClear) {
      this.cfClear.addEventListener("click", () => {
        this.colFilter = { title: "", bank: [], dept: [], level: [], deadline: "" };
        if (this.cfTitle)    this.cfTitle.value    = "";
        if (this.cfDeadline) this.cfDeadline.value = "";
        
        // Reset checkbox của các multiselect
        multiselects.forEach(({ el }) => {
          if (el) {
            el.querySelectorAll("input[type='checkbox']").forEach(cb => cb.checked = false);
          }
        });
        
        this.currentPage = 1;
        this.applyClientFilters();
      });
    }
  }

  // ── Tải dữ liệu ──────────────────────────────────────────────────
  async loadJobs(sessionId) {
    if (!this.tableBody || this.isLoading) return;
    this.isLoading = true;

    // Dọn dẹp badge offline cũ nếu có
    const oldBadge = document.getElementById("offline-jobs-badge");
    if (oldBadge) oldBadge.remove();

    // Hiển thị skeleton loading
    this.tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:4rem 1.5rem;color:var(--text-muted);">
          <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
            <i data-lucide="loader-2" class="animate-spin" style="width:32px;height:32px;color:var(--primary);"></i>
            <div style="font-weight:600;font-size:0.95rem;color:var(--text-main);">Đang kết nối cổng tuyển dụng...</div>
            <span style="font-size:0.8rem;opacity:0.8;">Đang tải dữ liệu mới nhất từ VPBank, MB Bank, ACB & LPBank...</span>
          </div>
        </td>
      </tr>`;
    lucide.createIcons();

    try {
      // Xác định các nguồn cần tải theo lựa chọn của người dùng
      const needVPB = (this.selectedBank === "all" || this.selectedBank === "VPBank");
      const needMBB = (this.selectedBank === "all" || this.selectedBank === "MB Bank");
      const needACB = (this.selectedBank === "all" || this.selectedBank === "ACB");
      const needLPB = (this.selectedBank === "all" || this.selectedBank === "LPBank");

      let vpbRaw = [], mbbRaw = [], acbHcmRaw = [], acbHoRaw = [], lpbRaw = [];
      let totalMbbPages = 1, totalAcbHcmPages = 1, totalAcbHoPages = 1, totalLpbPages = 1;

      const fetches = [];
      if (needVPB) fetches.push(this.fetchLivePageFromVPB(0).then(r => ({ src: "VPB", data: r })).catch(() => ({ src: "VPB", data: [] })));
      if (needMBB) fetches.push(this.fetchLiveMBBPage(1).then(r => ({ src: "MBB", data: r })).catch(() => ({ src: "MBB", data: null })));
      if (needACB) {
        fetches.push(this.fetchLiveACBPage(1, 3133).then(r => ({ src: "ACB_HCM", data: r })).catch(() => ({ src: "ACB_HCM", data: null })));
        fetches.push(this.fetchLiveACBPage(1, 86).then(r => ({ src: "ACB_HO", data: r })).catch(() => ({ src: "ACB_HO", data: null })));
      }
      if (needLPB) fetches.push(this.fetchLiveLPBPage(1).then(r => ({ src: "LPB", data: r })).catch(() => ({ src: "LPB", data: null })));

      const results = await Promise.all(fetches);
      
      // Nếu session đã thay đổi (nhấn Tìm kiếm tiếp), bỏ qua kết quả cũ
      if (sessionId !== this.searchSessionId) return;

      results.forEach(r => {
        if (r.src === "VPB") vpbRaw = r.data || [];
        if (r.src === "MBB" && r.data) {
          mbbRaw = r.data.content || [];
          totalMbbPages = r.data.totalPages || 1;
        }
        if (r.src === "ACB_HCM" && r.data) {
          acbHcmRaw = r.data.jobs || [];
          totalAcbHcmPages = r.data.totalPages || 1;
        }
        if (r.src === "ACB_HO" && r.data) {
          acbHoRaw = r.data.jobs || [];
          totalAcbHoPages = r.data.totalPages || 1;
        }
        if (r.src === "LPB" && r.data) {
          lpbRaw = r.data.items || [];
          totalLpbPages = r.data.totalPage || 1;
        }
      });

      const vpbJobs = this.processRawJobs(vpbRaw);
      const mbbJobs = this.processRawMBBJobs(mbbRaw);
      const acbHcmJobs = this.processRawACBJobs(acbHcmRaw);
      const acbHoJobs = this.processRawACBJobs(acbHoRaw);
      const lpbJobs = this.processRawLPBJobs(lpbRaw);

      this.jobs = [];
      this.addUniqueJobs(vpbJobs);
      this.addUniqueJobs(mbbJobs);
      this.addUniqueJobs(acbHcmJobs);
      this.addUniqueJobs(acbHoJobs);
      this.addUniqueJobs(lpbJobs);

      // Nếu không lấy được bất cứ công việc nào từ live (ví dụ: bị chặn CORS / Mixed Content trên GitHub Pages)
      if (this.jobs.length === 0) {
        throw new Error("Không có dữ liệu trả về từ live endpoints.");
      }

      this.applyClientFilters();
      this.renderStats();
      this.sortJobs();
      this.renderJobsList();

      // Lazy load các trang còn lại trong nền
      this.lazyLoadRemainingPages(needVPB, needMBB, needACB, needLPB, totalMbbPages, totalAcbHcmPages, totalAcbHoPages, totalLpbPages, sessionId);
    } catch (err) {
      console.warn("Lỗi tải trực tuyến, chuyển sang nạp cơ sở dữ liệu tuyển dụng offline fallback:", err);
      if (sessionId === this.searchSessionId) {
        try {
          const fallbackRes = await fetch("jobs_database.json");
          if (!fallbackRes.ok) throw new Error("Không thể tải file database offline.");
          const fallbackData = await fallbackRes.json();
          
          if (sessionId !== this.searchSessionId) return;

          const needVPB = (this.selectedBank === "all" || this.selectedBank === "VPBank");
          const needMBB = (this.selectedBank === "all" || this.selectedBank === "MB Bank");
          const needACB = (this.selectedBank === "all" || this.selectedBank === "ACB");
          const needLPB = (this.selectedBank === "all" || this.selectedBank === "LPBank");

          let vpbRaw = needVPB ? (fallbackData.vpb || []) : [];
          let mbbRaw = needMBB ? (fallbackData.mbb?.content || []) : [];
          let acbHcmRaw = needACB ? (this.parseAcbHtml(fallbackData.acb_hcm?.html || "").jobs || []) : [];
          let acbHoRaw = needACB ? (this.parseAcbHtml(fallbackData.acb_ho?.html || "").jobs || []) : [];
          let lpbRaw = needLPB ? (fallbackData.lpb?.items || []) : [];

          const vpbJobs = this.processRawJobs(vpbRaw);
          const mbbJobs = this.processRawMBBJobs(mbbRaw);
          const acbHcmJobs = this.processRawACBJobs(acbHcmRaw);
          const acbHoJobs = this.processRawACBJobs(acbHoRaw);
          const lpbJobs = this.processRawLPBJobs(lpbRaw);

          this.jobs = [];
          this.addUniqueJobs(vpbJobs);
          this.addUniqueJobs(mbbJobs);
          this.addUniqueJobs(acbHcmJobs);
          this.addUniqueJobs(acbHoJobs);
          this.addUniqueJobs(lpbJobs);

          this.applyClientFilters();
          this.renderStats();
          this.sortJobs();
          this.renderJobsList();
          
          this.showOfflineNotification();
        } catch (fallbackErr) {
          console.error("Lỗi nạp database offline:", fallbackErr);
          this.showCoresError();
        }
      }
    } finally {
      if (sessionId === this.searchSessionId) {
        this.isLoading = false;
      }
    }
  }

  addUniqueJobs(jobList) {
    if (!jobList || !jobList.length) return;
    jobList.forEach(job => {
      // Chỉ push nếu id của job chưa tồn tại trong this.jobs
      if (!this.jobs.some(j => j.id === job.id)) {
        this.jobs.push(job);
      }
    });
  }

  showOfflineNotification() {
    const header = document.querySelector("#jobs-section .section-header");
    if (header && !document.getElementById("offline-jobs-badge")) {
      const badge = document.createElement("div");
      badge.id = "offline-jobs-badge";
      badge.style.display = "inline-flex";
      badge.style.alignItems = "center";
      badge.style.gap = "0.35rem";
      badge.style.background = "rgba(245, 158, 11, 0.12)";
      badge.style.color = "var(--warning)";
      badge.style.border = "1px solid rgba(245, 158, 11, 0.25)";
      badge.style.padding = "0.35rem 0.75rem";
      badge.style.borderRadius = "20px";
      badge.style.fontSize = "0.78rem";
      badge.style.fontWeight = "600";
      badge.style.marginTop = "0.75rem";
      badge.innerHTML = `
        <i data-lucide="wifi-off" style="width: 14px; height: 14px;"></i>
        Chế độ Lưu trữ: Đang hiển thị dữ liệu tuyển dụng offline (Mạng yếu hoặc bị chặn CORS/Mixed Content trên GitHub Pages)
      `;
      header.appendChild(badge);
      lucide.createIcons();
    }
  }
  async lazyLoadRemainingPages(needVPB, needMBB, needACB, needLPB, totalMbbPages, totalAcbHcmPages, totalAcbHoPages, totalLpbPages, sessionId) {
    const vpbPages = needVPB ? Array.from({ length: 16 }, (_, i) => ({ bank: "VPB", page: i + 1 })) : [];
    const mbbPages = needMBB ? Array.from({ length: totalMbbPages - 1 }, (_, i) => ({ bank: "MBB", page: i + 2 })) : [];
    const acbHcmPages = needACB ? Array.from({ length: totalAcbHcmPages - 1 }, (_, i) => ({ bank: "ACB_HCM", page: i + 2 })) : [];
    const acbHoPages = needACB ? Array.from({ length: totalAcbHoPages - 1 }, (_, i) => ({ bank: "ACB_HO", page: i + 2 })) : [];
    const lpbPages = needLPB ? Array.from({ length: totalLpbPages - 1 }, (_, i) => ({ bank: "LPB", page: i + 2 })) : [];

    const allPages = [];
    const maxLen = Math.max(vpbPages.length, mbbPages.length, acbHcmPages.length, acbHoPages.length, lpbPages.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < vpbPages.length) allPages.push(vpbPages[i]);
      if (i < mbbPages.length) allPages.push(mbbPages[i]);
      if (i < acbHcmPages.length) allPages.push(acbHcmPages[i]);
      if (i < acbHoPages.length) allPages.push(acbHoPages[i]);
      if (i < lpbPages.length) allPages.push(lpbPages[i]);
    }

    const batchSize = 4;
    for (let i = 0; i < allPages.length; i += batchSize) {
      // Dừng loader ngầm nếu session đã thay đổi (người dùng click Tìm kiếm lần khác)
      if (sessionId !== this.searchSessionId) return;

      const batch = allPages.slice(i, i + batchSize);
      const promises = batch.map(item => {
        if (item.bank === "VPB") {
          return this.fetchLivePageFromVPB(item.page)
            .then(raw => ({ bank: "VPB", raw }))
            .catch(() => ({ bank: "VPB", raw: [] }));
        } else if (item.bank === "MBB") {
          return this.fetchLiveMBBPage(item.page)
            .then(data => ({ bank: "MBB", raw: data.content || [] }))
            .catch(() => ({ bank: "MBB", raw: [] }));
        } else if (item.bank === "ACB_HCM") {
          return this.fetchLiveACBPage(item.page, 3133)
            .then(data => ({ bank: "ACB", raw: data.jobs || [] }))
            .catch(() => ({ bank: "ACB", raw: [] }));
        } else if (item.bank === "ACB_HO") {
          return this.fetchLiveACBPage(item.page, 86)
            .then(data => ({ bank: "ACB", raw: data.jobs || [] }))
            .catch(() => ({ bank: "ACB", raw: [] }));
        } else {
          return this.fetchLiveLPBPage(item.page)
            .then(data => ({ bank: "LPB", raw: data.items || [] }))
            .catch(() => ({ bank: "LPB", raw: [] }));
        }
      });

      try {
        const results = await Promise.all(promises);
        
        // Kiểm tra lại sau khi await bất đồng bộ hoàn thành
        if (sessionId !== this.searchSessionId) return;

        const newJobs = [];
        results.forEach(res => {
          if (res.raw && res.raw.length > 0) {
            if (res.bank === "VPB") newJobs.push(...this.processRawJobs(res.raw));
            else if (res.bank === "MBB") newJobs.push(...this.processRawMBBJobs(res.raw));
            else if (res.bank === "ACB") newJobs.push(...this.processRawACBJobs(res.raw));
            else newJobs.push(...this.processRawLPBJobs(res.raw));
          }
        });
        if (newJobs.length > 0) {
          this.addUniqueJobs(newJobs);
          this.applyClientFilters();
          this.renderStats();
        }
      } catch (err) {
        console.warn("Lỗi lazy load đợt trang:", err);
      }

      await new Promise(r => setTimeout(r, 250));
    }
    console.log(`Lazy load xong. Tổng: ${this.jobs.length} công việc.`);
  }
  // ── Gọi API ──────────────────────────────────────────────────────
  async fetchLivePageFromVPB(page) {
    let baseUrl = this.resolveApiUrl("/api/jobs", "https://tuyendung.vpbank.com.vn/services/recruiting/v1/jobs");
    // Fallback to live URL if proxy is not local and not running
    if (baseUrl.startsWith("http://localhost:8000")) {
      try {
        const t = await fetch("http://localhost:8000/api/jobs", { method: "OPTIONS" });
        if (!t.ok) baseUrl = "https://tuyendung.vpbank.com.vn/services/recruiting/v1/jobs";
      } catch (_) {
        baseUrl = "https://tuyendung.vpbank.com.vn/services/recruiting/v1/jobs";
      }
    }

    const payload = {
      locale: "vi_VN", keywords: "", location: "", pageNumber: page,
      facetFilters: { "sfstd_jobLocation_obj": ["Hồ Chí Minh"] }, sortBy: "recent"
    };
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`VPB HTTP ${res.status}`);
    const data = await res.json();
    return (data.jobSearchResult || []).map(item => item.response || {});
  }

  async fetchLiveMBBPage(page) {
    const qs = `workGroupId=&name=&skillTags=&city=TX701&size=15&page=${page}&type=TX105&region=&subRegion=&typicalSkills=&currentProvinceCode=&permanentProvinceCode=`;
    let baseUrl = this.resolveApiUrl(`/api/jobs/mbbank?${qs}`, `https://careers.mbbank.com.vn/libra-job-management/public/recruitment-news?${qs}`);
    // Fallback to live URL if proxy is not local and not running
    if (baseUrl.startsWith("http://localhost:8000")) {
      try {
        const t = await fetch("http://localhost:8000/api/jobs/mbbank", { method: "OPTIONS" });
        if (!t.ok) baseUrl = `https://careers.mbbank.com.vn/libra-job-management/public/recruitment-news?${qs}`;
      } catch (_) {
        baseUrl = `https://careers.mbbank.com.vn/libra-job-management/public/recruitment-news?${qs}`;
      }
    }
    const res = await fetch(baseUrl, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`MBB HTTP ${res.status}`);
    return await res.json();
  }

  async fetchLiveACBPage(page, officeId = 3133) {
    const qs = `office=${officeId}&return=1&page=${page}`;
    let baseUrl = this.resolveApiUrl(`/api/jobs/acb?${qs}`, `https://www.acbjobs.com.vn/jobs?${qs}`);
    // Fallback to live URL if proxy is not local and not running
    if (baseUrl.startsWith("http://localhost:8000")) {
      try {
        const t = await fetch("http://localhost:8000/api/jobs/acb", { method: "OPTIONS" });
        if (!t.ok) baseUrl = `https://www.acbjobs.com.vn/jobs?${qs}`;
      } catch (_) {
        baseUrl = `https://www.acbjobs.com.vn/jobs?${qs}`;
      }
    }
    const res = await fetch(baseUrl);
    if (!res.ok) throw new Error(`ACB HTTP ${res.status}`);
    const htmlText = await res.text();
    return this.parseAcbHtml(htmlText);
  }

  parseAcbHtml(htmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    
    // Extract jobs
    const jobs = [];
    const items = doc.querySelectorAll(".jobs .item");
    items.forEach(item => {
      const titleEl = item.querySelector(".title a");
      if (!titleEl) return;
      const title = titleEl.textContent.trim();
      let hrefAttr = titleEl.getAttribute("href") || "";
      let originalUrl = hrefAttr;
      if (originalUrl) {
        if (!originalUrl.startsWith("http")) {
          originalUrl = "https://www.acbjobs.com.vn" + (originalUrl.startsWith("/") ? "" : "/") + originalUrl;
        } else {
          originalUrl = originalUrl.replace(/^(https?:\/\/)?(acbjobs\.com\.vn)/, "https://www.acbjobs.com.vn");
          originalUrl = originalUrl.replace(/^(https?:\/\/)?(www\.acbjobs\.com\.vn)?\/?/, "https://www.acbjobs.com.vn/");
        }
      }
      
      const infoDivs = item.querySelectorAll(".info");
      let department = "Kinh doanh & Khác";
      let location = "TP. Hồ Chí Minh";
      let experience = "Experience";
      
      if (infoDivs[0]) {
        // Department is text before dot-single icon
        const firstInfoText = infoDivs[0].innerHTML.split("<span")[0] || "";
        department = firstInfoText.replace(/&nbsp;/g, "").trim();
        
        // Location and Experience links
        const links = infoDivs[0].querySelectorAll("a");
        links.forEach(link => {
          const href = link.getAttribute("href") || "";
          const text = link.textContent.trim();
          if (href.includes("office=3133")) {
            location = "TP. Hồ Chí Minh";
          } else if (href.includes("office=86")) {
            location = "Hội sở (Tp. HCM)";
          } else if (text.toLowerCase() === "experience" || text.toLowerCase() === "fresh" || text.toLowerCase() === "manager") {
            experience = text;
          }
        });
      }
      
      let type = "Toàn thời gian";
      let salary = "Thương lượng";
      if (infoDivs[1]) {
        // Split by icon if present
        const parts = infoDivs[1].innerHTML.split("<span");
        if (parts[0]) type = parts[0].replace(/&nbsp;/g, "").trim();
        if (parts[1]) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = "<div>" + parts[1] + "</div>";
          salary = tempDiv.textContent.replace(/&nbsp;/g, "").trim();
        }
      }
      
      // Extract ID from URL (e.g. ...-53664)
      const idMatch = originalUrl.match(/-(\d+)$/);
      const id = idMatch ? idMatch[1] : Math.random().toString(36).substring(2, 9);
      
      jobs.push({
        id, title, department, location, experience, type, salary, originalUrl
      });
    });
    
    // Extract total pages from pagination
    let totalPages = 1;
    const pagDiv = doc.querySelector(".__pag");
    if (pagDiv) {
      const pagLinks = pagDiv.querySelectorAll("a.pag");
      const pages = [];
      pagLinks.forEach(a => {
        const href = a.getAttribute("href") || "";
        const m = href.match(/page=(\d+)/);
        if (m) pages.push(parseInt(m[1], 10));
      });
      if (pages.length > 0) totalPages = Math.max(...pages);
    }
    
    return { jobs, totalPages };
  }

  async fetchLiveLPBPage(page) {
    const qs = `DeltaDataLocation=01000000-6ba6-4a0b-c110-08de81da9f2e&pageIndex=${page}&pageSize=10&Domain=tuyendung.lpbank.com.vn`;
    let baseUrl = this.resolveApiUrl(`/api/jobs/lpbank?${qs}`, `https://centralize-api-v2.iviec.vn/api/recruitment/Recruitment/GetRecruitmentsByDomain?${qs}`);
    // Fallback to live URL if proxy is not local and not running
    if (baseUrl.startsWith("http://localhost:8000")) {
      try {
        const t = await fetch("http://localhost:8000/api/jobs/lpbank", { method: "OPTIONS" });
        if (!t.ok) baseUrl = `https://centralize-api-v2.iviec.vn/api/recruitment/Recruitment/GetRecruitmentsByDomain?${qs}`;
      } catch (_) {
        baseUrl = `https://centralize-api-v2.iviec.vn/api/recruitment/Recruitment/GetRecruitmentsByDomain?${qs}`;
      }
    }
    const res = await fetch(baseUrl, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`LPBank HTTP ${res.status}`);
    return await res.json();
  }

  // ── Xử lý dữ liệu VPBank ─────────────────────────────────────────
  processRawJobs(rawJobs) {
    return rawJobs.map((job, idx) => {
      const title = (job.unifiedStandardTitle || "").trim();
      const titleLower = title.toLowerCase();
      const buList = job.businessUnit_obj || [];
      const deptName = buList[0] || "Kinh doanh & Khác";
      const deptNameLower = deptName.toLowerCase();

      let deptCode = "business";
      if (["rủi ro","pháp chế","tuân thủ","kiểm toán","pháp lý","thu hồi","xử lý nợ","giám sát tín dụng","tố tụng"].some(k => titleLower.includes(k) || deptNameLower.includes(k))) deptCode = "risk-legal";
      else if (["it","cntt","công nghệ","data","dữ liệu","lập trình","phần mềm","hệ thống","security","developer","tester","analyst","an toàn thông tin","kiến trúc"].some(k => matchKeyword(titleLower, k) || matchKeyword(deptNameLower, k))) deptCode = "it-data";

      let level = "junior-mid", levelName = "Chuyên viên";
      if (["thực tập","tập sự","intern"].some(k => titleLower.includes(k))) { level = "intern"; levelName = "Thực tập sinh / Tập sự"; }
      else if (["chuyên viên cao cấp","cvcc","senior","chuyên gia"].some(k => titleLower.includes(k))) { level = "senior"; levelName = "Chuyên viên cao cấp"; }
      else if (["trưởng nhóm","trưởng phòng","quản lý","giám đốc","lead","manager","head","director"].some(k => titleLower.includes(k))) { level = "lead-manager"; levelName = "Quản lý / Giám đốc"; }

      let deadline = job.unifiedStandardEnd || "2026-10-31";
      const m = deadline.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (m) deadline = `${m[3]}-${m[2]}-${m[1]}`;

      const rawId = job.id, urlTitle = job.urlTitle;
      const originalUrl = `https://tuyendung.vpbank.com.vn/job/${urlTitle}/${rawId}-vi_VN`;
      const tags = ["VPBank TP.HCM"];
      const stream = job.cust_FO_CareerStream || [];
      if (stream[0]) tags.push(stream[0]);

      return { id: `job-vpb-${rawId || idx}`, title, bank: "VPBank", bankCode: "VPB", logoColor: "linear-gradient(135deg,#059669 0%,#047857 100%)", department: deptCode, departmentName: deptName, location: "TP. Hồ Chí Minh", salary: "Thỏa thuận", level, levelName, deadline, tags, hrEmail: "tuyendung@vpbank.com.vn", originalUrl };
    });
  }

  // ── Xử lý dữ liệu MB Bank ────────────────────────────────────────
  processRawMBBJobs(rawJobs) {
    return rawJobs.map((job, idx) => {
      const title = (job.name || "").trim();
      const titleLower = title.toLowerCase();
      const skillTags = job.skillTags || [];
      const skillTagsLower = skillTags.map(s => s.toLowerCase());

      let deptCode = "business", deptName = "Đơn vị Kinh doanh";
      if (["rủi ro","pháp chế","tuân thủ","kiểm toán","pháp lý","thu hồi","xử lý nợ"].some(k => titleLower.includes(k)) || ["risk management","legal","compliance","audit"].some(k => skillTagsLower.includes(k))) { 
        deptCode = "risk-legal"; 
        deptName = "Khối Quản trị Rủi ro & Pháp chế"; 
      }
      else if (["it","cntt","công nghệ","data","dữ liệu","lập trình","phần mềm","hệ thống","security","developer","tester"].some(k => matchKeyword(titleLower, k)) || ["it","software development","database","data analysis","cyber security"].some(k => matchKeyword(skillTagsLower.join(" "), k))) { 
        deptCode = "it-data"; 
        deptName = "Khối Công nghệ Thông tin"; 
      }
      else if (["cá nhân", "khcn", "bán lẻ", "tư vấn khách hàng", "ub"].some(k => titleLower.includes(k))) {
        deptCode = "business";
        deptName = "Khối Khách hàng Cá nhân";
      }
      else if (["doanh nghiệp", "khdn"].some(k => titleLower.includes(k))) {
        deptCode = "business";
        deptName = "Khối Khách hàng Doanh nghiệp";
      }
      else if (["thẩm định", "định giá"].some(k => titleLower.includes(k))) {
        deptCode = "business";
        deptName = "Khối Thẩm định";
      }
      else if (["hỗ trợ"].some(k => titleLower.includes(k))) {
        deptCode = "business";
        deptName = "Khối Hỗ trợ Kinh doanh";
      }
      else if (["vận hành"].some(k => titleLower.includes(k))) {
        deptCode = "business";
        deptName = "Khối Vận hành";
      }

      let level = "junior-mid", levelName = "Chuyên viên";
      if (["thực tập","tập sự","intern","học việc"].some(k => titleLower.includes(k))) { level = "intern"; levelName = "Thực tập sinh / Tập sự"; }
      else if (["chuyên viên cao cấp","cvcc","senior","chuyên gia","chủ trì"].some(k => titleLower.includes(k))) { level = "senior"; levelName = "Chuyên viên cao cấp"; }
      else if (["trưởng nhóm","trưởng phòng","quản lý","giám đốc","lead","manager","head","director"].some(k => titleLower.includes(k))) { level = "lead-manager"; levelName = "Quản lý / Giám đốc"; }

      let deadline = job.toDate || "2026-10-31";
      const parts = deadline.split("-");
      if (parts.length === 3) deadline = `${parts[2]}-${parts[1]}-${parts[0]}`;

      const tags = ["MB Bank TP.HCM"];
      if (skillTags[0]) tags.push(skillTags[0]);
      if (skillTags[1]) tags.push(skillTags[1]);

      const workGroupId = job.workGroupId || "";
      const originalUrl = `https://careers.mbbank.com.vn/list-of-posts/detail-list-of-posts?id=${job.id}&workGroupId=${workGroupId}`;
      return { id: `job-mbb-${job.id || idx}`, title, bank: "MB Bank", bankCode: "MBB", logoColor: "linear-gradient(135deg,#1e40af 0%,#1d4ed8 100%)", department: deptCode, departmentName: deptName, location: "TP. Hồ Chí Minh", salary: "Thỏa thuận", level, levelName, deadline, tags, hrEmail: "hr.contact@mbbank.com.vn", originalUrl };

    });
  }

  // ── Xử lý dữ liệu ACB ─────────────────────────────────────────────
  processRawACBJobs(rawJobs) {
    if (!rawJobs) return [];
    return rawJobs.map((job, idx) => {
      const title = job.title;
      const titleLower = title.toLowerCase();
      const deptName = job.department || "Kinh doanh & Vận hành";
      const deptNameLower = deptName.toLowerCase();

      let deptCode = "business";
      if (["rủi ro","pháp chế","tuân thủ","kiểm toán","pháp lý","thu hồi","xử lý nợ","tố tụng","giám sát tín dụng"].some(k => titleLower.includes(k) || deptNameLower.includes(k))) deptCode = "risk-legal";
      else if (["it","cntt","công nghệ","data","dữ liệu","lập trình","phần mềm","hệ thống","security","developer","tester","analyst","an toàn thông tin"].some(k => matchKeyword(titleLower, k) || matchKeyword(deptNameLower, k))) deptCode = "it-data";

      let level = "junior-mid", levelName = "Chuyên viên";
      const expLower = (job.experience || "").toLowerCase();
      if (["fresh", "học việc", "thực tập", "tập sự", "intern"].some(k => titleLower.includes(k) || expLower.includes(k))) { 
        level = "intern"; 
        levelName = "Thực tập sinh / Tập sự"; 
      } else if (["manager", "trưởng nhóm", "trưởng phòng", "quản lý", "giám đốc", "lead", "head", "director"].some(k => titleLower.includes(k) || expLower.includes(k))) { 
        level = "lead-manager"; 
        levelName = "Quản lý / Giám đốc"; 
      } else if (["chuyên viên cao cấp","cvcc","senior","chuyên gia","chủ trì"].some(k => titleLower.includes(k))) { 
        level = "senior"; 
        levelName = "Chuyên viên cao cấp"; 
      }

      const deadline = "2026-10-31"; 

      const tags = ["ACB TP.HCM"];
      if (job.experience) tags.push(job.experience);
      if (job.type) tags.push(job.type);

      return { 
        id: `job-acb-${job.id || idx}`, 
        title, 
        bank: "ACB", 
        bankCode: "ACB", 
        logoColor: "linear-gradient(135deg,#fb923c 0%,#f97316 100%)", 
        department: deptCode, 
        departmentName: deptName, 
        location: job.location || "TP. Hồ Chí Minh", 
        salary: job.salary || "Thỏa thuận", 
        level, 
        levelName, 
        deadline, 
        tags, 
        hrEmail: "tuyendung@acb.com.vn", 
        originalUrl: job.originalUrl 
      };
    });
  }

  // ── Xử lý dữ liệu LPBank ──────────────────────────────────────────
  processRawLPBJobs(rawJobs) {
    if (!rawJobs) return [];
    return rawJobs.map((job, idx) => {
      const title = (job.name || "").trim();
      const titleLower = title.toLowerCase();
      
      // Lấy tên phòng ban từ delta data hoặc mặc định
      let deptName = "Kinh doanh & Vận hành";
      const deptData = (job.recruitmentDeltaDatas || []).find(d => d.workspaceDeltaDataKey === "job_department");
      if (deptData && deptData.workspaceDeltaDataValue) {
        try {
          const parsed = JSON.parse(deptData.workspaceDeltaDataValue);
          if (parsed.name_VN) deptName = parsed.name_VN.trim();
        } catch (_) {}
      }
      const deptNameLower = deptName.toLowerCase();

      let deptCode = "business";
      if (["rủi ro","pháp chế","tuân thủ","kiểm toán","pháp lý","thu hồi","xử lý nợ","tố tụng","giám sát tín dụng"].some(k => titleLower.includes(k) || deptNameLower.includes(k))) deptCode = "risk-legal";
      else if (["it","cntt","công nghệ","data","dữ liệu","lập trình","phần mềm","hệ thống","security","developer","tester","analyst","an toàn thông tin"].some(k => matchKeyword(titleLower, k) || matchKeyword(deptNameLower, k))) deptCode = "it-data";

      // Lấy cấp bậc từ delta data hoặc từ tiêu đề
      let levelText = "";
      const levelData = (job.recruitmentDeltaDatas || []).find(d => d.workspaceDeltaDataKey === "job_level");
      if (levelData && levelData.workspaceDeltaDataValue) {
        try {
          const parsed = JSON.parse(levelData.workspaceDeltaDataValue);
          if (parsed.name_VN) levelText = parsed.name_VN.trim();
        } catch (_) {}
      }
      
      const checkText = (title + " " + levelText).toLowerCase();
      let level = "junior-mid", levelName = "Chuyên viên";
      if (["fresh", "học việc", "thực tập", "tập sự", "intern"].some(k => checkText.includes(k))) { 
        level = "intern"; 
        levelName = "Thực tập sinh / Tập sự"; 
      } else if (["manager", "trưởng nhóm", "trưởng phòng", "quản lý", "giám đốc", "lead", "head", "director"].some(k => checkText.includes(k))) { 
        level = "lead-manager"; 
        levelName = "Quản lý / Giám đốc"; 
      } else if (["chuyên viên cao cấp","cvcc","senior","chuyên gia","chủ trì"].some(k => checkText.includes(k))) { 
        level = "senior"; 
        levelName = "Chuyên viên cao cấp"; 
      }

      // Địa điểm làm việc
      let location = "TP. Hồ Chí Minh";
      if (job.workingNewAddresses && job.workingNewAddresses.length > 0) {
        location = job.workingNewAddresses.map(addr => addr.provinceName).filter(Boolean).join(", ");
      }

      // Lương
      let salary = "Thỏa thuận";
      if (job.minSalary || job.maxSalary) {
        if (job.minSalary && job.maxSalary) {
          salary = `${Math.round(job.minSalary/1000000)} - ${Math.round(job.maxSalary/1000000)} triệu`;
        } else if (job.minSalary) {
          salary = `Từ ${Math.round(job.minSalary/1000000)} triệu`;
        } else {
          salary = `Đến ${Math.round(job.maxSalary/1000000)} triệu`;
        }
      }

      const deadline = "2026-10-31"; 

      const tags = ["LPBank"];
      if (location) tags.push(location.split(",")[0].trim());
      
      const originalUrl = `https://tuyendung.lpbank.com.vn/vi/jobs/${job.slug}`;

      return { 
        id: `job-lpb-${job.id || job.slug || idx}`, 
        title, 
        bank: "LPBank", 
        bankCode: "LPB", 
        logoColor: "linear-gradient(135deg,#dc2626 0%,#facc15 100%)", 
        department: deptCode, 
        departmentName: deptName, 
        location, 
        salary, 
        level, 
        levelName, 
        deadline, 
        tags, 
        hrEmail: "tuyendung@lpbank.com.vn", 
        originalUrl 
      };
    });
  }

  // ── Lọc phía client (top-bar + column filters) ───────────────────
  applyClientFilters() {
    const baseList = this.selectedBank === "saved" ? this.savedJobs : this.jobs;
    
    // Tự động cập nhật các tùy chọn bộ lọc cột theo kết quả hiện tại
    this.updateFacetedFilters(baseList);

    this.filteredJobs = baseList.filter(job => {
      // --- Top-bar filters ---
      const matchBank   = this.selectedBank === "all" || this.selectedBank === "saved" || job.bank === this.selectedBank;
      const matchDept   = this.selectedDept === "all" || job.department === this.selectedDept;
      const matchExp    = this.selectedExp  === "all" || job.level     === this.selectedExp;
      const matchSearch = !this.searchQuery ||
        job.title.toLowerCase().includes(this.searchQuery) ||
        job.bank.toLowerCase().includes(this.searchQuery) ||
        job.departmentName.toLowerCase().includes(this.searchQuery) ||
        job.location.toLowerCase().includes(this.searchQuery);

      // --- Column filters (live) ---
      const cf = this.colFilter;
      const cfTitle    = !cf.title    || job.title.toLowerCase().includes(cf.title);
      const cfBank     = cf.bank.length === 0 || cf.bank.includes(job.bank.toLowerCase());
      const cfDept     = cf.dept.length === 0 || cf.dept.includes(job.departmentName.toLowerCase());
      const cfLevel    = cf.level.length === 0 || cf.level.includes(job.level.toLowerCase());
      // Deadline: lọc job có hạn nộp >= ngày chọn
      const cfDeadline = !cf.deadline || (job.deadline && job.deadline >= cf.deadline);

      return matchBank && matchDept && matchExp && matchSearch
          && cfTitle && cfBank && cfDept && cfLevel && cfDeadline;
    });
    this.sortJobs();
    this.renderJobsList();
  }

  updateFacetedFilters(baseJobs) {
    if (!this.cfBank || !this.cfDept || !this.cfLevel) return;

    // Hàm kiểm tra khớp với tất cả bộ lọc, loại trừ một số bộ lọc cột cụ thể (Faceted Search)
    const matchesFiltersExcept = (job, excludeFields = []) => {
      // Top-bar filters
      const matchBank   = this.selectedBank === "all" || this.selectedBank === "saved" || job.bank === this.selectedBank;
      const matchDept   = this.selectedDept === "all" || job.department === this.selectedDept;
      const matchExp    = this.selectedExp  === "all" || job.level     === this.selectedExp;
      const matchSearch = !this.searchQuery ||
        job.title.toLowerCase().includes(this.searchQuery) ||
        job.bank.toLowerCase().includes(this.searchQuery) ||
        job.departmentName.toLowerCase().includes(this.searchQuery) ||
        job.location.toLowerCase().includes(this.searchQuery);

      if (!matchBank || !matchDept || !matchExp || !matchSearch) return false;

      // Column filters
      const cf = this.colFilter;
      const cTitle    = excludeFields.includes("title")    || !cf.title    || job.title.toLowerCase().includes(cf.title);
      const cBank     = excludeFields.includes("bank")     || cf.bank.length === 0 || cf.bank.includes(job.bank.toLowerCase());
      const cDept     = excludeFields.includes("dept")     || cf.dept.length === 0 || cf.dept.includes(job.departmentName.toLowerCase());
      const cLevel    = excludeFields.includes("level")    || cf.level.length === 0 || cf.level.includes(job.level.toLowerCase());
      const cDeadline = excludeFields.includes("deadline") || !cf.deadline || (job.deadline && job.deadline >= cf.deadline);

      return cTitle && cBank && cDept && cLevel && cDeadline;
    };

    // Helper to render dynamic checkboxes inside a multiselect dropdown
    const renderDropdownItems = (dropdownEl, itemsList, countsObj, selectedArray) => {
      let html = "";
      itemsList.forEach(itemVal => {
        const itemLower = itemVal.toLowerCase();
        const isChecked = selectedArray.includes(itemLower);
        const count = countsObj[itemVal] || 0;
        html += `
          <label class="multiselect-item">
            <input type="checkbox" value="${itemVal}" ${isChecked ? "checked" : ""}>
            <span>${itemVal} (${count})</span>
          </label>
        `;
      });
      dropdownEl.innerHTML = html;
    };

    // Helper to update trigger label
    const updateTriggerLabel = (triggerEl, baseListLength, allCountsObj, selectedArray) => {
      const labelSpan = triggerEl.querySelector(".trigger-label");
      if (!labelSpan) return;

      const selectedCount = selectedArray.length;
      if (selectedCount === 0) {
        labelSpan.textContent = `Tất cả (${baseListLength})`;
      } else if (selectedCount <= 2) {
        // Tìm các tên có hoa thường khớp
        const casedNames = Object.keys(allCountsObj).filter(k => selectedArray.includes(k.toLowerCase()));
        labelSpan.textContent = casedNames.length > 0 ? casedNames.join(", ") : `Đã chọn (${selectedCount})`;
      } else {
        labelSpan.textContent = `Đã chọn (${selectedCount})`;
      }
    };

    // 1. Cập nhật dropdown Ngân hàng
    const bankJobs = baseJobs.filter(j => matchesFiltersExcept(j, ["bank"]));
    const bankCounts = {};
    bankJobs.forEach(j => {
      if (j.bank) bankCounts[j.bank] = (bankCounts[j.bank] || 0) + 1;
    });
    const bankList = Object.keys(bankCounts).sort();
    const bankDropdown = this.cfBank.querySelector(".multiselect-dropdown");
    const bankTrigger = this.cfBank.querySelector(".multiselect-trigger");
    
    this.colFilter.bank = this.colFilter.bank.filter(b => bankList.some(bl => bl.toLowerCase() === b));
    renderDropdownItems(bankDropdown, bankList, bankCounts, this.colFilter.bank);
    updateTriggerLabel(bankTrigger, bankJobs.length, bankCounts, this.colFilter.bank);

    // 2. Cập nhật dropdown Khối phòng ban
    const deptJobs = baseJobs.filter(j => matchesFiltersExcept(j, ["dept"]));
    const deptCounts = {};
    deptJobs.forEach(j => {
      if (j.departmentName) deptCounts[j.departmentName] = (deptCounts[j.departmentName] || 0) + 1;
    });
    const deptList = Object.keys(deptCounts).sort();
    const deptDropdown = this.cfDept.querySelector(".multiselect-dropdown");
    const deptTrigger = this.cfDept.querySelector(".multiselect-trigger");

    this.colFilter.dept = this.colFilter.dept.filter(d => deptList.some(dl => dl.toLowerCase() === d));
    renderDropdownItems(deptDropdown, deptList, deptCounts, this.colFilter.dept);
    updateTriggerLabel(deptTrigger, deptJobs.length, deptCounts, this.colFilter.dept);

    // 3. Cập nhật dropdown Cấp bậc
    const levelJobs = baseJobs.filter(j => matchesFiltersExcept(j, ["level"]));
    const levelCountsByCode = {};
    const levelNames = {
      "intern": "Thực tập sinh / Tập sự",
      "junior-mid": "Chuyên viên",
      "senior": "Chuyên viên cao cấp",
      "lead-manager": "Quản lý / Giám đốc"
    };
    levelJobs.forEach(j => {
      if (j.level) levelCountsByCode[j.level] = (levelCountsByCode[j.level] || 0) + 1;
    });
    const levelCodes = ["intern", "junior-mid", "senior", "lead-manager"].filter(c => levelCountsByCode[c] !== undefined);
    const levelDropdown = this.cfLevel.querySelector(".multiselect-dropdown");
    const levelTrigger = this.cfLevel.querySelector(".multiselect-trigger");

    this.colFilter.level = this.colFilter.level.filter(l => levelCodes.includes(l));

    // Render level checkboxes
    let levelHtml = "";
    levelCodes.forEach(code => {
      const friendlyName = levelNames[code] || code;
      const count = levelCountsByCode[code] || 0;
      const isChecked = this.colFilter.level.includes(code.toLowerCase());
      levelHtml += `
        <label class="multiselect-item">
          <input type="checkbox" value="${code}" ${isChecked ? "checked" : ""}>
          <span>${friendlyName} (${count})</span>
        </label>
      `;
    });
    levelDropdown.innerHTML = levelHtml;

    // Update level label
    const levelLabelSpan = levelTrigger.querySelector(".trigger-label");
    if (levelLabelSpan) {
      const selectedCount = this.colFilter.level.length;
      if (selectedCount === 0) {
        levelLabelSpan.textContent = `Tất cả (${levelJobs.length})`;
      } else if (selectedCount <= 2) {
        const friendlySelectedNames = this.colFilter.level.map(l => levelNames[l] || l);
        levelLabelSpan.textContent = friendlySelectedNames.join(", ");
      } else {
        levelLabelSpan.textContent = `Đã chọn (${selectedCount})`;
      }
    }
  }

  // ── Thống kê ─────────────────────────────────────────────────────
  renderStats() {
    if (!this.statTotal) return;
    this.statTotal.innerText = this.jobs.length;
    this.statRisk.innerText  = this.jobs.filter(j => j.department === "risk-legal").length;
    this.statIt.innerText    = this.jobs.filter(j => j.department === "it-data").length;
    this.statBiz.innerText   = this.jobs.filter(j => j.department === "business").length;
  }

  // ── Sắp xếp ──────────────────────────────────────────────────────
  sortJobs() {
    const col = this.sortColumn, dir = this.sortDirection === "asc" ? 1 : -1;
    this.filteredJobs.sort((a, b) => {
      const vA = a[col] || "", vB = b[col] || "";
      return (typeof vA === "string" ? vA.localeCompare(vB, "vi") : (vA < vB ? -1 : vA > vB ? 1 : 0)) * dir;
    });
    const idMap = { title: "icon-title", bank: "icon-bank", departmentName: "icon-dept", levelName: "icon-level", deadline: "icon-deadline" };
    Object.entries(idMap).forEach(([h, id]) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute("data-lucide", h === col ? (dir === 1 ? "arrow-up" : "arrow-down") : "arrow-up-down");
    });
    lucide.createIcons();
  }

  // ── Render bảng ──────────────────────────────────────────────────
  renderJobsList() {
    if (!this.tableBody) return;

    if (this.filteredJobs.length === 0) {
      this.tableBody.innerHTML = `
        <tr><td colspan="6" style="text-align:center;padding:3rem;color:var(--text-muted);">
          <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
            <i data-lucide="search-slash" style="width:44px;height:44px;opacity:0.5;"></i>
            <p style="font-size:0.95rem;font-weight:600;margin:0;">Không tìm thấy vị trí phù hợp.</p>
            <span style="font-size:0.8rem;">Thử điều chỉnh tiêu chí lọc rồi nhấn Tìm kiếm lại.</span>
          </div>
        </td></tr>`;
      if (this.paginationInfo) this.paginationInfo.innerText = "";
      if (this.paginationControls) this.paginationControls.innerHTML = "";
      lucide.createIcons();
      return;
    }

    const totalItems = this.filteredJobs.length;
    const totalPages = Math.ceil(totalItems / this.pageSize);
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    if (this.currentPage < 1) this.currentPage = 1;

    const startIdx = (this.currentPage - 1) * this.pageSize;
    const endIdx   = Math.min(startIdx + this.pageSize, totalItems);
    const slice    = this.filteredJobs.slice(startIdx, endIdx);

    this.tableBody.innerHTML = slice.map(job => {
      const tagsHtml = job.tags.map(t => {
        let cls = "job-tag-default";
        if (t.includes("gấp")) cls = "job-tag-urgent";
        return `<span class="job-tag ${cls}" style="font-size:0.7rem;padding:0.1rem 0.35rem;border-radius:4px;display:inline-block;margin-right:0.25rem;font-weight:500;">${t}</span>`;
      }).join("");

      const isSaved = this.savedJobs.some(s => s.id === job.id);

      return `
        <tr style="border-bottom:1px solid var(--border-color);">
          <td data-label="Vị trí tuyển dụng" style="padding:0.85rem 1.25rem;">
            <div style="font-weight:600;color:var(--text-main);font-size:0.9rem;margin-bottom:0.3rem;cursor:pointer;" class="open-job-detail-link" data-id="${job.id}">${job.title}</div>
            <div style="display:flex;flex-wrap:wrap;gap:0.25rem;">${tagsHtml}</div>
          </td>
          <td data-label="Ngân hàng" style="padding:0.85rem 1.25rem;">
            <div style="display:flex;align-items:center;gap:0.5rem;">
              <div style="background:${job.logoColor};width:26px;height:26px;font-size:0.65rem;font-weight:700;border-radius:5px;display:flex;align-items:center;justify-content:center;color:white;">${job.bankCode}</div>
              <span style="font-weight:600;font-size:0.82rem;">${job.bank}</span>
            </div>
          </td>
          <td data-label="Khối phòng ban" style="padding:0.85rem 1.25rem;color:var(--text-muted);font-size:0.82rem;">${job.departmentName}</td>
          <td data-label="Cấp bậc" style="padding:0.85rem 1.25rem;font-size:0.82rem;">
            <span class="badge" style="background:rgba(255,255,255,0.03);color:var(--text-main);border:1px solid var(--border-color);padding:0.2rem 0.45rem;border-radius:4px;font-weight:500;">${job.levelName}</span>
          </td>
          <td data-label="Hạn nộp" style="padding:0.85rem 1.25rem;font-size:0.82rem;color:var(--text-muted);font-weight:500;">${this.formatDate(job.deadline)}</td>
          <td data-label="Thao tác" style="padding:0.85rem 1.25rem;text-align:right;">
            <div style="display:flex;gap:0.35rem;justify-content:flex-end;align-items:center;">
              <button class="save-job-btn" data-id="${job.id}" title="${isSaved ? "Hủy lưu công việc" : "Lưu công việc"}" 
                style="padding:0.35rem;font-size:0.75rem;display:inline-flex;align-items:center;background:transparent;border:1px solid var(--border-color);border-radius:6px;color:${isSaved ? "#f59e0b" : "var(--text-muted)"};cursor:pointer;transition:all 0.15s;">
                <i data-lucide="bookmark" style="width:14px;height:14px;${isSaved ? "fill:#f59e0b;" : ""}"></i>
              </button>
              <button class="job-action-btn open-job-detail" data-id="${job.id}" style="padding:0.35rem 0.65rem;font-size:0.75rem;display:inline-flex;align-items:center;gap:4px;">
                <span>Chi tiết</span><i data-lucide="arrow-right" style="width:12px;height:12px;"></i>
              </button>
            </div>
          </td>
        </tr>`;
    }).join("");

    if (this.paginationInfo) this.paginationInfo.innerText = `Hiển thị ${startIdx + 1} - ${endIdx} trong ${totalItems} công việc`;
    this.renderPaginationControls(totalPages);
    lucide.createIcons();
  }
  // ── Logic lưu công việc (Đồng bộ Local File .json & LocalStorage) ─
  async loadSavedJobsFromServer() {
    try {
      const url = this.resolveApiUrl("/api/saved-jobs");
      const res = await fetch(url);
      if (res.ok) {
        this.savedJobs = await res.json();
        // Rerender tab saved nếu đang active
        if (this.selectedBank === "saved") {
          this.applyClientFilters();
        }
      }
    } catch (e) {
      console.warn("Không thể tải danh sách đã lưu từ server local, dùng localStorage tạm thời:", e);
      try {
        this.savedJobs = JSON.parse(localStorage.getItem("basel_saved_jobs")) || [];
      } catch (_) {
        this.savedJobs = [];
      }
    }
  }

  async toggleSaveJob(jobId) {
    const isSaved = this.savedJobs.some(s => s.id === jobId);
    if (isSaved) {
      this.savedJobs = this.savedJobs.filter(s => s.id !== jobId);
    } else {
      // Tìm job trong danh sách session hiện tại
      // Hoặc nếu không thấy thì tìm trong danh sách savedJobs (đề phòng)
      const job = this.jobs.find(j => j.id === jobId) || this.savedJobs.find(j => j.id === jobId);
      if (job) {
        this.savedJobs.push(job);
      }
    }
    
    // Lưu dự phòng vào localStorage
    localStorage.setItem("basel_saved_jobs", JSON.stringify(this.savedJobs));
    
    // Gửi yêu cầu lưu lên server local để ghi vào file .json
    try {
      const url = this.resolveApiUrl("/api/saved-jobs");
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.savedJobs)
      });
    } catch (e) {
      console.warn("Không thể ghi file JSON qua server local:", e);
    }

    if (this.selectedBank === "saved") {
      this.applyClientFilters();
    } else {
      this.renderJobsList();
    }
  }

  renderPaginationControls(totalPages) {
    if (!this.paginationControls) return;
    let html = `<button class="page-btn" ${this.currentPage === 1 ? "disabled" : ""} id="prev-page-btn"><i data-lucide="chevron-left" style="width:14px;height:14px;"></i></button>`;

    let startPage = Math.max(1, this.currentPage - 2);
    let endPage   = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

    for (let p = startPage; p <= endPage; p++) {
      html += `<button class="page-btn ${p === this.currentPage ? "active" : ""}" data-page="${p}">${p}</button>`;
    }
    html += `<button class="page-btn" ${this.currentPage === totalPages ? "disabled" : ""} id="next-page-btn"><i data-lucide="chevron-right" style="width:14px;height:14px;"></i></button>`;
    this.paginationControls.innerHTML = html;

    const prev = document.getElementById("prev-page-btn");
    const next = document.getElementById("next-page-btn");
    if (prev && this.currentPage > 1) prev.addEventListener("click", () => { this.currentPage--; this.renderJobsList(); });
    if (next && this.currentPage < totalPages) next.addEventListener("click", () => { this.currentPage++; this.renderJobsList(); });
    this.paginationControls.querySelectorAll("button[data-page]").forEach(btn => {
      btn.addEventListener("click", () => { this.currentPage = parseInt(btn.getAttribute("data-page"), 10); this.renderJobsList(); });
    });
  }

  // ── Modal / Chi tiết ─────────────────────────────────────────────
  openModal(jobId) {
    // Tìm cả trong jobs lẫn savedJobs phòng khi user chuyển tab saved
    const job = this.jobs.find(j => j.id === jobId) || this.savedJobs.find(j => j.id === jobId);
    if (!job) return;
    const w = 1200, h = 850;
    window.open(job.originalUrl, `job_${jobId}`, `width=${w},height=${h},left=${(screen.width-w)/2},top=${(screen.height-h)/2},scrollbars=yes,resizable=yes`);
  }

  closeModal() {
    if (this.modal) { this.modal.classList.add("hidden"); document.body.style.overflow = ""; }
  }

  // ── Error state ───────────────────────────────────────────────────
  showCoresError() {
    this.tableBody.innerHTML = `
      <tr><td colspan="6" style="text-align:center;padding:4rem 1.5rem;color:var(--text-muted);">
        <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
          <i data-lucide="shield-alert" style="width:44px;height:44px;color:var(--warning);"></i>
          <div style="font-weight:600;font-size:0.95rem;color:var(--text-main);">Không thể tải dữ liệu tuyển dụng</div>
          <span style="font-size:0.8rem;max-width:500px;line-height:1.5;">Do chính sách bảo mật (CORS) hoặc sự cố kết nối. Vui lòng đảm bảo server local (run_app.py) đang chạy trên cổng 8000.</span>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin-top:0.5rem;">
            <a href="https://tuyendung.vpbank.com.vn/search?q=&facetFilters=%7B%22sfstd_jobLocation_obj%22%3A%5B%22H%E1%BB%93+Ch%C3%AD+Minh%22%5D%7D" target="_blank" class="btn btn-outline" style="padding:0.5rem 1rem;font-size:0.8rem;display:inline-flex;align-items:center;gap:6px;text-decoration:none;">
              <i data-lucide="external-link" style="width:14px;height:14px;"></i><span>VPBank trực tiếp</span>
            </a>
            <a href="https://careers.mbbank.com.vn/list-of-posts?type=TX105" target="_blank" class="btn btn-outline" style="padding:0.5rem 1rem;font-size:0.8rem;display:inline-flex;align-items:center;gap:6px;text-decoration:none;">
              <i data-lucide="external-link" style="width:14px;height:14px;"></i><span>MB Bank trực tiếp</span>
            </a>
          </div>
        </div>
      </td></tr>`;
    lucide.createIcons();
  }

  formatDate(dateStr) {
    if (!dateStr) return "";
    const p = dateStr.split("-");
    return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : dateStr;
  }
}

// ── Khởi tạo ─────────────────────────────────────────────────────────
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
