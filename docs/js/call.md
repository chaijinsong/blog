# call

### quickStart
> 简介：Function.prototype.call()使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数，函数中的this指向call函数的第一个参数

```js
function Product(name, price) {
    this.name = name
    this.price = price
}
function Food(name, price) {
    Product.call(this, name, price)
    this.category = 'food'
}
console.log(new Food('cheese', 5).name)
```

### 实现一个call

我们先从一个简单的例子解析call
```js
var name = '张三'
var obj = {
    name: '李四'
}
function fn() {
    console.log(this.name)
}
fn() // '张三'
fn.call(obj) // '李四'
```
在这个例子中，call主要做了两件事
* 修改了`this`指向，比如`fn()`默认指向`window`，所以输出`张三`
* 执行了 `fn` 函数

#### 第一步：改变this指向，并执行函数
先说第一步改变this怎么实现，其实很简单，只要将方法fn添加成对象obj的属性不就好了
```js
Function.prototype._call = function(obj) {
    obj.fn = this // 这里的this就是函数自身
    var res = obj.fn() // 执行函数
    delete obj.fn // 删除fn属性，避免给obj添加上多余属性
    return res
}
fn.call_(obj); // 李四
```
解释一下我们实现的`_call`做了哪些事情
* 通过 `Function.prototype._call` 给函数的原型上添加了`_call`方法，让每个函数都能直接访问`_call`函数
* `fn._call()`执行时，`_call`内部的`this`指向的是`fn`，这里的`obj.fn = this` 就是将`fn`赋值成了`obj`上的一个属性
* `obj`拥有了`fn`这个方法，执行`obj.fn()`，利用了`this`的隐式绑定，所以`fn`内部的`this`指向`obj`
* 最后通过`delete`删除了`obj`上的`fn`方法，毕竟执行完不删除会导致obj上新增一个无用属性

#### 第二步：传参
第一步我们成功改变了this并且调用了方法，但是没法接受参数，所以此时我们自然能想到用 `arguments` 去获取参数
```js
Function.prototype._call = function(obj) {
    var args = []
    for (let i = 1; i < arguments.length; i++) {
        args.push(arguments[i])
    }
    obj.fn = this
    var res = obj.fn(...args)
    delete obj.fn
    return res
}
```
上面这串代码把参数提取出来，然后用拓展运算符把参数都传给了`fn`，但是问题在于拓展运算符是比较新的特性，既然都要手动实现`call`函数了，拓展运算符这种新特性肯定不能用了，有没有其他方案能达到类似效果呢？此时想到了 `eval`
```js
var name = '张三';
var obj = {
    name: '李四'
};

function fn(a, b, c) {
    console.log(a + b + c + this.name);
};

Function.prototype._call = function(obj) {
    var args = []
    for (let i = 1; i < arguments.length; i++) {
        args.push(arguments[i])
    }
    obj.fn = this
    var res = eval("obj.fn(" + args + ")")
    delete obj.fn
    return res
}
fn._call(obj, '我的', '名字', '是')
```
乍一看感觉没问题，但是如果真正执行会报错 `Uncaught ReferenceError: 我的 is not defined`，因为我们传的三个参数都是字符串，最终eval执行的是`eval("obj.fn(我的,名字,是)");` ，把 '我的' 作为了一个变量去读取，就报错了。所以这里需要优化，既然我们需要用`eval`执行，`eval`中将字符串作为变量去读取。那么我们在拼接eval参数时，就直接拼 "arguments[1]" 即可，`eval`执行时自动去取`arguments`数据，修改后代码如下
```js
var name = '张三';
var obj = {
    name: '李四'
};

function fn(a, b, c) {
    console.log(a + b + c + this.name);
};

Function.prototype._call = function(obj) {
    var args = []
    for (let i = 1; i < arguments.length; i++) {
        args.push("arguments[" + i + "]")
    }
    obj.fn = this
    var res = eval("obj.fn(" + args + ")")
    delete obj.fn
    return res
}
fn._call(obj, '我的', '名字', '是')
```
#### 第三步：特殊情况
上面两步基本实现了`call`函数的修改`this`指向和支持传参的功能，但是有两点还没考虑完全
1. 如果传入的第一个参数是一个基础数据类型，需要转成对应的包装类型
2. 目前给设置的属性名是固定的`fn`，但是如果传入的`obj`自身就有`fn`属性，那么调用`_call`时会将其覆盖
```js
var name = '张三';
var obj = {
    name: '李四'
};

function fn(a, b, c) {
    console.log(a + b + c + this.name);
};

Function.prototype._call = function(obj) {
    if (typeof obj === 'string') {
        obj = String(obj)
    } else if (typeof obj === 'number') {
        obj = Number(obj)
    } else if (typeof obj === 'boolean') {
        obj = Boolean(obj)
    }

    obj = obj ? obj : window || global; // 如果传入的null或者undefined，则obj为window或global

    var args = []
    for (let i = 1; i < arguments.length; i++) {
        args.push("arguments[" + i + "]")
    }
    let randomFn = 'fn' + new Date().getTime()
    obj[randomFn] = this
    
    var res = eval("obj[randomFn](" + args + ")")
    delete obj[randomFn]
    return res
}
fn._call(obj, '我的', '名字', '是')
```
至此call函数的实现就完成了




















