import * as cdk from 'aws-cdk-lib'
import * as apprunner from 'aws-cdk-lib/aws-apprunner'
import * as AppRunnerAutoScaling from 'aws-cdk-lib/aws-applicationautoscaling'
import * as ecrAssets from 'aws-cdk-lib/aws-ecr-assets'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'
import path = require('path')

interface IS3Storage extends cdk.NestedStackProps {
  STORAGE_S3_KEY: string
  STORAGE_S3_SECRET: string
  STORAGE_S3_BUCKET: string
  STORAGE_S3_REGION: string
  STORAGE_S3_ENDPOINT: string
  STORAGE_S3_ROOT: string
  STORAGE_S3_DB: string
  STORAGE_LOCATIONS?: 's3'
  STORAGE_S3_DRIVER?: 's3'
}

interface ISES extends cdk.NestedStackProps {
  EMAIL_SES_CREDENTIALS__ACCESS_KEY_ID?: string
  EMAIL_SES_CREDENTIALS__SECRET_ACCESS_KEY?: string
  EMAIL_SES_REGION?: string
}

interface IDirectus extends cdk.NestedStackProps {
  KEY: string
  SECRET: string
  EMAIL_TRANSPORT?: 'ses'
  EMAIL_FROM: string
  MAX_PAYLOAD_SIZE?: '50mb'
}

interface ISQLiteDB extends cdk.NestedStackProps {
  DB_SYNCHRONOUS?: 'NORMAL'
  DB_POOL__MIN?: '10'
  DB_POOL__MAX?: '200'
  DB_WAL_AUTOCHECKPOINT?: '0'
  DB_ACQUIRE_CONNECTION_TIMEOUT?: '5000'
}

export interface AppRunnerStackProps
  extends IS3Storage,
    IDirectus,
    ISES,
    ISQLiteDB {}

export class AppRunnerStack extends cdk.NestedStack {
  constructor (
    scope: Construct,
    id: string,
    props?: Partial<AppRunnerStackProps>
  ) {
    super(scope, id, props)

    // The code that defines your stack goes here

    const imageAsset = new ecrAssets.DockerImageAsset(
      this,
      'Build-Docker-Image',
      {
        directory: path.join(__dirname, '../')
        // buildArgs: {
        //   'no-cache': 'true'
        // }
      }
    )

    // create the Auto Scaling Configuration
    // const autoScalingConfiguration = new AppRunnerAutoScaling.CfnScalingPolicy(
    //   this,
    //   'AutoScalingConfiguration',
    //   {
    //     policyName: `no-scale`,
    //     policyType: cdk.aws_applicationautoscaling.
    //   }
    // )

    // create the access role to pull the image from ECR
    const accessRole = new iam.Role(this, `Apprunner-Stack-Role`, {
      assumedBy: new iam.ServicePrincipal('build.apprunner.amazonaws.com')
      //   description: `apprunner-stack-role`,
      //   inlinePolicies: {
      //     'directus-apprunner-policy': new iam.PolicyDocument({
      //       statements: [
      //         new iam.PolicyStatement({
      //           effect: iam.Effect.ALLOW,
      //           actions: ['ecr:GetAuthorizationToken'],
      //           resources: ['*']
      //         }),
      //         new iam.PolicyStatement({
      //           effect: iam.Effect.ALLOW,
      //           actions: [
      //             'ecr:BatchCheckLayerAvailability',
      //             'ecr:GetDownloadUrlForLayer',
      //             'ecr:GetRepositoryPolicy',
      //             'ecr:DescribeRepositories',
      //             'ecr:ListImages',
      //             'ecr:DescribeImages',
      //             'ecr:BatchGetImage',
      //             'ecr:GetLifecyclePolicy',
      //             'ecr:GetLifecyclePolicyPreview',
      //             'ecr:ListTagsForResource',
      //             'ecr:DescribeImageScanFindings'
      //           ],
      //           resources: [
      //             'arn:aws:ecr:' +
      //               this.region +
      //               ':' +
      //               this.account +
      //               ':repository/' +
      //               imageAsset.repository
      //           ]
      //         })
      //       ]
      //     })
      //   }
    })

    imageAsset.repository.grantPull(accessRole)

    const instanceRole = new iam.Role(this, `Apprunner-Instance-Role`, {
      assumedBy: new iam.ServicePrincipal('tasks.apprunner.amazonaws.com')
    })

    // create the App Runner service
    const service = new apprunner.CfnService(this, `${id}-AppService`, {
      healthCheckConfiguration: {
        unhealthyThreshold: 20,
        timeout: 2,
        interval: 10
      },
      autoScalingConfigurationArn:
        'arn:aws:apprunner:us-east-1:939863538297:autoscalingconfiguration/ScaleToZero/1/a6ec6f3668c94a72b3ce0dfc7513105d',
      instanceConfiguration: {
        cpu: '512',
        memory: '1024',
        instanceRoleArn: instanceRole.roleArn
      },
      sourceConfiguration: {
        authenticationConfiguration: {
          accessRoleArn: accessRole.roleArn
        },
        autoDeploymentsEnabled: true,
        imageRepository: {
          imageRepositoryType: 'ECR',
          imageIdentifier: imageAsset.imageUri,
          imageConfiguration: {
            port: '8055',
            runtimeEnvironmentVariables: [
              // S3
              {
                name: 'STORAGE_S3_KEY',
                value: props?.STORAGE_S3_KEY
              },
              {
                name: 'STORAGE_S3_SECRET',
                value: props?.STORAGE_S3_SECRET
              },
              {
                name: 'STORAGE_S3_BUCKET',
                value: props?.STORAGE_S3_BUCKET
              },
              {
                name: 'STORAGE_S3_REGION',
                value: props?.STORAGE_S3_REGION
              },
              {
                name: 'STORAGE_S3_ENDPOINT',
                value: props?.STORAGE_S3_ENDPOINT
              },
              {
                name: 'STORAGE_S3_ROOT',
                value: props?.STORAGE_S3_ROOT
              },
              {
                name: 'STORAGE_LOCATIONS',
                value: props?.STORAGE_LOCATIONS
              },
              {
                name: 'STORAGE_S3_DRIVER',
                value: props?.STORAGE_S3_DRIVER
              },
              {
                name: 'STORAGE_S3_DB',
                value: props?.STORAGE_S3_DB
              },

              // Directus
              {
                name: 'KEY',
                value: props?.KEY
              },
              {
                name: 'SECRET',
                value: props?.SECRET
              },
              {
                name: 'EMAIL_TRANSPORT',
                value: props?.EMAIL_TRANSPORT
              },
              {
                name: 'EMAIL_FROM',
                value: props?.EMAIL_FROM
              },
              {
                name: 'MAX_PAYLOAD_SIZE',
                value: props?.MAX_PAYLOAD_SIZE
              },

              // SES
              {
                name: 'EMAIL_SES_CREDENTIALS__ACCESS_KEY_ID',
                value: props?.EMAIL_SES_CREDENTIALS__ACCESS_KEY_ID
              },
              {
                name: 'EMAIL_SES_CREDENTIALS__SECRET_ACCESS_KEY',
                value: props?.EMAIL_SES_CREDENTIALS__SECRET_ACCESS_KEY
              },
              {
                name: 'EMAIL_SES_REGION',
                value: props?.EMAIL_SES_REGION
              },

              // DB
              {
                name: 'DB_SYNCHRONOUS',
                value: props?.DB_SYNCHRONOUS
              },
              {
                name: 'DB_POOL__MIN',
                value: props?.DB_POOL__MIN
              },
              { name: 'DB_POOL__MAX', value: props?.DB_POOL__MAX },
              {
                name: 'DB_WAL_AUTOCHECKPOINT',
                value: props?.DB_WAL_AUTOCHECKPOINT
              },
              {
                name: 'DB_ACQUIRE_CONNECTION_TIMEOUT',
                value: props?.DB_ACQUIRE_CONNECTION_TIMEOUT
              }
            ]
          }
        }
      },
      networkConfiguration: {
        egressConfiguration: {
          egressType: 'DEFAULT'
        }
      }
    })

    new cdk.CfnOutput(this, 'ServiceUrl', { value: service.attrServiceUrl })
  }
}
