import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Cocoon Admin',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, 
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/studio', // This means your client goes to website.com/studio to login

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})