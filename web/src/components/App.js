import React from 'react'
import styled from 'styled-components'
import { COLORS } from '../style'

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
`

function App({ children }) {
  return (
    <Container>
      <h1>Auto transcriber</h1>
      <Content>{children}</Content>
    </Container>
  )
}

export default App
