#!/bin/sh

ROOT_DIR=/app

# Replace env vars in files served by NGINX
echo "Replacing environment variables"
for file in $ROOT_DIR/js/*.js* $ROOT_DIR/index.html $ROOT_DIR/precache-manifest*.js;
do
  echo "Processing $file ...";

  # Authentication
  ## API (Back end)
  sed -i 's|VUE_APP_AUTHENTICATION_URL_PLACEHOLDER|'${VUE_APP_AUTHENTICATION_API_URL}'|g' $file
  sed -i 's|VUE_APP_AUTHENTICATION_API_URL_PLACEHOLDER|'${VUE_APP_AUTHENTICATION_API_URL}'|g' $file
  sed -i 's|VUE_APP_AUTHENTICATION_MANAGER_URL_PLACEHOLDER|'${VUE_APP_AUTHENTICATION_API_URL}'|g' $file
  sed -i 's|VUE_APP_AUTHENTICATION_MANAGER_API_URL_PLACEHOLDER|'${VUE_APP_AUTHENTICATION_API_URL}'|g' $file

  ## Authentication hintHint (Does not work)
  sed -i 's|VUE_APP_AUTHENTICATION_HINT_PLACEHOLDER|'${VUE_APP_AUTHENTICATION_HINT}'|g' $file
  sed -i 's|VUE_APP_AUTHENTICATION_MANAGER_HINT_PLACEHOLDER|'${VUE_APP_AUTHENTICATION_MANAGER_HINT}'|g' $file
  sed -i 's|VUE_APP_IDENTIFICATION_URL_PLACEHOLDER|'${VUE_APP_IDENTIFICATION_URL}'|g' $file
  sed -i 's|VUE_APP_LOGIN_URL_PLACEHOLDER|'${VUE_APP_LOGIN_URL}'|g' $file
  
  ## Cookie domain
  sed -i 's|VUE_APP_COOKIE_DOMAIN_PLACEHOLDER|'${VUE_APP_COOKIE_DOMAIN}'|g' $file


  # Employee manager
  sed -i 's|VUE_APP_EMPLOYEE_MANAGER_URL_PLACEHOLDER|'${VUE_APP_EMPLOYEE_MANAGER_URL}'|g' $file
  sed -i 's|VUE_APP_EMPLOYEE_MANAGER_API_URL_PLACEHOLDER|'${VUE_APP_EMPLOYEE_MANAGER_URL}'|g' $file
  sed -i 's|VUE_APP_EMPLOYEE_MANAGER_FRONT_URL_PLACEHOLDER|'${VUE_APP_EMPLOYEE_MANAGER_FRONT_URL}'|g' $file

  # Group manager
  sed -i 's|VUE_APP_GROUP_MANAGER_API_URL_PLACEHOLDER|'${VUE_APP_GROUP_MANAGER_API_URL}'|g' $file
  sed -i 's|VUE_APP_GROUP_MANAGER_FRONT_URL_PLACEHOLDER|'${VUE_APP_GROUP_MANAGER_FRONT_URL}'|g' $file

  # Whereabouts
  sed -i 's|VUE_APP_WHEREABOUTS_API_URL_PLACEHOLDER|'${VUE_APP_WHEREABOUTS_API_URL}'|g' $file

  # Homepage
  sed -i 's|VUE_APP_HOMEPAGE_URL_PLACEHOLDER|'${VUE_APP_HOMEPAGE_URL}'|g' $file


done

echo "Starting Nginx"
nginx -g 'daemon off;'
