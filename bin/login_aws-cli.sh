#!/usr/bin/bash

CYAN='\033[1;36m'
NO_COLOR='\033[0m'
LABEL="Caller Identity"

IDENTITY=$(aws sts get-caller-identity --output json)
printf "${CYAN}==== ${LABEL} ====\n${NO_COLOR}"
echo "$IDENTITY"
