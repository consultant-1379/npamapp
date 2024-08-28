#!/usr/bin/env bash

useMockServerOption=false
helpOption=false

while test $# -gt 0; do
    case "$1" in
        -m|--mock-server)
            useMockServerOption=true
            shift
        ;;
        -h|--help)
            helpOption=true
            shift
        ;;
    esac
done

if [ "$helpOption" = true ]; then
    echo "Usage: $ start.sh [OPTIONS]"
    echo "Options: "
    echo "  -m, --mock-server   loads a local mock REST server (server.js) rather than use JBoss as a container."
    exit
else
    cd npamlibrary
    cdt2 package install
    cd ../npamcreateneaccountjob
    cdt2 package unlink npamlibrary
    cdt2 package install
    cdt2 package link ../npamlibrary
    cd ../npamdeleteneaccountjob
    cdt2 package unlink npamlibrary
    cdt2 package install
    cdt2 package link ../npamlibrary
    cd ../npamrotateneaccountjob
    cdt2 package unlink npamlibrary
    cdt2 package install
    cdt2 package link ../npamlibrary
    cd ../npamcheckneaccountconfigjob
    cdt2 package unlink npamlibrary
    cdt2 package install
    cdt2 package link ../npamlibrary
    cd ../npamjobdetails
    cdt2 package unlink npamlibrary
    cdt2 package install
    cdt2 package link ../npamlibrary
    cd ../npamjob
    cdt2 package unlink npamlibrary
    cdt2 package unlink npamjobdetails
    cdt2 package install
    cdt2 package link ../npamlibrary
    cdt2 package link ../npamjobdetails
    cd ../npamapp
    cdt2 package unlink npamlibrary
    cdt2 package unlink npamcreateneaccountjob
    cdt2 package unlink npamdeleteneaccountjob
    cdt2 package unlink npamrotateneaccountjob
    cdt2 package unlink npamcheckneaccountconfigjob
    cdt2 package unlink npamjob
    cdt2 package install
    cdt2 package link ../npamlibrary
    cdt2 package link ../npamcreateneaccountjob
    cdt2 package link ../npamdeleteneaccountjob
    cdt2 package link ../npamrotateneaccountjob
    cdt2 package link ../npamcheckneaccountconfigjob
    cdt2 package link ../npamjob

    if [ "$useMockServerOption" = true ]; then
        exec cdt2 serve -m server.js > server.log
    else
        exec cdt2 serve --proxy-config proxy-config.json -m proxyServer.js
    fi
fi
