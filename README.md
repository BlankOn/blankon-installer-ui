BlankOn Installer UI
====================

*First time installation*
```
$ npm -g install bower gulp
$ npm install
```

*Update installation*
```
$ bower install
```

*Building*
```
$ gulp
```

The UI is available in `dist` directory after building.

*Testing*
```
$ (cd dist;python -m SimpleHTTPServer)
```

and open http://localhost:8000 in your browser.
