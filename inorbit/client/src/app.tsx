import { useQuery } from '@tanstack/react-query'
import { CreateGoal } from './components/create-goal'
import { EmptyGoals } from './components/empty-goals'
import { Summary } from './components/summary'
import { Dialog } from './components/ui/dialog'
import { GetSummary } from './services/get-summary'

export function App() {
  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: GetSummary,
    staleTime: 1000 * 60, // 60 seconds
  })

  return (
    <Dialog>
      {data?.total && data.total > 0 ? <Summary /> : <EmptyGoals />}
      <CreateGoal />
    </Dialog>
  )
}
