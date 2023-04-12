import * as cdk from 'aws-cdk-lib'
import { AppRunnerStack, AppRunnerStackProps } from './apprunner-stack'
import { Construct } from 'constructs'

export class DirectusStack extends cdk.Stack {
  constructor (
    scope: Construct,
    id: string,
    props?: cdk.StackProps & Partial<AppRunnerStackProps>
  ) {
    super(scope, id, props)

    // const repo = new cdk.aws_ecr.Repository(this, 'DirectusRepo', {
    //   repositoryName: 'directus',
    //   removalPolicy: cdk.RemovalPolicy.DESTROY,
    //   // autoDeleteImages: true,
    //   lifecycleRules: [
    //     {
    //       maxImageAge: cdk.Duration.days(1),
    //       tagStatus: cdk.aws_ecr.TagStatus.UNTAGGED
    //     }
    //   ]
    // })

    const Directus = new AppRunnerStack(this, `${id}-Directus-Stack`, {
      ...props,
      STORAGE_LOCATIONS: 's3',
      STORAGE_S3_DRIVER: 's3',

      EMAIL_TRANSPORT: 'ses',
      MAX_PAYLOAD_SIZE: '50mb',

      DB_SYNCHRONOUS: 'NORMAL',
      DB_POOL__MIN: '10',
      DB_POOL__MAX: '200',
      DB_WAL_AUTOCHECKPOINT: '0',
      DB_ACQUIRE_CONNECTION_TIMEOUT: '5000'
    })
  }
}
