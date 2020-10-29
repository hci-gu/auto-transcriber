const AWS = require('aws-sdk')
const mime = require('mime-types')

const { AWS_BUCKET_NAME } = process.env

const s3 = new AWS.S3()
const transcribeService = new AWS.TranscribeService()

const transcribe = async ({ audio, mimetype, id, language, speakers }) => {
  const fileName = `${id}.${mime.extension(mimetype)}`
  const payload = {
    Key: `Audio/${fileName}`,
    Bucket: AWS_BUCKET_NAME,
    Body: audio.buffer,
    ContentType: mimetype,
  }
  const fileUri = `https://s3.amazonaws.com/${AWS_BUCKET_NAME}/Audio/${fileName}`

  await new Promise((resolve, reject) => {
    s3.upload(payload, (err, data) => {
      if (err) {
        reject(err)
      } else {
        console.log('data', data)
        resolve(data.Location)
      }
    })
  })

  const params = {
    TranscriptionJobName: id,
    Media: { MediaFileUri: fileUri },
    MediaFormat: mimetype === 'audio/mp3' ? 'mp3' : 'wav',
    OutputBucketName: AWS_BUCKET_NAME,
    LanguageCode: language,
    Settings: {
      ShowSpeakerLabels: true,
      MaxSpeakerLabels: speakers,
    },
  }
  await new Promise((resolve, reject) => {
    transcribeService.startTranscriptionJob(params, (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

const getDataForTranscription = async (id) => {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: `${id}.json`,
  }
  const transcripts = await new Promise((resolve, reject) => {
    s3.getObject(params, function (err, data) {
      if (err) return reject(err)
      resolve(JSON.parse(data.Body.toString()).results.transcripts)
    })
  })
  // fetch and concat all transcripts
  const text = transcripts
    .map((transcriptObject, i) => `${i + 1}\t${transcriptObject.transcript}`)
    .join('\n')

  return { text, raw: transcripts }
}

const getTranscriptionStatus = async (id) => {
  return new Promise((resolve, reject) => {
    transcribeService.getTranscriptionJob(
      {
        TranscriptionJobName: id,
      },
      (err, data) => {
        if (err) return reject(err)
        resolve(data.TranscriptionJob.TranscriptionJobStatus)
      }
    )
  })
}

module.exports = {
  transcribe,
  getTranscription: async (id) => {
    let status
    try {
      status = await getTranscriptionStatus(id)
    } catch (error) {
      status = 'FAILED'
    }

    let data
    if (status === 'COMPLETED') {
      data = await getDataForTranscription(id)
    }
    return {
      status,
      data,
    }
  },
  clear: (id) => {},
}
