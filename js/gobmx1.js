/*! ** GOB.mx - Grafica Base v1.2.04 */
//  ** ultima modificacion: '07-09-2025';

function _addEvent(e, evt, handler){

  if(typeof handler !== 'function')
    return;

  if (e.addEventListener)
    e.addEventListener(evt, handler, false);
  else if (e.attachEvent)
    e.attachEvent("on" + evt, handler);
  else
  {
    var oldHandler = e["on" + evt];
  }
}
var _events = ["ready"];
var _myLib = function(item){
  function eventWorker(item, event){
    this.add = function(handler){
      _addEvent(item, event, handler);
    };
  }
  for(var i=0;i<_events.length;i++)
    this[_events[i]] = (new eventWorker(item, _events[i])).add;
};
var $gmx = function(item){
  return new _myLib(item);
};
// Custom event for ready gobmx-framework


(function(){

  // Variable de la URL que se encuentra en Gruntfile.js para obtener la URl segÃƒÂºn ambiente.
  //var root ='http://localhost:3004/';
 var root ='https://framework-gb.cdn.gob.mx/';

  var path =  root + 'assets/';
  var imagesPath = path + 'images/';
  var scriptsPath = path + 'scripts/';
  var stylesPath = path + 'styles/';
  var myVar;


  // variable para cargar ÃƒÂºnicamente el script de main donde viene header y footer
  var mainScript = [scriptsPath + 'main.js'];
  // variable para cargar ambos scripts (plugins.js trae bootstrap.js)
  var allScripts = [scriptsPath + 'plugins.js', scriptsPath + 'main.js'];

  // funciÃƒÂ³n que sirve para verificar si existe el meta tag con propiedad = gobmxhelper y content = no plugins.
  function isMetaHelper(){
    var metas = document.getElementsByTagName('meta');

    function isMeta() {
      for (var i = 0; i < metas.length; i++) {
        if ( metas[i].getAttribute('property') === 'gobmxhelper') {
          return metas[i].getAttribute('content');
        }
      }
    }
    if( isMeta() === 'no plugins') { return true; } else { return false; }
  }

  // funciÃƒÂ³n que nos ayudarÃƒÂ¡ a cargar ÃƒÂºnicamente el main.js si existe el meta gobmxhelper, de lo contrario cargar main.js y plugins.js
  function loadScriptsMeta() {
    if ( !isMetaHelper() ) {
      loadScripts(allScripts);
    } else {
      loadScripts(mainScript);
    }
  }

  // se revisa que no exista Modernizr primero para cargarlo al DOM, para despuÃƒÂ©s mandar a llamar la funcion de carga de scripts.
  if(!window.Modernizr){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptsPath + 'vendor/modernizr.js';
    document.getElementsByTagName('head')[0].appendChild(script);

    var pace = document.createElement('script');
    pace.type = 'text/javascript';
    pace.src = scriptsPath + 'vendor/pace.min.js';
    document.getElementsByTagName('head')[0].appendChild(pace);

    var analitycs = document.createElement('script');
    analitycs.type = 'text/javascript';
    analitycs.src = scriptsPath + 'vendor/analitycs.js';
    document.getElementsByTagName('head')[0].appendChild(analitycs);

    window.onload = function(){
      loadScriptsMeta();
    };

  } else {
    loadScriptsMeta();
  };

  // funciÃƒÂ³n que ayuda como callback.
  function setTime( func ) {
    myVar = setTimeout(function(){ func }, 100);
  };

  function loadScripts( scriptsArr ){
    if (!window.jQuery) {

      Modernizr.load([{
        load: '//ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js',
        complete: function () {
          if ( !window.jQuery ) {
            Modernizr.load( root + 'jquery.min.js');
          }
        }
      }, {
        load: scriptsArr
      }
      ]);
    } else {
      Modernizr.load([{
        load: scriptsArr
      }]);
    }
  }
  // 1. Busca el elemento nav en la página
  const navElement = document.querySelector('nav');

// 2. Verifica si el elemento nav existe
  if (navElement) {
    // 3. Si existe, cambia el margin del body
    document.body.style.marginTop = '0px'; // Puedes ajustar este valor a lo que necesites
  } else {
    // Opcional: Si no existe, puedes hacer algo más
    console.log('No se encontró ningún elemento <nav>.');
  }
})();
