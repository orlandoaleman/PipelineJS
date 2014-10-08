


function ejecutarFuncion(opcionesFuncion) {
    if(opcionesFuncion && opcionesFuncion["funcion"] && opcionesFuncion.funcion != null){
        if(opcionesFuncion["objeto"] && opcionesFuncion.objeto != null){
            var fn = opcionesFuncion.objeto[opcionesFuncion.funcion];
            if(fn != undefined){
                return fn.apply(opcionesFuncion.objeto, opcionesFuncion["arguments"]);
            }
        } else {
            if(isFunction(opcionesFuncion.funcion)){
                return opcionesFuncion.funcion.apply(null, opcionesFuncion["arguments"]);
            }
        }
    }
    return null;
}




/** Permite crear un objeto de opciones basado en otro. Este objeto es el que le pasa a ejecutarFuncion() */
function addArgumentsToCallbackObject(argumentsAnadir, callbackObject, porDelante)
{
    if (typeof porDelante == 'undefined') {
        porDelante = false;
    }

    var argumentsCopy;
    if(callbackObject["arguments"] === undefined) {
        argumentsCopy = [];
    }
    else {
        // Clono el array
        argumentsCopy = callbackObject.arguments.slice(0);
    }

    var argumentsFinal;
    if (porDelante) {
        argumentsFinal = argumentsAnadir.concat(argumentsCopy);
    } else {
        argumentsFinal = argumentsCopy.concat(argumentsAnadir);
    }


    var nuevoCallbackObject = {};
    for(var i in callbackObject) {
        nuevoCallbackObject[i] = callbackObject[i];
    }
    nuevoCallbackObject["arguments"] = argumentsFinal;


    return nuevoCallbackObject;
}


function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
