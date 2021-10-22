// dashboard
export const ROUTE_DASHBORAD = "/oms/dashboard";
// instance
export const ROUTE_INSTANCE_DETAILS = "/oms/instance/details";
export const ROUTE_INSTANCE_SGA = "/oms/instance/sga";
export const ROUTE_INSTANCE_BANNERS = "/oms/instance/banners";
export const ROUTE_INSTANCE_RESOURCE_LIMIT = "/oms/instance/resource-limit";
export const ROUTE_INSTANCE_PARAMETERS = "/oms/instance/parameters";
// performance
export const ROUTE_PERFORMANCE_SESSION = "/oms/performance/session";
// space
export const ROUTE_SPACE_TABLESPACE = "/oms/space/tablespace";
export const ROUTE_SPACE_TOP_TABLES = "/oms/space/top-tables";
export const ROUTE_SPACE_TOP_INDEXES = "/oms/space/top-indexes";
export const ROUTE_SPACE_TABLE_RECORDS = "/oms/space/table-records";
// user
export const ROUTE_USER_PROFILES = "/oms/user/profiles";
export const ROUTE_USER_ROLES = "/oms/user/roles";
export const ROUTE_USER_ROLE_PRIVILEGES = "/oms/user/role-privileges";
export const ROUTE_USER_USERS = "/oms/user/users";
export const ROUTE_USER_USER_PRIVILEGES = "/oms/user/user-privileges";
// admin
export const ROUTE_ADMIN_SQL_WORKBENCH = "/oms/admin/sql-workbench";
// others
export const ROUTE_PROFILE = "/oms/profile";
export const ROUTE_SETTINGS = "/oms/settings";
export const ROUTE_LOGIN = "/oms/login";
export const ROUTE_ABOUT = "/oms/about";
export const ROUTE_NOT_FOUND = "/oms/not-found";
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
