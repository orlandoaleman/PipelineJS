/**
 * Permite definir un cauce de peticiones de datos y trabajar con sus salidas en cada etapa posterior
 * NOTA: Se da por supuesto y demostrado que la ejecucion JS es siempre secuencial (y se atienden
 * los callbacks en orden)
 */

function PipelineJS() {
    this.jobs = [];
    this.results = {};
    this.activeJobs = {};
}
PipelineJS.prototype.ticket = 0;
PipelineJS.prototype.jobs = null;
PipelineJS.prototype.fired = null;
PipelineJS.prototype.results = null;
PipelineJS.prototype.finished = false;
PipelineJS.prototype.callbackOK = null;
PipelineJS.prototype.callbackError = null;
PipelineJS.prototype.error = null; // Paso de datos implicito


/**
 * @public
 *
 * @param callbackOK {Object}
 * @param callbackError {Object}
 */
PipelineJS.prototype.fire = function(callbackOK, callbackError) {
    this.callbackOK = callbackOK;
    this.callbackError = callbackError;

    if (this.jobs.length === 0 || this.fired) {
        return;
    }

    this.execJobs();
};


/**
 * @public
 *
 * @param job {Object}
 * @param [job.ticket] Si se desea especificar un ticket especifico
 * @param [job.prepararEntrada] {Function} = function(resultadosActuales) {
 *                                              return resultadosPreparados;
 *                                           }
 * @param job.obtenerDatos {Function} = function(entrada, callbackOK) {
 *                                              }
 * @returns {number} ticket
 */

PipelineJS.prototype.addJob = function(job, ticketPreferido) {
    if (!job.ticket) {
        job.ticket = this.ticket++;
    }

    if (!job.prepararEntrada) {
        // Si no se especificó un "preparador" se devuelve tal la entrada
        job.prepararEntrada = function(resultadosActuales) {
            return resultadosActuales;
        }
    }
    this.jobs.push(job);

    return job.ticket;
};


/** @private */
PipelineJS.prototype.execJobs = function() {
    if (this.error) {
        console.log("Aborting!");
        var nuevoCallbackError = addArgumentsToCallbackObject([this.error], this.callbackError, true);
        ejecutarFuncion(nuevoCallbackError);
        return;
    }

    var currentJob = this.nextJob();

    if (!currentJob) {
        if (!this.finished) {
            this.finished = true;

            console.log("Finished all!");
            var nuevoCallbackOK = addArgumentsToCallbackObject([this.results], this.callbackOK, true);
            ejecutarFuncion(nuevoCallbackOK);
        }
        return;
    }

    console.log("Ready to exec #" + currentJob.ticket);
    this.activeJobs[currentJob.ticket] = true;

    var _this = this;

    var callbackOnJobFinished = function (result) {
        var i = currentJob.ticket;
        _this.results[i] = result;
        console.log("Finished #" + i);
        _this.execJobs();
    };

    var callbackOnError = function (error) {
        console.log("Error!");
        _this.error = error;
        _this.execJobs();
    };


    // Preparar entrada (se puede leer this.results)
    var entrada = currentJob.prepararEntrada(this.results);


    currentJob.obtenerDatos(entrada, callbackOnJobFinished, callbackOnError);
};



/** @private */
PipelineJS.prototype.nextJob = function() {
    for (var i in this.jobs) {
        var job = this.jobs[i];
        var ticket = job.ticket;
        if (typeof this.results[ticket] === "undefined" &&
            typeof this.activeJobs[ticket] === "undefined") {
            return job;
        }
    }
    return null;
};



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
