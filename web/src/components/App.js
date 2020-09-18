import React from 'react'
import styled from 'styled-components'
import { COLORS } from '../style'
import FileUpload from './FileUpload'
import Transcription from './Transcription'
import UploadButton from './UploadButton'

const Container = styled.div`
  margin: 0 auto;
  width: 80%;

  > h1 {
    color: ${COLORS.purple};
  }
`

const Content = styled.div`
  margin-top: 50px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

function App() {
  return (
    <Container>
      <h1>Auto transcriber</h1>
      <FileUpload />
      <Content>
        <UploadButton />
        <Transcription />
      </Content>
    </Container>
  )
}

export default App
