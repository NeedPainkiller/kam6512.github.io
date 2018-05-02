import footerHTML from 'raw-loader!./footer.html'
import preStyles from 'raw-loader!./src/style/prestyles.css'
import styleText from 'raw-loader!./src/style/styles.css'

import 'classlist-polyfill'
import Promise from 'bluebird'

import writeChar from './src/lib/writeChar'
let style
let styleEl

let paused = false

document.addEventListener('DOMContentLoaded', function () {
    initializeElements()
    startAnimation()
})

function initializeElements() {
    appendFooter(document.getElementById('footer'))
    applyPreStyle(document.createElement('style'))

    style = document.getElementById('style-tag')
    styleEl = document.getElementById('style-text')

    createStyleEvent(styleEl)
    createPauseEvent(document.getElementById('pause-resume'))
}

function appendFooter(footer) {
    footer.innerHTML = footerHTML
}

function applyPreStyle(preStyleEl) {
    preStyleEl.textContent = preStyles
    document.head.insertBefore(preStyleEl, document.getElementsByTagName('style')[0])
}

function createStyleEvent(styleEl) {
    styleEl.addEventListener('input', function () {
        style.textContent = styleEl.textContent
    })
}

function createPauseEvent(pauseEl) {
    pauseEl.addEventListener('click', function (e) {
        e.preventDefault()
        if (paused) {
            pauseEl.textContent = 'Pause ||'
            paused = false
        } else {
            pauseEl.textContent = 'Resume ->'
            paused = true
        }
    })
}

async function startAnimation() {
    await writeTo(styleEl, styleText, true)
}

async function writeTo(el, message, mirrorToStyle) {

    const speed = (window.location.hostname === 'localhost') ? 20 : 20
    const endOfSentence = /[\.\?\!]\s$/
    const comma = /\D[\,]\s$/
    const endOfBlock = /[^\/]\n\n$/

    let len = message.length
    let index = 0
    while (index < len) {
        let chars = message.charAt(index)
        if (mirrorToStyle) {
            writeChar(el, chars, style)
        } else {
            el.innerHTML += chars
        }
        let thisInterval = speed
        let thisSlice = message.slice(index - 2, index + 1)
        if (comma.test(thisSlice)) thisInterval = speed * 30
        if (endOfBlock.test(thisSlice)) thisInterval = speed * 50
        if (endOfSentence.test(thisSlice)) thisInterval = speed * 70

        do {
            await Promise.delay(thisInterval)
        } while (paused)
        el.scrollTop = el.scrollHeight
        index++
    }
}
