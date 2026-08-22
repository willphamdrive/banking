// Logic hiển thị và xử lý dữ liệu Phân tích & Thảo luận vĩ mô với phân trang và lọc chủ đề chuyên sâu
class DiscussionInsights {
  constructor() {
    this.academyPosts = typeof ACADEMY_POSTS_DATA !== "undefined" ? ACADEMY_POSTS_DATA : [];
    this.nghiaPosts = typeof NGHIA_POSTS_DATA !== "undefined" ? NGHIA_POSTS_DATA : [];

    this.posts = this.academyPosts; // Mặc định hiển thị
    this.selectedBank = null;
    this.searchQuery = "";
    this.filterMode = "all"; // 'all' hoặc 'has_bank'
    this.filterTopic = "sbv_mistakes";
    this.sortOrder = "newest"; // 'newest' hoặc 'oldest'

    // Danh mục chủ đề đồng bộ cho cả hai tác giả (bao gồm các tỷ lệ tài chính ngân hàng chi tiết)
    this.topics = [
      { code: "all", display: "Tất cả" },
      { code: "basel_tt22", display: "Basel III & TT22" },
      { code: "ratio_car", display: "Tỷ lệ CAR" },
      { code: "ratio_lcr_nsfr", display: "LCR & NSFR" },
      { code: "ratio_ldr", display: "Tỷ lệ LDR" },
      { code: "ratio_npl", display: "Nợ xấu NPL" },
      { code: "ratio_nim", display: "Biên NIM" },
      { code: "interest_macro", display: "Lãi suất & Vĩ mô" },
      { code: "sbv", display: "Điều hành SBV" },
      { code: "sbv_mistakes", display: "SBV đã sai gì?" },
      { code: "exchange_fx", display: "Tỷ giá & FX" },
      { code: "deals_corp", display: "Thương vụ & DN" },
      { code: "promos_courses", display: "Ưu đãi & Khóa học" },
      { code: "cfa_updates", display: "CFA & Cập nhật" },
      { code: "other", display: "Khác" }
    ];

    // Pagination parameters
    this.currentPage = 1;
    this.postsPerPage = 10; // Hiển thị 10 bài viết mỗi trang

    this.initElements();
    this.bindEvents();
    this.render();
  }

  initElements() {
    this.postsListContainer = document.getElementById("hedge-posts-list");
    this.searchInput = document.getElementById("hedge-search-input");
    this.filterBtns = document.querySelectorAll(".hedge-filter-btn");
    this.sortSelect = document.getElementById("hedge-sort-select");
    this.paginationContainer = document.getElementById("hedge-pagination");

    // Sub-tabs author selectors
    this.subTabBtns = document.querySelectorAll("[data-hedge-sub]");
  }

  bindEvents() {
    // Sự kiện chuyển đổi sub-tab tác giả
    this.subTabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.subTabBtns.forEach(b => {
          b.classList.remove("active");
          b.style.borderBottomColor = "transparent";
          b.style.color = "var(--text-muted)";
        });
        btn.classList.add("active");
        btn.style.borderBottomColor = "var(--primary)";
        btn.style.color = "var(--text-main)";

        const sub = btn.getAttribute("data-hedge-sub");
        if (sub === "academy") {
          this.posts = this.academyPosts;
          this.filterTopic = "sbv_mistakes";
        } else {
          this.posts = this.nghiaPosts;
          this.filterTopic = "all";
        }

        // Reset bộ lọc & tìm kiếm khi chuyển tác giả
        this.currentPage = 1;
        this.selectedBank = null;
        this.searchQuery = "";
        if (this.searchInput) this.searchInput.value = "";

        // Reset bộ lọc ngân hàng về 'Tất cả'
        this.filterBtns.forEach((b, idx) => {
          if (idx === 0) b.classList.add("active");
          else b.classList.remove("active");
        });
        this.filterMode = "all";

        this.render();
        this.renderDetails(); // Clear chi tiết ngân hàng bên phải
        lucide.createIcons();
      });
    });

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



    // Sự kiện sắp xếp bài viết
    if (this.sortSelect) {
      this.sortSelect.addEventListener("change", (e) => {
        this.sortOrder = e.target.value;
        this.currentPage = 1; // Reset về trang 1
        this.render();
      });
    }

    // Sự kiện đóng Lightbox xem ảnh lớn
    const lightbox = document.getElementById("image-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.getElementById("lightbox-close");

    if (lightbox && lightboxClose && lightboxImg) {
      const closeLightbox = () => {
        lightbox.style.opacity = "0";
        lightboxImg.style.transform = "scale(0.9)";
        setTimeout(() => {
          lightbox.style.display = "none";
        }, 250);
      };

      lightboxClose.addEventListener("click", closeLightbox);
      lightbox.addEventListener("click", (e) => {
        if (e.target !== lightboxImg) {
          closeLightbox();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.style.display === "flex") {
          closeLightbox();
        }
      });
    }

    // Sự kiện mở/đóng URL Web Viewer Modal
    const urlViewer = document.getElementById("url-viewer-modal");
    const urlViewerContent = document.getElementById("url-viewer-content");
    const urlViewerIframe = document.getElementById("url-viewer-iframe");
    const urlViewerClose = document.getElementById("url-viewer-close");
    const urlViewerTitle = document.getElementById("url-viewer-title");
    const urlViewerExternal = document.getElementById("url-viewer-external");

    if (urlViewer && urlViewerClose && urlViewerIframe) {
      const closeUrlViewer = () => {
        urlViewer.style.opacity = "0";
        if (urlViewerContent) urlViewerContent.style.transform = "scale(0.95)";
        setTimeout(() => {
          urlViewer.style.display = "none";
          urlViewerIframe.src = ""; // Xóa src để giải phóng tài nguyên và dừng video/audio
        }, 250);
      };

      urlViewerClose.addEventListener("click", closeUrlViewer);
      urlViewer.addEventListener("click", (e) => {
        if (urlViewerContent && !urlViewerContent.contains(e.target)) {
          closeUrlViewer();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && urlViewer.style.display === "flex") {
          closeUrlViewer();
        }
      });

      // Xuất đối tượng ra window để mở từ bất cứ đâu
      window.openUrlViewer = (url, title = "Trình xem trang web") => {
        // Tự động phát hiện các trang chắc chắn chặn nhúng (Facebook, Instagram, Messenger, Telegram...)
        const lowerUrl = url.toLowerCase();
        const isBlocked = lowerUrl.includes("facebook.com") ||
          lowerUrl.includes("fb.com") ||
          lowerUrl.includes("messenger.com") ||
          lowerUrl.includes("instagram.com") ||
          lowerUrl.includes("t.me") ||
          lowerUrl.includes("telegram.org");

        if (isBlocked) {
          // Mở trực tiếp trong tab mới để tránh hiển thị khung iframe trắng bị lỗi
          window.open(url, "_blank");
          return;
        }

        urlViewerIframe.src = url;
        if (urlViewerTitle) urlViewerTitle.textContent = title;
        if (urlViewerExternal) urlViewerExternal.href = url;

        urlViewer.style.display = "flex";
        urlViewer.offsetHeight; // Lực kích hoạt reflow để tạo hiệu ứng transition
        urlViewer.style.opacity = "1";
        if (urlViewerContent) urlViewerContent.style.transform = "scale(1.0)";
        lucide.createIcons();
      };
    }
  }

  // Nhấn vào một ngân hàng để xem chi tiết bên pane phải
  selectBank(bankCode) {
    this.viewBankAnalysis(bankCode);
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

  // Trình bày bộ lọc chủ đề đồng bộ cho cả hai tác giả
  renderTopicSelectors() {
    const topics = this.topics;
    const container = document.getElementById("hedge-topic-selectors");
    if (!container) return;

    container.innerHTML = topics.map(t => {
      const activeClass = this.filterTopic === t.code ? "active" : "";
      return `
        <button class="hedge-topic-btn law-cat-btn ${activeClass}" data-topic="${t.code}" style="padding: 0.35rem 0.75rem; border-radius: 6px; cursor: pointer; font-size: 0.82rem; font-weight: 500;">
          ${t.display}
        </button>
      `;
    }).join("");

    // Đăng ký lại sự kiện click cho các nút chủ đề động mới sinh
    this.topicBtns = container.querySelectorAll(".hedge-topic-btn");
    this.topicBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.topicBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.filterTopic = btn.getAttribute("data-topic");
        this.currentPage = 1; // Reset về trang 1
        this.render();
      });
    });
  }

  // Render danh sách bài viết bên trái
  render() {
    if (!this.postsListContainer) return;

    // Khởi tạo bộ lọc chủ đề động theo tác giả
    this.renderTopicSelectors();

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

      // Chuyển đổi các URL thô thành thẻ liên kết có thể nhấp được
      const urlRegex = /(https?:\/\/[^\s<]+)/g;
      textHtml = textHtml.replace(urlRegex, `<a class="post-url-link" href="$1" data-url="$1" style="color: var(--primary); text-decoration: underline; word-break: break-all; cursor: pointer;">$1</a>`);

      // Thay thế các bank code thành các button/tag nhấp chuột được
      post.banks.forEach(bankCode => {
        const bankName = typeof BANK_NAMES !== "undefined" ? BANK_NAMES[bankCode] : bankCode;
        const reg = new RegExp(`\\b(${bankCode}|${bankName})\\b`, "gi");
        textHtml = textHtml.replace(reg, `<span class="bank-tag" data-bank="${bankCode}">$1</span>`);
      });

      // Tích hợp liên hệ các thuật ngữ với Từ điển bằng Tooltip
      textHtml = this.highlightGlossaryTerms(textHtml);

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

          <!-- Hiển thị hình ảnh đính kèm (media) nếu có -->
          ${(() => {
          if (!post.media || post.media.length === 0) return '';
          const validMedia = post.media.map(m => m.thumbnail || (m.photo_image ? m.photo_image.uri : null)).filter(url => url);
          if (validMedia.length === 0) return '';

          if (validMedia.length === 1) {
            const imgUrl = validMedia[0];
            return `
                <div class="post-media-item" data-full-img="${imgUrl}" style="margin-top: 0.75rem; margin-bottom: 1rem; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); background: rgba(0,0,0,0.25); display: flex; justify-content: center; align-items: center; max-height: 480px; width: 100%;">
                  <img src="${imgUrl}" alt="Attached media" style="max-height: 480px; width: auto; max-width: 100%; object-fit: contain; cursor: pointer; transition: transform 0.25s ease, filter 0.2s ease; display: block;" onmouseover="this.style.transform='scale(1.015)'; this.style.filter='brightness(0.95)'" onmouseout="this.style.transform='scale(1.0)'; this.style.filter='brightness(1.0)'">
                </div>
              `;
          }

          let gridStyle = "display: grid; gap: 6px; margin-top: 0.75rem; margin-bottom: 1rem; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); width: 100%;";
          if (validMedia.length === 2) {
            gridStyle += "grid-template-columns: 1fr 1fr; max-height: 220px;";
          } else if (validMedia.length === 3) {
            gridStyle += "grid-template-columns: 1.5fr 1fr; grid-template-rows: 1fr 1fr; max-height: 280px;";
          } else {
            gridStyle += "grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; max-height: 280px;";
          }

          const mediaItemsHtml = validMedia.slice(0, 4).map((imgUrl, idx) => {
            let itemStyle = "width: 100%; height: 100%; object-fit: cover; cursor: pointer; transition: transform 0.25s ease, filter 0.2s ease; display: block;";
            let containerStyle = "overflow: hidden; position: relative; width: 100%; height: 100%;";

            if (validMedia.length === 3 && idx === 0) {
              containerStyle += "grid-row: span 2;";
            }

            const isLast = idx === 3 && validMedia.length > 4;
            const overlayHtml = isLast ? `
                <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.2rem; cursor: pointer; pointer-events: none;">
                  +${validMedia.length - 3}
                </div>
              ` : "";

            return `
                <div style="${containerStyle}" class="post-media-item" data-full-img="${imgUrl}">
                  <img src="${imgUrl}" alt="Attached media" style="${itemStyle}" onmouseover="this.style.transform='scale(1.03)'; this.style.filter='brightness(0.9)'" onmouseout="this.style.transform='scale(1.0)'; this.style.filter='brightness(1.0)'">
                  ${overlayHtml}
                </div>
              `;
          }).join("");

          return `<div style="${gridStyle}">${mediaItemsHtml}</div>`;
        })()}

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

    // Đăng ký sự kiện click vào các URL liên kết trong bài viết để mở popup trong ứng dụng
    this.postsListContainer.querySelectorAll(".post-url-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const url = link.getAttribute("data-url");
        if (window.openUrlViewer) {
          window.openUrlViewer(url, url);
        }
      });
    });

    // Đăng ký sự kiện click vào các hình ảnh để mở Lightbox phóng to
    this.postsListContainer.querySelectorAll(".post-media-item").forEach(item => {
      item.addEventListener("click", () => {
        const fullImgUrl = item.getAttribute("data-full-img");
        const lightbox = document.getElementById("image-lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        if (lightbox && lightboxImg && fullImgUrl) {
          lightboxImg.src = fullImgUrl;
          lightbox.style.display = "flex";
          // Trigger reflow
          lightbox.offsetHeight;
          lightbox.style.opacity = "1";
          lightboxImg.style.transform = "scale(1)";
        }
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

  highlightGlossaryTerms(text) {
    if (typeof GLOSSARY_TERMS === "undefined" || !GLOSSARY_TERMS || GLOSSARY_TERMS.length === 0) {
      return text;
    }

    // Bản đồ định nghĩa từ khóa chính xác cho từng thuật ngữ để tránh nhận diện sai
    const termKeywords = {
      car: ["CAR"],
      rwa: ["RWA"],
      tier1: ["Vốn cấp 1", "Tier 1"],
      tier2: ["Vốn cấp 2", "Tier 2"],
      ldr: ["LDR"],
      sfl: ["SFL"],
      amc: ["AMC"],
      lcr: ["LCR"],
      nsfr: ["NSFR"],
      qis: ["QIS"],
      creditrisk: ["Credit Risk", "Rủi ro tín dụng"],
      marketrisk: ["Market Risk", "Rủi ro thị trường"],
      operationalrisk: ["Operational Risk", "Rủi ro hoạt động"],
      npl: ["NPL"],
      basel: ["Basel", "Hiệp ước Basel"],
      nim: ["NIM"],
      casa: ["CASA"],
      cir: ["CIR"],
      llcr: ["LLCR"],
      roe: ["ROE"],
      roa: ["ROA"],
      omo: ["OMO", "Thị trường mở"],
      fed: ["FED", "Fed"],
      sbv: ["SBV", "NHNN"],
      cof: ["COF"],
      alm: ["ALM"],
      qe_qt: ["QE & QT", "QE", "QT"],
      ust: ["UST"],
      tga: ["TGA"],
      dxy: ["DXY"],
      frm: ["FRM"],
      hpr: ["HPR"],
      cp: ["Counterparty", "đối tác giao dịch"], // Không khớp "CP" độc lập vì dễ trùng với "Cổ phần" / "Chính phủ"
      tarf: ["TARF"]
    };

    let result = text;
    const termMappings = [];

    GLOSSARY_TERMS.forEach(item => {
      // Sử dụng danh sách từ khóa tường minh nếu có cấu hình
      const keywords = termKeywords[item.id];
      if (keywords) {
        keywords.forEach(kw => {
          termMappings.push({
            keyword: kw,
            item: item
          });
        });
      } else {
        // Fallback tự động nhưng an toàn: chỉ lấy từ viết tắt viết hoa từ 2 ký tự trở lên
        const match = item.term.match(/^([A-Z]{2,})\b/);
        if (match) {
          termMappings.push({
            keyword: match[1],
            item: item
          });
        }
      }
    });

    // Sắp xếp các từ khóa theo độ dài giảm dần để tránh thay thế đè cụm từ ngắn
    termMappings.sort((a, b) => b.keyword.length - a.keyword.length);

    termMappings.forEach(mapping => {
      const kw = mapping.keyword;
      const definition = mapping.item.definition;
      const termTitle = mapping.item.term;

      const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      
      // Biểu thức regex tìm kiếm từ khóa an toàn:
      // Group 1: khớp các thẻ span tooltip đã có để bỏ qua, tránh lồng nhau
      // Group 2: khớp các thẻ HTML thông thường để bỏ qua
      // Group 3: khớp từ khóa độc lập nằm ngoài thẻ HTML (hỗ trợ tiếng Việt có dấu làm word boundary)
      const regex = new RegExp(`(<span class="glossary-term-tooltip"[^>]*>[\\s\\S]*?<\\/span>)|(<[^>]*>)|(?:^|[^a-zA-Z0-9_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝỲÝỶỸỴàáâãèéêìíòóôõùúýỳýỷỹỵĂăĐđĨĩŨũƠơƯưẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾếỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰự])(${escapedKw})(?:$|[^a-zA-Z0-9_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝỲÝỶỸỴàáâãèéêìíòóôõùúýỳýỷỹỵĂăĐđĨĩŨũƠơƯưẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾếỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰự])`, "gi");

      result = result.replace(regex, (match, p1, p2, p3) => {
        if (p1 || p2) return match; // Bỏ qua nếu thuộc thẻ HTML hoặc span đã được xử lý
        
        // p3 là từ khóa trùng khớp
        const startIndex = match.indexOf(p3);
        const prefix = match.substring(0, startIndex);
        const suffix = match.substring(startIndex + p3.length);
        
        return `${prefix}<span class="glossary-term-tooltip" data-term-id="${mapping.item.id}" data-term-title="${termTitle}" data-term-def="${definition}">${p3}</span>${suffix}`;
      });
    });

    return result;
  }
}

// Tự động khởi tạo khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  window.discussionInsights = new DiscussionInsights();
});
