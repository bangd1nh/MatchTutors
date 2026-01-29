import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatDate, translateGender } from "@/utils/tutorProfileHelpers";
import { SUBJECT_LABELS_VI } from "@/enums/subject.enum";
import { LEVEL_LABELS_VI } from "@/enums/level.enum";

interface OverviewTabProps {
  tutor: any;
  userInfo: any;
  stats: {
    totalCommitments: number;
    totalSessions: number;
    totalTeachingRequests: number;
    totalViolationReports: number;
    totalReviews: number;
    averageRating: number;
  };
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ tutor, userInfo, stats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{userInfo.email}</span>
            </div>
            {userInfo.phone && (
              <div className="flex justify-between">
                <span className="text-gray-600">Số điện thoại:</span>
                <span className="font-medium">{userInfo.phone}</span>
              </div>
            )}
            {userInfo.gender && (
              <div className="flex justify-between">
                <span className="text-gray-600">Giới tính:</span>
                <span className="font-medium">{translateGender(userInfo.gender)}</span>
              </div>
            )}
            {userInfo.address && (
              <div className="flex justify-between">
                <span className="text-gray-600">Địa chỉ:</span>
                <span className="font-medium">{userInfo.address.city}</span>
              </div>
            )}
            {tutor.isApproved && tutor.approvedAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày duyệt:</span>
                <span className="font-medium">{formatDate(tutor.approvedAt)}</span>
              </div>
            )}
            {tutor.maxStudents && (
              <div className="flex justify-between">
                <span className="text-gray-600">Số học sinh tối đa:</span>
                <span className="font-medium">{tutor.maxStudents}</span>
              </div>
            )}
            {tutor.maxQuiz && (
              <div className="flex justify-between">
                <span className="text-gray-600">Số quiz tối đa:</span>
                <span className="font-medium">{tutor.maxQuiz}</span>
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Thống kê tổng quan</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng cam kết:</span>
              <span className="font-medium">{stats.totalCommitments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng buổi học:</span>
              <span className="font-medium">{stats.totalSessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng yêu cầu:</span>
              <span className="font-medium">{stats.totalTeachingRequests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Báo cáo vi phạm:</span>
              <span className="font-medium">{stats.totalViolationReports}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng đánh giá:</span>
              <span className="font-medium">{stats.totalReviews}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Điểm đánh giá:</span>
              <span className="font-medium">{stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"} / 5.0</span>
            </div>
            {tutor.hasBeenReported && (
              <div className="flex justify-between">
                <span className="text-gray-600">Đã bị báo cáo:</span>
                <span className="font-medium text-red-600">Có ({tutor.reportCount} lần)</span>
              </div>
            )}
            {tutor.experienceYears && (
              <div className="flex justify-between">
                <span className="text-gray-600">Kinh nghiệm:</span>
                <span className="font-medium">{tutor.experienceYears} năm</span>
              </div>
            )}
            {tutor.hourlyRate && (
              <div className="flex justify-between">
                <span className="text-gray-600">Mức lương:</span>
                <span className="font-medium">{(tutor.hourlyRate / 1000).toFixed(0)}k VNĐ/giờ</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Additional Information */}
      {(tutor.subjects?.length > 0 || tutor.levels?.length > 0 || tutor.classType?.length > 0) && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Thông tin giảng dạy</h3>
          <div className="space-y-4">
            {tutor.subjects && tutor.subjects.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Môn dạy:</p>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {SUBJECT_LABELS_VI[subject] || subject}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {tutor.levels && tutor.levels.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Cấp độ:</p>
                <div className="flex flex-wrap gap-2">
                  {tutor.levels.map((level: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {LEVEL_LABELS_VI[level] || level}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {tutor.classType && tutor.classType.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Hình thức:</p>
                <div className="flex flex-wrap gap-2">
                  {tutor.classType.map((type: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {type === "ONLINE" ? "Trực tuyến" : type === "IN_PERSON" ? "Tại nhà" : type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
