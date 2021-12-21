# bind
### quickStart
> bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。 --[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

#### 创建绑定函数
bind() 最简单的用法是创建一个函数，不论怎么调用，这个函数都有同样的 this 值。
```js
this.x = 9;    // 在浏览器中，this 指向全局的 "window" 对象
var module = {
  x: 81,
  getX: function() { return this.x; }
};

module.getX(); // 81

var retrieveX = module.getX;
retrieveX();
// 返回 9 - 因为函数是在全局作用域中调用的

// 创建一个新函数，把 'this' 绑定到 module 对象
// 新手可能会将全局变量 x 与 module 的属性 x 混淆
var boundGetX = retrieveX.bind(module);
boundGetX(); // 81
```
#### 偏函数
偏函数，固定函数的某一个或几个参数，返回一个新的函数来接收剩下的变量参数。 <br>
偏函数看起来和函数柯里化很像，本文主要讲`bind`函数，所以在这里就先不细究，后续再出一篇文章讲两者的区别 <br>
以如下例子来说明：通过一个`mul`函数，能够衍生出`double`、`triple`等函数，能够简化我们的代码
```js
function mul(a, b) { // 定义一个两数相乘的函数
    return a * b
}

let double = mul.bind(null, 2); // 定义double函数，传入第一个参数为2
let triple = mul.bind(null, 3); // 定义triple函数，传入第一个参数为3
double(3) // mul(2, 3) = 6
double(4) // = mul(2, 4) = 8
double(5) // = mul(2, 5) = 10
```
#### 配合setTimout，setInterval等函数使用
在默认情况下，使用 `window.setTimeout()` 等定时函数时，`this` 关键字会指向 `window` （或 `global`）对象。当类的方法中需要 `this` 指向类的实例时，你可能需要显式地把 `this` 绑定到回调函数，就不会丢失该实例的引用。
```js
let obj = {
  name: '张三',
  say() {
    console.log(this.name)
  }
}
setTimeout(obj.say, 1000) // ''
setTimeout(obj.say.bind(obj), 1000) // '张三'
```
#### 作为构造函数使用的绑定函数
绑定函数自动适应于使用 `new` 操作符去构造一个由目标函数创建的新实例。当一个绑定函数是用来构建一个值的，原来提供的 `this` 就会被忽略。不过提供的参数列表仍然会插入到构造函数调用时的参数列表之前。
```js
function Point(x, y) {
    this.x = x
    this.y = y
}
Point.prototype.toString = function() {
    return this.x + ',' + this.y
}
var p = new Point(1, 2)
p.toString() // '1,2'

var YAxisPoint = Point.bind(null, 0) // Y轴坐标上的点对象
var axisPoint = new YAxisPoint(5) // 坐标为 (0,5) 的点
axisPoint.toString() // '0,5'

axisPoint instanceof Point // true
axisPoint instanceof YAxisPoint // true
```

### 实现一个bind

先从一个简单的例子解析一下bind
```js
var obj = {
  name: '张三',
  say() {
    console.log(this.name)
  }
}
obj.say() // '张三'
var relatedSay = obj.say
relatedSay() // ''

var bindSay = obj.say.bind(obj)
bindSay() // '张三'
```
在这个例子中bind做了两个事情
* 返回了一个新的函数 `bindSay`
* `bindSay`函数执行时 `this` 指向了 `obj`

#### 第一步：返回一个新函数
```js
Function.prototype._bind = function(obj) {
  let fn = this
  function F() {
    return fn()
  }
  return F
}
var obj = {
  name: '张三',
  say() {
    console.log(this.name)
  }
}
window.name = 'window'
var bindSay = obj.say._bind(obj)
bindSay() // 'window'
```
此时返回了一个新函数`bindSay`，并且能够正常调用，但此时的输出为 `window`，并非预期的 `张三`
#### 第二步：改变this指向
```js
Function.prototype._bind = function(obj) {
  let fn = this
  function F() {
    return fn.apply(obj)
  }
  return F
}
var obj = {
  name: '张三',
  say(age) {
    console.log(this.name, age)
  }
}
window.name = 'window'
var bindSay = obj.say._bind(obj)
bindSay(123) // '张三' undefined
```

#### 第三步：传参
通过第二步我们能够看到this指向改变了，`this.name`正常输出'张三'，但是外界传入的`age`字段则输出为`undefined`
所以我们需要支持bind函数传参
```js
Function.prototype._bind = function(obj) {
  var fn = this;
  var args1 = Array.prototype.slice.call(arguments, 1);
  function F() {
    const args2 = Array.prototype.slice.call(arguments, 0);
    // 即使是外界用new调用的，也需要执行最终的fn函数，只不过fn函数中的this是 new出来的实例
    return fn.apply(this instanceof F ? this : obj, args1.concat(args2))
  }
  if(fn.prototype){
    // 使用Object.create，以原函数prototype作为新对象的原型创建对象
    F.prototype = Object.create(fn.prototype);
  }
  return F;
}
// 测试
function func(name){
    console.log(this); // {a: 1}
    this.name = name;
}

func.prototype.hello = function(){
    console.log(this.name); // undefined
}

let newFunc = func._bind({a:1});
let o = new newFunc('seven')

o.hello();
```
