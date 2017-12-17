#
# StromDAO Business Object -  Autostrom
# Deployment via Makefile to automate general Quick Forward 
#

PROJECT = "StromDAO Business Object"


all: commit

commit: ;cp node_modules/stromdao-businessobject/dist/loader.js web-light/;cp -R node_modules/stromdao-businessobject/smart_contracts/* stromkonto/abi/;git add -A;git commit -a; git push;npm publish

