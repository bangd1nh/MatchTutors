// Date formatting helper
export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return "Không có";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// Status translation helper
export const translateStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    // Commitments
    "active": "Hoạt động",
    "completed": "Hoàn thành",
    "cancelled": "Đã hủy",
    "pending_agreement": "Chờ thỏa thuận",
    // Sessions
    "SCHEDULED": "Đã lên lịch",
    "COMPLETED": "Hoàn thành",
    "CANCELLED": "Đã hủy",
    "NOT_CONDUCTED": "Chưa thực hiện",
    "REJECTED": "Đã từ chối",
    // Requests
    "PENDING": "Chờ xử lý",
    "ACCEPTED": "Đã chấp nhận",
    // Reports
    "RESOLVED": "Đã giải quyết",
    "DISMISSED": "Đã bác bỏ",
  };
  return statusMap[status] || status;
};

// Gender translation helper
export const translateGender = (gender: string): string => {
  const genderMap: { [key: string]: string } = {
    "MALE": "Nam",
    "FEMALE": "Nữ",
    "OTHER": "Khác",
  };
  return genderMap[gender] || gender;
};

// Type translation helper
export const translateType = (type: string, category?: "report" | "review"): string => {
  if (category === "report") {
    const reportTypeMap: { [key: string]: string } = {
      "SCAM_TUTOR": "Gia sư lừa đảo",
      "FALSE_FEEDBACK": "Đánh giá sai",
      "SCAM_STUDENT": "Học sinh lừa đảo",
      "OTHER": "Khác",
    };
    return reportTypeMap[type] || type;
  }
  if (category === "review") {
    const reviewTypeMap: { [key: string]: string } = {
      "SESSION": "Buổi học",
      "OVERALL": "Tổng thể",
    };
    return reviewTypeMap[type] || type;
  }
  return type;
};

// Calculate statistics from nested structure
export const calculateStats = (statsData: any) => {
  if (!statsData || typeof statsData !== 'object' || !('commitments' in statsData)) {
    return {
      totalCommitments: 0,
      totalSessions: 0,
      totalTeachingRequests: 0,
      totalViolationReports: 0,
      totalReviews: 0,
      averageRating: 0,
    };
  }
  
  // Calculate commitments total - can be from direct fields (active + completed) or sum of byStatus
  const commitmentsTotal = (() => {
    // Try direct fields first (active + completed)
    if (statsData.commitments?.active !== undefined && statsData.commitments?.completed !== undefined) {
      return (statsData.commitments.active || 0) + (statsData.commitments.completed || 0);
    }
    // Otherwise, sum all from byStatus
    return Object.values(statsData.commitments?.byStatus || {}).reduce((sum: number, count: any) => sum + (count || 0), 0);
  })();
  
  // Calculate violationReports total - can be from total field or sum of byStatus
  const violationReportsTotal = statsData.violationReports?.total || 
    Object.values(statsData.violationReports?.byStatus || {}).reduce((sum: number, count: any) => sum + (count || 0), 0);
  
  return {
    totalCommitments: commitmentsTotal as number,
    totalSessions: Object.values(statsData.sessions?.byStatus || {}).reduce((sum: number, count: any) => sum + (count || 0), 0),
    totalTeachingRequests: Object.values(statsData.teachingRequests?.byStatus || {}).reduce((sum: number, count: any) => sum + (count || 0), 0),
    totalViolationReports: violationReportsTotal as number,
    totalReviews: (statsData.reviews?.total || 0) as number,
    averageRating: (statsData.reviews?.average || 0) as number,
  };
};
