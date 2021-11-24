import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Select, Tag } from "antd";
import axios from "axios";
import { FcUndo } from "react-icons/fc";
import { useSnackbar } from "notistack";
import { withStyles } from "@mui/styles";
import ApiCallFailed from "../../components/ApiCallFailed";
import Loading from "../../components/Loading";
import { getCsvHeaders } from "../../util/util";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../../util/constants";
import RefreshButton from "../../components/RefreshButton";
import ExportButton from "../../components/ExportButton";
import useWindowDimensions from "./../../hooks/useWindowDimensions";
import PageTable from "../../components/PageTable";

const columns = [
  {
    header: "Profile",
    key: "profile",
    width: 160,
    fixed: true,
  },
  {
    header: "Resource Type",
    key: "resourceType",
    width: 140,
  },
  {
    header: "Resource Name",
    key: "resourceName",
    width: 300,
  },
  {
    header: "Resource Limit",
    key: "limit",
    width: 170,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (limit) => (
      <Tag
        color={limit === "Unlimited" ? "green" : limit === "Default" ? "geekblue" : "volcano"}
        key={limit}
        style={{ width: "100%", textAlign: "center" }}
      >
        {limit}
      </Tag>
    ),
  },
];

const getDistinctProfiles = (data) => {
  if (!data) return null;
  let profiles = [];
  data.map((row) => row.profile && profiles.push(row.profile));
  return ["All", ...new Set(profiles)];
};

//-------------------------------------------------------------
//* STYLES START
//-------------------------------------------------------------
const styles = {
  root: {
    width: "100%",
  },
  tableTools: {
    position: "absolute",
    right: 0,
  },
  table: {
    marginTop: "10px",
  },
};

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const Profiles = ({ classes }) => {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();
  const profileList = getDistinctProfiles(data);
  const [profile, setProfile] = useState("All");
  const { baseUrl } = useContext(BackendAPIContext);
  const { enqueueSnackbar } = useSnackbar();
  const { height } = useWindowDimensions();
  const tableHeight = height - 207;

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/user/profiles`)
        .then(({ data }) => {
          setData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setData(null);
          setIsLoading(false);
          console.log(err);
        });
    }, API_FETCH_WAIT);
  };

  useEffect(() => {
    fetchData();
  }, [baseUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = () => {
    setIsLoading(true);
    fetchData();
    setPageLoad(false);
  };

  const handleProfileChange = (value) => {
    setProfile(value);
    setPageLoad(false);
  };

  const handleClear = () => {
    setProfile("All");
    setPageLoad(false);
  };

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;
  const filteredData = data.filter((row) => (profile === "All" ? true : row.profile === profile));
  //* display snackbar only one time on page load succeed
  if (!pageLoad) {
    setPageLoad(true);
    enqueueSnackbar(`${filteredData.length} records found.`, { variant: "info" });
  }

  return (
    <div className={classes.root}>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item label="Profile" style={{ width: 240 }}>
          <Select value={profile} onChange={handleProfileChange}>
            {profileList.map((profile) => (
              <Select.Option value={profile} key={profile}>
                {profile}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button onClick={handleClear}>
            <FcUndo size={22} />
          </Button>
        </Form.Item>
        <div className={classes.tableTools}>
          <Form.Item>
            <RefreshButton onClick={handleRefresh} />
            <ExportButton
              csvReport={{
                data: data,
                headers: getCsvHeaders(columns),
                filename: "OMS_Profiles.csv",
              }}
            />
          </Form.Item>
        </div>
      </Form>
      <div className={classes.table}>
        <PageTable height={tableHeight} columns={columns} data={filteredData} />
      </div>
    </div>
  );
};

export default withStyles(styles)(Profiles);
