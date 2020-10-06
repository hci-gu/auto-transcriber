import React from 'react'
import styled from 'styled-components'
import FileUpload from '../components/FileUpload'
import UploadButton from '../components/UploadButton'

const Container = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
`

const Spacer = styled.div`
  height: 50px;
`

function Upload() {
  return (
    <Container>
      <FileUpload />
      <Spacer />
      <UploadButton />
    </Container>
  )
}

export default Upload
