"use strict";

function valueOf(param, defaultValue) {
    return (param === undefined) ? defaultValue : param;
}

function useAppDynamics(services, params) {

    var enabled = false;
    for(var i = 0; i < services.length; i++) {
        var service = services[i];
        if (service.name && service.name.indexOf("appdynamics")) {
            enabled = true;
            break;
        }
    }

    if (enabled) {
        var options = {
            debug:                valueOf(params.APPDYNAMICS_DEBUG,                  false),
            controllerPort:       valueOf(params.APPDYNAMICS_CONTROLLER_PORT,        443),
            controllerSslEnabled: valueOf(params.APPDYNAMICS_CONTROLLER_SSL_ENABLED, true)
        };

        require("appdynamics").profile(options);
    }
}

function useNewRelic(services, params) {

    if (params.ENABLE_NEWRELIC_MONITORING === "true") {
        require("newrelic");
    }
}

try {

    var params = process.env;
    if (params.MONITORING_ENABLED === "false" || params.MONITORING_DISABLED === "true") {
        console.warn("Application monitoring is DISABLED.");
        return;
    }

    var vcap = JSON.parse(params.VCAP_SERVICES);
    if (!vcap) {
        console.warn("VCAP_SERVICES unavailable. Application monitoring will be DISABLED.");
        return;
    }

    var services = vcap["user-provided"];
    if (!services) {
        console.warn("No 'user-provided' services in VCAP_SERVICES available. Application monitoring will be DISABLED.");
        return;
    }
    
    useAppDynamics(services, params);
    useNewRelic(services, params);
}
catch(error) {
    console.error("Error occurred while enabling application monitoring.");
    console.error("Error: " + JSON.stringify(e));
}
