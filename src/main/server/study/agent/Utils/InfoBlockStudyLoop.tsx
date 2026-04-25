export const InfoBlockStudyLoop = `
# Output Foramtting 

- for writing a goal-reached at this step
<infoblock type="goal-reached" extra="">
[message here...]
</infoblock>

- for writing a query for the local knowledge base search engine
<infoblock type="query" workspace="...">
[query here...]
</infoblock>

- for writing next-step
<infoblock type="next-step" extra="">
[next-step here...]
</infoblock>

- for write about what to tell user
<infoblock type="message-to-user" extra="">
[message here...]
</infoblock>
`

export type StudyBlock = {
  type: string
  path?: string
  extra?: string
  workspace?: string
  content: string
  timestamp: string
}

export function parseInfoblocks(input: string) {
  const blocks: StudyBlock[] = []

  // Non-greedy match + DOTALL behavior via [\s\S]*
  const regex = /<infoblock\s+([^>]*)>([\s\S]*?)<\/infoblock>/gi

  let match
  while ((match = regex.exec(input)) !== null) {
    const attrsStr = match[1]
    const content = match[2].trim()

    // Extract type (required)
    const typeMatch = attrsStr.match(/type\s*=\s*["']?([^"'\s>]+)["']?/i)
    if (!typeMatch) continue // skip invalid block

    // // Extract path (optional)
    const pathMatch = attrsStr.match(/path\s*=\s*["']?([^"'\s>]+)["']?/i)

    // Extract path (optional)
    const extraMatch = attrsStr.match(/extra\s*=\s*["']?([^"'\s>]+)["']?/i)

    // Extract path (optional)
    const workspaceMatch = attrsStr.match(/workspace\s*=\s*["']?([^"'\s>]+)["']?/i)

    blocks.push({
      type: typeMatch[1].trim(),
      workspace: workspaceMatch ? workspaceMatch[1].trim() : undefined,
      path: pathMatch ? pathMatch[1].trim() : undefined,
      extra: extraMatch ? extraMatch[1].trim() : undefined,
      content: content || '',
      timestamp: new Date().toString()
    })
  }

  return blocks satisfies StudyBlock[]
}
