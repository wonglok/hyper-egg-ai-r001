import { create } from 'zustand'

export type Todo = {
  task: string
  // active: boolean
  status: 'pending' | 'active' | 'completed'
}

export type Action = {
  cmd: string
  result: string
}

const getInit = (set, get) => {
  return {
    //
    //
    error: '' as string,
    brain: '' as string,
    terminalCalls: [] as Action[],
    status: ['pending', 'active', 'completed'] as any[],
    //
    stream: '' as string,
    todo: [] as Todo[]

    //
  }
}

export type TMState = Awaited<ReturnType<typeof getInit>>

export const useTM = create<TMState>(getInit)
