import './reset.scss'
import './style.scss'

type Data = {
    bill: number
    people: number
    tip: number
}

function main() {
    handleFormChanges()
    handleTipChanges()
}

document.addEventListener('DOMContentLoaded', main)

function handleFormChanges() {
    const formEl = document.querySelector('.form')

    if (!(formEl instanceof HTMLFormElement)) return

    formEl.addEventListener('change', () => {
        const formData = new FormData(formEl)

        const newData = {
            bill: formData.get('bill'),
            people: formData.get('people'),
            tip: formData.get('tip'),
        }

        if (newData.bill && newData.people && newData.tip) {
            formEl.requestSubmit()
        }
    })

    formEl.addEventListener('reset', () => {
        const tipAmountPerPersonEl = document.querySelector(
            '#tip-amount-per-person',
        )
        const totalAmountPerPersonEl = document.querySelector(
            '#total-amount-per-person',
        )

        tipAmountPerPersonEl.textContent = `$0.00`
        totalAmountPerPersonEl.textContent = `$0.00`
    })

    formEl.addEventListener('submit', event => {
        event.preventDefault()

        const formData = new FormData(formEl)

        const newData = {
            bill: formData.get('bill'),
            people: formData.get('people'),
            tip: formData.get('tip'),
        }

        const normalizedData = {
            bill: +newData.bill || 0,
            people: +newData.people || 0,
            tip: +newData.tip || 0,
        }

        const tipAmountPerPersonEl = document.querySelector(
            '#tip-amount-per-person',
        )
        const totalAmountPerPersonEl = document.querySelector(
            '#total-amount-per-person',
        )

        if (isDataValid(normalizedData)) {
            if (!(tipAmountPerPersonEl instanceof HTMLElement)) return
            if (!(totalAmountPerPersonEl instanceof HTMLElement)) return

            tipAmountPerPersonEl.textContent = `$${computeTipAmountPerPerson(normalizedData).toFixed(2)}`
            totalAmountPerPersonEl.textContent = `$${computeTotalAmountPerPerson(normalizedData).toFixed(2)}`
        } else {
            tipAmountPerPersonEl.textContent = `$0.00`
            totalAmountPerPersonEl.textContent = `$0.00`
        }
    })
}

function handleTipChanges() {
    const customTipInputEl = document.querySelector('#custom-tip-input')
    const tipGroupEl = document.querySelector('#tip-group')
    const customTipRadioEl = document.querySelector('#custom-tip-radio')

    if (!(tipGroupEl instanceof HTMLElement)) return
    if (!(customTipInputEl instanceof HTMLInputElement)) return
    if (!(customTipRadioEl instanceof HTMLInputElement)) return

    customTipInputEl.addEventListener('change', () => {
        const value = customTipInputEl.value

        if (!value) return

        customTipRadioEl.value = `${+value}`
        customTipRadioEl.checked = true
    })

    customTipInputEl.addEventListener('blur', () => {
        const value = customTipInputEl.value

        if (!value) return

        customTipRadioEl.value = `${+value}`
    })

    tipGroupEl.addEventListener('click', event => {
        const el = event.target as HTMLElement

        if (!(el instanceof HTMLInputElement)) {
            return
        }
        if (el.type !== 'radio') {
            return
        }

        customTipInputEl.value = ''
    })
}

function computeTipAmount({ bill, tip }: Pick<Data, 'bill' | 'tip'>) {
    return bill * (tip / 100)
}

function computeTipAmountPerPerson({ bill, tip, people }: Data) {
    const tipAmount = computeTipAmount({ bill, tip })

    return tipAmount / people || 0
}

function computeTotalAmountPerPerson({ bill, tip, people }: Data) {
    const tipAmount = computeTipAmount({ bill, tip })
    const totalAmount = bill + tipAmount

    return totalAmount / people || 0
}

function isDataValid(data: Data) {
    if (Number.isNaN(data.bill)) return false
    if (Number.isNaN(data.people)) return false
    if (Number.isNaN(data.tip)) return false

    return data.bill > 0 && data.people > 0 && data.tip >= 0
}
