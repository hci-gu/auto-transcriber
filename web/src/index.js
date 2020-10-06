import React from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import App from './components/App'
import Transcription from './pages/Transcription'
import Upload from './pages/Upload'

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <App>
        <Router>
          <Switch>
            <Route path="/transcription/:id">
              <Transcription />
            </Route>
            <Route path="/">
              <Upload />
            </Route>
          </Switch>
        </Router>
      </App>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
)
