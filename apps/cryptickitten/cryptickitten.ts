import * as dotenv from 'dotenv'
import path = require('path')
import { Construct } from 'constructs'
import { DirectusStack } from '../../lib/directus'

export const CrypticKittenStack = (app: Construct) => {
  dotenv.config({
    path: path.join(__dirname, './.env'),
    override: true
  })

  new DirectusStack(app, 'CrypticKitten', {
    env: { account: process.env.ACCOUNT, region: process.env.REGION },
    STORAGE_S3_KEY: process.env.STORAGE_S3_KEY,
    STORAGE_S3_SECRET: process.env.STORAGE_S3_SECRET,
    STORAGE_S3_BUCKET: process.env.STORAGE_S3_BUCKET,
    STORAGE_S3_REGION: process.env.STORAGE_S3_REGION,
    STORAGE_S3_ENDPOINT: process.env.STORAGE_S3_ENDPOINT,
    STORAGE_S3_ROOT: process.env.STORAGE_S3_ROOT,
    STORAGE_S3_DB: process.env.STORAGE_S3_DB,

    KEY: process.env.KEY,
    SECRET: process.env.SECRET,

    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_SES_CREDENTIALS__ACCESS_KEY_ID:
      process.env.EMAIL_SES_CREDENTIALS__ACCESS_KEY_ID,
    EMAIL_SES_CREDENTIALS__SECRET_ACCESS_KEY:
      process.env.EMAIL_SES_CREDENTIALS__SECRET_ACCESS_KEY,
    EMAIL_SES_REGION: process.env.EMAIL_SES_REGION
  })
}
