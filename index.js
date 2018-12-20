"use strict";

function valueOf(param, defaultValue) {
    return (param === undefined) ? defaultValue : param;
}

var params = process.env;

if ((valueOf(params.MONITORING_ENABLED, "true") !== "true") ||
    (valueOf(params.APPDYNAMICS_ENABLED, "true") !== "true")) {
    console.warn("Application monitoring is DISABLED.");
    return;
}
else if(!params.APPDYNAMICS_AGENT_APPLICATION_NAME) {
    console.error("Application monitoring is DISABLED because application name not set.");
    return;
}

try {
    var options = {
        debug:                valueOf(params.APPDYNAMICS_DEBUG,                  false),
        controllerPort:       valueOf(params.APPDYNAMICS_CONTROLLER_PORT,        443),
        controllerSslEnabled: valueOf(params.APPDYNAMICS_CONTROLLER_SSL_ENABLED, true),
        nodeName:             valueOf(params.APPDYNAMICS_AGENT_NODE_NAME,        "process")
    };

    if (!options.debug) {
        options.debug = valueOf(params.MONITORING_DEBUG, false);
    }
    
    require("appdynamics").profile(options);
}
catch(e) {
    console.error("Unable to enable application monitoring.");
    console.error("Error: " + JSON.stringify(e));
}
