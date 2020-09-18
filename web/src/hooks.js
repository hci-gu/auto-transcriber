import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { fileState } from './state'

export const useFileUpload = () => {
  const [_, setFile] = useRecoilState(fileState)

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    setFile(file)
  }, [])

  return onDrop
}
