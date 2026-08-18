// Trình tra cứu Tài liệu Bank & Basel - Cơ sở dữ liệu và Logic Cây thư mục gập mở
// Quản lý ghim tài liệu lưu trữ localStorage, tìm kiếm và lọc danh mục

const DOCS_DATABASE = [
  // 1. HIỆP ƯỚC BASEL QUỐC TẾ
  { id: "basel_i", name: "Basel I (1988) - Hiệp ước vốn Basel gốc", filename: "basel_i.pdf", path: "docs/basel_i.pdf", type: "basel", folder: "Hiệp ước Basel Quốc tế" },
  { id: "basel_ii", name: "Basel II (2004) - Hợp nhất quốc tế về đo lường vốn", filename: "basel_ii.pdf", path: "docs/basel_ii.pdf", type: "basel", folder: "Hiệp ước Basel Quốc tế" },
  { id: "basel_iii_capital", name: "Basel III (2010) - Khung đo lường vốn tối thiểu toàn cầu", filename: "basel_iii_capital.pdf", path: "docs/basel_iii_capital.pdf", type: "basel", folder: "Hiệp ước Basel Quốc tế" },
  { id: "basel_iii_liquidity", name: "Basel III (2013) - Khung tỷ lệ thanh khoản và đo lường rủi ro", filename: "basel_iii_liquidity.pdf", path: "docs/basel_iii_liquidity.pdf", type: "basel", folder: "Hiệp ước Basel Quốc tế" },
  { id: "basel_iv", name: "Basel IV (2017) - Cải cách cấu trúc tài sản rủi ro sau khủng hoảng", filename: "basel_iv.pdf", path: "docs/basel_iv.pdf", type: "basel", folder: "Hiệp ước Basel Quốc tế" },

  // 2. LUẬT & THÔNG TƯ
  { id: "l_tctd_2024", name: "Luật Các tổ chức tín dụng số 32/2024/QH15", filename: "luat_tctd_2024.pdf", path: "docs/luat_tctd_2024.pdf", type: "laws", folder: "Luật & Quy định Việt Nam" },
  { id: "l_nhnn_2010", name: "Luật Ngân hàng Nhà nước Việt Nam số 46/2010/QH12", filename: "luat_nhnn_2010.pdf", path: "docs/luat_nhnn_2010.pdf", type: "laws", folder: "Luật & Quy định Việt Nam" },
  { id: "tt_41_2016", name: "Thông tư 41/2016/TT-NHNN - Tỷ lệ an toàn vốn (Basel II)", filename: "thong_tu_41_2016.pdf", path: "docs/thong_tu_41_2016.pdf", type: "laws", folder: "Luật & Quy định Việt Nam" },
  { id: "tt_22_2019", name: "Thông tư 22/2019/TT-NHNN - Giới hạn tỷ lệ an toàn hoạt động", filename: "thong_tu_22_2019.pdf", path: "docs/thong_tu_22_2019.pdf", type: "laws", folder: "Luật & Quy định Việt Nam" },
  { id: "tt_11_2021", name: "Thông tư 11/2021/TT-NHNN - Phân loại nợ và trích lập dự phòng", filename: "thong_tu_11_2021.pdf", path: "docs/thong_tu_11_2021.pdf", type: "laws", folder: "Luật & Quy định Việt Nam" },
  { id: "tt_22_2023", name: "Thông tư 22/2023/TT-NHNN - Sửa đổi bổ sung Thông tư 41/2016", filename: "thong_tu_22_2023.pdf", path: "docs/thong_tu_22_2023.pdf", type: "laws", folder: "Luật & Quy định Việt Nam" },
  { id: "tt_14_2025", name: "Thông tư 14/2025/TT-NHNN - Quy định an toàn vốn (Basel III)", filename: "thong_tu_14_2025.pdf", path: "docs/thong_tu_14_2025.pdf", type: "laws", folder: "Luật & Quy định Việt Nam" },

  // 2. BÁO CÁO CAR CỦA 10 NGÂN HÀNG (80 PDFs offline)
  // Techcombank
  { id: "tcb_2019", name: "TCB Báo cáo CAR công bố thông tin năm 2019", filename: "TCB_CAR_2019_Nam.pdf", path: "docs/banks/TCB_CAR_2019_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Techcombank (TCB)" },
  { id: "tcb_2020", name: "TCB Báo cáo CAR công bố thông tin năm 2020", filename: "TCB_CAR_2020_Nam.pdf", path: "docs/banks/TCB_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Techcombank (TCB)" },
  { id: "tcb_2021", name: "TCB Báo cáo CAR công bố thông tin năm 2021", filename: "TCB_CAR_2021_Nam.pdf", path: "docs/banks/TCB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Techcombank (TCB)" },
  { id: "tcb_2022", name: "TCB Báo cáo CAR công bố thông tin năm 2022", filename: "TCB_CAR_2022_Nam.pdf", path: "docs/banks/TCB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Techcombank (TCB)" },
  { id: "tcb_2023", name: "TCB Báo cáo CAR công bố thông tin năm 2023", filename: "TCB_CAR_2023_Nam.pdf", path: "docs/banks/TCB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Techcombank (TCB)" },
  { id: "tcb_2024", name: "TCB Báo cáo CAR công bố thông tin năm 2024", filename: "TCB_CAR_2024_Nam.pdf", path: "docs/banks/TCB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Techcombank (TCB)" },
  { id: "tcb_2025", name: "TCB Báo cáo CAR công bố thông tin năm 2025", filename: "TCB_CAR_2025_Nam.pdf", path: "docs/banks/TCB_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Techcombank (TCB)" },

  // Vietcombank
  { id: "vcb_2019", name: "VCB Báo cáo CAR công bố thông tin năm 2019", filename: "VCB_CAR_2019_Nam.pdf", path: "docs/banks/VCB_CAR_2019_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Vietcombank (VCB)" },
  { id: "vcb_2020", name: "VCB Báo cáo CAR công bố thông tin năm 2020", filename: "VCB_CAR_2020_Nam.pdf", path: "docs/banks/VCB_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Vietcombank (VCB)" },
  { id: "vcb_2021", name: "VCB Báo cáo CAR công bố thông tin năm 2021", filename: "VCB_CAR_2021_Nam.pdf", path: "docs/banks/VCB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Vietcombank (VCB)" },
  { id: "vcb_2022", name: "VCB Báo cáo CAR công bố thông tin năm 2022", filename: "VCB_CAR_2022_Nam.pdf", path: "docs/banks/VCB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Vietcombank (VCB)" },
  { id: "vcb_2023", name: "VCB Báo cáo CAR công bố thông tin năm 2023", filename: "VCB_CAR_2023_Nam.pdf", path: "docs/banks/VCB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Vietcombank (VCB)" },
  { id: "vcb_2024", name: "VCB Báo cáo CAR công bố thông tin năm 2024", filename: "VCB_CAR_2024_Nam.pdf", path: "docs/banks/VCB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Vietcombank (VCB)" },
  { id: "vcb_2025", name: "VCB Báo cáo CAR công bố thông tin năm 2025", filename: "VCB_CAR_2025_Nam.pdf", path: "docs/banks/VCB_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Vietcombank (VCB)" },

  // BIDV
  { id: "bid_2019", name: "BID Báo cáo CAR công bố thông tin năm 2019", filename: "BID_CAR_2019_Nam.pdf", path: "docs/banks/BID_CAR_2019_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / BIDV (BID)" },
  { id: "bid_2020", name: "BID Báo cáo CAR công bố thông tin năm 2020", filename: "BID_CAR_2020_Nam.pdf", path: "docs/banks/BID_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / BIDV (BID)" },
  { id: "bid_2021", name: "BID Báo cáo CAR công bố thông tin năm 2021", filename: "BID_CAR_2021_Nam.pdf", path: "docs/banks/BID_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / BIDV (BID)" },
  { id: "bid_2022", name: "BID Báo cáo CAR công bố thông tin năm 2022", filename: "BID_CAR_2022_Nam.pdf", path: "docs/banks/BID_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / BIDV (BID)" },
  { id: "bid_2023", name: "BID Báo cáo CAR công bố thông tin năm 2023", filename: "BID_CAR_2023_Nam.pdf", path: "docs/banks/BID_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / BIDV (BID)" },
  { id: "bid_2024", name: "BID Báo cáo CAR công bố thông tin năm 2024", filename: "BID_CAR_2024_Nam.pdf", path: "docs/banks/BID_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / BIDV (BID)" },
  { id: "bid_2025", name: "BID Báo cáo CAR công bố thông tin năm 2025", filename: "BID_CAR_2025_Nam.pdf", path: "docs/banks/BID_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / BIDV (BID)" },

  // Vietinbank
  { id: "ctg_2021", name: "CTG Báo cáo CAR công bố thông tin năm 2021", filename: "CTG_CAR_2021_Nam.pdf", path: "docs/banks/CTG_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VietinBank (CTG)" },
  { id: "ctg_2022", name: "CTG Báo cáo CAR công bố thông tin năm 2022", filename: "CTG_CAR_2022_Nam.pdf", path: "docs/banks/CTG_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VietinBank (CTG)" },
  { id: "ctg_2023", name: "CTG Báo cáo CAR công bố thông tin năm 2023", filename: "CTG_CAR_2023_Nam.pdf", path: "docs/banks/CTG_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VietinBank (CTG)" },
  { id: "ctg_2024", name: "CTG Báo cáo CAR công bố thông tin năm 2024", filename: "CTG_CAR_2024_Nam.pdf", path: "docs/banks/CTG_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VietinBank (CTG)" },
  { id: "ctg_2025", name: "CTG Báo cáo CAR công bố thông tin năm 2025", filename: "CTG_CAR_2025_Nam.pdf", path: "docs/banks/CTG_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VietinBank (CTG)" },

  // MBBank
  { id: "mbb_2019", name: "MBB Báo cáo CAR công bố thông tin năm 2019", filename: "MBB_CAR_2019_Nam.pdf", path: "docs/banks/MBB_CAR_2019_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / MBBank (MBB)" },
  { id: "mbb_2020", name: "MBB Báo cáo CAR công bố thông tin năm 2020", filename: "MBB_CAR_2020_Nam.pdf", path: "docs/banks/MBB_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / MBBank (MBB)" },
  { id: "mbb_2021", name: "MBB Báo cáo CAR công bố thông tin năm 2021", filename: "MBB_CAR_2021_Nam.pdf", path: "docs/banks/MBB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / MBBank (MBB)" },
  { id: "mbb_2022", name: "MBB Báo cáo CAR công bố thông tin năm 2022", filename: "MBB_CAR_2022_Nam.pdf", path: "docs/banks/MBB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / MBBank (MBB)" },
  { id: "mbb_2023", name: "MBB Báo cáo CAR công bố thông tin năm 2023", filename: "MBB_CAR_2023_Nam.pdf", path: "docs/banks/MBB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / MBBank (MBB)" },
  { id: "mbb_2024", name: "MBB Báo cáo CAR công bố thông tin năm 2024", filename: "MBB_CAR_2024_Nam.pdf", path: "docs/banks/MBB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / MBBank (MBB)" },
  { id: "mbb_2025", name: "MBB Báo cáo CAR công bố thông tin năm 2025", filename: "MBB_CAR_2025_Nam.pdf", path: "docs/banks/MBB_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / MBBank (MBB)" },

  // VPBank
  { id: "vpb_2019", name: "VPB Báo cáo CAR công bố thông tin năm 2019", filename: "VPB_CAR_2019_Nam.pdf", path: "docs/banks/VPB_CAR_2019_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2019_q3", name: "VPB Báo cáo CAR công bố Quý 3/2019", filename: "VPB_CAR_2019_Q3.pdf", path: "docs/banks/VPB_CAR_2019_Q3.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2020", name: "VPB Báo cáo CAR công bố thông tin năm 2020", filename: "VPB_CAR_2020_Nam.pdf", path: "docs/banks/VPB_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2020_q1", name: "VPB Báo cáo CAR công bố Quý 1/2020", filename: "VPB_CAR_2020_Q1.pdf", path: "docs/banks/VPB_CAR_2020_Q1.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2020_q3", name: "VPB Báo cáo CAR công bố Quý 3/2020", filename: "VPB_CAR_2020_Q3.pdf", path: "docs/banks/VPB_CAR_2020_Q3.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2021", name: "VPB Báo cáo CAR công bố thông tin năm 2021", filename: "VPB_CAR_2021_Nam.pdf", path: "docs/banks/VPB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2021_q1", name: "VPB Báo cáo CAR công bố Quý 1/2021", filename: "VPB_CAR_2021_Q1.pdf", path: "docs/banks/VPB_CAR_2021_Q1.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2021_q3", name: "VPB Báo cáo CAR công bố Quý 3/2021", filename: "VPB_CAR_2021_Q3.pdf", path: "docs/banks/VPB_CAR_2021_Q3.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2022", name: "VPB Báo cáo CAR công bố thông tin năm 2022", filename: "VPB_CAR_2022_Nam.pdf", path: "docs/banks/VPB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2022_q1", name: "VPB Báo cáo CAR công bố Quý 1/2022", filename: "VPB_CAR_2022_Q1.pdf", path: "docs/banks/VPB_CAR_2022_Q1.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2022_q3", name: "VPB Báo cáo CAR công bố Quý 3/2022", filename: "VPB_CAR_2022_Q3.pdf", path: "docs/banks/VPB_CAR_2022_Q3.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2023", name: "VPB Báo cáo CAR công bố thông tin năm 2023", filename: "VPB_CAR_2023_Nam.pdf", path: "docs/banks/VPB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2023_q1", name: "VPB Báo cáo CAR công bố Quý 1/2023", filename: "VPB_CAR_2023_Q1.pdf", path: "docs/banks/VPB_CAR_2023_Q1.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2023_q3", name: "VPB Báo cáo CAR công bố Quý 3/2023", filename: "VPB_CAR_2023_Q3.pdf", path: "docs/banks/VPB_CAR_2023_Q3.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2024", name: "VPB Báo cáo CAR công bố thông tin năm 2024", filename: "VPB_CAR_2024_Nam.pdf", path: "docs/banks/VPB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2024_q1", name: "VPB Báo cáo CAR công bố Quý 1/2024", filename: "VPB_CAR_2024_Q1.pdf", path: "docs/banks/VPB_CAR_2024_Q1.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2024_q3", name: "VPB Báo cáo CAR công bố Quý 3/2024", filename: "VPB_CAR_2024_Q3.pdf", path: "docs/banks/VPB_CAR_2024_Q3.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2025", name: "VPB Báo cáo CAR công bố thông tin năm 2025", filename: "VPB_CAR_2025_Nam.pdf", path: "docs/banks/VPB_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2025_q1", name: "VPB Báo cáo CAR công bố Quý 1/2025", filename: "VPB_CAR_2025_Q1.pdf", path: "docs/banks/VPB_CAR_2025_Q1.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },
  { id: "vpb_2025_q3", name: "VPB Báo cáo CAR công bố Quý 3/2025", filename: "VPB_CAR_2025_Q3.pdf", path: "docs/banks/VPB_CAR_2025_Q3.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VPBank (VPB)" },

  // ACB
  { id: "acb_2019", name: "ACB Báo cáo CAR công bố thông tin năm 2019", filename: "ACB_CAR_2019_Nam.pdf", path: "docs/banks/ACB_CAR_2019_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / ACB (ACB)" },
  { id: "acb_2020", name: "ACB Báo cáo CAR công bố thông tin năm 2020", filename: "ACB_CAR_2020_Nam.pdf", path: "docs/banks/ACB_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / ACB (ACB)" },
  { id: "acb_2021", name: "ACB Báo cáo CAR công bố thông tin năm 2021", filename: "ACB_CAR_2021_Nam.pdf", path: "docs/banks/ACB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / ACB (ACB)" },
  { id: "acb_2022", name: "ACB Báo cáo CAR công bố thông tin năm 2022", filename: "ACB_CAR_2022_Nam.pdf", path: "docs/banks/ACB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / ACB (ACB)" },
  { id: "acb_2023", name: "ACB Báo cáo CAR công bố thông tin năm 2023", filename: "ACB_CAR_2023_Nam.pdf", path: "docs/banks/ACB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / ACB (ACB)" },
  { id: "acb_2024", name: "ACB Báo cáo CAR công bố thông tin năm 2024", filename: "ACB_CAR_2024_Nam.pdf", path: "docs/banks/ACB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / ACB (ACB)" },
  { id: "acb_2025", name: "ACB Báo cáo CAR công bố thông tin năm 2025", filename: "ACB_CAR_2025_Nam.pdf", path: "docs/banks/ACB_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / ACB (ACB)" },

  // Sacombank
  { id: "stb_2020", name: "STB Báo cáo CAR công bố thông tin năm 2020", filename: "STB_CAR_2020_Nam.pdf", path: "docs/banks/STB_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Sacombank (STB)" },
  { id: "stb_2021", name: "STB Báo cáo CAR công bố thông tin năm 2021", filename: "STB_CAR_2021_Nam.pdf", path: "docs/banks/STB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Sacombank (STB)" },
  { id: "stb_2022", name: "STB Báo cáo CAR công bố thông tin năm 2022", filename: "STB_CAR_2022_Nam.pdf", path: "docs/banks/STB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Sacombank (STB)" },
  { id: "stb_2023", name: "STB Báo cáo CAR công bố thông tin năm 2023", filename: "STB_CAR_2023_Nam.pdf", path: "docs/banks/STB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Sacombank (STB)" },
  { id: "stb_2024", name: "STB Báo cáo CAR công bố thông tin năm 2024", filename: "STB_CAR_2024_Nam.pdf", path: "docs/banks/STB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Sacombank (STB)" },
  { id: "stb_2025", name: "STB Báo cáo CAR công bố thông tin năm 2025", filename: "STB_CAR_2025_Nam.pdf", path: "docs/banks/STB_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Sacombank (STB)" },

  // TPBank
  { id: "tpb_2019", name: "TPB Báo cáo CAR công bố thông tin năm 2019", filename: "TPB_CAR_2019_Nam.pdf", path: "docs/banks/TPB_CAR_2019_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / TPBank (TPB)" },
  { id: "tpb_2020", name: "TPB Báo cáo CAR công bố thông tin năm 2020", filename: "TPB_CAR_2020_Nam.pdf", path: "docs/banks/TPB_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / TPBank (TPB)" },
  { id: "tpb_2021", name: "TPB Báo cáo CAR công bố thông tin năm 2021", filename: "TPB_CAR_2021_Nam.pdf", path: "docs/banks/TPB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / TPBank (TPB)" },
  { id: "tpb_2022", name: "TPB Báo cáo CAR công bố thông tin năm 2022", filename: "TPB_CAR_2022_Nam.pdf", path: "docs/banks/TPB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / TPBank (TPB)" },
  { id: "tpb_2023", name: "TPB Báo cáo CAR công bố thông tin năm 2023", filename: "TPB_CAR_2023_Nam.pdf", path: "docs/banks/TPB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / TPBank (TPB)" },
  { id: "tpb_2024", name: "TPB Báo cáo CAR công bố thông tin năm 2024", filename: "TPB_CAR_2024_Nam.pdf", path: "docs/banks/TPB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / TPBank (TPB)" },
  { id: "tpb_2025", name: "TPB Báo cáo CAR công bố thông tin năm 2025", filename: "TPB_CAR_2025_Nam.pdf", path: "docs/banks/TPB_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / TPBank (TPB)" },

  // HDBank
  { id: "hdb_2020", name: "HDB Báo cáo CAR công bố thông tin năm 2020", filename: "HDB_CAR_2020_Nam.pdf", path: "docs/banks/HDB_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / HDBank (HDB)" },
  { id: "hdb_2020_q1", name: "HDB Báo cáo CAR công bố Quý 1/2020", filename: "HDB_CAR_2020_Q1.pdf", path: "docs/banks/HDB_CAR_2020_Q1.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / HDBank (HDB)" },
  { id: "hdb_2021", name: "HDB Báo cáo CAR công bố thông tin năm 2021", filename: "HDB_CAR_2021_Nam.pdf", path: "docs/banks/HDB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / HDBank (HDB)" },
  { id: "hdb_2022", name: "HDB Báo cáo CAR công bố thông tin năm 2022", filename: "HDB_CAR_2022_Nam.pdf", path: "docs/banks/HDB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / HDBank (HDB)" },
  { id: "hdb_2023", name: "HDB Báo cáo CAR công bố thông tin năm 2023", filename: "HDB_CAR_2023_Nam.pdf", path: "docs/banks/HDB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / HDBank (HDB)" },
  { id: "hdb_2024", name: "HDB Báo cáo CAR công bố thông tin năm 2024", filename: "HDB_CAR_2024_Nam.pdf", path: "docs/banks/HDB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / HDBank (HDB)" },
  { id: "hdb_2025", name: "HDB Báo cáo CAR công bố thông tin năm 2025", filename: "HDB_CAR_2025_Nam.pdf", path: "docs/banks/HDB_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / HDBank (HDB)" },

  // SHB
  { id: "shb_2020", name: "SHB Báo cáo CAR công bố thông tin năm 2020", filename: "SHB_CAR_2020_Nam.pdf", path: "docs/banks/SHB_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / SHB (SHB)" },
  { id: "shb_2021", name: "SHB Báo cáo CAR công bố thông tin năm 2021", filename: "SHB_CAR_2021_Nam.pdf", path: "docs/banks/SHB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / SHB (SHB)" },
  { id: "shb_2022", name: "SHB Báo cáo CAR công bố thông tin năm 2022", filename: "SHB_CAR_2022_Nam.pdf", path: "docs/banks/SHB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / SHB (SHB)" },
  { id: "shb_2023", name: "SHB Báo cáo CAR công bố thông tin năm 2023", filename: "SHB_CAR_2023_Nam.pdf", path: "docs/banks/SHB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / SHB (SHB)" },
  { id: "shb_2024", name: "SHB Báo cáo CAR công bố thông tin năm 2024", filename: "SHB_CAR_2024_Nam.pdf", path: "docs/banks/SHB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / SHB (SHB)" },
  { id: "shb_2025", name: "SHB Báo cáo CAR công bố thông tin năm 2025", filename: "SHB_CAR_2025_Nam.pdf", path: "docs/banks/SHB_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / SHB (SHB)" },

  // VIB
  { id: "vib_2019", name: "VIB Báo cáo CAR công bố thông tin năm 2019", filename: "VIB_CAR_2019_Nam.pdf", path: "docs/banks/VIB_CAR_2019_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VIB (VIB)" },
  { id: "vib_2020", name: "VIB Báo cáo CAR công bố thông tin năm 2020", filename: "VIB_CAR_2020_Nam.pdf", path: "docs/banks/VIB_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VIB (VIB)" },
  { id: "vib_2021", name: "VIB Báo cáo CAR công bố thông tin năm 2021", filename: "VIB_CAR_2021_Nam.pdf", path: "docs/banks/VIB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VIB (VIB)" },
  { id: "vib_2022", name: "VIB Báo cáo CAR công bố thông tin năm 2022", filename: "VIB_CAR_2022_Nam.pdf", path: "docs/banks/VIB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VIB (VIB)" },
  { id: "vib_2023", name: "VIB Báo cáo CAR công bố thông tin năm 2023", filename: "VIB_CAR_2023_Nam.pdf", path: "docs/banks/VIB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VIB (VIB)" },
  { id: "vib_2024", name: "VIB Báo cáo CAR công bố thông tin năm 2024", filename: "VIB_CAR_2024_Nam.pdf", path: "docs/banks/VIB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / VIB (VIB)" },

  // LPBank
  { id: "lpb_2020", name: "LPB Báo cáo CAR công bố thông tin năm 2020", filename: "LPB_CAR_2020_Nam.pdf", path: "docs/banks/LPB_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / LPBank (LPB)" },
  { id: "lpb_2021", name: "LPB Báo cáo CAR công bố thông tin năm 2021", filename: "LPB_CAR_2021_Nam.pdf", path: "docs/banks/LPB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / LPBank (LPB)" },
  { id: "lpb_2022", name: "LPB Báo cáo CAR công bố thông tin năm 2022", filename: "LPB_CAR_2022_Nam.pdf", path: "docs/banks/LPB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / LPBank (LPB)" },
  { id: "lpb_2023", name: "LPB Báo cáo CAR công bố thông tin năm 2023", filename: "LPB_CAR_2023_Nam.pdf", path: "docs/banks/LPB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / LPBank (LPB)" },
  { id: "lpb_2024", name: "LPB Báo cáo CAR công bố thông tin năm 2024", filename: "LPB_CAR_2024_Nam.pdf", path: "docs/banks/LPB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / LPBank (LPB)" },
  { id: "lpb_2025", name: "LPB Báo cáo CAR công bố thông tin năm 2025", filename: "LPB_CAR_2025_Nam.pdf", path: "docs/banks/LPB_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / LPBank (LPB)" },

  // MSB

  // SeABank
  { id: "ssb_2020", name: "SSB Báo cáo CAR công bố thông tin năm 2020", filename: "SSB_CAR_2020_Nam.pdf", path: "docs/banks/SSB_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / SeABank (SSB)" },
  { id: "ssb_2021", name: "SSB Báo cáo CAR công bố thông tin năm 2021", filename: "SSB_CAR_2021_Nam.pdf", path: "docs/banks/SSB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / SeABank (SSB)" },
  { id: "ssb_2022", name: "SSB Báo cáo CAR công bố thông tin năm 2022", filename: "SSB_CAR_2022_Nam.pdf", path: "docs/banks/SSB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / SeABank (SSB)" },
  { id: "ssb_2023", name: "SSB Báo cáo CAR công bố thông tin năm 2023", filename: "SSB_CAR_2023_Nam.pdf", path: "docs/banks/SSB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / SeABank (SSB)" },
  { id: "ssb_2024", name: "SSB Báo cáo CAR công bố thông tin năm 2024", filename: "SSB_CAR_2024_Nam.pdf", path: "docs/banks/SSB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / SeABank (SSB)" },
  { id: "ssb_2025", name: "SSB Báo cáo CAR công bố thông tin năm 2025", filename: "SSB_CAR_2025_Nam.pdf", path: "docs/banks/SSB_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / SeABank (SSB)" },

  // OCB
  { id: "ocb_2019", name: "OCB Báo cáo CAR công bố thông tin năm 2019", filename: "OCB_CAR_2019_Nam.pdf", path: "docs/banks/OCB_CAR_2019_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / OCB (OCB)" },
  { id: "ocb_2020", name: "OCB Báo cáo CAR công bố thông tin năm 2020", filename: "OCB_CAR_2020_Nam.pdf", path: "docs/banks/OCB_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / OCB (OCB)" },
  { id: "ocb_2021", name: "OCB Báo cáo CAR công bố thông tin năm 2021", filename: "OCB_CAR_2021_Nam.pdf", path: "docs/banks/OCB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / OCB (OCB)" },
  { id: "ocb_2022", name: "OCB Báo cáo CAR công bố thông tin năm 2022", filename: "OCB_CAR_2022_Nam.pdf", path: "docs/banks/OCB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / OCB (OCB)" },
  { id: "ocb_2023", name: "OCB Báo cáo CAR công bố thông tin năm 2023", filename: "OCB_CAR_2023_Nam.pdf", path: "docs/banks/OCB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / OCB (OCB)" },
  { id: "ocb_2024", name: "OCB Báo cáo CAR công bố thông tin năm 2024", filename: "OCB_CAR_2024_Nam.pdf", path: "docs/banks/OCB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / OCB (OCB)" },
  { id: "ocb_2025", name: "OCB Báo cáo CAR công bố thông tin năm 2025", filename: "OCB_CAR_2025_Nam.pdf", path: "docs/banks/OCB_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / OCB (OCB)" },

  // Eximbank
  { id: "eib_2021", name: "EIB Báo cáo CAR công bố thông tin năm 2021", filename: "EIB_CAR_2021_Nam.pdf", path: "docs/banks/EIB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Eximbank (EIB)" },
  { id: "eib_2022", name: "EIB Báo cáo CAR công bố thông tin năm 2022", filename: "EIB_CAR_2022_Nam.pdf", path: "docs/banks/EIB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Eximbank (EIB)" },
  { id: "eib_2023", name: "EIB Báo cáo CAR công bố thông tin năm 2023", filename: "EIB_CAR_2023_Nam.pdf", path: "docs/banks/EIB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Eximbank (EIB)" },
  { id: "eib_2024", name: "EIB Báo cáo CAR công bố thông tin năm 2024", filename: "EIB_CAR_2024_Nam.pdf", path: "docs/banks/EIB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Eximbank (EIB)" },
  { id: "eib_2025", name: "EIB Báo cáo CAR công bố thông tin năm 2025", filename: "EIB_CAR_2025_Nam.pdf", path: "docs/banks/EIB_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Eximbank (EIB)" },

  // Bac A Bank
  { id: "bab_2020", name: "BAB Báo cáo CAR công bố thông tin năm 2020", filename: "BAB_CAR_2020_Nam.pdf", path: "docs/banks/BAB_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Bac A Bank (BAB)" },
  { id: "bab_2021", name: "BAB Báo cáo CAR công bố thông tin năm 2021", filename: "BAB_CAR_2021_Nam.pdf", path: "docs/banks/BAB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Bac A Bank (BAB)" },
  { id: "bab_2022", name: "BAB Báo cáo CAR công bố thông tin năm 2022", filename: "BAB_CAR_2022_Nam.pdf", path: "docs/banks/BAB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Bac A Bank (BAB)" },
  { id: "bab_2023", name: "BAB Báo cáo CAR công bố thông tin năm 2023", filename: "BAB_CAR_2023_Nam.pdf", path: "docs/banks/BAB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Bac A Bank (BAB)" },
  { id: "bab_2024", name: "BAB Báo cáo CAR công bố thông tin năm 2024", filename: "BAB_CAR_2024_Nam.pdf", path: "docs/banks/BAB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Bac A Bank (BAB)" },
  { id: "bab_2025", name: "BAB Báo cáo CAR công bố thông tin năm 2025", filename: "BAB_CAR_2025_Nam.pdf", path: "docs/banks/BAB_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Bac A Bank (BAB)" },

  // An Binh Bank
  { id: "abb_2020", name: "ABB Báo cáo CAR công bố thông tin năm 2020", filename: "ABB_CAR_2020_Nam.pdf", path: "docs/banks/ABB_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / An Binh Bank (ABB)" },
  { id: "abb_2021", name: "ABB Báo cáo CAR công bố thông tin năm 2021", filename: "ABB_CAR_2021_Nam.pdf", path: "docs/banks/ABB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / An Binh Bank (ABB)" },
  { id: "abb_2022", name: "ABB Báo cáo CAR công bố thông tin năm 2022", filename: "ABB_CAR_2022_Nam.pdf", path: "docs/banks/ABB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / An Binh Bank (ABB)" },
  { id: "abb_2023", name: "ABB Báo cáo CAR công bố thông tin năm 2023", filename: "ABB_CAR_2023_Nam.pdf", path: "docs/banks/ABB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / An Binh Bank (ABB)" },
  { id: "abb_2024", name: "ABB Báo cáo CAR công bố thông tin năm 2024", filename: "ABB_CAR_2024_Nam.pdf", path: "docs/banks/ABB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / An Binh Bank (ABB)" },
  { id: "abb_2025", name: "ABB Báo cáo CAR công bố thông tin năm 2025", filename: "ABB_CAR_2025_Nam.pdf", path: "docs/banks/ABB_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / An Binh Bank (ABB)" },

  // Nam A Bank
  { id: "nab_2020", name: "NAB Báo cáo CAR công bố thông tin năm 2020", filename: "NAB_CAR_2020_Nam.pdf", path: "docs/banks/NAB_CAR_2020_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Nam A Bank (NAB)" },
  { id: "nab_2021", name: "NAB Báo cáo CAR công bố thông tin năm 2021", filename: "NAB_CAR_2021_Nam.pdf", path: "docs/banks/NAB_CAR_2021_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Nam A Bank (NAB)" },
  { id: "nab_2022", name: "NAB Báo cáo CAR công bố thông tin năm 2022", filename: "NAB_CAR_2022_Nam.pdf", path: "docs/banks/NAB_CAR_2022_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Nam A Bank (NAB)" },
  { id: "nab_2023", name: "NAB Báo cáo CAR công bố thông tin năm 2023", filename: "NAB_CAR_2023_Nam.pdf", path: "docs/banks/NAB_CAR_2023_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Nam A Bank (NAB)" },
  { id: "nab_2024", name: "NAB Báo cáo CAR công bố thông tin năm 2024", filename: "NAB_CAR_2024_Nam.pdf", path: "docs/banks/NAB_CAR_2024_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Nam A Bank (NAB)" },
  { id: "nab_2025", name: "NAB Báo cáo CAR công bố thông tin năm 2025", filename: "NAB_CAR_2025_Nam.pdf", path: "docs/banks/NAB_CAR_2025_Nam.pdf", type: "banks", folder: "Báo cáo CAR Ngân hàng / Nam A Bank (NAB)" }
,

  // ===== BÁO CÁO TÀI CHÍNH (BCTC) CỦA CÁC NGÂN HÀNG (TẢI TỪ VIETSTOCK) =====
  { id: "acb_bctc_2019", name: "ACB BCTC hợp nhất kiểm toán năm 2019", filename: "ACB_BCTC_2019_Nam.pdf", path: "docs/banks_bctc/ACB_BCTC_2019_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / ACB (ACB)" },
  { id: "acb_bctc_2020", name: "ACB BCTC hợp nhất kiểm toán năm 2020", filename: "ACB_BCTC_2020_Nam.pdf", path: "docs/banks_bctc/ACB_BCTC_2020_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / ACB (ACB)" },
  { id: "acb_bctc_2021", name: "ACB BCTC hợp nhất kiểm toán năm 2021", filename: "ACB_BCTC_2021_Nam.pdf", path: "docs/banks_bctc/ACB_BCTC_2021_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / ACB (ACB)" },
  { id: "acb_bctc_2022", name: "ACB BCTC hợp nhất kiểm toán năm 2022", filename: "ACB_BCTC_2022_Nam.pdf", path: "docs/banks_bctc/ACB_BCTC_2022_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / ACB (ACB)" },
  { id: "acb_bctc_2023", name: "ACB BCTC hợp nhất kiểm toán năm 2023", filename: "ACB_BCTC_2023_Nam.pdf", path: "docs/banks_bctc/ACB_BCTC_2023_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / ACB (ACB)" },
  { id: "acb_bctc_2024", name: "ACB BCTC hợp nhất kiểm toán năm 2024", filename: "ACB_BCTC_2024_Nam.pdf", path: "docs/banks_bctc/ACB_BCTC_2024_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / ACB (ACB)" },
  { id: "acb_bctc_2025", name: "ACB BCTC hợp nhất kiểm toán năm 2025", filename: "ACB_BCTC_2025_Nam.pdf", path: "docs/banks_bctc/ACB_BCTC_2025_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / ACB (ACB)" },
  { id: "bid_bctc_2019", name: "BID BCTC hợp nhất kiểm toán năm 2019", filename: "BID_BCTC_2019_Nam.pdf", path: "docs/banks_bctc/BID_BCTC_2019_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / BIDV (BID)" },
  { id: "bid_bctc_2020", name: "BID BCTC hợp nhất kiểm toán năm 2020", filename: "BID_BCTC_2020_Nam.pdf", path: "docs/banks_bctc/BID_BCTC_2020_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / BIDV (BID)" },
  { id: "bid_bctc_2021", name: "BID BCTC hợp nhất kiểm toán năm 2021", filename: "BID_BCTC_2021_Nam.pdf", path: "docs/banks_bctc/BID_BCTC_2021_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / BIDV (BID)" },
  { id: "bid_bctc_2022", name: "BID BCTC hợp nhất kiểm toán năm 2022", filename: "BID_BCTC_2022_Nam.pdf", path: "docs/banks_bctc/BID_BCTC_2022_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / BIDV (BID)" },
  { id: "bid_bctc_2023", name: "BID BCTC hợp nhất kiểm toán năm 2023", filename: "BID_BCTC_2023_Nam.pdf", path: "docs/banks_bctc/BID_BCTC_2023_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / BIDV (BID)" },
  { id: "bid_bctc_2024", name: "BID BCTC hợp nhất kiểm toán năm 2024", filename: "BID_BCTC_2024_Nam.pdf", path: "docs/banks_bctc/BID_BCTC_2024_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / BIDV (BID)" },
  { id: "bid_bctc_2025", name: "BID BCTC hợp nhất kiểm toán năm 2025", filename: "BID_BCTC_2025_Nam.pdf", path: "docs/banks_bctc/BID_BCTC_2025_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / BIDV (BID)" },
  { id: "ctg_bctc_2019", name: "CTG BCTC hợp nhất kiểm toán năm 2019", filename: "CTG_BCTC_2019_Nam.pdf", path: "docs/banks_bctc/CTG_BCTC_2019_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / VietinBank (CTG)" },
  { id: "ctg_bctc_2020", name: "CTG BCTC hợp nhất kiểm toán năm 2020", filename: "CTG_BCTC_2020_Nam.pdf", path: "docs/banks_bctc/CTG_BCTC_2020_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / VietinBank (CTG)" },
  { id: "ctg_bctc_2021", name: "CTG BCTC hợp nhất kiểm toán năm 2021", filename: "CTG_BCTC_2021_Nam.pdf", path: "docs/banks_bctc/CTG_BCTC_2021_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / VietinBank (CTG)" },
  { id: "ctg_bctc_2022", name: "CTG BCTC hợp nhất kiểm toán năm 2022", filename: "CTG_BCTC_2022_Nam.pdf", path: "docs/banks_bctc/CTG_BCTC_2022_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / VietinBank (CTG)" },
  { id: "ctg_bctc_2023", name: "CTG BCTC hợp nhất kiểm toán năm 2023", filename: "CTG_BCTC_2023_Nam.pdf", path: "docs/banks_bctc/CTG_BCTC_2023_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / VietinBank (CTG)" },
  { id: "ctg_bctc_2024", name: "CTG BCTC hợp nhất kiểm toán năm 2024", filename: "CTG_BCTC_2024_Nam.pdf", path: "docs/banks_bctc/CTG_BCTC_2024_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / VietinBank (CTG)" },
  { id: "ctg_bctc_2025", name: "CTG BCTC hợp nhất kiểm toán năm 2025", filename: "CTG_BCTC_2025_Nam.pdf", path: "docs/banks_bctc/CTG_BCTC_2025_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / VietinBank (CTG)" },
  { id: "hdb_bctc_2019", name: "HDB BCTC hợp nhất kiểm toán năm 2019", filename: "HDB_BCTC_2019_Nam.pdf", path: "docs/banks_bctc/HDB_BCTC_2019_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / HDBank (HDB)" },
  { id: "hdb_bctc_2020", name: "HDB BCTC hợp nhất kiểm toán năm 2020", filename: "HDB_BCTC_2020_Nam.pdf", path: "docs/banks_bctc/HDB_BCTC_2020_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / HDBank (HDB)" },
  { id: "hdb_bctc_2021", name: "HDB BCTC hợp nhất kiểm toán năm 2021", filename: "HDB_BCTC_2021_Nam.pdf", path: "docs/banks_bctc/HDB_BCTC_2021_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / HDBank (HDB)" },
  { id: "hdb_bctc_2022", name: "HDB BCTC hợp nhất kiểm toán năm 2022", filename: "HDB_BCTC_2022_Nam.pdf", path: "docs/banks_bctc/HDB_BCTC_2022_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / HDBank (HDB)" },
  { id: "hdb_bctc_2023", name: "HDB BCTC hợp nhất kiểm toán năm 2023", filename: "HDB_BCTC_2023_Nam.pdf", path: "docs/banks_bctc/HDB_BCTC_2023_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / HDBank (HDB)" },
  { id: "hdb_bctc_2024", name: "HDB BCTC hợp nhất kiểm toán năm 2024", filename: "HDB_BCTC_2024_Nam.pdf", path: "docs/banks_bctc/HDB_BCTC_2024_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / HDBank (HDB)" },
  { id: "hdb_bctc_2025", name: "HDB BCTC hợp nhất kiểm toán năm 2025", filename: "HDB_BCTC_2025_Nam.pdf", path: "docs/banks_bctc/HDB_BCTC_2025_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / HDBank (HDB)" },
  { id: "mbb_bctc_2019", name: "MBB BCTC hợp nhất kiểm toán năm 2019", filename: "MBB_BCTC_2019_Nam.pdf", path: "docs/banks_bctc/MBB_BCTC_2019_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / MBBank (MBB)" },
  { id: "mbb_bctc_2020", name: "MBB BCTC hợp nhất kiểm toán năm 2020", filename: "MBB_BCTC_2020_Nam.pdf", path: "docs/banks_bctc/MBB_BCTC_2020_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / MBBank (MBB)" },
  { id: "mbb_bctc_2021", name: "MBB BCTC hợp nhất kiểm toán năm 2021", filename: "MBB_BCTC_2021_Nam.pdf", path: "docs/banks_bctc/MBB_BCTC_2021_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / MBBank (MBB)" },
  { id: "mbb_bctc_2022", name: "MBB BCTC hợp nhất kiểm toán năm 2022", filename: "MBB_BCTC_2022_Nam.pdf", path: "docs/banks_bctc/MBB_BCTC_2022_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / MBBank (MBB)" },
  { id: "mbb_bctc_2023", name: "MBB BCTC hợp nhất kiểm toán năm 2023", filename: "MBB_BCTC_2023_Nam.pdf", path: "docs/banks_bctc/MBB_BCTC_2023_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / MBBank (MBB)" },
  { id: "mbb_bctc_2024", name: "MBB BCTC hợp nhất kiểm toán năm 2024", filename: "MBB_BCTC_2024_Nam.pdf", path: "docs/banks_bctc/MBB_BCTC_2024_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / MBBank (MBB)" },
  { id: "mbb_bctc_2025", name: "MBB BCTC hợp nhất kiểm toán năm 2025", filename: "MBB_BCTC_2025_Nam.pdf", path: "docs/banks_bctc/MBB_BCTC_2025_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / MBBank (MBB)" },
  { id: "stb_bctc_2019", name: "STB BCTC hợp nhất kiểm toán năm 2019", filename: "STB_BCTC_2019_Nam.pdf", path: "docs/banks_bctc/STB_BCTC_2019_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Sacombank (STB)" },
  { id: "stb_bctc_2020", name: "STB BCTC hợp nhất kiểm toán năm 2020", filename: "STB_BCTC_2020_Nam.pdf", path: "docs/banks_bctc/STB_BCTC_2020_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Sacombank (STB)" },
  { id: "stb_bctc_2021", name: "STB BCTC hợp nhất kiểm toán năm 2021", filename: "STB_BCTC_2021_Nam.pdf", path: "docs/banks_bctc/STB_BCTC_2021_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Sacombank (STB)" },
  { id: "stb_bctc_2022", name: "STB BCTC hợp nhất kiểm toán năm 2022", filename: "STB_BCTC_2022_Nam.pdf", path: "docs/banks_bctc/STB_BCTC_2022_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Sacombank (STB)" },
  { id: "stb_bctc_2023", name: "STB BCTC hợp nhất kiểm toán năm 2023", filename: "STB_BCTC_2023_Nam.pdf", path: "docs/banks_bctc/STB_BCTC_2023_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Sacombank (STB)" },
  { id: "stb_bctc_2024", name: "STB BCTC hợp nhất kiểm toán năm 2024", filename: "STB_BCTC_2024_Nam.pdf", path: "docs/banks_bctc/STB_BCTC_2024_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Sacombank (STB)" },
  { id: "stb_bctc_2025", name: "STB BCTC hợp nhất kiểm toán năm 2025", filename: "STB_BCTC_2025_Nam.pdf", path: "docs/banks_bctc/STB_BCTC_2025_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Sacombank (STB)" },
  { id: "tcb_bctc_2019", name: "TCB BCTC hợp nhất kiểm toán năm 2019", filename: "TCB_BCTC_2019_Nam.pdf", path: "docs/banks_bctc/TCB_BCTC_2019_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Techcombank (TCB)" },
  { id: "tcb_bctc_2020", name: "TCB BCTC hợp nhất kiểm toán năm 2020", filename: "TCB_BCTC_2020_Nam.pdf", path: "docs/banks_bctc/TCB_BCTC_2020_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Techcombank (TCB)" },
  { id: "tcb_bctc_2021", name: "TCB BCTC hợp nhất kiểm toán năm 2021", filename: "TCB_BCTC_2021_Nam.pdf", path: "docs/banks_bctc/TCB_BCTC_2021_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Techcombank (TCB)" },
  { id: "tcb_bctc_2022", name: "TCB BCTC hợp nhất kiểm toán năm 2022", filename: "TCB_BCTC_2022_Nam.pdf", path: "docs/banks_bctc/TCB_BCTC_2022_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Techcombank (TCB)" },
  { id: "tcb_bctc_2023", name: "TCB BCTC hợp nhất kiểm toán năm 2023", filename: "TCB_BCTC_2023_Nam.pdf", path: "docs/banks_bctc/TCB_BCTC_2023_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Techcombank (TCB)" },
  { id: "tcb_bctc_2024", name: "TCB BCTC hợp nhất kiểm toán năm 2024", filename: "TCB_BCTC_2024_Nam.pdf", path: "docs/banks_bctc/TCB_BCTC_2024_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Techcombank (TCB)" },
  { id: "tcb_bctc_2025", name: "TCB BCTC hợp nhất kiểm toán năm 2025", filename: "TCB_BCTC_2025_Nam.pdf", path: "docs/banks_bctc/TCB_BCTC_2025_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Techcombank (TCB)" },
  { id: "tpb_bctc_2024", name: "TPB BCTC hợp nhất kiểm toán năm 2024", filename: "TPB_BCTC_2024_Nam.pdf", path: "docs/banks_bctc/TPB_BCTC_2024_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / TPBank (TPB)" },
  { id: "tpb_bctc_2025", name: "TPB BCTC hợp nhất kiểm toán năm 2025", filename: "TPB_BCTC_2025_Nam.pdf", path: "docs/banks_bctc/TPB_BCTC_2025_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / TPBank (TPB)" },
  { id: "vcb_bctc_2019", name: "VCB BCTC hợp nhất kiểm toán năm 2019", filename: "VCB_BCTC_2019_Nam.pdf", path: "docs/banks_bctc/VCB_BCTC_2019_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Vietcombank (VCB)" },
  { id: "vcb_bctc_2020", name: "VCB BCTC hợp nhất kiểm toán năm 2020", filename: "VCB_BCTC_2020_Nam.pdf", path: "docs/banks_bctc/VCB_BCTC_2020_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Vietcombank (VCB)" },
  { id: "vcb_bctc_2021", name: "VCB BCTC hợp nhất kiểm toán năm 2021", filename: "VCB_BCTC_2021_Nam.pdf", path: "docs/banks_bctc/VCB_BCTC_2021_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Vietcombank (VCB)" },
  { id: "vcb_bctc_2022", name: "VCB BCTC hợp nhất kiểm toán năm 2022", filename: "VCB_BCTC_2022_Nam.pdf", path: "docs/banks_bctc/VCB_BCTC_2022_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Vietcombank (VCB)" },
  { id: "vcb_bctc_2023", name: "VCB BCTC hợp nhất kiểm toán năm 2023", filename: "VCB_BCTC_2023_Nam.pdf", path: "docs/banks_bctc/VCB_BCTC_2023_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Vietcombank (VCB)" },
  { id: "vcb_bctc_2024", name: "VCB BCTC hợp nhất kiểm toán năm 2024", filename: "VCB_BCTC_2024_Nam.pdf", path: "docs/banks_bctc/VCB_BCTC_2024_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Vietcombank (VCB)" },
  { id: "vcb_bctc_2025", name: "VCB BCTC hợp nhất kiểm toán năm 2025", filename: "VCB_BCTC_2025_Nam.pdf", path: "docs/banks_bctc/VCB_BCTC_2025_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / Vietcombank (VCB)" },
  { id: "vpb_bctc_2019", name: "VPB BCTC hợp nhất kiểm toán năm 2019", filename: "VPB_BCTC_2019_Nam.pdf", path: "docs/banks_bctc/VPB_BCTC_2019_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / VPBank (VPB)" },
  { id: "vpb_bctc_2020", name: "VPB BCTC hợp nhất kiểm toán năm 2020", filename: "VPB_BCTC_2020_Nam.pdf", path: "docs/banks_bctc/VPB_BCTC_2020_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / VPBank (VPB)" },
  { id: "vpb_bctc_2021", name: "VPB BCTC hợp nhất kiểm toán năm 2021", filename: "VPB_BCTC_2021_Nam.pdf", path: "docs/banks_bctc/VPB_BCTC_2021_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / VPBank (VPB)" },
  { id: "vpb_bctc_2022", name: "VPB BCTC hợp nhất kiểm toán năm 2022", filename: "VPB_BCTC_2022_Nam.pdf", path: "docs/banks_bctc/VPB_BCTC_2022_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / VPBank (VPB)" },
  { id: "vpb_bctc_2023", name: "VPB BCTC hợp nhất kiểm toán năm 2023", filename: "VPB_BCTC_2023_Nam.pdf", path: "docs/banks_bctc/VPB_BCTC_2023_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / VPBank (VPB)" },
  { id: "vpb_bctc_2024", name: "VPB BCTC hợp nhất kiểm toán năm 2024", filename: "VPB_BCTC_2024_Nam.pdf", path: "docs/banks_bctc/VPB_BCTC_2024_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / VPBank (VPB)" },
  { id: "vpb_bctc_2025", name: "VPB BCTC hợp nhất kiểm toán năm 2025", filename: "VPB_BCTC_2025_Nam.pdf", path: "docs/banks_bctc/VPB_BCTC_2025_Nam.pdf", type: "banks", folder: "Báo cáo tài chính (BCTC) / VPBank (VPB)" }
];

class DocumentFinder {
  constructor() {
    this.pinnedDocs = this.loadPinnedDocs();
    this.currentCat = "all";
    this.searchQuery = "";
    
    // Lưu giữ trạng thái mở/đóng của các thư mục (mặc định mở tất cả)
    this.folderExpandedStates = {};
    this.initDefaultFolderStates();

    this.initElements();
    this.bindEvents();
    this.renderTree();
  }

  loadPinnedDocs() {
    try {
      const stored = localStorage.getItem("pinned_bank_docs");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Lỗi đọc pinned docs:", e);
      return [];
    }
  }

  savePinnedDocs() {
    try {
      localStorage.setItem("pinned_bank_docs", JSON.stringify(this.pinnedDocs));
    } catch (e) {
      console.error("Lỗi lưu trữ pinned docs:", e);
    }
  }

  initDefaultFolderStates() {
    // Thu thập tất cả các tên thư mục
    const folders = new Set();
    DOCS_DATABASE.forEach(doc => {
      const parts = doc.folder.split("/");
      parts.forEach((p, idx) => {
        const folderPath = parts.slice(0, idx + 1).join("/").trim();
        folders.add(folderPath);
      });
    });

    folders.forEach(f => {
      this.folderExpandedStates[f] = true; // Mặc định mở tất cả
    });
  }

  initElements() {
    this.floatingTab = document.getElementById("floating-doc-finder-tab");
    this.drawer = document.getElementById("doc-finder-drawer");
    this.closeBtn = document.getElementById("doc-drawer-close");
    
    this.searchInput = document.getElementById("doc-search-input");
    this.pillBtns = document.querySelectorAll(".doc-categories-pills .doc-pill-btn");
    
    this.expandAllBtn = document.getElementById("doc-expand-all");
    this.collapseAllBtn = document.getElementById("doc-collapse-all");
    this.treeContainer = document.getElementById("doc-tree-container");
  }

  bindEvents() {
    // Toggle Mở Drawer khi click
    if (this.floatingTab) {
      this.floatingTab.addEventListener("click", () => {
        this.drawer.classList.add("open");
        lucide.createIcons();
      });
    }

    // Toggle Đóng Drawer khi click nút Close
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => {
        this.drawer.classList.remove("open");
      });
    }

    // Đóng drawer khi click ra ngoài vùng drawer
    document.addEventListener("click", (e) => {
      if (this.drawer && this.drawer.classList.contains("open")) {
        if (!this.drawer.contains(e.target) && !this.floatingTab.contains(e.target)) {
          this.drawer.classList.remove("open");
        }
      }
    });

    // Lọc theo Tìm kiếm
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        
        // Nếu có truy vấn tìm kiếm, tự động mở rộng tất cả các thư mục để hiển thị kết quả
        if (this.searchQuery !== "") {
          for (let f in this.folderExpandedStates) {
            this.folderExpandedStates[f] = true;
          }
        }

        this.renderTree();
      });
    }

    // Lọc theo Category
    this.pillBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.pillBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentCat = btn.getAttribute("data-cat");
        this.renderTree();
      });
    });

    // Mở rộng tất cả / Thu gọn tất cả
    if (this.expandAllBtn) {
      this.expandAllBtn.addEventListener("click", () => {
        for (let f in this.folderExpandedStates) {
          this.folderExpandedStates[f] = true;
        }
        this.renderTree();
      });
    }

    if (this.collapseAllBtn) {
      this.collapseAllBtn.addEventListener("click", () => {
        for (let f in this.folderExpandedStates) {
          this.folderExpandedStates[f] = false;
        }
        this.renderTree();
      });
    }

    // Modal đóng xem PDF
    const modalClose = document.getElementById("pdf-modal-close-btn");
    const modal = document.getElementById("pdf-viewer-modal");
    const iframe = document.getElementById("pdf-modal-iframe");
    
    if (modalClose && modal && iframe) {
      modalClose.addEventListener("click", () => {
        modal.classList.add("hidden");
        iframe.src = ""; // Clear src to stop loading PDF
      });
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden");
          iframe.src = "";
        }
      });
    }

    // Lắng nghe sự kiện phím bấm ESC để đóng tuần tự
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        // 1. Nếu PDF Modal đang mở -> Đóng PDF Modal trước tiên
        if (modal && !modal.classList.contains("hidden")) {
          modal.classList.add("hidden");
          iframe.src = ""; // Dọn dẹp iframe để giải phóng tài nguyên
        } 
        // 2. Nếu không có PDF Modal nào mở -> Đóng Document Finder Drawer
        else if (this.drawer && this.drawer.classList.contains("open")) {
          this.drawer.classList.remove("open");
        }
      }
    });
  }

  // === RENDER HỆ THỐNG CÂY THƯ MỤC ===
  renderTree() {
    if (!this.treeContainer) return;

    // 1. Lọc tài liệu theo danh mục và tìm kiếm trước
    const filteredDocs = DOCS_DATABASE.filter(doc => {
      // Lọc danh mục
      if (this.currentCat === "basel" && doc.type !== "basel") return false;
      if (this.currentCat === "laws" && doc.type !== "laws") return false;
      if (this.currentCat === "banks" && doc.type !== "banks") return false;
      if (this.currentCat === "pinned" && !this.pinnedDocs.includes(doc.id)) return false;

      // Lọc tìm kiếm
      if (this.searchQuery !== "") {
        const inName = doc.name.toLowerCase().includes(this.searchQuery);
        const inFolder = doc.folder.toLowerCase().includes(this.searchQuery);
        const inFilename = doc.filename.toLowerCase().includes(this.searchQuery);
        return inName || inFolder || inFilename;
      }

      return true;
    });

    if (filteredDocs.length === 0) {
      this.treeContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
          <i data-lucide="info" style="width: 32px; height: 32px; margin-bottom: 0.5rem;"></i>
          <p style="font-size: 0.82rem;">Không tìm thấy tệp tài liệu nào khớp.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    // 2. Dựng cấu trúc cây thư mục phân cấp
    // Cây thư mục sẽ có dạng: { "Tên Folder": { files: [], subfolders: {} } }
    const tree = { files: [], subfolders: {} };

    filteredDocs.forEach(doc => {
      const parts = doc.folder.split("/");
      let currentFolderNode = tree;

      parts.forEach(part => {
        const folderName = part.trim();
        if (!currentFolderNode.subfolders[folderName]) {
          currentFolderNode.subfolders[folderName] = { files: [], subfolders: {} };
        }
        currentFolderNode = currentFolderNode.subfolders[folderName];
      });

      currentFolderNode.files.push(doc);
    });

    // 3. Hàm đệ quy sinh mã HTML cho từng nút thư mục
    const buildFolderHtml = (folderNode, folderName, currentPath) => {
      const fullPath = currentPath ? `${currentPath} / ${folderName}` : folderName;
      const isExpanded = this.folderExpandedStates[fullPath] !== false;

      // Tổng hợp các file trực tiếp và file trong thư mục con để hiển thị tổng số tài liệu trong badge
      const countTotalFiles = (node) => {
        let cnt = node.files.length;
        for (let subName in node.subfolders) {
          cnt += countTotalFiles(node.subfolders[subName]);
        }
        return cnt;
      };

      const fileCountBadge = countTotalFiles(folderNode);

      // Render tệp tin bên trong thư mục này
      const filesHtml = folderNode.files.map(doc => {
        const isPinned = this.pinnedDocs.includes(doc.id);
        
        // Trích xuất năm từ tên file hoặc tên hiển thị (tìm chuỗi 4 chữ số, e.g. 1988, 2019)
        const yearMatch = doc.filename.match(/\d{4}/) || doc.name.match(/\d{4}/);
        const year = yearMatch ? yearMatch[0] : "";
        
        let period = "";
        const fnLower = doc.filename.toLowerCase();
        if (fnLower.includes("_nam")) {
          period = "Năm";
        } else if (fnLower.includes("_6t") || fnLower.includes("_bannien")) {
          period = "Bán niên";
        } else if (fnLower.includes("_q1")) {
          period = "Quý 1";
        } else if (fnLower.includes("_q3")) {
          period = "Quý 3";
        } else if (fnLower.includes("_q2")) {
          period = "Quý 2";
        } else if (fnLower.includes("_q4")) {
          period = "Quý 4";
        }

        let prefix = "";
        if (period && year) {
          prefix = `[${period} - ${year}]`;
        } else if (year) {
          prefix = `[${year}]`;
        }
        
        const displayName = prefix ? `${prefix} ${doc.name}` : doc.name;

        return `
          <div class="doc-file-item open-btn" data-docpath="${doc.path}" data-docname="${displayName}">
            <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden; margin-right: 8px; flex-grow: 1;">
              <i data-lucide="file-text" style="width: 14px; height: 14px; color: #ef4444; flex-shrink: 0;"></i>
              <span style="font-size: 0.82rem; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; color: var(--text-main);" title="${displayName}">${displayName}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;" onclick="event.stopPropagation();">
              <!-- Ghim tài liệu -->
              <button class="doc-action-btn pin-btn ${isPinned ? 'pinned' : ''}" data-docid="${doc.id}" title="${isPinned ? 'Bỏ ghim' : 'Ghim tài liệu'}">
                <i data-lucide="pin" style="width: 13px; height: 13px; fill: ${isPinned ? '#eab308' : 'none'};"></i>
              </button>
              <!-- Mở tài liệu (Đóng vai trò visual indicator vì cả hàng đã clickable) -->
              <button class="doc-action-btn" title="Mở đọc PDF trực tiếp" style="pointer-events: none; opacity: 0.7;">
                <i data-lucide="book-open" style="width: 13px; height: 13px;"></i>
              </button>
            </div>
          </div>
        `;
      }).join("");

      // Render thư mục con đệ quy
      let subfoldersHtml = "";
      for (let subName in folderNode.subfolders) {
        subfoldersHtml += buildFolderHtml(folderNode.subfolders[subName], subName, fullPath);
      }

      return `
        <div class="doc-folder-node" data-fullpath="${fullPath}">
          <div class="doc-folder-header">
            <div style="display: flex; align-items: center; gap: 0.35rem; cursor: pointer; user-select: none;">
              <i data-lucide="${isExpanded ? 'chevron-down' : 'chevron-right'}" style="width: 14px; height: 14px; color: var(--text-muted);"></i>
              <i data-lucide="folder" style="width: 14px; height: 14px; color: #3b82f6; fill: #3b82f630;"></i>
              <span style="font-size: 0.84rem; font-weight: 600; color: var(--text-main);">${folderName}</span>
            </div>
            <span class="law-code-badge" style="font-size: 0.72rem; padding: 1px 6px; border-radius: 10px; background: rgba(255,255,255,0.05); color: var(--text-muted); font-weight: 700;">
              ${fileCountBadge}
            </span>
          </div>
          <div class="doc-folder-content ${isExpanded ? '' : 'collapsed'}">
            ${filesHtml}
            ${subfoldersHtml}
          </div>
        </div>
      `;
    };

    // 4. Sinh HTML và xuất ra màn hình
    let html = "";
    for (let fName in tree.subfolders) {
      html += buildFolderHtml(tree.subfolders[fName], fName, "");
    }

    this.treeContainer.innerHTML = html;
    lucide.createIcons();

    // 5. Đăng ký sự kiện click gập mở thư mục & ghim tài liệu
    this.registerTreeDomEvents();
  }

  registerTreeDomEvents() {
    // Sự kiện click gập mở thư mục
    const folderHeaders = this.treeContainer.querySelectorAll(".doc-folder-header");
    folderHeaders.forEach(hdr => {
      hdr.addEventListener("click", (e) => {
        e.stopPropagation();
        const folderNode = hdr.parentElement;
        const fullPath = folderNode.getAttribute("data-fullpath");
        const content = folderNode.querySelector(".doc-folder-content");
        const chevron = hdr.querySelector("i[data-lucide^='chevron']");

        const wasCollapsed = content.classList.contains("collapsed");
        if (wasCollapsed) {
          content.classList.remove("collapsed");
          this.folderExpandedStates[fullPath] = true;
          if (chevron) {
            chevron.setAttribute("data-lucide", "chevron-down");
          }
        } else {
          content.classList.add("collapsed");
          this.folderExpandedStates[fullPath] = false;
          if (chevron) {
            chevron.setAttribute("data-lucide", "chevron-right");
          }
        }

        lucide.createIcons();
      });
    });

    // Sự kiện click ghim (pin) tài liệu
    const pinBtns = this.treeContainer.querySelectorAll(".pin-btn");
    pinBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const docId = btn.getAttribute("data-docid");
        const idx = this.pinnedDocs.indexOf(docId);

        if (idx === -1) {
          // Chưa ghim -> Ghim
          this.pinnedDocs.push(docId);
          btn.classList.add("pinned");
        } else {
          // Đã ghim -> Bỏ ghim
          this.pinnedDocs.splice(idx, 1);
          btn.classList.remove("pinned");
        }

        this.savePinnedDocs();
        
        // Nếu đang ở bộ lọc ghim, render lại cây thư mục sẽ tự động làm biến mất file bị bỏ ghim
        if (this.currentCat === "pinned") {
          this.renderTree();
        } else {
          // Chỉ cần vẽ lại icons ở nút bấm
          lucide.createIcons();
        }
      });
    });

    // Sự kiện click mở xem PDF trực tiếp (open to view)
    const openBtns = this.treeContainer.querySelectorAll(".open-btn");
    openBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const docPath = btn.getAttribute("data-docpath");
        const docName = btn.getAttribute("data-docname");
        this.openPdfViewer(docPath, docName);
      });
    });
  }

  // Phương thức mở hộp thoại nhúng xem PDF trực tiếp
  openPdfViewer(path, name) {
    const modal = document.getElementById("pdf-viewer-modal");
    const title = document.getElementById("pdf-modal-title");
    const iframe = document.getElementById("pdf-modal-iframe");
    const extLink = document.getElementById("pdf-modal-external-link");
    
    if (modal && title && iframe && extLink) {
      title.textContent = name;
      iframe.src = path;
      extLink.href = path;
      modal.classList.remove("hidden");
      lucide.createIcons();
    }
  }
}

// Khởi chạy khi tải DOM xong
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("doc-finder-drawer")) {
    window.documentFinder = new DocumentFinder();
  }
});
