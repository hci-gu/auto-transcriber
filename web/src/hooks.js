import { useEffect, useCallback } from 'react'
import { useRecoilState } from 'recoil'
import axios from 'axios'
import { fileState, transcriptionState } from './state'

export const useFileUpload = () => {
  const [_, setFile] = useRecoilState(fileState)

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0]
      setFile(file)
    },
    [setFile]
  )

  return onDrop
}

export const useGetTranscriptionStatus = (id) => {
  const [_, setTranscriptionState] = useRecoilState(transcriptionState)

  useEffect(() => {
    let interval
    const getStatus = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/${id}/status`
      )
      const transcriptions = response.data.services

      if (
        !transcriptions.length ||
        !transcriptions.map((t) => t.status).includes('IN_PROGRESS')
      ) {
        console.log('clear!')
        clearInterval(interval)
      }

      setTranscriptionState(transcriptions)
    }
    if (id != null) {
      interval = setInterval(getStatus, 1000)
    }
  }, [id, setTranscriptionState])
}
