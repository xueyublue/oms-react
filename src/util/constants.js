// dashboard
export const ROUTE_DASHBORAD = "/dashboard";
// instance
export const ROUTE_INSTANCE_DETAILS = "/instance/details";
export const ROUTE_INSTANCE_SGA = "/instance/sga";
export const ROUTE_INSTANCE_BANNERS = "/instance/banners";
export const ROUTE_INSTANCE_RESOURCE_LIMIT = "/instance/resourcelimit";
export const ROUTE_INSTANCE_PARAMETERS = "/instance/parameters";
// performance
export const ROUTE_PERFORMANCE_SESSION = "/performance/session";
// space
export const ROUTE_SPACE_TABLESPACE = "/space/tablespace";
export const ROUTE_SPACE_TOP_TABLES = "/space/toptables";
export const ROUTE_SPACE_TOP_INDEXES = "/space/topindexes";
export const ROUTE_SPACE_TABLE_RECORDS = "/space/tablerecords";
// user
export const ROUTE_USER_PROFILES = "/user/profiles";
export const ROUTE_USER_ROLES = "/user/roles";
export const ROUTE_USER_ROLE_PRIVILEGES = "/user/roleprivileges";
export const ROUTE_USER_USERS = "/user/users";
export const ROUTE_USER_USER_PRIVILEGES = "/user/userprivileges";
// others
export const ROUTE_PROFILE = "/profile";
export const ROUTE_SETTINGS = "/settings";
export const ROUTE_LOGIN = "/login";

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
  else if (route === ROUTE_PROFILE) return "Profile";
  else if (route === ROUTE_SETTINGS) return "Settings";
  return "";
};
