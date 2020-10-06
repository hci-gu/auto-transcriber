import React from 'react'
import { useDropzone } from 'react-dropzone'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import { useFileUpload } from '../hooks'
import { fileState } from '../state'

const getColor = (props) => {
  if (props.isDragAccept) {
    return '#00e676'
  }
  if (props.isDragReject) {
    return '#ff1744'
  }
  if (props.isDragActive) {
    return '#2196f3'
  }
  return '#eeeeee'
}

const Container = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  cursor: pointer;
`
const uploadInput = (getInputProps) => {
  return (
    <>
      <input {...getInputProps()} />
      <p>Drag 'n' drop a file here, or click to select file</p>
      <p>(Only audio files will be accepted)</p>
    </>
  )
}

const uploadedFile = (file) => {
  return <p>{file.path}</p>
}

export default function StyledDropzone() {
  const onDrop = useFileUpload()
  const [file] = useRecoilState(fileState)
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ accept: 'audio/*', onDrop })

  return (
    <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
      {file ? uploadedFile(file) : uploadInput(getInputProps)}
    </Container>
  )
}
