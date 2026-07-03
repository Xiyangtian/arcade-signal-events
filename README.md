 # 信号事件插件

在 MakeCode Arcade 积木里使用自定义信号事件，支持无参数事件和带数字参数的事件。

## 积木

- `当接收 [名称] 信号时` —— 注册无参数事件监听
- `发出 [名称] 信号` —— 触发无参数事件
- `当接收 [名称] 信号，参数 n 时` —— 注册带数字参数的事件监听
- `发出 [名称] 信号，参数为 [数值]` —— 触发带数字参数的事件

事件名称使用字符串，同一个名称输入一次后可以在下拉列表中选择。

## 使用示例

```blocks
signalEvents.listenEvent("玩家扣血", function () {
    game.splash("玩家扣血")
})

signalEvents.listenNumberEvent("玩家得分", function (n) {
    game.splash("玩家得分: " + n)
})

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    signalEvents.raiseEvent("玩家扣血")
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    signalEvents.raiseNumberEvent("玩家得分", 10)
})
```
