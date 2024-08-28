#!/bin/bash

apps=(
    npamapp
)

apps_len=${#apps[@]}

for i in "${!apps[@]}"; do
  app=${apps[$i]}
  idx=$(($i + 1))
  echo "----------------------------------------------------"
  echo "Installing ${app} - ${idx} of ${apps_len}"
  echo "----------------------------------------------------"
  cd ${app}
  cdt2 package install --autofill
  cd ..
done