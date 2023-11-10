'use client'

import { trpc } from '@/app/_trpc/client'
import UploadButton from './UploadButton'
import { Ghost } from 'lucide-react'
import Skeleton from 'react-loading-skeleton'
import { ReactNode, useState } from 'react'
import FileItem from './FileItem'
import { File } from '@/types'

type ListFilesProp = {
  files: File[]
  currentlyDeletingFile: string | null
  onDeleteFile: (id: string) => void
}

const ListFiles = ({
  files,
  currentlyDeletingFile,
  onDeleteFile,
}: ListFilesProp) => {
  return (
    <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-col-2 lg:grid-cols-3">
      {files.map((file) => (
        <li
          key={file.id}
          className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
        >
          <FileItem
            currentlyDeletingFile={currentlyDeletingFile}
            file={file}
            onDeleteFile={(id) => onDeleteFile(id)}
            key={file.id}
          />
        </li>
      ))}
    </ul>
  )
}

const HeaderDashboard = () => {
  return (
    <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
      <h1 className="mb-3 font-bold text-5xl text-gray-900 ">My files</h1>

      <UploadButton />
    </div>
  )
}

const NoFiles = () => {
  return (
    <div className="mt-16 flex flex-col items-center gap-2">
      <Ghost className="h-8 w-8 text-zinc-800" />
      <h3 className="font-semibold text-xl">Pretty empty around here</h3>
      <p>Let&apos;s upload your first PDF.</p>
    </div>
  )
}

const Main = ({ children }: { children: ReactNode }) => {
  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <HeaderDashboard />
      {children}
    </main>
  )
}

const Dashboard = () => {
  // states
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null)

  // hooks
  const utils = trpc.useContext()
  const { data: files, isLoading } = trpc.getUserFiles.useQuery()
  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate() // refaz a consulta
    },
    onMutate: ({ id }) => {
      setCurrentlyDeletingFile(id)
    },
    onSettled: () => {
      setCurrentlyDeletingFile(null)
    },
  })

  if (isLoading) {
    return (
      <Main>
        <Skeleton height={100} className=" my-2" count={3} />
      </Main>
    )
  }

  const existsFiles = !!files?.length

  if (existsFiles) {
    return (
      <Main>
        <ListFiles
          currentlyDeletingFile={currentlyDeletingFile}
          onDeleteFile={(id) => deleteFile({ id })}
          files={files}
        />
      </Main>
    )
  }

  return (
    <Main>
      <NoFiles />
    </Main>
  )
}

export default Dashboard
