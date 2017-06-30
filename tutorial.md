# Angular2 + coffeescript.

Angular2 ha deciso di andare nella direzione di TypeScript. Ovviamente TypeScript non è nient'altro che un linguaggio che alla fine viene compilato in JavaScript.

In questa guida vedremo come usare Angular2 con un altro linguaggio: coffeescript

La guida seguirà a grandi linee il tutorial su [https://angular.io/]().

## Struttura del progetto.

Avremo una cartella principale ```myProject``` con al primo livello i file
```
index.js
index.html
package.json
```
e la cartella ```app```.

### Il file ```index.html```
Nel file principale dovremo importare i seguenti script:
```html
<script src="node_modules/angular2/bundles/angular2-polyfills.js"></script>
<script src="node_modules/rxjs/bundles/Rx.umd.js"></script>
<script src="node_modules/angular2/bundles/angular2-all.umd.js"></script>
```

e poi aggiungere il codice per bootstrappare l'app:
```html
<script>
    window.addEventListener('load', function(){
        require('./app/boot')
    })
</script>
```
il file ```./app/boot``` dovremo scriverlo noi, ma prima scriviamo la componente.

### AppComponent
In Angular2 l'oggetto root è una *componente* come tutte le altre: la chiamiamo ```appComponent``` e la definiamo dentro ```./app/app.component.coffee```.

Successivamente questa componente root è quella che verrà passata al processo di bootstrap di Angular.

La struttura di una componente, scritta in coffeescript è la seguente

```coffeescript
@AppComponent =
    Component
        selector: 'my-selector'
        templateUrl: './app/app.component.html'
        # per template particolarmente brevi
        # inline:
        template: '<h1></h1>'
        styleUrls: ['./app/app.component.css']

        #per style particolarmente brevi:
        styles: ['.class {color: blue}']

        # altri metadata possibili sono:
        directives: []
        # lista delle direttive figlie

        providers: [myService]
        # lista dei servizi che la componente usa
        # myService deve essere importato

        inputs: []
        #variabili che vengono bindate dall'esterno
        # (da un'eventuale direttiva parent)



    .Class
        constructor: (@service) ->
        # @service è uno dei servizi inclusi in providers
        # service è solo un nome,
        # la referenza viene esplicitata dopo la dichiarazione con .parameters

        method1: () ->

        method2: () ->

#annotazione dei parametri del costruttore, se presenti
@AppComponent.parameters = [myService]
```
I metodi ```Component``` e ```Class``` fanno parte del core di angular2 e vanno pertanto importanti in cima al file:
```coffeescript
{Component, Class} = require 'angular2/core'

```

### Bootstrap
il bootstrap dell'app avverrà nel file ```./app/boot.coffee```, dove semplicemente importeremo la funzione ```boostrap``` da angular, e la nostra componente top-level che abbiamo prima definito.

```coffeescript
{bootstrap} = require 'angular2/platform/browser'
{AppComponent} = require './app.component'

bootstrap AppComponent
```
Non serve nient'altro!
