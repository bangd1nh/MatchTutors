import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CheckCircleIcon,
  XCircleIcon,
  ShieldOffIcon,
  ShieldIcon,
  BookOpenIcon,
  GraduationCapIcon,
  ClockIcon,
  CreditCardIcon,
  FileTextIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowLeftIcon,
  StarIcon,
  PhoneIcon,
  MailIcon,
} from 'lucide-react'
import { 
  useGetTutorById,
  useAcceptTutor, 
  useRejectTutor, 
  useBanTutor, 
  useUnbanTutor
} from '@/hooks/useAdminTutors'

const TutorProfilePage: React.FC = () => {
  const { tutorId } = useParams<{ tutorId: string }>()
  const navigate = useNavigate()
  const [showConfirmation, setShowConfirmation] = useState<{
    show: boolean
    action: 'approve' | 'reject' | 'ban' | 'unban'
  }>({
    show: false,
    action: 'approve',
  })

  // API hooks
  const { data: tutorResponse, isLoading, error } = useGetTutorById(tutorId || '')
  const acceptTutorMutation = useAcceptTutor()
  const rejectTutorMutation = useRejectTutor()
  const banTutorMutation = useBanTutor()
  const unbanTutorMutation = useUnbanTutor()

  // Extract data from response
  const tutorProfile = tutorResponse?.data?.tutor
  const hasProfile = tutorResponse?.data?.hasProfile || false
  const userInfo = tutorProfile?.userId

  const handleAction = (action: 'approve' | 'reject' | 'ban' | 'unban') => {
    setShowConfirmation({
      show: true,
      action,
    })
  }

  const confirmAction = () => {
    if (!tutorId) return

    if (showConfirmation.action === 'approve') {
      acceptTutorMutation.mutate(tutorId)
    } else if (showConfirmation.action === 'reject') {
      rejectTutorMutation.mutate({
        tutorId,
        reason: 'Không đáp ứng yêu cầu của hệ thống',
      })
    } else if (showConfirmation.action === 'ban') {
      if (!userInfo?._id) {
        console.error('User ID not found for ban action')
        return
      }
      banTutorMutation.mutate({
        userId: userInfo._id,
        reason: 'Vi phạm quy định của hệ thống',
      })
    } else if (showConfirmation.action === 'unban') {
      if (!userInfo?._id) {
        console.error('User ID not found for unban action')
        return
      }
      unbanTutorMutation.mutate({
        userId: userInfo._id,
      })
    }
    setShowConfirmation({
      show: false,
      action: 'approve',
    })
  }

  const cancelAction = () => {
    setShowConfirmation({
      show: false,
      action: 'approve',
    })
  }

  const getModalContent = () => {
    switch (showConfirmation.action) {
      case 'approve':
        return {
          title: 'Xác nhận phê duyệt hồ sơ gia sư',
          message:
            'Bạn có chắc chắn muốn phê duyệt hồ sơ gia sư này? Hồ sơ sẽ được hiển thị công khai và gia sư có thể bắt đầu nhận kết nối.',
          confirmText: 'Phê duyệt',
          color: 'green',
        }
      case 'reject':
        return {
          title: 'Xác nhận từ chối hồ sơ gia sư',
          message:
            'Bạn có chắc chắn muốn từ chối hồ sơ gia sư này? Gia sư sẽ cần cập nhật thông tin và gửi lại hồ sơ để xét duyệt.',
          confirmText: 'Từ chối',
          color: 'red',
        }
      case 'ban':
        return {
          title: 'Xác nhận khóa tài khoản gia sư',
          message:
            'Bạn có chắc chắn muốn khóa tài khoản gia sư này? Gia sư sẽ không thể đăng nhập hoặc nhận kết nối mới.',
          confirmText: 'Khóa tài khoản',
          color: 'red',
        }
      case 'unban':
        return {
          title: 'Xác nhận mở khóa tài khoản gia sư',
          message: 'Bạn có chắc chắn muốn mở khóa tài khoản gia sư này?',
          confirmText: 'Mở khóa',
          color: 'green',
        }
      default:
        return {
          title: '',
          message: '',
          confirmText: '',
          color: 'blue',
        }
    }
  }

  const modalContent = getModalContent()

  // Helper functions
  const getSubjectDisplayName = (subject: string) => {
    const subjectMap: { [key: string]: string } = {
      'ADDITIONAL_MATHS': 'Toán nâng cao',
      'BUSINESS_STUDIES': 'Kinh doanh',
      'CHINESE': 'Tiếng Trung',
      'ECONOMICS': 'Kinh tế học',
      'MATHEMATICS': 'Toán học',
      'PHYSICS': 'Vật lý',
      'CHEMISTRY': 'Hóa học',
      'BIOLOGY': 'Sinh học',
      'ENGLISH': 'Tiếng Anh',
      'LITERATURE': 'Văn học',
      'HISTORY': 'Lịch sử',
      'GEOGRAPHY': 'Địa lý',
    }
    return subjectMap[subject] || subject
  }

  const getLevelDisplayName = (level: string) => {
    const levelMap: { [key: string]: string } = {
      'GRADE_1': 'Lớp 1',
      'GRADE_2': 'Lớp 2',
      'GRADE_3': 'Lớp 3',
      'GRADE_4': 'Lớp 4',
      'GRADE_5': 'Lớp 5',
      'GRADE_6': 'Lớp 6',
      'GRADE_7': 'Lớp 7',
      'GRADE_8': 'Lớp 8',
      'GRADE_9': 'Lớp 9',
      'GRADE_10': 'Lớp 10',
      'GRADE_11': 'Lớp 11',
      'GRADE_12': 'Lớp 12',
      'UNIVERSITY': 'Đại học',
      'HIGH_SCHOOL': 'THPT',
      'MIDDLE_SCHOOL': 'THCS',
      'ELEMENTARY': 'Tiểu học',
    }
    return levelMap[level] || level
  }

  const renderHTML = (htmlString: string) => {
    return { __html: htmlString }
  }

  const getDayName = (day: number) => {
    const days = [
      'Chủ Nhật',
      'Thứ Hai',
      'Thứ Ba',
      'Thứ Tư',
      'Thứ Năm',
      'Thứ Sáu',
      'Thứ Bảy',
    ]
    return days[day]
  }

  const getSlotName = (slot: string) => {
    switch (slot) {
      case 'MORNING':
        return 'Sáng'
      case 'AFTERNOON':
        return 'Chiều'
      case 'EVENING':
        return 'Tối'
      default:
        return ''
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin gia sư...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">
            {error.message || 'Có lỗi xảy ra khi tải thông tin gia sư'}
          </p>
          <button
            onClick={() => navigate('/admin/tutors')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    )
  }

  // No profile state
  if (!hasProfile || !tutorProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileTextIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gia sư chưa tạo profile</h2>
          <p className="text-gray-600 mb-4">
            Gia sư này chưa tạo profile chi tiết. Bạn có thể chấp nhận hoặc từ chối gia sư dựa trên thông tin cơ bản.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => handleAction('approve')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Chấp nhận
            </button>
            <button
              onClick={() => handleAction('reject')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Từ chối
            </button>
            <button
              onClick={() => navigate('/admin/tutors')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Confirmation Modal */}
      {showConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {modalContent.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {modalContent.message}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={cancelAction}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmAction}
                  disabled={
                    acceptTutorMutation.isPending ||
                    rejectTutorMutation.isPending ||
                    banTutorMutation.isPending ||
                    unbanTutorMutation.isPending
                  }
                  className={`flex-1 px-4 py-2 text-white rounded disabled:opacity-50 ${
                    modalContent.color === 'red'
                      ? 'bg-red-600 hover:bg-red-700'
                      : modalContent.color === 'green'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {acceptTutorMutation.isPending || rejectTutorMutation.isPending || 
                   banTutorMutation.isPending || unbanTutorMutation.isPending
                    ? 'Đang xử lý...'
                    : modalContent.confirmText
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/tutors')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Quay lại
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Hồ sơ gia sư
              {tutorProfile?.isApproved && (
                <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Đã duyệt
                </span>
              )}
              {userInfo?.isBanned && (
                <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                  Đã khóa
                </span>
              )}
            </h1>
          </div>
          <div className="flex space-x-2">
            {!userInfo?.isBanned ? (
              <>
                {!tutorProfile?.isApproved ? (
                  <button
                    onClick={() => handleAction('approve')}
                    disabled={acceptTutorMutation.isPending}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center disabled:opacity-50"
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-1" />
                    {acceptTutorMutation.isPending ? 'Đang duyệt...' : 'Phê duyệt'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction('reject')}
                    disabled={rejectTutorMutation.isPending}
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 flex items-center disabled:opacity-50"
                  >
                    <XCircleIcon className="h-5 w-5 mr-1" />
                    {rejectTutorMutation.isPending ? 'Đang từ chối...' : 'Hủy duyệt'}
                  </button>
                )}
                <button
                  onClick={() => handleAction('ban')}
                  disabled={banTutorMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center disabled:opacity-50"
                >
                  <ShieldOffIcon className="h-5 w-5 mr-1" />
                  {banTutorMutation.isPending ? 'Đang khóa...' : 'Khóa tài khoản'}
                </button>
              </>
            ) : (
              <button
                onClick={() => handleAction('unban')}
                disabled={unbanTutorMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center disabled:opacity-50"
              >
                <ShieldIcon className="h-5 w-5 mr-1" />
                {unbanTutorMutation.isPending ? 'Đang mở khóa...' : 'Mở khóa'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex items-center mb-6">
                <img
                  className={`h-24 w-24 rounded-full ${userInfo?.isBanned ? 'grayscale' : ''}`}
                  src={userInfo?.avatarUrl || `https://randomuser.me/api/portraits/men/${20 + (parseInt(tutorId || '1'))}.jpg`}
                  alt="Tutor Avatar"
                />
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {userInfo?.name || `Gia sư #${tutorId}`}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MailIcon className="h-4 w-4 mr-1" />
                    {userInfo?.email || `gia-su-${tutorId}@example.com`}
                  </div>
                  {userInfo?.phone && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      {userInfo.phone}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                {tutorProfile.subjects && tutorProfile.subjects.length > 0 && (
                  <div className="flex items-center">
                    <BookOpenIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-700">Môn dạy</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tutorProfile.subjects.map((subject: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            {getSubjectDisplayName(subject)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {tutorProfile.levels && tutorProfile.levels.length > 0 && (
                  <div className="flex items-center">
                    <GraduationCapIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-700">Cấp độ</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tutorProfile.levels.map((level: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                          >
                            {getLevelDisplayName(level)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {tutorProfile.experienceYears && (
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-700">Kinh nghiệm</p>
                      <p className="text-gray-600">
                        {tutorProfile.experienceYears} năm giảng dạy
                      </p>
                    </div>
                  </div>
                )}
                
                {tutorProfile.hourlyRate && (
                  <div className="flex items-center">
                    <CreditCardIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-700">Học phí</p>
                      <p className="text-gray-600">
                        {tutorProfile.hourlyRate.toLocaleString('vi-VN')} VNĐ/giờ
                      </p>
                    </div>
                  </div>
                )}
                
                {tutorProfile.classType && tutorProfile.classType.length > 0 && (
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-700">Hình thức dạy</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tutorProfile.classType.map((type: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                          >
                            {type === 'ONLINE' ? 'Trực tuyến' : 'Tại nhà'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {tutorProfile.ratings && (
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-700">Đánh giá</p>
                      <div className="flex items-center">
                        <span className="text-yellow-500 font-semibold">
                          {tutorProfile.ratings.average.toFixed(1)}
                        </span>
                        <span className="text-gray-600 text-sm ml-1">
                          ({tutorProfile.ratings.totalReviews} đánh giá)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {tutorProfile.availability && tutorProfile.availability.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <CalendarIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <p className="font-medium text-gray-700">Lịch dạy</p>
                </div>
                <div className="space-y-3">
                  {tutorProfile.availability
                    .filter((avail: any) => avail.slots && avail.slots.length > 0)
                    .map((avail: any, index: number) => (
                    <div key={index}>
                      <p className="font-medium text-gray-700">
                        {getDayName(avail.dayOfWeek)}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {avail.slots.map((slot: string, slotIndex: number) => (
                          <span
                            key={slotIndex}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            {getSlotName(slot)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:w-2/3">
            {tutorProfile.bio && (
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FileTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                  Giới thiệu
                </h3>
                <div 
                  className="text-gray-700 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={renderHTML(tutorProfile.bio)}
                />
              </div>
            )}
            
            {tutorProfile.education && tutorProfile.education.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Học vấn
                </h3>
                <div className="space-y-4">
                  {tutorProfile.education.map((edu: any, index: number) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                    >
                      <p className="font-bold text-gray-800">{edu.institution}</p>
                      <p className="text-gray-700">
                        {edu.degree} - {edu.fieldOfStudy}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                      {edu.description && (
                        <p className="text-gray-700 mt-1">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {tutorProfile.certifications && tutorProfile.certifications.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Chứng chỉ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tutorProfile.certifications.map((cert: any, index: number) => (
                    <div
                      key={cert._id || index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {cert.imageUrls && cert.imageUrls.length > 0 && (
                        <div className="aspect-video w-full overflow-hidden bg-gray-100">
                          <img
                            src={cert.imageUrls[0]}
                            alt={cert.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-3">
                        <p className="font-bold text-gray-800">{cert.name}</p>
                        {cert.description && (
                          <p className="text-gray-600 text-sm">
                            {cert.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorProfilePage