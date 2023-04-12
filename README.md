# litestream (db) + directus (cms) + s3 (storage) + cloud run (server) / aws cdk (apprunner)

[![tests](https://github.com/TotalLag/litestream-directus-s3-cloud-run-template/actions/workflows/tests.infrastructure.yml/badge.svg)](https://github.com/TotalLag/litestream-directus-s3-cloud-run-template/actions/workflows/tests.infrastructure.yml) [![build](https://github.com/TotalLag/litestream-directus-s3-cloud-run-template/actions/workflows/build.infrastructure.yml/badge.svg)](https://github.com/TotalLag/litestream-directus-s3-cloud-run-template/actions/workflows/build.infrastructure.yml) [![release](https://github.com/TotalLag/litestream-directus-s3-cloud-run-template/actions/workflows/release.infrastructure.yml/badge.svg)](https://github.com/TotalLag/litestream-directus-s3-cloud-run-template/actions/workflows/release.infrastructure.yml)

Get fully-replicated serverless CMS with no pain and little cost.

## UPDATE:

This repo is transitioning from Google to AWS with updates to workflows coming soon...

App Stacks are provided as an example on how you can spin up different environments working off of the same CDK.

### Usage

1. Pre-req: AWS CDK CLI and an AWS account
2. Clone this repo
3. Create `.env` with variables specific to your stack. Save in under `./apps/<stack>/`.
4. run `npm run cdk deploy <stackname>`
