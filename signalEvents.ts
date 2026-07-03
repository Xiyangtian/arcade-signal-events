/**
 * 自定义信号事件
 */
//% color="#0497b4" icon="\uf0a1" block="信号事件"
namespace signalEvents {
    let nextSource = 10000

    interface EventInfo {
        source: number
        value: number
    }

    const events: { [name: string]: EventInfo } = {}
    const numberHandlers: { [name: string]: ((n: number) => void)[] } = {}
    const numberPending: { [name: string]: number[] } = {}

    function getOrCreateEvent(name: string): EventInfo {
        if (!events[name]) {
            events[name] = {
                source: nextSource,
                value: 1
            }
            nextSource++
        }
        return events[name]
    }

    /**
     * 信号名输入框（自动补全）
     */
    //% block="$name"
    //% blockId=eventNameShadow
    //% blockHidden=true shim=TD_ID
    //% name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //% name.fieldOptions.key="signalevent"
    export function _eventNameShadow(name: string) {
        return name
    }

    /**
     * 带数字参数的信号名输入框（自动补全）
     */
    //% block="$name"
    //% blockId=numberEventNameShadow
    //% blockHidden=true shim=TD_ID
    //% name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //% name.fieldOptions.key="signalnumberevent"
    export function _numberEventNameShadow(name: string) {
        return name
    }

    /**
     * 当收到指定信号时执行
     */
    //% blockId=signalListenEvent
    //% block="当接收 $name 信号时"
    //% weight=30
    //% name.shadow="eventNameShadow"
    export function listenEvent(name: string, handler: () => void) {
        const info = getOrCreateEvent(name)
        control.onEvent(info.source, info.value, handler)
    }

    /**
     * 发送一个无参数信号
     */
    //% blockId=signalRaiseEvent
    //% block="发出 $name 信号"
    //% weight=40
    //% name.shadow="eventNameShadow"
    export function raiseEvent(name: string) {
        const info = getOrCreateEvent(name)
        control.raiseEvent(info.source, info.value)
    }

    /**
     * 当收到指定带数字参数的信号时执行
     */
    //% blockId=signalListenNumberEvent
    //% block="当接收 $name 信号时，参数："
    //% weight=10
    //% name.shadow="numberEventNameShadow"
    //% draggableParameters="reporter"
    export function listenNumberEvent(name: string, handler: (n: number) => void) {
        const info = getOrCreateEvent(name)
        if (!numberHandlers[name]) {
            numberHandlers[name] = []
            control.onEvent(info.source, info.value, () => {
                const queue = numberPending[name]
                const n = queue ? queue.shift() : undefined
                if (n !== undefined) {
                    for (const h of numberHandlers[name]) {
                        h(n)
                    }
                }
            })
        }
        numberHandlers[name].push(handler)
    }

    /**
     * 发送一个带数字参数的信号
     */
    //% blockId=signalRaiseNumberEvent
    //% block="发出 $name 信号，参数为 $n"
    //% weight=20
    //% name.shadow="numberEventNameShadow"
    export function raiseNumberEvent(name: string, n: number) {
        const info = getOrCreateEvent(name)
        const handlers = numberHandlers[name]
        if (handlers && handlers.length > 0) {
            if (!numberPending[name]) numberPending[name] = []
            for (let i = 0; i < handlers.length; i++) {
                numberPending[name].push(n)
            }
            control.raiseEvent(info.source, info.value)
        }
    }
}
