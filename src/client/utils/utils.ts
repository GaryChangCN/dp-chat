
const fillNum = n => n < 10 ? '0' + n : n + ''

export function format(date: Date) {
    const m = date.getMonth() + 1
    const d = date.getDate()
    const h = date.getHours()
    const min = date.getMinutes()
    const s = date.getSeconds()

    return `${fillNum(m)}-${fillNum(d)} ${fillNum(h)}:${fillNum(m)}:${fillNum(s)}`
}