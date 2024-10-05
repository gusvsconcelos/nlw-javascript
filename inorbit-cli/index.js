import { select, input, checkbox } from '@inquirer/prompts'
import fs from 'node:fs/promises'

let message = 'Bem vindo ao in.Orbit'

let goals

const loadGoals = async () => {
  try {
    const data = await fs.readFile('goals.json', 'utf-8')
    goals = JSON.parse(data)
  } catch (error) {
    goals = []
  }
}

const saveGoals = async () => {
  await fs.writeFile('goals.json', JSON.stringify(goals, null, 2))
}

const createGoal = async () => {
  const goal = await input({ message: 'Título da meta:' })

  if (goal.length === 0) {
    message = 'O título da meta não pode estar vazio.'
    return
  }

  goals.push({
    value: goal,
    checked: false,
  })

  message = `A meta "${goal}" foi criada.`
}

const listGoals = async () => {
  if (goals.length === 0) {
    message = 'Ainda não existem metas.'
    return
  }

  const response = await checkbox({
    message:
      'Use as <SETAS> para mudar de metas, o <ESPAÇO> para marcar ou desmarcar e o <ENTER> para finalizar esta etapa.',
    choices: [...goals],
    instructions: false,
  })

  for (const goal of goals) {
    goal.checked = false
  }

  for (const item of response) {
    const goal = goals.find(goal => {
      return goal.value === item
    })

    goal.checked = true

    message = `A meta "${goal.value}" foi marcada como concluída.`
  }
}

const goalsCompleted = async () => {
  const completed = goals.filter(goal => goal.checked === true)

  if (completed.length === 0) {
    message = 'Nenhuma meta foi realizada.'
    return
  }

  await select({
    message: `Metas completas: ${completed.length}`,
    choices: [...completed],
  })
}

const pendingGoals = async () => {
  const pending = goals.filter(goal => goal.checked === false)

  if (pending.length === 0) {
    message = 'Nenhuma meta pendente.'
    return
  }

  await select({
    message: `Metas pendentes: ${pending.length}`,
    choices: [...pending],
  })
}

const deleteGoals = async () => {
  const allGoals = goals.map(goal => {
    return { value: goal.value, checked: false }
  })

  if (allGoals.length === 0) {
    message = 'Não há metas para serem excluídas.'
    return
  }

  const response = await checkbox({
    message: 'Selecione as metas que deseja excluir.',
    choices: [...allGoals],
    instructions: false,
  })

  for (const item of response) {
    goals = goals.filter(goal => {
      return goal.value !== item
    })
  }

  message = `"${response}" foi excluído`
}

const displayMessage = () => {
  console.clear()

  if (message.length !== '') {
    console.log(`${message}\n`)
    message = ''
  }
}

async function app() {
  await loadGoals()

  while (true) {
    displayMessage()
    await saveGoals()

    const option = await select({
      message: 'Menu >',
      choices: [
        {
          name: 'Cadastrar meta',
          value: 'cadastrar',
        },
        {
          name: 'Listar metas',
          value: 'listar',
        },
        {
          name: 'Metas realizadas',
          value: 'realizadas',
        },
        {
          name: 'Metas pendentes',
          value: 'pendentes',
        },
        {
          name: 'Deletar metas',
          value: 'deletar',
        },
        {
          name: 'Sair',
          value: 'sair',
        },
      ],
    })

    switch (option) {
      case 'cadastrar':
        await createGoal()
        break
      case 'listar':
        await listGoals()
        break
      case 'realizadas':
        await goalsCompleted()
        break
      case 'pendentes':
        await pendingGoals()
        break
      case 'deletar':
        await deleteGoals()
        break
      case 'sair':
        console.log('Até logo!')
        return
    }
  }
}

app()
