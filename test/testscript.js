window.FL.registerController(
  'index',
  class {
    static strValue = 'testValue'
    static numValue = 0
    static strInput
    static colorInput

    static increment() {
      this.numValue++
    }

    static updateStrValue() {
      this.strValue = this.strInput.value
    }

    static toggleColor() {
      this.colorInput.classList.toggle('red')
    }
  }
)
