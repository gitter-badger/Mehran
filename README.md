Mehran
======

Fast, small and lightweight selector engine following the web standards now and tomorrow. It's works allmost the same way as **JQuery** / **Sizzle** with a few exceptions.

In Sizzle you can do this:

```javascript
 // find all element with class "foo"
Sizzle(".foo"); 

```
In **Meran** you can't (*See the API section*), but if you wan't a Sizzle solution, you can do it like this:

```javascript

// find all element with class "foo"

 var Mehran = Mehran.findAll
 
console.log(Mehran('.foo'));

```

**Note!!** Work in progress!!


#API

* Mehran.find()
* Mehran.findAll()

### find

Find the first matched element by css selector

```javascript
 // first element with class "foo"
Mehran.find(".foo"); 

```

### findAll

Find all matched elements by css selector

```javascript
  
// all elements in the document

Mehran.findAll('*');        

```
