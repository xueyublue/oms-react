// root url
export const ROUTE_ROOT = `/oms`;
// dashboard
export const ROUTE_DASHBORAD = `${ROUTE_ROOT}/dashboard`;
// instance
export const ROUTE_INSTANCE_DETAILS = `${ROUTE_ROOT}/instance/details`;
export const ROUTE_INSTANCE_SGA = `${ROUTE_ROOT}/instance/sga`;
export const ROUTE_INSTANCE_PARAMETERS = `${ROUTE_ROOT}/instance/parameters`;
export const ROUTE_INSTANCE_RESOURCE_LIMIT = `${ROUTE_ROOT}/instance/resource-limit`;
// performance
export const ROUTE_PERFORMANCE_SESSION = `${ROUTE_ROOT}/performance/session`;
export const ROUTE_PERFORMANCE_HOST = `${ROUTE_ROOT}/performance/host`;
// space
export const ROUTE_SPACE_TABLESPACE = `${ROUTE_ROOT}/space/tablespace`;
export const ROUTE_SPACE_TOP_TABLES = `${ROUTE_ROOT}/space/top-tables`;
export const ROUTE_SPACE_TOP_INDEXES = `${ROUTE_ROOT}/space/top-indexes`;
export const ROUTE_SPACE_TABLE_RECORDS = `${ROUTE_ROOT}/space/table-records`;
// user
export const ROUTE_USER_PROFILES = `${ROUTE_ROOT}/user/profiles`;
export const ROUTE_USER_ROLES = `${ROUTE_ROOT}/user/roles`;
export const ROUTE_USER_ROLE_PRIVILEGES = `${ROUTE_ROOT}/user/role-privileges`;
export const ROUTE_USER_USERS = `${ROUTE_ROOT}/user/users`;
export const ROUTE_USER_USER_PRIVILEGES = `${ROUTE_ROOT}/user/user-privileges`;
// system
export const ROUTE_SYSTEM_WORKBENCH = `${ROUTE_ROOT}/system/sql-workbench`;
export const ROUTE_SYSTEM_SETTINGS = `${ROUTE_ROOT}/system/settings`;
export const ROUTE_SYSTEM_ABOUT = `${ROUTE_ROOT}/system/about`;
// others
export const ROUTE_PROFILE = `${ROUTE_ROOT}/profile`;
export const ROUTE_LOGIN = `${ROUTE_ROOT}/login`;
export const ROUTE_NOT_FOUND = `${ROUTE_ROOT}/not-found`;
// route to page name
export const RouteToPageName = (route) => {
  if (!route) return "";
  else if (route === ROUTE_DASHBORAD) return "Dashboard";
  else if (route === ROUTE_INSTANCE_DETAILS) return "Instance Details";
  else if (route === ROUTE_INSTANCE_SGA) return "System Global Area";
  else if (route === ROUTE_INSTANCE_PARAMETERS) return "Instance Parameters";
  else if (route === ROUTE_INSTANCE_RESOURCE_LIMIT) return "Resource Limit";
  else if (route === ROUTE_PERFORMANCE_SESSION) return "Session";
  else if (route === ROUTE_PERFORMANCE_HOST) return "Host Resource";
  else if (route === ROUTE_SPACE_TABLESPACE) return "Tablespace";
  else if (route === ROUTE_SPACE_TOP_TABLES) return "Top Tables";
  else if (route === ROUTE_SPACE_TOP_INDEXES) return "Top Indexes";
  else if (route === ROUTE_SPACE_TABLE_RECORDS) return "Table Records";
  else if (route === ROUTE_USER_PROFILES) return "Profiles";
  else if (route === ROUTE_USER_ROLES) return "Roles";
  else if (route === ROUTE_USER_ROLE_PRIVILEGES) return "Role Privileges";
  else if (route === ROUTE_USER_USERS) return "Users";
  else if (route === ROUTE_USER_USER_PRIVILEGES) return "User Privileges";
  else if (route === ROUTE_SYSTEM_WORKBENCH) return "SQL Workbench";
  else if (route === ROUTE_SYSTEM_SETTINGS) return "Settings";
  else if (route === ROUTE_SYSTEM_ABOUT) return "About";
  else if (route === ROUTE_PROFILE) return "Profile";
  return "";
};

//! API fetch wait time, this is used to display load indicator for better user experience.
export const API_FETCH_WAIT = 500;
