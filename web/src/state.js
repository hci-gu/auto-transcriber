import { atom, selector, selectorFamily } from 'recoil'

export const fileState = atom({
  key: 'file',
  default: null,
})

export const transcriptionState = atom({
  key: 'transcription',
  default: [
    // {
    //   service: 'aws',
    //   status: 'INPROGRESS',
    // },
    // {
    //   service: 'google',
    //   status: 'FAILED',
    // },
    // {
    //   service: 'ibm',
    //   status: 'COMPLETED',
    //   data: {
    //     text: 'HEHEJEJ',
    //   },
    // },
  ],
})

export const loadingState = atom({
  key: 'loading',
  default: false,
})

export const services = ['Google cloud', 'Amazon AWS', '']

export const service = atom({
  key: 'service',
  default: services[0],
})
