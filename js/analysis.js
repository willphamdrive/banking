const BANK_DATABASE = window.BANK_DATABASE;

class BaselAnalysis {
  constructor() {
    this.currentSubTab = "car-analysis";
    this.currentCarSub = "individual";
    
    // Trạng thái Phân tích Đơn lẻ
    this.indBank = "TCB";
    this.indYear = "series";
    this.indYScale = "auto"; // Mặc định tự động co giãn trục Y
    this.indYTick = 1; // Bước chia tick: 1% mặc định
    this.indMetric = "car"; // Chỉ số phân tích đơn lẻ mặc định: car
    
    // Trạng thái So sánh Đối chiếu
    this.compBanks = ["TCB", "VCB", "BID", "MBB"];
    this.compYear = "series";
    this.compYScale = "auto"; // Mặc định tự động co giãn trục Y (Zoom)
    this.compYTick = 1; // Bước chia tick: 1% mặc định
    this.compMetric = "car"; // Chỉ số so sánh đối chiếu mặc định: car

    // Quản lý các phiên bản Chart.js active để destroy khi redraw
    this.charts = {};

    // Trạng thái Phân tích các Tỷ lệ An toàn khác
    this.ratioBank = "TCB";
    this.ratioYear = "series";
    this.currentRatioSub = "individual";
    this.ratioCompBanks = ["TCB", "VCB", "BID", "MBB"];
    this.ratioCompYear = "series";

    this.initElements();
    this.bindEvents();
    this.setupChartTheme();
    
    // Render ban đầu
    this.renderIndividualAnalysis();
    this.renderCompareAnalysis();
    this.renderRatioAnalysis();
  }

  initElements() {
    this.section = document.getElementById("bank-analysis-section");
    if (!this.section) return;

    // Sub-tab buttons
    this.subTabBtns = this.section.querySelectorAll(".sub-tab-btn");
    this.subTabPanels = this.section.querySelectorAll(".sub-tab-panel");

    // CAR Sub-sub-tabs
    this.carSubTabBtns = this.section.querySelectorAll(".car-sub-tab-btn");
    this.carIndividualPanel = document.getElementById("car-individual-panel");
    this.carComparePanel = document.getElementById("car-compare-panel");

    // Phân tích Đơn lẻ Controllers
    this.indBankSelect = document.getElementById("analysis-bank-select");
    this.indYearBtns = this.section.querySelectorAll("#analysis-year-selectors .year-btn");
    this.indRender = document.getElementById("individual-analysis-render");

    // So sánh Đối chiếu Controllers
    this.compCheckboxes = this.section.querySelectorAll("#compare-banks-checkboxes input");
    this.compYearBtns = this.section.querySelectorAll("#compare-year-selectors .year-btn");
    this.compRender = document.getElementById("compare-analysis-render");

    // Các Tỷ lệ An toàn khác Controllers
    this.ratioBankSelect = document.getElementById("ratio-bank-select");
    this.ratioYearBtns = this.section.querySelectorAll("#ratio-year-selectors .year-btn");
    this.ratioRender = document.getElementById("ratio-analysis-render");

    this.ratioSubTabBtns = this.section.querySelectorAll(".ratio-sub-tab-btn");
    this.ratioIndividualControls = document.getElementById("ratio-individual-controls");
    this.ratioCompareControls = document.getElementById("ratio-compare-controls");
    this.ratioCompCheckboxes = this.section.querySelectorAll("#ratio-compare-banks-checkboxes input");
    this.ratioCompYearBtns = this.section.querySelectorAll("#ratio-compare-year-selectors .year-btn");
    this.ratioCompYScaleSelect = document.getElementById("ratio-compare-y-scale-select");
    this.ratioCompYTickSelect = document.getElementById("ratio-compare-y-tick-select");
  }

  bindEvents() {
    // 1. Chuyển đổi Sub-tab lớn (Phân tích CAR vs Các Tỷ lệ An toàn khác BCTC)
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

        const subTabId = btn.getAttribute("data-subtab");
        this.currentSubTab = subTabId;

        this.subTabPanels.forEach(panel => {
          if (panel.id === `${subTabId}-tab-content`) {
            panel.classList.remove("hidden");
          } else {
            panel.classList.add("hidden");
          }
        });
        
        lucide.createIcons();
        this.renderIndividualAnalysis();
        this.renderCompareAnalysis();
        this.renderRatioAnalysis();
      });
    });

    // 1.1. Chuyển đổi Sub-tab nhỏ trong Phân tích CAR
    this.carSubTabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.carSubTabBtns.forEach(b => {
          b.style.background = "rgba(255,255,255,0.05)";
          b.style.color = "var(--text-muted)";
        });
        btn.style.background = "var(--primary)";
        btn.style.color = "white";

        const subTabId = btn.getAttribute("data-carsub");
        this.currentCarSub = subTabId;

        if (subTabId === "individual") {
          this.carIndividualPanel.classList.remove("hidden");
          this.carComparePanel.classList.add("hidden");
        } else {
          this.carIndividualPanel.classList.add("hidden");
          this.carComparePanel.classList.remove("hidden");
        }

        lucide.createIcons();
        this.renderIndividualAnalysis();
        this.renderCompareAnalysis();
      });
    });

    // 2. Event Phân tích Đơn lẻ (Đồng bộ với Ratios Đơn lẻ)
    if (this.indBankSelect) {
      this.indBankSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        this.indBank = value;
        this.ratioBank = value;
        if (this.ratioBankSelect) this.ratioBankSelect.value = value;
        this.renderIndividualAnalysis();
        this.renderRatioAnalysis();
      });
    }

    this.indYearBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const value = btn.getAttribute("data-year");
        this.indYear = value;
        this.ratioYear = value;
        
        this.indYearBtns.forEach(b => {
          if (b.getAttribute("data-year") === value) b.classList.add("active");
          else b.classList.remove("active");
        });
        this.ratioYearBtns.forEach(b => {
          if (b.getAttribute("data-year") === value) b.classList.add("active");
          else b.classList.remove("active");
        });

        this.renderIndividualAnalysis();
        this.renderRatioAnalysis();
      });
    });

    // 3. Event So sánh Đối chiếu (Đồng bộ với Ratios So sánh)
    const selectAllCb = document.getElementById("compare-select-all");
    if (selectAllCb) {
      selectAllCb.addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        this.compCheckboxes.forEach(cb => cb.checked = isChecked);
        this.ratioCompCheckboxes.forEach(cb => cb.checked = isChecked);

        if (!isChecked) {
          this.compCheckboxes[0].checked = true;
          this.compCheckboxes[1].checked = true;
          this.ratioCompCheckboxes[0].checked = true;
          this.ratioCompCheckboxes[1].checked = true;
          selectAllCb.checked = false;
          if (ratioSelectAllCb) ratioSelectAllCb.checked = false;
        }

        const checked = Array.from(this.compCheckboxes)
          .filter(c => c.checked)
          .map(c => c.value);

        this.compBanks = checked;
        this.ratioCompBanks = checked;
        this.renderCompareAnalysis();
        this.renderRatioAnalysis();
      });
    }

    this.compCheckboxes.forEach(cb => {
      cb.addEventListener("change", () => {
        const checked = Array.from(this.compCheckboxes)
          .filter(c => c.checked)
          .map(c => c.value);
        
        if (checked.length < 2) {
          cb.checked = true;
          alert("Vui lòng chọn tối thiểu 2 ngân hàng để so sánh đối chiếu!");
          return;
        }

        this.compCheckboxes.forEach(c => c.checked = checked.includes(c.value));
        this.ratioCompCheckboxes.forEach(c => c.checked = checked.includes(c.value));

        if (selectAllCb) selectAllCb.checked = (checked.length === this.compCheckboxes.length);
        if (ratioSelectAllCb) ratioSelectAllCb.checked = (checked.length === this.ratioCompCheckboxes.length);

        this.compBanks = checked;
        this.ratioCompBanks = checked;
        this.renderCompareAnalysis();
        this.renderRatioAnalysis();
      });
    });

    this.compYearBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const value = btn.getAttribute("data-year");
        this.compYear = value;
        this.ratioCompYear = value;

        this.compYearBtns.forEach(b => {
          if (b.getAttribute("data-year") === value) b.classList.add("active");
          else b.classList.remove("active");
        });
        this.ratioCompYearBtns.forEach(b => {
          if (b.getAttribute("data-year") === value) b.classList.add("active");
          else b.classList.remove("active");
        });

        this.renderCompareAnalysis();
        this.renderRatioAnalysis();
      });
    });

    // Lắng nghe sự kiện thay đổi tỷ lệ trục dọc (Y-Scale) - Trang Phân tích Đơn lẻ
    const indYScaleSelect = document.getElementById("individual-y-scale-select");
    if (indYScaleSelect) {
      indYScaleSelect.addEventListener("change", (e) => {
        this.indYScale = e.target.value;
        this.renderIndividualAnalysis();
      });
    }

    // Lắng nghe sự kiện thay đổi tỷ lệ trục dọc (Y-Scale) - Trang So sánh Đối chiếu (Đồng bộ với Ratios)
    const compYScaleSelect = document.getElementById("compare-y-scale-select");
    if (compYScaleSelect) {
      compYScaleSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        this.compYScale = value;
        if (this.ratioCompYScaleSelect) this.ratioCompYScaleSelect.value = value;
        this.renderCompareAnalysis();
        this.renderRatioAnalysis();
      });
    }

    // Lắng nghe sự kiện thay đổi bước chia tick trục dọc - Trang Phân tích Đơn lẻ
    const indYTickSelect = document.getElementById("individual-y-tick-select");
    if (indYTickSelect) {
      indYTickSelect.addEventListener("change", (e) => {
        this.indYTick = parseFloat(e.target.value);
        this.renderIndividualAnalysis();
      });
    }

    // Lắng nghe sự kiện thay đổi bước chia tick trục dọc - Trang So sánh Đối chiếu (Đồng bộ với Ratios)
    const compYTickSelect = document.getElementById("compare-y-tick-select");
    if (compYTickSelect) {
      compYTickSelect.addEventListener("change", (e) => {
        const value = parseFloat(e.target.value);
        this.compYTick = value;
        if (this.ratioCompYTickSelect) this.ratioCompYTickSelect.value = value.toString();
        this.renderCompareAnalysis();
        this.renderRatioAnalysis();
      });
    }



    // Lắng nghe sự kiện đổi theme để vẽ lại biểu đồ
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        setTimeout(() => {
          this.setupChartTheme();
          this.renderIndividualAnalysis();
          this.renderCompareAnalysis();
          this.renderRatioAnalysis();
        }, 100);
      });
    }

    // 4. Event Các Tỷ lệ An toàn khác (BCTC)
    // 4.1. Chuyển đổi Sub-tab nhỏ (Đơn lẻ vs So sánh)
    this.ratioSubTabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.ratioSubTabBtns.forEach(b => {
          b.style.background = "rgba(255,255,255,0.05)";
          b.style.color = "var(--text-muted)";
        });
        btn.style.background = "var(--primary)";
        btn.style.color = "white";

        const subTabId = btn.getAttribute("data-ratiosub");
        this.currentRatioSub = subTabId;

        if (subTabId === "individual") {
          this.ratioIndividualControls.classList.remove("hidden");
          this.ratioCompareControls.classList.add("hidden");
        } else {
          this.ratioIndividualControls.classList.add("hidden");
          this.ratioCompareControls.classList.remove("hidden");
        }
        
        lucide.createIcons();
        this.renderRatioAnalysis();
      });
    });

    // 4.2. Event Đơn lẻ (Đồng bộ với Phân tích đơn lẻ CAR)
    if (this.ratioBankSelect) {
      this.ratioBankSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        this.indBank = value;
        this.ratioBank = value;
        if (this.indBankSelect) this.indBankSelect.value = value;
        this.renderIndividualAnalysis();
        this.renderRatioAnalysis();
      });
    }

    this.ratioYearBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const value = btn.getAttribute("data-year");
        this.indYear = value;
        this.ratioYear = value;
        
        this.indYearBtns.forEach(b => {
          if (b.getAttribute("data-year") === value) b.classList.add("active");
          else b.classList.remove("active");
        });
        this.ratioYearBtns.forEach(b => {
          if (b.getAttribute("data-year") === value) b.classList.add("active");
          else b.classList.remove("active");
        });

        this.renderIndividualAnalysis();
        this.renderRatioAnalysis();
      });
    });

    // 4.3. Event So sánh đối chiếu (Đồng bộ với So sánh đối chiếu CAR)
    const ratioSelectAllCb = document.getElementById("ratio-compare-select-all");
    if (ratioSelectAllCb) {
      ratioSelectAllCb.addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        this.compCheckboxes.forEach(cb => cb.checked = isChecked);
        this.ratioCompCheckboxes.forEach(cb => cb.checked = isChecked);

        if (!isChecked) {
          this.compCheckboxes[0].checked = true;
          this.compCheckboxes[1].checked = true;
          this.ratioCompCheckboxes[0].checked = true;
          this.ratioCompCheckboxes[1].checked = true;
          if (selectAllCb) selectAllCb.checked = false;
          ratioSelectAllCb.checked = false;
        }

        const checked = Array.from(this.ratioCompCheckboxes)
          .filter(c => c.checked)
          .map(c => c.value);

        this.compBanks = checked;
        this.ratioCompBanks = checked;
        this.renderCompareAnalysis();
        this.renderRatioAnalysis();
      });
    }

    this.ratioCompCheckboxes.forEach(cb => {
      cb.addEventListener("change", () => {
        const checked = Array.from(this.ratioCompCheckboxes)
          .filter(c => c.checked)
          .map(c => c.value);
        
        if (checked.length < 2) {
          cb.checked = true;
          alert("Vui lòng chọn tối thiểu 2 ngân hàng để so sánh đối chiếu!");
          return;
        }

        this.compCheckboxes.forEach(c => c.checked = checked.includes(c.value));
        this.ratioCompCheckboxes.forEach(c => c.checked = checked.includes(c.value));

        if (selectAllCb) selectAllCb.checked = (checked.length === this.compCheckboxes.length);
        if (ratioSelectAllCb) ratioSelectAllCb.checked = (checked.length === this.ratioCompCheckboxes.length);

        this.compBanks = checked;
        this.ratioCompBanks = checked;
        this.renderCompareAnalysis();
        this.renderRatioAnalysis();
      });
    });

    this.ratioCompYearBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const value = btn.getAttribute("data-year");
        this.compYear = value;
        this.ratioCompYear = value;

        this.compYearBtns.forEach(b => {
          if (b.getAttribute("data-year") === value) b.classList.add("active");
          else b.classList.remove("active");
        });
        this.ratioCompYearBtns.forEach(b => {
          if (b.getAttribute("data-year") === value) b.classList.add("active");
          else b.classList.remove("active");
        });

        this.renderCompareAnalysis();
        this.renderRatioAnalysis();
      });
    });

    // 4.4. Event Trục dọc và Bước chia của Ratios
    if (this.ratioCompYScaleSelect) {
      this.ratioCompYScaleSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        this.compYScale = value;
        const mainSelect = document.getElementById("compare-y-scale-select");
        if (mainSelect) mainSelect.value = value;
        this.renderCompareAnalysis();
        this.renderRatioAnalysis();
      });
    }

    if (this.ratioCompYTickSelect) {
      this.ratioCompYTickSelect.addEventListener("change", (e) => {
        const value = parseFloat(e.target.value);
        this.compYTick = value;
        const mainSelect = document.getElementById("compare-y-tick-select");
        if (mainSelect) mainSelect.value = value;
        this.renderCompareAnalysis();
        this.renderRatioAnalysis();
      });
    }
  }

  // Lấy giá trị của chỉ số cụ thể từ dữ liệu năm
  getMetricValueForData(yearData, metric) {
    if (!yearData) return null;
    if (metric === "car") return yearData.car;
    if (metric === "charter_rwa") return (yearData.charter / yearData.rwa) * 100;
    if (metric === "charter_capital") return (yearData.charter / yearData.capital) * 100;
    if (metric === "capital") return yearData.capital;
    if (metric === "rwa") return yearData.rwa;
    return null;
  }

  getMetricLabel(metric) {
    if (metric === "car") return "Tỷ lệ CAR (%)";
    if (metric === "charter_rwa") return "Vốn điều lệ / RWA (%)";
    if (metric === "charter_capital") return "Vốn điều lệ / Vốn tự có (%)";
    if (metric === "capital") return "Vốn tự có (Tỷ VND)";
    if (metric === "rwa") return "Tổng RWA (Tỷ VND)";
    return "";
  }

  getMetricUnit(metric) {
    if (metric === "capital" || metric === "rwa") return " Tỷ VND";
    return "%";
  }

  // Cấu hình phông chữ và màu sắc trục tọa độ Chart.js phù hợp chế độ giao diện sáng/tối
  setupChartTheme() {
    if (!window.Chart) return;
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const textThemeColor = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(15, 23, 42, 0.7)";
    const gridThemeColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";

    Chart.defaults.color = textThemeColor;
    Chart.defaults.borderColor = gridThemeColor;
    Chart.defaults.font.family = "'Outfit', sans-serif";

    // Hỗ trợ click vào điểm dữ liệu trên chart để mở BCTC
    Chart.defaults.onClick = (event, elements, chart) => {
      if (!elements || elements.length === 0) return;
      const element = elements[0];
      const chartData = chart.data;
      const dataset = chartData.datasets[element.datasetIndex];
      
      let bank = null;
      let year = null;
      
      const xLabel = chartData.labels[element.index];
      const isYear = typeof xLabel === 'string' && /^(20\d{2})$/.test(xLabel);
      
      const getBankFromLabel = (labelStr) => {
        if (!labelStr) return null;
        let found = null;
        Object.keys(window.BANK_DATABASE).forEach(code => {
          if (labelStr === code || labelStr.includes(`(${code})`) || labelStr.includes(window.BANK_DATABASE[code].name)) {
            found = code;
          }
        });
        return found;
      };

      const isFinancialSection = document.getElementById("financial-analysis-section") && !document.getElementById("financial-analysis-section").classList.contains("hidden");
      const isBankActive = document.getElementById("bank-analysis-section") && !document.getElementById("bank-analysis-section").classList.contains("hidden");

      if (isFinancialSection) {
        const finAnalysis = window.financialAnalysis;
        if (finAnalysis) {
          if (finAnalysis.currentSubTab === "financial-analysis") {
            bank = finAnalysis.indBank;
            year = isYear ? xLabel : finAnalysis.indYear;
          } else {
            if (isYear) {
              year = xLabel;
              bank = dataset.shortLabel || getBankFromLabel(dataset.label);
            } else {
              bank = getBankFromLabel(xLabel);
              year = finAnalysis.compYear;
            }
          }
        }
      } else if (isBankActive) {
        const bAnalysis = window.baselAnalysis;
        if (bAnalysis) {
          const isCarTab = bAnalysis.currentSubTab === "car-analysis";
          if (isCarTab) {
            if (bAnalysis.currentCarSub === "individual") {
              bank = bAnalysis.indBank;
              year = isYear ? xLabel : bAnalysis.indYear;
            } else {
              if (isYear) {
                year = xLabel;
                bank = dataset.shortLabel || getBankFromLabel(dataset.label);
              } else {
                bank = getBankFromLabel(xLabel);
                year = bAnalysis.compYear;
              }
            }
          } else {
            // regulatory-ratios
            if (bAnalysis.currentRatioSub === "individual") {
              bank = bAnalysis.ratioBank;
              year = isYear ? xLabel : bAnalysis.ratioYear;
            } else {
              if (isYear) {
                year = xLabel;
                bank = dataset.shortLabel || getBankFromLabel(dataset.label);
              } else {
                bank = getBankFromLabel(xLabel);
                year = bAnalysis.ratioCompYear;
              }
            }
          }
        }
      }

      // Check fallback bank if not found from dataset in Time Series charts
      if (isYear && !bank) {
        if (isFinancialSection && window.financialAnalysis) {
          bank = window.financialAnalysis.indBank;
        } else if (isBankActive && window.baselAnalysis) {
          const bAnalysis = window.baselAnalysis;
          if (bAnalysis.currentSubTab === "car-analysis") {
            bank = bAnalysis.indBank;
          } else {
            bank = bAnalysis.ratioBank;
          }
        }
      }

      if (bank && year && year !== "series") {
        const bankInfo = window.BANK_DATABASE[bank];
        if (bankInfo && bankInfo.bctc_files && bankInfo.bctc_files[year]) {
          const filename = bankInfo.bctc_files[year];
          if (window.documentFinder) {
            window.documentFinder.openPdfViewer(`docs/banks_bctc/${filename}`, `${bankInfo.name} - BCTC ${year}`);
          }
        }
      }
    };

    // Đổi cursor thành pointer khi hover vào cột/điểm trên chart
    Chart.defaults.onHover = (event, chartElement) => {
      event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
    };
  }

  // Hủy instance Chart.js cũ để tránh lỗi chồng chéo canvas
  destroyChart(key) {
    if (this.charts[key]) {
      this.charts[key].destroy();
      delete this.charts[key];
    }
  }

  // Biến bảng thường thành bảng sắp xếp được khi click vào header
  setupSortableTable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const headers = table.querySelectorAll('thead th');
    const tbody = table.querySelector('tbody');
    let sortState = { col: -1, asc: true };

    headers.forEach((th, colIdx) => {
      th.style.cursor = 'pointer';
      th.style.userSelect = 'none';
      th.title = 'Click để sắp xếp';
      // Thêm span icon điều hướng
      const icon = document.createElement('span');
      icon.className = 'sort-icon';
      icon.style.cssText = 'margin-left:4px;opacity:0.35;font-size:0.75em;transition:opacity 0.15s';
      icon.textContent = '⇅';
      th.appendChild(icon);

      th.addEventListener('click', () => {
        const isActive = sortState.col === colIdx;
        sortState.asc = isActive ? !sortState.asc : true;
        sortState.col = colIdx;

        // Cập nhật icon
        headers.forEach((h, i) => {
          const ic = h.querySelector('.sort-icon');
          if (!ic) return;
          if (i === colIdx) {
            ic.textContent = sortState.asc ? '▲' : '▼';
            ic.style.opacity = '1';
            ic.style.color = 'var(--primary)';
          } else {
            ic.textContent = '⇅';
            ic.style.opacity = '0.35';
            ic.style.color = '';
          }
        });

        // Sắp xếp rows
        const rows = Array.from(tbody.querySelectorAll('tr'));
        rows.sort((a, b) => {
          const aCell = a.cells[colIdx];
          const bCell = b.cells[colIdx];
          if (!aCell || !bCell) return 0;
          const aText = aCell.textContent.replace(/[%,\s]/g, '').trim();
          const bText = bCell.textContent.replace(/[%,\s]/g, '').trim();
          const aNum = parseFloat(aText);
          const bNum = parseFloat(bText);
          const useNum = !isNaN(aNum) && !isNaN(bNum);
          const cmp = useNum ? aNum - bNum : aText.localeCompare(bText, 'vi');
          return sortState.asc ? cmp : -cmp;
        });

        // Tái chèn với hiệu ứng mờ dần
        tbody.style.opacity = '0.3';
        setTimeout(() => {
          rows.forEach(r => tbody.appendChild(r));
          tbody.style.transition = 'opacity 0.18s';
          tbody.style.opacity = '1';
        }, 80);
      });
    });
  }

  attachRatioTableClickHandlers() {
    // Helper to open PDF
    const openPdf = (bankCode, year, type = "bctc") => {
      const bankInfo = BANK_DATABASE[bankCode];
      if (!bankInfo) return;
      if (type === "car") {
        const carFile = bankInfo.car_data && bankInfo.car_data[year] && bankInfo.car_data[year].pdf;
        if (carFile) {
          window.documentFinder.openPdfViewer(`docs/banks/${carFile}`, `${bankInfo.name} - Báo cáo CAR năm ${year}`);
          return;
        }
      }
      // Fallback or explicit BCTC
      const bctcFile = bankInfo.bctc_files && bankInfo.bctc_files[year];
      if (bctcFile) {
        window.documentFinder.openPdfViewer(`docs/banks_bctc/${bctcFile}`, `${bankInfo.name} - BCTC ${year}`);
      }
    };

    // 1. CAR Ind Yearly Table
    const carIndYearly = document.getElementById("car-ind-yearly-table");
    if (carIndYearly) {
      const bankInfo = BANK_DATABASE[this.indBank];
      if (bankInfo) {
        const rows = carIndYearly.querySelectorAll("tbody tr");
        rows.forEach((row, rIdx) => {
          const td = row.cells[1]; // Value column
          if (td && td.textContent.trim() !== "" && td.textContent.trim() !== "-") {
            td.style.cursor = "pointer";
            td.style.textDecoration = "underline dashed var(--primary)";
            td.addEventListener("click", () => {
              openPdf(this.indBank, this.indYear, rIdx === 0 ? "car" : "bctc");
            });
          }
        });
      }
    }

    // 2. CAR Ind Series Table
    const carIndSeries = document.getElementById("car-ind-series-table");
    if (carIndSeries) {
      const bankInfo = BANK_DATABASE[this.indBank];
      if (bankInfo) {
        const rows = carIndSeries.querySelectorAll("tbody tr");
        rows.forEach(row => {
          const yearCell = row.cells[0];
          if (!yearCell) return;
          const y = yearCell.textContent.trim().replace(/[^0-9]/g, '');
          
          for (let i = 0; i < row.cells.length; i++) {
            const td = row.cells[i];
            if (td && td.textContent.trim() !== "" && td.textContent.trim() !== "-") {
              td.style.cursor = "pointer";
              td.style.textDecoration = "underline dashed var(--primary)";
              td.addEventListener("click", () => {
                openPdf(this.indBank, y, (i <= 1) ? "car" : "bctc");
              });
            }
          }
        });
      }
    }

    // 3. CAR Compare Yearly Table (comp-detail-table)
    const carCompYearly = document.getElementById("comp-detail-table");
    if (carCompYearly) {
      const rows = carCompYearly.querySelectorAll("tbody tr");
      rows.forEach(row => {
        const bankCell = row.cells[0];
        if (!bankCell) return;
        const matches = bankCell.textContent.match(/\(([^)]+)\)/);
        const bankCode = matches ? matches[1] : null;
        if (!bankCode) return;
        
        for (let i = 0; i < row.cells.length; i++) {
          const td = row.cells[i];
          if (td && td.textContent.trim() !== "" && !td.textContent.includes("chưa công bố")) {
            td.style.cursor = "pointer";
            td.style.textDecoration = "underline dashed var(--primary)";
            td.addEventListener("click", () => {
              openPdf(bankCode, this.compYear, (i <= 1) ? "car" : "bctc");
            });
          }
        }
      });
    }

    // 4. CAR Compare Series Table (comp-trend-table)
    const carCompSeries = document.getElementById("comp-trend-table");
    if (carCompSeries) {
      const years = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"];
      const rows = carCompSeries.querySelectorAll("tbody tr");
      rows.forEach(row => {
        const bankCell = row.cells[0];
        if (!bankCell) return;
        const matches = bankCell.textContent.match(/\(([^)]+)\)/);
        const bankCode = matches ? matches[1] : null;
        if (!bankCode) return;
        
        bankCell.style.cursor = "pointer";
        bankCell.style.textDecoration = "underline dashed var(--primary)";
        bankCell.addEventListener("click", () => {
          openPdf(bankCode, "2025", "car");
        });

        years.forEach((y, yIdx) => {
          const td = row.cells[yIdx + 1];
          if (td && td.textContent.trim() !== "" && td.textContent.trim() !== "-") {
            td.style.cursor = "pointer";
            td.style.textDecoration = "underline dashed var(--primary)";
            td.addEventListener("click", () => {
              openPdf(bankCode, y, "car");
            });
          }
        });
      });
    }

    // 5. Ratio Compare Yearly Table
    const ratioCompYearly = document.getElementById("ratio-comp-detail-table");
    if (ratioCompYearly) {
      const rows = ratioCompYearly.querySelectorAll("tbody tr");
      rows.forEach(row => {
        const bankCell = row.querySelector("td:nth-child(1)");
        if (!bankCell) return;
        const matches = bankCell.textContent.match(/\(([^)]+)\)/);
        const bankCode = matches ? matches[1] : null;
        if (!bankCode) return;
        
        const bankInfo = BANK_DATABASE[bankCode];
        if (!bankInfo) return;
        
        const bctcFile = bankInfo.bctc_files && bankInfo.bctc_files[this.ratioCompYear];
        if (bctcFile) {
          for (let i = 1; i <= 4; i++) {
            const td = row.cells[i];
            if (td && td.textContent.trim() !== "" && td.textContent.trim() !== "-") {
              td.style.cursor = "pointer";
              td.style.textDecoration = "underline dashed var(--primary)";
              td.addEventListener("click", () => {
                openPdf(bankCode, this.ratioCompYear, "bctc");
              });
            }
          }
          bankCell.style.cursor = "pointer";
          bankCell.style.textDecoration = "underline dashed var(--primary)";
          bankCell.addEventListener("click", () => {
            openPdf(bankCode, this.ratioCompYear, "bctc");
          });
        }
      });
    }

    // 6. Ratio Compare Series Table
    const ratioCompSeries = document.getElementById("ratio-comp-series-table");
    if (ratioCompSeries) {
      const years = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"];
      const rows = ratioCompSeries.querySelectorAll("tbody tr");
      rows.forEach(row => {
        const bankCell = row.querySelector("td:nth-child(1)");
        if (!bankCell) return;
        const matches = bankCell.textContent.match(/\(([^)]+)\)/);
        const bankCode = matches ? matches[1] : null;
        if (!bankCode) return;
        
        const bankInfo = BANK_DATABASE[bankCode];
        if (!bankInfo) return;
        
        years.forEach((y, yIdx) => {
          const bctcFile = bankInfo.bctc_files && bankInfo.bctc_files[y];
          if (bctcFile) {
            const td = row.cells[yIdx + 1];
            if (td && td.textContent.trim() !== "" && td.textContent.trim() !== "-") {
              td.style.cursor = "pointer";
              td.style.textDecoration = "underline dashed var(--primary)";
              td.addEventListener("click", () => {
                openPdf(bankCode, y, "bctc");
              });
            }
          }
        });
      });
    }

    // 7. Ratio Ind Series Table
    const ratioIndSeries = document.getElementById("ratio-ind-series-table");
    if (ratioIndSeries) {
      const bankInfo = BANK_DATABASE[this.ratioBank];
      if (bankInfo) {
        const rows = ratioIndSeries.querySelectorAll("tbody tr");
        rows.forEach(row => {
          const yearCell = row.querySelector("td:nth-child(1)");
          if (!yearCell) return;
          const y = yearCell.textContent.trim().replace(/[^0-9]/g, '');
          const bctcFile = bankInfo.bctc_files && bankInfo.bctc_files[y];
          if (bctcFile) {
            for (let i = 0; i <= 4; i++) {
              const td = row.cells[i];
              if (td && td.textContent.trim() !== "" && td.textContent.trim() !== "-") {
                td.style.cursor = "pointer";
                td.style.textDecoration = "underline dashed var(--primary)";
                td.addEventListener("click", () => {
                  openPdf(this.ratioBank, y, "bctc");
                });
              }
            }
          }
        });
      }
    }

    // 8. Ratio Ind Yearly Table
    const ratioIndYearly = document.getElementById("ratio-ind-yearly-table");
    if (ratioIndYearly) {
      const bankInfo = BANK_DATABASE[this.ratioBank];
      if (bankInfo) {
        const bctcFile = bankInfo.bctc_files && bankInfo.bctc_files[this.ratioYear];
        if (bctcFile) {
          const rows = ratioIndYearly.querySelectorAll("tbody tr");
          rows.forEach(row => {
            const td = row.cells[2]; // column 3 is actual value
            if (td && td.textContent.trim() !== "" && td.textContent.trim() !== "-") {
              td.style.cursor = "pointer";
              td.style.textDecoration = "underline dashed var(--primary)";
              td.addEventListener("click", () => {
                openPdf(this.ratioBank, this.ratioYear, "bctc");
              });
            }
          });
        }
      }
    }
  }

  // Custom Chart.js plugin: vẽ tên viết tắt NH tại điểm cuối cùng của mỗi line,
  // với collision avoidance đẩy label lên/xuống khi các đường quá gần nhau.
  getEndLabelPlugin() {
    return {
      id: 'endLabel',
      afterDatasetsDraw(chart) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;

        const gathered = [];

        chart.data.datasets.forEach((dataset, i) => {
          if (!dataset.shortLabel) return; // chỉ xử lý dataset có shortLabel
          const meta = chart.getDatasetMeta(i);
          if (meta.hidden) return;

          // Tìm điểm cuối cùng không null
          let lastIdx = -1;
          for (let j = dataset.data.length - 1; j >= 0; j--) {
            if (dataset.data[j] !== null && dataset.data[j] !== undefined) {
              lastIdx = j;
              break;
            }
          }
          if (lastIdx === -1) return;

          const point = meta.data[lastIdx];
          if (!point) return;

          gathered.push({
            x: point.x,
            y: point.y,
            origY: point.y,
            text: dataset.shortLabel,
            value: dataset.data[lastIdx],
            color: dataset.borderColor
          });
        });

        // Sắp xếp theo Y (trên → dưới = nhỏ → lớn)
        gathered.sort((a, b) => a.y - b.y);

        // Collision avoidance: đẩy label tránh chồng lấn, ưu tiên giữ gần vị trí gốc
        const minGap = 15; // pixel tối thiểu giữa 2 label
        for (let i = 1; i < gathered.length; i++) {
          if (gathered[i].y - gathered[i - 1].y < minGap) {
            gathered[i].y = gathered[i - 1].y + minGap;
          }
        }
        // Pass ngược: đảm bảo không đẩy quá lên phía trên
        for (let i = gathered.length - 2; i >= 0; i--) {
          if (gathered[i + 1].y - gathered[i].y < minGap) {
            gathered[i].y = gathered[i + 1].y - minGap;
          }
        }

        // Vẽ labels
        gathered.forEach(item => {
          const labelX = item.x + 10;
          const labelY = item.y;

          ctx.save();

          // Connector line từ điểm thực → label nếu label bị đẩy lệch
          if (Math.abs(labelY - item.origY) > 4) {
            ctx.beginPath();
            ctx.moveTo(item.x + 4, item.origY);
            ctx.lineTo(labelX, labelY);
            ctx.strokeStyle = item.color + '80';
            ctx.lineWidth = 0.8;
            ctx.setLineDash([2, 2]);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // Background pill cho dễ đọc
          ctx.font = 'bold 10.5px Inter, system-ui, sans-serif';
          const tw = ctx.measureText(item.text).width;
          const ph = 14, pw = tw + 8;
          const rx = labelX - 2, ry = labelY - ph / 2;
          ctx.fillStyle = 'rgba(15,23,42,0.82)';
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(rx, ry, pw, ph, 3);
          } else {
            ctx.rect(rx, ry, pw, ph); // fallback cho browser cũ
          }
          ctx.fill();

          // Text
          ctx.fillStyle = item.color;
          ctx.textBaseline = 'middle';
          ctx.fillText(item.text, labelX + 2, labelY);

          ctx.restore();
        });
      }
    };
  }

  // Tính chiều cao chart (px) dựa trên bước chia tick — bước nhỏ hơn → chart cao hơn
  // để mỗi tick có đủ pixel thể hiện rõ sự chênh lệch nhỏ.
  getChartHeight(step) {
    const s = parseFloat(step) || 1;
    if (s <= 0.01)  return 1800; // 1 bps → rất cao, thấy chênh lệch từng bps
    if (s <= 0.1)   return 700;  // 0.1% → cao, thấy chênh lệch 0.1%
    return 320;                  // 1% → chiều cao tiêu chuẩn
  }

  // Lấy cấu hình trục Y (Vertical Axis Scale) dựa trên chế độ lựa chọn, bước chia tick và dữ liệu thực tế
  getYScaleConfig(yScale, stepSize, dataValues) {
    const isCurrency = dataValues && dataValues.some(v => v > 100);
    let step = parseFloat(stepSize) || 1;

    if (isCurrency) {
      // Tính toán step tự động cho các giá trị tiền tệ lớn để tránh tràn trục
      const valid = dataValues.filter(v => v !== null && v !== undefined && !isNaN(v));
      const maxVal = valid.length > 0 ? Math.max(...valid) : 100000;
      if (maxVal > 500000) step = 100000;
      else if (maxVal > 100000) step = 20000;
      else if (maxVal > 50000) step = 10000;
      else step = 5000;
    }

    // Callback format tick theo độ phân giải hoặc tiền tệ
    const tickCallback = (v) => {
      if (isCurrency) {
        return v.toLocaleString() + ' Tỷ';
      }
      if (step < 0.1) {
        return v.toFixed(2) + '%';
      } else if (step < 1) {
        return v.toFixed(1) + '%';
      } else {
        return Number.isInteger(v) ? v + '%' : v.toFixed(1) + '%';
      }
    };

    const tickConfig = { stepSize: step, callback: tickCallback };

    // Fixed Tick Viewport: khi bước chia nhỏ, giữ đúng N_TICKS ticks hiển thị
    // trên màn hình, zoom vào trung tâm dữ liệu thực. Bước chia nhỏ hơn →
    // viewport hẹp hơn → lines trải rộng hơn trong cùng chiều cao chart.
    const N_TICKS = 80; // số ticks hiển thị mục tiêu
    if (!isCurrency && step < 1 && dataValues && dataValues.length > 0 && yScale !== "zero") {
      // Loại trừ giá trị tham chiếu 8% khỏi tính midpoint để zoom không bị kéo xuống
      const bankValues = dataValues.filter(v => v !== null && v !== undefined && !isNaN(v) && v !== 8);
      const allValues  = dataValues.filter(v => v !== null && v !== undefined && !isNaN(v));
      const refValues  = bankValues.length > 0 ? bankValues : allValues;
      if (refValues.length > 0) {
        const dataMin   = Math.min(...refValues);
        const dataMax   = Math.max(...refValues);
        const midpoint  = (dataMin + dataMax) / 2;
        const dataRange = dataMax - dataMin;

        // Viewport = max(dữ liệu thực + 20% padding, N_TICKS * step)
        const visibleRange = Math.max(dataRange * 1.2, N_TICKS * step);
        const halfRange    = visibleRange / 2;

        // Làm tròn về bội số của step để ticks thẳng hàng
        const dynMin = Math.floor((midpoint - halfRange) / step) * step;
        const dynMax = Math.ceil((midpoint + halfRange) / step) * step;

        return {
          beginAtZero: false,
          min: parseFloat(Math.max(0, dynMin).toFixed(4)),
          max: parseFloat(dynMax.toFixed(4)),
          ticks: tickConfig
        };
      }
    }

    if (yScale === "zero") {
      return {
        beginAtZero: true,
        min: 0,
        max: undefined,
        ticks: tickConfig
      };
    } else if (yScale === "narrow" && !isCurrency) {
      return {
        beginAtZero: false,
        min: 6,
        max: 18,
        ticks: tickConfig
      };
    } else {
      // auto mode
      return {
        beginAtZero: false,
        min: undefined,
        max: undefined,
        ticks: tickConfig
      };
    }
  }

  // === RENDER TRANG PHỤ 1: PHÂN TÍCH ĐƠN LẺ ===
  renderIndividualAnalysis() {
    if (!this.indRender) return;

    const bankData = BANK_DATABASE[this.indBank].car_data;
    const bankName = BANK_DATABASE[this.indBank].name;
    const color = BANK_DATABASE[this.indBank].color;

    // Hủy các chart cũ của trang đơn lẻ
    this.destroyChart("indCar");
    this.destroyChart("indCharterRwa");
    this.destroyChart("indCharterCapital");
    this.destroyChart("indScale");
    this.destroyChart("indCarTrend");
    this.destroyChart("indOtherRatiosTrend");
    this.destroyChart("indGrowth");

    if (this.indYear !== "series") {
      const yearData = bankData[this.indYear];
      if (!yearData) {
        this.indRender.innerHTML = `
          <div class="card" style="text-align: center; padding: 4rem 1.5rem; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px;">
            <i data-lucide="alert-circle" style="width: 48px; height: 48px; margin-bottom: 1rem; color: var(--warning);"></i>
            <h3>Dữ liệu không khả dụng</h3>
            <p style="font-size: 0.88rem; max-width: 400px; margin-top: 4px;">Báo cáo CAR năm ${this.indYear} của ${bankName} chưa được công bố hoặc không có sẵn trong hệ thống.</p>
          </div>
        `;
        lucide.createIcons();
        return;
      }
      const isMet = yearData.car >= 8.0;
      const margin = (yearData.car - 8.0).toFixed(2);

      this.indRender.innerHTML = `
        <!-- KPI Row -->
        <div class="ratios-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div class="card" style="border-left: 5px solid ${color};">
            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Hệ số an toàn vốn (CAR)</span>
            <div style="display: flex; align-items: baseline; gap: 0.25rem; margin-top: 8px;">
              <span style="font-size: 2.2rem; font-weight: 800; color: ${color};">${yearData.car.toFixed(2)}%</span>
            </div>
            <span style="font-size: 0.75rem; color: ${isMet ? 'var(--success)' : 'var(--danger)'}; font-weight: 600; display: block; margin-top: 8px;">
              ${isMet ? `✔️ Đạt chuẩn (Vượt +${margin}%)` : `❌ Chưa đạt (Thiếu ${Math.abs(margin)}%)`}
            </span>
          </div>

          <div class="card">
            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Vốn tự có</span>
            <div style="display: flex; align-items: baseline; gap: 0.25rem; margin-top: 8px;">
              <span style="font-size: 2rem; font-weight: 700; color: var(--text-main);">${yearData.capital.toLocaleString()}</span>
              <span style="font-size: 0.85rem; color: var(--text-muted);">Tỷ VND</span>
            </div>
          </div>

          <div class="card">
            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Tài sản rủi ro (RWA)</span>
            <div style="display: flex; align-items: baseline; gap: 0.25rem; margin-top: 8px;">
              <span style="font-size: 2rem; font-weight: 700; color: var(--text-main);">${yearData.rwa.toLocaleString()}</span>
              <span style="font-size: 0.85rem; color: var(--text-muted);">Tỷ VND</span>
            </div>
          </div>

          <div class="card">
            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Vốn điều lệ</span>
            <div style="display: flex; align-items: baseline; gap: 0.25rem; margin-top: 8px;">
              <span style="font-size: 2rem; font-weight: 700; color: var(--text-main);">${yearData.charter.toLocaleString()}</span>
              <span style="font-size: 0.85rem; color: var(--text-muted);">Tỷ VND</span>
            </div>
          </div>
        </div>

        <!-- Chart Grid -->
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;">
          <!-- CAR Comparison -->
          <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column; min-height: 350px;">
            <h4 style="margin: 0 0 0.75rem 0; color: var(--text-muted); text-align: center; font-size: 0.85rem;">Tỷ lệ an toàn vốn CAR (%)</h4>
            <div style="flex-grow: 1; position: relative; height: 280px;">
              <canvas id="chart-ind-car"></canvas>
            </div>
          </div>

          <!-- Charter Capital to RWA Ratio -->
          <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column; min-height: 350px;">
            <h4 style="margin: 0 0 0.75rem 0; color: var(--text-muted); text-align: center; font-size: 0.85rem;">Tỷ lệ Vốn điều lệ / RWA (%)</h4>
            <div style="flex-grow: 1; position: relative; height: 280px;">
              <canvas id="chart-ind-charter-rwa"></canvas>
            </div>
          </div>

          <!-- Charter Capital to Total Capital Ratio -->
          <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column; min-height: 350px;">
            <h4 style="margin: 0 0 0.75rem 0; color: var(--text-muted); text-align: center; font-size: 0.85rem;">Vốn điều lệ / Vốn tự có (%)</h4>
            <div style="flex-grow: 1; position: relative; height: 280px;">
              <canvas id="chart-ind-charter-capital"></canvas>
            </div>
          </div>

          <!-- Chart.js Canvas for Capital vs RWA -->
          <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column; min-height: 350px;">
            <h4 style="margin: 0 0 0.75rem 0; color: var(--text-muted); text-align: center; font-size: 0.85rem;">Cơ cấu Vốn tự có đối ứng RWA</h4>
            <div style="flex-grow: 1; position: relative; height: 280px;">
              <canvas id="chart-ind-scale"></canvas>
            </div>
          </div>
        </div>

        <!-- Document Link -->
        <div class="card" style="border-color: rgba(16, 185, 129, 0.2); background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h3 style="color: var(--success); margin: 0; display: flex; align-items: center; gap: 0.5rem; font-size: 1.15rem;">
                <i data-lucide="file-text"></i> Tài liệu công bố thông tin gốc năm ${this.indYear} (Offline)
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">Bạn có thể trực tiếp mở đọc bản PDF báo cáo CAR chính thức cuối năm ${this.indYear} của ${bankName}:</p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="source-link-btn open-pdf-analysis-btn" data-docpath="docs/banks/${yearData.pdf}" data-docname="${bankName} - Báo cáo CAR năm ${this.indYear}" style="margin-top: 0; background: ${color}20; border-color: ${color}40; color: ${color}; border: none; cursor: pointer;">
                Mở CAR gốc
              </button>
              ${(() => {
                const bctcFile = BANK_DATABASE[this.indBank].bctc_files && BANK_DATABASE[this.indBank].bctc_files[this.indYear];
                return bctcFile ? `
                  <button class="source-link-btn open-pdf-analysis-btn" data-docpath="docs/banks_bctc/${bctcFile}" data-docname="${bankName} - Báo cáo tài chính năm ${this.indYear}" style="margin-top: 0; background: var(--primary); border-color: var(--primary); color: white; border: none; cursor: pointer;">
                    Mở BCTC gốc
                  </button>
                ` : '';
              })()}
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="card" style="padding: 1.5rem; margin-top: 1.5rem; margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.05rem;"><i data-lucide="table"></i> Bảng Số liệu chi tiết Chỉ số CAR năm ${this.indYear}</h3>
          <table id="car-ind-yearly-table" class="basel-table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
              <tr style="background: var(--card-header-bg); border-bottom: 2px solid var(--border-color);">
                <th style="text-align: left; padding: 0.75rem;">Chỉ số phân tích</th>
                <th style="text-align: right; padding: 0.75rem; width: 150px;">Giá trị</th>
                <th style="text-align: left; padding: 0.75rem;">Quy chuẩn & Ý nghĩa</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.75rem; font-weight: 600;">Hệ số an toàn vốn (CAR)</td>
                <td style="padding: 0.75rem; text-align: right; font-weight: 700; color: ${isMet ? 'var(--success)' : 'var(--danger)'}; ${(() => {
                  const bctcFile = BANK_DATABASE[this.indBank].bctc_files && BANK_DATABASE[this.indBank].bctc_files[this.indYear];
                  return bctcFile ? 'cursor: pointer; text-decoration: underline dashed var(--primary); color: var(--primary);' : '';
                })()}" ${(() => {
                  const bctcFile = BANK_DATABASE[this.indBank].bctc_files && BANK_DATABASE[this.indBank].bctc_files[this.indYear];
                  return bctcFile ? `onclick="window.documentFinder.openPdfViewer('docs/banks_bctc/${bctcFile}', '${bankName} - BCTC ${this.indYear}')"` : '';
                })()}>${yearData.car.toFixed(2)}%</td>
                <td style="padding: 0.75rem; color: var(--text-muted);">Tối thiểu 8.00% theo Thông tư 41/2016/TT-NHNN.</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.75rem; font-weight: 600;">Vốn tự có (Total Capital)</td>
                <td style="padding: 0.75rem; text-align: right; font-weight: 700; ${(() => {
                  const bctcFile = BANK_DATABASE[this.indBank].bctc_files && BANK_DATABASE[this.indBank].bctc_files[this.indYear];
                  return bctcFile ? 'cursor: pointer; text-decoration: underline dashed var(--primary); color: var(--primary);' : '';
                })()}" ${(() => {
                  const bctcFile = BANK_DATABASE[this.indBank].bctc_files && BANK_DATABASE[this.indBank].bctc_files[this.indYear];
                  return bctcFile ? `onclick="window.documentFinder.openPdfViewer('docs/banks_bctc/${bctcFile}', '${bankName} - BCTC ${this.indYear}')"` : '';
                })()}>${yearData.capital.toLocaleString()} Tỷ</td>
                <td style="padding: 0.75rem; color: var(--text-muted);">Vốn cấp 1 + Vốn cấp 2 trừ đi các khoản giảm trừ vốn.</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.75rem; font-weight: 600;">Vốn cấp 1 (Tier 1 Capital)</td>
                <td style="padding: 0.75rem; text-align: right; font-weight: 700; ${(() => {
                  const bctcFile = BANK_DATABASE[this.indBank].bctc_files && BANK_DATABASE[this.indBank].bctc_files[this.indYear];
                  return bctcFile ? 'cursor: pointer; text-decoration: underline dashed var(--primary); color: var(--primary);' : '';
                })()}" ${(() => {
                  const bctcFile = BANK_DATABASE[this.indBank].bctc_files && BANK_DATABASE[this.indBank].bctc_files[this.indYear];
                  return bctcFile ? `onclick="window.documentFinder.openPdfViewer('docs/banks_bctc/${bctcFile}', '${bankName} - BCTC ${this.indYear}')"` : '';
                })()}>${yearData.tier1 ? yearData.tier1.toLocaleString() + ' Tỷ' : '-'}</td>
                <td style="padding: 0.75rem; color: var(--text-muted);">Vốn cốt lõi bảo vệ người gửi tiền.</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.75rem; font-weight: 600;">Vốn cấp 2 (Tier 2 Capital)</td>
                <td style="padding: 0.75rem; text-align: right; font-weight: 700; ${(() => {
                  const bctcFile = BANK_DATABASE[this.indBank].bctc_files && BANK_DATABASE[this.indBank].bctc_files[this.indYear];
                  return bctcFile ? 'cursor: pointer; text-decoration: underline dashed var(--primary); color: var(--primary);' : '';
                })()}" ${(() => {
                  const bctcFile = BANK_DATABASE[this.indBank].bctc_files && BANK_DATABASE[this.indBank].bctc_files[this.indYear];
                  return bctcFile ? `onclick="window.documentFinder.openPdfViewer('docs/banks_bctc/${bctcFile}', '${bankName} - BCTC ${this.indYear}')"` : '';
                })()}>${yearData.tier2 ? yearData.tier2.toLocaleString() + ' Tỷ' : '-'}</td>
                <td style="padding: 0.75rem; color: var(--text-muted);">Vốn bổ sung có độ bảo vệ thấp hơn.</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.75rem; font-weight: 600;">Tổng tài sản tính theo độ rủi ro (RWA)</td>
                <td style="padding: 0.75rem; text-align: right; font-weight: 700; ${(() => {
                  const bctcFile = BANK_DATABASE[this.indBank].bctc_files && BANK_DATABASE[this.indBank].bctc_files[this.indYear];
                  return bctcFile ? 'cursor: pointer; text-decoration: underline dashed var(--primary); color: var(--primary);' : '';
                })()}" ${(() => {
                  const bctcFile = BANK_DATABASE[this.indBank].bctc_files && BANK_DATABASE[this.indBank].bctc_files[this.indYear];
                  return bctcFile ? `onclick="window.documentFinder.openPdfViewer('docs/banks_bctc/${bctcFile}', '${bankName} - BCTC ${this.indYear}')"` : '';
                })()}>${yearData.rwa.toLocaleString()} Tỷ</td>
                <td style="padding: 0.75rem; color: var(--text-muted);">Tài sản có nhân trọng số rủi ro (tín dụng, thị trường, hoạt động).</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.75rem; font-weight: 600;">Vốn điều lệ (Charter Capital)</td>
                <td style="padding: 0.75rem; text-align: right; font-weight: 700; ${(() => {
                  const bctcFile = BANK_DATABASE[this.indBank].bctc_files && BANK_DATABASE[this.indBank].bctc_files[this.indYear];
                  return bctcFile ? 'cursor: pointer; text-decoration: underline dashed var(--primary); color: var(--primary);' : '';
                })()}" ${(() => {
                  const bctcFile = BANK_DATABASE[this.indBank].bctc_files && BANK_DATABASE[this.indBank].bctc_files[this.indYear];
                  return bctcFile ? `onclick="window.documentFinder.openPdfViewer('docs/banks_bctc/${bctcFile}', '${bankName} - BCTC ${this.indYear}')"` : '';
                })()}>${yearData.charter.toLocaleString()} Tỷ</td>
                <td style="padding: 0.75rem; color: var(--text-muted);">Vốn góp chính thức từ các cổ đông sáng lập.</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;

      // Wire up PDF viewer button for yearly analysis
      const pdfBtns = this.indRender.querySelectorAll('.open-pdf-analysis-btn');
      pdfBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          if (window.documentFinder) {
            window.documentFinder.openPdfViewer(btn.dataset.docpath, btn.dataset.docname);
          }
        });
      });

      this.initIndYearlyCharts(yearData, color, bankName);
      this.setupSortableTable("car-ind-yearly-table");
      this.attachRatioTableClickHandlers();
    } else {
      // RENDERING TIME SERIES FOR INDIVIDUAL BANK
      const years = Object.keys(bankData).map(Number).sort();

      this.indRender.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;">
          <!-- CAR Time Series Line Chart -->
          <div class="card" style="padding: 1.5rem; min-height: ${this.getChartHeight(this.indYTick) + 60}px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 1rem;">Xu hướng Tỷ lệ CAR (%) ${years[0]} - ${years[years.length-1]}</h3>
            <div style="flex-grow: 1; position: relative; height: ${this.getChartHeight(this.indYTick)}px;">
              <canvas id="chart-ind-car-trend"></canvas>
            </div>
          </div>

          <!-- Other ratios Time Series Line Chart -->
          <div class="card" style="padding: 1.5rem; min-height: ${this.getChartHeight(this.indYTick) + 60}px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 1rem;">Xu hướng các Tỷ lệ Vốn khác (%) ${years[0]} - ${years[years.length-1]}</h3>
            <div style="flex-grow: 1; position: relative; height: ${this.getChartHeight(this.indYTick)}px;">
              <canvas id="chart-ind-other-ratios-trend"></canvas>
            </div>
          </div>

          <!-- RWA vs Capital growth bar chart -->
          <div class="card" style="padding: 1.5rem; min-height: 280px; display: flex; flex-direction: column; grid-column: 1 / -1;">
            <h3 style="margin-bottom: 1rem;">Tăng trưởng Vốn tự có vs RWA (Tỷ VND)</h3>
            <div style="flex-grow: 1; position: relative;">
              <canvas id="chart-ind-growth"></canvas>
            </div>
          </div>
        </div>

        <!-- Available reports grid -->
        <div class="card">
          <h3 style="margin-bottom: 1rem;"><i data-lucide="folder-open"></i> Thư viện Báo cáo CAR ngoại tuyến (${bankName})</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem;">
            ${years.map(yr => `
              <div class="ratio-box" style="text-align: left; padding: 1rem; border-color: var(--border-color); display: flex; flex-direction: column; gap: 0.5rem; justify-content: space-between;">
                <div>
                  <span style="font-weight: 700; color: ${color}; font-size: 1.1rem; display: block;">Năm ${yr}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">CAR: ${bankData[yr].car.toFixed(2)}% | Vốn: ${bankData[yr].capital.toLocaleString()} Tỷ</span>
                </div>
                <div style="display: flex; gap: 0.25rem; margin-top: 0.25rem; width: 100%;">
                  <button class="source-link-btn open-pdf-analysis-btn" data-docpath="docs/banks/${bankData[yr].pdf}" data-docname="${bankName} - Báo cáo CAR năm ${yr}" style="font-size: 0.75rem; flex: 1; text-align: center; justify-content: center; background: rgba(255,255,255,0.04); border: none; cursor: pointer;">
                    Mở CAR
                  </button>
                  ${(() => {
                    const bctcFile = BANK_DATABASE[this.indBank].bctc_files && BANK_DATABASE[this.indBank].bctc_files[yr];
                    return bctcFile ? `
                      <button class="source-link-btn open-pdf-analysis-btn" data-docpath="docs/banks_bctc/${bctcFile}" data-docname="${bankName} - Báo cáo tài chính năm ${yr}" style="font-size: 0.75rem; flex: 1; text-align: center; justify-content: center; background: var(--primary); border: none; cursor: pointer; color: white;">
                        Mở BCTC
                      </button>
                    ` : '';
                  })()}
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Table detail -->
        <div class="card" style="padding: 1.5rem; overflow-x: auto; margin-top: 1.5rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.05rem;"><i data-lucide="table"></i> Diễn biến các Chỉ số CAR qua các năm</h3>
          <table id="car-ind-series-table" class="basel-table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
              <tr style="background: var(--card-header-bg); border-bottom: 2px solid var(--border-color);">
                <th style="text-align: left; padding: 0.75rem;">Năm</th>
                <th style="text-align: right; padding: 0.75rem;">Hệ số CAR (%)</th>
                <th style="text-align: right; padding: 0.75rem;">Vốn tự có (Tỷ)</th>
                <th style="text-align: right; padding: 0.75rem;">Vốn cấp 1 (Tỷ)</th>
                <th style="text-align: right; padding: 0.75rem;">Vốn cấp 2 (Tỷ)</th>
                <th style="text-align: right; padding: 0.75rem;">Tài sản rủi ro RWA (Tỷ)</th>
                <th style="text-align: right; padding: 0.75rem;">Vốn điều lệ (Tỷ)</th>
              </tr>
            </thead>
            <tbody>
              ${years.map(y => {
                const yrData = bankData[y];
                if (!yrData) return '';
                const isMet = yrData.car >= 8.0;
                const bctcFile = BANK_DATABASE[this.indBank].bctc_files && BANK_DATABASE[this.indBank].bctc_files[y];
                const cellStyle = bctcFile ? `cursor: pointer; text-decoration: underline dashed var(--primary);` : '';
                const clickAttr = bctcFile ? `onclick="window.documentFinder.openPdfViewer('docs/banks_bctc/${bctcFile}', '${bankName} - BCTC ${y}')"` : '';
                return `
                  <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 0.75rem; font-weight: bold; ${bctcFile ? 'cursor: pointer; text-decoration: underline dashed var(--primary); color: var(--primary);' : ''}" ${bctcFile ? `onclick="window.documentFinder.openPdfViewer('docs/banks_bctc/${bctcFile}', '${bankName} - BCTC ${y}')"` : ''}>
                      ${bctcFile ? '<i data-lucide="file-text" style="width:13px;height:13px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>' : ''}${y}
                    </td>
                    <td style="padding: 0.75rem; text-align: right; font-weight: 700; color: ${isMet ? 'var(--success)' : 'var(--danger)'}; ${cellStyle}" ${clickAttr}>${yrData.car.toFixed(2)}%</td>
                    <td style="padding: 0.75rem; text-align: right; font-weight: 600; ${cellStyle}" ${clickAttr}>${yrData.capital.toLocaleString()}</td>
                    <td style="padding: 0.75rem; text-align: right; font-weight: 600; ${cellStyle}" ${clickAttr}>${yrData.tier1 ? yrData.tier1.toLocaleString() : '-'}</td>
                    <td style="padding: 0.75rem; text-align: right; font-weight: 600; ${cellStyle}" ${clickAttr}>${yrData.tier2 ? yrData.tier2.toLocaleString() : '-'}</td>
                    <td style="padding: 0.75rem; text-align: right; font-weight: 600; ${cellStyle}" ${clickAttr}>${yrData.rwa.toLocaleString()}</td>
                    <td style="padding: 0.75rem; text-align: right; font-weight: 600; ${cellStyle}" ${clickAttr}>${yrData.charter.toLocaleString()}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `;

      // Wire up PDF viewer buttons for time series library
      const pdfBtns2 = this.indRender.querySelectorAll('.open-pdf-analysis-btn');
      pdfBtns2.forEach(btn => {
        btn.addEventListener('click', () => {
          if (window.documentFinder) {
            window.documentFinder.openPdfViewer(btn.dataset.docpath, btn.dataset.docname);
          }
        });
      });

      // Khởi tạo các biểu đồ chuỗi thời gian
      this.initIndSeriesCharts(years, bankData, color, bankName);
      this.setupSortableTable("car-ind-series-table");
      this.attachRatioTableClickHandlers();
    }

    lucide.createIcons();
  }

  // === RENDER TRANG PHỤ 2: SO SÁNH ĐỐI CHIẾU NHIỀU NGÂN HÀNG ===
  renderCompareAnalysis() {
    if (!this.compRender) return;

    const selectedBanks = this.compBanks;

    // Hủy các chart so sánh cũ
    this.destroyChart("compYearlyCar");
    this.destroyChart("compYearlyCharterRwa");
    this.destroyChart("compYearlyCharterCapital");
    this.destroyChart("compYearlySize");
    this.destroyChart("compTrendCar");
    this.destroyChart("compTrendCharterRwa");
    this.destroyChart("compTrendCharterCapital");
    this.destroyChart("compTrendCapital");
    this.destroyChart("compTrendRwa");

    if (this.compYear !== "series") {
      const year = this.compYear;
      
      this.compRender.innerHTML = `
        <!-- GRID BIỂU ĐỒ SO SÁNH HÀNG NĂM -->
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;">
          <!-- Chart CAR -->
          <div class="card" style="padding: 1.5rem; min-height: ${this.getChartHeight(this.compYTick) + 60}px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 1rem; text-align: center; font-size: 0.95rem;">Tỷ lệ an toàn vốn CAR (%) các ngân hàng (${year})</h3>
            <div style="flex-grow: 1; position: relative; height: ${this.getChartHeight(this.compYTick)}px;">
              <canvas id="chart-comp-yearly-car"></canvas>
            </div>
          </div>
          <!-- Chart Charter / RWA -->
          <div class="card" style="padding: 1.5rem; min-height: ${this.getChartHeight(this.compYTick) + 60}px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 1rem; text-align: center; font-size: 0.95rem;">Tỷ lệ Vốn điều lệ / RWA (%) các ngân hàng (${year})</h3>
            <div style="flex-grow: 1; position: relative; height: ${this.getChartHeight(this.compYTick)}px;">
              <canvas id="chart-comp-yearly-charter-rwa"></canvas>
            </div>
          </div>
          <!-- Chart Charter / Capital -->
          <div class="card" style="padding: 1.5rem; min-height: ${this.getChartHeight(this.compYTick) + 60}px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 1rem; text-align: center; font-size: 0.95rem;">Tỷ lệ Vốn điều lệ / Vốn tự có (%) các ngân hàng (${year})</h3>
            <div style="flex-grow: 1; position: relative; height: ${this.getChartHeight(this.compYTick)}px;">
              <canvas id="chart-comp-yearly-charter-capital"></canvas>
            </div>
          </div>
          <!-- Chart Size (Capital vs RWA) -->
          <div class="card" style="padding: 1.5rem; min-height: 380px; display: flex; flex-direction: column; grid-column: 1 / -1;">
            <h3 style="margin-bottom: 1rem; text-align: center; font-size: 0.95rem;">Quy mô Vốn tự có vs RWA (Tỷ VND) các ngân hàng (${year})</h3>
            <div style="flex-grow: 1; position: relative; height: 300px;">
              <canvas id="chart-comp-yearly-size"></canvas>
            </div>
          </div>
        </div>

        <!-- Bảng đối chiếu so sánh chỉ số -->
        <div class="card" style="padding: 1.5rem; margin-bottom: 1.5rem;">
          <h3>Bảng Số liệu Đối chiếu Chi tiết (${year}) <span style="font-size:0.75rem;font-weight:400;color:var(--text-muted);">— Click cột để sắp xếp</span></h3>
          <div class="table-responsive" style="margin-top: 1rem;">
            <table id="comp-detail-table" class="comparison-table">
              <thead>
                <tr>
                  <th>Ngân hàng</th>
                  <th>CAR (%)</th>
                  <th>Vốn tự có (Tỷ VND)</th>
                  <th>Tổng RWA (Tỷ VND)</th>
                  <th>Vốn điều lệ (Tỷ VND)</th>
                </tr>
              </thead>
              <tbody>
                ${selectedBanks.map(b => {
                  const data = BANK_DATABASE[b].car_data[year];
                  if (!data) {
                    return `
                      <tr>
                        <td class="criterion-col" style="border-left: 4px solid ${BANK_DATABASE[b].color};">
                          <strong>${BANK_DATABASE[b].name} (${b})</strong>
                        </td>
                        <td colspan="4" style="text-align: center; color: var(--text-muted); font-style: italic; font-size: 0.82rem;">Số liệu năm ${year} chưa công bố / không có sẵn</td>
                      </tr>
                    `;
                  }
                  const isMet = data.car >= 8.0;
                  return `
                    <tr>
                      <td class="criterion-col" style="border-left: 4px solid ${BANK_DATABASE[b].color};">
                        <strong>${BANK_DATABASE[b].name} (${b})</strong>
                      </td>
                      <td style="font-weight: 700; color: ${isMet ? 'var(--success)' : 'var(--danger)'};">${data.car.toFixed(2)}%</td>
                      <td>${data.capital.toLocaleString()}</td>
                      <td>${data.rwa.toLocaleString()}</td>
                      <td>${data.charter.toLocaleString()}</td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Comparative Analysis Insights -->
        <div class="card" style="margin-bottom: 1.5rem;">
          <h3>Nhận định Chuyên môn So sánh (Năm ${year})</h3>
          <p style="font-size: 0.92rem; line-height: 1.6; color: var(--text-main); text-align: justify;">
            Trong năm ${year}, các ngân hàng được lựa chọn so sánh đều thể hiện sự tuân thủ nghiêm ngặt quy định an toàn vốn tối thiểu 8.0% theo Thông tư 41/2016/TT-NHNN. 
            Tuy nhiên, có sự phân hóa rất rõ nét: nhóm ngân hàng thương mại cổ phần tư nhân (đặc biệt là <strong>Techcombank - TCB</strong> và <strong>VPBank - VPB</strong>) 
            thường duy trì mức đệm an toàn CAR cực kỳ dày dặn vượt xa 12%, trong khi các ngân hàng quốc doanh (như <strong>Vietcombank - VCB</strong> và <strong>BIDV - BID</strong>) 
            duy trì tỷ lệ CAR ở mức tiệm cận hơn (10% - 11.8%) do quy mô tín dụng và RWA lớn, dẫn đến áp lực tăng vốn điều lệ từ nguồn lợi nhuận giữ lại luôn là nhiệm vụ cấp bách.
          </p>
        </div>
      `;

      this.initCompYearlyCharts(selectedBanks, year);
      // Kích hoạt sort cho bảng chi tiết
      this.setupSortableTable('comp-detail-table');
      this.attachRatioTableClickHandlers();
    } else {
      // RENDERING TIME SERIES TREND FOR MULTIPLE BANKS
      const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
      
      this.compRender.innerHTML = `
        <!-- GRID BIỂU ĐỒ SO SÁNH XU HƯỚNG CHUỖI THỜI GIAN -->
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;">
          <!-- CAR Trend -->
          <div class="card" style="padding: 1.5rem; min-height: ${this.getChartHeight(this.compYTick) + 80}px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 0.5rem; font-size: 0.95rem;">Biểu đồ So sánh Xu hướng CAR (%)</h3>
            <div style="flex-grow: 1; position: relative; height: ${this.getChartHeight(this.compYTick)}px;">
              <canvas id="chart-comp-trend-car"></canvas>
            </div>
          </div>
          <!-- Charter / RWA Trend -->
          <div class="card" style="padding: 1.5rem; min-height: ${this.getChartHeight(this.compYTick) + 80}px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 0.5rem; font-size: 0.95rem;">Biểu đồ So sánh Xu hướng Vốn điều lệ / RWA (%)</h3>
            <div style="flex-grow: 1; position: relative; height: ${this.getChartHeight(this.compYTick)}px;">
              <canvas id="chart-comp-trend-charter-rwa"></canvas>
            </div>
          </div>
          <!-- Charter / Capital Trend -->
          <div class="card" style="padding: 1.5rem; min-height: ${this.getChartHeight(this.compYTick) + 80}px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 0.5rem; font-size: 0.95rem;">Biểu đồ So sánh Xu hướng Vốn điều lệ / Vốn tự có (%)</h3>
            <div style="flex-grow: 1; position: relative; height: ${this.getChartHeight(this.compYTick)}px;">
              <canvas id="chart-comp-trend-charter-capital"></canvas>
            </div>
          </div>
          <!-- Capital Size Trend -->
          <div class="card" style="padding: 1.5rem; min-height: 400px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 0.5rem; font-size: 0.95rem;">Biểu đồ So sánh Xu hướng Vốn tự có (Tỷ VND)</h3>
            <div style="flex-grow: 1; position: relative; height: 320px;">
              <canvas id="chart-comp-trend-capital"></canvas>
            </div>
          </div>
          <!-- RWA Size Trend -->
          <div class="card" style="padding: 1.5rem; min-height: 400px; display: flex; flex-direction: column; grid-column: 1 / -1;">
            <h3 style="margin-bottom: 0.5rem; font-size: 0.95rem;">Biểu đồ So sánh Xu hướng Tổng tài sản có rủi ro RWA (Tỷ VND)</h3>
            <div style="flex-grow: 1; position: relative; height: 320px;">
              <canvas id="chart-comp-trend-rwa"></canvas>
            </div>
          </div>
        </div>

        <div class="card">
          <h3>Bảng xu hướng CAR lịch sử (${years[0]} - ${years[years.length-1]}) <span style="font-size:0.75rem;font-weight:400;color:var(--text-muted);">— Click cột để sắp xếp</span></h3>
          <div class="table-responsive" style="margin-top: 1rem;">
            <table id="comp-trend-table" class="comparison-table">
              <thead>
                <tr>
                  <th>Ngân hàng</th>
                  ${years.map(y => `<th>Năm ${y}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${selectedBanks.map(b => {
                  const tds = years.map(y => {
                    const data = BANK_DATABASE[b].car_data[y];
                    if (!data) return `<td><span style="color: var(--text-muted); font-size: 0.8rem;">-</span></td>`;
                    const isLatest = y === 2025;
                    return `<td style="${isLatest ? 'font-weight: 700; color: var(--primary);' : ''}">${data.car.toFixed(2)}%</td>`;
                  }).join("");
                  return `
                    <tr>
                      <td class="criterion-col" style="border-left: 4px solid ${BANK_DATABASE[b].color};"><strong>${BANK_DATABASE[b].name} (${b})</strong></td>
                      ${tds}
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;

      this.initCompSeriesCharts(selectedBanks, years);
      // Kích hoạt sort cho bảng xu hướng
      this.setupSortableTable('comp-trend-table');
      this.attachRatioTableClickHandlers();
    }

    lucide.createIcons();
  }

  // === CHART INITIALIZATION LOGIC (CHART.JS) ===

  // 1. Phân tích đơn lẻ theo năm: CAR và Vốn/RWA
  initIndYearlyCharts(yearData, color, bankName) {
    if (!window.Chart) return;

    // 1. Chart CAR (%)
    const carCtx = document.getElementById("chart-ind-car").getContext("2d");
    this.charts.indCar = new Chart(carCtx, {
      type: 'bar',
      data: {
        labels: [bankName, 'Quy định NHNN'],
        datasets: [{
          label: 'Tỷ lệ CAR (%)',
          data: [yearData.car, 8.0],
          backgroundColor: [color, '#ef4444'],
          borderColor: [color, '#ef4444'],
          borderWidth: 1,
          barThickness: 30
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => ` ${c.label}: ${c.raw.toFixed(2)}%` } }
        },
        scales: {
          y: this.getYScaleConfig(this.indYScale, this.indYTick, [yearData.car, 8.0])
        }
      }
    });

    // 2. Chart Vốn điều lệ / RWA (%)
    const charterRwaVal = (yearData.charter / yearData.rwa) * 100;
    const crCtx = document.getElementById("chart-ind-charter-rwa").getContext("2d");
    this.charts.indCharterRwa = new Chart(crCtx, {
      type: 'bar',
      data: {
        labels: [bankName],
        datasets: [{
          label: 'Vốn điều lệ / RWA (%)',
          data: [charterRwaVal],
          backgroundColor: [color],
          borderColor: [color],
          borderWidth: 1,
          barThickness: 30
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => ` ${c.label}: ${c.raw.toFixed(2)}%` } }
        },
        scales: {
          y: this.getYScaleConfig(this.indYScale, this.indYTick, [charterRwaVal])
        }
      }
    });

    // 3. Chart Vốn điều lệ / Vốn tự có (%)
    const charterCapitalVal = (yearData.charter / yearData.capital) * 100;
    const ccCtx = document.getElementById("chart-ind-charter-capital").getContext("2d");
    this.charts.indCharterCapital = new Chart(ccCtx, {
      type: 'bar',
      data: {
        labels: [bankName],
        datasets: [{
          label: 'Vốn điều lệ / Vốn tự có (%)',
          data: [charterCapitalVal],
          backgroundColor: [color],
          borderColor: [color],
          borderWidth: 1,
          barThickness: 30
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => ` ${c.label}: ${c.raw.toFixed(2)}%` } }
        },
        scales: {
          y: this.getYScaleConfig(this.indYScale, this.indYTick, [charterCapitalVal])
        }
      }
    });

    // 4. Chart scale Capital vs RWA
    const scaleCtx = document.getElementById("chart-ind-scale").getContext("2d");
    this.charts.indScale = new Chart(scaleCtx, {
      type: 'doughnut',
      data: {
        labels: ['Vốn tự có', 'Phần RWA còn lại'],
        datasets: [{
          data: [yearData.capital, yearData.rwa - yearData.capital],
          backgroundColor: [color, 'rgba(255, 255, 255, 0.05)'],
          borderColor: [color, 'var(--border-color)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.label}: ${item.raw.toLocaleString()} Tỷ VND`
            }
          }
        }
      }
    });
  }

  // 2. Phân tích đơn lẻ Time Series
  initIndSeriesCharts(years, bankData, color, bankName) {
    const carData = years.map(yr => bankData[yr].car);
    const charterRwaData = years.map(yr => (bankData[yr].charter / bankData[yr].rwa) * 100);
    const charterCapitalData = years.map(yr => (bankData[yr].charter / bankData[yr].capital) * 100);
    const capData = years.map(yr => bankData[yr] ? bankData[yr].capital : 0);
    const rwaData = years.map(yr => bankData[yr] ? bankData[yr].rwa : 0);

    if (!window.Chart) return;

    // 1. CAR Trend
    const trendCtx = document.getElementById("chart-ind-car-trend").getContext("2d");
    const endLabelPluginInd = this.getEndLabelPlugin();
    this.charts.indCarTrend = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: `CAR ${bankName} (%)`,
            shortLabel: bankName,
            data: carData,
            borderColor: color,
            backgroundColor: color + '20',
            fill: true,
            tension: 0.15,
            borderWidth: 3,
            pointRadius: 5
          },
          {
            label: 'Mức tối thiểu (8%)',
            data: Array(years.length).fill(8),
            borderColor: '#ef4444',
            borderWidth: 1.5,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 90 } },
        scales: {
          y: this.getYScaleConfig(this.indYScale, this.indYTick, [...carData, 8])
        }
      },
      plugins: [endLabelPluginInd]
    });

    // 2. Other ratios trend
    const otherCtx = document.getElementById("chart-ind-other-ratios-trend").getContext("2d");
    this.charts.indOtherRatiosTrend = new Chart(otherCtx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Vốn điều lệ / RWA (%)',
            shortLabel: 'C/RWA',
            data: charterRwaData,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            tension: 0.15,
            borderWidth: 2.5,
            pointRadius: 4,
            fill: false
          },
          {
            label: 'Vốn điều lệ / Vốn tự có (%)',
            shortLabel: 'C/Cap',
            data: charterCapitalData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            tension: 0.15,
            borderWidth: 2.5,
            pointRadius: 4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 90 } },
        scales: {
          y: this.getYScaleConfig(this.indYScale, this.indYTick, [...charterRwaData, ...charterCapitalData])
        }
      },
      plugins: [endLabelPluginInd]
    });

    // 3. Capital vs RWA Growth
    const growthCtx = document.getElementById("chart-ind-growth").getContext("2d");
    this.charts.indGrowth = new Chart(growthCtx, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Vốn tự có',
            data: capData,
            backgroundColor: color,
            borderRadius: 4
          },
          {
            label: 'Tổng RWA',
            data: rwaData,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (v) => (v/1000).toLocaleString() + 'k Tỷ' }
          }
        }
      }
    });
  }

  // 3. So sánh các ngân hàng theo năm cụ thể
  initCompYearlyCharts(banks, year) {
    if (!window.Chart) return;

    const labels = banks.map(b => b);
    const colors = banks.map(b => BANK_DATABASE[b].color);

    // 1. CAR Comparison
    const carValues = banks.map(b => BANK_DATABASE[b].car_data[year] ? BANK_DATABASE[b].car_data[year].car : null);
    const carCtx = document.getElementById("chart-comp-yearly-car").getContext("2d");
    this.charts.compYearlyCar = new Chart(carCtx, {
      type: 'bar',
      data: {
        labels: labels.map(l => BANK_DATABASE[l].name),
        datasets: [{
          label: 'Tỷ lệ CAR (%)',
          data: carValues,
          backgroundColor: colors,
          borderRadius: 4,
          barThickness: 28
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: this.getYScaleConfig(this.compYScale, this.compYTick, [...carValues.filter(v => v !== null), 8])
        }
      }
    });

    // 2. Charter / RWA Comparison
    const crValues = banks.map(b => BANK_DATABASE[b].car_data[year] ? (BANK_DATABASE[b].car_data[year].charter / BANK_DATABASE[b].car_data[year].rwa) * 100 : null);
    const crCtx = document.getElementById("chart-comp-yearly-charter-rwa").getContext("2d");
    this.charts.compYearlyCharterRwa = new Chart(crCtx, {
      type: 'bar',
      data: {
        labels: labels.map(l => BANK_DATABASE[l].name),
        datasets: [{
          label: 'Vốn điều lệ / RWA (%)',
          data: crValues,
          backgroundColor: colors,
          borderRadius: 4,
          barThickness: 28
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: this.getYScaleConfig(this.compYScale, this.compYTick, crValues.filter(v => v !== null))
        }
      }
    });

    // 3. Charter / Capital Comparison
    const ccValues = banks.map(b => BANK_DATABASE[b].car_data[year] ? (BANK_DATABASE[b].car_data[year].charter / BANK_DATABASE[b].car_data[year].capital) * 100 : null);
    const ccCtx = document.getElementById("chart-comp-yearly-charter-capital").getContext("2d");
    this.charts.compYearlyCharterCapital = new Chart(ccCtx, {
      type: 'bar',
      data: {
        labels: labels.map(l => BANK_DATABASE[l].name),
        datasets: [{
          label: 'Vốn điều lệ / Vốn tự có (%)',
          data: ccValues,
          backgroundColor: colors,
          borderRadius: 4,
          barThickness: 28
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: this.getYScaleConfig(this.compYScale, this.compYTick, ccValues.filter(v => v !== null))
        }
      }
    });

    // 4. Size (Capital vs RWA) Comparison
    const capValues = banks.map(b => BANK_DATABASE[b].car_data[year] ? BANK_DATABASE[b].car_data[year].capital : null);
    const rwaValues = banks.map(b => BANK_DATABASE[b].car_data[year] ? BANK_DATABASE[b].car_data[year].rwa : null);
    const sizeCtx = document.getElementById("chart-comp-yearly-size").getContext("2d");
    this.charts.compYearlySize = new Chart(sizeCtx, {
      type: 'bar',
      data: {
        labels: labels.map(l => BANK_DATABASE[l].name),
        datasets: [
          {
            label: 'Vốn tự có (Tỷ VND)',
            data: capValues,
            backgroundColor: 'rgba(99, 102, 241, 0.85)',
            borderRadius: 4
          },
          {
            label: 'Tổng RWA (Tỷ VND)',
            data: rwaValues,
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (v) => (v / 1000).toLocaleString() + 'k Tỷ' }
          }
        }
      }
    });
  }

  // 4. So sánh xu hướng CAR (Time Series) của nhiều ngân hàng
  initCompSeriesCharts(banks, years) {
    if (!window.Chart) return;

    const endLabelPluginComp = this.getEndLabelPlugin();

    // 1. CAR Trend
    const carDatasets = banks.map(b => ({
      label: BANK_DATABASE[b].name,
      shortLabel: b,
      data: years.map(yr => BANK_DATABASE[b].car_data[yr] ? BANK_DATABASE[b].car_data[yr].car : null),
      borderColor: BANK_DATABASE[b].color,
      backgroundColor: BANK_DATABASE[b].color + '10',
      tension: 0.15,
      borderWidth: 2,
      pointRadius: 3,
      fill: false
    }));
    carDatasets.push({
      label: 'Mức tối thiểu NHNN (8%)',
      data: Array(years.length).fill(8),
      borderColor: '#ef4444',
      borderWidth: 1.2,
      borderDash: [4, 4],
      pointRadius: 0,
      fill: false
    });
    const trendCarCtx = document.getElementById("chart-comp-trend-car").getContext("2d");
    this.charts.compTrendCar = new Chart(trendCarCtx, {
      type: 'line',
      data: { labels: years, datasets: carDatasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 60 } },
        scales: {
          y: this.getYScaleConfig(this.compYScale, this.compYTick, [
            ...banks.flatMap(b => years.map(yr => BANK_DATABASE[b].car_data[yr] ? BANK_DATABASE[b].car_data[yr].car : null)).filter(v => v !== null),
            8
          ])
        },
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 10 } } }
      },
      plugins: [endLabelPluginComp]
    });

    // 2. Charter / RWA Trend
    const crDatasets = banks.map(b => ({
      label: BANK_DATABASE[b].name,
      shortLabel: b,
      data: years.map(yr => BANK_DATABASE[b].car_data[yr] ? (BANK_DATABASE[b].car_data[yr].charter / BANK_DATABASE[b].car_data[yr].rwa) * 100 : null),
      borderColor: BANK_DATABASE[b].color,
      backgroundColor: BANK_DATABASE[b].color + '10',
      tension: 0.15,
      borderWidth: 2,
      pointRadius: 3,
      fill: false
    }));
    const trendCrCtx = document.getElementById("chart-comp-trend-charter-rwa").getContext("2d");
    this.charts.compTrendCharterRwa = new Chart(trendCrCtx, {
      type: 'line',
      data: { labels: years, datasets: crDatasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 60 } },
        scales: {
          y: this.getYScaleConfig(this.compYScale, this.compYTick, [
            ...banks.flatMap(b => years.map(yr => BANK_DATABASE[b].car_data[yr] ? (BANK_DATABASE[b].car_data[yr].charter / BANK_DATABASE[b].car_data[yr].rwa) * 100 : null)).filter(v => v !== null)
          ])
        },
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 10 } } }
      },
      plugins: [endLabelPluginComp]
    });

    // 3. Charter / Capital Trend
    const ccDatasets = banks.map(b => ({
      label: BANK_DATABASE[b].name,
      shortLabel: b,
      data: years.map(yr => BANK_DATABASE[b].car_data[yr] ? (BANK_DATABASE[b].car_data[yr].charter / BANK_DATABASE[b].car_data[yr].capital) * 100 : null),
      borderColor: BANK_DATABASE[b].color,
      backgroundColor: BANK_DATABASE[b].color + '10',
      tension: 0.15,
      borderWidth: 2,
      pointRadius: 3,
      fill: false
    }));
    const trendCcCtx = document.getElementById("chart-comp-trend-charter-capital").getContext("2d");
    this.charts.compTrendCharterCapital = new Chart(trendCcCtx, {
      type: 'line',
      data: { labels: years, datasets: ccDatasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 60 } },
        scales: {
          y: this.getYScaleConfig(this.compYScale, this.compYTick, [
            ...banks.flatMap(b => years.map(yr => BANK_DATABASE[b].car_data[yr] ? (BANK_DATABASE[b].car_data[yr].charter / BANK_DATABASE[b].car_data[yr].capital) * 100 : null)).filter(v => v !== null)
          ])
        },
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 10 } } }
      },
      plugins: [endLabelPluginComp]
    });

    // 4. Capital Size Trend
    const capDatasets = banks.map(b => ({
      label: BANK_DATABASE[b].name,
      shortLabel: b,
      data: years.map(yr => BANK_DATABASE[b].car_data[yr] ? BANK_DATABASE[b].car_data[yr].capital : null),
      borderColor: BANK_DATABASE[b].color,
      backgroundColor: BANK_DATABASE[b].color + '10',
      tension: 0.15,
      borderWidth: 2,
      pointRadius: 3,
      fill: false
    }));
    const trendCapCtx = document.getElementById("chart-comp-trend-capital").getContext("2d");
    this.charts.compTrendCapital = new Chart(trendCapCtx, {
      type: 'line',
      data: { labels: years, datasets: capDatasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 60 } },
        scales: {
          y: this.getYScaleConfig(this.compYScale, this.compYTick, [
            ...banks.flatMap(b => years.map(yr => BANK_DATABASE[b].car_data[yr] ? BANK_DATABASE[b].car_data[yr].capital : null)).filter(v => v !== null)
          ])
        },
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 10 } } }
      },
      plugins: [endLabelPluginComp]
    });

    // 5. RWA Size Trend
    const rwaDatasets = banks.map(b => ({
      label: BANK_DATABASE[b].name,
      shortLabel: b,
      data: years.map(yr => BANK_DATABASE[b].car_data[yr] ? BANK_DATABASE[b].car_data[yr].rwa : null),
      borderColor: BANK_DATABASE[b].color,
      backgroundColor: BANK_DATABASE[b].color + '10',
      tension: 0.15,
      borderWidth: 2,
      pointRadius: 3,
      fill: false
    }));
    const trendRwaCtx = document.getElementById("chart-comp-trend-rwa").getContext("2d");
    this.charts.compTrendRwa = new Chart(trendRwaCtx, {
      type: 'line',
      data: { labels: years, datasets: rwaDatasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 60 } },
        scales: {
          y: this.getYScaleConfig(this.compYScale, this.compYTick, [
            ...banks.flatMap(b => years.map(yr => BANK_DATABASE[b].car_data[yr] ? BANK_DATABASE[b].car_data[yr].rwa : null)).filter(v => v !== null)
          ])
        },
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 10 } } }
      },
      plugins: [endLabelPluginComp]
    });
  }

  // === SVG CHARTING HELPERS (FALLBACK NẾU MẤT MẠNG HOẶC KHÔNG LOAD ĐƯỢC CHART.JS) ===

  generateSvgSingleBar(val, color) {
    const scale = 16.0;
    const progressWidth = Math.min(400, Math.round((val / scale) * 400));
    const targetWidth = Math.round((8.0 / scale) * 400);

    return `
      <svg width="100%" height="150" viewBox="0 0 450 150">
        <rect x="20" y="50" width="400" height="24" rx="12" fill="rgba(255,255,255,0.04)" stroke="var(--border-color)" />
        <rect x="20" y="50" width="${progressWidth}" height="24" rx="12" fill="url(#grad-${val})" />
        <line x1="${20 + targetWidth}" y1="35" x2="${20 + targetWidth}" y2="90" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,2" />
        <text x="${20 + targetWidth}" y="30" fill="#ef4444" font-size="11" font-weight="600" text-anchor="middle">Mức tối thiểu NHNN (8%)</text>
        <text x="20" y="110" fill="var(--text-muted)" font-size="11">0%</text>
        <text x="220" y="110" fill="var(--text-muted)" font-size="11" text-anchor="middle">8%</text>
        <text x="420" y="110" fill="var(--text-muted)" font-size="11" text-anchor="end">16%</text>
        <text x="${20 + progressWidth}" y="95" fill="${color}" font-weight="800" font-size="14" text-anchor="middle">${val.toFixed(2)}%</text>
        <defs>
          <linearGradient id="grad-${val}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.7" />
            <stop offset="100%" stop-color="${color}" stop-opacity="1" />
          </linearGradient>
        </defs>
      </svg>
    `;
  }

  generateSvgDoubleBarChart(years, capitals, rwas, color) {
    const maxVal = Math.max(...rwas) * 1.15;
    const height = 200;
    const width = 450;
    const paddingLeft = 55;
    const paddingRight = 10;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const barWidth = 25;

    const getY = (val) => chartHeight + paddingTop - (val / maxVal) * chartHeight;

    const yGrid = [0, 0.25, 0.5, 0.75, 1];
    const gridLines = yGrid.map(ratio => {
      const y = paddingTop + ratio * chartHeight;
      const label = Math.round((1 - ratio) * maxVal / 1000) * 1000;
      return `
        <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="rgba(255,255,255,0.04)" />
        <text x="${paddingLeft - 8}" y="${y + 4}" fill="var(--text-muted)" font-size="9" text-anchor="end">${label.toLocaleString()}</text>
      `;
    }).join("");

    const bars = years.map((yr, idx) => {
      const x = paddingLeft + idx * (chartWidth / years.length) + 10;
      const capY = getY(capitals[idx]);
      const capH = chartHeight + paddingTop - capY;
      const rwaY = getY(rwas[idx]);
      const rwaH = chartHeight + paddingTop - rwaY;

      return `
        <rect x="${x}" y="${capY}" width="${barWidth}" height="${capH}" fill="${color}" opacity="0.8" rx="2" />
        <text x="${x + barWidth/2}" y="${capY - 4}" fill="var(--text-main)" font-size="9" font-weight="600" text-anchor="middle">${Math.round(capitals[idx]/1000)}k</text>
        <rect x="${x + barWidth + 3}" y="${rwaY}" width="${barWidth}" height="${rwaH}" fill="rgba(255,255,255,0.15)" rx="2" />
        <text x="${x + barWidth + 3 + barWidth/2}" y="${rwaY - 4}" fill="var(--text-muted)" font-size="9" text-anchor="middle">${Math.round(rwas[idx]/1000)}k</text>
        <text x="${x + barWidth + 1.5}" y="${height - 10}" fill="var(--text-muted)" font-size="11" font-weight="600" text-anchor="middle">${yr}</text>
      `;
    }).join("");

    return `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">
        ${gridLines}
        ${bars}
        <line x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" stroke="var(--border-color)" />
      </svg>
    `;
  }

  generateSvgMultiBarChart(labels, values, colors) {
    const height = 240;
    const width = 500;
    const paddingLeft = 50;
    const paddingRight = 10;
    const paddingTop = 20;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const maxVal = 16.0;
    const getY = (val) => chartHeight + paddingTop - (val / maxVal) * chartHeight;

    const yGrid = [0, 0.25, 0.5, 0.75, 1];
    const gridLines = yGrid.map(ratio => {
      const y = paddingTop + ratio * chartHeight;
      const label = (1 - ratio) * maxVal;
      return `
        <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="rgba(255,255,255,0.04)" />
        <text x="${paddingLeft - 8}" y="${y + 4}" fill="var(--text-muted)" font-size="9" text-anchor="end">${label.toFixed(1)}%</text>
      `;
    }).join("");

    const barWidth = Math.min(40, Math.round((chartWidth / labels.length) * 0.5));
    const step = chartWidth / labels.length;

    const bars = labels.map((lbl, idx) => {
      const x = paddingLeft + idx * step + (step - barWidth) / 2;
      const y = getY(values[idx]);
      const barH = chartHeight + paddingTop - y;

      return `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" fill="${colors[idx]}" rx="3" />
        <text x="${x + barWidth/2}" y="${y - 6}" fill="var(--text-main)" font-weight="700" font-size="10" text-anchor="middle">${values[idx].toFixed(2)}%</text>
        <text x="${x + barWidth/2}" y="${height - 20}" fill="var(--text-main)" font-weight="600" font-size="11" text-anchor="middle">${lbl}</text>
      `;
    }).join("");

    const targetY = getY(8.0);

    return `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">
        ${gridLines}
        <line x1="${paddingLeft}" y1="${targetY}" x2="${width - paddingRight}" y2="${targetY}" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2" />
        ${bars}
        <line x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" stroke="var(--border-color)" />
      </svg>
    `;
  }

  generateSvgLineChart(years, datasets, labels, colors, unit = "") {
    const height = 240;
    const width = 500;
    const paddingLeft = 50;
    const paddingRight = 10;
    const paddingTop = 30;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const allVals = datasets.flat();
    const minVal = Math.max(0, Math.floor(Math.min(...allVals) * 0.9));
    const maxVal = Math.ceil(Math.max(...allVals) * 1.1);

    const getY = (val) => chartHeight + paddingTop - ((val - minVal) / (maxVal - minVal)) * chartHeight;
    const getX = (idx) => paddingLeft + idx * (chartWidth / (years.length - 1));

    const yGrid = [0, 0.25, 0.5, 0.75, 1];
    const gridLines = yGrid.map(ratio => {
      const y = paddingTop + ratio * chartHeight;
      const label = maxVal - ratio * (maxVal - minVal);
      return `
        <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="rgba(255,255,255,0.04)" />
        <text x="${paddingLeft - 8}" y="${y + 4}" fill="var(--text-muted)" font-size="9" text-anchor="end">${label.toFixed(1)}${unit}</text>
      `;
    }).join("");

    const lines = datasets.map((data, lineIdx) => {
      const pathPoints = data.map((val, idx) => `${getX(idx)},${getY(val)}`).join(" L ");
      const color = colors[lineIdx];
      const pointsHtml = data.map((val, idx) => `
        <circle cx="${getX(idx)}" cy="${getY(val)}" r="4" fill="var(--card-bg)" stroke="${color}" stroke-width="2" />
        <text x="${getX(idx)}" y="${getY(val) - 8}" fill="var(--text-main)" font-size="8" font-weight="600" text-anchor="middle">${val.toFixed(2)}${unit}</text>
      `).join("");

      return `
        <path d="M ${pathPoints}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        ${pointsHtml}
      `;
    }).join("");

    const xLabels = years.map((yr, idx) => `
      <text x="${getX(idx)}" y="${height - 15}" fill="var(--text-muted)" font-size="10" font-weight="600" text-anchor="middle">${yr}</text>
    `).join("");

    return `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">
        ${gridLines}
        ${lines}
        ${xLabels}
        <line x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" stroke="var(--border-color)" />
      </svg>
    `;
  }

  renderRatioAnalysis() {
    if (!this.ratioRender) return;

    if (this.currentRatioSub === "individual") {
      this.renderIndividualRatios();
    } else {
      this.renderCompareRatios();
    }
  }

  renderIndividualRatios() {
    const bankName = BANK_DATABASE[this.ratioBank].name;
    const color = BANK_DATABASE[this.ratioBank].color;
    const bankData = BANK_DATABASE[this.ratioBank].ratio_data;

    // Hủy các chart đơn lẻ ratios cũ
    this.destroyChart("indRatioLdr");
    this.destroyChart("indRatioStml");
    this.destroyChart("indRatioLrr");
    this.destroyChart("indRatioNpl");

    if (!bankData) {
      this.ratioRender.innerHTML = `<div class="card"><p style="color: var(--text-muted);">Không có dữ liệu tỷ lệ hoạt động cho ngân hàng ${this.ratioBank}</p></div>`;
      return;
    }

    if (this.ratioYear === "series") {
      const years = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"];

      this.ratioRender.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;">
          <!-- Chart LDR -->
          <div class="card" style="padding: 1.5rem; min-height: 280px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 1rem;"><i data-lucide="percent"></i> Xu hướng LDR - Tỷ lệ Cho vay/Huy động (Trần Luật: 85%)</h3>
            <div style="flex-grow: 1; position: relative; height: 220px;">
              <canvas id="chart-ind-ratio-ldr"></canvas>
            </div>
          </div>

          <!-- Chart STML -->
          <div class="card" style="padding: 1.5rem; min-height: 280px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 1rem;"><i data-lucide="percent"></i> Vốn ngắn hạn cho vay Trung - Dài hạn (Giới hạn: 30%)</h3>
            <div style="flex-grow: 1; position: relative; height: 220px;">
              <canvas id="chart-ind-ratio-stml"></canvas>
            </div>
          </div>

          <!-- Chart LRR -->
          <div class="card" style="padding: 1.5rem; min-height: 280px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 1rem;"><i data-lucide="percent"></i> Tỷ lệ Dự trữ Thanh khoản (Tối thiểu Luật: 10%)</h3>
            <div style="flex-grow: 1; position: relative; height: 220px;">
              <canvas id="chart-ind-ratio-lrr"></canvas>
            </div>
          </div>

          <!-- Chart NPL -->
          <div class="card" style="padding: 1.5rem; min-height: 280px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 1rem;"><i data-lucide="percent"></i> Xu hướng Tỷ lệ Nợ xấu NPL (Ngưỡng cảnh báo: 3%)</h3>
            <div style="flex-grow: 1; position: relative; height: 220px;">
              <canvas id="chart-ind-ratio-npl"></canvas>
            </div>
          </div>

          <!-- Table -->
          <div class="card" style="padding: 1.5rem; overflow-x: auto;">
            <h3 style="margin-bottom: 1.25rem; font-size: 1.05rem;"><i data-lucide="table"></i> Chi tiết Số liệu Chuỗi thời gian Tỷ lệ An toàn BCTC</h3>
            <table id="ratio-ind-series-table" class="basel-table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
              <thead>
                <tr style="background: var(--card-header-bg); border-bottom: 2px solid var(--border-color);">
                  <th style="text-align: left; padding: 0.75rem;">Năm</th>
                  <th style="text-align: right; padding: 0.75rem;">LDR (%) <span style="font-size: 0.72rem; display:block; color:var(--text-muted); font-weight:400;">Trần 85%</span></th>
                  <th style="text-align: right; padding: 0.75rem;">Vốn ngắn hạn cho vay Trung-Dài (%) <span style="font-size: 0.72rem; display:block; color:var(--text-muted); font-weight:400;">Trần 30%</span></th>
                  <th style="text-align: right; padding: 0.75rem;">Dự trữ thanh khoản LRR (%) <span style="font-size: 0.72rem; display:block; color:var(--text-muted); font-weight:400;">Sàn 10%</span></th>
                  <th style="text-align: right; padding: 0.75rem;">Tỷ lệ nợ xấu NPL (%) <span style="font-size: 0.72rem; display:block; color:var(--text-muted); font-weight:400;">Trần 3%</span></th>
                </tr>
              </thead>
              <tbody>
                ${years.map(y => {
                  const data = bankData[y];
                  if (!data) return '';
                  const isLdrMet = data.ldr <= 85.0;
                  const isStmlMet = data.stml <= 30.0;
                  const isLrrMet = data.lrr >= 10.0;
                  const isNplMet = data.npl <= 3.0;
                  return `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                      <td style="padding: 0.75rem; font-weight: bold;">${y}</td>
                      <td style="padding: 0.75rem; text-align: right; font-weight: 600; color: ${isLdrMet ? 'var(--success)' : 'var(--danger)'};">${data.ldr.toFixed(2)}%</td>
                      <td style="padding: 0.75rem; text-align: right; font-weight: 600; color: ${isStmlMet ? 'var(--success)' : 'var(--danger)'};">${data.stml.toFixed(2)}%</td>
                      <td style="padding: 0.75rem; text-align: right; font-weight: 600; color: ${isLrrMet ? 'var(--success)' : 'var(--danger)'};">${data.lrr.toFixed(2)}%</td>
                      <td style="padding: 0.75rem; text-align: right; font-weight: 600; color: ${isNplMet ? 'var(--success)' : 'var(--danger)'};">${data.npl.toFixed(2)}%</td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
      
      this.initIndRatioTrendCharts(years, bankData, color, bankName);
      this.setupSortableTable('ratio-ind-series-table');
      this.attachRatioTableClickHandlers();
      lucide.createIcons();
      return;
    }

    const yearData = bankData[this.ratioYear];
    if (!yearData) {
      this.ratioRender.innerHTML = `<div class="card"><p style="color: var(--text-muted);">Không có dữ liệu cho năm ${this.ratioYear}</p></div>`;
      return;
    }

    const ldrStatus = yearData.ldr <= 85.0 ? { status: "An toàn", class: "status-safe", color: "var(--success)" } : { status: "Vượt trần", class: "status-danger", color: "var(--danger)" };
    const ldrPct = Math.min(100, (yearData.ldr / 85.0) * 100);

    const stmlStatus = yearData.stml <= 30.0 ? { status: "An toàn", class: "status-safe", color: "var(--success)" } : { status: "Vượt giới hạn", class: "status-danger", color: "var(--danger)" };
    const stmlPct = Math.min(100, (yearData.stml / 30.0) * 100);

    const lrrStatus = yearData.lrr >= 10.0 ? { status: "An toàn", class: "status-safe", color: "var(--success)" } : { status: "Dưới hạn mức", class: "status-danger", color: "var(--danger)" };
    const lrrPct = Math.min(100, (yearData.lrr / 20.0) * 100);

    const nplStatus = yearData.npl <= 3.0 ? { status: "An toàn", class: "status-safe", color: "var(--success)" } : { status: "Nợ xấu cao", class: "status-danger", color: "var(--danger)" };
    const nplPct = Math.min(100, (yearData.npl / 3.0) * 100);

    const bctcFile = BANK_DATABASE[this.ratioBank].bctc_files && BANK_DATABASE[this.ratioBank].bctc_files[this.ratioYear];

    this.ratioRender.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
        <div class="card ratio-box" style="border-left: 4px solid ${ldrStatus.color};">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
            <div>
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">LDR - Tỷ lệ Cho vay/Huy động</span>
              <h2 style="margin: 0.25rem 0; font-size: 2rem; color: var(--text-main);">${yearData.ldr.toFixed(2)}%</h2>
            </div>
            <span class="badge ${ldrStatus.class}">${ldrStatus.status}</span>
          </div>
          <div class="progress-bar-container" style="background: rgba(255,255,255,0.06); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 0.75rem;">
            <div style="width: ${ldrPct}%; height: 100%; background: ${ldrStatus.color}; border-radius: 4px;"></div>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; justify-content: space-between; font-weight: 600;">
            <span>Luật tối đa: 85.00%</span>
            <span>Hiệu suất: ${ldrPct.toFixed(0)}% trần</span>
          </div>
          <hr style="border:0; border-top: 1px solid var(--border-color); margin: 0.75rem 0;">
          <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0; line-height: 1.4;">
            <strong>Cơ sở pháp lý:</strong> Khoản 4 Điều 22 Thông tư 22/2019/TT-NHNN.<br>
            <strong>Ý nghĩa:</strong> Đo lường thanh khoản, phản ánh tỷ trọng huy động vốn từ thị trường 1 được đem đi cho vay nền kinh tế.
          </p>
        </div>

        <div class="card ratio-box" style="border-left: 4px solid ${stmlStatus.color};">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
            <div>
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Tỷ lệ Vốn ngắn hạn cho vay Trung-Dài hạn</span>
              <h2 style="margin: 0.25rem 0; font-size: 2rem; color: var(--text-main);">${yearData.stml.toFixed(2)}%</h2>
            </div>
            <span class="badge ${stmlStatus.class}">${stmlStatus.status}</span>
          </div>
          <div class="progress-bar-container" style="background: rgba(255,255,255,0.06); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 0.75rem;">
            <div style="width: ${stmlPct}%; height: 100%; background: ${stmlStatus.color}; border-radius: 4px;"></div>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; justify-content: space-between; font-weight: 600;">
            <span>Luật tối đa: 30.00%</span>
            <span>Hiệu suất: ${stmlPct.toFixed(0)}% trần</span>
          </div>
          <hr style="border:0; border-top: 1px solid var(--border-color); margin: 0.75rem 0;">
          <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0; line-height: 1.4;">
            <strong>Cơ sở pháp lý:</strong> Thông tư 22/2023/TT-NHNN sửa đổi Thông tư 41/2016.<br>
            <strong>Ý nghĩa:</strong> Phòng ngừa rủi ro mất cân đối kỳ hạn, hạn chế dùng nguồn vốn ngắn hạn (dễ rút) tài trợ các dự án dài hạn.
          </p>
        </div>

        <div class="card ratio-box" style="border-left: 4px solid ${lrrStatus.color};">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
            <div>
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">LRR - Dự trữ thanh khoản</span>
              <h2 style="margin: 0.25rem 0; font-size: 2rem; color: var(--text-main);">${yearData.lrr.toFixed(2)}%</h2>
            </div>
            <span class="badge ${lrrStatus.class}">${lrrStatus.status}</span>
          </div>
          <div class="progress-bar-container" style="background: rgba(255,255,255,0.06); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 0.75rem;">
            <div style="width: ${lrrPct}%; height: 100%; background: ${lrrStatus.color}; border-radius: 4px;"></div>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; justify-content: space-between; font-weight: 600;">
            <span>Luật tối thiểu: 10.00%</span>
            <span>Tích lũy thực tế: ${yearData.lrr.toFixed(2)}%</span>
          </div>
          <hr style="border:0; border-top: 1px solid var(--border-color); margin: 0.75rem 0;">
          <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0; line-height: 1.4;">
            <strong>Cơ sở pháp lý:</strong> Khoản 2 Điều 22 Thông tư 22/2019/TT-NHNN.<br>
            <strong>Ý nghĩa:</strong> Đảm bảo ngân hàng luôn nắm giữ đủ lượng tài sản thanh khoản cao (tiền mặt, giấy tờ có giá) dự trữ khẩn cấp.
          </p>
        </div>

        <div class="card ratio-box" style="border-left: 4px solid ${nplStatus.color};">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
            <div>
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Tỷ lệ Nợ xấu (NPL Ratio)</span>
              <h2 style="margin: 0.25rem 0; font-size: 2rem; color: var(--text-main);">${yearData.npl.toFixed(2)}%</h2>
            </div>
            <span class="badge ${nplStatus.class}">${nplStatus.status}</span>
          </div>
          <div class="progress-bar-container" style="background: rgba(255,255,255,0.06); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 0.75rem;">
            <div style="width: ${nplPct}%; height: 100%; background: ${nplStatus.color}; border-radius: 4px;"></div>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; justify-content: space-between; font-weight: 600;">
            <span>Ngưỡng giám sát: 3.00%</span>
            <span>Tỷ trọng thực tế: ${yearData.npl.toFixed(2)}%</span>
          </div>
          <hr style="border:0; border-top: 1px solid var(--border-color); margin: 0.75rem 0;">
          <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0; line-height: 1.4;">
            <strong>Cơ sở pháp lý:</strong> Quy định phân loại nợ nhóm 3-5 theo Thông tư 11/2021/TT-NHNN.<br>
            <strong>Ý nghĩa:</strong> Đánh giá chất lượng tài sản có tín dụng, mức độ rủi ro tín dụng của hoạt động cho vay ngân hàng.
          </p>
        </div>
      </div>

      <!-- Table -->
      <div class="card" style="padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="margin-bottom: 1.25rem; font-size: 1.05rem;"><i data-lucide="table"></i> Bảng Tổng hợp Tỷ lệ An toàn năm ${this.ratioYear}</h3>
        <table id="ratio-ind-yearly-table" class="basel-table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
          <thead>
            <tr style="background: var(--card-header-bg); border-bottom: 2px solid var(--border-color);">
              <th style="text-align: left; padding: 0.75rem;">Tỷ lệ an toàn</th>
              <th style="text-align: right; padding: 0.75rem;">Quy chuẩn Luật định</th>
              <th style="text-align: right; padding: 0.75rem;">Tỷ lệ Thực tế</th>
              <th style="text-align: center; padding: 0.75rem; width: 140px;">Tuân thủ pháp luật</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 0.75rem; font-weight: 600;">LDR (Tỷ lệ Cho vay/Huy động)</td>
              <td style="padding: 0.75rem; text-align: right; color: var(--text-muted);">Tối đa 85.00%</td>
              <td style="padding: 0.75rem; text-align: right; font-weight: 700; color: ${ldrStatus.color};">${yearData.ldr.toFixed(2)}%</td>
              <td style="padding: 0.75rem; text-align: center;"><span class="badge ${ldrStatus.class}">${ldrStatus.status}</span></td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 0.75rem; font-weight: 600;">Tỷ lệ vốn ngắn hạn cho vay Trung-Dài hạn</td>
              <td style="padding: 0.75rem; text-align: right; color: var(--text-muted);">Tối đa 30.00%</td>
              <td style="padding: 0.75rem; text-align: right; font-weight: 700; color: ${stmlStatus.color};">${yearData.stml.toFixed(2)}%</td>
              <td style="padding: 0.75rem; text-align: center;"><span class="badge ${stmlStatus.class}">${stmlStatus.status}</span></td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 0.75rem; font-weight: 600;">LRR (Tỷ lệ Dự trữ Thanh khoản)</td>
              <td style="padding: 0.75rem; text-align: right; color: var(--text-muted);">Tối thiểu 10.00%</td>
              <td style="padding: 0.75rem; text-align: right; font-weight: 700; color: ${lrrStatus.color};">${yearData.lrr.toFixed(2)}%</td>
              <td style="padding: 0.75rem; text-align: center;"><span class="badge ${lrrStatus.class}">${lrrStatus.status}</span></td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 0.75rem; font-weight: 600;">Tỷ lệ Nợ xấu (NPL Ratio)</td>
              <td style="padding: 0.75rem; text-align: right; color: var(--text-muted);">Tối đa 3.00%</td>
              <td style="padding: 0.75rem; text-align: right; font-weight: 700; color: ${nplStatus.color};">${yearData.npl.toFixed(2)}%</td>
              <td style="padding: 0.75rem; text-align: center;"><span class="badge ${nplStatus.class}">${nplStatus.status}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card" style="border-color: rgba(99, 102, 241, 0.2); background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="color: var(--primary); margin: 0; display: flex; align-items: center; gap: 0.5rem; font-size: 1.15rem;">
              <i data-lucide="file-check"></i> Báo cáo Tài chính (BCTC) Kiểm toán Hợp nhất Năm ${this.ratioYear} (Offline)
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">Bạn có thể trực tiếp mở đọc bản PDF báo cáo tài chính đã kiểm toán tương ứng từ Vietstock:</p>
          </div>
          ${bctcFile ? `
            <button class="source-link-btn open-pdf-analysis-btn" data-docpath="docs/banks_bctc/${bctcFile}" data-docname="${bankName} - Báo cáo tài chính năm ${this.ratioYear}" style="margin-top: 0; background: var(--primary); border-color: var(--primary); color: white; border: none; cursor: pointer;">
              Mở BCTC kiểm toán
            </button>
          ` : `
            <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">(Chưa tải hoặc chưa có BCTC năm ${this.ratioYear})</span>
          `}
        </div>
      </div>
    `;

    const pdfBtns = this.ratioRender.querySelectorAll('.open-pdf-analysis-btn');
    pdfBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.documentFinder) {
          window.documentFinder.openPdfViewer(btn.dataset.docpath, btn.dataset.docname);
        }
      });
    });

    this.setupSortableTable('ratio-ind-yearly-table');
    this.attachRatioTableClickHandlers();
    lucide.createIcons();
  }

  initIndRatioTrendCharts(years, bankData, color, bankName) {
    const ldrData = years.map(y => bankData[y].ldr);
    const stmlData = years.map(y => bankData[y].stml);
    const lrrData = years.map(y => bankData[y].lrr);
    const nplData = years.map(y => bankData[y].npl);

    if (!window.Chart) return;
    const endLabelPlugin = this.getEndLabelPlugin();

    // Helper function to create line chart config with reference line dataset
    const createConfig = (label, data, threshold, thresholdLabel, isMax = true) => {
      const thresholdColor = isMax ? '#ef4444' : '#10b981';
      return {
        type: 'line',
        data: {
          labels: years,
          datasets: [
            {
              label: `${label} (${bankName})`,
              shortLabel: bankName,
              data: data,
              borderColor: color,
              backgroundColor: color + '15',
              fill: true,
              tension: 0.15,
              borderWidth: 3,
              pointRadius: 5
            },
            {
              label: thresholdLabel,
              data: Array(years.length).fill(threshold),
              borderColor: thresholdColor,
              borderWidth: 1.5,
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { right: 90 } },
          scales: {
            y: this.getYScaleConfig(this.compYScale, this.compYTick, [...data, threshold])
          }
        },
        plugins: [endLabelPlugin]
      };
    };

    this.charts.indRatioLdr = new Chart(document.getElementById("chart-ind-ratio-ldr").getContext("2d"), createConfig("LDR (%)", ldrData, 85.0, "Trần Luật (85%)", true));
    this.charts.indRatioStml = new Chart(document.getElementById("chart-ind-ratio-stml").getContext("2d"), createConfig("Ngắn hạn cho vay trung-dài (%)", stmlData, 30.0, "Giới hạn (30%)", true));
    this.charts.indRatioLrr = new Chart(document.getElementById("chart-ind-ratio-lrr").getContext("2d"), createConfig("Dự trữ thanh khoản (%)", lrrData, 10.0, "Sàn Luật (10%)", false));
    this.charts.indRatioNpl = new Chart(document.getElementById("chart-ind-ratio-npl").getContext("2d"), createConfig("Nợ xấu NPL (%)", nplData, 3.0, "Ngưỡng giám sát (3%)", true));
  }

  renderCompareRatios() {
    const selectedBanks = this.ratioCompBanks;
    const year = this.ratioCompYear;

    // Hủy các chart so sánh ratios cũ
    this.destroyChart("compRatioLdr");
    this.destroyChart("compRatioStml");
    this.destroyChart("compRatioLrr");
    this.destroyChart("compRatioNpl");
    this.destroyChart("compRatioYearlyLdr");
    this.destroyChart("compRatioYearlyStml");
    this.destroyChart("compRatioYearlyLrr");
    this.destroyChart("compRatioYearlyNpl");

    if (year === "series") {
      const years = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"];

      this.ratioRender.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;">
          <!-- Chart LDR -->
          <div class="card" style="padding: 1.5rem; min-height: ${this.getChartHeight(this.compYTick) + 80}px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 0.5rem; font-size: 0.95rem;">So sánh Xu hướng LDR - Tỷ lệ Cho vay/Huy động (%)</h3>
            <div style="flex-grow: 1; position: relative; height: ${this.getChartHeight(this.compYTick)}px;">
              <canvas id="chart-comp-ratio-trend-ldr"></canvas>
            </div>
          </div>

          <!-- Chart STML -->
          <div class="card" style="padding: 1.5rem; min-height: ${this.getChartHeight(this.compYTick) + 80}px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 0.5rem; font-size: 0.95rem;">So sánh Xu hướng Vốn ngắn hạn cho vay Trung - Dài hạn (%)</h3>
            <div style="flex-grow: 1; position: relative; height: ${this.getChartHeight(this.compYTick)}px;">
              <canvas id="chart-comp-ratio-trend-stml"></canvas>
            </div>
          </div>

          <!-- Chart LRR -->
          <div class="card" style="padding: 1.5rem; min-height: ${this.getChartHeight(this.compYTick) + 80}px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 0.5rem; font-size: 0.95rem;">So sánh Xu hướng Tỷ lệ Dự trữ Thanh khoản (%)</h3>
            <div style="flex-grow: 1; position: relative; height: ${this.getChartHeight(this.compYTick)}px;">
              <canvas id="chart-comp-ratio-trend-lrr"></canvas>
            </div>
          </div>

          <!-- Chart NPL -->
          <div class="card" style="padding: 1.5rem; min-height: ${this.getChartHeight(this.compYTick) + 80}px; display: flex; flex-direction: column;">
            <h3 style="margin-bottom: 0.5rem; font-size: 0.95rem;">So sánh Xu hướng Tỷ lệ Nợ xấu NPL (%)</h3>
            <div style="flex-grow: 1; position: relative; height: ${this.getChartHeight(this.compYTick)}px;">
              <canvas id="chart-comp-ratio-trend-npl"></canvas>
            </div>
          </div>
        </div>
      `;

      if (!this.ratioCompareTableMetric) this.ratioCompareTableMetric = "npl";

      // Append Table comparing selected ratio over years
      this.ratioRender.innerHTML += `
        <!-- Table detail with toggle buttons -->
        <div class="card" style="padding: 1.5rem; overflow-x: auto; margin-top: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
            <h3 style="margin: 0; font-size: 1.05rem;"><i data-lucide="table"></i> Chi tiết Số liệu Chuỗi thời gian (%)</h3>
            <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
              <button class="ratio-metric-toggle-btn" data-metric="ldr" style="padding: 0.4rem 0.85rem; border-radius: 6px; font-weight: 600; font-size: 0.82rem; border: none; cursor: pointer; ${this.ratioCompareTableMetric === 'ldr' ? 'background: var(--primary); color: white;' : 'background: rgba(255,255,255,0.05); color: var(--text-muted);'}">LDR (Trần 85%)</button>
              <button class="ratio-metric-toggle-btn" data-metric="stml" style="padding: 0.4rem 0.85rem; border-radius: 6px; font-weight: 600; font-size: 0.82rem; border: none; cursor: pointer; ${this.ratioCompareTableMetric === 'stml' ? 'background: var(--primary); color: white;' : 'background: rgba(255,255,255,0.05); color: var(--text-muted);'}">Vốn ngắn hạn (Trần 30%)</button>
              <button class="ratio-metric-toggle-btn" data-metric="lrr" style="padding: 0.4rem 0.85rem; border-radius: 6px; font-weight: 600; font-size: 0.82rem; border: none; cursor: pointer; ${this.ratioCompareTableMetric === 'lrr' ? 'background: var(--primary); color: white;' : 'background: rgba(255,255,255,0.05); color: var(--text-muted);'}">Dự trữ thanh khoản LRR (Sàn 10%)</button>
              <button class="ratio-metric-toggle-btn" data-metric="npl" style="padding: 0.4rem 0.85rem; border-radius: 6px; font-weight: 600; font-size: 0.82rem; border: none; cursor: pointer; ${this.ratioCompareTableMetric === 'npl' ? 'background: var(--primary); color: white;' : 'background: rgba(255,255,255,0.05); color: var(--text-muted);'}">Nợ xấu NPL (Trần 3%)</button>
            </div>
          </div>
          <table id="ratio-comp-series-table" class="basel-table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
              <tr style="background: var(--card-header-bg); border-bottom: 2px solid var(--border-color);">
                <th style="text-align: left; padding: 0.75rem;">Ngân hàng</th>
                ${years.map(y => `<th style="text-align: right; padding: 0.75rem; min-width: 90px;">${y}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${selectedBanks.map(b => {
                const bankInfo = BANK_DATABASE[b];
                const cells = years.map(y => {
                  const val = bankInfo.ratio_data[y] ? bankInfo.ratio_data[y][this.ratioCompareTableMetric] : null;
                  const bctcFile = bankInfo.bctc_files && bankInfo.bctc_files[y];
                  const limit = this.ratioCompareTableMetric === "lrr" ? 10.0 : (this.ratioCompareTableMetric === "ldr" ? 85.0 : (this.ratioCompareTableMetric === "stml" ? 30.0 : 3.0));
                  const isMet = this.ratioCompareTableMetric === "lrr" ? (val >= limit) : (val <= limit);
                  
                  let cellStyle = `padding: 0.75rem; text-align: right; font-weight: 600; `;
                  if (val !== null) {
                    cellStyle += isMet ? 'color: var(--success); ' : 'color: var(--danger); ';
                    if (bctcFile) {
                      cellStyle += 'cursor: pointer; text-decoration: underline dashed var(--primary);';
                    }
                  }
                  const clickAttr = (val !== null && bctcFile) ? `onclick="window.documentFinder.openPdfViewer('docs/banks_bctc/${bctcFile}', '${bankInfo.name} - BCTC ${y}')"` : '';
                  return `<td style="${cellStyle}" ${clickAttr}>${val !== null ? val.toFixed(2) + '%' : '-'}</td>`;
                }).join("");

                return `
                  <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; border: none;">
                      <span style="width: 10px; height: 10px; border-radius: 50%; background: ${bankInfo.color};"></span>
                      ${bankInfo.name} (${b})
                    </td>
                    ${cells}
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `;

      this.initCompRatioTrendCharts(years, selectedBanks);
      this.setupSortableTable('ratio-comp-series-table');
      this.attachRatioTableClickHandlers();
      
      // Attach click events to toggle buttons
      const buttons = this.ratioRender.querySelectorAll(".ratio-metric-toggle-btn");
      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          this.ratioCompareTableMetric = btn.getAttribute("data-metric");
          this.renderCompareRatios();
        });
      });

      lucide.createIcons();
      return;
    }

    // 2. COMPARE YEARLY VIEW
    this.ratioRender.innerHTML = `
      <!-- Grid Biểu đồ So sánh Hàng năm -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;">
        <!-- Chart LDR -->
        <div class="card" style="padding: 1.5rem; min-height: ${this.getChartHeight(this.compYTick) + 60}px; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 1rem; text-align: center; font-size: 0.95rem;">Tỷ lệ LDR (%) các ngân hàng (${year})</h3>
          <div style="flex-grow: 1; position: relative; height: ${this.getChartHeight(this.compYTick)}px;">
            <canvas id="chart-comp-ratio-yearly-ldr"></canvas>
          </div>
        </div>

        <!-- Chart STML -->
        <div class="card" style="padding: 1.5rem; min-height: ${this.getChartHeight(this.compYTick) + 60}px; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 1rem; text-align: center; font-size: 0.95rem;">Vốn ngắn hạn cho vay trung-dài hạn (%) các ngân hàng (${year})</h3>
          <div style="flex-grow: 1; position: relative; height: ${this.getChartHeight(this.compYTick)}px;">
            <canvas id="chart-comp-ratio-yearly-stml"></canvas>
          </div>
        </div>

        <!-- Chart LRR -->
        <div class="card" style="padding: 1.5rem; min-height: ${this.getChartHeight(this.compYTick) + 60}px; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 1rem; text-align: center; font-size: 0.95rem;">Tỷ lệ dự trữ thanh khoản LRR (%) các ngân hàng (${year})</h3>
          <div style="flex-grow: 1; position: relative; height: ${this.getChartHeight(this.compYTick)}px;">
            <canvas id="chart-comp-ratio-yearly-lrr"></canvas>
          </div>
        </div>

        <!-- Chart NPL -->
        <div class="card" style="padding: 1.5rem; min-height: ${this.getChartHeight(this.compYTick) + 60}px; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 1rem; text-align: center; font-size: 0.95rem;">Tỷ lệ nợ xấu NPL (%) các ngân hàng (${year})</h3>
          <div style="flex-grow: 1; position: relative; height: ${this.getChartHeight(this.compYTick)}px;">
            <canvas id="chart-comp-ratio-yearly-npl"></canvas>
          </div>
        </div>
      </div>

      <!-- Bảng đối chiếu so sánh chỉ số -->
      <div class="card" style="padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3>Bảng Số liệu Đối chiếu Tỷ lệ An toàn BCTC (${year}) <span style="font-size:0.75rem;font-weight:400;color:var(--text-muted);">— Click cột để sắp xếp</span></h3>
        <div class="table-responsive" style="margin-top: 1rem;">
          <table id="ratio-comp-detail-table" class="comparison-table">
            <thead>
              <tr>
                <th>Ngân hàng</th>
                <th>LDR (%) <span style="font-size: 0.72rem; display:block; color:var(--text-muted); font-weight:400;">Trần 85%</span></th>
                <th>ST cho vay Trung-Dài (%) <span style="font-size: 0.72rem; display:block; color:var(--text-muted); font-weight:400;">Trần 30%</span></th>
                <th>Dự trữ thanh khoản (%) <span style="font-size: 0.72rem; display:block; color:var(--text-muted); font-weight:400;">Sàn 10%</span></th>
                <th>Tỷ lệ nợ xấu NPL (%) <span style="font-size: 0.72rem; display:block; color:var(--text-muted); font-weight:400;">Trần 3%</span></th>
                <th>Bản BCTC gốc</th>
              </tr>
            </thead>
            <tbody>
              ${selectedBanks.map(b => {
                const data = BANK_DATABASE[b].ratio_data[year];
                if (!data) {
                  return `
                    <tr>
                      <td class="criterion-col" style="border-left: 4px solid ${BANK_DATABASE[b].color};">
                        <strong>${BANK_DATABASE[b].name} (${b})</strong>
                      </td>
                      <td colspan="5" style="text-align: center; color: var(--text-muted); font-style: italic; font-size: 0.82rem;">Số liệu BCTC năm ${year} chưa công bố / không có sẵn</td>
                    </tr>
                  `;
                }

                const isLdrMet = data.ldr <= 85.0;
                const isStmlMet = data.stml <= 30.0;
                const isLrrMet = data.lrr >= 10.0;
                const isNplMet = data.npl <= 3.0;

                const bctcFile = BANK_DATABASE[b].bctc_files && BANK_DATABASE[b].bctc_files[year];

                const cellStyle = bctcFile ? `cursor: pointer; text-decoration: underline dashed var(--primary);` : '';
                const clickCall = bctcFile ? `onclick="window.documentFinder.openPdfViewer('docs/banks_bctc/${bctcFile}', '${BANK_DATABASE[b].name} - BCTC ${year}')"` : '';

                return `
                  <tr>
                    <td class="criterion-col" style="border-left: 4px solid ${BANK_DATABASE[b].color}; ${bctcFile ? 'cursor: pointer; text-decoration: underline dashed var(--primary);' : ''}" ${clickCall}>
                      <strong>${BANK_DATABASE[b].name} (${b})</strong>
                    </td>
                    <td style="font-weight: 700; color: ${isLdrMet ? 'var(--success)' : 'var(--danger)'}; ${cellStyle}" ${clickCall}>${data.ldr.toFixed(2)}%</td>
                    <td style="font-weight: 700; color: ${isStmlMet ? 'var(--success)' : 'var(--danger)'}; ${cellStyle}" ${clickCall}>${data.stml.toFixed(2)}%</td>
                    <td style="font-weight: 700; color: ${isLrrMet ? 'var(--success)' : 'var(--danger)'}; ${cellStyle}" ${clickCall}>${data.lrr.toFixed(2)}%</td>
                    <td style="font-weight: 700; color: ${isNplMet ? 'var(--success)' : 'var(--danger)'}; ${cellStyle}" ${clickCall}>${data.npl.toFixed(2)}%</td>
                    <td>
                      ${bctcFile ? `
                        <button class="source-link-btn open-pdf-analysis-btn" data-docpath="docs/banks_bctc/${bctcFile}" data-docname="${BANK_DATABASE[b].name} - Báo cáo tài chính năm ${year}" style="font-size:0.7rem; padding: 0.25rem 0.5rem; background: var(--primary); border: none; cursor: pointer; color: white;">
                          Xem BCTC
                        </button>
                      ` : '<span style="color:var(--text-muted);font-size:0.75rem;">Chưa có</span>'}
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.initCompRatioYearlyCharts(selectedBanks, year);
    this.setupSortableTable('ratio-comp-detail-table');
    this.attachRatioTableClickHandlers();

    const pdfBtns = this.ratioRender.querySelectorAll('.open-pdf-analysis-btn');
    pdfBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.documentFinder) {
          window.documentFinder.openPdfViewer(btn.dataset.docpath, btn.dataset.docname);
        }
      });
    });

    this.setupSortableTable('ratio-ind-yearly-table');
    this.attachRatioTableClickHandlers();
    lucide.createIcons();
  }

  initCompRatioTrendCharts(years, selectedBanks) {
    if (!window.Chart) return;
    const endLabelPlugin = this.getEndLabelPlugin();

    const createConfig = (labelName, extractFn, threshold, thresholdLabel, isMax = true) => {
      const thresholdColor = isMax ? '#ef4444' : '#10b981';
      const datasets = selectedBanks.map(b => {
        const bankData = BANK_DATABASE[b].ratio_data;
        return {
          label: b,
          shortLabel: b,
          data: years.map(y => bankData[y] ? extractFn(bankData[y]) : null),
          borderColor: BANK_DATABASE[b].color,
          backgroundColor: BANK_DATABASE[b].color + '10',
          borderWidth: 2.5,
          pointRadius: 4,
          tension: 0.15,
          fill: false
        };
      });

      // Thêm đường threshold pháp lý vào datasets
      datasets.push({
        label: thresholdLabel,
        data: Array(years.length).fill(threshold),
        borderColor: thresholdColor,
        borderWidth: 1.5,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      });

      const allDataVals = datasets.flatMap(ds => ds.data).filter(v => v !== null);

      return {
        type: 'line',
        data: {
          labels: years,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { right: 90 } },
          scales: {
            y: this.getYScaleConfig(this.compYScale, this.compYTick, [...allDataVals, threshold])
          }
        },
        plugins: [endLabelPlugin]
      };
    };

    this.charts.compRatioLdr = new Chart(document.getElementById("chart-comp-ratio-trend-ldr").getContext("2d"), createConfig("LDR (%)", d => d.ldr, 85.0, "Trần Luật (85%)", true));
    this.charts.compRatioStml = new Chart(document.getElementById("chart-comp-ratio-trend-stml").getContext("2d"), createConfig("Ngắn hạn cho vay trung-dài (%)", d => d.stml, 30.0, "Giới hạn (30%)", true));
    this.charts.compRatioLrr = new Chart(document.getElementById("chart-comp-ratio-trend-lrr").getContext("2d"), createConfig("Dự trữ thanh khoản (%)", d => d.lrr, 10.0, "Sàn Luật (10%)", false));
    this.charts.compRatioNpl = new Chart(document.getElementById("chart-comp-ratio-trend-npl").getContext("2d"), createConfig("Nợ xấu NPL (%)", d => d.npl, 3.0, "Ngưỡng giám sát (3%)", true));
  }

  // Helper plugin để vẽ đường threshold ngang trên biểu đồ cột (Bar Chart)
  getThresholdLinePlugin(threshold, label, color) {
    return {
      id: 'thresholdLine',
      afterDraw: (chart) => {
        const ctx = chart.ctx;
        const yAxis = chart.scales.y;
        if (!yAxis) return;
        const yPos = yAxis.getPixelForValue(threshold);
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = color;
        ctx.moveTo(chart.chartArea.left, yPos);
        ctx.lineTo(chart.chartArea.right, yPos);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.font = 'bold 9px Outfit';
        ctx.fillText(label, chart.chartArea.right - 90, yPos - 5);
        ctx.restore();
      }
    };
  }

  initCompRatioYearlyCharts(banks, year) {
    if (!window.Chart) return;

    const createConfig = (label, extractFn, threshold, thresholdLabel, isMax = true) => {
      const thresholdColor = isMax ? '#ef4444' : '#10b981';
      const values = banks.map(b => {
        const data = BANK_DATABASE[b].ratio_data[year];
        return data ? extractFn(data) : null;
      });

      const thresholdPlugin = this.getThresholdLinePlugin(threshold, thresholdLabel, thresholdColor);

      return {
        type: 'bar',
        data: {
          labels: banks,
          datasets: [{
            label: label,
            data: values,
            backgroundColor: banks.map(b => BANK_DATABASE[b].color),
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: (v) => v.toFixed(1) + '%' }
            }
          }
        },
        plugins: [thresholdPlugin]
      };
    };

    this.charts.compRatioYearlyLdr = new Chart(document.getElementById("chart-comp-ratio-yearly-ldr").getContext("2d"), createConfig("LDR (%)", d => d.ldr, 85.0, "Trần Luật: 85%", true));
    this.charts.compRatioYearlyStml = new Chart(document.getElementById("chart-comp-ratio-yearly-stml").getContext("2d"), createConfig("Ngắn hạn cho vay trung-dài (%)", d => d.stml, 30.0, "Giới hạn: 30%", true));
    this.charts.compRatioYearlyLrr = new Chart(document.getElementById("chart-comp-ratio-yearly-lrr").getContext("2d"), createConfig("Dự trữ thanh khoản (%)", d => d.lrr, 10.0, "Sàn Luật: 10%", false));
    this.charts.compRatioYearlyNpl = new Chart(document.getElementById("chart-comp-ratio-yearly-npl").getContext("2d"), createConfig("Nợ xấu NPL (%)", d => d.npl, 3.0, "Giới hạn: 3%", true));
  }
} // end of BaselAnalysis class
// Khởi chạy
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("bank-analysis-section")) {
    window.baselAnalysis = new BaselAnalysis();
  }
});
