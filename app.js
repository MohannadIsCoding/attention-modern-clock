document.addEventListener('DOMContentLoaded', () => {
  prepareIndicators()
  getLocalTime()
  setTimeout(() => {
    document.querySelector('.loading-container').classList.value = 'loading-container'
  }, 1000)
})

const arrows = {
  h: document.querySelector('#h.arrow'),
  m: document.querySelector('#m.arrow'),
  s: document.querySelector('#s.arrow'),
}

const hoursIndicatorWrapper = document.querySelector('.hours-lines')
const minsIndicatorWrapper = document.querySelector('.mins-lines')
const controlsContainer = document.querySelector('.controls .container')

const focusButton = document.querySelector('.buttons #focus.button')

let times = { focus: 25, break: 5 }
let isFocusModeEnabled = false
let isBreakModeEnabled = false

const getLocalTime = () => {
  const date = new Date()
  const timeout = 1000 - date.getMilliseconds()
  const time = { h: date.getHours(), m: date.getMinutes(), s: date.getSeconds(), ms: date.getMilliseconds() }
  rotateArrows(time)
  if (isBreakModeEnabled || isFocusModeEnabled) {
    resetArrowsRotation()
    return
  }
  setTimeout(getLocalTime, 0);
  // console.log(date.getHours(), date.getMinutes(), date.getSeconds());
}


const rotateArrows = (time = { h: 0, m: 0, s: 0, ms: 0 }) => {
  // formula 360/60*{current h | m | s}
  const formulas = { mins: 360 / 60, hours: 360 / 12 }
  arrows.h.style.transform = `rotateZ(${formulas.hours * (time.h + time.m / 60)}deg)`
  arrows.m.style.transform = `rotateZ(${formulas.mins * (time.m + (time.s / 60))}deg)`
  arrows.s.style.transform = `rotateZ(${formulas.mins * (time.s + (time.ms / 1000))}deg)`
}
const resetArrowsRotation = () => {
  arrows.h.style.transform = `rotateZ(0deg)`
  arrows.m.style.transform = `rotateZ(0deg)`
  arrows.s.style.transform = `rotateZ(0deg)`
}

const prepareIndicators = () => {
  for (let i = 0; i < 12; i++) {
    const line = document.createElement('div')
    line.classList.value = 'line'
    line.id = `h-${i}`
    line.style = `--h-position: ${i}`
    hoursIndicatorWrapper.appendChild(line)
  }
  for (let i = 0; i < 60; i++) {
    const line = document.createElement('div')
    line.classList.value = 'line'
    line.id = `m-${i}`
    line.style = `--m-position: ${i}`
    minsIndicatorWrapper.appendChild(line)
  }
}

const toggleControlMenu = (e) => {
  if (!e) return
  const container = document.querySelector(`.controls .menus #${e.id}.container`)
  container.classList.toggle('open')
}

const toggleFocus = () => {
  focusButton.classList.toggle('enabled')
  arrows.h.classList.toggle('hidden')
  isFocusModeEnabled = focusButton.classList.contains('enabled')
  focusButton.querySelector('p').textContent = isFocusModeEnabled ? 'pause' : 'focus'

  const focusMode = (timer = { h: 0, m: 0, s: 0, ms: 0 }) => {
    if (!isFocusModeEnabled) return
    if (timer.m >= times.focus) return
    if (timer.s > 59) {
      timer.m + 1;
      timer.s = 0
    }
    timer.s += 1
    rotateArrows(timer)

    setTimeout(() => focusMode(timer), 1000)
  }
  if (isFocusModeEnabled) {
    highlightIndicators()
    focusMode()
  }
  else {
    resetHighlightedIndicators()
    getLocalTime()
  }
}


const highlightIndicators = () => {
  resetHighlightedIndicators()
  for (let i = 0; i <= times.focus; i++) {
    const line = document.getElementById(`h-${i / 5}`)
    if (!line) continue
    if (line.classList.contains('selected')) continue
    line.classList.add('selected')
  }
  for (let i = 0; i <= times.focus; i++) {
    const line = document.getElementById(`m-${i}`)
    if (!line) continue
    if (line.classList.contains('selected')) continue
    line.classList.add('selected')
  }

}

const resetHighlightedIndicators = () => {
  const hlines = hoursIndicatorWrapper.querySelectorAll('.line')
  const mlines = minsIndicatorWrapper.querySelectorAll('.line')
  hlines.forEach((line) => {
    if (line.classList.contains('selected'))
      line.classList.remove('selected')
  })
  mlines.forEach((line) => {
    if (
      line.classList.contains('selected'))
      line.classList.remove('selected')
  })
}



const enableCheckbox = (e) => {
  if (!e) return
  const checkbox = document.querySelector(`.rows .row #${e.id}.checkbox`)
  checkbox.classList.toggle('enabled')
  const state = checkbox.classList.contains('enabled')
  if (checkbox.classList.contains('lines')) {
    const linesContainer = document.querySelector(`.clock .${e.id}`)
    linesContainer.classList.value = `${e.id} ${state ? "enabled" : ''}`
  }
}

const increaseTime = (e) => {
  if (!e.id) return
  const time = document.querySelector(`.select #${e.id}.indicator p`)
  switch (e.id) {
    case 'focus-time':
      if (times.focus >= 60) break;
      times.focus += 5
      if (isFocusModeEnabled || isBreakModeEnabled) highlightIndicators()
      time.textContent = `${times.focus}mins`
      break;
    case 'break-time':
      if (times.break >= 60) break;
      times.break += 5
      time.textContent = `${times.break}mins`
      break;

    default:
      break;
  }
}

const decreaseTime = (e) => {
  if (!e.id) return
  const time = document.querySelector(`.select #${e.id}.indicator p`)
  switch (e.id) {
    case 'focus-time':
      if (times.focus <= 5) break;
      times.focus -= 5
      if (isFocusModeEnabled || isBreakModeEnabled) highlightIndicators()
      time.textContent = `${times.focus}mins`
      break;
    case 'break-time':
      if (times.break <= 5) break;
      times.break -= 5
      time.textContent = `${times.break}mins`
      break;

    default:
      break;
  }
}
