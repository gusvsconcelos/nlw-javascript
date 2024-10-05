import { Plus } from 'lucide-react'
import letsStart from '../assets/lets-start-illustration.svg'
import logo from '../assets/logo-in-orbit.svg'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'

export function EmptyGoals() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8">
      <img src={logo} alt="in.orbit" />
      <img src={letsStart} alt="in.orbit" />
      <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
        Você ainda não cadastrou nenhuma meta, que tal{' '}
        <DialogTrigger className="underline underline-offset-4">
          cadastrar um
        </DialogTrigger>{' '}
        agora mesmo?
      </p>

      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Cadastrar meta
        </Button>
      </DialogTrigger>
    </div>
  )
}
