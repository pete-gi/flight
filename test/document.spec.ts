import path from 'path'
import fs from 'fs'
import { JSDOM } from 'jsdom'

const flScriptPath = path.resolve(__dirname, '..', 'dist/flight.js')
const flScript = fs.readFileSync(flScriptPath, 'utf8')

const testScriptPath = path.resolve(__dirname, 'testscript.js')
const testScript = fs.readFileSync(testScriptPath, 'utf8')

const template = `
  <input type="number" fl-value="index#numValue:value" placeholder="Value of number" />
  <button fl-action="click:index#increment">Increment</button>

  <input
    type="text"
    fl-ref="index#strInput"
    fl-action="input:index#updateStrValue"
    fl-value="index#strValue:value"
    placeholder="Value of string"
  />
  <span fl-value="index#strValue:innerText"></span>

  <input
    type="text"
    fl-ref="index#colorInput"
    fl-action="keydown.M:index#toggleColor"
    placeholder="Get crazy with pushing M key!"
  />

  <script>${flScript}</script>
  <script>${testScript}</script>
`

const { window } = new JSDOM(template, {
  runScripts: 'dangerously',
})

const domStrInput = window.document.querySelector<HTMLInputElement>('[fl-ref="index#strInput"]')!
const domNumInput = window.document.querySelector<HTMLInputElement>('[type="number"]')!
const domColorInput = window.document.querySelector<HTMLInputElement>(
  '[fl-ref="index#colorInput"]'
)!

describe('Flight start', () => {
  it("should register controller with it's values", () => {
    expect(window.FL.controllers.index).toBeDefined()
    expect(window.FL.controllers.index.strValue).toBe('testValue')
    expect(window.FL.controllers.index.numValue).toBe(0)
    expect(window.FL.controllers.index.increment).toBeDefined()
    expect(window.FL.controllers.index.updateStrValue).toBeDefined()
    expect(window.FL.controllers.index.toggleColor).toBeDefined()
  })

  it('should append ref elements', () => {
    expect(domStrInput).toBeDefined()
    expect(domColorInput).toBeDefined()
    expect(window.FL.controllers.index.strInput).toBeDefined()
    expect(window.FL.controllers.index.colorInput).toBeDefined()

    expect(domStrInput.value).toBe(window.FL.controllers.index.strInput.value)
  })

  it('should check string value on input', () => {
    expect(window.FL.controllers.index.strValue).toBe('testValue')
    expect(window.FL.controllers.index.strInput.value).toBe('testValue')
    expect(domStrInput.value).toBe('testValue')
  })

  it('should check number value on input', () => {
    expect(window.FL.controllers.index.numValue).toBe(0)
    expect(domNumInput.value).toBe('0')
  })
})

describe('Flight interaction', () => {
  it('should increment number value on click', () => {
    window.FL.controllers.index.increment()
    expect(window.FL.controllers.index.numValue).toBe(1)
  })

  it('should update string value on input', () => {
    domStrInput.value = 'newValue'
    window.FL.controllers.index.updateStrValue()
    expect(window.FL.controllers.index.strValue).toBe('newValue')
    expect(window.FL.controllers.index.strInput.value).toBe('newValue')
  })

  it('should toggle color on keydown.M', () => {
    window.FL.controllers.index.toggleColor()
    expect(window.FL.controllers.index.colorInput.classList.contains('red')).toBe(true)
    window.FL.controllers.index.toggleColor()
    expect(window.FL.controllers.index.colorInput.classList.contains('red')).toBe(false)
  })
})
