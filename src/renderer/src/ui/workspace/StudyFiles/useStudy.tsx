import { create } from 'zustand'

export const initState = () => {
  return {
    //
    userPrompt: `1. Find my happy moments in my diary. @Personal Workspace.
2. Find my sad moments in my diary. @Personal Workspace.
3. What Bible verses should I study for my life at the @Bible Workspace. 

Please reply using Hong Kong Style Cantonese with Emojis but MUST quote the KJV english bible scriptures in full sentences.
Stop when you found 10 scriptures in total.
`,
    currentStatus: {
      thoughts: '',
      words: ''
    },
    steps: [],
    history: [],

    activate3D: false,
    phase: 0,
    llmOutput: '',
    goalReached: [],

    userMessage: [],
    actionLogs: [],

    abortedTasks: [],
    currentQuery: []
    //
  }
}

type State = ReturnType<typeof initState>
export const useStudy = create<State>(initState)
