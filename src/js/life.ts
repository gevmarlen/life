export class Life {
  private leftClick: boolean
  private rightClick: boolean
  private cellCount: number
  private cellSize: number
  private mainArray: number[][] = []
  private ctx: CanvasRenderingContext2D
  private newArray: number[][] = []
  private timer: any
  private cycles: number = 0
  private gameStarted: boolean
  private output: HTMLElement

  constructor(canvasSelector: string, outputSelector: string, cellSize: number) {
    let canvas = <HTMLCanvasElement>document.querySelector(canvasSelector)
    this.output = document.querySelector(outputSelector)

    this.ctx = canvas.getContext('2d')

    this.leftClick = false
    this.rightClick = false

    this.cellSize = cellSize
    this.cellCount = this.ctx.canvas.width / this.cellSize

    this.reset()

    document.addEventListener('mouseup', () => {
      this.leftClick = false
      this.rightClick = false
    })

    canvas.addEventListener('mousedown', event => {
      if (event.button == 0) {
        this.leftClick = true
        let x = Math.floor(event.offsetX / this.cellSize)
        let y = Math.floor(event.offsetY / this.cellSize)
        if (x >= 0 && x < this.cellCount && y >= 0 && y <= this.cellCount) {
          this.mainArray[x][y] = 1
          this.draw(x, y)
        }
      } else if (event.button == 2) {
        this.rightClick = true
        let x = Math.floor(event.offsetX / this.cellSize)
        let y = Math.floor(event.offsetY / this.cellSize)
        if (x >= 0 && x < this.cellCount && y >= 0 && y <= this.cellCount) {
          this.mainArray[x][y] = 0
          this.clear(x, y)
        }
      }
    })

    canvas.addEventListener('contextmenu', event => {
      event.preventDefault()
    })

    canvas.addEventListener('mousemove', event => {
      if (this.leftClick) {
        let x = Math.floor(event.offsetX / this.cellSize)
        let y = Math.floor(event.offsetY / this.cellSize)
        if (x >= 0 && x < this.cellCount && y >= 0 && y <= this.cellCount) {
          this.mainArray[x][y] = 1
          this.draw(x, y)
        }
      } else if (this.rightClick) {
        let x = Math.floor(event.offsetX / this.cellSize)
        let y = Math.floor(event.offsetY / this.cellSize)
        if (x >= 0 && x < this.cellCount && y >= 0 && y <= this.cellCount) {
          this.mainArray[x][y] = 0
          this.clear(x, y)
        }
      }
    })
  }

  private draw(x: number, y: number) {
    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
    this.ctx.stroke()
    this.ctx.fill()
  }

  private clear(x: number, y: number) {
    this.ctx.clearRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
  }

  private next(i: number) {
    return i == this.cellCount - 1 ? 0 : i + 1
  }

  private prev(i: number) {
    return i == 0 ? this.cellCount - 1 : i - 1
  }

  public reset() {
    this.ctx.clearRect(0, 0, 600, 600)

    for (let x = 0; x < this.cellCount; x++) {
      this.mainArray[x] = []
      this.newArray[x] = []

      for (let y = 0; y < this.cellCount; y++) {
        this.mainArray[x][y] = 0
        this.newArray[x][y] = 0
      }
    }
  }

  public toggle() {
    if (this.gameStarted) {
      this.gameStarted = false
      clearInterval(this.timer)
    } else {
      this.gameStarted = true
      this.cycles = 0
      this.timer = setInterval(() => {
        this.ctx.clearRect(0, 0, 600, 600)
        for (let x = 0; x < this.cellCount; x++) {
          for (let y = 0; y < this.cellCount; y++) {
            let neighbors = 0

            if (this.mainArray[this.prev(x)][this.next(y)]) neighbors++ // -1, 1
            if (this.mainArray[x][this.next(y)]) neighbors++ // 0, 1
            if (this.mainArray[this.next(x)][this.next(y)]) neighbors++ // 1, 1
            if (this.mainArray[this.prev(x)][y]) neighbors++ // -1, 0
            if (this.mainArray[this.next(x)][y]) neighbors++ // 1, 0
            if (this.mainArray[this.prev(x)][this.prev(y)]) neighbors++ // -1, -1
            if (this.mainArray[x][this.prev(y)]) neighbors++ // 0, -1
            if (this.mainArray[this.next(x)][this.prev(y)]) neighbors++ // 1, -1

            if ((this.mainArray[x][y] == 0 && neighbors == 3) || (this.mainArray[x][y] == 1 && (neighbors == 3 || neighbors == 2))) {
              this.newArray[x][y] = 1
              this.draw(x, y)
            } else {
              this.newArray[x][y] = 0
            }
          }
        }

        let tempArray = this.mainArray
        this.mainArray = this.newArray
        this.newArray = tempArray
        tempArray = null

        this.cycles++

        this.output.innerText = 'Количество циклов: ' + this.cycles
      }, 100)
    }
  }
}
