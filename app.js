import footerHTML from 'raw-loader!./footer.html'
import preStyles from 'raw-loader!./src/style/prestyles.css'
import test from 'raw-loader!./src/style/test.css'

let styleText = [0, 1, 2, 3].map((i) => {
    return require('raw-loader!./src/style/styles' + i + '.css')
})

import 'classlist-polyfill'
import Promise from 'bluebird'

import writeChar from './src/lib/writeChar'
import getPrefix from './src/lib/getPrefix'

let style
let styleEl
let workEl
let pgpEl

let paused = false

document.addEventListener('DOMContentLoaded', function () {
    getBrowserPrefix()
    initializeElements()
    startAnimation()
})

function getBrowserPrefix() {
    styleText = styleText.map((text) => {
        return text.replace(/-webkit-/g, getPrefix())
    })
}

function initializeElements() {
    appendFooter(document.getElementById('footer'))
    applyPreStyle(document.createElement('style'))

    // El refs
    style = document.getElementById('style-tag')
    styleEl = document.getElementById('style-text')
    workEl = document.getElementById('work-text')
    pgpEl = document.getElementById('pgp-text')

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
    // Mirror user edits back to the style element.
    styleEl.addEventListener('input', function () {
        style.textContent = styleEl.textContent
    })
}

function createPauseEvent(pauseEl) {
    pauseEl.addEventListener('click', function (e) {
        e.preventDefault()
        if (paused) {
            pauseEl.textContent = 'Pause'
            paused = false
        } else {
            pauseEl.textContent = 'Resume'
            paused = true
        }
    })
}

async function startAnimation() {
    // await writeTo(styleEl, test, true)
    await writeTo(styleEl, styleText[0], true)
    /*
    await writeTo(styleEl, styleText[0], true)
    // await writeTo(workEl, workText, false)
    await writeTo(styleEl, styleText[1], true)
    // createWorkBox()
    await Promise.delay(1000)
    await writeTo(styleEl, styleText[2], true)
    // await writeTo(pgpEl, pgpText, speed, false)
    await writeTo(styleEl, styleText[3], true)
  */
}

/**
 * Helpers
 */


async function writeTo(el, message, mirrorToStyle) {

    const speed = (window.location.hostname === 'localhost') ? 0: 16
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
