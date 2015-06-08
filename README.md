# ionic-android-cab
Ionic Android Contextual Action Bar

## Dependencies
* Ionic >=1.0.0-rc.0
* lodash >=3.6.0

## Installation

Using `bower`
``` shell
$ bower install git@github.com:barteksc/ionic-android-cab.git --save
```

## Usage
Add `android-cab.js` to `index.html`
``` html
<script src="lib/ionic-android-cab/android-cab.js"></script>
```

Add module dependency to your app
``` javascript
angular.module('app', ['barteksch.cab']);
```

Inject `$androidCab` service
``` javascript
angular.controller('MyCtrl', ['$androidCab', function($androidCab){
    ...
}]);
```

CAB shows automatically when adding first element and hides after removing selected elements or clicking action.

Some (default 2) number of actions is visible on action bar as icons, others are accessible via popover as title without icons.

Check `demo/index.html` for working example.

## Options

``` javascript
{
    actions: [], // list of actions available on action bar
    color: '#757575', // some css color for action bar background
    fontColor: '#FFFFFF', // action bar font color
    counterSize: 18, // counter font size in px
    height: 44, // action bar height in px, 44px is Ionic's default
    zIndex: 9, // css z-index of action bar
    actionsOnBar: 2, // actions visible as icons on action bar
    showCounter: true, // show or hide selected items counter
    selectedProp: 'selected', // property automatically added to selected item
    onShow: function () { },
    onHide: function (items) { },
    onDestroy: function () { },
    onFirstShow: function () { }
}
```

## API
### $androidCab
`$androidCab.prepare(options)` - creates `AndroidCab` object with passed options

`$androidCab.setDefaults(options)` - sets default options for future `$androidCab.prepare(options)` calls
### AndroidCab
`.toggleItem(item)` - adds or removes item from set

`.removeItem(condition)` - removes item matching `condition`, e.g. `.removeItem({id: 4})`

`.hasItem(condition)` - checks if item matching `condition` exists in set, e.g. `.hasItem({title: 'Apple', type: 'fruit'})`

`.pushAction(action)` - adds action to `options.actions` list

`.popAction()` - removes and returns action from end of the array

`.isShown()` - checks if action bar is visible

`.show()` - manually show action bar

`.hide()` - manually hide action bar (cleans selected items as a side-effect)

## License
Licensed under the MIT License. See the LICENSE file for details.

Copyright (c) 2015 Bartosz Schiller