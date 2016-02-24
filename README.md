
# Reactive IFrames

## Responsiveness fix for &lt;iframe&gt; elements

This module consists of a pair of javascript files that allow an &lt;iframe&gt; element to communicate its height to the parent document, this allow the parent node to resize the &lt;iframe&gt; element responsively.  The content of the &lt;iframe&gt; can have a dynamic height that responds to the width set by the main window, and everything just works

## Example

for a demo, see the [Example Page](http://jcharlesworthuk.github.io/reactive.iframes/example/index.html)

## Installing from Bower


```
> bower install reactive-iframes
```


## Rebuilding the code

The plugin is written in TypeScript.  There is a gulpfile for compiling and minifying the TypeScript.  To download the gulp packages required run

```
> npm install
```

Then the TypeScript can be compiled by running the default gulp task

```
> gulp
```

## Setting up the parent

There are two javascript files in the *dist* folder that are required.  On the main (parent) page you need to reference *reactive.iframes.parent.js* or *reactive.iframes.parent.min.js*

```html
<script src="dist/reactive.iframes.parent.js"></script>
```

You can then tell the plugin to monitor the parent node of an iframe using *new reactive.iframes.Parent()*.  For example:

```html
<html>
    <head>
        <script src="dist/reactive.iframes.parent.js"></script>
    </head>
    <body>
        <!-- PARENT NODE -->
        <div id="frame-parent">
            <!-- CHILD IFRAME -->
            <iframe src="..." width="100%" marginheight="0" scrolling="no"><iframe>
        </div>
        
        <script>
            var parentNode = document.getElementById('iframe-parent');
            new reactive.iframes.Parent(parentNode, 'frame-1');
        </script>
    </body>
</html>
```
   
## Setting up the child iframes

You also need to reference the child script in the content of every &lt;iframe&gt; you want to make responsive.  The script tag for the child script needs two attributes in order to tell the child script which &lt;iframe&gt; this is (as you can have multiple child iframes on the page).  The attributes required are:

|   Attribute   | Description   |
|---------------|---------------|
| id            | Must be "iframe_child_script".  This is used so the child script can find the next attribute value... |
| data-frameid  | This is set to the ID you passed as the second argument to the Parent() call (in the example above this is 'iframe-1'   |

```html
<script id="iframe_child_script" data-frameid="frame-1" src="dist/reactive.iframes.child.js"></script>
```



