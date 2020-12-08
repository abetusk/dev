JavaScript Cheat Sheet
===



`array.`
---

### `indexOf`

```
var a = ['a', 'x', 'z'];
console.log( a.indexOf('x'), a.indexOf('.') );
```

```
1 -1
```

### 

### `forEach`

```
['a','b','c'].forEach( function(ele,idx,arr) { console.log(ele,idx,arr); } );
```

```
a 0 [ 'a', 'b', 'c' ]
b 1 [ 'a', 'b', 'c' ]
c 2 [ 'a', 'b', 'c' ]
```



`let` and `var`
---

| `var` | `let` |
|---|---|
| scoped to immediate function body | scoped to immediate enclosing block |
| hoisted | unhoisted |
| global declaration attaches to global object | |
| redeclaration allowed | no redeclaration allowed |

### scope

```
function f() {
  {
    var v="v";
    let l="l";
  }
  console.log(v);
  console.log(l);
} 
f();
```

```
v
ReferenceError: l is not defined
```

### hoisting

```
function f() { console.log(u); }
function g() {
  console.log(v);
  console.log(l);
  var v = "v";
  let l = "l";
}
f();
g();
```

```
ReferenceError: u is not defined
undefined
ReferenceError: l is not defined
```

### global attachment


```
var v = "v";
let l = "l";
console.log(this.v, this.l);
```

```
v undefined
```

### redeclaration

```
function f() {
  var v = "v";
  let l = "l";
  var v = "a";
  let l = "e";
}
f();
```

```
SyntaxError: Identifier 'l' has already been declared
```

`const`
---

```
const c = "c";
```

`==` vs `===`
---

* `==` does implicit type conversion when comparing
* `===` matches only when the values are equal as our their types

```
if      (0 == '')   { console.log("0 == ''");  }
else if (0 != '')   { console.log("0 != ''");  }

if      (0 === '')  { console.log("0 === ''"); }
else if (0 !== '')  { console.log("0 !== ''"); }
```

```
0 == ''
0 !== ''
```

`??`
---

```
let a, b = "b";
let u = ( a ?? "u"),
    v = ( b ?? "v");
console.log(a,b,u,v);

```

```
undefined b u b
```

`=>`
---

```
let f = () => console.log("f()"),
    g = (u) => console.log("g(", u, ")"),
    h = ( (v,w) => { console.log("h"); console.log(v,w); } );
  
let _f = function() { console.log("_f()"); },
    _g = function(u) { console.log("_g(", u, ")"); },
    _h = function(v,w) { console.log("h"); console.log(v,w); };
 f();  g('.');  h('.', '..');
_f(); _g('.'); _h('.', '..');
```

```
f()
g( . )
h
. ..
_f()
_g( . )
h
. ..
```

todo
---

* `new`
* `function.(bind|call|apply)`
* anonymous function callback pattern
* `array.(map|slice|push|pop|fill|findIndex|indexOf)`


###### 2020-12-08
