# 行先掲示板 GUI

This is the GUI for 行先掲示板, a web application to display the whereabouts of team members.

## Environment variables

| Variable                      | Description                                                              |
| ----------------------------- | ------------------------------------------------------------------------ |
| VITE_WHEREABOUTS_API_URL      | URL of the 行先掲示板 API                                                |
| VITE_GROUP_MANAGER_API_URL    | URL of the group management API                                          |
| VITE_EMPLOYEE_MANAGER_API_URL | URL of the Employee Manager API                                          |
| VITE_LOGIN_URL                | URL for user **login**                                                   |
| VITE_AUTH_IDENTIFICATION_URL  | URL for user enrichment                                                  |
| VITE_AUTH_ENRICMENT_ID_FIELD  | The **field name** in the user identity response used as the identifier. |
| VITE_OIDC_AUTHORITY           | OIDC/Keycloak realm URL                                                  |
| VITE_OIDC_CLIENT_ID           | OIDC client ID                                                           |
