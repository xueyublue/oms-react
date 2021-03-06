import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import * as Constants from "../util/constants";
import Dashboard from "../pages/dashboard";
import InstanceDetails from "../pages/instance/details";
import SgaConfigurations from "../pages/instance/sga";
import ResourceLimit from "../pages/instance/resource-limit";
import Parameters from "../pages/instance/parameters";
import Sessions from "../pages/performance/session";
import Tablespace from "../pages/space/tablespace";
import TopTables from "../pages/space/top-tables";
import TopIndexes from "../pages/space/top-indexes";
import TableRecords from "../pages/space/table-records";
import Profiles from "../pages/user/profiles";
import Roles from "../pages/user/roles";
import RolePrivileges from "../pages/user/role-privileges";
import Users from "../pages/user/users";
import UserPrivileges from "../pages/user/user-privileges";
import Login from "../pages/login";
import Settings from "../pages/system/settings";
import Profile from "../pages/profile";
import NotFound from "../pages/not-found";
import SQLWorkbench from "../pages/system/sqlworkbench/sql-workbench";
import About from "./../pages/system/about";
import host from "../pages/performance/host";

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
const RouteContainer = () => {
  return (
    <Switch>
      {/* //* Dashboard */}
      <Route exact path={Constants.ROUTE_ROOT} component={Dashboard} />
      <Route exact path={`${Constants.ROUTE_ROOT}/home`} component={Dashboard} />
      <Route exact path={Constants.ROUTE_DASHBORAD} component={Dashboard} />
      {/* //* Instance */}
      <Route exact path={Constants.ROUTE_INSTANCE_DETAILS} component={InstanceDetails} />
      <Route exact path={Constants.ROUTE_INSTANCE_SGA} component={SgaConfigurations} />
      <Route exact path={Constants.ROUTE_INSTANCE_RESOURCE_LIMIT} component={ResourceLimit} />
      <Route exact path={Constants.ROUTE_INSTANCE_PARAMETERS} component={Parameters} />
      {/* //* Performance */}
      <Route exact path={Constants.ROUTE_PERFORMANCE_SESSION} component={Sessions} />
      <Route exact path={Constants.ROUTE_PERFORMANCE_HOST} component={host} />
      {/* //* Space */}
      <Route exact path={Constants.ROUTE_SPACE_TABLESPACE} component={Tablespace} />
      <Route exact path={Constants.ROUTE_SPACE_TOP_TABLES} component={TopTables} />
      <Route exact path={Constants.ROUTE_SPACE_TOP_INDEXES} component={TopIndexes} />
      <Route exact path={Constants.ROUTE_SPACE_TABLE_RECORDS} component={TableRecords} />
      {/* //* User */}
      <Route exact path={Constants.ROUTE_USER_PROFILES} component={Profiles} />
      <Route exact path={Constants.ROUTE_USER_ROLES} component={Roles} />
      <Route exact path={Constants.ROUTE_USER_ROLE_PRIVILEGES} component={RolePrivileges} />
      <Route exact path={Constants.ROUTE_USER_USERS} component={Users} />
      <Route exact path={Constants.ROUTE_USER_USER_PRIVILEGES} component={UserPrivileges} />
      {/* //* System */}
      <Route exact path={Constants.ROUTE_SYSTEM_WORKBENCH} component={SQLWorkbench} />
      <Route exact path={Constants.ROUTE_SYSTEM_SETTINGS} component={Settings} />
      <Route exact path={Constants.ROUTE_SYSTEM_ABOUT} component={About} />
      {/* //* Others */}
      <Route exact path={Constants.ROUTE_PROFILE} component={Profile} />
      <Route exact path={Constants.ROUTE_LOGIN} component={Login} />
      {/* //* Catch all other routes */}
      <Route exact path={Constants.ROUTE_NOT_FOUND} component={NotFound} />
      <Redirect to={Constants.ROUTE_NOT_FOUND} />
    </Switch>
  );
};

export default RouteContainer;
