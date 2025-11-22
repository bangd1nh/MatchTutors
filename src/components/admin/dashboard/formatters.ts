export const formatCurrency = (amount: number) => `₫${(amount || 0).toLocaleString("vi-VN")}`;
export const formatNumber = (value: number) => (value ?? 0).toLocaleString("vi-VN");
export const formatDateDMY = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};


