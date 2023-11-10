import { UploadStatus } from '@prisma/client'

export type File = {
  userId: string | null
  id: string
  name: string
  uploadStatus: UploadStatus
  url: string
  key: string
  createdAt: string
  updatedAt: string
}
