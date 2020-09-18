import React, { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import { transcriptionState } from '../state'
import { COLORS } from '../style'

const Container = styled.div`
  margin-top: 50px;
  padding: 10px;

  > h1 {
    color: ${COLORS.purple};
  }
`

export default function Transcription() {
  const [transcription] = useRecoilState(transcriptionState)

  if (!transcription) return null

  return (
    <Container>
      <h1>Transcription</h1>
      <p>
        {transcription.text.split('\n').map((text) => {
          return (
            <>
              <span>{text}</span>
              <br></br>
              <br></br>
            </>
          )
        })}
      </p>
    </Container>
  )
}
