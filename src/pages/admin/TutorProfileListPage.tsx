import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle,
  Star,
  Mail,
  Phone,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  Award
} from 'lucide-react'
import { 
  useAcceptTutor,
  useRejectTutor,
  useGetTutorMapping
} from '@/hooks/useAdminTutors'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Constants
const ITEMS_PER_PAGE = 12
const SEARCH_DEBOUNCE_MS = 300

type TabType = 'all' | 'approved' | 'pending'

// Helper functions
const getApprovalStatusColor = (isApproved: boolean) => {
  if (isApproved) return 'bg-green-100 text-green-700 border-green-200'
  return 'bg-yellow-100 text-yellow-700 border-yellow-200'
}

const getApprovalStatusText = (isApproved: boolean) => {
  if (isApproved) return 'Đã duyệt'
  return 'Chờ duyệt'
}

const getSubjectDisplayName = (subject: string) => {
  const subjectMap: { [key: string]: string } = {
    'ACCOUNTING': 'Kế toán',
    'ADDITIONAL_MATHS': 'Toán nâng cao',
    'BIOLOGY': 'Sinh học',
    'BUSINESS_STUDIES': 'Kinh doanh',
    'CHEMISTRY': 'Hóa học',
    'CHINESE': 'Tiếng Trung',
    'COMPUTER_SCIENCE': 'Khoa học máy tính',
    'ECONOMICS': 'Kinh tế học',
    'ENGLISH': 'Tiếng Anh',
    'FREE_CONSULTATION': 'Tư vấn miễn phí',
    'FURTHER_MATHS': 'Toán nâng cao',
    'GEOGRAPHY': 'Địa lý',
    'GUITAR': 'Guitar',
    'HISTORY': 'Lịch sử',
    'MALAY': 'Tiếng Malay',
    'MATHEMATICS': 'Toán học',
    'ORGAN': 'Organ',
    'PHONICS_ENGLISH': 'Phát âm tiếng Anh',
    'PHYSICS': 'Vật lý',
    'PIANO': 'Piano',
    'RISE_PROGRAM': 'Chương trình RISE',
    'SCIENCE': 'Khoa học',
    'SWIMMING': 'Bơi lội',
    'TAMIL': 'Tiếng Tamil',
    'TENNIS': 'Tennis',
    'WORLD_LITERATURE': 'Văn học thế giới',
    'YOGA': 'Yoga',
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

const TutorProfileListPage: React.FC = () => {
  const navigate = useNavigate()
  
  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedTutor, setSelectedTutor] = useState<any | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectAction, setRejectAction] = useState<'reject' | 'unapprove'>('reject')
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [currentPage, setCurrentPage] = useState(1)

  // API calls
  const { data: tutorMappingData, isLoading: isLoadingAll } = useGetTutorMapping({ 
    page: 1, 
    limit: 1000
  })
  
  const acceptTutorMutation = useAcceptTutor()
  const rejectTutorMutation = useRejectTutor()

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Memoized mappings - not needed for this implementation
  // const { userIdToTutorId } = useMemo(() => {
  //   const mapping: Record<string, string> = {}
    
  //   tutorMappingData?.data?.tutors?.forEach((item: any) => {
  //     if (item.tutorId) mapping[item.userId] = item.tutorId
  //   })
    
  //   return { userIdToTutorId: mapping }
  // }, [tutorMappingData])

  // Memoized filtered tutors
  const filteredTutors = useMemo(() => {
    let tutors = tutorMappingData?.data?.tutors || []
    
    // Only show tutors who have created profiles (hasProfile: true)
    tutors = tutors.filter(t => t.hasProfile && t.tutor)
    
    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase()
      tutors = tutors.filter(t => 
        t.user.name.toLowerCase().includes(searchLower) ||
        t.user.email.toLowerCase().includes(searchLower) ||
        (t.user.phone && t.user.phone.includes(searchLower))
      )
    }
    
    // Apply tab filter
    switch (activeTab) {
      case 'approved':
        return tutors.filter(t => t.tutor?.isApproved)
      case 'pending':
        return tutors.filter(t => !t.tutor?.isApproved)
      default:
        return tutors
    }
  }, [tutorMappingData, activeTab, debouncedSearch])

  // Memoized counts
  const { totalTutors, approvedCount, pendingCount } = useMemo(() => {
    const all = tutorMappingData?.data?.tutors || []
    // Only count tutors who have created profiles
    const tutorsWithProfiles = all.filter(t => t.hasProfile && t.tutor)
    return {
      totalTutors: tutorsWithProfiles.length,
      approvedCount: tutorsWithProfiles.filter(t => t.tutor?.isApproved).length,
      pendingCount: tutorsWithProfiles.filter(t => !t.tutor?.isApproved).length,
    }
  }, [tutorMappingData])

  // Memoized pagination
  const { totalPages, paginatedTutors, startIndex, endIndex } = useMemo(() => {
    const pages = Math.ceil(filteredTutors.length / ITEMS_PER_PAGE)
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    
    return {
      totalPages: pages,
      paginatedTutors: filteredTutors.slice(start, end),
      startIndex: start,
      endIndex: end,
    }
  }, [filteredTutors, currentPage])

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, debouncedSearch])

  // Handlers with useCallback
  const handleAcceptTutor = useCallback((tutorItem: any) => {
    if (tutorItem.tutorId) {
      acceptTutorMutation.mutate(tutorItem.tutorId)
    }
  }, [acceptTutorMutation])

  const handleRejectTutor = useCallback((tutorItem: any) => {
    setSelectedTutor(tutorItem)
    setRejectAction('reject')
    setIsRejectDialogOpen(true)
  }, [])

  const handleUnapproveTutor = useCallback((tutorItem: any) => {
    setSelectedTutor(tutorItem)
    setRejectAction('unapprove')
    setIsRejectDialogOpen(true)
  }, [])

  const confirmReject = useCallback(() => {
    if (selectedTutor) {
      if (rejectAction === 'reject' && rejectReason.trim().length >= 10) {
        rejectTutorMutation.mutate({
          tutorId: selectedTutor.tutorId,
          reason: rejectReason.trim(),
        })
      } else if (rejectAction === 'unapprove') {
        // For unapprove, we can use reject with a simple reason
        rejectTutorMutation.mutate({
          tutorId: selectedTutor.tutorId,
          reason: 'Hủy duyệt hồ sơ',
        })
      }
      setIsRejectDialogOpen(false)
      setRejectReason('')
      setSelectedTutor(null)
    }
  }, [selectedTutor, rejectReason, rejectTutorMutation, rejectAction])

  const handleViewTutor = useCallback((tutorItem: any) => {
    if (tutorItem.tutorId) {
      navigate(`/admin/tutors/${tutorItem.tutorId}`)
    }
  }, [navigate])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Loading state
  if (isLoadingAll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Đang tải danh sách gia sư...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hồ sơ gia sư</h1>
              <p className="text-gray-600 mt-1">Quản lý và xem hồ sơ chi tiết của gia sư</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng gia sư</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTutors}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
                  <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm gia sư theo tên, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveTab('all')}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Tất cả ({totalTutors})
              </Button>
              <Button
                variant={activeTab === 'approved' ? 'default' : 'outline'}
                onClick={() => setActiveTab('approved')}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Đã duyệt ({approvedCount})
              </Button>
              <Button
                variant={activeTab === 'pending' ? 'default' : 'outline'}
                onClick={() => setActiveTab('pending')}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Chờ duyệt ({pendingCount})
              </Button>
            </div>
          </div>
        </div>

        {/* Tutor Cards Grid */}
        {paginatedTutors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có hồ sơ gia sư nào</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Thử thay đổi từ khóa tìm kiếm' 
                : 'Chưa có gia sư nào tạo hồ sơ chi tiết'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedTutors.map((tutorItem) => {
              const tutor = tutorItem.user
              const tutorProfile = tutorItem.tutor
              const isApproved = tutorProfile?.isApproved || false
              
              return (
                <Card key={tutorItem.userId} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            className={`h-12 w-12 rounded-full border-2 border-white shadow-md ${tutor.isBanned ? 'grayscale' : ''}`}
                            src={tutor.avatarUrl || `https://randomuser.me/api/portraits/men/${20 + (parseInt(tutorItem.userId.slice(-2), 16) % 50)}.jpg`}
                            alt={tutor.name}
                          />
                          {isApproved && !tutor.isBanned && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                              <CheckCircle className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg truncate max-w-[220px]" title={tutor.name}>
                            {tutor.name}
                          </h3>
                          <div className="flex items-center text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="ml-1 text-sm font-medium text-gray-900">
                              {tutorProfile?.ratings?.average?.toFixed(1) || '0.0'}
                            </span>
                            <span className="text-gray-500 text-xs ml-1">
                              ({tutorProfile?.ratings?.totalReviews || 0})
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        className={`text-xs font-medium ${getApprovalStatusColor(isApproved)}`}
                      >
                        {getApprovalStatusText(isApproved)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="text-sm truncate">{tutor.email}</span>
                      </div>
                      {tutor.phone && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <span className="text-sm">{tutor.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Teaching Info */}
                    {tutorProfile && (
                      <div className="space-y-3">
                        {tutorProfile.subjects && tutorProfile.subjects.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">Môn dạy</p>
                            <div className="flex flex-wrap gap-1">
                              {tutorProfile.subjects.slice(0, 3).map((subject: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded border border-blue-200"
                                >
                                  {getSubjectDisplayName(subject)}
                                </span>
                              ))}
                              {tutorProfile.subjects.length > 3 && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                  +{tutorProfile.subjects.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {tutorProfile.levels && tutorProfile.levels.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">Cấp độ</p>
                            <div className="flex flex-wrap gap-1">
                              {tutorProfile.levels.slice(0, 2).map((level: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded border border-purple-200"
                                >
                                  {getLevelDisplayName(level)}
                                </span>
                              ))}
                              {tutorProfile.levels.length > 2 && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                  +{tutorProfile.levels.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {tutorProfile.hourlyRate && (
                          <div className="flex items-center text-gray-600">
                            <Award className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium">
                              {(tutorProfile.hourlyRate / 1000).toFixed(0)}k VNĐ/giờ
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2 pt-2">
                      {/* View Profile Button - Full width */}
                      <Button
                        size="sm"
                        onClick={() => handleViewTutor(tutorItem)}
                        className="w-full"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Xem hồ sơ
                      </Button>
                      
                      {/* Action Buttons - Two columns for pending, one column for approved */}
                      <div className={`grid gap-2 ${!isApproved ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {!isApproved ? (
                          <>
                            {/* Approve Button */}
                            <Button
                              size="sm"
                              onClick={() => handleAcceptTutor(tutorItem)}
                              disabled={acceptTutorMutation.isPending}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {acceptTutorMutation.isPending ? 'Đang duyệt...' : 'Duyệt'}
                            </Button>
                            
                            {/* Reject Button */}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectTutor(tutorItem)}
                              disabled={rejectTutorMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Từ chối
                            </Button>
                          </>
                        ) : (
                          /* Unapprove Button - Full width for approved profiles */
                          <Button
                            size="sm"
                            onClick={() => handleUnapproveTutor(tutorItem)}
                            disabled={rejectTutorMutation.isPending}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white w-full"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            {rejectTutorMutation.isPending ? 'Đang hủy duyệt...' : 'Hủy duyệt'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4">
            <div className="text-sm text-gray-700">
              Hiển thị {startIndex + 1} - {Math.min(endIndex, filteredTutors.length)} trong tổng số {filteredTutors.length} gia sư
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-gray-500">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      className="w-8 h-8 p-0"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Reject/Unapprove Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {rejectAction === 'reject' ? 'Từ chối hồ sơ gia sư' : 'Hủy duyệt hồ sơ gia sư'}
            </DialogTitle>
            <DialogDescription>
              {rejectAction === 'reject' 
                ? `Bạn có chắc chắn muốn từ chối hồ sơ của ${selectedTutor?.user?.name}? Vui lòng nhập lý do từ chối để gia sư có thể cải thiện hồ sơ.`
                : `Bạn có chắc chắn muốn hủy duyệt hồ sơ của ${selectedTutor?.user?.name}? Hồ sơ sẽ chuyển về trạng thái chờ duyệt.`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {rejectAction === 'reject' && (
              <div>
                <Label htmlFor="reject-reason">Lý do từ chối *</Label>
                <Textarea
                  id="reject-reason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Nhập lý do từ chối hồ sơ gia sư (tối thiểu 10 ký tự)..."
                  className="mt-2"
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={confirmReject}
              disabled={rejectAction === 'reject' && (rejectReason.trim().length < 10) || rejectTutorMutation.isPending}
              className={rejectAction === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}
            >
              {rejectTutorMutation.isPending 
                ? (rejectAction === 'reject' ? 'Đang từ chối...' : 'Đang hủy duyệt...')
                : (rejectAction === 'reject' ? 'Từ chối hồ sơ' : 'Hủy duyệt')
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TutorProfileListPage
