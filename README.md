# Rework Imagesize

Uses the [Imagesize](https://npmjs.org/package/imagesize) module to read an
image's size and put that size in your CSS!

## Usage

```javascript
var rework = require('rework');
var size   = require('rework-imagesize');

var css = rework(str)
  .use(size('path/to/images/folder'))
  .toString();
```

Using the above JavaScript. This:

```css
h1 {
  background: url('myimage.png');
  imgsize: myimage.png;
  text-indent: 100%;
}
```

Would produce something like:

```css
h1 {
  background: url('myimage.png');
  text-indent: 100%;
  height: 201px;
  width: 300px;
}
```

You can also use the "properties" `imgsizew` and `imgsizeh` to get only
the `width` or `height` of the image, respectively.

## License

MIT

