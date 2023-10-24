'use client'

import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

const UploadButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload file</Button>
      </DialogTrigger>
      <DialogContent>Content example</DialogContent>
    </Dialog>
  )
}

export default UploadButton
