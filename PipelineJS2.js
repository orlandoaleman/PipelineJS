/**
 * Permite definir un cauce de peticiones de datos y trabajar con sus salidas en cada etapa posterior
 * NOTA: Se da por supuesto y demostrado que la ejecucion JS es siempre secuencial (y se atienden
 * los callbacks en orden)
 */

function PipelineJS2() {
    this.jobs = [];
    this.results = {};
    this.activeJobs = {};
}
PipelineJS2.prototype.ticket = 0;
PipelineJS2.prototype.jobs = null;
PipelineJS2.prototype.fired = null;
PipelineJS2.prototype.results = null;
PipelineJS2.prototype.finished = false;
PipelineJS2.prototype.callbackOK = null;
PipelineJS2.prototype.callbackError = null;
PipelineJS2.prototype.error = null; // Paso de datos implicito


/**
 * @public
 *
 * @param callbackOK {Object}
 * @param callbackError {Object}
 */
PipelineJS2.prototype.fire = function(callbackOK, callbackError) {
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

PipelineJS2.prototype.addJob = function(job, ticketPreferido) {
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
PipelineJS2.prototype.execJobs = function() {
    if (this.error) {
        console.log("Aborting!");
        var nuevoCallbackError = addArgumentsToCallbackObject([this.error], this.callbackError, true);
        ejecutarFuncion(nuevoCallbackError);
        return;
    }

    var currentJob = this.nextJob();

    if (!currentJob) {
        while(this.activeJobs.length < this.jobs.length) {
            setTimeout(function(){}, 100);
        }

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
PipelineJS2.prototype.nextJob = function() {
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
