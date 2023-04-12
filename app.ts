import * as cdk from 'aws-cdk-lib'
import { DirectusStack } from './lib/directus'
import { ArtEngineeringStack } from './apps/art-engineering/art-engineering'
import { HABAMNStack } from './apps/habamn/habamn'
import { CrypticKittenStack } from './apps/cryptickitten/cryptickitten'

const app = new cdk.App()

ArtEngineeringStack(app)
HABAMNStack(app)
CrypticKittenStack(app)
