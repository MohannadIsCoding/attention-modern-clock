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
const getLocalTime = () => {
  const date = new Date()
  const timeout = 1000 - date.getMilliseconds()
  const time = { h: date.getHours(), m: date.getMinutes(), s: date.getSeconds(), ms: date.getMilliseconds() }
  rotateArrows(time)
  setTimeout(getLocalTime, 0);
  // console.log(date.getHours(), date.getMinutes(), date.getSeconds());
}


const rotateArrows = (time) => {
  // formula 360/60*{current h | m | s}
  const formulas = { mins: 360 / 60, hours: 360 / 12 }
  arrows.h.style.transform = `rotateZ(${formulas.hours * (time.h + time.m / 60)}deg)`
  arrows.m.style.transform = `rotateZ(${formulas.mins * (time.m + (time.s / 60))}deg)`
  arrows.s.style.transform = `rotateZ(${formulas.mins * (time.s + (time.ms / 1000))}deg)`
}

const prepareIndicators = () => {
  for (let i = 0; i < 12; i++) {
    const line = document.createElement('div')
    line.classList.value = 'line'
    line.style = `--h-position: ${i}`
    hoursIndicatorWrapper.appendChild(line)
  }
  for (let i = 0; i < 60; i++) {
    const line = document.createElement('div')
    line.classList.value = 'line'
    line.style = `--m-position: ${i}`
    minsIndicatorWrapper.appendChild(line)
  }
}

const toggleControlMenu = () => {
  controlsContainer.classList.toggle('open')
}



const enableCheckbox = (e) => {
  if (!e) return

  const checkbox = document.querySelector(`.checkboxes .row #${e.id}.checkbox`)
  checkbox.classList.toggle('enabled')
  const state = checkbox.classList.contains('enabled')
  if (checkbox.classList.contains('lines')) {
    const linesContainer = document.querySelector(`.clock .${e.id}`)
    linesContainer.classList.value = `${e.id} ${state ? "enabled" : ''}`
  }
}