import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { createGoalCompletion } from '../services/create-goal-completion'
import { GetPendingGoals } from '../services/get-pending-goals'
import { OutlineButton } from './ui/outline-button'

export function PendingGoals() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: GetPendingGoals,
    staleTime: 1000 * 60, // 60 seconds
  })

  if (!data) {
    return null
  }

  async function handleCompleteGoal(goalId: string) {
    await createGoalCompletion(goalId)

    queryClient.invalidateQueries({ queryKey: ['summary'] })
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
  }

  return (
    <div className="flex flex-wrap gap-3">
      {data.map(goal => {
        return (
          <OutlineButton
            key={goal.id}
            disabled={goal.completionCount >= goal.desiredWeeklyFrequency}
            onClick={() => handleCompleteGoal(goal.id)}
          >
            <Plus className="size-4 text-zinc-600" />
            {goal.title}
          </OutlineButton>
        )
      })}
    </div>
  )
}
