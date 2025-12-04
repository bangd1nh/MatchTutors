export const SessionStatusTranslation: Record<string, string> = {
  COMPLETED: 'Đã hoàn thành',
  NOT_CONDUCTED: 'Không thực hiện',
} as const;

export const getSessionStatusLabel = (status: string): string => {
  return SessionStatusTranslation[status] || status;
};
