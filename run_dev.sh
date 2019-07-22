#!/usr/bin/env bash
export PLA_API_BASEURL='http://localhost:3000'

if [ "$1" == 'remoteapi' ]; then
    export PLA_REMOTE_API_BASEURL='https://pctemp.joetsutj.com'
fi

exec yarn dev
