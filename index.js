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
        nodeName:             valueOf(params.APPDYNAMICS_AGENT_NODE_NAME,        "process"),
        analytics: {}
    };

    if (!options.debug) {
        options.debug = valueOf(params.MONITORING_DEBUG, false);
    }

    if (params.APPD_ANALYTICS_AGENT_HOST) {
        options.analytics = {
            host: valueOf(params.APPD_ANALYTICS_AGENT_HOST, null),
            port: valueOf(params.APPD_ANALYTICS_AGENT_PORT ? parseInt(params.APPD_ANALYTICS_AGENT_PORT) : 443),
            ssl: valueOf(params.APPD_ANALYTICS_AGENT_SSL_ENABLED, false)
        }
    }

    //for backwards compatibility:
    //if APPD tier name env is present then set it else don't do anything
    if (params.APPD_AGENT_TIER_NAME) {
        options.tierName = valueOf(params.APPD_AGENT_TIER_NAME, null);
    }
    
    require("appdynamics").profile(options);
}
catch(e) {
    console.error("Unable to enable application monitoring.");
    console.error("Error: " + JSON.stringify(e));
}
