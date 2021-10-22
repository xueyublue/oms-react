// root url
export const ROUTE_ROOT = `/oms`;
// dashboard
export const ROUTE_DASHBORAD = `${ROUTE_ROOT}/dashboard`;
// instance
export const ROUTE_INSTANCE_DETAILS = `${ROUTE_ROOT}/instance/details`;
export const ROUTE_INSTANCE_SGA = `${ROUTE_ROOT}/instance/sga`;
export const ROUTE_INSTANCE_BANNERS = `${ROUTE_ROOT}/instance/banners`;
export const ROUTE_INSTANCE_RESOURCE_LIMIT = `${ROUTE_ROOT}/instance/resource-limit`;
export const ROUTE_INSTANCE_PARAMETERS = `${ROUTE_ROOT}/instance/parameters`;
// performance
export const ROUTE_PERFORMANCE_SESSION = `${ROUTE_ROOT}/performance/session`;
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
// admin
export const ROUTE_ADMIN_SQL_WORKBENCH = `${ROUTE_ROOT}/admin/sql-workbench`;
// others
export const ROUTE_PROFILE = `${ROUTE_ROOT}/profile`;
export const ROUTE_SETTINGS = `${ROUTE_ROOT}/settings`;
export const ROUTE_LOGIN = `${ROUTE_ROOT}/login`;
export const ROUTE_ABOUT = `${ROUTE_ROOT}/about`;
export const ROUTE_NOT_FOUND = `${ROUTE_ROOT}/not-found`;
// route to page name
export const RouteToPageName = (route) => {
  if (!route) return "";
  else if (route === ROUTE_DASHBORAD) return "Dashboard";
  else if (route === ROUTE_INSTANCE_DETAILS) return "Instance Details";
  else if (route === ROUTE_INSTANCE_SGA) return "SGA Configuration";
  else if (route === ROUTE_INSTANCE_BANNERS) return "Banners";
  else if (route === ROUTE_INSTANCE_RESOURCE_LIMIT) return "Resource Limit";
  else if (route === ROUTE_INSTANCE_PARAMETERS) return "Instance Parameters";
  else if (route === ROUTE_PERFORMANCE_SESSION) return "Session";
  else if (route === ROUTE_SPACE_TABLESPACE) return "Tablespace";
  else if (route === ROUTE_SPACE_TOP_TABLES) return "Top Tables";
  else if (route === ROUTE_SPACE_TOP_INDEXES) return "Top Indexes";
  else if (route === ROUTE_SPACE_TABLE_RECORDS) return "Table Records";
  else if (route === ROUTE_USER_PROFILES) return "Profiles";
  else if (route === ROUTE_USER_ROLES) return "Roles";
  else if (route === ROUTE_USER_ROLE_PRIVILEGES) return "Role Privileges";
  else if (route === ROUTE_USER_USERS) return "Users";
  else if (route === ROUTE_USER_USER_PRIVILEGES) return "User Privileges";
  else if (route === ROUTE_ADMIN_SQL_WORKBENCH) return "SQL Workbench";
  else if (route === ROUTE_PROFILE) return "Profile";
  else if (route === ROUTE_SETTINGS) return "Settings";
  else if (route === ROUTE_ABOUT) return "About";
  return "";
};

//! API fetch wait time, this is used to display load indicator for better user experience.
export const API_FETCH_WAIT = 500;
