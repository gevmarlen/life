import { Life } from './life'

let life = new Life('.canvas', '.output', 10)

let startButton = document.querySelector('.start')
let resetButton = document.querySelector('.reset')

startButton.addEventListener('click', () => {
  life.toggle()
})

resetButton.addEventListener('click', () => {
  life.reset()
})
