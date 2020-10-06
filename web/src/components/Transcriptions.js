import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import ClipLoader from 'react-spinners/ClipLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExclamationTriangle,
  faCheck,
} from '@fortawesome/free-solid-svg-icons'

import { transcriptionState } from '../state'
import { COLORS } from '../style'
import { useGetTranscriptionStatus } from '../hooks'

const Container = styled.div`
  width: 100%;
  margin-top: 50px;
  padding: 10px;

  > h1 {
    color: ${COLORS.purple};
  }
`

const Transcription = styled.div`
  margin-top: 40px;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  > img {
    height: 60px;
  }

  > svg {
  }
`

const transcriptionComponent = (transcription) => {
  return (
    <Transcription key={`transcription_${transcription.service}`}>
      <Logo>
        <img src={`/logos/${transcription.service}.png`}></img>
        {transcription.status === 'IN_PROGRESS' && <ClipLoader size={25} />}
        {transcription.status === 'FAILED' && (
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            color={COLORS.fireBrick}
          />
        )}
        {transcription.status === 'COMPLETED' && (
          <FontAwesomeIcon icon={faCheck} color={COLORS.pastelGreen} />
        )}
      </Logo>
      {transcription.data && (
        <p>
          {transcription.data.text.split('\n').map((text) => {
            return (
              <span key={`text_${text}`}>
                {text}
                <br></br>
                <br></br>
              </span>
            )
          })}
        </p>
      )}
    </Transcription>
  )
}

export default function Transcriptions() {
  const [transcriptions] = useRecoilState(transcriptionState)
  console.log({ transcriptions })

  if (!transcriptions || !transcriptions.length) return null

  return (
    <Container>
      <h1>Transcriptions</h1>
      {transcriptions.map((t) => transcriptionComponent(t))}
    </Container>
  )
}
