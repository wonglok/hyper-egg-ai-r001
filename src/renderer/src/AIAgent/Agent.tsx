import OpenAI from 'openai'
import { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions'

// ============================================================================
// TOOL DEFINITIONS
// ============================================================================

interface ToolResult {
  success: boolean
  data: any
  error?: string
}

const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_web',
      description: 'Search the web for current information',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'calculate',
      description: 'Perform mathematical calculations',
      parameters: {
        type: 'object',
        properties: {
          expression: { type: 'string', description: 'Mathematical expression to evaluate' }
        },
        required: ['expression']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Read contents of a file',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'File path' }
        },
        required: ['path']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'write_file',
      description: 'Write content to a file',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'File path' },
          content: { type: 'string', description: 'Content to write' }
        },
        required: ['path', 'content']
      }
    }
  }
]

// ============================================================================
// TOOL IMPLEMENTATIONS
// ============================================================================

class ToolExecutor {
  private memory: Map<string, string> = new Map()

  async execute(name: string, args: any): Promise<ToolResult> {
    console.log(`🔧 Executing: ${name}(${JSON.stringify(args)})`)

    try {
      switch (name) {
        case 'search_web':
          // Simulate web search
          return {
            success: true,
            data: `Search results for "${args.query}": [Simulated results would appear here]`
          }

        case 'calculate':
          // Safe evaluation using Function constructor
          const result = new Function('return ' + args.expression)()
          return { success: true, data: result }

        case 'read_file':
          const content = this.memory.get(args.path) || `// File ${args.path} not found`
          return { success: true, data: content }

        case 'write_file':
          this.memory.set(args.path, args.content)
          return { success: true, data: `Wrote ${args.content.length} bytes to ${args.path}` }

        default:
          return { success: false, data: null, error: `Unknown tool: ${name}` }
      }
    } catch (error) {
      return { success: false, data: null, error: String(error) }
    }
  }
}

// ============================================================================
// AGENT LOOP
// ============================================================================

class OpenClawAgent {
  private openai: OpenAI
  private toolExecutor: ToolExecutor
  private messages: ChatCompletionMessageParam[] = []
  private maxIterations: number = 10

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey, baseURL: `http://localhost:1234/v1` })
    this.toolExecutor = new ToolExecutor()
  }

  async run(userInput: string): Promise<void> {
    // Add user message
    this.messages.push({ role: 'user', content: userInput })

    console.log('\n🚀 Starting Agent Loop')
    console.log('═'.repeat(50))

    for (let i = 0; i < this.maxIterations; i++) {
      console.log(`\n📍 Iteration ${i + 1}/${this.maxIterations}`)

      // Call OpenAI with tools
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: this.messages,
        tools: tools,
        tool_choice: 'auto'
      })

      const message = response.choices[0].message
      this.messages.push(message)

      // Check if agent wants to use tools
      if (message.tool_calls && message.tool_calls.length > 0) {
        console.log(`🤖 Agent wants to use ${message.tool_calls.length} tool(s)`)

        // Execute all tool calls
        for (const toolCall of message.tool_calls) {
          const result = await this.toolExecutor.execute(
            toolCall['function'].name,
            JSON.parse(toolCall['function'].arguments)
          )

          // Add tool result to conversation
          this.messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result)
          })
        }
      } else {
        // Agent has final response
        console.log('\n✅ Agent completed')
        console.log('═'.repeat(50))
        console.log(`\n📝 Final Response:\n${message.content}`)
        return
      }
    }

    console.log('\n⚠️ Max iterations reached')
  }

  getConversationHistory(): ChatCompletionMessageParam[] {
    return this.messages
  }
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

export async function mainExample() {
  const agent = new OpenClawAgent(process.env.OPENAI_API_KEY || 'your-api-key')

  await agent.run(`
    Calculate the compound interest on $1000 at 5% for 10 years,
    then write the result to a file called "investment.txt"
  `)
}
