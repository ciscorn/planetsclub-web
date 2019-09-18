declare module '*.gql' {
  import { DocumentNode } from 'graphql'
  const content: {
    [k: string]: DocumentNode
  }
  export default content
}
