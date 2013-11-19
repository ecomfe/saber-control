# helper

控件基类`Control`的helper方法模块


## Method

### .getGUID(prefix)

生成全局唯一id

`prefix`: 生成的ID前缀，类型`String`，参数`可选`

### .getId(control, part)

获取控件主元素的id

`control`: 控件实例，类型`Control`

`part`: 控件内部件名称，类型`String`，参数`可选`

### .dispose(control)

销毁控件

`control`: 控件实例，类型`Control`

### .getPartClasses(control, part)

获取控件相关的class数组，无查询结果则返回空数组`[]`

`control`: 控件实例，类型`Control`

`part`: 控件内部件名称，类型`String`，参数`可选`

### .addPartClasses(control, part, element)

添加控件相关的class

`control`: 控件实例，类型`Control`

`part`: 控件内部件名称，类型`String`，参数`可选`

`element`: 控件内部件元素，类型`HTMLElment`，参数`可选`

### .removePartClasses(control, part, element)

移除控件相关的class

`control`: 控件实例，类型`Control`

`part`: 控件内部件名称，类型`String`，参数`可选`

`element`: 控件内部件元素，类型`HTMLElment`，参数`可选`

### .getStateClasses(control, state)

获取控件状态相关的class数组，无查询结果则返回空数组`[]`

`control`: 控件实例，类型`Control`

`state`: 状态名称，类型`String`，参数`可选`

### .addStateClasses(control, state)

添加控件状态相关的class

`control`: 控件实例，类型`Control`

`state`: 状态名称，类型`String`，参数`可选`

### .removeStateClasses(control, state)

移除控件状态相关的class

`control`: 控件实例，类型`Control`

`state`: 状态名称，类型`String`，参数`可选`

### .addDOMEvent(control, element, type, handler)

为控件管理的DOM元素添加DOM事件

`control`: 控件实例，类型`Control`

`element`: 需要添加事件的DOM元素，类型`HTMLElment`

`type`: 事件的类型，类型`String`

`handler`: 事件的处理函数，类型`Function`

### .removeDOMEvent(control, element, type, handler)

为控件管理的DOM元素移除DOM事件

为控件管理的DOM元素添加DOM事件

`control`: 控件实例，类型`Control`

`element`: 需要删除事件的DOM元素，类型`HTMLElment`

`type`: 事件的类型，类型`String`

`handler`: 事件的处理函数，类型`Function`，参数`可选`。参数为空或不传入时，则移除`element`上所有`type`类型的DOM事件

### .clearDOMEvents(control, element)

清除控件管理的DOM元素上的事件

`control`: 控件实例，类型`Control`

`element`: 控件管理的DOM元素，类型`HTMLElment`




===

[![Saber](https://f.cloud.github.com/assets/157338/1485433/aeb5c72a-4714-11e3-87ae-7ef8ae66e605.png)](http://ecomfe.github.io/saber/)