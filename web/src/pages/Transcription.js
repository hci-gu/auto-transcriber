import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import Transcriptions from '../components/Transcriptions'
import { useGetTranscriptionStatus } from '../hooks'

const Container = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
`

const Spacer = styled.div`
  height: 50px;
`

function Transcription() {
  const params = useParams()
  useGetTranscriptionStatus(params.id)

  return (
    <Container>
      <p>{params.id}</p>
      <Transcriptions />
    </Container>
  )
}

export default Transcription
