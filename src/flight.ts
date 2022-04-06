/** controller # property */
// fl-ref="geolocation#button"

/** controller # property : elementAttribute */
// fl-value="geolocation#latitude:value"

/** event (or event.key) : controller # method ? modifier(optional) */
// fl-action="click:geolocation#get?prevent"
// fl-action="keydown.Enter:geolocation#get?prevent"

import { Controller, Controllers, EventModifier } from './types'

declare global {
  interface Window {
    FL: {
      registerController: (name: string, controller: any) => void
      controllers: Controllers
    }
  }
}

window.FL = class Flight {
  private static prefix = 'fl'
  private static actionSeparator = /[:#\?]/
  private static actionKeySeparator = /[.]/
  private static refSeparator = /#/
  private static valueSeparator = /[#:]/
  private static refsArrayIndicator = '[]'
  private static refAttr = `${this.prefix}-ref`
  private static valueAttr = `${this.prefix}-value`
  private static actionAttr = `${this.prefix}-action`

  public static controllers: Controllers = {}

  public static registerController(name: string, controller: any) {
    this.controllers[name] = controller
    /***********/
    if (this.controllers[name].beforeInit) {
      this.controllers[name].beforeInit()
    }
    /***********/
    this.registerValueEvents(name)
    this.registerActions(name)
    this.registerRefs(name)
    /***********/
    this.applyDefaultValues(name)
    /***********/
    if (this.controllers[name].afterInit) {
      this.controllers[name].afterInit()
    }
  }

  private static registerActions(controllerName: string) {
    const actionElements = document.querySelectorAll<HTMLDivElement>(`[${this.actionAttr}]`)
    actionElements.forEach((actionElement) => this.registerAction(controllerName, actionElement))
  }

  private static registerAction(controllerName: string, actionElement: HTMLElement) {
    const [event, controller, method, modifier] = actionElement
      .getAttribute(this.actionAttr)!
      .split(this.actionSeparator)

    if (controller === controllerName) {
      this._applyActionHandler(controller, actionElement, event, method, modifier as EventModifier)
    }
  }

  private static registerRefs(controllerName: string) {
    const refElements = document.querySelectorAll<HTMLDivElement>(`[${this.refAttr}]`)
    refElements.forEach((refElement) => this.registerRef(controllerName, refElement))
  }

  private static registerRef(controllerName: string, refElement: HTMLElement) {
    const [controller, ref] = refElement.getAttribute(this.refAttr)!.split(this.refSeparator)
    if (controller === controllerName) {
      if (ref.includes(this.refsArrayIndicator)) {
        const propName = ref.replace(this.refsArrayIndicator, '')
        if (!this.controllers[controller][propName]) {
          this.controllers[controller][propName] = []
        }
        this.controllers[controller][propName].push(refElement)
      } else {
        this.controllers[controller][ref] = refElement
      }
    }
  }

  private static registerValueEvents(controllerName: string) {
    const valueElements = document.querySelectorAll<HTMLDivElement>(`[${this.valueAttr}]`)
    valueElements.forEach((valueElement) => this.registerValueEvent(controllerName, valueElement))
  }

  private static registerValueEvent(controllerName: string, valueElement: HTMLElement) {
    const [controller, variable, attribute] = valueElement
      .getAttribute(this.valueAttr)!
      .split(this.valueSeparator)

    if (controller === controllerName) {
      const self = this
      this.controllers[controller] = new Proxy(this.controllers[controller], {
        set(ref, property, value) {
          ref[property] = value
          self._applyEventListener(controller, variable, attribute, valueElement)
          self._dispatchEvent(controller, String(property), value)
          return true
        },
        get(ref: Controller, property: string) {
          return ref[String(property)]
        },
      })
    }
  }

  private static _applyActionHandler(
    controllerName: string,
    element: HTMLElement,
    event: string,
    method: string,
    modifier?: EventModifier
  ) {
    const [eventName, key] = event.split(this.actionKeySeparator)
    element.addEventListener(eventName, (e: Event | KeyboardEvent) => {
      if (modifier) {
        this._applyEventModifier(e, modifier as EventModifier | undefined)
      }
      if (!key || ('key' in e && e.key.toLowerCase() === key.toLowerCase())) {
        this.controllers[controllerName][method]()
      }
    })
  }

  private static _applyEventListener(
    controller: string,
    property: string,
    attribute: string,
    element: HTMLElement
  ) {
    window.addEventListener(`${this.prefix}:value:${controller}:${property}`, () => {
      element[attribute] = this.controllers[controller][property]
    })
  }

  private static _dispatchEvent(controller: string, property: string, value: any) {
    window.dispatchEvent(
      new CustomEvent(`${this.prefix}:value:${controller}:${property}`, {
        detail: {
          value,
        },
      })
    )
  }

  private static applyDefaultValues(name: string) {
    for (const property in this.controllers[name]) {
      if (
        this.controllers[name].hasOwnProperty(property) &&
        !(this.controllers[name][property] instanceof Function) &&
        !(this.controllers[name][property] instanceof HTMLElement)
      ) {
        this._dispatchEvent(name, property, this.controllers[name][property])
      }
    }
  }

  private static _applyEventModifier(event: Event, modifier?: EventModifier) {
    switch (modifier) {
      case 'prevent':
        event.preventDefault()
        break
      case 'stop':
        event.stopPropagation()
        break
      case 'stopImmediate':
        event.stopImmediatePropagation()
        break
    }
  }
}
