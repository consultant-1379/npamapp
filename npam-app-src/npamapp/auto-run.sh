#!/bin/bash

case $3 in
'local')
    if [ $2 ]
    then
        cdt2 serve -m server.js -p $2
    else
        cdt2 serve -m server.js
    fi
;;
*)
    if [ $3 ]
    then
        cdt2 serve -m proxyServer.js -p $2
    else
        cdt2 serve -m proxyServer.js
    fi
;;
esac
