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
  CalendarIcon,
  ArrowLeftIcon,
  StarIcon,
  PhoneIcon,
  MailIcon,
  AwardIcon,
  UserIcon,
} from 'lucide-react'
import { 
  useGetTutorById,
  useAcceptTutor, 
  useRejectTutor, 
  useBanTutor, 
  useUnbanTutor
} from '@/hooks/useAdminTutors'
import { AvailabilityGrid } from '@/components/tutor/tutor-profile/AvailabilityGrid'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

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
      setShowConfirmation({ show: false, action: 'approve' })
      setRejectReason('')
    } else if (showConfirmation.action === 'reject') {
      if (!rejectReason.trim() || rejectReason.trim().length < 10) {
        return // Không submit nếu lý do không hợp lệ
      }
      rejectTutorMutation.mutate({
        tutorId,
        reason: rejectReason.trim(),
      })
      setShowConfirmation({ show: false, action: 'approve' })
      setRejectReason('')
    } else if (showConfirmation.action === 'ban') {
      if (!userInfo?._id) return
      banTutorMutation.mutate({
        userId: userInfo._id,
        reason: 'Vi phạm quy định của hệ thống',
      })
      setShowConfirmation({ show: false, action: 'approve' })
    } else if (showConfirmation.action === 'unban') {
      if (!userInfo?._id) return
      unbanTutorMutation.mutate({
        userId: userInfo._id,
      })
      setShowConfirmation({ show: false, action: 'approve' })
    }
  }

  const cancelAction = () => {
    setShowConfirmation({ show: false, action: 'approve' })
    setRejectReason('')
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
            'Vui lòng nhập lý do từ chối để gia sư có thể cải thiện hồ sơ.',
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Đang tải thông tin gia sư...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6">
            {error.message || 'Có lỗi xảy ra khi tải thông tin gia sư'}
          </p>
          <button
            onClick={() => navigate('/admin/tutors')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <FileTextIcon className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gia sư chưa tạo profile</h2>
          <p className="text-gray-600 mb-6">
            Gia sư này chưa tạo profile chi tiết. Bạn có thể chấp nhận hoặc từ chối gia sư dựa trên thông tin cơ bản.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleAction('approve')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Chấp nhận
            </button>
            <button
              onClick={() => handleAction('reject')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Từ chối
            </button>
            <button
              onClick={() => navigate('/admin/tutors')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Confirmation Modal */}
      {showConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {modalContent.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {modalContent.message}
              </p>

              {/* Reject Reason Input */}
              {showConfirmation.action === 'reject' && (
                <div className="mb-6">
                  <Label htmlFor="reject-reason" className="text-sm font-semibold text-gray-700 mb-2">
                    Lý do từ chối *
                  </Label>
                  <Textarea
                    id="reject-reason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Nhập lý do từ chối hồ sơ gia sư (tối thiểu 10 ký tự)..."
                    className="mt-2 resize-none"
                    rows={4}
                    maxLength={500}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-sm ${
                      rejectReason.length > 0 && rejectReason.length < 10 
                        ? 'text-red-500' 
                        : 'text-gray-500'
                    }`}>
                      {rejectReason.length}/500 ký tự
                    </span>
                    {rejectReason.length > 0 && rejectReason.length < 10 && (
                      <span className="text-xs text-red-500">
                        Cần ít nhất 10 ký tự
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={cancelAction}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmAction}
                  disabled={
                    (showConfirmation.action === 'reject' && (!rejectReason.trim() || rejectReason.trim().length < 10)) ||
                    acceptTutorMutation.isPending ||
                    rejectTutorMutation.isPending ||
                    banTutorMutation.isPending ||
                    unbanTutorMutation.isPending
                  }
                  className={`flex-1 px-4 py-3 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium ${
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

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[95vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all shadow-lg z-10"
            >
              <XCircleIcon className="h-8 w-8" />
            </button>
            <img
              src={selectedImage}
              alt="Certificate preview"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/tutors')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
                <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Quay lại</span>
            </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Hồ sơ gia sư
              {tutorProfile?.isApproved && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                      ✓ Đã duyệt
                    </span>
                  )}
                  {!tutorProfile?.isApproved && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                      ⏳ Chờ duyệt
                </span>
              )}
              {userInfo?.isBanned && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
                      🔒 Đã khóa
                </span>
              )}
            </h1>
          </div>
            </div>
            <div className="flex space-x-3">
            {!userInfo?.isBanned ? (
              <>
                {!tutorProfile?.isApproved ? (
                  <button
                    onClick={() => handleAction('approve')}
                    disabled={acceptTutorMutation.isPending}
                      className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md font-medium"
                  >
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                    {acceptTutorMutation.isPending ? 'Đang duyệt...' : 'Phê duyệt'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction('reject')}
                    disabled={rejectTutorMutation.isPending}
                      className="px-5 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md font-medium"
                  >
                      <XCircleIcon className="h-5 w-5 mr-2" />
                    {rejectTutorMutation.isPending ? 'Đang từ chối...' : 'Hủy duyệt'}
                  </button>
                )}
                <button
                  onClick={() => handleAction('ban')}
                  disabled={banTutorMutation.isPending}
                    className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md font-medium"
                >
                    <ShieldOffIcon className="h-5 w-5 mr-2" />
                  {banTutorMutation.isPending ? 'Đang khóa...' : 'Khóa tài khoản'}
                </button>
              </>
            ) : (
              <button
                onClick={() => handleAction('unban')}
                disabled={unbanTutorMutation.isPending}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md font-medium"
              >
                  <ShieldIcon className="h-5 w-5 mr-2" />
                {unbanTutorMutation.isPending ? 'Đang mở khóa...' : 'Mở khóa'}
              </button>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-24"></div>
              <div className="px-6 pb-6">
                <div className="flex flex-col items-center -mt-12">
                  <div className="relative">
                    <img
                      className={`h-24 w-24 rounded-full border-4 border-white shadow-lg ${userInfo?.isBanned ? 'grayscale' : ''}`}
                  src={userInfo?.avatarUrl || `https://randomuser.me/api/portraits/men/${20 + (parseInt(tutorId || '1'))}.jpg`}
                  alt="Tutor Avatar"
                />
                    {tutorProfile?.isApproved && !userInfo?.isBanned && (
                      <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1.5 border-2 border-white">
                        <CheckCircleIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-4 text-center">
                    {userInfo?.name || `Gia sư #${tutorId}`}
                  </h3>
                  <div className="flex items-center text-yellow-500 mt-2">
                    <StarIcon className="h-5 w-5 fill-current" />
                    <span className="ml-1 font-semibold text-gray-900">
                      {tutorProfile.ratings?.average.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({tutorProfile.ratings?.totalReviews || 0} đánh giá)
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-gray-700">
                    <MailIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm">{userInfo?.email || `gia-su-${tutorId}@example.com`}</span>
                  </div>
                  {userInfo?.phone && (
                    <div className="flex items-center text-gray-700">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm">{userInfo.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {tutorProfile.experienceYears && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{tutorProfile.experienceYears}</p>
                      <p className="text-xs text-gray-600 mt-1">Năm kinh nghiệm</p>
                    </div>
                    <ClockIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              )}
              {tutorProfile.hourlyRate && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{(tutorProfile.hourlyRate / 1000).toFixed(0)}k</p>
                      <p className="text-xs text-gray-600 mt-1">VNĐ/giờ</p>
                    </div>
                    <CreditCardIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              )}
              </div>
              
            {/* Teaching Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <BookOpenIcon className="h-5 w-5 text-blue-600 mr-2" />
                Thông tin giảng dạy
              </h3>
              <div className="space-y-4">
                {tutorProfile.subjects && tutorProfile.subjects.length > 0 && (
                    <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Môn dạy</p>
                    <div className="flex flex-wrap gap-2">
                        {tutorProfile.subjects.map((subject: string, index: number) => (
                          <span
                            key={index}
                          className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg border border-blue-200"
                          >
                            {getSubjectDisplayName(subject)}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
                
                {tutorProfile.levels && tutorProfile.levels.length > 0 && (
                    <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Cấp độ</p>
                    <div className="flex flex-wrap gap-2">
                        {tutorProfile.levels.map((level: string, index: number) => (
                          <span
                            key={index}
                          className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg border border-purple-200"
                          >
                            {getLevelDisplayName(level)}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
                
                {tutorProfile.classType && tutorProfile.classType.length > 0 && (
                    <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Hình thức</p>
                    <div className="flex flex-wrap gap-2">
                        {tutorProfile.classType.map((type: string, index: number) => (
                          <span
                            key={index}
                          className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-lg border border-green-200"
                        >
                          {type === 'ONLINE' ? '💻 Trực tuyến' : '🏠 Tại nhà'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {tutorProfile.bio && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 text-blue-600 mr-2" />
                  Giới thiệu
                </h3>
                <div 
                  className="text-gray-700 prose prose-sm max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={renderHTML(tutorProfile.bio)}
                />
              </div>
            )}
            
            {/* Availability */}
            {tutorProfile.availability && tutorProfile.availability.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                  Lịch dạy
                </h3>
                <div className="overflow-x-auto">
                  <AvailabilityGrid
                    availability={tutorProfile.availability}
                    isViewMode={true}
                  />
                </div>
              </div>
            )}
            
            {/* Education */}
            {tutorProfile.education && tutorProfile.education.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <GraduationCapIcon className="h-5 w-5 text-blue-600 mr-2" />
                  Học vấn
                </h3>
                <div className="space-y-5">
                  {tutorProfile.education.map((edu: any, index: number) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-600 pl-4 py-2"
                    >
                      <p className="font-bold text-gray-900 text-lg">{edu.institution}</p>
                      <p className="text-gray-700 font-medium mt-1">
                        {edu.degree} - {edu.fieldOfStudy}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        📅 {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                      {edu.description && (
                        <p className="text-gray-600 mt-2 text-sm">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Certifications */}
            {tutorProfile.certifications && tutorProfile.certifications.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <AwardIcon className="h-5 w-5 text-blue-600 mr-2" />
                  Chứng chỉ & Giấy tờ
                </h3>
                <div className="space-y-6">
                  {tutorProfile.certifications.map((cert: any, index: number) => (
                    <div
                      key={cert._id || index}
                      className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="bg-blue-100 rounded-lg p-2">
                          <AwardIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg">{cert.name}</h4>
                          {cert.description && (
                            <p className="text-gray-600 text-sm mt-1">
                              {cert.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {cert.imageUrls && cert.imageUrls.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                          {cert.imageUrls.map((imageUrl: string, imgIndex: number) => (
                            <div
                              key={imgIndex}
                              className="group relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-lg"
                              onClick={() => setSelectedImage(imageUrl)}
                            >
                              <img
                                src={imageUrl}
                                alt={`${cert.name} - Image ${imgIndex + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 text-2xl font-bold transition-opacity">🔍</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
