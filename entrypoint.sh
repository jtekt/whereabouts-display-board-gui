#!/bin/sh

ROOT_DIR=/app

# Replace env vars in files served by NGINX
echo "Replacing environment variables"
for file in $ROOT_DIR/js/*.js* $ROOT_DIR/index.html $ROOT_DIR/precache-manifest*.js;
do
  echo "Processing $file ...";

  # Authentication
  ## API (Back end)
  sed -i 's|CONV_VUE_APP_AUTHENTICATION_URL|'${VUE_APP_AUTHENTICATION_API_URL}'|g' $file
  sed -i 's|CONV_VUE_APP_AUTHENTICATION_API_URL|'${VUE_APP_AUTHENTICATION_API_URL}'|g' $file
  sed -i 's|CONV_VUE_APP_AUTHENTICATION_MANAGER_URL|'${VUE_APP_AUTHENTICATION_API_URL}'|g' $file
  sed -i 's|CONV_VUE_APP_AUTHENTICATION_MANAGER_API_URL|'${VUE_APP_AUTHENTICATION_API_URL}'|g' $file

  ## Authentication hintHint (Does not work)
  sed -i 's|CONV_VUE_APP_AUTHENTICATION_HINT|'${VUE_APP_AUTHENTICATION_HINT}'|g' $file
  sed -i 's|CONV_VUE_APP_AUTHENTICATION_MANAGER_HINT|'${VUE_APP_AUTHENTICATION_MANAGER_HINT}'|g' $file

  # Employee manager
  sed -i 's|CONV_VUE_APP_EMPLOYEE_MANAGER_URL|'${VUE_APP_EMPLOYEE_MANAGER_URL}'|g' $file
  sed -i 's|CONV_VUE_APP_EMPLOYEE_MANAGER_API_URL|'${VUE_APP_EMPLOYEE_MANAGER_URL}'|g' $file
  sed -i 's|CONV_VUE_APP_EMPLOYEE_MANAGER_FRONT_URL|'${VUE_APP_EMPLOYEE_MANAGER_FRONT_URL}'|g' $file

  # Group manager
  sed -i 's|CONV_VUE_APP_GROUP_MANAGER_API_URL|'${VUE_APP_GROUP_MANAGER_API_URL}'|g' $file
  sed -i 's|CONV_VUE_APP_GROUP_MANAGER_FRONT_URL|'${VUE_APP_GROUP_MANAGER_FRONT_URL}'|g' $file

  sed -i 's|CONV_VUE_APP_WHEREABOUTS_API_URL|'${VUE_APP_WHEREABOUTS_API_URL}'|g' $file


done

echo "Starting Nginx"
nginx -g 'daemon off;'
