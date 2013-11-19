# Control

控件基类。***禁止实例化，只能继承。***

## Option

+ `id`: 控件标识，类型`String`，参数`可选`
+ `main`: 控件主元素，类型`HTMLElement`，参数`可选`
+ `skin`: 控件皮肤，类型`String`，参数`可选`
+ `...`: 更多初始化参数由各控件自身决定，参数`可选`


## Property

***注：所有实例属性禁止直接访问和操作，请使用`get`、`set`方法操作，若属性存在对应的`getter`或`setter`方法，则优先使用`getter`或`setter`***

### disabled

控件可用状态，类型`Boolean`，默认值`false`

### hidden

控件可见状态，类型`Boolean`，默认值`false`


## Method

### .initialize(options)

控件初始化

`options`: 构造函数传入的选项，类型`Object`，包含项参考[`Option`](#option)

***注：此方法尽量不要重写，必要的初始化逻辑可以使用[`init`](#init)***

### .initOptions(options)

初始化控件选项

`options`: 构造函数传入的选项，类型`Object`，包含项参考[`Option`](#option)

### .init()

控件初始化，**此方法在[`initOptions`](#initoptionsoptions)后执行**

***注：此方法需要各控件覆盖实现，默认未定义***

### .createMain()

创建控件主元素

*默认返回动态创建的`div`元素，各控件可根据需要自行重写*

### .initStructure()

初始化DOM结构，**仅在第一次渲染时调用**

***注：此方法需要各控件覆盖实现***

### .render()

渲染控件

***注：此方法禁止多次调用，如需强制重绘可调用[`repaint`](#repaintchanges)方法***

### .dispose()

销毁控件

### .appendTo(wrap)

将控件添加到页面元素中

`wrap`: 控件要添加到的目标元素，类型`HTMLElement`

### .insertBefore(reference)

将控件添加到页面的某个元素之前

`reference`: 控件要添加到之前的目标元素，类型`HTMLElement`

### .enable()

设置控件状态为启用

### .disable()

设置控件状态为禁用

### .isDisabled()

判断控件是否不可用

*不可用返回`true`，反之返回`false`*

### .setDisabled(disabled)

设置控件禁用状态

*属性`disabled`的`setter`方法*

`disabled`: 是否禁用，类型`Boolean`。禁用为`true`，反之为`false`

### .show()

设置控件状态为可见

### .hide()

设置控件状态为不可见

### .toggle()

切换控件可见状态

*当前为可见状态时则隐藏，反之则显示*

### .isHidden()

判断控件是否不可见

*当前不可见状态返回`true`，反之返回`false`*

### .setHidden(hidden)

设置控件不可见状态

*属性`hidden`的`setter`方法*

`hidden`: 是否是否不可见，类型`Boolean`。不可见为`true`，反之为`false`

### .get(name)

获取控件属性

`name`: 属性名，类型`String`

*控件属性分成 `核心属性`、`关键信息属性`、`数据信息属性`*

### .set(name, value)

设置控件属性

`name`: 属性名，类型`String`

`value`: 属性值，类型`*`

***注：若属性`name`存在`setter`方法，则由`setter`方法接管***

### .setProperties(properties)

批量设置控件的属性值

`properties`: 属性值集合，类型`Object`

### .addState(state)

添加控件状态

`state`: 状态名，类型`String`

### .removeState(state)

移除控件状态

`state`: 状态名，类型`String`

### .toggleState(state)

切换控件指定状态

`state`: 状态名，类型`String`

### .hasState(state)

判断控件是否处于指定状态

`state`: 状态名，类型`String`

### .on(event, listener)

挂载自定义事件

`event`: 事件名，类型`String`

`listener`: 监听器，类型`Function`

***此方法由[`Emitter`](https://github.com/ecomfe/saber-emitter)模块混入而来***

### .once(event, listener)

挂载只执行一次的事件

`event`: 事件名，类型`String`

`listener`: 监听器，类型`Function`

***此方法由[`Emitter`](https://github.com/ecomfe/saber-emitter)模块混入而来***

### .off([event], [listener])

注销事件与监听器

+ 任何参数都`不传`将注销当前实例的所有事件
+ 只传入`event`将注销该事件下挂载的所有监听器
+ 传入`event`与`listener`将只注销该监听器

`event`: 事件名，类型`String`，参数`可选`

`listener`: 监听器，类型`Function`，参数`可选`

***此方法由[`Emitter`](https://github.com/ecomfe/saber-emitter)模块混入而来***

### .emit(type, [...])

触发自定义事件

`type`: 事件名

`...`: 传递给监听器的参数，可以有多个

***此方法由[`Emitter`](https://github.com/ecomfe/saber-emitter)模块混入而来，进行了微调，固化了第一个参数***

**注: 每个监听器方法调用时第一个参数固化为:**

```javascript
{ `type`: 事件类型, `target`: 触发事件的控件对象 }
```

例子

```javascript
// 很多类型事件监听的场景下，可共享同一个 handler 简化代码
var handler = function( ev ) {
    var args = [].slice.call( arguments, 1 );
	console.info( 'event[%s]: ', ev.type, args );
};
var b = new Button( { content: 'test', onInit: handler } );
b.on( 'propertychange', handler);
b.render();
b.set( 'content', 'foo' );
```


### ~~.getChild(childName)~~

~~获取命名子控件~~

~~*返回查询到的子控件实例([`Control`](https://github.com/ecomfe/saber-control))，找不到返回`null`*~~

~~`childName`: 子控件名，类型`String`~~

### ~~.initChildren(wrap)~~

~~批量初始化子控件~~

~~`wrap`: 容器DOM元素，类型`HTMLElement`~~

### ~~.addChild(control, childName)~~

~~添加子控件~~

~~`control`: 控件实例，类型[`Control`](https://github.com/ecomfe/saber-control)~~

~~`childName`: 子控件名，类型`String`~~

### ~~.removeChild(control)~~

~~移除子控件~~

~~`control`: 控件实例，类型[`Control`](https://github.com/ecomfe/saber-control)~~





## Event

### beforeinit

当控件

### beforeinit

当控件初始化前触发，附带参数依次为`ev`:

`ev`: 事件信息对象

+ `type`: 事件类型名，类型`String`
+ `target`: 触发事件的控件实例对象，类型[`Control`](https://github.com/ecomfe/saber-control)

### afterinit

当控件初始化后触发，附带参数依次为`ev`:

`ev`: 事件信息对象

+ `type`: 事件类型名，类型`String`
+ `target`: 触发事件的控件实例对象，类型[`Control`](https://github.com/ecomfe/saber-control)

### init

此事件等同于[`afterinit`](#afterinit)

### beforerender

当控件首次渲染前触发，附带参数依次为`ev`:

`ev`: 事件信息对象

+ `type`: 事件类型名，类型`String`
+ `target`: 触发事件的控件实例对象，类型[`Control`](https://github.com/ecomfe/saber-control)

### afterrender

当控件首次渲染后触发，附带参数依次为`ev`:

`ev`: 事件信息对象

+ `type`: 事件类型名，类型`String`
+ `target`: 触发事件的控件实例对象，类型[`Control`](https://github.com/ecomfe/saber-control)

### beforedispose

当控件销毁前触发，附带参数依次为`ev`:

`ev`: 事件信息对象

+ `type`: 事件类型名，类型`String`
+ `target`: 触发事件的控件实例对象，类型[`Control`](https://github.com/ecomfe/saber-control)


### afterdispose

当控件销毁后触发，附带参数依次为`ev`:

`ev`: 事件信息对象

+ `type`: 事件类型名，类型`String`
+ `target`: 触发事件的控件实例对象，类型[`Control`](https://github.com/ecomfe/saber-control)

### show

当控件变为可见状态后触发，附带参数依次为`ev`:

`ev`: 事件信息对象

+ `type`: 事件类型名，类型`String`
+ `target`: 触发事件的控件实例对象，类型[`Control`](https://github.com/ecomfe/saber-control)

### hide

当控件变为不可见状态后触发，附带参数依次为`ev`:

`ev`: 事件信息对象

+ `type`: 事件类型名，类型`String`
+ `target`: 触发事件的控件实例对象，类型[`Control`](https://github.com/ecomfe/saber-control)

### enable

当控件变为可用状态后触发，附带参数依次为`ev`:

`ev`: 事件信息对象

+ `type`: 事件类型名，类型`String`
+ `target`: 触发事件的控件实例对象，类型[`Control`](https://github.com/ecomfe/saber-control)

### disable

当控件变为不可用状态后触发，附带参数依次为`ev`:

`ev`: 事件信息对象

+ `type`: 事件类型名，类型`String`
+ `target`: 触发事件的控件实例对象，类型[`Control`](https://github.com/ecomfe/saber-control)

### propertychange

当控件属性发生变化后触发，附带参数依次为`ev`、`changes`:

`ev`: 事件信息对象

+ `type`: 事件类型名，类型`String`
+ `target`: 触发事件的控件实例对象，类型[`Control`](https://github.com/ecomfe/saber-control)

`changes`: 变更过的属性的集合，类型`Object`

集合结构如下
```javascript
{
	hidden: {
		name: 'hidden',
		oldValue: false,
		newValue: true
	},
	...
}
```


===

[![Saber](https://f.cloud.github.com/assets/157338/1485433/aeb5c72a-4714-11e3-87ae-7ef8ae66e605.png)](http://ecomfe.github.io/saber/)