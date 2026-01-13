import * as XLSX from 'xlsx';
import type { AdminCommitmentTransaction } from '@/api/adminWallet';

/**
 * Format currency cho Excel
 */
const formatCurrencyForExcel = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Format date cho Excel
 */
const formatDateForExcel = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Xuất danh sách commitment transactions ra Excel
 */
export const exportCommitmentTransactionsToExcel = (
  transactions: AdminCommitmentTransaction[],
  totalAmount?: number
) => {
  // Chuẩn bị dữ liệu cho Excel
  const excelData = transactions.map((transaction, index) => ({
    'STT': index + 1,
    'Mã đơn hàng': transaction.orderCode,
    'Mã giao dịch': transaction.transactionId,
    'Tên người dùng': transaction.user?.name || 'N/A',
    'Email': transaction.user?.email || 'N/A',
    'Số điện thoại': transaction.user?.phone || 'N/A',
    'Mã cam kết': transaction.commitment?.commitmentId || 'N/A',
    'Số tiền': transaction.amount,
    'Số tiền (VND)': formatCurrencyForExcel(transaction.amount),
    'Ngày tạo': formatDateForExcel(transaction.createdAt),
  }));

  // Tạo workbook và worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const colWidths = [
    { wch: 5 },   // STT
    { wch: 15 },  // Mã đơn hàng
    { wch: 20 },  // Mã giao dịch
    { wch: 25 },  // Tên người dùng
    { wch: 30 },  // Email
    { wch: 15 },  // Số điện thoại
    { wch: 25 },  // Mã cam kết
    { wch: 15 },  // Số tiền
    { wch: 20 },  // Số tiền (VND)
    { wch: 20 },  // Ngày tạo
  ];
  ws['!cols'] = colWidths;

  // Thêm tổng doanh thu vào cuối file (nếu có)
  if (totalAmount !== undefined) {
    const totalRow = {
      'STT': '',
      'Mã đơn hàng': '',
      'Mã giao dịch': '',
      'Tên người dùng': '',
      'Email': '',
      'Số điện thoại': '',
      'Mã cam kết': 'TỔNG DOANH THU',
      'Số tiền': totalAmount,
      'Số tiền (VND)': formatCurrencyForExcel(totalAmount),
      'Ngày tạo': '',
    };
    XLSX.utils.sheet_add_json(ws, [totalRow], { origin: -1, skipHeader: true });
  }

  // Thêm worksheet vào workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Cam kết học tập');

  // Tạo tên file với timestamp
  const fileName = `cam-ket-hoc-tap-${new Date().toISOString().split('T')[0]}.xlsx`;

  // Xuất file
  XLSX.writeFile(wb, fileName);
};

